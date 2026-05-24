import { supabase } from "@/integrations/supabase/client";

type FnError = { error?: string; message?: string };

async function invokeFunction<T>(name: string, body: Record<string, string>): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) throw new Error(error.message || "Erro na comunicação com o servidor.");
  const payload = data as T & FnError;
  if (payload && typeof payload === "object" && "error" in payload && payload.error) {
    throw new Error(String(payload.error));
  }
  return payload;
}

export async function requestLoginCode(email: string): Promise<{ expires_at: string }> {
  return invokeFunction<{ ok: boolean; expires_at: string }>("request-login-code", { email });
}

export async function verifyLoginCode(
  email: string,
  code: string,
): Promise<void> {
  const result = await invokeFunction<{
    ok: boolean;
    email: string;
    token_hash: string;
    type: string;
  }>("verify-login-code", { email, code });

  const { error } = await supabase.auth.verifyOtp({
    type: "email",
    token_hash: result.token_hash,
  });
  if (error) throw new Error(error.message);
}
