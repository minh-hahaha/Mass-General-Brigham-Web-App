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

    { label: "All", Component: TableAllRequest },
    { label: "Maintenance", Component: TableMaintenanceRequest },
    { label: "Sanitation", Component: TableSanitationRequest },
    { label: "Transport", Component: TableTransportRequest },
    { label: "Translation", Component: TableTranslationRequest },
    { label: "Medical Device", Component: TableMedicalDeviceRequest },
]

export default function RequestTablesCarousel() {
    const [api, setApi] = useState<CarouselApi | null>(null)
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        if (!api) return
        const onSelect = () => setSelectedIndex(api.selectedScrollSnap())
        api.on("select", onSelect)
        onSelect()
        return () => api.off("select", onSelect)
    }, [api])

    return (
        <div className="w-full px-6 pt-10">
            <div className="flex justify-center mb-6">
                <div className="relative flex w-full overflow-hidden rounded-xl bg-white border border-mgbblue shadow-inner">
                    {/* Highlight */}
                    <div
                        className="absolute top-0 left-0 h-full w-1/6 rounded-xl transition-transform duration-300 ease-in-out bg-mgbblue"
                        style={{ transform: `translateX(${selectedIndex * 100}%)`, zIndex: 0 }}
                    />
                    {tableTabs.map((tab, index) => (
                        <button
                            key={tab.label}
                            onClick={() => api?.scrollTo(index)}
                            className={cn(
                                "w-1/6 text-center z-10 px-4 py-3 text-sm font-medium transition-colors duration-200",
                                selectedIndex === index
                                    ? "text-white"
                                    : "text-mgbblue hover:text-mgbblue/80"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative px-8">
            <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                    {tableTabs.map((tab, index) => (
                        <CarouselItem key={index}>
                            <tab.Component />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            </div>
        </div>
    )

export default function RequestTablesCarousel() {
    return (<CarouselMenu tableTabs={tableTabs}/>)

}
