import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join, normalize } from "node:path";
import { randomUUID, timingSafeEqual } from "node:crypto";

const PORT = Number(process.env.PORT || 5173);
const DATA_DIR = process.env.DATA_DIR || "/data";
const DATA_FILE = join(DATA_DIR, "davi-data.json");
const SITE_DIR = process.env.SITE_DIR || join(process.cwd(), "site");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "davi9anos";

let data = { guests: [], messages: [] };
let saving = Promise.resolve();

async function load() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    data = JSON.parse(await readFile(DATA_FILE, "utf8"));
    data.guests ||= [];
    data.messages ||= [];
  } catch {
    await persist();
  }
}

function persist() {
  saving = saving.then(async () => {
    await writeFile(`${DATA_FILE}.tmp`, JSON.stringify(data, null, 2));
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  });
  return saving;
}

const clean = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const digits = (value) => value.replace(/\D/g, "");
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

function adminOk(password) {
  if (!password || password.length !== ADMIN_PASSWORD.length) return false;
  return timingSafeEqual(Buffer.from(password), Buffer.from(ADMIN_PASSWORD));
}

function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(payload);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return {};
  }
}

async function api(req, res, segments) {
  const method = req.method || "GET";
  const [first, second, third] = segments;
  const body = method === "GET" || method === "DELETE" ? {} : await readBody(req);

  if (first === "guests" && !second) {
    if (method === "GET") {
      return send(res, 200, data.guests.map((guest) => ({
        id: guest.id,
        name: guest.name,
        people: guest.people,
        message: data.messages.find((m) => m.guestId === guest.id && m.status === "approved")?.text ?? null,
      })));
    }
    if (method === "POST") {
      const name = clean(body.name, 60);
      const email = clean(body.email, 120).toLowerCase();
      const whatsapp = digits(clean(body.whatsapp, 24));
      const people = Math.min(20, Math.max(1, Number(body.people) || 1));
      if (name.length < 2) return send(res, 400, { error: "Digite seu nome completo." });
      if (whatsapp.length < 10) return send(res, 400, { error: "Digite um WhatsApp válido com DDD." });
      if (!isEmail(email)) return send(res, 400, { error: "Digite um e-mail válido." });
      const existing = data.guests.find((g) => g.whatsapp === whatsapp || g.email === email);
      if (existing) {
        Object.assign(existing, { name, email, whatsapp, people });
        await persist();
        return send(res, 200, { guest: existing });
      }
      const guest = { id: randomUUID(), name, email, whatsapp, people, createdAt: new Date().toISOString() };
      data.guests.push(guest);
      await persist();
      return send(res, 201, { guest });
    }
  }

  if (first === "messages" && !second) {
    if (method === "GET") {
      return send(res, 200, data.messages.filter((m) => m.status === "approved")
        .map((m) => ({ id: m.id, name: m.name, text: m.text })));
    }
    if (method === "POST") {
      const guest = data.guests.find((g) => g.id === clean(body.guestId, 60));
      const text = clean(body.text, 220);
      if (!guest) return send(res, 403, { error: "Confirme sua presença antes de deixar um recado." });
      if (text.length < 2) return send(res, 400, { error: "Escreva seu recado." });
      data.messages.unshift({
        id: randomUUID(), guestId: guest.id, name: guest.name, text,
        status: "pending", createdAt: new Date().toISOString(),
      });
      await persist();
      return send(res, 201, { ok: true });
    }
  }

  if (first === "admin") {
    if (!adminOk(req.headers["x-admin-password"])) return send(res, 401, { error: "Senha incorreta." });
    if (second === "session" && method === "GET") return send(res, 200, { ok: true });
    if (second === "guests" && !third && method === "GET") return send(res, 200, data.guests);
    if (second === "messages" && !third && method === "GET") return send(res, 200, data.messages);
    if (second === "guests" && third && method === "DELETE") {
      data.guests = data.guests.filter((g) => g.id !== third);
      data.messages = data.messages.filter((m) => m.guestId !== third);
      await persist();
      return send(res, 200, { ok: true });
    }
    if (second === "messages" && third && method === "DELETE") {
      data.messages = data.messages.filter((m) => m.id !== third);
      await persist();
      return send(res, 200, { ok: true });
    }
    if (second === "messages" && third && method === "PATCH") {
      const status = clean(body.status, 12);
      const message = data.messages.find((m) => m.id === third);
      if (!message) return send(res, 404, { error: "Recado não encontrado." });
      if (!["approved", "rejected", "pending"].includes(status)) return send(res, 400, { error: "Status inválido." });
      message.status = status;
      await persist();
      return send(res, 200, { ok: true });
    }
  }

  return send(res, 404, { error: "Rota não encontrada." });
}

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".gif": "image/gif", ".mp3": "audio/mpeg", ".ico": "image/x-icon", ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

async function serveFile(res, filePath) {
  const info = await stat(filePath).catch(() => null);
  if (!info || !info.isFile()) return false;
  const type = MIME[extname(filePath).toLowerCase()] || "application/octet-stream";
  const cacheable = filePath.includes("/assets/") || filePath.includes("/media/");
  res.writeHead(200, {
    "content-type": type,
    "content-length": info.size,
    "cache-control": cacheable ? "public, max-age=31536000, immutable" : "no-cache",
  });
  createReadStream(filePath).pipe(res);
  return true;
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", "http://localhost");
    const pathname = decodeURIComponent(url.pathname);

    if (pathname.startsWith("/api/")) {
      return await api(req, res, pathname.slice(5).split("/").filter(Boolean));
    }

    const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
    if (await serveFile(res, join(SITE_DIR, safe))) return;
    if (await serveFile(res, join(SITE_DIR, safe, "index.html"))) return;
    if (await serveFile(res, join(SITE_DIR, "index.html"))) return;
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Não encontrado");
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("Erro interno");
  }
});

await load();
server.listen(PORT, "0.0.0.0", () => console.log(`Convite do Davi em http://0.0.0.0:${PORT}`));
