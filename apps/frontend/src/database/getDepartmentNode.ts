import {ROUTES} from "common/src/constants.ts";
import axios from 'axios';

import {myNode} from "../../../backend/src/Algorithms/classes.ts";

export async function getDepartmentNode(): Promise<myNode> {
    const response = await axios.get<myNode>(ROUTES.DIRECTORY_NODE);
    return response.data;
}