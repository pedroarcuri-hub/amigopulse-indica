import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { USER_AREAS, type UserAreaValue } from "@/lib/areas";
import { APP_URL, INDICA_PROGRAM_NAME } from "@/lib/app-url";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup" | "forgot">("signin");
  const [busy, setBusy] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");

  const [nome, setNome] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [area, setArea] = useState<UserAreaValue>("outras");
  const [cargo, setCargo] = useState("");
  const [telefone, setTelefone] = useState("");

  const formatTelefone = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : "";
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };
  const isTelefoneValid = (v: string) => /^\(\d{2}\) \d{5}-\d{4}$/.test(v);

  useEffect(() => {
    if (!loading && user) navigate("/app");
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Bem-vindo!");
    navigate("/app");
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${APP_URL}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Enviamos um link de recuperação para seu e-mail.");
    setTab("signin");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail.endsWith("@amigotech.com.br") && !signupEmail.endsWith("@amigoapp.com.br")) {
      return toast.error("Cadastro permitido apenas para colaboradores da Amigo Tech.");
    }
    if (!isTelefoneValid(telefone)) {
      return toast.error("Informe um telefone válido.");
    }
    setBusy(true);
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        emailRedirectTo: `${APP_URL}/app`,
        data: { full_name: nome },
      },
    });
    if (error) {
      setBusy(false);
      return toast.error(error.message);
    }

    const newUserId = signUpData.user?.id;
    if (newUserId) {
      // Update profile extras
      await supabase
        .from("profiles")
        .update({ area, cargo, phone: telefone })
        .eq("id", newUserId);

      // Ensure collaborator profile exists
      await supabase
        .from("collaborator_profiles")
        .upsert({ user_id: newUserId, department: area, position: cargo }, { onConflict: "user_id" });

      // Link to Indica program
      const { data: prog } = await supabase
        .from("programs")
        .select("id")
        .eq("name", INDICA_PROGRAM_NAME)
        .maybeSingle();
      if (prog?.id) {
        await supabase
          .from("user_programs")
          .upsert(
            { user_id: newUserId, program_id: prog.id, status: "active" },
            { onConflict: "user_id,program_id" },
          );
      }
    }
    setBusy(false);

    toast.success("Cadastro realizado! Verifique seu e-mail para confirmar.");
    setTab("signin");
    setEmail(signupEmail);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur shadow-glow mb-4 ring-1 ring-white/30">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Amigo Indica</h1>
          <p className="text-white/80 mt-1">Programa de indicações Amigo Tech</p>
        </div>

        <Card className="p-6 shadow-elegant">
          <Tabs value={tab === "forgot" ? "signin" : tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              {tab === "forgot" ? (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="femail">E-mail corporativo</Label>
                    <Input id="femail" type="email" required value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)} placeholder="voce@amigotech.com.br" />
                  </div>
                  <Button type="submit" disabled={busy} className="w-full bg-gradient-primary shadow-elegant">
                    {busy ? "Enviando..." : "Enviar link de recuperação"}
                  </Button>
                  <button type="button" onClick={() => setTab("signin")}
                    className="w-full text-sm text-muted-foreground hover:text-foreground">
                    ← Voltar para entrar
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail corporativo</Label>
                    <Input id="email" type="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)} placeholder="voce@amigotech.com.br" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <button type="button" onClick={() => { setForgotEmail(email); setTab("forgot"); }}
                        className="text-xs text-primary hover:underline">
                        Esqueci minha senha
                      </button>
                    </div>
                    <Input id="password" type="password" required value={password}
                      onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={busy} className="w-full bg-gradient-primary shadow-elegant">
                    {busy ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              )}
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone (WhatsApp)</Label>
                  <Input id="telefone" type="tel" required value={telefone}
                    onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                    placeholder="(99) 99999-9999" inputMode="numeric" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semail">E-mail @amigotech.com.br ou @amigoapp.com.br</Label>
                  <Input id="semail" type="email" required value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spass">Senha (mín 6)</Label>
                  <Input id="spass" type="password" required minLength={6}
                    value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Área</Label>
                    <Select value={area} onValueChange={(v) => setArea(v as UserAreaValue)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {USER_AREAS.map((a) => (
                          <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input id="cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} />
                  </div>
                </div>
                <Button type="submit" disabled={busy} className="w-full bg-gradient-primary shadow-elegant">
                  {busy ? "Criando..." : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-white/70 text-xs mt-6">
          <Link to="/" className="hover:text-white">← Voltar ao início</Link>
        </p>
      </div>
    </div>
  );
}
