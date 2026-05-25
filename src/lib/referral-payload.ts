/**
 * Monta o metadata canônico de referrals_v2 por target_type.
 * Segue a spec: estudante NÃO inclui system_usage.
 */

export type TargetType = "client_student" | "client_professional" | "client_company";

// ─── Estudante ────────────────────────────────────────────────────────────────
export interface StudentFormData {
  lead_name: string;
  lead_email: string;
  lead_phone: string;
  lead_cpf?: string;
  course: string;
  course_other?: string;
  formation_cycle: string;
  period: string;
  institution_id?: string;
  institution_name: string;
  institution_name_manual?: string;
  campus_name?: string;
  campus_id?: string;
  institution_state: string;
  institution_city: string;
  notes?: string;
  manual_entry_source?: string;
}

export function buildStudentMetadata(d: StudentFormData) {
  return {
    lead_name: d.lead_name,
    healthcare_relation: "health_student",
    academic_data: {
      course: d.course,
      course_other: d.course_other ?? null,
      formation_cycle: d.formation_cycle,
      period: d.period,
      institution_id: d.institution_id ?? null,
      institution_name: d.institution_name_manual ?? d.institution_name,
      campus_name: d.campus_name ?? null,
      campus_id: d.campus_id ?? null,
    },
    institution_location: {
      state: d.institution_state,
      state_id: null,
      city: d.institution_city,
      city_id: null,
    },
    manual_entry_source: d.manual_entry_source ?? "manual_indica",
    notes: d.notes ?? null,
    // system_usage NUNCA é incluído para estudante
  };
}

// ─── Profissional ─────────────────────────────────────────────────────────────
export interface ProfessionalFormData {
  lead_name: string;
  lead_email: string;
  lead_phone: string;
  lead_cpf?: string;
  profession: string;
  profession_other?: string;
  specialty?: string;
  medical_specialty?: string;
  state: string;
  city: string;
  uses_system: string;
  which_system?: string;
  notes?: string;
  manual_entry_source?: string;
}

export function buildProfessionalMetadata(d: ProfessionalFormData) {
  return {
    lead_name: d.lead_name,
    healthcare_relation: "health_professional",
    professional_data: {
      profession: d.profession,
      profession_other: d.profession_other ?? null,
      specialty: d.specialty ?? null,
      medical_specialty: d.medical_specialty ?? null,
    },
    location: {
      state: d.state,
      state_id: null,
      city: d.city,
      city_id: null,
    },
    system_usage: {
      uses: d.uses_system,
      which: d.which_system ?? null,
    },
    manual_entry_source: d.manual_entry_source ?? "manual_indica",
    notes: d.notes ?? null,
  };
}

// ─── Empresa / Clínica / Consultório ──────────────────────────────────────────
export interface CompanyFormData {
  company_name: string;
  company_cnpj?: string;
  company_area?: string;
  contact_name: string;
  contact_role?: string;
  contact_role_other?: string;
  contact_cpf?: string;
  contact_email: string;
  contact_phone: string;
  state: string;
  city: string;
  uses_system: string;
  which_system?: string;
  notes?: string;
  manual_entry_source?: string;
}

export function buildCompanyMetadata(d: CompanyFormData) {
  return {
    company_data: {
      name: d.company_name,
      cnpj: d.company_cnpj?.replace(/\D/g, "") ?? null,
      area: d.company_area ?? null,
    },
    contact_data: {
      name: d.contact_name,
      role: d.contact_role ?? null,
      role_other: d.contact_role_other ?? null,
      cpf: d.contact_cpf?.replace(/\D/g, "") ?? null,
      email: d.contact_email,
      phone: d.contact_phone,
    },
    location: {
      state: d.state,
      state_id: null,
      city: d.city,
      city_id: null,
    },
    system_usage: {
      uses: d.uses_system,
      which: d.which_system ?? null,
    },
    manual_entry_source: d.manual_entry_source ?? "manual_indica",
    notes: d.notes ?? null,
  };
}
