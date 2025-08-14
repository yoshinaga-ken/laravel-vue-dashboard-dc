import { expect, Page } from '@playwright/test'

export const isLogin = async (page: Page): Promise<boolean> => {
  return page.url() !== 'about:blank'
}

export const login = async (page: Page): Promise<void> => {
  // ログイン処理用の延長タイムアウト設定（環境変数で制御可能、デフォルト60秒）
  const loginTimeout = parseInt(process.env.E2E_LOGIN_TIMEOUT || '60000')

  await page.goto('/login', { timeout: loginTimeout })
  await expect(page).toHaveTitle(/Log in/, { timeout: loginTimeout })

  await page
    .locator('#email')
    .fill(process.env.E2E_TEST_ADMIN_USER_EMAIL ?? '', { timeout: loginTimeout })
  await page
    .locator('#password')
    .fill(process.env.E2E_TEST_ADMIN_USER_PASSWORD ?? '', { timeout: loginTimeout })
  await page.getByRole('button', { name: 'Log in' }).click({ timeout: loginTimeout })
  await page.waitForLoadState('networkidle', { timeout: loginTimeout })
}
