import React, { useState } from "react";
import MGBButton from "@/elements/MGBButton.tsx";
import add_node from '../assets/instructions/add_node.png'
import create_edges from '../assets/instructions/create_edges.png'
import edit_node from '../assets/instructions/edit_node.png'
import save_changes from '../assets/instructions/save.png'

interface MapInstructionsProps {
    onClose?: () => void;
    className?: string;
}

const instructionPages = [
    {
        title: "Add Node",
        imagePath: add_node,
        description: "Click \"Add Node\" button and then click on the map to place nodes."
    },
    {
        title: "Edit Node",
        imagePath: edit_node,
        description: "Click on the node to edit its name, room number, or remove node."
    },
    {
        title: "Create Edges",
        imagePath: create_edges,
        description: "Click the \"Create Edge\" button, then nodes can connected."
    },
    {
        title: "Save Nodes and Edges",
        imagePath: save_changes,
        description: "Click the \"Save Nodes and Edges\" button to store your configuration."
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
        <div className={`fixed inset-0 bg-gray-300 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
            <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-lg shadow-lg w-full max-w-3xl">
                {/* Header with title and close button */}
                <div className="bg-mgbblue bg-opacity-70 backdrop-blur-sm text-white p-4 flex justify-between items-center rounded-t-lg">
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
                <div className="p-6">
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
                <div className="p-4 flex justify-between items-center border-t border-gray-200 border-opacity-30">
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