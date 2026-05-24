/**
 * Calcula o valor efetivo de uma indicação (referral) para exibição,
 * cálculo de receita e bônus.
 *
 * No schema atual deste projeto (manual_referrals), usamos `revenue_amount`
 * como fonte canônica. Os demais campos são aceitos por compatibilidade.
 */
export function getReferralEffectiveValue(r: {
  revenue_amount?: number | null;
  bitrix_onboarding_value?: number | null;
  bitrix_sales_value?: number | null;
  valor_venda?: number | null;
}): number | null {
  if (r.bitrix_onboarding_value != null && Number(r.bitrix_onboarding_value) > 0) {
    return Number(r.bitrix_onboarding_value);
  }
  if (r.bitrix_sales_value != null) return Number(r.bitrix_sales_value);
  if (r.valor_venda != null) return Number(r.valor_venda);
  if (r.revenue_amount != null) return Number(r.revenue_amount);
  return null;
}
