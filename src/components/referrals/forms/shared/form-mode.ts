import type { ReferralFormMode } from "../types";

export function isReadonlyMode(mode: ReferralFormMode): boolean {
  return mode === "readonly";
}

export function isEditMode(mode: ReferralFormMode): boolean {
  return mode === "edit";
}

export function submitLabel(mode: ReferralFormMode): string {
  if (mode === "readonly") return "Fechar";
  if (mode === "edit") return "Salvar alterações";
  return "Enviar indicação";
}

export function fieldReadOnlyProps(mode: ReferralFormMode) {
  return {
    disabled: isReadonlyMode(mode),
    readOnly: isReadonlyMode(mode),
  } as const;
}
