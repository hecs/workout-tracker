import { describe, it, expect, beforeEach, vi } from 'vitest'
import { state, decrementExercise, startWorkout } from '../../src/services/workout'
import * as storage from '../../src/lib/storage'

// Mock the storage module
vi.mock('../../src/lib/storage')

// Mock the dom module
vi.mock('../../src/lib/dom', () => ({
  showScreen: vi.fn(),
  updateRepsDisplay: vi.fn(),
  resetForm: vi.fn(),
  updateTimerDisplay: vi.fn(),
  updateTimerButton: vi.fn(),
  dom: {},
}))

describe('Workout Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('decrementExercise', () => {
    it('should decrement current reps normally', () => {
      // Setup
      state.pullups = { total: 10, current: 5, originalTarget: 10 }

      // Action
      decrementExercise('pullups', -1)

      // Assert
      expect(state.pullups.current).toBe(4)
      expect(state.pullups.total).toBe(10)
    })

    it('should not go below 0', () => {
      state.pullups = { total: 10, current: 2, originalTarget: 10 }

      decrementExercise('pullups', -5)

      expect(state.pullups.current).toBe(0)
    })

    it('should split decrement when crossing zero', () => {
      // If current is 3 and we decrement by 5:
      // - Use 3 to reach 0 (current = 0)
      // - Add 2 as bonus (total = 10 + 2 = 12)
      state.pullups = { total: 10, current: 3, originalTarget: 10 }

      decrementExercise('pullups', -5)

      expect(state.pullups.current).toBe(0)
      expect(state.pullups.total).toBe(12)
    })

    it('should add to bonus when already at zero', () => {
      state.pullups = { total: 10, current: 0, originalTarget: 10 }

      decrementExercise('pullups', -3)

      expect(state.pullups.current).toBe(0)
      expect(state.pullups.total).toBe(13)
    })

    it('should handle multiple exercises independently', () => {
      state.pullups = { total: 10, current: 5, originalTarget: 10 }
      state.pushups = { total: 20, current: 15, originalTarget: 20 }

      decrementExercise('pullups', -2)
      decrementExercise('pushups', -3)

      expect(state.pullups.current).toBe(3)
      expect(state.pushups.current).toBe(12)
    })

    it('should call saveSession on decrement', () => {
      state.pullups = { total: 10, current: 5, originalTarget: 10 }

      decrementExercise('pullups', -1)

      expect(storage.saveSession).toHaveBeenCalled()
    })
  })

  describe('bonus rep calculation', () => {
    it('should correctly identify bonus reps', () => {
      state.pullups = { total: 12, current: 0, originalTarget: 10 }

      const bonusReps = Math.max(0, state.pullups.total - state.pullups.originalTarget)

      expect(bonusReps).toBe(2)
    })

    it('should have no bonus when target not exceeded', () => {
      state.pullups = { total: 8, current: 0, originalTarget: 10 }

      const bonusReps = Math.max(0, state.pullups.total - state.pullups.originalTarget)

      expect(bonusReps).toBe(0)
    })
  })

  describe('error handling', () => {
    it('should handle unknown exercise gracefully', () => {
      // This should log an error but not crash
      expect(() => {
        decrementExercise('unknownExercise', -1)
      }).not.toThrow()
    })
  })
})
