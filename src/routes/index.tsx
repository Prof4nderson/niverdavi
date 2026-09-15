import { createFileRoute } from "@tanstack/react-router";
import BirthdayApp from "@/components/davi/BirthdayApp";
import { DeveloperBadge } from "@/components/DeveloperBadge"; // 1. Importe o badge aqui
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Davi 9 anos — Você está convocado!" },
      { name: "description", content: "Convite para celebrar os 9 anos do Davi em uma noite de festa, jogos e boas memórias." },
      { property: "og:title", content: "Davi 9 anos — Você está convocado!" },
      { property: "og:description", content: "Venha celebrar os 9 anos do Davi com festa, jogos e boas memórias." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
      <main className="flex-1">
        <BirthdayApp />
      </main>
      
      {/* 2. Adicione o seu componente do badge fixo no rodapé */}
      <DeveloperBadge />

      <Toaster richColors position="top-center" />
    </div>
  );
}