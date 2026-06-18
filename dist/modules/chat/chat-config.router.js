"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const chat_config_repository_1 = require("./chat-config.repository");
const router = express_1.default.Router();
router.get("/chat/:userId/config", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = String(req.params["userId"] || "").trim();
        const requester = req.user?.userId ?? "";
        if (userId !== requester) {
            return res.status(403).json({ ok: false, message: "Sin permisos." });
        }
        const config = await (0, chat_config_repository_1.getBusinessChatConfig)(userId);
        return res.json({
            ok: true,
            config: config ?? { description: null, faq: [], extraInfo: null },
        });
    }
    catch {
        return res.status(500).json({ ok: false, message: "Error cargando configuración." });
    }
});
router.put("/chat/:userId/config", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = String(req.params["userId"] || "").trim();
        const requester = req.user?.userId ?? "";
        if (userId !== requester) {
            return res.status(403).json({ ok: false, message: "Sin permisos." });
        }
        const { description, faq, extraInfo } = req.body ?? {};
        const safeFaq = Array.isArray(faq)
            ? faq.filter((f) => typeof f?.question === "string" && typeof f?.answer === "string")
            : [];
        await (0, chat_config_repository_1.upsertBusinessChatConfig)(userId, {
            description: description ? String(description).slice(0, 2000) : null,
            faq: safeFaq,
            extraInfo: extraInfo ? String(extraInfo).slice(0, 3000) : null,
        });
        return res.json({ ok: true, message: "Configuración guardada." });
    }
    catch {
        return res.status(500).json({ ok: false, message: "Error guardando configuración." });
    }
});
exports.default = router;
