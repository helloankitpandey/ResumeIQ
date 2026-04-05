/**
 * useScrollReveal Hook
 *
 * Triggers a CSS reveal animation when a DOM element enters the
 * viewport, powered by the Intersection Observer API.
 *
 * @param threshold  – fraction of the element that must be visible (0–1)
 * @param rootMargin – margin around the root to grow / shrink the trigger area
 * @param once       – if true (default), the animation fires only on the first appearance
 *
 * Returns:
 *   ref       – attach to the target element
 *   isVisible – true once the element is in the viewport
 *
 * Example:
 *   const { ref, isVisible } = useScrollReveal();
 *   <div ref={ref} className={isVisible ? "opacity-100" : "opacity-0"} />
 */

import { useEffect, useRef, useState } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -60px 0px",
  once = true,
}: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
