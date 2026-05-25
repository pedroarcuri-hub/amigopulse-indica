import { FormField as RHFFormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FieldPath, FieldValues } from "react-hook-form";
import { FormField } from "./FormField";
import { fieldReadOnlyProps } from "./form-mode";
import type { ReferralFormMode } from "../types";

interface ReferralTextFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  mode: ReferralFormMode;
  required?: boolean;
  description?: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  onChangeMask?: (value: string) => string;
}

export function ReferralTextField<T extends FieldValues>({
  name,
  label,
  mode,
  required,
  description,
  placeholder,
  type = "text",
  multiline,
  onChangeMask,
}: ReferralTextFieldProps<T>) {
  const ro = fieldReadOnlyProps(mode);

  return (
    <RHFFormField
      name={name}
      render={({ field }) => (
        <FormField label={label} required={required} description={description}>
          {multiline ? (
            <Textarea
              {...field}
              {...ro}
              placeholder={placeholder}
              rows={4}
              className="resize-y min-h-[100px]"
            />
          ) : (
            <Input
              {...field}
              {...ro}
              type={type}
              placeholder={placeholder}
              onChange={(e) => {
                const v = onChangeMask ? onChangeMask(e.target.value) : e.target.value;
                field.onChange(v);
              }}
            />
          )}
        </FormField>
      )}
    />
  );
}
