import { ROUTES } from 'common/src/constants';
import axios from 'axios';

export interface EdgeResponse {
    edgeId: number | null,
    from: string,
    to: string,
}

// GET request to fetch all Edges
export async function getEdges() {
    return (await axios.get<EdgeResponse[]>(ROUTES.EDGE)).data;
}

export async function createEdge(edgeResponse: EdgeResponse){
    return (await axios.post(ROUTES.EDGE, edgeResponse)).data;
}

export async function deleteEdge(id: string){
    return (await axios.delete(ROUTES.EDGE)).data;
}
