
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const modelsToCheck = [
        'models/gemini-flash-latest',
        'models/gemini-2.0-flash-lite',
        'models/gemini-2.0-flash'
    ];

    for (const model of modelsToCheck) {
        console.log(`Checking ${model}...`);
        try {
            const resp = await ai.models.generateContent({
                model,
                contents: 'Hola, di "OK" si puedes oír esto.',
            });
            console.log(`Response from ${model}: ${resp.text}`);
            if (resp.text) break; // Found a working one
        } catch (e) {
            console.error(`Error for ${model}: ${e.message}`);
        }
    }
}
test();
