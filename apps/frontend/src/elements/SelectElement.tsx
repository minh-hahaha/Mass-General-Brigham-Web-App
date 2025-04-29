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


const SelectElement: React.FC<SelectElementProps> = ({
                                                         label,
                                                         id,
                                                         value,
                                                         onChange,
                                                         required,
                                                         options,
                                                         placeholder,
                                                         className = ''
                                                     }) => {
    return (
        <div className="flex flex-col space-y-1 w-full">
            <label htmlFor={id} className="text-sm font-medium text-codGray">
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                className={`px-3 py-2 rounded-sm border-1 border-mgbblue ${className}`}
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};




// Export the component so it can be used in other files
export default SelectElement;
