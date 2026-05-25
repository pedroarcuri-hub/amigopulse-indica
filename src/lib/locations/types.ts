export interface BrazilState {
  id: number;
  uf: string;
  name: string;
  region: string | null;
  is_active: boolean;
}

export interface BrazilCity {
  id: number;
  state_id: number;
  name: string;
  ibge_code: number | null;
  is_active: boolean;
}

/** Valores persistidos nos formulários e no metadata da indicação. */
export interface ReferralLocationValue {
  state_id?: string;
  state_uf?: string;
  city_id?: string;
  city_name?: string;
}
