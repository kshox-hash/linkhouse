import DB from "../../db/db_configuration";

const pool = DB.getPool();

export type CalendarSettingsRow = {
  id: number;
  user_id: string;
  opening_time: string;
  closing_time: string;
  slot_duration_minutes: number;
  max_days_ahead: number;
  timezone: string;
};

export type CalendarAvailabilityRow = {
  id: number;
  user_id: string;
  weekday: number;
  is_active: boolean;
};

export type CalendarBlockedDateRow = {
  id: number;
  user_id: string;
  blocked_date: string;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
};

export type CalendarBookingRow = {
  id: number;
  user_id: string;
  lead_id: string;
  customer_name: string;
  customer_phone: string;
  notes: string | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
};

export async function getCalendarSettings(userId: string) {
  const result = await pool.query<CalendarSettingsRow>(
    `
    SELECT *
    FROM calendar_settings
    WHERE user_id = $1
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
    ORDER BY weekday ASC
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
  leadId: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
}) {
  const result = await pool.query<CalendarBookingRow>(
    `
    INSERT INTO calendar_bookings (
      user_id,
      lead_id,
      customer_name,
      customer_phone,
      notes,
      booking_date,
      start_time,
      end_time,
      status,
      created_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'confirmed',NOW())
    RETURNING *
    `,
    [
      input.userId,
      input.leadId,
      input.customerName,
      input.customerPhone,
      input.notes || null,
      input.bookingDate,
      input.startTime,
      input.endTime,
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
      AND status <> 'cancelled'
    LIMIT 1
    `,
    [input.userId, input.bookingDate, input.startTime]
  );

    // rowCount can be null in some typings/environments, coalesce to 0
    return (result?.rowCount ?? 0) > 0;
}