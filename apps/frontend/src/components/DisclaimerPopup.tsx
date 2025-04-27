import {motion} from 'framer-motion';
import MGBButton from "@/elements/MGBButton.tsx";

interface DisclaimerPopupProps {
    onClose: () => void;
}

const DisclaimerPopup: React.FC<DisclaimerPopupProps> = ({ onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={onClose}
        >


            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-6 rounded-xl shadow-lg max-w-4xl w-[90%] text-center relative"
            >

                <h4 className="font-serif text-center text-gray-800 text-2xl">
                    <span className="font-bold"> Disclaimer: </span>
                    This web application is strictly a CS3733-D25 Software Engineering class project
                    for Prof. Wilson Wong at WPI
                </h4>
                <div
                    className="p-1 pt-4 flex flex-row justify-end p">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <MGBButton
                            onClick={onClose}
                            variant={'primary'}
                            disabled={false}
                        >
                            <div className="font-serif">
                                I Understand
                            </div>
                        </MGBButton>
                    </motion.button>

                </div>

            </div>
        </motion.div>


    );
};

export default DisclaimerPopup;
