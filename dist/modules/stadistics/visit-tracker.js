"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBot = isBot;
exports.shouldCountVisit = shouldCountVisit;
const crypto_1 = __importDefault(require("crypto"));
// In-memory: hash -> "YYYY-MM-DD" (última vez que este visitante fue contado)
const seen = new Map();
// Limpia entradas antiguas cada hora para no crecer infinito
setInterval(() => {
    const today = _today();
    for (const [key, date] of seen.entries()) {
        if (date !== today)
            seen.delete(key);
    }
}, 60 * 60 * 1000).unref();
function _today() {
    return new Date().toISOString().slice(0, 10);
}
function _hash(ip, userId) {
    return crypto_1.default
        .createHash("sha256")
        .update(`${ip}:${userId}`)
        .digest("hex")
        .slice(0, 16);
}
const BOT_PATTERN = /bot|crawler|spider|slurp|bingbot|googlebot|yahoo|baidu|yandex|duckduck|semrush|ahrefs|curl|python|wget|axios|node-fetch|go-http|java\//i;
/** Devuelve true si el User-Agent parece un bot o script automatizado. */
function isBot(userAgent) {
    if (!userAgent || userAgent.trim().length < 10)
        return true;
    return BOT_PATTERN.test(userAgent);
}
/**
 * Devuelve true si esta visita debe contarse (primera vez hoy para esta IP+negocio).
 * Llama solo cuando ya verificaste que NO es bot.
 */
function shouldCountVisit(ip, userId) {
    const hash = _hash(ip, userId);
    const today = _today();
    if (seen.get(hash) === today)
        return false;
    seen.set(hash, today);
    return true;
}
