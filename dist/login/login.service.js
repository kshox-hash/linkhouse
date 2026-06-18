"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
exports.loginWithGoogle = loginWithGoogle;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_configuration_1 = __importDefault(require("../db/db_configuration"));
const google_auth_library_1 = require("google-auth-library");
async function loginUser(email, password) {
    const pool = db_configuration_1.default.getPool();
    const result = await pool.query(`
    select id, email, password
    from users
    where lower(email) = lower($1)
    limit 1
    `, [email]);
    if (result.rowCount === 0) {
        throw new Error("Usuario no existe");
    }
    const user = result.rows[0];
    const isValid = await bcrypt_1.default.compare(password, user.password);
    if (!isValid) {
        throw new Error("Credenciales inválidas");
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
        },
    };
}
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
async function loginWithGoogle(idToken) {
    //get 
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
        throw new Error("Token de Google inválido");
    }
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;
    if (!email) {
        throw new Error("Google no devolvió correo");
    }
    const pool = db_configuration_1.default.getPool();
    let result = await pool.query(`
    select id, email
    from users
    where lower(email) = lower($1)
    limit 1
    `, [email]);
    let user = result.rows[0];
    if (!user) {
        result = await pool.query(`
      insert into users (email, password)
      values ($1, $2)
      returning id, email
      `, [email, null]);
        user = result.rows[0];
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name,
            picture,
        },
    };
}
