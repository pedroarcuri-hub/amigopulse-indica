// Canonical referral status labels, colors, and descriptions.
export const REFERRAL_PIPELINE_STATUSES = [
  "criada",
  "contato",
  "reuniao",
  "proposta",
  "contratado",
  "constituicao",
  "perdida",
] as const;

export type ReferralPipelineStatus = (typeof REFERRAL_PIPELINE_STATUSES)[number];

export const REFERRAL_STATUS_LABEL: Record<string, string> = {
  criada: "Criada",
  contato: "Contato",
  reuniao: "Reunião",
  proposta: "Proposta",
  contratado: "Contratado",
  constituicao: "Constituição",
  perdida: "Perdida",
  nova: "Nova",
  em_contato: "Em contato",
  em_qualificacao: "Em qualificação",
  em_negociacao: "Em negociação",
  convertida: "Convertida",
  em_implantacao: "Em implantação",
  ativa: "Ativa",
  desqualificada: "Desqualificada",
  em_andamento: "Em andamento",
  // Aliases
  submitted: "Nova",
  approved: "Convertida",
  converted: "Convertida",
  won: "Convertida",
  ganha: "Convertida",
  novo: "Nova",
  convertido: "Convertida",
  desqualificado: "Desqualificada",
  perdido: "Perdida",
  contrato_fechado: "Convertida",
  conversao_validada: "Convertida",
  bonificacao_liberada: "Convertida",
};

export const REFERRAL_STATUS_COLOR: Record<string, string> = {
  criada: "bg-muted text-muted-foreground border border-border",
  contato: "bg-warning/20 text-warning-foreground border border-warning/40",
  reuniao: "bg-primary/10 text-primary border border-primary/30",
  proposta: "bg-primary/15 text-primary border border-primary/30",
  contratado: "bg-success-soft text-success-soft-foreground border border-success-border/60",
  constituicao: "bg-success text-success-foreground border border-success/60",
  perdida: "bg-destructive/15 text-destructive border border-destructive/40",
  nova: "bg-accent text-accent-foreground",
  em_contato: "bg-warning/20 text-warning-foreground border border-warning/40",
  em_qualificacao: "bg-primary/10 text-primary border border-primary/30",
  em_negociacao: "bg-primary/15 text-primary border border-primary/30",
  convertida: "bg-success-soft text-success-soft-foreground border border-success-border/60",
  em_implantacao: "bg-secondary text-secondary-foreground border",
  ativa: "bg-success text-success-foreground border border-success/60",
  desqualificada: "bg-muted text-muted-foreground border",
  em_andamento: "bg-muted text-muted-foreground border",
  submitted: "bg-accent text-accent-foreground",
  approved: "bg-success-soft text-success-soft-foreground border border-success-border/60",
  converted: "bg-success-soft text-success-soft-foreground border border-success-border/60",
  won: "bg-success-soft text-success-soft-foreground border border-success-border/60",
  ganha: "bg-success-soft text-success-soft-foreground border border-success-border/60",
};

export const REFERRAL_STATUS_DESCRIPTION: Record<string, string> = {
  criada: "Sua indicação foi registrada e aguarda o primeiro contato da equipe.",
  contato: "Nossa equipe já entrou em contato com a pessoa indicada.",
  reuniao: "Uma reunião foi agendada ou realizada com o lead indicado.",
  proposta: "Proposta comercial em elaboração ou enviada.",
  contratado: "Negócio fechado. Bonificação será processada conforme regras.",
  constituicao: "Cliente em processo de constituição ou ativação.",
  perdida: "Não avançou no processo desta vez.",
  nova: "Sua indicação foi recebida e está aguardando o primeiro contato.",
  em_contato: "Nossa equipe já entrou em contato com a pessoa indicada.",
  em_qualificacao: "Estamos avaliando se o perfil indicado se encaixa.",
  em_negociacao: "Em processo de negociação com nosso time comercial.",
  convertida: "Tornou-se cliente. Sua bonificação será processada.",
  em_implantacao: "Cliente em processo de ativação.",
  ativa: "Cliente utilizando ativamente a solução.",
  desqualificada: "Perfil não se encaixa no público atendido.",
  em_andamento: "Sua indicação está sendo processada.",
};

export function getReferralStatusLabel(status: string | null | undefined) {
  if (!status) return "Em andamento";
  return REFERRAL_STATUS_LABEL[status] ?? "Em andamento";
}

export function getReferralStatusColor(status: string | null | undefined) {
  if (!status) return REFERRAL_STATUS_COLOR.em_andamento;
  return REFERRAL_STATUS_COLOR[status] ?? REFERRAL_STATUS_COLOR.em_andamento;
}

export function getReferralStatusDescription(status: string | null | undefined) {
  const key = status ?? "em_andamento";
  const canonical = REFERRAL_STATUS_LABEL[key];
  const canonicalKey = Object.keys(REFERRAL_STATUS_DESCRIPTION).find(
    (k) => REFERRAL_STATUS_LABEL[k] === canonical,
  );
  return (
    REFERRAL_STATUS_DESCRIPTION[key] ??
    (canonicalKey ? REFERRAL_STATUS_DESCRIPTION[canonicalKey] : undefined) ??
    REFERRAL_STATUS_DESCRIPTION.em_andamento
  );
}
