import { ROUTES } from 'common/src/constants';

import axios from 'axios';

export interface DepartmentRequest {
    deptId: number;
    deptServices: string;
    deptName: string;
    buildingId: number;
    deptPhone: string;
}


export async function GetDirectory(): Promise<DepartmentRequest[]> {
    const response = await axios.get<DepartmentRequest[]>(ROUTES.DIRECTORY);
    return response.data;
}