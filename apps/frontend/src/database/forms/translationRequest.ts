import {ROUTES} from "common/src/constants.ts";
import axios from "axios";
import {priorityType, statusType} from "@/database/forms/formTypes.ts";
// import {TranslationRequestData} from "@/components/forms/TranslationServiceRequestPage.tsx";

export interface outgoingTranslationRequest {
    comments: string;
    employeeName: string;
    employeeId: number;
    language: string;
    patientId: number;
    typeMeeting: string;
    meetingLink: string;
    department: string;
    location: string;
    priority: priorityType;
    duration: number;
    date: string;
    notes: string;
}


export interface incomingTranslationRequest {
    comments: string;
    employeeId: number;
    locationId: number;
    translationRequest: {
        language: string;
        patientName: string;
        typeMeeting: string;
        meetingLink: string;
        department: string;
        location: string;
        patientId: number;
    }
    priority: priorityType;
    requestDateTime: string;
    requestId: number;
    serviceType: string;
    status: statusType;
}


export async function SubmitTranslatorRequest(request: outgoingTranslationRequest) {
    await axios.post(ROUTES.TRANSLATIONREQUEST, request);
}

export async function GetTranslatorRequest() {
    return (await axios.get<incomingTranslationRequest[]>(ROUTES.TRANSLATIONREQUEST)).data;
}