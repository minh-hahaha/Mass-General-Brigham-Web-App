import express, { Router, Request, Response } from 'express';
import axios from "axios";

const router: Router = express.Router();

// Define known departments and hospitals
const departments = [
    "radiology", "cardiology", "ICU", "ER", "pharmacy", "orthopedics", "neurology", "oncology"
];
const hospitals = [
    "Brigham and Women's Hospital", "Mass General", "Foxborough Health Care Center", "Chestnut Hill Healthcare Center"
];

// Helper: Match entity by checking if input includes one of the names
const matchEntity = (input: string, list: string[]) =>
    list.find(entity => input.toLowerCase().includes(entity.toLowerCase()));

router.post("/", async (req, res) => {
    const { input } = req.body;

    const labels = [
        "create_request: sanitation",
        "create_request: maintenance",
        "create_request: patient transport",
        "create_request: medical device",
        "create_request: translation",
        "get_hospital_directions",
        "get_department_directions",
        "view_department_info"
    ];

    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
            {
                inputs: input,
                parameters: { candidate_labels: labels }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = response.data;
        const topLabel = data.labels?.[0];

        const [intent, requestType] = topLabel?.includes(":")
            ? topLabel.split(":").map((s: string) => s.trim())
            : [topLabel, undefined];

        // Extract possible named entities
        const matchedHospital = matchEntity(input, hospitals);
        const matchedDepartment = matchEntity(input, departments);

        // Build response
        const result: any = { intent };

        if (intent === "create_request") {
            result.requestType = requestType;
            result.location = matchedDepartment || undefined;
        }

        if (intent === "get_hospital_directions") {
            result.hospital = matchedHospital;
        }

        if (intent === "get_department_directions") {
            result.department = matchedDepartment;
        }

        if (intent === "view_department_info") {
            result.department = matchedDepartment;
        }

        res.json(result);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Classification failed." });
    }
});

export default router;
