import React, {useEffect, useState} from 'react';
import { FaMicrophone } from "react-icons/fa";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface VoiceCommandProps {
    voiceTranscript: (transcript: string) => void;
}

const VoiceCommands: React.FC<VoiceCommandProps> = ({voiceTranscript}) => {
    const {
        transcript,
        browserSupportsSpeechRecognition,
        resetTranscript,
        listening,
    } = useSpeechRecognition();

    if(!browserSupportsSpeechRecognition){
        return <span>Your Browser Does Not Support Speech to Navigate.</span>;
    }

    const [clicked, setClicked] = useState(false)
    const handleClicked = async () => {
        if (!clicked) {
            resetTranscript();
            setClicked(true);
            await SpeechRecognition.startListening({continuous: false});
        }
    };

    useEffect(() => {
        if (!listening && clicked && transcript) {
            voiceTranscript(transcript);
            SpeechRecognition.stopListening(); // Ensure cleanup
            setClicked(false);
            resetTranscript();
        }
    }, [listening, transcript, clicked]);


        // useEffect(() => {
    //     //console.log("clicked", clicked);
    //     console.log("PLEASE WORK HERE IS THE TRANSCRIPT", transcript);
    // }, [transcript]);


    return (
        <button className="p-2 rounded-sm h-10 w-10 bg-mgbyellow hover:bg-yellow-600 mt-1.5 -ml-5" onClick={handleClicked} >
            <FaMicrophone
                className={`h-5 w-6 transition-colors duration-300 ${clicked ? 'text-mgbblue' : 'text-black'}`}/>
        </button>
    );
};
export default VoiceCommands;