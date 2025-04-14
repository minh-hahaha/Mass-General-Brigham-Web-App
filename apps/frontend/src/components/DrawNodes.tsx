import React, { useRef, useState, useEffect } from 'react';

interface NodeData {
    id: string;
    x: number;
    y: number;
    floor: string;
    buildingId: string;
    nodeType: string;
    name: string;
    roomNumber?: string;
}

interface Edge {
    from: string;
    to: string;
}

interface Props {
    svgMapUrl: string;
    currentFloor: string;
    buildingId: string;
}

export default function HospitalSVGEditor({ svgMapUrl, currentFloor, buildingId }: Props) {
    const [nodes, setNodes] = useState<NodeData[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [nodeType, setNodeType] = useState('intersection');
    const [nodeName, setNodeName] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const svgRef = useRef<SVGSVGElement>(null);

    // Zoom and pan state
    const [scale, setScale] = useState(1.1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Generate custom ID
    const generateCustomId = () => {
        const prefix = "CH";
        const floorPart = currentFloor;
        const typePart = nodeType.charAt(0).toUpperCase() + nodeType.slice(1);
        const roomPart = roomNumber || `${nodes.length + 1}`;
        return `${prefix}${floorPart}${typePart}${roomPart}`;
    };

    const handleSVGClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (isDragging || e.shiftKey || e.altKey) return; // Don't create node if we're dragging

        const svg = svgRef.current;
        if (!svg) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;

        // default zoom and pan
        const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
        // when zoom and pan
        const adjustedX = (svgP.x - position.x) / scale;
        const adjustedY = (svgP.y - position.y) / scale;

        const newNode: NodeData = {
            id: generateCustomId(),
            x: adjustedX,
            y: adjustedY,
            floor: currentFloor,
            buildingId,
            nodeType,
            name: nodeName || `Node ${nodes.length + 1}`,
            roomNumber
        };

        setNodes([...nodes, newNode]);
        setNodeName('');
        setRoomNumber('');
    };

    const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!selectedNodeId) {
            setSelectedNodeId(nodeId);
        } else {
            if (selectedNodeId !== nodeId) {
                setEdges([...edges, { from: selectedNodeId, to: nodeId }]);
            }
            setSelectedNodeId(null);
        }
    };

    const exportData = () => {
        const exportJson = {
            nodes,
            edges,
        };
        console.log("Exported Data:", JSON.stringify(exportJson, null, 2));
        alert('Exported data logged in console.');
    };

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
        if (e.button === 1 || e.button === 0 && (e.altKey || e.shiftKey)) { // Middle button or Alt+Left click
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

    return (
        <div className="flex flex-col items-start gap-4 p-4">
            <div className="flex gap-2 flex-wrap">
                <input
                    type="text"
                    placeholder="Node Name"
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                    className="border p-1"
                />
                <input
                    type="text"
                    placeholder="Room Number"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="border p-1"
                />
                <select
                    value={nodeType}
                    onChange={(e) => setNodeType(e.target.value)}
                    className="border p-1"
                >
                    <option value="Hallway">Hallway</option>
                    <option value="Door">Door</option>
                    <option value="Elevator">Elevator</option>
                    <option value="Stairs">Stairs</option>
                    <option value="Room">Room</option>
                </select>
                <button onClick={exportData} className="bg-blue-500 text-white px-3 py-1 rounded">
                    Export Nodes & Edges
                </button>
                <div className="flex flex-row items-center gap-2">
                    <button
                        onClick={() => {
                            setScale(1);
                            setPosition({ x: 0, y: 0 });
                        }}
                        className="bg-gray-200 px-3 py-1 rounded"
                    >
                        Reset View
                    </button>
                    <div className="text-sm text-gray-600 mb-2">
                        Use mouse wheel to zoom. Hold Shift or Alt + drag (or middle mouse button) to pan the map.
                    </div>
                </div>
            </div>


            <svg
                ref={svgRef}
                onClick={handleSVGClick}
                onWheel={handleZoom}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                viewBox="0 0 1000 1000"
                preserveAspectRatio="xMidYMid meet"
                style={{
                    width: '100%',
                    height: '75vh',
                    border: '1px solid #ccc',
                    cursor: isDragging ? 'grabbing' : 'default'
                }}
            >
                <g transform={`translate(${position.x}, ${position.y}) scale(${scale})`}>
                    <image href={svgMapUrl} x="0" y="0" width="1000" height="1000" />

                    {/* Draw edges */}
                    {edges.map((edge, i) => {
                        const fromNode = nodes.find(n => n.id === edge.from);
                        const toNode = nodes.find(n => n.id === edge.to);
                        if (!fromNode || !toNode) return null;

                        return (
                            <line
                                key={i}
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                stroke="red"
                                strokeWidth={2 / scale} // Adjust stroke width for zoom
                            />
                        );
                    })}

                    {/* Draw nodes */}
                    {nodes.map((node) => (
                        <g key={node.id}>
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={6 / scale} // Adjust radius for zoom
                                fill={selectedNodeId === node.id ? 'green' : 'blue'}
                                stroke="white"
                                strokeWidth={2 / scale} // Adjust stroke width for zoom
                                onClick={(e) => handleNodeClick(node.id, e)}
                            >
                                <title>{node.name} (ID: {node.id})</title>
                            </circle>
                            <text
                                x={node.x + (8 / scale)}
                                y={node.y + (4 / scale)}
                                fontSize={12 / scale} // Adjust font size for zoom
                                fill="black"
                            >
                                {node.id}
                            </text>
                        </g>
                    ))}
                </g>
            </svg>
        </div>
    );
}