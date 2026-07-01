/**
 * Minimal static server for Cloud Run (marketing site).
 * Cloud Run sets PORT (default 8080); must bind 0.0.0.0 and serve Vite's dist/ with SPA fallback.
 */
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = parseInt(process.env.PORT || "8080", 10);
const HOST = "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
  ".txt": "text/plain; charset=utf-8",
};

/** Map URL path to an absolute path under DIST; reject path traversal. */
function resolveUnderDist(pathname) {
  const raw = pathname.split("?")[0] || "/";
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null;
  }
  const rel = path
    .normalize(decoded)
    .replace(/^(\.\.(\/|\\|$))+/, "")
    .replace(/^[\\/]+/, "");
  const full = path.join(DIST, rel);
  if (!full.startsWith(DIST)) return null;
  return full;
}

async function sendFile(res, filePath, req, cacheControl) {
  const data = await fs.readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type, "Cache-Control": cacheControl });
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  res.end(data);
}

const server = http.createServer(async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405);
    res.end();
    return;
  }

  const pathname = new URL(req.url || "/", "http://everpoint.internal").pathname;
  const target = resolveUnderDist(pathname);

  if (!target) {
    res.writeHead(400);
    res.end();
    return;
  }

  try {
    const stat = await fs.stat(target);
    if (stat.isFile()) {
      const cache = pathname.startsWith("/assets/")
        ? "public, max-age=31536000, immutable"
        : "no-cache";
      await sendFile(res, target, req, cache);
      return;
    }
  } catch {
    /* fall through */
  }

  // A request for a concrete file (extension in last segment) must NEVER fall back
  // to index.html — serving HTML for a missing hashed chunk traps the SPA in a
  // reload loop. Return a real 404 instead. Navigation routes use SPA fallback below.
  const lastSegment = pathname.split("/").pop() || "";
  if (lastSegment.includes(".")) {
    res.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(req.method === "HEAD" ? undefined : "Not found");
    return;
  }

  const indexHtml = path.join(DIST, "index.html");
  try {
    await sendFile(res, indexHtml, req, "no-cache, no-store, must-revalidate");
  } catch (e) {
    console.error("[static-server] Missing dist/index.html — run build first.", e);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Server misconfiguration: dist/ not built.");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[static-server] http://${HOST}:${PORT} dist=${DIST}`);
});
