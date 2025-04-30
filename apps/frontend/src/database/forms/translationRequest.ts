import {ROUTES} from "common/src/constants.ts";
import axios from "axios";
import {priorityType, statusType} from "@/database/forms/formTypes.ts";
import {incomingRequest} from "@/database/forms/transportRequest.ts";

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
        duration: number;
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
    return (await axios.get<incomingRequest[]>(ROUTES.TRANSLATIONREQUEST)).data;
}