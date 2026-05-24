import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toProfile, type ProfileRow } from "@/lib/db-adapter";
import { INDICA_PROGRAM_NAME } from "@/lib/app-url";
import { toast } from "sonner";

export type AppRole = string;

export type Profile = ProfileRow;

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: AppRole[];
  isAdmin: boolean;
  loading: boolean;
  canIndicate: (kind: "cliente" | "parceiro") => boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Validates that the authenticated user has access to the Indica app.
 * Rules (any failure → access denied):
 *  - profiles.is_active must not be false
 *  - user must have a row in collaborator_profiles
 *  - if a row exists in user_programs for the indica program, its status
 *    must be 'active' (rows for other programs are ignored)
 */
async function userHasIndicaAccess(uid: string): Promise<boolean> {
  // 1. profile active?
  const { data: prof } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("id", uid)
    .maybeSingle();
  if (prof && (prof as { is_active: boolean | null }).is_active === false) return false;

  // 2. is collaborator?
  const { data: collab } = await supabase
    .from("collaborator_profiles")
    .select("user_id")
    .eq("user_id", uid)
    .maybeSingle();
  if (!collab) return false;

  // 3. if linked to indica program, must be active
  const { data: prog } = await supabase
    .from("programs")
    .select("id")
    .eq("name", INDICA_PROGRAM_NAME)
    .maybeSingle();
  if (prog?.id) {
    const { data: up } = await supabase
      .from("user_programs")
      .select("status")
      .eq("user_id", uid)
      .eq("program_id", prog.id)
      .maybeSingle();
    if (up && (up as { status: string }).status !== "active") return false;
  }

  return true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    const [{ data: prof }, { data: rolesData }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, email, area, cargo, elegivel_programa, avatar_url")
        .eq("id", uid)
        .maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    setProfile(prof ? toProfile(prof as never) : null);
    setRoles(((rolesData ?? []) as { role: AppRole }[]).map((r) => r.role));
  };

  const handleSession = async (sess: Session | null, isInitial = false) => {
    setSession(sess);
    setUser(sess?.user ?? null);
    if (!sess?.user) {
      setProfile(null);
      setRoles([]);
      if (isInitial) setLoading(false);
      return;
    }

    // Admins always allowed in (they may not be collaborators).
    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", sess.user.id);
    const userRoles = ((rolesData ?? []) as { role: string }[]).map((r) => r.role);
    const isAdminUser = userRoles.includes("admin");

    if (!isAdminUser) {
      const allowed = await userHasIndicaAccess(sess.user.id);
      if (!allowed) {
        toast.error("Você não possui acesso ao Indica.");
        await supabase.auth.signOut();
        setProfile(null);
        setRoles([]);
        setUser(null);
        setSession(null);
        if (isInitial) setLoading(false);
        return;
      }
    }

    await loadProfile(sess.user.id);
    if (isInitial) setLoading(false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      // Defer to avoid deadlock inside the auth callback
      setTimeout(() => { handleSession(sess); }, 0);
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      handleSession(sess, true);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canIndicate = (kind: "cliente" | "parceiro") => {
    if (!profile) return false;
    if (profile.area === "marketing" && kind === "parceiro") return false;
    if (profile.area === "comercial" && kind === "cliente") return false;
    return profile.elegivel_programa;
  };

  const signOut = async () => { await supabase.auth.signOut(); };
  const refreshProfile = async () => { if (user) await loadProfile(user.id); };

  return (
    <AuthContext.Provider value={{
      user, session, profile, roles,
      isAdmin: roles.includes("admin"),
      loading, canIndicate, signOut, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
