import React, { useState, useEffect, useRef, JSX } from "react";
import { ROUTES } from "common/src/constants.ts";
import axios from "axios";
import MGBButton from "@/elements/MGBButton.tsx";
import {
    BsArrowUp,
    BsArrow90DegRight,
    BsArrow90DegLeft,
    BsChevronLeft,
    BsChevronRight,
} from "react-icons/bs";
import { GiNothingToSay } from "react-icons/gi";

interface State {
    walkDirections: string;
    driveDirections: string;
    drive22Directions: string[];
    walk22Directions: string[];
    icons: string[];
}

const TextToSpeechMapComponent = ({
                                      walkDirections,
                                      driveDirections,
                                      drive22Directions,
                                      walk22Directions,
                                      icons,
                                  }: State) => {
    const [textMode, setTextMode] = useState("Mode: Transport Directions");
    const [textToSpeak, setTextToSpeak] = useState<string[]>(drive22Directions);
    const [counter, setCounter] = useState(0);
    const [iconToDisplay, setIconToDisplay] = useState<JSX.Element>(<GiNothingToSay />);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        setTextToSpeak(drive22Directions);
    }, [drive22Directions]);

    const htmlToPlainText = (html: string): string => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.innerText || div.textContent || "";
    };

    const handleProgressReset = () => {
        setCounter(0);
    };

    const handleModeSwitch = () => {
        handleProgressReset();
        if (textMode === "Mode: Transport Directions") {
            setTextMode("Mode: Building Directions");
            setTextToSpeak(walk22Directions);
        } else {
            setTextMode("Mode: Transport Directions");
            setTextToSpeak(drive22Directions);
        }
        setIconToDisplay(<GiNothingToSay />);
    };

    const handleIconSwitch = (index: number) => {
        if (textMode === "Mode: Building Directions") {
            const direction = icons[index];
            if (direction === "Turn Left then Continue Straight") {
                setIconToDisplay(<BsArrow90DegLeft />);
            } else if (direction === "Continue Straight") {
                setIconToDisplay(<BsArrowUp />);
            } else if (direction === "Turn Right then Continue Straight") {
                setIconToDisplay(<BsArrow90DegRight />);
            } else {
                setIconToDisplay(<GiNothingToSay />);
            }
        } else {
            setIconToDisplay(<GiNothingToSay />);
        }
    };

    const speakDirections = async () => {
        const message = textToSpeak[counter];
        const messageString = htmlToPlainText(message || "");
        handleIconSwitch(counter);

        const safeMessage =
            messageString.length > 0
                ? messageString
                : "Empty of Directions, select a from, and, too location in order to receive directions.";

        const response = await axios.post(
            ROUTES.TTS,
            { text: safeMessage },
            { responseType: "blob" }
        );

        const audioBlob = await response.data;

        if (!audioRef.current.paused) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
        audioRef.current.play();
    };

    return (
        <div className="absolute top-100 left-6 z-11">
            <div className="p-5 flex flex-col items-end space-y-3 w-100 bg-white rounded-b-lg">
                <div className="border border-codGray w-full"></div>
                {/* Direction Step Row */}
                <div className="flex items-center justify-center w-full space-x-4">
                    {/* Left Arrow */}
                    <button
                        onClick={() => {
                            if (counter > 0) {
                                const newIndex = counter - 1;
                                setCounter(newIndex);
                                handleIconSwitch(newIndex);
                            }
                        }}
                        disabled={counter === 0}
                        className={`text-2xl ${
                            counter === 0 ? "text-gray-300" : "text-mgbblue hover:text-blue-800"
                        }`}
                    >
                        <BsChevronLeft />
                    </button>

                    {/* Direction Text */}
                    <div className="text-black text-center w-80 px-2 h-20 flex items-center justify-center">
                        {htmlToPlainText(textToSpeak[counter] || "")}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={() => {
                            if (counter < textToSpeak.length - 1) {
                                const newIndex = counter + 1;
                                setCounter(newIndex);
                                handleIconSwitch(newIndex);
                            }
                        }}
                        disabled={counter === textToSpeak.length - 1}
                        className={`text-2xl ${
                            counter === textToSpeak.length - 1
                                ? "text-gray-300"
                                : "text-mgbblue hover:text-blue-800"
                        }`}
                    >
                        <BsChevronRight />
                    </button>
                </div>

                {/* Bottom Controls */}
                <div className="flex space-x-2 items-center justify-end">
                    <MGBButton onClick={handleModeSwitch} variant="secondary" disabled={false}>
                        {textMode}
                    </MGBButton>

                    <MGBButton onClick={speakDirections} variant="primary" disabled={false}>
                        Speak
                    </MGBButton>

                    <div className="flex items-center justify-center p-2 bg-gray-200 rounded-md">
                        {iconToDisplay}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextToSpeechMapComponent;
