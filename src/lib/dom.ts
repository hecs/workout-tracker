/**
 * Centralized DOM selectors and utilities
 * Keep all DOM operations in one place for easier debugging
 */

// ============================================================================
// DOM ELEMENTS
// ============================================================================
export const dom = {
  // Forms & Inputs
  setupForm: () => document.getElementById('setup-form') as HTMLFormElement,
  pullupInput: () => document.getElementById('pullups') as HTMLInputElement,
  pushupInput: () => document.getElementById('pushups') as HTMLInputElement,
  squatInput: () => document.getElementById('squats') as HTMLInputElement,

  // Buttons
  completeBtn: () => document.getElementById('complete-btn') as HTMLButtonElement,
  newWorkoutBtn: () => document.getElementById('new-workout-btn') as HTMLButtonElement,
  timerBtn: () => document.getElementById('timer-btn') as HTMLButtonElement,

  // Dialog
  completionDialog: () => document.getElementById('completion-dialog') as HTMLDivElement,
  dialogResetBtn: () => document.getElementById('dialog-reset-btn') as HTMLButtonElement,
  dialogDoneBtn: () => document.getElementById('dialog-done-btn') as HTMLButtonElement,

  // Timer
  timerDisplay: () => document.getElementById('timer-display') as HTMLSpanElement,

  // Progress cards
  currentReps: (exercise: string) =>
    document.querySelector(`[data-exercise="${exercise}"] .current`) as HTMLSpanElement,

  totalReps: (exercise: string) =>
    document.querySelector(`[data-exercise="${exercise}"] .total`) as HTMLSpanElement,

  bonus: (exercise: string) =>
    document.querySelector(`[data-exercise="${exercise}"] .bonus`) as HTMLSpanElement,

  progressBar: (exercise: string) =>
    document.querySelector(`[data-exercise="${exercise}"] .progress-fill`) as HTMLDivElement,
};

// ============================================================================
// DOM OPERATIONS
// ============================================================================
export function showScreen(screenId: 'setup-screen' | 'workout-screen' | 'complete-screen') {
  const screens = document.querySelectorAll('.screen') as NodeListOf<HTMLElement>;
  screens.forEach((screen) => {
    screen.classList.remove('active');
  });

  const targetScreen = document.getElementById(screenId) as HTMLElement | null;
  if (targetScreen) {
    targetScreen.classList.add('active');
  } else {
    console.error(`Screen not found: ${screenId}`);
  }
}

export function updateRepsDisplay(exercise: string, current: number, total: number, originalTarget?: number) {
  try {
    const currentEl = dom.currentReps(exercise);
    const totalEl = dom.totalReps(exercise);
    const bonusEl = dom.bonus(exercise);
    const progressEl = dom.progressBar(exercise);

    if (!currentEl || !totalEl) {
      return;
    }

    if (currentEl) {
      currentEl.textContent = String(current);
      // Show in green when current reaches 0
      if (current === 0) {
        currentEl.classList.add('complete');
      } else {
        currentEl.classList.remove('complete');
      }
    }
    if (totalEl) totalEl.textContent = String(total);

    // Update bonus reps display
    // Bonus = how much total was increased from the original target
    if (bonusEl && originalTarget !== undefined) {
      const bonusReps = Math.max(0, total - originalTarget);
      
      if (bonusReps > 0) {
        bonusEl.textContent = `+${bonusReps}`;
        bonusEl.classList.add('show');
      } else {
        bonusEl.textContent = '+0';
        bonusEl.classList.remove('show');
      }
    }

    if (progressEl) {
      const totalReps = total || 1;
      const percentage = Math.min((current / totalReps) * 100, 100);
      progressEl.style.width = percentage + '%';
    }
  } catch (e) {
    console.error(`Error updating ${exercise}:`, e);
  }
}

export function getFormValues() {
  const pullups = parseInt(dom.pullupInput().value) || 0;
  const pushups = parseInt(dom.pushupInput().value) || 0;
  const squats = parseInt(dom.squatInput().value) || 0;

  return { pullups, pushups, squats };
}

export function resetForm() {
  const form = dom.setupForm();
  if (form) {
    form.reset();
  }
}

export function updateTimerDisplay(timeString: string): void {
  const timerEl = dom.timerDisplay();
  if (timerEl) {
    timerEl.textContent = timeString;
  }
}

export function updateTimerButton(isPaused: boolean): void {
  const btn = dom.timerBtn();
  if (btn) {
    btn.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
  }
}

export function showCompletionDialog(): void {
  const dialog = dom.completionDialog();
  if (dialog) {
    dialog.classList.remove('hidden');
  }
}

export function hideCompletionDialog(): void {
  const dialog = dom.completionDialog();
  if (dialog) {
    dialog.classList.add('hidden');
  }
}

export function setFormValues(pullups: number, pushups: number, squats: number): void {
  const pullupInput = dom.pullupInput();
  const pushupInput = dom.pushupInput();
  const squatInput = dom.squatInput();

  if (pullupInput) pullupInput.value = pullups.toString();
  if (pushupInput) pushupInput.value = pushups.toString();
  if (squatInput) squatInput.value = squats.toString();
}
