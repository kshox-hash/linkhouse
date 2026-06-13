import { Request, Response } from "express";
import fs from "fs";
import { generateQuotePdf } from "./quote.service";
import { sendQuoteEmail } from "./quote-email.service";
import { getSlugByUserIdService } from "../slug/slug.service";

type SendQuoteBody = {
  client: {
    name: string;
    email: string;
  };
  products: {
    title: string;
    price: number;
    description?: string;
  }[];
  message?: string;
};

export const quoteSendController = {
  async send(req: Request<{}, {}, SendQuoteBody>, res: Response): Promise<Response> {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ ok: false, message: "No autorizado" });

      const { client, products, message } = req.body;

      if (!client?.name?.trim() || !client?.email?.trim()) {
        return res.status(400).json({ ok: false, message: "Nombre y email del cliente son obligatorios." });
      }

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ ok: false, message: "Se requiere al menos un producto." });
      }

      const slug = await getSlugByUserIdService(userId);
      const brandName = slug?.business_name || slug?.public_slug || "Mi negocio";

      const lines = products.map((p) => {
        const unitPrice = Number(p.price || 0);
        return {
          name: p.title || "Producto",
          description: p.description || "",
          quantity: 1,
          unitPrice,
          subtotal: unitPrice,
        };
      });

      const total = lines.reduce((acc, l) => acc + l.subtotal, 0);

      const { fileName, filePath } = await generateQuotePdf({
        token: `custom-${userId}-${Date.now()}`,
        brand: brandName,
        title: "Cotización",
        subtitle: "",
        customer: {
          name: client.name,
          email: client.email,
          phone: "",
          notes: message || "",
        },
        lines,
        total,
      });

      try {
        await sendQuoteEmail({
          to: client.email,
          customerName: client.name,
          brandName,
          pdfPath: filePath,
          pdfFileName: fileName,
          items: lines,
          total,
        });
      } finally {
        fs.unlink(filePath, () => {});
      }

      return res.status(200).json({ ok: true, message: "Cotización enviada correctamente." });
    } catch (error: any) {
      return res.status(500).json({ ok: false, message: error?.message || "Error enviando cotización." });
    }
  },
};
