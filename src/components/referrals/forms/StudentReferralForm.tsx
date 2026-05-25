import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { maskPhoneBr, maskCpf } from "./masks";
import { studentReferralSchema, type StudentReferralFormValues } from "./validators";
import type { ReferralFormProps, StudentReferralData } from "./types";
import { FormSection } from "./shared/FormSection";
import { FormActions } from "./shared/FormActions";
import { ReferralTextField } from "./shared/ReferralTextField";
import { isReadonlyMode } from "./shared/form-mode";
import { FORMATION_CYCLES, PERIODS_BY_CYCLE } from "./constants";
import { supabase } from "@/integrations/supabase/client";
import { Search, ChevronsUpDown, Check } from "lucide-react";

interface Institution {
  id: string;
  nome: string;
  cidade: string | null;
  uf: string | null;
  sigla: string | null;
}

const defaults: StudentReferralFormValues = {
  type: "student",
  fullName: "",
  email: "",
  phone: "",
  cpf: "",
  course: "",
  formationCycle: "semestral",
  currentPeriod: "",
  institutionId: "",
  institutionName: "",
  institutionNotListed: false,
  city_name: "",
  state_uf: "",
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

  // Institution search
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);

  const notListed = useWatch({ control: form.control, name: "institutionNotListed" });
  const cycle = useWatch({ control: form.control, name: "formationCycle" });
  const selectedInstitutionId = useWatch({ control: form.control, name: "institutionId" });

  // Search institutions with debounce
  useEffect(() => {
    if (notListed || search.length < 2) {
      setInstitutions([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoadingInstitutions(true);
      const { data } = await supabase
        .from("instituicoes_medicas")
        .select("id, nome, cidade, uf, sigla")
        .eq("ativa", true)
        .ilike("nome", `%${search}%`)
        .order("nome")
        .limit(20);
      setInstitutions((data ?? []) as Institution[]);
      setShowDropdown(true);
      setLoadingInstitutions(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, notListed]);

  // When cycle changes, reset period
  useEffect(() => {
    form.setValue("currentPeriod", "");
  }, [cycle, form]);

  const selectInstitution = (inst: Institution) => {
    form.setValue("institutionId", inst.id);
    form.setValue("institutionName", inst.nome);
    form.setValue("city_name", inst.cidade ?? "");
    form.setValue("state_uf", inst.uf ?? "");
    setSearch(inst.nome);
    setShowDropdown(false);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (readonly) { onCancel?.(); return; }
    await onSubmit?.(values as StudentReferralData);
  });

  const periods = PERIODS_BY_CYCLE[cycle as "semestral" | "anual"] ?? [];

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={cn("space-y-5", className)}>

        {/* Seção 1: Sobre o estudante */}
        <FormSection
          title="Sobre o estudante"
          description="Informações de contato do estudante indicado."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <ReferralTextField
                name="fullName"
                label="Nome completo do estudante"
                mode={mode}
                required
                placeholder="Maria Souza"
              />
            </div>
            <ReferralTextField
              name="email"
              label="E-mail do estudante"
              mode={mode}
              required
              type="email"
              placeholder="maria@universidade.edu.br"
            />
            <ReferralTextField
              name="phone"
              label="WhatsApp do estudante"
              mode={mode}
              required
              placeholder="(81) 99999-9999"
              onChangeMask={maskPhoneBr}
            />
            <div className="sm:col-span-2">
              <ReferralTextField
                name="cpf"
                label="CPF (opcional)"
                mode={mode}
                placeholder="000.000.000-00"
                onChangeMask={maskCpf}
              />
            </div>
          </div>
        </FormSection>

        {/* Seção 2: Dados acadêmicos */}
        <FormSection
          title="Dados acadêmicos"
          description="Curso, ciclo e período do estudante."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <ReferralTextField
                name="course"
                label="Curso"
                mode={mode}
                required
                placeholder="Medicina"
              />
            </div>

            {/* Ciclo de formação */}
            <FormField
              control={form.control}
              name="formationCycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciclo de formação <span className="text-destructive">*</span></FormLabel>
                  <Select
                    disabled={readonly}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ciclo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FORMATION_CYCLES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Período atual — depende do ciclo */}
            <FormField
              control={form.control}
              name="currentPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Período atual <span className="text-destructive">*</span></FormLabel>
                  <Select
                    disabled={readonly || !cycle}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={!cycle ? "Selecione o ciclo primeiro" : "Selecione o período"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {periods.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        {/* Seção 3: Instituição */}
        <FormSection
          title="Instituição"
          description="Busque a instituição de ensino na base cadastrada."
        >
          <div className="space-y-4">

            {/* Autocomplete de instituição */}
            {!notListed && (
              <FormField
                control={form.control}
                name="institutionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instituição de ensino <span className="text-destructive">*</span></FormLabel>
                    <div className="relative">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          disabled={readonly}
                          placeholder="Digite para buscar..."
                          className="pl-9"
                          value={search || field.value}
                          onChange={(e) => {
                            setSearch(e.target.value);
                            if (!e.target.value) {
                              form.setValue("institutionId", "");
                              form.setValue("institutionName", "");
                              form.setValue("city_name", "");
                              form.setValue("state_uf", "");
                            }
                          }}
                          onFocus={() => search.length >= 2 && setShowDropdown(true)}
                          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        />
                      </div>
                      {showDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                          {loadingInstitutions ? (
                            <div className="px-4 py-3 text-sm text-muted-foreground">Buscando...</div>
                          ) : institutions.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-muted-foreground">Nenhuma instituição encontrada.</div>
                          ) : (
                            institutions.map((inst) => (
                              <button
                                key={inst.id}
                                type="button"
                                className="w-full text-left px-4 py-3 hover:bg-muted/60 transition-colors flex items-start gap-3 border-b last:border-0"
                                onClick={() => selectInstitution(inst)}
                              >
                                <Check className={cn("h-4 w-4 mt-0.5 shrink-0", selectedInstitutionId === inst.id ? "text-primary" : "text-transparent")} />
                                <div className="min-w-0">
                                  <p className="font-medium text-sm truncate">{inst.nome}</p>
                                  {(inst.cidade || inst.uf) && (
                                    <p className="text-xs text-muted-foreground">
                                      {[inst.cidade, inst.uf].filter(Boolean).join(" — ")}
                                    </p>
                                  )}
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Instituição não está na lista */}
            <FormField
              control={form.control}
              name="institutionNotListed"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      disabled={readonly}
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          setSearch("");
                          form.setValue("institutionId", "");
                          form.setValue("institutionName", "");
                          form.setValue("city_name", "");
                          form.setValue("state_uf", "");
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal text-sm cursor-pointer">
                    Minha instituição não está na lista
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Preenchimento manual quando não está na lista */}
            {notListed && (
              <ReferralTextField
                name="institutionName"
                label="Nome da instituição"
                mode={mode}
                required
                placeholder="Ex: Faculdade de Medicina XYZ"
              />
            )}

            {/* Cidade e UF — preenchidos automaticamente ou manualmente */}
            <div className="grid grid-cols-2 gap-4">
              <ReferralTextField
                name="city_name"
                label="Cidade"
                mode={mode}
                placeholder="Recife"
              />
              <ReferralTextField
                name="state_uf"
                label="UF"
                mode={mode}
                placeholder="PE"
              />
            </div>
          </div>
        </FormSection>

        {/* Seção 4: Observações */}
        <FormSection title="Observações" description="Opcional.">
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
