import type { ReferralRow } from "@/lib/db-adapter";
import type { ReferralsListFilters, ReferralPeriodPreset } from "./types";

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getPeriodRange(preset: ReferralPeriodPreset): { from: Date | null; to: Date | null } {
  const now = new Date();
  const today = startOfDay(now);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  switch (preset) {
    case "mes_atual":
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: end };
    case "trimestre": {
      const quarter = Math.floor(now.getMonth() / 3);
      return { from: new Date(now.getFullYear(), quarter * 3, 1), to: end };
    }
    case "semestre": {
      const semesterStart = now.getMonth() < 6 ? 0 : 6;
      return { from: new Date(now.getFullYear(), semesterStart, 1), to: end };
    }
    case "ano":
      return { from: new Date(now.getFullYear(), 0, 1), to: end };
    case "todos":
    default:
      return { from: null, to: null };
  }
}

export function matchesPeriod(createdAt: string, preset: ReferralPeriodPreset): boolean {
  const { from, to } = getPeriodRange(preset);
  if (!from && !to) return true;
  const date = new Date(createdAt);
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

export function filterAndSortReferrals(
  rows: ReferralRow[],
  filters: ReferralsListFilters,
): ReferralRow[] {
  const q = filters.search.trim().toLowerCase();

  let result = rows.filter((r) => {
    if (!matchesPeriod(r.created_at, filters.period)) return false;
    if (filters.status !== "all" && r.status !== filters.status) return false;
    if (filters.kind !== "all" && r.kind !== filters.kind) return false;
    if (!q) return true;
    const haystack = [r.nome_lead, r.empresa, r.email_lead, r.telefone_lead]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  result = [...result].sort((a, b) => {
    if (filters.sort === "name") {
      return a.nome_lead.localeCompare(b.nome_lead, "pt-BR");
    }
    const ta = new Date(a.created_at).getTime();
    const tb = new Date(b.created_at).getTime();
    return filters.sort === "oldest" ? ta - tb : tb - ta;
  });

  return result;
}
