import { test } from '@playwright/test'
import { isLogin, login } from '../utils'
import { UserEditPage } from './user-edit-page'

test.describe('ユーザー編集画面 E2E', () => {
  test.setTimeout(60000)

  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('ユーザー情報（名前・メールアドレス）を更新できる', async ({ page }) => {
    const userId = 1
    const userEditPage = new UserEditPage(page)

    await userEditPage.gotoEdit(userId)

    const originalName = await userEditPage.getNameValue()
    const originalEmail = await userEditPage.getEmailValue()

    const updatedName = `${originalName} (e2e-${Date.now()})`
    const updatedEmail = `e2e-${Date.now()}@example.com`

    await userEditPage.fillName(updatedName)
    await userEditPage.fillEmail(updatedEmail)
    await userEditPage.saveAndExpectSuccess()

    // リロード後も反映されていること（永続化）を確認
    await page.reload()
    await userEditPage.gotoEdit(userId)
    await userEditPage.expectNameValue(updatedName)
    await userEditPage.expectEmailValue(updatedEmail)

    // 後続テストへの影響を避けるため元に戻す
    await userEditPage.fillName(originalName)
    await userEditPage.fillEmail(originalEmail)
    await userEditPage.saveAndExpectSuccess()
  })

  test('記事のタイトルとタグを編集できる', async ({ page }) => {
    const userId = 1
    const rowIndex = 0
    const userEditPage = new UserEditPage(page)

    await userEditPage.gotoEdit(userId)

    // タイトル編集
    const originalTitle = await userEditPage.getArticleTitle(rowIndex)
    const newTitle = `E2E Title ${Date.now()}`
    await userEditPage.updateArticleTitle(rowIndex, newTitle)
    await userEditPage.expectArticleTitle(rowIndex, newTitle)

    // タグ編集（追加してから削除）
    const newTag = `e2e-tag-${Date.now()}`
    await userEditPage.addTagToArticle(rowIndex, newTag)
    await userEditPage.removeTagFromArticle(rowIndex, newTag)
  })
})
