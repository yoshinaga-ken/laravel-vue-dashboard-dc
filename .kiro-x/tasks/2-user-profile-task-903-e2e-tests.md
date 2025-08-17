# TASK-903: E2Eテストの実装

## タスク概要

Playwrightを使用してユーザープロフィール画面の包括的なE2Eテストを実装する。ユーザーのインタラクション、データ表示、レスポンシブデザイン、アクセシビリティを網羅的にテストする。

## 依存関係

- 依存タスク: TASK-101, TASK-201, TASK-202, TASK-203, TASK-204, TASK-205, TASK-301
- このタスクに依存するタスク: なし

## 実装内容

### 1. ユーザープロフィール画面のE2Eテスト

#### ファイル: `e2e/tests/user-profile.spec.ts`

```typescript
import { test, expect, type Page } from '@playwright/test'
import { login, createUser, createFollowRelation } from '../fixtures/auth-helpers'

test.describe('User Profile Page', () => {
  let page: Page
  let authenticatedUser: any
  let targetUser: any

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage()

    // テスト用ユーザーの作成
    authenticatedUser = await createUser({
      name: 'Test User',
      email: 'test@example.com',
    })

    targetUser = await createUser({
      name: 'Target User',
      email: 'target@example.com',
    })

    // 認証済み状態でページにアクセス
    await login(page, authenticatedUser)
  })

  test.afterEach(async () => {
    await page.close()
  })

  test('should display user basic information correctly', async () => {
    // ユーザープロフィール画面にアクセス
    await page.goto(`/users/${targetUser.id}`)

    // ページタイトルの確認
    await expect(page).toHaveTitle(/Target User - ユーザープロフィール/)

    // ユーザー基本情報の表示確認
    await expect(page.locator('[data-testid="user-name"]')).toContainText('Target User')
    await expect(page.locator('[data-testid="user-email"]')).toContainText('target@example.com')

    // プロフィール画像の表示確認
    const avatar = page.locator('[data-testid="user-avatar"]')
    await expect(avatar).toBeVisible()

    // 登録日の表示確認
    const createdAt = page.locator('[data-testid="user-created-at"]')
    await expect(createdAt).toBeVisible()
    await expect(createdAt).toContainText(/202[0-9]/)
  })

  test('should display follow statistics correctly', async () => {
    // フォロー関係を事前に作成
    await createFollowRelation(authenticatedUser.id, targetUser.id)

    await page.goto(`/users/${targetUser.id}`)

    // フォロー統計の表示確認
    const followersCount = page.locator('[data-testid="followers-count"]')
    const followingCount = page.locator('[data-testid="following-count"]')

    await expect(followersCount).toBeVisible()
    await expect(followingCount).toBeVisible()

    // 数値の確認
    await expect(followersCount).toContainText('1')
    await expect(followingCount).toContainText('0')
  })

  test('should expand and collapse followers list', async () => {
    // フォロワーを複数作成
    for (let i = 0; i < 5; i++) {
      const follower = await createUser({
        name: `Follower ${i + 1}`,
        email: `follower${i + 1}@example.com`,
      })
      await createFollowRelation(follower.id, targetUser.id)
    }

    await page.goto(`/users/${targetUser.id}`)

    // フォロワー一覧の展開
    const followersToggle = page.locator('[data-testid="followers-toggle"]')
    await followersToggle.click()

    // フォロワー一覧の表示確認
    const followersList = page.locator('[data-testid="followers-list"]')
    await expect(followersList).toBeVisible()

    // フォロワー要素の確認
    const followerItems = followersList.locator('[data-testid^="follower-item-"]')
    await expect(followerItems).toHaveCount(5)

    // フォロワー名の確認
    await expect(followerItems.first()).toContainText('Follower 1')

    // 一覧の折りたたみ
    await followersToggle.click()
    await expect(followersList).not.toBeVisible()
  })

  test('should follow and unfollow user', async () => {
    await page.goto(`/users/${targetUser.id}`)

    // フォローボタンの確認
    const followButton = page.locator('[data-testid="follow-button"]')
    await expect(followButton).toBeVisible()
    await expect(followButton).toContainText('フォロー')

    // フォロー実行
    await followButton.click()

    // フォロー状態の確認
    await expect(followButton).toContainText('フォロー中')
    await expect(page.locator('[data-testid="followers-count"]')).toContainText('1')

    // アンフォロー実行
    await followButton.click()

    // アンフォロー状態の確認
    await expect(followButton).toContainText('フォロー')
    await expect(page.locator('[data-testid="followers-count"]')).toContainText('0')
  })

  test('should display articles list with pagination', async () => {
    // 記事を複数作成（APIまたはファクトリを使用）
    await createArticlesForUser(targetUser.id, 15)

    await page.goto(`/users/${targetUser.id}`)

    // 記事一覧セクションの確認
    const articlesSection = page.locator('[data-testid="articles-section"]')
    await expect(articlesSection).toBeVisible()

    // 記事アイテムの表示確認
    const articleItems = page.locator('[data-testid^="article-item-"]')
    await expect(articleItems).toHaveCount(10) // デフォルトページサイズ

    // ページネーションの確認
    const pagination = page.locator('[data-testid="articles-pagination"]')
    await expect(pagination).toBeVisible()

    // 次のページに移動
    const nextPageButton = pagination.locator('[data-testid="next-page"]')
    await nextPageButton.click()

    // 2ページ目の記事表示確認
    await expect(articleItems).toHaveCount(5) // 残り5記事
  })

  test('should display teams information', async () => {
    // チーム情報を事前に作成
    await createTeamForUser(targetUser.id, 'Development Team')
    await addUserToTeam(targetUser.id, 'Marketing Team')

    await page.goto(`/users/${targetUser.id}`)

    // チーム情報セクションの確認
    const teamsSection = page.locator('[data-testid="teams-section"]')
    await expect(teamsSection).toBeVisible()

    // 所有チームの表示確認
    const ownedTeams = page.locator('[data-testid="owned-teams"]')
    await expect(ownedTeams).toContainText('Development Team')

    // 参加チームの表示確認
    const memberTeams = page.locator('[data-testid="member-teams"]')
    await expect(memberTeams).toContainText('Marketing Team')
  })

  test('should handle loading states properly', async () => {
    // ネットワーク遅延をシミュレート
    await page.route('/graphql', route => {
      setTimeout(() => route.continue(), 2000)
    })

    await page.goto(`/users/${targetUser.id}`)

    // ローディングスピナーの表示確認
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]')
    await expect(loadingSpinner).toBeVisible()

    // データ読み込み完了後の確認
    await expect(loadingSpinner).not.toBeVisible({ timeout: 5000 })
    await expect(page.locator('[data-testid="user-name"]')).toBeVisible()
  })

  test('should handle error states gracefully', async () => {
    // GraphQLエラーをシミュレート
    await page.route('/graphql', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({
          errors: [{ message: 'Internal Server Error' }],
        }),
      })
    })

    await page.goto(`/users/${targetUser.id}`)

    // エラーメッセージの表示確認
    const errorMessage = page.locator('[data-testid="error-message"]')
    await expect(errorMessage).toBeVisible()
    await expect(errorMessage).toContainText('ネットワークエラーが発生しました')

    // 再試行ボタンの確認
    const retryButton = page.locator('[data-testid="retry-button"]')
    await expect(retryButton).toBeVisible()
  })

  test('should navigate to article details', async () => {
    // 記事を作成
    const article = await createArticleForUser(targetUser.id, {
      title: 'Test Article',
      content: 'Test content',
    })

    await page.goto(`/users/${targetUser.id}`)

    // 記事リンクをクリック
    const articleLink = page.locator(`[data-testid="article-link-${article.id}"]`)
    await articleLink.click()

    // 記事詳細ページに遷移することを確認
    await expect(page).toHaveURL(`/articles/${article.id}`)
  })

  test('should not show follow button for own profile', async () => {
    // 自分のプロフィール画面にアクセス
    await page.goto(`/users/${authenticatedUser.id}`)

    // フォローボタンが表示されないことを確認
    const followButton = page.locator('[data-testid="follow-button"]')
    await expect(followButton).not.toBeVisible()
  })
})
```

