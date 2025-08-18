import { test, expect } from '@playwright/test'
import { UserProfilePage } from './user-profile-page'
import { login } from '../utils'

/**
 * ユーザープロフィールE2Eテスト用のヘルパー関数
 */

/**
 * テスト用ユーザーデータを準備する
 */
export async function setupTestUsers(page: any): Promise<{
  adminUser: number
  regularUser: number
  userWithContent: number
}> {
  // テスト用のユーザーIDを返す
  // 実際のテスト環境に応じて調整が必要
  return {
    adminUser: 1,      // 管理者ユーザー
    regularUser: 2,    // 一般ユーザー
    userWithContent: 1 // コンテンツ（記事、チーム）を持つユーザー
  }
}

/**
 * フォロー関係をリセットする
 */
export async function resetFollowRelationship(page: any, userProfilePage: UserProfilePage, targetUserId: number): Promise<void> {
  await userProfilePage.visitUserProfile(targetUserId)

  // フォロー中の場合はアンフォローしてリセット
  const isFollowing = await userProfilePage.isFollowingUser()
  if (isFollowing) {
    await userProfilePage.clickUnfollowButton()
    await page.waitForTimeout(1000)
  }
}

/**
 * テストデータの存在を確認する
 */
export async function validateTestData(userProfilePage: UserProfilePage, userId: number): Promise<{
  hasBasicInfo: boolean
  hasArticles: boolean
  hasTeams: boolean
  hasFollowers: boolean
  hasFollowing: boolean
}> {
  await userProfilePage.visitUserProfile(userId)

  return {
    hasBasicInfo: await userProfilePage.userBasicInfoSection.isVisible(),
    hasArticles: await userProfilePage.getArticlesCount() > 0,
    hasTeams: (await userProfilePage.getOwnedTeamsCount() + await userProfilePage.getMemberTeamsCount()) > 0,
    hasFollowers: await userProfilePage.getFollowersCount() > 0,
    hasFollowing: await userProfilePage.getFollowingCount() > 0
  }
}

/**
 * スクリーンショットを撮影して保存する
 */
export async function captureScreenshot(page: any, testName: string, description: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `${testName}-${description}-${timestamp}.png`

  await page.screenshot({
    path: `e2e/test-results/screenshots/${filename}`,
    fullPage: true
  })

  console.log(`スクリーンショット保存: ${filename}`)
}

/**
 * ページの読み込み完了を待つ
 */
export async function waitForPageLoad(page: any): Promise<void> {
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500) // 追加の安定化時間
}

/**
 * モバイル環境での操作を最適化する
 */
export async function optimizeForMobile(page: any): Promise<void> {
  // モバイル操作時の遅延を追加
  await page.waitForTimeout(300)
}

/**
 * ネットワーク遅延をシミュレートする
 */
export async function simulateSlowNetwork(page: any): Promise<void> {
  await page.route('**/*', async route => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    await route.continue()
  })
}

/**
 * ランダムな操作遅延を追加する（実際のユーザー操作をシミュレート）
 */
export async function addRandomDelay(): Promise<void> {
  const delay = Math.random() * 500 + 200 // 200-700ms
  await new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * テスト環境の初期化
 */
export async function initializeTestEnvironment(page: any): Promise<UserProfilePage> {
  await login(page)
  return new UserProfilePage(page)
}

/**
 * テスト後のクリーンアップ
 */
export async function cleanupAfterTest(page: any): Promise<void> {
  // ローカルストレージやセッションストレージをクリア
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
}

/**
 * エラー状態をシミュレートする
 */
export async function simulateNetworkError(page: any, pattern: string): Promise<void> {
  await page.route(pattern, route => route.abort())
}

/**
 * API レスポンスを遅延させる
 */
export async function delayApiResponse(page: any, pattern: string, delayMs: number): Promise<void> {
  await page.route(pattern, async route => {
    await new Promise(resolve => setTimeout(resolve, delayMs))
    await route.continue()
  })
}

/**
 * コンソールエラーを監視する
 */
export function monitorConsoleErrors(page: any): void {
  page.on('console', (msg: any) => {
    if (msg.type() === 'error') {
      console.error('コンソールエラー:', msg.text())
    }
  })

  page.on('pageerror', (error: any) => {
    console.error('ページエラー:', error.message)
  })
}

/**
 * パフォーマンスメトリクスを収集する
 */
export async function collectPerformanceMetrics(page: any): Promise<{
  navigationTiming: any
  resourceTiming: any[]
  memoryUsage?: any
}> {
  return await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const resources = performance.getEntriesByType('resource')

    // @ts-ignore
    const memory = (performance as any).memory ? {
      // @ts-ignore
      usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
      // @ts-ignore
      totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      // @ts-ignore
      jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
    } : undefined

    return {
      navigationTiming: navigation,
      resourceTiming: resources,
      memoryUsage: memory
    }
  })
}

/**
 * テストレポートを生成する
 */
export function generateTestReport(testResults: {
  testName: string
  duration: number
  status: 'passed' | 'failed' | 'skipped'
  error?: string
}[]): void {
  console.log('\n=== ユーザープロフィール E2E テスト結果 ===')

  const passed = testResults.filter(r => r.status === 'passed').length
  const failed = testResults.filter(r => r.status === 'failed').length
  const skipped = testResults.filter(r => r.status === 'skipped').length

  console.log(`合計: ${testResults.length}`)
  console.log(`成功: ${passed}`)
  console.log(`失敗: ${failed}`)
  console.log(`スキップ: ${skipped}`)

  if (failed > 0) {
    console.log('\n失敗したテスト:')
    testResults
      .filter(r => r.status === 'failed')
      .forEach(r => {
        console.log(`- ${r.testName}: ${r.error}`)
      })
  }
}
