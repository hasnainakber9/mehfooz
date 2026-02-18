import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const app = express();
const ai  = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(bodyParser.json());

const chatContexts = new Map();

const SYSTEM_INSTRUCTION =
  'You are the Mehfooz Assistant — friendly, concise, and knowledgeable about ' +
  'digital literacy, cybersecurity, and misinformation, with a focus on ' +
  'Gilgit Baltistan, Pakistan. Keep replies under 100 words. Be optimistic.';

app.post('/api/chat', async (req, res) => {
  const sessionId   = req.headers['x-session-id'] || 'default';
  const userMessage = (req.body.message || '').trim();
  if (!userMessage) return res.status(400).json({ error: 'Message required.' });

  if (!chatContexts.has(sessionId)) chatContexts.set(sessionId, []);
  const history = chatContexts.get(sessionId);
  history.push({ role: 'user', parts: [{ text: userMessage }] });

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
      contents: history
    });
    const reply = result.text ?? 'Sorry, no response generated.';
    history.push({ role: 'model', parts: [{ text: reply }] });
    if (history.length > 40) history.splice(0, 2);
    res.json({ reply });
  } catch (err) {
    console.error('Gemini error:', err?.message);
    history.pop();
    res.status(500).json({ error: 'AI Gateway error.' });
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok' }));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Mehfooz AI Gateway → http://localhost:${PORT}`));
