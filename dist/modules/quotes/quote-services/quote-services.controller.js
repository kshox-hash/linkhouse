"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteServicesController = void 0;
const repo = __importStar(require("./quote-services.repository"));
exports.quoteServicesController = {
    async list(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return res.status(401).json({ ok: false, message: "No autorizado" });
            const services = await repo.listQuoteServices(userId);
            return res.json({ ok: true, services });
        }
        catch (e) {
            return res.status(500).json({ ok: false, message: e.message });
        }
    },
    async create(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return res.status(401).json({ ok: false, message: "No autorizado" });
            const { name, description, unit = "unidad", price } = req.body;
            if (!name?.trim())
                return res.status(400).json({ ok: false, message: "Nombre es requerido" });
            if (price == null || isNaN(Number(price)) || Number(price) < 0)
                return res.status(400).json({ ok: false, message: "Precio inválido" });
            const service = await repo.createQuoteService(userId, {
                name: name.trim(),
                description: description?.trim() || undefined,
                unit: unit || "unidad",
                price: Number(price),
            });
            return res.status(201).json({ ok: true, service });
        }
        catch (e) {
            return res.status(500).json({ ok: false, message: e.message });
        }
    },
    async update(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return res.status(401).json({ ok: false, message: "No autorizado" });
            const serviceId = String(req.params["serviceId"]);
            const { name, description, unit, price, isActive } = req.body;
            const service = await repo.updateQuoteService(userId, serviceId, {
                name: name?.trim(),
                description: description !== undefined ? (description?.trim() || null) : undefined,
                unit: unit?.trim(),
                price: price != null ? Number(price) : undefined,
                isActive,
            });
            if (!service)
                return res.status(404).json({ ok: false, message: "Servicio no encontrado" });
            return res.json({ ok: true, service });
        }
        catch (e) {
            return res.status(500).json({ ok: false, message: e.message });
        }
    },
    async remove(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return res.status(401).json({ ok: false, message: "No autorizado" });
            const deleted = await repo.deleteQuoteService(userId, String(req.params["serviceId"]));
            if (!deleted)
                return res.status(404).json({ ok: false, message: "Servicio no encontrado" });
            return res.json({ ok: true });
        }
        catch (e) {
            return res.status(500).json({ ok: false, message: e.message });
        }
    },
};
