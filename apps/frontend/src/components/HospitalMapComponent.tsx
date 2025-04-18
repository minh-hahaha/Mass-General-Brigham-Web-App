import ViewPath from "@/components/ViewPath.tsx";
import FloorSelector from "@/components/FloorSelector.tsx";
import {useState, useEffect} from "react";
import {ROUTES} from "common/src/constants.ts";
import axios from "axios";

import {myNode} from "common/src/classes/classes.ts";


const BuildingNames: Record<string, string> = {
    "1": "Chestnut Hill",
    "2": "20 Patriot Place",
    "3": "22 Patriot Place"
}

// floor type
interface Floor {
    id: string;
    label: string;
    building: string;
    buildingName: string; // for dislay
    svgPath: string;
}

// All available floors across buildings
const availableFloors: Floor[] = [
    // 20 Patriot Place
    { id: "20PP-1", label: "1", building: "2", buildingName: "20 Patriot Place", svgPath: "/20PPFloor1.svg" },
    { id: "20PP-2", label: "2", building: "2", buildingName: "20 Patriot Place",svgPath: "/20PPFloor2.svg" },
    { id: "20PP-3", label: "3", building: "2", buildingName: "20 Patriot Place",svgPath: "/20PPFloor3.svg" },
    { id: "20PP-4", label: "4", building: "2", buildingName: "20 Patriot Place",svgPath: "/20PPFloor4.svg" },

    // 22 Patriot Place
    { id: "22PP-3", label: "3", building: "3",buildingName: "22 Patriot Place", svgPath: "/22PPFloor3.svg" },
    { id: "22PP-4", label: "4", building: "3", buildingName: "22 Patriot Place",svgPath: "/22PPFloor4.svg" },

    // Chestnut Hill
    { id: "CH-1", label: "1", building: "1", buildingName: "Chestnut Hill",svgPath: "/ChestnutHillFloor1.svg" },
];

async function FindPath(start: myNode, end: myNode) {
    const data = JSON.stringify({start, end})
    console.log(data);
    const res = await axios.post(ROUTES.BFSGRAPH, data, {
        headers: {'Content-Type': 'application/json'}
    })
    const nodes : myNode[] = res.data
    return nodes;
}

// interface for prop
interface Props {
    startNode?: myNode | null;
    endNode?: myNode | null;
    initialFloorId?: string;
    selectedBuildingId?:string;

}

const HospitalMapComponent = ({startNode, endNode, initialFloorId = "CH-1", selectedBuildingId}:Props) => {

    const [bfsPath, setBFSPath] = useState<myNode[]>([]);
    const [currentFloorId, setCurrentFloorId] = useState<string>(initialFloorId);
    const [isPathLoading, setIsPathLoading] = useState<boolean>(false);

    // find
    useEffect(() => {
        const getMyPaths = async () => {
            if (startNode && endNode) {
                setIsPathLoading(true);
                try {
                    const result = await FindPath(startNode, endNode);
                    console.log("bfs path found:", result);
                    setBFSPath(result);
                } catch (error) {
                    console.error("Error finding path:", error);
                    setBFSPath([]);
                } finally {
                    setIsPathLoading(false);
                }
            } else {
                // Clear path if no start/end nodes
                setBFSPath([]);
            }
        };
        getMyPaths();
    }, [startNode, endNode]);

    // auto-select floor of start node when path is found
    useEffect(() => {
        if (bfsPath.length > 0 && startNode) {
            const startFloor = availableFloors.find(
                f => f.building === startNode.buildingId && f.label === startNode.floor
            );
            if (startFloor) {
                setCurrentFloorId(startFloor.id);
            }
        }
    }, [bfsPath, startNode]);

    // getting current
    const currentFloor = availableFloors.find(f => f.id === currentFloorId) || availableFloors[-1];
    const currentBuildingId = currentFloor.building;
    const currentFloorNumber = currentFloor.label;
    const currentFloorPath = bfsPath.filter(
        node => node.buildingId === currentBuildingId && node.floor === currentFloorNumber
    );

    console.log("same floor " + currentFloorPath);

    // Get the SVG map URL for the current floor
    const currentSvgMapUrl = currentFloor.svgPath;


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
            {isPathLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-xl">Loading path...</div>
                </div>
            ) : (
                <>
                    {/* show node on that specific floor */}
                    <ViewPath
                        svgMapUrl={currentSvgMapUrl}
                        path={currentFloorPath}
                        buildingId={currentBuildingId}
                    />

                    {/* select floor - only show if not in "path only" mode */}

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

export default HospitalMapComponent;