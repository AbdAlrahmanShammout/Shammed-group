import { expect, test } from '@playwright/test';

import { requireAdminPassword } from './helpers/require-admin-password';

test.describe('critical admin journeys', () => {
  test('signs in to the admin dashboard with the env password', async ({ page }) => {
    const password = requireAdminPassword();
    await page.goto('/admin/login');
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/admin\/?$/);
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  });

  test('creates a hidden product that does not appear on the public catalog', async ({ page }) => {
    const password = requireAdminPassword();
    const productName = `E2E Hidden Product ${Date.now()}`;
    await page.goto('/admin/login');
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/admin\/?$/);
    await page.goto('/admin/products');
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    await page.getByRole('button', { name: 'Add product' }).click();
    await page.getByLabel(/^Name/).fill(productName);
    await page.getByLabel(/^Short description/).fill('Hidden by Playwright critical journey.');
    await page.getByLabel(/^Category/).selectOption({ label: 'Pharmaceutical Products' });
    await page.getByLabel('Visible on the public site').uncheck();
    await page.getByRole('button', { name: 'Add product' }).click();
    await expect(page.getByRole('button', { name: 'Add product' })).toBeVisible();
    const productRow = page.getByRole('listitem').filter({ hasText: productName });
    await expect(productRow).toBeVisible();
    await expect(productRow.getByText(/Hidden · order/)).toBeVisible();
    await page.goto('/products');
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    await expect(page.getByRole('heading', { name: productName })).toHaveCount(0);
    await page.getByRole('button', { name: 'Pharmaceutical Products' }).click();
    await expect(page.getByRole('heading', { name: productName })).toHaveCount(0);
  });
});
