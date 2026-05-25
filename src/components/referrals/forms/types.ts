/** Tipo de indicação exibido na UI (padrão Premia: client_company | client_professional | client_student). */
export type ReferralFormType = "professional" | "student" | "company";

export type ReferralFormMode = "create" | "edit" | "readonly";

/** Localização (UF/Cidade) vinda de brazil_states + brazil_cities. */
export interface ReferralLocationFields {
  state_id?: string;
  state_uf?: string;
  city_id?: string;
  city_name?: string;
}

export interface ReferralBase extends ReferralLocationFields {
  id?: string;
  type: ReferralFormType;
  notes?: string;
}

export interface ProfessionalReferralData extends ReferralBase {
  type: "professional";
  fullName: string;
  email: string;
  phone: string;
  healthcareRelation: string;
  specialty?: string;
  crm?: string;
}

export interface StudentReferralData extends ReferralBase {
  type: "student";
  fullName: string;
  email: string;
  phone: string;
  university: string;
  course?: string;
  semester?: string;
}

export interface CompanyReferralData extends ReferralBase {
  type: "company";
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  segment?: string;
  cnpj?: string;
  employeesCount?: string;
}

export type ReferralFormData =
  | ProfessionalReferralData
  | StudentReferralData
  | CompanyReferralData;

export interface ReferralFormProps<T extends ReferralFormData> {
  mode?: ReferralFormMode;
  defaultValues?: Partial<T>;
  onSubmit?: (data: T) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

export interface ReferralCreatedBy {
  user_id: string;
  email: string;
  full_name?: string | null;
}

/** Payload normalizado para Supabase (legacy_manual_referrals + metadata). */
export interface ReferralSubmitPayload {
  referral_type: string;
  created_by_email: string;
  origin: string;
  status: string;
  pipeline_stage: string;
  conclusion_status: string | null;
  created_by: ReferralCreatedBy;
  referred_name: string;
  referred_email: string | null;
  referred_phone: string | null;
  referred_company_name: string | null;
  referred_company_segment: string | null;
  referred_document: string | null;
  referred_notes: string | null;
  metadata: Record<string, unknown>;
}
