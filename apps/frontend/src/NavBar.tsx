import React from 'react';
import {Link} from 'react-router-dom';

const Navbar=()=>{
    return (
        <div className='navBar'>
            <ul>
                <li><Link to="/">Home Page</Link></li>
                <li><Link to="/ChestnutHillDirectory">ChestnutHillDirectory</Link></li>
            </ul>
        </div>
    )

}

export default Navbar;