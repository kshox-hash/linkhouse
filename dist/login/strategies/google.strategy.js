"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const picture = profile.photos?.[0]?.value;
        if (!email) {
            return done(new Error("Google no devolvió correo"));
        }
        const pool = db_configuration_1.default.getPool();
        let result = await pool.query(`
          SELECT id, email
          FROM users
          WHERE lower(email) = lower($1)
          LIMIT 1
          `, [email]);
        let user = result.rows[0];
        if (!user) {
            result = await pool.query(`
            INSERT INTO users (
              email,
              password
            )
            VALUES (
              $1,
              $2
            )
            RETURNING id, email
            `, [email, null]);
            user = result.rows[0];
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
        }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return done(null, {
            token,
            user: {
                id: user.id,
                email: user.email,
                name,
                picture,
            },
        });
    }
    catch (error) {
        return done(error);
    }
}));
