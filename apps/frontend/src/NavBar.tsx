import React from 'react';
import {Link} from 'react-router-dom';

const Navbar=()=>{
    return (
        <div className='navBar'>
            <div>
                <Link to="/">Home Page</Link>
            </div>
            <div>
                <Link to="/ChestnutHillDirectory">ChestnutHillDirectory</Link>
            </div>

        </div>
    )

}

export default Navbar;