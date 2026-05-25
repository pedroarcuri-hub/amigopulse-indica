import { supabase } from "@/integrations/supabase/client";
import type { ReferralSubmitPayload } from "@/components/referrals/forms/types";
import { DEFAULT_REFERRAL_ORIGIN } from "@/components/referrals/forms/constants";
import { INDICA_PROGRAM_NAME } from "@/lib/app-url";

/**
 * Persiste indicação no Supabase (legacy_manual_referrals).
 * Requer program_id — busca programa Indica ou usa metadata até integração completa.
 */
export async function createReferral(
  payload: ReferralSubmitPayload,
  options: { userId: string; programId?: string },
): Promise<{ id: string }> {
  const programId = options.programId ?? (await resolveIndicaProgramId());

  const row = {
    program_id: programId,
    submitted_by_user_id: options.userId,
    submitted_by_role: "collaborator",
    referral_type: payload.referral_type,
    referred_name: payload.referred_name,
    referred_email: payload.referred_email,
    referred_phone: payload.referred_phone,
    referred_company_name: payload.referred_company_name,
    referred_company_segment: payload.referred_company_segment,
    referred_document: payload.referred_document,
    referred_notes: payload.referred_notes,
    status: payload.pipeline_stage,
    referral_source: payload.origin || DEFAULT_REFERRAL_ORIGIN,
    conclusion_status: payload.conclusion_status,
    metadata: {
      ...payload.metadata,
      created_by_email: payload.created_by.email,
      referrer_email: payload.created_by.email,
      pipeline_stage: payload.pipeline_stage,
      origin: payload.origin,
    },
  };

  const { data, error } = await supabase
    .from("legacy_manual_referrals")
    .insert(row as never)
    .select("id")
    .single();

  if (error) throw error;
  return { id: data.id };
}

async function resolveIndicaProgramId(): Promise<string> {
  const { data, error } = await supabase
    .from("programs")
    .select("id")
    .eq("name", INDICA_PROGRAM_NAME)
    .maybeSingle();

  if (error) throw error;
  if (!data?.id) {
    throw new Error(
      "Programa Indica não encontrado. Configure o programa antes de enviar indicações.",
    );
  }
  return data.id;
}
