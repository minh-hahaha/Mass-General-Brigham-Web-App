import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Map, useMap, useMapsLibrary, RenderingType } from '@vis.gl/react-google-maps';
import HospitalMapComponent from '@/components/MapUI/HospitalMapComponent.tsx';
import {ZoomIn } from 'lucide-react';

import {
    DirectoryRequestByBuilding,
    getDirectory,
} from '@/database/gettingDirectory.ts';
import { GetRecentOrigins, RecentOrigin } from '@/database/recentOrigins.ts';

import AlgorithmSelector from '@/components/AlgorithmSelector.tsx';
import DisplayPathComponent from "@/components/MapUI/DisplayPathComponent.tsx";
import MapSidebarComponent from "@/components/MapUI/MapSidebarComponent.tsx";
import FloorSelector from "@/components/MapUI/FloorSelector.tsx";

const HospitalLocations: Record<string, {lat: number, lng: number, zoom: number}> = {
    'Chestnut Hill Healthcare Center': {lat: 42.32597821672779, lng: -71.15010553538171, zoom: 19.5},
    'Foxborough Healthcare Center': {lat: 42.09269784233279, lng: -71.26699731871597, zoom: 19},
    'Brigham and Women\'s Faulkner Hospital': {lat: 42.301831397258184, lng: -71.12930670737964, zoom: 18},
    'Brigham and Women\'s Main Hospital': {lat: 42.33568522412911, lng: -71.10787475448217, zoom: 18}
};

const BuildingIDMap: Record<string, number> = {
    'Chestnut Hill Healthcare Center': 1,
    'Foxborough Healthcare Center': 2,
    'Brigham and Women\'s Faulkner Hospital': 3,
    'Brigham and Women\'s Main Hospital': 4
};

type TravelModeType = 'DRIVING' | 'TRANSIT' | 'WALKING';

// floor type
interface Floor {
    id: string;
    floor: string;
    buildingId: string;
    buildingName: string; // for display
    svgPath: string;
}
type Step = 'SELECT_HOSPITAL' | 'HOSPITAL_DETAIL' | 'DIRECTIONS' | 'DEPARTMENT';


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



// Define the interface
interface Coordinate {
    lat: number;
    lng: number;
}

