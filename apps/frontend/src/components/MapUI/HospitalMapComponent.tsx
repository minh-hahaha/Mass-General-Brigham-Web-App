import FloorSelector from '@/components/MapUI/FloorSelector.tsx';
import { useState, useEffect } from 'react';
import { ROUTES } from 'common/src/constants.ts';
import axios from 'axios';
import TextToSpeechMapComponent from '@/components/TextToSpeechMapComponent.tsx';
import {myEdge, myNode} from 'common/src/classes/classes.ts';
import OverlayComponent from '@/components/MapUI/OverlayMapComponent.tsx';
import { GetNode } from '@/database/getDepartmentNode.ts';
import DisplayPathComponent from '@/components/MapUI/DisplayPathComponent.tsx';
import Map3D from "@/components/MapUI/Map3D.tsx";

const ChestnutHillBounds = {
    southWest: { lat: 42.32543670863917, lng: -71.15022693442262 }, // Bottom-left corner
    northEast: { lat: 42.32649756743757, lng: -71.14898211823991 }, // Top-right corner
};

const PatriotPlaceBounds = {
    southWest: { lat: 42.09086272947439, lng: -71.2675430325 }, // Bottom-left corner
    northEast: { lat: 42.09342690806031, lng: -71.2649785507 }, // Top-right corner
};
const FaulknerBounds = {
    southWest: { lat: 42.300397452801334, lng: -71.13067929034223 }, // Bottom-left corner
    northEast: { lat: 42.303013662584725, lng: -71.12649564266864}, // Top-right corner
};
const BWHBounds = {
    southWest: { lat: 42.33423529941985, lng: -71.10939107354605}, // Bottom-left corner
    northEast: { lat: 42.33712348778656, lng: -71.10387302007483}, // Top-right corner
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

    { id: "BWH-2", floor: "2", buildingId: "4", buildingName: "Main Hospital",svgPath: "/BWH02.svg" },
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

function createTextPath2(traversalResult: myNode[] | undefined | null, units: 'Feet' | 'Meters'): [string[], string[] ]{
    // Make sure a path exists
    if (!traversalResult) {
        console.log('No Path');
        return [[],[]];
    }
    const directions = [];
    const icons=[];
    let currentFacing = new Vector(0, 0);
    let skipTraversing = false;
    let startingSkipNode = undefined;
    let startingSkipDirections = '';
    
    // Loop through all nodes
    for(let i = 0; i < traversalResult.length; i++) {
        const currentNode = traversalResult[i];
        const nextNode = traversalResult[i + 1];

        if (!nextNode) {
            directions.push(`You have arrived at ${currentNode.name}`);
            break;
        }
        const edge = new myEdge(-1, currentNode, nextNode);
        const distance = units === "Meters" ? edge.distanceMeters : edge.distanceFeet;
        const dy = nextNode.y - currentNode.y;
        const dx = nextNode.x - currentNode.x;
        // Get the direction the user will be facing
        const newFacing = new Vector(dx, dy);
        const textDirection = determineDirection(currentFacing.angleTo(newFacing));
        // Make the user's current direction the new direction
        currentFacing = newFacing;
        console.log(textDirection);
        if(!skipTraversing && currentNode.nodeType === nextNode.nodeType && (!textDirection.includes("left") || !textDirection.includes("right"))) {
           skipTraversing = true;
           startingSkipNode = currentNode;
           startingSkipDirections = textDirection;
        }else if(skipTraversing && currentNode.nodeType !== nextNode.nodeType || (textDirection.includes("left") || textDirection.includes("right"))) {
            if(startingSkipNode) {
                skipTraversing = false;
                directions.push(`From the ${startingSkipNode.nodeId} ${startingSkipDirections} for ${distance.toFixed(1)} ${units.toLowerCase()} until you reach the ${currentNode.nodeId}`);
                icons.push('continue straight');
                directions.push(`From the ${currentNode.nodeId} ${textDirection} for ${distance.toFixed(1)} ${units.toLowerCase()} until you reach the ${nextNode.nodeId}`);
                icons.push(`${textDirection}`);
                startingSkipNode = undefined;
                startingSkipDirections = '';
            }
        }else if(!skipTraversing){
            directions.push(`From the ${currentNode.nodeId} ${textDirection} for ${distance.toFixed(1)} ${units.toLowerCase()} until you reach the ${nextNode.nodeId}`);
            icons.push(`${textDirection}`);
        }
        
    }
    console.log("DIRECTIONS",directions);
    return [directions, icons];
    
}
function createTextPath(traversalResult: myNode[] | undefined | null, units: 'Feet' | 'Meters'): [string[], string[] ]{
    // Make sure a path exists
    if (!traversalResult) {
        console.log('No Path');
        return [[],[]];
    }

    // Initial facing direction. TODO: need to be able to figure out direction for the first node
    // Currently hardcoded for each location
    const StartDirs = [
        { key: 'CH', dir: new Vector(0, traversalResult[0].y + 50) },
        { key: '20PP', dir: new Vector(traversalResult[0].x + 50, 0) },
        { key: '22PP', dir: new Vector(0, traversalResult[0].y + 50) },
        { key: 'FK', dir: new Vector(traversalResult[0].x + 50, 0) },
    ];
    const directions = [];
    const icons=[];
    const startDir = StartDirs.find((value) => traversalResult[0].nodeId.includes(value.key));
    let currentDirection;
    if (!startDir) {
        currentDirection = new Vector(0, 0);
    } else {
        currentDirection = startDir.dir;
    }
    // Traversing floors: when the user is taking the elevator or stairs
    let traversingFloors = false;
    let traversingSameNodeTypes = false;
    let totalTraverseDistance = 0;
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
            icons.push('elevator');
        }
        if(nextNode.nodeType === currentNode.nodeType && determineDirection(angle).includes("Left") || determineDirection(angle).includes("Right")) {
            console.log(nextNode.nodeId, "same as", currentNode.nodeId, "and is not turn");
            const tempEdge = new myEdge(-1, currentNode, nextNode);
            traversingSameNodeTypes = true;
            totalTraverseDistance += tempEdge.distanceFeet;
        }else if(traversingSameNodeTypes && nextNode.nodeType !== currentNode.nodeType){
            console.log(nextNode.nodeId, "not same as", currentNode.nodeId, " finish");
            traversingSameNodeTypes = false;
            directions.push(
                `From the ${currentNode.nodeId} continue straight for ${totalTraverseDistance.toFixed(1)} feet until you reach the ${nextNode.nodeId}`
            );
            totalTraverseDistance = 0;
        }
        // The default instructions if not traversing floors or if getting off the elevator/stairs
        if(!traversingSameNodeTypes) {
            if (
                !traversingFloors ||
                (traversingFloors && nextNode.nodeType !== 'Elevator' && nextNode.nodeType !== 'Stairs')
            ) {
                console.log("trav same node", traversingSameNodeTypes, 'but doing it anyway');
                const tempEdge = new myEdge(-1, currentNode, nextNode);
                const distance = units === 'Meters' ? tempEdge.distanceMeters : tempEdge.distanceFeet;
                directions.push(
                    `From the ${currentNode.nodeId} ${determineDirection(angle)} for ${distance.toFixed(1)} ${units.toLowerCase()} until you reach the ${nextNode.nodeId}`
                );
                icons.push(`${determineDirection(angle)}`);
            }
        }
    }

    return [directions, icons];
}

