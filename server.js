import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
  const direct = path.join(__dirname, cleaned);

  if (cleaned && existsSync(direct) && statSync(direct).isFile()) {
    return direct;
  }

  if (existsSync(direct) && statSync(direct).isDirectory()) {
    const indexFile = path.join(direct, "index.html");
    if (existsSync(indexFile)) return indexFile;
  }

  if (!path.extname(cleaned)) {
    const indexFile = path.join(__dirname, cleaned, "index.html");
    if (existsSync(indexFile)) return indexFile;
  }

  return path.join(__dirname, "404.html");
}

const server = createServer((req, res) => {
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
  console.log(`Mehfooz website preview running at http://localhost:${port}`);
});
