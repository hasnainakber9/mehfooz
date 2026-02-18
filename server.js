import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const app = express();
const ai  = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(bodyParser.json());

// In-memory session store
// Gemini format: { role: 'user'|'model', parts: [{ text }] }
const chatContexts = new Map();

const SYSTEM_INSTRUCTION =
    'You are the Mehfooz Assistant — friendly, concise, and deeply knowledgeable ' +
    'about digital literacy, cybersecurity, and spotting misinformation, with a ' +
    'special focus on communities in Gilgit Baltistan, Pakistan. ' +
    'Keep every reply under 120 words. Use plain language. Be optimistic and empowering.';

app.post('/api/chat', async (req, res) => {
    const sessionId   = req.headers['x-session-id'] || 'default';
    const userMessage = (req.body.message || '').trim();

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    if (!chatContexts.has(sessionId)) {
        chatContexts.set(sessionId, []);
    }
    const history = chatContexts.get(sessionId);
    history.push({ role: 'user', parts: [{ text: userMessage }] });

    try {
        // gemini-1.5-flash: free tier, fast, real model
        const result = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            systemInstruction: SYSTEM_INSTRUCTION,
            contents: history
        });

        const botReply = result.text ?? 'Sorry, I could not generate a response.';
        history.push({ role: 'model', parts: [{ text: botReply }] });

        // Cap history at 40 entries (20 turns)
        if (history.length > 40) history.splice(0, 2);

        return res.json({ reply: botReply });

    } catch (error) {
        console.error('Gemini API error:', error?.message ?? error);
        history.pop(); // remove the user turn so history stays clean
        return res.status(500).json({ error: 'Failed to reach the Mehfooz AI Gateway.' });
    }
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅  Mehfooz AI Gateway → http://localhost:${PORT}`));
