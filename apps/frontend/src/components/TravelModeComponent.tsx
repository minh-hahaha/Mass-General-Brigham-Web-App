import { Car, Train, Footprints } from 'lucide-react';
import React from 'react';

type TravelModeType = 'DRIVING' | 'TRANSIT' | 'WALKING';

const travelIcons = {
    DRIVING: <Car className="w-6 h-6" />,
    TRANSIT: <Train className="w-6 h-6" />,
    WALKING: <Footprints className="w-6 h-6" />
};

const TRAVEL_MODES = [
    { id: 'DRIVING', label: 'Driving' },
    { id: 'TRANSIT', label: 'Transit' },
    { id: 'WALKING', label: 'Walking' }
];

interface TravelModeProps {
    selectedMode: TravelModeType;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TravelModeComponent = ({ selectedMode, onChange }: TravelModeProps) => {
    return (
        <div className="mb-6">
            <p className="text-sm font-semibold text-mgbblue mb-3">Choose Travel Mode</p>
            <div className="flex gap-4">
                {TRAVEL_MODES.map((mode) => (
                    <label
                        key={mode.id}
                        htmlFor={`mode-${mode.id}`}
                        className={`p-3 rounded-lg border ${
                            selectedMode === mode.id
                                ? 'bg-mgbblue text-white'
                                : 'bg-white text-mgbblue border-mgbblue'
                        } flex flex-col items-center gap-1 cursor-pointer shadow-sm transition-all hover:bg-mgbblue hover:text-white`}
                    >
                        <input
                            type="radio"
                            id={`mode-${mode.id}`}
                            name="travelMode"
                            value={mode.id}
                            checked={selectedMode === mode.id}
                            onChange={onChange}
                            className="hidden"
                        />
                        {travelIcons[mode.id as TravelModeType]}
                        <span className="text-xs">{mode.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default TravelModeComponent;
