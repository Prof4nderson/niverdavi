import { ErrorBoundary } from "@/components/error-boundary"; // Ajuste o caminho se necessário
import { BirthdayApp } from "@/components/birthday-app"; // Exemplo do componente interno
import { Toaster } from "sonner";

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
        <main className="flex-1">
          <BirthdayApp />
        </main>
        
        {/* Rodapé com o badge integradíssimo ao padrão Cyberpunk Labs */}
        <footer className="w-full py-4 px-6 text-center border-t border-cyan-500/20 bg-slate-950/90 backdrop-blur-md">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-slate-900/80 border border-cyan-500/30 shadow-lg shadow-cyan-950/30">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
            
            <a 
              href="https://professor-anderson.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-300 bg-clip-text text-transparent font-bold hover:opacity-80 transition-opacity"
            >
              Desenvolvido por Prof. Anderson - Labs Engenharia de Software
            </a>
            
            <span className="text-slate-600">|</span>
            
            <span className="text-cyan-400/70 font-mono text-[10px] tracking-wide">
              Powered by Gemini
            </span>
          </div>
        </footer>

        <Toaster richColors position="top-center"/>
      </div>
    </ErrorBoundary>
  );
}