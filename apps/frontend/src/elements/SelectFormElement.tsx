import React, { ChangeEvent } from 'react';

// An interface that defines the props the component accepts
interface SelectElementProps {
    className?: string;
    label: string;
    id: string;
    value: string | number;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    options: string[];
    placeholder?: string;
}

const SelectFormElement: React.FC<SelectElementProps> = ({
                                                             label,
                                                             id,
                                                             value,
                                                             onChange,
                                                             required,
                                                             options,
                                                             placeholder,
                                                             className = '',
                                                         }) => {
    return (
        // TODO: @ANDREW HELP FIX TEXT ALIGNMENT FOR LABEL AND DROP DOWN
        <div className="flex flex-col gap-1 w-full">
            <label
                htmlFor={id}
                className="text-sm font-medium text-gray-700 mb-1"
            >
                {label}:
            </label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full px-4 py-2 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
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
export default SelectFormElement;
