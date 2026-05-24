
# Migração Amigo Indica → React + Vite (preservando banco atual)

## Contexto crítico

- **Origem:** TanStack Start (file-based routing, `createFileRoute`, `head()`, route loaders, `api.public.*` server endpoints)
- **Destino:** React + Vite + React Router (este projeto)
- **Frontend a migrar:** 19 rotas (1 root, 1 login, 4 admin, 6 app, 3 api server endpoints) + AppLayout + libs (`areas`, `auth-context`, `bitrix-stage-map`, `referral-status`, `referral-value`)
- **Banco de origem (Amigo Indica):** `profiles` (nome, area, cargo, elegivel_programa…), `referrals` (colaborador_id, kind, status, valor_venda, ~50 colunas bitrix_*), `bonuses` (colaborador_id, valor_base, valor_bonus, ciclo_apuracao, status), `integration_logs`
- **Banco atual (Amigo Pulse):** `profiles` (full_name, sem area/cargo), `manual_referrals` (referred_*, status texto livre, revenue_amount), `bonuses` (referral_id, user_id, amount, released_at), `notifications`, `pipeline_events`, dezenas de outras tabelas (turmas, reuniões, instituições — não tocar)
- **Decisões confirmadas:** trazer app inteiro do Amigo Indica, preservar todas as tabelas atuais, **adaptar o frontend aos nomes do banco atual**

## Estratégia

**1 fase de DB (mínima) → 5 fases de frontend.** Não vou criar tabela `referrals` nova nem renomear `manual_referrals`. Em vez disso: o código copiado vai consumir `manual_referrals` direto, com um adapter fino em `src/lib/db-adapter.ts` que traduz nomes (`colaborador_id` → `user_id`, `kind` → derivado, `valor_venda` → `revenue_amount`, etc.).

**Rotas TanStack Start → React Router:** cada `_app.app.X.tsx` vira `/app/X` em `<Route>` dentro de `App.tsx`, envolto por `<AppLayout>` + `<RequireAuth>`. Cada `_admin.admin.X.tsx` vira `/admin/X` envolto por `<RequireAdmin>`. As 3 rotas `api.public.*` (server endpoints do TanStack) viram **edge functions** Supabase (Bitrix sync, webhooks).

## Fase 0 — Preparação (banco + design system)

**Migration única, mínima, aditiva:**
- Adicionar colunas em `profiles`: `area text`, `cargo text`, `elegivel_programa boolean default true`, `nome text generated always as (full_name) stored` (alias read-only para satisfazer queries copiadas) — **OU** simplesmente adaptar o frontend para usar `full_name` (preferido, sem alterar schema)
- Adicionar enum `user_area` se necessário, ou usar `text` livre
- Função RPC `get_ranking(p_year int, p_month int)` retornando `(user_id, full_name, area, indicacoes, conversoes, revenue)` — `SECURITY DEFINER`, lendo de `manual_referrals` + `profiles`
- Função RPC `get_user_stats(p_user_id uuid, p_year int, p_month int)` para dashboards
- **Não tocar:** `turmas`, `reuniões`, `instituicoes_medicas`, `representantes_turma`, `bonuses` existente, `pipeline_events`, etc.

**Design tokens em `src/index.css` + `tailwind.config.ts`:**
- `--success`, `--success-foreground`, `--success-soft`, `--success-soft-foreground`, `--success-border`
- `--warning`, `--warning-foreground`
- `--gradient-primary` (utility `bg-gradient-primary`)

## Fase 1 — Auth + Layout + Rotas vazias

- `src/lib/auth-context.tsx` (Provider + hook `useAuth`) usando `supabase.auth`
- `src/components/RequireAuth.tsx`, `src/components/RequireAdmin.tsx` (consulta `has_role(uid, 'admin')`)
- `src/pages/Login.tsx` (email + senha, signup, recover)
- `src/pages/AppLayout.tsx` (sidebar/topbar adaptado)
- `src/components/PeriodFilter.tsx`, `src/components/StatusBadge.tsx` (copiados, ajustados)
- `src/lib/areas.ts`, `src/lib/referral-value.ts`, `src/lib/referral-status.ts`, `src/lib/bitrix-stage-map.ts` (copiados)
- `src/lib/db-adapter.ts` (mapeia `manual_referrals` → shape `referral` que o frontend espera)
- `App.tsx` com todas as rotas registradas (páginas como stubs "em construção")

## Fase 2 — App do colaborador

- `/app` (dashboard) — `_app.app.index.tsx`
- `/app/indicacoes` — listagem
- `/app/nova-indicacao` — form de criação (insert em `manual_referrals`)
- `/app/ranking` — RPC `get_ranking`
- `/app/ganhos` — leitura de `bonuses` (com adapter)
- `/app/regras`, `/app/ajuda` — páginas estáticas

## Fase 3 — Admin

- `/admin` (dashboard com métricas)
- `/admin/indicacoes`, `/admin/usuarios`, `/admin/ranking`, `/admin/metricas`, `/admin/pagamentos`
- Todos protegidos por `RequireAdmin`

## Fase 4 — Edge functions (substitui `api.public.*`)

- `bitrix-status-sync` — sync periódico (cron)
- `referral-bitrix-link` — webhook Bitrix
- `referrals-converted` — webhook de conversão
- **Secrets necessários (vou pedir depois):** `BITRIX_WEBHOOK_URL`, `BITRIX_TOKEN`, possivelmente outros conforme o código original

## Fase 5 — Polimento

- Notificações (já tem `notifications` table — reaproveitar)
- Tratamento de erros, loading states, empty states
- Testes visuais

## O que NÃO faço

- Não dropo nem altero tabelas existentes (turmas, reuniões, etc.)
- Não migro dados (banco fica vazio para o programa de indicação até alguém usar)
- Não copio `routeTree.gen.ts` nem `router.tsx` (TanStack-específico)
- Não tento manter rotas `api.public.*` como rotas — viram edge functions

## Próximo passo

Confirmar e eu começo pela **Fase 0 + Fase 1** num único PR (migration + auth + layout + stubs de rota). Depois sigo fase a fase, **uma fase por mensagem sua de "ok, próxima"**, pra você revisar incrementalmente.

**Tamanho estimado:** ~30-40 arquivos novos no total, distribuídos em 5 mensagens de código.
