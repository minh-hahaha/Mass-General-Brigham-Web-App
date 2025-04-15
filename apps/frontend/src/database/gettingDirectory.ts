import { ROUTES } from 'common/src/constants';

import axios from 'axios';

export interface DepartmentRequest {
    dep_id: number;
    dep_services: string;
    dep_name: string;
    building_id: number;
    dep_phone: string;
}

// export interface DirectoryNodeResponse {
//     dep_id: number;
//     dep_services: string;
//     dep_name: string;
//     building_id: number;
//     dep_phone: string;
// }

export async function GetDirectory(): Promise<DepartmentRequest[]> {
    const response = await axios.get<DepartmentRequest[]>(ROUTES.DIRECTORY);
    return response.data;
}

// export async function getDirectoryNode() Promise<DirectoryNodeResponse> {
//     const response = await axios.get<DirectoryNodeResponse>(ROUTES.DIRECTORY);
// }