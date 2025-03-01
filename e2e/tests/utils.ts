import { expect, Page } from '@playwright/test';

export const isLogin = async (page: Page): Promise<boolean> => {
  return page.url() !== 'about:blank';
};

export const login = async (page: Page): Promise<void> => {
  await page.goto('/login');
  await expect(page).toHaveTitle(/Log in/);

  await page.locator('#email').fill(process.env.E2E_TEST_ADMIN_USER_EMAIL ?? '');
  await page.locator('#password').fill(process.env.E2E_TEST_ADMIN_USER_PASSWORD ?? '');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForLoadState('networkidle');
};
