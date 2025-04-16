import {
    Home,
    MapPin,
    Hammer,
    Tablet,
    User,
    ChevronUp,
    ArrowRightFromLine,
    BookA,
    Ambulance,
    SprayCan,
    LibraryBig,
    PencilLine,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarHeader,
} from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu.tsx';

const navItems = [
    {
        title: 'Home',
        url: '/',
        icon: Home,
    },
    {
        title: 'Directions to Hospital',
        url: '/MapPage',
        icon: MapPin,
    },
    {
        title: 'Map Editor',
        url: '/MapView',
        icon: PencilLine,
    },
];

const directoryItems = [
    {
        title: 'Import/Export Directory',
        url: 'ImportExportDirectory',
        icon: ArrowRightFromLine,
    },
    {
        title: 'Directory Display Page',
        url: 'DirectoryDisplay',
        icon: LibraryBig,
    }
];

const forms = [
    {
        title: 'Service Requests',
        url: './ServiceRequestSelectPage',
        icon: Tablet,
    },
    // {
    //     title: 'Transportation Request',
    //     url: '/TransportationRequestPage',
    //     icon: Ambulance,
    // },
    // {
    //     title: 'Translator Request',
    //     url: '/TranslationServiceRequestPage',
    //     icon: BookA,
    // },
    // {
    //     title: 'Sanitation Request',
    //     url: '/SanitationRequest',
    //     icon: SprayCan,
    // },
    // {
    //     title: 'Maintenance Request',
    //     url: '/', //todo: add url,
    //     icon: Hammer,
    // },
    {
        title: 'Requests Display Page',
        url: '/ServiceRequestDisplay',
        icon: Tablet,
    },
];




export function ShadSidebar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState('');

    useEffect(() => {
        const checkLoginStatus = () => {
            const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
            const user = sessionStorage.getItem('currentUser') || '';
            setLoggedIn(isLoggedIn);
            setCurrentUser(user);
        };

        checkLoginStatus();

        // Listen for changes to sessionStorage from other tabs or login events
        window.addEventListener('storage', checkLoginStatus);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    function handleLogOut() {
        sessionStorage.removeItem('currentUser');
        window.location.href = '/Login';
    }

    return (
        <Sidebar className="pt-16">
            <div className="bg-white shadow-md rounded-xl p-3 mx-3 mt-3 border-1">
                <SidebarHeader className="text-2xl font-light text-center text-mgbblue">Welcome {currentUser.substring(0, currentUser.indexOf(' '))}</SidebarHeader>
            </div>
            <SidebarContent className="flex flex-col justify-between">
                <SidebarGroup className="gap-3">
                    <SidebarGroupContent>
                        <SidebarMenuButton>Navigation</SidebarMenuButton>
                        <SidebarMenuSub>
                            {navItems.map((item) => (
                                <SidebarMenuSubItem key={item.title}>
                                    <SidebarMenuSubButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </SidebarGroupContent>
                    <SidebarGroupContent>
                        <SidebarMenuButton>Directories</SidebarMenuButton>
                        <SidebarMenuSub>
                            {directoryItems.map((item) => (
                                <SidebarMenuSubItem key={item.title}>
                                    <SidebarMenuSubButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </SidebarGroupContent>
                    <SidebarGroupContent>
                        <SidebarMenuButton>Service Request Forms</SidebarMenuButton>
                        <SidebarMenuSub>
                            {forms.map((form) => (
                                <SidebarMenuSubItem key={form.title}>
                                    <SidebarMenuSubButton asChild>
                                        <a href={form.url}>
                                            <form.icon />
                                            <span>{form.title}</span>
                                        </a>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarFooter className="mb-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            {loggedIn ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton>
                                            <User /> {sessionStorage.getItem('currentUser')}
                                            <ChevronUp className="ml-auto" />
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="top" className="w-60">
                                        <DropdownMenuItem>
                                            <span>Account</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleLogOut()}>
                                            <span>Log Out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <SidebarMenuButton
                                    onClick={() => (window.location.href = '/Login')}
                                >
                                    <User /> Log In
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </SidebarContent>
        </Sidebar>
    );
}
