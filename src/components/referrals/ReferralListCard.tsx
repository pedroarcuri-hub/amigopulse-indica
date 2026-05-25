import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { REFERRAL_KIND_LABEL } from "@/lib/referrals/types";
import type { ReferralRow } from "@/lib/db-adapter";

interface ReferralListCardProps {
  referral: ReferralRow;
}

export function ReferralListCard({ referral }: ReferralListCardProps) {
  const kindLabel = REFERRAL_KIND_LABEL[referral.kind];
  const dateLabel = new Date(referral.created_at).toLocaleDateString("pt-BR");

  return (
    <Card className="p-4 sm:p-5 border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground truncate">{referral.nome_lead}</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {kindLabel}
            <span className="mx-1.5 text-border">•</span>
            {dateLabel}
          </p>
        </div>
        <StatusBadge status={referral.status} className="shrink-0 capitalize" />
      </div>
    </Card>
  );
}
