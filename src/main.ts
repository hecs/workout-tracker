import { dom, showScreen, getFormValues, resetForm } from './lib/dom';
import {
  startWorkout,
  decrementExercise,
  resetWorkout,
  newWorkout,
  loadWorkoutState,
  toggleTimer,
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

  // Reset button
  const resetBtn = dom.resetBtn();
  if (resetBtn) {
    resetBtn.addEventListener('click', (e: Event) => {
      e.preventDefault();
      resetWorkout();
    });
  } else {
    console.error('Reset button not found');
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
  navigator.serviceWorker.register('/sw.js').catch(() => {
    // Service worker registration failed - app will still work
  });
}
