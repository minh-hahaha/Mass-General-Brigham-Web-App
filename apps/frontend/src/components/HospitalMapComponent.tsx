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


/* TEXT DIRECTIONS HOSPITAL INTERIOR */

class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    dot(other: Vector): number {
        return this.x * other.x + this.y * other.y;
    }

    angleTo(other: Vector): number {
        const dot = this.dot(other);
        const cross = this.x * other.y - this.y * other.x;
        // Return angle in degrees
        // Using degrees instead of radians bc it's easier to compare bigger numbers than decimals
        return (Math.atan2(cross, dot) * 180) / Math.PI;
    }
}

function createTextPath(traversalResult: myNode[] | undefined | null): string[] {
    // Make sure a path exists
    if (!traversalResult) {
        console.log('No Path');
        return [];
    }

    // Initial facing direction. TODO: need to be able to figure out direction for the first node
    // Currently hardcoded for each location
    const StartDirs = [
        { key: 'CH', dir: new Vector(0, traversalResult[0].y + 50) },
        { key: '20PP', dir: new Vector(traversalResult[0].x + 50, 0) },
        { key: '22PP', dir: new Vector(0, traversalResult[0].y + 50) },
    ];
    const directions = [];
    const startDir = StartDirs.find((value) => traversalResult[0].nodeId.includes(value.key));
    let currentDirection;
    if (!startDir) {
        currentDirection = new Vector(0, 0);
    } else {
        currentDirection = startDir.dir;
    }
    // Traversing floors: when the user is taking the elevator or stairs
    let traversingFloors = false;
    // Loop through each node in the list
    for (let i = 0; i < traversalResult.length; i++) {
        // Get the current and next node
        const currentNode = traversalResult[i];
        const nextNode = traversalResult[i + 1];
        // If there is no next node, we have reached the destination
        if (!nextNode) {
            directions.push(`You have arrived at ${currentNode.name}`);
            break;
        }

        const dy = nextNode.y - currentNode.y;
        const dx = nextNode.x - currentNode.x;
        // Get the direction the user will be facing
        const newDirection = new Vector(dx, dy);
        // Get the angle between the user's current facing and the next node's facing
        const angle = currentDirection.angleTo(newDirection);
        // Make the user's current direction the new direction
        currentDirection = newDirection;
        // If the next node is an elevator or stairs, the user will be changing floors
        if (nextNode.nodeType === 'Elevator' || nextNode.nodeType === 'Stairs') {
            traversingFloors = true;
            // If the next node is not an elevator or stairs, and the user should be traversing floors,
            // we have arrived at the next walkable node
        } else if (
            traversingFloors &&
            nextNode.nodeType !== 'Elevator' &&
            nextNode.nodeType !== 'Stairs'
        ) {
            traversingFloors = false;
            // Instruct the user to take the elevator to the nth floor
            directions.push(
                `Take the Elevator to the ${nextNode.floor}${getNumberSuffix(nextNode.floor)} floor`
            );
        }
        // The default instructions if not traversing floors or if getting off the elevator/stairs
        if (
            !traversingFloors ||
            (traversingFloors && nextNode.nodeType !== 'Elevator' && nextNode.nodeType !== 'Stairs')
        ) {
            directions.push(
                `From the ${currentNode.nodeId} ${determineDirection(angle)} until you reach the ${nextNode.nodeId}`
            );
        }
    }
    return directions;
}

function determineDirection(angle: number): string {
    let prefix = '';
    if (angle < -75 && angle > -105) {
        prefix = 'Turn Left then ';
    } else if (angle > 75 && angle < 105) {
        prefix = 'Turn Right then ';
    }
    return prefix + 'Continue Straight';
}

function getNumberSuffix(num: string): string {
    if (num.endsWith('1') && num !== '11') {
        return 'st';
    } else if (num.endsWith('2') && num !== '12') {
        return 'nd';
    } else if (num.endsWith('3') && num !== '13') {
        return 'rd';
    } else {
        return 'th';
    }
}



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
                    const textDirection = createTextPath(result);
                    const t = document.getElementById('text-directions');
                    if(t) {
                        t.innerHTML = textDirection.toString().replace(/,/g, '<br><br>');
                    }
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