import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MemberProps {
    image: string,
    name: string,
    title: string,
    github: string,
    schoolYear?: string,
    quote?: string
}

const Member = ({image, name, title, github, schoolYear, quote}: MemberProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Check if we have additional info to display on the back of the card
    const hasBackInfo = schoolYear && quote && schoolYear !== "xxx" && quote !== "xxx";

    const handleFlip = () => {
        if (hasBackInfo) {
            setIsFlipped(!isFlipped);
        }
    };

    if (github === "None") {
        return (
            <div className='grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl'>
                <div className={`rounded-full size-32 bg-cover bg-center`} style={{ backgroundImage: `url(/TheTeam/${image})` }} />
                <div className='grid grid-cols-1 text-codgray text-bold'>
                    <div className='text-lg'>{name}</div>
                    <div className='text-sm'>{title}</div>
                </div>
            </div>
        );
    }

    // If there's no flip info, return the original layout
    if (!hasBackInfo) {
        return (
            <div className='grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl'>
                <div className={`rounded-full size-32 bg-cover bg-center`} style={{ backgroundImage: `url(/TheTeam/${image})` }} />
                <div className='grid grid-cols-1 text-codgray text-bold'>
                    <div className='text-lg'>{name}</div>
                    <div className='text-sm'>{title}</div>
                    <div className='text-sm'>Github: <Link to={`https://github.com/${github}`} className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500 hover:text-lg'>@{github}</Link></div>
                </div>
            </div>
        );
    }

    // With flip info, return the flippable card
    return (
        <div className="relative h-52 w-full cursor-pointer" onClick={handleFlip} style={{ perspective: '1000px' }}>
            <motion.div
                className="relative w-full h-full"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front of card - using original styling */}
                <div className='absolute w-full h-full grid grid-cols-2 grid-cols-[200px_minmax(900px,_1fr)_100px] bg-gray-300 px-4 py-4 rounded-2xl' style={{ backfaceVisibility: 'hidden' }}>
                    <div className={`rounded-full size-32 bg-cover bg-center`} style={{ backgroundImage: `url(/TheTeam/${image})` }} />
                    <div className='grid grid-cols-1 text-codgray text-bold'>
                        <div className='text-lg'>{name}</div>
                        <div className='text-sm'>{title}</div>
                        <div className='text-sm'>Github: <Link
                            to={`https://github.com/${github}`}
                            className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500 hover:text-lg'
                            onClick={(e) => e.stopPropagation()} // Prevent card flip when clicking the link
                        >
                            @{github}
                        </Link></div>
                    </div>
                    <div className="absolute bottom-2 right-4 text-xs text-gray-600">Click to flip</div>
                </div>

                {/* Back of card */}
                <div className='absolute w-full h-full bg-gray-300 p-6 rounded-2xl flex flex-col justify-center items-center'
                     style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <div className="text-xl font-semibold mb-2 text-center text-codgray">{name}</div>
                    <div className="text-lg mb-4 text-center text-codgray">School Year: {schoolYear}</div>
                    <div className="text-base italic text-center text-codgray">"{quote}"</div>
                    <div className="absolute bottom-2 right-4 text-xs text-gray-600">Click to flip back</div>
                </div>
            </motion.div>
        </div>
    );
};

export default Member;