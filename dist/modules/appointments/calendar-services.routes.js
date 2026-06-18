"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const calendar_services_controller_1 = require("./calendar-services.controller");
const router = express_1.default.Router();
router.get("/api/calendar/services", auth_middleware_1.authMiddleware, calendar_services_controller_1.calendarServicesController.list);
router.post("/api/calendar/services", auth_middleware_1.authMiddleware, calendar_services_controller_1.calendarServicesController.create);
router.put("/api/calendar/services/:id", auth_middleware_1.authMiddleware, calendar_services_controller_1.calendarServicesController.update);
router.delete("/api/calendar/services/:id", auth_middleware_1.authMiddleware, calendar_services_controller_1.calendarServicesController.remove);
exports.default = router;
