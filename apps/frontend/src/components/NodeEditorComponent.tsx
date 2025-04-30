import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import {RefObject, useEffect, useRef, useState} from 'react';
import { myEdge, myNode } from 'common/src/classes/classes.ts';
import MGBButton from '@/elements/MGBButton.tsx';
import { createNode, getNodes, NodeResponse } from '@/database/getNode.ts';
import { createEdge, EdgeResponse, getEdges } from '@/database/getEdges.ts';
import SelectElement from '@/elements/SelectElement.tsx';
import InputElement from '@/elements/InputElement.tsx';
import { ZoomIn } from 'lucide-react';
import ImportExportDirectoryPage from '@/routes/ImportExportDirectoryPage.tsx';
import { ROUTES } from 'common/src/constants.ts';
import TagFilterBox from '@/elements/TagFilterBox.tsx';
import {getDirectory} from "@/database/gettingDirectory.ts";
import {GetNode} from "@/database/getDepartmentNode.ts";
import FloorSelector from "@/components/FloorSelector.tsx";
import MapInstructions from "@/components/MapInstructions.tsx";
import { FaRegQuestionCircle } from "react-icons/fa";


// A container for a Node on the map
interface MapNode {
    node: myNode; // The actual node that goes in the database
    attachedDepartments: string[]; // The departments that are attached to the node
    drawnNode: google.maps.marker.AdvancedMarkerElement; // The marker that is shown on the map
    destinationElevator: string | null; // If the node is an elevator, this represents the elevator it goes to
}

// A container for an Edge on the map
interface MapEdge {
    edge: myEdge; // The actual edge that goes in the database
    to: MapNode; // The node that the edge points to
    from: MapNode; // The node that the edge originates from
    drawnEdge: google.maps.Polyline; // The line that is shown on the map
}

// floor type
interface Floor {
    id: string;
    floor: string;
    buildingId: string;
    buildingName: string; // for display
    svgPath: string;
}

// All available floors across buildings
const availableFloors: Floor[] = [
    // Chestnut Hill
    {
        id: 'CH-1',
        floor: '1',
        buildingId: '1',
        buildingName: 'Chestnut Hill',
        svgPath: '/CH01.svg',
    },
    // 20 Patriot Place
    {
        id: 'PP-1',
        floor: '1',
        buildingId: '2',
        buildingName: 'Patriot Place',
        svgPath: '/PP01.svg',
    },
    {
        id: 'PP-2',
        floor: '2',
        buildingId: '2',
        buildingName: 'Patriot Place',
        svgPath: '/PP02.svg',
    },
    {
        id: 'PP-3',
        floor: '3',
        buildingId: '2',
        buildingName: 'Patriot Place',
        svgPath: '/PP03.svg',
    },
    {
        id: 'PP-4',
        floor: '4',
        buildingId: '2',
        buildingName: 'Patriot Place',
        svgPath: '/PP04.svg',
    },

    {
        id: 'FK-1',
        floor: '1',
        buildingId: '3',
        buildingName: 'Faulkner Hospital',
        svgPath: '/FK01.svg',
    },
    {
        id: 'BWH-2',
        floor: '2',
        buildingId: '4',
        buildingName: 'Main Hospital',
        svgPath: '/BWH02.svg',
    },
];

interface Props {
    updateFloor: (floorId: string) => void;
}

