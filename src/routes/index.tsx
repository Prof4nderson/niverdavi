import { createFileRoute } from "@tanstack/react-router";
import BirthdayApp from "@/components/davi/BirthdayApp";
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
    <>
      <BirthdayApp />
      <Toaster richColors position="top-center" />
    </>
  );
}
