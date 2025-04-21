import React from 'react';
import DirectionsMapComponent from "@/components/DirectionsMapComponent.tsx";
import {APIProvider} from "@vis.gl/react-google-maps";

export const MapPage = () => {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    return (
        <div className="relative w-full h-full overflow-hidden">
            <APIProvider apiKey={API_KEY} libraries={['places','routes']}>
                <DirectionsMapComponent/>
            </APIProvider>
        </div>
    );
}