import { useState, useEffect } from 'react';
import CarouselMenu from '@/components/CarouselMenu.tsx';

import TransportationRequestPage from '@/components/forms/TransportationRequestPage.tsx';
import TableAllRequest from '@/components/tables/TableServiceRequest.tsx';
import TableMaintenanceRequest from '@/components/tables/TableMaintenanceRequest.tsx';
import TableSanitationRequest from '@/components/tables/TableSanitationRequest.tsx';
import TableTransportRequest from '@/components/tables/TableTransportRequest.tsx';
import TableMedicalDeviceRequest from '@/components/tables/TableMedicalDeviceRequest.tsx';
import SanitationRequestPage from '@/components/forms/SanitationRequestComponent.tsx';
import MedicalDeviceServiceRequestPage from '@/components/forms/MedicalDeviceServiceRequestPage.tsx';
import MaintenanceRequestPage from '@/components/forms/MaintenanceRequestPage.tsx';
import TableTranslatorRequest from "@/components/tables/TableTranslatorRequest.tsx";
import TranslationServiceRequestPage from "@/components/forms/TranslationServiceRequestPage.tsx";
import {incomingRequest} from "@/database/forms/transportRequest.ts";
import { useLocation } from "react-router-dom";
// ...other imports...


const tableTabs = (setActiveForm: (type: FormType) => void, setEditData: (data: incomingRequest) => void) => [
    { label: 'All', component: () => <TableAllRequest setActiveForm={setActiveForm} /> },
    {
        label: 'Transport',
        component: () => <TableTransportRequest setActiveForm={setActiveForm} setEditData={setEditData} />,
    },
    {
        label: 'Translation',
        component: () => <TableTranslatorRequest setActiveForm={setActiveForm} setEditData={setEditData} />,
    },
    {
        label: 'Sanitation',
        component: () => <TableSanitationRequest setActiveForm={setActiveForm} setEditData={setEditData} />,
    },
    {
        label: 'Medical Device',
        component: () => <TableMedicalDeviceRequest setActiveForm={setActiveForm} setEditData={setEditData} />,
    },
    {
        label: 'Maintenance',
        component: () => <TableMaintenanceRequest setActiveForm={setActiveForm} setEditData={setEditData} />,
    },
];



type FormType =
    | 'transport'
    | 'translation'
    | 'maintenance'
    | 'medical device'
    | 'sanitation'
    | null;

export interface RequestPageProps {
    editData: incomingRequest | undefined;
}

export default function RequestTablesCarousel() {
    const location = useLocation();
    const [activeForm, setActiveForm] = useState<FormType>(null);
    const [editData, setEditData] = useState<incomingRequest | undefined>();
    const searchParams = new URLSearchParams(window.location.search);
    const form = searchParams.get('form');
    const tabs = tableTabs(setActiveForm, setEditData);

    const initialTabIndex = (() => {
        if (!form) return 0;
        const foundIndex = tabs.findIndex(tab =>
            tab.label.toLowerCase().includes(form.toLowerCase())
        );
        return foundIndex !== -1 ? foundIndex : 0;
    })();

    //intent from groq
    const intentForm = location.state?.requestType as FormType | undefined;

    useEffect(() => {
        if (intentForm) {
            setActiveForm(intentForm);
        }
    }, [intentForm]);

    return (
        <div className="bg-gray-200">
            <CarouselMenu tableTabs={tableTabs(setActiveForm, setEditData)} initialIndex={initialTabIndex} />

            {activeForm && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => {setActiveForm(null);}}
                >
                    <div
                        className="relative bg-white rounded-lg w-full max-w-2xl h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => {setActiveForm(null); setEditData(undefined)}}
                            className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl font-bold z-10"
                        >
                            &times;
                        </button>

                        {/* Scrollable Form Content */}
                        <div className="h-full overflow-y-auto">
                            {activeForm === 'transport' && <TransportationRequestPage editData={editData} />}
                            {activeForm === 'translation' && <TranslationServiceRequestPage editData={editData} />}
                            {activeForm === 'sanitation' && <SanitationRequestPage editData={editData} />}
                            {activeForm === 'medical device' && <MedicalDeviceServiceRequestPage editData={editData} />}
                            {activeForm === 'maintenance' && <MaintenanceRequestPage editData={editData} />}
                            {/* Add other forms here as needed */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
