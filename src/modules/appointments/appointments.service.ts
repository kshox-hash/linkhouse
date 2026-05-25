import {
  bookingExists,
  createCalendarBooking,
  getCalendarAvailability,
  getCalendarBlockedDates,
  getCalendarBookings,
  getCalendarSettings,
} from "./appointments.repository";

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function normalizeDbTime(time: string): string {
  return String(time || "").slice(0, 5);
}

function timeToMinutes(time: string): number {
  const clean = normalizeDbTime(time);
  const [h, m] = clean.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function addMinutes(time: string, minutes: number): string {
  return minutesToTime(timeToMinutes(time) + minutes);
}

function getChileWeekday(date: Date): number {
  const jsDay = date.getDay();
  return jsDay === 0 ? 7 : jsDay;
}

export async function buildCalendarSlots(userId: string) {
  const settings = await getCalendarSettings(userId);

  if (!settings) {
    return { slots: [] };
  }

  const availability = await getCalendarAvailability(userId);

  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + Number(settings.max_days_ahead || 30));

  const from = toDateString(today);
  const to = toDateString(endDate);

  const bookings = await getCalendarBookings(userId, from, to);
  const blockedDates = await getCalendarBlockedDates(userId, from, to);

  const activeWeekdays = new Set(
    availability.filter((d) => d.is_active).map((d) => Number(d.weekday))
  );

  const slots: Array<{ date: string; times: string[] }> = [];

  for (let i = 0; i <= Number(settings.max_days_ahead || 30); i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const dateStr = toDateString(date);
    const weekday = getChileWeekday(date);

    if (!activeWeekdays.has(weekday)) continue;

    const dayBookings = bookings.filter((b) => b.booking_date === dateStr);
    const dayBlocks = blockedDates.filter((b) => b.blocked_date === dateStr);

    const times: string[] = [];

    let current = timeToMinutes(settings.opening_time);
    const closing = timeToMinutes(settings.closing_time);
    const duration = Number(settings.slot_duration_minutes || 30);

    while (current + duration <= closing) {
      const startTime = minutesToTime(current);
      const endTime = minutesToTime(current + duration);

      const isBooked = dayBookings.some(
        (b) => normalizeDbTime(b.start_time) === startTime
      );

      const isBlocked = dayBlocks.some((block) => {
        if (!block.start_time || !block.end_time) return true;

        const blockStart = timeToMinutes(block.start_time);
        const blockEnd = timeToMinutes(block.end_time);

        return current < blockEnd && current + duration > blockStart;
      });

      if (!isBooked && !isBlocked) {
        times.push(startTime);
      }

      current += duration;
    }

    if (times.length > 0) {
      slots.push({
        date: dateStr,
        times,
      });
    }
  }

  return { slots };
}

export async function reserveCalendarSlot(input: {
  userId: string;
  leadId: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  bookingDate: string;
  startTime: string;
}) {
  const settings = await getCalendarSettings(input.userId);

  if (!settings) {
    throw new Error("Calendario no configurado.");
  }

  const exists = await bookingExists({
    userId: input.userId,
    bookingDate: input.bookingDate,
    startTime: input.startTime,
  });

  if (exists) {
    throw new Error("Este horario ya fue reservado.");
  }

  const endTime = addMinutes(
    input.startTime,
    Number(settings.slot_duration_minutes || 30)
  );

  return createCalendarBooking({
    userId: input.userId,
    leadId: input.leadId,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    notes: input.notes,
    bookingDate: input.bookingDate,
    startTime: input.startTime,
    endTime,
  });
}