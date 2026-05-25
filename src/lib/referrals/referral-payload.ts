import {
  DEFAULT_PIPELINE_STAGE,
  DEFAULT_REFERRAL_ORIGIN,
  REFERRAL_DB_TYPE_KEYS,
  REFERRAL_TYPE_TO_DB,
} from "@/components/referrals/forms/constants";
import type {
  CompanyReferralData,
  ProfessionalReferralData,
  ReferralCreatedBy,
  ReferralFormData,
  ReferralSubmitPayload,
  StudentReferralData,
} from "@/components/referrals/forms/types";

type PayloadBase = Pick<
  ReferralSubmitPayload,
  | "referral_type"
  | "created_by_email"
  | "origin"
  | "status"
  | "pipeline_stage"
  | "conclusion_status"
  | "created_by"
>;

function payloadBase(data: ReferralFormData, createdBy: ReferralCreatedBy): PayloadBase {
  const email = createdBy.email.trim().toLowerCase();
  return {
    referral_type: REFERRAL_TYPE_TO_DB[data.type],
    created_by_email: email,
    origin: DEFAULT_REFERRAL_ORIGIN,
    status: DEFAULT_PIPELINE_STAGE,
    pipeline_stage: DEFAULT_PIPELINE_STAGE,
    conclusion_status: null,
    created_by: { ...createdBy, email },
  };
}

function baseMetadata(
  data: ReferralFormData,
  createdBy: ReferralCreatedBy,
): Record<string, unknown> {
  return {
    form_type: data.type,
    client_type: REFERRAL_DB_TYPE_KEYS[data.type],
    created_from: "indica_app",
    program_slug: "indica",
    program_key: "indica",
    created_by_email: createdBy.email.trim().toLowerCase(),
    referrer_email: createdBy.email.trim().toLowerCase(),
    pipeline_stage: DEFAULT_PIPELINE_STAGE,
    origin: DEFAULT_REFERRAL_ORIGIN,
    city: data.city ?? null,
    state: data.state ?? null,
  };
}

export function buildReferralSubmitPayload(
  data: ReferralFormData,
  createdBy: ReferralCreatedBy,
): ReferralSubmitPayload {
  const base = payloadBase(data, createdBy);

  switch (data.type) {
    case "professional":
      return buildProfessionalPayload(data, base, createdBy);
    case "student":
      return buildStudentPayload(data, base, createdBy);
    case "company":
      return buildCompanyPayload(data, base, createdBy);
  }
}

function buildProfessionalPayload(
  data: ProfessionalReferralData,
  base: PayloadBase,
  createdBy: ReferralCreatedBy,
): ReferralSubmitPayload {
  return {
    ...base,
    referred_name: data.fullName.trim(),
    referred_email: data.email.trim(),
    referred_phone: data.phone.trim(),
    referred_company_name: null,
    referred_company_segment: data.specialty?.trim() || null,
    referred_document: data.crm?.trim() || null,
    referred_notes: data.notes?.trim() || null,
    metadata: {
      ...baseMetadata(data, createdBy),
      healthcare_relation: data.healthcareRelation,
      specialty: data.specialty ?? null,
      crm: data.crm ?? null,
    },
  };
}

function buildStudentPayload(
  data: StudentReferralData,
  base: PayloadBase,
  createdBy: ReferralCreatedBy,
): ReferralSubmitPayload {
  return {
    ...base,
    referred_name: data.fullName.trim(),
    referred_email: data.email.trim(),
    referred_phone: data.phone.trim(),
    referred_company_name: data.university.trim(),
    referred_company_segment: data.course?.trim() || null,
    referred_document: null,
    referred_notes: data.notes?.trim() || null,
    metadata: {
      ...baseMetadata(data, createdBy),
      university: data.university,
      course: data.course ?? null,
      semester: data.semester ?? null,
    },
  };
}

function buildCompanyPayload(
  data: CompanyReferralData,
  base: PayloadBase,
  createdBy: ReferralCreatedBy,
): ReferralSubmitPayload {
  return {
    ...base,
    referred_name: data.contactName.trim(),
    referred_email: data.email.trim(),
    referred_phone: data.phone.trim(),
    referred_company_name: data.companyName.trim(),
    referred_company_segment: data.segment?.trim() || null,
    referred_document: data.cnpj?.trim() || null,
    referred_notes: data.notes?.trim() || null,
    metadata: {
      ...baseMetadata(data, createdBy),
      company_name: data.companyName,
      contact_name: data.contactName,
      employees_count: data.employeesCount ?? null,
    },
  };
}
