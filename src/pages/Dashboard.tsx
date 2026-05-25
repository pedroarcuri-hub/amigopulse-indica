import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toReferral, type ReferralRow } from "@/lib/db-adapter";
import { getReferralStatusLabel, getReferralStatusColor } from "@/lib/referral-status";
import { getReferralEffectiveValue } from "@/lib/referral-value";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus, TrendingUp, CheckCircle2, Clock, ArrowRight,
  Trophy, Wallet, Users, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Stats {
  total: number;
  convertidas: number;
  emAndamento: number;
  bonusEstimado: number;
}

function StatCard({
  title, value, sub, icon: Icon, accent, loading,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent: string;
  loading?: boolean;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-3xl font-bold tracking-tight">{value}</p>
            )}
            {sub && !loading && (
              <p className="text-xs text-muted-foreground">{sub}</p>
            )}
          </div>
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl shadow-sm", accent)}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentes, setRecentes] = useState<ReferralRow[]>([]);
  const [loading, setLoading] = useState(true);

  const primeiroNome = profile?.nome?.split(" ")[0] ?? "colaborador";
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  useEffect(() => {
    if (!user) return;

    async function load() {
      setLoading(true);
      try {
        const { data } = await supabase
          .from("legacy_manual_referrals")
          .select("*")
          .eq("submitted_by_user_id", user!.id)
          .order("created_at", { ascending: false });

        const submitterEmail = user!.email ?? profile?.email ?? "";
        const rows = (data ?? []).map((r) => toReferral(r as never, submitterEmail));
        setRecentes(rows.slice(0, 5));

        const convertidas = rows.filter((r) =>
          ["approved", "converted", "won", "ganha", "convertida", "conversao_validada", "bonificacao_liberada"]
            .includes((r.status ?? "").toLowerCase())
        );

        const bonusEstimado = convertidas.reduce((acc, r) => {
          const v = getReferralEffectiveValue(r);
          return acc + (v ? v * 0.1 : 0);
        }, 0);

        const emAndamento = rows.filter((r) =>
          !["perdida", "desqualificada", "desqualificado"].includes((r.status ?? "").toLowerCase()) &&
          !convertidas.find((c) => c.id === r.id)
        );

        setStats({
          total: rows.length,
          convertidas: convertidas.length,
          emAndamento: emAndamento.length,
          bonusEstimado,
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{saudacao},</p>
          <h1 className="text-2xl font-bold">{primeiroNome} 👋</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Veja o impacto das suas conexões
          </p>
        </div>
        <Button asChild className="bg-gradient-primary shadow-elegant self-start sm:self-auto">
          <Link to="/app/nova-indicacao">
            <Plus className="h-4 w-4 mr-2" /> Nova indicação
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de indicações"
          value={stats?.total ?? 0}
          icon={Users}
          accent="bg-gradient-primary"
          loading={loading}
        />
        <StatCard
          title="Convertidas"
          value={stats?.convertidas ?? 0}
          sub="clientes ativos"
          icon={CheckCircle2}
          accent="bg-emerald-500"
          loading={loading}
        />
        <StatCard
          title="Em andamento"
          value={stats?.emAndamento ?? 0}
          sub="em negociação"
          icon={Clock}
          accent="bg-amber-500"
          loading={loading}
        />
        <StatCard
          title="Bônus estimado"
          value={
            stats
              ? stats.bonusEstimado > 0
                ? `R$ ${stats.bonusEstimado.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`
                : "—"
              : "—"
          }
          sub="sobre conversões"
          icon={Wallet}
          accent="bg-violet-500"
          loading={loading}
        />
      </div>

      {/* Indicações recentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold">Indicações recentes</CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-primary">
            <Link to="/app/indicacoes">
              Ver todas <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="px-6 pb-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : recentes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <p className="font-semibold text-base">Nenhuma indicação ainda</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Comece indicando alguém da sua rede. Cada conexão pode crescer com a Amigo.
              </p>
              <Button asChild className="mt-5 bg-gradient-primary shadow-elegant">
                <Link to="/app/nova-indicacao">
                  <Plus className="h-4 w-4 mr-2" /> Fazer minha primeira indicação
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {recentes.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {r.nome_lead.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{r.nome_lead}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {r.empresa ?? r.email_lead ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      className={cn("text-xs font-medium capitalize", getReferralStatusColor(r.status))}
                    >
                      {getReferralStatusLabel(r.status)}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {new Date(r.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CTAs */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="bg-gradient-card hover:shadow-elegant transition-shadow cursor-pointer group">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow text-primary-foreground">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Ranking do programa</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Veja como você se compara com seus colegas.
              </p>
              <Button asChild variant="link" className="p-0 h-auto mt-2 text-primary text-sm">
                <Link to="/app/ranking">
                  Ver ranking <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card hover:shadow-elegant transition-shadow cursor-pointer group">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 shadow-sm text-white">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Meus ganhos</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Acompanhe os bônus liberados e a receber.
              </p>
              <Button asChild variant="link" className="p-0 h-auto mt-2 text-primary text-sm">
                <Link to="/app/ganhos">
                  Ver ganhos <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
