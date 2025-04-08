import {APIProvider} from '@vis.gl/react-google-maps';
import DirectionsMapComponent from "../components/DirectionsMapComponent.tsx";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


const HomePage = () => {
    return (
        <div>
            <APIProvider apiKey={API_KEY} libraries={['places','routes']}>
                <DirectionsMapComponent/>
            </APIProvider>
        </div>

    );
};

export default HomePage;

