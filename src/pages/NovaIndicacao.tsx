import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { GraduationCap, Stethoscope, Building2, ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  buildStudentMetadata,
  buildProfessionalMetadata,
  buildCompanyMetadata,
  type StudentFormData,
  type ProfessionalFormData,
  type CompanyFormData,
} from "@/lib/referral-payload";

type ReferralType = "client_student" | "client_professional" | "client_company";

const COURSES = [
  "Medicina", "Odontologia", "Enfermagem", "Fisioterapia",
  "Nutrição", "Farmácia", "Psicologia", "Veterinária", "Outro",
];

const FORMATION_CYCLES = ["Semestral", "Anual"];

const PERIODS_SEMESTRAL = ["1º", "2º", "3º", "4º", "5º", "6º", "7º", "8º", "9º", "10º", "11º", "12º"];
const PERIODS_ANUAL = ["1º", "2º", "3º", "4º", "5º", "6º"];

const PROFESSIONS = [
  "Médico(a)", "Dentista", "Enfermeiro(a)", "Fisioterapeuta",
  "Nutricionista", "Farmacêutico(a)", "Psicólogo(a)", "Veterinário(a)", "Outro",
];

const COMPANY_AREAS = [
  "Clínica médica", "Clínica odontológica", "Consultório", "Hospital",
  "Laboratório", "Farmácia", "Clínica de estética", "Outro",
];

const CONTACT_ROLES = [
  "Sócio(a) / Proprietário(a)", "Diretor(a)", "Gerente",
  "Administrativo(a)", "Recepcionista", "Outro",
];

const BRAZIL_STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

const SYSTEM_OPTIONS = ["Sim", "Não", "Não sei"];

function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

