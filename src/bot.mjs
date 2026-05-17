const SYSTEM_PROMPT =
  "You are mehfoozbot, a concise digital safety guide for communities in Gilgit Baltistan. Help with verification, privacy, phishing, misinformation, public-source analysis, and mehfooz programs. Stay defensive, lawful, and practical. Do not provide exploit steps, evasion, credential collection, or private surveillance guidance. If a user writes in Urdu, respond in Urdu.";

const sessions = new Map();

function getHistory(sessionId) {
  const id = String(sessionId || "default").slice(0, 64);
  if (!sessions.has(id)) sessions.set(id, []);
  return sessions.get(id);
}

export function offlineReply(message = "") {
  const text = message.toLowerCase();

  if (/misinfo|fake|hoax|rumou?r|verify|fact.?check|source/.test(text)) {
    return "Pause before sharing, look for the original source, compare it with trusted public references, and keep uncertainty visible when you discuss the claim.";
  }

  if (/safe|secur|password|phish|scam|hack|privacy|account/.test(text)) {
    return "Use unique passwords, turn on two-factor authentication, review privacy settings, and avoid links or files that pressure you to act quickly.";
  }

  if (/osint|public.?source|analysis|report|timeline|risk/.test(text)) {
    return "Responsible public-source analysis starts with a clear question, proportional collection, corroboration, confidence labels, and a calm report focused on harm reduction.";
  }

  if (/program|course|learn|train|workshop|join|enroll|service/.test(text)) {
    return "mehfooz supports community learning, campus programs, women-led safety, trusted messenger training, and public-source analysis workflows.";
  }

  if (/urdu|language|local/.test(text)) {
    return "You can write in Urdu. mehfoozbot will keep the guidance simple, respectful, and focused on practical digital safety.";
  }

  if (/hello|hi|salam|salaam|hey|assalam/.test(text)) {
    return "Assalam-u-Alaikum. I am mehfoozbot. Ask me about verification, privacy, misinformation, OSINT workflows, or mehfooz programs.";
  }

  if (/contact|reach|email|phone|address/.test(text)) {
    return "Use the contact form on this website for program, training, analysis, or partnership requests.";
  }

  return "I can help with digital safety, verification, misinformation, privacy, and responsible public-source analysis. Share the question or situation you want to think through.";
}

async function askRemote(history, message) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history, { role: "user", content: message }],
        max_tokens: 220,
        temperature: 0.68
      }),
      signal: controller.signal
    });

    if (!response.ok) throw new Error(`provider ${response.status}`);
    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error("empty provider response");
    return reply;
  } finally {
    clearTimeout(timeout);
  }
}

export async function createChatReply({ message, sessionId }) {
  const cleanMessage = String(message || "").trim().slice(0, 800);
  if (!cleanMessage) {
    return { status: 400, body: { error: "Message required." } };
  }

  const history = getHistory(sessionId);
  let reply = "";
  let provider = "offline";

  try {
    reply = await askRemote(history, cleanMessage);
    provider = "remote";
  } catch {
    reply = offlineReply(cleanMessage);
  }

  history.push({ role: "user", content: cleanMessage });
  history.push({ role: "assistant", content: reply });
  if (history.length > 20) history.splice(0, history.length - 20);

  return { status: 200, body: { reply, provider } };
}

export function botHealth() {
  return { status: "ok", sessions: sessions.size };
}
