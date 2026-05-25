import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField as RHFFormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { maskPhoneBr } from "./masks";
import {
  professionalReferralSchema,
  type ProfessionalReferralFormValues,
} from "./validators";
import type { ProfessionalReferralData, ReferralFormProps } from "./types";
import { FormSection } from "./shared/FormSection";
import { FormField } from "./shared/FormField";
import { FormActions } from "./shared/FormActions";
import { ReferralTextField } from "./shared/ReferralTextField";
import { fieldReadOnlyProps, isReadonlyMode } from "./shared/form-mode";
import { BRAZIL_STATES } from "./constants";

const defaults: ProfessionalReferralFormValues = {
  type: "professional",
  fullName: "",
  email: "",
  phone: "",
  specialty: "",
  crm: "",
  city: "",
  state: "",
  notes: "",
};

export function ProfessionalReferralForm({
  mode = "create",
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  className,
}: ReferralFormProps<ProfessionalReferralData>) {
  const form = useForm<ProfessionalReferralFormValues>({
    resolver: zodResolver(professionalReferralSchema),
    defaultValues: { ...defaults, ...defaultValues },
  });

  const ro = fieldReadOnlyProps(mode);
  const readonly = isReadonlyMode(mode);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (readonly) {
      onCancel?.();
      return;
    }
    await onSubmit?.(values as ProfessionalReferralData);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={cn("space-y-5", className)}>
        <FormSection
          title="Dados do profissional"
          description="Informações do profissional de saúde indicado."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <ReferralTextField
                name="fullName"
                label="Nome completo"
                mode={mode}
                required
                placeholder="Dr. João Silva"
              />
            </div>
            <ReferralTextField
              name="email"
              label="E-mail"
              mode={mode}
              required
              type="email"
              placeholder="nome@clinica.com.br"
            />
            <ReferralTextField
              name="phone"
              label="Telefone (WhatsApp)"
              mode={mode}
              required
              placeholder="(99) 99999-9999"
              onChangeMask={maskPhoneBr}
            />
            <ReferralTextField
              name="specialty"
              label="Especialidade"
              mode={mode}
              placeholder="Cardiologia"
            />
            <ReferralTextField
              name="crm"
              label="CRM"
              mode={mode}
              placeholder="123456/SP"
            />
            <ReferralTextField name="city" label="Cidade" mode={mode} placeholder="São Paulo" />
            <RHFFormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormField label="UF">
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={ro.disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRAZIL_STATES.map((uf) => (
                        <SelectItem key={uf} value={uf}>
                          {uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Observações" description="Opcional — contexto para o time comercial.">
          <ReferralTextField
            name="notes"
            label="Observações"
            mode={mode}
            multiline
            placeholder="Como você conhece este profissional?"
          />
        </FormSection>

        <FormActions mode={mode} isSubmitting={isSubmitting} onCancel={onCancel} />
      </form>
    </Form>
  );
}