// ─── Formulário Estudante ────────────────────────────────────────────────────
function StudentForm({ onSubmit, loading }: {
  onSubmit: (data: StudentFormData) => void;
  loading: boolean;
}) {
  const [f, setF] = useState<Partial<StudentFormData>>({});
  const set = (k: keyof StudentFormData, v: string) => setF(p => ({ ...p, [k]: v }));
  const periods = f.formation_cycle === "Anual" ? PERIODS_ANUAL : PERIODS_SEMESTRAL;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.lead_name || !f.lead_email || !f.lead_phone || !f.course ||
        !f.formation_cycle || !f.period || !f.institution_name ||
        !f.institution_state || !f.institution_city) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    onSubmit(f as StudentFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <FieldRow label="Nome completo" required>
          <Input placeholder="Nome do estudante" value={f.lead_name ?? ""} onChange={e => set("lead_name", e.target.value)} />
        </FieldRow>
        <FieldRow label="E-mail" required>
          <Input type="email" placeholder="email@exemplo.com" value={f.lead_email ?? ""} onChange={e => set("lead_email", e.target.value)} />
        </FieldRow>
        <FieldRow label="WhatsApp" required>
          <Input placeholder="(00) 00000-0000" value={f.lead_phone ?? ""} onChange={e => set("lead_phone", e.target.value)} />
        </FieldRow>
        <FieldRow label="CPF (opcional)">
          <Input placeholder="000.000.000-00" value={f.lead_cpf ?? ""} onChange={e => set("lead_cpf", e.target.value)} />
        </FieldRow>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dados acadêmicos</p>
        <div className="grid md:grid-cols-2 gap-4">
          <FieldRow label="Curso" required>
            <Select value={f.course ?? ""} onValueChange={v => set("course", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{COURSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </FieldRow>
          {f.course === "Outro" && (
            <FieldRow label="Qual curso?" required>
              <Input placeholder="Descreva o curso" value={f.course_other ?? ""} onChange={e => set("course_other", e.target.value)} />
            </FieldRow>
          )}
          <FieldRow label="Ciclo de formação" required>
            <Select value={f.formation_cycle ?? ""} onValueChange={v => set("formation_cycle", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{FORMATION_CYCLES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Período atual" required>
            <Select value={f.period ?? ""} onValueChange={v => set("period", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{periods.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </FieldRow>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Instituição de ensino</p>
        <div className="grid md:grid-cols-2 gap-4">
          <FieldRow label="Nome da instituição" required>
            <Input placeholder="Ex: USP, UNICAMP, Afya..." value={f.institution_name ?? ""} onChange={e => set("institution_name", e.target.value)} />
          </FieldRow>
          <FieldRow label="Campus (opcional)">
            <Input placeholder="Ex: Campus Paulista" value={f.campus_name ?? ""} onChange={e => set("campus_name", e.target.value)} />
          </FieldRow>
          <FieldRow label="Estado da instituição" required>
            <Select value={f.institution_state ?? ""} onValueChange={v => set("institution_state", v)}>
              <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
              <SelectContent>{BRAZIL_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Cidade da instituição" required>
            <Input placeholder="Ex: São Paulo" value={f.institution_city ?? ""} onChange={e => set("institution_city", e.target.value)} />
          </FieldRow>
        </div>
      </div>

      <FieldRow label="Observações internas">
        <Textarea placeholder="Informações adicionais relevantes..." rows={3} value={f.notes ?? ""} onChange={e => set("notes", e.target.value)} />
      </FieldRow>

      <Button type="submit" className="w-full bg-gradient-primary shadow-elegant" disabled={loading}>
        {loading ? "Enviando..." : "Enviar indicação"}
      </Button>
    </form>
  );
}

// ─── Formulário Profissional ──────────────────────────────────────────────────
function ProfessionalForm({ onSubmit, loading }: {
  onSubmit: (data: ProfessionalFormData) => void;
  loading: boolean;
}) {
  const [f, setF] = useState<Partial<ProfessionalFormData>>({});
  const set = (k: keyof ProfessionalFormData, v: string) => setF(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.lead_name || !f.lead_email || !f.lead_phone || !f.profession ||
        !f.state || !f.city || !f.uses_system) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    onSubmit(f as ProfessionalFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <FieldRow label="Nome completo" required>
          <Input placeholder="Nome do profissional" value={f.lead_name ?? ""} onChange={e => set("lead_name", e.target.value)} />
        </FieldRow>
        <FieldRow label="E-mail" required>
          <Input type="email" placeholder="email@exemplo.com" value={f.lead_email ?? ""} onChange={e => set("lead_email", e.target.value)} />
        </FieldRow>
        <FieldRow label="WhatsApp" required>
          <Input placeholder="(00) 00000-0000" value={f.lead_phone ?? ""} onChange={e => set("lead_phone", e.target.value)} />
        </FieldRow>
        <FieldRow label="CPF (opcional)">
          <Input placeholder="000.000.000-00" value={f.lead_cpf ?? ""} onChange={e => set("lead_cpf", e.target.value)} />
        </FieldRow>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dados profissionais</p>
        <div className="grid md:grid-cols-2 gap-4">
          <FieldRow label="Profissão" required>
            <Select value={f.profession ?? ""} onValueChange={v => set("profession", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{PROFESSIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </FieldRow>
          {f.profession === "Outro" && (
            <FieldRow label="Qual profissão?">
              <Input placeholder="Descreva" value={f.profession_other ?? ""} onChange={e => set("profession_other", e.target.value)} />
            </FieldRow>
          )}
          <FieldRow label="Especialidade">
            <Input placeholder="Ex: Cardiologia" value={f.specialty ?? ""} onChange={e => set("specialty", e.target.value)} />
          </FieldRow>
          <FieldRow label="Estado de atuação" required>
            <Select value={f.state ?? ""} onValueChange={v => set("state", v)}>
              <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
              <SelectContent>{BRAZIL_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Cidade de atuação" required>
            <Input placeholder="Ex: Recife" value={f.city ?? ""} onChange={e => set("city", e.target.value)} />
          </FieldRow>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Sistema de gestão</p>
        <div className="grid md:grid-cols-2 gap-4">
          <FieldRow label="Já utiliza algum sistema de gestão?" required>
            <Select value={f.uses_system ?? ""} onValueChange={v => set("uses_system", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{SYSTEM_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </FieldRow>
          {f.uses_system === "Sim" && (
            <FieldRow label="Qual sistema?">
              <Input placeholder="Ex: iMedico, Simples Dental..." value={f.which_system ?? ""} onChange={e => set("which_system", e.target.value)} />
            </FieldRow>
          )}
        </div>
      </div>

      <FieldRow label="Observações internas">
        <Textarea placeholder="Informações adicionais relevantes..." rows={3} value={f.notes ?? ""} onChange={e => set("notes", e.target.value)} />
      </FieldRow>

      <Button type="submit" className="w-full bg-gradient-primary shadow-elegant" disabled={loading}>
        {loading ? "Enviando..." : "Enviar indicação"}
      </Button>
    </form>
  );
}

// ─── Formulário Empresa ───────────────────────────────────────────────────────
function CompanyForm({ onSubmit, loading }: {
  onSubmit: (data: CompanyFormData) => void;
  loading: boolean;
}) {
  const [f, setF] = useState<Partial<CompanyFormData>>({});
  const set = (k: keyof CompanyFormData, v: string) => setF(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.company_name || !f.contact_name || !f.contact_email ||
        !f.contact_phone || !f.state || !f.city || !f.uses_system) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    onSubmit(f as CompanyFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border-b pb-4">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dados da empresa</p>
        <div className="grid md:grid-cols-2 gap-4">
          <FieldRow label="Nome da empresa" required>
            <Input placeholder="Razão social ou nome fantasia" value={f.company_name ?? ""} onChange={e => set("company_name", e.target.value)} />
          </FieldRow>
          <FieldRow label="CNPJ (opcional)">
            <Input placeholder="00.000.000/0000-00" value={f.company_cnpj ?? ""} onChange={e => set("company_cnpj", e.target.value)} />
          </FieldRow>
          <FieldRow label="Área / Segmento">
            <Select value={f.company_area ?? ""} onValueChange={v => set("company_area", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{COMPANY_AREAS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Estado" required>
            <Select value={f.state ?? ""} onValueChange={v => set("state", v)}>
              <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
              <SelectContent>{BRAZIL_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Cidade" required>
            <Input placeholder="Ex: São Paulo" value={f.city ?? ""} onChange={e => set("city", e.target.value)} />
          </FieldRow>
        </div>
      </div>

      <div className="border-b pb-4">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dados do contato</p>
        <div className="grid md:grid-cols-2 gap-4">
          <FieldRow label="Nome do responsável" required>
            <Input placeholder="Nome completo" value={f.contact_name ?? ""} onChange={e => set("contact_name", e.target.value)} />
          </FieldRow>
          <FieldRow label="Cargo">
            <Select value={f.contact_role ?? ""} onValueChange={v => set("contact_role", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{CONTACT_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </FieldRow>
          {f.contact_role === "Outro" && (
            <FieldRow label="Qual cargo?">
              <Input placeholder="Descreva" value={f.contact_role_other ?? ""} onChange={e => set("contact_role_other", e.target.value)} />
            </FieldRow>
          )}
          <FieldRow label="E-mail do contato" required>
            <Input type="email" placeholder="contato@empresa.com" value={f.contact_email ?? ""} onChange={e => set("contact_email", e.target.value)} />
          </FieldRow>
          <FieldRow label="WhatsApp do contato" required>
            <Input placeholder="(00) 00000-0000" value={f.contact_phone ?? ""} onChange={e => set("contact_phone", e.target.value)} />
          </FieldRow>
          <FieldRow label="CPF do responsável (opcional)">
            <Input placeholder="000.000.000-00" value={f.contact_cpf ?? ""} onChange={e => set("contact_cpf", e.target.value)} />
          </FieldRow>
        </div>
      </div>

      <div className="border-b pb-4">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Sistema de gestão</p>
        <div className="grid md:grid-cols-2 gap-4">
          <FieldRow label="Já utiliza algum sistema de gestão?" required>
            <Select value={f.uses_system ?? ""} onValueChange={v => set("uses_system", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{SYSTEM_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </FieldRow>
          {f.uses_system === "Sim" && (
            <FieldRow label="Qual sistema?">
              <Input placeholder="Ex: iMedico, Simples Dental..." value={f.which_system ?? ""} onChange={e => set("which_system", e.target.value)} />
            </FieldRow>
          )}
        </div>
      </div>

      <FieldRow label="Observações internas">
        <Textarea placeholder="Informações adicionais relevantes..." rows={3} value={f.notes ?? ""} onChange={e => set("notes", e.target.value)} />
      </FieldRow>

      <Button type="submit" className="w-full bg-gradient-primary shadow-elegant" disabled={loading}>
        {loading ? "Enviando..." : "Enviar indicação"}
      </Button>
    </form>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function NovaIndicacao() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"select" | "form" | "success">("select");
  const [type, setType] = useState<ReferralType | null>(null);
  const [loading, setLoading] = useState(false);

  const typeConfig: Record<ReferralType, { label: string; icon: React.ReactNode; description: string }> = {
    client_student: {
      label: "Estudante",
      icon: <GraduationCap className="h-6 w-6" />,
      description: "Estudante de área da saúde (medicina, odonto, enfermagem...)",
    },
    client_professional: {
      label: "Profissional",
      icon: <Stethoscope className="h-6 w-6" />,
      description: "Profissional de saúde autônomo ou em consultório próprio",
    },
    client_company: {
      label: "Empresa / Clínica",
      icon: <Building2 className="h-6 w-6" />,
      description: "Clínica, consultório, hospital, laboratório ou similar",
    },
  };

  const handleSelectType = (t: ReferralType) => {
    setType(t);
    setStep("form");
  };

  const handleStudentSubmit = async (data: StudentFormData) => {
    if (!user) return;
    setLoading(true);
    try {
      const metadata = buildStudentMetadata(data);
      const { error } = await supabase.from("referrals_v2").insert({
        program_id: null, // será resolvido pelo backend/webhook
        submitted_by_person_id: null,
        submitted_via: "manual_indica",
        target_type: "client_student",
        referred_name: data.lead_name,
        referred_email: data.lead_email,
        referred_phone: data.lead_phone,
        referred_document: data.lead_cpf?.replace(/\D/g, "") ?? null,
        metadata,
        origin_context: "indica_nova_indicacao",
      } as never);
      if (error) throw error;
      setStep("success");
    } catch (err: unknown) {
      toast.error((err as Error).message ?? "Erro ao enviar indicação.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfessionalSubmit = async (data: ProfessionalFormData) => {
    if (!user) return;
    setLoading(true);
    try {
      const metadata = buildProfessionalMetadata(data);
      const { error } = await supabase.from("referrals_v2").insert({
        program_id: null,
        submitted_by_person_id: null,
        submitted_via: "manual_indica",
        target_type: "client_professional",
        referred_name: data.lead_name,
        referred_email: data.lead_email,
        referred_phone: data.lead_phone,
        referred_document: data.lead_cpf?.replace(/\D/g, "") ?? null,
        metadata,
        origin_context: "indica_nova_indicacao",
      } as never);
      if (error) throw error;
      setStep("success");
    } catch (err: unknown) {
      toast.error((err as Error).message ?? "Erro ao enviar indicação.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySubmit = async (data: CompanyFormData) => {
    if (!user) return;
    setLoading(true);
    try {
      const metadata = buildCompanyMetadata(data);
      const { error } = await supabase.from("referrals_v2").insert({
        program_id: null,
        submitted_by_person_id: null,
        submitted_via: "manual_indica",
        target_type: "client_company",
        referred_name: data.contact_name,
        referred_email: data.contact_email,
        referred_phone: data.contact_phone,
        referred_document: data.contact_cpf?.replace(/\D/g, "") ?? null,
        metadata,
        origin_context: "indica_nova_indicacao",
      } as never);
      if (error) throw error;
      setStep("success");
    } catch (err: unknown) {
      toast.error((err as Error).message ?? "Erro ao enviar indicação.");
    } finally {
      setLoading(false);
    }
  };

  // ── Sucesso ─────────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="p-6 md:p-10 max-w-xl mx-auto">
        <Card className="p-10 flex flex-col items-center text-center bg-gradient-card">
          <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </div>
          <h2 className="text-xl font-bold">Indicação enviada!</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Sua indicação foi registrada com sucesso. O time Amigo vai entrar em contato em breve.
          </p>
          <div className="flex gap-3 mt-6 w-full">
            <Button variant="outline" className="flex-1" onClick={() => { setStep("select"); setType(null); }}>
              Nova indicação
            </Button>
            <Button className="flex-1 bg-gradient-primary" onClick={() => navigate("/app/indicacoes")}>
              Ver minhas indicações
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ── Seleção de tipo ──────────────────────────────────────────────────────────
  if (step === "select") {
    return (
      <div className="p-6 md:p-10 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Nova indicação</h1>
        <p className="text-muted-foreground mb-8">Quem você quer indicar?</p>
        <div className="grid md:grid-cols-3 gap-4">
          {(Object.keys(typeConfig) as ReferralType[]).map((t) => {
            const cfg = typeConfig[t];
            return (
              <Card
                key={t}
                className="p-6 cursor-pointer hover:shadow-elegant hover:border-primary/40 transition-all bg-gradient-card"
                onClick={() => handleSelectType(t)}
              >
                <div className="h-11 w-11 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center mb-3 shadow-glow">
                  {cfg.icon}
                </div>
                <p className="font-semibold">{cfg.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{cfg.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Formulário ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <button
        onClick={() => { setStep("select"); setType(null); }}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      {type && (
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow">
            {typeConfig[type].icon}
          </div>
          <h1 className="text-2xl font-bold">Indicar {typeConfig[type].label}</h1>
        </div>
      )}
      <p className="text-muted-foreground text-sm mb-6">Preencha os dados abaixo para registrar a indicação.</p>

      <Card className="p-6 bg-gradient-card">
        {type === "client_student" && <StudentForm onSubmit={handleStudentSubmit} loading={loading} />}
        {type === "client_professional" && <ProfessionalForm onSubmit={handleProfessionalSubmit} loading={loading} />}
        {type === "client_company" && <CompanyForm onSubmit={handleCompanySubmit} loading={loading} />}
      </Card>
    </div>
  );
}
