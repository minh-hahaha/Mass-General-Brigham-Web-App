import React, {useState, useEffect, useRef, useMemo, ChangeEvent} from 'react';
import MGBButton from '../elements/MGBButton.tsx';
import SelectElement from '../elements/SelectElement.tsx';
import { Map, useMap, useMapsLibrary, RenderingType } from '@vis.gl/react-google-maps';
import ChestnutHillMapComponent from './ChestnutHillMapComponent.tsx';
import TravelModeComponent from "@/components/TravelModeComponent.tsx";
import OverlayComponent from "@/components/svgOverlay.tsx";
import ViewPath from "@/components/ViewPath.tsx";
import {sampleNodes, sampleEdges, testNodes, testEdges} from "@/components/SampleNodesEdges.tsx";

const samplePath =["CH1Door1,", "CH1Hallway2", "CH1Hallway3", "CH1Door4", "CH1Room130"];
const testPath =["CH1Intersection1", "CH1Intersection2", "CH1Intersection3"];

const Buildings = [
    "20 Patriot Place",
    "22 Patriot Place",
    "Chestnut Hill - 850 Boylston Street",
];

type TravelModeType = 'DRIVING' | 'TRANSIT' | 'WALKING';

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
    }

    // draw route
    const calculateRoute = () => {
        if (!directionsRenderer || !directionsService) return;

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
        setShowHospital(prevState => !prevState);
    };


    const HospitalMap = () => {
        const [path, setPaths] = useState<string[][]>([]);
        // useEffect(() => {
        //     const getMyPaths = async () => {
        //         if (parkA) {
        //             const result = await cleanedUpBFS('A', 'G');
        //             console.log('ParkA   ' + result);
        //
        //             setPaths(result);
        //         } else if (parkB) {
        //             const result = await cleanedUpBFS('J', 'G');
        //             console.log('ParkB   ' + result);
        //             setPaths(result);
        //         } else if (parkC) {
        //             const result = await cleanedUpBFS('L', 'G');
        //             console.log('ParkC   ' + result);
        //             setPaths(result);
        //         } else {
        //             setPaths([]);
        //         }
        //     };
        //     getMyPaths();
        // }, [parkA, parkB, parkC]);
        //
        //
        //
        // return (
        //     <div>
        //         <ChestnutHillMapComponent svgPath={svg} nodeConnections={path} />
        //     </div>
        // );
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
                <div className="mt-2">
                    <MGBButton
                        onClick={() => handleHere()}
                        variant={'primary'}
                        disabled={undefined}
                    >
                        {showHospital ? 'Show Google Map' : "I'm Here!"}
                    </MGBButton>
                </div>

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
            </div>

            <div className="basis-5/6 relative">
                {showHospital ? (
                        toLocation === Buildings[2] ? (
                            <div>
                                <ViewPath svgMapUrl="/ChestnutHillFloor1.svg" nodes={sampleNodes} edges={sampleEdges} path={samplePath}/>
                            </div>
                        ) : (toLocation === Buildings[0] ? (
                                <div>
                                    <ViewPath svgMapUrl="/20PPFloor1.svg" nodes={testNodes} edges={testEdges} path={testPath}/>
                                </div>
                            ) : (
                                <div>
                                    <ViewPath svgMapUrl="/20PPFloor2.svg" nodes={testNodes} edges={testEdges} path={testPath}/>
                                </div>
                            )

                        )) :  (
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
