import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Map, useMap, useMapsLibrary, RenderingType } from '@vis.gl/react-google-maps';
import HospitalMapComponent from '@/components/HospitalMapComponent';
import {ZoomIn } from 'lucide-react';
import {CHtoLotA, CHtoLotB, CHtoLotC, PPtoLotA, PPtoLotB, PPtoLotC, FKtoLotA, FKtoLotB, FKtoLotC}  from '../assets/parkingCoords.tsx'


import {
    DirectoryRequestByBuilding,
    getDirectory,
} from '@/database/gettingDirectory.ts';
import { GetRecentOrigins, RecentOrigin } from '@/database/recentOrigins.ts';

import AlgorithmSelector from '@/components/AlgorithmSelector.tsx';
import DisplayPathComponent from "@/components/DisplayPathComponent.tsx";
import MapSidebarComponent from "@/components/MapUI/MapSidebarComponent.tsx";

const HospitalLocations: Record<string, {lat: number, lng: number, zoom: number}> = {
    'Chestnut Hill Healthcare Center': {lat: 42.325988, lng: -71.149567, zoom: 18},
    'Foxborough Health Care Center': {lat: 42.092617, lng: -71.266492, zoom: 18},
    'Brigham and Women\'s Faulkner Hospital': {lat: 42.301684739524546, lng: -71.12816396084828, zoom: 18},
    'Brigham and Women\'s Main Hospital': {lat: 42.33550114249947, lng: -71.10727870473441, zoom: 18}
};

const BuildingIDMap: Record<string, number> = {
    'Chestnut Hill Healthcare Center': 1,
    'Foxborough Health Care Center': 2,
    'Brigham and Women\'s Faulkner Hospital': 3,
    'Brigham and Women\'s Main Hospital': 4
};

type TravelModeType = 'DRIVING' | 'TRANSIT' | 'WALKING';


// Define the interface
interface Coordinate {
    lat: number;
    lng: number;
}

const DirectionsMapComponent = () => {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [toHospital, setToHospital] = useState('');

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


    useEffect(() => {
        const checkAdmin = () => {
            console.log(sessionStorage.getItem('position'))
            if (sessionStorage.getItem('position') === "WebAdmin") {
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



    // API CALLS
    // get directory list
    useEffect(() => {
        const fetchDirectoryList = async () => {
            try {
                const data = await getDirectory(buildingID);
                setDirectoryList(data);
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



    // find directions
    const handleFindDirections = async () => {
        calculateRoute();
    };

    const handleAlgorithmChange = (algorithm: string) => {
        setSelectedAlgorithm(algorithm);
    };


    const [lot, setLot] = useState('');
    const [parking, setParking] = useState(true);
    const [pathVisible, setPathVisible] = useState(false);

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

    const clearRoute = () =>{
        if (!directionsRenderer) return;
        directionsRenderer.setMap(null);
    }

    const clearParking = () => {
        setLot('');
    };



    const handleZoomToHospital = () => {
        if (!map || !toHospital) return;

        const hospitalLocation = HospitalLocations[toHospital];
        if (hospitalLocation) {
            map.panTo({ lat: hospitalLocation.lat, lng: hospitalLocation.lng });
            map.setZoom(hospitalLocation.zoom);
        }
    };


    const handleHospitalSelect = (hospitalId: number)  => {
        setLot('');
        setPathVisible(false);

        const hospital = Object.entries(HospitalLocations).find(
            ([name]) => BuildingIDMap[name] === hospitalId
        )

        if(hospital){
            setBuildingID(hospitalId);
            if (map){
                map.panTo({lat: hospital[1].lat, lng: hospital[1].lng}); // location
                map.setZoom(hospital[1].zoom);
            }

        }
    }

    const handleDirectionRequest = (from: string, to: string, toHospital: string, mode: TravelModeType) => {
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
        calculateRoute();
    };

    const handleFindDepartment = () =>{
        handleZoomToHospital();
    }


    const handleDepartmentSelect = (departmentNodeId: string) => {
        setToDirectoryNodeId(departmentNodeId);
    }

    const handleParkingSelect = (lotId: string) => {
        setLot(lotId)
    }

    const handleBack =() => {
        clearRoute();
        clearParking();
    }

    return (
        <div className="flex w-screen h-screen">
            {/* LEFT PANEL */}
            <div className="relative">
                <aside className="relative top-6 left-6 z-10 w-[400px] max-h-[80vh] bg-white p-6 shadow-xl rounded-lg overflow-hidden flex flex-col">
                    <MapSidebarComponent
                        onDirectionsRequest={handleDirectionRequest}
                        onHospitalSelect={handleHospitalSelect}
                        onDepartmentSelect={handleDepartmentSelect}
                        onParkingSelect={handleParkingSelect}
                        onClickingBack={handleBack}
                        onClickFindDepartment={handleFindDepartment}
                        directoryList={directoryList}
                    />
                </aside>

            </div>

            {/* MAP AREA */}
            <main className="absolute inset-0 z-0">

                <Map
                    style={{ width: '100%', height: '100%' }}
                    defaultCenter={{ lat: 42.32598, lng: -71.14957 }}
                    // MGB at Chestnut hill 42.325988270594415, -71.1495669288061
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

                        driveDirections={textDirections}
                        drive2Directions={text2Directions}
                        showTextDirections={!!toLocation}
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
                {/* Zoom to Hospital Button */}
                {toLocation && (
                    <button
                        onClick={handleZoomToHospital}
                        className="absolute top-1/5 right-6 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        title="Zoom to hospital"
                    >
                        <ZoomIn size={26} className="text-mgbblue" />
                    </button>
                )}
            </main>
        </div>
    );
};

export default DirectionsMapComponent;