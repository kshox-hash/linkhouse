"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markPaymentAsPaid = markPaymentAsPaid;
exports.confirmBooking = confirmBooking;
exports.getBusinessNameByUserId = getBusinessNameByUserId;
exports.getAccessTokenByMpUserId = getAccessTokenByMpUserId;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
async function markPaymentAsPaid(bookingId, providerPaymentId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`UPDATE payments
     SET status = 'paid', provider_payment_id = $1, paid_at = NOW()
     WHERE booking_id = $2
       AND provider = 'mercadopago'
       AND status <> 'paid'
     RETURNING id, amount`, [providerPaymentId, bookingId]);
    return result.rows[0] ?? null;
}
async function confirmBooking(bookingId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`UPDATE calendar_bookings
     SET payment_status = 'paid', paid_at = NOW(), status = 'confirmed'
     WHERE id = $1
     RETURNING id, user_id, client_name, client_email, client_phone, booking_date, start_time`, [bookingId]);
    return result.rows[0] ?? null;
}
async function getBusinessNameByUserId(userId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT business_name FROM business_profiles WHERE user_id = $1 LIMIT 1`, [userId]);
    return result.rows[0]?.business_name ?? null;
}
async function getAccessTokenByMpUserId(mpUserId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT access_token FROM payment_provider_connections
     WHERE mp_user_id = $1 AND provider = 'mercadopago'
     LIMIT 1`, [mpUserId]);
    return result.rows[0]?.access_token ?? null;
}
