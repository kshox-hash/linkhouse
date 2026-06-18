"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersWithFee = getAllUsersWithFee;
exports.updateUserFeePct = updateUserFeePct;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
async function getAllUsersWithFee() {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT user_id, business_name, platform_fee_pct
     FROM business_profiles
     ORDER BY business_name ASC NULLS LAST`);
    return result.rows;
}
async function updateUserFeePct(userId, pct) {
    const pool = db_configuration_1.default.getPool();
    await pool.query(`UPDATE business_profiles SET platform_fee_pct = $1 WHERE user_id = $2`, [pct, userId]);
}
