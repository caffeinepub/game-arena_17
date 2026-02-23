import { Trophy, Star } from 'lucide-react';

interface ScoreDisplayProps {
  currentScore: number;
  highScore: number;
  isSubmitting?: boolean;
}

export default function ScoreDisplay({ currentScore, highScore, isSubmitting }: ScoreDisplayProps) {
  return (
    <div className="flex gap-6 items-center justify-center flex-wrap">
      <div className="bg-game-dark/80 backdrop-blur-sm border-2 border-game-accent/40 rounded-xl px-8 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Star className="w-6 h-6 text-game-accent" />
          <div>
            <p className="text-game-muted text-sm font-medium uppercase tracking-wide">Current Score</p>
            <p className="text-game-light text-3xl font-display font-bold">{currentScore}</p>
          </div>
        </div>
      </div>

      <div className="bg-game-dark/80 backdrop-blur-sm border-2 border-game-accent-bright/40 rounded-xl px-8 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-game-accent-bright" />
          <div>
            <p className="text-game-muted text-sm font-medium uppercase tracking-wide">High Score</p>
            <p className="text-game-accent-bright text-3xl font-display font-bold">
              {isSubmitting ? '...' : highScore}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
