"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCalendarServicesTable = initCalendarServicesTable;
exports.getServicesByUserId = getServicesByUserId;
exports.getActiveServicesByUserId = getActiveServicesByUserId;
exports.getServiceById = getServiceById;
exports.createService = createService;
exports.updateService = updateService;
exports.deleteService = deleteService;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
async function initCalendarServicesTable() {
    const pool = db_configuration_1.default.getPool();
    await pool.query(`
    CREATE TABLE IF NOT EXISTS calendar_services (
      id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id          UUID        NOT NULL,
      name             TEXT        NOT NULL,
      price            INTEGER     NOT NULL DEFAULT 0,
      duration_minutes INTEGER,
      color            TEXT        NOT NULL DEFAULT '#63ACF1',
      is_active        BOOLEAN     NOT NULL DEFAULT TRUE,
      sort_order       INTEGER     NOT NULL DEFAULT 0,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
    await pool.query(`
    ALTER TABLE calendar_bookings
      ADD COLUMN IF NOT EXISTS service_id   UUID,
      ADD COLUMN IF NOT EXISTS service_name TEXT,
      ADD COLUMN IF NOT EXISTS service_color TEXT
  `);
}
async function getServicesByUserId(userId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT id::text, user_id::text, name, price, duration_minutes, color, is_active, sort_order
     FROM calendar_services
     WHERE user_id = $1
     ORDER BY sort_order ASC, name ASC`, [userId]);
    return result.rows;
}
async function getActiveServicesByUserId(userId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT id::text, user_id::text, name, price, duration_minutes, color, is_active, sort_order
     FROM calendar_services
     WHERE user_id = $1 AND is_active = TRUE
     ORDER BY sort_order ASC, name ASC`, [userId]);
    return result.rows;
}
async function getServiceById(id, userId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT id::text, user_id::text, name, price, duration_minutes, color, is_active, sort_order
     FROM calendar_services WHERE id = $1 AND user_id = $2`, [id, userId]);
    return result.rows[0] ?? null;
}
async function createService(input) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`INSERT INTO calendar_services (user_id, name, price, duration_minutes, color)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id::text, user_id::text, name, price, duration_minutes, color, is_active, sort_order`, [input.userId, input.name, input.price, input.durationMinutes ?? null, input.color]);
    return result.rows[0];
}
async function updateService(input) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`UPDATE calendar_services
     SET name = $1, price = $2, duration_minutes = $3, color = $4, is_active = $5
     WHERE id = $6 AND user_id = $7
     RETURNING id::text, user_id::text, name, price, duration_minutes, color, is_active, sort_order`, [input.name, input.price, input.durationMinutes ?? null, input.color, input.isActive, input.id, input.userId]);
    return result.rows[0] ?? null;
}
async function deleteService(id, userId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`DELETE FROM calendar_services WHERE id = $1 AND user_id = $2`, [id, userId]);
    return (result.rowCount ?? 0) > 0;
}