### 2. レスポンシブデザインのテスト

#### ファイル: `e2e/tests/user-profile-responsive.spec.ts`

```typescript
import { test, expect, devices } from '@playwright/test'
import { login, createUser } from '../fixtures/auth-helpers'

// デバイス別のテスト設定
const deviceConfigs = [
  { name: 'Mobile', ...devices['iPhone 12'] },
  { name: 'Tablet', ...devices['iPad'] },
  { name: 'Desktop', viewport: { width: 1920, height: 1080 } },
]

deviceConfigs.forEach(({ name, ...config }) => {
  test.describe(`User Profile - ${name}`, () => {
    test.use(config)

    test('should display correctly on device', async ({ page }) => {
      const user = await createUser({ name: 'Responsive Test User' })
      await login(page, user)

      await page.goto(`/users/${user.id}`)

      if (name === 'Mobile') {
        // モバイルでのレイアウト確認
        await test.step('Mobile layout verification', async () => {
          // ハンバーガーメニューの確認
          const mobileMenu = page.locator('[data-testid="mobile-menu"]')
          await expect(mobileMenu).toBeVisible()

          // スタック表示の確認
          const userInfo = page.locator('[data-testid="user-basic-info"]')
          const followInfo = page.locator('[data-testid="user-follow-info"]')

          // モバイルでは縦方向にスタック
          const userInfoBox = await userInfo.boundingBox()
          const followInfoBox = await followInfo.boundingBox()

          expect(userInfoBox!.y < followInfoBox!.y).toBe(true)
        })
      } else if (name === 'Tablet') {
        // タブレットでのレイアウト確認
        await test.step('Tablet layout verification', async () => {
          // グリッドレイアウトの確認
          const mainContent = page.locator('[data-testid="main-content"]')
          await expect(mainContent).toHaveCSS('display', /grid|flex/)

          // 適切な余白の確認
          const container = page.locator('[data-testid="user-profile-container"]')
          await expect(container).toHaveCSS('padding', /16px|1rem/)
        })
      } else {
        // デスクトップでのレイアウト確認
        await test.step('Desktop layout verification', async () => {
          // サイドバーとメインコンテンツの並列表示
          const sidebar = page.locator('[data-testid="sidebar"]')
          const mainContent = page.locator('[data-testid="main-content"]')

          await expect(sidebar).toBeVisible()
          await expect(mainContent).toBeVisible()

          // 横並びレイアウトの確認
          const sidebarBox = await sidebar.boundingBox()
          const mainBox = await mainContent.boundingBox()

          expect(sidebarBox!.x < mainBox!.x).toBe(true)
        })
      }

      // 全デバイス共通の確認
      await test.step('Common elements verification', async () => {
        // ユーザー名の表示
        await expect(page.locator('[data-testid="user-name"]')).toBeVisible()

        // ナビゲーションの確認
        const navigation = page.locator('[data-testid="navigation"]')
        await expect(navigation).toBeVisible()

        // フッターの確認
        const footer = page.locator('[data-testid="footer"]')
        await expect(footer).toBeVisible()
      })
    })

    test('should handle touch interactions', async ({ page }) => {
      if (name !== 'Mobile') return

      const user = await createUser({ name: 'Touch Test User' })
      await login(page, user)

      await page.goto(`/users/${user.id}`)

      // タッチによるフォロワー一覧の展開
      const followersToggle = page.locator('[data-testid="followers-toggle"]')
      await followersToggle.tap()

      const followersList = page.locator('[data-testid="followers-list"]')
      await expect(followersList).toBeVisible()

      // スワイプジェスチャーのテスト（記事一覧）
      const articlesContainer = page.locator('[data-testid="articles-container"]')

      // 左にスワイプ
      await articlesContainer.hover()
      await page.mouse.down()
      await page.mouse.move(-100, 0)
      await page.mouse.up()

      // スワイプ後の状態確認
      await expect(articlesContainer).toHaveCSS('transform', /translate/)
    })

    test('should adapt font sizes appropriately', async ({ page }) => {
      const user = await createUser({ name: 'Font Test User' })
      await login(page, user)

      await page.goto(`/users/${user.id}`)

      const userName = page.locator('[data-testid="user-name"]')
      const fontSize = await userName.evaluate(el => window.getComputedStyle(el).fontSize)

      if (name === 'Mobile') {
        // モバイルでは小さめのフォント
        expect(parseInt(fontSize)).toBeLessThan(24)
      } else if (name === 'Desktop') {
        // デスクトップでは大きめのフォント
        expect(parseInt(fontSize)).toBeGreaterThan(16)
      }
    })
  })
})
```

