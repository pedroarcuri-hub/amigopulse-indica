import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  LayoutDashboard, Plus, ListChecks, Trophy, Wallet,
  Shield, LogOut, Users, FileText, Menu, BookOpen, LifeBuoy, BarChart3, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const colaboradorNav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/nova-indicacao", label: "Nova indicação", icon: Plus },
  { to: "/app/indicacoes", label: "Minhas indicações", icon: ListChecks },
  { to: "/app/ranking", label: "Ranking", icon: Trophy },
  { to: "/app/ganhos", label: "Meus ganhos", icon: Wallet },
  { to: "/app/regras", label: "Regras do programa", icon: BookOpen },
  { to: "/app/ajuda", label: "Central de ajuda", icon: LifeBuoy },
];

const adminNav = [
  { to: "/admin", label: "Visão geral", icon: Shield, exact: true },
  { to: "/admin/indicacoes", label: "Indicações", icon: FileText },
  { to: "/admin/ranking", label: "Ranking", icon: Trophy },
  { to: "/admin/metricas", label: "Métricas avançadas", icon: BarChart3 },
  { to: "/admin/pagamentos", label: "Pagamentos", icon: Wallet },
  { to: "/admin/usuarios", label: "Usuários", icon: Users },
];

export function AppLayout() {
  const { profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const nav = isAdminRoute ? adminNav : colaboradorNav;
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const initials = (profile?.nome ?? "AT")
    .split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const sidebarContent = (
    <>
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-bold leading-tight">Amigo Indica</p>
          <p className="text-xs text-muted-foreground leading-tight">Amigo Tech</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        {isAdmin && (
          <div className="pt-4 mt-4 border-t">
            <Link
              to={isAdminRoute ? "/app" : "/admin"}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent"
            >
              <Shield className="h-4 w-4" />
              {isAdminRoute ? "Voltar ao app" : "Painel admin"}
            </Link>
          </div>
        )}
      </nav>

      <div className="border-t p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.nome}</p>
            {profile?.area && (
              <Badge variant="secondary" className="text-[10px] capitalize h-4 px-1.5">
                {profile.area}
              </Badge>
            )}
          </div>
        </div>
        <Button onClick={handleSignOut} variant="ghost" size="sm" className="w-full justify-start">
          <LogOut className="h-4 w-4 mr-2" /> Sair
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar">
        {sidebarContent}
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between gap-2 border-b bg-sidebar px-4 py-3 sticky top-0 z-30">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 flex flex-col bg-sidebar">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <SheetDescription className="sr-only">Acesse as seções do Amigo Indica</SheetDescription>
              {sidebarContent}
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <p className="font-bold text-sm">Amigo Indica</p>
          </div>

          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
