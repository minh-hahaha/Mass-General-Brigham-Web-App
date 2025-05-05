import React, { useState } from "react";
import MGBButton from "@/elements/MGBButton.tsx";
import edit_node from '../assets/instructions/edit_node.gif';
import drag_save from '../assets/instructions/drag_save.gif';
import select from '../assets/instructions/select_hospital.gif'
import create_delete_edges from '../assets/instructions/create_delete_edge.gif'
import import_export_nodes from '../assets/instructions/import_export.gif'

interface MapInstructionsProps {
    onClose?: () => void;
    className?: string;
}

const instructionPages = [
    {
        title: "Select Hospital",
        imagePath: select,
        description: "Select the hospital you want to edit."
    },
    {
        title: "Edit Node",
        imagePath: edit_node,
        description: "Click \"Edit\" button and then click on the map to place nodes."
    },
    {
        title: "Delete and Create Edges",
        imagePath: create_delete_edges,
        description: "Delete or create edge for two nodes."
    },
    // {
    //     title: "Create Edges",
    //     imagePath: create_edges,
    //     description: "Click the \"Create Edge\" button, then nodes can connected."
    // },
    {
        title: "Drag and Save Nodes and Edges",
        imagePath: drag_save,
        description: "Drag the edited nodes to a proper place and Click the \"Save Nodes and Edges\" button to store your configuration."
    },
    {
        title: "Import Export Nodes and Edges",
        imagePath: import_export_nodes,
        description: "Click the \"Import Export Nodes and Edges\" button to import or export files."
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