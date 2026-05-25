import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { listUserReferrals } from "@/lib/referrals/service";
import { filterAndSortReferrals } from "@/lib/referrals/filters";
import {
  PERIOD_PRESET_LABEL,
  REFERRAL_KIND_LABEL,
  SORT_LABEL,
  type ReferralPeriodPreset,
  type ReferralsListFilters,
} from "@/lib/referrals/types";
import { REFERRAL_PIPELINE_STATUSES } from "@/lib/referral-status";
import { getReferralStatusLabel } from "@/lib/referral-status";
import type { ReferralRow } from "@/lib/db-adapter";
import { ReferralListCard } from "@/components/referrals/ReferralListCard";
import { ReferralDetailDrawer } from "@/components/referrals/ReferralDetailDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PERIOD_PRESETS: ReferralPeriodPreset[] = [
  "mes_atual",
  "trimestre",
  "semestre",
  "ano",
  "todos",
];

const defaultFilters: ReferralsListFilters = {
  search: "",
  period: "todos",
  status: "all",
  kind: "all",
  sort: "recent",
};

export default function MinhasIndicacoesPage() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ReferralsListFilters>(defaultFilters);
  const [selected, setSelected] = useState<ReferralRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const rows = await listUserReferrals({
          userId: user.id,
          userEmail: user.email!,
        });
        if (!cancelled) setReferrals(rows);
      } catch {
        if (!cancelled) {
          toast.error("Não foi possível carregar suas indicações.");
          setReferrals([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.email]);

  const openDetail = (referral: ReferralRow) => {
    setSelected(referral);
    setDrawerOpen(true);
  };

  const filtered = useMemo(
    () => filterAndSortReferrals(referrals, filters),
    [referrals, filters],
  );

  const countLabel =
    filtered.length === 1
      ? "1 indicação encontrada"
      : `${filtered.length} indicações encontradas`;

  const patchFilters = (patch: Partial<ReferralsListFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Minhas indicações</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? "Carregando..." : countLabel}
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-primary shadow-elegant shrink-0 self-start sm:self-auto"
        >
          <Link to="/app/nova-indicacao">
            <Plus className="h-4 w-4 mr-1.5" />
            Nova indicação
          </Link>
        </Button>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Buscar indicação..."
          value={filters.search}
          onChange={(e) => patchFilters({ search: e.target.value })}
          className="pl-9 h-11"
          aria-label="Buscar indicação"
        />
      </div>

      {/* Período */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Período:</Label>
        <ToggleGroup
          type="single"
          value={filters.period}
          onValueChange={(v) => v && patchFilters({ period: v as ReferralPeriodPreset })}
          className="flex flex-wrap justify-start gap-1.5 h-auto"
        >
          {PERIOD_PRESETS.map((preset) => (
            <ToggleGroupItem
              key={preset}
              value={preset}
              aria-label={PERIOD_PRESET_LABEL[preset]}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium border data-[state=on]:bg-muted data-[state=on]:text-foreground",
                "data-[state=off]:bg-transparent data-[state=off]:text-muted-foreground",
              )}
            >
              {PERIOD_PRESET_LABEL[preset]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FilterSelect
          label="Status"
          value={filters.status}
          onValueChange={(v) => patchFilters({ status: v as ReferralsListFilters["status"] })}
          options={[
            { value: "all", label: "Todos" },
            ...REFERRAL_PIPELINE_STATUSES.map((s) => ({
              value: s,
              label: getReferralStatusLabel(s),
            })),
          ]}
        />
        <FilterSelect
          label="Perfil"
          value={filters.kind}
          onValueChange={(v) => patchFilters({ kind: v as ReferralsListFilters["kind"] })}
          options={[
            { value: "all", label: "Todos" },
            ...(["cliente", "parceiro", "outro"] as const).map((k) => ({
              value: k,
              label: REFERRAL_KIND_LABEL[k],
            })),
          ]}
        />
        <FilterSelect
          label="Ordenar por"
          value={filters.sort}
          onValueChange={(v) => patchFilters({ sort: v as ReferralsListFilters["sort"] })}
          options={(
            Object.entries(SORT_LABEL) as [ReferralsListFilters["sort"], string][]
          ).map(([value, label]) => ({ value, label }))}
        />
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
          ))
        ) : filtered.length === 0 ? (
          <EmptyState hasReferrals={referrals.length > 0} />
        ) : (
          filtered.map((r) => (
            <ReferralListCard
              key={r.id}
              referral={r}
              onClick={() => openDetail(r)}
            />
          ))
        )}
      </div>

      <ReferralDetailDrawer
        referral={selected}
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function EmptyState({ hasReferrals }: { hasReferrals: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-dashed bg-muted/30">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
        <ListChecks className="h-6 w-6 text-primary" />
      </div>
      <p className="font-semibold">
        {hasReferrals ? "Nenhuma indicação neste filtro" : "Nenhuma indicação ainda"}
      </p>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        {hasReferrals
          ? "Ajuste os filtros ou o período para ver outras indicações."
          : "Cadastre sua primeira indicação e acompanhe o status aqui."}
      </p>
      {!hasReferrals && (
        <Button asChild className="mt-5 bg-gradient-primary shadow-elegant">
          <Link to="/app/nova-indicacao">
            <Plus className="h-4 w-4 mr-2" />
            Nova indicação
          </Link>
        </Button>
      )}
    </div>
  );
}
