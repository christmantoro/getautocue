"use client";

import { memo, useMemo } from "react";
import { TeleprompterSettings } from "@/types/teleprompter";
import { CueIndicator } from "./CueIndicator";

interface TeleprompterDisplayProps {
  script: string;
  settings: TeleprompterSettings;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
}

export const TeleprompterDisplay = memo(function TeleprompterDisplay({
  script,
  settings,
  scrollContainerRef,
  onScroll,
}: TeleprompterDisplayProps) {
  const lines = useMemo(() => script.split("\n"), [script]);

  const textTransform = [
    settings.flipHorizontal ? "scaleX(-1)" : "",
    settings.flipVertical ? "scaleY(-1)" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={scrollContainerRef}
      className="h-screen overflow-y-auto scrollbar-hide relative"
      style={{ color: settings.textColor }}
      onScroll={onScroll}
    >
      <CueIndicator
        style={settings.cueIndicatorStyle}
        position={settings.cueIndicatorPosition}
        color={settings.textColor}
      />

      <div
        className="p-8 leading-relaxed whitespace-pre-wrap min-h-screen flex items-center justify-center pb-32"
        style={{
          fontSize: `${settings.fontSize}px`,
          transform: textTransform || undefined,
        }}
      >
        <div
          className="text-center"
          style={{
            maxWidth: `${settings.maxWidth}%`,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className="min-h-[1.2em]">
              {line || "\u00A0"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});