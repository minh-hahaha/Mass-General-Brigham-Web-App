import React, {ChangeEvent} from 'react';

// An interface that defines the props the component accepts
interface InputElementProps {
    label: string
    type: 'text' | 'number' | 'email' | 'password' | 'tel' | 'date' | 'datetime-local';
    id: string
    value: string | number
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
}


const InputElement : React.FC<InputElementProps>  = ({label, type, id, value, onChange, required,placeholder}) => {
    return (
        <>
            <label className="w-1/4">{label}</label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
        </>
    );
}




// Export the component so it can be used in other files
export default InputElement;
