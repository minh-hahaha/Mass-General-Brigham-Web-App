import React, {ChangeEvent} from 'react';
import Buildings from "../components/DirectionsMapComponent"

// An interface that defines the props the component accepts
interface SelectElementProps {
    className?: string;
    label: string
    id: string
    value: string | number
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    options: string[];
    placeholder?: string;
}


const SelectElement : React.FC<SelectElementProps>  = ({label, id, value, onChange, required, options, placeholder}) => {
    return (
            <div className="flex items-center gap-2">
                <label className="w-1/4">{label}</label>
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    <option value="">Select destination building...</option>
                    {options.map((option,index ) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            </div>
    );
}




// Export the component so it can be used in other files
export default SelectElement;
