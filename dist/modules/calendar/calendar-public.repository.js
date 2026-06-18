"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingForPayment = getBookingForPayment;
exports.getPendingPayment = getPendingPayment;
exports.getMpAccessToken = getMpAccessToken;
exports.createPaymentRecord = createPaymentRecord;
exports.getPlatformFeePct = getPlatformFeePct;
exports.updatePaymentWithPreference = updatePaymentWithPreference;
exports.getBusinessNameByUserId = getBusinessNameByUserId;
exports.confirmFreeBooking = confirmFreeBooking;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
async function getBookingForPayment(bookingId, userId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT id, user_id, status, payment_status, payment_amount,
            booking_date, start_time, client_name, client_email
     FROM calendar_bookings
     WHERE id = $1 AND user_id = $2
     LIMIT 1`, [bookingId, userId]);
    return result.rows[0] ?? null;
}
async function getPendingPayment(bookingId, userId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT id, status, checkout_url, preference_id, amount, provider, created_at
     FROM payments
     WHERE booking_id = $1 AND user_id = $2
       AND status = 'pending' AND checkout_url IS NOT NULL
     ORDER BY created_at DESC
     LIMIT 1`, [bookingId, userId]);
    return result.rows[0] ?? null;
}
async function getMpAccessToken(userId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT access_token FROM payment_provider_connections
     WHERE user_id = $1 AND provider = 'mercadopago'
     LIMIT 1`, [userId]);
    return result.rows[0]?.access_token ?? null;
}
async function createPaymentRecord(userId, bookingId, amount) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`INSERT INTO payments (user_id, booking_id, amount, status, provider)
     VALUES ($1, $2, $3, 'pending', 'mercadopago')
     RETURNING *`, [userId, bookingId, amount]);
    return result.rows[0];
}
async function getPlatformFeePct(userId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT platform_fee_pct FROM business_profiles WHERE user_id = $1 LIMIT 1`, [userId]);
    return Number(result.rows[0]?.platform_fee_pct ?? 2.5);
}
async function updatePaymentWithPreference(paymentId, checkoutUrl, preferenceId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`UPDATE payments SET checkout_url = $1, preference_id = $2
     WHERE id = $3 RETURNING *`, [checkoutUrl, preferenceId, paymentId]);
    return result.rows[0];
}
async function getBusinessNameByUserId(userId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT business_name FROM business_profiles WHERE user_id = $1 LIMIT 1`, [userId]);
    return result.rows[0]?.business_name ?? "Negocio";
}
async function confirmFreeBooking(bookingId) {
    const pool = db_configuration_1.default.getPool();
    await pool.query(`UPDATE calendar_bookings
     SET status = 'confirmed', payment_status = 'free', email_confirmed_at = NOW()
     WHERE id = $1 AND payment_status = 'unpaid'`, [bookingId]);
}
