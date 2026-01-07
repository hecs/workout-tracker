import { dom, showScreen, getFormValues, resetForm } from './lib/dom';
import {
  startWorkout,
  decrementExercise,
  resetWorkout,
  newWorkout,
  loadWorkoutState,
  toggleTimer,
  showEndWorkoutDialog,
  completeWorkout,
} from './services/workout';

// ============================================================================
// EVENT LISTENERS
// ============================================================================
function setupEventListeners(): void {
  // Setup form
  const setupForm = dom.setupForm();
  if (setupForm) {
    setupForm.addEventListener('submit', (e) => startWorkout(e, getFormValues));
  } else {
    console.error('Setup form not found');
  }

  // Complete button (formerly Reset) - shows dialog
  const completeBtn = dom.completeBtn();
  if (completeBtn) {
    completeBtn.addEventListener('click', (e: Event) => {
      e.preventDefault();
      showEndWorkoutDialog();
    });
  } else {
    console.error('Complete button not found');
  }

  // Dialog Reset button
  const dialogResetBtn = dom.dialogResetBtn();
  if (dialogResetBtn) {
    dialogResetBtn.addEventListener('click', (e: Event) => {
      e.preventDefault();
      resetWorkout();
    });
  }

  // Dialog Done button
  const dialogDoneBtn = dom.dialogDoneBtn();
  if (dialogDoneBtn) {
    dialogDoneBtn.addEventListener('click', (e: Event) => {
      e.preventDefault();
      completeWorkout();
    });
  }

  // New workout button
  const newBtn = dom.newWorkoutBtn();
  if (newBtn) {
    newBtn.addEventListener('click', (e: Event) => {
      e.preventDefault();
      newWorkout();
    });
  } else {
    console.error('New workout button not found');
  }

  // Timer button
  const timerBtn = dom.timerBtn();
  if (timerBtn) {
    timerBtn.addEventListener('click', (e: Event) => {
      e.preventDefault();
      toggleTimer();
    });
  }

  // Global click handler for decrement buttons
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains('btn-minus')) {
      const card = target.closest('.progress-card') as HTMLDivElement;

      if (card) {
        const exercise = card.dataset.exercise;
        const value = parseInt(target.dataset.value || '0');

        if (exercise) {
          decrementExercise(exercise, value);
        } else {
          console.error('Exercise not found on card');
        }
      } else {
        console.error('Could not find parent progress card');
      }
    }
  });
}

// ============================================================================
// INITIALIZATION
// ============================================================================
function init(): void {
  setupEventListeners();
  loadWorkoutState();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Service worker (optional, non-blocking)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60000); // Check every minute

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            // New service worker is ready - notify user
            if (confirm('App update available! Refresh to get the latest version?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      }
    });
  }).catch(() => {
    // Service worker registration failed - app will still work
  });
}
