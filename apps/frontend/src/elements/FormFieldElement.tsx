import React, { ChangeEvent } from 'react';

interface FormFieldElementProps {
    className?: string;
    label: string;
    id: string;
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    required?: boolean;
    placeholder?: string;
    type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'date' | 'datetime-local' | 'select';
    options?: string[]; // only for type='select'
}

const FormFieldElement: React.FC<FormFieldElementProps> = ({
                                                               label,
                                                               id,
                                                               value,
                                                               onChange,
                                                               required = false,
                                                               placeholder = '',
                                                               type = 'text',
                                                               options = [],
                                                               className = ''
                                                           }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
                {label}:
            </label>
            {type === 'select' ? (
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
            ) : (
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2 border-2 border-mgbblue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
                />
            )}
        </div>
    );
};

export default FormFieldElement;