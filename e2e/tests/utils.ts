import { expect, Page } from '@playwright/test'

export const isLogin = async (page: Page): Promise<boolean> => {
  return page.url() !== 'about:blank'
}

export const login = async (page: Page): Promise<void> => {
  const loginTimeout = parseInt(process.env.E2E_LOGIN_TIMEOUT || '60000')
  const email = process.env.E2E_TEST_ADMIN_USER_EMAIL ?? 'test@example.com'
  const password = process.env.E2E_TEST_ADMIN_USER_PASSWORD ?? 'password'

  await page.goto('/login', { timeout: loginTimeout })
  await expect(page).toHaveTitle(/Log in/, { timeout: loginTimeout })

  await page.locator('#email').fill(email, { timeout: loginTimeout })
  await page.locator('#password').fill(password, { timeout: loginTimeout })
  await page.getByRole('button', { name: 'Log in' }).click({ timeout: loginTimeout })
  await page.waitForLoadState('networkidle', { timeout: loginTimeout })
}
