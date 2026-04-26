"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Edit3, FlipHorizontal, FlipVertical, Maximize, Minimize, Settings } from "lucide-react";

interface UtilityButtonsProps {
  flipHorizontal: boolean;
  flipVertical: boolean;
  onEdit: () => void;
  onScripts: () => void;
  onToggleFlipHorizontal: () => void;
  onToggleFlipVertical: () => void;
  onSettings: () => void;
}

export function UtilityButtons({
  flipHorizontal,
  flipVertical,
  onEdit,
  onScripts,
  onToggleFlipHorizontal,
  onToggleFlipVertical,
  onSettings,
}: UtilityButtonsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onScripts}
        className="text-white hover:text-white hover:bg-white/20 p-2"
        title="My Scripts"
      >
        <BookOpen className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="text-white hover:text-white hover:bg-white/20 p-2"
        title="Edit Script"
      >
        <Edit3 className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleFlipHorizontal}
        className={`text-white hover:text-white hover:bg-white/20 p-2 ${
          flipHorizontal ? "bg-white/20" : ""
        }`}
        title="Flip Horizontal"
      >
        <FlipHorizontal className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleFlipVertical}
        className={`text-white hover:text-white hover:bg-white/20 p-2 ${
          flipVertical ? "bg-white/20" : ""
        }`}
        title="Flip Vertical"
      >
        <FlipVertical className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleFullscreen}
        className={`text-white hover:text-white hover:bg-white/20 p-2 ${isFullscreen ? "bg-white/20" : ""}`}
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onSettings}
        className="text-white hover:text-white hover:bg-white/20 p-2"
        title="Settings"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
}