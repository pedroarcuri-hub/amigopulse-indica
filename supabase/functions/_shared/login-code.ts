const CORPORATE_SUFFIXES = ["@amigotech.com.br", "@amigoapp.com.br"] as const;
const CODE_TTL_MINUTES = 10;

export function isCorporateEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return CORPORATE_SUFFIXES.some((suffix) => normalized.endsWith(suffix));
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function generateSixDigitCode(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return String(n).padStart(6, "0");
}

export async function hashCode(code: string): Promise<string> {
  const data = new TextEncoder().encode(code);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function codesMatch(storedHash: string, plainCode: string): Promise<boolean> {
  return hashCode(plainCode).then((h) => timingSafeEqual(storedHash, h));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function expiresAt(): string {
  return new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString();
}

export async function notifyMakeWebhook(payload: {
  email: string;
  code: string;
  expires_at: string;
  app: string;
}): Promise<void> {
  const url = Deno.env.get("MAKE_LOGIN_CODE_WEBHOOK_URL");
  if (!url) {
    console.warn("MAKE_LOGIN_CODE_WEBHOOK_URL not set; skipping Make notification");
    return;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Make webhook failed (${res.status}): ${text}`);
  }
}
