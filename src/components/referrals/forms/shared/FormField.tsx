import type { ReactNode } from "react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  required?: boolean;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Campo padronizado do ecossistema Amigo (label, descrição, mensagem de erro).
 * Deve ser usado dentro de FormField (react-hook-form) do shadcn.
 */
export function FormField({
  label,
  required,
  description,
  children,
  className,
}: FormFieldProps) {
  return (
    <FormItem className={cn(className)}>
      <FormLabel>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </FormLabel>
      <FormControl>{children}</FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
