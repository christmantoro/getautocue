"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { KEYBOARD_SHORTCUTS } from "@/types/teleprompter";

interface SettingsOverlayProps {
  onClose: () => void;
}

export function SettingsOverlay({ onClose }: SettingsOverlayProps) {
  const midPoint = Math.ceil(KEYBOARD_SHORTCUTS.length / 2);
  const leftColumn = KEYBOARD_SHORTCUTS.slice(0, midPoint);
  const rightColumn = KEYBOARD_SHORTCUTS.slice(midPoint);

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              {leftColumn.map(({ key, action }) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{key}</span>
                  <span className="text-muted-foreground">{action}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {rightColumn.map(({ key, action }) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{key}</span>
                  <span className="text-muted-foreground">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}