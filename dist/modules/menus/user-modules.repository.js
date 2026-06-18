"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEnabledModulesByUserId = findEnabledModulesByUserId;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
const DEFAULT_MODULES = [
    {
        code: "cotizador",
        title: "Cotizador",
        description: "Selecciona productos o servicios y envía una solicitud de cotización.",
        icon: "🧾",
        enabled: true,
        sortOrder: 1,
    },
    {
        code: "reservas",
        title: "Reservas",
        description: "Agenda una hora seleccionando servicio, día y horario.",
        icon: "📅",
        enabled: true,
        sortOrder: 2,
    },
];
async function findEnabledModulesByUserId(userId) {
    try {
        const res = await db_configuration_1.default.getPool().query(`
      SELECT
        module_code,
        title,
        description,
        icon,
        enabled,
        sort_order
      FROM user_modules
      WHERE user_id = $1
        AND enabled = true
      ORDER BY sort_order ASC
      `, [userId]);
        if (!res.rowCount) {
            return DEFAULT_MODULES;
        }
        return res.rows.map((row) => ({
            code: row.module_code,
            title: row.title,
            description: row.description,
            icon: row.icon || "🔹",
            enabled: row.enabled,
            sortOrder: Number(row.sort_order || 0),
        }));
    }
    catch (error) {
        console.warn("No se pudo leer user_modules. Usando módulos por defecto.");
        return DEFAULT_MODULES;
    }
}
