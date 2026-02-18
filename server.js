import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

// Initialize Express server and AI client
const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware setup
app.use(cors());
app.use(bodyParser.json()); // Parses incoming JSON requests

// In-memory conversation store (For production, migrate to Redis/PostgreSQL)
const chatContexts = new Map();

// POST request endpoint for the chatbot
app.post('/api/chat', async (req, res) => {
    const sessionId = req.headers['x-session-id'] || 'default';
    const userMessage = req.body.message;

    try {
        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Retrieve or initialize conversation history
        if (!chatContexts.has(sessionId)) {
            chatContexts.set(sessionId, [
                { role: "system", content: "You are the Mehfooz Assistant, a playful but highly knowledgeable expert in digital literacy, cybersecurity, and spotting misinformation for users in Gilgit Baltistan. Keep answers concise, helpful, and optimistic." }
            ]);
        }
        
        const history = chatContexts.get(sessionId);
        history.push({ role: "user", content: userMessage });

        // Call the AI model
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro',
            contents: userMessage,
        });

        const botReply = response.text;
        history.push({ role: "model", content: botReply });

        res.json({ reply: botReply });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to process digital enlightenment." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Mehfooz AI Gateway active on port ${PORT}`);
});
