import { access, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const htmlFiles = [];
const problems = [];

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "artifacts") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.name.endsWith(".html")) {
      htmlFiles.push(full);
    }
  }
}

function isExternal(url) {
  return /^(https?:|mailto:|tel:|#|javascript:)/.test(url);
}

function extractAttrs(html, attr) {
  const regex = new RegExp(`${attr}=["']([^"']+)["']`, "g");
  return [...html.matchAll(regex)].map((match) => match[1]);
}

function resolveHtmlTarget(fromFile, url) {
  const [rawPath] = url.split("#");
  const cleaned = rawPath || "";
  if (!cleaned) return fromFile;
  const base = path.dirname(fromFile);
  const resolved = path.resolve(base, cleaned);
  if (path.extname(resolved)) return resolved;
  return path.join(resolved, "index.html");
}

function localPart(url) {
  return url.split("#")[0];
}

async function validateFile(file) {
  const html = await readFile(file, "utf8");
  const rel = path.relative(root, file);
  const text = html.replace(/\s+/g, " ");

  const forbidden = [/lorem ipsum/i, /\bTODO\b/i, /placeholder/i, /â/];
  for (const pattern of forbidden) {
    if (pattern.test(text)) {
      problems.push(`${rel}: contains forbidden placeholder or encoding text (${pattern})`);
    }
  }

  if (!/<main id="main">/.test(html)) problems.push(`${rel}: missing main landmark`);
  if (!/<meta name="description"/.test(html)) problems.push(`${rel}: missing description meta`);
  if (!/data-mobile-toggle/.test(html)) problems.push(`${rel}: missing mobile navigation toggle`);

  const hrefs = extractAttrs(html, "href");
  for (const href of hrefs) {
    if (isExternal(href)) continue;
    const targetPart = localPart(href);
    if (!targetPart) continue;
    const target = resolveHtmlTarget(file, href);
    if (!(await exists(target))) {
      problems.push(`${rel}: broken link ${href}`);
    }
  }

  const images = extractAttrs(html, "src");
  for (const src of images) {
    if (/^(https?:|data:)/.test(src)) continue;
    const target = path.resolve(path.dirname(file), src);
    if (!(await exists(target))) {
      problems.push(`${rel}: missing image/script asset ${src}`);
    }
  }
}

await walk(root);
htmlFiles.sort();

for (const required of [
  "index.html",
  "about/index.html",
  "services/index.html",
  "osint-techniques/index.html",
  "threat-intelligence/index.html",
  "blog/index.html",
  "contact/index.html",
  "privacy/index.html",
  "404.html"
]) {
  const target = path.join(root, required);
  if (!(await exists(target))) problems.push(`missing required page ${required}`);
}

for (const file of htmlFiles) {
  await validateFile(file);
}

const styleInfo = await stat(path.join(root, "style.css"));
const scriptInfo = await stat(path.join(root, "script.js"));
if (styleInfo.size < 1000) problems.push("style.css is unexpectedly small");
if (scriptInfo.size < 1000) problems.push("script.js is unexpectedly small");

if (problems.length) {
  console.error("Site check failed:");
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(`Site check passed: ${htmlFiles.length} HTML files, links/assets validated.`);
