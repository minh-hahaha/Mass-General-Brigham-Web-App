import { Home, MapPin, Hammer, Tablet, User, ChevronUp, ArrowRightFromLine } from 'lucide-react';

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
} from "@/components/ui/sidebar";
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu.tsx";

const items = [
    {
        title: "Home",
        url: '/Home',
        icon: Home,
    },
    {
        title: "Directions to Hospital",
        url: '/Home',
        icon: MapPin,
    },
    {
        title: "Service Request",
        url: '/ServiceRequestPage',
        icon: Hammer,
    },
    {
        title: "Requests Display Page",
        url: '/ServiceRequestDisplay',
        icon: Tablet,
    },
    {
        title: "Import/Export Directory",
        url: '/ImportExportDirectory',
        icon: ArrowRightFromLine,
    },
    {
      title: "Directory Display Page",
      url: '/DirectoryDisplay',
      icon: Tablet,
    }
]

export function ShadSidebar() {
    return (
        <Sidebar className="pt-16">
            <SidebarContent className="flex flex-col justify-between">
                <SidebarGroup>
                    <SidebarGroupLabel>Hospital</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarFooter className="mb-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton>
                                        <User /> User
                                        <ChevronUp className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    className="w-60"
                                >
                                    <DropdownMenuItem>
                                        <span>Account</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => window.location.href = '/Login'}>
                                        <span>Log In</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </SidebarContent>
        </Sidebar>
    )
}