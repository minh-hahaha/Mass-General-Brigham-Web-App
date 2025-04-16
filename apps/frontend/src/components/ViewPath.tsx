import React, { useRef, useState, useEffect } from 'react';
import {myNode} from "../../../backend/src/Algorithms/classes.ts";

interface Edge {
    from: string;
    to: string;
}

interface Props {
    svgMapUrl: string;
    currentFloor?: string;
    buildingId?: string;
    // nodes: myNode[];
    // edges: Edge[];
    // The path is an ordered array of node IDs representing the BFS pathfinding result
    path: myNode[];
    // Optional start and end destinations for display purposes
    startLocation?: string;
    endLocation?: string;
}

export default function HospitalPathViewer({
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
            newPathEdges.push({
                from: path[i].id,
                to: path[i + 1].id
            });
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

    // // Check if a node is part of the path
    // const isNodeInPath = (nodeId: string): boolean => {
    //     return pathNodeIds.includes(nodeId);
    // };

    // Check if a node is endpoints
    const isEndpoint = (nodeId: string): boolean => {
        return (path.length > 0 && (nodeId === path[0].id || nodeId === path[path.length - 1].id));
    };

    // Get node color based on its role in the path
    const getNodeColor = (nodeId: string): string => {
        if (isEndpoint(nodeId)) return 'red';
        return 'blue';
    };

    // // We can now use the path nodes directly since they are already myNode objects
    // const pathNodes = React.useMemo(() => {
    //     // Return the path nodes directly since they're already myNode objects
    //     return path;
    // }, [path]);


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

                        {/* Draw only nodes that are in the path */}
                        {path.map((node) => {
                            const isEndpointNode = isEndpoint(node.id);
                            const nodeSize = isEndpointNode ? 10 : 8;

                            return (
                                <g key={node.id}>
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={nodeSize / scale}
                                        fill={getNodeColor(node.id)}
                                        stroke="white"
                                        strokeWidth={2 / scale}
                                    >
                                    </circle>
                                    {isEndpointNode && (
                                        <text
                                            x={node.x + (12 / scale)}
                                            y={node.y + (5 / scale)}
                                            fontSize={20 / scale}
                                            fontWeight="bold"
                                            fill="black"
                                        >
                                            {node.id === path[0].id ? "Start" : "End"}
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