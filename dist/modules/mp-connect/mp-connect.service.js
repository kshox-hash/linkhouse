"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMpAuthUrl = generateMpAuthUrl;
exports.consumeState = consumeState;
exports.exchangeCodeForTokens = exchangeCodeForTokens;
exports.refreshMpToken = refreshMpToken;
const crypto_1 = __importDefault(require("crypto"));
const MP_AUTH_URL = "https://auth.mercadopago.com/authorization";
const MP_TOKEN_URL = "https://api.mercadopago.com/oauth/token";
// Estado temporal en memoria (válido 10 min) para el flujo OAuth
const pendingStates = new Map();
function generateMpAuthUrl(userId) {
    const appId = process.env.MP_APP_ID ?? "";
    const redirectUri = process.env.MP_REDIRECT_URI ?? "";
    if (!appId || !redirectUri) {
        throw new Error("MP_APP_ID y MP_REDIRECT_URI son requeridos");
    }
    const state = crypto_1.default.randomBytes(20).toString("hex");
    pendingStates.set(state, { userId, expiresAt: Date.now() + 10 * 60 * 1000 });
    const params = new URLSearchParams({
        client_id: appId,
        response_type: "code",
        platform_id: "mp",
        redirect_uri: redirectUri,
        state,
    });
    return `${MP_AUTH_URL}?${params.toString()}`;
}
function consumeState(state) {
    const entry = pendingStates.get(state);
    pendingStates.delete(state);
    if (!entry || entry.expiresAt < Date.now())
        return null;
    return entry.userId;
}
async function exchangeCodeForTokens(code) {
    const appId = process.env.MP_APP_ID ?? "";
    const appSecret = process.env.MP_APP_SECRET ?? "";
    const redirectUri = process.env.MP_REDIRECT_URI ?? "";
    const response = await fetch(MP_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
            client_id: appId,
            client_secret: appSecret,
            code,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
        }),
    });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`MP OAuth token error ${response.status}: ${body}`);
    }
    return response.json();
}
async function refreshMpToken(refreshToken) {
    const appId = process.env.MP_APP_ID ?? "";
    const appSecret = process.env.MP_APP_SECRET ?? "";
    const response = await fetch(MP_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
            client_id: appId,
            client_secret: appSecret,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
    });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`MP OAuth refresh error ${response.status}: ${body}`);
    }
    return response.json();
}