### 3. アクセシビリティテスト

#### ファイル: `e2e/tests/user-profile-accessibility.spec.ts`

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { login, createUser } from '../fixtures/auth-helpers'

test.describe('User Profile - Accessibility', () => {
  test('should pass accessibility audit', async ({ page }) => {
    const user = await createUser({ name: 'A11y Test User' })
    await login(page, user)

    await page.goto(`/users/${user.id}`)

    // Axe による自動アクセシビリティチェック
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should support keyboard navigation', async ({ page }) => {
    const user = await createUser({ name: 'Keyboard Test User' })
    await login(page, user)

    await page.goto(`/users/${user.id}`)

    // Tab キーによるナビゲーション
    await page.keyboard.press('Tab')

    // フォーカス可能な要素の確認
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()

    // フォローボタンにフォーカス移動
    let tabCount = 0
    while (tabCount < 10) {
      await page.keyboard.press('Tab')
      const currentFocus = await page.locator(':focus').getAttribute('data-testid')

      if (currentFocus === 'follow-button') {
        break
      }
      tabCount++
    }

    // Enter キーでフォローボタンを押下
    await page.keyboard.press('Enter')

    // フォロー状態の変更確認
    const followButton = page.locator('[data-testid="follow-button"]')
    await expect(followButton).toContainText('フォロー中')
  })

  test('should have proper ARIA labels and roles', async ({ page }) => {
    const user = await createUser({ name: 'ARIA Test User' })
    await login(page, user)

    await page.goto(`/users/${user.id}`)

    // ARIA ラベルの確認
    const followButton = page.locator('[data-testid="follow-button"]')
    await expect(followButton).toHaveAttribute('aria-label', /フォロー/)

    // ARIA ロールの確認
    const articlesList = page.locator('[data-testid="articles-list"]')
    await expect(articlesList).toHaveAttribute('role', 'list')

    const articleItems = page.locator('[data-testid^="article-item-"]')
    for (const item of await articleItems.all()) {
      await expect(item).toHaveAttribute('role', 'listitem')
    }

    // ランドマークロールの確認
    const mainContent = page.locator('main')
    await expect(mainContent).toHaveAttribute('role', 'main')

    const navigation = page.locator('nav')
    await expect(navigation).toHaveAttribute('role', 'navigation')
  })

  test('should support screen reader navigation', async ({ page }) => {
    const user = await createUser({ name: 'Screen Reader Test User' })
    await login(page, user)

    await page.goto(`/users/${user.id}`)

    // ヘディング構造の確認
    const h1 = page.locator('h1')
    await expect(h1).toContainText(user.name)

    const h2Elements = page.locator('h2')
    const h2Count = await h2Elements.count()
    expect(h2Count).toBeGreaterThan(0)

    // セクション見出しの確認
    const sectionHeadings = ['基本情報', 'フォロー情報', '記事一覧', 'チーム情報']

    for (const heading of sectionHeadings) {
      const headingElement = page.locator(`h2:has-text("${heading}")`)
      await expect(headingElement).toBeVisible()
    }

    // リストのアクセシビリティ確認
    const lists = page.locator('[role="list"]')
    for (const list of await lists.all()) {
      const listItems = list.locator('[role="listitem"]')
      const itemCount = await listItems.count()
      expect(itemCount).toBeGreaterThan(0)
    }
  })

  test('should handle high contrast mode', async ({ page }) => {
    const user = await createUser({ name: 'High Contrast Test User' })
    await login(page, user)

    // 高コントラストモードをシミュレート
    await page.addStyleTag({
      content: `
        @media (prefers-contrast: high) {
          * {
            background: black !important;
            color: white !important;
            border-color: white !important;
          }
        }
      `,
    })

    await page.goto(`/users/${user.id}`)

    // コントラスト比の確認
    const userName = page.locator('[data-testid="user-name"]')
    const styles = await userName.evaluate(el => {
      const computed = window.getComputedStyle(el)
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      }
    })

    // 十分なコントラスト比があることを確認
    expect(styles.color).not.toBe(styles.backgroundColor)
  })

  test('should support reduced motion preference', async ({ page }) => {
    const user = await createUser({ name: 'Reduced Motion Test User' })
    await login(page, user)

    // モーション縮減設定をシミュレート
    await page.emulateMedia({ reducedMotion: 'reduce' })

    await page.goto(`/users/${user.id}`)

    // アニメーションが無効化されていることを確認
    const followButton = page.locator('[data-testid="follow-button"]')

    const animationDuration = await followButton.evaluate(el => {
      const computed = window.getComputedStyle(el)
      return computed.animationDuration
    })

    // アニメーション時間が0または非常に短いことを確認
    expect(['0s', '0.01s']).toContain(animationDuration)
  })
})
```

### 4. パフォーマンステスト

#### ファイル: `e2e/tests/user-profile-performance.spec.ts`

```typescript
import { test, expect } from '@playwright/test'
import { login, createUser } from '../fixtures/auth-helpers'

