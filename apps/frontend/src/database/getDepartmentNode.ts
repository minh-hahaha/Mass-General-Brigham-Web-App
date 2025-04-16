import {ROUTES} from "common/src/constants.ts";
import axios from 'axios';

import {myNode} from "../../../backend/src/Algorithms/classes.ts";

interface DepartmentNode {
    deptId: number;
    deptServices: string;
    deptName: string;
    buildingId: number;
    deptPhone: string;
    node: {
        nodeId: number;
        x: number;
        y: number;
        floor: string;
        nodeType: string;
        buildingId: string;
        name: string;
        roomNumber: string | null;
    }
}

export async function getDepartmentNode(): Promise<DepartmentNode> {
    const response = await axios.get<DepartmentNode>(ROUTES.DIRECTORY_NODE);
    return response.data;
}