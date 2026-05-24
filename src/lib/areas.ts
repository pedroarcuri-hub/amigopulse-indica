/**
 * Áreas suportadas pelo Amigo Indica.
 * Regras de elegibilidade:
 *  - Marketing pode indicar clientes, NÃO pode indicar parceiros
 *  - Comercial pode indicar parceiros, NÃO pode indicar clientes
 *  - Demais áreas podem indicar ambos
 */
export const USER_AREAS = [
  { value: "marketing", label: "Marketing" },
  { value: "comercial", label: "Comercial" },
  { value: "produto", label: "Produto" },
  { value: "implantacao", label: "Implantação" },
  { value: "financeiro", label: "Financeiro" },
  { value: "contabilidade", label: "Contabilidade" },
  { value: "people", label: "People" },
  { value: "inteligencia_mercado", label: "Inteligência de Mercado" },
  { value: "revops", label: "RevOps" },
  { value: "fintech", label: "Fintech" },
  { value: "cx", label: "CX" },
  { value: "cs", label: "CS" },
  { value: "administrativo", label: "Administrativo" },
  { value: "juridico", label: "Jurídico" },
  { value: "outras", label: "Outras" },
] as const;

export type UserAreaValue = (typeof USER_AREAS)[number]["value"];

const AREA_LABEL_MAP: Record<string, string> = Object.fromEntries(
  USER_AREAS.map((a) => [a.value, a.label]),
);

export function getAreaLabel(area: string | null | undefined): string {
  if (!area) return "—";
  return AREA_LABEL_MAP[area] ?? area;
}
