import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { maskPhoneBr } from "./masks";
import { studentReferralSchema, type StudentReferralFormValues } from "./validators";
import type { ReferralFormProps, StudentReferralData } from "./types";
import { FormSection } from "./shared/FormSection";
import { FormActions } from "./shared/FormActions";
import { ReferralTextField } from "./shared/ReferralTextField";
import { isReadonlyMode } from "./shared/form-mode";

const defaults: StudentReferralFormValues = {
  type: "student",
  fullName: "",
  email: "",
  phone: "",
  university: "",
  course: "",
  semester: "",
  notes: "",
};

export function StudentReferralForm({
  mode = "create",
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  className,
}: ReferralFormProps<StudentReferralData>) {
  const form = useForm<StudentReferralFormValues>({
    resolver: zodResolver(studentReferralSchema),
    defaultValues: { ...defaults, ...defaultValues },
  });

  const readonly = isReadonlyMode(mode);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (readonly) {
      onCancel?.();
      return;
    }
    await onSubmit?.(values as StudentReferralData);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={cn("space-y-5", className)}>
        <FormSection
          title="Dados do estudante"
          description="Informações do estudante indicado."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <ReferralTextField
                name="fullName"
                label="Nome completo"
                mode={mode}
                required
                placeholder="Maria Souza"
              />
            </div>
            <ReferralTextField
              name="email"
              label="E-mail"
              mode={mode}
              required
              type="email"
              placeholder="maria@universidade.edu.br"
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
              name="university"
              label="Instituição de ensino"
              mode={mode}
              placeholder="Universidade Exemplo"
            />
            <ReferralTextField name="course" label="Curso" mode={mode} placeholder="Medicina" />
            <ReferralTextField
              name="semester"
              label="Semestre / período"
              mode={mode}
              placeholder="6º semestre"
            />
          </div>
        </FormSection>

        <FormSection title="Observações">
          <ReferralTextField
            name="notes"
            label="Observações"
            mode={mode}
            multiline
            placeholder="Informações adicionais sobre o estudante."
          />
        </FormSection>

        <FormActions mode={mode} isSubmitting={isSubmitting} onCancel={onCancel} />
      </form>
    </Form>
  );
}
