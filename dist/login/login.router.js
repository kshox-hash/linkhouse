"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const login_controller_1 = require("./login.controller");
const router = (0, express_1.Router)();
router.post("/login", login_controller_1.loginController);
router.post("/google", login_controller_1.googleLoginController);
router.get("/google/start", login_controller_1.googleStartController);
router.get("/google/callback", passport_1.default.authenticate("google", {
    session: false,
    failureRedirect: "/auth/google/failure",
}), login_controller_1.googleCallbackController);
router.get("/google/failure", (_, res) => {
    return res.status(401).send("Error iniciando sesión con Google");
});
router.get("/logout", (_req, res) => {
    return res.redirect("https://accounts.google.com/logout");
});
exports.default = router;
