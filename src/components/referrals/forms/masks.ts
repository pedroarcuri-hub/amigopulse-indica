/** Mantém apenas dígitos. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** (99) 99999-9999 */
export function maskPhoneBr(raw: string): string {
  const d = digitsOnly(raw).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** 99.999.999/9999-99 */
export function maskCnpj(raw: string): string {
  const d = digitsOnly(raw).slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) {
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  }
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

/** 000.000.000-00 */
export function maskCpf(raw: string): string {
  const d = digitsOnly(raw).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/** CRM/UF — até 7 dígitos + UF opcional simplificado */
export function maskCrm(raw: string): string {
  return raw.replace(/[^\dA-Za-z/-]/g, "").slice(0, 12).toUpperCase();
}

export function isValidPhoneBr(value: string): boolean {
  return /^\(\d{2}\) \d{5}-\d{4}$/.test(value);
}

export function isValidCnpjMasked(value: string): boolean {
  if (!value) return true;
  return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value);
}
