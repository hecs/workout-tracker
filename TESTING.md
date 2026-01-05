# Testing Guide

This project uses a comprehensive testing strategy with unit, integration, and E2E tests.

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
