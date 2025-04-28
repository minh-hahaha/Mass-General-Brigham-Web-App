import MGBButton from '@/elements/MGBButton.tsx';
import DisclaimerPopup from '@/components/DisclaimerPopup.tsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { RiArrowRightSLine } from "react-icons/ri";


import { useAuth0 } from '@auth0/auth0-react';

const HomePage = () => {
    const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

    const [showDisclaimer, setShowDisclaimer] = useState(true);

    return (
        <>
            <section className="h-screen relative bg-[url('/mgbhero.jpeg')] bg-cover bg-center flex flex-col justify-center">
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
                            <RiArrowRightSLine color="white" size={28} className="mt-1 ml-1 mr-2"/>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
            </section>
            {showDisclaimer && <DisclaimerPopup onClose={() => setShowDisclaimer(false)} />}
        </>
    );
};

export default HomePage;
