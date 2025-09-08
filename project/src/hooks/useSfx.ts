export const useSfx = () => {
  const hoverSrc = import.meta.env.VITE_SFX_HOVER as string | undefined;
  const clickSrc = import.meta.env.VITE_SFX_CLICK as string | undefined;

  const play = (src?: string) => {
    if (!src) return;
    try {
      const audio = new Audio(src);
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } catch {
      // no-op
    }
  };

  return {
    playHover: () => play(hoverSrc),
    playClick: () => play(clickSrc)
  };
};


