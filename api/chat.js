import { createChatReply } from "../src/bot.mjs";

async function readBody(req) {
  if (req.body) {
    if (typeof req.body === "string") return JSON.parse(req.body || "{}");
    return req.body;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const sessionId = req.headers["x-session-id"] || "default";
  const body = await readBody(req);
  const result = await createChatReply({ message: body?.message, sessionId });
  res.status(result.status).json(result.body);
}
