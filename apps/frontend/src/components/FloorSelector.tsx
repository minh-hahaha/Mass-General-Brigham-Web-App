
// floor type
interface Floor {
    id: string;
    label: string;
    building: string;
}

interface FloorSelectorProps {
    floors: Floor[];
    currentFloorId: string;
    onChange: (floorId: string) => void;
}

const FloorSelector = ({floors, currentFloorId, onChange}: FloorSelectorProps) => {
    // Group floors by building
    const buildingGroups = floors.reduce((groups: Record<string, Floor[]>, floor) => {
        if (!groups[floor.building]) {
            groups[floor.building] = [];
        }
        groups[floor.building].push(floor);
        return groups;
    }, {});

    return (
        <div className="absolute bottom-6 left-6 p-3 bg-white rounded-md shadow-md z-10">
            {Object.entries(buildingGroups).map(([building, buildingFloors]) => (
                <div key={building} className="mb-2">
                    <div className="text-sm font-medium text-gray-700 mb-1">{building}</div>
                    <div className="flex flex-row space-x-2">
                        {buildingFloors.map((floor) => (
                            <button
                                key={floor.id}
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    currentFloorId === floor.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                onClick={() => onChange(floor.id)}
                            >
                                {floor.label}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FloorSelector;

