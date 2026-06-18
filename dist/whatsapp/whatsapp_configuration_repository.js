"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findWhatsAppConfigByUserId = findWhatsAppConfigByUserId;
const db_configuration_1 = __importDefault(require("../db/db_configuration"));
async function findWhatsAppConfigByUserId(userId) {
    const res = await db_configuration_1.default.getPool().query(`
    SELECT phone_number_id, whatsapp_access_token
    FROM users
    WHERE id = $1
    LIMIT 1
    `, [userId]);
    return res.rowCount ? res.rows[0] : null;
}
