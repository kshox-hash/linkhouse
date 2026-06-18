"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
const notification_repository_1 = require("./notification.repository");
class NotificationService {
    constructor(repository = new notification_repository_1.NotificationRepository()) {
        this.repository = repository;
    }
    async create(data) {
        return this.repository.create(data);
    }
    async findByUserId(userId, limit = 30) {
        return this.repository.findByUserId(userId, limit);
    }
    async countUnread(userId) {
        return this.repository.countUnread(userId);
    }
    async markAsRead(notificationId, userId) {
        return this.repository.markAsRead(notificationId, userId);
    }
    async markAllAsRead(userId) {
        return this.repository.markAllAsRead(userId);
    }
    async bookingCreated(params) {
        return this.create({
            userId: params.userId,
            type: "booking",
            priority: "normal",
            title: "Nueva reserva",
            message: params.startText
                ? `${params.customerName} reservó una hora para ${params.startText}.`
                : `${params.customerName} reservó una hora.`,
            entityId: params.bookingId,
            entityType: "booking",
            action: "open_booking",
        });
    }
    async quoteCreated(params) {
        return this.create({
            userId: params.userId,
            type: "quote",
            priority: "normal",
            title: "Nueva cotización",
            message: params.customerName
                ? `Se creó una cotización para ${params.customerName}.`
                : "Se creó una nueva cotización.",
            entityId: null,
            entityType: "quote",
            action: "open_quote",
        });
    }
    async systemAlert(params) {
        return this.create({
            userId: params.userId,
            type: "system",
            priority: params.priority ?? "normal",
            title: params.title,
            message: params.message,
            entityId: null,
            entityType: null,
            action: null,
        });
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
