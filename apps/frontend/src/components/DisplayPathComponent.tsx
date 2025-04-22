import {useMap, AdvancedMarker} from "@vis.gl/react-google-maps";
const parser = new DOMParser();

interface Props {
    coordinates: (google.maps.LatLng | google.maps.LatLngLiteral)[],
}

const DisplayPathComponent = ({ coordinates }: Props) => {
    const map = useMap();
    if (!map) return;

    const flightPath = new google.maps.Polyline({
        path: coordinates,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });

    flightPath.setMap(map);



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
                            <circle cx="8" cy="8" r="7" fill="white" stroke="#FF0000" stroke-width="2"/>
                            <circle cx="8" cy="8" r="4" fill="#FF0000"/>
                        </svg>
                    </div>
                </AdvancedMarker>
            ))}
        </>
    );
};

export default DisplayPathComponent;