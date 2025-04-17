import { ROUTES } from 'common/src/constants';
import {myNode} from "../../../backend/src/Algorithms/classes.ts";

import axios from 'axios';

export interface DepartmentRequest {
    deptId: number;
    deptServices: string;
    deptName: string;
    buildingId: number;
    deptPhone: string;
    building: { buildingName: string };
    locations: [{floor: number}];
}

export interface DirectoryRequestName {
    deptName: string;
}

export interface DirectoryRequestByBuilding {
    deptId: number;
    deptServices: string;
    deptName: string;
    buildingId: number;
    deptPhone: string;
    nodeId: string;

}

const params = {
    params: {
        buildingId: 1,
    }
}
export async function GetDirectory(nameSort: string, bldgSort: string, floorSort: string): Promise<DepartmentRequest[]> {
    // TEMP
    const nameOption = nameSort === 'Ascending' ? 0 : 1;
    const bldgOption = bldgSort === 'Ascending' ? 2 : 3;
    const floorOption = bldgSort === 'Ascending' ? 4 : 5;
    const response = await axios.get<DepartmentRequest[]>(ROUTES.DIRECTORY, {
        // Defines sorting by deptId (0), and selecting all fields (5)
        params: { sortOptions: [nameOption], filterOptions: [5]} //TODO: be able to use the enum on backend so it isn't hardcoded
    });
    return response.data;
}

export async function getDirectoryNames(): Promise<DirectoryRequestName[]> {
    const response = await axios.get<DirectoryRequestName[]>(ROUTES.DIRECTORY_NAMES);
    return response.data;
}

export async function getDirectory(bID: number): Promise<DirectoryRequestByBuilding[]> {
    const params = {
        params: {
            buildingFilter: bID,
        }
    }
    const response = await axios.get<DirectoryRequestByBuilding[]>(ROUTES.DIRECTORY_BUILDING, params)
    return response.data;

};


