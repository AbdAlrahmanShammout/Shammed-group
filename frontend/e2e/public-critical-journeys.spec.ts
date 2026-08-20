import { expect, test } from '@playwright/test';

test.describe('critical public journeys', () => {
  test('shows seeded demo products and filters by category', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Medical Equipment' })).toBeVisible();
    await expect(page.getByText('Demo Mobile C-Arm System')).toBeVisible();
    await page.getByRole('button', { name: 'Medical Equipment' }).click();
    await expect(page).toHaveURL(/categoryId=/);
    await expect(page.getByText('Demo Mobile C-Arm System')).toBeVisible();
    await expect(page.getByText('Demo Tablet Coating Machine')).toHaveCount(0);
  });

  test('submits the public contact form successfully', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
    await page.getByLabel(/^Full Name/).fill('E2E Contact User');
    await page.getByLabel(/^Email/).fill('e2e.contact@example.com');
    await page.getByLabel(/^Subject/).fill('Playwright contact journey');
    await page.getByLabel(/^Message/).fill('This inquiry was submitted by the critical e2e suite.');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByText('Your message was sent successfully.')).toBeVisible();
  });
});
