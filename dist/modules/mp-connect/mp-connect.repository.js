"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMpConnection = saveMpConnection;
exports.getMpConnection = getMpConnection;
exports.deleteMpConnection = deleteMpConnection;
exports.getAccessTokenByMpUserId = getAccessTokenByMpUserId;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
const pool = db_configuration_1.default.getPool();
async function saveMpConnection(input) {
    await pool.query(`INSERT INTO payment_provider_connections
       (user_id, provider, access_token, refresh_token, mp_user_id, public_key, expires_at, updated_at)
     VALUES ($1, 'mercadopago', $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (user_id, provider) DO UPDATE SET
       access_token  = EXCLUDED.access_token,
       refresh_token = EXCLUDED.refresh_token,
       mp_user_id    = EXCLUDED.mp_user_id,
       public_key    = EXCLUDED.public_key,
       expires_at    = EXCLUDED.expires_at,
       updated_at    = NOW()`, [
        input.userId,
        input.accessToken,
        input.refreshToken,
        input.mpUserId,
        input.publicKey,
        input.expiresAt,
    ]);
}
async function getMpConnection(userId) {
    const result = await pool.query(`SELECT user_id, access_token, refresh_token, mp_user_id, public_key, expires_at
     FROM payment_provider_connections
     WHERE user_id = $1 AND provider = 'mercadopago'
     LIMIT 1`, [userId]);
    return result.rows[0] ?? null;
}
async function deleteMpConnection(userId) {
    await pool.query(`DELETE FROM payment_provider_connections WHERE user_id = $1 AND provider = 'mercadopago'`, [userId]);
}
async function getAccessTokenByMpUserId(mpUserId) {
    const result = await pool.query(`SELECT access_token FROM payment_provider_connections
     WHERE mp_user_id = $1 AND provider = 'mercadopago'
     LIMIT 1`, [mpUserId]);
    return result.rows[0]?.access_token ?? null;
}
