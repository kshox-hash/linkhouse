"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSlugByUserIdRepository = findSlugByUserIdRepository;
exports.findSlugByValueRepository = findSlugByValueRepository;
exports.insertSlugRepository = insertSlugRepository;
const db_configuration_1 = __importDefault(require("../../db/db_configuration"));
async function findSlugByUserIdRepository(userId) {
    const result = await db_configuration_1.default.getPool().query(`
    SELECT *
    FROM user_slug_settings
    WHERE user_id = $1
    LIMIT 1
    `, [userId]);
    return result.rows[0] ?? null;
}
async function findSlugByValueRepository(slug) {
    const result = await db_configuration_1.default.getPool().query(`
    SELECT *
    FROM user_slug_settings
    WHERE public_slug = $1
    LIMIT 1
    `, [slug]);
    return result.rows[0] ?? null;
}
async function insertSlugRepository(params) {
    await db_configuration_1.default.getPool().query(`
    INSERT INTO user_slug_settings (
      user_id,
      public_slug,
      is_public_enabled
    )
    VALUES (
      $1,
      $2,
      true
    )
    `, [params.userId, params.slug]);
}
