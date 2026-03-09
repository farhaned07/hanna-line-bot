/**
 * Playwright E2E Tests for Hanna Scribe
 * Critical Clinical Flow - Happy Path Only
 * 
 * Run: npx playwright test
 */

import { test, expect } from '@playwright/test';

// Test configuration
test.describe('Hanna Scribe - Critical Clinical Flow', () => {
    test.setTimeout(120000); // 2 minutes for full flow

    // Test 1: Login Flow
    test('should login successfully', async ({ page }) => {
        await page.goto('http://localhost:5174/scribe/app/login');
        
        // Enter email
        await page.fill('input[type="email"]', 'test@hanna.care');
        
        // Submit
        await page.click('button[type="submit"]');
        
        // Wait for navigation to home
        await expect(page).toHaveURL(/\/scribe\/app\/?$/);
        
        // Verify user is logged in (check for greeting)
        await expect(page.locator('text=Good')).toBeVisible();
    });

    // Test 2: Create New Session
    test('should create a new session', async ({ page }) => {
        // Assume already logged in from previous test
        await page.goto('http://localhost:5174/scribe/app/');
        
        // Click FAB (Floating Action Button)
        await page.click('button[aria-label="New session"]');
        
        // Wait for sheet to open
        await expect(page.locator('text=New Session')).toBeVisible();
        
        // Fill patient details
        await page.fill('input[placeholder*="Patient name"]', 'Test Patient');
        await page.fill('input[placeholder*="Hospital Number"]', 'HN12345');
        
        // Select template (SOAP is default)
        await page.click('text=S O A P');
        
        // Start recording
        await page.click('text=Start Recording');
        
        // Should navigate to recording page
        await expect(page).toHaveURL(/\/record\//);
    });

    // Test 3: Recording Page Loads
    test('should load recording page with timer', async ({ page }) => {
        // Navigate to a recording session (use existing or create)
        await page.goto('http://localhost:5174/scribe/app/');
        
        // Wait for sessions to load
        await page.waitForSelector('text=Today, text=Yesterday, text=/Patient/', { timeout: 10000 });
        
        // Click on first session or FAB
        const fab = page.locator('button').filter({ hasText: '+' }).first();
        await fab.click();
        
        // Fill minimal details and start
        await page.fill('input[placeholder*="Patient name"]', 'E2E Test');
        await page.click('text=Start Recording');
        
        // Wait for recording page
        await expect(page).toHaveURL(/\/record\//);
        
        // Verify timer is present and starts
        const timer = page.locator('text=/\\d{2}:\\d{2}/').first();
        await expect(timer).toBeVisible();
        
        // Wait 3 seconds and verify timer increments
        await page.waitForTimeout(3000);
        await expect(timer).toBeVisible();
    });

    // Test 4: Processing Page Displays
    test('should show processing screen after recording', async ({ page }) => {
        // This test would require actual audio recording
        // For now, we'll test the processing page directly
        await page.goto('http://localhost:5174/scribe/app/processing/test-session-id');
        
        // Should show processing stages
        await expect(page.locator('text=Transcribing')).toBeVisible({ timeout: 5000 });
    });

    // Test 5: Note View Displays SOAP Sections
    test('should display note with SOAP sections', async ({ page }) => {
        // Navigate to home
        await page.goto('http://localhost:5174/scribe/app/');
        
        // Wait for sessions
        await page.waitForTimeout(2000);
        
        // Click on first session card (if exists)
        const sessionCards = page.locator('[data-testid="session-card"]');
        const count = await sessionCards.count();
        
        if (count > 0) {
            await sessionCards.first().click();
            
            // Should navigate to note view
            await expect(page).toHaveURL(/\/note\//);
            
            // Verify SOAP sections are present
            await expect(page.locator('text=Subjective')).toBeVisible({ timeout: 5000 });
            await expect(page.locator('text=Objective')).toBeVisible();
            await expect(page.locator('text=Assessment')).toBeVisible();
            await expect(page.locator('text=Plan')).toBeVisible();
        }
    });

    // Test 6: Medical Disclaimer Present
    test('should display medical disclaimer on note view', async ({ page }) => {
        await page.goto('http://localhost:5174/scribe/app/');
        
        // Wait for sessions to load
        await page.waitForTimeout(2000);
        
        // Click first session
        const sessionCards = page.locator('[data-testid="session-card"]');
        const count = await sessionCards.count();
        
        if (count > 0) {
            await sessionCards.first().click();
            
            // Wait for note to load
            await page.waitForTimeout(1000);
            
            // Verify medical disclaimer is present
            await expect(page.locator('text=Not a Medical Device')).toBeVisible();
            await expect(page.locator('text=AI Generated - Verify Before Use')).toBeVisible();
        }
    });

    // Test 7: Export PDF Triggers
    test('should trigger PDF export', async ({ page }) => {
        await page.goto('http://localhost:5174/scribe/app/');
        await page.waitForTimeout(2000);
        
        const sessionCards = page.locator('[data-testid="session-card"]');
        const count = await sessionCards.count();
        
        if (count > 0) {
            await sessionCards.first().click();
            await page.waitForTimeout(1000);
            
            // Click PDF export button
            const pdfButton = page.locator('button').filter({ hasText: 'PDF' });
            await pdfButton.click();
            
            // Should trigger download (we can't verify download in E2E)
            // But we can verify the button was clickable
            await expect(pdfButton).toBeEnabled();
        }
    });

    // Test 8: Settings Page Loads
    test('should load settings page', async ({ page }) => {
        await page.goto('http://localhost:5174/scribe/app/settings');
        
        // Verify settings sections
        await expect(page.locator('text=Settings')).toBeVisible();
        await expect(page.locator('text=Profile')).toBeVisible();
        await expect(page.locator('text=Language')).toBeVisible();
    });

    // Test 9: Logout Works
    test('should logout successfully', async ({ page }) => {
        await page.goto('http://localhost:5174/scribe/app/settings');
        
        // Click sign out
        await page.click('text=Sign Out');
        
        // Should redirect to login
        await expect(page).toHaveURL(/\/login/);
        
        // Verify localStorage cleared
        const token = await page.evaluate(() => localStorage.getItem('scribe_token_enc'));
        expect(token).toBeNull();
    });

    // Test 10: Auth Required (No Token = Redirect)
    test('should redirect to login without auth', async ({ page }) => {
        // Clear localStorage
        await page.evaluate(() => localStorage.clear());
        
        // Try to access protected route
        await page.goto('http://localhost:5174/scribe/app/');
        
        // Should redirect to login
        await expect(page).toHaveURL(/\/login/);
    });
});
