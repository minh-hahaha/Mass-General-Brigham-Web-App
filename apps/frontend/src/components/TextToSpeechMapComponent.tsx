import React, {useState, useEffect, JSX} from "react";
import {ROUTES} from "common/src/constants.ts";
import axios from "axios";
import MGBButton from "@/elements/MGBButton.tsx";
import { BsArrowUp } from "react-icons/bs";
import { BsArrow90DegRight } from "react-icons/bs";
import { BsArrow90DegLeft } from "react-icons/bs";
import { IconType } from 'react-icons';
import { GiNothingToSay } from "react-icons/gi";

interface State {
    walkDirections: string;
    driveDirections: string;
    drive22Directions: string[];
    walk22Directions: string[];
    icons:string[];
}
const TextToSpeechMapComponent = ({walkDirections, driveDirections, drive22Directions, walk22Directions, icons}:State) => {
    //  const [textMode, setTextMode] = useState("Mode: Transport Directions");
    const [textToDisplay, setTextToDisplay] = useState(driveDirections);
    const audio = new Audio();  // Create audio object
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


    const [textMode, setTextMode] = useState("Mode: Transport Directions");
    const [textToSpeak, setTextToSpeak] = useState(drive22Directions);
    const [iconToDisplay, setIconToDisplay] = useState<JSX.Element>(<GiNothingToSay />);
    const [counter, setCounter] = useState(0);

    const handleProgressReset = () => {
        setCounter(0); // Reset the counter when needed
    };


    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const handleModeSwitch = () => {
        if (textMode === "Mode: Transport Directions") {
            setTextMode("Mode: Building Directions");
            setTextToSpeak(walk22Directions);
            setTextToDisplay(walkDirections);
            if(icons[counter]==='Turn Left then Continue Straight'){
                setIconToDisplay(<BsArrow90DegLeft />);
            }else if(icons[counter]==="Continue Straight"){
                setIconToDisplay(<BsArrowUp />);
            }else if(icons[counter]==='Turn Right then Continue Straight'){
                setIconToDisplay(<BsArrow90DegRight />);
            }


        } else {
            setTextMode("Mode: Transport Directions");
            setTextToSpeak(drive22Directions);
            setTextToDisplay(driveDirections);
            setIconToDisplay(<GiNothingToSay />);


        }



    };
   const handleIconSwitch= (index:number)=>{
       if (textMode === "Mode: Transport Directions") {
            setIconToDisplay(<GiNothingToSay />);
       } else if(textMode === "Mode: Building Directions") {
           if(icons[index]==='Turn Left then Continue Straight'){
                setIconToDisplay(<BsArrow90DegLeft />);
           }else if(icons[index]==="Continue Straight"){
                setIconToDisplay(<BsArrowUp />);
           }else if(icons[index]==='Turn Right then Continue Straight'){
               setIconToDisplay(<BsArrow90DegRight />);
           }

       }
   }

     // useEffect(() => {
     //     setTextToDisplay(driveDirections);
     //     setTextToSpeak(drive22Directions);
     // }, [driveDirections]);


    function htmlToPlainText(html: string): string {
        const div = document.createElement('div');
        div.innerHTML = html;  // Set the HTML as the inner content of a div
        return div.innerText || div.textContent || '';
    }

    const speakDirections = async () => {
        console.log("1111111111111111111111");
         console.log(icons);
         console.log(counter);

        // console.log(textToSpeak);
        // console.log("textToSpeak");
        const message = textToSpeak[counter];//.isArray(textToSpeak) ? textToSpeak.join(' ') : textToSpeak;
        handleIconSwitch(counter);
        console.log(counter);
        console.log(textToSpeak.length-1)
        if(counter===textToSpeak.length-1){
            handleProgressReset()
        }else{
            setCounter(counter+1);
        }
        console.log(counter);
        let messageString=htmlToPlainText(message);
        if (messageString.length==0) {
            messageString="Empty of Directions, select a from, and, too location in order to receive directions.";
        }
        const response = await axios.post(ROUTES.TTS, { text: messageString }, {
            responseType: 'blob',
        });

        const audioBlob = await response.data;  // Get blob from server

        // Log audioBlob size to confirm it's a valid file
        console.log('Audio Blob size:', audioBlob.size);
        console.log(textToSpeak);
        const audioUrl = URL.createObjectURL(audioBlob);  // Create a URL for the audio
        audio.src = audioUrl;
        audio.play();
    };

    return (
        <>
            <div className="fixed top-14 right-10 p-4 z-50">
                <div className="p-5 shadow-md flex flex-col items-end space-y-2 border border-gray-200 w-90 z-10 bg-white rounded-lg">
                    <div
                        id="text-directions"
                        className="text-black w-full h-14 overflow-y-auto text-center"
                        dangerouslySetInnerHTML={{ __html: textToDisplay }}

                    ></div>

                    <div className="flex space-x-2 mt-3">
                        <MGBButton onClick={handleModeSwitch} variant={"secondary"} disabled={false}>
                            {textMode}
                             </MGBButton>
                        <MGBButton onClick={speakDirections} variant={"primary"} disabled={false}>
                            Speak
                        </MGBButton>
                        {iconToDisplay}

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