import { test, expect } from '@playwright/test';

test('homepage loads and displays the app title', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Compliance Kit');
  await expect(page.locator('text=Connect Wallet')).toBeVisible();
});

test('navigation links are present', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Dashboard')).toBeVisible();
  await expect(page.locator('text=Identity')).toBeVisible();
  await expect(page.locator('text=Compliance')).toBeVisible();
  await expect(page.locator('text=Transfer')).toBeVisible();
  await expect(page.locator('text=Admin')).toBeVisible();
});
