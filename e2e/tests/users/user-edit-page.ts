import { expect, Locator, Page } from '@playwright/test'
import { BasePage, step } from '../base-page'

export class UserEditPage extends BasePage {
  readonly form: Locator
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly saveButton: Locator
  readonly resetButton: Locator
  readonly errorMessage: Locator
  readonly articleTableRows: Locator

  constructor(page: Page) {
    super(page)
    this.form = page.locator('[data-testid="user-edit-form"]')
    this.nameInput = page.locator('[data-testid="user-edit-name"]')
    this.emailInput = page.locator('[data-testid="user-edit-email"]')
    this.saveButton = page.locator('[data-testid="user-edit-save"]')
    this.resetButton = page.locator('[data-testid="user-edit-reset"]')
    this.errorMessage = page.locator('[data-testid="user-edit-error"]')
    this.articleTableRows = page.locator('.el-table__body-wrapper .el-table__row')
  }

  @step()
  async gotoEdit(userId: number): Promise<void> {
    await this.goto(`/users/${userId}/edit`)
    await this.waitForLoadState('networkidle')
    await expect(this.form).toBeVisible({ timeout: 15000 })
  }

  @step()
  async getNameValue(): Promise<string> {
    await expect(this.nameInput).toBeVisible({ timeout: 15000 })
    return await this.nameInput.inputValue()
  }

  @step()
  async getEmailValue(): Promise<string> {
    await expect(this.emailInput).toBeVisible({ timeout: 15000 })
    return await this.emailInput.inputValue()
  }

  @step()
  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name)
  }

  @step()
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email)
  }

  @step()
  async saveAndExpectSuccess(): Promise<void> {
    const waitMutation = this.page.waitForResponse(resp => {
      if (!resp.url().includes('/graphql')) return false
      const postData = resp.request().postData() ?? ''
      return postData.includes('mutation UpdateUser')
    })

    await this.saveButton.click()
    await waitMutation

    const toast = this.page.locator('.el-message').filter({ hasText: 'プロフィール情報を更新しました' })
    await expect(toast).toBeVisible({ timeout: 10000 })

    // 念のため、フォームが操作可能に戻るまで待機
    await expect(this.saveButton).toBeVisible()
  }

  @step()
  async expectNameValue(value: string): Promise<void> {
    await expect(this.nameInput).toHaveValue(value)
  }

  @step()
  async expectEmailValue(value: string): Promise<void> {
    await expect(this.emailInput).toHaveValue(value)
  }

  @step()
  async getArticleTitle(rowIndex = 0): Promise<string> {
    const row = this.articleTableRows.nth(rowIndex)
    const titleInput = row.locator('input').first()
    await expect(titleInput).toBeVisible()
    const value = await titleInput.inputValue()
    if (value && value.trim().length > 0) {
      return value
    }
    return (await titleInput.getAttribute('placeholder')) ?? ''
  }

  @step()
  async updateArticleTitle(rowIndex: number, newTitle: string): Promise<void> {
    const row = this.articleTableRows.nth(rowIndex)
    const titleInput = row.locator('input').first()
    await expect(titleInput).toBeVisible()

    await titleInput.fill(newTitle)
    await titleInput.press('Enter')
    await this.page
      .waitForResponse(resp => {
        if (!resp.url().includes('/graphql')) return false
        const body = resp.request().postData() ?? ''
        return body.includes('mutation UpdateArticle')
      }, { timeout: 10000 })
      .catch(() => null)

    await expect(titleInput).toHaveValue(new RegExp(newTitle), { timeout: 15000 })
  }

  @step()
  async expectArticleTitle(rowIndex: number, expected: string): Promise<void> {
    const row = this.articleTableRows.nth(rowIndex)
    const titleInput = row.locator('input').first()
    await expect(titleInput).toHaveValue(new RegExp(expected))
  }

  @step()
  async addTagToArticle(rowIndex: number, tagName: string): Promise<void> {
    const row = this.articleTableRows.nth(rowIndex)
    const newTagButton = row.locator('.button-new-tag')
    await newTagButton.click()

    const tagInput = row.locator('input[placeholder="Search Tag"]').first()
    await expect(tagInput).toBeVisible()
    await tagInput.fill(tagName)
    await tagInput.press('Enter')

    const waitMutation = this.page.waitForResponse(resp => {
      if (!resp.url().includes('/graphql')) return false
      const body = resp.request().postData() ?? ''
      return body.includes('mutation SyncTagsByNameWithArticle')
    })

    await row.getByRole('button', { name: 'Update Tags' }).click()
    await waitMutation

    const tagChip = row.locator('.el-tag', { hasText: tagName })
    await expect(tagChip).toBeVisible({ timeout: 10000 })
  }

  @step()
  async removeTagFromArticle(rowIndex: number, tagName: string): Promise<void> {
    const row = this.articleTableRows.nth(rowIndex)
    const tagChip = row.locator('.el-tag', { hasText: tagName })
    const closeButton = tagChip.locator('.el-tag__close')
    await expect(tagChip).toBeVisible()
    await closeButton.click()

    const waitMutation = this.page.waitForResponse(resp => {
      if (!resp.url().includes('/graphql')) return false
      const body = resp.request().postData() ?? ''
      return body.includes('mutation SyncTagsByNameWithArticle')
    })

    await row.getByRole('button', { name: 'Update Tags' }).click()
    await waitMutation

    await expect(tagChip).toHaveCount(0)
  }
}

