import { ROUTES } from 'common/src/constants';
import axios from 'axios';

export interface EdgeResponse {
    edgeId: number | null,
    from: string,
    to: string,
}

// GET request to fetch all Edges
export async function getEdges(fromFloor: string, fromBuilding: string) {
    return (await axios.get<EdgeResponse[]>(ROUTES.EDGE, { params: {fromFloor: fromFloor, fromBuilding: fromBuilding} })).data;
}

export async function createEdge(edgeResponse: EdgeResponse){
    return (await axios.post(ROUTES.EDGE, edgeResponse)).data;
}

export async function deleteEdge(id: string){
    const params = {
        params: {
            edgeId: id,
        }
    }
    return (await axios.delete(ROUTES.EDGE, params)).data;
}
