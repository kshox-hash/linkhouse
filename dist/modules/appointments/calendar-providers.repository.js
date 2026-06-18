"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvidersByUserId = getProvidersByUserId;
exports.createProvider = createProvider;
exports.updateProvider = updateProvider;
exports.deleteProvider = deleteProvider;
exports.getActiveProvidersByUserId = getActiveProvidersByUserId;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
const pool = db_configuration_1.default.getPool();
function toInitials(name) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w[0])
        .join("")
        .substring(0, 3)
        .toUpperCase();
}
async function getProvidersByUserId(userId) {
    const result = await pool.query(`SELECT id::text, user_id::text, name, color, avatar_initials, is_active
     FROM calendar_providers
     WHERE user_id = $1
     ORDER BY created_at ASC`, [userId]);
    return result.rows;
}
async function createProvider(input) {
    const result = await pool.query(`INSERT INTO calendar_providers (user_id, name, color, avatar_initials)
     VALUES ($1, $2, $3, $4)
     RETURNING id::text, user_id::text, name, color, avatar_initials, is_active`, [
        input.userId,
        input.name.trim(),
        input.color || "#63ACF1",
        toInitials(input.name),
    ]);
    return result.rows[0];
}
async function updateProvider(input) {
    const result = await pool.query(`UPDATE calendar_providers
     SET name = $2, color = $3, avatar_initials = $4,
         is_active = $5, updated_at = NOW()
     WHERE id = $1 AND user_id = $6
     RETURNING id::text, user_id::text, name, color, avatar_initials, is_active`, [
        input.id,
        input.name.trim(),
        input.color || "#63ACF1",
        toInitials(input.name),
        input.isActive !== false,
        input.userId,
    ]);
    return result.rows[0] ?? null;
}
async function deleteProvider(id, userId) {
    await pool.query(`DELETE FROM calendar_providers WHERE id = $1 AND user_id = $2`, [id, userId]);
}
async function getActiveProvidersByUserId(userId) {
    const result = await pool.query(`SELECT id::text, name, color, avatar_initials
     FROM calendar_providers
     WHERE user_id = $1 AND is_active = true
     ORDER BY created_at ASC`, [userId]);
    return result.rows;
}
