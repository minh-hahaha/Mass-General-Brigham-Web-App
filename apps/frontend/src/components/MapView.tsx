import { useState, useEffect, useRef} from "react";
import {myNode} from "../../../backend/src/Algorithms/classes.ts";

// Edge type to represent connections between nodes
interface Edge {
    id: number;
    from: string;
    to: string;
    nodeFrom: Node;
    nodeTo: Node;
}


interface MapViewProps {
    svgMapUrl: string;
    nodes: myNode[];
    edges: Edge[];
    buildingId: string;
    onNodeClick?: (node: myNode) => void;
}

const MapView = ({
                                  svgMapUrl,
                                  nodes,
                                  edges,
                                  buildingId,
                                  onNodeClick
                              }: MapViewProps) => {
    const [svgContent, setSvgContent] = useState<string>("");
    const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
    const [transform, setTransform] = useState({ scale: 1, translateX: 0, translateY: 0 });
    const svgRef = useRef<SVGSVGElement>(null);

    // Fetch SVG content
    useEffect(() => {
        const fetchSvg = async () => {
            try {
                const response = await fetch(svgMapUrl);
                const svgText = await response.text();
                setSvgContent(svgText);

                // Extract SVG dimensions from content if possible
                const widthMatch = svgText.match(/width="([^"]+)"/);
                const heightMatch = svgText.match(/height="([^"]+)"/);

                if (widthMatch && heightMatch) {
                    setSvgDimensions({
                        width: parseFloat(widthMatch[1]),
                        height: parseFloat(heightMatch[1])
                    });
                }
            } catch (error) {
                console.error("Error loading SVG:", error);
            }
        };

        fetchSvg();
    }, [svgMapUrl]);

    // Get node style based on type
    const getNodeStyle = (node: myNode) => {
        switch (node.nodeType) {
            case "Room":
                return { fill: "green", radius: 7 };
            default:
                return { fill: "red", radius: 7 };
        }
    };

    // Get edge style based on type
    const getEdgeStyle = (edge: Edge) => {
        return { stroke: "blue", strokeWidth: 5 };

    };

    // Handle node click
    const handleNodeClick = (node: myNode) => {
        if (onNodeClick) {
            onNodeClick(node);
        }
        console.log(node);
    };

    // Zoom and pan state (matching ViewPath component)
    const [scale, setScale] = useState(1.1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

    if (!svgContent) {
        return <div className="flex items-center justify-center h-full">Loading floor plan...</div>;
    }

    return (
        <div className="flex flex-col items-start">
            <div className="relative w-full">
                {/* Instructions and reset view button */}
                <div className="absolute top-2 left-2 p-2 bg-white rounded-lg shadow-md z-10">
                    <div className="text-sm text-gray-600 mb-2">
                        Use mouse wheel to zoom. Hold Shift or Alt + drag (or middle mouse button) to pan the map.
                    </div>
                    <button
                        onClick={() => {
                            setScale(1.1);
                            setPosition({ x: 0, y: 0 });
                        }}
                        className="bg-gray-200 px-3 py-1 rounded"
                    >
                        Reset View
                    </button>
                </div>

                {/* Network stats */}
                <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-lg p-2 shadow-md text-sm z-10">
                    <div>Building: {buildingId}</div>
                    <div>Nodes: {nodes.length}</div>
                    <div>Connections: {edges.length}</div>
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
                        {/* Background SVG Map */}
                        <image href={svgMapUrl} x="0" y="0" width="1000" height="1000" />

                        {/* Draw edges */}
                        {edges.map(edge => {
                            const startNode = nodes.find(node => node.id === edge.from);
                            const endNode = nodes.find(node => node.id === edge.to);

                            if (!startNode || !endNode) return null;

                            const edgeStyle = getEdgeStyle(edge);

                            return (
                                <line
                                    key={edge.id}
                                    x1={startNode.x}
                                    y1={startNode.y}
                                    x2={endNode.x}
                                    y2={endNode.y}
                                    stroke={edgeStyle.stroke}
                                    strokeWidth={edgeStyle.strokeWidth / scale}
                                    strokeOpacity={0.8}
                                    strokeLinecap="round"
                                />
                            );
                        })}

                        {/* Draw nodes */}
                        {nodes.map(node => {
                            const nodeStyle = getNodeStyle(node);

                            return (
                                <g
                                    key={node.id}
                                    onClick={() => handleNodeClick(node)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={nodeStyle.radius / scale}
                                        fill={nodeStyle.fill}
                                        stroke="#2c5282"
                                        strokeWidth={1.5 / scale}
                                    />
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default MapView;