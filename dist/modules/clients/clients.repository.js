"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClients = getClients;
exports.getClientBookings = getClientBookings;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
async function getClients(userId) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT
       client_email                                                     AS email,
       MAX(client_name)                                                 AS name,
       MAX(client_phone)                                                AS phone,
       COUNT(*)::int                                                    AS booking_count,
       COUNT(*) FILTER (WHERE payment_status = 'paid')::int            AS paid_count,
       COALESCE(SUM(payment_amount) FILTER (WHERE payment_status = 'paid'), 0)::numeric AS total_spent,
       MAX(booking_date)::text                                          AS last_booking
     FROM calendar_bookings
     WHERE user_id = $1 AND status != 'cancelled'
     GROUP BY client_email
     ORDER BY MAX(booking_date) DESC`, [userId]);
    return result.rows;
}
async function getClientBookings(userId, email) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`SELECT id, booking_date::text, start_time::text, status,
            payment_status, payment_amount::numeric, notes
     FROM calendar_bookings
     WHERE user_id = $1 AND client_email = $2
     ORDER BY booking_date DESC, start_time DESC`, [userId, email]);
    return result.rows;
}
