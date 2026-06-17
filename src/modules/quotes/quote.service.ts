import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

import { formatCurrencyCLP } from "../../utils/format";
import { sanitizeFileName } from "../../utils/token";

export const GENERATED_PDFS_DIR = path.join(__dirname, "..", "generated-pdfs");

if (!fs.existsSync(GENERATED_PDFS_DIR)) {
  fs.mkdirSync(GENERATED_PDFS_DIR, { recursive: true });
}

export type QuoteTemplateType =
  | "servicios"
  | "productos"
  | "construccion"
  | "eventos"
  | "rapida";

type QuotePdfInput = {
  token: string;
  brand: string;
  brandRut?: string;
  brandAddress?: string;
  brandPhone?: string;
  title?: string;
  subtitle?: string;
  templateType?: QuoteTemplateType;
  customer: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  lines: {
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  total: number;
  extraFields?: {
    paymentConditions?: string;
    deliveryDate?: string;
    exclusions?: string;
    deliveryTime?: string;
    priceValidity?: string;
    workAddress?: string;
    duration?: string;
    paymentSchedule?: string;
    eventDate?: string;
    bookingDeposit?: string;
    cancellationPolicy?: string;
    notes?: string;
  };
};

const TEMPLATE_LABELS: Record<QuoteTemplateType, string> = {
  servicios:    "Servicios Profesionales",
  productos:    "Productos / Suministros",
  construccion: "Construcción",
  eventos:      "Eventos / Paquetes",
  rapida:       "Cotización",
};

const colors = {
  black:      "#0D0D0D",
  dark:       "#1C1C1C",
  heading:    "#2C2C2C",
  text:       "#333333",
  muted:      "#666666",
  light:      "#999999",
  border:     "#D0D0D0",
  borderLight:"#E8E8E8",
  rowAlt:     "#F7F7F7",
  white:      "#FFFFFF",
  headerBg:   "#1C2B3A",
  headerText: "#FFFFFF",
};

export function generateQuotePdf(input: QuotePdfInput) {
  return new Promise<{ fileName: string; filePath: string }>((resolve, reject) => {
    try {
      const timestamp     = Date.now();
      const safeToken     = sanitizeFileName(input.token);
      const fileName      = `cotizacion_${safeToken}_${timestamp}.pdf`;
      const filePath      = path.join(GENERATED_PDFS_DIR, fileName);
      const templateType: QuoteTemplateType = input.templateType || "rapida";

      const doc    = new PDFDocument({ margin: 40, size: "A4" });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const pageWidth    = doc.page.width;
      const pageHeight   = doc.page.height;
      const margin       = 40;
      const contentWidth = pageWidth - margin * 2;

      const brandName   = input.brand?.trim()    || "Mi negocio";
      const docTitle    = input.title?.trim()    || TEMPLATE_LABELS[templateType];
      const quoteNumber = `Q-${String(timestamp).slice(-6)}`;
      const issueDate   = new Date().toLocaleDateString("es-CL");
      const customer    = input.customer ?? { name: "", email: "", phone: "", notes: "" };

      // ── Header ──────────────────────────────────────────────────────────────
      function drawHeader() {
        // Dark header band
        doc.rect(0, 0, pageWidth, 100).fill(colors.headerBg);

        // Brand name
        doc.fillColor(colors.headerText)
           .font("Helvetica-Bold")
           .fontSize(18)
           .text(brandName, margin, 28, { width: contentWidth * 0.6 });

        if (input.subtitle?.trim()) {
          doc.fillColor("#A0B4C8")
             .font("Helvetica")
             .fontSize(9)
             .text(input.subtitle.trim(), margin, 52, { width: contentWidth * 0.6 });
        }

        // Quote type + number (right side)
        doc.fillColor("#A0B4C8")
           .font("Helvetica")
           .fontSize(8.5)
           .text(TEMPLATE_LABELS[templateType].toUpperCase(), margin, 24, {
             width: contentWidth, align: "right",
           });

        doc.fillColor(colors.headerText)
           .font("Helvetica-Bold")
           .fontSize(22)
           .text(docTitle.toUpperCase(), margin, 38, {
             width: contentWidth, align: "right",
           });

        doc.fillColor("#A0B4C8")
           .font("Helvetica")
           .fontSize(8.5)
           .text(`Nº ${quoteNumber}  ·  ${issueDate}`, margin, 66, {
             width: contentWidth, align: "right",
           });
      }

      // ── Issuer + Customer info ───────────────────────────────────────────────
      function drawPartiesBox(startY: number): number {
        const boxH = 90;
        const halfW = (contentWidth - 20) / 2;

        // Left: Issuer
        doc.rect(margin, startY, halfW, boxH)
           .fillAndStroke("#F9FAFB", colors.borderLight);

        doc.fillColor(colors.muted)
           .font("Helvetica-Bold")
           .fontSize(7.5)
           .text("EMISOR", margin + 14, startY + 12);

        doc.fillColor(colors.dark)
           .font("Helvetica-Bold")
           .fontSize(11)
           .text(brandName, margin + 14, startY + 25, { width: halfW - 28 });

        let iy = startY + 42;
        if (input.brandRut) {
          doc.fillColor(colors.muted).font("Helvetica").fontSize(8.5)
             .text(`RUT: ${input.brandRut}`, margin + 14, iy, { width: halfW - 28 });
          iy += 13;
        }
        if (input.brandAddress) {
          doc.fillColor(colors.muted).font("Helvetica").fontSize(8.5)
             .text(input.brandAddress, margin + 14, iy, { width: halfW - 28 });
          iy += 13;
        }
        if (input.brandPhone) {
          doc.fillColor(colors.muted).font("Helvetica").fontSize(8.5)
             .text(`Tel: ${input.brandPhone}`, margin + 14, iy, { width: halfW - 28 });
        }

        // Right: Customer
        const rx = margin + halfW + 20;
        doc.rect(rx, startY, halfW, boxH)
           .fillAndStroke("#F9FAFB", colors.borderLight);

        doc.fillColor(colors.muted)
           .font("Helvetica-Bold")
           .fontSize(7.5)
           .text("CLIENTE", rx + 14, startY + 12);

        doc.fillColor(colors.dark)
           .font("Helvetica-Bold")
           .fontSize(11)
           .text(customer.name?.trim() || "—", rx + 14, startY + 25, { width: halfW - 28 });

        doc.fillColor(colors.muted).font("Helvetica").fontSize(8.5)
           .text(customer.email?.trim() || "—", rx + 14, startY + 42, { width: halfW - 28 });

        if (customer.phone?.trim()) {
          doc.fillColor(colors.muted).font("Helvetica").fontSize(8.5)
             .text(`Tel: ${customer.phone.trim()}`, rx + 14, startY + 55, { width: halfW - 28 });
        }

        return startY + boxH + 22;
      }

      // ── Table ────────────────────────────────────────────────────────────────
      function drawTableHeader(startY: number) {
        doc.rect(margin, startY, contentWidth, 24).fill(colors.dark);

        const pad = 12;
        const dW  = contentWidth * 0.44;
        const qW  = contentWidth * 0.10;
        const pW  = contentWidth * 0.20;
        const sW  = contentWidth * 0.22;
        const c1  = margin + pad;
        const c2  = c1 + dW;
        const c3  = c2 + qW;
        const c4  = c3 + pW;

        doc.fillColor(colors.white).font("Helvetica-Bold").fontSize(8)
           .text("DESCRIPCIÓN",  c1, startY + 8, { width: dW - 6 })
           .text("CANT.",        c2, startY + 8, { width: qW, align: "center" })
           .text("PRECIO UNIT.", c3, startY + 8, { width: pW - 4, align: "right" })
           .text("SUBTOTAL",     c4, startY + 8, { width: sW - pad, align: "right" });

        return { nextY: startY + 24, c1, c2, c3, c4, dW, qW, pW, sW, pad };
      }

      function ensureSpace(currentY: number, neededH: number, drawTableOnNewPage = false) {
        if (currentY + neededH <= pageHeight - 60) return { y: currentY, newPage: false };
        doc.addPage();
        drawHeader();
        let ny = 112;
        if (drawTableOnNewPage) {
          const t = drawTableHeader(ny);
          return { y: t.nextY, newPage: true, table: t };
        }
        return { y: ny, newPage: true };
      }

      // ── Extra fields ─────────────────────────────────────────────────────────
      function drawExtraFields(startY: number): number {
        const ex = input.extraFields || {};
        const rows: { label: string; value: string }[] = [];

        switch (templateType) {
          case "servicios":
            if (ex.deliveryDate)      rows.push({ label: "Fecha estimada de entrega", value: ex.deliveryDate });
            if (ex.paymentConditions) rows.push({ label: "Condiciones de pago",        value: ex.paymentConditions });
            if (ex.exclusions)        rows.push({ label: "No incluye",                 value: ex.exclusions });
            break;
          case "productos":
            if (ex.deliveryTime)  rows.push({ label: "Tiempo de entrega",  value: ex.deliveryTime });
            if (ex.priceValidity) rows.push({ label: "Validez del precio", value: ex.priceValidity });
            break;
          case "construccion":
            if (ex.workAddress)     rows.push({ label: "Dirección de la obra",   value: ex.workAddress });
            if (ex.duration)        rows.push({ label: "Duración estimada",       value: ex.duration });
            if (ex.paymentSchedule) rows.push({ label: "Calendario de pagos",     value: ex.paymentSchedule });
            break;
          case "eventos":
            if (ex.eventDate)          rows.push({ label: "Fecha del evento",        value: ex.eventDate });
            if (ex.bookingDeposit)     rows.push({ label: "Reserva requerida",       value: ex.bookingDeposit });
            if (ex.cancellationPolicy) rows.push({ label: "Política de cancelación", value: ex.cancellationPolicy });
            break;
        }

        if (ex.notes) rows.push({ label: "Notas adicionales", value: ex.notes });
        if (rows.length === 0) return startY;

        const rowH = 20;
        const boxH = 28 + rows.length * rowH;
        const { y } = ensureSpace(startY, boxH + 16);
        let cy = y;

        doc.rect(margin, cy, contentWidth, boxH)
           .fillAndStroke("#F9FAFB", colors.borderLight);

        cy += 12;
        rows.forEach(({ label, value }) => {
          doc.fillColor(colors.muted).font("Helvetica-Bold").fontSize(8)
             .text(label + ":", margin + 14, cy, { width: 160 });
          doc.fillColor(colors.text).font("Helvetica").fontSize(8.5)
             .text(value, margin + 180, cy, { width: contentWidth - 194 });
          cy += rowH;
        });

        return y + boxH + 14;
      }

      // ── Build PDF ─────────────────────────────────────────────────────────────
      drawHeader();
      let y = 112;
      y = drawPartiesBox(y);

      // Thin divider before table
      doc.strokeColor(colors.borderLight).lineWidth(0.5)
         .moveTo(margin, y - 10).lineTo(margin + contentWidth, y - 10).stroke();

      let table = drawTableHeader(y);
      y = table.nextY;

      const lines = Array.isArray(input.lines) ? input.lines : [];

      if (lines.length === 0) {
        doc.rect(margin, y, contentWidth, 40).fill(colors.white);
        doc.fillColor(colors.muted).font("Helvetica").fontSize(10)
           .text("Sin ítems seleccionados.", margin + 14, y + 14);
        y += 40;
      } else {
        lines.forEach((line, idx) => {
          const rowH  = line.description?.trim() ? 46 : 30;
          const fill  = idx % 2 === 0 ? colors.white : colors.rowAlt;
          const space = ensureSpace(y, rowH + 120, true);
          if (space.newPage && (space as any).table) {
            y = space.y;
            table = (space as any).table;
          }

          doc.rect(margin, y, contentWidth, rowH).fill(fill);

          // Bottom row border
          doc.strokeColor(colors.borderLight).lineWidth(0.4)
             .moveTo(margin, y + rowH).lineTo(margin + contentWidth, y + rowH).stroke();

          const textY = rowH > 36 ? y + 8 : y + 9;

          doc.fillColor(colors.dark).font("Helvetica-Bold").fontSize(9)
             .text(line.name, table.c1, textY, { width: table.dW - 10 });

          if (line.description?.trim()) {
            doc.fillColor(colors.muted).font("Helvetica").fontSize(7.5)
               .text(line.description, table.c1, textY + 16, { width: table.dW - 10 });
          }

          doc.fillColor(colors.text).font("Helvetica").fontSize(9)
             .text(String(line.quantity),             table.c2, textY, { width: table.qW, align: "center" })
             .text(formatCurrencyCLP(line.unitPrice),  table.c3, textY, { width: table.pW - 4, align: "right" })
             .text(formatCurrencyCLP(line.subtotal),   table.c4, textY, { width: table.sW - table.pad, align: "right" });

          y += rowH;
        });
      }

      y += 18;

      // ── Totals ────────────────────────────────────────────────────────────────
      const { y: ty } = ensureSpace(y, 110);
      y = ty;

      const totW = 220;
      const tx   = margin + contentWidth - totW;

      doc.fillColor(colors.muted).font("Helvetica").fontSize(9)
         .text("Subtotal",  tx, y,      { width: totW - 60 })
         .text(formatCurrencyCLP(input.total), tx + totW - 60, y, { width: 60, align: "right" });

      doc.fillColor(colors.muted).font("Helvetica").fontSize(9)
         .text("Descuento", tx, y + 18, { width: totW - 60 })
         .text("$0",        tx + totW - 60, y + 18, { width: 60, align: "right" });

      // Divider
      doc.strokeColor(colors.border).lineWidth(0.8)
         .moveTo(tx, y + 36).lineTo(margin + contentWidth, y + 36).stroke();

      doc.fillColor(colors.dark).font("Helvetica-Bold").fontSize(12)
         .text("TOTAL",                  tx, y + 44, { width: totW - 60 })
         .text(formatCurrencyCLP(input.total), tx + totW - 60, y + 42, { width: 60, align: "right" });

      y += 80;

      // ── Extra fields ─────────────────────────────────────────────────────────
      y = drawExtraFields(y);

      // ── Customer notes ────────────────────────────────────────────────────────
      const noteText = customer.notes?.trim();
      if (noteText) {
        const { y: ny } = ensureSpace(y, 80);
        y = ny;
        doc.rect(margin, y, contentWidth, 70)
           .fillAndStroke("#F9FAFB", colors.borderLight);
        doc.fillColor(colors.muted).font("Helvetica-Bold").fontSize(7.5)
           .text("OBSERVACIONES", margin + 14, y + 12);
        doc.fillColor(colors.text).font("Helvetica").fontSize(9)
           .text(noteText, margin + 14, y + 26, { width: contentWidth - 28, height: 34 });
        y += 82;
      }

      // ── Footer ────────────────────────────────────────────────────────────────
      const { y: fy } = ensureSpace(y, 40);
      y = fy;

      doc.strokeColor(colors.borderLight).lineWidth(0.8)
         .moveTo(margin, y).lineTo(margin + contentWidth, y).stroke();

      doc.fillColor(colors.light).font("Helvetica").fontSize(7.5)
         .text(
           `${brandName}  ·  ${docTitle} ${quoteNumber}  ·  Emitida el ${issueDate}  ·  Documento generado automáticamente`,
           margin, y + 10, { width: contentWidth, align: "center" }
         );

      doc.end();
      stream.on("finish", () => resolve({ fileName, filePath }));
      stream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
}
