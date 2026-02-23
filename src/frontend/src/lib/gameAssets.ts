export const gameAssets = {
  background: '/assets/generated/game-background.dim_1920x1080.png',
  player: '/assets/generated/player-sprite.dim_128x128.png',
  element: '/assets/generated/game-element.dim_96x96.png',
};

export async function preloadImages(): Promise<{
  background: HTMLImageElement | null;
  player: HTMLImageElement | null;
  element: HTMLImageElement | null;
}> {
  const loadImage = (src: string): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  };

  const [background, player, element] = await Promise.all([
    loadImage(gameAssets.background),
    loadImage(gameAssets.player),
    loadImage(gameAssets.element),
  ]);

  return { background, player, element };
}
