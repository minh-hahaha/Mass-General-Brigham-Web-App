import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { myEdge, myNode } from 'common/src/classes/classes.ts';
import MGBButton from '@/elements/MGBButton.tsx';
import {createNode, deleteNode, NodeResponse} from '@/database/getNode.ts';
import {createEdge, deleteEdge, EdgeResponse} from '@/database/getEdges.ts';
import SelectElement from '@/elements/SelectElement.tsx';
import InputElement from "@/elements/InputElement.tsx";
import * as async_hooks from "node:async_hooks";

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
    type NodeType = ('Stairs' | 'Elevator' | 'Room' | 'Hallway | Parking | Road')
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

    async function createDBEdge(from: MapNode, to: MapNode) {
        const newEdge: EdgeResponse = {
            edgeId: incrementTempEdgeID(),
            from: from.node.nodeId,
            to: to.node.nodeId
        }
        await createEdge(newEdge);
    }

    function cut(edges: google.maps.LatLng[], posToCut: google.maps.LatLng) {
        const indexToCut = edges.findIndex(edge => edge.equals(posToCut));
        if(indexToCut !== -1) {
            const slice1 = edges.slice(0, indexToCut);
            const slice2 = edges.slice(indexToCut + 1);
            const node1 = mapNodes.find(node => node.drawnNode.getPosition() === slice1[slice1.length -1]);
            const node2 = mapNodes.find(node => node.drawnNode.getPosition() === slice2[0]);
            const edge = mapEdges.find(edge => edge.drawnEdge.getPath().getArray().includes(posToCut));
           if(node1 && node2 && edge){
               console.log(node1)
               console.log(node2)
               console.log(edge)
               createMapEdge(node1, node2, edge.drawnEdge);
           }
            return slice1.concat(slice2);
        }
        return edges;
    }

    function removeEdgesFromNode(node: MapNode) {
        mapEdgesRef.current.forEach((edge) => {
            if(edge.from.node.nodeId === node.node.nodeId || edge.to.node.nodeId === node.node.nodeId) {
                edge.drawnEdge.setPath(cut(edge.drawnEdge.getPath().getArray(), node.drawnNode.getPosition() as google.maps.LatLng))
            }
        });
        // Remove all edges with the node in it
        console.log(mapEdgesRef.current);
        console.log(mapEdgesRef.current.filter(e => (e.edge.from.nodeId !== node.node.nodeId && e.edge.to.nodeId !== node.node.nodeId)));
        setMapEdges(mapEdgesRef.current.filter(e => (e.edge.from.nodeId !== node.node.nodeId && e.edge.to.nodeId !== node.node.nodeId)));
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
                if(fromEdge){
                    if(toEdge){
                        const indexOfToNode = toEdge.drawnEdge.getPath().getArray().indexOf(toNode.drawnNode.getPosition() as google.maps.LatLng);
                        const indexOfFromNode = fromEdge.drawnEdge.getPath().getArray().indexOf(fromNode.drawnNode.getPosition() as google.maps.LatLng);
                        console.log(indexOfFromNode, indexOfToNode);
                        if(indexOfToNode === 0 && indexOfFromNode === fromEdge.drawnEdge.getPath().getArray().length - 1) {
                            // Connecting lines end to start together
                            console.log("End to Front")
                            handleEndToFront(fromEdge, toEdge);
                            createMapEdge(fromNode, toNode, toEdge.drawnEdge);
                        }else {
                            // Branch off w/ two edges
                            console.log("Branching from line w/ edge")
                            handleBranchEdge(fromNode, toEdge);
                        }
                    }else{
                        // Branch off w/ node
                        console.log("Branching from line w/ node")
                        handleBranchNode(fromNode, toNode);
                    }
                }else{
                    // Node to node
                    console.log("Connecting node to node")
                    handleNodeToNode(fromNode, toNode);
                }
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
        createMapEdge(fromNode, toEdge.from, line);

    }

    function handleBranchNode(fromNode: MapNode, toNode: MapNode) {
        const line = new google.maps.Polyline({
            map: map,
            path: [fromNode.drawnNode.getPosition() as google.maps.LatLng, toNode.drawnNode.getPosition() as google.maps.LatLng],
            zIndex: -1
        })
        createMapEdge(fromNode, toNode, line);
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
        createMapEdge(fromNode, toNode, line);
    }

    const generateCustomId = (node: myNode) => {
        const floorPart = "Floor" + currentFloorId.charAt(currentFloorId.length - 1);
        const typePart = node.nodeType.charAt(0).toUpperCase() + node.nodeType.slice(1);
        const roomPart = (node.roomNumber ? node.roomNumber : '') || `${mapNodes.length + 1}`;
        return `${currentFloorId.substring(0,2)}${floorPart}${typePart}${roomPart}`;
    };

    async function saveNodesAndEdges() {
        const nodes = [];
        for (const node of mapNodes) {
            node.node.nodeId = generateCustomId(node.node);
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
        // TODO: add floor field: delete all where floorID == x
        await createNode(nodes, true);
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