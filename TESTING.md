# Testing Guide

Comprehensive testing strategy: **62 fast unit + integration tests** (~380ms). No slow E2E tests.

## Test Stack

- **Vitest 4.0** - Fast test runner (~380ms for 62 tests)
- **Happy-DOM 20.0** - Lightweight DOM (perfect for this app)
- **Testing Library** - DOM testing utilities

## Running Tests

```bash
npm run test          # Single run (62 tests, ~380ms)
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## Test Coverage (62 tests)

- 9 unit tests - Workout logic
- 8 storage tests - Data persistence
- 11 DOM tests - Display updates
- 9 completion tests - Dialog & forms
- 17 workflow tests - Full flows including timer persistence

## Why Vitest + Happy-DOM?

- **Speed:** 62 tests in ~380ms (vs 10+ seconds for Playwright)
- **Perfect fit:** App doesn't need complex browser simulation
- **Reliable:** No timing issues, no flakiness
- **Integration tests cover all flows:** Full workflows without browser overhead

## Adding New Tests

### Example: Timer Persistence Test
```typescript
it('should restore elapsed time when reloading workout', () => {
  // Start workout
  const mockEvent = new Event('submit') as Event;
  startWorkout(mockEvent, () => ({ pullups: 10, pushups: 15, squats: 20 }));

  // Simulate time passage
  state.elapsedTime = 5000; // 5 seconds
  saveSession(state);

  // Reset and reload
  state.elapsedTime = 0;
  loadWorkoutState();

  // Timer should be restored
  expect(state.elapsedTime).toBe(5000);
});
```

## Test Setup Pattern

```typescript
beforeEach(() => {
  localStorage.clear();        // Clean storage
  state.pullups = {...};       // Reset state
  vi.clearAllMocks();          // Clear mocks
});
```

## Mocking Examples

```typescript
// Mock confirm dialog
vi.stubGlobal('confirm', () => true);  // User clicks OK
resetWorkout();

vi.stubGlobal('confirm', () => false); // User clicks Cancel
resetWorkout();
```

## CI/CD

Tests run on every push:
1. GitHub Actions triggers
2. `npm run test` runs all 62 tests
3. Must pass to deploy
4. Deploys to GitHub Pages if successful

## Performance

- **Target:** <500ms for all tests
- **Actual:** ~380ms for 62 tests
- **Fast iteration:** Instant feedback while developing

## Why No E2E Tests?

Removed slow Playwright E2E tests because:
1. **Speed:** Integration tests run 60x faster
2. **Reliability:** No browser flakiness
3. **Coverage:** Integration tests cover all flows
4. **CI/CD:** Faster feedback loop

Integration tests are ideal for this app's complexity.

## Resources

- [Vitest](https://vitest.dev/)
- [Happy-DOM](https://github.com/capricorn86/happy-dom)
- [Testing Library](https://testing-library.com/)

````

## Test Stack

- **Vitest** - Fast unit and integration tests in Node
- **Testing Library** - DOM testing utilities
- **Playwright** - End-to-end browser testing

## Running Tests

### All Tests
```bash
npm run test:all
```

### Unit & Integration Tests Only
```bash
npm run test
```

Watch mode:
```bash
npm run test -- --watch
```

UI mode:
```bash
npm run test:ui
```

Coverage report:
```bash
npm run test:coverage
```

### E2E Tests
```bash
npm run test:e2e
```

Debug mode (opens inspector):
```bash
npm run test:e2e:debug
```

View report after test run:
```bash
npx playwright show-report
```

## Test Structure

```
tests/
├── setup.ts              # Global test configuration
├── unit/                 # Business logic tests
│   ├── workout.test.ts  # Workout state management
│   └── storage.test.ts  # localStorage operations
├── integration/          # DOM + state interaction tests
│   └── dom.test.ts      # DOM manipulation and displays
└── e2e/                 # Full user flow tests
    └── workout.spec.ts  # Complete workout scenarios
```

## What Each Test Level Does

### Unit Tests (Vitest)
- Workout decrement logic
- Bonus rep calculations
- Storage save/load/clear
- Error handling

### Integration Tests (Vitest)
- Reps display updates
- Progress bar calculations
- Form input parsing
- DOM state synchronization

### E2E Tests (Playwright)
- Complete workout flow
- Bonus rep handling
- Workout completion
- State persistence
- Workout resume on reload
- Reset functionality
- Timer controls
- Mobile responsiveness

## Adding New Tests

### Unit Test Example
```typescript
describe('My Feature', () => {
  it('should do something', () => {
    // Arrange
    const input = {}

    // Act
    const result = myFunction(input)

    // Assert
    expect(result).toBe(expected)
  })
})
```

### Integration Test Example
```typescript
beforeEach(() => {
  document.body.innerHTML = `<div id="test">Content</div>`
})

it('should update DOM', () => {
  const el = document.getElementById('test')
  updateDOM(el)
  expect(el.textContent).toBe('Updated')
})
```

### E2E Test Example
```typescript
test('should complete user journey', async ({ page }) => {
  await page.goto('/')
  await page.fill('#input', 'value')
  await page.click('button')
  await expect(page.locator('#result')).toBeVisible()
})
```

## CI/CD Integration

Tests run automatically on:
- Every push to `master`
- Every pull request

The workflow:
1. Runs unit/integration tests (Vitest)
2. Runs E2E tests (Playwright)
3. Uploads test reports as artifacts
4. Only builds if all tests pass
5. Deploys to GitHub Pages if build succeeds

## Common Issues

### Tests fail locally but pass in CI
- Clear node_modules: `rm -rf node_modules && npm ci`
- Check Node version: should be 20+

### E2E tests can't find app
- Ensure `npm run dev` is running in another terminal
- Check baseURL in `playwright.config.ts`

### Service Worker interferes with tests
- Tests use happy-dom (no service worker support)
- E2E tests handle service worker properly

## Resources

- [Vitest Docs](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [Playwright Docs](https://playwright.dev/)
