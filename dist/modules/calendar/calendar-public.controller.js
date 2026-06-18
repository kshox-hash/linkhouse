"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarPublicController = void 0;
const stadistics_service_1 = require("../stadistics/stadistics.service");
const appointments_service_1 = require("../appointments/appointments.service");
const statsService = new stadistics_service_1.StatisticsService();
const appointments_screen_1 = require("../appointments/appointments.screen");
const slug_service_1 = require("../slug/slug.service");
const calendar_providers_repository_1 = require("../appointments/calendar-providers.repository");
const mercado_service_1 = require("../payments/mercado.service");
const bookingTokenService_1 = require("./booking/services/bookingTokenService");
const calendar_public_repository_1 = require("./calendar-public.repository");
const calendar_services_repository_1 = require("../appointments/calendar-services.repository");
const bookingPaymentLinkEmailService_1 = require("./booking/services/bookingPaymentLinkEmailService");
const bookingPaidEmailService_1 = require("./booking/services/bookingPaidEmailService");
exports.calendarPublicController = {
    async getProviders(req, res) {
        try {
            const publicSlug = String(req.params["publicSlug"] || "").trim();
            if (!publicSlug)
                return res.status(400).json({ ok: false, message: "Slug obligatorio." });
            const profile = await (0, slug_service_1.getSlugByValueService)(publicSlug);
            if (!profile)
                return res.status(404).json({ ok: false, message: "Negocio no encontrado." });
            const providers = await (0, calendar_providers_repository_1.getActiveProvidersByUserId)(profile.user_id);
            return res.json({ ok: true, providers });
        }
        catch (error) {
            console.error("[calendar] Error obteniendo proveedores:", error);
            return res.status(500).json({ ok: false, message: "No se pudo cargar el equipo." });
        }
    },
    async getSlots(req, res) {
        try {
            const publicSlug = String(req.params["publicSlug"] || "").trim();
            if (!publicSlug) {
                return res.status(400).json({ ok: false, message: "Slug público obligatorio." });
            }
            const profile = await (0, slug_service_1.getSlugByValueService)(publicSlug);
            if (!profile) {
                return res.status(404).json({ ok: false, message: "Negocio no encontrado." });
            }
            const providerId = String(req.query["providerId"] || "").trim() || null;
            const data = await (0, appointments_service_1.buildCalendarSlots)(profile.user_id, providerId);
            return res.json(data);
        }
        catch (error) {
            console.error("[calendar] Error obteniendo slots:", error);
            return res.status(500).json({ ok: false, message: "No se pudo cargar la disponibilidad." });
        }
    },
    async openReservas(req, res) {
        try {
            const publicSlug = String(req.params["publicSlug"] || "").trim();
            if (!publicSlug) {
                return res.status(400).send("Slug público obligatorio");
            }
            const profile = await (0, slug_service_1.getSlugByValueService)(publicSlug);
            if (!profile) {
                return res.status(404).send("Negocio no encontrado");
            }
            const html = (0, appointments_screen_1.renderBookingHtml)({
                publicSlug,
                title: "Reserva tu hora",
                brand: profile.business_name,
                subtitle: "Elige el día y horario disponible para agendar tu atención.",
                successMessage: "Te enviamos un correo para confirmar tu hora.",
            });
            return res.status(200).send(html);
        }
        catch (error) {
            console.error("[calendar] Error abriendo reservas:", error);
            return res.status(500).send("Error abriendo reservas");
        }
    },
    async createBooking(req, res) {
        try {
            const publicSlug = String(req.params["publicSlug"] || "").trim();
            if (!publicSlug) {
                return res.status(400).json({ ok: false, message: "Slug público obligatorio." });
            }
            const profile = await (0, slug_service_1.getSlugByValueService)(publicSlug);
            if (!profile) {
                return res.status(404).json({ ok: false, message: "Negocio no encontrado." });
            }
            const body = req.body || {};
            const customer = body.customer || {};
            const slot = body.slot || {};
            const customerName = String(customer.name || "").trim();
            const customerPhone = String(customer.phone || "").trim();
            const customerEmail = String(customer.email || "").trim();
            const notes = String(customer.notes || "").trim();
            const bookingDate = String(slot.date || "").trim();
            const startTime = String(slot.time || "").trim();
            const providerId = String(body.providerId || "").trim() || null;
            if (!customerName || !customerPhone || !customerEmail || !bookingDate || !startTime) {
                return res.status(400).json({ ok: false, message: "Faltan datos para reservar." });
            }
            const serviceId = String(body.serviceId || "").trim() || null;
            // Resolve service data
            let servicePrice = null;
            let serviceName = null;
            let serviceColor = null;
            if (serviceId) {
                const svc = await (0, calendar_services_repository_1.getServiceById)(serviceId, profile.user_id);
                if (svc) {
                    servicePrice = svc.price;
                    serviceName = svc.name;
                    serviceColor = svc.color;
                }
            }
            const confirmationToken = (0, bookingTokenService_1.createBookingConfirmationToken)();
            const confirmationExpiresAt = (0, bookingTokenService_1.createBookingConfirmationExpiresAt)();
            const booking = await (0, appointments_service_1.reserveCalendarSlot)({
                userId: profile.user_id,
                customerName,
                customerPhone,
                customerEmail,
                notes,
                bookingDate,
                startTime,
                confirmationToken,
                confirmationExpiresAt,
                providerId,
                serviceId,
                serviceName,
                serviceColor,
                servicePrice,
            });
            // Crear preferencia de pago o confirmar gratis
            let checkoutUrl = null;
            const businessName = await (0, calendar_public_repository_1.getBusinessNameByUserId)(profile.user_id);
            const bookingDateLabel = new Date(bookingDate).toLocaleDateString("es-CL", {
                weekday: "long", day: "numeric", month: "long",
            });
            try {
                const accessToken = await (0, calendar_public_repository_1.getMpAccessToken)(profile.user_id);
                const amount = Number(booking.payment_amount ?? 0);
                if (amount === 0) {
                    // Reserva gratuita — confirmar inmediatamente y notificar al cliente
                    await (0, calendar_public_repository_1.confirmFreeBooking)(booking.id);
                    (0, bookingPaidEmailService_1.sendBookingPaidEmail)({
                        to: customerEmail,
                        customerName,
                        businessName,
                        bookingDate: bookingDateLabel,
                        bookingTime: startTime,
                    }).catch((err) => console.error("[calendar] Error enviando email de confirmación:", err));
                }
                else if (accessToken) {
                    // Reserva con precio — iniciar flujo de pago MP
                    const feePct = await (0, calendar_public_repository_1.getPlatformFeePct)(profile.user_id);
                    const marketplaceFee = Math.round(amount * feePct / 100);
                    const payment = await (0, calendar_public_repository_1.createPaymentRecord)(profile.user_id, booking.id, amount);
                    const bookingDateStr = new Date(bookingDate).toLocaleDateString("es-CL");
                    const preference = await (0, mercado_service_1.createPreference)({
                        accessToken,
                        bookingId: booking.id,
                        title: `Reserva ${businessName}`,
                        description: `${bookingDateStr} a las ${startTime} - ${customerName}`,
                        amount,
                        customerEmail,
                        customerName,
                        businessName,
                        marketplaceFee,
                    });
                    if (preference.checkoutUrl) {
                        await (0, calendar_public_repository_1.updatePaymentWithPreference)(payment.id, preference.checkoutUrl, preference.preferenceId ?? "");
                        checkoutUrl = preference.checkoutUrl;
                        (0, bookingPaymentLinkEmailService_1.sendBookingPaymentLinkEmail)({
                            to: customerEmail,
                            customerName,
                            businessName,
                            bookingDate: bookingDateLabel,
                            bookingTime: startTime,
                            checkoutUrl,
                        }).catch((err) => console.error("[calendar] Error enviando email de pago:", err));
                    }
                }
                // Si amount > 0 pero no hay accessToken: reserva queda pending_payment sin confirmar
            }
            catch (err) {
                console.error("[calendar] Error en flujo post-reserva:", err);
            }
            statsService.increment(profile.user_id, "booking_created").catch(() => { });
            return res.json({
                ok: true,
                booking,
                checkoutUrl,
            });
        }
        catch (error) {
            console.error("[calendar] Error creando reserva:", error);
            return res.status(500).json({
                ok: false,
                message: error instanceof Error ? error.message : "No se pudo crear la reserva.",
            });
        }
    },
    async createPayment(req, res) {
        try {
            const publicSlug = String(req.params["publicSlug"] || "").trim();
            const bookingId = String(req.params["bookingId"] || "").trim();
            if (!publicSlug || !bookingId) {
                return res.status(400).json({ ok: false, message: "Parámetros inválidos." });
            }
            const profile = await (0, slug_service_1.getSlugByValueService)(publicSlug);
            if (!profile) {
                return res.status(404).json({ ok: false, message: "Negocio no encontrado." });
            }
            const booking = await (0, calendar_public_repository_1.getBookingForPayment)(bookingId, profile.user_id);
            if (!booking) {
                return res.status(404).json({ ok: false, message: "Reserva no encontrada." });
            }
            if (booking.payment_status === "paid") {
                return res.status(400).json({ ok: false, message: "Esta reserva ya está pagada." });
            }
            const existingPayment = await (0, calendar_public_repository_1.getPendingPayment)(bookingId, profile.user_id);
            if (existingPayment?.checkout_url) {
                return res.json({
                    ok: true,
                    message: "Ya existe un pago pendiente para esta reserva.",
                    checkoutUrl: existingPayment.checkout_url,
                    preferenceId: existingPayment.preference_id,
                    booking,
                    payment: existingPayment,
                });
            }
            const amount = Number(booking.payment_amount ?? 0);
            if (!Number.isFinite(amount) || amount <= 0) {
                return res.status(400).json({ ok: false, message: "Monto inválido para el pago." });
            }
            const accessToken = await (0, calendar_public_repository_1.getMpAccessToken)(profile.user_id);
            if (!accessToken) {
                return res.status(400).json({
                    ok: false,
                    message: "Mercado Pago no está configurado para este negocio.",
                });
            }
            const businessName = await (0, calendar_public_repository_1.getBusinessNameByUserId)(profile.user_id);
            const feePct = await (0, calendar_public_repository_1.getPlatformFeePct)(profile.user_id);
            const marketplaceFee = Math.round(amount * feePct / 100);
            const payment = await (0, calendar_public_repository_1.createPaymentRecord)(profile.user_id, bookingId, amount);
            const bookingDateStr = new Date(booking.booking_date).toLocaleDateString("es-CL");
            const preference = await (0, mercado_service_1.createPreference)({
                accessToken,
                bookingId,
                title: `Reserva ${businessName}`,
                description: `Hora agendada el ${bookingDateStr} a las ${booking.start_time.slice(0, 5)} - ${booking.client_name}`,
                amount,
                customerEmail: booking.client_email,
                customerName: booking.client_name,
                businessName,
                marketplaceFee,
            });
            const updatedPayment = await (0, calendar_public_repository_1.updatePaymentWithPreference)(payment.id, preference.checkoutUrl, preference.preferenceId);
            return res.json({
                ok: true,
                message: "Pago creado correctamente.",
                checkoutUrl: preference.checkoutUrl,
                sandboxUrl: preference.sandboxUrl,
                preferenceId: preference.preferenceId,
                booking,
                payment: updatedPayment,
            });
        }
        catch (error) {
            console.error("[calendar] Error creando pago:", error);
            return res.status(500).json({
                ok: false,
                message: error instanceof Error ? error.message : "No se pudo crear el pago.",
            });
        }
    },
};
