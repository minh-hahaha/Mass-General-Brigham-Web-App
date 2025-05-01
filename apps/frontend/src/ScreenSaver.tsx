import React from 'react';
import MGBButton from 'src/elements/MGBButton.tsx'

const Screensaver: React.FC = () => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: '#e4e6eb' }}
        >
            <div className="w-full h-full max-w-screen-lg max-h-screen-lg rounded-3xl overflow-hidden shadow-2xl border-4 border-white flex flex-col">
                {/* Text section above the game */}
                <div className="bg-white text-center p-4 text-lg font-semibold">
                    You’ve been idle — enjoy a quick game! Move cursor outside game box to return to website!
                </div>

                {/* Dino game section */}
                <div className="flex-1">
                    <iframe
                        className="w-full h-full"
                        src="https://chromedino.com/"
                        frameBorder="0"
                        scrolling="no"
                        title="Chrome Dino Game"
                    />
                </div>
            </div>
        </div>
    );
};

export default Screensaver;