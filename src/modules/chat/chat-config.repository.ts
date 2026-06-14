/*
  Migration SQL — ejecutar una vez en la DB:

  CREATE TABLE IF NOT EXISTS business_chat_config (
    id          SERIAL PRIMARY KEY,
    user_id     TEXT NOT NULL UNIQUE,
    description TEXT,
    faq         JSONB NOT NULL DEFAULT '[]',
    extra_info  TEXT,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
*/

import DB from "../../db/db_configuration";

export type FaqItem = { question: string; answer: string };

export type BusinessChatConfig = {
  userId:      string;
  description: string | null;
  faq:         FaqItem[];
  extraInfo:   string | null;
};

export async function getBusinessChatConfig(userId: string): Promise<BusinessChatConfig | null> {
  const res = await DB.getPool().query(
    `SELECT user_id, description, faq, extra_info
     FROM business_chat_config
     WHERE user_id = $1`,
    [userId]
  );
  if (!res.rowCount) return null;
  const row = res.rows[0];
  return {
    userId:      row.user_id,
    description: row.description ?? null,
    faq:         Array.isArray(row.faq) ? row.faq : [],
    extraInfo:   row.extra_info ?? null,
  };
}

export async function upsertBusinessChatConfig(
  userId: string,
  data: { description?: string | null; faq?: FaqItem[]; extraInfo?: string | null }
): Promise<void> {
  await DB.getPool().query(
    `INSERT INTO business_chat_config (user_id, description, faq, extra_info, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (user_id) DO UPDATE SET
       description = EXCLUDED.description,
       faq         = EXCLUDED.faq,
       extra_info  = EXCLUDED.extra_info,
       updated_at  = NOW()`,
    [
      userId,
      data.description ?? null,
      JSON.stringify(data.faq ?? []),
      data.extraInfo ?? null,
    ]
  );
}
