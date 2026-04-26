import { useState, useEffect } from "react";

export function useLineTracker(
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
  script: string
) {
  const [currentLine, setCurrentLine] = useState(1);
  const totalLines = script.split("\n").length;

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollProgress =
        container.scrollTop / (container.scrollHeight - container.clientHeight);
      const estimatedLine = Math.floor(scrollProgress * totalLines) + 1;
      setCurrentLine(Math.min(Math.max(1, estimatedLine), totalLines));
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef, script, totalLines]);

  return { currentLine, totalLines };
}