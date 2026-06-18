"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingPaymentLinkEmail = sendBookingPaymentLinkEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const bookingPaymentLinkEmailTemplate_1 = require("../templates/bookingPaymentLinkEmailTemplate");
async function sendBookingPaymentLinkEmail(input) {
    if (!process.env.SMTP_HOST ||
        !process.env.SMTP_USER ||
        !process.env.SMTP_PASS ||
        !process.env.SMTP_FROM_EMAIL) {
        return;
    }
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const html = (0, bookingPaymentLinkEmailTemplate_1.renderBookingPaymentLinkEmailTemplate)(input);
    await transporter.sendMail({
        from: `"${input.businessName}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: input.to,
        subject: `Tu reserva en ${input.businessName} — completa el pago`,
        html,
    });
}
