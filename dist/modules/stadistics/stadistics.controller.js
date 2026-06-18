"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statisticsController = void 0;
const stadistics_service_1 = require("./stadistics.service");
const reviews_service_1 = require("./reviews.service");
const booking_stats_repository_1 = require("./booking-stats.repository");
const statsService = new stadistics_service_1.StatisticsService();
const reviewsService = new reviews_service_1.ReviewsService();
function uid(req) {
    return String(req.params["userId"]);
}
function isForbidden(req) {
    return req.user?.userId !== uid(req);
}
exports.statisticsController = {
    async increment(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const { metric, moduleId } = req.body;
            if (!metric)
                return res.status(400).json({ ok: false, message: "metric es requerido" });
            await statsService.increment(uid(req), metric, moduleId);
            return res.status(200).json({ ok: true });
        }
        catch (error) {
            return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
        }
    },
    async getDashboard(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const data = await statsService.getDashboard(uid(req));
            return res.status(200).json(data);
        }
        catch (error) {
            return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
        }
    },
    async getHomeStats(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const data = await statsService.getHomeStats(uid(req));
            return res.status(200).json(data);
        }
        catch (error) {
            return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
        }
    },
    async getTodayStats(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const data = await statsService.getTodayStats(uid(req));
            return res.status(200).json(data);
        }
        catch (error) {
            return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
        }
    },
    async createReview(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const { rating, comment, clientName, moduleId } = req.body;
            if (!rating)
                return res.status(400).json({ ok: false, message: "rating es requerido" });
            const review = await reviewsService.create(uid(req), Number(rating), comment, clientName, moduleId);
            return res.status(201).json(review);
        }
        catch (error) {
            return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
        }
    },
    async getReviewsSummary(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const data = await reviewsService.getSummary(uid(req));
            return res.status(200).json(data);
        }
        catch (error) {
            return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
        }
    },
    async getAllReviews(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const page = req.query.page ? Number(req.query.page) : 1;
            const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 20;
            const data = await reviewsService.getAll(uid(req), page, pageSize);
            return res.status(200).json(data);
        }
        catch (error) {
            return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
        }
    },
    async deleteReview(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const reviewId = req.params["reviewId"];
            await reviewsService.delete(reviewId, uid(req));
            return res.status(200).json({ ok: true });
        }
        catch (error) {
            return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
        }
    },
    async getBusinessStats(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const userId = uid(req);
            const [revenue, portal, busiestSlots, clients, reviews, quotes] = await Promise.all([
                (0, booking_stats_repository_1.getRevenueStats)(userId),
                (0, booking_stats_repository_1.getPortalStats)(userId),
                (0, booking_stats_repository_1.getBusiestSlots)(userId),
                (0, booking_stats_repository_1.getClientStats)(userId),
                (0, booking_stats_repository_1.getReviewsStats)(userId),
                (0, booking_stats_repository_1.getQuotesStats)(userId),
            ]);
            return res.json({ ok: true, revenue, portal, busiestSlots, clients, reviews, quotes });
        }
        catch (error) {
            return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
        }
    },
    async getPublicReviews(req, res) {
        try {
            const userId = String(req.params["userId"]);
            const [summary, recent] = await Promise.all([
                reviewsService.getSummary(userId),
                reviewsService.getAll(userId, 1, 10),
            ]);
            return res.json({ ok: true, summary, reviews: recent.data });
        }
        catch (error) {
            return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
        }
    },
};
