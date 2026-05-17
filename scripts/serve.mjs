import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { botHealth, createChatReply } from "../src/bot.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 5000);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return normalized.replace(/^[/\\]+/, "");
}

function resolveRequest(requestUrl) {
  const url = new URL(requestUrl, "http://localhost");
  const cleaned = safePath(url.pathname);
  const direct = path.join(projectRoot, cleaned);

  if (cleaned && existsSync(direct) && statSync(direct).isFile()) {
    return direct;
  }

  if (existsSync(direct) && statSync(direct).isDirectory()) {
    const indexFile = path.join(direct, "index.html");
    if (existsSync(indexFile)) return indexFile;
  }

  if (!path.extname(cleaned)) {
    const indexFile = path.join(projectRoot, cleaned, "index.html");
    if (existsSync(indexFile)) return indexFile;
  }

  return path.join(projectRoot, "404.html");
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 20_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", "http://localhost");

  if (requestUrl.pathname === "/api/health") {
    sendJson(res, 200, botHealth());
    return;
  }

  if (requestUrl.pathname === "/api/chat") {
    if (req.method !== "POST") {
      sendJson(res, 405, { error: "Method not allowed." });
      return;
    }

    try {
      const body = await readJson(req);
      const result = await createChatReply({
        message: body.message,
        sessionId: req.headers["x-session-id"] || "local"
      });
      sendJson(res, result.status, result.body);
    } catch {
      sendJson(res, 400, { error: "Invalid request." });
    }
    return;
  }

  const file = resolveRequest(req.url || "/");
  const ext = path.extname(file);
  const status = path.basename(file) === "404.html" && !(req.url || "").includes("404") ? 404 : 200;

  res.writeHead(status, {
    "Content-Type": mimeTypes[ext] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff"
  });

  createReadStream(file).pipe(res);
});

server.listen(port, () => {
  console.log(`mehfooz website preview running at http://localhost:${port}`);
});
