import {ROUTES} from "common/src/constants.ts";
import axios from "axios";
import {MedicalDeviceRequestData} from "@/components/forms/MedicalDeviceServiceRequestPage.tsx";

export interface incomingMedicalDeviceRequest {
    comments: string;
    employeeId: number;
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

export async function SubmitMedicalDeviceRequest(request: MedicalDeviceRequestData) {
    await axios.post(ROUTES.MEDICALDEVICEREQUEST, request)
}

export async function GetMedicalDeviceRequest() {
    return (await axios.get<incomingMedicalDeviceRequest[]>(ROUTES.MEDICALDEVICEREQUEST)).data;
}