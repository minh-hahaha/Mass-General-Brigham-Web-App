import { ROUTES } from 'common/src/constants';

import axios from 'axios';


export async function ImportCSV(route: string, request:FormData, overwrite:('Overwrite' | 'Update')) {
    try{
        await axios.post(route, request, { params: {overwrite: overwrite}, headers: {'Content-Type': 'multipart/form-data'} });
        console.log('Import CSV Successfully');
    } catch (error) {
        console.log("Error Importing CSV");
    }
}

export async function ImportJSON(route: string, request:FormData, overwrite:('Overwrite' | 'Update')) {
    try{
        await axios.post(route, request, { params: {overwrite: overwrite}, headers: {'Content-Type': 'multipart/form-data'} });
        console.log('Import JSON Successfully');
    } catch (error) {
        console.log("Error Importing JSON");
    }
}

export async function ExportCSV(route: string) {
    return (await axios.get(route)).data;
}

export async function ExportJSON(route: string) {
    return (await axios.get(route)).data;
}