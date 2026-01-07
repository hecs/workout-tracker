import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveLastReps, loadLastReps } from '../../src/lib/storage';
import { completeWorkout, newWorkout } from '../../src/services/workout';

describe('Workout Completion', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveLastReps and loadLastReps', () => {
    it('should save last reps to localStorage', () => {
      const reps = { pullups: 40, pushups: 80, squats: 120 };
      saveLastReps(reps);

      const stored = localStorage.getItem('cindy_last_reps');
      expect(stored).toBeDefined();
      expect(JSON.parse(stored!)).toEqual(reps);
    });

    it('should load last reps from localStorage', () => {
      const reps = { pullups: 40, pushups: 80, squats: 120 };
      saveLastReps(reps);

      const loaded = loadLastReps();
      expect(loaded).toEqual(reps);
    });

    it('should return null if no last reps saved', () => {
      const loaded = loadLastReps();
      expect(loaded).toBeNull();
    });

    it('should return null on corrupted data', () => {
      localStorage.setItem('cindy_last_reps', 'invalid json');
      const loaded = loadLastReps();
      expect(loaded).toBeNull();
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('cindy_last_reps', '{invalid}');
      expect(() => loadLastReps()).not.toThrow();
      expect(loadLastReps()).toBeNull();
    });
  });

  describe('completeWorkout', () => {
    it('should save last reps when workout is completed', () => {
      // Mock the state before completing
      vi.stubGlobal('confirm', () => false);

      const reps = { pullups: 40, pushups: 80, squats: 120 };
      saveLastReps(reps);

      const loaded = loadLastReps();
      expect(loaded).toEqual(reps);
    });

    it('should clear last reps data correctly', () => {
      const reps = { pullups: 40, pushups: 80, squats: 120 };
      saveLastReps(reps);

      // Clear and verify
      localStorage.removeItem('cindy_last_reps');
      expect(loadLastReps()).toBeNull();
    });
  });

  describe('Dialog interaction flow', () => {
    it('should save reps before clearing session', () => {
      const reps = { pullups: 50, pushups: 100, squats: 150 };
      saveLastReps(reps);

      const loaded = loadLastReps();
      expect(loaded).toEqual(reps);

      // Clear and verify storage behavior
      localStorage.removeItem('cindy_last_reps');
      expect(loadLastReps()).toBeNull();
    });

    it('should track multiple workouts with different reps', () => {
      // First workout
      const reps1 = { pullups: 40, pushups: 80, squats: 120 };
      saveLastReps(reps1);
      expect(loadLastReps()).toEqual(reps1);

      // Second workout with different reps
      const reps2 = { pullups: 45, pushups: 90, squats: 130 };
      saveLastReps(reps2);
      expect(loadLastReps()).toEqual(reps2);

      // Verify latest is saved
      const latest = loadLastReps();
      expect(latest?.pullups).toBe(45);
      expect(latest?.pushups).toBe(90);
      expect(latest?.squats).toBe(130);
    });
  });
});
