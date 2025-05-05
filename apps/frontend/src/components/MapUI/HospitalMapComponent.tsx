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

function createTextPath(traversalResult: myNode[] | undefined | null, units: 'Feet' | 'Meters'): [string[], string[] ]{
    // Make sure a path exists
    if (!traversalResult) {
        console.log('No Path');
        return [[],[]];
    }
    const directions = [];
    const icons=[];
    let currentFacing = new Vector(0, 0);

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

        if(currentNode.nodeType === nextNode.nodeType && (!textDirection.includes("left") || !textDirection.includes("right"))) {
            const nextChange = indexOfNextChange(traversalResult as myNode[], i, currentFacing, currentNode.nodeType);
            if(nextChange !== -1) {
                i = nextChange - 1; // Because i will increase at the end of the loop
                const lastNode = traversalResult[i];
                const nextNode = traversalResult[nextChange];
                if(currentNode.nodeType === "Elevator" || currentNode.nodeType === "Stairs") {
                    // Take elevator instructions
                    directions.push(
                        `Take the ${currentNode.nodeType} to the ${lastNode.floor}${getNumberSuffix(traversalResult[i].floor)} floor`
                    );
                    icons.push(currentNode.nodeType.toLowerCase());
                    // Instructions to exit elevator
                    directions.push(`From the ${lastNode.nodeType} continue straight for ${distance.toFixed(1)} ${units.toLowerCase()} until you reach the ${nextNode.nodeType}`);
                    icons.push(`${textDirection}`);

                    // Calculate new direction when exiting elevators/stairs
                    const dy = nextNode.y - lastNode.y;
                    const dx = nextNode.x - lastNode.x;
                    currentFacing = new Vector(dx, dy);
                }else {
                    // Normal Directions for skipping middle nodes
                    directions.push(`From the ${currentNode.nodeType} ${textDirection} for ${distance.toFixed(1)} ${units.toLowerCase()} until you reach the ${traversalResult[nextChange].nodeType}`);
                    icons.push(`${textDirection}`);
                }
                continue;
            }
        }
        // Normal Directions no skipping
        directions.push(`From the ${currentNode.nodeType} ${textDirection} for ${distance.toFixed(1)} ${units.toLowerCase()} until you reach the ${nextNode.nodeType}`);
        icons.push(`${textDirection}`);

    }
    return [directions, icons];
}


function indexOfNextChange(traversalResult: myNode[], startIndex: number, startFacing: Vector, startNodeType: string){
    let currentFacing = startFacing;
    for(let j = startIndex; j < traversalResult.length; j++) {
        const currentNode = traversalResult[j];
        const nextNode = traversalResult[j + 1];
        if (!nextNode) {
            return j;
        }
        // Go til next turn or different node
        const dy = nextNode.y - currentNode.y;
        const dx = nextNode.x - currentNode.x;
        // Get the direction the user will be facing
        const newFacing = new Vector(dx, dy);
        const textDirection = determineDirection(currentFacing.angleTo(newFacing));
        // Make the user's current direction the new direction
        currentFacing = newFacing;
        if(currentNode.nodeType === "Elevator" || currentNode.nodeType === "Stairs"){
            continue;
        }
        if(textDirection.includes("left") || textDirection.includes("right") || currentNode.nodeType !== startNodeType) {
            return j;
        }
    }
    return -1;
}

function determineDirection(angle: number): string {
    const absAngle = Math.abs(angle);

    if (absAngle < 45) {
        return 'continue straight';
    } else if (angle > 0) {
        return 'turn right then continue straight';
    } else {
        return 'turn left then continue straight';
    }
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
    onFloorChange: (floorId: string) => void;
    onAutoSwitchFloor: (startFloorId: string) => void;
    autoFloorSwitchEnabled: boolean; // New prop to control auto floor switching

    visible: boolean;
    driveDirections: string;
    drive2Directions: string[];
    showTextDirections: boolean;
    currentStep: string;
    distanceUnits: 'Feet' | 'Meters';
    setDistanceUnits: (units: 'Feet' | 'Meters') => void;
    showBuildingDirections: boolean;
}

const HospitalMapComponent = ({
    map,
    startNodeId,
    endNodeId,
    selectedAlgorithm,
    currentFloorId,
    onFloorChange,
    onAutoSwitchFloor,
    autoFloorSwitchEnabled,
    visible,
    driveDirections,
    drive2Directions,
    showTextDirections,
    currentStep,
    distanceUnits,
    setDistanceUnits,
    showBuildingDirections,
}: Props) => {
    const [bfsPath, setBFSPath] = useState<myNode[]>([]);
    const [startNode, setStartNode] = useState<myNode>();
    const [endNode, setEndNode] = useState<myNode>();
    const [textSpeech, setTextSpeech] = useState<HTMLElement | null>(null);

    const [destinationFloorId, setDestinationFloorId] = useState<string | undefined>();
    const [showDestinationFloorAlert, setShowDestinationFloorAlert] = useState<boolean>(false);

    const [showDirectionsAndSpeak, setShowDirectionsAndSpeak] = useState<boolean>(false);
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

    useEffect(() => {
        if(!showBuildingDirections){
            setShowDirectionsAndSpeak(false)
            setEndNode(startNode)
        }

    }, [showBuildingDirections]);

    useEffect(() => {
        if (currentStep==='DEPARTMENT'&&endNode){
            setShowDirectionsAndSpeak(true)
        }else{
            setShowDirectionsAndSpeak(false);
        }
    }, [currentStep, endNode]);

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
                    const [textDirection, icons] = createTextPath(result, distanceUnits);
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

    useEffect(() => {
        console.log("auto " + autoFloorSwitchEnabled)
        if (bfsPath.length > 0 && startNode && autoFloorSwitchEnabled) {
            const startFloor = availableFloors.find(
                (f) => f.buildingId === startNode.buildingId && f.floor === startNode.floor
            );
            if (startFloor) {
                setStartFloor(startFloor);
                // Only trigger the auto floor switch if enabled and not already done
                onAutoSwitchFloor(startFloor.id);
                highlightDestinationFloor(bfsPath);
                console.log("auto switch floor to " + startFloor.id);

            }
        }
    }, [bfsPath, startNode]);



    // seperate out current floor for PP and CH
    // Get the current Patriot Place floor data

    const getCurrentPatriotPlaceFloor = () => {
        let floorId
        if (currentFloorId){
            floorId = currentFloorId; // dont change
            onAutoSwitchFloor(currentFloorId);
        }
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
            {showTextDirections && currentStep ==='DIRECTIONS' &&(

                    <div className="fixed -top-34">
                        <TextToSpeechMapComponent
                            walkDirections={directions1}
                            driveDirections={driveDirections}
                            drive22Directions={drive2Directions}
                            walk22Directions={directions11}
                            distanceUnits={distanceUnits}
                            setDistanceUnits={setDistanceUnits}
                            icons={iconsToPass}
                            currentStep={currentStep}
                        />
                    </div>

            )}

            {showDirectionsAndSpeak && (

                <div >
                    <TextToSpeechMapComponent
                        walkDirections={directions1}
                        driveDirections={driveDirections}
                        drive22Directions={drive2Directions}
                        walk22Directions={directions11}
                        distanceUnits={distanceUnits}
                        setDistanceUnits={setDistanceUnits}
                        icons={iconsToPass}
                        currentStep={currentStep}
                    />
                </div>

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
