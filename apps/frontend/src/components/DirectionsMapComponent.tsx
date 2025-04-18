import React, { useState, useEffect, useRef, useMemo, ChangeEvent } from 'react';
import SelectElement from '../elements/SelectElement.tsx';
import { Map, useMap, useMapsLibrary, RenderingType } from '@vis.gl/react-google-maps';
import TravelModeComponent from "@/components/TravelModeComponent.tsx";
import OverlayComponent from "@/components/svgOverlay.tsx";
import HospitalMapComponent from "@/components/HospitalMapComponent";

import { MapPin, MapPlus } from 'lucide-react';

import {
    DirectoryRequestByBuilding,
    DirectoryRequestName,
    getDirectory,
    getDirectoryNames
} from "@/database/gettingDirectory.ts";
import {GetNode} from "@/database/getDepartmentNode.ts";

import {myNode} from "common/src/classes/classes.ts";


const Buildings = [
    "Chestnut Hill - 850 Boylston Street",
    "20 Patriot Place",
    "22 Patriot Place"
]

const BuildingIDMap: Record<string, string> = {
    "Chestnut Hill - 850 Boylston Street": "1",
    "20 Patriot Place": "2",
    "22 Patriot Place": "3"
}

const DefaultFloors:Record<string, string> = {
    "1": "CH-1",
    "2": "20PP-1",
    "3": "22PP-3",
}

type TravelModeType = 'DRIVING' | 'TRANSIT' | 'WALKING';

const ChestnutParkingBounds = {
    southWest: { lat: 42.32546535760605, lng: -71.15029519348985 }, // Bottom-left corner
    northEast: { lat: 42.32659860801865, lng: -71.14889438933609 }, // Top-right corner
};

const ChestnutParkingSVG = '/ChestnutParking.svg';

const nullNode : myNode = {
    id: "",
    x: 0,
    y: 0,
    floor: "0",
    buildingId: "0",
    nodeType: "0",
    name: "",
    roomNumber: "0"
}
const CHDoorA : myNode = {
    id: "CHFloor1Door8",
    x: 694.0946366710934,
    y: 209.91282960575376,
    floor: "1",
    buildingId: "1",
    nodeType: "Door",
    name: "EntranceA",
    roomNumber: ""
}
const CHDoorBC : myNode = {
    id: "CHFloor1Door15",
    x: 953.0376994960379,
    y: 517.9228102091384,
    floor: "1",
    buildingId: "1",
    nodeType: "Door",
    name: "EntranceBC",
    roomNumber: ""
}
const PP20 : myNode = {
    id: "20PPFloor1Door1",
    x: 54.04440366094416,
    y: 838.0104833982157,
    floor: "1",
    buildingId: "2",
    nodeType: "Door",
    name: "Door",
    roomNumber: ""
}
const PP22 : myNode = {
    id: "22PPFloor3Elevator1",
    x: 562.5431410733905,
    y: 630.6622737119537,
    floor: "3",
    buildingId: "3",
    nodeType: "Elevator",
    name: "Node 1",
    roomNumber: ""
}



