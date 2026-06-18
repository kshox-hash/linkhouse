"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllNotificationsReadController = exports.markNotificationReadController = exports.getNotificationsController = void 0;
const notification_service_1 = require("./notification.service");
function forbidden(req) {
    return req.user?.userId !== String(req.params.userId);
}
const getNotificationsController = async (req, res) => {
    if (forbidden(req))
        return res.status(403).json({ ok: false, message: "Forbidden" });
    try {
        const userId = String(req.params.userId);
        const limit = Number(req.query.limit ?? 30);
        const notifications = await notification_service_1.notificationService.findByUserId(userId, limit);
        const unreadCount = await notification_service_1.notificationService.countUnread(userId);
        return res.json({ ok: true, unreadCount, notifications });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            message: error?.message || "No se pudieron cargar las notificaciones.",
        });
    }
};
exports.getNotificationsController = getNotificationsController;
const markNotificationReadController = async (req, res) => {
    if (req.user?.userId !== String(req.params.userId))
        return res.status(403).json({ ok: false, message: "Forbidden" });
    try {
        await notification_service_1.notificationService.markAsRead(String(req.params.notificationId), String(req.params.userId));
        return res.json({ ok: true });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            message: error?.message || "No se pudo marcar como leída.",
        });
    }
};
exports.markNotificationReadController = markNotificationReadController;
const markAllNotificationsReadController = async (req, res) => {
    if (forbidden(req))
        return res.status(403).json({ ok: false, message: "Forbidden" });
    try {
        await notification_service_1.notificationService.markAllAsRead(String(req.params.userId));
        return res.json({ ok: true });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            message: error?.message || "No se pudieron marcar como leídas.",
        });
    }
};
exports.markAllNotificationsReadController = markAllNotificationsReadController;
