import React, {useState, useEffect, useRef, useMemo, ChangeEvent} from 'react';
import MGBButton from '../elements/MGBButton.tsx';
import SelectElement from '../elements/SelectElement.tsx';
import { Map, useMap, useMapsLibrary, RenderingType } from '@vis.gl/react-google-maps';
import TravelModeComponent from "@/components/TravelModeComponent.tsx";
import OverlayComponent from "@/components/svgOverlay.tsx";
import ViewPath from "@/components/ViewPath.tsx";


import {myNode} from "../../../backend/src/Algorithms/classes.ts";
import axios from 'axios';
import {ROUTES} from "common/src/constants.ts";
import {GetTransportRequest, incomingRequest} from "@/database/transportRequest.ts";
import {getDepartmentNode} from "@/database/getDepartmentNode.ts";

const Buildings = [
    "20 Patriot Place",
    "22 Patriot Place",
    "Chestnut Hill - 850 Boylston Street",
];

type TravelModeType = 'DRIVING' | 'TRANSIT' | 'WALKING' | null;

const ChestnutParkingBounds = {
    southWest: { lat: 42.32546535760605, lng: -71.15029519348985}, // Bottom-left corner
    northEast: { lat: 42.32659860801865, lng: -71.14889438933609}  // Top-right corner
};

const ChestnutParkingSVG = '/ChestnutParking.svg';


