import type { ReferralFormType } from "./types";
import { Building2, GraduationCap, Stethoscope } from "lucide-react";
import type { ElementType } from "react";

export const REFERRAL_FORM_TYPE_LABEL: Record<ReferralFormType, string> = {
  professional: "Profissional",
  student: "Estudante",
  company: "Empresa",
};

export const REFERRAL_FORM_TYPE_DESCRIPTION: Record<ReferralFormType, string> = {
  professional: "Médicos, dentistas e outros profissionais de saúde.",
  student: "Estudantes de graduação ou pós em instituições parceiras.",
  company: "Clínicas, hospitais e empresas do setor de saúde.",
};

export const REFERRAL_FORM_TYPE_ICON: Record<ReferralFormType, ElementType> = {
  professional: Stethoscope,
  student: GraduationCap,
  company: Building2,
};

/** Mapeamento UI → referral_type (legacy_manual_referrals). */
export const REFERRAL_TYPE_TO_DB: Record<ReferralFormType, string> = {
  professional: "parceiro",
  student: "outro",
  company: "cliente",
};

export const DEFAULT_PIPELINE_STAGE = "criada";
export const DEFAULT_REFERRAL_ORIGIN = "indica";

export const COMPANY_SEGMENTS = [
  { value: "clinica", label: "Clínica" },
  { value: "hospital", label: "Hospital" },
  { value: "laboratorio", label: "Laboratório" },
  { value: "operadora", label: "Operadora / plano" },
  { value: "outro", label: "Outro" },
] as const;

export const EMPLOYEE_RANGES = [
  { value: "1-10", label: "1 a 10" },
  { value: "11-50", label: "11 a 50" },
  { value: "51-200", label: "51 a 200" },
  { value: "200+", label: "Mais de 200" },
] as const;

/** Relação com saúde — alinhado ao HealthcareRelationSelector do Premia. */
export const HEALTHCARE_RELATIONS = [
  { value: "medico", label: "Médico(a)" },
  { value: "dentista", label: "Dentista" },
  { value: "enfermeiro", label: "Enfermeiro(a)" },
  { value: "gestor", label: "Gestor(a) / administrador(a)" },
  { value: "outro", label: "Outro profissional de saúde" },
] as const;

export const REFERRAL_DB_TYPE_KEYS = {
  company: "client_company",
  professional: "client_professional",
  student: "client_student",
} as const;

/** Ciclos de formação — alinhado ao enum formation_cycle_enum do Supabase. */
export const FORMATION_CYCLES = [
  { value: "semestral", label: "Semestral" },
  { value: "anual", label: "Anual" },
] as const;

/** Períodos por ciclo. Semestral → 1º a 12º semestre. Anual → 1º a 6º ano. */
export const PERIODS_BY_CYCLE: Record<"semestral" | "anual", { value: string; label: string }[]> = {
  semestral: Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}º semestre`,
  })),
  anual: Array.from({ length: 6 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}º ano`,
  })),
};
