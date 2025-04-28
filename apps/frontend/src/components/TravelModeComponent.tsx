import React from 'react';
import { FaCar, FaTrainSubway, FaPersonWalking } from "react-icons/fa6";

type TravelModeType = 'DRIVING' | 'TRANSIT' | 'WALKING';

const travelIcons = {
    DRIVING: <FaCar className="w-6 h-6" />,
    TRANSIT: <FaTrainSubway className="w-6 h-6" />,
    WALKING: <FaPersonWalking className="w-6 h-6" />
};

const TRAVEL_MODES = [
    { id: 'DRIVING', label: 'Driving' },
    { id: 'TRANSIT', label: 'Transit' },
    { id: 'WALKING', label: 'Walking' }
];

interface TravelModeProps {
    selectedMode: TravelModeType;
    onChange: (mode: TravelModeType) => void;
}

const TravelModeComponent = ({ selectedMode, onChange }: TravelModeProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value as TravelModeType);
    }
    return (
        <div className="mb-6">
            <div className="flex gap-6">
                {TRAVEL_MODES.map((mode) => (
                    <label
                        key={mode.id}
                        htmlFor={`mode-${mode.id}`}
                        className={`p-3 rounded-lg border ${
                            selectedMode === mode.id
                                ? 'bg-mgbblue text-white'
                                : 'bg-white text-codGray border-mgbblue'
                        } flex flex-col items-center cursor-pointer shadow-sm transition-all hover:bg-mgbblue hover:text-white`}
                    >
                        <input
                            type="radio"
                            id={`mode-${mode.id}`}
                            name="travelMode"
                            value={mode.id}
                            checked={selectedMode === mode.id}
                            onChange={handleChange}
                            className="hidden"
                        />
                        {travelIcons[mode.id as TravelModeType]}
                        <span className="mt-1 text-xs">{mode.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default TravelModeComponent;
