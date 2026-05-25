import { supabase } from "@/integrations/supabase/client";
import { getMockCitiesByStateId, getMockStates } from "./location-mock";
import type { BrazilCity, BrazilState } from "./types";

/** Mock de localidades somente com VITE_USE_REFERRALS_MOCK=true */
export const USE_LOCATIONS_MOCK =
  import.meta.env.VITE_USE_REFERRALS_MOCK === "true";

export async function fetchBrazilStates(): Promise<BrazilState[]> {
  if (USE_LOCATIONS_MOCK) {
    return getMockStates();
  }

  const { data, error } = await supabase
    .from("brazil_states")
    .select("id, uf, name, region, is_active")
    .eq("is_active", true)
    .order("uf", { ascending: true });

  if (error) throw error;
  return (data ?? []) as BrazilState[];
}

export async function fetchBrazilCitiesByStateId(
  stateId: number,
): Promise<BrazilCity[]> {
  if (!stateId) return [];

  if (USE_LOCATIONS_MOCK) {
    return getMockCitiesByStateId(stateId);
  }

  const { data, error } = await supabase
    .from("brazil_cities")
    .select("id, state_id, name, ibge_code, is_active")
    .eq("state_id", stateId)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as BrazilCity[];
}
