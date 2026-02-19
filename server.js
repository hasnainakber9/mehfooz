/**
 * MEHFOOZ INTERNET — server.js
 * Run: npm install express cors body-parser  →  node server.js
 * Zero API keys. Works out of the box.
 */

import express    from 'express';
import cors       from 'cors';
import bodyParser from 'body-parser';

const app  = express();
const PORT = process.env.PORT || 5000;

const SYSTEM = `You are the Mehfooz Assistant — a helpful, warm digital literacy expert for communities in Gilgit Baltistan, Pakistan. Help users with digital safety, misinformation, cybersecurity, and Mehfooz Internet's programs (DigiSaheli, Ulema Training, Campus Program, MehfoozBot, Digital Learning Hub, E-Government Navigator). Be concise (2–3 sentences), friendly, and practical. Switch to Urdu if the user writes in Urdu.`;

// Session memory (last 10 turns per user)
const sessions = new Map();
function getHistory(id) {
    if (!sessions.has(id)) sessions.set(id, []);
    return sessions.get(id);
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));  // serves your index.html, style.css, script.js

// ── AI call via Pollinations (free, no key, GPT-4o under the hood) ────────────
async function askAI(history, message) {
    const res = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'openai',
            messages: [
                { role: 'system', content: SYSTEM },
                ...history,
                { role: 'user', content: message }
            ],
            max_tokens: 220,
            temperature: 0.7
        }),
        signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) throw new Error('Pollinations ' + res.status);
    const d = await res.json();
    const reply = d?.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error('empty');
    return reply;
}

// ── Offline fallback (keyword-matched, zero network) ─────────────────────────
function offline(msg) {
    const m = msg.toLowerCase();
    if (/misinfo|fake|verify|fact.?check|deepfake/.test(m))
        return 'Always check the original source, look for corroborating reports, and use MehfoozBot\'s fact-checking tool before sharing anything online. 🔍';
    if (/safe|secur|password|phish|scam|hack|privacy/.test(m))
        return 'Use strong unique passwords, enable two-factor authentication, and never click suspicious links. Our Cyber Safety workshops cover this in depth! 🛡️';
    if (/digisaheli|women|female/.test(m))
        return 'DigiSaheli empowers women in GB with digital skills and online safety tools to participate confidently in the digital world. 💜';
    if (/ulema|religious|mosque|imam/.test(m))
        return 'Our Ulema Training equips religious leaders with digital literacy to guide their communities responsibly online. 🕌';
    if (/program|course|learn|join|enroll|train/.test(m))
        return 'Mehfooz offers: Community Engagement, Campus Programs, DigiSaheli, Virtual Events, Mini-Courses, and the Digital Learning Hub. Visit our Programs section! 📚';
    if (/urdu|language|local/.test(m))
        return 'MehfoozBot already responds in Urdu — just write in Urdu and it will reply in kind. Full Urdu support is expanding! 🌐';
    if (/remote|rural|offline|village|connectivity/.test(m))
        return 'We have offline-accessible content and community hubs reaching even the most remote valleys of Gilgit Baltistan. 🏔️';
    if (/hello|hi|salam|salaam|hey/.test(m))
        return 'Assalam-u-Alaikum! 👋 I\'m the Mehfooz Assistant. Ask me about digital safety, our programs, or anything about Mehfooz Internet!';
    if (/contact|email/.test(m))
        return 'Reach us at hello@mehfooz.internet or through our social channels. We\'d love to hear from you! 📧';
    return 'Mehfooz Internet empowers Gilgit Baltistan with digital literacy. Explore our programs or email hello@mehfooz.internet for help. 💬';
}

// ── POST /api/chat ────────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
    const id      = (req.headers['x-session-id'] || 'default').slice(0, 64);
    const message = (req.body?.message || '').trim().slice(0, 800);
    if (!message) return res.status(400).json({ error: 'Message required.' });

    const history = getHistory(id);
    let reply, provider;

    try {
        reply    = await askAI(history, message);
        provider = 'pollinations';
    } catch (e) {
        console.warn('[AI] Unavailable, using offline fallback:', e.message);
        reply    = offline(message);
        provider = 'offline';
    }

    history.push({ role: 'user',      content: message });
    history.push({ role: 'assistant', content: reply   });
    if (history.length > 20) history.splice(0, 2);   // keep last 10 exchanges

    res.json({ reply, provider, sessionId: id });
});

// ── GET /api/health ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', sessions: sessions.size }));

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`Mehfooz AI running → http://localhost:${PORT}`));
