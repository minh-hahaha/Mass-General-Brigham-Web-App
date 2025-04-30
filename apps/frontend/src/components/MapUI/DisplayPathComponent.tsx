import React, { useEffect, useRef } from "react";
import { useMap, AdvancedMarker } from "@vis.gl/react-google-maps";

interface Props {
    coordinates: (google.maps.LatLng | google.maps.LatLngLiteral)[];
}

const DisplayPathComponent = ({ coordinates }: Props) => {
    const map = useMap();
    const polylineRef = useRef<google.maps.Polyline | null>(null);
    console.log("coords " + coordinates[0])
    useEffect(() => {
        if (!map) return;

        // Clean up previous polyline if it exists
        if (polylineRef.current) {
            polylineRef.current.setMap(null);
        }

        // Create new polyline if we have coordinates
        if (coordinates.length > 0) {
            const path = new google.maps.Polyline({
                path: coordinates,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
                icons: [{
                    icon: {
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 3,
                        fillColor: "#20499C",
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: 'black',
                    },
                    offset: '30px',
                    repeat: '100px'  // Show an arrow every 150 pixels
                }]
            });

            path.setMap(map);
            polylineRef.current = path;
        }

        // Cleanup function that runs when component unmounts or when effect reruns
        return () => {
            if (polylineRef.current) {
                polylineRef.current.setMap(null);
                polylineRef.current = null;
            }
        };
    }, [map, coordinates]); // Effect depends on map and coordinates

    // Only render markers if we have coordinates
    if (!coordinates.length) return null;

    return (
        <>
            {coordinates.map((coord, index) => (
                <AdvancedMarker
                    key={`marker-${index}`}
                    position={coord}
                >
                    <div style={{
                        position: 'relative',
                        bottom: '-8px',  // make node in middle of path
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="7" fill="white" stroke="#FF0000" strokeWidth="2"/>
                            <circle cx="8" cy="8" r="4" fill="#FF0000"/>
                        </svg>
                    </div>
                </AdvancedMarker>
            ))}
        </>
    );
};

export default DisplayPathComponent;