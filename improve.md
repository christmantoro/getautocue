# AutoCue — Improvement Plan

> Reviewed: 2026-04-26  
> Branch: main

---

## Critical (Fix Immediately)

### 1. Remove Exposed API Key
- **File:** `.env` — contains a hardcoded AssemblyAI API key that is committed to the repo
- Remove the file from git history (`git filter-branch` or `git-filter-repo`)
- Add `.env` to `.gitignore`
- Rotate the key on the AssemblyAI dashboard immediately
- **Status:** `.env` confirmed NOT tracked in git; `.gitignore` already has `.env*`. Key (`e033602032514be0bf58a0fd5501d72f`) must still be rotated on the AssemblyAI dashboard.

### 2. Re-enable Build-Time Error Checking ✅
- **File:** `next.config.mjs`
- `eslint: { ignoreDuringBuilds: true }` and `typescript: { ignoreBuildErrors: true }` are both set
- Remove both flags — they mask real bugs and type errors
- Fix any TypeScript errors that surface after re-enabling
- **Done:** Both flags removed. `tsc --noEmit` passes with zero errors.

---

## High Priority

### 3. Persist Settings to localStorage ✅
- **File:** `hooks/useTeleprompterSettings.ts`
- Settings (speed, font size, colors, cue style, etc.) reset on every page reload
- Add `useEffect` to load from `localStorage` on mount and write on every settings change
- Persist `script` content from `page.tsx` the same way
- **Done:** `useTeleprompterSettings` now uses a lazy `useState` initializer to hydrate from `localStorage` and a `useEffect` to persist on every change. Script content in `page.tsx` persists the same way.

### 4. Fix `handleRestart` Race Condition ✅
- **File:** `app/page.tsx:96`
- `setTimeout(() => setIsPlaying(true), 100)` is a fragile timing hack
- Replace with a `useEffect` that watches a `pendingRestart` state flag and starts playback after scroll position is confirmed reset
- Or expose a callback from `useAutoScroll` / `useManualScroll` that fires once scroll is at 0
- **Done:** Replaced with `pendingRestart` state flag + `useEffect` that triggers `setIsPlaying(true)` only after React commits `isPlaying=false` and `isAtEnd=false`.

### 5. Keyboard Shortcut Isolation in Script Editor ✅
- **File:** `hooks/useKeyboardShortcuts.ts`
- Keyboard shortcuts fire even when the user is typing in the `ScriptEditor` textarea
- Check `document.activeElement` or pass an `isEditorOpen` guard before intercepting keys
- Currently pressing Space or Arrow keys while editing the script toggles playback
- **Done:** Added overlay guard — when `showEditor || showSettings` is true, only `Escape` is processed regardless of focus position.

### 6. Remove / Wire Up Dead Code ✅
- **File:** `lib/fuse_matching.ts` — `FuseTextMatcher` class is never used
- `fuse.js` is an installed dependency that goes unused
- Either implement voice-sync word highlighting (the likely original intent) or delete the file and remove the dependency
- **Done:** `lib/fuse_matching.ts` deleted; `fuse.js` removed from `package.json`.

### 7. Add Error Boundaries ✅
- No error boundaries exist anywhere
- Wrap `TeleprompterDisplay` and `ControlPanel` in a React `ErrorBoundary` component
- Prevents a single hook error from crashing the entire page
- **Done:** `components/teleprompter/ErrorBoundary.tsx` created; `TeleprompterDisplay` and `ControlPanel` each wrapped in a separate boundary in `page.tsx`.

---

## Medium Priority

### 8. Prop Drilling — ControlPanel
- **File:** `app/page.tsx:149–171` + `components/teleprompter/ControlPanel.tsx`
- `ControlPanel` receives 20+ props; `page.tsx` passes almost its entire state tree downward
- Extract a `TeleprompterContext` with `useContext` or use a lightweight state store (Zustand)
- This will also simplify `useKeyboardShortcuts` which currently takes 20+ arguments

### 9. Memoize Expensive Renders ✅
- **File:** `components/teleprompter/TeleprompterDisplay.tsx`
- `script.split('\n')` runs on every render inside the component
- Move to `useMemo(() => script.split('\n'), [script])`
- Wrap `TeleprompterDisplay` in `React.memo`
- Memoize `CueIndicator` SVG — it re-renders on every parent render even when cue style hasn't changed
- **Done:** `TeleprompterDisplay` wrapped in `React.memo`; `script.split('\n')` moved to `useMemo`. `CueIndicator` memoization still pending.

