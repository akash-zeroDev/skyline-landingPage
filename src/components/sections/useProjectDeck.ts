import { useCallback, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export interface ProjectDeck {
  activeIndex: number;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  prefersReducedMotion: boolean;
}

/**
 * Small state helper for the "Project Deck" interaction.
 * Keeps the active index in range and exposes circular next/prev navigation.
 */
export function useProjectDeck(count: number): ProjectDeck {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion() ?? false;

  const goTo = useCallback(
    (index: number) => {
      if (count <= 0) return;
      setActiveIndex(((index % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => {
    setActiveIndex((prev) => (count <= 0 ? 0 : (prev + 1) % count));
  }, [count]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (count <= 0 ? 0 : (prev - 1 + count) % count));
  }, [count]);

  return { activeIndex, goTo, next, prev, prefersReducedMotion };
}

export default useProjectDeck;
