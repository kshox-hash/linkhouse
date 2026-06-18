"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startReminderCron = startReminderCron;
const node_cron_1 = __importDefault(require("node-cron"));
const reminder_repository_1 = require("./reminder.repository");
const bookingReminderEmailService_1 = require("../calendar/booking/services/bookingReminderEmailService");
async function runReminderJob() {
    let bookings;
    try {
        bookings = await (0, reminder_repository_1.getBookingsDueTomorrow)();
    }
    catch (err) {
        console.error("[reminders] Error consultando reservas:", err);
        return;
    }
    if (bookings.length === 0)
        return;
    console.log(`[reminders] Enviando ${bookings.length} recordatorio(s)...`);
    for (const booking of bookings) {
        try {
            const bookingDateStr = new Date(booking.booking_date).toLocaleDateString("es-CL", {
                weekday: "long",
                day: "numeric",
                month: "long",
            });
            const bookingTime = String(booking.start_time).slice(0, 5);
            await (0, bookingReminderEmailService_1.sendBookingReminderEmail)(booking.client_email, {
                customerName: booking.client_name || "Cliente",
                businessName: booking.business_name || "el negocio",
                businessPhone: booking.business_phone ?? undefined,
                bookingDate: bookingDateStr,
                bookingTime,
            });
            await (0, reminder_repository_1.markReminderSent)(booking.id);
            console.log(`[reminders] Recordatorio enviado → ${booking.client_email} (booking ${booking.id})`);
        }
        catch (err) {
            console.error(`[reminders] Error enviando a ${booking.client_email}:`, err);
        }
    }
}
function startReminderCron() {
    // Corre cada hora en punto
    node_cron_1.default.schedule("0 * * * *", () => {
        runReminderJob().catch((err) => console.error("[reminders] Error inesperado en cron:", err));
    });
    console.log("[reminders] Cron de recordatorios iniciado (cada hora)");
}
