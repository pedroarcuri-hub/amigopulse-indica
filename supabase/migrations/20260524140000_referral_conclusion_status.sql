-- Conclusão da indicação (Amigo Indica usa legacy_manual_referrals como tabela de referrals)
ALTER TABLE public.legacy_manual_referrals
  ADD COLUMN IF NOT EXISTS conclusion_status text;

ALTER TABLE public.legacy_manual_referrals
  DROP CONSTRAINT IF EXISTS legacy_manual_referrals_conclusion_status_check;

ALTER TABLE public.legacy_manual_referrals
  ADD CONSTRAINT legacy_manual_referrals_conclusion_status_check
  CHECK (
    conclusion_status IS NULL
    OR conclusion_status IN ('disqualified', 'converted', 'lost')
  );

COMMENT ON COLUMN public.legacy_manual_referrals.conclusion_status IS
  'Conclusão definida pelo colaborador: disqualified | converted | lost';

-- Permite o dono da indicação atualizar conclusão e updated_at
DROP POLICY IF EXISTS "Usuário atualiza próprias indicações" ON public.legacy_manual_referrals;

CREATE POLICY "Usuário atualiza próprias indicações"
  ON public.legacy_manual_referrals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = submitted_by_user_id)
  WITH CHECK (auth.uid() = submitted_by_user_id);
