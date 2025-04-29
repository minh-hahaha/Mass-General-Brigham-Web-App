import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant: 'primary' | 'secondary'; // primary is BLUE, secondary is YELLOW
    disabled?: boolean;
    className?: string;
}

const MGBButton = ({ onClick, children, variant, disabled, className }: ButtonProps) => {
    return (
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
            <button
                className={`
                ${variant === 'primary' ? 'bg-mgbblue hover:bg-blue-950 text-white' : 'bg-mgbyellow hover:bg-yellow-600 text-codGray'}
                py-2 px-4 cursor-pointer rounded-sm text-sm tracking-wider
                ${className ? className : ''}
            `}
                onClick={onClick}
                disabled={disabled}
            >
                {children}
            </button>
        </motion.button>
    );
};

export default MGBButton;
