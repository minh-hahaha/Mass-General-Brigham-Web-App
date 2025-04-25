import { ROUTES } from 'common/src/constants.ts';
import axios from 'axios';

export interface maintenanceRequest {
    // Maintenance Information
    maintenanceType: string;
    maintenanceDescription: string;

    // Maintenance Details
    priority: 'Low' | 'Medium' | 'High' | 'Emergency';
    maintenanceHospital: 'Chestnut Hill' | '20 Patriot Place' | '22 Patriot Place' | 'Faulkner Hospital'
    maintenanceLocation: string;
    maintenanceTime: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Canceled';

    // Requester Information
    employeeId: number;
    requestDate: string;
    employeeName: string;
    notes: string;
    locationId: number;
}

export interface incomingMaintenanceRequest {
    requestId: number;
    employeeId: number;
    requestDate: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Canceled';
    comments: string;
    priority: 'Low' | 'Medium' | 'High' | 'Emergency';
    locationId: number;
    serviceType: string;
    requestTime: number;
    employeeName: string;
    maintenanceRequest: {
        servMaintenanceId: number;
        maintenanceType: string;
        maintenanceDescription: string;
        maintenanceHospital: 'Chestnut Hill' | '20 Patriot Place' | '22 Patriot Place' | 'Faulkner Hospital'
        maintenanceLocation: string;
        maintenanceTime: string;
    }
}

// POST request to submit a new maintenance request
export async function SubmitMaintenanceRequest(request: maintenanceRequest) {
    await axios.post(ROUTES.MAINTENANCEREQUEST, request);
}

// GET request to fetch all maintenance requests
export async function GetMaintenanceRequest() {
    return (await axios.get<incomingMaintenanceRequest[]>(ROUTES.MAINTENANCEREQUEST)).data;
}