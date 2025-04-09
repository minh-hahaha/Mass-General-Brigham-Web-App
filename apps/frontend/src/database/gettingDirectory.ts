import { ROUTES } from 'common/src/constants';

import axios from 'axios';

export interface DepartmentRequest {
    dep_id: number;
    dep_services: string;
    dep_name: string;
    building_id: number;
    dep_phone: string;
}

export async function GetDirectory() {
    return (await axios.get<DepartmentRequest>(ROUTES.DIRECTORY)).data;
}