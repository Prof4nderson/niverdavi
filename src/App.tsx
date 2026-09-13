import { Toaster } from "@/components/ui/sonner";
import BirthdayApp from "@/components/davi/BirthdayApp";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App(){
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
        <main className="flex-1">
          <BirthdayApp />
        </main>
        
        {/* Badge Desenvolvido por Prof. Anderson (Mais escuro, legível e com link) */}
        <footer className="w-full py-4 px-6 text-center border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-slate-950/80 border border-purple-500/30 shadow-xl shadow-purple-950/20">
            <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse"></span>
            
            <a 
              href="https://professor-anderson.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent font-bold hover:opacity-80 transition-opacity"
            >
              Desenvolvido por Prof. Anderson - Labs Engenharia de Software
            </a>
            
            <span className="text-slate-500">|</span>
            
            <span className="text-slate-400 font-mono text-[10px] tracking-wide">
              Powered by Gemini
            </span>
          </div>
        </footer>

        <Toaster richColors position="top-center"/>
      </div>
    </ErrorBoundary>
  );
}