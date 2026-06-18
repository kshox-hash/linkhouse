"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlocks = getBlocks;
exports.createBlock = createBlock;
exports.deleteBlock = deleteBlock;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
async function getBlocks(userId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT id, user_id, start_at, end_at, reason, created_at
     FROM calendar_blocks
     WHERE user_id = $1 AND end_at > NOW()
     ORDER BY start_at ASC`, [userId]);
    return result.rows;
}
async function createBlock(userId, startAt, endAt, reason) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`INSERT INTO calendar_blocks (user_id, start_at, end_at, reason)
     VALUES ($1, $2, $3, $4)
     RETURNING *`, [userId, startAt, endAt, reason ?? null]);
    return result.rows[0];
}
async function deleteBlock(id, userId) {
    const pool = db_configuration_1.default.getPool();
    await pool.query(`DELETE FROM calendar_blocks WHERE id = $1 AND user_id = $2`, [id, userId]);
}
