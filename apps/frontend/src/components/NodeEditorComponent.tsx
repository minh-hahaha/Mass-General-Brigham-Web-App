import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { myEdge, myNode } from 'common/src/classes/classes.ts';
import MGBButton from '@/elements/MGBButton.tsx';
import {createNode, deleteNode, getNodes, NodeResponse} from '@/database/getNode.ts';
import {createEdge, deleteEdge, EdgeResponse, getEdges} from '@/database/getEdges.ts';
import SelectElement from '@/elements/SelectElement.tsx';
import InputElement from "@/elements/InputElement.tsx";
import { ZoomIn } from 'lucide-react';

interface MapNode {
    node: myNode;
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
    { id: "CH-1", floor: "1", buildingId: "1", buildingName: "Chestnut Hill",svgPath: "/CH01.svg" },
    // 20 Patriot Place
    { id: "PP-1", floor: "1", buildingId: "2", buildingName: "Patriot Place", svgPath: "/PP01.svg" },
    { id: "PP-2", floor: "2", buildingId: "2", buildingName: "Patriot Place",svgPath: "/PP02.svg" },
    { id: "PP-3", floor: "3", buildingId: "2", buildingName: "Patriot Place",svgPath: "/PP03.svg" },
    { id: "PP-4", floor: "4", buildingId: "2", buildingName: "Patriot Place",svgPath: "/PP04.svg" },

    { id: "FK-1", floor: "1", buildingId: "3", buildingName: "Faulkner Hospital",svgPath: "/FK01.svg" },

];

interface Props {
    currentFloorId: string;
}



