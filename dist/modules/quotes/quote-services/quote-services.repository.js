"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initQuoteServicesTable = initQuoteServicesTable;
exports.listQuoteServices = listQuoteServices;
exports.createQuoteService = createQuoteService;
exports.updateQuoteService = updateQuoteService;
exports.deleteQuoteService = deleteQuoteService;
const db_configuration_1 = __importDefault(require("../../../db/db_configuration"));
async function initQuoteServicesTable() {
    await db_configuration_1.default.getPool().query(`
    CREATE TABLE IF NOT EXISTS quote_services (
      id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id     TEXT          NOT NULL,
      name        TEXT          NOT NULL,
      description TEXT,
      unit        TEXT          NOT NULL DEFAULT 'unidad',
      price       NUMERIC(12,2) NOT NULL DEFAULT 0,
      is_active   BOOLEAN       NOT NULL DEFAULT true,
      created_at  TIMESTAMPTZ   DEFAULT NOW(),
      updated_at  TIMESTAMPTZ   DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_quote_services_user_id ON quote_services(user_id);
  `);
}
async function listQuoteServices(userId) {
    const res = await db_configuration_1.default.getPool().query(`SELECT id, name, description, unit, price, is_active, created_at
     FROM quote_services
     WHERE user_id = $1
     ORDER BY created_at ASC`, [userId]);
    return res.rows;
}
async function createQuoteService(userId, params) {
    const res = await db_configuration_1.default.getPool().query(`INSERT INTO quote_services (user_id, name, description, unit, price)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`, [userId, params.name, params.description || null, params.unit, params.price]);
    return res.rows[0];
}
async function updateQuoteService(userId, serviceId, params) {
    const fields = [];
    const values = [];
    let i = 1;
    if (params.name !== undefined) {
        fields.push(`name = $${i++}`);
        values.push(params.name);
    }
    if (params.description !== undefined) {
        fields.push(`description = $${i++}`);
        values.push(params.description);
    }
    if (params.unit !== undefined) {
        fields.push(`unit = $${i++}`);
        values.push(params.unit);
    }
    if (params.price !== undefined) {
        fields.push(`price = $${i++}`);
        values.push(params.price);
    }
    if (params.isActive !== undefined) {
        fields.push(`is_active = $${i++}`);
        values.push(params.isActive);
    }
    if (fields.length === 0)
        return null;
    fields.push(`updated_at = now()`);
    values.push(serviceId, userId);
    const res = await db_configuration_1.default.getPool().query(`UPDATE quote_services SET ${fields.join(", ")}
     WHERE id = $${i++} AND user_id = $${i++}
     RETURNING *`, values);
    return res.rows[0] || null;
}
async function deleteQuoteService(userId, serviceId) {
    const res = await db_configuration_1.default.getPool().query(`DELETE FROM quote_services WHERE id = $1 AND user_id = $2 RETURNING id`, [serviceId, userId]);
    return res.rows[0] || null;
}
