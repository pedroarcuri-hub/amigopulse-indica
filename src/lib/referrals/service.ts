import { supabase } from "@/integrations/supabase/client";
import { toReferral, type ReferralRow } from "@/lib/db-adapter";
import { getMockReferrals } from "./mock-data";
import { filterReferralsByUserEmail, normalizeUserEmail } from "./ownership";

/**
 * Troque para `false` quando integrar com Supabase em produção.
 * Também pode ser controlado por VITE_USE_REFERRALS_MOCK=false no .env.
 */
export const USE_REFERRALS_MOCK =
  import.meta.env.VITE_USE_REFERRALS_MOCK !== "false";

export interface ListUserReferralsParams {
  userId: string;
  /** E-mail da sessão Supabase Auth — usado para filtrar created_by_email / referrer_email. */
  userEmail: string;
}

/**
 * Lista indicações do colaborador autenticado (somente as criadas por ele).
 */
export async function listUserReferrals({
  userId,
  userEmail,
}: ListUserReferralsParams): Promise<ReferralRow[]> {
  const email = normalizeUserEmail(userEmail);

  if (USE_REFERRALS_MOCK) {
    return getMockReferrals(email);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", userId)
    .maybeSingle();

  const submitterEmail = normalizeUserEmail(profile?.email ?? userEmail);

  const { data, error } = await supabase
    .from("legacy_manual_referrals")
    .select("*")
    .eq("submitted_by_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = (data ?? []).map((r) =>
    toReferral(
      {
        ...r,
        created_by_email: (r as { created_by_email?: string }).created_by_email ?? submitterEmail,
        referrer_email:
          (r as { referrer_email?: string }).referrer_email ?? submitterEmail,
      } as never,
      submitterEmail,
    ),
  );

  return filterReferralsByUserEmail(rows, email);
}
