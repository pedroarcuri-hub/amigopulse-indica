import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type PeriodPreset = "today" | "7d" | "30d" | "month" | "year" | "all" | "custom";

export interface PeriodRange {
  preset: PeriodPreset;
  from: Date | null;
  to: Date | null;
}

interface Props {
  value: PeriodRange;
  onChange: (next: PeriodRange) => void;
  includeAll?: boolean;
  includeYear?: boolean;
  className?: string;
}

const PRESET_LABEL: Record<PeriodPreset, string> = {
  today: "Hoje",
  "7d": "Últimos 7 dias",
  "30d": "Últimos 30 dias",
  month: "Este mês",
  year: "Este ano",
  all: "Todo o período",
  custom: "Personalizado",
};

export function computeRange(preset: PeriodPreset): { from: Date | null; to: Date | null } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);
  switch (preset) {
    case "today": return { from: today, to: endOfToday };
    case "7d": { const from = new Date(today); from.setDate(from.getDate() - 6); return { from, to: endOfToday }; }
    case "30d": { const from = new Date(today); from.setDate(from.getDate() - 29); return { from, to: endOfToday }; }
    case "month": return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: endOfToday };
    case "year": return { from: new Date(now.getFullYear(), 0, 1), to: endOfToday };
    case "all":
    case "custom":
    default: return { from: null, to: null };
  }
}

export function PeriodFilter({ value, onChange, includeAll = true, includeYear = true, className }: Props) {
  const presets: PeriodPreset[] = useMemo(() => {
    const base: PeriodPreset[] = ["today", "7d", "30d", "month"];
    if (includeYear) base.push("year");
    if (includeAll) base.push("all");
    base.push("custom");
    return base;
  }, [includeAll, includeYear]);

  const setPreset = (p: PeriodPreset) => {
    if (p === "custom") onChange({ preset: "custom", from: value.from, to: value.to });
    else { const r = computeRange(p); onChange({ preset: p, from: r.from, to: r.to }); }
  };

  return (
    <div className={cn("flex flex-wrap items-end gap-3", className)}>
      <div className="min-w-[180px]">
        <p className="text-xs text-muted-foreground mb-1">Período</p>
        <Select value={value.preset} onValueChange={(v) => setPreset(v as PeriodPreset)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {presets.map((p) => (<SelectItem key={p} value={p}>{PRESET_LABEL[p]}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
      {value.preset === "custom" && (
        <>
          <DatePick label="De" date={value.from} onChange={(d) => onChange({ ...value, from: d })} />
          <DatePick label="Até" date={value.to} onChange={(d) => onChange({ ...value, to: d })} />
        </>
      )}
    </div>
  );
}

function DatePick({ label, date, onChange }: { label: string; date: Date | null; onChange: (d: Date | null) => void }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-[170px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? date.toLocaleDateString("pt-BR") : "Selecionar"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date ?? undefined} onSelect={(d) => onChange(d ?? null)} initialFocus className={cn("p-3 pointer-events-auto")} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function inRange(d: string | Date, range: PeriodRange): boolean {
  if (!range.from && !range.to) return true;
  const date = typeof d === "string" ? new Date(d) : d;
  if (range.from && date < range.from) return false;
  if (range.to && date > range.to) return false;
  return true;
}
