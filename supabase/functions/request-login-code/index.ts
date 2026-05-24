import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import {
  expiresAt,
  generateSixDigitCode,
  hashCode,
  isCorporateEmail,
  normalizeEmail,
  notifyMakeWebhook,
} from "../_shared/login-code.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const { email: rawEmail } = await req.json();
    if (!rawEmail || typeof rawEmail !== "string") {
      return jsonResponse({ error: "E-mail é obrigatório." }, 400);
    }

    const email = normalizeEmail(rawEmail);
    if (!isCorporateEmail(email)) {
      return jsonResponse({
        error: "Use seu e-mail corporativo @amigotech.com.br ou @amigoapp.com.br.",
      }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (profileError) throw profileError;
    if (!profile) {
      return jsonResponse({ error: "Nenhuma conta encontrada para este e-mail." }, 404);
    }

    const code = generateSixDigitCode();
    const code_hash = await hashCode(code);
    const exp = expiresAt();

    await supabase
      .from("login_codes")
      .update({ consumed_at: new Date().toISOString() })
      .eq("email", email)
      .is("consumed_at", null);

    const { error: insertError } = await supabase.from("login_codes").insert({
      email,
      code_hash,
      expires_at: exp,
    });
    if (insertError) throw insertError;

    await notifyMakeWebhook({
      email,
      code,
      expires_at: exp,
      app: Deno.env.get("INDICA_APP_NAME") ?? "indica",
    });

    return jsonResponse({ ok: true, expires_at: exp });
  } catch (err) {
    console.error("request-login-code:", err);
    return jsonResponse({ error: "Não foi possível enviar o código. Tente novamente." }, 500);
  }
});
