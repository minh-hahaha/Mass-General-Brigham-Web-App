// components/FloorSelector.tsx
import React from "react";

interface Floor {
    id: string;
    floor: string;
    buildingId: string;
    buildingName: string;
    svgPath: string;
}

interface FloorSelectorProps {
    floors: Floor[];
    currentFloorId: string | undefined;
    onChange: (floorId: string) => void;
}

const FloorSelector: React.FC<FloorSelectorProps> = ({
                                                         floors,
                                                         currentFloorId,
                                                         onChange
                                                     }) => {
    // Group floors by building
    const floorsByBuilding: Record<string, Floor[]> = {};

    floors.forEach(floor => {
        if (!floorsByBuilding[floor.buildingId]) {
            floorsByBuilding[floor.buildingId] = [];
        }
        floorsByBuilding[floor.buildingId].push(floor);
    });

    return (
        <div className="absolute top left z-10 bg-white rounded-lg shadow-lg p-2 flex flex-col space-y-4">
            {Object.entries(floorsByBuilding).map(([buildingId, buildingFloors]) => (
                <div key={buildingId} className="flex flex-col items-center">
                    <h3 className="text-sm font-semibold mb-2">
                        {buildingFloors[0]?.buildingName || `Building ${buildingId}`}
                    </h3>
                    <div className="flex flex-col-reverse space-y-reverse space-y-2">
                        {buildingFloors
                            .sort((a, b) => Number(a.floor) - Number(b.floor))
                            .map(floor => (
                                <button
                                    key={floor.id}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${currentFloorId === floor.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'}`}
                                    onClick={() => onChange(floor.id)}
                                >
                                    {floor.floor}
                                </button>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FloorSelector;