export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      access_audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          id: string
          metadata: Json
          reason: string | null
          target_email: string | null
          target_user_id: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          reason?: string | null
          target_email?: string | null
          target_user_id?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          reason?: string | null
          target_email?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      access_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          assigned_role: string | null
          created_at: string
          decided_at: string | null
          decided_by: string | null
          email: string
          id: string
          internal_reason: string | null
          last_magic_link_at: string | null
          rejection_reason: string | null
          requested_at: string
          requested_from: string | null
          source: string
          status: Database["public"]["Enums"]["access_status"]
          updated_at: string
          user_id: string | null
          user_message: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          assigned_role?: string | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          email: string
          id?: string
          internal_reason?: string | null
          last_magic_link_at?: string | null
          rejection_reason?: string | null
          requested_at?: string
          requested_from?: string | null
          source?: string
          status?: Database["public"]["Enums"]["access_status"]
          updated_at?: string
          user_id?: string | null
          user_message?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          assigned_role?: string | null
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          email?: string
          id?: string
          internal_reason?: string | null
          last_magic_link_at?: string | null
          rejection_reason?: string | null
          requested_at?: string
          requested_from?: string | null
          source?: string
          status?: Database["public"]["Enums"]["access_status"]
          updated_at?: string
          user_id?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      admin_audit_logs: {
        Row: {
          admin_id: string
          created_at: string
          ended_at: string | null
          id: string
          impersonated_user_id: string
          ip_address: string | null
          metadata: Json
          started_at: string
          user_agent: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string
          ended_at?: string | null
          id?: string
          impersonated_user_id: string
          ip_address?: string | null
          metadata?: Json
          started_at?: string
          user_agent?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string
          ended_at?: string | null
          id?: string
          impersonated_user_id?: string
          ip_address?: string | null
          metadata?: Json
          started_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      attribution_events: {
        Row: {
          attributed_revenue: number | null
          attributed_to: string | null
          event_type: string
          id: number
          link_id: string | null
          model_credit: number | null
          occurred_at: string
          program_id: string
          touch_number: number
          touch_type: string
          user_id: string
        }
        Insert: {
          attributed_revenue?: number | null
          attributed_to?: string | null
          event_type: string
          id?: number
          link_id?: string | null
          model_credit?: number | null
          occurred_at?: string
          program_id: string
          touch_number?: number
          touch_type: string
          user_id: string
        }
        Update: {
          attributed_revenue?: number | null
          attributed_to?: string | null
          event_type?: string
          id?: number
          link_id?: string | null
          model_credit?: number | null
          occurred_at?: string
          program_id?: string
          touch_number?: number
          touch_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attribution_events_attributed_to_fkey"
            columns: ["attributed_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attribution_events_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "referral_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attribution_events_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "v_my_referral_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attribution_events_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attribution_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bonuses: {
        Row: {
          amount: number
          created_at: string
          id: string
          referral_id: string
          released_at: string | null
          status: Database["public"]["Enums"]["bonus_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          referral_id: string
          released_at?: string | null
          status?: Database["public"]["Enums"]["bonus_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          referral_id?: string
          released_at?: string | null
          status?: Database["public"]["Enums"]["bonus_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bonuses_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      brazil_cities: {
        Row: {
          ibge_code: number | null
          id: number
          is_active: boolean
          name: string
          state_id: number
        }
        Insert: {
          ibge_code?: number | null
          id: number
          is_active?: boolean
          name: string
          state_id: number
        }
        Update: {
          ibge_code?: number | null
          id?: number
          is_active?: boolean
          name?: string
          state_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "brazil_cities_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "brazil_states"
            referencedColumns: ["id"]
          },
        ]
      }
      brazil_states: {
        Row: {
          id: number
          is_active: boolean
          name: string
          region: string | null
          uf: string
        }
        Insert: {
          id: number
          is_active?: boolean
          name: string
          region?: string | null
          uf: string
        }
        Update: {
          id?: number
          is_active?: boolean
          name?: string
          region?: string | null
          uf?: string
        }
        Relationships: []
      }
      business_segments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_other: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_other?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_other?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          active: boolean
          budget: number | null
          commercial_id: string | null
          created_at: string
          description: string | null
          ends_at: string
          goal_activations: number | null
          goal_conversions: number | null
          goal_signups: number | null
          id: string
          metadata: Json | null
          owner_id: string | null
          prizes: Json
          program_id: string | null
          region_id: string | null
          slug: string | null
          starts_at: string
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          budget?: number | null
          commercial_id?: string | null
          created_at?: string
          description?: string | null
          ends_at: string
          goal_activations?: number | null
          goal_conversions?: number | null
          goal_signups?: number | null
          id?: string
          metadata?: Json | null
          owner_id?: string | null
          prizes?: Json
          program_id?: string | null
          region_id?: string | null
          slug?: string | null
          starts_at: string
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          budget?: number | null
          commercial_id?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string
          goal_activations?: number | null
          goal_conversions?: number | null
          goal_signups?: number | null
          id?: string
          metadata?: Json | null
          owner_id?: string | null
          prizes?: Json
          program_id?: string | null
          region_id?: string | null
          slug?: string | null
          starts_at?: string
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      campi: {
        Row: {
          ativo: boolean
          cidade: string | null
          created_at: string
          id: string
          instituicao_id: string
          is_sede: boolean
          nome_campus: string
          uf: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cidade?: string | null
          created_at?: string
          id?: string
          instituicao_id: string
          is_sede?: boolean
          nome_campus: string
          uf?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cidade?: string | null
          created_at?: string
          id?: string
          instituicao_id?: string
          is_sede?: boolean
          nome_campus?: string
          uf?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campi_instituicao_id_fkey"
            columns: ["instituicao_id"]
            isOneToOne: false
            referencedRelation: "instituicoes_medicas"
            referencedColumns: ["id"]
          },
        ]
      }
      class_goals: {
        Row: {
          created_at: string
          created_by: string | null
          current_value: number
          goal_type: string
          id: string
          is_active: boolean
          period_end: string | null
          period_start: string | null
          target_value: number
          turma_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_value?: number
          goal_type: string
          id?: string
          is_active?: boolean
          period_end?: string | null
          period_start?: string | null
          target_value: number
          turma_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_value?: number
          goal_type?: string
          id?: string
          is_active?: boolean
          period_end?: string | null
          period_start?: string | null
          target_value?: number
          turma_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_goals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_goals_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_goals_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "v_turma_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      club_application_events: {
        Row: {
          application_id: string
          created_at: string
          created_by: string | null
          event_type: string
          from_value: string | null
          id: string
          note: string | null
          to_value: string | null
        }
        Insert: {
          application_id: string
          created_at?: string
          created_by?: string | null
          event_type: string
          from_value?: string | null
          id?: string
          note?: string | null
          to_value?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string
          created_by?: string | null
          event_type?: string
          from_value?: string | null
          id?: string
          note?: string | null
          to_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_application_events_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "club_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      club_applications: {
        Row: {
          activated_at: string | null
          approved_at: string | null
          assigned_to: string | null
          became_partner_at: string | null
          bitrix_deal_id: string | null
          bitrix_stage: string | null
          business_segment_id: string | null
          business_segment_other: string | null
          city: string
          city_id: number | null
          club_member_id: string | null
          cnpj: string
          cnpj_digits: string | null
          company_name: string
          contact_email: string
          contact_full_name: string
          contact_phone: string
          contact_role: string
          contact_role_id: string | null
          contact_role_other: string | null
          cpf: string | null
          cpf_digits: string | null
          created_at: string
          id: string
          last_contact_at: string | null
          metadata: Json
          notes: string | null
          onboarding_started_at: string | null
          partner_profile_id: string | null
          phone_digits: string | null
          pipeline_status: Database["public"]["Enums"]["partner_pipeline_status"]
          rejected_at: string | null
          revenue_generated: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          segment: string
          source: string | null
          state: string
          state_id: number | null
          status: string
          status_reason: string | null
          tracking_token: string
          tracking_token_expires_at: string | null
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          approved_at?: string | null
          assigned_to?: string | null
          became_partner_at?: string | null
          bitrix_deal_id?: string | null
          bitrix_stage?: string | null
          business_segment_id?: string | null
          business_segment_other?: string | null
          city: string
          city_id?: number | null
          club_member_id?: string | null
          cnpj: string
          cnpj_digits?: string | null
          company_name: string
          contact_email: string
          contact_full_name: string
          contact_phone: string
          contact_role: string
          contact_role_id?: string | null
          contact_role_other?: string | null
          cpf?: string | null
          cpf_digits?: string | null
          created_at?: string
          id?: string
          last_contact_at?: string | null
          metadata?: Json
          notes?: string | null
          onboarding_started_at?: string | null
          partner_profile_id?: string | null
          phone_digits?: string | null
          pipeline_status?: Database["public"]["Enums"]["partner_pipeline_status"]
          rejected_at?: string | null
          revenue_generated?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          segment: string
          source?: string | null
          state: string
          state_id?: number | null
          status?: string
          status_reason?: string | null
          tracking_token?: string
          tracking_token_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          approved_at?: string | null
          assigned_to?: string | null
          became_partner_at?: string | null
          bitrix_deal_id?: string | null
          bitrix_stage?: string | null
          business_segment_id?: string | null
          business_segment_other?: string | null
          city?: string
          city_id?: number | null
          club_member_id?: string | null
          cnpj?: string
          cnpj_digits?: string | null
          company_name?: string
          contact_email?: string
          contact_full_name?: string
          contact_phone?: string
          contact_role?: string
          contact_role_id?: string | null
          contact_role_other?: string | null
          cpf?: string | null
          cpf_digits?: string | null
          created_at?: string
          id?: string
          last_contact_at?: string | null
          metadata?: Json
          notes?: string | null
          onboarding_started_at?: string | null
          partner_profile_id?: string | null
          phone_digits?: string | null
          pipeline_status?: Database["public"]["Enums"]["partner_pipeline_status"]
          rejected_at?: string | null
          revenue_generated?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          segment?: string
          source?: string | null
          state?: string
          state_id?: number | null
          status?: string
          status_reason?: string | null
          tracking_token?: string
          tracking_token_expires_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_applications_business_segment_id_fkey"
            columns: ["business_segment_id"]
            isOneToOne: false
            referencedRelation: "business_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_applications_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "brazil_cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_applications_club_member_id_fkey"
            columns: ["club_member_id"]
            isOneToOne: false
            referencedRelation: "club_membros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_applications_contact_role_id_fkey"
            columns: ["contact_role_id"]
            isOneToOne: false
            referencedRelation: "contact_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_applications_partner_profile_id_fkey"
            columns: ["partner_profile_id"]
            isOneToOne: false
            referencedRelation: "club_ranking"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "club_applications_partner_profile_id_fkey"
            columns: ["partner_profile_id"]
            isOneToOne: false
            referencedRelation: "partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_applications_partner_profile_id_fkey"
            columns: ["partner_profile_id"]
            isOneToOne: false
            referencedRelation: "v_partner_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_applications_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "brazil_states"
            referencedColumns: ["id"]
          },
        ]
      }
      club_atividades: {
        Row: {
          created_at: string
          descricao: string
          empresa_id: string
          id: string
          membro_id: string | null
          metadata: Json | null
          tipo: string
        }
        Insert: {
          created_at?: string
          descricao: string
          empresa_id: string
          id?: string
          membro_id?: string | null
          metadata?: Json | null
          tipo: string
        }
        Update: {
          created_at?: string
          descricao?: string
          empresa_id?: string
          id?: string
          membro_id?: string | null
          metadata?: Json | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_atividades_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "club_ranking"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "club_atividades_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_atividades_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "v_partner_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_atividades_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "club_membros"
            referencedColumns: ["id"]
          },
        ]
      }
      club_convites: {
        Row: {
          convidado_por: string | null
          created_at: string
          email: string
          empresa_id: string
          expires_at: string
          id: string
          status: string
          token: string
        }
        Insert: {
          convidado_por?: string | null
          created_at?: string
          email: string
          empresa_id: string
          expires_at?: string
          id?: string
          status?: string
          token?: string
        }
        Update: {
          convidado_por?: string | null
          created_at?: string
          email?: string
          empresa_id?: string
          expires_at?: string
          id?: string
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_convites_convidado_por_fkey"
            columns: ["convidado_por"]
            isOneToOne: false
            referencedRelation: "club_membros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_convites_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "club_ranking"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "club_convites_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_convites_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "v_partner_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      club_membros: {
        Row: {
          cargo: string | null
          created_at: string
          email: string
          empresa_id: string
          id: string
          is_admin: boolean
          nome: string
          status: string
          telefone: string | null
          user_id: string
        }
        Insert: {
          cargo?: string | null
          created_at?: string
          email: string
          empresa_id: string
          id?: string
          is_admin?: boolean
          nome: string
          status?: string
          telefone?: string | null
          user_id: string
        }
        Update: {
          cargo?: string | null
          created_at?: string
          email?: string
          empresa_id?: string
          id?: string
          is_admin?: boolean
          nome?: string
          status?: string
          telefone?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_membros_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "club_ranking"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "club_membros_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_membros_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "v_partner_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      collaborator_profiles: {
        Row: {
          department: string | null
          employee_id: string | null
          hire_date: string | null
          id: string
          manager_id: string | null
          metadata: Json | null
          points_balance: number
          position: string | null
          ranking_score: number | null
          total_points: number
          user_id: string
        }
        Insert: {
          department?: string | null
          employee_id?: string | null
          hire_date?: string | null
          id?: string
          manager_id?: string | null
          metadata?: Json | null
          points_balance?: number
          position?: string | null
          ranking_score?: number | null
          total_points?: number
          user_id: string
        }
        Update: {
          department?: string | null
          employee_id?: string | null
          hire_date?: string | null
          id?: string
          manager_id?: string | null
          metadata?: Json | null
          points_balance?: number
          position?: string | null
          ranking_score?: number | null
          total_points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborator_profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborator_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_other: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_other?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_other?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      cursos: {
        Row: {
          ativo: boolean
          campus_id: string | null
          created_at: string
          id: string
          instituicao_id: string
          nome_curso: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          campus_id?: string | null
          created_at?: string
          id?: string
          instituicao_id: string
          nome_curso?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          campus_id?: string | null
          created_at?: string
          id?: string
          instituicao_id?: string
          nome_curso?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cursos_campus_id_fkey"
            columns: ["campus_id"]
            isOneToOne: false
            referencedRelation: "campi"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cursos_instituicao_id_fkey"
            columns: ["instituicao_id"]
            isOneToOne: false
            referencedRelation: "instituicoes_medicas"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      employee_profiles: {
        Row: {
          corporate_email: string
          created_at: string
          department: string | null
          id: string
          is_active: boolean
          metadata: Json
          person_id: string
          position: string | null
          region_id: string | null
          updated_at: string
          validated_at: string | null
          validated_by_person_id: string | null
        }
        Insert: {
          corporate_email: string
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          person_id: string
          position?: string | null
          region_id?: string | null
          updated_at?: string
          validated_at?: string | null
          validated_by_person_id?: string | null
        }
        Update: {
          corporate_email?: string
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          person_id?: string
          position?: string | null
          region_id?: string | null
          updated_at?: string
          validated_at?: string | null
          validated_by_person_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_profiles_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: true
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_profiles_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_profiles_validated_by_person_id_fkey"
            columns: ["validated_by_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          consultor_id: string
          created_at: string
          done: boolean
          done_at: string | null
          due_date: string
          id: string
          notes: string | null
          titulo: string
          turma_id: string | null
          updated_at: string
        }
        Insert: {
          consultor_id: string
          created_at?: string
          done?: boolean
          done_at?: string | null
          due_date: string
          id?: string
          notes?: string | null
          titulo: string
          turma_id?: string | null
          updated_at?: string
        }
        Update: {
          consultor_id?: string
          created_at?: string
          done?: boolean
          done_at?: string | null
          due_date?: string
          id?: string
          notes?: string | null
          titulo?: string
          turma_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_ups_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "v_turma_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      google_oauth_tokens: {
        Row: {
          access_token: string | null
          created_at: string
          google_email: string | null
          id: string
          refresh_token: string
          scope: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          google_email?: string | null
          id?: string
          refresh_token: string
          scope?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          google_email?: string | null
          id?: string
          refresh_token?: string
          scope?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      historico_reunioes: {
        Row: {
          acao: string
          created_at: string
          detalhes_json: Json
          id: string
          reuniao_id: string
          usuario_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string
          detalhes_json?: Json
          id?: string
          reuniao_id: string
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string
          detalhes_json?: Json
          id?: string
          reuniao_id?: string
          usuario_id?: string | null
        }
        Relationships: []
      }
      historico_turmas: {
        Row: {
          acao: string
          campo: string | null
          created_at: string
          detalhes: Json
          id: string
          turma_id: string
          usuario_id: string | null
          valor_anterior: string | null
          valor_novo: string | null
        }
        Insert: {
          acao?: string
          campo?: string | null
          created_at?: string
          detalhes?: Json
          id?: string
          turma_id: string
          usuario_id?: string | null
          valor_anterior?: string | null
          valor_novo?: string | null
        }
        Update: {
          acao?: string
          campo?: string | null
          created_at?: string
          detalhes?: Json
          id?: string
          turma_id?: string
          usuario_id?: string | null
          valor_anterior?: string | null
          valor_novo?: string | null
        }
        Relationships: []
      }
      instituicoes_medicas: {
        Row: {
          ativa: boolean
          cidade: string | null
          created_at: string
          criada_por_admin: string | null
          id: string
          nome: string
          observacoes: string | null
          sigla: string | null
          tipo: Database["public"]["Enums"]["institution_type"]
          uf: string | null
          updated_at: string
        }
        Insert: {
          ativa?: boolean
          cidade?: string | null
          created_at?: string
          criada_por_admin?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          sigla?: string | null
          tipo?: Database["public"]["Enums"]["institution_type"]
          uf?: string | null
          updated_at?: string
        }
        Update: {
          ativa?: boolean
          cidade?: string | null
          created_at?: string
          criada_por_admin?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          sigla?: string | null
          tipo?: Database["public"]["Enums"]["institution_type"]
          uf?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      internal_profiles: {
        Row: {
          department: string | null
          employee_id: string | null
          id: string
          manager_id: string | null
          metadata: Json | null
          position: string | null
          region_id: string | null
          team: string | null
          user_id: string
        }
        Insert: {
          department?: string | null
          employee_id?: string | null
          id?: string
          manager_id?: string | null
          metadata?: Json | null
          position?: string | null
          region_id?: string | null
          team?: string | null
          user_id: string
        }
        Update: {
          department?: string | null
          employee_id?: string | null
          id?: string
          manager_id?: string | null
          metadata?: Json | null
          position?: string | null
          region_id?: string | null
          team?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "internal_profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_profiles_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      link_clicks: {
        Row: {
          clicked_at: string
          device_type: string | null
          geo_city: string | null
          geo_country: string | null
          geo_state: string | null
          id: number
          ip_hash: string | null
          link_id: string
          ref_token: string
          referrer_url: string | null
          session_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          clicked_at?: string
          device_type?: string | null
          geo_city?: string | null
          geo_country?: string | null
          geo_state?: string | null
          id?: number
          ip_hash?: string | null
          link_id: string
          ref_token: string
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          clicked_at?: string
          device_type?: string | null
          geo_city?: string | null
          geo_country?: string | null
          geo_state?: string | null
          id?: number
          ip_hash?: string | null
          link_id?: string
          ref_token?: string
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "link_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "referral_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "link_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "v_my_referral_links"
            referencedColumns: ["id"]
          },
        ]
      }
      luma_webhook_log: {
        Row: {
          created_at: string
          error: string | null
          evento: string | null
          id: string
          payload: Json
          processed: boolean
          reuniao_id: string | null
        }
        Insert: {
          created_at?: string
          error?: string | null
          evento?: string | null
          id?: string
          payload?: Json
          processed?: boolean
          reuniao_id?: string | null
        }
        Update: {
          created_at?: string
          error?: string | null
          evento?: string | null
          id?: string
          payload?: Json
          processed?: boolean
          reuniao_id?: string | null
        }
        Relationships: []
      }
      manual_referral_events: {
        Row: {
          changed_by: string | null
          event_data: Json | null
          event_type: string
          id: number
          new_status: string | null
          notes: string | null
          occurred_at: string
          previous_status: string | null
          referral_id: string
          source: string | null
        }
        Insert: {
          changed_by?: string | null
          event_data?: Json | null
          event_type: string
          id?: number
          new_status?: string | null
          notes?: string | null
          occurred_at?: string
          previous_status?: string | null
          referral_id: string
          source?: string | null
        }
        Update: {
          changed_by?: string | null
          event_data?: Json | null
          event_type?: string
          id?: number
          new_status?: string | null
          notes?: string | null
          occurred_at?: string
          previous_status?: string | null
          referral_id?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manual_referral_events_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_referral_events_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "manual_referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      manual_referrals: {
        Row: {
          bitrix_contact_id: string | null
          bitrix_deal_id: string | null
          bitrix_lead_id: string | null
          campaign_id: string | null
          commercial_id: string | null
          created_at: string
          destination_program_id: string | null
          id: string
          metadata: Json | null
          program_id: string
          referral_source: string
          referral_status_updated_at: string | null
          referral_type: string
          referred_company_name: string | null
          referred_company_segment: string | null
          referred_document: string | null
          referred_email: string | null
          referred_name: string
          referred_notes: string | null
          referred_phone: string | null
          region_id: string | null
          revenue_amount: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          reward_amount: number | null
          source_program_id: string | null
          status: string
          status_reason: string | null
          submitted_by_role: string
          submitted_by_user_id: string
          updated_at: string
        }
        Insert: {
          bitrix_contact_id?: string | null
          bitrix_deal_id?: string | null
          bitrix_lead_id?: string | null
          campaign_id?: string | null
          commercial_id?: string | null
          created_at?: string
          destination_program_id?: string | null
          id?: string
          metadata?: Json | null
          program_id: string
          referral_source?: string
          referral_status_updated_at?: string | null
          referral_type: string
          referred_company_name?: string | null
          referred_company_segment?: string | null
          referred_document?: string | null
          referred_email?: string | null
          referred_name: string
          referred_notes?: string | null
          referred_phone?: string | null
          region_id?: string | null
          revenue_amount?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reward_amount?: number | null
          source_program_id?: string | null
          status?: string
          status_reason?: string | null
          submitted_by_role: string
          submitted_by_user_id: string
          updated_at?: string
        }
        Update: {
          bitrix_contact_id?: string | null
          bitrix_deal_id?: string | null
          bitrix_lead_id?: string | null
          campaign_id?: string | null
          commercial_id?: string | null
          created_at?: string
          destination_program_id?: string | null
          id?: string
          metadata?: Json | null
          program_id?: string
          referral_source?: string
          referral_status_updated_at?: string | null
          referral_type?: string
          referred_company_name?: string | null
          referred_company_segment?: string | null
          referred_document?: string | null
          referred_email?: string | null
          referred_name?: string
          referred_notes?: string | null
          referred_phone?: string | null
          region_id?: string | null
          revenue_amount?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reward_amount?: number | null
          source_program_id?: string | null
          status?: string
          status_reason?: string | null
          submitted_by_role?: string
          submitted_by_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "manual_referrals_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_referrals_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_referrals_destination_program_id_fkey"
            columns: ["destination_program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_referrals_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_referrals_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_referrals_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_referrals_source_program_id_fkey"
            columns: ["source_program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_referrals_submitted_by_user_id_fkey"
            columns: ["submitted_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          audience: string
          created_at: string
          event_type: string | null
          id: string
          important: boolean
          link: string | null
          message: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          audience?: string
          created_at?: string
          event_type?: string | null
          id?: string
          important?: boolean
          link?: string | null
          message: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          audience?: string
          created_at?: string
          event_type?: string | null
          id?: string
          important?: boolean
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          invited_by_person_id: string | null
          joined_at: string
          organization_id: string
          person_id: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          invited_by_person_id?: string | null
          joined_at?: string
          organization_id: string
          person_id: string
          role: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          invited_by_person_id?: string | null
          joined_at?: string
          organization_id?: string
          person_id?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_invited_by_person_id_fkey"
            columns: ["invited_by_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          city_id: number | null
          cnpj: string
          created_at: string
          id: string
          legal_name: string
          metadata: Json
          segment_id: string | null
          state_id: number | null
          status: string
          trade_name: string | null
          updated_at: string
        }
        Insert: {
          city_id?: number | null
          cnpj: string
          created_at?: string
          id?: string
          legal_name: string
          metadata?: Json
          segment_id?: string | null
          state_id?: number | null
          status?: string
          trade_name?: string | null
          updated_at?: string
        }
        Update: {
          city_id?: number | null
          cnpj?: string
          created_at?: string
          id?: string
          legal_name?: string
          metadata?: Json
          segment_id?: string | null
          state_id?: number | null
          status?: string
          trade_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      partner_profiles: {
        Row: {
          cnpj: string | null
          commercial_id: string | null
          commission_rate: number | null
          company_name: string
          company_size: string | null
          contract_url: string | null
          id: string
          metadata: Json | null
          onboarded_at: string | null
          onboarded_by: string | null
          partner_status: Database["public"]["Enums"]["partner_lifecycle_status"]
          partner_tier: string | null
          region_id: string | null
          segment: string | null
          trading_name: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          cnpj?: string | null
          commercial_id?: string | null
          commission_rate?: number | null
          company_name?: string
          company_size?: string | null
          contract_url?: string | null
          id?: string
          metadata?: Json | null
          onboarded_at?: string | null
          onboarded_by?: string | null
          partner_status?: Database["public"]["Enums"]["partner_lifecycle_status"]
          partner_tier?: string | null
          region_id?: string | null
          segment?: string | null
          trading_name?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          cnpj?: string | null
          commercial_id?: string | null
          commission_rate?: number | null
          company_name?: string
          company_size?: string | null
          contract_url?: string | null
          id?: string
          metadata?: Json | null
          onboarded_at?: string | null
          onboarded_by?: string | null
          partner_status?: Database["public"]["Enums"]["partner_lifecycle_status"]
          partner_tier?: string | null
          region_id?: string | null
          segment?: string | null
          trading_name?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_profiles_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_profiles_onboarded_by_fkey"
            columns: ["onboarded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_profiles_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          birth_date: string | null
          cpf: string
          created_at: string
          full_name: string
          id: string
          metadata: Json
          person_type: string
          primary_email: string
          primary_phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          cpf: string
          created_at?: string
          full_name: string
          id?: string
          metadata?: Json
          person_type?: string
          primary_email: string
          primary_phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          cpf?: string
          created_at?: string
          full_name?: string
          id?: string
          metadata?: Json
          person_type?: string
          primary_email?: string
          primary_phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      person_emails: {
        Row: {
          created_at: string
          email: string
          email_type: string
          id: string
          is_verified: boolean
          person_id: string
        }
        Insert: {
          created_at?: string
          email: string
          email_type?: string
          id?: string
          is_verified?: boolean
          person_id: string
        }
        Update: {
          created_at?: string
          email?: string
          email_type?: string
          id?: string
          is_verified?: boolean
          person_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "person_emails_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_events: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          referral_id: string
          status: Database["public"]["Enums"]["referral_status"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          referral_id: string
          status: Database["public"]["Enums"]["referral_status"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          referral_id?: string
          status?: Database["public"]["Enums"]["referral_status"]
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_events_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      points_transactions: {
        Row: {
          balance_after: number
          created_by: string | null
          id: number
          occurred_at: string
          points: number
          reason: string
          reference_id: string | null
          reference_type: string | null
          type: string
          user_id: string
        }
        Insert: {
          balance_after?: number
          created_by?: string | null
          id?: number
          occurred_at?: string
          points: number
          reason: string
          reference_id?: string | null
          reference_type?: string | null
          type: string
          user_id: string
        }
        Update: {
          balance_after?: number
          created_by?: string | null
          id?: number
          occurred_at?: string
          points?: number
          reason?: string
          reference_id?: string | null
          reference_type?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          area: string | null
          avatar_url: string | null
          birth_date: string | null
          bitrix_entity_id: string | null
          bitrix_entity_type: string | null
          bitrix_entity_type_id: string | null
          bitrix_onboarding_value: number | null
          bitrix_pipeline_id: string | null
          bitrix_previous_stage_id: string | null
          bitrix_sales_value: number | null
          bitrix_stage_id: string | null
          bitrix_updated_time: string | null
          can_influence_purchase: string | null
          cargo: string | null
          city: string | null
          city_ibge_id: number | null
          codigo_ref: string | null
          company_area: string | null
          company_area_other: string | null
          company_name: string | null
          contact_role: string | null
          contact_role_other: string | null
          course: string | null
          cpf: string | null
          created_at: string
          document_cnpj: string | null
          document_cpf: string | null
          elegivel_programa: boolean
          email: string
          formation_cycle: string | null
          full_name: string
          graduation_date: string | null
          id: string
          indicado_por: string | null
          institution: string | null
          institution_id: string | null
          institution_pending: boolean
          is_active: boolean
          is_verified: boolean
          main_objective: string | null
          main_objective_other: string | null
          metadata: Json | null
          period: string | null
          phone: string | null
          profile_completed: boolean
          profile_type: string | null
          referrer_type: Database["public"]["Enums"]["referrer_type"] | null
          region_id: string | null
          state: string | null
          status: Database["public"]["Enums"]["user_status"]
          terms_accepted: boolean
          turma_id: string | null
          turma_vinculada_em: string | null
          updated_at: string
          verificado: boolean
          works_at_company: boolean | null
        }
        Insert: {
          area?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          bitrix_entity_id?: string | null
          bitrix_entity_type?: string | null
          bitrix_entity_type_id?: string | null
          bitrix_onboarding_value?: number | null
          bitrix_pipeline_id?: string | null
          bitrix_previous_stage_id?: string | null
          bitrix_sales_value?: number | null
          bitrix_stage_id?: string | null
          bitrix_updated_time?: string | null
          can_influence_purchase?: string | null
          cargo?: string | null
          city?: string | null
          city_ibge_id?: number | null
          codigo_ref?: string | null
          company_area?: string | null
          company_area_other?: string | null
          company_name?: string | null
          contact_role?: string | null
          contact_role_other?: string | null
          course?: string | null
          cpf?: string | null
          created_at?: string
          document_cnpj?: string | null
          document_cpf?: string | null
          elegivel_programa?: boolean
          email: string
          formation_cycle?: string | null
          full_name: string
          graduation_date?: string | null
          id: string
          indicado_por?: string | null
          institution?: string | null
          institution_id?: string | null
          institution_pending?: boolean
          is_active?: boolean
          is_verified?: boolean
          main_objective?: string | null
          main_objective_other?: string | null
          metadata?: Json | null
          period?: string | null
          phone?: string | null
          profile_completed?: boolean
          profile_type?: string | null
          referrer_type?: Database["public"]["Enums"]["referrer_type"] | null
          region_id?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          terms_accepted?: boolean
          turma_id?: string | null
          turma_vinculada_em?: string | null
          updated_at?: string
          verificado?: boolean
          works_at_company?: boolean | null
        }
        Update: {
          area?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          bitrix_entity_id?: string | null
          bitrix_entity_type?: string | null
          bitrix_entity_type_id?: string | null
          bitrix_onboarding_value?: number | null
          bitrix_pipeline_id?: string | null
          bitrix_previous_stage_id?: string | null
          bitrix_sales_value?: number | null
          bitrix_stage_id?: string | null
          bitrix_updated_time?: string | null
          can_influence_purchase?: string | null
          cargo?: string | null
          city?: string | null
          city_ibge_id?: number | null
          codigo_ref?: string | null
          company_area?: string | null
          company_area_other?: string | null
          company_name?: string | null
          contact_role?: string | null
          contact_role_other?: string | null
          course?: string | null
          cpf?: string | null
          created_at?: string
          document_cnpj?: string | null
          document_cpf?: string | null
          elegivel_programa?: boolean
          email?: string
          formation_cycle?: string | null
          full_name?: string
          graduation_date?: string | null
          id?: string
          indicado_por?: string | null
          institution?: string | null
          institution_id?: string | null
          institution_pending?: boolean
          is_active?: boolean
          is_verified?: boolean
          main_objective?: string | null
          main_objective_other?: string | null
          metadata?: Json | null
          period?: string | null
          phone?: string | null
          profile_completed?: boolean
          profile_type?: string | null
          referrer_type?: Database["public"]["Enums"]["referrer_type"] | null
          region_id?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          terms_accepted?: boolean
          turma_id?: string | null
          turma_vinculada_em?: string | null
          updated_at?: string
          verificado?: boolean
          works_at_company?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "instituicoes_medicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      program_invite_rules: {
        Row: {
          allowed_source_roles: string[]
          destination_program_id: string
          id: string
          is_active: boolean
          source_program_id: string
        }
        Insert: {
          allowed_source_roles?: string[]
          destination_program_id: string
          id?: string
          is_active?: boolean
          source_program_id: string
        }
        Update: {
          allowed_source_roles?: string[]
          destination_program_id?: string
          id?: string
          is_active?: boolean
          source_program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_invite_rules_destination_program_id_fkey"
            columns: ["destination_program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_invite_rules_source_program_id_fkey"
            columns: ["source_program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_membership_transitions: {
        Row: {
          created_by_person_id: string | null
          from_membership_id: string | null
          id: string
          occurred_at: string
          person_id: string
          reason: string | null
          to_membership_id: string | null
          transition_type: string
        }
        Insert: {
          created_by_person_id?: string | null
          from_membership_id?: string | null
          id?: string
          occurred_at?: string
          person_id: string
          reason?: string | null
          to_membership_id?: string | null
          transition_type: string
        }
        Update: {
          created_by_person_id?: string | null
          from_membership_id?: string | null
          id?: string
          occurred_at?: string
          person_id?: string
          reason?: string | null
          to_membership_id?: string | null
          transition_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_membership_transitions_created_by_person_id_fkey"
            columns: ["created_by_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_membership_transitions_from_membership_id_fkey"
            columns: ["from_membership_id"]
            isOneToOne: false
            referencedRelation: "program_memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_membership_transitions_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_membership_transitions_to_membership_id_fkey"
            columns: ["to_membership_id"]
            isOneToOne: false
            referencedRelation: "program_memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      program_memberships: {
        Row: {
          approved_by_person_id: string | null
          created_at: string
          end_reason: string | null
          ended_at: string | null
          id: string
          invited_by_person_id: string | null
          membership_type: string
          metadata: Json
          organization_id: string | null
          person_id: string | null
          program_id: string
          source: string | null
          started_at: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_by_person_id?: string | null
          created_at?: string
          end_reason?: string | null
          ended_at?: string | null
          id?: string
          invited_by_person_id?: string | null
          membership_type: string
          metadata?: Json
          organization_id?: string | null
          person_id?: string | null
          program_id: string
          source?: string | null
          started_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_by_person_id?: string | null
          created_at?: string
          end_reason?: string | null
          ended_at?: string | null
          id?: string
          invited_by_person_id?: string | null
          membership_type?: string
          metadata?: Json
          organization_id?: string | null
          person_id?: string | null
          program_id?: string
          source?: string | null
          started_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_memberships_approved_by_person_id_fkey"
            columns: ["approved_by_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_memberships_invited_by_person_id_fkey"
            columns: ["invited_by_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_memberships_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_memberships_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      program_signups: {
        Row: {
          activated_at: string | null
          activation_status: string | null
          campaign_id: string | null
          commercial_id: string | null
          id: string
          link_id: string | null
          metadata: Json | null
          owner_user_id: string | null
          program_id: string
          ref_token_used: string | null
          region_id: string | null
          session_id: string | null
          signup_at: string
          source_type: string | null
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          activation_status?: string | null
          campaign_id?: string | null
          commercial_id?: string | null
          id?: string
          link_id?: string | null
          metadata?: Json | null
          owner_user_id?: string | null
          program_id: string
          ref_token_used?: string | null
          region_id?: string | null
          session_id?: string | null
          signup_at?: string
          source_type?: string | null
          user_id: string
        }
        Update: {
          activated_at?: string | null
          activation_status?: string | null
          campaign_id?: string | null
          commercial_id?: string | null
          id?: string
          link_id?: string | null
          metadata?: Json | null
          owner_user_id?: string | null
          program_id?: string
          ref_token_used?: string | null
          region_id?: string | null
          session_id?: string | null
          signup_at?: string
          source_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_signups_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_signups_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_signups_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "referral_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_signups_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "v_my_referral_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_signups_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_signups_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_signups_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_signups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          audience_type: string
          config: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          label: string
          name: string
          updated_at: string
        }
        Insert: {
          audience_type: string
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          label: string
          name: string
          updated_at?: string
        }
        Update: {
          audience_type?: string
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          label?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      programs_v2: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          key: string
          name: string
          participant_entity: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          key: string
          name: string
          participant_entity: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          participant_entity?: string
        }
        Relationships: []
      }
      pulse_access_roles: {
        Row: {
          approved_at: string | null
          approved_by_person_id: string | null
          created_at: string
          id: string
          person_id: string
          region_id: string | null
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by_person_id?: string | null
          created_at?: string
          id?: string
          person_id: string
          region_id?: string | null
          role: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by_person_id?: string | null
          created_at?: string
          id?: string
          person_id?: string
          region_id?: string | null
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pulse_access_roles_approved_by_person_id_fkey"
            columns: ["approved_by_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pulse_access_roles_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pulse_access_roles_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      pulse_modules: {
        Row: {
          allowed_roles: string[]
          icon: string | null
          id: string
          is_active: boolean
          label: string
          metadata: Json | null
          name: string
          parent_id: string | null
          path: string | null
          sort_order: number | null
        }
        Insert: {
          allowed_roles?: string[]
          icon?: string | null
          id?: string
          is_active?: boolean
          label: string
          metadata?: Json | null
          name: string
          parent_id?: string | null
          path?: string | null
          sort_order?: number | null
        }
        Update: {
          allowed_roles?: string[]
          icon?: string | null
          id?: string
          is_active?: boolean
          label?: string
          metadata?: Json | null
          name?: string
          parent_id?: string | null
          path?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pulse_modules_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "pulse_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      pulse_notifications: {
        Row: {
          action_url: string | null
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          is_sent: boolean
          metadata: Json | null
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          sent_via: string[] | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          is_sent?: boolean
          metadata?: Json | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          sent_via?: string[] | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          is_sent?: boolean
          metadata?: Json | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          sent_via?: string[] | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pulse_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pulse_user_preferences: {
        Row: {
          dashboard_widgets: Json | null
          default_program: string | null
          default_region: string | null
          id: string
          metadata: Json | null
          notifications_enabled: boolean | null
          sidebar_collapsed: boolean | null
          table_configs: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          dashboard_widgets?: Json | null
          default_program?: string | null
          default_region?: string | null
          id?: string
          metadata?: Json | null
          notifications_enabled?: boolean | null
          sidebar_collapsed?: boolean | null
          table_configs?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          dashboard_widgets?: Json | null
          default_program?: string | null
          default_region?: string | null
          id?: string
          metadata?: Json | null
          notifications_enabled?: boolean | null
          sidebar_collapsed?: boolean | null
          table_configs?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pulse_user_preferences_default_program_fkey"
            columns: ["default_program"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pulse_user_preferences_default_region_fkey"
            columns: ["default_region"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pulse_user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking_snapshots: {
        Row: {
          id: string
          period: string
          period_end: string
          period_start: string
          program_id: string
          rank_position: number
          region_id: string | null
          snapshot_at: string
          total_conversions: number
          total_points: number
          total_referrals: number
          user_id: string
        }
        Insert: {
          id?: string
          period: string
          period_end: string
          period_start: string
          program_id: string
          rank_position: number
          region_id?: string | null
          snapshot_at?: string
          total_conversions?: number
          total_points?: number
          total_referrals?: number
          user_id: string
        }
        Update: {
          id?: string
          period?: string
          period_end?: string
          period_start?: string
          program_id?: string
          rank_position?: number
          region_id?: string | null
          snapshot_at?: string
          total_conversions?: number
          total_points?: number
          total_referrals?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ranking_snapshots_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ranking_snapshots_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ranking_snapshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_events: {
        Row: {
          event_data: Json | null
          event_type: string
          id: number
          occurred_at: string
          owner_user_id: string | null
          program_id: string
          referral_link_id: string | null
          referred_user_id: string | null
          revenue_amount: number | null
          reward_amount: number | null
        }
        Insert: {
          event_data?: Json | null
          event_type: string
          id?: number
          occurred_at?: string
          owner_user_id?: string | null
          program_id: string
          referral_link_id?: string | null
          referred_user_id?: string | null
          revenue_amount?: number | null
          reward_amount?: number | null
        }
        Update: {
          event_data?: Json | null
          event_type?: string
          id?: number
          occurred_at?: string
          owner_user_id?: string | null
          program_id?: string
          referral_link_id?: string | null
          referred_user_id?: string | null
          revenue_amount?: number | null
          reward_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_events_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_events_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_events_referral_link_id_fkey"
            columns: ["referral_link_id"]
            isOneToOne: false
            referencedRelation: "referral_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_events_referral_link_id_fkey"
            columns: ["referral_link_id"]
            isOneToOne: false
            referencedRelation: "v_my_referral_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_events_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_links: {
        Row: {
          activation_count: number
          campaign_id: string | null
          click_count: number
          commercial_id: string | null
          created_at: string
          custom_slug: string | null
          destination_program_id: string
          expires_at: string | null
          full_url: string | null
          id: string
          is_active: boolean
          landing_url: string | null
          metadata: Json | null
          origin_program_id: string | null
          owner_user_id: string
          ref_token: string
          region_id: string | null
          signup_count: number
          source_id: string | null
          source_type: string
          updated_at: string
        }
        Insert: {
          activation_count?: number
          campaign_id?: string | null
          click_count?: number
          commercial_id?: string | null
          created_at?: string
          custom_slug?: string | null
          destination_program_id: string
          expires_at?: string | null
          full_url?: string | null
          id?: string
          is_active?: boolean
          landing_url?: string | null
          metadata?: Json | null
          origin_program_id?: string | null
          owner_user_id: string
          ref_token: string
          region_id?: string | null
          signup_count?: number
          source_id?: string | null
          source_type: string
          updated_at?: string
        }
        Update: {
          activation_count?: number
          campaign_id?: string | null
          click_count?: number
          commercial_id?: string | null
          created_at?: string
          custom_slug?: string | null
          destination_program_id?: string
          expires_at?: string | null
          full_url?: string | null
          id?: string
          is_active?: boolean
          landing_url?: string | null
          metadata?: Json | null
          origin_program_id?: string | null
          owner_user_id?: string
          ref_token?: string
          region_id?: string | null
          signup_count?: number
          source_id?: string | null
          source_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_links_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_links_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_links_destination_program_id_fkey"
            columns: ["destination_program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_links_origin_program_id_fkey"
            columns: ["origin_program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_links_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_links_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_sources: {
        Row: {
          commercial_id: string | null
          created_at: string
          id: string
          is_active: boolean
          metadata: Json | null
          program_id: string | null
          region_id: string | null
          source_id: string | null
          source_type: string
        }
        Insert: {
          commercial_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          metadata?: Json | null
          program_id?: string | null
          region_id?: string | null
          source_id?: string | null
          source_type: string
        }
        Update: {
          commercial_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          metadata?: Json | null
          program_id?: string | null
          region_id?: string | null
          source_id?: string | null
          source_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_sources_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_sources_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_sources_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          bitrix_assigned_by_id: string | null
          bitrix_closed_time: string | null
          bitrix_created_time: string | null
          bitrix_entity_id: string | null
          bitrix_entity_type: string | null
          bitrix_entity_type_id: string | null
          bitrix_onboarding_value: number | null
          bitrix_pipeline_id: string | null
          bitrix_pipeline_name: string | null
          bitrix_previous_stage_id: string | null
          bitrix_sales_value: number | null
          bitrix_stage_id: string | null
          bitrix_stage_name: string | null
          bitrix_stage_semantics: string | null
          bitrix_updated_time: string | null
          closed_at: string | null
          codigo_ref: string | null
          created_at: string
          created_by_user_id: string | null
          data: Json
          estimated_bonus: number
          id: string
          implanted_at: string | null
          lead_email: string
          lead_name: string
          lead_phone: string
          luma_guest_api_id: string | null
          origem: string | null
          paid_at: string | null
          profession_area: string | null
          referrer_id: string
          representante_id: string | null
          reuniao_id: string | null
          status: Database["public"]["Enums"]["referral_status"]
          turma_id: string | null
          type: Database["public"]["Enums"]["referral_type"]
          updated_at: string
          vendedor_id: string | null
          webhook_status: string
        }
        Insert: {
          bitrix_assigned_by_id?: string | null
          bitrix_closed_time?: string | null
          bitrix_created_time?: string | null
          bitrix_entity_id?: string | null
          bitrix_entity_type?: string | null
          bitrix_entity_type_id?: string | null
          bitrix_onboarding_value?: number | null
          bitrix_pipeline_id?: string | null
          bitrix_pipeline_name?: string | null
          bitrix_previous_stage_id?: string | null
          bitrix_sales_value?: number | null
          bitrix_stage_id?: string | null
          bitrix_stage_name?: string | null
          bitrix_stage_semantics?: string | null
          bitrix_updated_time?: string | null
          closed_at?: string | null
          codigo_ref?: string | null
          created_at?: string
          created_by_user_id?: string | null
          data?: Json
          estimated_bonus?: number
          id?: string
          implanted_at?: string | null
          lead_email: string
          lead_name: string
          lead_phone: string
          luma_guest_api_id?: string | null
          origem?: string | null
          paid_at?: string | null
          profession_area?: string | null
          referrer_id: string
          representante_id?: string | null
          reuniao_id?: string | null
          status?: Database["public"]["Enums"]["referral_status"]
          turma_id?: string | null
          type: Database["public"]["Enums"]["referral_type"]
          updated_at?: string
          vendedor_id?: string | null
          webhook_status?: string
        }
        Update: {
          bitrix_assigned_by_id?: string | null
          bitrix_closed_time?: string | null
          bitrix_created_time?: string | null
          bitrix_entity_id?: string | null
          bitrix_entity_type?: string | null
          bitrix_entity_type_id?: string | null
          bitrix_onboarding_value?: number | null
          bitrix_pipeline_id?: string | null
          bitrix_pipeline_name?: string | null
          bitrix_previous_stage_id?: string | null
          bitrix_sales_value?: number | null
          bitrix_stage_id?: string | null
          bitrix_stage_name?: string | null
          bitrix_stage_semantics?: string | null
          bitrix_updated_time?: string | null
          closed_at?: string | null
          codigo_ref?: string | null
          created_at?: string
          created_by_user_id?: string | null
          data?: Json
          estimated_bonus?: number
          id?: string
          implanted_at?: string | null
          lead_email?: string
          lead_name?: string
          lead_phone?: string
          luma_guest_api_id?: string | null
          origem?: string | null
          paid_at?: string | null
          profession_area?: string | null
          referrer_id?: string
          representante_id?: string | null
          reuniao_id?: string | null
          status?: Database["public"]["Enums"]["referral_status"]
          turma_id?: string | null
          type?: Database["public"]["Enums"]["referral_type"]
          updated_at?: string
          vendedor_id?: string | null
          webhook_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_reuniao_id_fkey"
            columns: ["reuniao_id"]
            isOneToOne: false
            referencedRelation: "reunioes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "v_turma_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          label: string
          metadata: Json | null
          name: string
          state: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          metadata?: Json | null
          name: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          metadata?: Json | null
          name?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      representantes_turma: {
        Row: {
          created_at: string
          data_fim: string | null
          data_inicio: string
          id: string
          is_active: boolean | null
          meta_conversoes: number
          meta_indicacoes: number
          notes: string | null
          onboarded_at: string | null
          partner_profile_id: string | null
          status: Database["public"]["Enums"]["rep_status"]
          turma_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          id?: string
          is_active?: boolean | null
          meta_conversoes?: number
          meta_indicacoes?: number
          notes?: string | null
          onboarded_at?: string | null
          partner_profile_id?: string | null
          status?: Database["public"]["Enums"]["rep_status"]
          turma_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          id?: string
          is_active?: boolean | null
          meta_conversoes?: number
          meta_indicacoes?: number
          notes?: string | null
          onboarded_at?: string | null
          partner_profile_id?: string | null
          status?: Database["public"]["Enums"]["rep_status"]
          turma_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "representantes_turma_partner_profile_id_fkey"
            columns: ["partner_profile_id"]
            isOneToOne: false
            referencedRelation: "club_ranking"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "representantes_turma_partner_profile_id_fkey"
            columns: ["partner_profile_id"]
            isOneToOne: false
            referencedRelation: "partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "representantes_turma_partner_profile_id_fkey"
            columns: ["partner_profile_id"]
            isOneToOne: false
            referencedRelation: "v_partner_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "representantes_turma_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "representantes_turma_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "v_turma_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      reunioes: {
        Row: {
          ativa: boolean
          cancelado_em: string | null
          created_at: string
          criada_por: string | null
          data_reuniao: string
          excluido_em: string | null
          google_event_id: string | null
          google_event_url: string | null
          id: string
          luma_descricao: string | null
          luma_event_api_id: string | null
          luma_event_url: string | null
          luma_local: string | null
          meeting_type: Database["public"]["Enums"]["meeting_type"]
          motivo_cancelamento: string | null
          nome: string
          sincronizar_luma: boolean
          status: Database["public"]["Enums"]["reuniao_status"]
          student_id: string | null
          turma_id: string
          ultima_sync_luma: string | null
          updated_at: string
        }
        Insert: {
          ativa?: boolean
          cancelado_em?: string | null
          created_at?: string
          criada_por?: string | null
          data_reuniao?: string
          excluido_em?: string | null
          google_event_id?: string | null
          google_event_url?: string | null
          id?: string
          luma_descricao?: string | null
          luma_event_api_id?: string | null
          luma_event_url?: string | null
          luma_local?: string | null
          meeting_type?: Database["public"]["Enums"]["meeting_type"]
          motivo_cancelamento?: string | null
          nome: string
          sincronizar_luma?: boolean
          status?: Database["public"]["Enums"]["reuniao_status"]
          student_id?: string | null
          turma_id: string
          ultima_sync_luma?: string | null
          updated_at?: string
        }
        Update: {
          ativa?: boolean
          cancelado_em?: string | null
          created_at?: string
          criada_por?: string | null
          data_reuniao?: string
          excluido_em?: string | null
          google_event_id?: string | null
          google_event_url?: string | null
          id?: string
          luma_descricao?: string | null
          luma_event_api_id?: string | null
          luma_event_url?: string | null
          luma_local?: string | null
          meeting_type?: Database["public"]["Enums"]["meeting_type"]
          motivo_cancelamento?: string | null
          nome?: string
          sincronizar_luma?: boolean
          status?: Database["public"]["Enums"]["reuniao_status"]
          student_id?: string | null
          turma_id?: string
          ultima_sync_luma?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reunioes_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reunioes_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "v_turma_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          label: string
          name: string
          scope: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          label: string
          name: string
          scope: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          label?: string
          name?: string
          scope?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      turma_convites: {
        Row: {
          convidado_por: string | null
          created_at: string
          id: string
          nota: string | null
          responded_at: string | null
          status: Database["public"]["Enums"]["convite_status"]
          tipo: Database["public"]["Enums"]["convite_tipo"]
          turma_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          convidado_por?: string | null
          created_at?: string
          id?: string
          nota?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["convite_status"]
          tipo?: Database["public"]["Enums"]["convite_tipo"]
          turma_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          convidado_por?: string | null
          created_at?: string
          id?: string
          nota?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["convite_status"]
          tipo?: Database["public"]["Enums"]["convite_tipo"]
          turma_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      turma_vinculos_log: {
        Row: {
          acao: Database["public"]["Enums"]["vinculo_acao"]
          created_at: string
          executado_por: string | null
          id: string
          motivo: string | null
          turma_id: string | null
          user_id: string
        }
        Insert: {
          acao: Database["public"]["Enums"]["vinculo_acao"]
          created_at?: string
          executado_por?: string | null
          id?: string
          motivo?: string | null
          turma_id?: string | null
          user_id: string
        }
        Update: {
          acao?: Database["public"]["Enums"]["vinculo_acao"]
          created_at?: string
          executado_por?: string | null
          id?: string
          motivo?: string | null
          turma_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      turmas: {
        Row: {
          active_members: number | null
          campaign_id: string | null
          campus_id: string | null
          ciclo_formacao: Database["public"]["Enums"]["formation_cycle_enum"]
          commercial_id: string | null
          consultor_comercial_id: string | null
          conversion_rate: number | null
          converted_members: number | null
          created_at: string
          curso: string
          curso_id: string | null
          data_colacao_grau: string
          data_inicio: string
          estimated_members: number | null
          graduation_party_date: string | null
          id: string
          instituicao_id: string
          meta_conversoes: number
          meta_indicacoes: number
          metadata: Json | null
          metas_overridden: boolean
          nome: string
          notes: string | null
          pulse_status: string | null
          region_id: string | null
          semestre: number | null
          status: Database["public"]["Enums"]["turma_status"]
          tamanho_estimado: number
          total_revenue: number | null
          updated_at: string
          welcome_meeting_date: string | null
        }
        Insert: {
          active_members?: number | null
          campaign_id?: string | null
          campus_id?: string | null
          ciclo_formacao: Database["public"]["Enums"]["formation_cycle_enum"]
          commercial_id?: string | null
          consultor_comercial_id?: string | null
          conversion_rate?: number | null
          converted_members?: number | null
          created_at?: string
          curso?: string
          curso_id?: string | null
          data_colacao_grau: string
          data_inicio?: string
          estimated_members?: number | null
          graduation_party_date?: string | null
          id?: string
          instituicao_id: string
          meta_conversoes?: number
          meta_indicacoes?: number
          metadata?: Json | null
          metas_overridden?: boolean
          nome: string
          notes?: string | null
          pulse_status?: string | null
          region_id?: string | null
          semestre?: number | null
          status?: Database["public"]["Enums"]["turma_status"]
          tamanho_estimado?: number
          total_revenue?: number | null
          updated_at?: string
          welcome_meeting_date?: string | null
        }
        Update: {
          active_members?: number | null
          campaign_id?: string | null
          campus_id?: string | null
          ciclo_formacao?: Database["public"]["Enums"]["formation_cycle_enum"]
          commercial_id?: string | null
          consultor_comercial_id?: string | null
          conversion_rate?: number | null
          converted_members?: number | null
          created_at?: string
          curso?: string
          curso_id?: string | null
          data_colacao_grau?: string
          data_inicio?: string
          estimated_members?: number | null
          graduation_party_date?: string | null
          id?: string
          instituicao_id?: string
          meta_conversoes?: number
          meta_indicacoes?: number
          metadata?: Json | null
          metas_overridden?: boolean
          nome?: string
          notes?: string | null
          pulse_status?: string | null
          region_id?: string | null
          semestre?: number | null
          status?: Database["public"]["Enums"]["turma_status"]
          tamanho_estimado?: number
          total_revenue?: number | null
          updated_at?: string
          welcome_meeting_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "turmas_campus_id_fkey"
            columns: ["campus_id"]
            isOneToOne: false
            referencedRelation: "campi"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "turmas_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "turmas_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "turmas_instituicao_id_fkey"
            columns: ["instituicao_id"]
            isOneToOne: false
            referencedRelation: "instituicoes_medicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "turmas_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_accounts: {
        Row: {
          auth_user_id: string
          created_at: string
          id: string
          last_login_at: string | null
          login_email: string
          person_id: string
          status: string
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          id?: string
          last_login_at?: string | null
          login_email: string
          person_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          id?: string
          last_login_at?: string | null
          login_email?: string
          person_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_accounts_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      user_programs: {
        Row: {
          activated_at: string | null
          campaign_id: string | null
          churned_at: string | null
          commercial_id: string | null
          id: string
          invited_by_type: string | null
          invited_by_user_id: string | null
          joined_at: string
          metadata: Json | null
          program_id: string
          ref_token_used: string | null
          region_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          campaign_id?: string | null
          churned_at?: string | null
          commercial_id?: string | null
          id?: string
          invited_by_type?: string | null
          invited_by_user_id?: string | null
          joined_at?: string
          metadata?: Json | null
          program_id: string
          ref_token_used?: string | null
          region_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          activated_at?: string | null
          campaign_id?: string | null
          churned_at?: string | null
          commercial_id?: string | null
          id?: string
          invited_by_type?: string | null
          invited_by_user_id?: string | null
          joined_at?: string
          metadata?: Json | null
          program_id?: string
          ref_token_used?: string | null
          region_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_programs_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_programs_invited_by_user_id_fkey"
            columns: ["invited_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_programs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_programs_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_programs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["app_role"]
          role_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role: Database["public"]["Enums"]["app_role"]
          role_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          role_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      club_ranking: {
        Row: {
          company_name: string | null
          empresa_id: string | null
          partner_tier: string | null
          total_convertidas: number | null
          total_indicacoes: number | null
          total_qualificadas: number | null
        }
        Relationships: []
      }
      v_my_referral_links: {
        Row: {
          activation_count: number | null
          campaign_id: string | null
          click_count: number | null
          commercial_id: string | null
          created_at: string | null
          custom_slug: string | null
          destination_program_id: string | null
          destination_program_label: string | null
          destination_program_name: string | null
          expires_at: string | null
          full_url: string | null
          id: string | null
          is_active: boolean | null
          landing_url: string | null
          metadata: Json | null
          origin_program_id: string | null
          owner_user_id: string | null
          ref_token: string | null
          region_id: string | null
          region_name: string | null
          signup_count: number | null
          source_id: string | null
          source_type: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_links_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_links_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_links_destination_program_id_fkey"
            columns: ["destination_program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_links_origin_program_id_fkey"
            columns: ["origin_program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_links_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_links_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      v_partner_summary: {
        Row: {
          commercial_id: string | null
          company_name: string | null
          conversions_count: number | null
          email: string | null
          full_name: string | null
          links_count: number | null
          manual_referrals_count: number | null
          partner_tier: string | null
          region_id: string | null
          region_name: string | null
          total_activations: number | null
          total_clicks: number | null
          total_signups: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_profiles_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_profiles_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      v_turma_summary: {
        Row: {
          active_members: number | null
          commercial_id: string | null
          commercial_name: string | null
          conversion_rate: number | null
          converted_members: number | null
          curso: string | null
          data_colacao_grau: string | null
          id: string | null
          meta_conversoes: number | null
          meta_indicacoes: number | null
          nome: string | null
          pulse_status: string | null
          region_id: string | null
          region_name: string | null
          status: Database["public"]["Enums"]["turma_status"] | null
          total_conversions: number | null
          total_referrals: number | null
          total_revenue: number | null
        }
        Relationships: [
          {
            foreignKeyName: "turmas_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "turmas_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      approve_club_application: {
        Args: { _application_id: string }
        Returns: Json
      }
      check_signup_duplicates: {
        Args: { _cpf: string; _email: string }
        Returns: {
          cpf_taken: boolean
          email_taken: boolean
        }[]
      }
      class_rep_limit: { Args: { _tamanho: number }; Returns: number }
      club_application_status_by_token: {
        Args: { _token: string }
        Returns: {
          company_name: string
          status: string
          status_reason: string
          submitted_at: string
        }[]
      }
      club_current_empresa_id: { Args: never; Returns: string }
      club_is_admin_of: { Args: { _empresa: string }; Returns: boolean }
      club_is_member_of: { Args: { _empresa: string }; Returns: boolean }
      create_referral_link: {
        Args: {
          p_campaign_id?: string
          p_commercial_id?: string
          p_destination_program: string
          p_origin_program?: string
          p_owner_user_id: string
          p_region_id?: string
          p_source_type: string
        }
        Returns: {
          activation_count: number
          campaign_id: string | null
          click_count: number
          commercial_id: string | null
          created_at: string
          custom_slug: string | null
          destination_program_id: string
          expires_at: string | null
          full_url: string | null
          id: string
          is_active: boolean
          landing_url: string | null
          metadata: Json | null
          origin_program_id: string | null
          owner_user_id: string
          ref_token: string
          region_id: string | null
          signup_count: number
          source_id: string | null
          source_type: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "referral_links"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      find_best_turma_for_profile: {
        Args: { _profile_id: string }
        Returns: string
      }
      gen_codigo_ref: { Args: never; Returns: string }
      generate_ref_token: { Args: { p_length?: number }; Returns: string }
      get_my_active_turma_id: { Args: never; Returns: string }
      get_profession_area: { Args: { _profession: string }; Returns: string }
      get_program_stats: {
        Args: {
          p_commercial_id?: string
          p_end_date?: string
          p_program_name: string
          p_region_id?: string
          p_start_date?: string
        }
        Returns: Json
      }
      get_ranking: {
        Args: { p_month?: number; p_year: number }
        Returns: {
          area: string
          cargo: string
          conversoes: number
          full_name: string
          indicacoes: number
          revenue: number
          user_id: string
        }[]
      }
      get_rankings: {
        Args: { _since: string }
        Returns: {
          conversoes: number
          full_name: string
          indicacoes: number
          user_id: string
        }[]
      }
      get_user_region: { Args: { p_user_id: string }; Returns: string }
      get_user_stats: {
        Args: { p_month?: number; p_user_id: string; p_year: number }
        Returns: {
          bonus_estimado: number
          conversoes: number
          indicacoes: number
          revenue: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_ops: { Args: { p_user_id: string }; Returns: boolean }
      is_class_rep: { Args: { _user_id: string }; Returns: boolean }
      is_comercial: { Args: { _user_id: string }; Returns: boolean }
      is_consultor_da_turma: { Args: { _turma_id: string }; Returns: boolean }
      is_email_approved: {
        Args: { _email: string }
        Returns: Database["public"]["Enums"]["access_status"]
      }
      is_internal_user: { Args: { p_user_id: string }; Returns: boolean }
      is_pulse_internal: { Args: { _uid: string }; Returns: boolean }
      is_supervisor_comercial: { Args: { _user_id: string }; Returns: boolean }
      list_commercial_staff: {
        Args: never
        Returns: {
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      log_reuniao_action: {
        Args: {
          _acao: string
          _detalhes: Json
          _reuniao_id: string
          _usuario_id: string
        }
        Returns: undefined
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      notify_admins: {
        Args: {
          _consultor_id?: string
          _event_type: string
          _important: boolean
          _link: string
          _message: string
          _title: string
        }
        Returns: undefined
      }
      provision_internal_access: {
        Args: { _role: string; _user_id: string }
        Returns: undefined
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      record_access_audit: {
        Args: {
          _action: string
          _actor: string
          _email: string
          _meta: Json
          _reason: string
          _target_user: string
        }
        Returns: undefined
      }
      register_link_click: {
        Args: {
          p_device_type?: string
          p_ip_hash?: string
          p_ref_token: string
          p_referrer_url?: string
          p_session_id?: string
          p_user_agent?: string
          p_utm_campaign?: string
          p_utm_medium?: string
          p_utm_source?: string
        }
        Returns: undefined
      }
      resolve_ref_public: {
        Args: { _codigo: string }
        Returns: {
          full_name: string
          user_id: string
        }[]
      }
      resolve_reuniao_by_luma_id: {
        Args: { _luma_id: string }
        Returns: {
          representante_id: string
          reuniao_id: string
          turma_id: string
          vendedor_id: string
        }[]
      }
      resolve_reuniao_public: {
        Args: { _reuniao: string }
        Returns: {
          instituicao_nome: string
          representante_id: string
          reuniao_id: string
          reuniao_nome: string
          turma_id: string
          turma_nome: string
          vendedor_id: string
        }[]
      }
      resolve_user_ref: {
        Args: { _uuid: string }
        Returns: {
          full_name: string
          user_id: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      submit_manual_referral: {
        Args: {
          p_commercial_id?: string
          p_program_name: string
          p_referral_type: string
          p_referred_email?: string
          p_referred_name: string
          p_referred_notes?: string
          p_referred_phone?: string
          p_region_id?: string
          p_submitted_by_role: string
          p_submitted_by_user_id: string
        }
        Returns: {
          bitrix_contact_id: string | null
          bitrix_deal_id: string | null
          bitrix_lead_id: string | null
          campaign_id: string | null
          commercial_id: string | null
          created_at: string
          destination_program_id: string | null
          id: string
          metadata: Json | null
          program_id: string
          referral_source: string
          referral_status_updated_at: string | null
          referral_type: string
          referred_company_name: string | null
          referred_company_segment: string | null
          referred_document: string | null
          referred_email: string | null
          referred_name: string
          referred_notes: string | null
          referred_phone: string | null
          region_id: string | null
          revenue_amount: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          reward_amount: number | null
          source_program_id: string | null
          status: string
          status_reason: string | null
          submitted_by_role: string
          submitted_by_user_id: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "manual_referrals"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      user_has_any_role: {
        Args: { p_role_names: string[]; p_user_id: string }
        Returns: boolean
      }
      user_has_role: {
        Args: { p_role_name: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      access_status:
        | "pending_review"
        | "approved"
        | "active"
        | "rejected"
        | "inactive"
      app_role:
        | "admin"
        | "user"
        | "consultor_comercial"
        | "supervisor_comercial"
        | "diretor_regional"
        | "leadership"
        | "operations"
        | "marketing"
        | "commercial"
      bonus_status: "pendente" | "em_apuracao" | "liberada" | "cancelada"
      convite_status: "pendente" | "aceito" | "recusado" | "cancelado"
      convite_tipo: "turma" | "representante"
      formation_cycle_enum: "semestral" | "anual"
      institution_type:
        | "publica"
        | "privada"
        | "desconhecida"
        | "federal"
        | "estadual"
        | "municipal"
      meeting_type: "individual" | "grupo"
      partner_lifecycle_status:
        | "onboarding"
        | "ativo"
        | "inativo"
        | "suspenso"
        | "encerrado"
      partner_pipeline_status:
        | "submitted"
        | "em_analise"
        | "contato_realizado"
        | "reuniao_agendada"
        | "approved"
        | "recusado"
      referral_status:
        | "recebida"
        | "em_analise"
        | "contato_iniciado"
        | "em_negociacao"
        | "proposta_enviada"
        | "fechado"
        | "implantacao_concluida"
        | "pagamento_realizado"
        | "conversao_validada"
        | "bonificacao_liberada"
        | "perdida"
        | "nova"
        | "em_contato"
        | "aguardando_resposta"
        | "em_qualificacao"
        | "reuniao_agendada"
        | "contrato_fechado"
        | "convertida"
        | "desqualificada"
        | "erro"
        | "em_andamento"
        | "ativa"
        | "em_implantacao"
      referral_type: "empresa" | "profissional" | "estudante"
      referrer_type: "empresa" | "profissional" | "estudante"
      rep_status: "ativo" | "inativo"
      reuniao_status: "ativa" | "cancelada" | "excluida"
      turma_status: "ativa" | "pausada" | "finalizada"
      user_status: "incompleto" | "pendente" | "ativo" | "bloqueado"
      vinculo_acao:
        | "vinculado"
        | "desvinculado"
        | "convite_enviado"
        | "convite_aceito"
        | "convite_recusado"
        | "convite_cancelado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      access_status: [
        "pending_review",
        "approved",
        "active",
        "rejected",
        "inactive",
      ],
      app_role: [
        "admin",
        "user",
        "consultor_comercial",
        "supervisor_comercial",
        "diretor_regional",
        "leadership",
        "operations",
        "marketing",
        "commercial",
      ],
      bonus_status: ["pendente", "em_apuracao", "liberada", "cancelada"],
      convite_status: ["pendente", "aceito", "recusado", "cancelado"],
      convite_tipo: ["turma", "representante"],
      formation_cycle_enum: ["semestral", "anual"],
      institution_type: [
        "publica",
        "privada",
        "desconhecida",
        "federal",
        "estadual",
        "municipal",
      ],
      meeting_type: ["individual", "grupo"],
      partner_lifecycle_status: [
        "onboarding",
        "ativo",
        "inativo",
        "suspenso",
        "encerrado",
      ],
      partner_pipeline_status: [
        "submitted",
        "em_analise",
        "contato_realizado",
        "reuniao_agendada",
        "approved",
        "recusado",
      ],
      referral_status: [
        "recebida",
        "em_analise",
        "contato_iniciado",
        "em_negociacao",
        "proposta_enviada",
        "fechado",
        "implantacao_concluida",
        "pagamento_realizado",
        "conversao_validada",
        "bonificacao_liberada",
        "perdida",
        "nova",
        "em_contato",
        "aguardando_resposta",
        "em_qualificacao",
        "reuniao_agendada",
        "contrato_fechado",
        "convertida",
        "desqualificada",
        "erro",
        "em_andamento",
        "ativa",
        "em_implantacao",
      ],
      referral_type: ["empresa", "profissional", "estudante"],
      referrer_type: ["empresa", "profissional", "estudante"],
      rep_status: ["ativo", "inativo"],
      reuniao_status: ["ativa", "cancelada", "excluida"],
      turma_status: ["ativa", "pausada", "finalizada"],
      user_status: ["incompleto", "pendente", "ativo", "bloqueado"],
      vinculo_acao: [
        "vinculado",
        "desvinculado",
        "convite_enviado",
        "convite_aceito",
        "convite_recusado",
        "convite_cancelado",
      ],
    },
  },
} as const
