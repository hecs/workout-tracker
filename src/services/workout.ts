/**
 * Workout state management and business logic
 */

import type { WorkoutState } from '../lib/types';
import { saveSession, clearSession, loadSession, saveLastReps, loadLastReps } from '../lib/storage';
import { showScreen, updateRepsDisplay, resetForm, updateTimerDisplay, updateTimerButton, showCompletionDialog, hideCompletionDialog, setFormValues } from '../lib/dom';

// ============================================================================
// TIMER
// ============================================================================
let timerStartTime: number = 0;
let timerPausedAt: number = 0;
let timerInterval: number | null = null;
let isTimerPaused: boolean = true;

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function startTimer(): void {
  timerStartTime = Date.now() - timerPausedAt;
  isTimerPaused = false;
  updateTimerButton(false);

  if (timerInterval !== null) clearInterval(timerInterval);
  timerInterval = window.setInterval(() => {
    const elapsed = Date.now() - timerStartTime;
    updateTimerDisplay(formatTime(elapsed));
  }, 100);
}

export function pauseTimer(): void {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerPausedAt = Date.now() - timerStartTime;
  isTimerPaused = true;
  updateTimerButton(true);
}

export function toggleTimer(): void {
  if (isTimerPaused) {
    startTimer();
  } else {
    pauseTimer();
  }
}

export function stopTimer(): void {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerStartTime = 0;
  timerPausedAt = 0;
  isTimerPaused = true;
  updateTimerDisplay('0:00');
  updateTimerButton(true);
}

// ============================================================================
// STATE
// ============================================================================
export let state: WorkoutState = {
  pullups: { total: 0, current: 0, originalTarget: 0 },
  pushups: { total: 0, current: 0, originalTarget: 0 },
  squats: { total: 0, current: 0, originalTarget: 0 },
};

// ============================================================================
// ACTIONS
// ============================================================================
export function startWorkout(e: Event, getFormValues: () => { pullups: number; pushups: number; squats: number }): void {
  e.preventDefault();

  const { pullups, pushups, squats } = getFormValues();

  state = {
    pullups: { total: pullups, current: pullups, originalTarget: pullups },
    pushups: { total: pushups, current: pushups, originalTarget: pushups },
    squats: { total: squats, current: squats, originalTarget: squats },
  };

  saveSession(state);
  updateUI();
  showScreen('workout-screen');
  startTimer();
}

export function decrementExercise(exercise: string, amount: number): void {
  const exerciseKey = exercise as keyof WorkoutState;

  if (!state[exerciseKey]) {
    console.error(`Unknown exercise: ${exercise}`);
    return;
  }

  const currentValue = state[exerciseKey].current;
  const absoluteAmount = Math.abs(amount);

  // If the decrement would go below 0, split it:
  // - Use what we need to reach 0
  // - Add the remainder to total as bonus reps
  if (currentValue > 0 && currentValue < absoluteAmount) {
    const amountUsedForCurrent = currentValue;
    const bonusAmount = absoluteAmount - amountUsedForCurrent;

    state[exerciseKey].current = 0;
    state[exerciseKey].total += bonusAmount;
  } else if (currentValue <= 0 && amount < 0) {
    // If already at 0 or below, all decrements go to bonus
    state[exerciseKey].total += absoluteAmount;
  } else {
    // Normal decrement
    state[exerciseKey].current = Math.max(0, currentValue + amount);
  }

  saveSession(state);
  updateUI();
}

export function resetWorkout(): void {
  hideCompletionDialog();
  if (confirm('Reset this workout?')) {
    clearSession();
    stopTimer();
    state = {
      pullups: { total: 0, current: 0, originalTarget: 0 },
      pushups: { total: 0, current: 0, originalTarget: 0 },
      squats: { total: 0, current: 0, originalTarget: 0 },
    };
    resetForm();
    showScreen('setup-screen');
  }
}

export function showEndWorkoutDialog(): void {
  showCompletionDialog();
}

export function completeWorkout(): void {
  hideCompletionDialog();
  // Save the last used reps for next time
  saveLastReps({
    pullups: state.pullups.originalTarget,
    pushups: state.pushups.originalTarget,
    squats: state.squats.originalTarget,
  });
  clearSession();
  stopTimer();
  state = {
    pullups: { total: 0, current: 0, originalTarget: 0 },
    pushups: { total: 0, current: 0, originalTarget: 0 },
    squats: { total: 0, current: 0, originalTarget: 0 },
  };
  resetForm();
  showScreen('setup-screen');
}

export function newWorkout(): void {
  const lastReps = loadLastReps();
  clearSession();
  stopTimer();
  state = {
    pullups: { total: 0, current: 0, originalTarget: 0 },
    pushups: { total: 0, current: 0, originalTarget: 0 },
    squats: { total: 0, current: 0, originalTarget: 0 },
  };
  resetForm();
  
  // Load last used reps if available
  if (lastReps) {
    setFormValues(lastReps.pullups, lastReps.pushups, lastReps.squats);
  }
  
  showScreen('setup-screen');
}

// ============================================================================
// UI UPDATES
// ============================================================================
export function updateUI(): void {
  const exercises: Array<'pullups' | 'pushups' | 'squats'> = [
    'pullups',
    'pushups',
    'squats',
  ];

  exercises.forEach((exercise) => {
    const { current, total, originalTarget } = state[exercise];
    updateRepsDisplay(exercise, current, total, originalTarget);
  });

  // Check if complete: all exercises have current == 0 and total > 0
  const isComplete =
    state.pullups.current === 0 &&
    state.pushups.current === 0 &&
    state.squats.current === 0 &&
    state.pullups.total > 0 &&
    state.pushups.total > 0 &&
    state.squats.total > 0;

  if (isComplete) {
    showScreen('complete-screen');
  }
}

export function loadWorkoutState(): void {
  const saved = loadSession();

  if (saved && saved.pullups.total > 0) {
    Object.assign(state, saved);
    updateUI();
    showScreen('workout-screen');
  } else {
    showScreen('setup-screen');
  }
}
