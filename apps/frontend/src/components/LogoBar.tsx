import mgblogo from '../assets/mgblogo.png';
import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
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

const aboutItems = [
    {
        title: 'Meet the Developers',
        href: '/AboutPage',
        description:
            'Meet the talented developers of Team C',
    },
    {
        title: 'Tech Stack',
        href: '/',
        description: 'The tools behind the creation of this app'
    }
];

const creditItems = [
    {
        title: '',
        href: '/',
        description: '',
    }
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
    return (
        <header className="h-full flex items-center justify-between px-4 border-1 border-black">
            {/* Left: Trigger + Logo */}
            <div className="flex items-center ml-3">
                <SidebarTrigger className="p-2 mr-5" />
                <a href="/">
                    <img
                        src={mgblogo}
                        alt="MASS GENERAL BRINGHAM"
                        className="h-13 w-80 mb-1"
                    />
                </a>
                <NavigationMenu className="ml-4">
                    <NavigationMenuList>
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
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="mt-1">Credits</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[200px] gap-3 p-2 md:w-[300px] md:grid-cols-2 lg:w-[400px]">
                                    {creditItems.map((item) => (
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
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* Right: Add future nav, user info, etc. here if needed */}
            <div className="flex flex-row gap-4">
                <Search className="my-2" />
                <input
                    className="text-sm w-90 px-4 py-2 border border-solid border-mgbblue rounded-md"
                    type="text"
                    placeholder="Search"
                />
            </div>
        </header>
    );
};

export default LogoBar;
