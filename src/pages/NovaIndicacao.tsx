import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  ReferralFormByType,
  buildReferralSubmitPayload,
  REFERRAL_FORM_TYPE_DESCRIPTION,
  REFERRAL_FORM_TYPE_ICON,
  REFERRAL_FORM_TYPE_LABEL,
  type ReferralFormData,
  type ReferralFormType,
} from "@/components/referrals/forms";
import { createReferral } from "@/lib/referrals/create-referral";
import { USE_REFERRALS_MOCK } from "@/lib/referrals/service";

const FORM_TYPES: ReferralFormType[] = ["professional", "student", "company"];

export default function NovaIndicacaoPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [type, setType] = useState<ReferralFormType>("professional");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: ReferralFormData) => {
    if (!user?.email) {
      toast.error("Sessão inválida. Faça login novamente.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildReferralSubmitPayload(data, {
        user_id: user.id,
        email: user.email,
        full_name: profile?.nome ?? null,
      });

      if (USE_REFERRALS_MOCK) {
        await new Promise((r) => setTimeout(r, 600));
        console.info("[mock] ReferralSubmitPayload", payload);
      } else {
        await createReferral(payload, { userId: user.id });
      }

      toast.success("Indicação enviada com sucesso!");
      navigate("/app/indicacoes");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Não foi possível enviar a indicação.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nova indicação</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Escolha o tipo e preencha os dados do indicado.
        </p>
      </div>

      <Card className="p-3 sm:p-4 shadow-sm">
        <p className="text-xs font-medium text-muted-foreground mb-3 px-1">
          Tipo de indicação
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {FORM_TYPES.map((t) => {
            const Icon = REFERRAL_FORM_TYPE_ICON[t];
            const active = type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  active
                    ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                    : "border-border hover:border-primary/30 hover:bg-muted/40",
                )}
                aria-pressed={active}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span className="text-sm font-semibold">
                  {REFERRAL_FORM_TYPE_LABEL[t]}
                </span>
                <span className="text-[11px] text-muted-foreground leading-snug">
                  {REFERRAL_FORM_TYPE_DESCRIPTION[t]}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <ReferralFormByType
        type={type}
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/app/indicacoes")}
        isSubmitting={submitting}
      />
    </div>
  );
}
