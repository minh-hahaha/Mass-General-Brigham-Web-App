import React, {useEffect, useRef, useState} from "react";

interface NodePosition{
    x: number;
    y: number;
    rx: number;
    ry: number;
}

interface NodePositions{
    [key: string]: NodePosition;
}

interface SVGNodeConnectProps {
    svgPath: string;
    nodeConnections: string[][];
}
const ChestnutHillMapComponent  = ({svgPath, nodeConnections} : SVGNodeConnectProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [svgDoc, setSvgDoc] = useState<Document | null>(null);
    const [nodePositions, setNodePositions] = useState<NodePositions>({});

    const[zoom, setZoom] = useState(1);
    const[offset, setOffset] = useState({x:0,y:0});

    const dragging = useRef(false);
    const lastMousePos = useRef({x:0,y:0});

    // load svg
    useEffect(() => {
        const fetchSVG = async () => {
            try {
                const response = await fetch(svgPath);
                const svgText = await response.text();

                // parsing svg file
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

                setSvgDoc(svgDoc);

                // extract node positions
                const nodeGroups = svgDoc.querySelectorAll('#Nodes > g');
                const positions:NodePositions = {};

                nodeGroups.forEach(group => {
                    const id = group.getAttribute('id');
                    const ellipse = group.querySelector('ellipse');

                    if (id && ellipse) {
                        const cx = parseFloat(ellipse.getAttribute('cx') as string);
                        const cy = parseFloat(ellipse.getAttribute('cy') as string);
                        const rx = parseFloat(ellipse.getAttribute('rx') as string);
                        const ry = parseFloat(ellipse.getAttribute('ry') as string);

                        positions[id] = {
                            x: cx,
                            y: cy,
                            rx: rx,
                            ry: ry,
                        }
                    }
                });

                setNodePositions(positions);
            } catch {
                console.error("Unable to load SVG");
            }
        }
        fetchSVG();
    } , [svgPath])

    // draw edges on canvas
    useEffect(() => {
        // if no svg, no canvas element
        if (!svgDoc || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // extract width and height
        const svg = svgDoc.documentElement;
        const width = parseFloat(svg.getAttribute('width') as string);
        const height = parseFloat(svg.getAttribute('height') as string);

        canvas.width = width;
        canvas.height = height;

        // convert svg to image and draw on canvas
        const svgString = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
            if (!ctx) return;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.translate(offset.x, offset.y);
            ctx.scale(zoom, zoom);

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = 'rgba(255,0,0,1)'
            ctx.lineWidth = 2 / zoom;
            ctx.setLineDash([])

            // draw line for each pair of connected nodes
            nodeConnections.forEach((connection) => {
                const fromNodeId = connection[0];
                const toNodeId = connection[1];
                const fromNode = nodePositions[fromNodeId];
                const toNode = nodePositions[toNodeId];

                if (fromNode && toNode) {
                    ctx.beginPath();
                    ctx.moveTo(fromNode.x, fromNode.y);
                    ctx.lineTo(toNode.x, toNode.y);
                    ctx.stroke();

                    // can draw arrow to indicate direction
                }
                else
                    console.warn(`Node ${fromNodeId} to ${toNodeId} not found`);
            })

            URL.revokeObjectURL(url);
        }
        img.src = url;
        return () => {
            URL.revokeObjectURL(url);
        }
    } , [svgDoc, nodePositions, nodeConnections, zoom, offset]);

    const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();

        const delta = -e.deltaY;
        const zoomFactor = 1.1;
        const mouseX = e.nativeEvent.offsetX;
        const mouseY = e.nativeEvent.offsetY;

        const newZoom = delta > 0 ? zoom * zoomFactor : zoom / zoomFactor;
        const scaleChange = newZoom / zoom;

        //adjust offset so zoom centers at mouse
        const newOffsetX = mouseX - scaleChange * (mouseX - offset.x);
        const newOffsetY = mouseY - scaleChange * (mouseY - offset.y);

        setZoom(newZoom);
        setOffset({ x: newOffsetX, y: newOffsetY });
    };

    // panning down
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        dragging.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };
    // panning up
    const handleMouseUp = () => {
        dragging.current = false;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!dragging.current) return;

        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;

        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    return (
        <div>
            <canvas
                ref={canvasRef}

                style={{ width: '100%', height: '92vh', border: '1px solid black'}}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
            />

        </div>
    )
}

export default ChestnutHillMapComponent;