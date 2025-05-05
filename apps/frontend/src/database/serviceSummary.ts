import {ROUTES} from "common/src/constants.ts";
import axios from "axios";
import { incomingServiceRequest } from '@/database/serviceRequest.ts';
// accounts
export interface Department {
    deptId: number;
    deptServices: string | null;
    deptName: string;
    buildingId: number;
    deptPhone: string | null;
    nodeId: string | null;
}

export interface ServiceRequest {
    requestId: number;
    requesterDepartmentId: string | null;
    requesterRoomNumber: string | null;
    assignedId: number | null;
    employeeId: number | null;
    employeeName: string | null;
    requestDate: string;
    requestTime: string;
    status: string;
    comments: string | null;
    priority: string;
    serviceType: string;
    hospital: string | null;
}

export interface incomingAccount {
    employeeId: number;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    position: string;
    dateHired: string;
    serviceRequest: ServiceRequest[];
    email: string;
    password: string;
    department: Department;
    departmentId: number | null;
    admin: boolean;
}

// service request charts
export interface SummaryItem {
    label: string;
    count: number;
}

export async function getSummary(email: string): Promise<{
    employee: incomingAccount,
    statusSummary: SummaryItem[],
    prioritySummary: SummaryItem[],
    serviceTypeSummary: SummaryItem[],
}> {
    const res = await fetch(`${ROUTES.SERVICESUMMARY}?email=${encodeURIComponent(email)}`, {
        method: 'GET',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch service summary');
    }

    return res.json();
}

export function summarizeByKey(
    data: ServiceRequest[],
    key: 'status' | 'priority' | 'serviceType'
): SummaryItem[] {
    const summaryMap: Record<string, number> = {};

    for (const item of data) {
        const value = item[key] ?? "Unknown";
        summaryMap[value] = (summaryMap[value] || 0) + 1;
    }

    return Object.entries(summaryMap).map(([label, count]) => ({ label, count }));
}


export async function getAllServiceRequests() {
    return (await axios.get<ServiceRequest[]>(ROUTES.SERVICEREQUESTS)).data;
}