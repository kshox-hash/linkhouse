import { Request, Response } from "express";
import { insertSlugService, getSlugByUserIdService } from "./slug.service";

export async function getMySlugController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

    const slug = await getSlugByUserIdService(userId);

    return res.status(200).json({
      configured: Boolean(slug),
      slug: slug?.slug ?? null,
      isAvailable: Boolean(slug?.is_available ?? slug?.isAvailable ?? true),
    });
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Error obteniendo slug",
    });
  }
}

export async function insertSlugController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userId = req.user?.userId;
    const { slug } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

    await insertSlugService({
      userId,
      slug,
    });

    return res.status(201).json({
      message: "Slug creado correctamente",
    });
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Error creando slug",
    });
  }
}