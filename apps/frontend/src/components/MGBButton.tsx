import React from 'react';

// An interface that defines the props the component accepts
interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant: 'primary' | 'secondary';
    disabled: boolean;
}

// ExampleButton component definition
const MGBButton = ({ onClick, children, variant, disabled }: ButtonProps) => {
    return (
        <button
            //Todo: Add 'secondary' Tailwind style to match MGB theme colors
            className="bg-mgbblue hover:bg-blue-950 py-2 px-4 cursor-pointer text-white rounded-md text-sm tracking-wider"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

// Export the component so it can be used in other files
export default MGBButton;
