import { ROUTES } from 'common/src/constants';
import axios from 'axios';


export interface NodeResponse {
    id: string
    x: number,
    y: number,
    floor: string,
    buildingId: string,
    nodeType: string,
    name: string,
    roomNumber: string | null,
}



// GET request to fetch all maintenance requests
export async function getNodes() {
    return (await axios.get<NodeResponse[]>(ROUTES.NODE)).data;
}