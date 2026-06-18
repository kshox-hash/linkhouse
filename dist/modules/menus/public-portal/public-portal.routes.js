"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const public_portal_controller_1 = require("./public-portal.controller");
const quotes_controller_1 = require("../../quotes/quotes.controller"); // 
const router = (0, express_1.Router)();
router.get("/shop/:publicSlug", public_portal_controller_1.publicPortalController.open);
router.get("/shop/:publicSlug/cotizador", public_portal_controller_1.publicPortalController.openQuotes);
router.post("/shop/:publicSlug/quotes/submit", quotes_controller_1.quotesSubmitController.submit);
exports.default = router;
