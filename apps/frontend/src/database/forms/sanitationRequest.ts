import { ROUTES } from 'common/src/constants.ts';
import axios from 'axios';
import { priorityType, hazardLevelType, statusType } from '@/database/forms/formTypes.ts';
import {incomingRequest} from "@/database/forms/transportRequest.ts";

export interface sanitationRequest {
    //Service Request fields
    employeeName:              string;
    priority:                   priorityType;
    requestTime:                string;
    locationId:                 string;

    //Optional fields
    comments:                   string;
    requestDate:                string;
    employeeId:                 number;
    requesterDepartmentId:         string;
    requesterRoomNumber: string;

    //Sanitation fields
    sanitationLocationId:     string;
    sanitationDepartmentId:   string;
    sanitationRoomNumber:      number;
    sanitationType:             string;
    hazardLevel:                hazardLevelType;
    completeBy:                 string;
}

export interface incomingSanitationRequest {
    comments: string;
    employeeId: number;
    locationId: number;
    sanitation: {
        servReqId:          number;
        sanitationType:      string;
        recurring:           boolean;
        hazardLevel:         hazardLevelType;
        disposalRequired:    boolean;
        completeBy:          string;
    }
    priority: priorityType;
    requestDate: string;
    requestId: number;
    requestTime: number;
    serviceType: string;
    status: statusType;
    transportType: string;
}

export interface editSanitationRequest {
    sanitationRequest: sanitationRequest;
    requestId: number;
}

export async function SubmitSanitationRequest(request: sanitationRequest) {
    await axios.post(ROUTES.SANITATION, request);
}

export async function EditSanitationRequest(request: editSanitationRequest) {
    await axios.post(ROUTES.EDITSANITATION, request);
}

export async function GetSanitationRequest() {
    return (await axios.get<incomingRequest[]>(ROUTES.SANITATION)).data;
}