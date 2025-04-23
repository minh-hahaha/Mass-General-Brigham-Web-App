import {ROUTES} from "common/src/constants.ts";
import axios from "axios";

export interface RecentOrigin {
    location: string;
}

export async function GetRecentOrigins() {
    return (await axios.get<RecentOrigin[]>(ROUTES.RECENT_ORIGINS)).data;
}
