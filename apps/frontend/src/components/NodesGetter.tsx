import React, { useRef, useState } from 'react';

interface NodeData {
    id: string;
    x: number;
    y: number;
    floor: string;
    buildingId: string;
    nodeType: string;
    name: string;
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
    const svgRef = useRef<SVGSVGElement>(null);

    const handleSVGClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const svg = svgRef.current;
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newNode: NodeData = {
            id: `node-${nodes.length + 1}`,
            x,
            y,
            floor: currentFloor,
            buildingId,
            nodeType,
            name: nodeName || `Node ${nodes.length + 1}`
        };

        setNodes([...nodes, newNode]);
        setNodeName('');
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

    return (
        <div className="flex flex-col items-start gap-4 p-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Node Name"
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                    className="border p-1"
                />
                <select
                    value={nodeType}
                    onChange={(e) => setNodeType(e.target.value)}
                    className="border p-1"
                >
                    <option value="intersection">Intersection</option>
                    <option value="Door">Door</option>
                    <option value="elevator">Elevator</option>
                    <option value="stairs">Stairs</option>
                    <option value="room">Room</option>
                </select>
                <button onClick={exportData} className="bg-blue-500 text-white px-3 py-1 rounded">
                    Export Nodes & Edges
                </button>
            </div>

            <svg
                ref={svgRef}
                onClick={handleSVGClick}
                style={{ width: '100%', height: '80vh', border: '1px solid #ccc' }}
            >
                <image href={svgMapUrl} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />

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
                            strokeWidth={2}
                        />
                    );
                })}

                {/* Draw nodes */}
                {nodes.map((node) => (
                    <circle
                        key={node.id}
                        cx={node.x}
                        cy={node.y}
                        r={6}
                        fill={selectedNodeId === node.id ? 'green' : 'blue'}
                        stroke="white"
                        strokeWidth={2}
                        onClick={(e) => handleNodeClick(node.id, e)}
                    >
                        <title>{node.name}</title>
                    </circle>
                ))}
            </svg>
        </div>
    );
}
