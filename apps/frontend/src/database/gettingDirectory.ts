import { ROUTES } from 'common/src/constants';

import axios from 'axios';

export interface DepartmentRequest {
    dep_id: number;
    dep_services: string;
    dep_name: string;
    building_id: number;
    dep_phone: string;
}

export interface DirectoryRequestName {
    dep_name: string;
}
export async function GetDirectory(): Promise<DepartmentRequest[]> {
    const response = await axios.get<DepartmentRequest[]>(ROUTES.DIRECTORY);
    return response.data;
}

export async function getDirectoryNames(): Promise<DirectoryRequestName[]> {
    const response = await axios.get<DirectoryRequestName[]>(ROUTES.DIRECTORY_NAMES);
    return response.data;
}