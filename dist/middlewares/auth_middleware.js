"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function authMiddleware(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({ error: "Token requerido" });
        }
        if (!authorization.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Formato de token inválido" });
        }
        const token = authorization.replace("Bearer ", "").trim();
        const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        };
        return next();
    }
    catch {
        return res.status(401).json({
            error: "Token inválido o expirado",
        });
    }
}
