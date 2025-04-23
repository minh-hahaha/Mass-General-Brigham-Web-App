import express, {json} from 'express';
import cors from 'cors';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 5001;

app.use(cors());
app.use(json());

const client = new TextToSpeechClient({
    keyFilename: './serviceKey.json', // path to your service account key
});

app.post('/api/tts', async (req, res) => {
    const { text } = req.body;

    const request = {
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
        audioConfig: { audioEncoding: 'MP3' }, // Specify MP3 encoding
    };

    try {
        const [response] = await client.synthesizeSpeech(request);

        // Check if audioContent exists and log the length of the audio buffer
        const audioBuffer = Buffer.from(response.audioContent, 'base64');
        console.log('Audio Buffer Length:', audioBuffer.length); // Log audio length for debugging

        if (audioBuffer.length === 0) {
            console.error('Empty audio content received from Google TTS.');
            return res.status(500).send('Empty audio content received.');
        }

        res.set('Content-Type', 'audio/mpeg'); // Correct MIME type for MP3
        res.send(audioBuffer); // Send raw audio data back

    } catch (error) {
        console.error('Error generating TTS:', error);
        res.status(500).send('TTS failed');
    }
});


app.listen(port, () => {
    console.log(`TTS server running on http://localhost:${port}`);
});
