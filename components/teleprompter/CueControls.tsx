"use client";

import { Button } from "@/components/ui/button";
import { CueIndicatorStyle, CueIndicatorPosition } from "@/types/teleprompter";

interface CueControlsProps {
  cueIndicatorStyle: CueIndicatorStyle;
  cueIndicatorPosition: CueIndicatorPosition;
  onCycleStyle: () => void;
  onTogglePosition: () => void;
}

const STYLE_LABELS: Record<CueIndicatorStyle, string> = {
  line: "\u2500",
  "arrow-left": "\u25C0",
  "arrow-right": "\u25B6",
  "bracket-left": "\u27E8",
  "bracket-right": "\u27E9",
  none: "\u2715",
};

export function CueControls({
  cueIndicatorStyle,
  cueIndicatorPosition,
  onCycleStyle,
  onTogglePosition,
}: CueControlsProps) {
  return (
    <div className="flex items-center gap-2 border-l border-white/20 pl-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onCycleStyle}
        className="text-white hover:text-white hover:bg-white/20 p-2"
        title="Change Cue Indicator Style"
      >
        <span className="text-xs font-bold">
          {STYLE_LABELS[cueIndicatorStyle]}
        </span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onTogglePosition}
        className="text-white hover:text-white hover:bg-white/20 p-2 text-xs"
        title="Toggle Cue Position (Top/Center)"
      >
        {cueIndicatorPosition === "top" ? "TOP" : "CTR"}
      </Button>
    </div>
  );
}