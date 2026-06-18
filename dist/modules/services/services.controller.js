"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesController = void 0;
const services_repository_1 = require("./services.repository");
function uid(req) {
    return String(req.params["userId"]);
}
function isForbidden(req) {
    return req.user?.userId !== uid(req);
}
exports.servicesController = {
    async list(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const services = await (0, services_repository_1.getServices)(uid(req));
            return res.json({ ok: true, services });
        }
        catch (e) {
            return res.status(500).json({ ok: false, message: e?.message });
        }
    },
    async create(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const { name, description, durationMinutes, price } = req.body;
            if (!name)
                return res.status(400).json({ ok: false, message: "name es requerido" });
            const service = await (0, services_repository_1.createService)(uid(req), String(name), description ? String(description) : null, Number(durationMinutes ?? 60), Number(price ?? 0));
            return res.status(201).json({ ok: true, service });
        }
        catch (e) {
            return res.status(500).json({ ok: false, message: e?.message });
        }
    },
    async update(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const id = String(req.params["serviceId"]);
            const { name, description, durationMinutes, price, active } = req.body;
            if (!name)
                return res.status(400).json({ ok: false, message: "name es requerido" });
            const service = await (0, services_repository_1.updateService)(id, uid(req), String(name), description ? String(description) : null, Number(durationMinutes ?? 60), Number(price ?? 0), active !== false);
            if (!service)
                return res.status(404).json({ ok: false, message: "Servicio no encontrado" });
            return res.json({ ok: true, service });
        }
        catch (e) {
            return res.status(500).json({ ok: false, message: e?.message });
        }
    },
    async remove(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const id = String(req.params["serviceId"]);
            await (0, services_repository_1.deleteService)(id, uid(req));
            return res.json({ ok: true });
        }
        catch (e) {
            return res.status(500).json({ ok: false, message: e?.message });
        }
    },
};
