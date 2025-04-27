import { ROUTES } from 'common/src/constants.ts';
import axios from 'axios';
import { priorityType, statusType, hospitalTransportType } from '@/database/forms/formTypes.ts';

export interface transportRequest {
    patientId: number;
    patientName: string;
    transportType: hospitalTransportType;
    priority: priorityType;
    pickupLocation: string;
    dropOffLocation: string;
    pickupDate: string;
    pickupTime: string;
    notes: string;
    assignedToId: number;
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
        transportType: hospitalTransportType;
    };
    priority: priorityType;
    requestDate: string;
    requestId: number;
    requestTime: number;
    serviceType: string;
    status: statusType;
}


export async function SubmitTransportRequest(request: transportRequest) {
    await axios.post(ROUTES.PATIENTTRANSPORT, request);
}

export async function GetTransportRequest() {
    return (await axios.get<incomingRequest[]>(ROUTES.PATIENTTRANSPORT)).data;
}