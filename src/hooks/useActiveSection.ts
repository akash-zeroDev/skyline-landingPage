import { useState, useEffect } from 'react';

/**
 * Custom hook to track which page section is currently active in the viewport
 * using IntersectionObserver.
 *
 * @param sectionIds - Array of section IDs (without hash, e.g. ['about', 'services', 'work', 'contact'])
 * @param rootMargin - IntersectionObserver rootMargin (default: offset for top floating pill navbar)
 * @returns The active section ID, or null if none is in view
 */
export function useActiveSection(
  sectionIds: string[],
  rootMargin: string = '-20% 0px -60% 0px'
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const visibleSections = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visibleSections.set(id, entry.intersectionRatio);
          } else {
            visibleSections.delete(id);
          }
        });

        // Determine the section with the highest intersection ratio
        if (visibleSections.size > 0) {
          let highestId = '';
          let maxRatio = -1;
          visibleSections.forEach((ratio, id) => {
            if (ratio > maxRatio) {
              maxRatio = ratio;
              highestId = id;
            }
          });
          if (highestId) {
            setActiveId(highestId);
          }
        }
      },
      {
        rootMargin,
        threshold: [0, 0.2, 0.5, 0.8],
      }
    );

    // Observe each section if it exists in the DOM
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, rootMargin]);

  return activeId;
}
