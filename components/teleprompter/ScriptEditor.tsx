"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface ScriptEditorProps {
  script: string;
  onScriptChange: (value: string) => void;
  onClose: () => void;
}

export function ScriptEditor({
  script,
  onScriptChange,
  onClose,
}: ScriptEditorProps) {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Script Editor</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-4">
          <Textarea
            value={script}
            onChange={(e) => onScriptChange(e.target.value)}
            placeholder="Enter your script here..."
            className="min-h-[400px] font-mono text-base resize-none border-0 focus-visible:ring-0"
          />
        </div>
      </div>
    </div>
  );
}