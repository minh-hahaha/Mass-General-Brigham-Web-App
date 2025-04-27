import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface MapInstructionsProps {
    onClose?: () => void;
    className?: string;
}

// Define the instruction pages with their titles and image paths
const instructionPages = [
    {
        title: "Add Nodes",
        imagePath: "apps/frontend/src/assets/instructions/add_node.png",
        description: "Click \"Add Node\" button and then click on the map to place nodes."
    },
    {
        title: "Create Edges",
        imagePath: "/instructions/create-edges.png",
        description: "Click the \"Create Edge\" button, then select a starting node and click destination node to connect them."
    },
    {
        title: "Edit Node",
        imagePath: "apps/frontend/src/assets/instructions/edit_node.png",
        description: "Click on the node to edit its name, room number, or remove node."
    },
    {
        title: "Save Nodes",
        imagePath: "/instructions/save-nodes.png",
        description: "Click the \"Save Nodes and Edges\" button to store your node network configuration."
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
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                {/* Header with title and close button */}
                <div className="bg-blue-800 text-white p-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{instructionPages[currentPage].title}</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>

                {/* Instruction content */}
                <div className="p-4">
                    <div className="flex flex-col items-center">
                        <div className="w-full h-64 bg-gray-100 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                            {/* Display the image for the current page */}
                            <img
                                src={instructionPages[currentPage].imagePath}
                                alt={instructionPages[currentPage].title}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                        <p className="text-gray-700">
                            {instructionPages[currentPage].description}
                        </p>
                    </div>
                </div>

                {/* Navigation controls */}
                <div className="p-4 flex justify-between items-center border-t">
                    <Button
                        variant="outline"
                        onClick={goToPrevPage}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </Button>

                    <div className="flex">
                        {instructionPages.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full mx-1 ${currentPage === index ? 'bg-blue-800' : 'bg-gray-300'}`}
                                onClick={() => setCurrentPage(index)}
                            />
                        ))}
                    </div>

                    <Button
                        variant="default"
                        onClick={goToNextPage}
                        disabled={currentPage === instructionPages.length - 1}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MapInstructions;