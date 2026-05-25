import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField as RHFFormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { maskCnpj, maskPhoneBr } from "./masks";
import { companyReferralSchema, type CompanyReferralFormValues } from "./validators";
import type { CompanyReferralData, ReferralFormProps } from "./types";
import { COMPANY_SEGMENTS, EMPLOYEE_RANGES } from "./constants";
import { FormSection } from "./shared/FormSection";
import { FormField } from "./shared/FormField";
import { FormActions } from "./shared/FormActions";
import { ReferralTextField } from "./shared/ReferralTextField";
import { CityUfFields } from "./shared/CityUfFields";
import { fieldReadOnlyProps, isReadonlyMode } from "./shared/form-mode";

const defaults: CompanyReferralFormValues = {
  type: "company",
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  segment: "",
  cnpj: "",
  employeesCount: "",
  state_id: "",
  state_uf: "",
  city_id: "",
  city_name: "",
  notes: "",
};

export function CompanyReferralForm({
  mode = "create",
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  className,
}: ReferralFormProps<CompanyReferralData>) {
  const form = useForm<CompanyReferralFormValues>({
    resolver: zodResolver(companyReferralSchema),
    defaultValues: { ...defaults, ...defaultValues },
  });

  const ro = fieldReadOnlyProps(mode);
  const readonly = isReadonlyMode(mode);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (readonly) {
      onCancel?.();
      return;
    }
    await onSubmit?.(values as CompanyReferralData);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={cn("space-y-5", className)}>
        <FormSection
          title="Dados da empresa"
          description="Informações da empresa e do contato principal."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <ReferralTextField
                name="companyName"
                label="Nome da empresa"
                mode={mode}
                required
                placeholder="Clínica Exemplo"
              />
            </div>
            <ReferralTextField
              name="contactName"
              label="Nome do contato"
              mode={mode}
              required
              placeholder="Ana Paula Souza"
            />
            <RHFFormField
              control={form.control}
              name="segment"
              render={({ field }) => (
                <FormField label="Segmento">
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={ro.disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_SEGMENTS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              )}
            />
            <ReferralTextField
              name="email"
              label="E-mail do contato"
              mode={mode}
              required
              type="email"
              placeholder="contato@empresa.com.br"
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
              name="cnpj"
              label="CNPJ"
              mode={mode}
              placeholder="00.000.000/0001-00"
              onChangeMask={maskCnpj}
            />
            <RHFFormField
              control={form.control}
              name="employeesCount"
              render={({ field }) => (
                <FormField label="Nº de colaboradores">
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={ro.disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYEE_RANGES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              )}
            />
            <CityUfFields
              control={form.control}
              names={{
                stateId: "state_id",
                stateUf: "state_uf",
                cityId: "city_id",
                cityName: "city_name",
              }}
              mode={mode}
            />
          </div>
        </FormSection>

        <FormSection title="Observações" description="Opcional.">
          <ReferralTextField
            name="notes"
            label="Observações"
            mode={mode}
            multiline
            placeholder="Contexto da indicação e relacionamento com a empresa."
          />
        </FormSection>

        <FormActions mode={mode} isSubmitting={isSubmitting} onCancel={onCancel} />
      </form>
    </Form>
  );
}
