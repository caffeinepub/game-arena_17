import { useState, useEffect } from 'react';
import GameCanvas from '../components/Game/GameCanvas';
import GameControls from '../components/Game/GameControls';
import ScoreDisplay from '../components/Game/ScoreDisplay';
import GameLayout from '../components/Game/GameLayout';
import { useGameLogic } from '../hooks/useGameLogic';
import { useHighScore } from '../hooks/useHighScore';

export default function GamePage() {
  const {
    score,
    isPlaying,
    isGameOver,
    startGame,
    pauseGame,
    restartGame,
    updateScore,
    gameState
  } = useGameLogic();

  const { highScore, submitHighScore, isSubmitting } = useHighScore();
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);

  useEffect(() => {
    if (isGameOver && !hasSubmittedScore && score > 0) {
      submitHighScore(score);
      setHasSubmittedScore(true);
    }
  }, [isGameOver, score, hasSubmittedScore, submitHighScore]);

  useEffect(() => {
    if (isPlaying) {
      setHasSubmittedScore(false);
    }
  }, [isPlaying]);

  return (
    <GameLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-6">
        <ScoreDisplay 
          currentScore={score} 
          highScore={highScore || 0}
          isSubmitting={isSubmitting}
        />
        
        <GameCanvas
          isPlaying={isPlaying}
          isGameOver={isGameOver}
          onScoreUpdate={updateScore}
          gameState={gameState}
        />
        
        <GameControls
          isPlaying={isPlaying}
          isGameOver={isGameOver}
          onStart={startGame}
          onPause={pauseGame}
          onRestart={restartGame}
        />
      </div>
    </GameLayout>
  );
}
