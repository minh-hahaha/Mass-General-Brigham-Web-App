import { useState, ChangeEvent } from "react";
import HospitalSVGEditor from "@/components/DrawNodes.tsx";

// Define types for our floor map
interface FloorMap {
    url: string;
    buildingId: string;
    floor: string;
    label: string;
    prefix: string,
}

const MapEditorPage= () => {
    // List of available floor maps
    const floorMaps: FloorMap[] = [
        {url: "/20PPFloor1.svg", buildingId: "2", floor: "1", prefix:"20PP", label: "20PP Floor 1"},
        {url: "/20PPFloor2.svg", buildingId: "2", floor: "2", prefix:"20PP",label: "20PP Floor 2"},
        {url: "/20PPFloor3.svg", buildingId: "2", floor: "3", prefix:"20PP",label: "20PP Floor 3"},
        {url: "/20PPFloor4.svg", buildingId: "2", floor: "4", prefix:"20PP",label: "20PP Floor 4"},
        {url: "/22PPFloor3.svg", buildingId: "3", floor: "3", prefix:"22PP",label: "22PP Floor 3"},
        {url: "/22PPFloor4.svg", buildingId: "3", floor: "4", prefix:"22PP",label: "22PP Floor 4"},
        {url: "/ChestnutHillFloor1.svg", buildingId: "1", floor: "1",prefix:"CH", label: "Chestnut Hill Floor 1"}
    ];

    // State to track the currently selected map
    const [selectedMap, setSelectedMap] = useState<FloorMap>(floorMaps[1]); // Default to 20PPFloor2

    // Handle map selection change
    const handleMapChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedUrl = event.target.value;
        const newMap = floorMaps.find(map => map.url === selectedUrl);
        if (newMap) {
            setSelectedMap(newMap);
        }
    }

        return (
            <div className="p-4">
                <div className="mb-4">
                    <label htmlFor="mapSelector" className="block text-sm font-medium mb-2">
                        Select Floor Map:
                    </label>
                    <div className="flex gap-4">
                        <select
                            id="mapSelector"
                            value={selectedMap.url}
                            onChange={handleMapChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {floorMaps.map((map) => (
                                <option key={map.url} value={map.url}>
                                    {map.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="border rounded-lg p-4">
                    <HospitalSVGEditor
                        svgMapUrl={selectedMap.url}
                        buildingId={selectedMap.buildingId}
                        currentFloor={selectedMap.floor}
                        prefix={selectedMap.prefix}
                    />
                </div>
            </div>
        );
}

export default MapEditorPage;
