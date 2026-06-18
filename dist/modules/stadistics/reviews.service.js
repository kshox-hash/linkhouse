"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const reviews_repository_1 = require("./reviews.repository");
class ReviewsService {
    constructor(repo = new reviews_repository_1.ReviewsRepository()) {
        this.repo = repo;
    }
    /**
     * Crea una reseña, validando que el rating esté entre 1 y 5
     * antes de tocar la base de datos.
     */
    async create(userId, rating, comment, clientName, moduleId) {
        if (rating < 1 || rating > 5) {
            throw new Error("El rating debe estar entre 1 y 5");
        }
        return this.repo.create(userId, rating, comment, clientName, moduleId);
    }
    /**
     * Resumen para el DASHBOARD (no paginado).
     * Devuelve:
     * {
     *   average: 4.6,
     *   total: 24,
     *   distribution: { 5: 18, 4: 4, 3: 1, 2: 1, 1: 0 },
     *   latestReview: { ... } | null
     * }
     */
    async getSummary(userId) {
        const [ratingData, distribution, recent] = await Promise.all([
            this.repo.getAverageRating(userId),
            this.repo.getRatingDistribution(userId),
            this.repo.getRecent(userId, 1),
        ]);
        return {
            average: ratingData.average,
            total: ratingData.total,
            distribution,
            latestReview: recent[0] ?? null,
        };
    }
    /**
     * Lista PAGINADA de reseñas para una pantalla
     * "Ver todas las reseñas".
     *
     * @param page     número de página, empieza en 1
     * @param pageSize cantidad de reseñas por página (máx 100)
     *
     * Devuelve:
     * {
     *   data: [...reseñas de esta página...],
     *   pagination: {
     *     page, pageSize, total, totalPages, hasNextPage
     *   }
     * }
     */
    async getAll(userId, page = 1, pageSize = 20) {
        // Evita páginas inválidas (negativas, 0, etc.)
        const safePage = Math.max(page, 1);
        // Evita pageSize gigante (ej. alguien pidiendo 10000 por página)
        const safePageSize = Math.min(Math.max(pageSize, 1), 100);
        const offset = (safePage - 1) * safePageSize;
        const { rows, total } = await this.repo.getAllPaginated(userId, safePageSize, offset);
        return {
            data: rows,
            pagination: {
                page: safePage,
                pageSize: safePageSize,
                total,
                totalPages: Math.ceil(total / safePageSize),
                hasNextPage: safePage * safePageSize < total,
            },
        };
    }
    /**
     * Borra una reseña.
     */
    async delete(reviewId, userId) {
        return this.repo.delete(reviewId, userId);
    }
}
exports.ReviewsService = ReviewsService;
