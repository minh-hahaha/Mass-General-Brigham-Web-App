import msgLogo from '../assets/msgLogo.png'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search } from 'lucide-react';

const LogoBar = () => {
    return (
        <header className="h-full flex items-center justify-between px-4 bg-gray-200 border-b-4 border-black">
            {/* Left: Trigger + Logo */}
            <div className="flex items-center ml-3">
                <SidebarTrigger className="p-2 mr-5" />
                <img src={msgLogo} alt="MASS GENERAL BRINGHAM" className="h-12 mr-2" />
                <h1 className="text-3xl font-bold">
                    Mass General Brigham
                </h1>
            </div>

            {/* Right: Add future nav, user info, etc. here if needed */}
            <div className="flex flex-row gap-4">
                <Search className="my-2" />
                <input
                    className="text-sm w-90 px-4 py-2 border border-solid border-mgbblue rounded-md"
                    type="text"
                    placeholder="Search"
                />
                <a href='/' className="py-2 ml-3 mr-3">About</a>
            </div>
        </header>
    )
}

export default LogoBar;