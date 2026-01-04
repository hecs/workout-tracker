# Workout Tracker

A lightweight, offline-capable workout tracker for timed circuit workouts, built with Vite, TypeScript, and vanilla JavaScript.

## Project Structure

```
src/
├── index.html                # Main HTML template (3 screens: setup, workout, complete)
├── main.ts                   # Application entry point and event coordination
├── styles.css                # Global styles with mobile-first responsive design
├── manifest.json             # PWA configuration for installation
├── sw.js                     # Service worker for offline support
│
├── lib/                      # Utilities and shared libraries
│   ├── types.ts             # TypeScript interfaces (ExerciseData, WorkoutState)
│   ├── storage.ts           # localStorage operations (save/load/clear)
│   └── dom.ts               # DOM selectors and manipulation utilities
│
├── services/                 # Business logic and state management
│   └── workout.ts           # Workout actions and state (startWorkout, decrementExercise, etc.)
│
└── assets/                   # Static assets
    └── favicon.svg          # App icon (strength-focused fist design)
```

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
