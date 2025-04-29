import { ROUTES } from 'common/src/constants';
import axios from 'axios';

export interface employeeResponse {
    employeeId: number,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    departmentId: number,
    buildingId: number,
    floor: string,
    roomNumber: string,
}


export interface employeeNameId {
    employeeId: number,
    employeeName: string,
}

//TODO: ADD INTERFACE??
export async function getEmployeeEmail(emailFilter: string) {
    return (await axios.get(ROUTES.EMPLOYEE_EMAIL, { params: {emailFilter} })).data;
}

export async function getEmployee(){
    return (await axios.get<employeeResponse[]>(ROUTES.EMPLOYEE)).data;
}

export async function getEmployeeNames() {
    return (await axios.get<string[]>(ROUTES.EMPLOYEE_NAMES)).data;
}

export async function getEmployeeNameIds() {
    return (await axios.get<employeeNameId[]>(ROUTES.EMPLOYEE_NAME_ID)).data;
}