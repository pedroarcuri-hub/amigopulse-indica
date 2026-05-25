import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReferralFormMode } from "../types";
import { isReadonlyMode, submitLabel } from "./form-mode";

interface FormActionsProps {
  mode?: ReferralFormMode;
  isSubmitting?: boolean;
  onCancel?: () => void;
  cancelHref?: string;
  className?: string;
}

export function FormActions({
  mode = "create",
  isSubmitting,
  onCancel,
  cancelHref = "/app/indicacoes",
  className,
}: FormActionsProps) {
  const readonly = isReadonlyMode(mode);

  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2",
        className,
      )}
    >
      {onCancel ? (
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {readonly ? "Voltar" : "Cancelar"}
        </Button>
      ) : (
        <Button type="button" variant="outline" asChild disabled={isSubmitting}>
          <Link to={cancelHref}>{readonly ? "Voltar" : "Cancelar"}</Link>
        </Button>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-gradient-primary shadow-elegant min-w-[160px]"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {submitLabel(mode)}
      </Button>
    </div>
  );
}
