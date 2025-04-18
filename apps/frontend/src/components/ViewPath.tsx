import React, { useRef, useState, useEffect } from 'react';


import {myNode} from "common/src/classes/classes.ts";

interface Edge {
    from: string;
    to: string;
}

interface Props {
    svgMapUrl: string;
    currentFloor?: string;
    buildingId?: string;
    // The path is an ordered array of node IDs representing the BFS pathfinding result
    path: myNode[];
    // Optional start and end destinations for display purposes
    startLocation?: string;
    endLocation?: string;
}

export default function ViewPath({
                                     svgMapUrl,
                                     path = [],
                                 }: Props) {
    const svgRef = useRef<SVGSVGElement>(null);

    // Zoom and pan state
    const [scale, setScale] = useState(1.1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [pathEdges, setPathEdges] = useState<Edge[]>([]);

    // Create edges based on the path
    useEffect(() => {
        if (path.length < 2) return;

        const newPathEdges: Edge[] = [];
        for (let i = 0; i < path.length - 1; i++) {
            // Only create edges between nodes on the same floor
            if (path[i].floor === path[i + 1].floor) {
                newPathEdges.push({
                    from: path[i].id,
                    to: path[i + 1].id
                });
            }
        }

        setPathEdges(newPathEdges);
    }, [path]);

    // Handle zoom with mouse wheel
    const handleZoom = (e: React.WheelEvent) => {
        e.preventDefault();
        const newScale = e.deltaY < 0
            ? Math.min(scale * 1.1, 5) // Zoom in (max 5x)
            : Math.max(scale / 1.1, 0.5); // Zoom out (min 0.5x)
        setScale(newScale);
    };

    // Pan functionality
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1 || e.button === 0 && (e.altKey || e.shiftKey)) { // Middle button or Alt/Shift+Left click
            e.preventDefault();
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            setPosition({
                x: position.x + dx,
                y: position.y + dy
            });
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Add event listeners for mouse up outside the SVG
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsDragging(false);
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, []);

    // Check if a node is an endpoint (start or end of path)
    const isEndpoint = (nodeId: string): boolean => {
        return (path.length > 0
            &&
            (nodeId === path[0].id || nodeId === path[path.length - 1].id));
    };

    // Find connection points between floors - nodes where the path goes to a different floor
    const getFloorTransitionNodes = (): myNode[] => {
        if (path.length < 2) return [];

        const transitionNodes: myNode[] = [];

        for (let i = 0; i < path.length - 1; i++) {
            if (path[i].floor !== path[i + 1].floor) {
                // This node connects to a different floor
                transitionNodes.push(path[i]);
            }
        }
        return transitionNodes;
    };

    const floorTransitionNodes = getFloorTransitionNodes();

    // Get node color
    const getNodeColor = (node: myNode): string => {
        if (isEndpoint(node.id)) return 'red';

        // Check if it's a floor transition node
        if (floorTransitionNodes.some(n => n.id === node.id)) {
            return 'green'; // Floor transitions are green
        }

        return 'blue';
    };

    // Get node label
    const getNodeLabel = (node: myNode): string => {
        if (node.id === path[0]?.id) return "Start";
        if (node.id === path[path.length - 1]?.id) return "End";

        // For transition nodes, show which floor it connects to
        const transitionNode = floorTransitionNodes.find(n => n.id === node.id);
        if (transitionNode) {
            // Find the connected node on different floor
            const connectedNodeIndex = path.findIndex(n => n.id === transitionNode.id);
            if (connectedNodeIndex >= 0 && connectedNodeIndex < path.length - 1) {
                const nextNode = path[connectedNodeIndex + 1];
                if (nextNode.floor !== transitionNode.floor) {
                    return `To Floor ${nextNode.floor}`;
                }
            }
        }

        return node.name || node.id;
    };

    return (
        <div className="flex flex-col items-start">
            <div className="relative w-full">
                <div className="absolute top-2 left-2 p-2 bg-white rounded-lg shadow-md">
                    <div className="text-sm text-gray-600 mb-2">
                        Use mouse wheel to zoom. Hold Shift or Alt + drag (or middle mouse button) to pan the map.
                    </div>
                    <button
                        onClick={() => {
                            setScale(1);
                            setPosition({ x: 0, y: 0 });
                        }}
                        className="bg-gray-200 px-3 py-1 rounded"
                    >
                        Reset View
                    </button>
                </div>

                <svg
                    ref={svgRef}
                    onWheel={handleZoom}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="xMidYMid meet"
                    style={{
                        width: '100%',
                        height: '92vh',
                        border: '1px solid #ccc',
                        cursor: isDragging ? 'grabbing' : 'default',
                    }}
                >
                    <g transform={`translate(${position.x}, ${position.y}) scale(${scale})`}>
                        <image href={svgMapUrl} x="0" y="0" width="1000" height="1000" />

                        {/* Draw path edges */}
                        {pathEdges.map((edge, i) => {
                            const fromNode = path.find(n => n.id === edge.from);
                            const toNode = path.find(n => n.id === edge.to);
                            if (!fromNode || !toNode) return null;

                            return (
                                <line
                                    key={`path-${i}`}
                                    x1={fromNode.x}
                                    y1={fromNode.y}
                                    x2={toNode.x}
                                    y2={toNode.y}
                                    stroke="blue"
                                    strokeWidth={4 / scale}
                                    strokeOpacity={0.8}
                                    strokeLinecap="round"
                                />
                            );
                        })}

                        {/* Draw nodes that are in the path */}
                        {path.map((node) => {
                            const isEndpointNode = isEndpoint(node.id);
                            const isTransitionNode = floorTransitionNodes.some(n => n.id === node.id);
                            const nodeSize = isEndpointNode ? 10 : (isTransitionNode ? 9 : 8);
                            const nodeColor = getNodeColor(node);

                            return (
                                <g key={node.id}>
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={nodeSize / scale}
                                        fill={nodeColor}
                                        stroke="white"
                                        strokeWidth={2 / scale}
                                    >
                                    </circle>
                                    {/* Show labels for important nodes */}
                                    {(isEndpointNode || isTransitionNode) && (
                                        <text
                                            x={node.x + (12 / scale)}
                                            y={node.y + (5 / scale)}
                                            fontSize={16 / scale}
                                            fontWeight="bold"
                                            fill="black"
                                        >
                                            {getNodeLabel(node)}
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>
        </div>
    );
}