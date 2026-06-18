"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const env_1 = require("../config/env");
class DB {
    static getPool() {
        if (!DB.pool) {
            DB.pool = new pg_1.Pool({
                host: env_1.PGHOST,
                port: env_1.PGPORT,
                user: env_1.PGUSER,
                password: env_1.PGPASSWORD,
                database: env_1.PGDATABASE,
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 5000,
                ssl: {
                    // Render Postgres usa certificados autofirmados; cambiar a true
                    // si se provee el CA cert en PGSSLROOTCERT
                    rejectUnauthorized: false,
                },
            });
            DB.pool.on("error", (err) => {
                console.error("[db] Pool error:", err);
            });
        }
        return DB.pool;
    }
    static async testConnection() {
        const pool = DB.getPool();
        const result = await pool.query("SELECT NOW() AS now");
        console.log("[db] PostgreSQL conectado:", result.rows[0].now);
    }
    static async withTransaction(fn) {
        const pool = DB.getPool();
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const result = await fn(client);
            await client.query("COMMIT");
            return result;
        }
        catch (err) {
            try {
                await client.query("ROLLBACK");
            }
            catch { /* ignorar fallo de rollback */ }
            throw err;
        }
        finally {
            client.release();
        }
    }
}
DB.pool = null;
exports.default = DB;
