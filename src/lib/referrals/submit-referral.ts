import { buildReferralSubmitPayload } from "@/lib/referrals/referral-payload";
import type { ReferralFormData } from "@/components/referrals/forms/types";
import type { ReferralCreatedBy } from "@/components/referrals/forms/types";
import { createReferral } from "@/lib/referrals/create-referral";
import { USE_REFERRALS_MOCK } from "@/lib/referrals/service";

export interface SubmitReferralContext {
  userId: string;
  createdBy: ReferralCreatedBy;
}

/**
 * Envia indicação (padrão Premia: invoke/submit após validação do form).
 * Mock apenas com VITE_USE_REFERRALS_MOCK=true.
 */
export async function submitReferral(
  data: ReferralFormData,
  ctx: SubmitReferralContext,
): Promise<{ id: string }> {
  const payload = buildReferralSubmitPayload(data, ctx.createdBy);

  if (USE_REFERRALS_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    console.info("[mock] ReferralSubmitPayload", payload);
    return { id: `mock-${Date.now()}` };
  }

  return createReferral(payload, { userId: ctx.userId });
}
