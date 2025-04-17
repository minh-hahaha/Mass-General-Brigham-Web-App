import { ROUTES } from 'common/src/constants';
import axios from 'axios';

export interface EdgeResponse {
    id: number,
    from: string,
    to: string,
}

// GET request to fetch all maintenance requests
export async function getEdges() {
    return (await axios.get<EdgeResponse[]>(ROUTES.EDGE)).data;
}