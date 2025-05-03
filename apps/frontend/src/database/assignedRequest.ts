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
    requestDate?: string; // ISO string format (e.g., "2025-04-16T00:00:00Z")
    requestTime?: string;
}

// GET request to fetch all assigned requests from employee
export async function getAssignedRequests(getToken: () => Promise<string>): Promise<incomingAssignedRequest[]> {
    const token = await getToken(); // this calls getAccessTokenSilently

    const res = await fetch(ROUTES.SERVICESUMMARY, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Failed to fetch service summary');
    return res.json();
}
