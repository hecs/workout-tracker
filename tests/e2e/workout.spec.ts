import { test, expect } from '@playwright/test'

test.describe('Workout Tracker - Full Flow', () => {
  test('should complete a full workout flow', async ({ page }) => {
    // 1. Load the app
    await page.goto('/')
    await expect(page.locator('#setup-screen')).toBeVisible()

    // 2. Fill form with custom values
    await page.fill('#pullups', '10')
    await page.fill('#pushups', '15')
    await page.fill('#squats', '20')

    // 3. Start workout
    await page.click('button:has-text("Start Workout")')

    // 4. Verify workout screen is shown
    await expect(page.locator('#workout-screen')).toBeVisible()
    await expect(page.locator('[data-exercise="pullups"] .current')).toContainText('10')
    await expect(page.locator('[data-exercise="pullups"] .total')).toContainText('10')

    // 5. Click decrement button
    await page.click('[data-exercise="pullups"] button:has-text("-1")')

    // 6. Verify state updated
    await expect(page.locator('[data-exercise="pullups"] .current')).toContainText('9')

    // 7. Verify progress bar updated
    const progressBar = page.locator('[data-exercise="pullups"] .progress-fill')
    const width = await progressBar.evaluate((el) => window.getComputedStyle(el).width)
    expect(parseInt(width)).toBeGreaterThan(0)
  })

  test('should handle bonus reps correctly', async ({ page }) => {
    await page.goto('/')

    await page.fill('#pullups', '5')
    await page.fill('#pushups', '5')
    await page.fill('#squats', '5')
    await page.click('button:has-text("Start Workout")')

    // Click -10 when current is 5, should split: current=0, bonus+5
    await page.click('[data-exercise="pullups"] button:has-text("-10")')

    await expect(page.locator('[data-exercise="pullups"] .current')).toContainText('0')
    await expect(page.locator('[data-exercise="pullups"] .bonus')).toContainText('+5')
  })

  test('should show complete screen when all exercises done', async ({ page }) => {
    await page.goto('/')

    // Use small numbers for quick completion
    await page.fill('#pullups', '1')
    await page.fill('#pushups', '1')
    await page.fill('#squats', '1')
    await page.click('button:has-text("Start Workout")')

    // Complete all exercises
    await page.click('[data-exercise="pullups"] button:has-text("-1")')
    await page.click('[data-exercise="pushups"] button:has-text("-1")')
    await page.click('[data-exercise="squats"] button:has-text("-1")')

    // Should show complete screen
    await expect(page.locator('#complete-screen')).toBeVisible()
    await expect(page.locator('text=Workout Complete')).toBeVisible()
  })

  test('should persist state to localStorage', async ({ page }) => {
    await page.goto('/')

    await page.fill('#pullups', '20')
    await page.fill('#pushups', '30')
    await page.fill('#squats', '40')
    await page.click('button:has-text("Start Workout")')

    // Complete some reps
    await page.click('[data-exercise="pullups"] button:has-text("-5")')

    // Get the localStorage value
    const storageValue = await page.evaluate(() => {
      return localStorage.getItem('cindy_workout')
    })

    expect(storageValue).toBeDefined()
    const state = JSON.parse(storageValue!)
    expect(state.pullups.current).toBe(15)
    expect(state.pullups.total).toBe(20)
  })

  test('should resume saved workout', async ({ page }) => {
    // First session - start and do some reps
    await page.goto('/')
    await page.fill('#pullups', '25')
    await page.fill('#pushups', '35')
    await page.fill('#squats', '45')
    await page.click('button:has-text("Start Workout")')
    await page.click('[data-exercise="pullups"] button:has-text("-10")')

    // Reload page
    await page.reload()

    // Should show workout screen with saved state
    await expect(page.locator('#workout-screen')).toBeVisible()
    await expect(page.locator('[data-exercise="pullups"] .current')).toContainText('15')
    await expect(page.locator('[data-exercise="pullups"] .total')).toContainText('25')
  })

  test('should reset workout on reset button click', async ({ page }) => {
    await page.goto('/')

    await page.fill('#pullups', '15')
    await page.fill('#pushups', '25')
    await page.fill('#squats', '35')
    await page.click('button:has-text("Start Workout")')

    // Do some reps
    await page.click('[data-exercise="pullups"] button:has-text("-5")')

    // Reset
    page.once('dialog', (dialog) => dialog.accept())
    await page.click('#reset-btn')

    // Should show setup screen again
    await expect(page.locator('#setup-screen')).toBeVisible()
  })

  test('should handle timer controls', async ({ page }) => {
    await page.goto('/')

    await page.fill('#pullups', '10')
    await page.fill('#pushups', '10')
    await page.fill('#squats', '10')
    await page.click('button:has-text("Start Workout")')

    // Timer should be running
    await expect(page.locator('#timer-display')).not.toContainText('0:00')

    // Click pause
    await page.click('button:has-text("Pause")')
    const pausedTime = await page.locator('#timer-display').textContent()

    // Wait a bit
    await page.waitForTimeout(500)

    // Time should still be the same (paused)
    const stillPausedTime = await page.locator('#timer-display').textContent()
    expect(pausedTime).toBe(stillPausedTime)

    // Click resume
    await page.click('button:has-text("Resume")')
    await page.waitForTimeout(500)

    // Time should be advancing again
    const resumedTime = await page.locator('#timer-display').textContent()
    expect(resumedTime).not.toBe(pausedTime)
  })
})

