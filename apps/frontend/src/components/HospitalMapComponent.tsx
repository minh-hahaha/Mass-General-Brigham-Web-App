import FloorSelector from '@/components/FloorSelector.tsx';
import { useState, useEffect } from 'react';
import { ROUTES } from 'common/src/constants.ts';
import axios from 'axios';
import TextToSpeechMapComponent from '@/components/TextToSpeechMapComponent.tsx';
import { myNode } from 'common/src/classes/classes.ts';
import OverlayComponent from '@/components/OverlayMapComponent.tsx';
import { GetNode } from '@/database/getDepartmentNode.ts';
import DisplayPathComponent from '@/components/DisplayPathComponent.tsx';

const ChestnutHillBounds = {
    southWest: { lat: 42.32543670863917, lng: -71.15022693442262 }, // Bottom-left corner
    northEast: { lat: 42.32649756743757, lng: -71.14898211823991 }, // Top-right corner
};

const PatriotPlaceBounds = {
    southWest: { lat: 42.09086272947439, lng: -71.2675430325 }, // Bottom-left corner
    northEast: { lat: 42.09342690806031, lng: -71.2649785507 }, // Top-right corner
};
const FaulknerBounds = {
    southWest: { lat: 42.300487127183445, lng: -71.13067267701479 }, // Bottom-left corner
    northEast: { lat: 42.30301668867676, lng: -71.126350413866 }, // Top-right corner
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
    { id: "PP-1", floor: "1", buildingId: "2", buildingName: "Patriot Place", svgPath: "/PP01.svg" },
    { id: "PP-2", floor: "2", buildingId: "2", buildingName: "Patriot Place",svgPath: "/PP02.svg" },
    { id: "PP-3", floor: "3", buildingId: "2", buildingName: "Patriot Place",svgPath: "/PP03.svg" },
    { id: "PP-4", floor: "4", buildingId: "2", buildingName: "Patriot Place",svgPath: "/PP04.svg" },

    { id: "FK-1", floor: "1", buildingId: "3", buildingName: "Faulkner Hospital",svgPath: "/FK01.svg" },
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

async function FindPath(start: myNode, end: myNode, strategy: string) {
    const data = JSON.stringify({ start, end, strategy });
    console.log(data);
    const res = await axios.post(ROUTES.FINDPATH, data, {
        headers: { 'Content-Type': 'application/json' },
    });
    const nodes: myNode[] = res.data;
    // console.log("PATH" + nodes)
    return nodes;
}

function GetPolylinePath(path: myNode[]): { lat: number; lng: number }[] {
    return path.map((node) => ({
        lat: Number(node.x),
        lng: Number(node.y),
    }));
}

let directions1: string;
function setDirections(directions: string) {
    directions1 = directions;
}
let directions11: string[];
function setDirections2(directions: string[]) {
    directions11 = directions;
    console.log(directions11);
}

// interface for prop
interface Props {
    startNodeId: string;
    endNodeId: string;
    selectedAlgorithm: string;
    visible: boolean;
    driveDirections: string;
    drive2Directions: string[];
    showTextDirections: boolean;
}

const HospitalMapComponent = ({
    startNodeId,
    endNodeId,
    selectedAlgorithm,
    visible,
    driveDirections,
    drive2Directions,
    showTextDirections,
}: Props) => {
    const [bfsPath, setBFSPath] = useState<myNode[]>([]);
    const [startNode, setStartNode] = useState<myNode>();
    const [endNode, setEndNode] = useState<myNode>();
    const [currentFloorId, setCurrentFloorId] = useState<string>();
    const [textSpeech, setTextSpeech] = useState<HTMLElement | null>(null);

    console.log(startNodeId);
    console.log(endNodeId);

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
    }, [startNodeId, endNodeId]);

    // Find path and text directions
    useEffect(() => {
        const getMyPaths = async () => {
            if (startNode && endNode) {
                try {
                    const result = await FindPath(startNode, endNode, selectedAlgorithm);
                    console.log('Path found:', result);
                    setBFSPath(result);
                    const textDirection = createTextPath(result);
                    const text = document.getElementById('text-directions');
                    if (text) {
                        //setTextSpeech(text);
                        //console.log(text);
                        console.log(textDirection);
                        //console.log(textDirection.toString().replace(/,/g, '<br><br>'));
                        text.innerHTML = textDirection.toString().replace(/,/g, '<br><br>');
                        setDirections(text.innerHTML);
                        console.log(text.innerHTML);
                        setDirections2(text.innerHTML.split('<br><br>'));



                    }
                } catch (error) {
                    console.error('Error finding path:', error);
                    setBFSPath([]);
                }
            } else {
                // Clear path if no start/end nodes
                setBFSPath([]);
            }
        };
        getMyPaths();
    }, [startNode, endNode, selectedAlgorithm]);

    // auto-select floor id for start node
    useEffect(() => {
        if (bfsPath.length > 0 && startNode) {
            const startFloor = availableFloors.find(
                (f) => f.buildingId === startNode.buildingId && f.floor === startNode.floor
            );
            if (startFloor) {
                setCurrentFloorId(startFloor.id);
            }
        }
    }, [bfsPath, startNode]);

    // Handle floor change
    const handleFloorChange = (floorId: string) => {
        setCurrentFloorId(floorId);
    };

    // seperate out current floor for PP and CH
    // Get the current Patriot Place floor data
    const getCurrentPatriotPlaceFloor = () => {
        let floorId = currentFloorId;
        if (!floorId?.startsWith('PP-')) {
            floorId = 'PP-1'; // Default to PP-1 if not a PP floor
        }

        // Find the floor data
        return (
            availableFloors.find((f) => f.id === floorId) ||
            availableFloors.find((f) => f.id === 'PP-1')!
        );
    };

    const getChestnutHillFloor = () => {
        return availableFloors.find((f) => f.id === 'CH-1')!;
    };


    const chestnutHillFloor = getChestnutHillFloor();
    const patriotPlaceFloor = getCurrentPatriotPlaceFloor();

    const getCurrentFloorPath = (buildingId: string, floorNumber: string) => {
        return bfsPath.filter(
            (node) => node.buildingId === buildingId && node.floor === floorNumber
        );
    };

    const getCurrentFloorInfo = () => {
        if (!currentFloorId) return { buildingId: "1", floor: "1" };

        const currentFloor = availableFloors.find(f => f.id === currentFloorId);
        if (!currentFloor) return { buildingId: "1", floor: "1" };

        return {
            buildingId: currentFloor.buildingId,
            floor: currentFloor.floor
        };
    };

// Then use these in your component:
    const { buildingId, floor } = getCurrentFloorInfo();


    return (
        <>
            {showTextDirections && (
                <TextToSpeechMapComponent
                    walkDirections={directions1}
                    driveDirections={driveDirections}
                    drive22Directions={drive2Directions}
                    walk22Directions={directions11}
                />
            )}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-r-md cursor-pointer z-20">
                <FloorSelector currentFloorId={currentFloorId} onChange={handleFloorChange} />
            </div>
        <div className="relative w-full h-full">
            <OverlayComponent
                bounds={ChestnutHillBounds}
                imageSrc={chestnutHillFloor.svgPath}
            />
            <OverlayComponent
                bounds={PatriotPlaceBounds}
                imageSrc={patriotPlaceFloor.svgPath}
            />
            <OverlayComponent
                bounds={FaulknerBounds}
                imageSrc={'/FK01.svg'}
            />
            {visible &&
            <DisplayPathComponent coordinates={GetPolylinePath(getCurrentFloorPath(buildingId, floor))} />
            }
            {/*<DisplayPathComponent coordinates={coords} />*/}
        </div>
        </>
    );
};

export default HospitalMapComponent;
