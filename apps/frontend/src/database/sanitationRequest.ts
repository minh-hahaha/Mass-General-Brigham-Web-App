import { ROUTES } from 'common/src/constants';

import axios from 'axios';

export interface sanitationRequest {
    //Service Request fields
    employee_name:              string;
    status:                     'Unassigned' | 'Assigned' | 'Working' | 'Other';
    priority:                   'Unassigned' | 'Low' | 'Medium' | 'High' | 'Emergency';
    request_time:                string;
    location_id:                 string;


    //Optional fields
    comments:                   string;
    request_date:                string;
    employee_id:                 number;
    requester_department:         string;
    requester_roomnum: string;


    //Sanitation fields
    sanitation_location_id:     string;
    sanitation_department_id:   string;
    sanitation_roomNumber:      number;
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
        hazardLevel:         string
        disposalRequired:    boolean;
        completeBy:          number;
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