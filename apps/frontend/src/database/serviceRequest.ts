import { ROUTES } from 'common/src/constants';
import axios from 'axios';

export interface serviceRequest {
    requestId: number;
    employeeId?: number;
    employeeName?: string;
    requesterDepartmentId?: string;
    requesterRoomNumber?: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Canceled';
    comments?: string;
    priority: 'Low' | 'Medium' | 'High' | 'Emergency';
    locationId?: number;
    serviceType: string;
    requestDate?: string; // ISO string format (e.g., "2025-04-16T00:00:00Z")
    requestTime?: string; // ISO string format (e.g., "2025-04-16T14:30:00Z")

}

export interface incomingServiceRequest {
    requestId: number;
    employeeId?: number;
    employeeName?: string;
    requesterDepartmentId?: string;
    requesterRoomNumber?: string;
    status: string;
    comments?: string;
    priority: string;
    locationId?: number;
    serviceType: string;
    // requestDate?: string; // ISO string format (e.g., "2025-04-16T00:00:00Z")
    // requestTime?: string;
    requestDateTime: string;
}

// POST request to submit a new maintenance request
export async function submitServiceRequest(request: serviceRequest) {
    await axios.post(ROUTES.SERVICEREQUESTS, request);
}

// GET request to fetch all maintenance requests
export async function getServiceRequest() {
    return (await axios.get<incomingServiceRequest[]>(ROUTES.SERVICEREQUESTS)).data;
}