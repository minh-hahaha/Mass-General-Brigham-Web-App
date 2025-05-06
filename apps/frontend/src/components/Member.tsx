import { Link } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MemberProps {
    image: string,
    name: string,
    title: string,
    github: string,
    schoolYear?: string,
    major?: string,
    quote?: string,
    delay?: number
}

const Member = ({image, name, title, github, schoolYear, major, quote, delay = 0}: MemberProps) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isHoveringImage, setIsHoveringImage] = useState(false);
    const [isHoveringGithub, setIsHoveringGithub] = useState(false);
    const [isHoveringCard, setIsHoveringCard] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const noFlip = !schoolYear || schoolYear === "None" ||
        !quote || quote === "None" ||
        !major || major === "None";


    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);


    useEffect(() => {
        if (isHoveringCard && !isHoveringImage && !isHoveringGithub && !noFlip && !isFlipped) {
            timerRef.current = setTimeout(() => {
                setIsFlipped(true);
            }, 800);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isHoveringCard, isHoveringImage, isHoveringGithub, noFlip, isFlipped]);

    const handleMouseEnter = () => {
        setIsHoveringCard(true);
    };

    const handleMouseLeave = () => {
        setIsHoveringCard(false);
        setIsHoveringImage(false);
        setIsHoveringGithub(false);

        if (!noFlip) {
            setIsFlipped(false);
        }
    };

    const handleImageMouseEnter = () => {
        setIsHoveringImage(true);
    };

    const handleImageMouseLeave = () => {
        setIsHoveringImage(false);
    };

    const handleGithubMouseEnter = () => {
        setIsHoveringGithub(true);
    };

    const handleGithubMouseLeave = () => {
        setIsHoveringGithub(false);
    };

    // Animation variants
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: delay
            }
        }
    };

    // No-flip card
    if (noFlip) {
        return (
            <motion.div
                className='flex items-center bg-gray-300 px-4 py-4 rounded-2xl'
                initial="hidden"
                animate="visible"
                variants={cardVariants}
            >
                <div className='w-[200px] flex justify-center'>
                    <div
                        className='rounded-full size-32 bg-cover bg-center transition-[delay-150_duration-300_ease-in-out] hover:shadow-[0_0_15px_5px_rgba(37,70,146,0.8)] hover:scale-150'
                        style={{ backgroundImage: `url(/TheTeam/${image})` }}
                    />
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
            </motion.div>
        );
    }

    // Flip cards
    return (
        <motion.div
            className="relative h-52"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
        >
            <div className="absolute w-full h-full [perspective:1000px]">
                <motion.div
                    className="relative w-full h-full [transform-style:preserve-3d] transition-all duration-500"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.1 }}
                >
                    {/* Front */}
                    <div className='absolute w-full h-full flex items-center bg-gray-300 px-4 py-4 rounded-2xl [backface-visibility:hidden]'>
                        <div
                            className='w-[200px] flex justify-center'
                            onMouseEnter={handleImageMouseEnter}
                            onMouseLeave={handleImageMouseLeave}
                        >
                            <div
                                className='rounded-full size-32 bg-cover bg-center transition-[delay-150_duration-300_ease-in-out] hover:shadow-[0_0_15px_5px_rgba(37,70,146,0.8)] hover:scale-150 z-10'
                                style={{ backgroundImage: `url(/TheTeam/${image})` }}
                            />
                        </div>
                        <div className='flex-1 flex flex-col items-center justify-center'>
                            <div className='text-xl font-semibold mb-2 text-codgray'>{name}</div>
                            <div className='text-base mb-2 text-codgray'>{title}</div>
                            {github !== "None" && (
                                <div
                                    className='text-base text-codgray'
                                    onMouseEnter={handleGithubMouseEnter}
                                    onMouseLeave={handleGithubMouseLeave}
                                >
                                    Github: <Link
                                    to={`https://github.com/${github}`}
                                    className='text-mgbblue underline transition-[delay-150_duration-300_ease-in-out] hover:text-teal-500 z-10'
                                >
                                    @{github}
                                </Link>
                                </div>
                            )}
                        </div>
                        <div className='w-[100px]'></div>
                    </div>

                    {/* Back of card - centered text */}
                    <div className='absolute w-full h-full flex items-center justify-center bg-gray-300 px-4 py-4 rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]'>
                        <div className='w-full flex flex-col items-center justify-center text-center'>
                            <div className='text-xl font-semibold mb-2 text-codgray'>{name}</div>
                            <div className='text-sm mb-2 text-codgray'>School Year: {schoolYear}</div>
                            <div className='text-sm mb-2 text-codgray'>Major: {major}</div>
                            <div className='text-sm italic text-codgray max-w-[80%]'>"{quote}"</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Member;