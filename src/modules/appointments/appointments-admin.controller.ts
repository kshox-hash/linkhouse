import { Request, Response } from "express";
import ExcelJS from "exceljs";
import {
  getCalendarBookingsByUserId,
  getCalendarSettingsByUserId,
  getPaymentsForExport,
  rescheduleBooking,
  saveCalendarSettings,
  updateBookingStatus,
} from "./appointments-admin.repository";
import { denyIfNotOwner } from "../../middlewares/owner_guard";

export const calendarAdminController = {
  async getSettings(req: Request, res: Response) {
    try {
      const userId = String(req.params["userId"] || "").trim();
      if (!userId) return res.status(400).json({ ok: false, message: "userId requerido." });
      if (denyIfNotOwner(req, res, userId)) return;

      const data = await getCalendarSettingsByUserId(userId);
      return res.json({ ok: true, ...data });
    } catch (error) {
      console.error("Error obteniendo configuración calendario:", error);
      return res.status(500).json({ ok: false, message: "No se pudo obtener la configuración." });
    }
  },

  async saveSettings(req: Request, res: Response) {
    try {
      const userId = String(req.user?.userId ?? "").trim();
      if (!userId) return res.status(401).json({ ok: false, message: "No autorizado." });

      const body = req.body || {};
      const openingTime          = String(body.openingTime || "").trim();
      const closingTime          = String(body.closingTime || "").trim();
      const slotDurationMinutes  = Number(body.slotDurationMinutes || 30);
      const maxDaysAhead         = Number(body.maxDaysAhead || 30);

      const activeWeekdays = Array.isArray(body.activeWeekdays)
        ? body.activeWeekdays.map(Number).filter((n: number) => n >= 1 && n <= 7)
        : [];

      const blockedDates = Array.isArray(body.blockedDates) ? body.blockedDates : [];

      if (!openingTime || !closingTime) {
        return res.status(400).json({ ok: false, message: "Faltan datos obligatorios." });
      }
      if (!activeWeekdays.length) {
        return res.status(400).json({ ok: false, message: "Debe existir al menos un día activo." });
      }

      const saved = await saveCalendarSettings({
        userId,
        openingTime,
        closingTime,
        slotDurationMinutes,
        maxDaysAhead,
        timezone: body.timezone || "America/Santiago",
        activeWeekdays,
        blockedDates,
      });

      return res.json({ ok: true, message: "Configuración guardada correctamente.", settings: saved });
    } catch (error) {
      console.error("Error guardando configuración calendario:", error);
      return res.status(500).json({ ok: false, message: "No se pudo guardar la configuración." });
    }
  },

  async getBookings(req: Request, res: Response) {
    try {
      const userId = String(req.params["userId"] || "").trim();
      if (!userId) return res.status(400).json({ ok: false, message: "userId requerido." });
      if (denyIfNotOwner(req, res, userId)) return;

      const bookings = await getCalendarBookingsByUserId(userId);
      return res.json({ ok: true, bookings });
    } catch (error) {
      console.error("Error obteniendo reservas calendario:", error);
      return res.status(500).json({ ok: false, message: "No se pudieron obtener las reservas." });
    }
  },

  async rescheduleBooking(req: Request, res: Response) {
    try {
      const id         = String(req.params["id"] || "").trim();
      const authUserId = String(req.user?.userId ?? "").trim();
      const body       = req.body || {};
      const bookingDate = String(body.bookingDate || "").trim();
      const startTime   = String(body.startTime   || "").trim();
      const endTime     = String(body.endTime     || "").trim();

      if (!id || !bookingDate || !startTime || !endTime) {
        return res.status(400).json({ ok: false, message: "Faltan campos requeridos." });
      }

      const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
      const TIME_RE = /^\d{2}:\d{2}(:\d{2})?$/;
      if (!DATE_RE.test(bookingDate) || !TIME_RE.test(startTime) || !TIME_RE.test(endTime)) {
        return res.status(400).json({ ok: false, message: "Formato de fecha u hora inválido." });
      }
      if (startTime >= endTime) {
        return res.status(400).json({ ok: false, message: "La hora de inicio debe ser anterior a la hora de fin." });
      }

      const updated = await rescheduleBooking(id, bookingDate, startTime, endTime, authUserId);
      if (!updated) return res.status(404).json({ ok: false, message: "Reserva no encontrada." });

      return res.json({ ok: true, booking: updated });
    } catch (error) {
      console.error("Error reagendando reserva:", error);
      return res.status(500).json({ ok: false, message: "No se pudo reagendar." });
    }
  },

  async updateBookingStatus(req: Request, res: Response) {
    try {
      const id         = String(req.params["id"] || "").trim();
      const authUserId = String(req.user?.userId ?? "").trim();
      const status     = String((req.body || {}).status || "").trim();

      if (!id || !status) {
        return res.status(400).json({ ok: false, message: "id y status son requeridos." });
      }

      const updated = await updateBookingStatus(id, status, authUserId);
      if (!updated) return res.status(404).json({ ok: false, message: "Reserva no encontrada." });

      return res.json({ ok: true, booking: updated });
    } catch (error: unknown) {
      console.error("Error actualizando estado de reserva:", error);
      return res.status(500).json({ ok: false, message: "No se pudo actualizar el estado." });
    }
  },

  async exportPayments(req: Request, res: Response) {
    try {
      const userId = String(req.params["userId"] || "").trim();
      const year   = String(req.query["year"] || "").trim();

      if (!userId) return res.status(400).json({ ok: false, message: "userId requerido." });
      if (denyIfNotOwner(req, res, userId)) return;

      const rows = await getPaymentsForExport(userId, year || undefined);

      const totalAmount  = rows.reduce((sum, r) => sum + (r.payment_amount ?? 0), 0);
      const paidCount    = rows.filter(r => r.payment_status === "paid").length;
      const periodoLabel = (year && /^\d{4}$/.test(year)) ? `Año ${year}` : "Todos los registros";
      const firstDate    = rows.length > 0 ? rows[0].booking_date : "—";
      const lastDate     = rows.length > 0 ? rows[rows.length - 1].booking_date : "—";
      const fileYear     = year || String(new Date().getFullYear());

      const wb = new ExcelJS.Workbook();
      wb.creator = "Automatiza Fácil";
      wb.created = new Date();

      const ws = wb.addWorksheet("Pagos");

      // ── Ancho de columnas ─────────────────────────────────────────────────
      ws.columns = [
        { key: "fecha",      width: 14 },
        { key: "hora",       width: 10 },
        { key: "cliente",    width: 24 },
        { key: "email",      width: 28 },
        { key: "telefono",   width: 16 },
        { key: "servicio",   width: 22 },
        { key: "profesional",width: 20 },
        { key: "monto",      width: 14 },
        { key: "estado",     width: 12 },
        { key: "mp_id",      width: 22 },
        { key: "fecha_pago", width: 18 },
      ];

      // ── Bloque resumen ────────────────────────────────────────────────────
      const ACCENT = "1A6FA8";
      const LIGHT  = "E8F0F7";

      const titleRow = ws.addRow([`REGISTRO DE PAGOS — ${periodoLabel}`]);
      titleRow.font = { bold: true, size: 13, color: { argb: "FFFFFFFF" } };
      titleRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${ACCENT}` } };
      titleRow.height = 22;
      ws.mergeCells(`A${titleRow.number}:K${titleRow.number}`);

      const addSummaryRow = (label: string, value: string) => {
        const r = ws.addRow([label, value]);
        r.getCell(1).font = { bold: true, color: { argb: `FF${ACCENT}` } };
        r.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${LIGHT}` } };
        r.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${LIGHT}` } };
      };

      addSummaryRow("Período:", `${firstDate} al ${lastDate}`);
      addSummaryRow("Total transacciones:", String(rows.length));
      addSummaryRow("Transacciones pagadas:", String(paidCount));
      addSummaryRow("Total recaudado:", `$${totalAmount.toLocaleString("es-CL")}`);
      ws.addRow([]);

      // ── Encabezados ───────────────────────────────────────────────────────
      const HEADERS = ["Fecha","Hora","Cliente","Email","Teléfono","Servicio","Profesional","Monto ($)","Estado","ID MercadoPago","Fecha de pago"];
      const headerRow = ws.addRow(HEADERS);
      headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${ACCENT}` } };
        cell.border = { bottom: { style: "thin", color: { argb: "FFFFFFFF" } } };
        cell.alignment = { vertical: "middle" };
      });
      headerRow.height = 18;

      // ── Datos ─────────────────────────────────────────────────────────────
      rows.forEach((r, i) => {
        const dataRow = ws.addRow([
          r.booking_date,
          r.start_time ? String(r.start_time).slice(0, 5) : "",
          r.client_name,
          r.client_email,
          r.client_phone,
          r.service_name ?? "",
          r.provider_name ?? "",
          r.payment_amount ?? 0,
          "Pagado",
          r.mp_payment_id ?? "",
          r.paid_at ?? "",
        ]);
        // alternar fondo
        if (i % 2 === 1) {
          dataRow.eachCell(cell => {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${LIGHT}` } };
          });
        }
        // monto como número con formato
        const montoCell = dataRow.getCell(8);
        montoCell.numFmt = '"$"#,##0';
      });

      // ── Fila total ────────────────────────────────────────────────────────
      ws.addRow([]);
      const totalRow = ws.addRow(["","","","","","","", totalAmount, `${rows.length} transacciones`, "", ""]);
      totalRow.getCell(7).value = "TOTAL:";
      totalRow.getCell(7).font = { bold: true };
      totalRow.getCell(8).numFmt = '"$"#,##0';
      totalRow.getCell(8).font  = { bold: true, color: { argb: `FF${ACCENT}` } };
      totalRow.getCell(9).font  = { bold: true, color: { argb: `FF${ACCENT}` } };

      // ── Enviar ────────────────────────────────────────────────────────────
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="pagos_${fileYear}.xlsx"`);
      await wb.xlsx.write(res);
      return res.end();
    } catch (error) {
      console.error("Error exportando pagos:", error);
      return res.status(500).json({ ok: false, message: "No se pudo generar el archivo." });
    }
  },
};
