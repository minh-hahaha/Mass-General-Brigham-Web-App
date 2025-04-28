import express, { Router, Request, Response } from 'express';
import { protos, TextToSpeechClient } from '@google-cloud/text-to-speech';

const router: Router = express.Router();

const API_KEY = process.env.TTS_API_KEY_PATH;
const client = new TextToSpeechClient({
    keyFilename: API_KEY, // path to your service account key
});

router.post('/', async function (req: Request, res: Response) {
    console.log(process.cwd());
    const { text } = req.body;

    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { text },
        voice: {
            languageCode: 'en-US',
            ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE,
        },
        audioConfig: {
            audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
        },
    };

    try {
        const [synthResponse, synthRequest] = await client.synthesizeSpeech(request);
        if (!synthResponse || !synthResponse.audioContent) {
            res.status(500).send('TTS failed');
            return;
        }
        // Check if audioContent exists and log the length of the audio buffer
        //const audioBuffer = synthResponse.audioContent;
        const audioBuffer = Buffer.from(synthResponse.audioContent as string, 'base64');
        console.log('Audio Buffer Length:', audioBuffer.length); // Log audio length for debugging

        if (audioBuffer.length === 0) {
            console.error('Empty audio content received from Google TTS.');
            res.status(500).send('Empty audio content received.');
        }

        res.set('Content-Type', 'audio/mpeg'); // Correct MIME type for MP3
        res.send(audioBuffer); // Send raw audio data back
    } catch (error) {
        console.error('Error generating TTS:', error);
        res.status(500).send('TTS failed');
    }
});

export default router;
