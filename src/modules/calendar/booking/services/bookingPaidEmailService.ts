import { createTransporter, SMTP_FROM } from "../../../../core/mailer";
import { renderBookingPaidEmailTemplate } from "../templates/renderBookingPaidEmailTemplate";

type SendBookingPaidEmailInput = {
  to: string;
  customerName: string;
  businessName: string;
  bookingDate: string;
  bookingTime: string;
};

export async function sendBookingPaidEmail(
  input: SendBookingPaidEmailInput
): Promise<void> {
  const html = renderBookingPaidEmailTemplate({
    customerName: input.customerName,
    businessName: input.businessName,
    bookingDate: input.bookingDate,
    bookingTime: input.bookingTime,
  });

  const transporter = createTransporter();

  await transporter.sendMail({
    from: SMTP_FROM(),
    to: input.to,
    subject: "Tu reserva está confirmada",
    html,
  });
}
