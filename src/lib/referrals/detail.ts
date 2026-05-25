import type { ReferralRow } from "@/lib/db-adapter";
import { getReferralStatusLabel } from "@/lib/referral-status";
import { REFERRAL_KIND_LABEL } from "./types";

export type ReferralConclusion = "desqualificada" | "convertida" | "perdida";

export interface ReferralTimelineStep {
  key: string;
  label: string;
  date: string | null;
  done: boolean;
  current: boolean;
}

export interface ReferralDetailView extends ReferralRow {
  timeline_entrada: ReferralTimelineStep[];
  timeline_contratacao: ReferralTimelineStep[];
  conclusao: ReferralConclusion | null;
}

const ENTRADA_STEPS: { key: string; label: string; statuses: string[] }[] = [
  { key: "criada", label: "Indicação criada", statuses: ["criada", "nova", "submitted"] },
  { key: "contato", label: "Primeiro contato", statuses: ["contato", "em_contato"] },
  { key: "reuniao", label: "Reunião realizada", statuses: ["reuniao"] },
  { key: "proposta", label: "Proposta enviada", statuses: ["proposta", "em_negociacao"] },
];

const CONTRATACAO_STEPS: { key: string; label: string; statuses: string[] }[] = [
  { key: "contratado", label: "Contrato assinado", statuses: ["contratado", "convertida", "approved", "converted"] },
  { key: "constituicao", label: "Constituição / ativação", statuses: ["constituicao", "em_implantacao", "ativa"] },
];

const STATUS_ORDER = [
  "criada",
  "nova",
  "submitted",
  "contato",
  "em_contato",
  "reuniao",
  "proposta",
  "em_negociacao",
  "contratado",
  "convertida",
  "constituicao",
  "em_implantacao",
  "ativa",
  "perdida",
  "desqualificada",
];

function statusIndex(status: string): number {
  const i = STATUS_ORDER.indexOf(status.toLowerCase());
  return i >= 0 ? i : 0;
}

function buildTimeline(
  steps: { key: string; label: string; statuses: string[] }[],
  status: string,
  baseDate: string,
  updatedAt: string,
): ReferralTimelineStep[] {
  const idx = statusIndex(status);
  const normalized = status.toLowerCase();

  return steps.map((step) => {
    const stepIdx = Math.max(
      ...step.statuses.map((s) => statusIndex(s)),
    );
    const done = idx >= stepIdx || step.statuses.includes(normalized);
    const current = step.statuses.includes(normalized);

    return {
      key: step.key,
      label: step.label,
      date: done ? (current ? updatedAt : baseDate) : null,
      done,
      current,
    };
  });
}

export function resolveConclusion(status: string): ReferralConclusion | null {
  const s = status.toLowerCase();
  if (["perdida", "perdido"].includes(s)) return "perdida";
  if (["desqualificada", "desqualificado"].includes(s)) return "desqualificada";
  if (
    [
      "contratado",
      "constituicao",
      "convertida",
      "convertido",
      "approved",
      "converted",
      "won",
      "ganha",
      "ativa",
      "em_implantacao",
    ].includes(s)
  ) {
    return "convertida";
  }
  return null;
}

export function toReferralDetailView(referral: ReferralRow): ReferralDetailView {
  return {
    ...referral,
    timeline_entrada: buildTimeline(
      ENTRADA_STEPS,
      referral.status,
      referral.created_at,
      referral.updated_at,
    ),
    timeline_contratacao: buildTimeline(
      CONTRATACAO_STEPS,
      referral.status,
      referral.created_at,
      referral.updated_at,
    ),
    conclusao: resolveConclusion(referral.status),
  };
}

export function formatDetailDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function referralInfoRows(referral: ReferralRow) {
  return [
    { label: "Tipo", value: REFERRAL_KIND_LABEL[referral.kind] },
    { label: "Status", value: getReferralStatusLabel(referral.status) },
    { label: "Data", value: formatDetailDate(referral.created_at) },
    { label: "Origem", value: referral.origem },
  ];
}
