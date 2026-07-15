import "server-only";

const allowedTags = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "blockquote",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "a"
]);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sanitizeAttributes(tag: string, rawAttributes: string) {
  if (tag !== "a") {
    return "";
  }

  const hrefMatch = rawAttributes.match(/\shref=(["'])(.*?)\1/i);
  const href = hrefMatch?.[2]?.trim();
  if (!href || !/^(https?:\/\/|mailto:|\/)/i.test(href)) {
    return "";
  }

  return ` href="${escapeHtml(href)}" rel="noopener noreferrer"`;
}

export function sanitizeRichText(html: string) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (match, rawTag: string, rawAttributes: string) => {
      const tag = rawTag.toLowerCase();
      if (!allowedTags.has(tag)) {
        return "";
      }
      if (match.startsWith("</")) {
        return `</${tag}>`;
      }
      return `<${tag}${sanitizeAttributes(tag, rawAttributes)}>`;
    })
    .trim();
}

export function richTextToPlainText(value: unknown) {
  const html = typeof value === "string"
    ? value
    : value && typeof value === "object" && "html" in value && typeof value.html === "string"
      ? value.html
      : "";

  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function richTextToHtml(value: unknown) {
  if (typeof value === "string") {
    return sanitizeRichText(value);
  }

  if (value && typeof value === "object" && "html" in value && typeof value.html === "string") {
    return sanitizeRichText(value.html);
  }

  return "";
}