const NodeEditorComponent = ({updateFloor}: Props) => {
    const map = useMap();
    const drawingLibrary = useMapsLibrary('drawing');
    let drawingManager: google.maps.drawing.DrawingManager;
    // The drawing mode, either node(editing node values) or edge (drawing edges between nodes)
    const [mode, setMode] = useState<'Node' | 'Edge'>('Node');
    const modeRef = useRef(mode);
    // Stores the ID of the node that was most recently clicked on
    const [clickedNode, setClickedNode] = useState<string | null>(null);
    const clickedNodeRef = useRef(clickedNode);
    // Stores the ID of the node that was most recently clicked on
    const [clickedEdge, setClickedEdge] = useState<number | null>(null);
    const clickedEdgeRef = useRef(clickedEdge);
    // A list of all the edges in the specified building and floor
    const mapEdgesRef = useRef<MapEdge[]>([]);
    // A list of all the nodes in the specified building and floor
    const mapNodesRef = useRef<MapNode[]>([]);
    // Temporary IDs for nodes and edges until they are given real ones when saved
    const tempNodeIdRef = useRef(0);
    const tempEdgeIdRef = useRef(0);

    // The current building we are looking at
    const [currentBuilding, setCurrentBuilding] = useState<string>('');
    // The available departments for the current building and floor
    const [departmentOptions, setDepartmentOptions] = useState<{ deptName: string, deptId: number }[]>([]);
    const departmentOptionsRef = useRef(departmentOptions);
    // The list of departments the currently clicked node belongs to
    const [tags, setTags] = useState<string[]>([]);

    // Determines if the saveNodesAndEdges button is clickable
    const [canSave, setCanSave] = useState<boolean>(true);

    // Determines if the import/export popup is displayed
    const [showImportModal, setShowImportModal] = useState(false);

    // Determines if the instructions are displayed
    const [instructionVisible, setInstructionVisible] = useState(false);

    // Handles opening and closing the import/export popup
    const handleOpenImport = () => setShowImportModal(true);
    const handleCloseImport = () => setShowImportModal(false);

    // Handles showing and hiding instructions
    const handleShowInstructions = () => setInstructionVisible(true);
    const handleHideInstructions = () => setInstructionVisible(false);

    // This to make sure we don't double up on nodes when rendering nodes and edges
    const lastFloor = useRef<string>('');
    // This will hold the nodeID of the elevator the node is connected to
    const [destinationElevator, setDestinationElevator] = useState<string>('');

    // Current Floor/building
    const [currentFloorId, setCurrentFloorId] = useState<string>('');

    // For Hospital Selector
    const [selectedHospital, setSelectedHospital] = useState<typeof hospitals[0] | null >(null);
    const hospitals = [
        {
            id: 1,
            name: 'Chestnut Hill Healthcare Center',
            address: '850 Boylston Street, Chestnut Hill, MA 02467',
            defaultParking: {lat: 42.326350183802454, lng: -71.14988541411569},
            noneParking:{lat: 42.32629762650177, lng: -71.14951386955477},
            phoneNumber: '(800) 294-9999',
            hours: 'Mon-Fri: 8:00 AM - 5:30 PM',
            image:'/HospitalCards/ChestnutHillCard.jpg',
            description: 'Very Cool Chestnut Hill Hospital',
            coordinates: {lat: 42.325988, lng: -71.149567, zoom: 18},
        },
        {
            id: 2,
            name: 'Foxborough Health Care Center',
            address: '20-22 Patriot Place, Foxborough, MA 02035',
            defaultParking: {lat: 42.09222126540862, lng: -71.26646379537021},
            noneParking:{lat: 42.09250362335946, lng: -71.26652247380247},
            phoneNumber: '(508) 718-4000',
            hours: 'Mon-Sat: 8:00 AM - 8:00 PM',
            image:'/HospitalCards/PatriotPlaceCard.jpg',
            description: 'Very Cool Patriot Place',
            coordinates: {lat: 42.092617, lng: -71.266492, zoom: 18},
        },
        {
            id: 3,
            name: 'Brigham and Women\'s Faulkner Hospital',
            address: '1153 Centre St, Jamaica Plain, MA 02130',
            defaultParking: {lat: 42.30110395876755, lng: -71.12754584282733},
            noneParking: {lat: 1, lng: 1},
            phoneNumber: '(617) 983-7000',
            hours: 'Open 24 hours',
            image:'/HospitalCards/FaulknerHospitalCard.jpg',
            description: 'Very Cool Faulkner Hospital',
            coordinates: {lat: 42.301684739524546, lng: -71.12816396084828, zoom: 18},
        },
        {
            id: 4,
            name: 'Brigham and Women\'s Main Hospital',
            address: '75 Francis St, Boston, MA 02115',
            defaultParking: {lat: 42.33597732454244, lng: -71.10722288414479},
            noneParking: {lat: 1, lng: 1},
            phoneNumber: '(617) 732-5500',
            hours: 'Open 24 hours',
            image:'/HospitalCards/MGBMainCard.jpeg',
            description: 'Very Cool Main Hospital',
            coordinates: {lat: 42.33629683337891, lng: -71.1067533432466, zoom: 18},
        }
    ]

    // Properties for the drawn nodes (AdvancedMarkers)
    const nodeProps = {
        zIndex: 1,
        gmpClickable: true,
        gmpDraggable: true,
    };

    // Properties for the drawn edges (Polylines)
    const edgeProps = {
        zIndex: 0,
        clickable: true,
        strokeColor: '#000000',
        strokeWeight: 5
    };
    // Properties for the drawn edges (Polylines) when selected
    const selectedEdgeProps = {
        ...edgeProps,
        strokeColor: '#ff0000',
    };

    // Node Property Use States
    type NodeType =
        | 'Stairs'
        | 'Elevator'
        | 'Room'
        | 'Hallway'
        | 'Parking Lot'
        | 'Road'
        | 'Door'
        | 'Hallway Intersection';
    const [nodeType, setNodeType] = useState<NodeType>('Stairs');
    const [roomNumber, setRoomNumber] = useState<string | null>(null);
    const [nodeName, setNodeName] = useState<string>('Node');

    function incrementTempNodeID(): number {
        return tempNodeIdRef.current++;
    }

    function incrementTempEdgeID(): number {
        return tempEdgeIdRef.current++; // prev ++tempEdgeIdRef.current
    }

    const fetchDirectoryList = async () => {
        try {
            const data = await getDirectory(Number(currentBuilding));
            setDepartmentOptions(data.map(dir => ({ deptName: dir.deptName, deptId: dir.deptId })));
        } catch (error) {
            console.error('Error fetching building names:', error);
        }
    };

    const fetchElevators = async (buildingProps: Floor) => {
        const elevators = await getNodes(buildingProps.floor, buildingProps.buildingId, 'Elevator');
        //console.log(elevators);
    }

    // Sync useRefs and useStates
    useEffect(() => {
        departmentOptionsRef.current = departmentOptions;
        modeRef.current = mode;
        clickedNodeRef.current = clickedNode;
        clickedEdgeRef.current = clickedEdge;
    }, [departmentOptions, mode, clickedNode, clickedEdge]);

    /*
    TODO:
        1. Load Nodes and Edges based on the current floor DONE
        2. Load the directory information for the current floor DONE
        3. Apply tags to the currently selected node when the user adds a tag to it DONE
        4. Apply new node properties to the currently selected node when they are entered into the input box DONE
     */

    const getBuildingPropsByFloor = () => {
        return availableFloors.find(floor => floor.id === currentFloorId);
    }

    const getBuildingPropsById = (buildingID: number) => {
        return availableFloors.find(floor => floor.buildingId === buildingID.toString());
    }

    const fetchNodeEdgeData = async (buildingProps: Floor) => {
        const nodeData = await getNodes(buildingProps.floor, buildingProps.buildingId, 'all'); //TODO: if there are problems check this
        const newNodes = [];
        for(const node of nodeData) {
            newNodes.push(mapNodeFromNodeResponse(node));
        }
        const edgeData = await getEdges(buildingProps.floor, buildingProps.buildingId);
        for(const edge of edgeData) {
            const fromNode = newNodes.find(node => node.node.nodeId === edge.from);
            const toNode = newNodes.find(node => node.node.nodeId === edge.to);
            if(fromNode && toNode) {
                createMapEdge(fromNode, toNode);
            }
        }
        mapNodesRef.current = newNodes;
    }

    //TODO: Find a better way to handle elevators
    /*
        Something like if elevator type is selected, create another field to select a destination elevator
        Then elevators can be deleted and re-added. May or may not need special handling --
        the edges will be across floors so need to make sure that edge is deleted (should be handled)
        ** Should query a list of elevators to choose from
        What happens if an elevator is not assigned a destination? Can probably just be handled as a regular node
     */
    const fetchAvailableDepartments = async (buildingProps: Floor) => {
        let building = Number(buildingProps.buildingId);
        if(buildingProps.buildingName === "Patriot Place"){
            building = 2;
        }else if(buildingProps.buildingName === "Faulkner Hospital"){
            building = 4;
        }
        const departments = await getDirectory(building);
        console.log("before depts:",departments);
        // This is because the directory counts the two PP bldgs separately as ids 2 and 3 with other buildings being 4 and beyond
        if(building === 2){
            departments.concat(await getDirectory(3));
            console.log("depts:",departments);
        }
        setDepartmentOptions(departments.map(dept => ({deptName: dept.deptName, deptId: dept.deptId})));
    }

    // Load the Nodes and Edges on floor/building change
    useEffect(() => {

        if(lastFloor.current === currentFloorId) return;
        lastFloor.current = currentFloorId;

        // Get the building properties
        const buildingProps = getBuildingPropsByFloor();
        if(!buildingProps) return;

        // Clear any previous nodes and edges (do a re-render so it is synced when we add new nodes)
        mapNodesRef.current.forEach(node => {
            node.drawnNode.map = null;
            google.maps.event.clearListeners(node.drawnNode, 'click');
            google.maps.event.clearListeners(node.drawnNode, 'drag');
        });
        mapEdgesRef.current.forEach(edge => {
            edge.drawnEdge.setMap(null);
            google.maps.event.clearListeners(edge.drawnEdge, 'click');
        });
        setDepartmentOptions([]);
        mapNodesRef.current = [];
        mapEdgesRef.current = [];

        // Get the nodes and edges for this building and floor
        fetchAvailableDepartments(buildingProps).then(() => fetchNodeEdgeData(buildingProps)).then(() => fetchElevators(buildingProps))
    }, [currentFloorId]);

    useEffect(() => {
        if (!clickedNode) return;
        const currentNode = mapNodesRef.current.find((node) => node.node.nodeId === clickedNode);
        if (currentNode) {
            currentNode.node.nodeType = nodeType;
            currentNode.node.name = nodeName;
            currentNode.node.roomNumber = roomNumber !== '' ? roomNumber : null;
            const tagIds = tags.map(tag => departmentOptionsRef.current.find(dept => dept.deptName === tag)?.deptId.toString());
            if(tagIds[0]){
                currentNode.attachedDepartments = tagIds as string[];
                // Remove the set departments from any other nodes (no duplicates)
                mapNodesRef.current.forEach(node => {
                    for(const tag of tags){
                        const deptId = departmentOptions.find(dept => dept.deptName === tag)?.deptId.toString();
                        if(deptId && node.node.nodeId !== currentNode.node.nodeId && node.attachedDepartments.includes(deptId)){
                            node.attachedDepartments = node.attachedDepartments.filter(t => t !== deptId);
                        }
                    }
                })
            }
        }
    }, [nodeType, nodeName, roomNumber, tags]);

    // Handles creating the drawing manager
    useEffect(() => {
        if (!map || !drawingLibrary || drawingManager) return;
        drawingManager = new drawingLibrary.DrawingManager({
            drawingMode: null,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                    drawingLibrary.OverlayType.MARKER,
                    drawingLibrary.OverlayType.POLYLINE,
                ],
            },
            markerOptions: nodeProps,
            polylineOptions: edgeProps,
        });
        drawingManager.setMap(map);
        // Handles the drawing and creation of new nodes and edges from drawing on the map
        google.maps.event.addListener(
            drawingManager,
            'overlaycomplete',
            (event: google.maps.drawing.OverlayCompleteEvent) => {
                if (event.type === google.maps.drawing.OverlayType.POLYLINE) {
                    const polyline = event.overlay as google.maps.Polyline;
                    const path = polyline.getPath().getArray();
                    const nodes = [];
                    for (let i = 0; i < path.length; i++) {
                        nodes.push(mapNodeFromPosition(path[i]));
                        if (i !== 0) {
                            createMapEdge(nodes[i - 1], nodes[i]);
                        }
                    }
                    polyline.setMap(null);
                    drawingManager.setDrawingMode(null);
                } else if (event.type === google.maps.drawing.OverlayType.MARKER) {
                    const marker = event.overlay as google.maps.Marker;
                    if (!marker) return;
                    mapNodeFromPosition(marker.getPosition() as google.maps.LatLng);
                    marker.setMap(null);
                }
            }
        );
        // Handle de-selecting any nodes or edges when clicking on the map
        google.maps.event.addListener(
            map,
            'click',
            () => {
                if (modeRef.current === 'Node') {
                    setClickedNode(null);
                    resetEdge();
                }
            }
        );
    }, [map]);

    /********************** NODES ************************/

    const getCurrentNode = () => {
        return mapNodesRef.current.find((node) => node.node.nodeId === clickedNode);
    }

    function createDrawnNode(position: google.maps.LatLng) {
        return new google.maps.marker.AdvancedMarkerElement({
            ...nodeProps,
            position: position,
            map: map,
        });
    }

    // Creates the map node from a node response
    function mapNodeFromNodeResponse(node: NodeResponse) {
        const mapNode: MapNode = {
            node: new myNode(
                node.nodeId,
                node.x,
                node.y,
                node.floor,
                node.nodeType,
                node.buildingId,
                node.name,
                node.roomNumber
            ),
            drawnNode: createDrawnNode(new google.maps.LatLng(node.x, node.y)),
            attachedDepartments: node.departments,
            destinationElevator: null //TODO: this should not be null if the loaded node is an elevator this will get complicated :( probably set it when adding edges
        };
        return createMapNode(mapNode);
    }

    // Creates a map node from a position
    function mapNodeFromPosition(position: google.maps.LatLng) {
        const mapNode: MapNode = {
            node: new myNode(
                incrementTempNodeID().toString(),
                position.lat(),
                position.lng(),
                currentFloorId.charAt(currentFloorId.length - 1),
                '1',
                '1',
                'Node',
                null
            ),
            drawnNode: createDrawnNode(position),
            attachedDepartments: [],
            destinationElevator: null
        };
        return createMapNode(mapNode);
    }

    // Applies the proper event listeners to the MapNodes and adds them to the list of nodes
    function createMapNode(mapNode: MapNode): MapNode {
        google.maps.event.addListener(mapNode.drawnNode, 'click', () =>
            clickNode(mapNode.node.nodeId)
        );
        google.maps.event.addListener(mapNode.drawnNode, 'drag', (e: google.maps.MapMouseEvent) => {
            const loc = e.latLng;
            if (loc) {
                mapEdgesRef.current.forEach((edge) => {
                    if (
                        edge.from.node.nodeId === mapNode.node.nodeId ||
                        edge.to.node.nodeId === mapNode.node.nodeId
                    ) {
                        const tempLoc: google.maps.LatLngLiteral = {
                            lat: mapNode.node.x,
                            lng: mapNode.node.y,
                        };
                        const EPSILON = 1e-6;
                        const indexOfPathCoord = edge.drawnEdge
                            .getPath()
                            .getArray()
                            .findIndex(
                                (ll) =>
                                    Math.abs(ll.lat() - tempLoc.lat) < EPSILON &&
                                    Math.abs(ll.lng() - tempLoc.lng) < EPSILON
                            );
                        if (indexOfPathCoord !== -1) {
                            edge.drawnEdge.getPath().setAt(indexOfPathCoord, loc);
                        }
                    }
                });
                mapNode.node.x = loc.lat();
                mapNode.node.y = loc.lng();
            }
        });
        mapNodesRef.current = [...mapNodesRef.current, mapNode]
        return mapNode;
    }

    async function removeSelectedNode() {
        const selectedNode = mapNodesRef.current.find((node) => node.node.nodeId === clickedNode);
        if (selectedNode) {
            removeEdgesFromNode(selectedNode);
            selectedNode.drawnNode.map = null;
            mapNodesRef.current = mapNodesRef.current.filter((mapNode) => mapNode.node.nodeId !== clickedNode);
            setClickedNode(null);
        }
    }

    function clickNode(nodeId: string) {
        const toNode = mapNodesRef.current.find((node) => node.node.nodeId === nodeId);
        const fromNode = mapNodesRef.current.find(
            (node) => node.node.nodeId === clickedNodeRef.current
        );
        if (toNode) {
            setClickedNode(nodeId);
            setNodeType(toNode.node.nodeType as NodeType);
            setNodeName(toNode.node.name);
            setRoomNumber(toNode.node.roomNumber);
            const tags = toNode.attachedDepartments.map(id => departmentOptionsRef.current.find(deptId => deptId.deptId.toString() === id)?.deptName);
            if(tags[0]) {
                setTags(tags as string[]);
            }else{
                setTags([]);
            }
            if (fromNode && modeRef.current === 'Edge') {
                createMapEdge(fromNode, toNode);
                setClickedNode(null);
            }
        }
    }

    /********************** EDGES ************************/

    function createMapEdge(startNode: MapNode, endNode: MapNode) {
        const startPos = startNode.drawnNode.position as google.maps.LatLng;
        const endPos = endNode.drawnNode.position as google.maps.LatLng;
        if (!startPos || !endPos) {
            return;
        }
        if (startPos.equals(endPos)) {
            return;
        }
        if (
            mapEdgesRef.current.find(
                (edge) =>
                    (edge.edge.to.nodeId === startNode.node.nodeId &&
                        edge.edge.from.nodeId === endNode.node.nodeId) ||
                    (edge.edge.to.nodeId === endNode.node.nodeId &&
                        edge.edge.from.nodeId === startNode.node.nodeId)
            )
        ) {
            return;
        }
        const mapEdge: MapEdge = {
            edge: new myEdge(incrementTempEdgeID(), startNode.node, endNode.node),
            to: endNode,
            from: startNode,
            drawnEdge: new google.maps.Polyline({
                ...edgeProps,
                map: map,
                path: [startPos, endPos],
            }),
        };
        google.maps.event.addListener(mapEdge.drawnEdge, 'click', () => {
                if (modeRef.current === 'Node') {
                    clickEdge(mapEdge.edge.edgeId)
                }
            }
        );
        mapEdgesRef.current = [...mapEdgesRef.current, mapEdge];
    }

    function clickEdge(edgeId: number){
        const toBeSelectedEdge = mapEdgesRef.current.find((edge) => edge.edge.edgeId === edgeId);
        const currentSelectedEdge = mapEdgesRef.current.find((edge) => edge.edge.edgeId === clickedEdgeRef.current);
        if (toBeSelectedEdge) {
            if(currentSelectedEdge){
                currentSelectedEdge.drawnEdge.setOptions(edgeProps);
            }
            toBeSelectedEdge.drawnEdge.setOptions(selectedEdgeProps);
            setClickedEdge(edgeId);
        }
    }

    function resetEdge(){
        const currentSelectedEdge = mapEdgesRef.current.find((edge) => edge.edge.edgeId === clickedEdgeRef.current);
        if(currentSelectedEdge){
            currentSelectedEdge.drawnEdge.setOptions(edgeProps);
            setClickedEdge(null);
        }
    }

    async function removeEdge(){
        const selectedEdge = mapEdgesRef.current.find((edge) => edge.edge.edgeId === clickedEdge);
        if (selectedEdge) {
            selectedEdge.drawnEdge.setMap(null);
            mapEdgesRef.current = mapEdgesRef.current.filter((mapEdge) => mapEdge.edge.edgeId !== clickedEdge);
            setClickedEdge(null);
        }
    }

    function removeEdgesFromNode(node: MapNode) {
        const toRemove: number[] = [];
        mapEdgesRef.current.forEach((edge) => {
            if (
                edge.from.node.nodeId === node.node.nodeId ||
                edge.to.node.nodeId === node.node.nodeId
            ) {
                edge.drawnEdge.setMap(null);
                toRemove.push(edge.edge.edgeId);
            }
        });
        mapEdgesRef.current = mapEdgesRef.current.filter((edge) => !toRemove.includes(edge.edge.edgeId));
    }

    /********************** SAVING ************************/

    const generateCustomId = (node: myNode) => {
        const floorPart = 'Floor' + currentFloorId.charAt(currentFloorId.length - 1);
        const typePart = node.nodeType.charAt(0).toUpperCase() + node.nodeType.slice(1);
        const roomPart = node.roomNumber || '';
        return `${currentFloorId.substring(0, 2)}${floorPart}${typePart}${roomPart}`;
    };

    async function saveNodesAndEdges() {
        setCanSave(false);
        const nodes: NodeResponse[] = [];
        const usedNodeIds = new Set<string>();
        const currentFloor = availableFloors.find((f) => f.id === currentFloorId);

        for (const node of mapNodesRef.current) {
            const baseId = generateCustomId(node.node);
            let newId = baseId;
            let suffix = 1;

            // Ensure uniqueness
            while (usedNodeIds.has(newId)) {
                newId = `${baseId}_${suffix++}`;
            }

            node.node.nodeId = newId;
            node.node.floor = currentFloorId.charAt(currentFloorId.length - 1);
            node.node.buildingId = currentFloor ? currentFloor.buildingId : '1';
            usedNodeIds.add(newId);
            const sendNode: NodeResponse = {
                nodeId: node.node.nodeId,
                x: node.node.x,
                y: node.node.y,
                floor: node.node.floor,
                buildingId: node.node.buildingId,
                nodeType: node.node.nodeType,
                name: node.node.name,
                roomNumber: node.node.roomNumber,
                departments: node.attachedDepartments,
            };
            nodes.push(sendNode);
        }
        await createNode(
            nodes,
            true,
            currentFloor ? currentFloor.floor : '1',
            currentFloor ? currentFloor.buildingId : '1'
        );
        for (const edge of mapEdgesRef.current) {
            const sendEdge: EdgeResponse = {
                edgeId: null, // Let the database auto generate edge ids
                to: edge.edge.to.nodeId,
                from: edge.edge.from.nodeId,
            };
            await createEdge(sendEdge);
        }
        setCanSave(true);
        setClickedNode(null);
    }

    const HospitalLocations: Record<string, { lat: number; lng: number; zoom: number }> = {
        'Chestnut Hill': { lat: 42.325988, lng: -71.149567, zoom: 18 },
        'Patriot Place': { lat: 42.092617, lng: -71.266492, zoom: 18 },
        'Faulkner Hospital': { lat: 42.301684739524546, lng: -71.12816396084828, zoom: 18 },
        'Main Hospital': {lat: 42.33568522412911, lng: -71.10787475448217, zoom: 18}

    };

    const onHospitalSelect = (hospitalId: number) => {
        const buildingProps = getBuildingPropsById(hospitalId);
        if(buildingProps && map){
            const hospitalLocation = HospitalLocations[buildingProps.buildingName];
            if (hospitalLocation) {
                map.panTo({ lat: hospitalLocation.lat, lng: hospitalLocation.lng });
                map.setZoom(hospitalLocation.zoom);
                setCurrentFloorId(buildingProps.id);
            }
        }
    }
    // Handle Select Hospital
    const handleHospitalSelect = (hospital: typeof hospitals[0]) => {
        setSelectedHospital(hospital);
        onHospitalSelect(hospital.id)
    }

    const renderHospitalSelection = () => {
        return (
            <div className='w-full'>
            <h2 className='text-xl font-black mb-6 text-center'>Select a Hospital</h2>
            <div className='space-y-4 mt-4'>
                {hospitals.map(hospital => (
                    <div
                        key={hospital.id}
                        onClick={() => handleHospitalSelect(hospital)}
                        className="relative cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div
                            className="h-20 bg-cover bg-center"
                             style={{backgroundImage: `url(${hospital.image || '/api/placeholder/400/320'})`}}
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                                <h3 className="text-white font-bold text-lg">{hospital.name}</h3>
                                {/*<p className="text-white/90 text-sm">{hospital.address}</p>*/}
                            </div>
                        </div>

                     </div>
                ))}
            </div>
        </div>)
    };

    return (
        <>
            <div
                className={
                    'absolute top-4 left-8 p-4 bg-white rounded-xl shadow-lg text-sm text-gray-800 max-w-sm space-y-1 z-10 w-1/2'
                }
                hidden={clickedNode !== null || clickedEdge !== null}
            >
                {renderHospitalSelection()}
            </div>
            <div
                className={
                    'absolute top-8 left-108 bg-white rounded-xl shadow-lg text-sm text-gray-800 max-w-sm space-y-1 z-10 '
                }
                hidden={
                    (clickedNode !== null || clickedEdge !== null) || selectedHospital?.id !== 2
                }
            >
                <FloorSelector
                    currentFloorId={currentFloorId}
                    onChange={(id) => {setCurrentFloorId(id); updateFloor(id);}}
                    />
            </div>
            <div
                hidden={clickedNode === null || mode === 'Edge'}
                className="absolute bottom-18 left-8 p-4 bg-white rounded-xl shadow-lg text-sm text-gray-800 max-w-sm space-y-1 z-10"
            >
                <h3 className="font-bold text-base mb-1 text-mgbblue">Node Data</h3>
                <div>
                    <p>
                        Node ID:{' '}
                        {
                            mapNodesRef.current.find((node) => node.node.nodeId === clickedNode)
                                ?.node.nodeId
                        }
                    </p>
                    <p>
                        X:{' '}
                        {
                            mapNodesRef.current.find((node) => node.node.nodeId === clickedNode)
                                ?.node.x
                        }
                    </p>
                    <p>
                        Y:{' '}
                        {
                            mapNodesRef.current.find((node) => node.node.nodeId === clickedNode)
                                ?.node.y
                        }
                    </p>
                    <p>
                        Floor:{' '}
                        {
                            mapNodesRef.current.find((node) => node.node.nodeId === clickedNode)
                                ?.node.floor
                        }
                    </p>
                    <p>
                        Building ID:{' '}
                        {
                            mapNodesRef.current.find((node) => node.node.nodeId === clickedNode)
                                ?.node.buildingId
                        }
                    </p>
                </div>

                <SelectElement
                    label={'Select Node Type'}
                    id={'nodeType'}
                    value={nodeType}
                    placeholder={'Select Node Type'}
                    onChange={(e) => setNodeType(e.target.value as NodeType)}
                    options={[
                        'Stairs',
                        'Elevator',
                        'Room',
                        'Hallway',
                        'Parking Lot',
                        'Road',
                        'Door',
                        'Hallway Intersection',
                    ]}
                ></SelectElement>
                <InputElement
                    label={'Node Name'}
                    type={'text'}
                    id={'nodeName'}
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                ></InputElement>
                <div>
                    <InputElement
                        label={'Room Number'}
                        type={'text'}
                        id={'roomNum'}
                        value={roomNumber ? roomNumber : ''}
                        onChange={(e) => setRoomNumber(e.target.value)}
                    ></InputElement>
                </div>
                <div hidden={nodeType !== 'Elevator'}>
                    <SelectElement
                        label={'Select Destination Elevator'}
                        id={'destinationElevator'}
                        value={destinationElevator}
                        placeholder={'Select Destination Elevator'}
                        onChange={(e) => setDestinationElevator(e.target.value)}
                        options={[
                            'Elevator A',
                            'Elevator B',
                            'Elevator C',
                            'Elevator D',
                            'Elevator E',
                            'Elevator F',
                            'Elevator G',
                            'Elevator H',
                        ]}
                    ></SelectElement>
                </div>
                <MGBButton
                    onClick={() => removeSelectedNode()}
                    children={'Delete Node'}
                    variant={'primary'}
                    disabled={false}
                ></MGBButton>
                <h3 className="font-bold text-base mb-1 text-mgbblue">Set Departments</h3>
                <TagFilterBox
                    selectTitle={'Select a Department'}
                    tags={tags}
                    setTags={setTags}
                    options={departmentOptions.map((opt) => opt.deptName)}
                ></TagFilterBox>
            </div>

            <div
                hidden={clickedEdge === null || mode === 'Edge'}
                className="absolute bottom-18 left-8 p-4 bg-white rounded-xl shadow-lg text-sm text-gray-800 max-w-sm space-y-1 z-10"
            >
                <h3 className="font-bold text-base mb-1 text-mgbblue">Edge</h3>
                <MGBButton
                    onClick={() => removeEdge()}
                    children={'Delete Edge'}
                    variant={'primary'}
                    disabled={false}
                ></MGBButton>
            </div>
            <div
                className={
                    'absolute bottom-18 right-16 p-4 bg-white rounded-xl shadow-lg text-sm text-gray-800 max-w-sm space-y-1 z-10'
                }
            >
                <div>
                    <MGBButton
                        onClick={() => {
                            setMode('Node');
                            setClickedNode(null);
                        }}
                        children={'Edit Nodes and Edges'}
                        variant={mode === 'Node' ? 'secondary' : 'primary'}
                        disabled={mode === 'Node'}
                    ></MGBButton>
                </div>
                <div>
                    <MGBButton
                        onClick={() => {
                            setMode('Edge');
                            setClickedNode(null);
                            resetEdge();
                        }}
                        children={'Create Edges'}
                        variant={mode === 'Edge' ? 'secondary' : 'primary'}
                        disabled={mode === 'Edge'}
                    ></MGBButton>
                </div>
                <div>
                    <MGBButton
                        onClick={() => saveNodesAndEdges()}
                        children={'Save Nodes and Edges'}
                        variant={canSave ? 'primary' : 'secondary'}
                        disabled={!canSave}
                    ></MGBButton>
                </div>
                <div>
                    <MGBButton
                        onClick={() => handleOpenImport()}
                        children={'Import Export Nodes and Edges'}
                        variant={'primary'}
                        disabled={false}
                    ></MGBButton>
                </div>
                <div>
                    <MGBButton
                        onClick={() => setInstructionVisible(true)}
                        variant={'primary'}
                        disabled={false}
                    >
                        <div className="flex items-center gap-2">
                            <span>Help</span>
                            <FaRegQuestionCircle size={18} />
                        </div>
                    </MGBButton>
                </div>
            </div>
            {showImportModal && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
                    onClick={handleCloseImport}
                >
                    <div
                        className="absolute top-20 bg-white rounded-lg shadow-xl w-150 max-w-4xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleCloseImport}
                            className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl"
                        >
                            &times;
                        </button>
                        <div className="mt-4">
                            <h1 className="text-center font-black">
                                Import/Export New Nodes and Edges
                            </h1>
                        </div>
                        <div className="h-60 overflow-y-auto">
                            <ImportExportDirectoryPage
                                jsonRoute={ROUTES.NODE_EDGE_JSON}
                                csvRoute={ROUTES.NODE_EDGE_CSV}
                            />
                        </div>
                    </div>
                </div>
            )}
            {instructionVisible && (
                <div className="fixed inset-0 z-50">
                    <MapInstructions onClose={() => handleHideInstructions()} />
                </div>
            )}
        </>
    );
};

export default NodeEditorComponent;