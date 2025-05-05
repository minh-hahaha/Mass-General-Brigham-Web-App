import React, {useState, useEffect} from "react";

export interface Floor {
    id: string;
    floor: string;
    buildingId: string;
    buildingName: string;
    svgPath: string;
}

// All available floors across buildings
export const availableFloors: Floor[] = [
    // Chestnut Hill
    ///{ id: "CH-1", floor: "1", buildingId: "1", buildingName: "Chestnut Hill",svgPath: "/CH01.svg" },
    // 20 Patriot Place
    { id: "PP-1", floor: "1", buildingId: "2", buildingName: "Patriot Place", svgPath: "/PP01.svg" },
    { id: "PP-2", floor: "2", buildingId: "2", buildingName: "Patriot Place", svgPath: "/PP02.svg" },
    { id: "PP-3", floor: "3", buildingId: "2", buildingName: "Patriot Place", svgPath: "/PP03.svg" },
    { id: "PP-4", floor: "4", buildingId: "2", buildingName: "Patriot Place", svgPath: "/PP04.svg" },

    //{ id: "FK-1", floor: "1", buildingId: "3", buildingName: "Faulkner Hospital",svgPath: "/FK01.svg" },
];

interface FloorSelectorProps {
    currentFloorId: string | undefined;
    onChange: (floorId: string) => void;
    highlightFloorId?: string; // New prop for highlighting the target floor
}

const FloorSelector: React.FC<FloorSelectorProps> = ({
                                                         currentFloorId,
                                                         onChange,
                                                         highlightFloorId
                                                     }) => {

    // Filter floors to only show the current building
    // For PP, id 2
    //console.log("currentFloorId in FloorSelector: " + currentFloorId);
    const relevantFloors = availableFloors
        .filter(floor => floor.buildingId === "2")
        .sort((a, b) => Number(b.floor) - Number(a.floor)); // Highest floor first

    if (relevantFloors.length === 0) return null;

    return (
        <div className="bg-white rounded-lg p-4 shadow-xl justify-center">
            <h5 className="text-sm font-semibold mb-2 text-codGray text-center">
                Floor
            </h5>
            <div className="flex flex-col space-y-2">
                {relevantFloors.map(floor => (
                    <button
                        key={floor.id}
                        className={`w-10 h-10 border-1 border-mgbblue rounded-full flex items-center justify-center transition-all
                            ${currentFloorId === floor.id
                            ? 'bg-mgbblue text-white shadow-md transform scale-110'
                            : highlightFloorId === floor.id
                                ? 'bg-mgbblue text-black shadow-md animate-pulse'
                                : 'bg-gray-100 text-codGray hover:bg-fountainBlue'}`}
                        onClick={() => onChange(floor.id)}
                        aria-label={`Floor ${floor.floor}`}
                        title={`View floor ${floor.floor} of ${floor.buildingName}`}
                    >
                        {floor.floor}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FloorSelector;