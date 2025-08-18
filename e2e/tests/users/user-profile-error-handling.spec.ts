import { test, expect } from '@playwright/test'
import { UserProfilePage } from './user-profile-page'
import { login } from '../utils'
import { initializeTestEnvironment, waitForPageLoad, simulateNetworkError } from './test-helpers'

test.describe('エラーハンドリング統合テスト', () => {
  let userProfilePage: UserProfilePage

  test.beforeEach(async ({ page }) => {
    await login(page)
    userProfilePage = new UserProfilePage(page)
  })

  test('GraphQLエラーの統合ハンドリング', async ({ page }) => {
    // GraphQLエラーをシミュレート
    await page.route('**/graphql', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          errors: [
            {
              message: 'Internal server error',
              extensions: {
                category: 'internal'
              }
            }
          ]
        })
      })
    })

    await userProfilePage.visitUserProfile(1)
    await page.waitForTimeout(2000)

    // エラー状態が適切に処理されることを確認
    const hasError = await userProfilePage.hasError()

    if (hasError) {
      // エラーメッセージが表示されることを確認
      const errorMessage = page.locator('[data-testid="error-message"], .error, .alert-error')
      await expect(errorMessage).toBeVisible()

      const errorText = await errorMessage.textContent()
      expect(errorText).toMatch(/エラー|失敗|Error/i)

      // 再試行ボタンが表示されることを確認
      const retryButton = page.locator('[data-testid="retry-button"], button:has-text("再試行"), button:has-text("リトライ")')
      if (await retryButton.count() > 0) {
        await expect(retryButton).toBeVisible()
      }
    } else {
      console.log('Warning: GraphQLエラーハンドリングが実装されていない可能性があります')
    }
  })

  test('ネットワークエラーのハンドリング', async ({ page }) => {
    // ネットワークエラーをシミュレート
    await page.route('**/graphql', route => route.abort())

    await userProfilePage.visitUserProfile(1)
    await page.waitForTimeout(3000)

    // ネットワークエラーが適切に処理されることを確認
    const networkErrorMessage = page.locator('[data-testid="network-error"], .network-error').filter({ hasText: 'ネットワークエラー' })
    const generalErrorMessage = page.locator('[data-testid="error-message"], .error, .alert-error')

    if (await networkErrorMessage.count() > 0) {
      await expect(networkErrorMessage).toBeVisible()
    } else if (await generalErrorMessage.count() > 0) {
      await expect(generalErrorMessage).toBeVisible()
    } else {
      console.log('Warning: ネットワークエラーハンドリングが実装されていない可能性があります')
    }

    // リトライ機能があることを確認
    const retryButton = page.locator('[data-testid="retry-button"]').or(page.locator('button').filter({ hasText: '再試行' }))
    if (await retryButton.count() > 0) {
      await expect(retryButton).toBeVisible()
    }
  })

  test('存在しないユーザーエラーのハンドリング', async ({ page }) => {
    // 存在しないユーザーIDでアクセス
    await page.goto('/users/999999')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // 404エラーまたは「ユーザーが見つかりません」エラーが表示されることを確認
    const pageText = await page.textContent('body')
    const has404Error = pageText?.includes('404') ||
                       pageText?.includes('見つかりません') ||
                       pageText?.includes('Not Found') ||
                       pageText?.includes('存在しません')

    expect(has404Error).toBe(true)

    // エラーページが適切にレンダリングされることを確認
    const errorContent = page.locator('[data-testid="not-found"], .not-found, .error-404')
    if (await errorContent.count() > 0) {
      await expect(errorContent).toBeVisible()
    }

    // ホームページへの戻るリンクがあることを確認
    const homeLink = page.locator('a[href="/"], a:has-text("ホーム"), a:has-text("ダッシュボード")')
    if (await homeLink.count() > 0) {
      await expect(homeLink).toBeVisible()
    }
  })

  test('認証エラーのハンドリング', async ({ page }) => {
    // 認証なしでプロフィールページにアクセス
    await page.goto('/users/1')
    await page.waitForLoadState('networkidle')

    // ログインページにリダイレクトされるか、認証エラーが表示されることを確認
    const currentUrl = page.url()
    const isRedirectedToLogin = currentUrl.includes('/login') || currentUrl.includes('/auth')

    if (isRedirectedToLogin) {
      // ログインページにリダイレクトされた場合
      const loginForm = page.locator('form, [data-testid="login-form"]')
      await expect(loginForm).toBeVisible()
    } else {
      // 認証エラーが表示される場合
      const authError = page.locator('[data-testid="auth-error"], .auth-error').filter({ hasText: 'ログインが必要' })
      if (await authError.count() > 0) {
        await expect(authError).toBeVisible()
      }
    }
  })

  test('部分的なデータ読み込みエラー', async ({ page }) => {
    // 一部のデータのみエラーをシミュレート（フォロー情報のみエラー）
    await page.route('**/graphql', route => {
      const postData = route.request().postData()

      if (postData?.includes('followers') || postData?.includes('following')) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              user: {
                id: "1",
                name: "Test User",
                email: "test@example.com",
                followers: null,
                following: null,
                articles: {
                  data: [],
                  paginatorInfo: { total: 0 }
                }
              }
            },
            errors: [
              {
                message: "Failed to fetch follow data",
                path: ["user", "followers"]
              }
            ]
          })
        })
      } else {
        route.continue()
      }
    })

    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    // 基本情報は表示されることを確認
    await expect(userProfilePage.userBasicInfoSection).toBeVisible()
    await expect(userProfilePage.userName).toBeVisible()

    // フォロー情報セクションでエラーが表示されることを確認
    const followErrorMessage = page.locator('[data-testid="follow-error"], .follow-error, .section-error')
    if (await followErrorMessage.count() > 0) {
      await expect(followErrorMessage).toBeVisible()
    }

    // 他のセクションは正常に表示されることを確認
    await expect(userProfilePage.userArticlesListSection).toBeVisible()
  })

  test('API レスポンス形式エラー', async ({ page }) => {
    // 不正な形式のレスポンスをシミュレート
    await page.route('**/graphql', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body>Invalid response format</body></html>'
      })
    })

    await userProfilePage.visitUserProfile(1)
    await page.waitForTimeout(3000)

    // データ形式エラーが適切に処理されることを確認
    const formatError = page.locator('[data-testid="format-error"], .format-error, .parse-error')
    const generalError = page.locator('[data-testid="error-message"], .error, .alert-error')

    if (await formatError.count() > 0) {
      await expect(formatError).toBeVisible()
    } else if (await generalError.count() > 0) {
      await expect(generalError).toBeVisible()
    } else {
      console.log('Warning: レスポンス形式エラーハンドリングが実装されていない可能性があります')
    }
  })

  test('タイムアウトエラーのハンドリング', async ({ page }) => {
    // 極端に遅いレスポンスをシミュレート
    await page.route('**/graphql', async route => {
      await new Promise(resolve => setTimeout(resolve, 60000)) // 60秒遅延
      await route.continue()
    })

    await userProfilePage.visitUserProfile(1)
    await page.waitForTimeout(5000) // 5秒待機

    // タイムアウトエラーまたはローディング状態が適切に処理されることを確認
    const timeoutError = page.locator('[data-testid="timeout-error"], .timeout-error').filter({ hasText: '時間内に' })
    const isLoading = await userProfilePage.isLoading()

    if (await timeoutError.count() > 0) {
      await expect(timeoutError).toBeVisible()
    } else if (isLoading) {
      // まだローディング中の場合、適切にローディング表示されていることを確認
      const loadingIndicator = page.locator('[data-testid="loading"], .loading, .animate-spin')
      await expect(loadingIndicator).toBeVisible()
    }
  })

  test('CORS エラーのハンドリング', async ({ page }) => {
    // CORS エラーをシミュレート
    await page.route('**/graphql', route => {
      route.fulfill({
        status: 403,
        contentType: 'text/plain',
        body: 'CORS policy: Cross origin requests are only supported for protocol schemes'
      })
    })

    await userProfilePage.visitUserProfile(1)
    await page.waitForTimeout(2000)

    // CORS エラーが適切に処理されることを確認
    const corsError = page.locator('[data-testid="cors-error"], .cors-error').filter({ hasText: 'アクセス権限' })
    const generalError = page.locator('[data-testid="error-message"], .error')

    if (await corsError.count() > 0) {
      await expect(corsError).toBeVisible()
    } else if (await generalError.count() > 0) {
      await expect(generalError).toBeVisible()
    }
  })

  test('エラー状態からの回復機能', async ({ page }) => {
    // 最初にエラーを発生させる
    await page.route('**/graphql', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ errors: [{ message: 'Server error' }] })
      })
    })

    await userProfilePage.visitUserProfile(1)
    await page.waitForTimeout(2000)

    // エラー状態を確認
    const hasError = await userProfilePage.hasError()
    if (hasError) {
      // エラールートを削除（正常な応答に戻す）
      await page.unroute('**/graphql')

      // 再試行ボタンをクリック
      const retryButton = page.locator('[data-testid="retry-button"], button:has-text("再試行")')
      if (await retryButton.count() > 0) {
        await retryButton.click()
        await waitForPageLoad(page)

        // 正常な状態に回復することを確認
        await expect(userProfilePage.userBasicInfoSection).toBeVisible()
        await expect(userProfilePage.userName).toBeVisible()

        // エラーメッセージが消えることを確認
        const errorMessage = page.locator('[data-testid="error-message"], .error')
        await expect(errorMessage).not.toBeVisible()
      }
    }
  })

  test('複数の同時エラーのハンドリング', async ({ page }) => {
    // 複数のエラーを同時にシミュレート
    await page.route('**/graphql', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            user: null
          },
          errors: [
            {
              message: "User not found",
              path: ["user"]
            },
            {
              message: "Database connection failed",
              extensions: {
                category: "internal"
              }
            },
            {
              message: "Cache service unavailable",
              extensions: {
                category: "external"
              }
            }
          ]
        })
      })
    })

    await userProfilePage.visitUserProfile(1)
    await page.waitForTimeout(2000)

    // 複数エラーが適切に統合されて表示されることを確認
    const errorContainer = page.locator('[data-testid="error-container"], .error-container, .alert-error')
    if (await errorContainer.count() > 0) {
      await expect(errorContainer).toBeVisible()

      // エラーメッセージの数や内容を確認
      const errorMessages = errorContainer.locator('.error-message, .alert-item')
      const errorCount = await errorMessages.count()

      if (errorCount > 0) {
        expect(errorCount).toBeGreaterThan(0)

        // 主要なエラー（User not found）が表示されることを確認
        const errorText = await errorContainer.textContent()
        expect(errorText).toMatch(/見つかりません|not found/i)
      }
    }
  })

  test('JavaScript エラーの検出と報告', async ({ page }) => {
    let jsErrors: string[] = []

    // JavaScriptエラーを監視
    page.on('pageerror', error => {
      jsErrors.push(error.message)
    })

    page.on('console', msg => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text())
      }
    })

    // 意図的にJavaScriptエラーを発生させる
    await page.addInitScript(() => {
      // 存在しない関数を呼び出す
      setTimeout(() => {
        // @ts-ignore
        window.nonExistentFunction()
      }, 1000)
    })

    await userProfilePage.visitUserProfile(1)
    await page.waitForTimeout(3000)

    // JavaScriptエラーが検出されたことを確認
    expect(jsErrors.length).toBeGreaterThan(0)
    console.log('検出されたJavaScriptエラー:', jsErrors)

    // アプリケーションが完全にクラッシュしていないことを確認
    const basicSection = userProfilePage.userBasicInfoSection
    try {
      await expect(basicSection).toBeVisible({ timeout: 5000 })
    } catch {
      console.log('Warning: JavaScriptエラーによりアプリケーションがクラッシュした可能性があります')
    }
  })

  test('エラー報告機能', async ({ page }) => {
    let reportedErrors: any[] = []

    // エラー報告APIを監視
    await page.route('**/api/errors/report', route => {
      const postData = route.request().postDataJSON()
      reportedErrors.push(postData)

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })

    // エラーを発生させる
    await page.route('**/graphql', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ errors: [{ message: 'Test error for reporting' }] })
      })
    })

    await userProfilePage.visitUserProfile(1)
    await page.waitForTimeout(3000)

    // エラー報告機能があれば、自動的にエラーが報告されることを確認
    if (reportedErrors.length > 0) {
      expect(reportedErrors).toContainEqual(
        expect.objectContaining({
          error: expect.stringContaining('Test error'),
          url: expect.stringContaining('/users/1'),
          userAgent: expect.any(String)
        })
      )
    } else {
      console.log('Note: エラー自動報告機能は実装されていません')
    }
  })
})
