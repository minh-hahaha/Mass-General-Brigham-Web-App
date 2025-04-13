import React, {ChangeEvent} from 'react';

// An interface that defines the props the component accepts
interface InputElementProps {
    label: string
    for?: string
    type: 'text' | 'number' | 'email' | 'password' | 'tel' | 'date' | 'datetime-local' | 'radio';
    id: string
    value: string | number
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
    checked?: boolean; // for radio buttons
    name?: string; // for radio button groups
}


const InputElement : React.FC<InputElementProps>  = ({label, type, id, value, onChange, required, placeholder, checked, name}) => {
    if (type === 'radio') {
        return (
            <>
                <div className="w-1/4">
                    <input
                    type={type}
                    id={id}
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    required={required}
                    className="w-70 px-4 py-1.5 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                    <label htmlFor={id} className="ml-2">{label}</label>
                </div>
            </>
        );
    }
    return (
        <>
            <label className="w-1/4" >{label}</label>
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
