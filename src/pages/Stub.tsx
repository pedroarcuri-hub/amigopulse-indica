import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export function Stub({ title, description }: { title: string; description?: string }) {
  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
      {description && <p className="text-muted-foreground mb-6">{description}</p>}
      <Card className="p-8 flex flex-col items-center justify-center text-center bg-gradient-card">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
          <Construction className="h-6 w-6 text-primary" />
        </div>
        <p className="font-medium">Em construção</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          Esta tela faz parte da migração do Amigo Indica e será implementada nas próximas fases.
        </p>
      </Card>
    </div>
  );
}
