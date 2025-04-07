import {useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {APIProvider, Map, MapControl, useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import MGBButton from "../components/MGBButton.tsx";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


const HomePage = () => {
    return (
        <div>
            <APIProvider apiKey={API_KEY} libraries={['places','routes']}>
                <DirectionsMap/>
            </APIProvider>

        </div>



    );
};

export default HomePage;

function DirectionsMap(){
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes')
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);

    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    // const [error, setError] = useState('');


    useEffect(()=> {
        if(!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
    }, [map, routesLibrary])

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

    return(
        <div className="flex flex-row">
            <div className="basis-[22vw] bg-white p-6">
                <h2 className="text-xl font-bold mb-4">Get Directions</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label>From:</label>
                        <input
                            type="text"
                            id="fromLocation"
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
                            value={toLocation}
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={(e) => setToLocation(e.target.value)}
                            required
                            placeholder="Choose a destination point..."
                        />
                    </div>

                    <MGBButton onClick={()=>handleSubmit}
                               variant={'primary'}
                               disabled={!fromLocation || !toLocation}
                    >
                        Find Directions
                    </MGBButton>
                </form>

                {routes.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Route Information</h3>
                        <div className="mb-4 p-3 bg-gray-50 rounded">
                            <p className="font-medium">Route Details</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="basis-[80vw]">
                <Map
                    style={{width: '100%', height: '89vh'}}
                    defaultCenter={{lat: 42.32598, lng: -71.14957}}
                    // MGB at Chestnut hill 42.325988270594415, -71.1495669288061
                    defaultZoom={15}
                >
                </Map>
            </div>
        </div>
    )

}