export type ScrollMode = "auto" | "manual";

export type CueIndicatorStyle =
  | "line"
  | "arrow-left"
  | "arrow-right"
  | "bracket-left"
  | "bracket-right"
  | "none";

export type CueIndicatorPosition = "top" | "center";

export interface TeleprompterSettings {
  scrollMode: ScrollMode;
  autoSpeed: number;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  maxWidth: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  cueIndicatorStyle: CueIndicatorStyle;
  cueIndicatorPosition: CueIndicatorPosition;
}

// Constraint constants
export const MIN_SPEED = 1;
export const MAX_SPEED = 10;
export const MIN_FONT_SIZE = 24;
export const MAX_FONT_SIZE = 120;
export const FONT_SIZE_STEP = 10;
export const MIN_MAX_WIDTH = 30;
export const MAX_MAX_WIDTH = 100;
export const MAX_WIDTH_STEP = 5;

export const CUE_INDICATOR_STYLES: CueIndicatorStyle[] = [
  "line",
  "arrow-left",
  "arrow-right",
  "bracket-left",
  "bracket-right",
  "none",
];

export const DEFAULT_SETTINGS: TeleprompterSettings = {
  scrollMode: "auto",
  autoSpeed: 3,
  backgroundColor: "#000000",
  textColor: "#ffffff",
  fontSize: 48,
  maxWidth: 80,
  flipHorizontal: false,
  flipVertical: false,
  cueIndicatorStyle: "line",
  cueIndicatorPosition: "top",
};

export const DEFAULT_SCRIPT = `Welcome to AutoCue Teleprompter - Your Professional Teleprompter Solution

Getting Started

This teleprompter is designed to help you deliver your script smoothly and confidently. Whether you're recording a video, giving a presentation, or practicing a speech, AutoCue has you covered.

Basic Controls

To start the teleprompter, press the Play button or hit the Spacebar. The text will begin scrolling at your selected speed. You can adjust the scrolling speed using the left and right arrow keys, or by clicking the chevron buttons in the control panel.

If you need to pause, simply press Spacebar again or click the Pause button. To restart from the beginning, press R or click the Restart button.

Manual Scrolling

For complete control, switch to Manual mode in the dropdown menu. In this mode, use the up and down arrow keys to scroll through your script at your own pace. This is perfect for when you want to control the timing yourself.

Display Customization

Make the teleprompter work for your setup. Adjust the font size using the A+ and A- buttons, or with the plus and minus keys. Change the text and background colors by clicking on the color pickers - great for matching your studio setup or reducing eye strain.

Need to mirror the display for a physical teleprompter rig? Use the H (horizontal flip) and V (vertical flip) buttons to orient the text correctly.

Editing Your Script

Click the edit button (or press E) to open the script editor. Paste your script, make changes, and close the editor when you're ready. Your changes are saved automatically.

Tips for Best Results

Position your camera so you're looking through the center of the text. Keep your eyes on the highlighted section as you read. Practice a few times to get comfortable with the pacing.

Remember, the goal is natural delivery. Don't rush - let the teleprompter do the work while you focus on connecting with your audience.

Happy recording!`;

export interface KeyboardShortcut {
  key: string;
  action: string;
}

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { key: "Space / P", action: "Start/Pause" },
  { key: "R", action: "Restart" },
  { key: "\u2190 / \u2192", action: "Adjust speed" },
  { key: "\u2191 / \u2193", action: "Manual scroll" },
  { key: "+ / -", action: "Font size" },
  { key: "[ / ]", action: "Text width" },
  { key: "T", action: "Cue position" },
  { key: "H", action: "Flip horizontal" },
  { key: "V", action: "Flip vertical" },
  { key: "E", action: "Edit script" },
  { key: "C", action: "Cue style" },
  { key: "Esc", action: "Close overlays" },
  { key: "?", action: "Show shortcuts" },
];