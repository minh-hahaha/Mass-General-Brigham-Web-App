import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LinkHoverProps {
    children: ReactNode;
}

const LinkHover: React.FC<LinkHoverProps> = ({ children }) => {
    return (
        <li
            className="
                text-white
                drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]
                hover:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0)]
                hover:text-teal-200
                active:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0)]
                active:text-teal-300
                focus:outline-2"
        >
            {children}
        </li>
    );
};

const Navbar = () => {
    // Get the loggedIn value from localStorage
    const loggedIn = sessionStorage.getItem('loggedIn') === 'true';  // Ensure it's a boolean

    return (
        <div
            dir="rtl"
            className="navBar
        h-full
        bg-blue-900
        border-t-0
        border-b-0
        border-l-0
        border-r-5
        border-black
        transition-[delay-150 duration-500 ease-in-out]
        "
        >
            <div
                className="unorderedList
                p-8
                font-[Bahnschrift]
                font-bold
                text-white
                drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]
                "
            >
                <ul>
                    {/* Always show Login page link if not logged in */}
                    {!loggedIn && (
                        <LinkHover>
                            <Link to="/Login">Login</Link>
                        </LinkHover>
                    )}

                    {/* Show other pages only if logged in */}
                    {loggedIn && (
                        <>
                            <LinkHover>
                                <Link to="/Home">Home Page</Link>
                            </LinkHover>
                            <LinkHover>
                                <Link to="/ServiceRequestPage">Service Request</Link>
                            </LinkHover>
                            <LinkHover>
                                <Link to="/ServiceRequestDisplay">Service Request Display</Link>
                            </LinkHover>
                            <LinkHover>
                                <Link to="/ImportExportDirectory">Import/Export Directory</Link>
                            </LinkHover>
                            <LinkHover>
                                <Link to="/DirectoryDisplay">Directory Display</Link>
                            </LinkHover>
                            <LinkHover>
                                <Link to="/SanitationRequest">Sanitation Request</Link>
                            </LinkHover>
                            <LinkHover>
                                <Link to="/SanitationRequestDisplayPage">Sanitation Request Display</Link>
                            </LinkHover>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
