import { Toaster } from "@/components/ui/sonner";
import BirthdayApp from "@/components/davi/BirthdayApp";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App(){
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col justify-between bg-background text-foreground">
        <main className="flex-1">
          <BirthdayApp />
        </main>
        
        {/* Badge Desenvolvido por Prof. Anderson */}
        <footer className="w-full py-4 px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/20 shadow-lg shadow-purple-500/5 backdrop-blur-md animate-pulse">
            <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-ping"></span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold">
              Desenvolvido por Prof. Anderson - Labs Engenharia de Software
            </span>
            <span className="text-muted-foreground/60">|</span>
            <span className="text-muted-foreground font-mono text-[10px]">
              Powered by Gemini
            </span>
          </div>
        </footer>

        <Toaster richColors position="top-center"/>
      </div>
    </ErrorBoundary>
  );
}