"use client";

import { CueIndicatorStyle, CueIndicatorPosition } from "@/types/teleprompter";

interface CueIndicatorProps {
  style: CueIndicatorStyle;
  position: CueIndicatorPosition;
  color: string;
}

export function CueIndicator({ style, position, color }: CueIndicatorProps) {
  if (style === "none" || style === undefined) {
    return null;
  }

  const topPosition = position === "top" ? "15%" : "50%";

  switch (style) {
    case "line":
      return (
        <div
          className="fixed left-0 right-0 h-px pointer-events-none z-50"
          style={{
            top: topPosition,
            backgroundColor: color,
            opacity: 0.8,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      );

    case "arrow-left":
      return (
        <div
          className="fixed left-4 pointer-events-none z-50"
          style={{ top: topPosition, transform: "translateY(-50%)" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      );

    case "arrow-right":
      return (
        <div
          className="fixed right-4 pointer-events-none z-50"
          style={{ top: topPosition, transform: "translateY(-50%)" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </div>
      );

    case "bracket-left":
      return (
        <div
          className="fixed left-4 pointer-events-none z-50"
          style={{ top: topPosition, transform: "translateY(-50%)" }}
        >
          <svg
            width="24"
            height="60"
            viewBox="0 0 24 60"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
          >
            <path d="M20 5L4 30l16 25" />
          </svg>
        </div>
      );

    case "bracket-right":
      return (
        <div
          className="fixed right-4 pointer-events-none z-50"
          style={{ top: topPosition, transform: "translateY(-50%)" }}
        >
          <svg
            width="24"
            height="60"
            viewBox="0 0 24 60"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
          >
            <path d="M4 5l16 25-16 25" />
          </svg>
        </div>
      );

    default:
      return null;
  }
}