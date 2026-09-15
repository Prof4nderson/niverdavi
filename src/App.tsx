import { Toaster } from "@/components/ui/sonner";
import BirthdayApp from "@/components/davi/BirthdayApp";
import ErrorBoundary from "./components/ErrorBoundary";
import { DeveloperBadge } from "@/components/DeveloperBadge"; // Importando o seu componente

export default function App(){
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
        <main className="flex-1">
          <BirthdayApp />
        </main>
        
        {/* Renderizando o badge reutilizável */}
        <DeveloperBadge />

        <Toaster richColors position="top-center"/>
      </div>
    </ErrorBoundary>
  );
}