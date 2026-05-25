import { supabase } from "@/integrations/supabase/client";
import { toReferral, type ReferralRow } from "@/lib/db-adapter";
import { getMockReferrals } from "./mock-data";

/**
 * Troque para `false` quando integrar com Supabase em produção.
 * Também pode ser controlado por VITE_USE_REFERRALS_MOCK=false no .env.
 */
export const USE_REFERRALS_MOCK =
  import.meta.env.VITE_USE_REFERRALS_MOCK !== "false";

/**
 * Lista indicações do colaborador autenticado.
 * Mock hoje; Supabase via legacy_manual_referrals (mesmo padrão do Dashboard).
 */
export async function listUserReferrals(userId: string): Promise<ReferralRow[]> {
  if (USE_REFERRALS_MOCK) {
    return getMockReferrals(userId);
  }

  const { data, error } = await supabase
    .from("legacy_manual_referrals")
    .select("*")
    .eq("submitted_by_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((r) => toReferral(r as never));
}
