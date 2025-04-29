import { useState } from 'react';
import CarouselMenu from '@/components/CarouselMenu.tsx';

import TransportationRequestPage from '@/routes/TransportationRequestPage.tsx';
import TableAllRequest from '@/components/tables/TableServiceRequest.tsx';
import TableMaintenanceRequest from '@/components/tables/TableMaintenanceRequest.tsx';
import TableSanitationRequest from '@/components/tables/TableSanitationRequest.tsx';
import TableTransportRequest from '@/components/tables/TableTransportRequest.tsx';
import TableMedicalDeviceRequest from '@/components/tables/TableMedicalDeviceRequest.tsx';
import SanitationRequestPage from '@/routes/SanitationRequestComponent.tsx';
import MedicalDeviceServiceRequestPage from '@/routes/MedicalDeviceServiceRequestPage.tsx';
import MaintenanceRequestPage from '@/routes/MaintenanceRequestPage.tsx';
import TableTranslatorRequest from "@/components/tables/TableTranslatorRequest.tsx";
import TranslationServiceRequestPage from "@/routes/TranslationServiceRequestPage.tsx";
// ...other imports...


const tableTabs = (setActiveForm: (type: FormType) => void) => [
    { label: 'All', component: () => <TableAllRequest setActiveForm={setActiveForm} /> },
    {
        label: 'Transport',
        component: () => <TableTransportRequest setActiveForm={setActiveForm} />,
    },
    {
        label: 'Translation',
        component: () => <TableTranslatorRequest setActiveForm={setActiveForm} />,
    },
    {
        label: 'Sanitation',
        component: () => <TableSanitationRequest setActiveForm={setActiveForm} />,
    },
    {
        label: 'Medical Device',
        component: () => <TableMedicalDeviceRequest setActiveForm={setActiveForm} />,
    },
    {
        label: 'Maintenance',
        component: () => <TableMaintenanceRequest setActiveForm={setActiveForm} />,
    },
];



type FormType =
    | 'transport'
    | 'translation'
    | 'maintenance'
    | 'medical device'
    | 'sanitation'
    | null;

export default function RequestTablesCarousel() {
    const [activeForm, setActiveForm] = useState<FormType>(null);
    const searchParams = new URLSearchParams(window.location.search);
    const form = searchParams.get('form');
    const tabs = tableTabs(setActiveForm);

    const initialTabIndex = (() => {
        if (!form) return 0;
        const foundIndex = tabs.findIndex(tab =>
            tab.label.toLowerCase().includes(form.toLowerCase())
        );
        return foundIndex !== -1 ? foundIndex : 0;
    })();

    return (
        <div>
            <CarouselMenu tableTabs={tableTabs(setActiveForm)} initialIndex={initialTabIndex} />

            {activeForm && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setActiveForm(null)}
                >
                    <div
                        className="relative bg-white rounded-lg w-full max-w-2xl h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setActiveForm(null)}
                            className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl font-bold z-10"
                        >
                            &times;
                        </button>

                        {/* Scrollable Form Content */}
                        <div className="h-full overflow-y-auto">
                            {activeForm === 'transport' && <TransportationRequestPage />}
                            {activeForm === 'translation' && <TranslationServiceRequestPage />}
                            {activeForm === 'sanitation' && <SanitationRequestPage />}
                            {activeForm === 'medical device' && <MedicalDeviceServiceRequestPage />}
                            {activeForm === 'maintenance' && <MaintenanceRequestPage />}
                            {/* Add other forms here as needed */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
