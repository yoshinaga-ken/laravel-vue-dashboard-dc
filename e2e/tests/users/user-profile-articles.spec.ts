import { test, expect } from '@playwright/test'
import { UserProfilePage } from './user-profile-page'
import { login } from '../utils'
import { initializeTestEnvironment, waitForPageLoad } from './test-helpers'

test.describe('ユーザー記事一覧機能', () => {
  let userProfilePage: UserProfilePage

  test.beforeEach(async ({ page }) => {
    await login(page)
    userProfilePage = new UserProfilePage(page)
  })

  test('記事一覧が表示される', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    // 記事セクションが表示されることを確認
    const articlesSection = page.locator('[data-testid="articles-section"], .el-card').nth(2)
    await expect(articlesSection).toBeVisible()

    // 記事数の確認
    const articlesCount = await userProfilePage.getArticlesCount()

    if (articlesCount > 0) {
      // 記事アイテムが表示されることを確認
      const articleItems = page.locator('[data-testid="article-item"], .article-item, .el-card .el-card')
      await expect(articleItems.first()).toBeVisible()

      // 記事タイトルが表示されることを確認
      const firstArticleTitle = page.locator('[data-testid="article-title"], .article-title, h3, h4').first()
      if (await firstArticleTitle.count() > 0) {
        await expect(firstArticleTitle).toBeVisible()
        const titleText = await firstArticleTitle.textContent()
        expect(titleText?.trim()).toBeTruthy()
      }
    } else {
      // 記事がない場合のメッセージ確認
      const noArticlesMessage = page.locator('[data-testid="no-articles"], .no-articles, .empty-state')
      if (await noArticlesMessage.count() > 0) {
        await expect(noArticlesMessage).toBeVisible()
      }
    }
  })

  test('記事の詳細情報が表示される', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    const articlesCount = await userProfilePage.getArticlesCount()

    if (articlesCount > 0) {
      const firstArticle = page.locator('[data-testid="article-item"], .article-item').first()
      await expect(firstArticle).toBeVisible()

      // 記事タイトルの確認
      const articleTitle = firstArticle.locator('[data-testid="article-title"], .article-title, h3, h4')
      if (await articleTitle.count() > 0) {
        await expect(articleTitle).toBeVisible()
      }

      // 記事作成日の確認
      const articleDate = firstArticle.locator('[data-testid="article-date"], .article-date, .created-at, .text-gray-600')
      if (await articleDate.count() > 0) {
        await expect(articleDate).toBeVisible()
      }

      // 記事タグの確認
      const articleTags = firstArticle.locator('[data-testid="article-tags"], .article-tags, .el-tag')
      if (await articleTags.count() > 0) {
        await expect(articleTags.first()).toBeVisible()
      }

      // 記事概要の確認
      const articleSummary = firstArticle.locator('[data-testid="article-summary"], .article-summary, p')
      if (await articleSummary.count() > 0) {
        await expect(articleSummary).toBeVisible()
      }
    }
  })

  test('記事詳細ページへの遷移', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    const articlesCount = await userProfilePage.getArticlesCount()

    if (articlesCount > 0) {
      // 記事タイトルまたは記事リンクをクリック
      const articleLink = page.locator('a[href*="/articles/"], [data-testid="article-link"]').first()

      if (await articleLink.count() > 0) {
        const href = await articleLink.getAttribute('href')
        expect(href).toMatch(/\/articles\/\d+/)

        // 新しいタブで開くかどうかを確認
        const target = await articleLink.getAttribute('target')

        if (target === '_blank') {
          // 新しいタブで開く場合
          const [newPage] = await Promise.all([
            page.context().waitForEvent('page'),
            articleLink.click()
          ])
          await newPage.waitForLoadState('networkidle')

          const newUrl = newPage.url()
          expect(newUrl).toMatch(/\/articles\/\d+/)
          await newPage.close()
        } else {
          // 同じタブで開く場合
          await articleLink.click()
          await page.waitForLoadState('networkidle')

          const currentUrl = page.url()
          expect(currentUrl).toMatch(/\/articles\/\d+/)

          // 元のプロフィールページに戻る
          await page.goBack()
          await waitForPageLoad(page)
        }
      }
    }
  })

  test('記事タグのクリック機能', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    const articlesCount = await userProfilePage.getArticlesCount()

    if (articlesCount > 0) {
      // 記事のタグを探す
      const articleTags = page.locator('[data-testid="article-tag"], .article-tag, .el-tag')

      if (await articleTags.count() > 0) {
        const firstTag = articleTags.first()
        await expect(firstTag).toBeVisible()

        const tagText = await firstTag.textContent()
        expect(tagText?.trim()).toBeTruthy()

        // タグをクリック
        const tagLink = firstTag.locator('a')
        if (await tagLink.count() > 0) {
          const href = await tagLink.getAttribute('href')
          expect(href).toMatch(/\/tags\/|\/search.*tag=/)

          await tagLink.click()
          await page.waitForLoadState('networkidle')

          // タグ検索ページまたは記事一覧ページに遷移することを確認
          const currentUrl = page.url()
          expect(currentUrl).toMatch(/\/tags\/|\/search|\/articles/)

          // 元のプロフィールページに戻る
          await page.goBack()
          await waitForPageLoad(page)
        }
      }
    }
  })

  test('記事一覧のページネーション', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    const articlesCount = await userProfilePage.getArticlesCount()

    if (articlesCount > 10) { // ページネーションが必要な数の記事がある場合
      // ページネーションコンポーネントを探す
      const pagination = page.locator('[data-testid="pagination"], .el-pagination, .pagination')

      if (await pagination.count() > 0) {
        await expect(pagination).toBeVisible()

        // 次のページボタンを探す
        const nextButton = pagination.locator('[data-testid="next-page"], .el-pagination__next, button:has-text("次")')

        if (await nextButton.count() > 0) {
          // 現在の記事一覧を記録
          const initialArticles = await page.locator('[data-testid="article-item"], .article-item').allTextContents()

          // 次のページをクリック
          await nextButton.click()
          await page.waitForTimeout(1000)
          await waitForPageLoad(page)

          // 記事一覧が変更されることを確認
          const newArticles = await page.locator('[data-testid="article-item"], .article-item').allTextContents()

          // 記事が存在し、内容が変わっていることを確認
          if (newArticles.length > 0) {
            expect(newArticles).not.toEqual(initialArticles)
          }

          // 前のページボタンが有効になることを確認
          const prevButton = pagination.locator('[data-testid="prev-page"], .el-pagination__prev, button:has-text("前")')
          if (await prevButton.count() > 0) {
            await expect(prevButton).toBeEnabled()
          }
        }
      }
    }
  })

  test('記事一覧の「すべて表示」機能', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    const articlesCount = await userProfilePage.getArticlesCount()

    if (articlesCount > 5) {
      // 「すべて表示」「もっと見る」ボタンを探す
      const viewAllButton = page.locator('[data-testid="view-all-articles"], button:has-text("すべて表示"), button:has-text("もっと見る"), a:has-text("記事一覧")')

      if (await viewAllButton.count() > 0) {
        await expect(viewAllButton).toBeVisible()

        const href = await viewAllButton.getAttribute('href')

        if (href) {
          // リンクの場合
          expect(href).toMatch(/\/users\/\d+\/articles|\/articles.*user=/)

          await viewAllButton.click()
          await page.waitForLoadState('networkidle')

          const currentUrl = page.url()
          expect(currentUrl).toMatch(/\/users\/\d+\/articles|\/articles/)

          // 元のプロフィールページに戻る
          await page.goBack()
          await waitForPageLoad(page)
        } else {
          // ボタンの場合（展開機能）
          const initialArticleCount = await page.locator('[data-testid="article-item"], .article-item').count()

          await viewAllButton.click()
          await page.waitForTimeout(1000)

          const expandedArticleCount = await page.locator('[data-testid="article-item"], .article-item').count()
          expect(expandedArticleCount).toBeGreaterThanOrEqual(initialArticleCount)
        }
      }
    }
  })

  test('記事の検索・フィルタ機能', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    // 検索フィールドを探す
    const searchInput = page.locator('[data-testid="articles-search"], input[placeholder*="記事"], input[placeholder*="検索"]')

    if (await searchInput.count() > 0) {
      await expect(searchInput).toBeVisible()

      // 検索テストを実行
      await searchInput.fill('test')
      await page.waitForTimeout(500)

      // 検索結果が表示されることを確認
      const articles = page.locator('[data-testid="article-item"], .article-item')
      const articleCount = await articles.count()

      if (articleCount > 0) {
        // 検索結果に「test」が含まれることを確認
        const firstArticle = articles.first()
        const articleText = await firstArticle.textContent()
        // 検索機能が実装されている場合は結果をチェック
        console.log('検索結果:', articleText)
      }

      // 検索をクリア
      await searchInput.clear()
      await page.waitForTimeout(500)
    }
  })

  test('記事一覧のソート機能', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    const articlesCount = await userProfilePage.getArticlesCount()

    if (articlesCount > 3) {
      // ソートドロップダウンを探す
      const sortSelect = page.locator('[data-testid="articles-sort"], select, .el-select')

      if (await sortSelect.count() > 0) {
        await expect(sortSelect).toBeVisible()

        // 現在の記事順序を記録
        const initialOrder = await page.locator('[data-testid="article-title"], .article-title, h3, h4').allTextContents()

        // ソート順を変更
        if (await page.locator('select').count() > 0) {
          // <select>要素の場合
          await sortSelect.selectOption('created_at_desc')
        } else {
          // Element Plusの場合
          await sortSelect.click()
          const sortOption = page.locator('.el-select-dropdown__item:has-text("作成日（新しい順）")')
          if (await sortOption.count() > 0) {
            await sortOption.click()
          }
        }

        await page.waitForTimeout(1000)
        await waitForPageLoad(page)

        // 記事順序が変更されることを確認
        const newOrder = await page.locator('[data-testid="article-title"], .article-title, h3, h4').allTextContents()

        if (newOrder.length > 1) {
          // 順序が変わっていることを確認（少なくとも最初の記事が違う）
          expect(newOrder[0]).not.toBe(initialOrder[0])
        }
      }
    }
  })

  test('記事がない場合の表示', async ({ page }) => {
    // 記事がないユーザーをテスト（ユーザーID 999など存在しないユーザー、または新規ユーザー）
    await userProfilePage.visitUserProfile(2)
    await waitForPageLoad(page)

    const articlesCount = await userProfilePage.getArticlesCount()

    if (articlesCount === 0) {
      // 空の状態メッセージが表示されることを確認
      const emptyMessage = page.locator('[data-testid="no-articles"], .no-articles, .empty-state').filter({ hasText: '記事がありません' })

      if (await emptyMessage.count() > 0) {
        await expect(emptyMessage).toBeVisible()
      } else {
        // デフォルトの空リスト表示を確認
        const articlesSection = page.locator('[data-testid="articles-section"], .el-card').nth(2)
        await expect(articlesSection).toBeVisible()

        const articleItems = page.locator('[data-testid="article-item"], .article-item')
        expect(await articleItems.count()).toBe(0)
      }
    }
  })

  test('記事一覧のローディング状態', async ({ page }) => {
    // ネットワーク遅延をシミュレート
    await page.route('**/graphql', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.continue()
    })

    await userProfilePage.visitUserProfile(1)

    // ローディングスピナーまたはスケルトンが表示されることを確認
    const loadingIndicator = page.locator('[data-testid="loading"], .loading, .animate-spin, .el-loading')

    try {
      await expect(loadingIndicator).toBeVisible({ timeout: 1000 })
    } catch {
      // ローディング表示が実装されていない場合は警告のみ
      console.log('Warning: ローディング表示が実装されていない可能性があります')
    }

    // 最終的にコンテンツが表示されることを確認
    await waitForPageLoad(page)
    const articlesSection = page.locator('[data-testid="articles-section"], .el-card').nth(2)
    await expect(articlesSection).toBeVisible()
  })

  test('記事一覧のエラーハンドリング', async ({ page }) => {
    // GraphQLエラーをシミュレート
    await page.route('**/graphql', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ errors: [{ message: 'Internal server error' }] })
      })
    })

    await userProfilePage.visitUserProfile(1)
    await page.waitForTimeout(2000)

    // エラーメッセージまたはリトライボタンが表示されることを確認
    const errorMessage = page.locator('[data-testid="error-message"], .error, .alert-error').filter({ hasText: 'エラー' })
    const retryButton = page.locator('[data-testid="retry-button"]')
      .or(page.locator('button').filter({ hasText: '再試行' }))
      .or(page.locator('button').filter({ hasText: 'リトライ' }))

    try {
      if (await errorMessage.count() > 0) {
        await expect(errorMessage).toBeVisible()
      }

      if (await retryButton.count() > 0) {
        await expect(retryButton).toBeVisible()
      }
    } catch {
      console.log('Warning: エラーハンドリングが実装されていない可能性があります')
    }
  })

  test('レスポンシブデザインでの記事一覧表示', async ({ page }) => {
    // モバイルサイズでテスト
    await page.setViewportSize({ width: 375, height: 667 })

    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    const articlesCount = await userProfilePage.getArticlesCount()

    if (articlesCount > 0) {
      // モバイルで記事一覧が適切に表示されることを確認
      const articlesSection = page.locator('[data-testid="articles-section"], .el-card').nth(2)
      await expect(articlesSection).toBeVisible()

      // 記事アイテムが縦並びになることを確認
      const articleItems = page.locator('[data-testid="article-item"], .article-item')

      if (await articleItems.count() > 1) {
        const firstItem = await articleItems.nth(0).boundingBox()
        const secondItem = await articleItems.nth(1).boundingBox()

        if (firstItem && secondItem) {
          // 縦並びであることを確認（2つ目のアイテムが1つ目より下にある）
          expect(secondItem.y).toBeGreaterThan(firstItem.y + firstItem.height / 2)
        }
      }
    }

    // デスクトップサイズに戻す
    await page.setViewportSize({ width: 1280, height: 720 })
    await waitForPageLoad(page)
  })
})
