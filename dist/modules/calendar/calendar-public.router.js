"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const calendar_public_controller_1 = require("./calendar-public.controller");
const bookingConfirmation_service_1 = require("./booking/services/bookingConfirmation.service");
const bookingConfirmationSuccessHtml_1 = require("./booking/views/bookingConfirmationSuccessHtml");
const bookingConfirmationErrorHtml_1 = require("./booking/views/bookingConfirmationErrorHtml");
const slug_service_1 = require("../slug/slug.service");
const calendar_services_repository_1 = require("../appointments/calendar-services.repository");
const router = express_1.default.Router();
// Servicios de reserva públicos (para el selector en el portal)
router.get("/api/public/:publicSlug/booking-services", async (req, res) => {
    try {
        const publicSlug = String(req.params["publicSlug"] || "").trim();
        const profile = await (0, slug_service_1.getSlugByValueService)(publicSlug);
        if (!profile)
            return res.status(404).json({ ok: false, message: "Negocio no encontrado." });
        const services = await (0, calendar_services_repository_1.getActiveServicesByUserId)(profile.user_id);
        return res.json({ ok: true, services });
    }
    catch (err) {
        console.error("[calendar] Error obteniendo servicios:", err);
        return res.status(500).json({ ok: false, message: "No se pudieron cargar los servicios." });
    }
});
// Página pública de reservas
router.get("/open/:publicSlug/reservas", calendar_public_controller_1.calendarPublicController.openReservas);
// Equipo/proveedores públicos
router.get("/api/public/:publicSlug/providers", calendar_public_controller_1.calendarPublicController.getProviders);
// Slots disponibles (acepta ?providerId=xxx)
router.get("/api/public/:publicSlug/slots", calendar_public_controller_1.calendarPublicController.getSlots);
// Crear reserva
router.post("/api/public/:publicSlug/bookings", calendar_public_controller_1.calendarPublicController.createBooking);
// Crear pago para una reserva
router.post("/api/public/:publicSlug/bookings/:bookingId/pay", calendar_public_controller_1.calendarPublicController.createPayment);
// Confirmación de reserva por token (email)
router.get("/api/bookings/confirm/:token", async (req, res) => {
    try {
        const token = String(req.params["token"] || "");
        const result = await (0, bookingConfirmation_service_1.confirmBookingByToken)(token);
        if (!result.ok) {
            return res.status(400).send((0, bookingConfirmationErrorHtml_1.renderBookingConfirmationErrorHtml)(result.message));
        }
        return res.send((0, bookingConfirmationSuccessHtml_1.renderBookingConfirmationSuccessHtml)());
    }
    catch (error) {
        console.error("[calendar] Error confirmando reserva:", error);
        return res.status(500).send((0, bookingConfirmationErrorHtml_1.renderBookingConfirmationErrorHtml)("Ocurrió un error confirmando la reserva."));
    }
});
exports.default = router;
