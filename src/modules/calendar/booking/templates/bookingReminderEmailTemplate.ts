export type BookingReminderEmailInput = {
  customerName: string;
  businessName: string;
  businessPhone?: string;
  bookingDate: string;
  bookingTime: string;
};

export function renderBookingReminderEmailTemplate(
  input: BookingReminderEmailInput
): string {
  return `
<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:#f0f4f9;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 18px;">
    <div style="background:#ffffff;border-radius:24px;padding:32px;border:1px solid #cdd6e4;">

      <div style="width:48px;height:48px;border-radius:14px;background:#e8f0fa;display:flex;align-items:center;justify-content:center;margin-bottom:22px;">
        <span style="font-size:24px;">📅</span>
      </div>

      <h1 style="margin:0 0 10px;font-size:24px;line-height:1.15;color:#0a1628;">
        Recordatorio de tu reserva
      </h1>

      <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#4a6580;">
        Hola <strong style="color:#1c2d40;">${input.customerName}</strong>, te recordamos que mañana tenés una reserva confirmada.
      </p>

      <div style="padding:20px;border-radius:16px;background:#f5f8fc;border:1px solid #e2e8f0;">
        <div style="font-size:13px;font-weight:700;color:#3a7bd5;letter-spacing:0.5px;margin-bottom:10px;">
          ${input.businessName.toUpperCase()}
        </div>
        <div style="font-size:18px;font-weight:800;color:#0a1628;margin-bottom:4px;">
          ${input.bookingDate}
        </div>
        <div style="font-size:16px;color:#1c2d40;font-weight:600;">
          ${input.bookingTime} hrs
        </div>
      </div>

      ${input.businessPhone ? `
      <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#4a6580;">
        ¿Necesitás cancelar o reagendar? Contactanos al
        <a href="tel:${input.businessPhone}" style="color:#3a7bd5;font-weight:600;">${input.businessPhone}</a>
      </p>
      ` : `
      <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#4a6580;">
        ¡Te esperamos mañana!
      </p>
      `}

      <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e8edf5;font-size:12px;color:#8fa8c0;">
        Automatiza Fácil · Este es un mensaje automático
      </div>
    </div>
  </div>
</body>
</html>
`;
}
