import {useState, useEffect} from "react";
import {ROUTES} from "common/src/constants.ts";
import axios from "axios";
import MGBButton from "@/elements/MGBButton.tsx";

interface State {
    walkDirections: string;
    driveDirections: string;
    drive22Directions: string[];
    walk22Directions: string[];
}
const TextToSpeechMapComponent = ({walkDirections, driveDirections, drive22Directions, walk22Directions}:State) => {
    //  const [textMode, setTextMode] = useState("Mode: Transport Directions");
      const [textToDisplay, setTextToDisplay] = useState(driveDirections);
    //
    // const handleMode1Switch = () => {
    //     if (textMode === "Mode: Transport Directions") {
    //         //setTextMode("Mode: Building Directions");
    //         setTextToDisplay(walkDirections);
    //     } else {
    //         setTextMode("Mode: Transport Directions");
    //        // setTextToDisplay(driveDirections);
    //     }
    // };


    // function htmlToPlainText(html: string): string {
    //     const div = document.createElement('div');
    //     div.innerHTML = html;  // Set the HTML as the inner content of a div
    //     return div.innerText || div.textContent || '';
    // }
    // const speakDirections = async () => {
    //     const message = Array.isArray(textToSpeak) ? textToSpeak.join(' ') : textToSpeak;
    //     let messageString=htmlToPlainText(message);
    //     if (messageString.length==0) {
    //         messageString="Empty of Directions, select a from, and, too location in order to receive directions.";
    //     }
    //     const response = await fetch('http://localhost:5001/api/tts', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ text: messageString }),
    //     });
    //
    //     const audioBlob = await response.blob();  // Get blob from server
    //
    //     // Log audioBlob size to confirm it's a valid file
    //     console.log('Audio Blob size:', audioBlob.size);
    //     console.log(textToSpeak);
    //     const audioUrl = URL.createObjectURL(audioBlob);  // Create a URL for the audio
    //     const audio = new Audio(audioUrl);  // Create audio object
    //     audio.play();
    // };
    let counter: number;
    counter=0;
    const [textMode, setTextMode] = useState("Mode: Transport Directions");
    const [textToSpeak, setTextToSpeak] = useState(drive22Directions);
    const handleProgressReset = () => {
        counter = 0;
    };

    const handleModeSwitch = () => {
        if (textMode === "Mode: Transport Directions") {
            setTextMode("Mode: Building Directions");
            setTextToSpeak(walk22Directions);
            setTextToDisplay(walkDirections);
        } else {
            setTextMode("Mode: Transport Directions");
            setTextToSpeak(drive22Directions);
            setTextToDisplay(driveDirections);
        }
    };


    function htmlToPlainText(html: string): string {
        const div = document.createElement('div');
        div.innerHTML = html;  // Set the HTML as the inner content of a div
        return div.innerText || div.textContent || '';
    }

    const speakDirections = async () => {
        const message = textToSpeak[counter];//.isArray(textToSpeak) ? textToSpeak.join(' ') : textToSpeak;
        if(counter===textToSpeak.length){
            handleProgressReset()
        }else{
            counter++;
        }

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

    return (
        <>

            <div className="fixed top-16 right-10 p-4 z-50">
                <div className="bg-white p-4  rounded shadow-md flex flex-col items-end space-y-2 border border-gray-200 w-96 z-10 bg-white rounded-lg">
                    <div
                        id="text-directions"
                        className="text-black w-full h-16 overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: textToDisplay }}

                    ></div>

                    <div className="flex space-x-2">
                        <MGBButton onClick={handleModeSwitch} variant={"secondary"} disabled={false}>
                            {textMode}
                             </MGBButton>
                        <MGBButton onClick={speakDirections} variant={"primary"} disabled={false}>
                            Speak
                        </MGBButton>

                        {/*<button*/}
                        {/*    id="mode-switch"*/}
                        {/*    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"*/}
                        {/*    onClick={handleModeSwitch}*/}
                        {/*>*/}
                        {/*    {textMode}*/}
                        {/*</button>*/}

                        {/*<button*/}
                        {/*    id="speak"*/}
                        {/*    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"*/}
                        {/*    onClick={speakDirections}*/}
                        {/*>*/}
                        {/*    Speak*/}
                        {/*</button>*/}
                    </div>
                </div>
            </div>
        </>
    );

};
export default TextToSpeechMapComponent;