import React, { useState } from "react";
import MGBButton from "@/elements/MGBButton.tsx";
import filter from '../assets/instructions/filter.png';
import export_directory from '../assets/instructions/export_directory.png';
import import_new_directory from '../assets/instructions/import_new_directory.png';

interface MapInstructionsProps {
    onClose?: () => void;
    className?: string;
}

const instructionPages = [
    {
        title: "Filter",
        imagePath: filter,
        description: "Use our filter component to find departments information."
    },
    {
        title: "Import New Directories",
        imagePath: import_new_directory,
        description: "Import new directory files through this procedure."
    },
    {
        title: "Create Edges",
        imagePath: export_directory,
        description: "Export the directory to a CSV file."
    }
];

const MapInstructions: React.FC<MapInstructionsProps> = ({
                                                             onClose,
                                                             className = ""
                                                         }) => {
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
        // Main overlay - This matches the style from the first example
        <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
            {/* Modal content container */}
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl overflow-hidden">
                {/* Header with title and close button */}
                <div className="bg-mgbblue text-white p-4 flex justify-between items-center rounded-t-lg">
                    <h2 className="text-xl font-semibold">{instructionPages[currentPage].title}</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Instruction content */}
                <div className="p-6 bg-white">
                    <div className="flex flex-col items-center">
                        <div className="w-full h-96 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                            <img
                                src={instructionPages[currentPage].imagePath}
                                alt={`${instructionPages[currentPage].title} illustration`}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                        <p className="text-black text-center font-medium">
                            {instructionPages[currentPage].description}
                        </p>
                    </div>
                </div>

                {/* Navigation controls */}
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
                                className={`w-2 h-2 rounded-full mx-1 ${currentPage === index ? 'bg-blue-800' : 'bg-gray-300'}`}
                                onClick={() => setCurrentPage(index)}
                                aria-label={`Go to instruction ${index + 1}`}
                            />
                        ))}
                    </div>

                    <MGBButton
                        variant="primary"
                        onClick={goToNextPage}
                        disabled={currentPage === instructionPages.length - 1}
                    >
                        Next
                    </MGBButton>
                </div>
            </div>
        </div>
    );
};

export default MapInstructions;