import React, { useEffect, useState } from 'react';
import { Map, RenderingType, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import HospitalMapComponent from '@/components/MapUI/HospitalMapComponent.tsx';

import { DirectoryRequestByBuilding, getDirectory } from '@/database/gettingDirectory.ts';
import { GetRecentOrigins, RecentOrigin } from '@/database/recentOrigins.ts';

import AlgorithmSelector from '@/components/AlgorithmSelector.tsx';
import MapSidebarComponent from '@/components/MapUI/MapSidebarComponent.tsx';
import FloorSelector from '@/components/MapUI/FloorSelector.tsx';
import { useLocation } from 'react-router-dom';
import DisplayPathComponent from '@/components/MapUI/DisplayPathComponent.tsx';

const HospitalLocations: Record<string, { lat: number; lng: number; zoom: number }> = {
    'Chestnut Hill Healthcare Center': {
        lat: 42.32597821672779,
        lng: -71.15010553538171,
        zoom: 19.5,
    },
    'Foxborough Healthcare Center': { lat: 42.09269784233279, lng: -71.26699731871597, zoom: 19 },
    "Brigham and Women's Faulkner Hospital": {
        lat: 42.301831397258184,
        lng: -71.12930670737964,
        zoom: 18,
    },
    "Brigham and Women's Main Hospital": {
        lat: 42.33568522412911,
        lng: -71.10787475448217,
        zoom: 18,
    },
};

const BuildingIDMap: Record<string, number> = {
    'Chestnut Hill Healthcare Center': 1,
    'Foxborough Healthcare Center': 2,
    "Brigham and Women's Faulkner Hospital": 3,
    "Brigham and Women's Main Hospital": 4,
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
    {
        id: 'CH-1',
        floor: '1',
        buildingId: '1',
        buildingName: 'Chestnut Hill',
        svgPath: '/CH01.svg',
    },
    // 20 Patriot Place
    {
        id: 'PP-1',
        floor: '1',
        buildingId: '2',
        buildingName: 'Patriot Place',
        svgPath: '/PP01.svg',
    },
    {
        id: 'PP-2',
        floor: '2',
        buildingId: '2',
        buildingName: 'Patriot Place',
        svgPath: '/PP02.svg',
    },
    {
        id: 'PP-3',
        floor: '3',
        buildingId: '2',
        buildingName: 'Patriot Place',
        svgPath: '/PP03.svg',
    },
    {
        id: 'PP-4',
        floor: '4',
        buildingId: '2',
        buildingName: 'Patriot Place',
        svgPath: '/PP04.svg',
    },

    {
        id: 'FK-1',
        floor: '1',
        buildingId: '3',
        buildingName: 'Faulkner Hospital',
        svgPath: '/FK01.svg',
    },

    {
        id: 'BWH-2',
        floor: '2',
        buildingId: '4',
        buildingName: 'Main Hospital',
        svgPath: '/BWH02.svg',
    },
];

// Define the interface
interface Coordinate {
    lat: number;
    lng: number;
}

const DirectionsMapComponent = () => {
    const map = useMap();
    const [map3DOn, setMap3DOn] = useState(true);
    const handleToggleMap3D = () => setMap3DOn(!map3DOn);
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
    const [checkIn, setCheckIn] = useState(false);
    const [toDirectoryNodeId, setToDirectoryNodeId] = useState('');
    const [showDirections, setShowDirections] = useState<boolean>(false);
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

    const [buildingID, setBuildingID] = useState<number>(0);

    const [textDirections, setTextDirections] = useState<string>('No destination/start selected');
    const [text2Directions, setText2Directions] = useState<string[]>([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('BFS');

    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const [showBuildingDirections, setShowBuildingDirections] = useState(false);
    const [currentFloorId, setCurrentFloorId] = useState<string | undefined>('');
    const [showFloorSelector, setShowFloorSelector] = useState<boolean>(false);
    const [highlightFloorId, setHighlightFloorId] = useState<string | undefined>();
    const [highlightFloor, setHighlightFloor] = useState<boolean>(true);


    const [currentStep, setCurrentStep] = useState<Step>('SELECT_HOSPITAL');

    const [distanceUnits, setDistanceUnits] = useState<'Feet' | 'Meters'>('Feet');

    const location = useLocation();
    const hospital = location.state?.hospital;
    const intent = location.state?.intent;
    const department = location.state?.department;

    console.log('INTENT', intent);

    const normalizedHospital = (name: string) => {
        const map: Record<string, string> = {
            'foxborough health care center': 'Foxborough Healthcare Center',
            'chestnut hill healthcare center': 'Chestnut Hill Healthcare Center',
            "brigham and women's faulkner hospital": "Brigham and Women's Faulkner Hospital",
            "brigham and women's hospital": "Brigham and Women's Main Hospital",
        };
        return name ? map[name.toLowerCase()] : undefined;
    };

    console.log('READ TS', normalizedHospital(hospital));
    console.log('DEP', department);

    useEffect(() => {
        const checkAdmin = () => {
            console.log(sessionStorage.getItem('position'));
            if (sessionStorage.getItem('position') === 'WebAdmin') {
                setIsAdmin(true);
                console.log('admin', isAdmin);
                return;
            }
            setIsAdmin(false);
            console.log('admin', isAdmin);
            return;
        };
        checkAdmin();
    }, []);

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

    // get the end department nodeId
    useEffect(() => {
        const handleDeptChange = () => {
            console.log('currentDirectoryName - ', currentDirectoryName);
            const dept = directoryList.find((dept) => dept.deptName === currentDirectoryName);
            //checks null
            if (dept) {
                setToDirectoryNodeId(dept.nodeId);
                console.log('DEPT NODE ID: ' + dept.nodeId);
            } else {
                setToDirectoryNodeId('');
            }
        };
        handleDeptChange();
    }, [currentDirectoryName]);

    useEffect(() => {
        if (!map || buildingID === 0) return;

        const hospital = Object.entries(HospitalLocations).find(
            ([name]) => BuildingIDMap[name] === buildingID
        );

        if (hospital) {
            map.panTo({ lat: hospital[1].lat, lng: hospital[1].lng });
            map.setZoom(hospital[1].zoom);
        }
    }, [buildingID, map]);

    // find new direction when from and to location change
    useEffect(() => {
        if (toLocation && fromLocation) {
            handleFindDirections();
        }
    }, [fromLocation, toLocation]);

    useEffect(() => {
        if (currentStep !== 'DEPARTMENT') {
            handleFindDirections();
        }
    }, [distanceUnits]);

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

    const [autoFloorSwitchEnabled, setAutoFloorSwitchEnabled] = useState<boolean>(true);
    const handleFloorChange = (floorId: string) => {
        setCurrentFloorId(floorId);
        console.log('changed floor to : ', floorId);
    };
    // Handler for floor changes from HospitalMapComponent
    const handleFloorHighlight = (floorId: string) => {
        // Set the floor to highlight
        setHighlightFloorId(floorId);

        // Clear highlight after 2 seconds
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
                unitSystem:
                    distanceUnits == 'Feet'
                        ? google.maps.UnitSystem.IMPERIAL
                        : google.maps.UnitSystem.METRIC,
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
                    console.log(htmlStr.split(','));
                    setText2Directions(htmlStr.split(','));
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
            request: {} as google.maps.DirectionsRequest,
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
        );
        if (hospital) {
            if (map) {
                map.panTo({ lat: hospital[1].lat, lng: hospital[1].lng }); // location
                map.setZoom(hospital[1].zoom);
            }
        }
    };

    // step 1: choose a hospital
    // set building Id 1,2,3,4
    // set currentFloorId
    // show Floor Selector if Patriot Place
    // zoom in to hospital
    const handleHospitalSelect = async (hospitalId: number) => {
        setLot('');
        setPathVisible(false);
        setBuildingID(hospitalId); // still needed for other logic

        const realBuildingID = hospitalId !== 1 ? hospitalId + 1 : hospitalId;
        const directories: DirectoryRequestByBuilding[] = [];

        try {
            const data = await getDirectory(realBuildingID);
            data.map((d) => directories.push(d));

            if (realBuildingID === 3) {
                const otherPP = await getDirectory(2);
                otherPP.map((d) => directories.push(d));
            }

            setDirectoryList(directories);
            console.log("Fetched directory for hospitalId:", hospitalId, directories);
        } catch (error) {
            console.error('Error fetching directory:', error);
        }

        const hospital = Object.entries(HospitalLocations).find(
            ([name]) => BuildingIDMap[name] === hospitalId
        );

        if (hospital) {
            setCurrentFloorId(
                availableFloors.find((f) => f.buildingId === hospitalId.toString())?.id
            );
            if (hospitalId === 2) {
                setShowFloorSelector(true);
            }
            if (map) {
                map.panTo({ lat: hospital[1].lat, lng: hospital[1].lng });
                map.setZoom(hospital[1].zoom);
            }
        }
    };

    const handleDirectionRequest = (
        from: string,
        to: string,
        toHospital: string,
        mode: TravelModeType
    ) => {
        console.log('Direction request received:', from, to, toHospital, mode);

        clearRoute();

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

        setTimeout(() => {
            calculateRoute();
        }, 300);
    };

    const handleFindDepartment = () => {
        handleZoomToHospital();
    };

    const [tempDepartmentNodeID, setTempDepartmentNodeID] = useState('');
    const handleDepartmentSelect = (departmentNodeId: string) => {
        if (!checkIn) setToDirectoryNodeId(departmentNodeId);
        setTempDepartmentNodeID(departmentNodeId);
        setPathVisible(true);
        clearRoute();
    };

    const [lot, setLot] = useState('');
    const [parking, setParking] = useState(true);
    const [pathVisible, setPathVisible] = useState(false);

    const clearParking = () => {
        setLot('');
    };

    const handleParkingSelect = (lotId: string) => {
        setLot(lotId);
    };

    // get start node
    useEffect(() => {
        if (checkIn) {
            switch (buildingID) {
                case 1:
                    setToDirectoryNodeId('CHFloor1Check-In Desk');
                    break;
                case 2:
                    setToDirectoryNodeId('PPFloor1Check-In Desk_1');
                    break;
                case 3:
                    setToDirectoryNodeId('FKFloor1Check-In Desk');
                    break;
                case 4:
                    setToDirectoryNodeId('BWFloor2Check-In Desk');
                    break;
            }
        } else if (pathVisible) {
            handleDepartmentSelect(tempDepartmentNodeID);
        }
        if (lot !== '') {
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
            } else if (locationPrefix === 'BWH') {
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
        else {
            switch (buildingID) {
                case 1:
                    setFromNodeId('CHFloor1Road3_1');
                    break;
                case 2:
                    setFromNodeId('PPFloor1Road10');
                    break;
                case 3:
                    setFromNodeId('FKFloor1Road');
                    break;
                case 4:
                    setFromNodeId('BWFloor2Road_1');
                    break;
            }
        }
    }, [lot, buildingID, checkIn]);

    const handleAutoSwitchFloor = (startFloorId: string) => {
        setCurrentFloorId(startFloorId);
    };

    const handleBack = (currentStep: string) => {
        if (currentStep === 'DEPARTMENT') {
            setPathVisible(false);
            clearParking();
            setCheckIn(false);
            setToDirectoryNodeId('');
            setToLocation('');
            setShowBuildingDirections(false);
        }
        if (currentStep === 'DIRECTIONS') {
            setToLocation('');
            setToDirectoryNodeId('');
        }
        if (currentStep === 'HOSPITAL_DETAIL') {
            setFromNodeId('');
            setShowFloorSelector(false);
            setBuildingID(0);
            setMap3DOn(false);
        } else {
            clearRoute();
            clearParking();
        }
    };

    const handleCheckIn = (checkIn: boolean) => {
        setCheckIn(checkIn);
        setHighlightFloor(false);
    };
    console.log(' ====== checkIn? ' + checkIn);



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
                        onCheckIn={handleCheckIn}
                        directoryList={directoryList}
                        setCurrentStepProp={setCurrentStep}
                        currentStep={currentStep}
                        autoNavigate={normalizedHospital(hospital)}
                        autoIntent={intent}
                        autoDepartment={department}
                    />
                </aside>
                {showFloorSelector && (
                    <div className="relative top-6 left-8 z-10 ">
                        <FloorSelector
                            currentFloorId={currentFloorId}
                            onChange={handleFloorChange}
                            highlightFloorId={highlightFloorId}
                            highlightFloor={highlightFloor}
                        />
                    </div>
                )}
            </div>

            {/* MAP AREA */}
            <main className="absolute inset-0 z-0">
                <Map
                    style={{ width: '100%', height: '100%' }}
                    defaultCenter={{ lat: 42.32598, lng: -71.14957 }}
                    defaultZoom={15}
                    disableDefaultUI={true}
                    mapId={'73fda600718f172c'}
                >
                    {map && (
                        <HospitalMapComponent
                            map={map}
                            startNodeId={fromNodeId}
                            endNodeId={toDirectoryNodeId}
                            selectedAlgorithm={selectedAlgorithm}
                            visible={pathVisible}
                            currentFloorId={currentFloorId}
                            onFloorChange={handleFloorHighlight}
                            onAutoSwitchFloor={handleAutoSwitchFloor}
                            autoFloorSwitchEnabled={autoFloorSwitchEnabled}
                            driveDirections={textDirections}
                            drive2Directions={text2Directions}
                            showTextDirections={!!toLocation}
                            currentStep={currentStep}
                            showBuildingDirections={showBuildingDirections}
                            distanceUnits={distanceUnits}
                            setDistanceUnits={setDistanceUnits}
                            map3DOn={map3DOn}
                        />
                    )}
                </Map>

                {buildingID === 1 && (
                    <div className="absolute top-2 left-1/2 justify-center ">
                        <div className="flex items-center bg-gray-100 rounded-full px-6 py-3 shadow-md shadow-xl/30 inset-shadow-grey-300">
                            <p className="text-sm text-codGray font-bold mr-4">3D Map</p>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={map3DOn} onChange={handleToggleMap3D} />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-mgbblue transition-all duration-300" />
                                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-full" />
                            </label>
                        </div>
                    </div>
                )}

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
