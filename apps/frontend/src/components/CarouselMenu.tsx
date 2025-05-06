import { cn } from '@/lib/utils.ts';
import { useEffect, useState } from 'react';

// Interface for props
interface CarouselProps {
    tableTabs: { label: string; component: React.FC }[];
    initialIndex?: number;
}

const CarouselMenu: React.FC<CarouselProps> = ({ tableTabs, initialIndex = 0 }) => {
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);

    useEffect(() => {
        setSelectedIndex(initialIndex);
    }, [initialIndex]);

    return (
        <div className="w-full pt-10 flex flex-col min-h-0">
            {/* Tabs */}
            <div className="flex justify-center mb-10 ml-75">
                <div className="relative flex w-full max-w-2xl overflow-hidden rounded-xl bg-white border border-codGray shadow-inner">
                    {/* Highlight */}
                    <div
                        className="absolute top-0 left-0 h-full rounded-xl transition-transform duration-300 ease-in-out bg-fountainBlue"
                        style={{
                            width: `${100 / tableTabs.length}%`,
                            transform: `translateX(${selectedIndex * 100}%)`,
                            zIndex: 0,
                        }}
                    />
                    {tableTabs.map((tab, index) => (
                        <button
                            key={tab.label}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                'flex-1 z-10 px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer',
                                selectedIndex === index
                                    ? 'text-codGray'
                                    : 'text-codGray hover:text-mgbblue'
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Selected Content */}
            <div className="w-full flex-grow min-h-0">
                {(() => {
                    const SelectedComponent = tableTabs[selectedIndex].component;
                    return <SelectedComponent />;
                })()}
            </div>
        </div>
    );
};

export default CarouselMenu;
