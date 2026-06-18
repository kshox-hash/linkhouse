"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mpWebhookController = void 0;
const mp_webhook_service_1 = require("./mp-webhook.service");
exports.mpWebhookController = {
    async handle(req, res) {
        const topic = req.query["topic"] ?? req.query["type"] ?? req.body?.type;
        if (topic && topic !== "payment") {
            return res.status(200).json({ ok: true, ignored: true, topic });
        }
        const paymentId = String(req.body?.data?.id ?? req.query["data.id"] ?? req.query["id"] ?? "").trim();
        if (!paymentId) {
            return res.status(200).json({ ok: true, ignored: true, reason: "sin paymentId" });
        }
        const xSignature = req.headers["x-signature"];
        const xRequestId = req.headers["x-request-id"];
        try {
            (0, mp_webhook_service_1.verifyMpSignature)(xSignature, xRequestId, paymentId);
        }
        catch (sigError) {
            console.error("[webhook] Firma inválida:", sigError.message);
            return res.status(401).json({ ok: false, message: "Firma inválida" });
        }
        const mpUserId = String(req.body?.user_id ?? "").trim() || undefined;
        try {
            const result = await (0, mp_webhook_service_1.processApprovedPayment)(paymentId, mpUserId);
            if (result.skipped) {
                return res.status(200).json({
                    ok: true,
                    ignored: true,
                    reason: result.reason,
                    ...(result.bookingId ? { bookingId: result.bookingId } : {}),
                });
            }
            return res.status(200).json({
                ok: true,
                message: "Pago procesado correctamente",
                bookingId: result.bookingId,
            });
        }
        catch (error) {
            console.error("[webhook] Error procesando pago:", error);
            // MP requiere 200 siempre — un 500 provoca reintentos y baja el score de integración
            return res.status(200).json({ ok: false, message: "Error interno, reintento no necesario" });
        }
    },
};
