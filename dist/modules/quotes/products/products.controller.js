"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsController = void 0;
const products_service_1 = require("./products.service");
exports.productsController = {
    async create(req, res) {
        try {
            const userId = req.user?.userId;
            const product = await products_service_1.productsService.create(userId, req.body);
            return res.status(201).json({ ok: true, product });
        }
        catch (err) {
            return res.status(err.status || 500).json({ ok: false, message: err.message || "Error creando producto." });
        }
    },
    async getAll(req, res) {
        try {
            const userId = req.user?.userId;
            const products = await products_service_1.productsService.getAll(userId);
            return res.json({ ok: true, products });
        }
        catch (err) {
            return res.status(err.status || 500).json({ ok: false, message: err.message || "Error obteniendo productos." });
        }
    },
    async getById(req, res) {
        try {
            const userId = req.user?.userId;
            const product = await products_service_1.productsService.getById(userId, req.params.productId);
            return res.json({ ok: true, product });
        }
        catch (err) {
            return res.status(err.status || 500).json({ ok: false, message: err.message || "Error obteniendo producto." });
        }
    },
    async update(req, res) {
        try {
            const userId = req.user?.userId;
            const product = await products_service_1.productsService.update(userId, req.params.productId, req.body);
            return res.json({ ok: true, product });
        }
        catch (err) {
            return res.status(err.status || 500).json({ ok: false, message: err.message || "Error actualizando producto." });
        }
    },
    async delete(req, res) {
        try {
            const userId = req.user?.userId;
            await products_service_1.productsService.delete(userId, req.params.productId);
            return res.json({ ok: true, message: "Producto eliminado." });
        }
        catch (err) {
            return res.status(err.status || 500).json({ ok: false, message: err.message || "Error eliminando producto." });
        }
    },
    // Ruta pública — para el cotizador
    async getActivePublic(req, res) {
        try {
            const { userId } = req.params;
            const products = await products_service_1.productsService.getActiveProducts(userId);
            return res.json({ ok: true, products });
        }
        catch (err) {
            return res.status(err.status || 500).json({ ok: false, message: err.message || "Error obteniendo productos." });
        }
    },
};
