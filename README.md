# Workout Tracker

A lightweight, offline-capable workout tracker for timed circuit workouts, built with Vite, TypeScript, and vanilla JavaScript.

**Status:** Production-ready ✅ | **Tests:** 62 passing | **Deploy:** GitHub Pages + CI/CD

## Features

✅ **Track 3 exercises** - Customizable rep targets (pullups, pushups, squats)  
✅ **Bonus reps** - Auto-calculated when exceeding target  
✅ **Smart decrement logic** - Split calculation when crossing zero  
✅ **Completion dialog** - Confirm workout end with Reset/Done options  
✅ **Timer with persistence** - Continues from last elapsed time on reload  
✅ **Last reps memory** - Saves completed reps for next workout  
✅ **Session persistence** - Full state saved to localStorage (including timer)  
✅ **PWA support** - Install as app, offline capability  
✅ **Auto-update checking** - Service worker checks for updates every 60 seconds  
✅ **Mobile optimized** - Touch-friendly buttons, fully responsive  
✅ **Dark theme** - Magenta primary (#ff6b6b), green success (#51cf66)

## Quick Start

### Usage

1. Open app in browser or install to home screen
2. Enter target reps for each exercise
3. Click "Start Workout"
4. Use decrement buttons to track reps (-1, -5, -10)
5. Timer automatically starts - pause/resume with ⏸ button
6. Click "Complete" when done
7. Choose "Reset" to restart or "Done!" to save and finish

### Installation

- **Web:** Open at https://hecs.github.io/workout-tracker/
- **Android:** Chrome menu → "Install app"
- **iOS:** Safari → Share → "Add to Home Screen"

## Project Structure

```
src/
├── index.html              # 3-screen HTML: setup, workout, complete
├── main.ts                 # Event coordination & initialization
├── styles.css              # Responsive styles (dark theme)
├── manifest.json           # PWA configuration
├── sw.js                   # Service worker (network-first, auto-update)
│
├── lib/
│   ├── types.ts           # TypeScript interfaces (WorkoutState with timer)
│   ├── storage.ts         # localStorage persistence (session, reps, state)
│   └── dom.ts             # DOM selectors & manipulation helpers
│
├── services/
│   └── workout.ts         # State management, timer logic, business rules
│
└── assets/
    └── favicon.svg        # App icon

tests/
├── unit/                  # Workout logic, storage, calculations
├── integration/           # DOM updates, workflows, timer persistence
└── [vitest - no E2E needed]
```

## Architecture

### Separation of Concerns

- **types.ts** - `WorkoutState` interface (exercises + elapsedTime + isTimerPaused)
- **storage.ts** - localStorage save/load (session, last reps)
- **dom.ts** - Centralized DOM selectors & helpers
- **workout.ts** - Complete state machine (exercises, timer, persistence)
- **main.ts** - Event binding, app initialization

Benefits:
- Clear boundaries, zero circular dependencies
- Comprehensive testing (62 unit + integration tests, ~380ms)
- Easy to debug and maintain
- Lightweight (~7KB JS, ~5.5KB CSS gzipped)
- Zero external dependencies

## Data Persistence

Auto-saves to `localStorage`:
- **Current session:** Exercise progress, timer elapsed time, pause state
- **Last reps:** Saved on "Done!", pre-filled for next workout

On reload:
1. Loads workout state & timer elapsed time
2. Restores timer to exact previous value
3. Auto-resumes if timer was running

## Testing

```bash
npm run test          # All 62 tests (~380ms)
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

**62 tests:**
- 9 unit tests - Workout logic, decrement, bonus
- 8 storage tests - Save/load/clear
- 11 DOM tests - Display updates
- 9 completion tests - Dialog & last reps
- 17 workflow tests - Full flows & timer persistence

Uses **Vitest** with **happy-dom** for speed.

## Development

```bash
npm install    # Install dependencies
npm run dev   # Dev server (http://localhost:5173)
npm run build # Production build
```

## Deployment

GitHub Actions CI/CD:
1. Push to `master` → Actions runs `npm run test` (62 tests)
2. Builds with `npm run build`
3. Deploys to GitHub Pages

## Technology Stack

- **Vite 7.3.1** - ES6+ bundler
- **TypeScript 5.3** - Type safety
- **Happy-DOM 20.0** - Lightweight DOM
- **Vitest 4.0** - Fast tests
- **Service Worker** - Offline + auto-update
- **PWA Manifest** - Home screen install

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Notes

- Zero external JS dependencies
- All data stays on your device
- Fully responsive & touch-optimized
- Service worker for offline

## License

MIT

## Architecture

### Separation of Concerns

- **lib/types.ts** - Shared TypeScript types
- **lib/storage.ts** - Data persistence layer
- **lib/dom.ts** - DOM operations and selectors (centralized for easier debugging)
- **services/workout.ts** - Business logic for workouts (state management, calculations)
- **main.ts** - Application coordinator (event listeners, initialization)

This structure ensures:
- Clear responsibility boundaries
- Easy testing and debugging
- Reusable utility functions
- Scalable codebase for future features

## Features

✅ **Track 3 exercises** - Customizable rep targets  
✅ **Bonus reps** - Automatically calculated when exceeding target  
✅ **Smart decrement logic** - Split calculation when crossing zero  
✅ **Visual feedback** - Green indicator when exercise complete, animated bonus counter  
✅ **Session persistence** - Saves workout state to localStorage  
✅ **PWA support** - Install as app, offline capability via service worker  
✅ **Mobile optimized** - Touch-friendly buttons, responsive design  
✅ **Dark theme** - Magenta (#ff6b6b) primary, turquoise (#00ffff) accents, green (#51cf66) success
1. Open the app in Chrome/Firefox
2. Tap the menu (⋮) → "Install app" or "Add to Home screen"

### On iOS:
1. Open in Safari
2. Tap Share → "Add to Home Screen"

## Data Storage

Your workout progress is automatically saved to `localStorage` and persists between app sessions. To clear:
- Click "Reset" in the workout screen

## Technology Stack

- **HTML/CSS/JavaScript** - Zero framework, vanilla implementation
- **Vite** - Fast bundling and dev server
- **Service Worker** - Offline support and caching
- **PWA Manifest** - Home screen installation
- **localStorage** - Session persistence

## Project Structure

```
src/
  ├── index.html       # Main HTML template
  ├── main.ts          # Application logic
  ├── styles.css       # Styles (mobile-first, responsive)
  ├── manifest.json    # PWA manifest
  ├── sw.js            # Service worker
  ├── lib/             # Utilities
  ├── services/        # Business logic
  └── assets/          # Static assets

vite.config.ts         # Vite configuration
package.json           # Dependencies & scripts
```

## Notes

- The app stores session data in localStorage. IndexedDB can be added if you need to store larger amounts of data or multiple workout history
- Service worker provides offline functionality and asset caching
- Icons in the manifest should be customized (icon-192.png, icon-512.png, etc.)
- The app is fully responsive and optimized for mobile devices

## Future Enhancements

Possible additions (without adding frameworks):
- Workout history/stats
- Custom exercise names
- Audio feedback on reps
- Dark/light theme toggle
