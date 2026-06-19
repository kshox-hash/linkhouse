"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleStartController = googleStartController;
exports.googleCallbackController = googleCallbackController;
exports.loginController = loginController;
exports.googleLoginController = googleLoginController;
const login_service_1 = require("./login.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
function googleStartController(req, res, next) {
    passport_1.default.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })(req, res, next);
}
async function googleCallbackController(req, res) {
    const authUser = req.user;
    // flujo portal
    if (authUser?.__type === "portal") {
        const token = jsonwebtoken_1.default.sign({ email: authUser.email, name: authUser.name ?? "", picture: authUser.picture ?? "" }, process.env.JWT_SECRET, { expiresIn: "7d", issuer: "portal" });
        res.cookie("portal_session", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.redirect("/shop/" + encodeURIComponent(authUser.slug));
    }
    // flujo app (dueño del negocio)
    if (!authUser?.token || !authUser?.user) {
        return res.status(401).send("No se pudo iniciar sesión");
    }
    const deeplinkBase = process.env.APP_DEEPLINK_URL || "automatiza://auth";
    const redirectUrl = `${deeplinkBase}` +
        `?token=${encodeURIComponent(authUser.token)}` +
        `&userId=${encodeURIComponent(authUser.user.id)}` +
        `&email=${encodeURIComponent(authUser.user.email)}` +
        `&name=${encodeURIComponent(authUser.user.name ?? "")}` +
        `&picture=${encodeURIComponent(authUser.user.picture ?? "")}`;
    return res.redirect(redirectUrl);
}
async function loginController(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                message: "Correo y contraseña son obligatorios",
            });
        }
        const result = await (0, login_service_1.loginUser)(email, password);
        return res.status(200).json({
            ok: true,
            token: result.token,
            user: result.user,
        });
    }
    catch (error) {
        console.error("LOGIN ERROR:", error.message);
        return res.status(401).json({
            ok: false,
            message: error.message,
        });
    }
}
const login_service_2 = require("./login.service");
async function googleLoginController(req, res) {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({
                ok: false,
                message: "Token de Google obligatorio",
            });
        }
        const result = await (0, login_service_2.loginWithGoogle)(idToken);
        return res.status(200).json({
            ok: true,
            token: result.token,
            user: result.user,
        });
    }
    catch (error) {
        console.error("GOOGLE LOGIN ERROR:", error.message);
        return res.status(401).json({
            ok: false,
            message: error.message,
        });
    }
}
