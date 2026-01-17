import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display hero section', async ({ page }) => {
    await page.goto('/');

    // Check hero title is visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Check CTA buttons are visible (use .first() for multiple matching elements)
    await expect(
      page.getByRole('link', { name: /get started|무료로 시작/i }).first()
    ).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');

    // Check features section link works (use .first() for multiple matching elements)
    const featuresLink = page.getByRole('link', { name: /features|기능/i }).first();
    if (await featuresLink.isVisible()) {
      await featuresLink.click();
      await expect(page).toHaveURL(/#features/);
    }
  });

  test('should display pricing section', async ({ page }) => {
    await page.goto('/');

    // Scroll to pricing section
    await page.getByText(/pricing|가격/i).first().scrollIntoViewIfNeeded();

    // Check pricing cards are visible (use .first() for multiple matching elements)
    const pricingSection = page.locator('section').filter({ hasText: /starter|basic|pro/i }).first();
    await expect(pricingSection).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Hero should still be visible on mobile
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Mobile menu should be available
    const menuButton = page.getByRole('button', { name: /menu|메뉴/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Menu should open
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });
});
