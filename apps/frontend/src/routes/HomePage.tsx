import MGBButton from '@/elements/MGBButton.tsx';
import DisclaimerPopup from '@/components/DisclaimerPopup.tsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { classifyInput } from '../../utils/classifyInput.ts';
import { FiSearch } from 'react-icons/fi'; // top of file if not already


const HomePage = () => {
    const [autoNav, setAutoNav] = useState(false);

    const [showDisclaimer, setShowDisclaimer] = useState(true);

    const [input, setInput] = useState('');

    const navigate = useNavigate(); // ✅ move this HERE

    const handleSearch = async (input: string) => {
        const result = await classifyInput(input);

        console.log('Intent', result.intent);

        switch (result.intent) {
            case 'create_request':
                navigate('/ServiceRequestDisplay', {
                    state: {
                        requestType: result.requestType,
                        location: result.location || result.department,
                    },
                });
                break;

            case 'get_hospital_directions':
                navigate('/MapPage', {
                    state: {
                        hospital: result.hospital,
                        intent: result.intent,
                    },
                });
                break;

            case 'get_department_directions':
                navigate('/MapPage', {
                    state: {
                        department: result.department,
                        hospital: result.hospital,
                        intent: result.intent,
                    },
                });
                break;

            case 'view_department_info':
                navigate('/DirectoryDisplay', {
                    state: {
                        department: result.department,
                        hospital: result.hospital,
                    },
                });
                break;

            case 'view_about_info':
                navigate('/AboutPage');
                break;

            default:
                alert('Sorry, I couldn’t understand that request.');
        }
    };

    return (
        <>
            <section className="h-screen relative overflow-hidden bg-center flex flex-col justify-center">
                {/* Background Video */}
                <div className="absolute inset-0 z-0">
                    <video className="w-full h-full object-cover" autoPlay loop muted>
                        <source src="/MGBIntro.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/45 z-0"></div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: autoNav ? 0 : 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="absolute z-10 flex flex-col items-start gap-3 bottom-55 left-20">
                        {!autoNav && (
                            <h1 className="text-white text-7xl font-semibold font-serif text-center drop-shadow-xl">
                                Find Your Way Today.
                            </h1>
                        )}
                        <div className="flex flex-row mt-5 gap-4 items-center">
                            <h2 className="text-white text-xl font-serif text-center drop-shadow-lg">
                                Your guide to hospital locations and services
                            </h2>
                            <RiArrowRightSLine color="white" size={28} className="mt-1 -ml-3 -mr-4" />

                            {!autoNav && (
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                                    <MGBButton
                                        onClick={() => (window.location.href = '/MapPage')}
                                        variant={'secondary'}
                                        disabled={false}
                                    >
                                        Get Directions
                                    </MGBButton>
                                </motion.button>
                            )}

                            {!autoNav && (
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                                    <MGBButton
                                        onClick={() => setAutoNav(true)}
                                        variant={'primary'}
                                        disabled={false}
                                    >
                                        Auto Navigator
                                    </MGBButton>
                                </motion.button>
                            )}
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                ></motion.div>
                {autoNav && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 z-30 flex flex-col justify-center items-center"
                    >
                        {/* Overlay to darken background */}
                        <div className="absolute inset-0 bg-black/70 z-0 transition-opacity" />

                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white text-4xl font-bold text-center z-10 mb-8 px-4"
                        >
                            Navigate our entire site with one prompt
                        </motion.h2>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="z-10 w-full px-6 sm:px-0 max-w-4xl flex items-center gap-4"
                        >

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSearch(input);
                                    setAutoNav(false);
                                }}
                                className="relative w-full max-w-4xl"
                            >
                                <input
                                    className="w-full p-5 pr-16 text-xl rounded-lg bg-white text-black shadow-xl focus:outline-none"
                                    placeholder="I need to clean up a large spill..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-mgbblue hover:bg-blue-800 text-white p-3 rounded-full shadow-md transition duration-200"
                                >
                                    <FiSearch size={20} />
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </section>
            {showDisclaimer && <DisclaimerPopup onClose={() => setShowDisclaimer(false)} />}
        </>
    );
};

export default HomePage;
