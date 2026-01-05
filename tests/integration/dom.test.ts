import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { updateRepsDisplay, getFormValues } from '../../src/lib/dom'

describe('DOM Integration - Reps Display', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="progress-card" data-exercise="pullups">
        <div class="reps-display">
          <span class="current">0</span>
          <span class="separator">/</span>
          <span class="total">0</span>
          <span class="bonus">+0</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
    `
  })

  it('should update current reps display', () => {
    const currentEl = document.querySelector('[data-exercise="pullups"] .current') as HTMLElement
    updateRepsDisplay('pullups', 5, 10, 10)

    expect(currentEl.textContent).toBe('5')
  })

  it('should update total reps display', () => {
    const totalEl = document.querySelector('[data-exercise="pullups"] .total') as HTMLElement
    updateRepsDisplay('pullups', 5, 10, 10)

    expect(totalEl.textContent).toBe('10')
  })

  it('should show bonus reps when target exceeded', () => {
    const bonusEl = document.querySelector('[data-exercise="pullups"] .bonus') as HTMLElement
    updateRepsDisplay('pullups', 0, 12, 10)

    expect(bonusEl.textContent).toBe('+2')
    expect(bonusEl.classList.contains('show')).toBe(true)
  })

  it('should hide bonus when target not exceeded', () => {
    const bonusEl = document.querySelector('[data-exercise="pullups"] .bonus') as HTMLElement
    updateRepsDisplay('pullups', 5, 8, 10)

    expect(bonusEl.textContent).toBe('+0')
    expect(bonusEl.classList.contains('show')).toBe(false)
  })

  it('should add complete class when current is 0', () => {
    const currentEl = document.querySelector('[data-exercise="pullups"] .current') as HTMLElement
    updateRepsDisplay('pullups', 0, 10, 10)

    expect(currentEl.classList.contains('complete')).toBe(true)
  })

  it('should remove complete class when current > 0', () => {
    const currentEl = document.querySelector('[data-exercise="pullups"] .current') as HTMLElement
    updateRepsDisplay('pullups', 5, 10, 10)

    expect(currentEl.classList.contains('complete')).toBe(false)
  })

  it('should update progress bar width', () => {
    const progressEl = document.querySelector('[data-exercise="pullups"] .progress-fill') as HTMLElement
    updateRepsDisplay('pullups', 5, 10, 10)

    expect(progressEl.style.width).toBe('50%')
  })

  it('should cap progress bar at 100%', () => {
    const progressEl = document.querySelector('[data-exercise="pullups"] .progress-fill') as HTMLElement
    updateRepsDisplay('pullups', 15, 10, 10)

    expect(progressEl.style.width).toBe('100%')
  })
})

describe('DOM Integration - Form', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="setup-form">
        <input type="number" id="pullups" value="40" />
        <input type="number" id="pushups" value="80" />
        <input type="number" id="squats" value="120" />
      </form>
    `
  })

  it('should get form values correctly', () => {
    const values = getFormValues()

    expect(values.pullups).toBe(40)
    expect(values.pushups).toBe(80)
    expect(values.squats).toBe(120)
  })

  it('should handle empty inputs as 0', () => {
    const pullupInput = document.getElementById('pullups') as HTMLInputElement
    pullupInput.value = ''

    const values = getFormValues()

    expect(values.pullups).toBe(0)
  })

  it('should parse numeric strings', () => {
    const pullupInput = document.getElementById('pullups') as HTMLInputElement
    pullupInput.value = '45'

    const values = getFormValues()

    expect(values.pullups).toBe(45)
    expect(typeof values.pullups).toBe('number')
  })
})
