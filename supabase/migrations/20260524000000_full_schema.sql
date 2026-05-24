-- =============================================================
-- AMIGO PULSE — Schema completo (gerado em 2026-05-24)
-- Aplica o schema de produção ao ambiente de staging
-- =============================================================

-- ---------------------------------------------------------------
-- 1. EXTENSIONS
-- ---------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------
-- 2. ENUMS
-- ---------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.access_status AS ENUM ('pending_review', 'approved', 'active', 'rejected', 'inactive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'consultor_comercial', 'supervisor_comercial', 'diretor_regional', 'leadership', 'operations', 'marketing', 'commercial');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.bonus_status AS ENUM ('pendente', 'em_apuracao', 'liberada', 'cancelada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.convite_status AS ENUM ('pendente', 'aceito', 'recusado', 'cancelado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.convite_tipo AS ENUM ('turma', 'representante');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.formation_cycle_enum AS ENUM ('semestral', 'anual');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.institution_type AS ENUM ('publica', 'privada', 'desconhecida', 'federal', 'estadual', 'municipal');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.meeting_type AS ENUM ('individual', 'grupo');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.partner_lifecycle_status AS ENUM ('onboarding', 'ativo', 'inativo', 'suspenso', 'encerrado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.partner_pipeline_status AS ENUM ('inscricao_recebida', 'em_qualificacao', 'analise_juridica', 'assinatura_contratual', 'ativo', 'recusado', 'desqualificado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.referral_status AS ENUM ('recebida', 'em_analise', 'contato_iniciado', 'em_negociacao', 'proposta_enviada', 'fechado', 'implantacao_concluida', 'pagamento_realizado', 'conversao_validada', 'bonificacao_liberada', 'perdida', 'nova', 'em_contato', 'aguardando_resposta', 'em_qualificacao', 'reuniao_agendada', 'contrato_fechado', 'convertida', 'desqualificada', 'erro', 'em_andamento', 'ativa', 'em_implantacao');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.referral_type AS ENUM ('empresa', 'profissional', 'estudante');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.referrer_type AS ENUM ('empresa', 'profissional', 'estudante');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.rep_status AS ENUM ('ativo', 'inativo');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.reuniao_status AS ENUM ('ativa', 'cancelada', 'excluida');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.turma_status AS ENUM ('ativa', 'pausada', 'finalizada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.user_status AS ENUM ('incompleto', 'pendente', 'ativo', 'bloqueado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.vinculo_acao AS ENUM ('vinculado', 'desvinculado', 'convite_enviado', 'convite_aceito', 'convite_recusado', 'convite_cancelado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------
-- 3. SEQUENCES
-- ---------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.attribution_events_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.link_clicks_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.manual_referral_events_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.points_transactions_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.referral_events_id_seq;

-- ---------------------------------------------------------------
-- 4. CORE TABLES
-- ---------------------------------------------------------------

-- People & Accounts
CREATE TABLE IF NOT EXISTS public.people (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cpf text NOT NULL,
  full_name text NOT NULL,
  birth_date date,
  primary_email text NOT NULL,
  primary_phone text,
  person_type text NOT NULL DEFAULT 'external',
  status text NOT NULL DEFAULT 'active',
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  can_sell_to_students boolean NOT NULL DEFAULT false,
  avatar_url text
);

CREATE TABLE IF NOT EXISTS public.user_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id uuid NOT NULL,
  auth_user_id uuid NOT NULL,
  login_email text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.person_emails (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id uuid NOT NULL,
  email text NOT NULL,
  email_type text NOT NULL DEFAULT 'secondary',
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cnpj text NOT NULL,
  legal_name text NOT NULL,
  trade_name text,
  segment_id uuid,
  city_id integer,
  state_id integer,
  status text NOT NULL DEFAULT 'active',
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.organization_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL,
  person_id uuid NOT NULL,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  invited_by_person_id uuid,
  joined_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.employee_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id uuid NOT NULL,
  corporate_email text NOT NULL,
  department text,
  position text,
  region_id uuid,
  is_active boolean NOT NULL DEFAULT true,
  validated_by_person_id uuid,
  validated_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Programs & Memberships
CREATE TABLE IF NOT EXISTS public.programs_v2 (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL,
  name text NOT NULL,
  participant_entity text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_memberships (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id uuid NOT NULL,
  person_id uuid,
  organization_id uuid,
  membership_type text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  end_reason text,
  invited_by_person_id uuid,
  approved_by_person_id uuid,
  source text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_membership_transitions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id uuid NOT NULL,
  from_membership_id uuid,
  to_membership_id uuid,
  transition_type text NOT NULL,
  reason text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_by_person_id uuid
);

CREATE TABLE IF NOT EXISTS public.program_invite_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_program_id uuid NOT NULL,
  destination_program_id uuid NOT NULL,
  allowed_source_roles text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true
);

-- Access & Roles
CREATE TABLE IF NOT EXISTS public.pulse_access_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id uuid NOT NULL,
  role text NOT NULL,
  region_id uuid,
  status text NOT NULL DEFAULT 'active',
  approved_by_person_id uuid,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.access_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  status public.access_status NOT NULL DEFAULT 'pending_review',
  user_id uuid,
  assigned_role text,
  internal_reason text,
  user_message text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  decided_by uuid,
  last_magic_link_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'pulse_magic_link',
  requested_from text,
  approved_by uuid,
  approved_at timestamptz,
  rejection_reason text
);

CREATE TABLE IF NOT EXISTS public.access_audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_user_id uuid,
  target_email text,
  target_user_id uuid,
  action text NOT NULL,
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Regions
CREATE TABLE IF NOT EXISTS public.regions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  label text NOT NULL,
  state text,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Geo
CREATE TABLE IF NOT EXISTS public.brazil_states (
  id integer PRIMARY KEY,
  uf char(2) NOT NULL,
  name text NOT NULL,
  region text,
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.brazil_cities (
  id integer PRIMARY KEY,
  state_id integer NOT NULL,
  name text NOT NULL,
  ibge_code integer,
  is_active boolean NOT NULL DEFAULT true
);

-- Referrals V2
CREATE TABLE IF NOT EXISTS public.referral_links_v2 (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_person_id uuid,
  owner_organization_id uuid,
  program_id uuid NOT NULL,
  target_type text NOT NULL,
  token text NOT NULL,
  full_url text,
  status text NOT NULL DEFAULT 'active',
  disabled_at timestamptz,
  disabled_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.referrals_v2 (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id uuid NOT NULL,
  source_membership_id uuid,
  submitted_by_person_id uuid,
  submitted_by_organization_id uuid,
  submitted_via text NOT NULL,
  referral_link_id uuid,
  target_type text NOT NULL,
  target_person_id uuid,
  target_organization_id uuid,
  referred_document text,
  referred_name text NOT NULL,
  referred_email text NOT NULL,
  referred_phone text NOT NULL,
  company_contact_person_id uuid,
  assigned_commercial_person_id uuid,
  assigned_region_id uuid,
  status text NOT NULL DEFAULT 'created',
  bitrix_entity_id text,
  bitrix_pipeline_id text,
  bitrix_stage_id text,
  bitrix_last_movement_at timestamptz,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  reward_credit_person_id uuid,
  reward_credit_organization_id uuid,
  reward_rule_id uuid,
  conversion_window_days integer NOT NULL DEFAULT 60,
  conversion_deadline_at timestamptz NOT NULL DEFAULT (now() + '60 days'::interval),
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  origin_team text,
  origin_context text,
  owner_role text
);

CREATE TABLE IF NOT EXISTS public.referral_events_v2 (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_id uuid NOT NULL,
  event_type text NOT NULL,
  previous_status text,
  new_status text,
  actor_person_id uuid,
  source_system text NOT NULL,
  source_payload jsonb NOT NULL DEFAULT '{}',
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.referral_claims (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_document text NOT NULL,
  target_type text NOT NULL,
  current_referral_id uuid,
  current_credit_person_id uuid,
  current_credit_organization_id uuid,
  claimed_at timestamptz NOT NULL DEFAULT now(),
  last_movement_at timestamptz,
  expires_at timestamptz,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Rewards
CREATE TABLE IF NOT EXISTS public.reward_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id uuid NOT NULL,
  target_type text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'BRL',
  trigger_status text NOT NULL,
  recipient_type text NOT NULL,
  conversion_window_days integer NOT NULL DEFAULT 60,
  invoice_required boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reward_ledger (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_id uuid NOT NULL,
  program_id uuid NOT NULL,
  recipient_person_id uuid,
  recipient_organization_id uuid,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'BRL',
  status text NOT NULL DEFAULT 'pending',
  payable_at timestamptz,
  paid_at timestamptz,
  invoice_required boolean NOT NULL DEFAULT false,
  invoice_status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Legacy profiles (usado pelo Amigo Indica)
CREATE TABLE IF NOT EXISTS public.legacy_profiles (
  id uuid NOT NULL PRIMARY KEY,
  full_name text NOT NULL,
  cpf text,
  email text NOT NULL,
  phone text,
  birth_date date,
  status public.user_status NOT NULL DEFAULT 'ativo',
  terms_accepted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  referrer_type public.referrer_type,
  institution_id uuid,
  institution_pending boolean NOT NULL DEFAULT false,
  turma_id uuid,
  city_ibge_id integer,
  verificado boolean NOT NULL DEFAULT false,
  codigo_ref text,
  profile_completed boolean NOT NULL DEFAULT false,
  works_at_company boolean,
  company_name text,
  can_influence_purchase text,
  main_objective text,
  main_objective_other text,
  avatar_url text,
  company_area text,
  company_area_other text,
  contact_role text,
  contact_role_other text,
  bitrix_entity_id text,
  bitrix_pipeline_id text,
  bitrix_stage_id text,
  bitrix_previous_stage_id text,
  bitrix_updated_time timestamptz,
  bitrix_sales_value numeric,
  bitrix_onboarding_value numeric,
  bitrix_entity_type text,
  bitrix_entity_type_id text,
  indicado_por uuid,
  profile_type text DEFAULT 'individual',
  document_cpf text,
  document_cnpj text,
  region_id uuid,
  is_active boolean NOT NULL DEFAULT true,
  is_verified boolean NOT NULL DEFAULT false,
  metadata jsonb DEFAULT '{}',
  area text,
  cargo text,
  elegivel_programa boolean NOT NULL DEFAULT true,
  course text,
  formation_cycle text,
  period text,
  institution text,
  graduation_date text,
  city text,
  state text,
  turma_vinculada_em timestamptz
);

CREATE TABLE IF NOT EXISTS public.legacy_user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  role_id uuid,
  granted_by uuid,
  granted_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.legacy_collaborator_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  employee_id text,
  department text,
  position text,
  hire_date date,
  points_balance integer NOT NULL DEFAULT 0,
  total_points integer NOT NULL DEFAULT 0,
  ranking_score numeric DEFAULT 0,
  manager_id uuid,
  metadata jsonb DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.legacy_programs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  label text NOT NULL,
  description text,
  audience_type text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  config jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.legacy_user_programs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  program_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'active',
  joined_at timestamptz NOT NULL DEFAULT now(),
  activated_at timestamptz,
  churned_at timestamptz,
  invited_by_user_id uuid,
  invited_by_type text,
  ref_token_used text,
  region_id uuid,
  commercial_id uuid,
  campaign_id uuid,
  metadata jsonb DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.legacy_manual_referrals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id uuid NOT NULL,
  submitted_by_user_id uuid NOT NULL,
  submitted_by_role text NOT NULL,
  referral_type text NOT NULL,
  referred_name text NOT NULL,
  referred_email text,
  referred_phone text,
  referred_document text,
  referred_company_name text,
  referred_company_segment text,
  referred_notes text,
  source_program_id uuid,
  destination_program_id uuid,
  commercial_id uuid,
  region_id uuid,
  campaign_id uuid,
  bitrix_lead_id text,
  bitrix_deal_id text,
  bitrix_contact_id text,
  status text NOT NULL DEFAULT 'submitted',
  status_reason text,
  revenue_amount numeric,
  reward_amount numeric,
  reviewed_by uuid,
  reviewed_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  referral_source text NOT NULL DEFAULT 'manual',
  referral_status_updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.legacy_manual_referral_events (
  id bigint NOT NULL DEFAULT nextval('manual_referral_events_id_seq') PRIMARY KEY,
  referral_id uuid NOT NULL,
  event_type text NOT NULL,
  previous_status text,
  new_status text,
  changed_by uuid,
  source text,
  notes text,
  event_data jsonb DEFAULT '{}',
  occurred_at timestamptz NOT NULL DEFAULT now()
);

-- Auth
CREATE TABLE IF NOT EXISTS public.auth_email_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  code_hash text NOT NULL,
  purpose text NOT NULL DEFAULT 'login',
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 5,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  requested_ip text,
  user_agent text,
  make_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.auth_email_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code_id uuid,
  email text,
  event_type text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.auth_email_dispatch_queue (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code_id uuid NOT NULL,
  email text NOT NULL,
  purpose text NOT NULL,
  provider text NOT NULL DEFAULT 'make',
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 3,
  last_error text,
  scheduled_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_impersonation_handoffs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token_hash text NOT NULL,
  operator_user_id uuid NOT NULL,
  operator_email text,
  target_user_id uuid NOT NULL,
  target_email text,
  target_program text NOT NULL,
  target_environment text,
  redirect_to text,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  consumer_ip text,
  consumer_user_agent text,
  consume_status text,
  consume_reason text,
  audit_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid NOT NULL,
  impersonated_user_id uuid NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'
);

-- Email system
CREATE TABLE IF NOT EXISTS public.email_send_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id text,
  template_name text NOT NULL,
  recipient_email text NOT NULL,
  status text NOT NULL,
  error_message text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_send_state (
  id integer NOT NULL DEFAULT 1 PRIMARY KEY,
  retry_after_until timestamptz,
  batch_size integer NOT NULL DEFAULT 10,
  send_delay_ms integer NOT NULL DEFAULT 200,
  auth_email_ttl_minutes integer NOT NULL DEFAULT 15,
  transactional_email_ttl_minutes integer NOT NULL DEFAULT 60,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.suppressed_emails (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  reason text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_unsubscribe_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token text NOT NULL,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  used_at timestamptz
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  read boolean NOT NULL DEFAULT false,
  important boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  event_type text,
  audience text NOT NULL DEFAULT 'user',
  metadata jsonb NOT NULL DEFAULT '{}',
  event_key text
);

CREATE TABLE IF NOT EXISTS public.pulse_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  action_url text,
  is_read boolean NOT NULL DEFAULT false,
  is_sent boolean NOT NULL DEFAULT false,
  sent_via text[],
  reference_type text,
  reference_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz
);

-- App settings & modules
CREATE TABLE IF NOT EXISTS public.app_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS public.pulse_modules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  label text NOT NULL,
  icon text,
  path text,
  allowed_roles text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer DEFAULT 0,
  parent_id uuid,
  metadata jsonb DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.pulse_user_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  default_region uuid,
  default_program uuid,
  sidebar_collapsed boolean DEFAULT false,
  notifications_enabled boolean DEFAULT true,
  dashboard_widgets jsonb DEFAULT '[]',
  table_configs jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Business segments & contact roles
CREATE TABLE IF NOT EXISTS public.business_segments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  is_other boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  is_other boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Club Amigo
CREATE TABLE IF NOT EXISTS public.club_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text NOT NULL,
  cnpj text NOT NULL,
  segment text NOT NULL,
  contact_full_name text NOT NULL,
  contact_role text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  status text NOT NULL DEFAULT 'inscricao_recebida',
  status_reason text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  partner_profile_id uuid,
  club_member_id uuid,
  tracking_token text NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  tracking_token_expires_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  cpf text,
  cpf_digits text,
  cnpj_digits text,
  phone_digits text,
  business_segment_id uuid,
  business_segment_other text,
  contact_role_id uuid,
  contact_role_other text,
  state_id integer,
  city_id integer,
  bitrix_stage text,
  bitrix_deal_id text,
  assigned_to uuid,
  notes text,
  last_contact_at timestamptz,
  approved_at timestamptz,
  rejected_at timestamptz,
  onboarding_started_at timestamptz,
  became_partner_at timestamptz,
  activated_at timestamptz,
  source text DEFAULT 'inscricao_publica',
  revenue_generated numeric DEFAULT 0,
  pipeline_status public.partner_pipeline_status NOT NULL DEFAULT 'inscricao_recebida',
  referral_link_id uuid,
  qualified_at timestamptz,
  contract_signed_at timestamptz,
  origin text,
  bitrix_entity_type text,
  bitrix_entity_type_id integer,
  bitrix_entity_id text,
  bitrix_title text,
  bitrix_pipeline_id text,
  bitrix_stage_id text,
  bitrix_synced_at timestamptz,
  bitrix_sync_status text,
  bitrix_sync_payload jsonb,
  cnpj_public_data jsonb,
  cnpj_status text,
  cnpj_status_description text,
  cnpj_legal_name text,
  cnpj_trade_name text,
  cnpj_main_cnae text,
  cnpj_main_cnae_description text,
  cnpj_legal_nature text,
  cnpj_company_size text,
  cnpj_opening_date date,
  cnpj_address jsonb,
  cnpj_qsa jsonb,
  cnpj_last_refreshed_at timestamptz,
  cnpj_last_refresh_status text,
  cnpj_last_refresh_error text,
  cnpj_status_code text,
  responsible_city text,
  responsible_state text
);

CREATE TABLE IF NOT EXISTS public.club_application_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid NOT NULL,
  event_type text NOT NULL,
  from_value text,
  to_value text,
  note text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.club_membros (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id uuid NOT NULL,
  user_id uuid NOT NULL,
  nome text NOT NULL,
  email text NOT NULL,
  telefone text,
  cargo text,
  is_admin boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'ativo',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.club_convites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id uuid NOT NULL,
  convidado_por uuid,
  email text NOT NULL,
  token text NOT NULL DEFAULT (gen_random_uuid())::text,
  status text NOT NULL DEFAULT 'pendente',
  expires_at timestamptz NOT NULL DEFAULT (now() + '7 days'::interval),
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}',
  nome text,
  cpf text,
  telefone text,
  cargo text,
  resent_at timestamptz,
  resent_by uuid,
  resend_count integer NOT NULL DEFAULT 0,
  last_resend_status text,
  last_resend_error text,
  cargo_role_id uuid,
  cargo_outro text,
  accepted_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.club_atividades (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id uuid NOT NULL,
  membro_id uuid,
  tipo text NOT NULL,
  descricao text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.club_webhook_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  source text NOT NULL DEFAULT 'amigo_club',
  target text NOT NULL DEFAULT 'bitrix',
  membership_id uuid,
  person_id uuid,
  organization_id uuid,
  payload jsonb NOT NULL,
  response_status integer,
  response_body jsonb,
  status text NOT NULL,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Premia
CREATE TABLE IF NOT EXISTS public.premia_indicator_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  cpf_digits text NOT NULL,
  email text NOT NULL,
  phone_digits text NOT NULL,
  indicator_profile text,
  indicator_profile_other text,
  referral_link_id uuid,
  owner_person_id uuid,
  program_id uuid,
  person_id uuid,
  membership_id uuid,
  status text NOT NULL DEFAULT 'pending',
  source text NOT NULL DEFAULT 'invite_public',
  invite_token text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_healthcare_eligible boolean
);

CREATE TABLE IF NOT EXISTS public.premia_indicator_application_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid NOT NULL,
  event_type text NOT NULL,
  note text,
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.premia_webhook_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name text NOT NULL,
  referral_id uuid NOT NULL,
  target text NOT NULL,
  payload jsonb NOT NULL,
  request_id bigint,
  status text NOT NULL DEFAULT 'sent',
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.premia_webhook_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  webhook_url text NOT NULL,
  webhook_purpose text NOT NULL,
  person_id uuid,
  auth_user_id uuid,
  membership_id uuid,
  application_id uuid,
  payload jsonb NOT NULL,
  response_status integer,
  response_body text,
  error text,
  attempts integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  last_attempt_at timestamptz
);

-- Proposals
CREATE TABLE IF NOT EXISTS public.proposals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_company_name text NOT NULL,
  client_responsible_name text,
  client_email text,
  client_phone text,
  client_cnpj text,
  client_city text,
  client_state text,
  client_segment text,
  title text NOT NULL,
  executive_name text,
  executive_role text,
  proposal_month text,
  valid_until date,
  general_conditions text,
  internal_notes text,
  status text NOT NULL DEFAULT 'rascunho',
  slug text NOT NULL,
  public_url text,
  is_public boolean NOT NULL DEFAULT false,
  expires_public_access boolean NOT NULL DEFAULT true,
  monthly_total_without_discount numeric NOT NULL DEFAULT 0,
  monthly_total_final numeric NOT NULL DEFAULT 0,
  implantation_total_without_discount numeric NOT NULL DEFAULT 0,
  implantation_total_final numeric NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.proposal_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id uuid NOT NULL,
  product_name text NOT NULL,
  product_description text,
  users_total integer,
  users_composition text,
  monthly_price_without_discount numeric NOT NULL DEFAULT 0,
  discount_amount numeric NOT NULL DEFAULT 0,
  monthly_price_final numeric NOT NULL DEFAULT 0,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.proposal_implantation (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id uuid NOT NULL,
  users_total integer,
  implantation_price_without_discount numeric NOT NULL DEFAULT 0,
  implantation_discount_amount numeric NOT NULL DEFAULT 0,
  implantation_price_final numeric NOT NULL DEFAULT 0,
  installment_conditions text,
  specific_conditions text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.proposal_variable_charges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id uuid NOT NULL,
  charge_name text NOT NULL,
  unit_price numeric NOT NULL DEFAULT 0,
  unit_label text,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.proposal_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id uuid NOT NULL,
  event_type text NOT NULL,
  event_metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Instituições médicas
CREATE TABLE IF NOT EXISTS public.instituicoes_medicas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  cidade text,
  uf text,
  tipo public.institution_type NOT NULL DEFAULT 'desconhecida',
  ativa boolean NOT NULL DEFAULT true,
  observacoes text,
  criada_por_admin uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  sigla text
);

CREATE TABLE IF NOT EXISTS public.campi (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instituicao_id uuid NOT NULL,
  nome_campus text NOT NULL,
  cidade text,
  uf text,
  ativo boolean NOT NULL DEFAULT true,
  is_sede boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cursos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instituicao_id uuid NOT NULL,
  campus_id uuid,
  nome_curso text NOT NULL DEFAULT 'Medicina',
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Turmas
CREATE TABLE IF NOT EXISTS public.turmas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instituicao_id uuid NOT NULL,
  curso text NOT NULL DEFAULT 'Medicina',
  nome text NOT NULL,
  data_colacao_grau date NOT NULL,
  ciclo_formacao public.formation_cycle_enum NOT NULL,
  semestre smallint,
  tamanho_estimado integer NOT NULL DEFAULT 0,
  status public.turma_status NOT NULL DEFAULT 'ativa',
  meta_indicacoes integer NOT NULL DEFAULT 0,
  meta_conversoes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  metas_overridden boolean NOT NULL DEFAULT false,
  data_inicio date NOT NULL DEFAULT CURRENT_DATE,
  campus_id uuid,
  curso_id uuid,
  consultor_comercial_id uuid,
  pulse_status text DEFAULT 'active',
  region_id uuid,
  commercial_id uuid,
  campaign_id uuid,
  graduation_party_date date,
  welcome_meeting_date date,
  estimated_members integer,
  active_members integer DEFAULT 0,
  converted_members integer DEFAULT 0,
  conversion_rate numeric DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  notes text,
  metadata jsonb DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.representantes_turma (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  turma_id uuid NOT NULL,
  status public.rep_status NOT NULL DEFAULT 'ativo',
  data_inicio date NOT NULL DEFAULT CURRENT_DATE,
  data_fim date,
  meta_indicacoes integer NOT NULL DEFAULT 0,
  meta_conversoes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean DEFAULT true,
  partner_profile_id uuid,
  notes text,
  onboarded_at timestamptz
);

-- Campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  prizes jsonb NOT NULL DEFAULT '[]',
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  owner_id uuid,
  goal_signups integer,
  goal_activations integer,
  goal_conversions integer,
  commercial_id uuid,
  program_id uuid,
  region_id uuid,
  slug text,
  type text,
  status text DEFAULT 'draft',
  budget numeric,
  metadata jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),
  city text,
  state text,
  campaign_origin_type text,
  campaign_promoter_type text,
  campaign_promoter_id uuid,
  owner_person_id uuid,
  commercial_person_id uuid
);

CREATE TABLE IF NOT EXISTS public.campaign_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid NOT NULL,
  program text NOT NULL,
  token text NOT NULL,
  full_url text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  clicks_count integer NOT NULL DEFAULT 0,
  signups_count integer NOT NULL DEFAULT 0,
  referrals_count integer NOT NULL DEFAULT 0,
  source text,
  medium text,
  campaign text,
  content text,
  created_at timestamptz NOT NULL DEFAULT now(),
  disabled_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.campaign_link_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_link_id uuid NOT NULL,
  event_type text NOT NULL,
  ip text,
  user_agent text,
  referrer text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Misc
CREATE TABLE IF NOT EXISTS public.account_manager_teams (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  director_person_id uuid NOT NULL,
  manager_person_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_stage_mappings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider text NOT NULL DEFAULT 'bitrix',
  pipeline_id text NOT NULL,
  stage_id text NOT NULL,
  stage_name text,
  internal_status text NOT NULL,
  counts_as_conversion boolean NOT NULL DEFAULT false,
  counts_as_reward_eligible boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_entities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider text NOT NULL DEFAULT 'bitrix',
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  local_referral_id uuid,
  local_entity_type text,
  local_entity_id uuid,
  pipeline_id text,
  pipeline_name text,
  stage_id text,
  stage_name text,
  stage_semantics text,
  assigned_by_id text,
  sales_value numeric,
  onboarding_value numeric,
  last_movement_at timestamptz,
  raw_payload jsonb NOT NULL DEFAULT '{}',
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_sync_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider text NOT NULL DEFAULT 'bitrix',
  direction text NOT NULL,
  local_referral_id uuid,
  external_entity_id text,
  status text NOT NULL,
  message text,
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------
-- 5. SEED DATA ESSENCIAL (para o Amigo Indica funcionar)
-- ---------------------------------------------------------------

-- Email send state (singleton)
INSERT INTO public.email_send_state (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Programa Indica
INSERT INTO public.legacy_programs (name, label, audience_type)
VALUES ('indica', 'Amigo Indica', 'collaborator')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------
-- 6. RLS (habilitar em todas as tabelas)
-- ---------------------------------------------------------------
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_collaborator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_user_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_manual_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_email_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_email_dispatch_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pulse_access_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de leitura para usuários autenticados
CREATE POLICY "Autenticados podem ler programas" ON public.legacy_programs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Autenticados podem ler regioes" ON public.regions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuário lê próprio perfil" ON public.legacy_profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Usuário lê próprias roles" ON public.legacy_user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Usuário lê próprio colaborador" ON public.legacy_collaborator_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Usuário lê próprios programas" ON public.legacy_user_programs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Usuário lê próprias indicações" ON public.legacy_manual_referrals
  FOR SELECT TO authenticated USING (auth.uid() = submitted_by_user_id);

CREATE POLICY "Usuário insere próprias indicações" ON public.legacy_manual_referrals
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = submitted_by_user_id);

CREATE POLICY "Usuário lê próprias notificações" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
