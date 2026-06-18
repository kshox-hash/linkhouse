"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingConfirmation_service_1 = require("../services/bookingConfirmation.service");
const bookingConfirmationSuccessHtml_1 = require("../views/bookingConfirmationSuccessHtml");
const bookingConfirmationErrorHtml_1 = require("../views/bookingConfirmationErrorHtml");
const router = express_1.default.Router();
router.get("/api/bookings/confirm/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const result = await (0, bookingConfirmation_service_1.confirmBookingByToken)(token);
        if (!result.ok) {
            return res
                .status(400)
                .send((0, bookingConfirmationErrorHtml_1.renderBookingConfirmationErrorHtml)(result.message));
        }
        return res.send((0, bookingConfirmationSuccessHtml_1.renderBookingConfirmationSuccessHtml)());
    }
    catch (error) {
        console.error("Error confirmando reserva:", error);
        return res
            .status(500)
            .send((0, bookingConfirmationErrorHtml_1.renderBookingConfirmationErrorHtml)("Ocurrió un error confirmando la reserva."));
    }
});
exports.default = router;
