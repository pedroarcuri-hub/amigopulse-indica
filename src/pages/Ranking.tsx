import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, Medal, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankingRow {
  user_id: string;
  full_name: string;
  area: string | null;
  cargo: string | null;
  indicacoes: number;
  conversoes: number;
  revenue: number;
}

const MONTHS = [
  { value: "all", label: "Todo o período" },
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 3 }, (_, i) => CURRENT_YEAR - i);

function PodiumCard({
  row, position,
}: {
  row: RankingRow;
  position: 1 | 2 | 3;
}) {
  const config = {
    1: { icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-50 border-yellow-200", size: "h-14 w-14", label: "1º lugar" },
    2: { icon: Medal, color: "text-gray-400", bg: "bg-gray-50 border-gray-200", size: "h-12 w-12", label: "2º lugar" },
    3: { icon: Medal, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", size: "h-12 w-12", label: "3º lugar" },
  }[position];

  const Icon = config.icon;

  return (
    <Card className={cn("border-2 text-center", config.bg, position === 1 && "scale-105 shadow-lg")}>
      <CardContent className="p-5">
        <div className="flex justify-center mb-2">
          <Icon className={cn(config.size, config.color)} />
        </div>
        <p className="text-xs font-medium text-muted-foreground mb-1">{config.label}</p>
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg mb-2">
          {row.full_name.charAt(0).toUpperCase()}
        </div>
        <p className="font-semibold text-sm truncate">{row.full_name}</p>
        <p className="text-xs text-muted-foreground truncate">{row.cargo ?? row.area ?? "—"}</p>
        <div className="mt-3 grid grid-cols-2 gap-1 text-center">
          <div>
            <p className="text-lg font-bold">{row.indicacoes}</p>
            <p className="text-xs text-muted-foreground">indicações</p>
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-600">{row.conversoes}</p>
            <p className="text-xs text-muted-foreground">conversões</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RankingPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<RankingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(String(CURRENT_YEAR));
  const [month, setMonth] = useState("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc("get_ranking", {
          p_year: parseInt(year),
          p_month: month === "all" ? null : parseInt(month),
        });
        if (error) throw error;
        setRows((data ?? []) as RankingRow[]);
      } catch (err) {
        console.error("Erro ao carregar ranking:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [year, month]);

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);
  const myPosition = rows.findIndex((r) => r.user_id === user?.id) + 1;
  const myRow = rows.find((r) => r.user_id === user?.id);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ranking</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quem está fazendo a diferença no programa
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Minha posição */}
      {myRow && myPosition > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                {myPosition}º
              </div>
              <div>
                <p className="font-semibold text-sm">Sua posição</p>
                <p className="text-xs text-muted-foreground">{myRow.cargo ?? myRow.area ?? "—"}</p>
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="font-bold">{myRow.indicacoes}</p>
                <p className="text-xs text-muted-foreground">indicações</p>
              </div>
              <div>
                <p className="font-bold text-emerald-600">{myRow.conversoes}</p>
                <p className="text-xs text-muted-foreground">conversões</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pódio */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-52" />)}
        </div>
      ) : top3.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {top3[1] && <PodiumCard row={top3[1]} position={2} />}
          {top3[0] && <PodiumCard row={top3[0]} position={1} />}
          {top3[2] && <PodiumCard row={top3[2]} position={3} />}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 flex flex-col items-center text-center">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="font-semibold">Nenhuma indicação neste período</p>
            <p className="text-sm text-muted-foreground mt-1">Seja o primeiro a entrar no ranking!</p>
          </CardContent>
        </Card>
      )}

      {/* Tabela completa */}
      {rest.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" /> Todos os participantes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {rest.map((row, idx) => {
                const pos = idx + 4;
                const isMe = row.user_id === user?.id;
                return (
                  <div
                    key={row.user_id}
                    className={cn(
                      "flex items-center justify-between px-6 py-3 hover:bg-muted/40 transition-colors",
                      isMe && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm font-medium text-muted-foreground w-6 text-right shrink-0">
                        {pos}º
                      </span>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold text-xs">
                        {row.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {row.full_name} {isMe && <span className="text-primary text-xs">(você)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{row.cargo ?? row.area ?? "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <div className="hidden sm:block">
                        <p className="text-sm font-medium">{row.indicacoes}</p>
                        <p className="text-xs text-muted-foreground">indicações</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-emerald-600">{row.conversoes}</p>
                        <p className="text-xs text-muted-foreground">conversões</p>
                      </div>
                      {row.revenue > 0 && (
                        <Badge variant="outline" className="text-xs hidden md:flex">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          R$ {row.revenue.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
