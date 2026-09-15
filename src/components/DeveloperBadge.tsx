export function DeveloperBadge() {
  return (
    <footer className="w-full py-4 px-6 text-center border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-slate-950/80 border border-purple-500/30 shadow-xl shadow-purple-950/20">
        <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse"></span>

        <a
          href="https://professor-anderson.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent font-bold hover:opacity-80 transition-opacity"
        >
          Desenvolvido por: Prof. Anderson - Labs Software Engineering - 2026
        </a>
      </div>
    </footer>
  );
}
