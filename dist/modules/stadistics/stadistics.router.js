"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const stadistics_controller_1 = require("./stadistics.controller");
const router = express_1.default.Router();
// Rutas públicas (sin auth)
router.get("/public/reviews/:userId", stadistics_controller_1.statisticsController.getPublicReviews);
router.use(auth_middleware_1.authMiddleware);
// Stats
router.post("/stats/:userId/increment", stadistics_controller_1.statisticsController.increment);
router.get("/stats/:userId/dashboard", stadistics_controller_1.statisticsController.getDashboard);
router.get("/stats/:userId/home", stadistics_controller_1.statisticsController.getHomeStats);
router.get("/stats/:userId/today", stadistics_controller_1.statisticsController.getTodayStats);
// Reviews — summary must be before /:userId to avoid route conflict
router.get("/stats/:userId/business", stadistics_controller_1.statisticsController.getBusinessStats);
router.get("/stats/:userId/reviews/summary", stadistics_controller_1.statisticsController.getReviewsSummary);
router.post("/stats/:userId/reviews", stadistics_controller_1.statisticsController.createReview);
router.get("/stats/:userId/reviews", stadistics_controller_1.statisticsController.getAllReviews);
router.delete("/stats/:userId/reviews/:reviewId", stadistics_controller_1.statisticsController.deleteReview);
exports.default = router;