test.describe('User Profile - Performance', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const user = await createUser({ name: 'Performance Test User' })
    await login(page, user)

    const startTime = Date.now()

    await page.goto(`/users/${user.id}`)

    // ページの主要コンテンツが表示されるまでの時間を測定
    await expect(page.locator('[data-testid="user-name"]')).toBeVisible()

    const loadTime = Date.now() - startTime

    // 3秒以内での読み込み完了を期待
    expect(loadTime).toBeLessThan(3000)
  })

  test('should handle large datasets efficiently', async ({ page }) => {
    // 大量のデータを持つユーザーを作成
    const user = await createUser({ name: 'Large Dataset User' })

    // 大量の記事、フォロワー、フォロー中を作成
    await createLargeDataset(user.id, {
      articles: 1000,
      followers: 500,
      following: 300,
    })

    await login(page, user)

    const startTime = Date.now()
    await page.goto(`/users/${user.id}`)

    // 初期表示の完了を確認
    await expect(page.locator('[data-testid="user-name"]')).toBeVisible()

    const initialLoadTime = Date.now() - startTime
    expect(initialLoadTime).toBeLessThan(5000)

    // ページネーションのパフォーマンス確認
    const nextPageButton = page.locator('[data-testid="articles-next-page"]')

    const paginationStartTime = Date.now()
    await nextPageButton.click()

    await expect(page.locator('[data-testid="articles-loading"]')).not.toBeVisible()

    const paginationTime = Date.now() - paginationStartTime
    expect(paginationTime).toBeLessThan(2000)
  })

  test('should optimize network requests', async ({ page }) => {
    const user = await createUser({ name: 'Network Test User' })
    await login(page, user)

    // ネットワーク要求の監視
    const networkRequests: string[] = []

    page.on('request', request => {
      networkRequests.push(request.url())
    })

    await page.goto(`/users/${user.id}`)

    // 主要コンテンツの表示完了を待機
    await expect(page.locator('[data-testid="user-name"]')).toBeVisible()

    // GraphQL リクエストが適切に最適化されていることを確認
    const graphqlRequests = networkRequests.filter(url => url.includes('/graphql'))

    // 初期読み込みでのGraphQLリクエスト数を確認（理想的には1-2回）
    expect(graphqlRequests.length).toBeLessThan(3)

    // 重複リクエストがないことを確認
    const uniqueRequests = new Set(graphqlRequests)
    expect(uniqueRequests.size).toBe(graphqlRequests.length)
  })

  test('should implement proper caching', async ({ page }) => {
    const user = await createUser({ name: 'Cache Test User' })
    await login(page, user)

    // 初回アクセス
    await page.goto(`/users/${user.id}`)
    await expect(page.locator('[data-testid="user-name"]')).toBeVisible()

    // 別ページに移動
    await page.goto('/dashboard')
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible()

    // 再度ユーザープロフィールに戻る
    const cacheStartTime = Date.now()
    await page.goto(`/users/${user.id}`)
    await expect(page.locator('[data-testid="user-name"]')).toBeVisible()

    const cachedLoadTime = Date.now() - cacheStartTime

    // キャッシュにより高速読み込みを期待
    expect(cachedLoadTime).toBeLessThan(1000)
  })

  test('should measure Core Web Vitals', async ({ page }) => {
    const user = await createUser({ name: 'Web Vitals User' })
    await login(page, user)

    await page.goto(`/users/${user.id}`)

    // Web Vitals の測定
    const webVitals = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver(list => {
          const entries = list.getEntries()
          const vitals: Record<string, number> = {}

          entries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = entry.startTime
            }
            if (entry.name === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime
            }
          })

          if (vitals.fcp && vitals.lcp) {
            resolve(vitals)
          }
        }).observe({ entryTypes: ['paint', 'largest-contentful-paint'] })

        // タイムアウト設定
        setTimeout(() => resolve({}), 5000)
      })
    })

    // Core Web Vitals の閾値確認
    if (webVitals.fcp) {
      expect(webVitals.fcp).toBeLessThan(2500) // Good FCP < 2.5s
    }
    if (webVitals.lcp) {
      expect(webVitals.lcp).toBeLessThan(4000) // Good LCP < 4.0s
    }
  })
})
```

### 5. テストヘルパーとフィクスチャ

#### ファイル: `e2e/fixtures/auth-helpers.ts`

```typescript
import { type Page } from '@playwright/test'

