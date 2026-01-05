import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveSession, loadSession, clearSession } from '../../src/lib/storage'

describe('Storage Module', () => {
  const mockState = {
    pullups: { total: 10, current: 5, originalTarget: 10 },
    pushups: { total: 20, current: 15, originalTarget: 20 },
    squats: { total: 30, current: 20, originalTarget: 30 },
  }

  beforeEach(() => {
    localStorage.clear()
  })

  describe('saveSession', () => {
    it('should save state to localStorage', () => {
      saveSession(mockState)

      const saved = localStorage.getItem('cindy_workout')
      expect(saved).toBeDefined()
      expect(JSON.parse(saved!)).toEqual(mockState)
    })

    it('should overwrite previous state', () => {
      saveSession(mockState)
      const updatedState = { ...mockState, pullups: { total: 15, current: 10, originalTarget: 15 } }
      saveSession(updatedState)

      const saved = localStorage.getItem('cindy_workout')
      expect(JSON.parse(saved!).pullups.total).toBe(15)
    })
  })

  describe('loadSession', () => {
    it('should load saved state', () => {
      saveSession(mockState)

      const loaded = loadSession()

      expect(loaded).toEqual(mockState)
    })

    it('should return null if no session', () => {
      const loaded = loadSession()

      expect(loaded).toBeNull()
    })

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('cindy_workout', 'invalid json')

      const loaded = loadSession()

      expect(loaded).toBeNull()
    })
  })

  describe('clearSession', () => {
    it('should remove saved state', () => {
      saveSession(mockState)
      clearSession()

      const saved = localStorage.getItem('cindy_workout')

      expect(saved).toBeNull()
    })

    it('should not throw if nothing to clear', () => {
      expect(() => clearSession()).not.toThrow()
    })
  })

  describe('session persistence', () => {
    it('should survive multiple save/load cycles', () => {
      const state1 = mockState
      saveSession(state1)
      const loaded1 = loadSession()

      const state2 = { ...loaded1!, pullups: { total: 20, current: 10, originalTarget: 20 } }
      saveSession(state2)
      const loaded2 = loadSession()

      expect(loaded2!.pullups.total).toBe(20)
      expect(loaded2!.pushups).toEqual(state1.pushups)
    })
  })
})
