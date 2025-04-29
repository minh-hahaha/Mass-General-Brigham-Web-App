import NodeEditorComponent from '@/components/NodeEditorComponent.tsx';
import { APIProvider, Map, RenderingType } from '@vis.gl/react-google-maps';
import OverlayComponent from "@/components/OverlayMapComponent.tsx";
import FloorSelector from "@/components/FloorSelector.tsx";
import { useState, useEffect } from "react";
import MapInstructions from "@/components/MapInstructions.tsx";

const ChestnutHillBounds = {
    southWest: { lat: 42.32543670863917, lng: -71.15022693442262 }, // Bottom-left corner
    northEast: { lat: 42.32649756743757, lng: -71.14898211823991 }, // Top-right corner
};

const PatriotPlaceBounds = {
    southWest: { lat: 42.09086272947439, lng: -71.2675430325 }, // Bottom-left corner
    northEast: { lat: 42.09342690806031, lng: -71.2649785507 }, // Top-right corner
};

const FaulknerBounds = {
    southWest: { lat: 42.300487127183445, lng: -71.13067267701479 }, // Bottom-left corner
    northEast: { lat: 42.30301668867676, lng: -71.126350413866 }, // Top-right corner
};

// floor type
interface Floor {
    id: string;
    floor: string;
    buildingId: string;
    buildingName: string; // for display
    svgPath: string;
}

const availableFloors: Floor[] = [
    // Chestnut Hill
    { id: "CH-1", floor: "1", buildingId: "1", buildingName: "Chestnut Hill",svgPath: "/CH01.svg" },
    // 20 Patriot Place
    { id: "PP-1", floor: "1", buildingId: "2", buildingName: "Patriot Place", svgPath: "/PP01.svg" },
    { id: "PP-2", floor: "2", buildingId: "2", buildingName: "Patriot Place",svgPath: "/PP02.svg" },
    { id: "PP-3", floor: "3", buildingId: "2", buildingName: "Patriot Place",svgPath: "/PP03.svg" },
    { id: "PP-4", floor: "4", buildingId: "2", buildingName: "Patriot Place",svgPath: "/PP04.svg" },
    { id: "FK-1", floor: "1", buildingId: "3", buildingName: "Faulkner Hospital",svgPath: "/FK01.svg" },
];

const TestNodeEditor = () => {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const [currentFloorId, setCurrentFloorId] = useState<string>("CH-1");
    const [instructionVisible, setInstructionVisible] = useState(false);
    const [showMap, setShowMap] = useState(true);

    // show instructions after a delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setInstructionVisible(true);
        }, 2000);

        return () => clearTimeout(timer); // Clean up
    }, []);

    const handleFloorChange = (floorId: string) => {
        setCurrentFloorId(floorId);
    };

    // separate out current floor for PP and CH
    // Get the current Patriot Place floor data
    const getCurrentPatriotPlaceFloor = () => {
        let floorId = currentFloorId;
        if (!floorId?.startsWith('PP-')) {
            floorId = "PP-1"; // Default to PP-1 if not a PP floor
        }

        // Find the floor data
        return availableFloors.find(f => f.id === floorId) || availableFloors.find(f => f.id === "PP-1")!;
    };

    const getChestnutHillFloor = () => {
        return availableFloors.find(f => f.id === "CH-1")!;
    };

    const chestnutHillFloor = getChestnutHillFloor();
    const patriotPlaceFloor = getCurrentPatriotPlaceFloor();

    return (
        <>
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
                                bounds={ChestnutHillBounds}
                                imageSrc={chestnutHillFloor.svgPath}
                            />
                            <OverlayComponent
                                bounds={PatriotPlaceBounds}
                                imageSrc={patriotPlaceFloor.svgPath}
                            />
                            <OverlayComponent
                                bounds={FaulknerBounds}
                                imageSrc={'/FK01.svg'}
                            />
                            <div
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-r-md cursor-pointer z-20"
                            >
                                <FloorSelector currentFloorId={currentFloorId} onChange={handleFloorChange} />
                            </div>
                            <NodeEditorComponent currentFloorId={currentFloorId} ></NodeEditorComponent>
                        </Map>
                    </div>
                </APIProvider>
            </div>
            {instructionVisible && (
                <div className="fixed inset-0 z-50">
                    <MapInstructions onClose={() => setInstructionVisible(false)} />
                </div>
            )}
        </>
    );
}

export default TestNodeEditor;