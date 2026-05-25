import { CompanyReferralForm } from "./CompanyReferralForm";
import { ProfessionalReferralForm } from "./ProfessionalReferralForm";
import { StudentReferralForm } from "./StudentReferralForm";
import type { ReferralFormData, ReferralFormMode, ReferralFormType } from "./types";

export interface ReferralFormByTypeProps {
  type: ReferralFormType;
  mode?: ReferralFormMode;
  defaultValues?: Partial<ReferralFormData>;
  onSubmit?: (data: ReferralFormData) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

/** Renderiza o formulário modular correspondente ao tipo selecionado. */
export function ReferralFormByType({
  type,
  mode = "create",
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  className,
}: ReferralFormByTypeProps) {
  const common = { mode, onCancel, isSubmitting, className, key: type };

  switch (type) {
    case "professional":
      return (
        <ProfessionalReferralForm
          {...common}
          defaultValues={
            defaultValues?.type === "professional" ? defaultValues : undefined
          }
          onSubmit={onSubmit as (data: Extract<ReferralFormData, { type: "professional" }>) => void}
        />
      );
    case "student":
      return (
        <StudentReferralForm
          {...common}
          defaultValues={
            defaultValues?.type === "student" ? defaultValues : undefined
          }
          onSubmit={onSubmit as (data: Extract<ReferralFormData, { type: "student" }>) => void}
        />
      );
    case "company":
      return (
        <CompanyReferralForm
          {...common}
          defaultValues={
            defaultValues?.type === "company" ? defaultValues : undefined
          }
          onSubmit={onSubmit as (data: Extract<ReferralFormData, { type: "company" }>) => void}
        />
      );
  }
}
