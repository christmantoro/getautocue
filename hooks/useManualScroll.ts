import { useEffect, useRef } from "react";
import { TeleprompterSettings, ScrollMode } from "@/types/teleprompter";

interface UseManualScrollParams {
  scrollMode: ScrollMode;
  manualScrollDirection: "up" | "down" | null;
  setManualScrollDirection: (dir: "up" | "down" | null) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  currentSettingsRef: React.RefObject<TeleprompterSettings>;
  checkIfAtEnd: () => void;
}

export function useManualScroll({
  scrollMode,
  manualScrollDirection,
  setManualScrollDirection,
  scrollContainerRef,
  currentSettingsRef,
  checkIfAtEnd,
}: UseManualScrollParams) {
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (scrollMode === "manual" && manualScrollDirection) {
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

          let direction = manualScrollDirection === "up" ? -1 : 1;
          if (currentSettings.flipVertical) {
            direction *= -1;
          }

          const scrollAmount = scrollSpeed * deltaTime * direction;
          const newPosition = Math.max(0, container.scrollTop + scrollAmount);

          if (newPosition >= container.scrollHeight - container.clientHeight) {
            container.scrollTop =
              container.scrollHeight - container.clientHeight;
            setManualScrollDirection(null);
            checkIfAtEnd();
            return;
          }

          container.scrollTop = newPosition;
          checkIfAtEnd();
        }

        if (manualScrollDirection) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (!manualScrollDirection) {
        lastTimeRef.current = 0;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [scrollMode, manualScrollDirection, scrollContainerRef, currentSettingsRef, setManualScrollDirection, checkIfAtEnd]);
}