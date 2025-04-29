import { ROUTES } from 'common/src/constants.ts';
import axios from 'axios';
import {mgbHospitalType, priorityType, statusType} from "@/database/forms/formTypes.ts";

export interface maintenanceRequest {

    //employee id
    employeeId: number;

    // Maintenance Information
    maintenanceType: string;
    maintenanceDescription: string;

    // Maintenance Details
    priority: priorityType;
    maintenanceHospital: mgbHospitalType;
    maintenanceTime: string;

    // Requester Information
    notes: string;
    locationId: number;
}

export interface incomingMaintenanceRequest {
    requestId: number;
    employeeId: number;
    requestDate: string;
    status: statusType;
    comments: string;
    priority: priorityType;
    locationId: number;
    serviceType: string;
    requestTime: number;
    employeeName: string;
    maintenanceRequest: {
        servMaintenanceId: number;
        maintenanceType: string;
        maintenanceHospital: mgbHospitalType
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