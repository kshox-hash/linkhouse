import crypto from "crypto";

// In-memory: hash -> "YYYY-MM-DD" (última vez que este visitante fue contado)
const seen = new Map<string, string>();

// Limpia entradas antiguas cada hora para no crecer infinito
setInterval(() => {
  const today = _today();
  for (const [key, date] of seen.entries()) {
    if (date !== today) seen.delete(key);
  }
}, 60 * 60 * 1000).unref();

function _today(): string {
  return new Date().toISOString().slice(0, 10);
}

function _hash(ip: string, userId: string): string {
  return crypto
    .createHash("sha256")
    .update(`${ip}:${userId}`)
    .digest("hex")
    .slice(0, 16);
}

const BOT_PATTERN =
  /bot|crawler|spider|slurp|bingbot|googlebot|yahoo|baidu|yandex|duckduck|semrush|ahrefs|curl|python|wget|axios|node-fetch|go-http|java\//i;

/** Devuelve true si el User-Agent parece un bot o script automatizado. */
export function isBot(userAgent: string | undefined): boolean {
  if (!userAgent || userAgent.trim().length < 10) return true;
  return BOT_PATTERN.test(userAgent);
}

/**
 * Devuelve true si esta visita debe contarse (primera vez hoy para esta IP+negocio).
 * Llama solo cuando ya verificaste que NO es bot.
 */
export function shouldCountVisit(ip: string, userId: string): boolean {
  const hash  = _hash(ip, userId);
  const today = _today();
  if (seen.get(hash) === today) return false;
  seen.set(hash, today);
  return true;
}
