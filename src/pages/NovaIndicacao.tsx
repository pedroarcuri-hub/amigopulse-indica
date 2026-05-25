import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ReferralFormByType,
  ReferralTypeSelector,
  type ReferralFormData,
  type ReferralFormType,
} from "@/components/referrals/forms";
import { submitReferral } from "@/lib/referrals/submit-referral";

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
      await submitReferral(data, {
        userId: user.id,
        createdBy: {
          user_id: user.id,
          email: user.email,
          full_name: profile?.nome ?? null,
        },
      });
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
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto space-y-6 pb-10">
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" className="shrink-0 mt-0.5" asChild>
          <Link to="/app/indicacoes" aria-label="Voltar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nova indicação</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Indique um novo contato para o programa Amigo Indica.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border bg-gradient-card">
        <CardContent className="p-4 sm:p-5">
          <ReferralTypeSelector
            value={type}
            onChange={setType}
            disabled={submitting}
          />
        </CardContent>
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
