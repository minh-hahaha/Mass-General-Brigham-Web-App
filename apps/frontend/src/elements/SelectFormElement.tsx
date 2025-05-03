import React, {ChangeEvent} from 'react';
// import Buildings from "../components/DirectionsMapComponent"

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

const SelectFormElement: React.FC<SelectElementProps> = ({
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

        // TODO: @ANDREW HELP FIX TEXT ALIGNMENT FOR LABEL AND DROP DOWN
        <>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <div className="w-1/4">
                        <label htmlFor={id} className="w=1/4">
                            {label}
                        </label>
                    </div>
                    {/*<div className="w-3/4">*/}
                        <select
                            id={id}
                            value={value}
                            onChange={onChange}
                            required={required}
                            className={`w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300`}
                        >
                            <option value="">{placeholder}</option>
                            {options.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    {/*</div>*/}
                </div>
            </div>
        </>

    );
};




// Export the component so it can be used in other files
export default SelectFormElement;
