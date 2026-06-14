import { Request, Response } from "express";
import { getSlugByValueService } from "../slug/slug.service";
import { getChunksByUserId } from "./chat.repository";
import { getBusinessChatConfig } from "./chat-config.repository";
import {
  detectIntent,
  findBestMatch,
  buildPriceAnswer,
  buildAvailabilityAnswer,
  buildGreetingAnswer,
} from "./chat.service";
import { getActiveProductsRepository } from "../quotes/products/products.repository";
import { buildCalendarSlots } from "../appointments/appointments.service";

export const chatPublicController = {

  async getProducts(req: Request, res: Response): Promise<Response> {
    try {
      const publicSlug = String(req.params["publicSlug"] || "").trim();
      if (!publicSlug) return res.status(400).json({ ok: false });

      const slug = await getSlugByValueService(publicSlug);
      if (!slug) return res.status(404).json({ ok: false, message: "Negocio no encontrado." });

      const products = await getActiveProductsRepository(slug.user_id);
      return res.json({ ok: true, products });
    } catch {
      return res.status(500).json({ ok: false, message: "Error cargando productos." });
    }
  },

  async answer(req: Request, res: Response): Promise<Response> {
    try {
      const publicSlug = String(req.params["publicSlug"] || "").trim();
      const question   = String(req.body?.question || "").trim();

      if (!publicSlug) {
        return res.status(400).json({ ok: false, message: "Slug público obligatorio." });
      }

      if (!question) {
        return res.status(400).json({ ok: false, message: "La pregunta no puede estar vacía." });
      }

      if (question.length > 500) {
        return res.status(400).json({ ok: false, message: "La pregunta es demasiado larga." });
      }

      const slug = await getSlugByValueService(publicSlug);

      if (!slug) {
        return res.status(404).json({ ok: false, message: "Negocio no encontrado." });
      }

      const intent = detectIntent(question);

      let answer: string;

      if (intent === "greeting") {
        answer = buildGreetingAnswer(slug.business_name ?? publicSlug);
      } else if (intent === "price") {
        const products = await getActiveProductsRepository(slug.user_id);
        answer = buildPriceAnswer(products);
      } else if (intent === "availability") {
        const slots = await buildCalendarSlots(slug.user_id);
        answer = buildAvailabilityAnswer(slots);
      } else {
        const [chunks, config] = await Promise.all([
          getChunksByUserId(slug.user_id),
          getBusinessChatConfig(slug.user_id).catch(() => null),
        ]);
        answer = findBestMatch(question, chunks, config);
      }

      return res.json({ ok: true, answer });
    } catch (error) {
      console.error("[chat] Error respondiendo pregunta:", error);
      return res.status(500).json({ ok: false, message: "No se pudo procesar la pregunta." });
    }
  },
};
