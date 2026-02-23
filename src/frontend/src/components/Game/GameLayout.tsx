import { ReactNode } from 'react';
import { Gamepad2 } from 'lucide-react';

interface GameLayoutProps {
  children: ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'game-arena';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-game-dark via-game-mid to-game-dark">
      <header className="w-full py-6 px-4 border-b border-game-accent/20 backdrop-blur-sm bg-game-dark/50">
        <div className="container mx-auto flex items-center justify-center gap-3">
          <Gamepad2 className="w-8 h-8 text-game-accent" />
          <h1 className="text-3xl md:text-4xl font-display font-bold text-game-light tracking-tight">
            Game Arena
          </h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>

      <footer className="w-full py-4 px-4 border-t border-game-accent/20 backdrop-blur-sm bg-game-dark/50">
        <div className="container mx-auto text-center text-sm text-game-muted">
          <p>
            © {currentYear} Game Arena. Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-game-accent hover:text-game-accent-bright transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
