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

export async function getServiceSummary(token: string): Promise<{ statusSummary: SummaryItem[], prioritySummary: SummaryItem[] }> {
    const res = await fetch(ROUTES.SERVICESUMMARY, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Failed to fetch service summary');
    return res.json();
}
