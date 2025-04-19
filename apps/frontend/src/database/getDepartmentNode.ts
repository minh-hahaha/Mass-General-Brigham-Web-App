import {ROUTES} from "common/src/constants.ts";
import axios from 'axios';


import {myNode} from "common/src/classes/classes.ts";


export async function GetNode(nodeId: string): Promise<myNode> {
    const params = {
        params: {
            nodeId: nodeId,
        }
    }
    const response = await axios.get<myNode>(ROUTES.DIRECTORY_NODE, params)
    return response.data;
}
