import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CardRadioOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon?: ElementType;
}

interface CardRadioGroupProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: CardRadioOption<T>[];
  disabled?: boolean;
  className?: string;
  columns?: 1 | 2 | 3;
}

/** Seletor em cards — padrão Premia (NewReferral). */
export function CardRadioGroup<T extends string>({
  value,
  onChange,
  options,
  disabled,
  className,
  columns = 3,
}: CardRadioGroupProps<T>) {
  const gridClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-3";

  return (
    <div className={cn("grid gap-2", gridClass, className)} role="radiogroup">
      {options.map((opt) => {
        const active = value === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:opacity-50 disabled:pointer-events-none",
              active
                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/25"
                : "border-border bg-card hover:border-primary/30 hover:bg-muted/30",
            )}
          >
            {active && (
              <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" />
              </span>
            )}
            {Icon && (
              <Icon
                className={cn(
                  "h-5 w-5",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              />
            )}
            <span className="text-sm font-semibold pr-6">{opt.label}</span>
            {opt.description && (
              <span className="text-xs text-muted-foreground leading-snug">
                {opt.description}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function CardRadioGroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-medium text-foreground mb-3">{children}</p>
  );
}
