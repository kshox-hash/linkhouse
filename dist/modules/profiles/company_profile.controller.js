"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyProfileController = void 0;
const company_profile_service_1 = require("./company_profile.service");
exports.companyProfileController = {
    async getMe(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    ok: false,
                    message: "Usuario no autenticado",
                });
            }
            const profile = await company_profile_service_1.companyProfileService.getByUserId(userId);
            return res.json({
                ok: true,
                profile,
            });
        }
        catch (error) {
            return res.status(500).json({
                ok: false,
                message: error instanceof Error
                    ? error.message
                    : "Error obteniendo perfil de empresa",
            });
        }
    },
    async getByUserId(req, res) {
        try {
            const userId = req.params.userId;
            if (!userId || !userId.trim()) {
                return res.status(400).json({
                    ok: false,
                    message: "userId es obligatorio",
                });
            }
            const profile = await company_profile_service_1.companyProfileService.getByUserId(userId);
            return res.json({
                ok: true,
                profile,
            });
        }
        catch (error) {
            return res.status(500).json({
                ok: false,
                message: error instanceof Error
                    ? error.message
                    : "Error obteniendo perfil de empresa",
            });
        }
    },
    async getByPublicSlug(req, res) {
        try {
            const slug = req.params.slug;
            if (!slug || !slug.trim()) {
                return res.status(400).json({
                    ok: false,
                    message: "slug es obligatorio",
                });
            }
            const profile = await company_profile_service_1.companyProfileService.getByPublicSlug(slug);
            if (!profile) {
                return res.status(404).json({
                    ok: false,
                    message: "Perfil público no encontrado",
                });
            }
            return res.json({
                ok: true,
                profile,
            });
        }
        catch (error) {
            return res.status(500).json({
                ok: false,
                message: error instanceof Error
                    ? error.message
                    : "Error obteniendo perfil público",
            });
        }
    },
    async upsert(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ ok: false, message: "Usuario no autenticado" });
            }
            const profile = await company_profile_service_1.companyProfileService.upsert({
                ...req.body,
                user_id: userId,
            });
            return res.json({ ok: true, profile });
        }
        catch (error) {
            return res.status(400).json({
                ok: false,
                message: error instanceof Error
                    ? error.message
                    : "Error guardando perfil de empresa",
            });
        }
    },
    async upsertMe(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    ok: false,
                    message: "Usuario no autenticado",
                });
            }
            const profile = await company_profile_service_1.companyProfileService.upsert({
                ...req.body,
                user_id: userId,
            });
            return res.json({
                ok: true,
                profile,
            });
        }
        catch (error) {
            return res.status(400).json({
                ok: false,
                message: error instanceof Error
                    ? error.message
                    : "Error guardando perfil de empresa",
            });
        }
    },
};
