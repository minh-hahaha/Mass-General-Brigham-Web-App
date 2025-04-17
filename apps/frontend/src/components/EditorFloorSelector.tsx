import { useState } from 'react';

// floor type
interface Floor {
    id: string;
    label: string;
    building: string;
    buildingName?: string; // Optional building name
}

interface FloorSelectorProps {
    floors: Floor[];
    currentFloorId: string;
    onChange: (floorId: string) => void;
}

const EditorFloorSelector = ({ floors, currentFloorId, onChange}: FloorSelectorProps) => {
    // Find current floor and building
    const currentFloor = floors.find(floor => floor.id === currentFloorId);
    const currentBuilding = currentFloor?.building;

    // Get all unique buildings from floors
    const allBuildings = [...new Set(floors.map(floor => floor.building))];

    // State to track which building's floors to display when in compact mode
    const [expandedBuilding, setExpandedBuilding] = useState<string | null>(null);

    // Function to get building name
    const getBuildingName = (buildingId: string): string => {
        const firstFloor = floors.find(floor => floor.building === buildingId && floor.buildingName);
        return firstFloor?.buildingName || `Building ${buildingId}`;
    };

    // If showing full view (all buildings)

        return (
            <div className="absolute bottom-6 left-6 p-3 bg-white rounded-md shadow-md z-10 max-h-[70vh] overflow-y-auto">
                {allBuildings.map(buildingId => {
                    // Get floors for this building
                    const buildingFloors = floors.filter(floor => floor.building === buildingId);
                    // Get building name
                    const buildingName = getBuildingName(buildingId);

                    return (
                        <div key={buildingId} className="mb-4">
                            <div className="text-sm font-medium text-gray-700 mb-2">
                                {buildingName}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {buildingFloors.map(floor => (
                                    <button
                                        key={floor.id}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            currentFloorId === floor.id
                                                ? 'bg-mgbblue text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                        onClick={() => onChange(floor.id)}
                                    >
                                        {floor.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
}

    // // Default compact view - only show current building floors
    // // With option to expand to see other buildings
    // const relevantFloors = floors.filter(floor => floor.building === currentBuilding);
    // const buildingName = getBuildingName(currentBuilding || '');
    //
    // // If no floors for current building, return null
    // if (!relevantFloors.length) return null;
    //
    // return (
    //     <div className="absolute bottom-6 left-6 p-3 bg-white rounded-md shadow-md z-10">
    //         <div className="mb-2">
    //             <div className="flex items-center justify-between">
    //                 <div className="text-sm font-medium text-gray-700 mb-1">{buildingName}</div>
    //                 <button
    //                     onClick={() => setExpandedBuilding(expandedBuilding ? null : 'menu')}
    //                     className="text-sm text-blue-600 hover:text-blue-800"
    //                 >
    //                     {expandedBuilding ? 'Close' : 'More'}
    //                 </button>
    //             </div>
    //
    //             <div className="flex flex-col space-y-2">
    //                 {relevantFloors.map((floor) => (
    //                     <button
    //                         key={floor.id}
    //                         className={`w-10 h-10 rounded-full flex items-center justify-center ${
    //                             currentFloorId === floor.id
    //                                 ? 'bg-mgbblue text-white'
    //                                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    //                         }`}
    //                         onClick={() => onChange(floor.id)}
    //                     >
    //                         {floor.label}
    //                     </button>
    //                 ))}
    //             </div>
    //         </div>
    //
    //         {/* Expanded view showing all buildings */}
    //         {expandedBuilding && (
    //             <div className="mt-3 pt-3 border-t border-gray-200">
    //                 <div className="text-sm font-medium text-gray-700 mb-2">Other Buildings</div>
    //                 {allBuildings
    //                     .filter(buildingId => buildingId !== currentBuilding)
    //                     .map(buildingId => {
    //                         const buildingFloors = floors.filter(floor => floor.building === buildingId);
    //                         const otherBuildingName = getBuildingName(buildingId);
    //
    //                         return (
    //                             <div key={buildingId} className="mb-3">
    //                                 <div className="text-xs font-medium text-gray-600 mb-1">{otherBuildingName}</div>
    //                                 <div className="flex flex-wrap gap-2">
    //                                     {buildingFloors.map(floor => (
    //                                         <button
    //                                             key={floor.id}
    //                                             className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm"
    //                                             onClick={() => {
    //                                                 onChange(floor.id);
    //                                                 setExpandedBuilding(null);
    //                                             }}
    //                                         >
    //                                             {floor.label}
    //                                         </button>
    //                                     ))}
    //                                 </div>
    //                             </div>
    //                         );
    //                     })}
    //             </div>
    //         )}
    //     </div>
    // );
// };

export default EditorFloorSelector;