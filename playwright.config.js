/**
 * Playwright Configuration for Hanna Scribe E2E Tests
 * 
 * Run: npx playwright test
 * Run with UI: npx playwright test --ui
 * Run specific file: npx playwright test clinical-flow
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    
    // Timeout per test
    timeout: 120000,
    
    // Run tests in parallel
    fullyParallel: false, // Run sequentially for now
    
    // Fail the build on CI if you accidentally left test.only in the source code
    forbidOnly: !!process.env.CI,
    
    // Retry on CI only
    retries: process.env.CI ? 2 : 0,
    
    // Opt out of parallel tests
    workers: 1,
    
    // Reporter
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['list'],
        ['json', { outputFile: 'test-results.json' }]
    ],
    
    // Shared settings for all the projects
    use: {
        // Base URL to use in actions like `await page.goto('/')`
        baseURL: 'http://localhost:5174',
        
        // Collect trace when retrying the failed test
        trace: 'on-first-retry',
        
        // Screenshot on failure
        screenshot: 'only-on-failure',
        
        // Video on failure
        video: 'retain-on-failure',
        
        // Browser context options
        viewport: { width: 375, height: 667 }, // Mobile viewport
    },
    
    // Configure projects for major browsers
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        // Test on mobile since Scribe is mobile-first
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],
    
    // Run your local dev server before starting the tests
    webServer: {
        command: 'cd scribe && npm run dev',
        url: 'http://localhost:5174',
        reuseExistingServer: !process.env.CI,
        timeout: 60000,
    },
});
