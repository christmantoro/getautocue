import { useState, useEffect, useRef } from "react";

export function useMouseTracker(threshold = 100) {
  const [mouseAtBottom, setMouseAtBottom] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        setMouseAtBottom(e.clientY > window.innerHeight - threshold);
        rafRef.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [threshold]);

  return { mouseAtBottom };
}