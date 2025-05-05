import MGBButton from '@/elements/MGBButton.tsx';
import DisclaimerPopup from '@/components/DisclaimerPopup.tsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { classifyInput } from '../../utils/classifyInput.ts';

const HomePage = () => {
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
                    state: { hospital: result.hospital },
                });
                break;

            case 'get_department_directions':
                navigate('/MapPage', {
                    state: {
                        destination: result.department,
                    },
                });
                break;

            case 'view_department_info':
                navigate('/DirectoryDisplay', {
                    state: {
                        department: result.department,
                        hospital: result.hospital },
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
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                >
                    <div className="absolute z-10 flex flex-col items-start gap-3 bottom-55 left-20">
                        <h1 className="text-white text-7xl font-semibold font-serif text-center drop-shadow-xl">
                            Find Your Way Today.
                        </h1>
                        <div className="flex flex-row mt-5">
                            <h2 className="text-white text-2xl font-serif text-center drop-shadow-lg">
                                Your guide to hospital locations and services
                            </h2>
                            <RiArrowRightSLine color="white" size={28} className="mt-1 ml-1 mr-2" />
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                                <MGBButton
                                    onClick={() => (window.location.href = '/MapPage')}
                                    variant={'secondary'}
                                    disabled={false}
                                >
                                    Get Directions
                                </MGBButton>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                ></motion.div>
                <div className="z-10 text-white absolute left-20">
                    <input
                        className="text-sm w-60 px-4 border border-solid border-mgbblue rounded-md"
                        type="text"
                        placeholder="Search"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <MGBButton
                        variant={'primary'}
                        disabled={false}
                        onClick={() => {
                            handleSearch(input);
                        }}
                    >
                        Search
                    </MGBButton>
                </div>
            </section>
            {showDisclaimer && <DisclaimerPopup onClose={() => setShowDisclaimer(false)} />}
        </>
    );
};

export default HomePage;
