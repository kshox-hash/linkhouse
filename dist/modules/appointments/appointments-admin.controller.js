"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarAdminController = void 0;
const appointments_admin_repository_1 = require("./appointments-admin.repository");
exports.calendarAdminController = {
    async getSettings(req, res) {
        try {
            const userId = String(req.params["userId"] || "").trim();
            const authUserId = String(req.user?.userId ?? "").trim();
            if (!userId)
                return res.status(400).json({ ok: false, message: "userId requerido." });
            if (userId !== authUserId)
                return res.status(403).json({ ok: false, message: "Sin permisos." });
            const data = await (0, appointments_admin_repository_1.getCalendarSettingsByUserId)(userId);
            return res.json({ ok: true, ...data });
        }
        catch (error) {
            console.error("Error obteniendo configuración calendario:", error);
            return res.status(500).json({ ok: false, message: "No se pudo obtener la configuración." });
        }
    },
    async saveSettings(req, res) {
        try {
            const userId = String(req.user?.userId ?? "").trim();
            if (!userId)
                return res.status(401).json({ ok: false, message: "No autorizado." });
            const body = req.body || {};
            const openingTime = String(body.openingTime || "").trim();
            const closingTime = String(body.closingTime || "").trim();
            const slotDurationMinutes = Number(body.slotDurationMinutes || 30);
            const maxDaysAhead = Number(body.maxDaysAhead || 30);
            const activeWeekdays = Array.isArray(body.activeWeekdays)
                ? body.activeWeekdays.map(Number).filter((n) => n >= 1 && n <= 7)
                : [];
            const blockedDates = Array.isArray(body.blockedDates) ? body.blockedDates : [];
            if (!openingTime || !closingTime) {
                return res.status(400).json({ ok: false, message: "Faltan datos obligatorios." });
            }
            if (!activeWeekdays.length) {
                return res.status(400).json({ ok: false, message: "Debe existir al menos un día activo." });
            }
            const saved = await (0, appointments_admin_repository_1.saveCalendarSettings)({
                userId,
                openingTime,
                closingTime,
                slotDurationMinutes,
                maxDaysAhead,
                timezone: body.timezone || "America/Santiago",
                activeWeekdays,
                blockedDates,
            });
            return res.json({ ok: true, message: "Configuración guardada correctamente.", settings: saved });
        }
        catch (error) {
            console.error("Error guardando configuración calendario:", error);
            return res.status(500).json({ ok: false, message: "No se pudo guardar la configuración." });
        }
    },
    async getBookings(req, res) {
        try {
            const userId = String(req.params["userId"] || "").trim();
            const authUserId = String(req.user?.userId ?? "").trim();
            if (!userId)
                return res.status(400).json({ ok: false, message: "userId requerido." });
            if (userId !== authUserId)
                return res.status(403).json({ ok: false, message: "Sin permisos." });
            const bookings = await (0, appointments_admin_repository_1.getCalendarBookingsByUserId)(userId);
            return res.json({ ok: true, bookings });
        }
        catch (error) {
            console.error("Error obteniendo reservas calendario:", error);
            return res.status(500).json({ ok: false, message: "No se pudieron obtener las reservas." });
        }
    },
    async rescheduleBooking(req, res) {
        try {
            const id = String(req.params["id"] || "").trim();
            const authUserId = String(req.user?.userId ?? "").trim();
            const body = req.body || {};
            const bookingDate = String(body.bookingDate || "").trim();
            const startTime = String(body.startTime || "").trim();
            const endTime = String(body.endTime || "").trim();
            if (!id || !bookingDate || !startTime || !endTime) {
                return res.status(400).json({ ok: false, message: "Faltan campos requeridos." });
            }
            const updated = await (0, appointments_admin_repository_1.rescheduleBooking)(id, bookingDate, startTime, endTime, authUserId);
            if (!updated)
                return res.status(404).json({ ok: false, message: "Reserva no encontrada." });
            return res.json({ ok: true, booking: updated });
        }
        catch (error) {
            console.error("Error reagendando reserva:", error);
            return res.status(500).json({ ok: false, message: "No se pudo reagendar." });
        }
    },
    async updateBookingStatus(req, res) {
        try {
            const id = String(req.params["id"] || "").trim();
            const authUserId = String(req.user?.userId ?? "").trim();
            const status = String((req.body || {}).status || "").trim();
            if (!id || !status) {
                return res.status(400).json({ ok: false, message: "id y status son requeridos." });
            }
            const updated = await (0, appointments_admin_repository_1.updateBookingStatus)(id, status, authUserId);
            if (!updated)
                return res.status(404).json({ ok: false, message: "Reserva no encontrada." });
            return res.json({ ok: true, booking: updated });
        }
        catch (error) {
            console.error("Error actualizando estado de reserva:", error);
            return res.status(400).json({
                ok: false,
                message: error instanceof Error ? error.message : "No se pudo actualizar.",
            });
        }
    },
};
