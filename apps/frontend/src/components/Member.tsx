import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MemberProps {
    image: string,
    name: string,
    title: string,
    github: string,
    schoolYear?: string,
    major?: string,
    quote?: string
}

const Member = ({image, name, title, github, schoolYear, major, quote}: MemberProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Check if flipping should be disabled
    const noFlip = schoolYear === "None" || quote === "None" || major === "None";

    // Handle the flip action
    const handleFlip = () => {
        if (!noFlip) {
            setIsFlipped(!isFlipped);
        }
    };

    // no-flip card 'None'
    if (noFlip) {
        return (
            <div className='flex items-center bg-gray-300 px-4 py-4 rounded-2xl'>
                <div className='w-[200px] flex justify-center'>
                    <div className={`rounded-full size-32 bg-cover bg-center transition-[delay-150 duration-300 ease-in-out] hover:shadow-[0_0_15px_5px_rgba(37,70,146,0.8)] hover:scale-150`}
                         style={{ backgroundImage: `url(/TheTeam/${image})` }} />
                </div>
                <div className='flex-1 text-center text-codgray font-bold'>
                    <div className='text-lg'>{name}</div>
                    <div className='text-sm'>{title}</div>
                    {github !== "None" && (
                        <div className='text-sm'>Github: <Link
                            to={`https://github.com/${github}`}
                            className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500'
                        >
                            @{github}
                        </Link></div>
                    )}
                </div>
                <div className='w-[100px]'></div>
            </div>
        );
    }

    // flip cards
    return (
        <div className="relative h-52 cursor-pointer" onClick={handleFlip}>
            <div className="absolute w-full h-full [perspective:1000px]">
                <motion.div
                    className="relative w-full h-full [transform-style:preserve-3d] transition-all duration-500"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Front of card */}
                    <div className='absolute w-full h-full flex items-center bg-gray-300 px-4 py-4 rounded-2xl [backface-visibility:hidden]'>
                        <div className='w-[200px] flex justify-center'>
                            <div className={`rounded-full size-32 bg-cover bg-center transition-[delay-150 duration-300 ease-in-out] hover:shadow-[0_0_15px_5px_rgba(37,70,146,0.8)] hover:scale-150`}
                                 style={{ backgroundImage: `url(/TheTeam/${image})` }} />
                        </div>
                        <div className='flex-1 text-center text-codgray font-bold'>
                            <div className='text-lg'>{name}</div>
                            <div className='text-sm'>{title}</div>
                            {github !== "None" && (
                                <div className='text-sm'>Github: <Link
                                    to={`https://github.com/${github}`}
                                    className='text-mgbblue underline transition-[delay-150 duration-300 ease-in-out] hover:text-teal-500'
                                    onClick={(e) => e.stopPropagation()} // Prevent card flip when clicking the link
                                >
                                    @{github}
                                </Link></div>
                            )}
                        </div>
                        <div className='w-[100px]'></div>
                        <div className="absolute bottom-2 right-4 text-xs text-gray-600">Click to flip</div>
                    </div>

                    {/* Back of card */}
                    <div className='absolute w-full h-full bg-gray-300 p-6 rounded-2xl flex flex-col justify-center items-center [backface-visibility:hidden] [transform:rotateY(180deg)]'>
                        <div className="text-xl font-semibold mb-2 text-center text-codgray">{name}</div>
                        {schoolYear && schoolYear !== "None" && (
                            <div className="text-lg mb-2 text-center text-codgray">School Year: {schoolYear}</div>
                        )}
                        {major && major !== "None" && (
                            <div className="text-lg mb-4 text-center text-codgray">Major: {major}</div>
                        )}
                        {quote && quote !== "None" && (
                            <div className="text-base italic text-center text-codgray">"{quote}"</div>
                        )}
                        <div className="absolute bottom-2 right-4 text-xs text-gray-600">Click to flip back</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Member;