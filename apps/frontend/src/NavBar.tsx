import React from 'react';
import {Link} from 'react-router-dom';

const LinkHover: React.FC = ({ children }) => {
    return <li
        className='
                text-white
                active:bg-blue-600
                focus:outline-2
                hover:bg-blue-700
                pr-2
                my-1
                py-2'>
        {children}
    </li>;
}


const Navbar=()=>{
    return (
        <div dir='rtl' className='navBar
        h-full
        bg-blue-900
        border-t-2
        border-b-5
        border-l-0
        border-r-5
        border-black
        transition-[delay-150 duration-500 ease-in-out]
        hover:rounded-r-4xl
        '>
            <div className='unorderedList
                my-8
                font-semibold
                text-white
                text-2xl
                '>
                <ul>
                    <Link to='/'><LinkHover classname=''>Home Page</LinkHover></Link>
                    <Link to="/Login"><LinkHover>Login</LinkHover></Link>
                    <Link to="/ChestnutHillDirectory"><LinkHover>Chestnut Hill</LinkHover></Link>
                    <Link to="/ServiceRequestPage"><LinkHover>Service Request</LinkHover></Link>
                    <Link to="/DataTable"><LinkHover>Data Table</LinkHover></Link>
                </ul>
            </div>
        </div>
    )

}

export default Navbar;