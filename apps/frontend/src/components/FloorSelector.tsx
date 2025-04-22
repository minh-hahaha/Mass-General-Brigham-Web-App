// components/FloorSelector.tsx
import React from "react";

interface Floor {
    id: string;
    floor: string;
    buildingId: string;
    buildingName: string;
    svgPath: string;
}

// All available floors across buildings
const availableFloors: Floor[] = [
    // Chestnut Hill
    { id: "CH-1", floor: "1", buildingId: "1", buildingName: "Chestnut Hill",svgPath: "/CH01.svg" },
    // 20 Patriot Place
    { id: "PP-1", floor: "1", buildingId: "2", buildingName: "Patriot Place", svgPath: "/PP01.svg" },
    { id: "PP-2", floor: "2", buildingId: "2", buildingName: "Patriot Place",svgPath: "/PP02.svg" },
    { id: "PP-3", floor: "3", buildingId: "2", buildingName: "Patriot Place",svgPath: "/PP03.svg" },
    { id: "PP-4", floor: "4", buildingId: "2", buildingName: "Patriot Place",svgPath: "/PP04.svg" },
];


interface FloorSelectorProps {
    currentFloorId: string | undefined;
    onChange: (floorId: string) => void;
}

const FloorSelector: React.FC<FloorSelectorProps> = ({
                                                         currentFloorId,
                                                         onChange
                                                     }) => {
    // Group floors by building
    const floorsByBuilding: Record<string, Floor[]> = {};

    availableFloors.forEach(floor => {
        if (!floorsByBuilding[floor.buildingId]) {
            floorsByBuilding[floor.buildingId] = [];
        }
        floorsByBuilding[floor.buildingId].push(floor);
    });

    return (
        <div className="z-10 bg-white rounded-lg p-4 flex flex-col">
            {Object.entries(floorsByBuilding).map(([buildingId, buildingFloors]) => (
                <div key={buildingId} className="flex flex-col">
                    <h3 className="text-sm font-semibold mb-2 text-codGray">
                        {buildingFloors[0]?.buildingName || `Building ${buildingId}`}
                    </h3>
                    <div className="flex flex-col space-y-2">
                        {buildingFloors
                            .sort((a, b) => Number(a.floor) - Number(b.floor))
                            .map(floor => (
                                <button
                                    key={floor.id}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center
                                        ${currentFloorId === floor.id
                                        ? 'bg-mgbblue text-white'
                                        : 'bg-mgbblue hover:bg-fountainBlue'}`}
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