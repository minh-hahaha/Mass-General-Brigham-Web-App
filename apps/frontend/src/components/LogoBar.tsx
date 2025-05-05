import mgblogo from '../assets/mgblogo.png';
import * as React from 'react';
import { Search } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils.ts';
import { useAuth0 } from '@auth0/auth0-react';
import MGBButton from "@/elements/MGBButton.tsx";
import {motion} from 'framer-motion';
import { FaRegUserCircle } from "react-icons/fa";
import {clsx} from 'clsx';
import {useEffect, useState} from "react";



const aboutItems = [
    {
        title: 'Meet the Developers',
        href: '/AboutPage',
        description: 'Meet the talented developers of Team C',
    },
    {
        title: 'Credits',
        href: '/CreditsPage',
        description: 'The tools behind the creation of this app',
    },
];

const directories = [
    {
        title: 'Chestnut Hill',
        description: 'View all Chestnut Hill Directories',
    },
    {
        title: '20 Patriot Place',
        description: 'View all 20 Patriot Place Directories',
    },
    {
        title: '22 Patriot Place',
        description: 'View all 22 Patriot Place Directories',
    },
    {
        title: 'Faulkner',
        description: 'View all Faulkner Directories',
    },
    {
        title: 'Main Campus',
        description: 'View all Main Campus Directories',
    },
];

const servicereqs = [
    {
        title: 'Transport',
        href: '/',
        description: 'View/Make Transport Requests',
    },
    {
        title: 'Translation',
        href: '/',
        description: 'View/Make Translator Requests',
    },
    {
        title: 'Sanitation',
        href: '/',
        description: 'View/Make Sanitation Requests',
    },
    {
        title: 'Medical Device',
        href: '/',
        description: 'View/Make Medical Device Requests',
    },
    {
        title: 'Maintenance',
        href: '/',
        description: 'View/Make Maintenance Requests',
    },
];

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            'block select-none space-y-1 rounded-md p-1 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                            className
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    }
);
ListItem.displayName = 'ListItem';

const LogoBar = () => {

    const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();

    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        if (user && user["https://mgb.teamc.com/roles"]) {
            console.log("Roles:", user["https://mgb.teamc.com/roles"]);
            const adminStatus = user["https://mgb.teamc.com/roles"].includes("Admin");
            setIsAdmin(adminStatus);
            console.log("User", user);
            console.log("Admin", adminStatus);
        } else {
            console.log("Roles not found or user not loaded properly");
        }
    }, [isAuthenticated, user]);


    return (
        <header className="h-full w-full flex items-center justify-between px-2 mt-1 mb-1 border-b-10 border-fountainBlue">
            {/* Left: Trigger + Logo */}
            <div className="flex items-center ml-3">
                <a href="/">
                    <img src={mgblogo} alt="MASS GENERAL BRINGHAM" className="h-13 w-80 mb-1" />
                </a>
                <NavigationMenu className="ml-6">
                    <NavigationMenuList>
                        {/* Always visible: Directions */}
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                className="mt-1 font-medium"
                                onClick={() => (window.location.href = '/MapPage')}
                            >
                                Directions
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {/* Visible for any logged-in user (admin or not) */}
                        {isAuthenticated && (
                            <>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger
                                        className="mt-1"
                                        onClick={() => (window.location.href = '/DirectoryDisplay')}
                                    >
                                        Directories
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[200px] gap-3 p-2 md:w-[300px] md:grid-cols-2 lg:w-[400px]">
                                            {directories.map((item) => (
                                                <ListItem
                                                    key={item.title}
                                                    title={item.title}
                                                    onClick={() => window.location.href = `/DirectoryDisplay?location=${encodeURIComponent(item.title)}`}
                                                >
                                                    {item.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger
                                        className="mt-1"
                                        onClick={() => (window.location.href = '/ServiceRequestDisplay')}
                                    >
                                        Service Requests
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[200px] gap-3 p-2 md:w-[300px] md:grid-cols-2 lg:w-[400px]">
                                            {servicereqs.map((item) => (
                                                <ListItem
                                                    key={item.title}
                                                    title={item.title}
                                                    onClick={() => window.location.href = `/ServiceRequestDisplay?form=${encodeURIComponent(item.title)}`}
                                                >
                                                    {item.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="mt-1">About</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[200px] gap-3 p-2 md:w-[300px] md:grid-cols-2 lg:w-[400px]">
                                            {aboutItems.map((item) => (
                                                <ListItem
                                                    key={item.title}
                                                    title={item.title}
                                                    href={item.href}
                                                >
                                                    {item.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </>
                        )}

                        {/* Only visible if logged in AND admin */}
                        {isAuthenticated && isAdmin && (
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    className="mt-1 font-medium"
                                    onClick={() => (window.location.href = '/MapEditorPage')}
                                >
                                    Map Editor
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* Right: Add future nav, user info, etc. here if needed */}
            <div className="flex flex-row gap-4 -mr-8">
                <Search className="my-2" />
                <input
                    className="text-sm w-60 px-4 border border-solid border-mgbblue rounded-md"
                    type="text"
                    placeholder="Search"
                />
                {!isAuthenticated ? (
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                        <MGBButton
                            onClick={() => loginWithRedirect()}
                            variant={'secondary'}
                            disabled={false}
                            className="pl-9"
                        >
                            Log In
                        </MGBButton>
                    </motion.button>
                ) : (
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                        <MGBButton
                            onClick={() => logout()}
                            variant={'secondary'}
                            disabled={false}
                            className="pl-8"
                        >
                            Log Out
                        </MGBButton>
                    </motion.button>
                )}
                <FaRegUserCircle className={clsx(
                    !isAuthenticated ? "mt-3 relative right-25" : "mt-3 relative right-27.5",
                )}/>
            </div>
        </header>
    );
};

export default LogoBar;
