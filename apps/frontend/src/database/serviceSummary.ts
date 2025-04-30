import {ROUTES} from "common/src/constants.ts";
import axios from "axios";

export interface SummaryItem {
    label: string;
    count: number;
}

export interface incomingServiceSummary {
    statusSummary: SummaryItem[];
    prioritySummary: SummaryItem[];
}

export async function getServiceSummary() {
    return (await axios.get<incomingServiceSummary>(ROUTES.SERVICESUMMARY)).data;
}