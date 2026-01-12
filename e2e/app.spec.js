import { test, expect } from '@playwright/test'

test.describe('Utang Tracker App', () => {
  test('should load the app and show login page', async ({ page }) => {
    // Go directly to the base URL (which should redirect to login)
    await page.goto('/')
    
    // Wait for React app to render - look for root div to have content
    await page.waitForFunction(() => {
      const root = document.getElementById('root')
      return root && root.children.length > 0
    }, { timeout: 30000 })
    
    // Check page title
    await expect(page).toHaveTitle('Utang Tracker')
    
    // Should have redirected to login - check for login elements
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should have Google sign-in button', async ({ page }) => {
    await page.goto('/')
    
    // Wait for app to render
    await page.waitForFunction(() => {
      const root = document.getElementById('root')
      return root && root.children.length > 0
    }, { timeout: 30000 })
    
    // Check Google button
    await expect(page.getByText('Continue with Google')).toBeVisible({ timeout: 10000 })
  })

  test('should toggle between sign in and sign up modes', async ({ page }) => {
    await page.goto('/')
    
    // Wait for app to render
    await page.waitForFunction(() => {
      const root = document.getElementById('root')
      return root && root.children.length > 0
    }, { timeout: 30000 })
    
    // Click to create account
    await page.getByText('Create one').click()
    
    // Submit button should now say Create Account
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible()
    
    // Switch back
    await page.getByText('Sign in').click()
    
    // Should be back to Sign In
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Wait for app to render
    await page.waitForFunction(() => {
      const root = document.getElementById('root')
      return root && root.children.length > 0
    }, { timeout: 30000 })
    
    // Check elements are visible and usable
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })
})
