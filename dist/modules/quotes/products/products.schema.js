"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    code: zod_1.z.string().min(1).max(50).optional(),
    name: zod_1.z.string().min(1, "Nombre obligatorio").max(200),
    price: zod_1.z.coerce
        .number({ error: () => "Precio debe ser número" })
        .min(0, "Precio no puede ser negativo"),
    description: zod_1.z.string().max(500).optional(),
    sortOrder: zod_1.z.number().int().min(0).default(0),
});
exports.updateProductSchema = zod_1.z.object({
    code: zod_1.z.string().min(1).max(50).optional(),
    name: zod_1.z.string().min(1).max(200).optional(),
    price: zod_1.z.number().min(0).optional(),
    description: zod_1.z.string().max(500).nullable().optional(),
    sortOrder: zod_1.z.number().int().min(0).optional(),
    isActive: zod_1.z.boolean().optional(),
});