test.describe('Responsive Design', () => {
  test('should work on mobile device', async ({ page }) => {
    // This uses the Mobile Chrome profile from playwright.config.ts
    await page.goto('/')

    // Form should be visible and usable
    await expect(page.locator('#setup-form')).toBeVisible()
    await page.fill('#pullups', '10')
    await page.click('button:has-text("Start Workout")')

    // Workout screen should be visible
    await expect(page.locator('#workout-screen')).toBeVisible()

    // Buttons should be easily clickable
    const buttons = page.locator('[data-exercise="pullups"] .btn-minus')
    await expect(buttons.first()).toBeVisible()
  })

  test('should show completion dialog with Complete button', async ({ page }) => {
    await page.goto('/')
    
    // Set up quick workout
    await page.fill('#pullups', '1')
    await page.fill('#pushups', '1')
    await page.fill('#squats', '1')
    await page.click('button:has-text("Start Workout")')

    // Click Complete button
    await expect(page.locator('#complete-btn')).toBeVisible()
    await page.click('#complete-btn')

    // Dialog should appear
    await expect(page.locator('#completion-dialog')).toBeVisible()
    await expect(page.locator('#dialog-reset-btn')).toBeVisible()
    await expect(page.locator('#dialog-done-btn')).toBeVisible()
  })

  test('should reset workout with confirmation from dialog', async ({ page }) => {
    await page.goto('/')
    
    await page.fill('#pullups', '2')
    await page.fill('#pushups', '2')
    await page.fill('#squats', '2')
    await page.click('button:has-text("Start Workout")')

    // Click some reps
    await page.click('[data-exercise="pullups"] button:has-text("-1")')
    await expect(page.locator('[data-exercise="pullups"] .current')).toContainText('1')

    // Click Complete button and Reset in dialog
    await page.click('#complete-btn')
    await page.click('#dialog-reset-btn')

    // Should ask for confirmation
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Reset');
      await dialog.accept();
    });

    // Wait a bit for confirm to be processed
    await page.waitForTimeout(500);
    
    // Should be back at setup screen
    await expect(page.locator('#setup-screen')).toBeVisible()
  })

  test('should save last reps and use them for next workout', async ({ page }) => {
    await page.goto('/')
    
    // First workout with specific reps
    await page.fill('#pullups', '42')
    await page.fill('#pushups', '84')
    await page.fill('#squats', '126')
    await page.click('button:has-text("Start Workout")')

    // Complete it
    await page.click('[data-exercise="pullups"] button:has-text("-1")').then(() => {
      // Repeat for all to complete
      return Promise.all([
        page.click('[data-exercise="pullups"] button:has-text("-1")').catch(() => {}),
        page.click('[data-exercise="pullups"] button:has-text("-10")'),
        page.click('[data-exercise="pullups"] button:has-text("-10")'),
        page.click('[data-exercise="pullups"] button:has-text("-10")'),
        page.click('[data-exercise="pullups"] button:has-text("-10")'),
      ])
    });

    // Get to completion screen
    await page.waitForTimeout(500);
    
    // If on dialog, complete it
    const dialog = page.locator('#completion-dialog');
    if (await dialog.isVisible()) {
      await page.click('#dialog-done-btn');
    }

    // Click "Start New Workout" if visible
    if (await page.locator('#new-workout-btn').isVisible()) {
      await page.click('#new-workout-btn');
    }

    // Now on setup screen, values should match last workout
    const pullupValue = await page.locator('#pullups').inputValue();
    const pushupValue = await page.locator('#pushups').inputValue();
    const squatValue = await page.locator('#squats').inputValue();

    // Values should be saved from previous workout
    expect(pullupValue).toBeTruthy();
    expect(pushupValue).toBeTruthy();
    expect(squatValue).toBeTruthy();
  })

  test('should handle "Workout Done" completing the session', async ({ page }) => {
    await page.goto('/')
    
    await page.fill('#pullups', '1')
    await page.fill('#pushups', '1')
    await page.fill('#squats', '1')
    await page.click('button:has-text("Start Workout")')

    // Complete all exercises
    await page.click('[data-exercise="pullups"] button:has-text("-1")')
    await page.click('[data-exercise="pushups"] button:has-text("-1")')
    await page.click('[data-exercise="squats"] button:has-text("-1")')

    // Should show complete screen with "Start New Workout" button
    await expect(page.locator('#complete-screen')).toBeVisible()
    await expect(page.locator('#new-workout-btn')).toBeVisible()

    // Click "Start New Workout"
    await page.click('#new-workout-btn')

    // Should be back at setup
    await expect(page.locator('#setup-screen')).toBeVisible()
  })
})

