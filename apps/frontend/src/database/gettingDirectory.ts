import { ROUTES } from 'common/src/constants';

import axios from 'axios';

export interface DepartmentRequest {
    deptId: number;
    deptServices: string;
    deptName: string;
    buildingId: number;
    deptPhone: string;
    // node: {
    //     nodeId: number;
    //     xcoord: number;
    //     ycoord: number;
    // }
}

export interface DirectoryRequestName {
    deptName: string;
}
export async function GetDirectory(): Promise<DepartmentRequest[]> {
    const response = await axios.get<DepartmentRequest[]>(ROUTES.DIRECTORY);
    return response.data;
}

export async function getDirectoryNames(): Promise<DirectoryRequestName[]> {
    const response = await axios.get<DirectoryRequestName[]>(ROUTES.DIRECTORY_NAMES);
    return response.data;
}