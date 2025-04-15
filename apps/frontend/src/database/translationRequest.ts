import {ROUTES} from "common/src/constants.ts";
import axios from "axios";
import {TranslationRequestData} from "@/routes/TranslationServiceRequestPage.tsx";

export interface incomingRequest {
    comments: string;
    employee_id: number;
    location_id: number;
    patientTransport: {
        patient_id: number;
        patient_name: string;
        pickup_location: string;
        servReq_id: number;
    }
    priority: 'Low' | 'Medium' | 'High';
    request_date: string;
    request_id: number;
    request_time: number;
    service_type: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
    transport_type: string;
}


export async function SubmitTranslatorRequest(request: TranslationRequestData) {
    await axios.post(ROUTES.TRANSLATIONREQUEST, request);
}

export async function GetTranslatorRequest(request: TranslationRequestData) {
    return (await axios.get<incomingRequest[]>(ROUTES.TRANSLATIONREQUEST)).data;
}