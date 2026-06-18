"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const admin_repository_1 = require("./admin.repository");
const ADMIN_USER_ID = process.env.ADMIN_USER_ID ?? "";
function getRequestUserId(req) {
    return String(req["userId"] ?? "").trim();
}
function isAdmin(req) {
    return !!ADMIN_USER_ID && getRequestUserId(req) === ADMIN_USER_ID;
}
exports.adminController = {
    async checkIsAdmin(req, res) {
        return res.json({ ok: true, isAdmin: isAdmin(req) });
    },
    async getUsers(req, res) {
        if (!isAdmin(req)) {
            return res.status(403).json({ ok: false, message: "Acceso denegado" });
        }
        try {
            const users = await (0, admin_repository_1.getAllUsersWithFee)();
            return res.json({ ok: true, users });
        }
        catch {
            return res.status(500).json({ ok: false, message: "Error al obtener usuarios" });
        }
    },
    async updateFee(req, res) {
        if (!isAdmin(req)) {
            return res.status(403).json({ ok: false, message: "Acceso denegado" });
        }
        try {
            const userId = String(req.params["userId"] ?? "").trim();
            const pct = Number(req.body?.fee_pct);
            if (!userId)
                return res.status(400).json({ ok: false, message: "userId requerido" });
            if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
                return res.status(400).json({ ok: false, message: "Porcentaje inválido (0–100)" });
            }
            await (0, admin_repository_1.updateUserFeePct)(userId, pct);
            return res.json({ ok: true, message: "Comisión actualizada" });
        }
        catch {
            return res.status(500).json({ ok: false, message: "Error actualizando comisión" });
        }
    },
};
