// floor type
interface Floor {
    id: string;
    floor: string;
    buildingId: string;
    buildingName: string; // for display
    svgPath: string;
}

interface FloorSelectorProps {
    floors: Floor[];
    currentFloorId: string;
    onChange: (floorId: string) => void;
}

const FloorSelector = ({floors, currentFloorId, onChange}: FloorSelectorProps) => {
    // Find current floor and building
    const currentFloor = floors.find(floor => floor.id === currentFloorId);
    const currentBuilding = currentFloor?.buildingId;

    // Filter floors to only show floors from the current building
    const relevantFloors = floors.filter(floor => floor.buildingId === currentBuilding);

    // Get building name from the first floor that has it
    const buildingName = relevantFloors[0]?.buildingName || `Building ${currentBuilding}`;

    // Only render if we have floors to show from the current building
    if (!relevantFloors.length) return null;

    return (
        <div className="absolute bottom-6 left-6 p-3 bg-white rounded-md shadow-md z-10">
            <div className="mb-2">
                <div className="text-sm font-medium text-gray-700 mb-1">{buildingName}</div>
                <div className="flex flex-col space-x-2">
                    {relevantFloors.map((floor) => (
                        <button
                            key={floor.id}
                            className={`w-10 h-10 rounded-full flex mt-3 items-center justify-center ${
                                currentFloorId === floor.id
                                    ? 'bg-mgbblue text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            onClick={() => onChange(floor.id)}
                        >
                            {floor.floor}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FloorSelector;