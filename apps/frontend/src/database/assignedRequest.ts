import { ROUTES } from 'common/src/constants';
import axios from 'axios';

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
export async function getAssignedRequests(employeeId: number) {
    return (await axios.get<incomingAssignedRequest[]>(ROUTES.ASSIGNED)).data;
}
