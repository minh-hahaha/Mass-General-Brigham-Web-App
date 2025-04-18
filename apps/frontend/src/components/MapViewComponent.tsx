import { useState, useEffect } from "react";
import axios from "axios";
import EditorFloorSelector from "@/components/EditorFloorSelector.tsx";
import { ROUTES } from "common/src/constants.ts";

import {myNode, minhEdges} from "common/src/classes/classes.ts";
import ViewMap from "./ViewMap.tsx";

// Edge type to represent connections between nodes
// interface EdgeWithNodes {
//     edgeId: number;
//     from: string; // node id
//     to: string; // node id
//     nodeFrom: myNode; // node from
//     nodeTo: myNode; // node to
//
// }

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
    const [edges, setEdges] = useState<minhEdges[]>([]);
    const [currentFloorId, setCurrentFloorId] = useState<string>(initialFloorId);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Get the current floor information
    const currentFloor = availableFloors.find(f => f.id === currentFloorId) || availableFloors[0]; // a Floor interface
    const currentBuildingId = currentFloor.building; // building id string
    const currentFloorNumber = currentFloor.label; // floor number string

    // Filter nodes for the current floor
    const currentFloorNodes = nodes.filter(
        node => node.buildingId === currentBuildingId && node.floor === currentFloorNumber
    );

    // Filter edges that connect nodes on the current floor
    const currentFloorEdges = edges.filter(edge => {
        const startNode = edge.nodeFrom;
        const endNode = edge.nodeTo;
        return (
            startNode.buildingId === currentBuildingId &&
            startNode.floor === currentFloorNumber &&
            endNode.buildingId === currentBuildingId &&
            endNode.floor === currentFloorNumber &&
            startNode &&
            endNode
        );
    });

    console.log(currentFloorEdges);

    // Fetch nodes and edges from your database
    useEffect(() => {
        const fetchNodesAndEdges = async () => {
            setIsLoading(true);
            try {
                // Fetch nodes
                const nodesRes = await axios.get(ROUTES.NODE);
                setNodes(nodesRes.data);
                console.log("nodes ", nodesRes.data);

                // Fetch edges
                const edgesRes = await axios.get(ROUTES.EDGE);
                setEdges(edgesRes.data);
                console.log("edges from database - " , edgesRes.data);

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
        console.log("selected building ", selectedBuildingId);
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
                    <ViewMap
                        svgMapUrl={currentFloor.svgPath}
                        nodes={currentFloorNodes}
                        edges={currentFloorEdges}
                        buildingId={currentBuildingId}
                    />

                    {/* Floor selector */}
                    <EditorFloorSelector
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