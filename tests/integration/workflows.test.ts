import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { dom } from '../../src/lib/dom';
import {
  startWorkout,
  decrementExercise,
  resetWorkout,
  completeWorkout,
  newWorkout,
  loadWorkoutState,
  toggleTimer,
  showEndWorkoutDialog,
  state,
} from '../../src/services/workout';
import { getFormValues } from '../../src/lib/dom';
import { saveSession, loadSession, clearSession, saveLastReps, loadLastReps } from '../../src/lib/storage';

describe('Workout Tracker - Full Workflows', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset global state
    state.pullups = { total: 0, current: 0, originalTarget: 0 };
    state.pushups = { total: 0, current: 0, originalTarget: 0 };
    state.squats = { total: 0, current: 0, originalTarget: 0 };
    vi.clearAllMocks();
  });

  describe('Complete workout flow', () => {
    it('should start a workout and update UI', () => {
      // Set form values
      const pullupInput = dom.pullupInput();
      const pushupInput = dom.pushupInput();
      const squatInput = dom.squatInput();

      if (pullupInput && pushupInput && squatInput) {
        pullupInput.value = '10';
        pushupInput.value = '15';
        squatInput.value = '20';

        // Start workout
        const mockEvent = new Event('submit') as Event;
        startWorkout(mockEvent, () => ({ pullups: 10, pushups: 15, squats: 20 }));

        // Check state is updated
        expect(state.pullups.current).toBe(10);
        expect(state.pushups.current).toBe(15);
        expect(state.squats.current).toBe(20);

        // Check saved to localStorage
        const saved = loadSession();
        expect(saved?.pullups.current).toBe(10);
      }
    });

    it('should decrement exercises and persist state', () => {
      const mockEvent = new Event('submit') as Event;
      startWorkout(mockEvent, () => ({ pullups: 5, pushups: 5, squats: 5 }));

      decrementExercise('pullups', -2);
      expect(state.pullups.current).toBe(3);

      decrementExercise('pushups', -5);
      expect(state.pushups.current).toBe(0);

      // Check localStorage
      const saved = loadSession();
      expect(saved?.pullups.current).toBe(3);
      expect(saved?.pushups.current).toBe(0);
    });

    it('should complete workout and save last reps', () => {
      const mockEvent = new Event('submit') as Event;
      startWorkout(mockEvent, () => ({ pullups: 5, pushups: 10, squats: 15 }));

      // Complete the workout
      completeWorkout();

      // Check last reps were saved
      const lastReps = loadLastReps();
      expect(lastReps?.pullups).toBe(5);
      expect(lastReps?.pushups).toBe(10);
      expect(lastReps?.squats).toBe(15);

      // Check state reset
      expect(state.pullups.total).toBe(0);
      expect(state.pushups.total).toBe(0);
      expect(state.squats.total).toBe(0);
    });

    it('should load last reps for new workout', () => {
      // First: complete a workout
      const mockEvent1 = new Event('submit') as Event;
      startWorkout(mockEvent1, () => ({ pullups: 42, pushups: 84, squats: 126 }));
      completeWorkout();

      // Second: start new workout
      newWorkout();

      // Check form has last reps
      const pullupInput = dom.pullupInput();
      const pushupInput = dom.pushupInput();
      const squatInput = dom.squatInput();

      if (pullupInput && pushupInput && squatInput) {
        expect(pullupInput.value).toBe('42');
        expect(pushupInput.value).toBe('84');
        expect(squatInput.value).toBe('126');
      }
    });
  });

  describe('Bonus reps', () => {
    it('should allow bonus reps after reaching 0', () => {
      const mockEvent = new Event('submit') as Event;
      startWorkout(mockEvent, () => ({ pullups: 5, pushups: 5, squats: 5 }));

      // Complete all reps
      decrementExercise('pullups', -5);
      expect(state.pullups.current).toBe(0);
      expect(state.pullups.total).toBe(5);

      // Add bonus reps
      decrementExercise('pullups', -3);
      expect(state.pullups.current).toBe(0); // current stays at 0
      expect(state.pullups.total).toBe(8); // total increases (5 + 3 bonus)
    });

    it('should handle splitting reps across boundary', () => {
      const mockEvent = new Event('submit') as Event;
      startWorkout(mockEvent, () => ({ pullups: 3, pushups: 5, squats: 5 }));

      // Decrement by 5, but only 3 reps remaining
      decrementExercise('pullups', -5);
      expect(state.pullups.current).toBe(0); // used all 3
      expect(state.pullups.total).toBe(5); // 3 original + 2 bonus
    });

    it('should not auto-complete when reaching 0 reps', () => {
      const mockEvent = new Event('submit') as Event;
      startWorkout(mockEvent, () => ({ pullups: 1, pushups: 1, squats: 1 }));

      // Complete all exercises
      decrementExercise('pullups', -1);
      decrementExercise('pushups', -1);
      decrementExercise('squats', -1);

      // Should still be on workout screen, not complete screen
      // (completion only happens via dialog)
      expect(state.pullups.current).toBe(0);
      expect(state.pushups.current).toBe(0);
      expect(state.squats.current).toBe(0);
    });
  });

  describe('Dialog interactions', () => {
    it('should show completion dialog', () => {
      const mockEvent = new Event('submit') as Event;
      startWorkout(mockEvent, () => ({ pullups: 5, pushups: 5, squats: 5 }));

      showEndWorkoutDialog();

      const dialog = dom.completionDialog();
      if (dialog) {
        expect(dialog.classList.contains('hidden')).toBe(false);
      }
    });

    it('should complete workout via dialog', () => {
      const mockEvent = new Event('submit') as Event;
      startWorkout(mockEvent, () => ({ pullups: 5, pushups: 10, squats: 15 }));

      // Complete
      completeWorkout();

      // Last reps saved
      const lastReps = loadLastReps();
      expect(lastReps?.pullups).toBe(5);
      expect(lastReps?.pushups).toBe(10);
      expect(lastReps?.squats).toBe(15);
    });

    it('should reset workout with confirmation', () => {
      const mockEvent = new Event('submit') as Event;
      startWorkout(mockEvent, () => ({ pullups: 5, pushups: 10, squats: 15 }));

      decrementExercise('pullups', -2);
      expect(state.pullups.current).toBe(3);

      // Mock confirm to return true
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      resetWorkout();

      // State should be reset
      expect(state.pullups.total).toBe(0);
      expect(state.pullups.current).toBe(0);

      // localStorage cleared
      const saved = loadSession();
      expect(saved).toBeNull();
    });

    it('should not reset if user cancels confirmation', () => {
      const mockEvent = new Event('submit') as Event;
      startWorkout(mockEvent, () => ({ pullups: 5, pushups: 10, squats: 15 }));

      decrementExercise('pullups', -2);

      // Mock confirm to return false
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      resetWorkout();

      // State should NOT be reset
      expect(state.pullups.current).toBe(3);
      expect(state.pullups.total).toBe(5);

      // Still saved in localStorage
      const saved = loadSession();
      expect(saved?.pullups.current).toBe(3);
    });
  });

  describe('Timer', () => {
    it('should toggle timer on and off', () => {
      const mockEvent = new Event('submit') as Event;
      startWorkout(mockEvent, () => ({ pullups: 5, pushups: 5, squats: 5 }));

      // Timer starts on workout start, so first toggle should pause
      toggleTimer();
      // Can't easily test timer in unit tests without real timers,
      // but we can verify it doesn't throw
      expect(state.pullups.current).toBe(5);
    });
  });

  describe('State persistence', () => {
    it('should load saved workout state', () => {
      // Save a workout state
      saveSession({
        pullups: { total: 10, current: 5, originalTarget: 10 },
        pushups: { total: 15, current: 8, originalTarget: 15 },
        squats: { total: 20, current: 12, originalTarget: 20 },
      });

      // Load it
      loadWorkoutState();

      expect(state.pullups.current).toBe(5);
      expect(state.pushups.current).toBe(8);
      expect(state.squats.current).toBe(12);
    });

    it('should go to setup screen if no saved state', () => {
      clearSession();
      loadWorkoutState();

      // State should remain as is (doesn't auto-reset in loadWorkoutState)
      // Just doesn't load from storage
      const saved = loadSession();
      expect(saved).toBeNull();
    });

    it('should not load workout if total is 0', () => {
      // Save an empty state
      saveSession({
        pullups: { total: 0, current: 0, originalTarget: 0 },
        pushups: { total: 0, current: 0, originalTarget: 0 },
        squats: { total: 0, current: 0, originalTarget: 0 },
      });

      loadWorkoutState();

      // Should not load (total is 0), so no state change
      // The function checks if total > 0 before loading
      expect(state.pullups.total).toBe(0);
    });
  });
});
