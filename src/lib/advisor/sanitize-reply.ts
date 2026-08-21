/**
 * Strip media/audio cue markers some models (e.g. Lyria) inject into text,
 * like `[0.0:]`, `[7.2:]`, or `[24.0:28.8]`.
 */
export function sanitizeAdvisorReply(text: string) {
  return text
    .replace(/\[\d+(?:\.\d+)?\s*:\s*(?:\d+(?:\.\d+)?)?\s*\]/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ *\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
