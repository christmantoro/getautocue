import { useEffect, useRef } from "react";
import { ScrollMode } from "@/types/teleprompter";

interface UseKeyboardShortcutsParams {
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  isAtEnd: boolean;
  showEditor: boolean;
  setShowEditor: (v: boolean) => void;
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
  scrollMode: ScrollMode;
  manualScrollDirection: "up" | "down" | null;
  setManualScrollDirection: (dir: "up" | "down" | null) => void;
  handleStart: () => void;
  handlePause: () => void;
  handleStop: () => void;
  handleRestart: () => void;
  adjustSpeed: (direction: "up" | "down") => void;
  adjustFontSize: (direction: "up" | "down") => void;
  adjustMaxWidth: (direction: "up" | "down") => void;
  toggleFlipHorizontal: () => void;
  toggleFlipVertical: () => void;
  cycleCueIndicatorStyle: () => void;
  toggleCueIndicatorPosition: () => void;
}

export function useKeyboardShortcuts({
  isPlaying,
  setIsPlaying,
  isAtEnd,
  showEditor,
  setShowEditor,
  showSettings,
  setShowSettings,
  scrollMode,
  manualScrollDirection,
  setManualScrollDirection,
  handleStart,
  handlePause,
  handleStop,
  handleRestart,
  adjustSpeed,
  adjustFontSize,
  adjustMaxWidth,
  toggleFlipHorizontal,
  toggleFlipVertical,
  cycleCueIndicatorStyle,
  toggleCueIndicatorPosition,
}: UseKeyboardShortcutsParams) {
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (showEditor || showSettings) {
        if (e.key !== "Escape") return;
      }

      keysPressed.current.add(e.key.toLowerCase());

      if (scrollMode === "manual") {
        if (e.key === "ArrowUp" && !manualScrollDirection) {
          e.preventDefault();
          setManualScrollDirection("up");
        } else if (e.key === "ArrowDown" && !manualScrollDirection) {
          e.preventDefault();
          setManualScrollDirection("down");
        }
      }

      if (e.repeat) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "p":
          e.preventDefault();
          isPlaying ? handlePause() : handleStart();
          break;
        case "s":
          e.preventDefault();
          handleStop();
          break;
        case "r":
          e.preventDefault();
          handleRestart();
          break;
        case "arrowleft":
          adjustSpeed("down");
          break;
        case "arrowright":
          adjustSpeed("up");
          break;
        case "[":
          adjustMaxWidth("down");
          break;
        case "]":
          adjustMaxWidth("up");
          break;
        case "c":
          e.preventDefault();
          cycleCueIndicatorStyle();
          break;
        case "t":
          e.preventDefault();
          toggleCueIndicatorPosition();
          break;
        case "h":
          e.preventDefault();
          toggleFlipHorizontal();
          break;
        case "v":
          e.preventDefault();
          toggleFlipVertical();
          break;
        case "e":
          e.preventDefault();
          setShowEditor(!showEditor);
          break;
        case "escape":
          e.preventDefault();
          setShowEditor(false);
          setShowSettings(false);
          break;
        case "+":
        case "=":
          e.preventDefault();
          adjustFontSize("up");
          break;
        case "-":
        case "_":
          e.preventDefault();
          adjustFontSize("down");
          break;
        case "?":
          e.preventDefault();
          setShowSettings(!showSettings);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (showEditor || showSettings) return;

      keysPressed.current.delete(e.key.toLowerCase());

      if (scrollMode === "manual") {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          setManualScrollDirection(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    isPlaying,
    showEditor,
    showSettings,
    scrollMode,
    manualScrollDirection,
    setIsPlaying,
    setManualScrollDirection,
    setShowEditor,
    setShowSettings,
    handleStart,
    handlePause,
    handleStop,
    handleRestart,
    adjustSpeed,
    adjustFontSize,
    adjustMaxWidth,
    toggleFlipHorizontal,
    toggleFlipVertical,
    cycleCueIndicatorStyle,
    toggleCueIndicatorPosition,
  ]);
}