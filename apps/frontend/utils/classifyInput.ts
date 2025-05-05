import axios from "axios";

export const classifyInput = async (input: string): Promise<{
    intent: "create_request" | "get_hospital_directions" | "get_department_directions" | "view_department_info" | "view_about_info" | "unknown";
    requestType?: string;
    location?: string;
    hospital?: string;
    department?: string;
}> => {
    try {
        const response = await axios.post("/api/classify", { input });
        return response.data;
    } catch (error) {
        console.error("Groq classifyInput failed:", error);
        return { intent: "unknown" };
    }
};
