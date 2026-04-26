"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  isAtEnd: boolean;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
}

export function PlaybackControls({
  isPlaying,
  isAtEnd,
  onPlay,
  onPause,
  onRestart,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={isPlaying ? onPause : onPlay}
        disabled={isAtEnd && !isPlaying}
        className={`${
          isPlaying
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-pink-500 hover:bg-pink-600 text-white"
        } px-6 py-2 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Start
          </>
        )}
      </Button>

      <Button
        onClick={onRestart}
        variant="outline"
        className="bg-white/10 border-white/20 hover:text-white text-white hover:bg-white/20 px-4 py-2 rounded-full"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Restart
      </Button>
    </div>
  );
}