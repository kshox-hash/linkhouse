import nodemailer from "nodemailer";
import { renderBookingReminderEmailTemplate, BookingReminderEmailInput } from "../templates/bookingReminderEmailTemplate";

function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM_EMAIL) {
    throw new Error("Faltan variables SMTP");
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export async function sendBookingReminderEmail(
  to: string,
  input: BookingReminderEmailInput
): Promise<void> {
  const html = renderBookingReminderEmailTemplate(input);
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Automatiza Fácil" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject: `Recordatorio: tu reserva en ${input.businessName} es mañana`,
    html,
  });
}
