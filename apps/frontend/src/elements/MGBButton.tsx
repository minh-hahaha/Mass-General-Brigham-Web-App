import React from 'react';

// An interface that defines the props the component accepts
interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant: 'primary' | 'secondary'; // primary is BLUE, secondary is GRAY
    disabled: boolean | undefined;
}

// ExampleButton component definition
const MGBButton = ({ onClick, children, variant, disabled }: ButtonProps) => {
    return (
        <button
            className={`
                ${variant === 'primary' ? 'bg-mgbblue hover:bg-blue-950 text-white' : 'bg-mgbyellow hover:bg-yellow-600 text-codGray'}
                py-2 px-4 cursor-pointer rounded-sm text-sm tracking-wider
            `}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

// Export the component so it can be used in other files
export default MGBButton;
