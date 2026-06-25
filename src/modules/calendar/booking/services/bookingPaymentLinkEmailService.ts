import { createTransporter } from "../../../../core/mailer";
import { renderBookingPaymentLinkEmailTemplate } from "../templates/bookingPaymentLinkEmailTemplate";

export type SendBookingPaymentLinkEmailInput = {
  to: string;
  customerName: string;
  businessName: string;
  bookingDate: string;
  bookingTime: string;
  checkoutUrl: string;
  cancelUrl?: string;
};

export async function sendBookingPaymentLinkEmail(
  input: SendBookingPaymentLinkEmailInput
): Promise<void> {
  const transporter = createTransporter();
  const html = renderBookingPaymentLinkEmailTemplate(input);

  await transporter.sendMail({
    from: `"${input.businessName}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: input.to,
    subject: `Tu reserva en ${input.businessName} — completa el pago`,
    html,
  });
}
