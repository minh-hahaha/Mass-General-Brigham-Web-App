import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel.tsx";
import {cn} from "@/lib/utils.ts";
import { ReactNode, useEffect, useState } from 'react';


// An interface that defines the props the component accepts
interface CarouselProps {
    tableTabs: {label: string, component: React.FC}[];
}

const CarouselMenu: React.FC<CarouselProps> = ({tableTabs}) => {
    const [api, setApi] = useState<CarouselApi | null>(null)
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        if (!api) return
        const onSelect = () => setSelectedIndex(api.selectedScrollSnap())
        api.on("select", onSelect)
        onSelect()
        return () =>{ api.off("select", onSelect) }
    }, [api]);


    return (
        <div className="w-full px-6 pt-10">
            <div className="flex justify-center mb-10">
                <div className="relative flex w-full max-w-2xl overflow-hidden rounded-xl bg-white border border-mgbblue shadow-inner">
                    {/* Highlight */}
                    <div
                        className="absolute top-0 left-0 h-full rounded-xl transition-transform duration-300 ease-in-out bg-mgbblue"
                        style={{
                            width: `${100 / tableTabs.length}%`,
                            transform: `translateX(${selectedIndex * 100}%)`,
                            zIndex: 0,
                        }}
                    />
                    {tableTabs.map((tab, index) => (
                        <button
                            key={tab.label}
                            onClick={() => api?.scrollTo(index)}
                            className={cn(
                                "flex-1 z-10 px-4 py-3 text-sm font-medium transition-colors duration-200",
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

            <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                    {tableTabs.map((tab, index) => {
                        const Component = tab.component;
                        return (
                            <CarouselItem key={index}>
                                <Component />
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default CarouselMenu;