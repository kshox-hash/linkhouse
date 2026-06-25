import { createTransporter, SMTP_FROM } from "../../../../core/mailer";
import { renderBookingPaidEmailTemplate } from "../templates/renderBookingPaidEmailTemplate";

type SendBusinessBookingPaidEmailInput = {
  to: string;
  businessName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  bookingTime: string;
  amount: number;
};

export async function sendBusinessBookingPaidEmail(
  input: SendBusinessBookingPaidEmailInput
): Promise<void> {
  const html = renderBookingPaidEmailTemplate(input);

  const transporter = createTransporter();

  await transporter.sendMail({
    from: SMTP_FROM(),
    to: input.to,
    subject: "Nueva reserva confirmada",
    html,
  });
}
