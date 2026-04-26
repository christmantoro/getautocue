"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeleprompterSettings, ScrollMode } from "@/types/teleprompter";
import { PlaybackControls } from "./PlaybackControls";
import { CueControls } from "./CueControls";
import { StepperControl } from "./StepperControl";
import { ColorPickers } from "./ColorPickers";
import { UtilityButtons } from "./UtilityButtons";

interface ControlPanelProps {
  isPlaying: boolean;
  isAtEnd: boolean;
  shouldShowPanel: boolean;
  settings: TeleprompterSettings;
  currentLine: number;
  totalLines: number;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onEdit: () => void;
  onScripts: () => void;
  onSettings: () => void;
  onScrollModeChange: (mode: ScrollMode) => void;
  onAdjustSpeed: (direction: "up" | "down") => void;
  onAdjustFontSize: (direction: "up" | "down") => void;
  onAdjustMaxWidth: (direction: "up" | "down") => void;
  onCycleCueStyle: () => void;
  onToggleCuePosition: () => void;
  onToggleFlipHorizontal: () => void;
  onToggleFlipVertical: () => void;
  onBackgroundColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
}

export function ControlPanel({
  isPlaying,
  isAtEnd,
  shouldShowPanel,
  settings,
  currentLine,
  totalLines,
  onPlay,
  onPause,
  onRestart,
  onEdit,
  onScripts,
  onSettings,
  onScrollModeChange,
  onAdjustSpeed,
  onAdjustFontSize,
  onAdjustMaxWidth,
  onCycleCueStyle,
  onToggleCuePosition,
  onToggleFlipHorizontal,
  onToggleFlipVertical,
  onBackgroundColorChange,
  onTextColorChange,
}: ControlPanelProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 transition-all duration-300 ease-in-out ${
        shouldShowPanel ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-black/40 backdrop-blur-md border-t border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left Controls */}
          <PlaybackControls
            isPlaying={isPlaying}
            isAtEnd={isAtEnd}
            onPlay={onPlay}
            onPause={onPause}
            onRestart={onRestart}
          />

          {/* Center Controls */}
          <div className="flex items-center gap-4">
            <Select
              value={settings.scrollMode}
              onValueChange={(value) =>
                onScrollModeChange(value as ScrollMode)
              }
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>

            {/* Current Line Indicator */}
            <div className="flex items-center gap-2 border-l border-white/20 pl-4">
              <span className="text-white text-sm">Line:</span>
              <span className="text-white font-mono text-lg w-12 text-center">
                {currentLine}/{totalLines}
              </span>
            </div>

            <CueControls
              cueIndicatorStyle={settings.cueIndicatorStyle}
              cueIndicatorPosition={settings.cueIndicatorPosition}
              onCycleStyle={onCycleCueStyle}
              onTogglePosition={onToggleCuePosition}
            />

            <StepperControl
              label="Speed"
              value={settings.autoSpeed}
              onDecrement={() => onAdjustSpeed("down")}
              onIncrement={() => onAdjustSpeed("up")}
            />

            <StepperControl
              label="Width"
              value={`${settings.maxWidth}%`}
              onDecrement={() => onAdjustMaxWidth("down")}
              onIncrement={() => onAdjustMaxWidth("up")}
              valueClassName="w-10 text-center"
              showBorderLeft
            />

            <StepperControl
              value={settings.fontSize}
              onDecrement={() => onAdjustFontSize("down")}
              onIncrement={() => onAdjustFontSize("up")}
              valueClassName="w-8 text-center"
              showBorderLeft
              decrementLabel="A-"
              incrementLabel="A+"
            />

            <ColorPickers
              backgroundColor={settings.backgroundColor}
              textColor={settings.textColor}
              onBackgroundColorChange={onBackgroundColorChange}
              onTextColorChange={onTextColorChange}
            />
          </div>

          {/* Right Controls */}
          <UtilityButtons
            flipHorizontal={settings.flipHorizontal}
            flipVertical={settings.flipVertical}
            onEdit={onEdit}
            onScripts={onScripts}
            onToggleFlipHorizontal={onToggleFlipHorizontal}
            onToggleFlipVertical={onToggleFlipVertical}
            onSettings={onSettings}
          />
        </div>
      </div>
    </div>
  );
}