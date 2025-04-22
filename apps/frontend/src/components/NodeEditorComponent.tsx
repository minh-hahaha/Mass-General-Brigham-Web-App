import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { myEdge, myNode } from 'common/src/classes/classes.ts';
import MGBButton from '@/elements/MGBButton.tsx';
import {createNode, deleteNode, NodeResponse} from '@/database/getNode.ts';
import {createEdge, deleteEdge, EdgeResponse} from '@/database/getEdges.ts';
import SelectElement from '@/elements/SelectElement.tsx';
import InputElement from "@/elements/InputElement.tsx";

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

const NodeEditorComponent = () => {
    const map = useMap();
    const drawingLibrary = useMapsLibrary('drawing');
    let drawingManager: google.maps.drawing.DrawingManager;
    const [mode, setMode] = useState<'Node' | 'Edge' | null>(null);
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
    type NodeType = ('Stairs' | 'Elevator' | 'Room' | 'Hallway')
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
            drawingMode: drawingLibrary.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                    drawingLibrary.OverlayType.MARKER,
                    drawingLibrary.OverlayType.POLYLINE,
                ],
            },
            markerOptions: {
                zIndex: 1,
                clickable: true
            },
            polylineOptions: {
                zIndex: 0
            }
        });
        drawingManager.setMap(map);
        google.maps.event.addListener(drawingManager, 'overlaycomplete', (event: google.maps.drawing.OverlayCompleteEvent) => {
            if (event.type === google.maps.drawing.OverlayType.POLYLINE) {
                const polyline = event.overlay as google.maps.Polyline;
                const path = polyline.getPath().getArray();
                const nodes = [];
                for (let i = 0; i < path.length; i++) {
                    nodes.push(createMapNode(undefined, path[i]));
                    if (i !== 0) {
                        createMapEdge(nodes[i - 1], nodes[i], polyline);
                    }
                }
                drawingManager.setDrawingMode(null);
            }else if(event.type === google.maps.drawing.OverlayType.MARKER){
                const marker = event.overlay as google.maps.Marker;
                const position = marker.getPosition();
                if(!marker || !position)
                    return;
                createMapNode(marker, position);
            }
        });
    }, [map]);

    function createMapNode(marker: google.maps.Marker | undefined, position: google.maps.LatLng): MapNode {
        const mapNode: MapNode = {
            node: new myNode(
                incrementTempNodeID().toString(),
                position.lat(),
                position.lng(),
                '1',
                'IDK',
                '1',
                'Node',
                null
            ),
            drawnNode: marker ? marker : new google.maps.Marker({
                position: position,
                clickable: true,
                map: map,
                zIndex: 1,
            }),
        };
        google.maps.event.addListener(mapNode.drawnNode, 'click', (e: google.maps.MapMouseEvent) =>
            clickNode(mapNode.node.nodeId)
        );
        setMapNodes((prev) => [...prev, mapNode]);
        return mapNode;
    }

    function createMapEdge(startNode: MapNode, endNode: MapNode, line: google.maps.Polyline) {
        const startPos = startNode.drawnNode.getPosition();
        const endPos = endNode.drawnNode.getPosition();
        if (!startPos || !endPos) {
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
            drawnEdge: line
        };
        //google.maps.event.addListener(mapEdge.drawnEdge, 'click', (e: google.maps.MapMouseEvent) => clickEdge(mapEdge.edge.edgeId))
        setMapEdges((prev) => [...prev, mapEdge]);
    }

    async function removeSelectedNode() {
        const selectedNode = mapNodes.find((node) => node.node.nodeId === clickedNode);
        if (selectedNode) {
            const edgeInfo = removeEdgesFromNode(selectedNode);
            selectedNode.drawnNode.setMap(null);
            setClickedNode(null);
            console.log(edgeInfo.removedEdge.toString());
            console.log(selectedNode.node.nodeId);
            await deleteEdge(edgeInfo.removedEdge.toString());
            // SET NEW EDGES
            await createDBEdge(edgeInfo.fromNode, edgeInfo.toNode);
            await deleteNode(selectedNode.node.nodeId);
            setMapNodes(mapNodes.filter((mapNode) => mapNode.node.nodeId !== clickedNode));
        }
    }

    async function createDBEdge(from: MapNode, to: MapNode) {
        const newEdge: EdgeResponse = {
            edgeId: incrementTempEdgeID(),
            from: from.node.nodeId,
            to: to.node.nodeId
        }
        await createEdge(newEdge);
    }

    // function removeSelectedEdge() {
    //     const selectedEdge = mapEdges.find((edge) => edge.edge.edgeId === clickedEdge);
    //     if (selectedEdge) {
    //         selectedEdge.drawnEdge.setMap(null);
    //         setMapEdges(mapEdges.filter((mapEdge) => mapEdge.edge.edgeId !== clickedEdge));
    //         setClickedEdge(null);
    //     }
    // }

    function removeEdgesFromNode(node: MapNode): { removedEdge: number, fromNode: MapNode, toNode: MapNode } {
        const edge = mapEdges.find(
            (edge) =>
                edge.from.node.nodeId === node.node.nodeId ||
                edge.to.node.nodeId === node.node.nodeId
        );
        if (!edge) return {removedEdge: -1, fromNode: node, toNode:node};
        edge.drawnEdge.setPath(
            edge.drawnEdge
                .getPath()
                .getArray()
                .filter((position) => position !== node.drawnNode.getPosition())
        )
        const nextEdge = mapEdges.find(iEdge =>
            (iEdge.from.node.nodeId === edge.to.node.nodeId)
        )
        return {removedEdge: nextEdge ? nextEdge.edge.edgeId : edge.edge.edgeId, fromNode: edge.from, toNode: nextEdge ? nextEdge.to : edge.to};
    }

    function clickNode(nodeId: string) {
        const toNode = mapNodesRef.current.find((node) => node.node.nodeId === nodeId);
        const fromNode = mapNodesRef.current.find((node) => node.node.nodeId === clickedNodeRef.current);
        if (toNode) {
            setClickedNode(nodeId);
            setNodeType(toNode.node.nodeType as NodeType);
            setNodeName(toNode.node.name);
            setRoomNumber(toNode.node.roomNumber);
            if(fromNode) {
                const edge = mapEdgesRef.current.find(edge => edge.from.node.nodeId === fromNode.node.nodeId || edge.to.node.nodeId === fromNode.node.nodeId);
                if(edge){
                    console.log("edge exists")
                    const indexOf = edge.drawnEdge.getPath().getArray().indexOf(fromNode.drawnNode.getPosition() as google.maps.LatLng);
                    if(indexOf === 0 || indexOf === edge.drawnEdge.getPath().getArray().length - 1) {
                        console.log("0 or end")
                        let path: google.maps.LatLng[] = [];
                        const iEdge = mapEdgesRef.current.find(edge => edge.from.node.nodeId === toNode.node.nodeId);
                        if(indexOf === 0){
                            console.log("0")
                            if(iEdge){
                                console.log("iEdge exists")
                                path = iEdge.drawnEdge.getPath().getArray();
                                path = path.reverse();
                                path = path.concat(edge.drawnEdge.getPath().getArray());
                            }else{
                                path = [toNode.drawnNode.getPosition() as google.maps.LatLng];
                                path = path.concat(edge.drawnEdge.getPath().getArray());
                            }
                        }else{
                            console.log("end")
                            if(iEdge) {
                                console.log("iEdge exists")
                                path = edge.drawnEdge.getPath().getArray();
                                console.log(path);
                                path = path.concat(iEdge.drawnEdge.getPath().getArray());
                                console.log(path);
                            }else{
                                path = path = edge.drawnEdge.getPath().getArray();
                                path = path.concat(toNode.drawnNode.getPosition() as google.maps.LatLng);
                            }
                        }
                        edge.drawnEdge.setPath(path);
                        // TODO: for every node on iEdge path, set to edge's polyline
                        createMapEdge(fromNode, toNode, edge.drawnEdge);
                    }else{
                        const newLine = new google.maps.Polyline({
                            zIndex: 0,
                            path: [fromNode.drawnNode.getPosition() as google.maps.LatLng, toNode.drawnNode.getPosition() as google.maps.LatLng],
                            map: map
                        });
                        createMapEdge(fromNode, toNode, newLine);
                    }
                }
                setClickedNode(null);
            }
        }
    }

    // function clickEdge(edgeID: number) {
    //     const currentEdge = mapEdgesRef.current.find(
    //         (edge) => edge.edge.edgeId === clickedEdgeRef.current
    //     );
    //     const newCurrent = mapEdgesRef.current.find((edge) => edge.edge.edgeId === edgeID);
    //     if (currentEdge) {
    //         currentEdge.drawnEdge.set('strokeColor', '#002aff');
    //     }
    //     if (newCurrent) {
    //         newCurrent.drawnEdge.set('strokeColor', '#ffde00');
    //         setClickedEdge(edgeID);
    //     }
    // }

    async function saveNodesAndEdges() {
        for (const node of mapNodes) {
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
            await createNode(sendNode);
        }
        for (const edge of mapEdges) {
            const sendEdge: EdgeResponse = {
                edgeId: null, // Let the database auto generate any drawn for the first time nodes
                to: edge.edge.to.nodeId,
                from: edge.edge.from.nodeId,
            };
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

    return (
        <>
            <div
                hidden={clickedNode === null}
                className="absolute bottom-18 left-8 p-4 bg-white rounded-xl shadow-lg text-sm text-gray-800 max-w-sm space-y-1 z-10"
            >
                <h3 className="font-bold text-base mb-1 text-mgbblue">Node Options</h3>
                <SelectElement
                    label={'Select Node Type'}
                    id={'nodeType'}
                    value={nodeType}
                    placeholder={'Select Node Type'}
                    onChange={(e) => setNodeType(e.target.value as NodeType)}
                    options={['Hallway', 'Room', 'Elevator', 'Stairs']}
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