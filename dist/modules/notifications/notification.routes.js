"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const notification_controller_1 = require("./notification.controller");
const router = express_1.default.Router();
router.use(auth_middleware_1.authMiddleware);
router.get("/notifications/:userId", notification_controller_1.getNotificationsController);
router.patch("/notifications/:userId/read-all", notification_controller_1.markAllNotificationsReadController);
router.patch("/notifications/:userId/:notificationId/read", notification_controller_1.markNotificationReadController);
exports.default = router;
