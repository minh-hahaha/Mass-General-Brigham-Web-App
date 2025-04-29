import {ROUTES} from "common/src/constants.ts";
import axios from "axios";
import {MedicalDeviceRequestData} from "@/routes/MedicalDeviceServiceRequestPage.tsx";
import {incomingRequest} from "@/database/transportRequest.ts";

export interface incomingMedicalDeviceRequest {
    comments: string;
    employeeId: number;
    employeeName: string;
    locationId: number;
    medicalDeviceRequest: {
        device: string;
        deviceReasoning: string;
        deviceSerialNumber: string;
        deviceModel: string;
        date: string;
        location: string;
        department: string;
    }
    priority: 'Low' | 'Medium' | 'High' | 'Emergency';
    requestDate: string;
    date: string;
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