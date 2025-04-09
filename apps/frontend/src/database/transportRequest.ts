import { ROUTES } from 'common/src/constants';

import axios from 'axios';

export interface transportRequest {
    patientId: number;
    patientName: string;
    transportType: 'Ambulance' | 'Helicopter' | 'Other';
    priority: 'Low' | 'Medium' | 'High';
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

export interface incomingRequest {
    comments: string;
    employee_id: number;
    location_id: number;
    patientTransport: {
        patient_id: number;
        patient_name: string;
        pickup_location: string;
        servReq_id: number;
    }
    priority: 'Low' | 'Medium' | 'High';
    request_date: string;
    request_id: number;
    request_time: number;
    service_type: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
    transport_type: string;
}


export async function SubmitTransportRequest(request: transportRequest) {
    await axios.post(ROUTES.PATIENTTRANSPORT, request);
}

export async function GetTransportRequest() {
    return (await axios.get<incomingRequest[]>(ROUTES.PATIENTTRANSPORT)).data;
}