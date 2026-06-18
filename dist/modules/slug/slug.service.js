"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSlugByUserIdService = getSlugByUserIdService;
exports.insertSlugService = insertSlugService;
exports.getSlugByValueService = getSlugByValueService;
const slug_repository_1 = require("./slug.repository");
const RESERVED_SLUGS = [
    "admin",
    "api",
    "login",
    "auth",
    "dashboard",
    "calendar",
    "booking",
    "home",
    "support",
    "config",
    "settings",
    "profile",
    "user",
    "users",
    "public",
    "open",
    "menu",
    "v",
];
async function getSlugByUserIdService(userId) {
    return await (0, slug_repository_1.findSlugByUserIdRepository)(userId);
}
async function insertSlugService({ userId, slug, }) {
    const cleanSlug = slug.trim().toLowerCase();
    const existingSlug = await (0, slug_repository_1.findSlugByUserIdRepository)(userId);
    if (existingSlug) {
        throw new Error("Este usuario ya tiene un slug configurado");
    }
    if (cleanSlug.length < 5) {
        throw new Error("El nombre debe tener al menos 5 caracteres");
    }
    if (cleanSlug.length > 20) {
        throw new Error("El nombre no puede superar los 20 caracteres");
    }
    if (!/^[a-z0-9_-]+$/.test(cleanSlug)) {
        throw new Error("Solo se permiten letras, números, guiones (-) y guiones bajos (_)");
    }
    if (cleanSlug.startsWith("-") || cleanSlug.startsWith("_")) {
        throw new Error("El nombre no puede comenzar con guion o guion bajo");
    }
    if (cleanSlug.endsWith("-") || cleanSlug.endsWith("_")) {
        throw new Error("El nombre no puede terminar con guion o guion bajo");
    }
    if (cleanSlug.includes("--") || cleanSlug.includes("__")) {
        throw new Error("No se permiten guiones consecutivos");
    }
    if (RESERVED_SLUGS.includes(cleanSlug)) {
        throw new Error("Ese nombre está reservado");
    }
    const slugAlreadyExists = await (0, slug_repository_1.findSlugByValueRepository)(cleanSlug);
    if (slugAlreadyExists) {
        throw new Error("Ese nombre ya se encuentra ocupado");
    }
    return (0, slug_repository_1.insertSlugRepository)({
        userId,
        slug: cleanSlug,
    });
}
async function getSlugByValueService(slug) {
    if (!slug) {
        throw Error("slug no encontrado[getSlugByValueService]");
    }
    return await (0, slug_repository_1.findSlugByValueRepository)(slug);
}
