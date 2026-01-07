/**
 * Shared TypeScript types and interfaces
 */

export interface ExerciseData {
  total: number;
  current: number;
  originalTarget: number;
}

export interface WorkoutState {
  pullups: ExerciseData;
  pushups: ExerciseData;
  squats: ExerciseData;
  elapsedTime: number;
  isTimerPaused: boolean;
}
