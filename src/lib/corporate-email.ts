const CORPORATE_SUFFIXES = ["@amigotech.com.br", "@amigoapp.com.br"] as const;

export function isCorporateEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return CORPORATE_SUFFIXES.some((suffix) => normalized.endsWith(suffix));
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
