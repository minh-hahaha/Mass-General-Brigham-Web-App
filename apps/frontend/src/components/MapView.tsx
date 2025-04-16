import { useState, useEffect } from "react";

// Node type from your backend
interface myNode {
    id: string;
    name: string;
    buildingId: string;
    floor: string;
    x: number;
    y: number;
    type?: string; // Optional node type for styling
    // Add any other properties your nodes have
}

// Edge type to represent connections between nodes
interface Edge {
    id: string;
    startNodeId: string;
    endNodeId: string;
    type?: string; // Optional edge type for styling
    // Add any other properties your edges have
}

interface NetworkVisualizationProps {
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
                              }: NetworkVisualizationProps) => {
    const [svgContent, setSvgContent] = useState<string>("");
    const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
    const [transform, setTransform] = useState({ scale: 1, translateX: 0, translateY: 0 });

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
        switch (node.type) {
            case "entrance":
                return { fill: "#4CAF50", radius: 8 };
            case "exit":
                return { fill: "#F44336", radius: 8 };
            case "elevator":
                return { fill: "#9C27B0", radius: 7 };
            case "stairs":
                return { fill: "#FF9800", radius: 7 };
            case "room":
                return { fill: "#2196F3", radius: 6 };
            case "hallway":
                return { fill: "#607D8B", radius: 5 };
            default:
                return { fill: "#3182ce", radius: 6 };
        }
    };

    // Get edge style based on type
    const getEdgeStyle = (edge: Edge) => {
        switch (edge.type) {
            case "elevator":
                return { stroke: "#9C27B0", strokeWidth: 3, strokeDasharray: "5,5" };
            case "stairs":
                return { stroke: "#FF9800", strokeWidth: 3, strokeDasharray: "10,5" };
            case "hallway":
                return { stroke: "#607D8B", strokeWidth: 2 };
            default:
                return { stroke: "#4299e1", strokeWidth: 2 };
        }
    };

    // Handle node click
    const handleNodeClick = (node: myNode) => {
        if (onNodeClick) {
            onNodeClick(node);
        }
    };

    // Handle zoom in
    const handleZoomIn = () => {
        setTransform(prev => ({
            ...prev,
            scale: prev.scale * 1.2
        }));
    };

    // Handle zoom out
    const handleZoomOut = () => {
        setTransform(prev => ({
            ...prev,
            scale: Math.max(0.5, prev.scale / 1.2)
        }));
    };

    // Handle reset zoom
    const handleResetZoom = () => {
        setTransform({ scale: 1, translateX: 0, translateY: 0 });
    };

    if (!svgContent) {
        return <div className="flex items-center justify-center h-full">Loading floor plan...</div>;
    }

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* Render SVG map */}
            <div
                className="w-full h-full"
                style={{
                    transform: `scale(${transform.scale}) translate(${transform.translateX}px, ${transform.translateY}px)`,
                    transformOrigin: 'center',
                    transition: 'transform 0.2s'
                }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />

            {/* Overlay for nodes and edges */}
            <svg
                className="absolute top-0 left-0 w-full h-full"
                style={{
                    transform: `scale(${transform.scale}) translate(${transform.translateX}px, ${transform.translateY}px)`,
                    transformOrigin: 'center',
                    transition: 'transform 0.2s'
                }}
            >
                {/* Draw edges */}
                {edges.map(edge => {
                    const startNode = nodes.find(node => node.id === edge.startNodeId);
                    const endNode = nodes.find(node => node.id === edge.endNodeId);

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
                            strokeWidth={edgeStyle.strokeWidth}
                            strokeDasharray={edgeStyle.strokeDasharray}
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
                                r={nodeStyle.radius}
                                fill={nodeStyle.fill}
                                stroke="#2c5282"
                                strokeWidth="1.5"
                            />
                            <text
                                x={node.x + 10}
                                y={node.y + 4}
                                fontSize="12"
                                fill="#2d3748"
                                textAnchor="start"
                                dominantBaseline="middle"
                            >
                                {node.name}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Zoom controls */}
            <div className="absolute bottom-4 right-4 flex flex-col bg-white rounded-lg shadow-md">
                <button
                    className="p-2 border-b border-gray-200 hover:bg-gray-100"
                    onClick={handleZoomIn}
                    title="Zoom In"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                </button>
                <button
                    className="p-2 border-b border-gray-200 hover:bg-gray-100"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                </button>
                <button
                    className="p-2 hover:bg-gray-100"
                    onClick={handleResetZoom}
                    title="Reset Zoom"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"></path>
                        <path d="M14 15l-5-5 5-5"></path>
                    </svg>
                </button>
            </div>

            {/* Network stats */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-80 rounded-lg p-2 shadow-md text-sm">
                <div>Building: {buildingId}</div>
                <div>Nodes: {nodes.length}</div>
                <div>Connections: {edges.length}</div>
            </div>
        </div>
    );
};

export default MapView;