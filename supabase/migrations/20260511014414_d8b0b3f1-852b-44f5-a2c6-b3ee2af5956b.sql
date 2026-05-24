
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS area text,
  ADD COLUMN IF NOT EXISTS cargo text,
  ADD COLUMN IF NOT EXISTS elegivel_programa boolean NOT NULL DEFAULT true;

CREATE OR REPLACE FUNCTION public.get_ranking(p_year int, p_month int DEFAULT NULL)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  area text,
  cargo text,
  indicacoes bigint,
  conversoes bigint,
  revenue numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id AS user_id,
    p.full_name,
    p.area,
    p.cargo,
    COUNT(mr.id) AS indicacoes,
    COUNT(mr.id) FILTER (
      WHERE lower(mr.status) IN ('approved','converted','won','ganha','convertida','conversao_validada','bonificacao_liberada')
    ) AS conversoes,
    COALESCE(SUM(mr.revenue_amount) FILTER (
      WHERE lower(mr.status) IN ('approved','converted','won','ganha','convertida','conversao_validada','bonificacao_liberada')
    ), 0) AS revenue
  FROM public.profiles p
  LEFT JOIN public.manual_referrals mr
    ON mr.submitted_by_user_id = p.id
   AND EXTRACT(YEAR FROM mr.created_at) = p_year
   AND (p_month IS NULL OR EXTRACT(MONTH FROM mr.created_at) = p_month)
  WHERE COALESCE(p.elegivel_programa, true) = true
  GROUP BY p.id, p.full_name, p.area, p.cargo
  ORDER BY conversoes DESC, indicacoes DESC, p.full_name ASC;
$$;

REVOKE ALL ON FUNCTION public.get_ranking(int, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_ranking(int, int) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id uuid, p_year int, p_month int DEFAULT NULL)
RETURNS TABLE (
  indicacoes bigint,
  conversoes bigint,
  revenue numeric,
  bonus_estimado numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COUNT(mr.id) AS indicacoes,
    COUNT(mr.id) FILTER (
      WHERE lower(mr.status) IN ('approved','converted','won','ganha','convertida','conversao_validada','bonificacao_liberada')
    ) AS conversoes,
    COALESCE(SUM(mr.revenue_amount) FILTER (
      WHERE lower(mr.status) IN ('approved','converted','won','ganha','convertida','conversao_validada','bonificacao_liberada')
    ), 0) AS revenue,
    COALESCE(SUM(mr.revenue_amount * 0.10) FILTER (
      WHERE lower(mr.status) IN ('approved','converted','won','ganha','convertida','conversao_validada','bonificacao_liberada')
    ), 0) AS bonus_estimado
  FROM public.manual_referrals mr
  WHERE mr.submitted_by_user_id = p_user_id
    AND EXTRACT(YEAR FROM mr.created_at) = p_year
    AND (p_month IS NULL OR EXTRACT(MONTH FROM mr.created_at) = p_month);
$$;

REVOKE ALL ON FUNCTION public.get_user_stats(uuid, int, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_stats(uuid, int, int) TO authenticated;
