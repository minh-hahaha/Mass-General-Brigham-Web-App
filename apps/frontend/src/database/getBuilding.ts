import axios from 'axios';
import { ROUTES } from 'common/src/constants';


export async function getBuilding() {
    return (await axios.get(ROUTES.BUILDING)).data;
}


export async function getNotBuilding(buildingName: string){
    return (await axios.get(ROUTES.BUILDING, {params: {buildingName: buildingName}})).data;
}

