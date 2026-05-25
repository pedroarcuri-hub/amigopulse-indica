import type { ReferralPipelineStatus } from "@/lib/referral-status";
import type { ReferralRow } from "@/lib/db-adapter";

export type ReferralKind = ReferralRow["kind"];

export type ReferralPeriodPreset = "mes_atual" | "trimestre" | "semestre" | "ano" | "todos";

export type ReferralSort = "recent" | "oldest" | "name";

export interface ReferralsListFilters {
  search: string;
  period: ReferralPeriodPreset;
  status: ReferralPipelineStatus | "all";
  kind: ReferralKind | "all";
  sort: ReferralSort;
}

export const REFERRAL_KIND_LABEL: Record<ReferralKind, string> = {
  cliente: "Cliente",
  parceiro: "Profissional",
  outro: "Outro",
};

export const PERIOD_PRESET_LABEL: Record<ReferralPeriodPreset, string> = {
  mes_atual: "Mês atual",
  trimestre: "Trimestre",
  semestre: "Semestre",
  ano: "Ano",
  todos: "Todos",
};

export const SORT_LABEL: Record<ReferralSort, string> = {
  recent: "Mais recente",
  oldest: "Mais antiga",
  name: "Nome (A–Z)",
};
