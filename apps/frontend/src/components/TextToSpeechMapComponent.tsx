import React, {useState, useEffect, JSX, useRef} from "react";
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
    const audioRef = useRef(new Audio());  // Create audio object
    const [textMode, setTextMode] = useState("Mode: Transport Directions");
    const [textToSpeak, setTextToSpeak] = useState(drive22Directions);
    const [iconToDisplay, setIconToDisplay] = useState<JSX.Element>(<GiNothingToSay />);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        // This is where you ensure initial text is displayed for driveDirections
        setTextToDisplay(driveDirections);  // This could be redundant if it's already initialized, but useful for clarity.
        setTextToSpeak(drive22Directions);  // Ensure textToSpeak is initialized as well
    }, [driveDirections, drive22Directions]);

    const handleProgressReset = () => {
        setCounter(0); // Reset the counter when needed
    };


    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const handleModeSwitch = () => {
        handleProgressReset();
        if (textMode === "Mode: Transport Directions") {
            setTextMode("Mode: Building Directions");
            setTextToSpeak(walk22Directions);
            setTextToDisplay(walkDirections);
            if(icons){
                if(icons[counter]==='Turn Left then Continue Straight'){
                    setIconToDisplay(<BsArrow90DegLeft />);
                }else if(icons[counter]==="Continue Straight"){
                    setIconToDisplay(<BsArrowUp />);
                }else if(icons[counter]==='Turn Right then Continue Straight'){
                    setIconToDisplay(<BsArrow90DegRight />);
                }
            }else{
                setIconToDisplay(<GiNothingToSay />);
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


        if (!audioRef.current.paused) {
            audioRef.current.pause(); // Stop the currently playing audio
            audioRef.current.currentTime = 0; // Reset to the beginning
        }
        // Log audioBlob size to confirm it's a valid file
        console.log('Audio Blob size:', audioBlob.size);
        console.log(textToSpeak);
        const audioUrl = URL.createObjectURL(audioBlob);  // Create a URL for the audio
        audioRef.current.src = audioUrl;
        audioRef.current.play();
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
                        <div className="flex items-center justify-center p-2 bg-gray-200 rounded-md">
                            {iconToDisplay}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );

};
export default TextToSpeechMapComponent;