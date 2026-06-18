"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServices = getServices;
exports.createService = createService;
exports.updateService = updateService;
exports.deleteService = deleteService;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
async function getServices(userId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT id, user_id, name, description, duration_minutes,
            price::numeric AS price, active, created_at
     FROM services WHERE user_id = $1 ORDER BY name ASC`, [userId]);
    return result.rows;
}
async function createService(userId, name, description, durationMinutes, price) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`INSERT INTO services (user_id, name, description, duration_minutes, price)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, name, description, duration_minutes,
               price::numeric AS price, active, created_at`, [userId, name, description ?? null, durationMinutes, price]);
    return result.rows[0];
}
async function updateService(id, userId, name, description, durationMinutes, price, active) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`UPDATE services
     SET name = $1, description = $2, duration_minutes = $3, price = $4, active = $5
     WHERE id = $6 AND user_id = $7
     RETURNING id, user_id, name, description, duration_minutes,
               price::numeric AS price, active, created_at`, [name, description ?? null, durationMinutes, price, active, id, userId]);
    return result.rows[0] ?? null;
}
async function deleteService(id, userId) {
    const pool = db_configuration_1.default.getPool();
    await pool.query(`DELETE FROM services WHERE id = $1 AND user_id = $2`, [id, userId]);
}
