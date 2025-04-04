import React from 'react';
import {Link} from 'react-router-dom';

const LinkHover: React.FC = ({ children }) => {
    return <li
        className='
                text-white
                drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]
                hover:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0)]
                hover:text-teal-200
                active:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0)]
                active:text-teal-300
                focus:outline-2'>
        {children}
    </li>;
}


const Navbar=()=>{
    return (
        <div dir='rtl' className='navBar
        h-full
        bg-blue-900
        border-t-0
        border-b-0
        border-l-0
        border-r-5
        border-black
        transition-[delay-150 duration-500 ease-in-out]
        hover:rounded-r-4xl
        '>
            <div className='unorderedList
                p-8
                font-[Bahnschrift]
                font-bold
                text-white
                drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]
                '>
                <ul>
                <LinkHover><Link to="/">Home Page</Link></LinkHover>
                <LinkHover><Link to="/ChestnutHillDirectory">Chestnut Hill</Link></LinkHover>
            </ul></div>
        </div>
    )

}

export default Navbar;