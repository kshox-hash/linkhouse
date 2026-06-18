"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
function mapRow(row) {
    return {
        id: row.id,
        userId: row.user_id,
        type: row.type,
        priority: row.priority,
        title: row.title,
        message: row.message,
        entityId: row.entity_id,
        entityType: row.entity_type,
        action: row.action,
        isRead: row.is_read,
        readAt: row.read_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
class NotificationRepository {
    async create(data) {
        const pool = db_configuration_1.default.getPool();
        const result = await pool.query(`
      INSERT INTO notifications (
        user_id,
        type,
        priority,
        title,
        message,
        entity_id,
        entity_type,
        action
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `, [
            data.userId,
            data.type,
            data.priority ?? "normal",
            data.title,
            data.message,
            data.entityId ?? null,
            data.entityType ?? null,
            data.action ?? null,
        ]);
        return mapRow(result.rows[0]);
    }
    async findByUserId(userId, limit = 30) {
        const pool = db_configuration_1.default.getPool();
        const result = await pool.query(`
      SELECT *
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
      `, [userId, limit]);
        return result.rows.map(mapRow);
    }
    async countUnread(userId) {
        const pool = db_configuration_1.default.getPool();
        const result = await pool.query(`
      SELECT COUNT(*)::int AS total
      FROM notifications
      WHERE user_id = $1
        AND is_read = false
      `, [userId]);
        return result.rows[0]?.total ?? 0;
    }
    async markAsRead(notificationId, userId) {
        const pool = db_configuration_1.default.getPool();
        await pool.query(`
      UPDATE notifications
      SET
        is_read = true,
        read_at = NOW(),
        updated_at = NOW()
      WHERE id = $1
        AND user_id = $2
      `, [notificationId, userId]);
    }
    async markAllAsRead(userId) {
        const pool = db_configuration_1.default.getPool();
        await pool.query(`
      UPDATE notifications
      SET
        is_read = true,
        read_at = NOW(),
        updated_at = NOW()
      WHERE user_id = $1
        AND is_read = false
      `, [userId]);
    }
}
exports.NotificationRepository = NotificationRepository;
