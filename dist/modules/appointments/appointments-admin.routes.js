"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const appointments_admin_controller_1 = require("./appointments-admin.controller");
const router = express_1.default.Router();
router.put("/api/calendar/settings", auth_middleware_1.authMiddleware, appointments_admin_controller_1.calendarAdminController.saveSettings);
router.get("/api/calendar/settings/:userId", auth_middleware_1.authMiddleware, appointments_admin_controller_1.calendarAdminController.getSettings);
router.get("/api/calendar/bookings/:userId", auth_middleware_1.authMiddleware, appointments_admin_controller_1.calendarAdminController.getBookings);
router.patch("/api/calendar/bookings/:id/status", auth_middleware_1.authMiddleware, appointments_admin_controller_1.calendarAdminController.updateBookingStatus);
router.patch("/api/calendar/bookings/:id/reschedule", auth_middleware_1.authMiddleware, appointments_admin_controller_1.calendarAdminController.rescheduleBooking);
exports.default = router;
