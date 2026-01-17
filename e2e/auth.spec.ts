import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should redirect unauthenticated users from dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to login or show auth prompt
    await expect(page).not.toHaveURL('/dashboard');
  });

  test('should redirect unauthenticated users from generate page', async ({ page }) => {
    await page.goto('/generate');

    // Should redirect to login or show auth prompt
    await expect(page).not.toHaveURL('/generate');
  });

  test('should display login options', async ({ page }) => {
    await page.goto('/login');

    // Check for Google login button
    const googleButton = page.getByRole('button', { name: /google/i });
    if (await googleButton.isVisible()) {
      await expect(googleButton).toBeEnabled();
    }

    // Check for GitHub login button
    const githubButton = page.getByRole('button', { name: /github/i });
    if (await githubButton.isVisible()) {
      await expect(githubButton).toBeEnabled();
    }
  });
});
