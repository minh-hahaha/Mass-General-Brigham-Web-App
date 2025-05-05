import React, { useState, useEffect, JSX, useRef } from "react";
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
import { LuMapPinCheckInside } from "react-icons/lu";
import { GiNothingToSay } from "react-icons/gi";
import SelectElement from "@/elements/SelectElement.tsx";

interface State {
    walkDirections: string;
    driveDirections: string;
    drive22Directions: string[];
    walk22Directions: string[];
    icons: string[];
    distanceUnits: 'Feet' | 'Meters',
    setDistanceUnits: (units: 'Feet' | 'Meters') => void
    currentStep: string;
}

const TextToSpeechMapComponent = ({
                                      walkDirections,
                                      driveDirections,
                                      drive22Directions,
                                      walk22Directions,
                                      icons,
                                      distanceUnits,
                                      setDistanceUnits,
                                      currentStep,
                                  }: State) => {
    const audioRef = useRef(new Audio());
    const [textMode, setTextMode] = useState("Mode: Transport Directions");
    const [textToSpeak, setTextToSpeak] = useState<string[]>(drive22Directions);
    const [textDisplayList, setTextDisplayList] = useState<string[]>(drive22Directions);
    const [counter, setCounter] = useState(0);
    const [iconToDisplay, setIconToDisplay] = useState<JSX.Element>(<GiNothingToSay />);

    useEffect(() => {
        if (textMode === "Mode: Transport Directions") {
            setTextToSpeak(drive22Directions);
            setTextDisplayList(drive22Directions);
        } else {
            setTextToSpeak(walk22Directions || []);
            setTextDisplayList(walk22Directions || []);
        }
        setCounter(0);
        updateIcon(0);
    }, [drive22Directions, walk22Directions, textMode]);


    useEffect(() => {
        handleModeSwitch()
    }, [currentStep]);

    const handleModeSwitch = () => {
        setCounter(0);
        if (currentStep === 'DEPARTMENT') {
            setTextMode("Mode: Building Directions");
            setTextToSpeak(walk22Directions || []);
            setTextDisplayList(walk22Directions || []);
        } else if(currentStep==='DIRECTIONS'){
            setTextMode("Mode: Transport Directions");
            setTextToSpeak(drive22Directions);
            setTextDisplayList(drive22Directions);
        }
        updateIcon(0);
    };

    const updateIcon = (index: number) => {
        const direction = icons?.[index];
        if (textMode === "Mode: Building Directions") {
            if (direction === "turn left then continue straight") {
                setIconToDisplay(<BsArrow90DegLeft />);
            } else if (direction === "continue straight") {
                setIconToDisplay(<BsArrowUp />);
            } else if (direction === "turn right then continue straight") {
                setIconToDisplay(<BsArrow90DegRight />);
            } else {
                setIconToDisplay(<LuMapPinCheckInside />);
            }
        } else {
            setIconToDisplay(<GiNothingToSay />);
        }
    };

    const htmlToPlainText = (html: string): string => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.innerText || div.textContent || "";
    };

    const speakDirections = async () => {
        const message = textToSpeak[counter];
        updateIcon(counter);

        let messageString = htmlToPlainText(message || "");
        if (!messageString) {
            messageString = "Empty of Directions, select a from, and, too location in order to receive directions.";
        }

        const response = await axios.post(ROUTES.TTS, { text: messageString }, {
            responseType: "blob",
        });

        const audioBlob = await response.data;
        if (!audioRef.current.paused) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
        audioRef.current.play();
    };

    const goLeft = () => {
        if (counter > 0) {
            setCounter(counter - 1);
            updateIcon(counter - 1);
        }
    };

    const goRight = () => {
        if (counter < textDisplayList.length - 1) {
            setCounter(counter + 1);
            updateIcon(counter + 1);
        }
    };

    return (
        <div className="absolute top-150 left-6 z-10">
            <div className="p-5 shadow-md flex flex-col items-center space-y-4 w-100 z-10 bg-white rounded-b-lg">
                {/* Horizontal Carousel Controls */}
                <div className="flex items-center justify-between w-full space-x-4">
                    <button
                        onClick={goLeft}
                        disabled={counter === 0}
                        className="text-2xl text-mgbblue hover:text-blue-800 disabled:text-gray-300"
                    >
                        <BsChevronLeft />
                    </button>

                    <div className="w-[300px] h-[120px] mb-0 px-4 flex items-center justify-center text-black text-center text-base">
                        <div
                            className="whitespace-pre-line break-words"
                            dangerouslySetInnerHTML={{ __html: textDisplayList[counter] || '' }}
                        />
                    </div>

                    <button
                        onClick={goRight}
                        disabled={counter === textDisplayList.length - 1}
                        className="text-2xl text-mgbblue hover:text-blue-800 disabled:text-gray-300"
                    >
                        <BsChevronRight />
                    </button>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between space-x-2">
                    {/* Speak Button */}
                    <MGBButton onClick={speakDirections} variant="secondary" disabled={false}>
                        Speak
                    </MGBButton>

                    {/* Radio Button Group */}
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-4">
                            {/* Icon */}
                            <div className="flex items-center justify-center p-2 bg-gray-200 rounded-md">
                                {iconToDisplay}
                            </div>
                            <label className="flex items-center space-x-1">
                                <input
                                    type="radio"
                                    name="distanceUnits"
                                    value="Feet"
                                    checked={distanceUnits === 'Feet'}
                                    onChange={(e) => setDistanceUnits(e.target.value as 'Feet' | 'Meters')}
                                />
                                <span>Feet</span>
                            </label>
                            <label className="flex items-center space-x-1">
                                <input
                                    type="radio"
                                    name="distanceUnits"
                                    value="Meters"
                                    checked={distanceUnits === 'Meters'}
                                    onChange={(e) => setDistanceUnits(e.target.value as 'Feet' | 'Meters')}
                                />
                                <span>Meters</span>
                            </label>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default TextToSpeechMapComponent;
