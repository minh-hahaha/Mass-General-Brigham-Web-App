import { ROUTES } from 'common/src/constants.ts';

import axios from 'axios';

export interface sanitationRequest {
    //Service Request fields
    employeeName:              string;
    status:                     'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
    priority:                   'Low' | 'Medium' | 'High';
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
    recurring:                  boolean;
    hazardLevel:                'None' | 'Sharp' | 'Biohazard';
    disposalRequired:           boolean;
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
        hazardLevel:         'None' | 'Sharp' | 'Biohazard';
        disposalRequired:    boolean;
        completeBy:          string;
    }
    priority: 'Low' | 'Medium' | 'High';
    requestDate: string;
    requestId: number;
    requestTime: number;
    serviceType: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
    transportType: string;
}

export async function SubmitSanitationRequest(request: sanitationRequest) {
    await axios.post(ROUTES.SANITATION, request);
}

export async function GetSanitationRequest() {
    return (await axios.get<incomingSanitationRequest[]>(ROUTES.SANITATION)).data;
}