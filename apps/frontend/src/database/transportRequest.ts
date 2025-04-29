import { ROUTES } from 'common/src/constants';

import axios from 'axios';

export interface transportRequest {
    patientId: number;
    patientName: string;
    transportType: 'Ambulance' | 'Helicopter' | 'Medical Van' | 'Other';
    priority: 'Low' | 'Medium' | 'High' | 'Emergency';
    pickupLocation: string;
    dropOffLocation: string;
    pickupDate: string;
    pickupTime: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
    notes: string;
    requesterId: number;
    requestDate: string;
    assignedToId: number;
}

export interface editTransportRequest {
    transportRequest: transportRequest;
    requestId: number;
}

export interface incomingRequest {
    comments: string;
    employeeId: number;
    locationId: number;
    patientTransport: {
        patientId: number;
        patientName: string;
        pickupLocation: string;
        servReqId: number;
        transportType: 'Ambulance' | 'Helicopter' | 'Medical Van' | 'Other';
    },
    translationRequest: {
        language: string;
        patientName: string;
        typeMeeting: string;
        meetingLink: string;
        department: string;
        location: string;
    },
    sanitation: {
        servReqId:          number;
        sanitationType:      string;
        recurring:           boolean;
        hazardLevel:         'None' | 'Sharp' | 'Biohazard';
        disposalRequired:    boolean;
        completeBy:          string;
    },
    medicalDeviceRequest: {
        device: string;
        deviceReasoning: string;
        deviceSerialNumber: string;
        deviceModel: string;
        date: string;
        location: string;
        department: string;
    },
    maintenanceRequest: {
        servMaintenanceId: number;
        maintenanceType: string;
        maintenanceDescription: string;
        maintenanceHospital: 'Chestnut Hill' | '20 Patriot Place' | '22 Patriot Place' | 'Faulkner Hospital'
        maintenanceLocation: string;
        maintenanceTime: string;
        employeeName: string;
    },
    priority: 'Low' | 'Medium' | 'High' | 'Emergency';
    requestDate: string;
    requestId: number;
    requestTime: number;
    serviceType: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}


export async function SubmitTransportRequest(request: transportRequest) {
    await axios.post(ROUTES.PATIENTTRANSPORT, request);
}
export async function EditTransportRequest(request: editTransportRequest) {
    await axios.post(ROUTES.EDITPATIENTTRANSPORT, request);
}

export async function GetTransportRequest() {
    return (await axios.get<incomingRequest[]>(ROUTES.PATIENTTRANSPORT)).data;
}