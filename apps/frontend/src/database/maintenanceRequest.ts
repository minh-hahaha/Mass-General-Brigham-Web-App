import { ROUTES } from 'common/src/constants';
import axios from 'axios';

export interface maintenanceRequest {
    // Maintenance Information
    maintenanceType: string;
    maintenanceDescription: string;

    // Maintenance Details
    priority: 'Low' | 'Medium' | 'High' | 'Emergency';
    maintenanceHospital: string;
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
    status: string;
    comments: string;
    priority: string;
    locationId: number;
    serviceType: string;
    requestTime: number;
    maintenanceRequest: {
        servMaintenance_id: number;
        maintenance_type: string;
        maintenance_description: string;
        maintenance_hospital: string;
        maintenance_location: string;
        maintenance_time: string;
        employee_name: string;
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