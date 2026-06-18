"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingReminderEmail = sendBookingReminderEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const bookingReminderEmailTemplate_1 = require("../templates/bookingReminderEmailTemplate");
function createTransporter() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM_EMAIL) {
        throw new Error("Faltan variables SMTP");
    }
    return nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
}
async function sendBookingReminderEmail(to, input) {
    const html = (0, bookingReminderEmailTemplate_1.renderBookingReminderEmailTemplate)(input);
    const transporter = createTransporter();
    await transporter.sendMail({
        from: `"Automatiza Fácil" <${process.env.SMTP_FROM_EMAIL}>`,
        to,
        subject: `Recordatorio: tu reserva en ${input.businessName} es mañana`,
        html,
    });
}
