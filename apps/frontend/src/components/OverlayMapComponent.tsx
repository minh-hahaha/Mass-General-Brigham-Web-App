import React, { useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

interface ParkingOverlayProps {
    bounds: {
        southWest: { lat: number; lng: number };
        northEast: { lat: number; lng: number };
    };
    imageSrc: string;
    visible: boolean;
}

const OverlayMapComponent: React.FC<ParkingOverlayProps> = ({
                                                                    bounds,
                                                                    imageSrc,
                                                                    visible,
                                                                }) => {
    const map = useMap();
    const mapsLibrary = useMapsLibrary('maps');

    useEffect(() => {
        if (!map || !mapsLibrary || !visible) return;

        // bounds with coordinates
        const overlayBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(bounds.southWest.lat, bounds.southWest.lng),
            new google.maps.LatLng(bounds.northEast.lat, bounds.northEast.lng)
        );

        // Create the ground overlay
        const groundOverlay = new mapsLibrary.GroundOverlay(
            imageSrc,
            overlayBounds,
            {
                clickable: false,
            }
        );

        // Add the overlay to the map
        groundOverlay.setMap(map);

        // Clean up function to remove overlay when component unmounts
        // or when visible changes to false
        return () => {
            groundOverlay.setMap(null);
        };
    }, [map, mapsLibrary, bounds, imageSrc, visible]);

    return null;
};

export default OverlayMapComponent;