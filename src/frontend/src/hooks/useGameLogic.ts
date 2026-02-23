import { useState, useEffect, useCallback, useRef } from 'react';

interface GameState {
  playerX: number;
  playerY: number;
  playerVelocityY: number;
  obstacles: Array<{ x: number; y: number; width: number; height: number }>;
  collectibles: Array<{ x: number; y: number; collected: boolean }>;
}

export function useGameLogic() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    playerX: 100,
    playerY: 300,
    playerVelocityY: 0,
    obstacles: [],
    collectibles: []
  });

  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameId = useRef<number | null>(null);
  const lastObstacleTime = useRef<number>(0);
  const lastCollectibleTime = useRef<number>(0);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setGameState({
      playerX: 100,
      playerY: 300,
      playerVelocityY: 0,
      obstacles: [],
      collectibles: []
    });
    lastObstacleTime.current = Date.now();
    lastCollectibleTime.current = Date.now();
  }, []);

  const pauseGame = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const updateScore = useCallback((points: number) => {
    setScore((prev) => prev + points);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
        keysPressed.current.add(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || isGameOver) {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    const gameLoop = () => {
      setGameState((prev) => {
        let newPlayerX = prev.playerX;
        let newPlayerY = prev.playerY;
        let newVelocityY = prev.playerVelocityY;

        // Handle input
        const speed = 5;
        if (keysPressed.current.has('ArrowLeft')) {
          newPlayerX = Math.max(32, newPlayerX - speed);
        }
        if (keysPressed.current.has('ArrowRight')) {
          newPlayerX = Math.min(768, newPlayerX + speed);
        }
        if (keysPressed.current.has('ArrowUp')) {
          newPlayerY = Math.max(32, newPlayerY - speed);
        }
        if (keysPressed.current.has('ArrowDown')) {
          newPlayerY = Math.min(568, newPlayerY + speed);
        }

        // Spawn obstacles
        const now = Date.now();
        let newObstacles = [...prev.obstacles];
        if (now - lastObstacleTime.current > 2000) {
          const obstacleY = Math.random() * 500 + 50;
          newObstacles.push({
            x: 800,
            y: obstacleY,
            width: 60,
            height: 60
          });
          lastObstacleTime.current = now;
        }

        // Move obstacles
        newObstacles = newObstacles
          .map((obs) => ({ ...obs, x: obs.x - 3 }))
          .filter((obs) => obs.x > -100);

        // Spawn collectibles
        let newCollectibles = [...prev.collectibles];
        if (now - lastCollectibleTime.current > 3000) {
          const collectibleY = Math.random() * 500 + 50;
          newCollectibles.push({
            x: 800,
            y: collectibleY,
            collected: false
          });
          lastCollectibleTime.current = now;
        }

        // Move collectibles
        newCollectibles = newCollectibles
          .map((col) => ({ ...col, x: col.x - 2 }))
          .filter((col) => col.x > -50);

        // Check collision with obstacles
        for (const obstacle of newObstacles) {
          const dx = newPlayerX - (obstacle.x + obstacle.width / 2);
          const dy = newPlayerY - (obstacle.y + obstacle.height / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 40) {
            setIsGameOver(true);
            setIsPlaying(false);
            return prev;
          }
        }

        // Check collision with collectibles
        newCollectibles = newCollectibles.map((collectible) => {
          if (!collectible.collected) {
            const dx = newPlayerX - collectible.x;
            const dy = newPlayerY - collectible.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 40) {
              setScore((s) => s + 100);
              return { ...collectible, collected: true };
            }
          }
          return collectible;
        });

        return {
          playerX: newPlayerX,
          playerY: newPlayerY,
          playerVelocityY: newVelocityY,
          obstacles: newObstacles,
          collectibles: newCollectibles
        };
      });

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, isGameOver]);

  return {
    score,
    isPlaying,
    isGameOver,
    startGame,
    pauseGame,
    restartGame,
    updateScore,
    gameState
  };
}
