"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const mp_connect_controller_1 = require("./mp-connect.controller");
const router = express_1.default.Router();
// OAuth callback — sin auth (viene de MercadoPago)
router.get("/auth/mp/callback", mp_connect_controller_1.mpConnectController.callback);
// Rutas autenticadas
router.get("/api/payments/mp-connect-url", auth_middleware_1.authMiddleware, mp_connect_controller_1.mpConnectController.getConnectUrl);
router.get("/api/payments/mp-status/:userId", auth_middleware_1.authMiddleware, mp_connect_controller_1.mpConnectController.getStatus);
router.delete("/api/payments/mp-connection/:userId", auth_middleware_1.authMiddleware, mp_connect_controller_1.mpConnectController.disconnect);
exports.default = router;
