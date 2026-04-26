"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepperControlProps {
  label?: string;
  value: number | string;
  onDecrement: () => void;
  onIncrement: () => void;
  valueClassName?: string;
  showBorderLeft?: boolean;
  decrementLabel?: string;
  incrementLabel?: string;
}

export function StepperControl({
  label,
  value,
  onDecrement,
  onIncrement,
  valueClassName = "w-8 text-center",
  showBorderLeft = false,
  decrementLabel,
  incrementLabel,
}: StepperControlProps) {
  return (
    <div
      className={`flex items-center gap-2${showBorderLeft ? " border-l border-white/20 pl-4" : ""}`}
    >
      {label && <span className="text-white text-sm mr-1">{label}:</span>}
      <Button
        variant="ghost"
        size="sm"
        onClick={onDecrement}
        className="text-white hover:text-white hover:bg-white/20 p-2"
      >
        {decrementLabel ? (
          <span className="text-sm font-bold">{decrementLabel}</span>
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </Button>
      <span className={`text-white font-mono text-lg ${valueClassName}`}>
        {value}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onIncrement}
        className="text-white hover:text-white hover:bg-white/20 p-2"
      >
        {incrementLabel ? (
          <span className="text-sm font-bold">{incrementLabel}</span>
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}