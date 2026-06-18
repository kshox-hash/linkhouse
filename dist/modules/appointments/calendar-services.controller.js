"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarServicesController = void 0;
const calendar_services_repository_1 = require("./calendar-services.repository");
exports.calendarServicesController = {
    async list(req, res) {
        try {
            const userId = String(req.user?.userId ?? "").trim();
            const services = await (0, calendar_services_repository_1.getServicesByUserId)(userId);
            return res.json({ ok: true, services });
        }
        catch (err) {
            console.error("[calendar-services] list:", err);
            return res.status(500).json({ ok: false, message: "No se pudieron cargar los servicios." });
        }
    },
    async listPublic(req, res) {
        try {
            const userId = String(req.params["userId"] || "").trim();
            const services = await (0, calendar_services_repository_1.getActiveServicesByUserId)(userId);
            return res.json({ ok: true, services });
        }
        catch (err) {
            console.error("[calendar-services] listPublic:", err);
            return res.status(500).json({ ok: false, message: "No se pudieron cargar los servicios." });
        }
    },
    async create(req, res) {
        try {
            const userId = String(req.user?.userId ?? "").trim();
            const body = req.body || {};
            const name = String(body.name || "").trim();
            const price = Number(body.price ?? 0);
            const color = String(body.color || "#63ACF1").trim();
            const durationMinutes = body.durationMinutes != null ? Number(body.durationMinutes) : null;
            if (!name)
                return res.status(400).json({ ok: false, message: "El nombre es obligatorio." });
            if (price < 0)
                return res.status(400).json({ ok: false, message: "El precio no puede ser negativo." });
            const service = await (0, calendar_services_repository_1.createService)({ userId, name, price, durationMinutes, color });
            return res.status(201).json({ ok: true, service });
        }
        catch (err) {
            console.error("[calendar-services] create:", err);
            return res.status(500).json({ ok: false, message: "No se pudo crear el servicio." });
        }
    },
    async update(req, res) {
        try {
            const userId = String(req.user?.userId ?? "").trim();
            const id = String(req.params["id"] || "").trim();
            const body = req.body || {};
            const name = String(body.name || "").trim();
            const price = Number(body.price ?? 0);
            const color = String(body.color || "#63ACF1").trim();
            const isActive = body.isActive !== false;
            const durationMinutes = body.durationMinutes != null ? Number(body.durationMinutes) : null;
            if (!name)
                return res.status(400).json({ ok: false, message: "El nombre es obligatorio." });
            const service = await (0, calendar_services_repository_1.updateService)({ id, userId, name, price, durationMinutes, color, isActive });
            if (!service)
                return res.status(404).json({ ok: false, message: "Servicio no encontrado." });
            return res.json({ ok: true, service });
        }
        catch (err) {
            console.error("[calendar-services] update:", err);
            return res.status(500).json({ ok: false, message: "No se pudo actualizar el servicio." });
        }
    },
    async remove(req, res) {
        try {
            const userId = String(req.user?.userId ?? "").trim();
            const id = String(req.params["id"] || "").trim();
            const deleted = await (0, calendar_services_repository_1.deleteService)(id, userId);
            if (!deleted)
                return res.status(404).json({ ok: false, message: "Servicio no encontrado." });
            return res.json({ ok: true });
        }
        catch (err) {
            console.error("[calendar-services] remove:", err);
            return res.status(500).json({ ok: false, message: "No se pudo eliminar el servicio." });
        }
    },
};
