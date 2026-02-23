import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  isPlaying: boolean;
  isGameOver: boolean;
  onStart: () => void;
  onPause: () => void;
  onRestart: () => void;
}

export default function GameControls({
  isPlaying,
  isGameOver,
  onStart,
  onPause,
  onRestart
}: GameControlsProps) {
  return (
    <div className="flex gap-4 items-center">
      {!isPlaying && !isGameOver && (
        <Button
          onClick={onStart}
          size="lg"
          className="bg-game-accent hover:bg-game-accent-bright text-game-dark font-bold px-8 py-6 text-lg transition-all transform hover:scale-105"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Game
        </Button>
      )}

      {isPlaying && !isGameOver && (
        <Button
          onClick={onPause}
          size="lg"
          variant="outline"
          className="border-game-accent text-game-accent hover:bg-game-accent hover:text-game-dark font-bold px-8 py-6 text-lg transition-all"
        >
          <Pause className="w-5 h-5 mr-2" />
          Pause
        </Button>
      )}

      {isGameOver && (
        <Button
          onClick={onRestart}
          size="lg"
          className="bg-game-accent hover:bg-game-accent-bright text-game-dark font-bold px-8 py-6 text-lg transition-all transform hover:scale-105"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Restart Game
        </Button>
      )}
    </div>
  );
}
