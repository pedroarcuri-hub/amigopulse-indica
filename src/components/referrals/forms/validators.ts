import { z } from "zod";
import { isValidCnpjMasked, isValidPhoneBr } from "./masks";

const phoneSchema = z
  .string()
  .min(1, "Informe o telefone.")
  .refine(isValidPhoneBr, "Telefone inválido. Use (99) 99999-9999.");

const emailSchema = z
  .string()
  .min(1, "Informe o e-mail.")
  .email("E-mail inválido.");

const notesSchema = z.string().max(2000, "Máximo de 2000 caracteres.").optional();

export const professionalReferralSchema = z.object({
  type: z.literal("professional"),
  id: z.string().optional(),
  fullName: z.string().min(3, "Informe o nome completo."),
  email: emailSchema,
  phone: phoneSchema,
  specialty: z.string().max(120).optional(),
  crm: z.string().max(20).optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(2).optional(),
  notes: notesSchema,
});

export const studentReferralSchema = z.object({
  type: z.literal("student"),
  id: z.string().optional(),
  fullName: z.string().min(3, "Informe o nome completo."),
  email: emailSchema,
  phone: phoneSchema,
  university: z.string().max(120).optional(),
  course: z.string().max(120).optional(),
  semester: z.string().max(40).optional(),
  notes: notesSchema,
});

export const companyReferralSchema = z.object({
  type: z.literal("company"),
  id: z.string().optional(),
  companyName: z.string().min(2, "Informe o nome da empresa."),
  contactName: z.string().min(3, "Informe o nome do contato."),
  email: emailSchema,
  phone: phoneSchema,
  segment: z.string().optional(),
  cnpj: z
    .string()
    .optional()
    .refine(isValidCnpjMasked, "CNPJ inválido."),
  employeesCount: z.string().optional(),
  notes: notesSchema,
});

export type ProfessionalReferralFormValues = z.infer<typeof professionalReferralSchema>;
export type StudentReferralFormValues = z.infer<typeof studentReferralSchema>;
export type CompanyReferralFormValues = z.infer<typeof companyReferralSchema>;
