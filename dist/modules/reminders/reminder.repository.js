"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingsDueTomorrow = getBookingsDueTomorrow;
exports.markReminderSent = markReminderSent;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
async function getBookingsDueTomorrow() {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT
       cb.id,
       cb.client_name,
       cb.client_email,
       cb.client_phone,
       cb.booking_date,
       cb.start_time,
       COALESCE(bp.business_name, '') AS business_name,
       bp.phone                       AS business_phone
     FROM calendar_bookings cb
     LEFT JOIN business_profiles bp ON bp.user_id = cb.user_id
     WHERE cb.booking_date = CURRENT_DATE + INTERVAL '1 day'
       AND cb.payment_status IN ('paid', 'free')
       AND cb.status         = 'confirmed'
       AND cb.reminder_sent  = false
       AND cb.client_email  <> ''`);
    return result.rows;
}
async function markReminderSent(bookingId) {
    const pool = db_configuration_1.default.getPool();
    await pool.query(`UPDATE calendar_bookings SET reminder_sent = true WHERE id = $1`, [bookingId]);
}
