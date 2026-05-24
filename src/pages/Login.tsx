import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { isCorporateEmail, normalizeEmail } from "@/lib/corporate-email";
import { requestLoginCode, verifyLoginCode } from "@/lib/login-code-auth";

type Step = "email" | "code";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [busy, setBusy] = useState(false);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeEmail(email);
    if (!isCorporateEmail(normalized)) {
      return toast.error("Use seu e-mail corporativo @amigotech.com.br ou @amigoapp.com.br.");
    }
    setBusy(true);
    try {
      await requestLoginCode(normalized);
      setEmail(normalized);
      setCode("");
      setStep("code");
      toast.success("Código enviado! Verifique seu e-mail.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível enviar o código.");
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      return toast.error("Informe o código de 6 dígitos.");
    }
    setBusy(true);
    try {
      await verifyLoginCode(email, code);
      toast.success("Bem-vindo!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Código inválido ou expirado.");
    } finally {
      setBusy(false);
    }
  };

  const backToEmail = () => {
    setStep("email");
    setCode("");
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
          <h2 className="text-lg font-semibold mb-1">Entrar</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {step === "email"
              ? "Informe seu e-mail corporativo para receber um código de acesso."
              : `Enviamos um código de 6 dígitos para ${email}.`}
          </p>

          {step === "email" ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail corporativo</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@amigotech.com.br"
                />
              </div>
              <Button type="submit" disabled={busy} className="w-full bg-gradient-primary shadow-elegant">
                {busy ? "Enviando..." : "Enviar código"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código de acesso</Label>
                <div className="flex justify-center">
                  <InputOTP
                    id="code"
                    maxLength={6}
                    value={code}
                    onChange={setCode}
                    disabled={busy}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              <Button
                type="submit"
                disabled={busy || code.length !== 6}
                className="w-full bg-gradient-primary shadow-elegant"
              >
                {busy ? "Validando..." : "Validar código"}
              </Button>
              <button
                type="button"
                onClick={backToEmail}
                disabled={busy}
                className="w-full text-sm text-muted-foreground hover:text-foreground"
              >
                ← Usar outro e-mail
              </button>
            </form>
          )}
        </Card>

        <p className="text-center text-white/70 text-xs mt-6">
          <Link to="/" className="hover:text-white">← Voltar ao início</Link>
        </p>
      </div>
    </div>
  );
}
