-- OTP login codes (e-mail enviado via Make, não pelo Supabase Auth)
CREATE TABLE IF NOT EXISTS public.login_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS login_codes_email_active_idx
  ON public.login_codes (lower(email), expires_at DESC)
  WHERE consumed_at IS NULL;

ALTER TABLE public.login_codes ENABLE ROW LEVEL SECURITY;

-- Apenas service role (edge functions) acessa esta tabela
CREATE POLICY "login_codes_service_only"
  ON public.login_codes
  FOR ALL
  USING (false)
  WITH CHECK (false);
