
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function list() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const models = await ai.models.list();
        console.log('Models raw:', JSON.stringify(models, null, 2));
    } catch (e) {
        console.error('Error listing models:', e.message);
    }
}
list();
