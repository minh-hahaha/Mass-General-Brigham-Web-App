import { ROUTES } from 'common/src/constants';
import axios from 'axios';
import { node } from 'prop-types';


export interface NodeResponse {
    nodeId: string
    x: number,
    y: number,
    floor: string,
    buildingId: string,
    nodeType: string,
    name: string,
    roomNumber: string | null,
}



// GET request to fetch all Nodes
export async function getNodes() {
    return (await axios.get<NodeResponse[]>(ROUTES.NODE)).data;
}

export async function createNode(nodeResponse: NodeResponse): Promise<NodeResponse> {
    return (await axios.post<NodeResponse>(ROUTES.NODE, nodeResponse)).data;
}

export async function deleteNode(id: string): Promise<void> {
    const params = {
        params: {
            nodeId: id,
        }
    }
    return (await axios.delete(ROUTES.NODE, params)).data;
}

