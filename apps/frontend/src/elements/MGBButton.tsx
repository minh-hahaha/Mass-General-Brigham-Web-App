import React from 'react';
import { motion } from 'framer-motion';
type TravelModeType = 'DRIVING' | 'TRANSIT' | 'WALKING';

interface ButtonProps {
    onClick?: () => void;
    onTravelModeClick?: (mode: TravelModeType) => void;
    travelMode?: TravelModeType;
    children: React.ReactNode;
    variant: 'primary' | 'secondary'; // primary is BLUE, secondary is YELLOW
    disabled?: boolean;
    className?: string;
}

const MGBButton = ({ onClick,onTravelModeClick, travelMode, children, variant, disabled, className }: ButtonProps) => {
    const handleClick = () => {
        // If onTravelModeClick and travelMode are provided, call that function
        if (onTravelModeClick && travelMode) {
            onTravelModeClick(travelMode);
        }
        // Otherwise call the regular onClick if provided
        else if (onClick) {
            onClick();
        }
    };
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
