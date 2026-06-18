"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingConfirmationEmail = sendBookingConfirmationEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const confirmationEmailTemplate_1 = require("../templates/confirmationEmailTemplate");
function createTransporter() {
    if (!process.env.SMTP_HOST ||
        !process.env.SMTP_USER ||
        !process.env.SMTP_PASS ||
        !process.env.SMTP_FROM_EMAIL) {
        throw new Error("Faltan variables SMTP");
    }
    return nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}
async function sendBookingConfirmationEmail(input) {
    const html = (0, confirmationEmailTemplate_1.renderConfirmationEmailTemplate)({
        customerName: input.customerName,
        bookingDate: input.bookingDate,
        bookingTime: input.bookingTime,
        confirmationUrl: input.confirmationUrl,
    });
    const transporter = createTransporter();
    await transporter.sendMail({
        from: `"Automatiza Fácil" <${process.env.SMTP_FROM_EMAIL}>`,
        to: input.to,
        subject: "Confirma tu reserva",
        html,
    });
}
