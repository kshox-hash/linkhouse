"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatPublicController = void 0;
const slug_service_1 = require("../slug/slug.service");
const chat_repository_1 = require("./chat.repository");
const chat_config_repository_1 = require("./chat-config.repository");
const chat_service_1 = require("./chat.service");
const products_repository_1 = require("../quotes/products/products.repository");
const appointments_service_1 = require("../appointments/appointments.service");
exports.chatPublicController = {
    async getProducts(req, res) {
        try {
            const publicSlug = String(req.params["publicSlug"] || "").trim();
            if (!publicSlug)
                return res.status(400).json({ ok: false });
            const slug = await (0, slug_service_1.getSlugByValueService)(publicSlug);
            if (!slug)
                return res.status(404).json({ ok: false, message: "Negocio no encontrado." });
            const products = await (0, products_repository_1.getActiveProductsRepository)(slug.user_id);
            return res.json({ ok: true, products });
        }
        catch {
            return res.status(500).json({ ok: false, message: "Error cargando productos." });
        }
    },
    async answer(req, res) {
        try {
            const publicSlug = String(req.params["publicSlug"] || "").trim();
            const question = String(req.body?.question || "").trim();
            if (!publicSlug) {
                return res.status(400).json({ ok: false, message: "Slug público obligatorio." });
            }
            if (!question) {
                return res.status(400).json({ ok: false, message: "La pregunta no puede estar vacía." });
            }
            if (question.length > 500) {
                return res.status(400).json({ ok: false, message: "La pregunta es demasiado larga." });
            }
            const slug = await (0, slug_service_1.getSlugByValueService)(publicSlug);
            if (!slug) {
                return res.status(404).json({ ok: false, message: "Negocio no encontrado." });
            }
            const intent = (0, chat_service_1.detectIntent)(question);
            let answer;
            if (intent === "greeting") {
                answer = (0, chat_service_1.buildGreetingAnswer)(slug.business_name ?? publicSlug);
            }
            else if (intent === "price") {
                const products = await (0, products_repository_1.getActiveProductsRepository)(slug.user_id);
                answer = (0, chat_service_1.buildPriceAnswer)(products);
            }
            else if (intent === "availability") {
                const slots = await (0, appointments_service_1.buildCalendarSlots)(slug.user_id);
                answer = (0, chat_service_1.buildAvailabilityAnswer)(slots);
            }
            else {
                const [chunks, config] = await Promise.all([
                    (0, chat_repository_1.getChunksByUserId)(slug.user_id),
                    (0, chat_config_repository_1.getBusinessChatConfig)(slug.user_id).catch(() => null),
                ]);
                answer = (0, chat_service_1.findBestMatch)(question, chunks, config);
            }
            return res.json({ ok: true, answer });
        }
        catch (error) {
            console.error("[chat] Error respondiendo pregunta:", error);
            return res.status(500).json({ ok: false, message: "No se pudo procesar la pregunta." });
        }
    },
};
