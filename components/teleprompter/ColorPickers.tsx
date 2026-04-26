"use client";

interface ColorPickersProps {
  backgroundColor: string;
  textColor: string;
  onBackgroundColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
}

export function ColorPickers({
  backgroundColor,
  textColor,
  onBackgroundColorChange,
  onTextColorChange,
}: ColorPickersProps) {
  return (
    <div className="flex items-center gap-2 border-l border-white/20 pl-4">
      <div className="relative group">
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => onBackgroundColorChange(e.target.value)}
          className="w-8 h-8 rounded-full border-2 border-white/20 cursor-pointer opacity-0 absolute inset-0"
        />
        <div
          className="w-8 h-8 rounded-full border-2 border-white/20 cursor-pointer"
          style={{ backgroundColor }}
        />
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Background Color
        </div>
      </div>

      <div className="relative group">
        <input
          type="color"
          value={textColor}
          onChange={(e) => onTextColorChange(e.target.value)}
          className="w-8 h-8 rounded-full border-2 border-white/20 cursor-pointer opacity-0 absolute inset-0"
        />
        <div
          className="w-8 h-8 rounded-full border-2 border-white/20 cursor-pointer flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor, color: textColor }}
        >
          A
        </div>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Text Color
        </div>
      </div>
    </div>
  );
}