import {ROUTES} from "common/src/constants.ts";
import axios from "axios";
import {TranslationRequestData} from "@/routes/TranslationServiceRequestPage.tsx";

export interface incomingRequest {
    comments: string;
    employeeId: number;
    locationId: number;
    patientTransport: {
        patientId: number;
        patientName: string;
        pickupLocation: string;
        servReqId: number;
    }
    priority: 'Low' | 'Medium' | 'High';
    requestDate: string;
    requestId: number;
    requestTime: number;
    serviceType: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
    transportType: string;
}


export async function SubmitTranslatorRequest(request: TranslationRequestData) {
    await axios.post(ROUTES.TRANSLATIONREQUEST, request);
}

export async function GetTranslatorRequest(request: TranslationRequestData) {
    return (await axios.get<incomingRequest[]>(ROUTES.TRANSLATIONREQUEST)).data;
}