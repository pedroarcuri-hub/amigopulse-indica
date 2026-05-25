import type { ReferralRow } from "@/lib/db-adapter";
import type { ReferralConclusion } from "./detail";
import {
  CONCLUSION_TO_PIPELINE_STATUS,
  CONCLUSION_UI_TO_DB,
  type ConclusionStatusDb,
} from "./conclusion";
import { filterReferralsByUserEmail, normalizeUserEmail } from "./ownership";

const mockPatches = new Map<string, Partial<ReferralRow>>();

/** E-mail padrão do mock quando o usuário logado não tiver sessão (dev). */
export const MOCK_DEFAULT_USER_EMAIL = "colaborador@amigotech.com.br";

const OTHER_USER_EMAIL = "outro.colaborador@amigotech.com.br";

/** Todas as indicações mock (inclui registros de outros usuários para testar filtro). */
function getAllMockReferrals(): ReferralRow[] {
  const base = new Date();
  const daysAgo = (n: number) => {
    const d = new Date(base);
    d.setDate(d.getDate() - n);
    return d.toISOString();
  };

  const mine = MOCK_DEFAULT_USER_EMAIL;

  return [
    {
      id: "mock-1",
      colaborador_id: "mock-user-id",
      created_by_email: mine,
      referrer_email: mine,
      nome_lead: "Hugo Brito Cronemberger Freitas",
      email_lead: "hugo.cronemberger@clinicaexemplo.com.br",
      telefone_lead: "(11) 98765-4321",
      empresa: "Clínica Exemplo",
      status: "criada",
      conclusion_status: null,
      kind: "parceiro",
      origem: "Amigo Indica",
      valor_venda: null,
      revenue_amount: null,
      bitrix_lead_id: null,
      bitrix_deal_id: null,
      created_at: daysAgo(2),
      updated_at: daysAgo(2),
    },
    {
      id: "mock-2",
      colaborador_id: "mock-user-id",
      created_by_email: mine,
      referrer_email: mine,
      nome_lead: "Dra. Marina Alves",
      email_lead: "marina.alves@hospitaldelta.com",
      telefone_lead: "(21) 99876-5432",
      empresa: "Hospital Delta",
      status: "contato",
      conclusion_status: null,
      kind: "cliente",
      origem: "Amigo Indica",
      valor_venda: null,
      revenue_amount: null,
      bitrix_lead_id: "BX-1024",
      bitrix_deal_id: null,
      created_at: daysAgo(12),
      updated_at: daysAgo(5),
    },
    {
      id: "mock-3",
      colaborador_id: "mock-user-id",
      created_by_email: mine,
      referrer_email: null,
      nome_lead: "Dr. Ricardo Mendes",
      email_lead: null,
      telefone_lead: "(31) 99112-3344",
      empresa: "Centro Médico Horizonte",
      status: "reuniao",
      conclusion_status: null,
      kind: "parceiro",
      origem: "Indicação manual",
      valor_venda: null,
      revenue_amount: null,
      bitrix_lead_id: "BX-1088",
      bitrix_deal_id: null,
      created_at: daysAgo(28),
      updated_at: daysAgo(8),
    },
    {
      id: "mock-4",
      colaborador_id: "mock-user-id",
      created_by_email: mine,
      referrer_email: mine,
      nome_lead: "Ana Paula Souza",
      email_lead: "ana.souza@labsaude.io",
      telefone_lead: null,
      empresa: "Lab Saúde",
      status: "proposta",
      conclusion_status: null,
      kind: "cliente",
      origem: "App Amigo Indica",
      valor_venda: 48000,
      revenue_amount: 48000,
      bitrix_lead_id: "BX-1102",
      bitrix_deal_id: "DL-440",
      created_at: daysAgo(45),
      updated_at: daysAgo(15),
    },
    {
      id: "mock-5",
      colaborador_id: "mock-user-id",
      created_by_email: mine,
      referrer_email: mine,
      nome_lead: "João Pedro Nascimento",
      email_lead: "jp.nascimento@redeplus.com",
      telefone_lead: "(47) 98888-1111",
      empresa: "Rede Plus",
      status: "contratado",
      conclusion_status: "converted",
      kind: "cliente",
      origem: "Amigo Indica",
      valor_venda: 92000,
      revenue_amount: 92000,
      bitrix_lead_id: "BX-0991",
      bitrix_deal_id: "DL-388",
      created_at: daysAgo(90),
      updated_at: daysAgo(20),
    },
    {
      id: "mock-6",
      colaborador_id: "mock-user-id",
      created_by_email: mine,
      referrer_email: mine,
      nome_lead: "Clínica Vida Nova",
      email_lead: "contato@vidanova.med.br",
      telefone_lead: "(85) 3333-4444",
      empresa: "Clínica Vida Nova",
      status: "constituicao",
      conclusion_status: "converted",
      kind: "parceiro",
      origem: "Amigo Indica",
      valor_venda: 65000,
      revenue_amount: 65000,
      bitrix_lead_id: "BX-1200",
      bitrix_deal_id: "DL-501",
      created_at: daysAgo(120),
      updated_at: daysAgo(30),
    },
    {
      id: "mock-7",
      colaborador_id: "mock-user-id",
      created_by_email: mine,
      referrer_email: mine,
      nome_lead: "Felipe Torres",
      email_lead: "felipe@startuphealth.com",
      telefone_lead: null,
      empresa: null,
      status: "perdida",
      conclusion_status: "lost",
      kind: "outro",
      origem: "Indicação manual",
      valor_venda: null,
      revenue_amount: null,
      bitrix_lead_id: null,
      bitrix_deal_id: null,
      created_at: daysAgo(200),
      updated_at: daysAgo(180),
    },
    {
      id: "mock-other-1",
      colaborador_id: "other-user-id",
      created_by_email: OTHER_USER_EMAIL,
      referrer_email: OTHER_USER_EMAIL,
      nome_lead: "Indicação de Outro Colaborador",
      email_lead: "lead@exemplo.com",
      telefone_lead: null,
      empresa: "Empresa X",
      status: "criada",
      conclusion_status: null,
      kind: "cliente",
      origem: "Amigo Indica",
      valor_venda: null,
      revenue_amount: null,
      bitrix_lead_id: null,
      bitrix_deal_id: null,
      created_at: daysAgo(5),
      updated_at: daysAgo(5),
    },
  ];
}

