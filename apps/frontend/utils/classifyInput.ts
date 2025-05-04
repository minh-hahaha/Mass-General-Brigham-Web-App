import axios from "axios";
import { ROUTES } from 'common/src/constants';

export const classifyInput = async (input: string): Promise<{
    intent: "create_request" | "get_hospital_directions" | "get_department_directions" | "view_department_info" | "unknown";
    requestType?: string;
    location?: string;
    hospital?: string;
    department?: string;
}> => {
    try {
        const response = await axios.post(ROUTES.CLASSIFY, { input });
        return response.data;
    } catch (error) {
        console.error("Classification request failed:", error);
        return { intent: "unknown" };
    }
};
