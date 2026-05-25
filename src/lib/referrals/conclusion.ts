import type { ReferralConclusion } from "./detail";

/** Valores persistidos em `conclusion_status` no Supabase. */
export type ConclusionStatusDb = "disqualified" | "converted" | "lost";

export const CONCLUSION_UI_TO_DB: Record<ReferralConclusion, ConclusionStatusDb> = {
  desqualificada: "disqualified",
  convertida: "converted",
  perdida: "lost",
};

export const CONCLUSION_DB_TO_UI: Record<ConclusionStatusDb, ReferralConclusion> = {
  disqualified: "desqualificada",
  converted: "convertida",
  lost: "perdida",
};

/** Status de pipeline alinhado à conclusão (badge na lista). */
export const CONCLUSION_TO_PIPELINE_STATUS: Record<ConclusionStatusDb, string> = {
  disqualified: "desqualificada",
  converted: "convertida",
  lost: "perdida",
};

export function isConclusionStatusDb(value: string | null | undefined): value is ConclusionStatusDb {
  return value === "disqualified" || value === "converted" || value === "lost";
}

export function conclusionFromDb(
  conclusionStatus: string | null | undefined,
): ReferralConclusion | null {
  if (!conclusionStatus || !isConclusionStatusDb(conclusionStatus)) return null;
  return CONCLUSION_DB_TO_UI[conclusionStatus];
}
