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

    const noFlip = !schoolYear || schoolYear === "None" ||
        !quote || quote === "None" ||
        !major || major === "None";

    const handleMouseEnter = () => {
        if (!noFlip) {
            setIsFlipped(true);
        }
    };

    const handleMouseLeave = () => {
        if (!noFlip) {
            setIsFlipped(false);
        }
    };

    // No-flip card
    if (noFlip) {
        return (
            <div className='flex items-center bg-gray-300 px-4 py-4 rounded-2xl'>
                <div className='w-[200px] flex justify-center'>
                    <div className='rounded-full size-32 bg-cover bg-center transition-[delay-150_duration-300_ease-in-out] hover:shadow-[0_0_15px_5px_rgba(37,70,146,0.8)] hover:scale-150'
                         style={{ backgroundImage: `url(/TheTeam/${image})` }} />
                </div>
                <div className='flex-1 flex flex-col items-center justify-center'>
                    <div className='text-xl font-semibold mb-2 text-codgray'>{name}</div>
                    <div className='text-sm mb-2 text-codgray'>{title}</div>
                    {github !== "None" && (
                        <div className='text-sm text-codgray'>Github: <Link
                            to={`https://github.com/${github}`}
                            className='text-mgbblue underline transition-[delay-150_duration-300_ease-in-out] hover:text-teal-500'
                        >
                            @{github}
                        </Link></div>
                    )}
                </div>
                <div className='w-[100px]'></div>
            </div>
        );
    }

    // Flip cards
    return (
        <div
            className="relative h-52 transition-all duration-300 hover:shadow-md"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="absolute w-full h-full [perspective:1000px]">
                <motion.div
                    className="relative w-full h-full [transform-style:preserve-3d] transition-all duration-500"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Front */}
                    <div className='absolute w-full h-full flex items-center bg-gray-300 px-4 py-4 rounded-2xl [backface-visibility:hidden]'>
                        <div className='w-[200px] flex justify-center'>
                            <div className='rounded-full size-32 bg-cover bg-center transition-[delay-150_duration-300_ease-in-out] hover:shadow-[0_0_15px_5px_rgba(37,70,146,0.8)] hover:scale-150'
                                 style={{ backgroundImage: `url(/TheTeam/${image})` }} />
                        </div>
                        <div className='flex-1 flex flex-col items-center justify-center'>
                            <div className='text-xl font-semibold mb-2 text-codgray'>{name}</div>
                            <div className='text-sm mb-2 text-codgray'>{title}</div>
                            {github !== "None" && (
                                <div className='text-sm text-codgray'>Github: <Link
                                    to={`https://github.com/${github}`}
                                    className='text-mgbblue underline transition-[delay-150_duration-300_ease-in-out] hover:text-teal-500'
                                >
                                    @{github}
                                </Link></div>
                            )}
                        </div>
                        <div className='w-[100px]'></div>
                        <div className="absolute bottom-2 right-4 text-xs text-gray-600">Hover to flip</div>
                    </div>

                    {/* Back of card */}
                    <div className='absolute w-full h-full flex items-center justify-center bg-gray-300 px-4 py-4 rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]'>
                        <div className='w-[200px]'></div>
                        <div className='flex-1 flex flex-col items-center justify-center' style={{ marginTop: '-8px' }}>
                            <div className='text-xl font-semibold mb-2 text-codgray'>{name}</div>
                            <div className='text-sm mb-2 text-codgray'>School Year: {schoolYear}</div>
                            <div className='text-sm mb-2 text-codgray'>Major: {major}</div>
                            <div className='text-sm italic text-codgray'>"{quote}"</div>
                        </div>
                        <div className='w-[100px]'></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Member;