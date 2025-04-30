import React from 'react';
import MGBButton from 'src/elements/MGBButton.tsx'

const Screensaver: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center text-white text-3xl animate-fade">

                Drag the Cursor here to return to website!
            <iframe
                src="https://chromedino.com/"
                frameBorder="0"
                scrolling="no"
                width="100%"
                height="90%"
                loading="lazy"
                title="Chrome Dino Game"
            />
            Drag the Cursor here to return to website!
        </div>
    );
};

export default Screensaver;