const DirectionsMapComponent = () => {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState(''); // coordinates of the hospital
    const [toHospital, setToHospital] = useState(''); // name of the hospital

    const [travelMode, setTravelMode] = useState<TravelModeType>('DRIVING');
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [showRouteInfo, setShowRouteInfo] = useState(false);
    const [directoryList, setDirectoryList] = useState<DirectoryRequestByBuilding[]>([]);
    const [recentOrigins, setRecentOrigins] = useState<RecentOrigin[]>([]);

    const [currentDirectoryName, setCurrentDirectoryName] = useState('');

    const [fromNodeId, setFromNodeId] = useState('');
    const [toDirectoryNodeId, setToDirectoryNodeId] = useState('');

    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

    const [buildingID, setBuildingID] = useState<number>(0);

    const [textDirections, setTextDirections] = useState<string>('No destination/start selected');
    const [text2Directions, setText2Directions] = useState<string[]>([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('BFS');

    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const [currentFloorId, setCurrentFloorId] = useState<string | undefined>('');
    const [showFloorSelector, setShowFloorSelector] = useState<boolean>(false);
    const [highlightFloorId, setHighlightFloorId] = useState<string | undefined>();

    const [currentStep, setCurrentStep] = useState<Step>('SELECT_HOSPITAL');

    useEffect(() => {
        const fetchOrigins = async () => {
            const data: RecentOrigin[] = await GetRecentOrigins();
            console.log('Origins: ' + data);
            setRecentOrigins(data);
        };
        fetchOrigins();
    }, []);

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [map, routesLibrary]);


    /*
        CH - 1
        PP22 - 2
        PP20 -3
        FK -4
        MG - 5
     */

    /*
        CH -1
        PP - 2
        FK -3
        MG -4
     */

    // API CALLS
    // get directory list
    useEffect(() => {
        const fetchDirectoryList = async () => {
            try {
                let realBuildingID = buildingID;
                if(realBuildingID !== 1){
                    realBuildingID++;
                }
                console.log(realBuildingID);
                const directories: DirectoryRequestByBuilding[] = [];
                const data = await getDirectory(realBuildingID);
                console.log(data);
                data.map(d => directories.push(d));
                if(realBuildingID === 3){
                    const otherPP = await getDirectory(2);
                    otherPP.map(d => directories.push(d));
                }
                console.log(directories);
                setDirectoryList(directories);
            } catch (error) {
                console.error('Error fetching building names:', error);
            }
        };
        fetchDirectoryList();
        console.log('Updated Directory list');
    }, [buildingID, toLocation]);

    // get the end department nodeId
    useEffect(() => {
        const handleDeptChange = () => {
            console.log('currentDirectoryName - ', currentDirectoryName);
            const dept = directoryList.find((dept) => dept.deptName === currentDirectoryName);
            //checks null
            if (dept) {
                setToDirectoryNodeId(dept.nodeId);
                console.log("DEPT NODE ID: " + dept.nodeId);
            } else {
                setToDirectoryNodeId('');
            }
        };
        handleDeptChange();
    }, [currentDirectoryName]);

    // find new direction when from and to location change
    useEffect(() => {
        if (toLocation && fromLocation) {
            handleFindDirections();
        }
    }, [fromLocation, toLocation]);

    // update floor selector visibility
    useEffect(() => {
        setShowFloorSelector(buildingID === 2);
    }, [buildingID]);

    // find directions
    const handleFindDirections = async () => {
        calculateRoute();
    };

    const handleAlgorithmChange = (algorithm: string) => {
        setSelectedAlgorithm(algorithm);
    };

    const handleFloorChange = (floorId: string) => {
        setCurrentFloorId(floorId);
        console.log('changed floor to : ', floorId);
    }
    // Handler for floor changes from HospitalMapComponent
    const handleFloorHighlight = (floorId: string) => {
        // Set the floor to highlight
        setHighlightFloorId(floorId);

        // Clear highlight after 5 seconds
        setTimeout(() => {
            setHighlightFloorId(undefined);
        }, 2000);
    };
    // draw route
    const calculateRoute = () => {
        if (!directionsRenderer || !directionsService) return;
        directionsRenderer.setMap(map);
        const googleTravelMode =
            google.maps.TravelMode[travelMode as keyof typeof google.maps.TravelMode];

        directionsService
            .route({
                origin: fromLocation,
                destination: toLocation,
                travelMode: googleTravelMode,
                provideRouteAlternatives: false,
            })
            .then((response) => {
                directionsRenderer.setDirections(response);
                setRoutes(response.routes);

                if (response.routes.length > 0 && response.routes[0].legs.length > 0) {
                    const leg = response.routes[0].legs[0];
                    setDistance(leg.distance?.text || 'N/A');
                    setDuration(leg.duration?.text || 'N/A');
                    setShowRouteInfo(true);

                    const htmlStr: string = leg.steps
                        .map(
                            (direction) =>
                                `${direction.instructions} and continue for ${direction.distance ? direction.distance.text : ''}`
                        )
                        .toString();
                    console.log(htmlStr.split(","));
                    setText2Directions(htmlStr.split(","));
                    console.log(htmlStr.replace(/,/g, '<br><br>'));
                    setTextDirections(htmlStr.replace(/,/g, '<br><br>'));
                }
            });
    };

    const clearRoute = () => {
        if (!directionsRenderer) return;

        // First set the map to null to clear the route
        directionsRenderer.setMap(null);

        // Create a minimal valid DirectionsResult object
        const emptyResult = {
            routes: [],
            geocoded_waypoints: [],
            request: {} as google.maps.DirectionsRequest
        } as google.maps.DirectionsResult;

        // Reset the directions with valid empty result
        directionsRenderer.setDirections(emptyResult);

        // Reset the route info
        setShowRouteInfo(false);
        setDistance('');
        setDuration('');
        setTextDirections('No destination/start selected');
        setText2Directions([]);
    };


    const handleZoomToHospital = () => {
        const hospital = Object.entries(HospitalLocations).find(
            ([name]) => BuildingIDMap[name] === buildingID
        )
        if(hospital){
            if (map){
                map.panTo({lat: hospital[1].lat, lng: hospital[1].lng}); // location
                map.setZoom(hospital[1].zoom);
            }

        }
        // if (!map || !toHospital) return;
        //
        // console.log("toHospital name " + toHospital);
        // const hospitalLocation = HospitalLocations[toHospital];
        // if (hospitalLocation) {
        //     map.panTo({ lat: hospitalLocation.lat, lng: hospitalLocation.lng });
        //     map.setZoom(hospitalLocation.zoom);
        // }
    };


    // step 1: choose a hospital
    // set building Id 1,2,3,4
    // set currentFloorId
    // show Floor Selector if Patriot Place
    // zoom in to hospital
    const handleHospitalSelect = (hospitalId: number)  => {
        setLot('');
        setPathVisible(false);

        const hospital = Object.entries(HospitalLocations).find(
            ([name]) => BuildingIDMap[name] === hospitalId
        )

        if(hospital){
            setBuildingID(hospitalId); // set building
            setCurrentFloorId(availableFloors.find(f => f.buildingId === hospitalId.toString())?.id)
            if(hospitalId === 2){
                setShowFloorSelector(true)
            }
            if (map){
                map.panTo({lat: hospital[1].lat, lng: hospital[1].lng}); // location
                map.setZoom(hospital[1].zoom);
            }

        }
    }

    const handleDirectionRequest = (from: string, to: string, toHospital: string, mode: TravelModeType) => {
        console.log("Direction request received:", from, to, toHospital, mode);

        clearRoute()

        setFromLocation(from);
        setToLocation(to);
        setTravelMode(mode);
        setToHospital(toHospital);

            if (mode === 'DRIVING') {
                setParking(true);
            } else {
                setParking(false);
                setLot('');
            }

            // // Make sure the map is clear before recalculating
            // if (directionsRenderer) {
            //     directionsRenderer.setMap(null);
            // }

            setTimeout(() => {
                calculateRoute();

            },300)
    };

    const handleFindDepartment = () =>{
        handleZoomToHospital();
    }


    const handleDepartmentSelect = (departmentNodeId: string) => {
        setToDirectoryNodeId(departmentNodeId);
        setPathVisible(true);
        clearRoute();
    }

    const [lot, setLot] = useState('');
    const [parking, setParking] = useState(true);
    const [pathVisible, setPathVisible] = useState(false);

    const clearParking = () => {
        setLot('');
    };

    const handleParkingSelect = (lotId: string) => {
        setLot(lotId)
    }

    // get start node
    useEffect(() => {
        if (lot !== "") {
            // get prefix and lot letter
            const [locationPrefix, lotLetter] = lot.split('_');

            if (locationPrefix === 'PP') {
                setFromNodeId(`PPFloor1Parking Lot${lotLetter}`);
            } else if (locationPrefix === 'FK') {
                if (lotLetter === 'A') {
                    setFromNodeId('FKFloor1Parking Lot');
                } else if (lotLetter === 'B') {
                    setFromNodeId('FKFloor1Parking Lot_1');
                } else if (lotLetter === 'C') {
                    setFromNodeId('FKFloor1Parking Lot_2');
                }
            } else if (locationPrefix === 'CH') {
                if (lotLetter === 'A') {
                    setFromNodeId('CHFloor1Parking Lot1');
                } else if (lotLetter === 'B') {
                    setFromNodeId('CHFloor1Parking LotB');
                } else if (lotLetter === 'C') {
                    setFromNodeId('CHFloor1Parking LotC');
                }
            }else if (locationPrefix === 'BWH') {
                if (lotLetter === 'A') {
                    setFromNodeId('BWFloor2Parking Lot');
                } else if (lotLetter === 'B') {
                    setFromNodeId('BWFloor2Parking Lot');
                } else if (lotLetter === 'C') {
                    setFromNodeId('BWFloor2Parking Lot');
                }
            }
        }
        // for no parking lot
        else{
            switch (buildingID){
                case 1:
                    setFromNodeId("CHFloor1Road3")
                    break;
                case 2:
                    setFromNodeId("PPFloor1Road10")
                    break;
                case 3:
                    setFromNodeId("FKFloor1Road")
                    break;
                case 4:
                    setFromNodeId("BWFloor2Road_1")
                    break;
            }
        }

    }, [lot, buildingID]);



    const handleBack = (currentStep: string) => {
        if (currentStep === "DEPARTMENT") {
            setPathVisible(false);
            clearParking();
            setToDirectoryNodeId("")
        }
        if (currentStep === "DIRECTIONS") {
            setToLocation('');
        }
        if (currentStep === "HOSPITAL_DETAIL") {
            setFromNodeId("")
            setShowFloorSelector(false);
            setBuildingID(0)
        }
        else{
            clearRoute();
            clearParking();
        }

    }

    return (
        <div className="flex w-screen h-screen">
            {/* LEFT PANEL */}
            <div className="relative flex items-start">
                <aside className="relative top-6 left-6 z-10 w-[400px] max-h-[80vh] bg-white p-6 rounded-t-lg rounded-r-lg rounded-l-lg overflow-hidden flex flex-col">
                    <MapSidebarComponent
                        onDirectionsRequest={handleDirectionRequest}
                        onHospitalSelect={handleHospitalSelect}
                        onDepartmentSelect={handleDepartmentSelect}
                        onParkingSelect={handleParkingSelect}
                        onClickingBack={handleBack}
                        onClickFindDepartment={handleFindDepartment}
                        onChoosingAlgo={handleAlgorithmChange}
                        directoryList={directoryList}
                        setCurrentStepProp={setCurrentStep}
                        currentStep={currentStep}
                    />
                </aside>
                {showFloorSelector && (
                    <div className="relative top-6 left-8 z-10 ">
                        <FloorSelector
                            currentFloorId={currentFloorId}
                            onChange={handleFloorChange}
                            highlightFloorId={highlightFloorId}
                        />
                    </div>
                )
                }

            </div>

            {/* MAP AREA */}
            <main className="absolute inset-0 z-0">
                <Map
                    style={{ width: '100%', height: '100%' }}
                    defaultCenter={{ lat: 42.32598, lng: -71.14957 }}
                    defaultZoom={15}
                    renderingType={RenderingType.RASTER}
                    disableDefaultUI={true}
                    mapId={'73fda600718f172c'}
                >
                    <HospitalMapComponent
                        startNodeId={fromNodeId}
                        endNodeId={toDirectoryNodeId}
                        selectedAlgorithm={selectedAlgorithm}
                        visible={pathVisible}
                        currentFloorId={currentFloorId}
                        onFloorChange={handleFloorHighlight}

                        driveDirections={textDirections}
                        drive2Directions={text2Directions}
                        showTextDirections={!!toLocation}
                        currentStep={currentStep}
                    />
                </Map>

                {/* Route Info Box */}
                {showRouteInfo && (
                    <div className="absolute bottom-4 right-6 p-4 z-10 bg-white rounded-xl shadow-lg text-sm text-gray-800 max-w-sm space-y-1">
                        <h3 className="font-bold text-base mb-1 text-mgbblue">Route Info</h3>
                        <p>
                            <span className="font-medium">Distance:</span> {distance}
                        </p>
                        <p>
                            <span className="font-medium">Travel Time:</span> {duration}
                        </p>
                    </div>
                )}

            </main>
        </div>
    );
};

export default DirectionsMapComponent;