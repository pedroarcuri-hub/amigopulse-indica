import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  getReferralStatusColor,
  getReferralStatusDescription,
  getReferralStatusLabel,
} from "@/lib/referral-status";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string | null | undefined;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = getReferralStatusLabel(status);
  const description = getReferralStatusDescription(status);
  const colorClass = getReferralStatusColor(status);

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="secondary"
            tabIndex={0}
            className={cn(
              colorClass,
              "cursor-help transition-all duration-150 hover:saturate-150 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              className,
            )}
          >
            {label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs leading-snug">
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
