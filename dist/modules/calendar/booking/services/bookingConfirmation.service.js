"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmBookingByToken = confirmBookingByToken;
const db_configuration_1 = __importDefault(require("../../../../db/db_configuration"));
async function confirmBookingByToken(token) {
    const pool = db_configuration_1.default.getPool();
    if (!token || token.trim().length < 20) {
        return {
            ok: false,
            message: "Token inválido.",
        };
    }
    const found = await pool.query(`
    SELECT
      id,
      status,
      confirmation_expires_at,
      email_confirmed_at
    FROM public.calendar_bookings
    WHERE confirmation_token = $1
    LIMIT 1
    `, [token]);
    if (found.rowCount === 0) {
        return {
            ok: false,
            message: "La reserva no existe o el enlace es inválido.",
        };
    }
    const booking = found.rows[0];
    if (booking.email_confirmed_at) {
        return {
            ok: true,
            bookingId: String(booking.id),
        };
    }
    if (booking.confirmation_expires_at &&
        new Date(booking.confirmation_expires_at).getTime() < Date.now()) {
        await pool.query(`
      UPDATE public.calendar_bookings
      SET status = 'expired'
      WHERE id = $1
      `, [booking.id]);
        return {
            ok: false,
            message: "El enlace de confirmación expiró.",
        };
    }
    await pool.query(`
    UPDATE public.calendar_bookings
    SET
      status = 'confirmed',
      email_confirmed_at = NOW()
    WHERE id = $1
    `, [booking.id]);
    return {
        ok: true,
        bookingId: String(booking.id),
    };
}
