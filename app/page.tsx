"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { DEFAULT_SCRIPT } from "@/types/teleprompter";
import { useTeleprompterSettings } from "@/hooks/useTeleprompterSettings";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useManualScroll } from "@/hooks/useManualScroll";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useLineTracker } from "@/hooks/useLineTracker";
import { useMouseTracker } from "@/hooks/useMouseTracker";
import { ScriptEditor } from "@/components/teleprompter/ScriptEditor";
import { SettingsOverlay } from "@/components/teleprompter/SettingsOverlay";
import { TeleprompterDisplay } from "@/components/teleprompter/TeleprompterDisplay";
import { ControlPanel } from "@/components/teleprompter/ControlPanel";
import { ErrorBoundary } from "@/components/teleprompter/ErrorBoundary";

export default function TeleprompterApp() {
  const [script, setScript] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_SCRIPT;
    try {
      return localStorage.getItem("teleprompter-script") ?? DEFAULT_SCRIPT;
    } catch {
      return DEFAULT_SCRIPT;
    }
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [pendingRestart, setPendingRestart] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [manualScrollDirection, setManualScrollDirection] = useState<
    "up" | "down" | null
  >(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem("teleprompter-script", script);
    } catch {}
  }, [script]);

  const {
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
  } = useTeleprompterSettings();

  const { mouseAtBottom } = useMouseTracker();
  const { currentLine, totalLines } = useLineTracker(scrollContainerRef, script);

  const handleReachEnd = useCallback(() => {
    setIsPlaying(false);
    setIsAtEnd(true);
  }, []);

  const { checkIfAtEnd } = useAutoScroll({
    isPlaying,
    scrollContainerRef,
    currentSettingsRef,
    onReachEnd: handleReachEnd,
    isAtEnd,
    setIsAtEnd,
  });

  useManualScroll({
    scrollMode: settings.scrollMode,
    manualScrollDirection,
    setManualScrollDirection,
    scrollContainerRef,
    currentSettingsRef,
    checkIfAtEnd,
  });

  const handleStart = () => {
    if (!isAtEnd) {
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    if (scrollContainerRef.current) {
      const currentSettings = currentSettingsRef.current;
      if (currentSettings.flipVertical) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight -
          scrollContainerRef.current.clientHeight;
      } else {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
    setIsAtEnd(false);
  };

  const handleRestart = () => {
    handleStop();
    setPendingRestart(true);
  };

  useEffect(() => {
    if (pendingRestart && !isPlaying && !isAtEnd) {
      setPendingRestart(false);
      setIsPlaying(true);
    }
  }, [pendingRestart, isPlaying, isAtEnd]);

  useKeyboardShortcuts({
    isPlaying,
    setIsPlaying,
    isAtEnd,
    showEditor,
    setShowEditor,
    showSettings,
    setShowSettings,
    scrollMode: settings.scrollMode,
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
  });

  const shouldShowPanel = !isPlaying || mouseAtBottom;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      {showEditor && (
        <ScriptEditor
          script={script}
          onScriptChange={setScript}
          onClose={() => setShowEditor(false)}
        />
      )}

      {showSettings && (
        <SettingsOverlay onClose={() => setShowSettings(false)} />
      )}

      <ErrorBoundary>
        <TeleprompterDisplay
          script={script}
          settings={settings}
          scrollContainerRef={scrollContainerRef}
          onScroll={checkIfAtEnd}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <ControlPanel
          isPlaying={isPlaying}
          isAtEnd={isAtEnd}
          shouldShowPanel={shouldShowPanel}
          settings={settings}
          currentLine={currentLine}
          totalLines={totalLines}
          onPlay={handleStart}
          onPause={handlePause}
          onRestart={handleRestart}
          onEdit={() => setShowEditor(true)}
          onSettings={() => setShowSettings(true)}
          onScrollModeChange={setScrollMode}
          onAdjustSpeed={adjustSpeed}
          onAdjustFontSize={adjustFontSize}
          onAdjustMaxWidth={adjustMaxWidth}
          onCycleCueStyle={cycleCueIndicatorStyle}
          onToggleCuePosition={toggleCueIndicatorPosition}
          onToggleFlipHorizontal={toggleFlipHorizontal}
          onToggleFlipVertical={toggleFlipVertical}
          onBackgroundColorChange={setBackgroundColor}
          onTextColorChange={setTextColor}
        />
      </ErrorBoundary>
    </div>
  );
}