import DB from "../../db/db_configuration";

export type CalendarBlock = {
  id: string;
  user_id: string;
  start_at: string;
  end_at: string;
  reason: string | null;
  created_at: string;
};

function parseDateOnly(ts: string): string {
  return ts.slice(0, 10);
}

function generateDateRange(startAt: string, endAt: string): string[] {
  const startStr = parseDateOnly(startAt);
  const endStr   = parseDateOnly(endAt);
  const dates: string[] = [];
  const cur = new Date(`${startStr}T12:00:00Z`);
  const end = new Date(`${endStr}T12:00:00Z`);
  while (cur <= end) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}

function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "").slice(0, 10);
}

function toCreatedAt(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value ?? "");
}

export async function getBlocks(userId: string): Promise<CalendarBlock[]> {
  const pool = DB.getPool();
  const today = new Date().toISOString().slice(0, 10);
  const result = await pool.query(
    `SELECT id, user_id, blocked_date, reason, created_at
     FROM calendar_blocked_dates
     WHERE user_id = $1 AND blocked_date >= $2 AND is_full_day = true
     ORDER BY blocked_date ASC`,
    [userId, today]
  );
  return result.rows.map((row) => {
    const date = toIsoDate(row.blocked_date);
    return {
      id: row.id,
      user_id: row.user_id,
      start_at: `${date}T00:00:00`,
      end_at:   `${date}T23:59:00`,
      reason:    row.reason ?? null,
      created_at: toCreatedAt(row.created_at),
    };
  });
}

export async function createBlock(
  userId: string,
  startAt: string,
  endAt: string,
  reason: string | null
): Promise<CalendarBlock[]> {
  const pool  = DB.getPool();
  const dates = generateDateRange(startAt, endAt);
  const created: CalendarBlock[] = [];

  for (const date of dates) {
    const result = await pool.query(
      `INSERT INTO calendar_blocked_dates (user_id, blocked_date, start_time, end_time, is_full_day, reason)
       SELECT $1, $2::date, NULL, NULL, true, $3
       WHERE NOT EXISTS (
         SELECT 1 FROM calendar_blocked_dates
         WHERE user_id = $1 AND blocked_date = $2::date AND is_full_day = true
       )
       RETURNING id, user_id, blocked_date, reason, created_at`,
      [userId, date, reason ?? null]
    );
    if (result.rows[0]) {
      const row     = result.rows[0];
      const dateStr = toIsoDate(row.blocked_date);
      created.push({
        id:         row.id,
        user_id:    row.user_id,
        start_at:   `${dateStr}T00:00:00`,
        end_at:     `${dateStr}T23:59:00`,
        reason:     row.reason ?? null,
        created_at: toCreatedAt(row.created_at),
      });
    }
  }
  return created;
}

export async function deleteBlock(id: string, userId: string): Promise<void> {
  const pool = DB.getPool();
  await pool.query(
    `DELETE FROM calendar_blocked_dates WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
}
