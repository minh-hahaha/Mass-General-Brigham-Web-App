import { motion } from "framer-motion";
import MGBButton from "@/elements/MGBButton.tsx";

interface HelpPopupProps {
    onClose: () => void;
}

const HelpPopup: React.FC<HelpPopupProps> = ({ onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-6 rounded-xl shadow-lg max-w-4xl w-[90%] text-center relative"
            >
                <h2 className="font-serif text-center text-2xl font-bold mb-4">
                    How to Fill Out the Service Request Form
                </h2>
                <div className="text-gray-600 text-left space-y-3">
                    <p>• Enter your full name and valid employee ID.</p>
                    <p>• Choose the correct priority based on urgency.</p>
                    <p>• Include meeting link for Remote requests.</p>
                    <p>• Use the notes field for any extra instructions.</p>
                </div>

                <div className="pt-4 flex flex-row justify-end">
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                        <MGBButton onClick={onClose} variant="primary" disabled={false}>
                            <div className="flex items-center gap-2 justify-center">
                                <span>Close</span>
                            </div>
                        </MGBButton>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default HelpPopup;
