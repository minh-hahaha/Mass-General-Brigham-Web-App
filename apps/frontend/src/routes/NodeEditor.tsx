import NodeEditorComponent from '@/components/NodeEditorComponent.tsx';
import { APIProvider, Map, RenderingType } from '@vis.gl/react-google-maps';
import OverlayComponent from "@/components/MapUI/OverlayMapComponent.tsx";
import FloorSelector from "@/components/MapUI/FloorSelector.tsx";
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
    southWest: { lat: 42.300397452801334, lng: -71.13067929034223 }, // Bottom-left corner
    northEast: { lat: 42.303013662584725, lng: -71.12649564266864}, // Top-right corner
};

const BWHBounds = {
    southWest: { lat: 42.33423529941985, lng: -71.10939107354605}, // Bottom-left corner
    northEast: { lat: 42.33712348778656, lng: -71.10387302007483}, // Top-right corner
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

    { id: "BWH-2", floor: "2", buildingId: "4", buildingName: "Main Hospital",svgPath: "/BWH02.svg" },

];

const NodeEditor = () => {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const [currentFloorId, setCurrentFloorId] = useState<string>("CH-1");
    const [instructionVisible, setInstructionVisible] = useState(false);
    const [showMap, setShowMap] = useState(true);

    // show instructions after a delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setInstructionVisible(true);
        }, 1000);

        return () => clearTimeout(timer); // Clean up
    }, []);

    const handleFloorChange = (floorId: string) => {
        console.log("handleFloorChange", floorId);
        setCurrentFloorId(floorId);
    };

    // seperate out current floor for PP and CH
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

    const updateFloor = (floorId: string) => {
        setCurrentFloorId(floorId);
    }


    const chestnutHillFloor = getChestnutHillFloor();
    const patriotPlaceFloor = getCurrentPatriotPlaceFloor();
    console.log("PPFloor", patriotPlaceFloor);
    return (
        <>
            <div>
                <APIProvider apiKey={API_KEY} libraries={['maps', 'drawing', 'marker']}>
                    <div style={{ height: '100vh', width: '100%' }}>

                        <Map
                            style={{ width: '100%', height: '100%' }}
                            defaultCenter={{ lat: 42.32598, lng: -71.14957 }}
                            // MGB at Chestnut hill 42.325988270594415, -71.1495669288061
                            defaultZoom={15}
                            renderingType={RenderingType.RASTER}
                            mapTypeControl={false}
                            mapId={"10f50e6c04bae897"}
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
                            <OverlayComponent
                                bounds={BWHBounds}
                                imageSrc={'/BWH02.svg'}
                            />
                            <div
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-r-md cursor-pointer z-20"
                            >
                                {/*<FloorSelector currentFloorId={currentFloorId} onChange={handleFloorChange} />*/}
                            </div>
                            <NodeEditorComponent updateFloor={handleFloorChange}></NodeEditorComponent>
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

export default NodeEditor;