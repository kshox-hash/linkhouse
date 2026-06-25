import { createTransporter, SMTP_FROM } from "../../../../core/mailer";
import { renderBookingReminderEmailTemplate, BookingReminderEmailInput } from "../templates/bookingReminderEmailTemplate";

export async function sendBookingReminderEmail(
  to: string,
  input: BookingReminderEmailInput
): Promise<void> {
  const html = renderBookingReminderEmailTemplate(input);
  const transporter = createTransporter();
  await transporter.sendMail({
    from: SMTP_FROM(),
    to,
    subject: `Recordatorio: tu reserva en ${input.businessName} es mañana`,
    html,
  });
}
