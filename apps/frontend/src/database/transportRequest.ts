import { ROUTES } from 'common/src/constants';

import axios from 'axios';

interface transportRequest {
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

export interface transportForm {
    request: transportRequest;
}

export async function SubmitTransportRequest(request: transportForm) {
    await axios.post(ROUTES.PATIENTTRANSPORT, request);
}

export async function getTransportRequest(request: transportForm) {
    return (await axios.get<transportRequest>(ROUTES.PATIENTTRANSPORT)).data;
}