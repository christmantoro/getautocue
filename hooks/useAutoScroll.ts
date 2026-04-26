import { useEffect, useRef, useCallback } from "react";
import { TeleprompterSettings } from "@/types/teleprompter";

interface UseAutoScrollParams {
  isPlaying: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  currentSettingsRef: React.RefObject<TeleprompterSettings>;
  onReachEnd: () => void;
  isAtEnd: boolean;
  setIsAtEnd: (value: boolean) => void;
}

export function useAutoScroll({
  isPlaying,
  scrollContainerRef,
  currentSettingsRef,
  onReachEnd,
  isAtEnd,
  setIsAtEnd,
}: UseAutoScrollParams) {
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const checkIfAtEnd = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const atBottom =
        container.scrollTop >=
        container.scrollHeight - container.clientHeight - 10;
      setIsAtEnd(atBottom);
    }
  }, [scrollContainerRef, setIsAtEnd]);

  useEffect(() => {
    if (isPlaying) {
      const animate = (currentTime: number) => {
        if (lastTimeRef.current === 0) {
          lastTimeRef.current = currentTime;
        }

        const deltaTime = currentTime - lastTimeRef.current;
        lastTimeRef.current = currentTime;

        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const currentSettings = currentSettingsRef.current;
          const scrollSpeed = (currentSettings.autoSpeed * 30) / 1000;
          const scrollAmount =
            scrollSpeed * deltaTime * (currentSettings.flipVertical ? -1 : 1);

          const newPosition = container.scrollTop + scrollAmount;

          if (currentSettings.flipVertical) {
            if (newPosition <= 0) {
              onReachEnd();
              return;
            }
          } else {
            if (
              newPosition >=
              container.scrollHeight - container.clientHeight
            ) {
              onReachEnd();
              return;
            }
          }

          container.scrollTop = newPosition;
          checkIfAtEnd();
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (!isPlaying) {
        lastTimeRef.current = 0;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, currentSettingsRef, scrollContainerRef, checkIfAtEnd, onReachEnd]);

  return { isAtEnd, setIsAtEnd, checkIfAtEnd };
}