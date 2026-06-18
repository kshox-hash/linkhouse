"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMySlugController = getMySlugController;
exports.insertSlugController = insertSlugController;
const slug_service_1 = require("./slug.service");
async function getMySlugController(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                error: "Usuario no autenticado",
            });
        }
        const slugRecord = await (0, slug_service_1.getSlugByUserIdService)(userId);
        if (!slugRecord) {
            return res.status(200).json({
                configured: false,
                slug: null,
            });
        }
        return res.status(200).json({
            configured: true,
            slug: slugRecord.public_slug,
            isPublicEnabled: slugRecord.is_public_enabled,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "Error obteniendo slug",
        });
    }
}
async function insertSlugController(req, res) {
    try {
        const userId = req.user?.userId;
        const { slug } = req.body;
        if (!userId) {
            return res.status(401).json({
                error: "Usuario no autenticado",
            });
        }
        if (!slug || typeof slug !== "string") {
            return res.status(400).json({
                error: "Debe ingresar un nombre válido",
            });
        }
        await (0, slug_service_1.insertSlugService)({
            userId,
            slug,
        });
        return res.status(201).json({
            success: true,
            message: "Slug creado correctamente",
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Error creando slug";
        return res.status(400).json({
            success: false,
            error: message,
        });
    }
}
