import { ROUTES } from 'common/src/constants';

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
    requestDateTime?: string; // ISO string format (e.g., "2025-04-16T00:00:00Z")
}

// GET request to fetch all assigned requests from employee
export async function getAssignedRequests(email: string): Promise<incomingAssignedRequest[]> {
    const res = await fetch(`${ROUTES.ASSIGNEDREQUESTS}?email=${encodeURIComponent(email)}`, {
        method: 'GET',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch assigned requests');
    }

    return res.json();
}
