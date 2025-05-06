import React, { useEffect, useRef, useState } from "react";
import { useMap, AdvancedMarker } from "@vis.gl/react-google-maps";

interface Props {
    coordinates: (google.maps.LatLng | google.maps.LatLngLiteral)[];
}

const DisplayPathComponent = ({ coordinates }: Props) => {
    const map = useMap();
    const polylineRef = useRef<google.maps.Polyline | null>(null);
    const [offset, setOffset] = useState(0);

    // Animate offset with requestAnimationFrame
    // Animate offset with requestAnimationFrame targeting 120fps
    useEffect(() => {
        let animationFrameId: number;
        let lastTimestamp: number | null = null;
        const speed = 0.0095; // Animation speed factor
        const frameTime = 1000 / 120; // Target ~60fps (8.33ms per frame)

        const animate = (timestamp: number) => {
            if (!lastTimestamp) lastTimestamp = timestamp;

            const elapsed = timestamp - lastTimestamp;

            if (elapsed >= frameTime) { // Update when at least 8.33ms have passed (120fps)
                setOffset(prev => (prev + speed * elapsed) % 100);
                lastTimestamp = timestamp;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    useEffect(() => {
        if (!map) return;

        // Clean up previous polyline
        if (polylineRef.current) {
            polylineRef.current.setMap(null);
        }

        if (coordinates.length > 0) {
            // Create border polyline (underneath)
            const borderPath = new google.maps.Polyline({
                path: coordinates,
                geodesic: true,
                strokeColor: "#20499C", // Border color
                strokeWeight: 7,
                strokeOpacity: 1,
                zIndex: 0
            });

            // Create main path with dashed arrows
            const path = new google.maps.Polyline({
                path: coordinates,
                geodesic: true,
                strokeColor: "#B7E2E4", // Base line color
                strokeWeight: 3,
                strokeOpacity: 1,
                zIndex: 1,
                icons: [{
                    icon: {
                        path: 'M 0,-1 0,1', // Simple dash
                        strokeOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "#20499C"
                    },
                    offset: '0',
                    repeat: '10px' // Dash spacing
                }, {
                    icon: {
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 3,
                        strokeColor: "#20499C",
                        fillColor: "#20499C",
                        fillOpacity: 1
                    },
                    offset: `${offset}%`,
                    repeat: '80px' // Space between arrows
                }]
            });

            // Add both to map
            borderPath.setMap(map);
            path.setMap(map);

            // Store reference for cleanup
            polylineRef.current = path;

            // Extend setMap to handle both polylines
            const originalSetMap = polylineRef.current.setMap.bind(polylineRef.current);
            polylineRef.current.setMap = (newMap: google.maps.Map | null) => {
                originalSetMap(newMap);
                borderPath.setMap(newMap);
            };
        }

        return () => {
            if (polylineRef.current) {
                polylineRef.current.setMap(null);
                polylineRef.current = null;
            }
        };
    }, [map, coordinates, offset]);

    if (!coordinates.length) return null;

    // Get start and end coordinates
    const startPoint = coordinates[0];
    const endPoint = coordinates[coordinates.length - 1];

    return (
        <>
            {/*/!* Regular markers for all points *!/*/}
            {/*{coordinates.map((coord, index) => (*/}
            {/*    <AdvancedMarker key={`marker-${index}`} position={coord}>*/}
            {/*        <div style={{ position: 'relative', bottom: '-8px' }}>*/}
            {/*            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">*/}
            {/*                <circle cx="8" cy="8" r="7" fill="white" stroke="#20499C" strokeWidth="2"/>*/}
            {/*                <circle cx="8" cy="8" r="4" fill="#20499C"/>*/}
            {/*            </svg>*/}
            {/*        </div>*/}
            {/*    </AdvancedMarker>*/}
            {/*))}*/}

            {/* Start point label */}
            <AdvancedMarker position={startPoint}>
                <div style={{ position: 'relative', bottom: '-8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="7" fill="white" stroke="#20499C" strokeWidth="2"/>
                        <circle cx="8" cy="8" r="4" fill="#20499C"/>
                    </svg>
                </div>
            </AdvancedMarker>

            {/* End point label */}
            <AdvancedMarker position={endPoint}>

                <div style={{ position: 'relative', bottom: '-8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="7" fill="white" stroke="#20499C" strokeWidth="2"/>
                        <circle cx="8" cy="8" r="4" fill="#20499C"/>
                    </svg>
                </div>
            </AdvancedMarker>
        </>
    );
};

export default DisplayPathComponent;