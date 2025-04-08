import React, { Component, useState, useEffect, useRef} from 'react';
import MGBButton from "./MGBButton.tsx";
import {Map, useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
// import {ReactComponent as HospitalMap} from '../assets/ChestnutHill Parking Lot + Floor 1.svg'

const  DirectionsMapComponent = () => {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes')
    const placesLibrary = useMapsLibrary('places')
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);

    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

    useEffect(()=> {
        if(!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
    }, [map, routesLibrary])


    // refs for autocomplete
    const fromLocationRef = useRef(null)
    const toLocationRef = useRef(null)

    useEffect(()=>{
        if (!placesLibrary || !fromLocationRef.current || !toLocationRef.current) return

        // autocomplete for origin
        const fromAutocomplete = new placesLibrary.Autocomplete(fromLocationRef.current, {
            types: ['geocode', 'establishment'],
            fields: ['place_id', 'geometry', 'formatted_address', 'name']
        })
        // autocomplete for origin
        const toAutocomplete = new placesLibrary.Autocomplete(toLocationRef.current, {
            types: ['geocode', 'establishment'],
            fields: ['place_id', 'geometry', 'formatted_address', 'name']
        })


        // event listeners so that when autocomplete the state is changed
        fromAutocomplete.addListener('place_changed', () => {
            const place = fromAutocomplete.getPlace();
            if (place.formatted_address) {
                setFromLocation(place.formatted_address);
            }
        });

        toAutocomplete.addListener('place_changed', () => {
            const place = toAutocomplete.getPlace();
            if (place.formatted_address) {
                setToLocation(place.formatted_address);
            }
        });
    }, [placesLibrary])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        calculateRoute();
    }

    const calculateRoute = () => {
        if(!directionsRenderer || !directionsService) return;

        directionsService.route({
            origin: fromLocation,
            destination: toLocation,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: false
        }).then((response) => {
            directionsRenderer.setDirections(response);
            setRoutes(response.routes);
        })
    }


    // const handleHere = () => {
    //     setHospitalMap();
    // }

    // const setHospitalMap = () => {
    //     <HospitalMap/>
    // }

    return (
        <div className="flex flex-row">
            <div className="basis-[22vw] bg-white p-6">
                <h2 className="text-xl font-bold mb-4">Get Directions</h2>
                <form onSubmit={handleSubmit}>
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
                    <div className="mb-4">
                        <label>To:</label>
                        <input
                            type="text"
                            id="toLocation"
                            ref={toLocationRef}
                            value={toLocation}
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={(e) => setToLocation(e.target.value)}
                            required
                            placeholder="Choose a destination point..."
                        />
                    </div>

                    <MGBButton
                        onClick={() => handleSubmit}
                        variant={'primary'}
                        disabled={!fromLocation || !toLocation}
                    >
                        Find Directions
                    </MGBButton>
                </form>
            </div>

            <div className="basis-[80vw]">
                <Map
                    style={{ width: '100%', height: '89vh' }}
                    defaultCenter={{ lat: 42.32598, lng: -71.14957 }}
                    // MGB at Chestnut hill 42.325988270594415, -71.1495669288061
                    defaultZoom={15}
                ></Map>
            </div>
        </div>
    );

}

export default DirectionsMapComponent;
