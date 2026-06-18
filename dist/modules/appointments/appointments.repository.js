"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalendarSettings = getCalendarSettings;
exports.getCalendarAvailability = getCalendarAvailability;
exports.getCalendarBlockedDates = getCalendarBlockedDates;
exports.getCalendarBookings = getCalendarBookings;
exports.createCalendarBooking = createCalendarBooking;
exports.bookingExists = bookingExists;
exports.confirmCalendarBookingByToken = confirmCalendarBookingByToken;
exports.findCalendarBookingByConfirmationToken = findCalendarBookingByConfirmationToken;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
const pool = db_configuration_1.default.getPool();
async function getCalendarSettings(userId) {
    const result = await pool.query(`
    SELECT *
    FROM calendar_settings
    WHERE user_id = $1
      AND is_active = true
    LIMIT 1
    `, [userId]);
    return result.rows[0] || null;
}
async function getCalendarAvailability(userId, providerId) {
    if (providerId) {
        // Try provider-specific rows first; fall back to global rows if none exist
        const specific = await pool.query(`SELECT * FROM calendar_availability
       WHERE user_id = $1 AND provider_id = $2 AND is_active = true
       ORDER BY weekday ASC, start_time ASC`, [userId, providerId]);
        if (specific.rows.length > 0)
            return specific.rows;
    }
    const result = await pool.query(`SELECT * FROM calendar_availability
     WHERE user_id = $1 AND (provider_id IS NULL) AND is_active = true
     ORDER BY weekday ASC, start_time ASC`, [userId]);
    return result.rows;
}
async function getCalendarBlockedDates(userId, from, to) {
    const result = await pool.query(`
    SELECT *
    FROM calendar_blocked_dates
    WHERE user_id = $1
      AND blocked_date BETWEEN $2 AND $3
    ORDER BY blocked_date ASC, start_time ASC
    `, [userId, from, to]);
    return result.rows;
}
async function getCalendarBookings(userId, from, to, providerId) {
    const providerClause = providerId
        ? `AND provider_id = $4`
        : ``;
    const params = providerId ? [userId, from, to, providerId] : [userId, from, to];
    const result = await pool.query(`
    SELECT *
    FROM calendar_bookings
    WHERE user_id = $1
      AND booking_date BETWEEN $2 AND $3
      ${providerClause}
      AND (
        status = 'confirmed'
        OR (
          status = 'pending_payment'
          AND expires_at > NOW()
        )
      )
    ORDER BY booking_date ASC, start_time ASC
    `, params);
    return result.rows;
}
async function createCalendarBooking(input) {
    const result = await pool.query(`
    INSERT INTO calendar_bookings (
      user_id,
      booking_date,
      start_time,
      end_time,
      client_name,
      client_email,
      client_phone,
      status,
      payment_status,
      payment_amount,
      notes,
      confirmation_token,
      confirmation_expires_at,
      confirmation_email_sent_at,
      expires_at,
      provider_id,
      service_id,
      service_name,
      service_color,
      created_at,
      updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      'pending_payment',
      'unpaid',
      $8,
      $9, $10, $11, NOW(),
      NOW() + INTERVAL '45 minutes',
      $12,
      $13, $14, $15,
      NOW(),
      NOW()
    )
    RETURNING *
    `, [
        input.userId,
        input.bookingDate,
        input.startTime,
        input.endTime,
        input.customerName,
        input.customerEmail,
        input.customerPhone,
        input.paymentAmount ?? null,
        input.notes || null,
        input.confirmationToken,
        input.confirmationExpiresAt,
        input.providerId || null,
        input.serviceId || null,
        input.serviceName || null,
        input.serviceColor || null,
    ]);
    return result.rows[0];
}
async function bookingExists(input) {
    const providerClause = input.providerId
        ? `AND provider_id = $4`
        : ``;
    const params = input.providerId
        ? [input.userId, input.bookingDate, input.startTime, input.providerId]
        : [input.userId, input.bookingDate, input.startTime];
    const result = await pool.query(`
    SELECT id
    FROM calendar_bookings
    WHERE user_id = $1
      AND booking_date = $2
      AND start_time = $3
      ${providerClause}
      AND (
        status = 'confirmed'
        OR (
          status = 'pending_payment'
          AND expires_at > NOW()
        )
      )
    LIMIT 1
    `, params);
    return (result.rowCount ?? 0) > 0;
}
async function confirmCalendarBookingByToken(token) {
    const result = await pool.query(`
    UPDATE calendar_bookings
    SET
      status = 'confirmed',
      email_confirmed_at = NOW(),
      updated_at = NOW()
    WHERE confirmation_token = $1
      AND status = 'pending_email_confirmation'
      AND confirmation_expires_at > NOW()
    RETURNING *
    `, [token]);
    return result.rows[0] || null;
}
async function findCalendarBookingByConfirmationToken(token) {
    const result = await pool.query(`
    SELECT *
    FROM calendar_bookings
    WHERE confirmation_token = $1
    LIMIT 1
    `, [token]);
    return result.rows[0] || null;
}
