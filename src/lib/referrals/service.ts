import { supabase } from "@/integrations/supabase/client";
import { toReferral, type ReferralRow } from "@/lib/db-adapter";
import {
  CONCLUSION_TO_PIPELINE_STATUS,
  CONCLUSION_UI_TO_DB,
} from "./conclusion";
import type { ReferralConclusion } from "./detail";
import { getMockReferrals, updateMockReferralConclusion } from "./mock-data";
import { filterReferralsByUserEmail, normalizeUserEmail } from "./ownership";

/** Mock ativo somente com VITE_USE_REFERRALS_MOCK=true no .env */
export const USE_REFERRALS_MOCK =
  import.meta.env.VITE_USE_REFERRALS_MOCK === "true";

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

export interface UpdateReferralConclusionParams {
  referralId: string;
  userId: string;
  conclusion: ReferralConclusion;
}

/**
 * Persiste conclusão (conclusion_status + status + updated_at).
 */
export async function updateReferralConclusion({
  referralId,
  userId,
  conclusion,
}: UpdateReferralConclusionParams): Promise<ReferralRow> {
  const conclusionStatus = CONCLUSION_UI_TO_DB[conclusion];
  const status = CONCLUSION_TO_PIPELINE_STATUS[conclusionStatus];
  const updatedAt = new Date().toISOString();

  if (USE_REFERRALS_MOCK) {
    const updated = updateMockReferralConclusion(referralId, conclusion);
    if (!updated) throw new Error("Indicação não encontrada.");
    return updated;
  }

  const { data, error } = await supabase
    .from("legacy_manual_referrals")
    .update({
      conclusion_status: conclusionStatus,
      status,
      updated_at: updatedAt,
    })
    .eq("id", referralId)
    .eq("submitted_by_user_id", userId)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Indicação não encontrada ou sem permissão.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", userId)
    .maybeSingle();

  return toReferral(data as never, profile?.email ?? null);
}
