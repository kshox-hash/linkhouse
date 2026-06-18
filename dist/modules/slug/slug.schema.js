"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertSlugSchema = void 0;
const zod_1 = require("zod");
exports.insertSlugSchema = zod_1.z.object({
    slug: zod_1.z
        .string()
        .trim()
        .min(3, "Debe tener al menos 3 caracteres")
        .max(120, "Máximo 120 caracteres")
        .regex(/^[a-z0-9-]+$/, "Solo letras, números y guiones"),
});
