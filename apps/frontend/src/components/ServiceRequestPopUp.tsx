import React, { useState } from "react";
import { motion } from "framer-motion";
import MGBButton from "@/elements/MGBButton.tsx";

const instructionPages = [
    {
        title: "Requester Information",
        description: "Fill in your full name and employee ID accurately.",
        imagePath: "",
    },
    {
        title: "Patient Information",
        description: "Enter the patient's name and their primary language.",
        imagePath: "",
    },
    {
        title: "Meeting Details",
        description: "Choose the meeting type, select the priority, and set date/time/location.",
        imagePath: "",
    },
    {
        title: "Submit Request",
        description: "Click 'Submit Request' to send your form once complete.",
        imagePath: "",
    }
];

interface HelpPopupProps {
    onClose: () => void;
}

const HelpPopup: React.FC<HelpPopupProps> = ({ onClose }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const goToNextPage = () => {
        if (currentPage < instructionPages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

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
                className="bg-white rounded-lg shadow-lg w-full max-w-3xl overflow-hidden"
            >
                <div className="bg-mgbblue text-white p-4 flex justify-between items-center rounded-t-lg">
                    <h2 className="text-xl font-semibold">{instructionPages[currentPage].title}</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 text-2xl"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 bg-white flex flex-col items-center">
                    {instructionPages[currentPage].imagePath && (
                        <div className="w-full h-96 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                            <img
                                src={instructionPages[currentPage].imagePath}
                                alt={instructionPages[currentPage].title}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    )}
                    <p className="text-black text-center font-medium">
                        {instructionPages[currentPage].description}
                    </p>
                </div>

                <div className="p-4 flex justify-between items-center border-t border-gray-200">
                    <MGBButton
                        variant="secondary"
                        onClick={goToPrevPage}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </MGBButton>

                    <div className="flex">
                        {instructionPages.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full mx-1 ${currentPage === index ? "bg-blue-800" : "bg-gray-300"}`}
                                onClick={() => setCurrentPage(index)}
                                aria-label={`Go to instruction ${index + 1}`}
                            />
                        ))}
                    </div>

                    {currentPage === instructionPages.length - 1 ? (
                        <MGBButton variant="primary" onClick={onClose}>
                            Close
                        </MGBButton>
                    ) : (
                        <MGBButton variant="primary" onClick={goToNextPage}>
                            Next
                        </MGBButton>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default HelpPopup;
