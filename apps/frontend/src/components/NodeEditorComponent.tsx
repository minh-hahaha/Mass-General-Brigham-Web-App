import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import { ChangeEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import { myEdge, myNode } from 'common/src/classes/classes.ts';
import MGBButton from '@/elements/MGBButton.tsx';
import { createNode, deleteNode, getNodes, NodeResponse } from '@/database/getNode.ts';
import { createEdge, deleteEdge, EdgeResponse, getEdges } from '@/database/getEdges.ts';
import SelectElement from '@/elements/SelectElement.tsx';
import InputElement from '@/elements/InputElement.tsx';
import { ZoomIn } from 'lucide-react';
import ImportExportDirectoryPage from '@/routes/ImportExportDirectoryPage.tsx';
import { ROUTES } from 'common/src/constants.ts';
import TagFilterBox from '@/elements/TagFilterBox.tsx';
import {getDirectory} from "@/database/gettingDirectory.ts";

interface MapNode {
    node: myNode;
    attachedDepartments: string[];
    drawnNode: google.maps.Marker;
}

interface MapEdge {
    edge: myEdge;
    to: MapNode;
    from: MapNode;
    drawnEdge: google.maps.Polyline;
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
];

interface Props {
    currentFloorId: string;
}

const NodeEditorComponent = ({ currentFloorId }: Props) => {
    const map = useMap();
    const drawingLibrary = useMapsLibrary('drawing');
    let drawingManager: google.maps.drawing.DrawingManager;
    const [mode, setMode] = useState<'Node' | 'Edge'>('Node');
    const modeRef = useRef(mode);
    const [clickedNode, setClickedNode] = useState<string | null>(null);
    const clickedNodeRef = useRef(clickedNode);
    const [clickedEdge, setClickedEdge] = useState<number | null>(null);
    const clickedEdgeRef = useRef(clickedEdge);
    const [mapEdges, setMapEdges] = useState<MapEdge[]>([]);
    const mapEdgesRef = useRef(mapEdges);
    const [mapNodes, setMapNodes] = useState<MapNode[]>([]);
    const mapNodesRef = useRef(mapNodes);
    let tempNodeID = 0;
    let tempEdgeID = 100;

    const [currentBuilding, setCurrentBuilding] = useState<string>('');
    const [departmentOptions, setDepartmentOptions] = useState<{ deptName: string, deptId: number }[]>([]);
    const departmentOptionsRef = useRef(departmentOptions);
    const [tags, setTags] = useState<string[]>([]);

    const [canSave, setCanSave] = useState<boolean>(true);

    const [showImportModal, setShowImportModal] = useState(false);

    const handleOpenImport = () => setShowImportModal(true);
    const handleCloseImport = () => setShowImportModal(false);

    const nodeProps = {
        zIndex: 1,
        clickable: true,
        draggable: true,
        icon: {
            url: './minh ha icon.png',
            scaledSize: new google.maps.Size(60, 60),
        },
    };

    const edgeProps = {
        zIndex: 0,
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
        return tempNodeID++;
    }

    function incrementTempEdgeID(): number {
        return ++tempEdgeID;
    }

    const fetchDirectoryList = async () => {
        //console.log('Fetching directories');
        try {
            const data = await getDirectory(Number(currentBuilding));
            setDepartmentOptions(data.map(dir => ({ deptName: dir.deptName, deptId: dir.deptId })));
            //console.log("Finished")
        } catch (error) {
            console.error('Error fetching building names:', error);
        }
    };

    useEffect(() => {
        departmentOptionsRef.current = departmentOptions;
    }, [departmentOptions]);
    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);
    useEffect(() => {
        mapEdgesRef.current = mapEdges;
    }, [mapEdges]);
    useEffect(() => {
        mapNodesRef.current = mapNodes;
    }, [mapNodes]);
    useEffect(() => {
        clickedNodeRef.current = clickedNode;
    }, [clickedNode]);
    useEffect(() => {
        clickedEdgeRef.current = clickedEdge;
    }, [clickedEdge]);

    useEffect(() => {
        const currentNode = getCurrentNode();
        if(currentNode){
            const deptIds = tags.map(tag => departmentOptions.find(dept => dept.deptName === tag)?.deptId.toString());
            if(deptIds[0]){
                currentNode.attachedDepartments = deptIds as string[];
                //remove the set departments from any other nodes: one department has one node
                mapNodes.forEach(node => {
                    for(const tag of tags){
                        const deptId = departmentOptions.find(dept => dept.deptName === tag)?.deptId.toString();
                        if(deptId && node.node.nodeId !== currentNode.node.nodeId && node.attachedDepartments.includes(deptId)){
                            node.attachedDepartments = node.attachedDepartments.filter(t => t !== deptId);
                        }
                    }
                })
            }
        }
    }, [tags]);

    useEffect(() => {
        const currentNode = getCurrentNode();
        if(currentNode){
            //const deptNames = departmentOptionsRef.current.map(dept => currentNode.attachedDepartments.includes(dept.deptId.toString()) ? dept.deptName : '').filter(i => i !== '');
            const deptNames: string[] = [];
            for (const dept of departmentOptionsRef.current) {
                if(currentNode.attachedDepartments.includes(dept.deptId.toString())){
                    deptNames.push(dept.deptName);
                }
            }
            setTags(deptNames);
        }
    }, [clickedNode]);

    useEffect(() => {
        let isCancelled = false;

        console.log('Floor changed to:', currentFloorId);
        const bldgData = availableFloors.find((f) => f.id === currentFloorId);

        // Clear map visuals
        mapNodesRef.current.forEach((node) => node.drawnNode.setMap(null));
        mapEdgesRef.current.forEach((edge) => edge.drawnEdge.setMap(null));
        setMapEdges([]);
        setMapNodes([]);

        if (!bldgData) {
            console.error('Building data not found');
            return;
        }

        setCurrentBuilding(bldgData.buildingId);

        return () => {
            isCancelled = true;
        };
    }, [currentFloorId]);

    useEffect(() => {
        console.log("Swapping to building:", currentBuilding);
        if (!currentBuilding) return; // Skip if empty string
        let isCancelled = false;

        async function fetchDirectoryAndNodes() {
            try {
                await fetchDirectoryList();
                if (isCancelled) return;

                const bldgData = availableFloors.find((f) => f.id === currentFloorId);
                if (!bldgData) {
                    console.error('Building data not found');
                    return;
                }

                const nodeResponses = await getNodes(bldgData.floor, bldgData.buildingId);
                const newNodes: MapNode[] = nodeResponses.map(mapNodeFromNodeResponse);

                const edgeResponses = await getEdges(bldgData.floor, bldgData.buildingId);
                if (isCancelled || !edgeResponses) return;

                edgeResponses.forEach((edgeResponse) => {
                    const fromNode = newNodes.find((node) => node.node.nodeId === edgeResponse.from);
                    const toNode = newNodes.find((node) => node.node.nodeId === edgeResponse.to);
                    if (fromNode && toNode) {
                        createMapEdge(fromNode, toNode);
                    }
                });

                setMapNodes(newNodes);
            } catch (error) {
                console.error('Error fetching directory/nodes/edges:', error);
            }
        }
        //console.log("floor:", currentFloorId, "building:", currentBuilding);
        fetchDirectoryAndNodes();

        return () => {
            isCancelled = true;
        };
    }, [currentBuilding, currentFloorId]);



    // useEffect(() => {
    //     fetchDirectoryList();
    // }, [currentBuilding])


    useEffect(() => {
        if (!clickedNode) return;
        const currentNode = mapNodes.find((node) => node.node.nodeId === clickedNode);
        if (currentNode) {
            currentNode.node.nodeType = nodeType;
            currentNode.node.name = nodeName;
            currentNode.node.roomNumber = roomNumber !== '' ? roomNumber : null;
        }
    }, [nodeType, nodeName, roomNumber]);

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
                    mapNodeFromMarker(marker);
                }
            }
        );
    }, [map]);

    const getCurrentNode = () => {
        return mapNodes.find((node) => node.node.nodeId === clickedNode);
    }

    function createDrawnNode(position: google.maps.LatLng) {
        return new google.maps.Marker({
            ...nodeProps,
            position: position,
            map: map,
        });
    }

    // Creates the map node from a node response
    function mapNodeFromNodeResponse(node: NodeResponse) {
        //const deptNames = departmentOptionsRef.current.map(dept => node.departments.includes(dept.deptId.toString()) ? dept.deptName : '').filter(i => i !== '');
        const deptNames: string[] = [];
        for (const dept of departmentOptionsRef.current) {
            if(node.departments.includes(dept.deptId.toString())){
                deptNames.push(dept.deptId.toString());
            }
        }
        //console.log(departmentOptionsRef.current);
        //console.log("jsdawsfioj;asfgrvrknjdsfjkn;sAEFnjk");
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
            attachedDepartments: deptNames
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
            attachedDepartments: []
        };
        return createMapNode(mapNode);
    }

    // Creates a map node from a marker
    function mapNodeFromMarker(marker: google.maps.Marker) {
        const mapNode: MapNode = {
            node: new myNode(
                incrementTempNodeID().toString(),
                (marker.getPosition() as google.maps.LatLng).lat(),
                (marker.getPosition() as google.maps.LatLng).lng(),
                currentFloorId.charAt(currentFloorId.length - 1),
                '1',
                '1',
                'Node',
                null
            ),
            drawnNode: marker,
            attachedDepartments: []
        };
        return createMapNode(mapNode);
    }

    // Applies the proper event listeners to the MapNodes and adds them to the list of nodes
    function createMapNode(mapNode: MapNode): MapNode {
        google.maps.event.addListener(mapNode.drawnNode, 'click', (e: google.maps.MapMouseEvent) =>
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
        setMapNodes((prev) => [...prev, mapNode]);
        return mapNode;
    }

    function createMapEdge(startNode: MapNode, endNode: MapNode) {
        const startPos = startNode.drawnNode.getPosition();
        const endPos = endNode.drawnNode.getPosition();
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
        setMapEdges((prev) => [...prev, mapEdge]);
    }

    async function removeSelectedNode() {
        const selectedNode = mapNodes.find((node) => node.node.nodeId === clickedNode);
        if (selectedNode) {
            removeEdgesFromNode(selectedNode);
            selectedNode.drawnNode.setMap(null);
            setClickedNode(null);
            setMapNodes(mapNodes.filter((mapNode) => mapNode.node.nodeId !== clickedNode));
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
        setMapEdges(mapEdgesRef.current.filter((edge) => !toRemove.includes(edge.edge.edgeId)));
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
            if (fromNode && modeRef.current === 'Edge') {
                createMapEdge(fromNode, toNode);
                setClickedNode(null);
            }
        }
    }

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

        for (const node of mapNodes) {
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
        for (const edge of mapEdges) {
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

    useEffect(() => {
        if (!map) return;
        const listener = google.maps.event.addListener(
            map,
            'click',
            (e: google.maps.MapMouseEvent) => {
                if (modeRef.current === 'Node') {
                    setClickedNode(null);
                }
            }
        );
        return () => {
            google.maps.event.removeListener(listener);
        };
    }, [map]);

    const HospitalLocations: Record<string, { lat: number; lng: number; zoom: number }> = {
        'Chestnut Hill': { lat: 42.325988, lng: -71.149567, zoom: 18 },
        'Patriot Place': { lat: 42.092617, lng: -71.266492, zoom: 18 },
        'Faulkner Hospital': { lat: 42.301684739524546, lng: -71.12816396084828, zoom: 18 },
    };

    const loc = availableFloors.find((f) => f.id === currentFloorId)?.buildingName || null;
    const handleZoomToHospital = () => {
        if (!map || !loc) return;

        const hospitalLocation = HospitalLocations[loc];
        if (hospitalLocation) {
            map.panTo({ lat: hospitalLocation.lat, lng: hospitalLocation.lng });
            map.setZoom(hospitalLocation.zoom);
        }
    };

    return (
        <>
            <button
                onClick={handleZoomToHospital}
                className="absolute top-1/5 right-6 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                title="Zoom to hospital"
            >
                <ZoomIn size={26} className="text-mgbblue" />
            </button>
            <div
                hidden={clickedNode === null || mode === 'Edge'}
                className="absolute bottom-18 left-8 p-4 bg-white rounded-xl shadow-lg text-sm text-gray-800 max-w-sm space-y-1 z-10"
            >
                <h3 className="font-bold text-base mb-1 text-mgbblue">Node Data</h3>
                <div>
                    <p>
                        Node ID:{' '}
                        {mapNodes.find((node) => node.node.nodeId === clickedNode)?.node.nodeId}
                    </p>
                    <p>X: {mapNodes.find((node) => node.node.nodeId === clickedNode)?.node.x}</p>
                    <p>Y: {mapNodes.find((node) => node.node.nodeId === clickedNode)?.node.y}</p>
                    <p>
                        Floor:{' '}
                        {mapNodes.find((node) => node.node.nodeId === clickedNode)?.node.floor}
                    </p>
                    <p>
                        Building ID:{' '}
                        {mapNodes.find((node) => node.node.nodeId === clickedNode)?.node.buildingId}
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
                    options={departmentOptions.map(opt => opt.deptName)}
                ></TagFilterBox>
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
                        children={'Edit Nodes'}
                        variant={mode === 'Node' ? 'secondary' : 'primary'}
                        disabled={mode === 'Node'}
                    ></MGBButton>
                </div>
                <div>
                    <MGBButton
                        onClick={() => {
                            setMode('Edge');
                            setClickedNode(null);
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
                        <div className="h-full overflow-y-auto p-6 -mt-22">
                            <ImportExportDirectoryPage
                                jsonRoute={ROUTES.NODE_EDGE_JSON}
                                csvRoute={ROUTES.NODE_EDGE_CSV}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NodeEditorComponent;