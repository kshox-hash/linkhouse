import express from "express";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { calendarAdminController } from "./appointments-admin.controller";

const router = express.Router();

router.use(authMiddleware);

router.put("/api/calendar/settings",                    calendarAdminController.saveSettings);
router.get("/api/calendar/settings/:userId",            calendarAdminController.getSettings);
router.get("/api/calendar/bookings/:userId",            calendarAdminController.getBookings);
router.patch("/api/calendar/bookings/:id/status",       calendarAdminController.updateBookingStatus);
router.patch("/api/calendar/bookings/:id/reschedule",   calendarAdminController.rescheduleBooking);

export default router;