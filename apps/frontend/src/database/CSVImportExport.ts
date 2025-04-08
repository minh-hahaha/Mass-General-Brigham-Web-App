import { ROUTES } from 'common/src/constants';

import axios from 'axios';


export async function ImportCSV(request:FormData) {
    try{
        await axios.post(ROUTES.DIRECTORY_CSV, request);
        console.log('Import CSV Successfully');
    } catch (error) {
        console.log("Error Importing CSV");
    }
}

export async function ExportCSV() {
    return (await axios.get(ROUTES.DIRECTORY)).data;
}