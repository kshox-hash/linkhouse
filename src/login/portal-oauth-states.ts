import crypto from "crypto";

interface OAuthStateEntry { slug: string; expiresAt: number; }
const _states = new Map<string, OAuthStateEntry>();

export function createPortalOAuthState(slug: string): string {
  const token = crypto.randomBytes(20).toString("hex");
  _states.set(token, { slug, expiresAt: Date.now() + 10 * 60 * 1000 });
  return token;
}

export function consumePortalOAuthState(token: string): string | null {
  const entry = _states.get(token);
  _states.delete(token);
  if (!entry || entry.expiresAt < Date.now()) return null;
  return entry.slug;
}
