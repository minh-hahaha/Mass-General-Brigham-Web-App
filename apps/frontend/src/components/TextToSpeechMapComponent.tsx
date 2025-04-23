import {useState, useEffect} from "react";
import {ROUTES} from "common/src/constants.ts";
import axios from "axios";

interface State {
    walkDirections: string;
    driveDirections: string;
}
const TextToSpeechMapComponent = ({walkDirections, driveDirections}:State) => {
    useEffect(() => {

    }, []);

    function htmlToPlainText(html: string): string {
        const div = document.createElement('div');
        div.innerHTML = html;  // Set the HTML as the inner content of a div
        return div.innerText || div.textContent || '';
    }
    const speakDirections = async () => {
        const message = Array.isArray(textToSpeak) ? textToSpeak.join(' ') : textToSpeak;
        let messageString=htmlToPlainText(message);
        if (messageString.length==0) {
            messageString="Empty of Directions, select a from, and, too location in order to receive directions.";
        }
        const response = await fetch('http://localhost:5001/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: messageString }),
        });

        const audioBlob = await response.blob();  // Get blob from server

        // Log audioBlob size to confirm it's a valid file
        console.log('Audio Blob size:', audioBlob.size);
        console.log(textToSpeak);
        const audioUrl = URL.createObjectURL(audioBlob);  // Create a URL for the audio
        const audio = new Audio(audioUrl);  // Create audio object
        audio.play();
    };

    return(
        <>
            <div className="bg-white max-w-2xl absolute top-0 right-20 mt-4 w-fit p-2 rounded-r-md cursor-pointer z-20 rounded">

                {/* speak text button*/}
                <div >
                    <button className="w-full bg-mgbblue text-white py-2 rounded-sm hover:bg-mgbblue/90 transition disabled:opacity-50"
                            onClick={() => speakDirections()}>
                        Speak

                    </button>
                </div>
                <div className="flex items-center justify-center max-w-2xl"
                    id={'text-directions'}
                    dangerouslySetInnerHTML={{ __html: textToSpeak}}
                />



            </div>
        </>

    );

};
export default TextToSpeechMapComponent;