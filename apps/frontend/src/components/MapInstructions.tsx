import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface MapInstructionsProps {
    onClose?: () => void;
    className?: string;
}

const instructionPages = [
    {
        title: "Add Node",
        imagePath: "/assets/instructions/add_node.png",
        description: "Click \"Add Node\" button and then click on the map to place nodes."
    },
    {
        title: "Create Edge",
        imagePath: "/assets/instructions/create_edge.png",
        description: "Click the \"Create Edge\" button, then nodes can connected."
    },
    {
        title: "Edit Node",
        imagePath: "/assets/instructions/edit_node.png",
        description: "Click on the node to edit its name, room number, or remove node."
    },
    {
        title: "Save Nodes and Edges",
        imagePath: "/assets/instructions/save_changes.png",
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
        <div className={`fixed inset-0 bg-slate-700 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
            <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg w-full max-w-md">
                {/* Header with title and close button */}
                <div className="bg-mgbblue bg-opacity-90 backdrop-blur-sm text-white p-4 flex justify-between items-center rounded-t-lg">
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
                        <div className="w-full h-64 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                            <img
                                src={instructionPages[currentPage].imagePath}
                                alt={`${instructionPages[currentPage].title} illustration`}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                        <p className="text-gray-700 text-center">
                            {instructionPages[currentPage].description}
                        </p>
                    </div>
                </div>

                {/* Navigation controls */}
                <div className="p-4 flex justify-between items-center border-t border-gray-200 border-opacity-50">
                    <Button
                        variant="outline"
                        onClick={goToPrevPage}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </Button>

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

                    <Button
                        variant={currentPage === instructionPages.length - 1 ? "outline" : "default"}
                        onClick={goToNextPage}
                        disabled={currentPage === instructionPages.length - 1}
                        className={currentPage === instructionPages.length - 1 ? "" : "bg-mgbblue hover:bg-mgbblue/90"}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MapInstructions;