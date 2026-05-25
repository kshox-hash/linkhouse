import DB from "../../db/db_configuration";

const pool = DB.getPool();

export type SaveCalendarSettingsInput = {
  userId: string;
  openingTime: string;
  closingTime: string;
  slotDurationMinutes: number;
  maxDaysAhead: number;
  timezone?: string;
  activeWeekdays: number[];
  blockedDates?: Array<{
    blockedDate: string;
    startTime?: string | null;
    endTime?: string | null;
    reason?: string | null;
  }>;
};

export async function getCalendarSettingsByUserId(userId: string) {
  const settings = await pool.query(
    `
    SELECT *
    FROM calendar_settings
    WHERE user_id = $1
    LIMIT 1
    `,
    [userId]
  );

  const availability = await pool.query(
    `
    SELECT *
    FROM calendar_availability
    WHERE user_id = $1
    ORDER BY weekday ASC
    `,
    [userId]
  );

  const blockedDates = await pool.query(
    `
    SELECT *
    FROM calendar_blocked_dates
    WHERE user_id = $1
    ORDER BY blocked_date ASC, start_time ASC
    `,
    [userId]
  );

  return {
    settings: settings.rows[0] || null,
    availability: availability.rows,
    blockedDates: blockedDates.rows,
  };
}

export async function saveCalendarSettings(input: SaveCalendarSettingsInput) {
  return DB.withTransaction(async (client) => {
    const settingsResult = await client.query(
      `
      INSERT INTO calendar_settings (
        user_id,
        opening_time,
        closing_time,
        slot_duration_minutes,
        max_days_ahead,
        timezone,
        updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET
        opening_time = EXCLUDED.opening_time,
        closing_time = EXCLUDED.closing_time,
        slot_duration_minutes = EXCLUDED.slot_duration_minutes,
        max_days_ahead = EXCLUDED.max_days_ahead,
        timezone = EXCLUDED.timezone,
        updated_at = NOW()
      RETURNING *
      `,
      [
        input.userId,
        input.openingTime,
        input.closingTime,
        input.slotDurationMinutes,
        input.maxDaysAhead,
        input.timezone || "America/Santiago",
      ]
    );

    await client.query(
      `
      DELETE FROM calendar_availability
      WHERE user_id = $1
      `,
      [input.userId]
    );

    for (const weekday of input.activeWeekdays) {
      await client.query(
        `
        INSERT INTO calendar_availability (
          user_id,
          weekday,
          is_active,
          created_at,
          updated_at
        )
        VALUES ($1,$2,true,NOW(),NOW())
        `,
        [input.userId, weekday]
      );
    }

    await client.query(
      `
      DELETE FROM calendar_blocked_dates
      WHERE user_id = $1
      `,
      [input.userId]
    );

    for (const block of input.blockedDates || []) {
      await client.query(
        `
        INSERT INTO calendar_blocked_dates (
          user_id,
          blocked_date,
          start_time,
          end_time,
          reason,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,NOW(),NOW())
        `,
        [
          input.userId,
          block.blockedDate,
          block.startTime || null,
          block.endTime || null,
          block.reason || null,
        ]
      );
    }

    return settingsResult.rows[0];
  });
}

export async function getCalendarBookingsByUserId(userId: string) {
  const result = await pool.query(
    `
    SELECT *
    FROM calendar_bookings
    WHERE user_id = $1
      AND status <> 'cancelled'
    ORDER BY booking_date ASC, start_time ASC
    `,
    [userId]
  );

  return result.rows;
}