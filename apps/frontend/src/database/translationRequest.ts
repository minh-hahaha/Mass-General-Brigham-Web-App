import {ROUTES} from "common/src/constants.ts";
import axios from "axios";
import {TranslationRequestData} from "@/routes/TranslationServiceRequestPage.tsx";

export interface incomingTranslationRequest {
    comments: string;
    employeeId: number;
    locationId: number;
    translationRequest: {
        language: string;
        patientName: string;
        typeMeeting: string;
        meetingLink: string;
    }
    priority: 'Low' | 'Medium' | 'High' | 'Emergency';
    requestDate: string;
    requestId: number;
    requestTime: number;
    serviceType: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}


export async function SubmitTranslatorRequest(request: TranslationRequestData) {
    await axios.post(ROUTES.TRANSLATIONREQUEST, request);
}

export async function GetTranslatorRequest() {
    return (await axios.get<incomingTranslationRequest[]>(ROUTES.TRANSLATIONREQUEST)).data;
}