function determineDirection(angle: number): string {
    let prefix = '';
    if (angle < -75 && angle > -105) {
        prefix = 'turn left then ';
    } else if (angle > 75 && angle < 105) {
        prefix = 'turn right then ';
    }
    return prefix + 'continue straight';
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


// interface for prop
interface Props {
    map: google.maps.Map;
    startNodeId: string;
    endNodeId: string;
    selectedAlgorithm: string;
    currentFloorId: string | undefined;
    onFloorChange?: (floorId: string) => void;


    visible: boolean;
    driveDirections: string;
    drive2Directions: string[];
    showTextDirections: boolean;
    currentStep: string;
    distanceUnits: 'Feet' | 'Meters';
    setDistanceUnits: (units: 'Feet' | 'Meters') => void;
}

const HospitalMapComponent = ({
    map,
    startNodeId,
    endNodeId,
    selectedAlgorithm,
    currentFloorId,
    onFloorChange,
    visible,
    driveDirections,
    drive2Directions,
    showTextDirections,
    currentStep,
    distanceUnits,
    setDistanceUnits
}: Props) => {
    const [bfsPath, setBFSPath] = useState<myNode[]>([]);
    const [startNode, setStartNode] = useState<myNode>();
    const [endNode, setEndNode] = useState<myNode>();
    const [textSpeech, setTextSpeech] = useState<HTMLElement | null>(null);

    const [destinationFloorId, setDestinationFloorId] = useState<string | undefined>();
    const [showDestinationFloorAlert, setShowDestinationFloorAlert] = useState<boolean>(false);


    const [startFloor, setStartFloor] = useState<Floor>();
    const [directions1, setDirections1] = useState('');
    const [directions11, setDirections11] = useState<string[]>([]);
    const [iconsToPass, setIconsToPass] = useState<string[]>([]);

    console.log("startNodeId - ", startNodeId);
    console.log("endNodeId - ", endNodeId);
    useEffect(() => {
        const fetchNode = async () => {
            try {
                const start = await GetNode(startNodeId);
                const end = await GetNode(endNodeId);
                setStartNode(start);
                setEndNode(end);
            } catch (error) {
                console.error('Error fetching building names:', error);
            }
        };
        fetchNode();
    }, [startNodeId, endNodeId]);

    // Find path and text directions
    useEffect(() => {
        const getMyPaths = async () => {
            if (startNode && endNode) {
                try {
                    const result = await FindPath(startNode, endNode, selectedAlgorithm);
                    setBFSPath(result);
                    console.log("Path is " + result);
                    highlightDestinationFloor(result);

                    // text directions
                    const [textDirection, icons] = createTextPath2(result, distanceUnits);
                    setIconsToPass(icons);
                    setDirections1(textDirection.join('<br><br>'));
                    setDirections11(textDirection);
                } catch (error) {
                    console.error('Error finding path:', error);
                    setBFSPath([]);
                }
            } else {
                setBFSPath([]);
            }
        };
        getMyPaths();
    }, [startNode, endNode, selectedAlgorithm, distanceUnits]);

    // function to highlight the destination floor
    const highlightDestinationFloor = (path: myNode[]) => {
        if (!path || path.length === 0) return;

        // get last node info
        const destination = path[path.length - 1];
        const destinationBuildingId = destination.buildingId;
        const destinationFloorNumber = destination.floor;

        // Find the corresponding floor ID
        const destinationFloor = availableFloors.find(
            f => f.buildingId === destinationBuildingId && f.floor === destinationFloorNumber
        );

        if (destinationFloor && destinationFloor.id !== currentFloorId) {
            setDestinationFloorId(destinationFloor.id);
            setShowDestinationFloorAlert(true);

            // pass back to directions map component
            if (onFloorChange) {
                onFloorChange(destinationFloor.id);
            }

            //hide
            setTimeout(() => {
                setShowDestinationFloorAlert(false);
            }, 3000);
        } else {
            setShowDestinationFloorAlert(false);
        }
    };

    // Get destination floor name for alert
    const getDestinationFloorName = () => {
        if (!destinationFloorId) return "";

        const floor = availableFloors.find(f => f.id === destinationFloorId);
        if (!floor) return "";

        return `Floor ${floor.floor}`;
    };

    // auto-select floor id for start node
    useEffect(() => {
        if (bfsPath.length > 0 && startNode) {
            const startFloor = availableFloors.find(
                (f) => f.buildingId === startNode.buildingId && f.floor === startNode.floor
            );
            if (startFloor) {
                setStartFloor(startFloor);
            }
        }
    }, [bfsPath, startNode]);



    // seperate out current floor for PP and CH
    // Get the current Patriot Place floor data

    const getCurrentPatriotPlaceFloor = () => {
        let floorId = currentFloorId;
        if (!floorId?.startsWith('PP-')) floorId = 'PP-1';
        return (
            availableFloors.find((f) => f.id === floorId) ||
            availableFloors.find((f) => f.id === 'PP-1')!
        );
    };

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

    const { buildingId, floor } = getCurrentFloorInfo();
    console.log( " buildingId " + buildingId);
    console.log( " floor " + floor);

    return (
        <>
            {showTextDirections && (
                currentStep === 'DEPARTMENT' ? (
                    <TextToSpeechMapComponent
                        walkDirections={directions1}
                        driveDirections={driveDirections}
                        drive22Directions={drive2Directions}
                        walk22Directions={directions11}
                        distanceUnits={distanceUnits}
                        setDistanceUnits={setDistanceUnits}
                        icons={iconsToPass}
                    />
                ) : (
                    <div className="fixed -top-34">
                        <TextToSpeechMapComponent
                            walkDirections={directions1}
                            driveDirections={driveDirections}
                            drive22Directions={drive2Directions}
                            walk22Directions={directions11}
                            distanceUnits={distanceUnits}
                            setDistanceUnits={setDistanceUnits}
                            icons={iconsToPass}
                        />
                    </div>
                )
            )}

            {/* Destination Floor Alert */}
            {showDestinationFloorAlert && destinationFloorId && (
                <div className="fixed top-20 right-6 bg-mgbblue text-white p-4 rounded-lg shadow-lg z-50 animate-bounce">
                    <p className="font-bold">Destination Floor</p>
                    <p>Your destination is on {getDestinationFloorName()}</p>
                </div>
            )}


        <div className="relative w-full h-full">
            {map && <Map3D map={map}/>}
            {/*<OverlayComponent*/}
            {/*    bounds={ChestnutHillBounds}*/}
            {/*    imageSrc={"/CH01.svg"}*/}
            {/*/>*/}


            <OverlayComponent
                bounds={PatriotPlaceBounds}
                imageSrc={patriotPlaceFloor.svgPath}
            />
            <OverlayComponent
                bounds={FaulknerBounds}
                imageSrc={'/FK01.svg'}
            />
            <OverlayComponent
                bounds={BWHBounds}
                imageSrc={'/BWH02.svg'}
            />
            {visible &&
                <DisplayPathComponent coordinates={GetPolylinePath(getCurrentFloorPath(buildingId, floor))} />
                // <Path3D map={map} path={GetPolylinePath(getCurrentFloorPath(buildingId, floor))}/>
            }
        </div>
        </>
    );
};

export default HospitalMapComponent;
