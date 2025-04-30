import {ROUTES} from "common/src/constants.ts";
import axios from "axios";

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
}

export interface incomingAccount {
    employeeId: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    position: string;
    dateHired: string;
    serviceRequest: ServiceRequest[];
    email: string;
    password: string;
    department: Department | null;
    departmentId: number | null;
    admin: boolean;
}

// get employee that is logged in right now
export async function getAccount() {
    return (await axios.get<incomingAccount>(ROUTES.LOGGEDIN)).data;
}