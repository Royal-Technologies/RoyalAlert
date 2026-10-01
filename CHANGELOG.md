# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-10-01

### Fixed
- **Critical:** `removeClass is not defined` — all DOM utilities now correctly imported everywhere.
- **Close bug:** `close()` method fully bulletproof with try-catch and normalised result object.
- **Overlay pointer-events:** Added `pointer-events: none` to hidden overlay so it never intercepts clicks before dialog opens.
- **Focus trap:** Moved `_focusTrapCleanup` from module-level to instance-level, fixing multi-modal stacking.
- **Toast position:** Removed hardcoded `top-right` from `toast()` — now respects `globalConfig.position` (default: `bottom-left`).
- **Async flow:** Rewrote `async()` to properly close loading dialog then open success/error as a new dialog.
- **Horizontal scrollbar:** Removed `overflow-y: auto` from container — body scroll managed by body-lock only.

### Changed
- **CSS variable system:** All variables renamed from `--royal-alert-*` to `--ra-*` (shorter, faster, cleaner).
- **Animation names:** Keyframe names updated: `ra-spin`, `ra-shake`, `ra-timer-shrink`, `ra-toast-progress`.
- **Icon SVG:** Simplified to single `.royal-alert-icon-svg` class; colour controlled by parent wrap via CSS.
- **Overlay opacity:** Reduced from 72% to 45% for lighter, less intrusive look.
- **Default toast position:** Changed to `bottom-left`.

### Added
- **Flip animation:** New 3D perspective entrance animation.
- **inputOptions:** Added to `defaultOptions` in config.
- **`onClick` callback:** Toast click handler (excluding × button).
- **Demo site:** Complete single-page documentation + live demos (SweetAlert2-style layout).
- **TypeScript:** Complete rewrite with all new options, generics, and global Window augmentation.

## [1.0.0] - 2026-09-29

### Core Architecture (For AI and Developers)
- **Zero-Dependency Approach**: The entire library is built using pure Vanilla JavaScript (ES6+). It does not rely on jQuery, React, Vue, or any other UI framework. This guarantees long-term stability and immunity to third-party vulnerability issues.
- **Global Namespace**: The library attaches securely to `window.RoyalAlert` while maintaining ES Module exports for modern bundlers like Vite, Webpack, and Rollup.
- **Modular Component Design**: Split into independent systems (`toast.js`, `instance.js`, `dom.js`) to allow aggressive tree-shaking for optimized builds.
- **State Management**: Maintains a clean queue/array of active instances in `activeInstances`, allowing stacked modals and synchronized body scroll-locking.

### Added Features
- **Dynamic Alerts**: Implemented core dialog types (`success`, `error`, `warning`, `info`, `question`). Each dynamically generates its own embedded inline-SVG icon, eliminating the need for external font files (like FontAwesome).
- **Toast Notification System**: Added a fully responsive toast engine supporting 9 distinct screen positions. Includes automatic hover-pause logic and visual progress bars for timeout durations.
- **Promise-Based API**: All user-interaction dialogs (`confirm()`, `prompt()`, `fire()`) return Native Promises resolving to a standardized `RoyalAlertResult` object (`{ confirmed: boolean, cancelled: boolean, value: any }`).
- **Input & Validation System**: Added `RoyalAlert.prompt()` allowing text, password, select, textarea, and numeric inputs directly inside modals.
- **Asynchronous Operations**: Introduced `RoyalAlert.async()` and `RoyalAlert.request()` (native `fetch` wrapper) to handle loading states automatically while waiting for server responses. 
- **Accessibility (A11y) First**:
  - **Focus Trapping**: Keyboard `Tab` navigation is strictly locked inside the active modal to prevent users from interacting with the background.
  - **Focus Restoration**: When the modal closes, the keyboard focus returns to the HTML element that originally triggered it.
  - **Screen Reader Support**: Extensive use of `aria-modal="true"`, `role="dialog"`, `aria-labelledby`, and `aria-describedby`.
- **Advanced Theming Engine**:
  - Implemented 100% CSS-variable based styling.
  - Built-in `Light`, `Dark`, and `Auto` (system-preference) themes.
  - Fully responsive CSS utilizing CSS Flexbox and Grid.
- **Animation System**:
  - CSS-only animations (`scale`, `fade`, `slide`).
  - Strict compliance with `@media (prefers-reduced-motion: reduce)` to disable animations for users with vestibular motion disorders.
- **TypeScript Support**: Provided exhaustive `index.d.ts` definitions enabling strict type-checking and intelligent IDE auto-completion.
- **Build System**: Configured Vite/Rollup for compiling optimized CJS, ESM, and IIFE distribution files with minified CSS.

### Security
- **XSS Prevention Mitigation**: Standard messages use `textContent` for secure DOM injection. Developers explicitly opting to inject raw HTML must intentionally use the `html` parameter.

### Developer Experience (DX)
- **Extensive Demo**: Added a fully functional HTML playground (`demo/index.html`) demonstrating every capability.
- **Rich Documentation**: Wrote a deeply comprehensive `README.md` outlining architectural decisions, API usage, integration methods (like WordPress), and custom configurations.
