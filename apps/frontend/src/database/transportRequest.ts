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
    }
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