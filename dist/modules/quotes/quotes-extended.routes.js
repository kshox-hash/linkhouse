"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const quote_services_controller_1 = require("./quote-services/quote-services.controller");
const quote_history_controller_1 = require("./quote-history/quote-history.controller");
const quote_send_controller_1 = require("./quote-send.controller");
const router = (0, express_1.Router)();
// ── Send ──────────────────────────────────────────────────────────────────────
router.post("/quotes/send", auth_middleware_1.authMiddleware, quote_send_controller_1.quoteSendController.send);
// ── Quote services (catálogo para cotizaciones manuales) ──────────────────────
router.get("/quote-services", auth_middleware_1.authMiddleware, quote_services_controller_1.quoteServicesController.list);
router.post("/quote-services", auth_middleware_1.authMiddleware, quote_services_controller_1.quoteServicesController.create);
router.put("/quote-services/:serviceId", auth_middleware_1.authMiddleware, quote_services_controller_1.quoteServicesController.update);
router.delete("/quote-services/:serviceId", auth_middleware_1.authMiddleware, quote_services_controller_1.quoteServicesController.remove);
// ── Quote history ─────────────────────────────────────────────────────────────
router.get("/quote-history", auth_middleware_1.authMiddleware, quote_history_controller_1.quoteHistoryController.list);
router.delete("/quote-history/:quoteId", auth_middleware_1.authMiddleware, quote_history_controller_1.quoteHistoryController.remove);
exports.default = router;
