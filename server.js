import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const app = express();
const ai  = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(bodyParser.json());

// ── In-memory session store ──────────────────────────────────────────────────
// Structure: sessionId → Array<{ role: 'user'|'model', parts: [{ text }] }>
// Gemini's native multi-turn format — no "system" role in the history array;
// we pass the system instruction separately.
const chatContexts = new Map();

const SYSTEM_INSTRUCTION =
    'You are the Mehfooz Assistant — friendly, concise, and deeply knowledgeable ' +
    'about digital literacy, cybersecurity, and spotting misinformation, with a ' +
    'special focus on communities in Gilgit Baltistan, Pakistan. ' +
    'Keep every reply under 120 words. Use plain language. Be optimistic and empowering.';

// ── POST /api/chat ───────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
    const sessionId   = req.headers['x-session-id'] || 'default';
    const userMessage = (req.body.message || '').trim();

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    // Retrieve or initialise conversation history
    if (!chatContexts.has(sessionId)) {
        chatContexts.set(sessionId, []);
    }
    const history = chatContexts.get(sessionId);

    // Append the new user turn
    history.push({ role: 'user', parts: [{ text: userMessage }] });

    try {
        // ── gemini-1.5-flash: free-tier, fast, supports multi-turn ──────────
        const result = await ai.models.generateContent({
            model: 'gemini-1.5-flash',          // ✅ real, free-tier model
            systemInstruction: SYSTEM_INSTRUCTION,
            contents: history,                   // full conversation history
        });

        const botReply = result.text ?? 'Sorry, I could not generate a response.';

        // Append the model's reply to history for next turn
        history.push({ role: 'model', parts: [{ text: botReply }] });

        // Cap history at 20 turns to prevent bloat
        if (history.length > 40) history.splice(0, 2);

        return res.json({ reply: botReply });

    } catch (error) {
        console.error('Gemini API error:', error?.message ?? error);

        // Remove the user turn we just added so history stays clean
        history.pop();

        return res.status(500).json({
            error: 'Failed to reach the Mehfooz AI Gateway. Please try again shortly.'
        });
    }
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅  Mehfooz AI Gateway active → http://localhost:${PORT}`);
});
