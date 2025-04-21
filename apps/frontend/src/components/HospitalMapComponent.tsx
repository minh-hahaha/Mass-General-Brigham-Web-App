import FloorSelector from "@/components/FloorSelector.tsx";
import {useState, useEffect} from "react";
import {ROUTES} from "common/src/constants.ts";
import axios from "axios";

import {myNode} from "common/src/classes/classes.ts";
import OverlayComponent from "@/components/OverlayMapComponent.tsx";
import {GetNode} from "@/database/getDepartmentNode.ts";
import DisplayPathComponent from "@/components/DisplayPathComponent.tsx";


const BuildingNames: Record<string, string> = {
    "1": "Chestnut Hill",
    "2": "20 Patriot Place",
    "3": "22 Patriot Place"
}

const CH01 = '/CH01.svg';
const PP01 = '/20PP01.svg';
const PP02 = '/20PP02.svg';
const PP03 = '/20PP03.svg';
const PP04 = '/20PP04.svg';
const PP2201 = '/22PP01.svg';
const PP2203 = '/22PP03.svg';
const PP2204 = '/22PP04.svg';

const ChestnutHillBounds = {
    southWest: { lat: 42.32543670863917, lng: -71.15022693442262 }, // Bottom-left corner
    northEast: { lat: 42.32649756743757, lng: -71.14898211823991 }, // Top-right corner
};

const PatriotPlaceBounds = {
    southWest: { lat: 42.09086272947439, lng: -71.26758215417115 }, // Bottom-left corner
    northEast: { lat: 42.09342690806031, lng: -71.26501767235642 }, // Top-right corner
};


// floor type
interface Floor {
    id: string;
    floor: string;
    buildingId: string;
    buildingName: string; // for display
    svgPath: string;
}

// All available floors across buildings
const availableFloors: Floor[] = [
    // Chestnut Hill
    { id: "CH-1", floor: "1", buildingId: "1", buildingName: "Chestnut Hill",svgPath: "/CH01.svg" },
    // 20 Patriot Place
    { id: "20PP-1", floor: "1", buildingId: "2", buildingName: "20 Patriot Place", svgPath: "/20PP01.svg" },
    { id: "20PP-2", floor: "2", buildingId: "2", buildingName: "20 Patriot Place",svgPath: "/20PP02.svg" },
    { id: "20PP-3", floor: "3", buildingId: "2", buildingName: "20 Patriot Place",svgPath: "/20PP03.svg" },
    { id: "20PP-4", floor: "4", buildingId: "2", buildingName: "20 Patriot Place",svgPath: "/20PP04.svg" },

    // 22 Patriot Place
    { id: "22PP-3", floor: "1", buildingId: "3",buildingName: "22 Patriot Place", svgPath: "/22PP01.svg" },
    { id: "22PP-3", floor: "3", buildingId: "3",buildingName: "22 Patriot Place", svgPath: "/22PP03.svg" },
    { id: "22PP-4", floor: "4", buildingId: "3", buildingName: "22 Patriot Place",svgPath: "/20PP04.svg" },

    // parking
    { id: "CH-A", floor: "0", buildingId: "1", buildingName: "Chestnut Hill",svgPath: "" },

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

function GetPolylinePath(path: myNode[]): {lat: number; lng: number}[] {
    return path.map(node => ({
        lat: node.y,
        lng: node.x,
    }))
}

// interface for prop
interface Props {
    startNodeId: string;
    endNodeId: string;
}

const HospitalMapComponent = ({startNodeId, endNodeId}:Props) => {
    const [bfsPath, setBFSPath] = useState<myNode[]>([]);
    const [startNode, setStartNode] = useState<myNode>();
    const [endNode, setEndNode] = useState<myNode>();
    const [currentFloorId, setCurrentFloorId] = useState<string>();

    // get node using nodeId
    useEffect(() => {
        const fetchNode = async () => {
            try {
                const start = await GetNode(startNodeId);
                setStartNode(start);
                const end = await GetNode(endNodeId);
                setEndNode(end);
            } catch (error) {
                console.error('Error fetching building names:', error);
            }
        };
        fetchNode();
        console.log('Got Department Node');
    }, []);

    // Find path and text directions
    useEffect(() => {
        const getMyPaths = async () => {
            if (startNode && endNode) {
                try {
                    const result = await FindPath(startNode, endNode);
                    console.log("Path found:", result);
                    setBFSPath(result);
                    const textDirection = createTextPath(result);
                    const text = document.getElementById('text-directions');
                    if(text) {
                        text.innerHTML = textDirection.toString().replace(/,/g, '<br><br>');
                    }
                } catch (error) {
                    console.error("Error finding path:", error);
                    setBFSPath([]);
                }
            } else {
                // Clear path if no start/end nodes
                setBFSPath([]);
            }
        };
        getMyPaths();
    }, [startNode, endNode]);

    // auto-select floor id for start node
    useEffect(() => {
        if (bfsPath.length > 0 && startNode) {
            const startFloor = availableFloors.find(
                f => f.buildingId === startNode.buildingId && f.floor === startNode.floor
            );
            if (startFloor) {
                setCurrentFloorId(startFloor.id);
            }
        }
    }, [bfsPath, startNode]);

    // getting current
    // const currentFloor = availableFloors.find(f => f.id === currentFloorId) || availableFloors[-1];
    // const currentBuildingId = currentFloor.buildingId;
    // const currentFloorNumber = currentFloor.floor;
    // const currentFloorPath = bfsPath.filter(
    //     node => node.buildingId === currentBuildingId && node.floor === currentFloorNumber
    // );


    // find first floor to show that floor
    // useEffect(() => {
    //     if (selectedBuildingId) {
    //         // Find the first floor of the selected building
    //         const firstFloorOfBuilding = availableFloors.find(
    //             floor => floor.building === selectedBuildingId
    //         );
    //
    //         if (firstFloorOfBuilding) {
    //             setCurrentFloorId(firstFloorOfBuilding.id);
    //         }
    //     }
    // }, [selectedBuildingId]);

    // // Handle floor change
    // const handleFloorChange = (floorId: string) => {
    //     setCurrentFloorId(floorId);
    // };

    // coordinates to test
    const coords = [ { lat: 42.32641975362307, lng: -71.14992617744028 },
        { lat: 42.32643660922756, lng: -71.14959023076334 },
        { lat: 42.3262859001328, lng: -71.14956609088263 },
        { lat: 42.326275985048134, lng: -71.14951647001675 },
        { lat: 42.32624227374853, lng: -71.14946819025536 },]

    return (
        <div className="relative w-full h-full">
            <OverlayComponent
                bounds={ChestnutHillBounds}
                imageSrc={availableFloors[0].svgPath}
            />
            <OverlayComponent
                bounds={PatriotPlaceBounds}
                imageSrc={PP01}
            />
            {/*<DisplayPathComponent coordinates={GetPolylinePath(currentFloorPath)} />*/}
            <DisplayPathComponent coordinates={coords} />
                    {/*<FloorSelector*/}
                    {/*    floors={availableFloors}*/}
                    {/*    currentFloorId={currentFloorId}*/}
                    {/*    onChange={handleFloorChange}*/}
                    {/*/>*/}
        </div>
    );
};


export default HospitalMapComponent;