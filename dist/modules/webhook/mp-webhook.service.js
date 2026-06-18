"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMpSignature = verifyMpSignature;
exports.processApprovedPayment = processApprovedPayment;
const crypto_1 = __importDefault(require("crypto"));
const mercado_service_1 = require("../payments/mercado.service");
const mp_webhook_repository_1 = require("./mp-webhook.repository");
const bookingPaidEmailService_1 = require("../calendar/booking/services/bookingPaidEmailService");
const businessBookingPaidEmailService_1 = require("../calendar/booking/services/businessBookingPaidEmailService");
const stadistics_service_1 = require("../stadistics/stadistics.service");
const statsService = new stadistics_service_1.StatisticsService();
const WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET ?? "";
const ACCESS_TOKEN_MP = process.env.ACCESS_TOKEN_MP ?? "";
/**
 * Verifica la firma HMAC-SHA256 que MercadoPago envía en x-signature.
 * Lanza un error si la firma es inválida o ausente.
 *
 * Formato del header x-signature: "ts=1704067200,v1=abc123..."
 * Manifest: "id:<paymentId>;request-id:<xRequestId>;ts:<ts>;"
 */
function verifyMpSignature(xSignature, xRequestId, paymentId) {
    if (!WEBHOOK_SECRET) {
        throw new Error("MP_WEBHOOK_SECRET no está configurado");
    }
    if (!xSignature) {
        throw new Error("Header x-signature ausente");
    }
    const parts = Object.fromEntries(xSignature.split(",").map((part) => {
        const idx = part.indexOf("=");
        return [part.slice(0, idx), part.slice(idx + 1)];
    }));
    const ts = parts["ts"];
    const v1 = parts["v1"];
    if (!ts || !v1) {
        throw new Error("Header x-signature malformado");
    }
    const segments = [];
    if (paymentId)
        segments.push(`id:${paymentId}`);
    if (xRequestId)
        segments.push(`request-id:${xRequestId}`);
    segments.push(`ts:${ts}`);
    const manifest = segments.join(";") + ";";
    const expected = crypto_1.default
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(manifest)
        .digest("hex");
    if (expected.length !== v1.length ||
        !crypto_1.default.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))) {
        throw new Error("Firma HMAC inválida");
    }
}
async function processApprovedPayment(paymentId, mpUserId) {
    // Buscar el token del vendedor por su MP user ID; si no existe, usar el global como fallback
    let accessToken = mpUserId ? await (0, mp_webhook_repository_1.getAccessTokenByMpUserId)(String(mpUserId)) : null;
    if (!accessToken) {
        if (!ACCESS_TOKEN_MP)
            throw new Error("No se encontró token de MercadoPago para procesar el pago");
        accessToken = ACCESS_TOKEN_MP;
    }
    const paymentInfo = await (0, mercado_service_1.getPaymentById)(accessToken, paymentId);
    if (paymentInfo.status !== "approved") {
        return { skipped: true, reason: `status=${paymentInfo.status}` };
    }
    const bookingId = String(paymentInfo.external_reference ?? "").trim();
    if (!bookingId) {
        return { skipped: true, reason: "pago aprobado sin external_reference" };
    }
    const payment = await (0, mp_webhook_repository_1.markPaymentAsPaid)(bookingId, paymentId);
    if (!payment) {
        return { skipped: true, reason: "pago ya procesado anteriormente", bookingId };
    }
    const booking = await (0, mp_webhook_repository_1.confirmBooking)(bookingId);
    if (!booking) {
        return { skipped: false, bookingId };
    }
    const businessName = (await (0, mp_webhook_repository_1.getBusinessNameByUserId)(booking.user_id)) ?? "Negocio";
    const bookingDateStr = new Date(booking.booking_date).toLocaleDateString("es-CL");
    const bookingTimeStr = String(booking.start_time).slice(0, 5);
    statsService.increment(booking.user_id, "booking_paid").catch(() => { });
    if (booking.client_email) {
        (0, bookingPaidEmailService_1.sendBookingPaidEmail)({
            to: booking.client_email,
            customerName: booking.client_name || "Cliente",
            businessName,
            bookingDate: bookingDateStr,
            bookingTime: bookingTimeStr,
        }).catch((e) => console.error("[webhook] Error email cliente:", e));
    }
    const businessEmail = process.env.BUSINESS_NOTIFICATION_EMAIL;
    if (businessEmail) {
        (0, businessBookingPaidEmailService_1.sendBusinessBookingPaidEmail)({
            to: businessEmail,
            businessName,
            customerName: booking.client_name || "Cliente",
            customerEmail: booking.client_email || "",
            customerPhone: booking.client_phone || "",
            bookingDate: bookingDateStr,
            bookingTime: bookingTimeStr,
            amount: Number(payment.amount || 0),
        }).catch((e) => console.error("[webhook] Error email negocio:", e));
    }
    return { skipped: false, bookingId };
}
