import {myNode} from "../../../backend/src/Algorithms/classes.ts";
import ViewPath from "@/components/ViewPath.tsx";
import FloorSelector from "@/components/FloorSelector.tsx";
import {useState, useEffect} from "react";
import {ROUTES} from "common/src/constants.ts";
import axios from "axios";

// floor type
interface Floor {
    id: string;
    label: string;
    building: string;
    svgPath: string;
}

// All available floors across buildings
const availableFloors: Floor[] = [
    // 20 Patriot Place
    { id: "20PP-1", label: "1", building: "2", svgPath: "/20PPFloor1.svg" },
    { id: "20PP-2", label: "2", building: "2", svgPath: "/20PPFloor2.svg" },
    { id: "20PP-3", label: "3", building: "2", svgPath: "/20PPFloor3.svg" },
    { id: "20PP-4", label: "4", building: "2", svgPath: "/20PPFloor4.svg" },

    // 22 Patriot Place
    { id: "22PP-3", label: "3", building: "3", svgPath: "/22PPFloor3.svg" },
    { id: "22PP-4", label: "4", building: "3", svgPath: "/22PPFloor4.svg" },

    // Chestnut Hill
    { id: "CH-1", label: "1", building: "1", svgPath: "/ChestnutHillFloor1.svg" },
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
    startNode: myNode | null;
    endNode: myNode | null;
}

const HospitalMapComponent = ({startNode, endNode}:Props) => {
    if (!startNode || !endNode) return;
    const [bfsPath, setBFSPath] = useState<myNode[]>([]);
    useEffect(() => {
        const getMyPaths = async () => {
            const result = await FindPath(startNode, endNode);
            console.log("bfs " + result);
            setBFSPath(result);
        };
        getMyPaths();
    }, []);
    const [currentFloorId, setCurrentFloorId] = useState<string>("CH-1");

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



    // Find floor transitions to highlight in the UI
    const floorTransitions = bfsPath.reduce((transitions: Record<string, string[]>, node, index) => {
        // Skip the last node as it won't transition to anything
        if (index === bfsPath.length - 1) return transitions;

        const nextNode = bfsPath[index + 1];

        // If next node is on a different floor or building, this is a transition
        if (node.floor !== nextNode.floor || node.buildingId !== nextNode.buildingId) {
            const key = `${node.buildingId}-${node.floor}`;
            if (!transitions[key]) {
                transitions[key] = [];
            }
            transitions[key].push(`${nextNode.buildingId}-${nextNode.floor}`);
        }

        return transitions;
    }, {});

    // Handle floor change
    const handleFloorChange = (floorId: string) => {
        setCurrentFloorId(floorId);
    };

    const hasTransitions = floorTransitions[`${currentBuildingId}$-${currentFloor}$`]?.length > 0;

    return (
        <div className="relative w-full h-full">
            {/* show node on that specific floor */}
            <ViewPath
                svgMapUrl={currentSvgMapUrl}
                path={currentFloorPath}
                buildingId={currentBuildingId}
            />

            {/* select floor */}
            <FloorSelector
                floors={availableFloors}
                currentFloorId={currentFloorId}
                onChange={handleFloorChange}
            />

            {/* Floor info panel */}
            <div className="absolute top-6 right-6 p-3 bg-white rounded-md shadow-md z-10">
                <h3 className="font-semibold mb-1 text-sm">{currentBuildingId} Floor {currentFloorNumber}</h3>
                <div className="text-sm space-y-1">
                    <p>Nodes on this floor: {currentFloorPath.length}</p>

                    {/* Show available transitions if any */}
                    {hasTransitions && (
                        <div>
                            <p className="font-medium mt-1">Connections to:</p>
                            <ul className="list-disc pl-4">
                                {floorTransitions[`${currentBuildingId}-${currentFloorNumber}`].map((targetFloor, i) => {
                                    const [targetBuilding, targetFloorNum] = targetFloor.split('-');
                                    return (
                                        <li key={i} className="text-xs">
                                            <button
                                                className="text-blue-600 hover:underline"
                                                onClick={() => {
                                                    // Find the floor ID to switch to
                                                    const targetFloorConfig = availableFloors.find(
                                                        f => f.building === targetBuilding && f.label === targetFloorNum
                                                    );
                                                    if (targetFloorConfig) {
                                                        handleFloorChange(targetFloorConfig.id);
                                                    }
                                                }}
                                            >
                                                {targetBuilding} Floor {targetFloorNum}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HospitalMapComponent;