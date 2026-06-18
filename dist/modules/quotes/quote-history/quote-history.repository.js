"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initQuoteHistoryTable = initQuoteHistoryTable;
exports.saveQuoteHistory = saveQuoteHistory;
exports.listQuoteHistory = listQuoteHistory;
exports.deleteQuoteHistory = deleteQuoteHistory;
const db_configuration_1 = __importDefault(require("../../../db/db_configuration"));
async function initQuoteHistoryTable() {
    await db_configuration_1.default.getPool().query(`
    CREATE TABLE IF NOT EXISTS quote_history (
      id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id       TEXT          NOT NULL,
      template_type TEXT          NOT NULL DEFAULT 'rapida',
      client_name   TEXT          NOT NULL,
      client_email  TEXT          NOT NULL,
      client_phone  TEXT,
      items         JSONB         NOT NULL DEFAULT '[]',
      total         NUMERIC(12,2) DEFAULT 0,
      message       TEXT,
      extra_fields  JSONB         DEFAULT '{}',
      sent_at       TIMESTAMPTZ   DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_quote_history_user_id ON quote_history(user_id);
  `);
}
async function saveQuoteHistory(params) {
    const res = await db_configuration_1.default.getPool().query(`INSERT INTO quote_history
       (user_id, template_type, client_name, client_email, client_phone, items, total, message, extra_fields)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`, [
        params.userId,
        params.templateType,
        params.clientName,
        params.clientEmail,
        params.clientPhone || null,
        JSON.stringify(params.items),
        params.total,
        params.message || null,
        JSON.stringify(params.extraFields || {}),
    ]);
    return res.rows[0];
}
async function listQuoteHistory(userId, limit = 60) {
    const res = await db_configuration_1.default.getPool().query(`SELECT id, template_type, client_name, client_email, client_phone,
            items, total, message, extra_fields, sent_at
     FROM quote_history
     WHERE user_id = $1
     ORDER BY sent_at DESC
     LIMIT $2`, [userId, limit]);
    return res.rows;
}
async function deleteQuoteHistory(userId, quoteId) {
    const res = await db_configuration_1.default.getPool().query(`DELETE FROM quote_history WHERE id = $1 AND user_id = $2 RETURNING id`, [quoteId, userId]);
    return res.rows[0] || null;
}
