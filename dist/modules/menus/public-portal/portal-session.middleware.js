"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.portalSessionMiddleware = portalSessionMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function portalSessionMiddleware(req, res, next) {
    if (!process.env.GOOGLE_CLIENT_ID) {
        next();
        return;
    }
    const token = req.cookies?.["portal_session"];
    if (!token) {
        res.status(401).json({ ok: false, message: "No autenticado." });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, { issuer: "portal" });
        req.portalUser = payload;
        next();
    }
    catch {
        res.status(401).json({ ok: false, message: "Sesión expirada." });
    }
}