const NodeEditorComponent = ({currentFloorId}:Props) => {
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



    // Node Property Use States
    type NodeType = 'Stairs' | 'Elevator' | 'Room' | 'Hallway' | 'Parking Lot' | 'Road' | 'Door' | 'Hallway Intersection'
    const [nodeType, setNodeType] = useState<NodeType>('Stairs');
    const [roomNumber, setRoomNumber] = useState<string | null>(null);
    const [nodeName, setNodeName] = useState<string>('Node');


    function incrementTempNodeID(): number {
        return tempNodeID++;
    }

    function incrementTempEdgeID(): number {
        return ++tempEdgeID;
    }

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

    // useEffect(() => {
    //     console.log('Floor changed to:', currentFloorId);
    //     const bldgData = availableFloors.find((f) => f.id === currentFloorId);
    //     mapNodesRef.current.forEach((node) => node.drawnNode.setMap(null));
    //     mapEdgesRef.current.forEach((edge) => edge.drawnEdge.setMap(null));
    //     setMapEdges([]);
    //     setMapNodes([]);
    //     console.log("After erase:");
    //     console.log(mapEdges);
    //     console.log(mapNodes);
    //     if (!bldgData) {
    //         console.error('Building data not found');
    //         return;
    //     }
    //     const newNodes: MapNode[] = [];
    //     getNodes(bldgData.floor, bldgData.buildingId)
    //         .then((nodeResponses) => {
    //             nodeResponses.forEach((nodeResponse) => {
    //                 newNodes.push(createMapNodeFromNodeResponse(nodeResponse));
    //             });
    //             console.log("New Nodes:")
    //             console.log(newNodes);
    //             setMapNodes(newNodes);
    //         })
    //         .then(() => {
    //             getEdges(bldgData.floor, bldgData.buildingId).then((edgeResponses) => {
    //                 edgeResponses.forEach((edgeResponse) => {
    //                     const fromNode = newNodes.find(
    //                         (node) => node.node.nodeId === edgeResponse.from
    //                     );
    //                     const toNode = newNodes.find(
    //                         (node) => node.node.nodeId === edgeResponse.to
    //                     );
    //                     if (fromNode && toNode) {
    //                         createMapEdge(fromNode, toNode);
    //                     }
    //                 });
    //                 console.log("Edges")
    //             });
    //         })
    // }, [currentFloorId]);

    useEffect(() => {
        // This useEffect is called twice on startup
        // This stops the code from executing both time
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

        const newNodes: MapNode[] = [];

        getNodes(bldgData.floor, bldgData.buildingId)
            .then((nodeResponses) => {
                if (isCancelled) return;

                nodeResponses.forEach((nodeResponse) => {
                    newNodes.push(createMapNodeFromNodeResponse(nodeResponse));
                });

                setMapNodes(newNodes);

                return getEdges(bldgData.floor, bldgData.buildingId);
            })
            .then((edgeResponses) => {
                if (isCancelled || !edgeResponses) return;

                edgeResponses.forEach((edgeResponse) => {
                    const fromNode = newNodes.find(
                        (node) => node.node.nodeId === edgeResponse.from
                    );
                    const toNode = newNodes.find(
                        (node) => node.node.nodeId === edgeResponse.to
                    );
                    if (fromNode && toNode) {
                        createMapEdge(fromNode, toNode);
                    }
                });
            });

        return () => {
            // cancel ongoing async logic if effect re-runs
            isCancelled = true;
        };
    }, [currentFloorId]);


    useEffect(() => {
        if(!clickedNode)
            return;
        const currentNode = mapNodes.find(node => node.node.nodeId === clickedNode);
        if(currentNode){
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
                   // drawingLibrary.OverlayType.POLYLINE,
                ],
            },
            markerOptions: {
                zIndex: 1,
                clickable: true,
                draggable: true,
            },
            polylineOptions: {
                zIndex: 0
            }
        });
        drawingManager.setMap(map);
        google.maps.event.addListener(drawingManager, 'overlaycomplete', (event: google.maps.drawing.OverlayCompleteEvent) => {
            if (event.type === google.maps.drawing.OverlayType.POLYLINE) {
                // const polyline = event.overlay as google.maps.Polyline;
                // const path = polyline.getPath().getArray();
                // const nodes = [];
                // for (let i = 0; i < path.length; i++) {
                //     nodes.push(createMapNode(undefined, path[i]));
                //     if (i !== 0) {
                //         createMapEdge(nodes[i - 1], nodes[i], polyline);
                //     }
                // }
                // drawingManager.setDrawingMode(null);
            }else if(event.type === google.maps.drawing.OverlayType.MARKER){
                const marker = event.overlay as google.maps.Marker;
                const position = marker.getPosition();
                if(!marker || !position)
                    return;
                createMapNode(marker, position);
            }
        });
    }, [map]);

    function createMapNodeFromNodeResponse(node: NodeResponse) {
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
            drawnNode: new google.maps.Marker({
                position: new google.maps.LatLng(node.x, node.y),
                clickable: true,
                map: map,
                zIndex: 1,
                draggable: true
            }),
        }
        google.maps.event.addListener(mapNode.drawnNode, 'click', (e: google.maps.MapMouseEvent) =>
            clickNode(mapNode.node.nodeId)
        );
        google.maps.event.addListener(mapNode.drawnNode, 'drag', (e: google.maps.MapMouseEvent) => {
            const loc = e.latLng;
            if(loc){
                mapEdgesRef.current.forEach((edge) => {
                    const tempLoc: google.maps.LatLngLiteral = {
                        lat: mapNode.node.x,
                        lng: mapNode.node.y
                    }
                    const EPSILON = 1e-6;
                    const indexOfNode = edge.drawnEdge.getPath().getArray().findIndex(
                        ll =>
                            Math.abs(ll.lat() - tempLoc.lat) < EPSILON &&
                            Math.abs(ll.lng() - tempLoc.lng) < EPSILON
                    );
                    if(indexOfNode !== -1){
                        edge.drawnEdge.getPath().setAt(indexOfNode, loc);
                    }
                })
                mapNode.node.x = loc.lat();
                mapNode.node.y = loc.lng();
            }
        })
        return mapNode;
    }

    function createMapNode(marker: google.maps.Marker | undefined, position: google.maps.LatLng): MapNode {
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
            drawnNode: marker ? marker : new google.maps.Marker({
                position: position,
                clickable: true,
                map: map,
                zIndex: 1,
                draggable: true
            }),
        };
        google.maps.event.addListener(mapNode.drawnNode, 'click', (e: google.maps.MapMouseEvent) =>
            clickNode(mapNode.node.nodeId)
        );
        google.maps.event.addListener(mapNode.drawnNode, 'drag', (e: google.maps.MapMouseEvent) => {
            const loc = e.latLng;
            if(loc){
                mapEdgesRef.current.forEach((edge) => {
                    const tempLoc: google.maps.LatLngLiteral = {
                        lat: mapNode.node.x,
                        lng: mapNode.node.y
                    }
                    const EPSILON = 1e-6;
                    const indexOfNode = edge.drawnEdge.getPath().getArray().findIndex(
                        ll =>
                            Math.abs(ll.lat() - tempLoc.lat) < EPSILON &&
                            Math.abs(ll.lng() - tempLoc.lng) < EPSILON
                    );
                    if(indexOfNode !== -1){
                        edge.drawnEdge.getPath().setAt(indexOfNode, loc);
                    }
                })
                mapNode.node.x = loc.lat();
                mapNode.node.y = loc.lng();
            }
        })
        setMapNodes((prev) => [...prev, mapNode]);
        return mapNode;
    }

    function createMapEdge(startNode: MapNode, endNode: MapNode) {
        const startPos = startNode.drawnNode.getPosition();
        const endPos = endNode.drawnNode.getPosition();
        if (!startPos || !endPos) {
            return;
        }
        if(startPos.equals(endPos)){
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
                zIndex: -1,
                map: map,
                path: [startPos, endPos],
            })
        };
        console.log("Successfully created edge", mapEdge);
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

    // function cut(edges: google.maps.LatLng[], posToCut: google.maps.LatLng): {result: google.maps.LatLng[], edge: MapEdge | null} {
    //     const indexToCut = edges.findIndex(edge => edge.equals(posToCut));
    //     if(indexToCut !== -1) {
    //         const slice1 = edges.slice(0, indexToCut);
    //         const slice2 = edges.slice(indexToCut + 1);
    //         const node1 = mapNodes.find(node => node.drawnNode.getPosition() === slice1[slice1.length -1]);
    //         const node2 = mapNodes.find(node => node.drawnNode.getPosition() === slice2[0]);
    //         const edge = mapEdges.find(edge => edge.drawnEdge.getPath().getArray().includes(posToCut));
    //         if(!node1 || !node2 || !edge){
    //           return {result: slice1.concat(slice2), edge: null};
    //        }
    //         const mapEdge = {
    //             edge: new myEdge(incrementTempEdgeID(), node1.node, node2.node),
    //             to: node2,
    //             from: node1,
    //             drawnEdge: edge.drawnEdge
    //         };
    //         return {result: slice1.concat(slice2), edge: mapEdge};
    //     }
    //     return {result: [], edge: null};
    // }

    function removeEdgesFromNode(node: MapNode) {
        const toRemove:number[] = [];
        mapEdgesRef.current.forEach((edge) => {
            if(edge.from.node.nodeId === node.node.nodeId || edge.to.node.nodeId === node.node.nodeId) {
                edge.drawnEdge.setMap(null);
                toRemove.push(edge.edge.edgeId);
            }
        });
        setMapEdges(mapEdgesRef.current.filter(edge => !toRemove.includes(edge.edge.edgeId)));
    }

    function clickNode(nodeId: string) {
        const toNode = mapNodesRef.current.find((node) => node.node.nodeId === nodeId);
        const fromNode = mapNodesRef.current.find((node) => node.node.nodeId === clickedNodeRef.current);
        if (toNode) {
            setClickedNode(nodeId);
            setNodeType(toNode.node.nodeType as NodeType);
            setNodeName(toNode.node.name);
            setRoomNumber(toNode.node.roomNumber);
            if(fromNode && modeRef.current === 'Edge') {
                const fromEdge = mapEdgesRef.current.find(edge => edge.from.node.nodeId === fromNode.node.nodeId || edge.to.node.nodeId === fromNode.node.nodeId);
                const toEdge = mapEdgesRef.current.find(edge => edge.from.node.nodeId === toNode.node.nodeId || edge.to.node.nodeId === toNode.node.nodeId);
                createMapEdge(fromNode, toNode);
                if(fromEdge){
                    if(toEdge){
                        const indexOfToNode = toEdge.drawnEdge.getPath().getArray().indexOf(toNode.drawnNode.getPosition() as google.maps.LatLng);
                        const indexOfFromNode = fromEdge.drawnEdge.getPath().getArray().indexOf(fromNode.drawnNode.getPosition() as google.maps.LatLng);

                        // console.log(indexOfFromNode, indexOfToNode);
                        // if(indexOfToNode === 0 && indexOfFromNode === fromEdge.drawnEdge.getPath().getArray().length - 1) {
                        //     // Connecting lines end to start together
                        //     console.log("End to Front")
                        //     handleEndToFront(fromEdge, toEdge);
                        //     createMapEdge(fromNode, toNode);
                        // }else {
                        //     // Branch off w/ two edges
                        //     console.log("Branching from line w/ edge")
                        //     handleBranchEdge(fromNode, toEdge);
                        // }
                     }//else{
                    //     // Branch off w/ node
                    //     console.log("Branching from line w/ node")
                    //     handleBranchNode(fromNode, toNode);
                    // }
                 }//else{
                //     // Node to node
                //     console.log("Connecting node to node")
                //     handleNodeToNode(fromNode, toNode);
                // }
                setClickedNode(null);
            }
        }
    }


    function handleBranchEdge(fromNode: MapNode, toEdge: MapEdge) {
        const line = new google.maps.Polyline({
            map: map,
            path: [fromNode.drawnNode.getPosition() as google.maps.LatLng].concat(toEdge.drawnEdge.getPath().getArray()),
            zIndex: -1
        })
        toEdge.drawnEdge.setMap(null);
        toEdge.drawnEdge = line;
        createMapEdge(fromNode, toEdge.from);

    }

    function handleBranchNode(fromNode: MapNode, toNode: MapNode) {
        const line = new google.maps.Polyline({
            map: map,
            path: [fromNode.drawnNode.getPosition() as google.maps.LatLng, toNode.drawnNode.getPosition() as google.maps.LatLng],
            zIndex: -1
        })
        createMapEdge(fromNode, toNode);
    }

    function handleEndToFront(fromEdge: MapEdge, toEdge: MapEdge) {
        const path = fromEdge.drawnEdge.getPath().getArray().concat(toEdge.drawnEdge.getPath().getArray());
        fromEdge.drawnEdge.setMap(null);
        toEdge.drawnEdge.setMap(null);
        const newLine = new google.maps.Polyline({
            path: path,
            map: map,
            zIndex: -1,
        });
        fromEdge.drawnEdge = newLine;
        toEdge.drawnEdge = newLine;
    }

    function handleNodeToNode(fromNode: MapNode, toNode: MapNode) {
        const line = new google.maps.Polyline({
            map: map,
            path: [fromNode.drawnNode.getPosition() as google.maps.LatLng, toNode.drawnNode.getPosition() as google.maps.LatLng]
        });
        createMapEdge(fromNode, toNode);
    }

    const generateCustomId = (node: myNode) => {
        const floorPart = "Floor" + currentFloorId.charAt(currentFloorId.length - 1);
        const typePart = node.nodeType.charAt(0).toUpperCase() + node.nodeType.slice(1);
        const roomPart = (node.roomNumber || "");
        return `${currentFloorId.substring(0,2)}${floorPart}${typePart}${roomPart}`;
    };

    async function saveNodesAndEdges() {
        const nodes: NodeResponse[] = [];
        const usedNodeIds = new Set<string>();
        const currentFloor = availableFloors.find(f => f.id === currentFloorId);

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
            node.node.buildingId = currentFloor ? currentFloor.buildingId : "1";
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
            };
            nodes.push(sendNode);
        }
        await createNode(nodes, true, currentFloor ? currentFloor.floor : "1", currentFloor ? currentFloor.buildingId : "1");
        for (const edge of mapEdges) {
            const sendEdge: EdgeResponse = {
                edgeId: null, // Let the database auto generate any drawn for the first time nodes
                to: edge.edge.to.nodeId,
                from: edge.edge.from.nodeId,
            };
            // TODO: add floor field: delete all where floorID == x same thing but more complicated
            await createEdge(sendEdge);
        }
        setClickedNode(null);
    }

    useEffect(() => {
        if(!map)
            return;
        const listener = google.maps.event.addListener(map, 'click', (e: google.maps.MapMouseEvent) => {
            //TODO: set clickedNode to null when in nav mode
        })
        return () => {google.maps.event.removeListener(listener)}
    }, [map]);

    const HospitalLocations: Record<string, {lat: number, lng: number, zoom: number}> = {
        'Chestnut Hill': {lat: 42.325988, lng: -71.149567, zoom: 18},
        'Patriot Place': {lat: 42.092617, lng: -71.266492, zoom: 18},
        'Faulkner Hospital': {lat: 42.301684739524546, lng: -71.12816396084828, zoom: 18}
    };

    const loc = availableFloors.find(f => f.id === currentFloorId)?.buildingName || null;
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
                        Node ID: {mapNodes.find(node => node.node.nodeId === clickedNode)?.node.nodeId}
                    </p>
                    <p>
                        X: {mapNodes.find(node => node.node.nodeId === clickedNode)?.node.x}
                    </p>
                    <p>
                        Y: {mapNodes.find(node => node.node.nodeId === clickedNode)?.node.y}
                    </p>
                    <p>
                        Floor: {mapNodes.find(node => node.node.nodeId === clickedNode)?.node.floor}
                    </p>
                    <p>
                        Building ID: {mapNodes.find(node => node.node.nodeId === clickedNode)?.node.buildingId}
                    </p>

                </div>

                <SelectElement
                    label={'Select Node Type'}
                    id={'nodeType'}
                    value={nodeType}
                    placeholder={'Select Node Type'}
                    onChange={(e) => setNodeType(e.target.value as NodeType)}
                    options={['Stairs', 'Elevator', 'Room', 'Hallway', 'Parking Lot', 'Road', 'Door', 'Hallway Intersection']}
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
            </div>
            <div className={"absolute bottom-18 right-16 p-4 bg-white rounded-xl shadow-lg text-sm text-gray-800 max-w-sm space-y-1 z-10"}>
                <div>
                <MGBButton
                    onClick={() => {setMode('Node'); setClickedNode(null);}}
                    children={'Edit Nodes'}
                    variant={(mode === 'Node') ? 'secondary' : 'primary'}
                    disabled={mode === 'Node'}
                ></MGBButton>
                </div>
                <div>
                <MGBButton
                    onClick={() => {setMode('Edge'); setClickedNode(null);}}
                    children={'Create Edges'}
                    variant={(mode === 'Edge') ? 'secondary' : 'primary'}
                    disabled={mode === 'Edge'}
                ></MGBButton>
                    </div>
                <div>
                    <MGBButton
                        onClick={() => saveNodesAndEdges()}
                        children={'Save Nodes and Edges'}
                        variant={'primary'}
                        disabled={false}
                    ></MGBButton>
                </div>
            </div>
        </>
    );
};

export default NodeEditorComponent;