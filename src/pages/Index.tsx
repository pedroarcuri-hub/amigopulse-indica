import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Trophy, Users, Wallet, ArrowRight, Zap, Target, Award } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-semibold">Amigo Indica</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
            Somos todos Amigo.<br />
            <span className="text-white/80">E tudo o que construímos cresce com as conexões que criamos.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/85 mt-6 max-w-2xl">
            O Amigo Indica é a forma de fortalecer, juntos, o que construímos todos os dias.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elegant">
              <Link to="/login">Entrar no programa <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur">
              <a href="#como-funciona" onClick={(e) => {
                e.preventDefault();
                document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
              }}>Como funciona</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Como você participa disso</h2>
        <p className="text-muted-foreground text-center mt-3 max-w-2xl mx-auto">
          Um processo simples que transforma conexões em crescimento para todos.
        </p>
        <div className="grid md:grid-cols-4 gap-5 mt-12">
          {[
            { i: Target, t: "Conecte", d: "Indique alguém que confia em você." },
            { i: Zap, t: "A gente cuida do resto", d: "O time Amigo conduz com cuidado e excelência." },
            { i: Trophy, t: "Acompanhe", d: "Veja o andamento e o impacto das suas conexões." },
            { i: Wallet, t: "Tudo se transforma em resultado", d: "Para você e para a Amigo." },
          ].map((step, i) => {
            const Icon = step.i;
            return (
              <Card key={step.t} className="p-6 bg-gradient-card hover:shadow-elegant transition-shadow">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground mb-4 shadow-glow">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">PASSO {i + 1}</p>
                <h3 className="font-semibold text-lg mt-1">{step.t}</h3>
                <p className="text-sm text-muted-foreground mt-2">{step.d}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider">Participação</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Cada conexão fortalece o que construímos juntos</h2>
              <p className="text-muted-foreground mt-4">
                Quanto mais você participa, maior o seu impacto dentro da Amigo.
              </p>
              <Button asChild className="mt-6 bg-gradient-primary shadow-elegant">
                <Link to="/login">Quero participar <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { n: "Primeiras conexões", c: "bg-bronze", min: "Participação inicial" },
                { n: "Conexões consistentes", c: "bg-silver", min: "Presença contínua" },
                { n: "Alta participação", c: "bg-gold", min: "Engajamento frequente" },
                { n: "Impacto ampliado", c: "bg-diamond", min: "Construção em conjunto" },
              ].map((l) => (
                <Card key={l.n} className="p-5">
                  <div className={`h-10 w-10 rounded-lg ${l.c} flex items-center justify-center shadow-md`}>
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-semibold mt-3">{l.n}</p>
                  <p className="text-xs text-muted-foreground">{l.min}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        Amigo Indica · Amigo Tech © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
