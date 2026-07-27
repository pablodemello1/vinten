import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function list() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const models = await ai.models.list();
        // According to the JSON structure we saw, it's an array wrapped in some internal structure or just an array.
        // If models has individual numeric keys, Object.values(models) should work.
        const arr = Array.isArray(models) ? models : Object.values(models).filter(v => v && v.name);
        arr.forEach(m => console.log(m.name));
    } catch (e) {
        console.error(e);
    }
}
list();
