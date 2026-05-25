/** Tipo de indicação exibido na UI e mapeado para referral_type no Supabase. */
export type ReferralFormType = "professional" | "student" | "company";

export type ReferralFormMode = "create" | "edit" | "readonly";

export interface ReferralBase {
  id?: string;
  type: ReferralFormType;
  notes?: string;
}

export interface ProfessionalReferralData extends ReferralBase {
  type: "professional";
  fullName: string;
  email: string;
  phone: string;
  specialty?: string;
  crm?: string;
  city?: string;
  state?: string;
}

export interface StudentReferralData extends ReferralBase {
  type: "student";
  fullName: string;
  email: string;
  phone: string;
  university?: string;
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

/** Usuário autenticado para montagem do payload Supabase. */
export interface ReferralCreatedBy {
  user_id: string;
  email: string;
  full_name?: string | null;
}

/** Payload normalizado para insert/update futuro no Supabase. */
export interface ReferralSubmitPayload {
  referral_type: string;
  referred_name: string;
  referred_email: string | null;
  referred_phone: string | null;
  referred_company_name: string | null;
  referred_company_segment: string | null;
  referred_document: string | null;
  referred_notes: string | null;
  pipeline_stage: string;
  conclusion_status: string | null;
  created_by: ReferralCreatedBy;
  origin: string;
  metadata: Record<string, unknown>;
}
