/**
 * Adapter entre o schema atual (manual_referrals + profiles.full_name)
 * e o shape "Referral / Profile" que o frontend do Amigo Indica espera.
 *
 * Mantém o frontend portátil sem renomear colunas reais do banco.
 */

export interface ReferralRow {
  id: string;
  colaborador_id: string;
  nome_lead: string;
  email_lead: string | null;
  telefone_lead: string | null;
  empresa: string | null;
  status: string;
  kind: "cliente" | "parceiro" | "outro";
  valor_venda: number | null;
  revenue_amount: number | null;
  bitrix_lead_id: string | null;
  bitrix_deal_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileRow {
  id: string;
  nome: string;
  email: string;
  area: string | null;
  cargo: string | null;
  elegivel_programa: boolean;
  avatar_url: string | null;
}

type ManualReferralDb = {
  id: string;
  submitted_by_user_id: string;
  referred_name: string;
  referred_email: string | null;
  referred_phone: string | null;
  referred_company_name: string | null;
  referral_type: string | null;
  status: string;
  revenue_amount: number | null;
  bitrix_lead_id: string | null;
  bitrix_deal_id: string | null;
  created_at: string;
  updated_at: string;
};

export function toReferral(r: ManualReferralDb): ReferralRow {
  const t = (r.referral_type ?? "").toLowerCase();
  const kind: ReferralRow["kind"] =
    t === "cliente" || t === "client" || t === "customer"
      ? "cliente"
      : t === "parceiro" || t === "partner"
        ? "parceiro"
        : "outro";
  return {
    id: r.id,
    colaborador_id: r.submitted_by_user_id,
    nome_lead: r.referred_name,
    email_lead: r.referred_email,
    telefone_lead: r.referred_phone,
    empresa: r.referred_company_name,
    status: r.status,
    kind,
    valor_venda: r.revenue_amount != null ? Number(r.revenue_amount) : null,
    revenue_amount: r.revenue_amount != null ? Number(r.revenue_amount) : null,
    bitrix_lead_id: r.bitrix_lead_id,
    bitrix_deal_id: r.bitrix_deal_id,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

type ProfileDb = {
  id: string;
  full_name: string | null;
  email: string;
  area: string | null;
  cargo: string | null;
  elegivel_programa: boolean | null;
  avatar_url: string | null;
};

export function toProfile(p: ProfileDb): ProfileRow {
  return {
    id: p.id,
    nome: p.full_name ?? "",
    email: p.email,
    area: p.area,
    cargo: p.cargo,
    elegivel_programa: p.elegivel_programa ?? true,
    avatar_url: p.avatar_url,
  };
}

/** Status considerados "convertidos" para fins de bônus/receita. */
export const CONVERTED_STATUSES = new Set([
  "approved",
  "converted",
  "won",
  "ganha",
  "convertida",
  "conversao_validada",
  "bonificacao_liberada",
]);

export function isConverted(status: string | null | undefined) {
  return !!status && CONVERTED_STATUSES.has(status.toLowerCase());
}

/** Bônus padrão = 10% sobre revenue, válido para indicações convertidas. */
export function estimateBonus(revenue: number | null | undefined, status?: string | null) {
  if (!revenue || !isConverted(status)) return 0;
  return Number(revenue) * 0.10;
}
