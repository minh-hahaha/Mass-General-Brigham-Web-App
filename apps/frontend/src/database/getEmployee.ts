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

//TODO: ADD INTERFACE??
export async function getEmployeeEmail(emailFilter: string) {
    return (await axios.get(ROUTES.EMPLOYEE, { params: {emailFilter} })).data;
}

export async function getEmployee(){
    return (await axios.get<employeeResponse[]>(ROUTES.EMPLOYEE)).data;
}