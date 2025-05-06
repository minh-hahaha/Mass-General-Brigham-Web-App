import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
    const { input } = req.body;

    const prompt = `
You are a hospital AI assistant. A user entered the following message:

"${input}"

Your job is to classify this input and extract structured routing information.

The hospital system includes the following known hospitals:
- "Foxborough" or "Patriots Place" → Foxborough Health Care Center
- "Chestnut Hill" → Chestnut Hill Healthcare Center
- "Faulkner" → Brigham and Women's Faulkner Hospital
- "Brigham", "Brigham and Women's", "Main Campus" or "Main" → Brigham and Women's Hospital

Classify the intent of this message and return a JSON object with:
- intent: one of ["create_request", "get_hospital_directions", "get_department_directions", "view_department_info", "view_about_info"]
- requestType: one of ["sanitation", "maintenance", "transport", "medical device", "translation"] — only if intent is "create_request"
- hospital: full name of the hospital mentioned (e.g. "Foxborough Health Care Center, Brigham and Women's Faulkner, etc.")
- department: department mentioned (e.g. "ICU", "radiology", etc.)
- location: any details like floor number or area, if mentioned

Here are the following intent definitions. Carefully study the text to determine which intent to pick: 
- "create_request" → The user wants to submit a request regarding a problem/situation they have input (e.g. maintenance, translation).
- "get_hospital_directions" → The user is asking how to get to a hospital.
- "get_department_directions" → The user is asking for directions to a department within a hospital.
- "view_department_info" → The user is asking about a department’s services, specialties, contact info, or general information (e.g., “what does urology do?”).
- "view_about_info" → The user asks about developers or how an app was created.

Respond with only valid JSON and no extra text.
`;

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama3-8b-8192',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You classify hospital-related user messages into intents for routing.',
                    },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.2,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_CLOUD_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const parsed = JSON.parse(response.data.choices[0].message.content);
        res.json(parsed);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Groq classification failed.' });
    }
});

export default router;
