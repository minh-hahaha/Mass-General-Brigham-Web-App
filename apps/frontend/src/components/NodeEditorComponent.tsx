import { useMap } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';
import { myEdge, myNode } from 'common/src/classes/classes.ts';
import MGBButton from '@/elements/MGBButton.tsx';
import { createNode, NodeResponse } from '@/database/getNode.ts';
import { createEdge, EdgeResponse } from '@/database/getEdges.ts';

interface MapNode {
    node: myNode,
    drawnNode: google.maps.Circle
}

interface MapEdge {
    edge: myEdge;
    to: MapNode;
    from: MapNode;
    drawnEdge: google.maps.Polyline;
}

const NodeEditorComponent = ()  => {

    const map = useMap();
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
    const tempEdgeIDRef = useRef(0);


    function incrementTempNodeID(): number {
        return tempNodeID++;
    }

    function incrementTempEdgeID(): number {
        return tempEdgeIDRef.current++;
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

    function createMapNode(position: google.maps.LatLng | null) {
        if(!position)
            return;
        const mapNode: MapNode = {
            node: new myNode(incrementTempNodeID().toString(), position.lat(), position.lng(), '1', 'IDK', '1', "Node", null),
            drawnNode: new google.maps.Circle({
                center: position,
                radius: 1,
                clickable: true,
                map: map,
                fillOpacity: 1,
                strokeWeight: 0,
                strokeColor: '#ffde00',
                fillColor: '#002aff',
            })
        }
        google.maps.event.addListener(mapNode.drawnNode, 'click', (e: google.maps.MapMouseEvent) => clickNode(mapNode.node.nodeId))
        setMapNodes(prev => [...prev, mapNode]);
    }

    function createMapEdge(startNode: MapNode, endNode: MapNode){
        const startPos = startNode.drawnNode.getCenter();
        const endPos = endNode.drawnNode.getCenter();
        if(!startPos || !endPos){
            return;
        }
        if(mapEdgesRef.current.find(edge => (edge.edge.to.nodeId === startNode.node.nodeId && edge.edge.from.nodeId === endNode.node.nodeId) || (edge.edge.to.nodeId === endNode.node.nodeId && edge.edge.from.nodeId === startNode.node.nodeId))){
            return;
        }
        const mapEdge: MapEdge = {
            edge: new myEdge(incrementTempEdgeID(), startNode.node, endNode.node),
            to: endNode,
            from: startNode,
            drawnEdge: new google.maps.Polyline({
                path: [startPos, endPos],
                map,
                strokeColor: '#002aff',
                strokeWeight: 5,
                clickable: true,
                zIndex: -1,
            })
        }
        google.maps.event.addListener(mapEdge.drawnEdge, 'click', (e: google.maps.MapMouseEvent) => clickEdge(mapEdge.edge.edgeId))
        setMapEdges(prev => [...prev, mapEdge]);
    }

    function removeSelectedNode(){
        const selectedNode = mapNodes.find(node => node.node.nodeId === clickedNode);
        if(selectedNode){
            removeEdgesFromNode(selectedNode);
            selectedNode.drawnNode.setMap(null);
            setMapNodes(mapNodes.filter(mapNode => mapNode.node.nodeId !== clickedNode));
            setClickedNode(null);
        }
    }

    function removeSelectedEdge(){
        const selectedEdge = mapEdges.find(edge => edge.edge.edgeId === clickedEdge);
        if(selectedEdge){
            selectedEdge.drawnEdge.setMap(null);
            setMapEdges(mapEdges.filter(mapEdge => mapEdge.edge.edgeId !== clickedEdge));
            setClickedEdge(null);
        }
    }

    function removeEdgesFromNode(node: MapNode) {
        const edgesToRemove: number[] = [];
        mapEdges.forEach(edge => {
            if(edge.from.node.nodeId === node.node.nodeId || edge.to.node.nodeId === node.node.nodeId) {
                edgesToRemove.push(edge.edge.edgeId);
                edge.drawnEdge.setMap(null);
            }
        })
        setMapEdges(mapEdges.filter(edge => !edgesToRemove.includes(edge.edge.edgeId)));
    }

    function clickNode(nodeId: string) {
        const currentNode = mapNodesRef.current.find(node => node.node.nodeId === clickedNodeRef.current);
        const newCurrent = mapNodesRef.current.find(node => node.node.nodeId === nodeId);
        if(currentNode){
            currentNode.drawnNode.set('strokeWeight', 0);
            if(newCurrent && modeRef.current === 'Edge'){
                createMapEdge(currentNode, newCurrent);
                setClickedNode(null)
                return;
            }
        }
        if(newCurrent){
            newCurrent.drawnNode.set('strokeWeight', 5);
            setClickedNode(nodeId);
        }
    }

    //TODO: make it so you cant select a node and an edge

    function clickEdge(edgeID: number){
        const currentEdge = mapEdgesRef.current.find(edge => edge.edge.edgeId === clickedEdgeRef.current);
        const newCurrent = mapEdgesRef.current.find(edge => edge.edge.edgeId === edgeID);
        if(currentEdge){
            currentEdge.drawnEdge.set('strokeColor', '#002aff');
        }
        if(newCurrent){
            newCurrent.drawnEdge.set('strokeColor', '#ffde00');
            setClickedEdge(edgeID);
        }
    }

    async function saveNodesAndEdges(){
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
        for (let i = 0; i < mapEdges.length; i++) {
            const edge = mapEdges[i];
            console.log(edge);
            const sendEdge: EdgeResponse = {
                edgeId: null, // Let the database auto generate any drawn for the first time nodes
                to: edge.edge.to.nodeId,
                from: edge.edge.from.nodeId,
            };
            await createEdge(sendEdge);
        }
    }

    useEffect(() => {
        if(!map)
            return;
        const listener = google.maps.event.addListener(map, 'click', (e: google.maps.MapMouseEvent) => {
            if(modeRef.current === 'Node'){
                createMapNode(e.latLng)
            }
        })
        return () => {google.maps.event.removeListener(listener)}
    }, [map]);

    return (
        <>
        <div className="absolute bottom-18 left-8 p-4 bg-white rounded-xl shadow-lg text-sm text-gray-800 max-w-sm space-y-1 z-10">
            <h3 className="font-bold text-base mb-1 text-mgbblue">Modes</h3>
            <p>
                <MGBButton
                    onClick={() => {
                        setMode(null);
                        setClickedNode('');
                    }}
                    children={"Navigate"}
                    variant={'primary'}
                    disabled={false}
                ></MGBButton>
            </p>
            <p>
                <MGBButton
                    onClick={() => {
                        setMode("Node");
                    }}
                    children={"Add Node"}
                    variant={'primary'}
                    disabled={false}
                ></MGBButton>
            </p>
            <p>
                <MGBButton
                    onClick={() => {
                        setMode("Edge");
                    }}
                    children={"Add Edge"}
                    variant={'primary'}
                    disabled={false}
                ></MGBButton>
            </p>
            <p>
                <MGBButton
                    onClick={() => removeSelectedNode()}
                    children={"Remove Node"}
                    variant={clickedNode ? 'primary' : 'secondary'}
                    disabled={clickedNode === null}
                ></MGBButton>
            </p>
            <p>
                <MGBButton
                    onClick={() => {
                        removeSelectedEdge();
                    }}
                    children={"Remove Edge"}
                    variant={clickedEdge ? 'primary' : 'secondary'}
                    disabled={clickedEdge === null}
                ></MGBButton>
            </p>
            <p>
                <MGBButton
                    onClick={() => {
                        saveNodesAndEdges();
                    }}
                    children={"Save Nodes and Edges"}
                    variant={'primary'}
                    disabled={false}
                ></MGBButton>
            </p>
        </div>
        </>
    )
}

export default NodeEditorComponent;