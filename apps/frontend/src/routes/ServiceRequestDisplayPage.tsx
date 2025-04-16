import React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"

import TableMaintenanceRequest from "@/components/TableMaintenanceRequest"
import TableSanitationRequest from "@/components/TableSanitationRequest"
import TableTransportRequest from "@/components/TableTransportRequest"
import TableTranslationRequest from "@/components/TableTranslatorRequest"
import { cn } from "@/lib/utils"

const tableTabs = [
    { label: "Maintenance", Component: TableMaintenanceRequest },
    { label: "Sanitation", Component: TableSanitationRequest },
    { label: "Transport", Component: TableTransportRequest },
    { label: "Translation", Component: TableTranslationRequest },
]

export default function RequestTablesCarousel() {
    const [api, setApi] = React.useState<CarouselApi | null>(null)
    const [selectedIndex, setSelectedIndex] = React.useState(0)

    React.useEffect(() => {
        if (!api) return
        const onSelect = () => setSelectedIndex(api.selectedScrollSnap())
        api.on("select", onSelect)
        onSelect()
        return () => api.off("select", onSelect)
    }, [api])

    return (
        <div className="w-full">
            {/* Navigation Bar in a Styled Container */}
            <div className="flex justify-center mb-4">
                <div className="flex gap-2 bg-blue-50 p-2 rounded-xl border border-blue-200 shadow-sm">
                    {tableTabs.map((tab, index) => (
                        <button
                            key={tab.label}
                            onClick={() => api?.scrollTo(index)}
                            className={cn(
                                "transition-all duration-300 px-4 py-1 rounded-md text-sm font-medium",
                                selectedIndex === index
                                    ? "bg-blue-600 text-white scale-110 shadow-md"
                                    : "bg-white text-blue-600 hover:bg-blue-100"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Carousel */}
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
    )
}
