import MGBButton from '@/elements/MGBButton.tsx';
import DisclaimerPopup from '@/components/DisclaimerPopup.tsx'
import { motion } from 'framer-motion';
import {useState} from 'react';


const HomePage = () => {
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
                    <div className="relative z-10 flex flex-col items-center gap-3">
                        <h1 className="text-white text-7xl font-semibold font-serif text-center drop-shadow-xl">
                            Find Your Way.
                        </h1>
                        <h2 className="text-white text-2xl font-serif text-center drop-shadow-lg">
                            Use the kiosk to quickly locate departments, clinics, and services
                            throughout the hospital.
                        </h2>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                >
                    <div className="relative z-10 flex flex-row justify-center items-center mt-5 gap-3">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <MGBButton
                                onClick={() => (window.location.href = '/MapPage')}
                                variant={'primary'}
                                disabled={false}
                            >
                                I Need Directions
                            </MGBButton>
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <MGBButton
                                onClick={() => (window.location.href = '/Login')}
                                variant={'secondary'}
                                disabled={false}
                            >
                                Log In
                            </MGBButton>
                        </motion.button>
                    </div>
                </motion.div>
            </section>
            {showDisclaimer && (
                <DisclaimerPopup onClose={() => setShowDisclaimer(false)} />
            )}
        </>
    );
};

export default HomePage;
