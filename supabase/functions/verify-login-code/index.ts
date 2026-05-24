import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import {
  codesMatch,
  isCorporateEmail,
  normalizeEmail,
} from "../_shared/login-code.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await req.json();
    const rawEmail = body?.email;
    const rawCode = body?.code;

    if (!rawEmail || typeof rawEmail !== "string") {
      return jsonResponse({ error: "E-mail é obrigatório." }, 400);
    }
    if (!rawCode || typeof rawCode !== "string" || !/^\d{6}$/.test(rawCode)) {
      return jsonResponse({ error: "Informe o código de 6 dígitos." }, 400);
    }

    const email = normalizeEmail(rawEmail);
    if (!isCorporateEmail(email)) {
      return jsonResponse({ error: "E-mail corporativo inválido." }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { data: rows, error: fetchError } = await supabase
      .from("login_codes")
      .select("id, code_hash, expires_at")
      .eq("email", email)
      .is("consumed_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) throw fetchError;
    const row = rows?.[0];
    if (!row) {
      return jsonResponse({ error: "Código inválido ou expirado." }, 401);
    }

    const valid = await codesMatch(row.code_hash, rawCode);
    if (!valid) {
      return jsonResponse({ error: "Código inválido ou expirado." }, 401);
    }

    await supabase
      .from("login_codes")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", row.id);

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkError) throw linkError;

    const token_hash = linkData.properties?.hashed_token;
    if (!token_hash) {
      throw new Error("Failed to generate session token");
    }

    return jsonResponse({
      ok: true,
      email,
      token_hash,
      type: "email",
    });
  } catch (err) {
    console.error("verify-login-code:", err);
    return jsonResponse({ error: "Não foi possível validar o código. Tente novamente." }, 500);
  }
});
