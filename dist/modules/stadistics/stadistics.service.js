"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsService = void 0;
const statistics_repository_1 = require("./statistics.repository");
class StatisticsService {
    constructor(repo = new statistics_repository_1.StatisticsRepository()) {
        this.repo = repo;
    }
    /**
     * SIN CAMBIOS. Llama al repository para incrementar
     * el contador total + el contador diario.
     */
    async increment(userId, metric, moduleId) {
        return this.repo.increment(userId, metric, moduleId);
    }
    /**
     * SIN CAMBIOS respecto a tu código original.
     */
    async getDashboard(userId) {
        const rows = await this.repo.getByUser(userId);
        return rows.reduce((acc, row) => {
            const key = row.module_id
                ? `${row.metric}_${row.module_id}`
                : `${row.metric}_global`;
            acc[key] = Number(row.count);
            return acc;
        }, {});
    }
    /**
     * SIN CAMBIOS respecto a tu código original.
     */
    async getHomeStats(userId) {
        const dashboard = await this.getDashboard(userId);
        return {
            quotes: dashboard['quotes_global'] ?? 0,
            bookings: dashboard['bookings_global'] ?? 0,
            clients: dashboard['clients_global'] ?? 0,
            messages: dashboard['messages_global'] ?? 0,
            pageViews: dashboard['page_views_global'] ?? 0,
        };
    }
    /**
     * NUEVO: para el donut "Apertura link" con tendencia.
     *
     * Devuelve:
     * - total: aperturas en el periodo (ej. últimos 30 días)
     * - percentChange: % de cambio vs el periodo anterior
     *   (null si no hay datos del periodo anterior, para
     *   evitar dividir por cero)
     * - series: array [{date, count}] para dibujar un gráfico
     *   de línea/barras
     */
    async getTodayStats(userId) {
        const rows = await this.repo.getTodayStats(userId);
        return rows.reduce((acc, row) => {
            const key = row.module_id
                ? `${row.metric}_${row.module_id}`
                : `${row.metric}_global`;
            acc[key] = Number(row.count);
            return acc;
        }, {});
    }
}
exports.StatisticsService = StatisticsService;
