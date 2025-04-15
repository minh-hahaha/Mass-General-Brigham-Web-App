import { ROUTES } from 'common/src/constants';

import axios from 'axios';

export interface sanitationRequest {
    //Service Request fields
    /*request_id:          number;*/
    status:              'Unassigned' | 'Assigned' | 'Working' | 'Other';
    priority:            'Unassigned' | 'Low' | 'Medium' | 'High' | 'Emergency';
    request_time:        string;

    //Optional fields
    location_id:         string;
    comments:            string;
    request_date:        string;
    employee_id:         number;

    //Sanitation fields
    sanitationType:      string;
    recurring:           boolean;
    hazardLevel:         'None' | 'Sharp' | 'Biohazard';
    disposalRequired:    boolean;
    completeBy:          string;
}

export interface incomingSanitationRequest {
    comments: string;
    employeeId: number;
    locationId: number;
    sanitation: {
        servReq_id:          number;
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