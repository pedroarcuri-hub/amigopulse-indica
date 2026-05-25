import { useEffect, useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { FormField as RHFFormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchBrazilCitiesByStateId,
  fetchBrazilStates,
} from "@/lib/locations/location-service";
import type { BrazilCity, BrazilState } from "@/lib/locations/types";
import { FormField } from "./FormField";
import type { ReferralFormMode } from "../types";
import { fieldReadOnlyProps, isReadonlyMode } from "./form-mode";

export interface CityUfFieldNames<T extends FieldValues> {
  stateId: FieldPath<T>;
  stateUf: FieldPath<T>;
  cityId: FieldPath<T>;
  cityName: FieldPath<T>;
}

interface CityUfFieldsProps<T extends FieldValues> {
  control: Control<T>;
  names: CityUfFieldNames<T>;
  mode: ReferralFormMode;
}

export function CityUfFields<T extends FieldValues>({
  control,
  names,
  mode,
}: CityUfFieldsProps<T>) {
  const { setValue, watch } = useFormContext<T>();
  const ro = fieldReadOnlyProps(mode);
  const readonly = isReadonlyMode(mode);

  const stateIdValue = watch(names.stateId);
  const parsedStateId = stateIdValue ? Number(stateIdValue) : 0;

  const [states, setStates] = useState<BrazilState[]>([]);
  const [cities, setCities] = useState<BrazilCity[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingStates(true);
    setLocationError(null);

    fetchBrazilStates()
      .then((rows) => {
        if (!cancelled) setStates(rows);
      })
      .catch(() => {
        if (!cancelled) {
          setLocationError("Não foi possível carregar os estados.");
          setStates([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingStates(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!parsedStateId) {
      setCities([]);
      setLoadingCities(false);
      return;
    }

    let cancelled = false;
    setLoadingCities(true);
    setLocationError(null);

    fetchBrazilCitiesByStateId(parsedStateId)
      .then((rows) => {
        if (!cancelled) setCities(rows);
      })
      .catch(() => {
        if (!cancelled) {
          setLocationError("Não foi possível carregar as cidades.");
          setCities([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingCities(false);
      });

    return () => {
      cancelled = true;
    };
  }, [parsedStateId]);

  const handleStateChange = (stateId: string) => {
    const state = states.find((s) => String(s.id) === stateId);
    setValue(names.stateId, stateId as never, { shouldValidate: true });
    setValue(names.stateUf, (state?.uf ?? "") as never, { shouldValidate: true });
    setValue(names.cityId, "" as never, { shouldValidate: true });
    setValue(names.cityName, "" as never, { shouldValidate: true });
  };

  const handleCityChange = (cityId: string) => {
    const city = cities.find((c) => String(c.id) === cityId);
    setValue(names.cityId, cityId as never, { shouldValidate: true });
    setValue(names.cityName, (city?.name ?? "") as never, { shouldValidate: true });
  };

  if (loadingStates) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <>
      <RHFFormField
        control={control}
        name={names.stateId}
        render={({ field }) => (
          <FormField label="Estado (UF)" required={false}>
            <Select
              value={field.value ? String(field.value) : ""}
              onValueChange={handleStateChange}
              disabled={ro.disabled || readonly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.uf} — {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        )}
      />

      <RHFFormField
        control={control}
        name={names.cityId}
        render={({ field }) => (
          <FormField label="Cidade" required={false}>
            <Select
              value={field.value ? String(field.value) : ""}
              onValueChange={handleCityChange}
              disabled={
                ro.disabled ||
                readonly ||
                !parsedStateId ||
                loadingCities
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !parsedStateId
                      ? "Selecione o estado primeiro"
                      : loadingCities
                        ? "Carregando cidades..."
                        : "Selecione a cidade"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        )}
      />

      {locationError && (
        <p className="text-sm text-destructive sm:col-span-2">{locationError}</p>
      )}
    </>
  );
}
