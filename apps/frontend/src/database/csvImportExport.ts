import { ROUTES } from 'common/src/constants';

import axios from 'axios';


export async function ImportCSV(request:FormData, overwrite:('Overwrite' | 'Update')) {
    try{
        await axios.post(ROUTES.DIRECTORY_CSV, request, { params: {overwrite: overwrite}, headers: {'Content-Type': 'multipart/form-data'} });
        console.log('Import CSV Successfully');
    } catch (error) {
        console.log("Error Importing CSV");
    }
}

export async function ImportJSON(request:FormData, overwrite:('Overwrite' | 'Update')) {
    try{
        await axios.post(ROUTES.DIRECTORY_JSON, request, { params: {overwrite: overwrite}, headers: {'Content-Type': 'multipart/form-data'} });
        console.log('Import JSON Successfully');
    } catch (error) {
        console.log("Error Importing JSON");
    }
}

export async function ExportCSV() {
    return (await axios.get(ROUTES.DIRECTORY_CSV)).data;
}

export async function ExportJSON() {
    return (await axios.get(ROUTES.DIRECTORY_JSON)).data;
}