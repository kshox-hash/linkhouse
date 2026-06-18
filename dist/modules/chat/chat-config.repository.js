"use strict";
/*
  Migration SQL — ejecutar una vez en la DB:

  CREATE TABLE IF NOT EXISTS business_chat_config (
    id          SERIAL PRIMARY KEY,
    user_id     TEXT NOT NULL UNIQUE,
    description TEXT,
    faq         JSONB NOT NULL DEFAULT '[]',
    extra_info  TEXT,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBusinessChatConfig = getBusinessChatConfig;
exports.upsertBusinessChatConfig = upsertBusinessChatConfig;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
async function getBusinessChatConfig(userId) {
    const res = await db_configuration_1.default.getPool().query(`SELECT user_id, description, faq, extra_info
     FROM business_chat_config
     WHERE user_id = $1`, [userId]);
    if (!res.rowCount)
        return null;
    const row = res.rows[0];
    return {
        userId: row.user_id,
        description: row.description ?? null,
        faq: Array.isArray(row.faq) ? row.faq : [],
        extraInfo: row.extra_info ?? null,
    };
}
async function upsertBusinessChatConfig(userId, data) {
    await db_configuration_1.default.getPool().query(`INSERT INTO business_chat_config (user_id, description, faq, extra_info, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (user_id) DO UPDATE SET
       description = EXCLUDED.description,
       faq         = EXCLUDED.faq,
       extra_info  = EXCLUDED.extra_info,
       updated_at  = NOW()`, [
        userId,
        data.description ?? null,
        JSON.stringify(data.faq ?? []),
        data.extraInfo ?? null,
    ]);
}