const DirectionsMapComponent = () => {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const placesLibrary = useMapsLibrary('places');
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [travelMode, setTravelMode] = useState<TravelModeType>(null);
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [showRouteInfo, setShowRouteInfo] = useState(false);


    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDefaultRenderer] = useState<google.maps.DirectionsRenderer>();

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDefaultRenderer(new routesLibrary.DirectionsRenderer({
            map,
        }));
    }, [map, routesLibrary]);

    // refs for autocomplete
    const fromLocationRef = useRef(null);

    useEffect(() => {
        if (!placesLibrary || !fromLocationRef.current) return;

        // autocomplete for origin
        const fromAutocomplete = new placesLibrary.Autocomplete(fromLocationRef.current, {
            types: ['geocode', 'establishment'],
            fields: ['place_id', 'geometry', 'formatted_address', 'name'],
            componentRestrictions: {country: "us"} // limit to US places
        });

        // event listeners so that when autocomplete the state is changed
        fromAutocomplete.addListener('place_changed', () => {
            const place = fromAutocomplete.getPlace();
            if (place.formatted_address) {
                setFromLocation(place.formatted_address);
            }
        });

    }, [placesLibrary]); // autocomplete

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
    }

    // draw route
    const calculateRoute = () => {
        if (!directionsRenderer || !directionsService) return;

        directionsRenderer.setMap(map);

        let actualLocation = toLocation;
        if(toLocation === '20 Patriot Place' || toLocation === "22 Patriot Place") {
            actualLocation = "42.09253421464256, -71.26638758014579";

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

                if(response.routes.length > 0 && response.routes[0].legs.length > 0) {
                    const leg = response.routes[0].legs[0];
                    setDistance(leg.distance?.text || "N/A");
                    setDuration(leg.duration?.text || "N/A");
                    setShowRouteInfo(true);
                }
            });
    };

    const [lot, setLot] = useState('');
    const [parking, setParking] = useState(false);
    const [showHospital, setShowHospital] = useState(false);

    const handleParkA = () => {
        clearParking();
        setLot('A');
        calculateDoorRoute(lotAToDoor, 'A');
    };
    const handleParkB = () => {
        clearParking();
        setLot('B');
        calculateDoorRoute(lotBToDoor, 'B')
    };
    const handleParkC = () => {
        clearParking();
        setLot('C');
        calculateDoorRoute(lotCToDoor, 'C')
    };

    const clearParking = () => {
        setLot('');
    };

    const handleHere = () => {
        setShowHospital(prevState => !prevState);
    };

    // 42.32641353922122, -71.14992135383609
    const lotAToDoor = [
        {lat: 42.32641975362307, lng: -71.14992617744028},
        {lat: 42.32643660922756, lng: -71.14959023076334},
        {lat: 42.3262859001328, lng: -71.14956609088263},
        {lat: 42.326275985048134, lng: -71.14951647001675},
        {lat: 42.32624227374853, lng: -71.14946819025536}
    ]

    const lotBToDoor = [
        {lat: 42.32607681544678, lng: -71.14907388066334}, //start
        {lat: 42.3260046767077, lng: -71.149101323287}, //midpoint
        {lat: 42.32598889634749, lng: -71.14922329050336} //end
    ]

    const lotCToDoor = [
        {lat: 42.325598573871204, lng: -71.14972535132611},
        {lat: 42.32569574268002, lng: -71.14973071574414},
        {lat: 42.325747301578836, lng: -71.14911648987977},
        {lat: 42.32602095964217, lng: -71.14910844325274},
        {lat: 42.32601501056652, lng: -71.14923182486741}
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
        customMarkersRef.current.forEach(marker => marker.setMap(null));
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
        pathPoints.forEach(p => bounds.extend(p));
        map.fitBounds(bounds, 100);

        // Add markers
        const startMarker = new google.maps.Marker({ position: pathPoints[0], map, label });
        const endMarker = new google.maps.Marker({ position: pathPoints[pathPoints.length - 1], map, label: 'D' });
        customMarkersRef.current = [startMarker, endMarker];

        // Add polyline
        const line = new google.maps.Polyline({
            path: pathPoints,
            map,
            strokeOpacity: 0,
            icons: [{
                icon: { path: "M 0,-1 0,1", strokeOpacity: 1, strokeColor: "#4285F4", scale: 4 },
                offset: "0",
                repeat: "25px",
            }],
        });

        customLineRef.current = line;

        let count = 0;
        animationRef.current = window.setInterval(() => {
            count = (count + 1) % 200;
            const icons = line.get("icons");
            if (icons && icons.length > 0) {
                icons[0].offset = `${count / 2}%`;
                line.set("icons", icons);
            }
        }, 100);
    }


    async function FindPath(start: myNode, end: myNode) {
        const data = JSON.stringify({start, end})
        console.log(data);
        const res = await axios.post(ROUTES.BFSGRAPH, data, {
            headers: {'Content-Type': 'application/json'}
        })
        const nodes : myNode[] = res.data
        console.log(nodes)
        return nodes;
    }
    // toLocation === Buildings[2] ? (
    //     <div>
    //         <HospitalMap/>
    //     </div>
    // ) : (toLocation === Buildings[0] ? (
    //         <div>
    //             {/*<ViewPath svgMapUrl="/20PPFloor1.svg" nodes={testNodes} path={testPath}/>*/}
    //         </div>
    //     ) : (
    //         <div>
    //             {/*<ViewPath svgMapUrl="/20PPFloor2.svg" nodes={testNodes}  path={testPath}/>*/}
    //         </div>
    //     )
    //
    // )
    const [deptNode, setDeptNode] = useState<myNode>();

    useEffect(() => {
        async function fetchDeptNode() {
            const data = await getDepartmentNode();
            console.log(data);
            setDeptNode(data);
        }
        fetchDeptNode();
    }, []);


    const HospitalMap = () => {
        const [bfsPath, setBFSPath] = useState<myNode[]>([]);

        useEffect(() => {
            const getMyPaths = async () => {
                const door1 : myNode = {
                    id: "CH1Door1",
                    x: 694.6909401633523,
                    y: 164.93491432883522,
                    floor: "1",
                    buildingId: "1",
                    nodeType: "Door",
                    name: "Exit1",
                    roomNumber: ""
                    }
                const room102: myNode = {
                        id: "CH1Room130",
                        x: 528.8599611031434,
                        y: 284.5968690890998,
                        floor: "1",
                        buildingId: "1",
                        nodeType: "Room",
                        name: "Multi-Specialty Clinic 130",
                        roomNumber: "130"
                    }

                    const result = await FindPath(door1, room102);
                    setBFSPath(result);

            };
            getMyPaths();
            // console.log(path);
        }, [showHospital]);

        return (
            <div>
                <ViewPath svgMapUrl="/ChestnutHillFloor1.svg" path={bfsPath}/>
            </div>

        );
    };

    return (
        <div className="flex flex-row">
            <div className="basis-1/6 bg-white p-6">
                <h2 className="text-xl font-bold mb-4">Get Directions</h2>
                <form onSubmit={handleFindDirections}>
                    <div className="mb-4">
                        <label>From:</label>
                        <input
                            type="text"
                            id="fromLocation"
                            ref={fromLocationRef}
                            value={fromLocation}
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={(e) => setFromLocation(e.target.value)}
                            required
                            placeholder="Choose a starting point..."
                        />
                    </div>
                    {/*Choose hospital buildings*/}
                    <div className="mt-4">
                    <SelectElement
                                   label={"To:"}
                                   id={"toLocation"}
                                   value={toLocation}
                                   onChange={e=> setToLocation(e.target.value)}
                                   options={Buildings}
                                   placeholder={"Select Hospital Building"}
                    />
                    </div>
                    {/*Choose hospital department ===== WORK HERE =====*/}
                    <div className="mt-4">
                        <SelectElement
                            label={"Department"}
                            id={"toLocation"}
                            value={toLocation}
                            onChange={e=> setToLocation(e.target.value)}
                            options={Buildings}
                            placeholder={"Select Department"}
                        />
                    </div>


                    <div className="mt-5">
                        <TravelModeComponent selectedMode={travelMode} onChange={handleTravelModeChange}
                        />
                    </div>

                    <div className="mt-5">
                        <MGBButton
                            onClick={() => handleFindDirections}
                            variant={'secondary'}
                            disabled={!fromLocation || !toLocation}
                        >
                            Find Directions
                        </MGBButton>
                    </div>

                </form>

                {parking && (
                    <div className="flex flex-col gap-2 mt-5">
                        <p className="font-semibold">Where did you park?</p>
                        <MGBButton
                            onClick={() => handleParkA()}
                            variant={'primary'}
                            disabled={!parking}
                        >
                            Lot A
                        </MGBButton>
                        <MGBButton
                            onClick={() => handleParkB()}
                            variant={'primary'}
                            disabled={!parking}
                        >
                            Lot B
                        </MGBButton>
                        <MGBButton
                            onClick={() => handleParkC()}
                            variant={'primary'}
                            disabled={!parking}
                        >
                            Lot C
                        </MGBButton>
                    </div>
                )}
                <div className="mt-5">
                    <MGBButton
                        onClick={() => handleHere()}
                        variant={'primary'}
                        disabled={undefined}
                    >
                        {showHospital ? 'Show Google Map' : "I'm Inside!"}
                    </MGBButton>
                </div>
            </div>

            <div className="basis-5/6 relative">
                {showHospital ? (
                        <div>
                            <HospitalMap />
                        </div>) :  (
                    <Map
                        style={{ width: '100%', height: '92vh' }}
                        defaultCenter={{ lat: 42.32598, lng: -71.14957 }}
                        // MGB at Chestnut hill 42.325988270594415, -71.1495669288061
                        defaultZoom={15}
                        renderingType={RenderingType.RASTER}
                        mapTypeControl={false}
                    >
                        <OverlayComponent bounds={ChestnutParkingBounds} imageSrc={ChestnutParkingSVG} visible={true}/>
                    </Map>
                )}

                {/* Route information box positioned at bottom left of map */}
                {showRouteInfo && !showHospital && (
                    <div className="absolute bottom-6 left-6 p-3 bg-white rounded-md shadow-md z-10 max-w-xs">
                        <h3 className="font-semibold mb-1 text-sm">Route Information</h3>
                        <div className="text-sm space-y-1">
                            <p><span className="font-medium">Distance:</span> {distance}</p>
                            <p><span className="font-medium">Travel Time:</span> {duration}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};



export default DirectionsMapComponent;
