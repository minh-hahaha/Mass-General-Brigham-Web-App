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
    const response = await axios.get<DepartmentRequest[]>(ROUTES.DIRECTORY, {
        // Defines sorting by deptId (0), and selecting all fields (5)
        params: { sortOptions: [0], filterOptions: [5]} //TODO: be able to use the enum on backend so it isn't hardcoded
    });
    return response.data;
}