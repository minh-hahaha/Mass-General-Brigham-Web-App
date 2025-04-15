import React, {useState, useEffect, useRef, ChangeEvent} from 'react';
import MGBButton from '../elements/MGBButton.tsx';
import SelectElement from '../elements/SelectElement.tsx';
import InputElement from '../elements/InputElement.tsx';
import { Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import ChestnutHillMapComponent from './ChestnutHillMapComponent.tsx';
import { bfs } from '../../../backend/src/Algorithms/BFS.ts';
import TravelModeComponent from "@/components/TravelModeComponent.tsx";
import {setDragLock} from "framer-motion";
import {myNode} from "../../../backend/src/Algorithms/classes.ts";
import axios from 'axios';
import {ROUTES} from "common/src/constants.ts";

const Buildings = [
    "20 Patriot Place",
    "22 Patriot Place",
    "Chestnut Hill - 850 Boylston Street",
];

type TravelModeType = 'DRIVING' | 'TRANSIT' | 'WALKING';



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


    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [map, routesLibrary]);

    // refs for autocomplete
    const fromLocationRef = useRef(null);
    // const toLocationRef = useRef(null);

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

        //autocomplete for destination - no need anymore
        // const toAutocomplete = new placesLibrary.Autocomplete(toLocationRef.current, {
        //     types: ['geocode', 'establishment'],
        //     fields: ['place_id', 'geometry', 'formatted_address', 'name'],
        // });
        //
        // toAutocomplete.addListener('place_changed', () => {
        //     const place = toAutocomplete.getPlace();
        //     if (place.formatted_address) {
        //         setToLocation(place.formatted_address);
        //     }
        // });
    }, [placesLibrary]);

    const handleFindDirections = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        calculateRoute();
    };

    const handleTravelModeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTravelMode(e.target.value as TravelModeType);
    }

    const calculateRoute = () => {
        if (!directionsRenderer || !directionsService) return;

        let actualLocation = toLocation;
        if(toLocation === '22 Patriot Place'){
            actualLocation = "20 Patriot Place";
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

    const [parkA, setParkA] = useState(false);
    const [parkB, setParkB] = useState(false);
    const [parkC, setParkC] = useState(false);
    const [parking, setParking] = useState(false);
    const [showHospital, setShowHospital] = useState(false);

    const handleParkA = () => {
        clearParking();
        setParkA(true);
        setShowHospital(true);
    };

    const handleParkB = () => {
        clearParking();
        setParkB(true);
        setShowHospital(true);
    };

    const handleParkC = () => {
        clearParking();
        setParkC(true);
        setShowHospital(true);
    };

    const clearParking = () => {
        setParkA(false);
        setParkB(false);
        setParkC(false);
    };

    const handleHere = () => {
        setShowHospital(true);
        setParking(true);
    };

    const svg = '/ChestnutHillMap.svg';

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

    const HospitalMap = () => {
        const [path, setPaths] = useState<myNode[]>([]);

        useEffect(() => {
            const getMyPaths = async () => {
                const door1 : myNode = {
                    nodeID: "CH1Door1",
                    x: 694.6909401633523,
                    y: 164.93491432883522,
                    floor: "1",
                    buildingId: "1",
                    nodeType: "Door",
                    name: "Exit1",
                    roomNumber: ""
                    }
                const room102: myNode = {
                    nodeID: "CH1Room102",
                    x: 662.2247373611947,
                    y: 757.8635425826869,
                    floor: "1",
                    buildingId: "1",
                    nodeType: "Room",
                    name: "Radiology, MR/CT Scan 102",
                    roomNumber: "102"
                }
                if (parkA) {
                    const result = await FindPath(door1, room102);
                    console.log('ParkA   ' + result);

                    setPaths(result);
                // } else if (parkB) {
                //     const result = await cleanedUpBFS('J', 'G');
                //     console.log('ParkB   ' + result);
                //     setPaths(result);
                // } else if (parkC) {
                //     const result = await cleanedUpBFS('L', 'G');
                //     console.log('ParkC   ' + result);
                //     setPaths(result);
                } else {
                    setPaths([]);
                }
            };
            getMyPaths();
        }, [parkA, parkB, parkC]);



        return (
            <div>
                <ChestnutHillMapComponent svgPath={svg} nodeConnections={path} />
            </div>
        );
    };

    return (
        <div className="flex flex-row">
            <div className="basis-[15vw] bg-white p-6">
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
                    <SelectElement className="mb-4"
                                  label={"To:"}
                                  id={"toLocation"}
                                  value={toLocation}
                                  onChange={e=> setToLocation(e.target.value)}
                                  options={Buildings}
                    />
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

                    {showRouteInfo && (
                            <div className="mt-4 p-3 bg-gray-100 rounded-md">
                                <h3 className="font-semibold mb-2">Route Information</h3>
                                <div className="text-sm space-y-1">
                                    <p><span className="font-medium">Distance:</span> {distance}</p>
                                    <p><span className="font-medium">Travel Time:</span> {duration}</p>
                                </div>
                            </div>
                    )}
                    
                    <div className="mt-2">
                        <MGBButton
                            onClick={() => handleHere()}
                            variant={'primary'}
                            disabled={undefined}
                        >
                            I am here!
                        </MGBButton>
                    </div>
                </form>

                {parking ? (
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
                ) : (
                    <></>
                )}
            </div>

            <div className="basis-[85vw]">
                {showHospital ? (
                    <div>
                        <HospitalMap />
                    </div>
                ) : (
                    <Map
                        style={{ width: '100%', height: '92vh' }}
                        defaultCenter={{ lat: 42.32598, lng: -71.14957 }}
                        // MGB at Chestnut hill 42.325988270594415, -71.1495669288061
                        defaultZoom={15}
                    ></Map>
                )}
            </div>
        </div>
    );
};

export default DirectionsMapComponent;
