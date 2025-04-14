import React from 'react';
import InputElement from '../elements/InputElement.tsx';

type TravelModeType = 'DRIVING' | 'TRANSIT' | 'WALKING';

const TRAVEL_MODES = [
    { id: 'DRIVING', label: 'Driving' },
    { id: 'TRANSIT', label: 'Public Transit' },
    { id: 'WALKING', label: 'Walking' },
];

interface TravelModeProps {
    selectedMode: TravelModeType;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// A radio button group with custom arrangement
const TravelModeComponent = ({ selectedMode, onChange }: TravelModeProps) => {
    return (
        <div className="mb-4">
            <p className="font-medium mb-2">Travel Mode:</p>
            <div className="flex flex-wrap gap-6">
                {TRAVEL_MODES.map((mode) => (
                    <div key={mode.id} className="flex flex-col items-center text-center w-20">
                        {/* We create a hidden InputElement just for the input part */}
                        <div className="mb-1">
                            <input
                                type="radio"
                                id={`mode-${mode.id}`}
                                name="travelMode"
                                value={mode.id}
                                checked={selectedMode === mode.id}
                                onChange={onChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <label
                            htmlFor={`mode-${mode.id}`}
                            className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            {mode.label}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TravelModeComponent;