import { ROUTES } from 'common/src/constants.ts';
import axios from 'axios';
import { priorityType, statusType, hospitalTransportType } from '@/database/forms/formTypes.ts';

export interface transportRequest {
    employeeId: number;
    patientId: number;
    patientName: string;
    transportType: hospitalTransportType;
    priority: string;
    pickupLocation: string;
    dropoffLocation: string;
    notes: string;
    assignedToId: number;
    formattedDate: string;
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
        pickupLocation: string;
        dropoffLocation: string;
        servReqId: number;
        transportDate:  string;
        transportType: hospitalTransportType;
    };
    translationRequest: {
        patientId: number;
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
export async function EditTransportRequest(request: editTransportRequest) {
    await axios.post(ROUTES.EDITPATIENTTRANSPORT, request);
}

export async function GetTransportRequest() {
    return (await axios.get<incomingRequest[]>(ROUTES.PATIENTTRANSPORT)).data;
}