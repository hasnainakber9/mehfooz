/**
 * MEHFOOZ INTERNET — AI Gateway Server
 * Uses Google Gemini (primary) with open-source Pollinations fallback.
 * Run: node server.js (requires Node 18+)
 */

import express    from 'express';
import cors       from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500', '*'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-session-id']
}));
app.use(bodyParser.json());

// ─── In-memory session store (replace with Redis/DB in production) ────────────
const chatContexts = new Map();

const SYSTEM_PROMPT = `You are the Mehfooz Assistant — a helpful, warm, and knowledgeable digital literacy expert serving communities in Gilgit Baltistan, Pakistan.

Your purpose:
- Educate users about digital safety, cybersecurity, online privacy, and combating misinformation
- Inform users about Mehfooz Internet's programs: Community Engagement, Campus Programs, DigiSaheli, Virtual Events, Mini-Courses, MehfoozBot, Digital Resource Hub, E-Government Navigator, Ulema Training
- Guide users on how to verify information, spot fake news, and stay safe online

Tone: Warm, encouraging, concise (2–3 sentences max per response), practical.
Language: English by default; switch to Urdu if the user writes in Urdu.
Never make up information. If unsure, direct the user to contact Mehfooz Internet directly.`;

// ─── Session helpers ──────────────────────────────────────────────────────────
function getHistory(sessionId) {
    if (!chatContexts.has(sessionId)) {
        chatContexts.set(sessionId, [
            { role: 'user',  parts: [{ text: 'System: ' + SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: 'Understood. I\'m ready to assist users of Mehfooz Internet.' }] }
        ]);
    }
    return chatContexts.get(sessionId);
}

// ─── Primary: Google Gemini ───────────────────────────────────────────────────
async function callGemini(history, userMessage) {
    // Lazy-import to avoid crash if package missing
    const { GoogleGenerativeAI } = await import('@google/generative-ai').catch(() => null) || {};
    if (!GoogleGenerativeAI) throw new Error('Gemini SDK not installed');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('No GEMINI_API_KEY');

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash — fast, free-tier available, stable model string
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chat = model.startChat({
        history,
        generationConfig: { maxOutputTokens: 300, temperature: 0.75 }
    });
    const result = await chat.sendMessage(userMessage);
    return result.response.text();
}

// ─── Fallback: Pollinations (free, no key needed) ─────────────────────────────
async function callPollinations(sessionId, userMessage) {
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

    // Build a simple conversation array for the fallback
    const history = chatContexts.get(sessionId) || [];
    history.slice(-6).forEach(turn => {
        if (turn.role === 'user') {
            messages.push({ role: 'user', content: turn.parts?.[0]?.text || '' });
        } else if (turn.role === 'model') {
            messages.push({ role: 'assistant', content: turn.parts?.[0]?.text || '' });
        }
    });
    messages.push({ role: 'user', content: userMessage });

    const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'openai',
            messages,
            max_tokens: 200,
            temperature: 0.75,
            seed: 42
        }),
        signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) throw new Error(`Pollinations error: ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || 'Thank you for your question!';
}

// ─── Contextual offline response ──────────────────────────────────────────────
function offlineResponse(msg) {
    const m = msg.toLowerCase();
    if (/misinfo|fake|hoax|rumor|rumour|verify|fact.?check/.test(m))
        return 'To spot misinformation: always check the original source, look for corroborating reports from credible outlets, and use our MehfoozBot fact-checking tool. 🔍';
    if (/safe|secur|hack|password|phish|scam|privacy/.test(m))
        return 'For cyber safety: use strong, unique passwords for every account, enable two-factor authentication, and avoid clicking suspicious links. Our Cyber Safety workshops go deeper! 🛡️';
    if (/program|course|learn|train|workshop|join/.test(m))
        return 'Mehfooz offers: Community Engagement, Campus Programs, DigiSaheli for women, Virtual Events, Mini-Courses, and our Digital Learning Hub. Visit our Programs section to get started! 📚';
    if (/gilgit|baltistan|gb|remote|rural|offline/.test(m))
        return 'Mehfooz is built for Gilgit Baltistan — with offline-accessible content and local language support, reaching even the most remote valleys. 🏔️';
    if (/urdu|language|local/.test(m))
        return 'We are actively developing Urdu and local language interfaces so every community member in GB can benefit — regardless of their English proficiency. 🌐';
    return 'Mehfooz Internet is here to empower Gilgit Baltistan with digital literacy. Explore our programs or contact us at hello@mehfooz.internet for more. 💬';
}

// ─── Main Chat Endpoint ───────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
    const sessionId  = req.headers['x-session-id'] || 'default';
    const userMessage = (req.body.message || '').trim();

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    const history = getHistory(sessionId);
    let botReply  = '';

    // 1 — Try Google Gemini
    try {
        botReply = await callGemini(history, userMessage);
        // Update Gemini-format history
        history.push({ role: 'user',  parts: [{ text: userMessage }] });
        history.push({ role: 'model', parts: [{ text: botReply }] });
        chatContexts.set(sessionId, history);
    } catch (geminiErr) {
        console.warn('[Gemini] Unavailable, trying Pollinations:', geminiErr.message);

        // 2 — Try Pollinations fallback
        try {
            botReply = await callPollinations(sessionId, userMessage);
            history.push({ role: 'user',  parts: [{ text: userMessage }] });
            history.push({ role: 'model', parts: [{ text: botReply }] });
            chatContexts.set(sessionId, history);
        } catch (pollErr) {
            console.warn('[Pollinations] Unavailable, using offline response:', pollErr.message);
            // 3 — Offline contextual response
            botReply = offlineResponse(userMessage);
        }
    }

    res.json({ reply: botReply, sessionId });
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'Mehfooz AI Gateway',
        timestamp: new Date().toISOString(),
        gemini: !!process.env.GEMINI_API_KEY ? 'configured' : 'not configured (using fallback)'
    });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║     Mehfooz AI Gateway — Active          ║
║     Port: ${PORT}                           ║
║     Gemini: ${process.env.GEMINI_API_KEY ? '✓ Configured' : '✗ Not set (fallback ON)'}           ║
╚══════════════════════════════════════════╝
    `);
});
