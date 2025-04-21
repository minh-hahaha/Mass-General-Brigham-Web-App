import {useMap, AdvancedMarker} from "@vis.gl/react-google-maps";

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
                />
            ))}
        </>
    );
};

export default DisplayPathComponent;