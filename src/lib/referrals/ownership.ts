import type { ReferralRow } from "@/lib/db-adapter";

export function normalizeUserEmail(email: string | null | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

/** Indicação pertence ao usuário logado (created_by_email ou referrer_email). */
export function referralBelongsToUser(
  referral: ReferralRow,
  userEmail: string,
): boolean {
  const current = normalizeUserEmail(userEmail);
  if (!current) return false;

  const created = normalizeUserEmail(referral.created_by_email);
  const referrer = normalizeUserEmail(referral.referrer_email ?? undefined);

  return created === current || referrer === current;
}

export function filterReferralsByUserEmail(
  rows: ReferralRow[],
  userEmail: string,
): ReferralRow[] {
  return rows.filter((r) => referralBelongsToUser(r, userEmail));
}
