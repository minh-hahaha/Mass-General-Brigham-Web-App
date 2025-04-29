import { useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import HelpPopup from "@/components/ServiceRequestPopUp.tsx"; // adjust path as needed

const ServiceRequestHelp = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-black hover:text-mgbblue transition-colors"
                aria-label="Open Help"
            >
                <IoIosInformationCircleOutline size={24} />
            </button>

            {isOpen && <HelpPopup onClose={() => setIsOpen(false)} />}
        </>
    );
};

export default ServiceRequestHelp;
