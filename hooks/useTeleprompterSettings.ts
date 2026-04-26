import { useState, useEffect, useRef } from "react";
import {
  TeleprompterSettings,
  ScrollMode,
  CueIndicatorStyle,
  DEFAULT_SETTINGS,
  MIN_SPEED,
  MAX_SPEED,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  FONT_SIZE_STEP,
  MIN_MAX_WIDTH,
  MAX_MAX_WIDTH,
  MAX_WIDTH_STEP,
  CUE_INDICATOR_STYLES,
} from "@/types/teleprompter";

export function useTeleprompterSettings() {
  const [settings, setSettings] = useState<TeleprompterSettings>(() => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem("teleprompter-settings");
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_SETTINGS;
  });
  const currentSettingsRef = useRef(settings);

  useEffect(() => {
    currentSettingsRef.current = settings;
    try {
      localStorage.setItem("teleprompter-settings", JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const adjustSpeed = (direction: "up" | "down") => {
    setSettings((prev) => ({
      ...prev,
      autoSpeed: Math.max(
        MIN_SPEED,
        Math.min(MAX_SPEED, prev.autoSpeed + (direction === "up" ? 1 : -1))
      ),
    }));
  };

  const adjustFontSize = (direction: "up" | "down") => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Math.max(
        MIN_FONT_SIZE,
        Math.min(MAX_FONT_SIZE, prev.fontSize + (direction === "up" ? FONT_SIZE_STEP : -FONT_SIZE_STEP))
      ),
    }));
  };

  const adjustMaxWidth = (direction: "up" | "down") => {
    setSettings((prev) => ({
      ...prev,
      maxWidth: Math.max(
        MIN_MAX_WIDTH,
        Math.min(MAX_MAX_WIDTH, prev.maxWidth + (direction === "up" ? MAX_WIDTH_STEP : -MAX_WIDTH_STEP))
      ),
    }));
  };

  const toggleFlipHorizontal = () => {
    setSettings((prev) => ({ ...prev, flipHorizontal: !prev.flipHorizontal }));
  };

  const toggleFlipVertical = () => {
    setSettings((prev) => ({ ...prev, flipVertical: !prev.flipVertical }));
  };

  const setBackgroundColor = (color: string) => {
    setSettings((prev) => ({ ...prev, backgroundColor: color }));
  };

  const setTextColor = (color: string) => {
    setSettings((prev) => ({ ...prev, textColor: color }));
  };

  const setScrollMode = (mode: ScrollMode) => {
    setSettings((prev) => ({ ...prev, scrollMode: mode }));
  };

  const cycleCueIndicatorStyle = () => {
    setSettings((prev) => {
      const currentIndex = CUE_INDICATOR_STYLES.indexOf(prev.cueIndicatorStyle);
      const nextIndex = (currentIndex + 1) % CUE_INDICATOR_STYLES.length;
      return { ...prev, cueIndicatorStyle: CUE_INDICATOR_STYLES[nextIndex] };
    });
  };

  const toggleCueIndicatorPosition = () => {
    setSettings((prev) => ({
      ...prev,
      cueIndicatorPosition: prev.cueIndicatorPosition === "top" ? "center" : "top",
    }));
  };

  return {
    settings,
    currentSettingsRef,
    adjustSpeed,
    adjustFontSize,
    adjustMaxWidth,
    toggleFlipHorizontal,
    toggleFlipVertical,
    setBackgroundColor,
    setTextColor,
    setScrollMode,
    cycleCueIndicatorStyle,
    toggleCueIndicatorPosition,
  };
}