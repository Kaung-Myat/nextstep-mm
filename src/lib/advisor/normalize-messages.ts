export type AdvisorChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 12;
const MAX_CONTENT_CHARS = 6_000;

/** Accept only user/assistant roles and truncate oversized content. */
export function normalizeAdvisorMessages(raw: unknown): AdvisorChatMessage[] {
  if (!Array.isArray(raw)) return [];

  const out: AdvisorChatMessage[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const role = (entry as { role?: unknown }).role;
    const content = (entry as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") continue;
    const trimmed = content.trim();
    if (!trimmed) continue;
    out.push({ role, content: trimmed.slice(0, MAX_CONTENT_CHARS) });
  }

  return out.slice(-MAX_MESSAGES);
}
