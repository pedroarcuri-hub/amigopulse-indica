import {
  DEFAULT_PIPELINE_STAGE,
  DEFAULT_REFERRAL_ORIGIN,
  REFERRAL_TYPE_TO_DB,
} from "./constants";
import type {
  CompanyReferralData,
  ProfessionalReferralData,
  ReferralCreatedBy,
  ReferralFormData,
  ReferralSubmitPayload,
  StudentReferralData,
} from "./types";

type PayloadBase = Pick<
  ReferralSubmitPayload,
  "referral_type" | "pipeline_stage" | "conclusion_status" | "created_by" | "origin"
>;

function payloadBase(data: ReferralFormData, createdBy: ReferralCreatedBy): PayloadBase {
  return {
    referral_type: REFERRAL_TYPE_TO_DB[data.type],
    pipeline_stage: DEFAULT_PIPELINE_STAGE,
    conclusion_status: null,
    created_by: createdBy,
    origin: DEFAULT_REFERRAL_ORIGIN,
  };
}

export function buildReferralSubmitPayload(
  data: ReferralFormData,
  createdBy: ReferralCreatedBy,
): ReferralSubmitPayload {
  const base = payloadBase(data, createdBy);

  switch (data.type) {
    case "professional":
      return buildProfessionalPayload(data, base);
    case "student":
      return buildStudentPayload(data, base);
    case "company":
      return buildCompanyPayload(data, base);
  }
}

function buildProfessionalPayload(
  data: ProfessionalReferralData,
  base: PayloadBase,
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
      form_type: "professional",
      specialty: data.specialty ?? null,
      crm: data.crm ?? null,
      city: data.city ?? null,
      state: data.state ?? null,
    },
  };
}

function buildStudentPayload(
  data: StudentReferralData,
  base: PayloadBase,
): ReferralSubmitPayload {
  return {
    ...base,
    referred_name: data.fullName.trim(),
    referred_email: data.email.trim(),
    referred_phone: data.phone.trim(),
    referred_company_name: data.university?.trim() || null,
    referred_company_segment: data.course?.trim() || null,
    referred_document: null,
    referred_notes: data.notes?.trim() || null,
    metadata: {
      form_type: "student",
      university: data.university ?? null,
      course: data.course ?? null,
      semester: data.semester ?? null,
    },
  };
}

function buildCompanyPayload(
  data: CompanyReferralData,
  base: PayloadBase,
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
      form_type: "company",
      company_name: data.companyName,
      contact_name: data.contactName,
      employees_count: data.employeesCount ?? null,
    },
  };
}
