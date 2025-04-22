import { useEffect, useState } from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"

import TableAllRequest from "@/components/tables/TableServiceRequest.tsx"
import TableMaintenanceRequest from "@/components/tables/TableMaintenanceRequest.tsx"
import TableSanitationRequest from "@/components/tables/TableSanitationRequest.tsx"
import TableTransportRequest from "@/components/tables/TableTransportRequest.tsx"
import TableTranslationRequest from "@/components/tables/TableTranslatorRequest.tsx"
import TableMedicalDeviceRequest from "@/components/tables/TableMedicalDeviceRequest.tsx"
import { cn } from "@/lib/utils"
import CarouselMenu from '@/components/CarouselMenu.tsx';

const tableTabs = [
    { label: "All", component: TableAllRequest },
    { label: "Maintenance", component: TableMaintenanceRequest },
    { label: "Sanitation", component: TableSanitationRequest },
    { label: "Transport", component: TableTransportRequest },
    { label: "Translation", component: TableTranslationRequest },
    { label: "Medical Device", component: TableMedicalDeviceRequest },
]


export default function RequestTablesCarousel() {
    return (<CarouselMenu tableTabs={tableTabs}/>)
}
