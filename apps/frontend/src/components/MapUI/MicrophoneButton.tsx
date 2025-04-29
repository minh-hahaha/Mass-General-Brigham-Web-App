import React, {useState} from 'react';
import { FaMicrophone } from "react-icons/fa";


const MicrophoneButton: React.FC = () => {
    const [clicked, setClicked] = useState(false)
    const handleClicked = () => {
        setClicked(!clicked);

    }

    return (
        <button className=" p-2 rounded-sm h-10 w-10 bg-mgbyellow hover:bg-yellow-600  " onClick={handleClicked} >
            <FaMicrophone
                className={`h-5 w-6 transition-colors duration-300 ${clicked ? 'text-mgbblue' : 'text-black'}`}/>
        </button>
    );
};
export default MicrophoneButton;