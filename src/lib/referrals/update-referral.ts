import { supabase } from "@/integrations/supabase/client";
import type { ReferralSubmitPayload } from "@/components/referrals/forms/types";

/** Atualiza indicação existente (modo edit dos formulários). */
export async function updateReferral(
  referralId: string,
  payload: ReferralSubmitPayload,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("legacy_manual_referrals")
    .update({
      referral_type: payload.referral_type,
      referred_name: payload.referred_name,
      referred_email: payload.referred_email,
      referred_phone: payload.referred_phone,
      referred_company_name: payload.referred_company_name,
      referred_company_segment: payload.referred_company_segment,
      referred_document: payload.referred_document,
      referred_notes: payload.referred_notes,
      status: payload.pipeline_stage,
      referral_source: payload.origin,
      metadata: {
        ...payload.metadata,
        created_by_email: payload.created_by.email,
        referrer_email: payload.created_by.email,
        pipeline_stage: payload.pipeline_stage,
        origin: payload.origin,
      },
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", referralId)
    .eq("submitted_by_user_id", userId);

  if (error) throw error;
}
