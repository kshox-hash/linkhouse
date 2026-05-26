import DB from "../../db/db_configuration";

const pool = DB.getPool();

export type CalendarSettingsRow = {
  id: string;
  user_id: string;
  timezone: string;
  default_slot_minutes: number;
  min_advance_hours: number;
  max_advance_days: number;
  auto_confirm_booking: boolean;
  is_active: boolean;
};

export type CalendarAvailabilityRow = {
  id: string;
  user_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  slot_minutes: number;
  is_active: boolean;
};

export type CalendarBlockedDateRow = {
  id: string;
  user_id: string;
  blocked_date: string;
  start_time: string | null;
  end_time: string | null;
  is_full_day: boolean;
  reason: string | null;
};

export type CalendarBookingRow = {
  id: string;
  user_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  status: string;
  notes: string | null;
  confirmation_token?: string | null;
  confirmation_expires_at?: Date | null;
  confirmation_email_sent_at?: Date | null;
  email_confirmed_at?: Date | null;
};

export async function getCalendarSettings(userId: string) {
  const result = await pool.query<CalendarSettingsRow>(
    `
    SELECT *
    FROM calendar_settings
    WHERE user_id = $1
      AND is_active = true
    LIMIT 1
    `,
    [userId]
  );

  return result.rows[0] || null;
}

export async function getCalendarAvailability(userId: string) {
  const result = await pool.query<CalendarAvailabilityRow>(
    `
    SELECT *
    FROM calendar_availability
    WHERE user_id = $1
      AND is_active = true
    ORDER BY weekday ASC, start_time ASC
    `,
    [userId]
  );

  return result.rows;
}

export async function getCalendarBlockedDates(
  userId: string,
  from: string,
  to: string
) {
  const result = await pool.query<CalendarBlockedDateRow>(
    `
    SELECT *
    FROM calendar_blocked_dates
    WHERE user_id = $1
      AND blocked_date BETWEEN $2 AND $3
    ORDER BY blocked_date ASC, start_time ASC
    `,
    [userId, from, to]
  );

  return result.rows;
}

export async function getCalendarBookings(
  userId: string,
  from: string,
  to: string
) {
  const result = await pool.query<CalendarBookingRow>(
    `
    SELECT *
    FROM calendar_bookings
    WHERE user_id = $1
      AND booking_date BETWEEN $2 AND $3
      AND status <> 'cancelled'
    ORDER BY booking_date ASC, start_time ASC
    `,
    [userId, from, to]
  );

  return result.rows;
}

export async function createCalendarBooking(input: {
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  confirmationToken: string;
  confirmationExpiresAt: Date;
}) {
  const result = await pool.query<CalendarBookingRow>(
    `
    INSERT INTO calendar_bookings (
      user_id,
      booking_date,
      start_time,
      end_time,
      client_name,
      client_email,
      client_phone,
      status,
      notes,
      confirmation_token,
      confirmation_expires_at,
      confirmation_email_sent_at,
      created_at,
      updated_at
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,
      'pending_email_confirmation',
      $8,$9,$10,NOW(),NOW(),NOW()
    )
    RETURNING *
    `,
    [
      input.userId,
      input.bookingDate,
      input.startTime,
      input.endTime,
      input.customerName,
      input.customerEmail,
      input.customerPhone,
      input.notes || null,
      input.confirmationToken,
      input.confirmationExpiresAt,
    ]
  );

  return result.rows[0];
}

export async function bookingExists(input: {
  userId: string;
  bookingDate: string;
  startTime: string;
}) {
  const result = await pool.query(
    `
    SELECT id
    FROM calendar_bookings
    WHERE user_id = $1
      AND booking_date = $2
      AND start_time = $3
      AND status IN (
        'pending',
        'pending_email_confirmation',
        'email_confirmed',
        'confirmed'
      )
    LIMIT 1
    `,
    [input.userId, input.bookingDate, input.startTime]
  );

  return (result.rowCount ?? 0) > 0;
}

export async function confirmCalendarBookingByToken(token: string) {
  const result = await pool.query<CalendarBookingRow>(
    `
    UPDATE calendar_bookings
    SET
      status = 'confirmed',
      email_confirmed_at = NOW(),
      updated_at = NOW()
    WHERE confirmation_token = $1
      AND status = 'pending_email_confirmation'
      AND confirmation_expires_at > NOW()
    RETURNING *
    `,
    [token]
  );

  return result.rows[0] || null;
}

export async function findCalendarBookingByConfirmationToken(token: string) {
  const result = await pool.query<CalendarBookingRow>(
    `
    SELECT *
    FROM calendar_bookings
    WHERE confirmation_token = $1
    LIMIT 1
    `,
    [token]
  );

  return result.rows[0] || null;
}