const DirectionsMapComponent = () => {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const placesLibrary = useMapsLibrary('places');
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [travelMode, setTravelMode] = useState<TravelModeType>('DRIVING');
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [showRouteInfo, setShowRouteInfo] = useState(false);
    const [directoryList, setDirectoryList] = useState<DirectoryRequestByBuilding[]>([]);

    const [currentDirectoryName, setCurrentDirectoryName] = useState('');

    const [toDirectoryNodeId, setToDirectoryNodeId] = useState('');
    const [fromNode, setFromNode] = useState<myNode>(nullNode);
    const [toDirectoryNode, setToDirectoryNode] = useState<myNode>(nullNode);

    const [selectedBuildingId, setSelectedBuildingId] = useState('');

    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

    const [buildingID, setBuildingID] = useState<number>(0);

    const [textDirections, setTextDirections] = useState<string>('');

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [map, routesLibrary]);

    // refs for autocomplete
    const fromLocationRef = useRef(null);
    // autocomplete
    useEffect(() => {
        if (!placesLibrary || !fromLocationRef.current) return;

        // autocomplete for origin
        const fromAutocomplete = new placesLibrary.Autocomplete(fromLocationRef.current, {
            types: ['geocode', 'establishment'],
            fields: ['place_id', 'geometry', 'formatted_address', 'name'],
            componentRestrictions: { country: 'us' }, // limit to US places
        });

        // event listeners so that when autocomplete the state is changed
        fromAutocomplete.addListener('place_changed', () => {
            const place = fromAutocomplete.getPlace();
            if (place.formatted_address) {
                setFromLocation(place.formatted_address);
            }
        });
    }, [placesLibrary]);

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
    }, [buildingID]);

    // get the end department nodeId
    useEffect(() => {
        const handleDeptChange = () => {
            console.log("currentDirectoryName - ", currentDirectoryName)
            const dept = directoryList.find((dept) => dept.deptName === currentDirectoryName );
            console.log("dept - " + dept);

            //checks null
            if (dept){
                setToDirectoryNodeId(dept.nodeId);
                console.log(dept.nodeId);
            } else {
                setToDirectoryNode(nullNode);
            }
        }
        handleDeptChange();
    } ,[currentDirectoryName]);

    // get end node using nodeId
    useEffect(() => {
        const fetchNode = async () => {
            try {
                const data = await GetNode(toDirectoryNodeId);
                setToDirectoryNode(data);
            } catch (error) {
                console.error("Error fetching building names:", error);
            }

        };
        fetchNode();
        console.log("Got Department Node")

    }, [toDirectoryNodeId]);


    useEffect(() => {
        if (toLocation){
            const id = BuildingIDMap[toLocation]||"";
            setSelectedBuildingId(id)
        }
        else{
            setSelectedBuildingId("");
        }
    }, [toLocation]);

    // find directions
    const handleFindDirections = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        calculateRoute();
    };

    // change travel mode
    const handleTravelModeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTravelMode(e.target.value as TravelModeType);
        if (e.target.value === 'DRIVING') {
            setParking(true);
        } else {
            setParking(false);
        }
    };

    // draw route
    const calculateRoute = () => {
        if (!directionsRenderer || !directionsService) return;

        clearAllRoutes();

        directionsRenderer.setMap(map);

        let actualLocation = toLocation;
        if (toLocation === '20 Patriot Place' || toLocation === '22 Patriot Place') {
            actualLocation = '42.09253421464256, -71.26638758014579';
        }

        const googleTravelMode = google.maps.TravelMode[travelMode as keyof typeof google.maps.TravelMode];
        directionsService
            .route({
                origin: fromLocation,
                destination: actualLocation,
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
                    // TEXT DIRECTIONS
                    const htmlStr: string = leg.steps
                        .map(direction => `${direction.instructions} and continue for ${direction.distance ? direction.distance.text : ''}`)
                        .toString();
                    setTextDirections(htmlStr.replace(/,/g, '<br><br>'));
                }
            });
    };

    const [lot, setLot] = useState('');
    const [parking, setParking] = useState(true);
    const [showHospital, setShowHospital] = useState(false);

    const handleChangeToLocation = (e: ChangeEvent<HTMLSelectElement>) => {
        const newLocation = e.target.value;
        const previousLocation = toLocation;

        // Update the location state
        setToLocation(newLocation);

        // Set the building ID for directory lookup
        const buildingIndex = Buildings.indexOf(newLocation);
        setBuildingID(buildingIndex+1);

        // Only reset department data if the building changed
        if (previousLocation !== newLocation && previousLocation !== '') {
            setToDirectoryNodeId('');
            setToDirectoryNode(nullNode);
        }
    }

    useEffect(() => {
        if (toLocation === Buildings[0]){
            setFromNode(CHDoorA) // default
            if (lot === 'CH_A'){
                setFromNode(CHDoorA)
            }
            else if(lot === 'CH_B' || lot === 'CH_C'){
                setFromNode(CHDoorBC)
            }
        }
        else if(toLocation === Buildings[1] ){
            setFromNode(PP20)
            if(lot === 'PP_A' || lot === 'PP_B'|| lot === 'PP_C'){setFromNode(PP20)}
        }
        else if(toLocation === Buildings[2]){
            setFromNode(PP22)
            if(lot === 'PP_A' || lot === 'PP_B'|| lot === 'PP_C'){setFromNode(PP22)}
        }
    }, [toLocation, lot]);



    const handleParkA = () => {
        clearParking();
        if (toLocation === '20 Patriot Place' || toLocation === '22 Patriot Place') {
            setLot('PP_A');
            calculateDoorRoute(PPlotAToDoor, 'A');
        }
        else {
            setLot('CH_A');
            calculateDoorRoute(CHlotAToDoor, 'A');
        }
    };
    const handleParkB = () => {
        clearParking();
        if (toLocation === '20 Patriot Place' || toLocation === '22 Patriot Place') {
            setLot('PP_B');
            calculateDoorRoute(PPlotBToDoor, 'B');
        }
        else {
            setLot('CH_B');
            calculateDoorRoute(CHlotBToDoor, 'B');
        }
    };
    const handleParkC = () => {
        if (toLocation === '20 Patriot Place' || toLocation === '22 Patriot Place') {
            setLot('PP_C');
            calculateDoorRoute(PPlotCToDoor, 'C');
        }
        else {
            setLot('CH_C');
            calculateDoorRoute(CHlotCToDoor, 'C');
        }

    };

    const clearParking = () => {
        setLot('');
    };


    const handleHere = () => {
        setShowHospital(prevState => !prevState);
    };

    // 42.32641353922122, -71.14992135383609
    const CHlotAToDoor = [
        { lat: 42.32641975362307, lng: -71.14992617744028 },
        { lat: 42.32643660922756, lng: -71.14959023076334 },
        { lat: 42.3262859001328, lng: -71.14956609088263 },
        { lat: 42.326275985048134, lng: -71.14951647001675 },
        { lat: 42.32624227374853, lng: -71.14946819025536 },
    ];

    const CHlotBToDoor = [
        { lat: 42.32607681544678, lng: -71.14907388066334 }, //start
        { lat: 42.3260046767077, lng: -71.149101323287 }, //midpoint
        { lat: 42.32598889634749, lng: -71.14922329050336 }, //end
    ];

    const CHlotCToDoor = [
        { lat: 42.325598573871204, lng: -71.14972535132611 },
        { lat: 42.32569574268002, lng: -71.14973071574414 },
        { lat: 42.325747301578836, lng: -71.14911648987977 },
        { lat: 42.32602095964217, lng: -71.14910844325274 },
        { lat: 42.32601501056652, lng: -71.14923182486741 },
    ];

    const PPlotAToDoor = [
        {lat: 42.092230101663034, lng: -71.26654974313286},
        {lat: 42.092437193904246, lng: -71.2663789656559},
        {lat: 42.092529921554245, lng: -71.26643519726416},
        {lat: 42.09254692160871, lng: -71.2663643870908}
    ];

    const PPlotBToDoor = [
        {lat: 42.09156940188613, lng: -71.26626478897806},
        {lat: 42.091537059036156, lng: -71.26643705096096},
        {lat: 42.091736661535094, lng: -71.26646938725148},
        {lat: 42.09188594087752, lng: -71.2665364424713},
        {lat: 42.09200337371333, lng: -71.26673492592202},
        {lat: 42.092444748869866, lng: -71.26637970586039},
        {lat: 42.092529921554245, lng: -71.26643519726416},
        {lat: 42.09254692160871, lng: -71.2663643870908}
    ];

    const PPlotCToDoor = [
        {lat: 42.09075833907194, lng: -71.26693167274473},
        {lat: 42.091206506804454, lng: -71.26714263577942},
        {lat: 42.09129859567236, lng: -71.26737014493447},
        {lat: 42.091780525233865, lng: -71.26712608965906},
        {lat: 42.09251722577942, lng: -71.26652629276056},
        {lat: 42.09254692160871, lng: -71.2663643870908}
    ]

    const customLineRef = useRef<google.maps.Polyline | null>(null);
    const customMarkersRef = useRef<google.maps.Marker[]>([]);
    const animationRef = useRef<number | null>(null);

    function clearAllRoutes() {
        // Clear default Google route
        directionsRenderer?.setMap(null);

        // Clear custom micro route polyline
        if (customLineRef.current) {
            customLineRef.current.setMap(null);
            customLineRef.current = null;
        }

        // Clear custom markers
        customMarkersRef.current.forEach((marker) => marker.setMap(null));
        customMarkersRef.current = [];

        // Clear dash animation
        if (animationRef.current !== null) {
            clearInterval(animationRef.current);
            animationRef.current = null;
        }
    }

    function calculateDoorRoute(pathPoints: google.maps.LatLngLiteral[], label: string) {
        if (!map) return;
        clearAllRoutes();

        // Fit map to route
        const bounds = new google.maps.LatLngBounds();
        pathPoints.forEach((p) => bounds.extend(p));
        map.fitBounds(bounds, 100);

        // Add markers
        const startMarker = new google.maps.Marker({ position: pathPoints[0], map, label });
        const endMarker = new google.maps.Marker({
            position: pathPoints[pathPoints.length - 1],
            map,
            label: 'D',
        });
        customMarkersRef.current = [startMarker, endMarker];

        // Add polyline
        const line = new google.maps.Polyline({
            path: pathPoints,
            map,
            strokeOpacity: 0,
            icons: [
                {
                    icon: {
                        path: 'M 0,-1 0,1',
                        strokeOpacity: 1,
                        strokeColor: '#4285F4',
                        scale: 4,
                    },
                    offset: '0',
                    repeat: '25px',
                },
            ],
        });

        customLineRef.current = line;

        let count = 0;
        animationRef.current = window.setInterval(() => {
            count = (count + 1) % 200;
            const icons = line.get('icons');
            if (icons && icons.length > 0) {
                icons[0].offset = `${count / 2}%`;
                line.set('icons', icons);
            }
        }, 100);
    }

    const initialFloorId = selectedBuildingId ? DefaultFloors[selectedBuildingId] : "";
    return (
        <div className="flex flex-row h-screen">
            {/* LEFT PANEL */}
            <aside className="basis-1/4 bg-white p-6 shadow-md overflow-y-auto border-r border-gray-200">
                <form onSubmit={handleFindDirections} className="space-y-6">
                    {/* Blue Box Section */}
                    <div className="bg-mgbblue text-white py-5 pr-6 pl-8 rounded-lg">
                        <h2 className="text-2xl font-bold text-white mb-6 -ml-4">Hospital Directions</h2>
                        <div className="flex gap-4 relative -ml-6">
                            {/* Breadcrumb Line + Icons */}
                            <div className="flex flex-col items-center pt-1">
                                {/* Map icon */}
                                <div className="text-white p-1.5 text-xl mt-6">
                                    <MapPlus />
                                </div>
                                {/* Line */}
                                <div className="h-7 border-l-2 border-dashed border-white" />
                                {/* Pin icon */}
                                <div className="text-white p-1.5 text-xl">
                                    <MapPin />
                                </div>
                            </div>

                            {/* Form Inputs */}
                            <div className="flex-1 space-y-3">
                                <div className="mb-6">
                                    <label
                                        htmlFor="fromLocation"
                                        className="block text-sm font-medium mb-1"
                                    >
                                        From:
                                    </label>
                                    <input
                                        type="text"
                                        id="fromLocation"
                                        ref={fromLocationRef}
                                        value={fromLocation}
                                        onChange={(e) => setFromLocation(e.target.value)}
                                        required
                                        placeholder="Choose a starting point..."
                                        className="w-full p-2 border border-white rounded-md bg-white text-mgbblue placeholder:text-mgbblue focus:ring-2 focus:ring-white"
                                    />
                                    <SelectElement
                                        label="To:"
                                        id="toLocation"
                                        value={toLocation}
                                        onChange={(e) => handleChangeToLocation(e)}
                                        options={Buildings}
                                        placeholder="Select Hospital"
                                        className="bg-white text-mgbblue"
                                    />
                                </div>

                                <div>
                                    <SelectElement
                                        label="Dept."
                                        id="toDirectory"
                                        value={currentDirectoryName}
                                        onChange={(e) => setCurrentDirectoryName(e.target.value)}
                                        options={directoryList.map((dept) => (dept.deptName))}
                                        placeholder="Select Department"
                                        className="bg-white text-mgbblue"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Travel Mode */}
                    <TravelModeComponent
                        selectedMode={travelMode}
                        onChange={handleTravelModeChange}
                    />

                    {/* Find Directions */}
                    <button
                        type="submit"
                        disabled={!fromLocation || !toLocation}
                        className="w-full bg-mgbblue text-white py-2 rounded-md hover:bg-mgbblue/90 transition disabled:opacity-50"
                    >
                        Find Directions
                    </button>
                </form>

                {/* Parking Lot Buttons */}
                {parking && (
                    <div className="mt-6">
                        <p className="font-semibold mb-2 text-sm text-mgbblue">
                            Where did you park?
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {['A', 'B', 'C'].map((lot) => (
                                <button
                                    key={lot}
                                    onClick={() =>
                                        lot === 'A'
                                            ? handleParkA()
                                            : lot === 'B'
                                                ? handleParkB()
                                                : handleParkC()
                                    }
                                    className="bg-white text-mgbblue border border-mgbblue py-1 rounded-md hover:bg-mgbblue hover:text-white transition"
                                >
                                    Lot {lot}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* I'm Inside Button */}
                <div className="mt-6">
                    {toLocation ?
                    <button
                        onClick={() => handleHere()}
                        className="w-full bg-mgbblue text-white py-2 rounded-md hover:bg-mgbblue/90 transition"
                    >
                        {showHospital? 'Show Google Map' : "I'm Here!"}
                    </button> : <></>

                    }
                </div>
                <div id={"text-directions"} dangerouslySetInnerHTML={{ __html: textDirections }} />
                <div>

                </div>
            </aside>

            {/* MAP AREA */}
            <main className="basis-3/4 relative">
                {showHospital && (toDirectoryNode !== nullNode) ? (
                    <div>
                        <HospitalMapComponent
                            startNode={fromNode}
                            endNode={toDirectoryNode}
                            initialFloorId={initialFloorId}
                            selectedBuildingId = {selectedBuildingId}
                        />
                    </div>
                ) : (
                    <Map
                        style={{ width: '100%', height: '100%' }}
                        defaultCenter={{ lat: 42.32598, lng: -71.14957 }}
                        // MGB at Chestnut hill 42.325988270594415, -71.1495669288061
                        defaultZoom={15}
                        renderingType={RenderingType.RASTER}
                        mapTypeControl={false}
                    >
                        <OverlayComponent
                            bounds={ChestnutParkingBounds}
                            imageSrc={ChestnutParkingSVG}
                            visible={true}
                        />
                    </Map>
                )}

                {/* Route Info Box */}
                {showRouteInfo && !showHospital && (
                    <div className="absolute bottom-6 left-6 p-4 bg-white rounded-xl shadow-lg text-sm text-gray-800 max-w-sm space-y-1">
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
