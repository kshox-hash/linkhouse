"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsService = void 0;
const products_schema_1 = require("./products.schema");
const products_repository_1 = require("./products.repository");
exports.productsService = {
    async create(userId, body) {
        const parsed = products_schema_1.createProductSchema.safeParse(body);
        if (!parsed.success) {
            throw { status: 400, message: 'error[safeparse]' };
        }
        return (0, products_repository_1.createProductRepository)(userId, parsed.data);
    },
    async getAll(userId) {
        return (0, products_repository_1.getProductsRepository)(userId);
    },
    async getById(userId, productId) {
        const product = await (0, products_repository_1.getProductByIdRepository)(userId, productId);
        if (!product)
            throw { status: 404, message: "Producto no encontrado." };
        return product;
    },
    async update(userId, productId, body) {
        const parsed = products_schema_1.updateProductSchema.safeParse(body);
        if (!parsed.success) {
            throw { status: 400, message: "error[erroUpdate]" };
        }
        const existing = await (0, products_repository_1.getProductByIdRepository)(userId, productId);
        if (!existing)
            throw { status: 404, message: "Producto no encontrado." };
        const updated = await (0, products_repository_1.updateProductRepository)(userId, productId, parsed.data);
        return updated;
    },
    async delete(userId, productId) {
        const existing = await (0, products_repository_1.getProductByIdRepository)(userId, productId);
        if (!existing)
            throw { status: 404, message: "Producto no encontrado." };
        await (0, products_repository_1.deleteProductRepository)(userId, productId);
        return { ok: true };
    },
    async getActiveProducts(userId) {
        return (0, products_repository_1.getActiveProductsRepository)(userId);
    },
};
