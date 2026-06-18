"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PGPORT = exports.PGDATABASE = exports.PGPASSWORD = exports.PGUSER = exports.PGHOST = exports.WHATSAPP_PHONE_NUMBER_ID = exports.WHATSAPP_ACCESS_TOKEN = exports.CORS_ORIGINS = exports.JWT_SECRET = exports.BASE_URL = exports.PORT = void 0;
require("dotenv").config();
function requireEnv(name) {
    const value = process.env[name];
    if (!value)
        throw new Error(`[startup] Variable de entorno requerida no definida: ${name}`);
    return value;
}
exports.PORT = Number(process.env.PORT) || 3000;
exports.BASE_URL = process.env.PUBLIC_BASE_URL || `http://localhost:${exports.PORT}`;
exports.JWT_SECRET = requireEnv("JWT_SECRET");
// CORS: lista de orígenes permitidos separados por coma
// Ej: CORS_ORIGIN=https://app.tudominio.com,https://admin.tudominio.com
exports.CORS_ORIGINS = (process.env.CORS_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
exports.WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "";
exports.WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
// Variables de base de datos — validadas aquí para fallar rápido al arrancar
exports.PGHOST = requireEnv("PGHOST");
exports.PGUSER = requireEnv("PGUSER");
exports.PGPASSWORD = requireEnv("PGPASSWORD");
exports.PGDATABASE = requireEnv("PGDATABASE");
exports.PGPORT = Number(process.env.PGPORT) || 5432;
