import { useState, useEffect } from "react";
import axios from "axios";
import FloorSelector from "@/components/FloorSelector.tsx";
import { ROUTES } from "common/src/constants.ts";
import MapView from "./MapView.tsx";
import {myNode} from "../../../backend/src/Algorithms/classes.ts";


// Edge type to represent connections between nodes
interface Edge {
    id: string;
    startNodeId: string;
    endNodeId: string;
    // Add any other properties your edges have
}

// Floor type (same as in your example)
interface Floor {
    id: string;
    label: string;
    building: string;
    buildingName: string;
    svgPath: string;
}

// Building names mapping
const BuildingNames: Record<string, string> = {
    "1": "Chestnut Hill",
    "2": "20 Patriot Place",
    "3": "22 Patriot Place"
};

// All available floors across buildings (same as in your example)
const availableFloors: Floor[] = [
    // 20 Patriot Place
    { id: "20PP-1", label: "1", building: "2", buildingName: "20 Patriot Place", svgPath: "/20PPFloor1.svg" },
    { id: "20PP-2", label: "2", building: "2", buildingName: "20 Patriot Place", svgPath: "/20PPFloor2.svg" },
    { id: "20PP-3", label: "3", building: "2", buildingName: "20 Patriot Place", svgPath: "/20PPFloor3.svg" },
    { id: "20PP-4", label: "4", building: "2", buildingName: "20 Patriot Place", svgPath: "/20PPFloor4.svg" },

    // 22 Patriot Place
    { id: "22PP-3", label: "3", building: "3", buildingName: "22 Patriot Place", svgPath: "/22PPFloor3.svg" },
    { id: "22PP-4", label: "4", building: "3", buildingName: "22 Patriot Place", svgPath: "/22PPFloor4.svg" },

    // Chestnut Hill
    { id: "CH-1", label: "1", building: "1", buildingName: "Chestnut Hill", svgPath: "/ChestnutHillFloor1.svg" },
];

// Props interface
interface Props {
    initialFloorId?: string;
    selectedBuildingId?: string;
}

const MapViewComponent = ({ initialFloorId = "CH-1", selectedBuildingId }: Props) => {
    // State for nodes and edges
    const [nodes, setNodes] = useState<myNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [currentFloorId, setCurrentFloorId] = useState<string>(initialFloorId);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Get the current floor information
    const currentFloor = availableFloors.find(f => f.id === currentFloorId) || availableFloors[0];
    const currentBuildingId = currentFloor.building;
    const currentFloorNumber = currentFloor.label;

    // Filter nodes for the current floor
    const currentFloorNodes = nodes.filter(
        node => node.buildingId === currentBuildingId && node.floor === currentFloorNumber
    );

    // Filter edges that connect nodes on the current floor
    const currentFloorEdges = edges.filter(edge => {
        const startNode = nodes.find(node => node.id === edge.startNodeId);
        const endNode = nodes.find(node => node.id === edge.endNodeId);

        return (
            startNode &&
            endNode &&
            startNode.buildingId === currentBuildingId &&
            startNode.floor === currentFloorNumber &&
            endNode.buildingId === currentBuildingId &&
            endNode.floor === currentFloorNumber
        );
    });

    // Fetch nodes and edges from your database
    useEffect(() => {
        const fetchNodesAndEdges = async () => {
            setIsLoading(true);
            try {
                // Fetch nodes
                const nodesResponse = await axios.get(ROUTES.NODES);
                setNodes(nodesResponse.data);

                // Fetch edges
                const edgesResponse = await axios.get(ROUTES.EDGES);
                setEdges(edgesResponse.data);
            } catch (error) {
                console.error("Error fetching nodes and edges:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNodesAndEdges();
    }, []);

    // Update current floor based on selectedBuildingId
    useEffect(() => {
        if (selectedBuildingId) {
            // Find the first floor of the selected building
            const firstFloorOfBuilding = availableFloors.find(
                floor => floor.building === selectedBuildingId
            );

            if (firstFloorOfBuilding) {
                setCurrentFloorId(firstFloorOfBuilding.id);
            }
        }
    }, [selectedBuildingId]);

    // Handle floor change
    const handleFloorChange = (floorId: string) => {
        setCurrentFloorId(floorId);
    };

    return (
        <div className="relative w-full h-full">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-xl">Loading network data...</div>
                </div>
            ) : (
                <>
                    {/* Display the network visualization */}
                    <MapView
                        svgMapUrl={currentFloor.svgPath}
                        nodes={currentFloorNodes}
                        edges={currentFloorEdges}
                        buildingId={currentBuildingId}
                    />

                    {/* Floor selector */}
                    <FloorSelector
                        floors={availableFloors}
                        currentFloorId={currentFloorId}
                        onChange={handleFloorChange}
                    />
                </>
            )}
        </div>
    );
};


export default MapViewComponent;