### 10. Mouse Tracker Debouncing ✅
- **File:** `hooks/useMouseTracker.ts`
- `mousemove` fires at up to 60–250 events per second with no throttle
- Add a `requestAnimationFrame` gate or `lodash.throttle` / manual throttle (16ms) to reduce unnecessary re-renders
- **Done:** `requestAnimationFrame` gate added — handler skips if a frame is already queued, capping updates to one per frame.

### 11. Accurate Line Tracking
- **File:** `hooks/useLineTracker.ts`
- Current implementation estimates line by `scrollProgress * totalLines` — inaccurate for variable-height lines
- Use `IntersectionObserver` or measure each line element's `offsetTop` to track which line is at the cue position
- This also enables future "jump to line" features

### 12. Mobile / Responsive Layout
- Control panel assumes a wide screen; buttons overflow on viewports under ~768px
- Add responsive Tailwind breakpoints to `ControlPanel` and `StepperControl`
- Ensure touch targets are at minimum 44×44px
- The teleprompter itself is usable on mobile — the controls just need responsive grouping

### 13. Accessibility (ARIA + Focus)
- Most icon-only buttons have no `aria-label` (Edit, Flip, Fullscreen, etc.)
- `SettingsOverlay` and `ScriptEditor` should use `role="dialog"` with `aria-modal="true"` and trap focus
- Add `aria-live="polite"` to the line counter so screen readers announce position changes
- Ensure all interactive elements have visible `:focus-visible` outlines

---

## Low Priority / Nice to Have

### 14. Script Management
- Add "Load example script" templates for common use cases (speech, video intro, interview)
- Add import from `.txt` file via `<input type="file">`
- Add export script as `.txt`
- Store multiple saved scripts in `localStorage` with a simple name/date list

### 15. Color Presets
- Let users save current background + text color as a named preset
- Provide 4–5 built-in presets (black/white, white/black, dark green/white studio look, etc.)
- Store custom presets in `localStorage`

### 16. Speed Profile (Acceleration)
- Add an optional "ease in" ramp at playback start (0→target speed over ~2 seconds)
- Helps presenters sync naturally instead of jumping to full speed

### 17. Bookmark / Marker System
- Allow pressing `M` to drop a bookmark at the current scroll position
- Show bookmark indicators on a scroll track
- Jump to next/previous bookmark with `[` / `]`

### 18. Add Tests
- Zero test coverage today
- Start with unit tests for the most critical hooks:
  - `useTeleprompterSettings` — state transitions, localStorage round-trip
  - `useAutoScroll` — RAF callback, reach-end detection
  - `useKeyboardShortcuts` — key event mapping
- Use **Vitest** + **React Testing Library** (compatible with Next.js 15 App Router)
- Add one smoke E2E test with **Playwright**: load page → enter script → play → verify scrolling

### 19. Re-integrate Voice Control (if desired)
- The codebase has remnants of AssemblyAI voice mode (`fuse_matching.ts`, deleted routes and hooks)
- If voice-driven auto-scroll is a roadmap feature:
  - Restore the AssemblyAI streaming token API route (server-side, never expose key to client)
  - Use `fuse_matching.ts` to match transcribed words against script lines
  - Highlight the current spoken word and drive scroll position from match confidence

### 20. Content Security Policy Headers
- Add `next.config.mjs` `headers()` export with a strict CSP
- Prevents XSS from injected scripts if the app ever renders user HTML

---

## Suggested Implementation Order

| Phase | Items | Goal | Status |
|-------|-------|------|--------|
| 1 — Immediate | #1, #2 | Security & build integrity | #2 ✅ · #1 partial (key needs rotation) |
| 2 — Core UX | #3, #4, #5, #6, #7 | Reliability & no data loss | ✅ All done |
| 3 — Architecture | #8, #9, #10, #11 | Performance & maintainability | #9 ✅ · #10 ✅ · #8, #11 pending |
| 4 — Polish | #12, #13, #14, #15, #16 | Professional feel | Pending |
| 5 — Growth | #17, #18, #19, #20 | Confidence & new features | Pending |
