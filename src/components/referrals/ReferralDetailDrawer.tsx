import type { ElementType, ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/StatusBadge";
import { Separator } from "@/components/ui/separator";
import {
  toReferralDetailView,
  formatDetailDate,
  referralInfoRows,
  type ReferralConclusion,
  type ReferralTimelineStep,
} from "@/lib/referrals/detail";
import type { ReferralRow } from "@/lib/db-adapter";
import { cn } from "@/lib/utils";
import { Check, Circle, XCircle, Trophy, Ban } from "lucide-react";

interface ReferralDetailDrawerProps {
  referral: ReferralRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CONCLUSION_OPTIONS: {
  key: ReferralConclusion;
  label: string;
  description: string;
  icon: ElementType;
  activeClass: string;
}[] = [
  {
    key: "desqualificada",
    label: "Desqualificada",
    description: "Perfil fora do público-alvo",
    icon: Ban,
    activeClass: "border-muted-foreground/50 bg-muted text-muted-foreground ring-2 ring-muted-foreground/30",
  },
  {
    key: "convertida",
    label: "Convertida",
    description: "Virou cliente Amigo",
    icon: Trophy,
    activeClass: "border-success-border bg-success-soft text-success-soft-foreground ring-2 ring-success/40",
  },
  {
    key: "perdida",
    label: "Perdida",
    description: "Não avançou no funil",
    icon: XCircle,
    activeClass: "border-destructive/50 bg-destructive/10 text-destructive ring-2 ring-destructive/30",
  },
];

export function ReferralDetailDrawer({
  referral,
  open,
  onOpenChange,
}: ReferralDetailDrawerProps) {
  if (!referral) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto" />
      </Sheet>
    );
  }

  const detail = toReferralDetailView(referral);
  const infoRows = referralInfoRows(referral);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto p-0 flex flex-col"
      >
        <SheetHeader className="px-6 pt-6 pb-4 space-y-3 text-left border-b bg-gradient-card">
          <div className="flex items-start justify-between gap-3 pr-8">
            <SheetTitle className="text-xl font-bold leading-snug">
              {referral.nome_lead}
            </SheetTitle>
            <StatusBadge status={referral.status} className="shrink-0 capitalize" />
          </div>
          <SheetDescription className="sr-only">
            Detalhes da indicação de {referral.nome_lead}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-6 py-5 space-y-6">
          <DetailSection title="Informações da indicação">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {infoRows.map((row) => (
                <div key={row.label}>
                  <dt className="text-muted-foreground text-xs">{row.label}</dt>
                  <dd className="font-medium mt-0.5">{row.value}</dd>
                </div>
              ))}
            </dl>
          </DetailSection>

          <Separator />

          <DetailSection title="Dados do indicado">
            <dl className="space-y-3 text-sm">
              <DetailField label="Nome" value={referral.nome_lead} />
              <DetailField label="E-mail" value={referral.email_lead} />
              <DetailField label="Telefone" value={referral.telefone_lead} />
            </dl>
          </DetailSection>

          <Separator />

          <TimelineSection
            title="Entrada no programa"
            steps={detail.timeline_entrada}
          />

          <TimelineSection
            title="Contratação da Amigo"
            steps={detail.timeline_contratacao}
          />

          <Separator />

          <DetailSection title="Conclusão">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {CONCLUSION_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = detail.conclusao === opt.key;
                return (
                  <div
                    key={opt.key}
                    className={cn(
                      "rounded-xl border p-3 text-center transition-colors",
                      active
                        ? opt.activeClass
                        : "border-border bg-card text-muted-foreground opacity-60",
                    )}
                    aria-current={active ? "true" : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 mx-auto mb-1.5",
                        active ? "" : "text-muted-foreground",
                      )}
                    />
                    <p className="text-sm font-semibold">{opt.label}</p>
                    <p className="text-[11px] mt-0.5 leading-tight">{opt.description}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Exibição informativa. A conclusão será sincronizada com Supabase futuramente.
            </p>
          </DetailSection>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      {children}
    </section>
  );
}

function DetailField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium mt-0.5">{value?.trim() ? value : "—"}</dd>
    </div>
  );
}

function TimelineSection({
  title,
  steps,
}: {
  title: string;
  steps: ReferralTimelineStep[];
}) {
  return (
    <DetailSection title={title}>
      <ol className="relative space-y-0 pl-1">
        {steps.map((step, index) => (
          <li key={step.key} className="flex gap-3 pb-5 last:pb-0">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 shrink-0",
                  step.done
                    ? step.current
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary/40 bg-primary/10 text-primary"
                    : "border-muted bg-muted/50 text-muted-foreground",
                )}
              >
                {step.done ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </span>
              {index < steps.length - 1 && (
                <span
                  className={cn(
                    "w-0.5 flex-1 min-h-[24px] mt-1",
                    step.done ? "bg-primary/30" : "bg-border",
                  )}
                />
              )}
            </div>
            <div className="pt-1 min-w-0">
              <p
                className={cn(
                  "text-sm font-medium",
                  step.current && "text-primary",
                )}
              >
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {step.done ? formatDetailDate(step.date) : "Pendente"}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </DetailSection>
  );
}