interface TestUser {
  id: number
  name: string
  email: string
  password?: string
}

/**
 * テスト用ユーザーを作成
 */
export async function createUser(userData: Partial<TestUser>): Promise<TestUser> {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  }

  const user = { ...defaultUser, ...userData }

  // Laravel APIを使用してユーザーを作成
  const response = await fetch('http://localhost:8000/api/test/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })

  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.statusText}`)
  }

  return await response.json()
}

/**
 * ユーザーのログイン処理
 */
export async function login(page: Page, user: TestUser): Promise<void> {
  await page.goto('/login')

  await page.fill('[data-testid="email-input"]', user.email)
  await page.fill('[data-testid="password-input"]', user.password || 'password123')
  await page.click('[data-testid="login-button"]')

  // ダッシュボードへのリダイレクトを確認
  await page.waitForURL('/dashboard')
}

/**
 * フォロー関係を作成
 */
export async function createFollowRelation(followerId: number, followedId: number): Promise<void> {
  await fetch('http://localhost:8000/api/test/follows', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      follower_id: followerId,
      followed_id: followedId,
    }),
  })
}

/**
 * テスト用記事を作成
 */
export async function createArticleForUser(userId: number, articleData: any): Promise<any> {
  const response = await fetch('http://localhost:8000/api/test/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      ...articleData,
    }),
  })

  return await response.json()
}

/**
 * 複数記事を作成
 */
export async function createArticlesForUser(userId: number, count: number): Promise<void> {
  for (let i = 0; i < count; i++) {
    await createArticleForUser(userId, {
      title: `Test Article ${i + 1}`,
      content: `Content for article ${i + 1}`,
    })
  }
}

/**
 * テスト用チームを作成
 */
export async function createTeamForUser(userId: number, teamName: string): Promise<any> {
  const response = await fetch('http://localhost:8000/api/test/teams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      name: teamName,
    }),
  })

  return await response.json()
}

/**
 * 大量データセットを作成
 */
export async function createLargeDataset(
  userId: number,
  counts: {
    articles: number
    followers: number
    following: number
  }
): Promise<void> {
  // 並列でデータを作成
  const promises = [
    createArticlesForUser(userId, counts.articles),
    createFollowersForUser(userId, counts.followers),
    createFollowingForUser(userId, counts.following),
  ]

  await Promise.all(promises)
}

/**
 * フォロワーを複数作成
 */
async function createFollowersForUser(userId: number, count: number): Promise<void> {
  for (let i = 0; i < count; i++) {
    const follower = await createUser({
      name: `Follower ${i + 1}`,
      email: `follower${i + 1}@example.com`,
    })
    await createFollowRelation(follower.id, userId)
  }
}

/**
 * フォロー中ユーザーを複数作成
 */
async function createFollowingForUser(userId: number, count: number): Promise<void> {
  for (let i = 0; i < count; i++) {
    const followed = await createUser({
      name: `Following ${i + 1}`,
      email: `following${i + 1}@example.com`,
    })
    await createFollowRelation(userId, followed.id)
  }
}
```

### 6. Playwright設定

#### ファイル: `e2e/playwright.config.ts` への追加

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },

    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      dependencies: ['setup'],
    },
  ],

  webServer: {
    command: 'php artisan serve',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## テスト実行方法

```bash
# 全E2Eテスト実行
cd e2e
npx playwright test

# 特定のテストファイル実行
npx playwright test user-profile.spec.ts

# ヘッドフルモードで実行
npx playwright test --headed

# UIモードで実行
npx playwright test --ui

# レポート確認
npx playwright show-report
```

## 完了条件

- [ ] ユーザープロフィール画面の基本機能テストが実装されている
- [ ] レスポンシブデザインのテストが実装されている
- [ ] アクセシビリティテストが実装されている
- [ ] パフォーマンステストが実装されている
- [ ] テストヘルパーとフィクスチャが適切に実装されている
- [ ] 複数ブラウザでのテストが設定されている
- [ ] 全E2Eテストがパスしている
- [ ] レポートが適切に生成される
- [ ] CI/CDでE2Eテストが自動実行される
