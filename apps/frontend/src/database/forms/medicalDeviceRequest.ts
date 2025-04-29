import {ROUTES} from "common/src/constants.ts";
import axios from "axios";
import {MedicalDeviceRequestData} from "@/components/forms/MedicalDeviceServiceRequestPage.tsx";
import {incomingRequest} from "@/database/forms/transportRequest.ts";

export interface incomingMedicalDeviceRequest {
    comments: string;
    employeeId: number;
    locationId: number;
    medicalDeviceRequest: {
        device: string;
        date: string;
        location: string;
        deliverDate: string;
    }
    priority: 'Low' | 'Medium' | 'High' | 'Emergency';
    requestDate: string;
    completeByDate: string;
    requestId: number;
    requestTime: number;
    serviceType: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface editMedicalDeviceRequest {
    medicalDeviceRequest: MedicalDeviceRequestData;
    requestId: number;
}

export async function SubmitMedicalDeviceRequest(request: MedicalDeviceRequestData) {
    await axios.post(ROUTES.MEDICALDEVICEREQUEST, request)
}

export async function EditMedicalDeviceRequest(request: editMedicalDeviceRequest) {
    await axios.post(ROUTES.EDITMEDICALDEVICEREQUEST, request)
}

export async function GetMedicalDeviceRequest() {
    return (await axios.get<incomingRequest[]>(ROUTES.MEDICALDEVICEREQUEST)).data;
}