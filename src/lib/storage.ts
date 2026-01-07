/**
 * LocalStorage management for workout sessions
 */

import type { WorkoutState } from './types';

const STORAGE_KEY = 'cindy_workout';
const LAST_REPS_KEY = 'cindy_last_reps';

export function saveSession(state: WorkoutState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

export function loadSession(): WorkoutState | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as WorkoutState;
  } catch (e) {
    console.error('Failed to load session:', e);
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear session:', e);
  }
}

export function saveLastReps(reps: { pullups: number; pushups: number; squats: number }): void {
  try {
    localStorage.setItem(LAST_REPS_KEY, JSON.stringify(reps));
  } catch (e) {
    console.error('Failed to save last reps:', e);
  }
}

export function loadLastReps(): { pullups: number; pushups: number; squats: number } | null {
  try {
    const data = localStorage.getItem(LAST_REPS_KEY);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as { pullups: number; pushups: number; squats: number };
  } catch (e) {
    console.error('Failed to load last reps:', e);
    return null;
  }
}
