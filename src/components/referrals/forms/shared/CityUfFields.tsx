import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormField as RHFFormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRAZIL_STATES } from "../constants";
import { FormField } from "./FormField";
import { ReferralTextField } from "./ReferralTextField";
import type { ReferralFormMode } from "../types";
import { fieldReadOnlyProps } from "./form-mode";

interface CityUfFieldsProps<T extends FieldValues> {
  control: Control<T>;
  cityName: FieldPath<T>;
  stateName: FieldPath<T>;
  mode: ReferralFormMode;
}

export function CityUfFields<T extends FieldValues>({
  control,
  cityName,
  stateName,
  mode,
}: CityUfFieldsProps<T>) {
  const ro = fieldReadOnlyProps(mode);

  return (
    <>
      <ReferralTextField
        name={cityName}
        label="Cidade"
        mode={mode}
        placeholder="São Paulo"
      />
      <RHFFormField
        control={control}
        name={stateName}
        render={({ field }) => (
          <FormField label="UF">
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={ro.disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="UF" />
              </SelectTrigger>
              <SelectContent>
                {BRAZIL_STATES.map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        )}
      />
    </>
  );
}
