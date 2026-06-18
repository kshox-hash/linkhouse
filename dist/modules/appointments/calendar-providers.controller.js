"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarProvidersController = void 0;
const calendar_providers_repository_1 = require("./calendar-providers.repository");
exports.calendarProvidersController = {
    async list(req, res) {
        try {
            const userId = String(req.params["userId"] || "").trim();
            const authUserId = String(req.user?.userId ?? "").trim();
            if (!userId)
                return res.status(400).json({ ok: false, message: "userId requerido." });
            if (userId !== authUserId)
                return res.status(403).json({ ok: false, message: "Sin permisos." });
            const providers = await (0, calendar_providers_repository_1.getProvidersByUserId)(userId);
            return res.json({ ok: true, providers });
        }
        catch (error) {
            console.error("Error listando proveedores:", error);
            return res.status(500).json({ ok: false, message: "No se pudo obtener el equipo." });
        }
    },
    async create(req, res) {
        try {
            const userId = String(req.user?.userId ?? "").trim();
            if (!userId)
                return res.status(401).json({ ok: false, message: "No autorizado." });
            const { name, color } = req.body || {};
            if (!name)
                return res.status(400).json({ ok: false, message: "name es requerido." });
            const provider = await (0, calendar_providers_repository_1.createProvider)({
                userId,
                name: String(name),
                color: color ? String(color) : undefined,
            });
            return res.status(201).json({ ok: true, provider });
        }
        catch (error) {
            console.error("Error creando proveedor:", error);
            return res.status(500).json({ ok: false, message: "No se pudo crear el proveedor." });
        }
    },
    async update(req, res) {
        try {
            const id = String(req.params["id"] || "").trim();
            const authUserId = String(req.user?.userId ?? "").trim();
            const { name, color, isActive } = req.body || {};
            if (!id || !name)
                return res.status(400).json({ ok: false, message: "id y name son requeridos." });
            const provider = await (0, calendar_providers_repository_1.updateProvider)({ id, name: String(name), color: color ? String(color) : undefined, isActive, userId: authUserId });
            if (!provider)
                return res.status(404).json({ ok: false, message: "Proveedor no encontrado." });
            return res.json({ ok: true, provider });
        }
        catch (error) {
            console.error("Error actualizando proveedor:", error);
            return res.status(500).json({ ok: false, message: "No se pudo actualizar." });
        }
    },
    async remove(req, res) {
        try {
            const id = String(req.params["id"] || "").trim();
            const authUserId = String(req.user?.userId ?? "").trim();
            if (!id)
                return res.status(400).json({ ok: false, message: "id requerido." });
            await (0, calendar_providers_repository_1.deleteProvider)(id, authUserId);
            return res.json({ ok: true });
        }
        catch (error) {
            console.error("Error eliminando proveedor:", error);
            return res.status(500).json({ ok: false, message: "No se pudo eliminar." });
        }
    },
};
