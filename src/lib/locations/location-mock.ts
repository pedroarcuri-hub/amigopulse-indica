import type { BrazilCity, BrazilState } from "./types";

export const MOCK_BRAZIL_STATES: BrazilState[] = [
  { id: 35, uf: "SP", name: "São Paulo", region: "Sudeste", is_active: true },
  { id: 33, uf: "RJ", name: "Rio de Janeiro", region: "Sudeste", is_active: true },
  { id: 31, uf: "MG", name: "Minas Gerais", region: "Sudeste", is_active: true },
  { id: 29, uf: "BA", name: "Bahia", region: "Nordeste", is_active: true },
  { id: 53, uf: "DF", name: "Distrito Federal", region: "Centro-Oeste", is_active: true },
];

export const MOCK_BRAZIL_CITIES: BrazilCity[] = [
  { id: 3550308, state_id: 35, name: "São Paulo", ibge_code: 3550308, is_active: true },
  { id: 3509502, state_id: 35, name: "Campinas", ibge_code: 3509502, is_active: true },
  { id: 3518800, state_id: 35, name: "Guarulhos", ibge_code: 3518800, is_active: true },
  { id: 3304557, state_id: 33, name: "Rio de Janeiro", ibge_code: 3304557, is_active: true },
  { id: 3301702, state_id: 33, name: "Niterói", ibge_code: 3301702, is_active: true },
  { id: 3106200, state_id: 31, name: "Belo Horizonte", ibge_code: 3106200, is_active: true },
  { id: 2927408, state_id: 29, name: "Salvador", ibge_code: 2927408, is_active: true },
  { id: 5300108, state_id: 53, name: "Brasília", ibge_code: 5300108, is_active: true },
];

export function getMockStates(): BrazilState[] {
  return [...MOCK_BRAZIL_STATES].sort((a, b) => a.uf.localeCompare(b.uf));
}

export function getMockCitiesByStateId(stateId: number): BrazilCity[] {
  return MOCK_BRAZIL_CITIES.filter((c) => c.state_id === stateId && c.is_active).sort(
    (a, b) => a.name.localeCompare(b.name, "pt-BR"),
  );
}
