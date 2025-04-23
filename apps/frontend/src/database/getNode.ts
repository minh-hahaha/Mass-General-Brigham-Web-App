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
export async function getNodes(fromFloor: string, fromBuilding: string) {
    return (await axios.get<NodeResponse[]>(ROUTES.NODE, { params: {fromFloor: fromFloor, fromBuilding: fromBuilding} })).data;
}

export async function createNode(nodeResponse: NodeResponse[], overwrite: boolean, overwriteFloor: string, overwriteBuilding: string): Promise<NodeResponse> {
    return (await axios.post<NodeResponse>(ROUTES.NODE, nodeResponse, { params: {overwrite: overwrite, overwriteFloor: overwriteFloor, overwriteBuilding: overwriteBuilding} })).data;
}


export async function deleteNode(id: string): Promise<void> {
    const params = {
        params: {
            nodeId: id,
        }
    }
    return (await axios.delete(ROUTES.NODE, params)).data;
}

