import NodeEditorComponent from '@/components/NodeEditorComponent.tsx';
import { APIProvider, Map, RenderingType } from '@vis.gl/react-google-maps';
import OverlayComponent from '@/components/OverlayComponent.tsx';
import MGBButton from '@/elements/MGBButton.tsx';

const TestNodeEditor = () => {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const ChestnutParkingBounds = {
        southWest: { lat: 42.32546535760605, lng: -71.15029519348985 }, // Bottom-left corner
        northEast: { lat: 42.32659860801865, lng: -71.14889438933609 }, // Top-right corner
    };

    const ChestnutParkingSVG = '/ChestnutParking.svg';
    return (
        <div>
            <APIProvider apiKey={API_KEY} libraries={['maps', 'drawing']}>
                <div style={{ height: '100vh', width: '100%' }}>
                    <Map
                        style={{ width: '100%', height: '100%' }}
                        defaultCenter={{ lat: 42.32598, lng: -71.14957 }}
                        // MGB at Chestnut hill 42.325988270594415, -71.1495669288061
                        defaultZoom={15}
                        renderingType={RenderingType.RASTER}
                        mapTypeControl={false}
                    >
                        <OverlayComponent
                            bounds={ChestnutParkingBounds}
                            imageSrc={ChestnutParkingSVG}
                            visible={true}
                        />
                        <NodeEditorComponent></NodeEditorComponent>
                    </Map>
                </div>
            </APIProvider>
        </div>
    );
}

export default TestNodeEditor;