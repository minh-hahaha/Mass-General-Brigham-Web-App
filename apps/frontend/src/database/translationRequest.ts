import {ROUTES} from "common/src/constants.ts";
import axios from "axios";
import {incomingRequest} from "@/database/forms/transportRequest.ts";
import {outgoingTranslationRequest} from "@/database/forms/translationRequest.ts";

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
    }
    priority: 'Low' | 'Medium' | 'High' | 'Emergency';
    requestDate: string;
    requestId: number;
    requestTime: number;
    serviceType: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface editTranslatorRequest {
    translatorRequest: outgoingTranslationRequest;
    requestId: number;
}


export async function SubmitTranslatorRequest(request: outgoingTranslationRequest) {
    await axios.post(ROUTES.TRANSLATIONREQUEST, request);
}

export async function EditTranslatorRequest(request: editTranslatorRequest) {
    await axios.post(ROUTES.EDITTRANSLATIONREQUEST, request);
}

export async function GetTranslatorRequest() {
    return (await axios.get<incomingRequest[]>(ROUTES.TRANSLATIONREQUEST)).data;
}