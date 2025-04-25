import { ROUTES } from 'common/src/constants';
import axios from 'axios';

export interface DepartmentRequest {
    deptId: number;
    deptServices: string;
    deptName: string;
    buildingId: number;
    deptPhone: string;
    building: { buildingName: string };
    node: { floor: string };
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
    },
};

export async function GetDirectory(
    nameSort: string,
    bldgSort: string,
    buildingFilter: string
): Promise<DepartmentRequest[]> {
    // TEMP
    const sortOptions = [];
    if (bldgSort !== '') {
        sortOptions.push(bldgSort === 'Ascending' ? 4 : 5);
    }
    if (nameSort !== '') {
        sortOptions.push(nameSort === 'Ascending' ? 0 : 1);
    }
    let buildingOption = undefined;
    switch (buildingFilter) {
        case 'Chestnut Hill':
            buildingOption = 0;
            break;
        case '20 Patriot Place':
            buildingOption = 1;
            break;
        case '22 Patriot Place':
            buildingOption = 2;
            break;
        case 'Patriot Place':
            buildingOption = 3;
            break;
        case 'Faulkner Hospital':
            buildingOption = 4;
            break;
    }
    const response = await axios.get<DepartmentRequest[]>(ROUTES.DIRECTORY, {
        params: {
            sortOptions: sortOptions,
            filterOptions: buildingOption !== undefined ? [buildingOption] : [],
        }, //TODO: be able to use the enum on backend so it isn't hardcoded
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
            sortBy: 'deptName',
            orderBy: 'asc',
        },
    };
    const response = await axios.get<DirectoryRequestByBuilding[]>(
        ROUTES.DIRECTORY_BUILDING,
        params
    );

    return response.data.sort((a, b) => a.deptName.localeCompare(b.deptName));
}
