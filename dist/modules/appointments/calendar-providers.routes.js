"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const calendar_providers_controller_1 = require("./calendar-providers.controller");
const router = express_1.default.Router();
router.get("/api/calendar/providers/:userId", auth_middleware_1.authMiddleware, calendar_providers_controller_1.calendarProvidersController.list);
router.post("/api/calendar/providers", auth_middleware_1.authMiddleware, calendar_providers_controller_1.calendarProvidersController.create);
router.put("/api/calendar/providers/:id", auth_middleware_1.authMiddleware, calendar_providers_controller_1.calendarProvidersController.update);
router.delete("/api/calendar/providers/:id", auth_middleware_1.authMiddleware, calendar_providers_controller_1.calendarProvidersController.remove);
exports.default = router;
