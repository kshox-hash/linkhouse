"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSource = createSource;
exports.updateSourceChunkCount = updateSourceChunkCount;
exports.insertChunks = insertChunks;
exports.getChunksByUserId = getChunksByUserId;
exports.getSourcesByUserId = getSourcesByUserId;
exports.deleteSource = deleteSource;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
async function createSource(userId, filename) {
    const result = await db_configuration_1.default.getPool().query(`INSERT INTO chat_knowledge_sources (user_id, filename, chunk_count)
     VALUES ($1, $2, 0)
     RETURNING *`, [userId, filename]);
    return result.rows[0];
}
async function updateSourceChunkCount(sourceId, count) {
    await db_configuration_1.default.getPool().query(`UPDATE chat_knowledge_sources SET chunk_count = $1 WHERE id = $2`, [count, sourceId]);
}
async function insertChunks(userId, sourceId, chunks) {
    if (chunks.length === 0)
        return;
    const pool = db_configuration_1.default.getPool();
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        for (let i = 0; i < chunks.length; i++) {
            await client.query(`INSERT INTO chat_knowledge_chunks (user_id, source_id, chunk_text, chunk_index)
         VALUES ($1, $2, $3, $4)`, [userId, sourceId, chunks[i], i]);
        }
        await client.query("COMMIT");
    }
    catch (err) {
        await client.query("ROLLBACK");
        throw err;
    }
    finally {
        client.release();
    }
}
async function getChunksByUserId(userId) {
    const result = await db_configuration_1.default.getPool().query(`SELECT id, user_id, source_id, chunk_text, chunk_index
     FROM chat_knowledge_chunks
     WHERE user_id = $1
     ORDER BY source_id, chunk_index`, [userId]);
    return result.rows;
}
async function getSourcesByUserId(userId) {
    const result = await db_configuration_1.default.getPool().query(`SELECT id, user_id, filename, chunk_count, created_at
     FROM chat_knowledge_sources
     WHERE user_id = $1
     ORDER BY created_at DESC`, [userId]);
    return result.rows;
}
async function deleteSource(sourceId, userId) {
    const result = await db_configuration_1.default.getPool().query(`DELETE FROM chat_knowledge_sources WHERE id = $1 AND user_id = $2 RETURNING id`, [sourceId, userId]);
    return (result.rowCount ?? 0) > 0;
}
