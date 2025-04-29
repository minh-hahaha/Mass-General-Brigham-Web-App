import { ROUTES } from 'common/src/constants';
import axios from 'axios';

export interface assignedRequest {
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

export interface incomingAssignedRequest {
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
    requestDate?: string; // ISO string format (e.g., "2025-04-16T00:00:00Z")
    requestTime?: string;
}

// GET request to fetch all assigned requests from employee
export async function getAssignedRequests() {
    return (await axios.get<incomingAssignedRequest[]>(ROUTES.ASSIGNED)).data;
}
