interface DisclaimerPopupProps {
    onClose: () => void;
}

const DisclaimerPopup: React.FC<DisclaimerPopupProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-[90%] text-center relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl font-bold"

                >
                    &times;
                </button>
                <h4 className="font-serif text-center text-gray-800">
                    Disclaimer: This web application is strictly a CS3733-D25 Software Engineering class project
                    for Prof. Wilson Wong at WPI
                </h4>
            </div>
        </div>
    );
};

export default DisclaimerPopup;
