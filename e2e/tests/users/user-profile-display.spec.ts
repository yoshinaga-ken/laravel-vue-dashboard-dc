import { test, expect } from '@playwright/test'
import { UserProfilePage } from './user-profile-page'
import { login } from '../utils'

test.describe('ユーザープロフィール表示', () => {
  let userProfilePage: UserProfilePage

  test.beforeEach(async ({ page }) => {
    await login(page)
    userProfilePage = new UserProfilePage(page)
  })

  test('ページが正常に読み込まれる', async ({ page }) => {
    // ユーザーIDは1番のユーザーを使用（通常Admin）
    await userProfilePage.visitUserProfile(1)

    // ページタイトルが設定されていることを確認
    const title = await page.title()
    expect(title).toContain('プロフィール')

    // 基本的なページ構造が存在することを確認
    const cards = await page.locator('.el-card').count()
    expect(cards).toBeGreaterThan(0)
  })

  test('基本情報セクションが表示される', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)

    // 基本情報カードが表示されること
    const basicInfoCard = page.locator('.el-card').first()
    await expect(basicInfoCard).toBeVisible()

    // ユーザー名が表示されること（h2タグ）
    const userName = page.locator('h2').first()
    await expect(userName).toBeVisible()
    const userNameText = await userName.textContent()
    expect(userNameText).toBeTruthy()

    // メールアドレスらしきテキストが表示されること
    const textElements = await page.locator('text=@').all()
    expect(textElements.length).toBeGreaterThan(0)

    // アバターが表示されること
    const avatar = page.locator('.el-avatar').first()
    await expect(avatar).toBeVisible()
  })

  test('ページが404でないことを確認', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)

    // 404ページではないことを確認
    const pageText = await page.textContent('body')
    expect(pageText).not.toContain('404')
    expect(pageText).not.toContain('見つかりません')
    expect(pageText).not.toContain('Not Found')
  })

  test('ナビゲーション可能性をテスト', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)

    // ページ読み込み完了を待つ
    await page.waitForLoadState('networkidle')

    // 基本的なナビゲーション要素が存在することを確認
    const links = await page.locator('a').count()
    expect(links).toBeGreaterThan(0)
  })

  test('存在しないユーザーへのアクセス処理', async ({ page }) => {
    // 存在しないユーザーIDでアクセス
    await page.goto('/users/999999')
    await page.waitForLoadState('networkidle')

    // エラーが適切に処理されていることを確認
    const pageText = await page.textContent('body')
    const hasError = pageText?.includes('404') ||
                     pageText?.includes('見つかりません') ||
                     pageText?.includes('Not Found') ||
                     pageText?.includes('エラー')

    // 何らかのエラー処理がされていることを確認
    expect(hasError).toBe(true)
  })
})
