import { ControlPosition, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { myEdge, myNode } from 'common/src/classes/classes.ts';

interface MapNode {
    node: myNode,
    mapNode: google.maps.Circle
}

interface MapEdge {
    edge: myEdge;
    to: MapNode;
    from: MapNode;
    mapEdge: google.maps.Polyline;
}

const NodeEditorComponent = () => {

    const map = useMap();
    const [mode, setMode] = useState<'Node' | 'Edge' | null>(null);
    const [clickedNode, setClickedNode] = useState<MapNode | null>(null);
    const clickedNodeRef = useRef<MapNode | null>(null);
    const mapEdgesRef = useRef<MapEdge[] | null>(null);
    const mapNodesRef = useRef<MapNode[] | null>(null);
    const [mapEdges, setMapEdges] = useState<MapEdge[]>([]);
    const [mapNodes, setMapNodes] = useState<MapNode[]>([]);

    function updateNode(node: MapNode | null) {
        if(clickedNodeRef.current) {
            clickedNodeRef.current.mapNode.set('strokeWeight', 0);
        }
        setClickedNode(node);
        if(node){
            node.mapNode.set('strokeWeight', 5);
        }
    }

    useEffect(() => {
        clickedNodeRef.current = clickedNode;
    }, [clickedNode]);
    useEffect(() => {
        mapEdgesRef.current = mapEdges;
    }, [mapEdges]);
    useEffect(() => {
        mapNodesRef.current = mapNodes;
    }, [clickedNode]);

    document.addEventListener('keypress', (e) => {

        if(e.key === 'Enter') {
            setMode('Node');
        }else if(e.key === 'z' && clickedNodeRef.current) {
           mapEdgesRef.current?.forEach(edge => {
               if(edge.from.node.nodeId === clickedNodeRef.current?.node.nodeId || edge.to.node.nodeId === clickedNodeRef.current?.node.nodeId) {
                   edge.mapEdge.setMap(null);
               }
           });
           const newEdges = mapEdgesRef.current?.filter(edge => (edge.from.node.nodeId !== clickedNodeRef.current?.node.nodeId || edge.to.node.nodeId !== clickedNodeRef.current?.node.nodeId));
           setMapEdges(newEdges ? newEdges : []);
           clickedNodeRef.current.mapNode.setMap(null);
           const newNodes = mapNodesRef.current?.filter(node => node.node.nodeId !== clickedNodeRef.current?.node.nodeId);
           setMapNodes(newNodes ? newNodes : []);

           setClickedNode(null);
        }else{
            setMode(null);
        }
    })
    useEffect(() => {
        
        if(!map)
            return;
        const listeners: google.maps.MapsEventListener[] = [];
        if(mode == 'Node') {
            listeners.push(map.addListener('click', (e) => {
                const drawnNode = new google.maps.Circle({
                    center: e.latLng,
                    radius: 1,
                    clickable: true,
                    map: map,
                    fillOpacity: 1,
                    strokeWeight: 0,
                    strokeColor: '#ffde00',
                    fillColor: '#002aff',
                });
                const node: myNode = new myNode('IDK', drawnNode.getCenter().lat(), drawnNode.getCenter().lng(), '1', 'IDK', '1', "IDK", null);
                const mapNode = {node: node, mapNode: drawnNode};
                setMapNodes([...mapNodes, mapNode]);
                drawnNode.addListener('click', (e) => {
                    const currentNode = clickedNodeRef.current;
                    if(currentNode){
                        const path: google.maps.LatLngLiteral[] = [currentNode.mapNode.getCenter(), drawnNode.getCenter()];
                        const drawnEdge: google.maps.Polyline = new google.maps.Polyline({
                            path,
                            map,
                            strokeColor: '#002aff',
                            strokeWeight: 5,
                            clickable: false
                        })
                        const edge = new myEdge(99, currentNode.node, node);
                        const mapEdge = {edge: edge, from: currentNode, to: mapNode, mapEdge: drawnEdge};
                        setMapEdges([...mapEdges, mapEdge]);
                        updateNode(null);
                    }else{
                        updateNode(mapNode);
                    }
                })
            }))
        }

        return () => {
            listeners.forEach(listener => { listener.remove()})
        }
        
    }, [map, mode]);
    
    return (
        <>
        </>
    )
}

export default NodeEditorComponent;