import { useEffect, useRef, useState } from 'react';
import { gameAssets, preloadImages } from '../../lib/gameAssets';

interface GameCanvasProps {
  isPlaying: boolean;
  isGameOver: boolean;
  onScoreUpdate: (points: number) => void;
  gameState: {
    playerX: number;
    playerY: number;
    playerVelocityY: number;
    obstacles: Array<{ x: number; y: number; width: number; height: number }>;
    collectibles: Array<{ x: number; y: number; collected: boolean }>;
  };
}

export default function GameCanvas({ isPlaying, isGameOver, onScoreUpdate, gameState }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [images, setImages] = useState<{
    background: HTMLImageElement | null;
    player: HTMLImageElement | null;
    element: HTMLImageElement | null;
  }>({ background: null, player: null, element: null });

  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    preloadImages().then((loadedImages) => {
      setImages(loadedImages);
      setImagesLoaded(true);
    });
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
    const canvas = canvasRef.current;
    if (!canvas || !imagesLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      if (images.background) {
        ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
      } else {
        // Fallback gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'oklch(0.15 0.05 270)');
        gradient.addColorStop(1, 'oklch(0.08 0.08 280)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw obstacles
      gameState.obstacles.forEach((obstacle) => {
        if (images.element) {
          ctx.drawImage(images.element, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else {
          ctx.fillStyle = 'oklch(0.55 0.25 30)';
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
      });

      // Draw collectibles
      gameState.collectibles.forEach((collectible) => {
        if (!collectible.collected) {
          ctx.save();
          ctx.translate(collectible.x + 20, collectible.y + 20);
          ctx.rotate(Date.now() / 500);
          
          if (images.element) {
            ctx.drawImage(images.element, -20, -20, 40, 40);
          } else {
            ctx.fillStyle = 'oklch(0.75 0.25 140)';
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      });

      // Draw player
      if (images.player) {
        ctx.drawImage(images.player, gameState.playerX - 32, gameState.playerY - 32, 64, 64);
      } else {
        ctx.fillStyle = 'oklch(0.65 0.28 200)';
        ctx.beginPath();
        ctx.arc(gameState.playerX, gameState.playerY, 25, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw game over overlay
      if (isGameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'oklch(0.85 0.25 30)';
        ctx.font = 'bold 48px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.fillStyle = 'oklch(0.75 0.15 200)';
        ctx.font = '24px system-ui';
        ctx.fillText('Press Restart to play again', canvas.width / 2, canvas.height / 2 + 30);
      }

      if (!isGameOver && !isPlaying) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'oklch(0.85 0.2 140)';
        ctx.font = 'bold 36px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Press Start to Begin', canvas.width / 2, canvas.height / 2 - 40);
        
        ctx.fillStyle = 'oklch(0.75 0.15 200)';
        ctx.font = '20px system-ui';
        ctx.fillText('Use Arrow Keys to Move', canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText('Collect green orbs, avoid red obstacles', canvas.width / 2, canvas.height / 2 + 40);
      }
    };

    render();
  }, [isPlaying, isGameOver, gameState, imagesLoaded, images]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-4 border-game-accent rounded-lg shadow-2xl shadow-game-accent/20 bg-game-dark"
      />
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-game-dark/90 rounded-lg">
          <p className="text-game-light text-lg">Loading game assets...</p>
        </div>
      )}
    </div>
  );
}