function applyMockPatches(rows: ReferralRow[]): ReferralRow[] {
  return rows.map((r) => {
    const patch = mockPatches.get(r.id);
    return patch ? { ...r, ...patch } : r;
  });
}

/** Atualiza conclusão no store mock (VITE_USE_REFERRALS_MOCK=true). */
export function updateMockReferralConclusion(
  referralId: string,
  conclusion: ReferralConclusion,
): ReferralRow | null {
  const all = getAllMockReferrals();
  const base = all.find((r) => r.id === referralId);
  if (!base) return null;

  const dbStatus: ConclusionStatusDb = CONCLUSION_UI_TO_DB[conclusion];
  const now = new Date().toISOString();
  const patch: Partial<ReferralRow> = {
    conclusion_status: dbStatus,
    status: CONCLUSION_TO_PIPELINE_STATUS[dbStatus],
    updated_at: now,
  };
  mockPatches.set(referralId, { ...(mockPatches.get(referralId) ?? {}), ...patch });
  return { ...base, ...(mockPatches.get(referralId) ?? {}), ...patch };
}

/**
 * Mock filtrado pelo e-mail da sessão Auth.
 * Se o e-mail logado não tiver indicações, retorna as do e-mail padrão de dev.
 */
export function getMockReferrals(userEmail: string): ReferralRow[] {
  const normalized = normalizeUserEmail(userEmail) || normalizeUserEmail(MOCK_DEFAULT_USER_EMAIL);
  const all = applyMockPatches(getAllMockReferrals());
  const mine = filterReferralsByUserEmail(all, normalized);
  if (mine.length > 0) return mine;
  return filterReferralsByUserEmail(all, MOCK_DEFAULT_USER_EMAIL);
}
