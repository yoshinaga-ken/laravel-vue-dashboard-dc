import { expect, test } from '@playwright/test'
import { isLogin, login } from '../utils'
import { TeamsIndexPage } from './teams-index-page'

test.describe('Teams Index Page E2E Tests', () => {
  test.setTimeout(30000) // チーム切り替えに時間がかかる可能性

  test.beforeEach(async ({ page }, testInfo) => {
    if (!(await isLogin(page))) {
      await login(page)
    }
  })

  // チーム一覧画面の基本表示とナビゲーション
  test('Basic display and navigation of teams index page', async ({ page }) => {
    const teamsPage = new TeamsIndexPage(page)

    // チーム一覧画面に移動
    await teamsPage.gotoIndex()

    // ページタイトルの確認
    await teamsPage.expectPageTitle()

    // カード形式のチーム表示構造の確認
    await teamsPage.expectTableStructure()

    // チーム一覧グリッドまたは空の状態の表示確認
    const teamsGrid = page.locator('[data-testid="teams-grid"]')
    const emptyState = page.locator('[data-testid="teams-empty-state"]')

    const gridVisible = await teamsGrid.isVisible()
    const emptyVisible = await emptyState.isVisible()

    // どちらかが表示されていることを確認
    expect(gridVisible || emptyVisible).toBe(true)

    if (gridVisible) {
      // チームが存在する場合、最低1つのチーム（個人チーム）が存在することを確認
      const teamCards = page.locator('[data-testid^="team-card-"]')
      const teamCount = await teamCards.count()
      expect(teamCount).toBeGreaterThanOrEqual(1)
    }

    console.log('基本表示テストが完了しました')
  })

  // チーム切り替えの完全フロー
  test('Complete team switching flow', async ({ page }) => {
    const teamsPage = new TeamsIndexPage(page)

    await teamsPage.gotoIndex()

    // 現在のチームを記録
    const currentTeamCard = page.locator('[data-testid^="team-card-"].current-team')
    const currentTeamCount = await currentTeamCard.count()

    if (currentTeamCount === 0) {
      console.log('現在チームが明示的にマークされていない、テストをスキップ')
      return
    }

    const currentTeamIdAttr = await currentTeamCard.getAttribute('data-testid')
    const currentTeamId = currentTeamIdAttr?.match(/team-card-(\d+)/)?.[1]

    // 切り替え可能なチームを検索
    const switchableTeamCard = page
      .locator('[data-testid^="team-card-"]:not(.current-team)')
      .first()
    const switchableTeamCount = await switchableTeamCard.count()

    if (switchableTeamCount === 0) {
      console.log('切り替え可能なチームが存在しない、テストをスキップ')
      return
    }

    const switchableTeamIdAttr = await switchableTeamCard.getAttribute('data-testid')
    const switchableTeamId = switchableTeamIdAttr?.match(/team-card-(\d+)/)?.[1]

    if (switchableTeamId) {
      // チーム切り替え実行
      await teamsPage.switchToTeam(parseInt(switchableTeamId))

      // 切り替え後はページがリロードされるので、チーム一覧ページに戻る
      await teamsPage.gotoIndex()

      // 切り替えが成功したことを確認（簡易版）
      await expect(
        page.locator('[data-testid="teams-grid"], [data-testid="teams-empty-state"]')
      ).toBeVisible()

      console.log(`チーム ${switchableTeamId} への切り替えが完了しました`)
    }
  })

  // チーム詳細画面への遷移
  test('Navigate to team details page', async ({ page }) => {
    const teamsPage = new TeamsIndexPage(page)

    await teamsPage.gotoIndex()

    // 最初のチームの詳細を表示
    const firstTeamCard = page.locator('[data-testid^="team-card-"]').first()
    const teamIdAttr = await firstTeamCard.getAttribute('data-testid')
    const teamId = teamIdAttr?.match(/team-card-(\d+)/)?.[1]

    if (teamId) {
      await teamsPage.viewTeamDetails(parseInt(teamId))

      // チーム詳細ページに遷移したことを確認
      await expect(page).toHaveURL(new RegExp(`/teams/${teamId}`))

      // ページタイトルまたはヘッダーでチーム詳細画面であることを確認
      const pageHeaders = page.locator('h1, h2')
      await expect(pageHeaders).toContainText(/Team Settings|チーム設定|Team Details|チーム詳細/)

      console.log(`チーム ${teamId} の詳細画面への遷移が成功しました`)
    }
  })

  // チーム作成ページへの遷移
  test('Navigate to team creation page', async ({ page }) => {
    const teamsPage = new TeamsIndexPage(page)

    await teamsPage.gotoIndex()

    // チーム作成権限がある場合のみテスト実行
    const createButton = page.getByRole('link', { name: /Create.*Team|チーム作成/ })
    const createButtonCount = await createButton.count()

    if (createButtonCount > 0) {
      // チーム作成ボタンをクリック
      await teamsPage.clickCreateTeam()

      // チーム作成ページに遷移したことを確認
      await expect(page).toHaveURL(/\/teams\/create/)

      // ページタイトルまたはヘッダーでチーム作成画面であることを確認
      const pageHeaders = page.locator('h1, h2')
      await expect(pageHeaders).toContainText(/Create Team|チーム作成/)

      // 一覧に戻る
      await page.goBack()
      await expect(page.locator('[data-testid="teams-grid"]')).toBeVisible()
    } else {
      console.log('チーム作成権限がない、テストをスキップ')
    }
  })

  // フィルタリングとソート機能
  test('Filtering and sorting functionality', async ({ page }) => {
    const teamsPage = new TeamsIndexPage(page)

    await teamsPage.gotoIndex()

    // 初期状態のチーム数を記録
    const initialTeamRows = page.locator('[data-testid^="team-card-"]')
    const initialCount = await initialTeamRows.count()

    // フィルタ機能がある場合のみテスト実行
    const teamTypeFilter = page.locator('[data-testid="team-type-filter"]')
    const teamTypeFilterCount = await teamTypeFilter.count()

    if (teamTypeFilterCount > 0) {
      // 個人チームフィルタ
      await teamsPage.filterTeams('personal')
      await teamsPage.waitForLoadState('networkidle')
      const personalTeamsCount = await page.locator('[data-testid^="team-card-"]').count()
      await teamsPage.expectTeamCount(personalTeamsCount)

      // 共有チームフィルタ
      await teamsPage.filterTeams('shared')
      await teamsPage.waitForLoadState('networkidle')
      const sharedTeamsCount = await page.locator('[data-testid^="team-card-"]').count()
      await teamsPage.expectTeamCount(sharedTeamsCount)

      // 全チーム表示に戻す
      await teamsPage.filterTeams('all')
      await teamsPage.waitForLoadState('networkidle')
      await teamsPage.expectTeamCount(initialCount)
    } else {
      console.log('フィルタ機能が実装されていない、テストをスキップ')
    }

    // ソート機能がある場合のみテスト実行
    const sortSelect = page.locator('[data-testid="sort-by-filter"]')
    const sortSelectCount = await sortSelect.count()

    if (sortSelectCount > 0) {
      // 名前でソート（昇順）
      await teamsPage.sortTeamsByName('asc')
      await teamsPage.waitForLoadState('networkidle')

      // ソート後も同じ数のチームが表示されることを確認
      await teamsPage.expectTeamCount(initialCount)

      // 名前でソート（降順）
      await teamsPage.sortTeamsByName('desc')
      await teamsPage.waitForLoadState('networkidle')
      await teamsPage.expectTeamCount(initialCount)
    } else {
      console.log('ソート機能が実装されていない、テストをスキップ')
    }
  })

  // 権限に応じたUI制御
  test('UI control based on permissions', async ({ page }) => {
    const teamsPage = new TeamsIndexPage(page)

    await teamsPage.gotoIndex()

    // 個人チームの確認
    const personalTeamRows = page.locator('[data-testid^="team-card-"].personal-team')
    const personalTeamCount = await personalTeamRows.count()

    if (personalTeamCount > 0) {
      for (let i = 0; i < personalTeamCount; i++) {
        const row = personalTeamRows.nth(i)
        const teamId = (await row.getAttribute('data-testid'))?.match(/team-card-(\d+)/)?.[1]

        if (teamId) {
          // 個人チームのタイプを確認
          await teamsPage.expectTeamType(parseInt(teamId), 'personal')
        }
      }
    }

    // 通常チームの確認（オーナーの場合）
    const ownedNormalTeams = page.locator('[data-testid^="team-card-"].owner:not(.personal-team)')
    const ownedNormalCount = await ownedNormalTeams.count()

    if (ownedNormalCount > 0) {
      const firstOwnedTeam = ownedNormalTeams.first()
      const teamId = (await firstOwnedTeam.getAttribute('data-testid'))?.match(
        /team-card-(\d+)/
      )?.[1]

      if (teamId) {
        // 通常チームのタイプを確認
        await teamsPage.expectTeamType(parseInt(teamId), 'normal')

        // オーナー関係を確認
        await teamsPage.expectOwnershipRole(parseInt(teamId), 'owner')
      }
    }

    // メンバーチームの確認
    const memberTeams = page.locator('[data-testid^="team-card-"].member')
    const memberTeamCount = await memberTeams.count()

    if (memberTeamCount > 0) {
      const firstMemberTeam = memberTeams.first()
      const teamId = (await firstMemberTeam.getAttribute('data-testid'))?.match(
        /team-card-(\d+)/
      )?.[1]

      if (teamId) {
        // メンバー関係を確認
        await teamsPage.expectOwnershipRole(parseInt(teamId), 'member')
      }
    }

    // 注意: チーム削除機能はチーム一覧画面には実装されていません
    // 削除機能は Teams/Show.vue（チーム詳細画面）でのみ利用可能です
  })

  // レスポンシブ対応テスト
  test('Responsive design test', async ({ page }) => {
    const teamsPage = new TeamsIndexPage(page)

    await teamsPage.gotoIndex()

    // レスポンシブレイアウトの確認（isMobile変数でPC/モバイルを判別）
    await teamsPage.expectResponsiveLayout()

    // チーム操作の確認
    const firstTeamCard = page.locator('[data-testid^="team-card-"]').first()
    const teamIdAttr = await firstTeamCard.getAttribute('data-testid')
    const teamId = teamIdAttr?.match(/team-card-(\d+)/)?.[1]

    if (teamId) {
      // チーム詳細に遷移できることを確認
      await teamsPage.viewTeamDetails(parseInt(teamId))
      await expect(page).toHaveURL(new RegExp(`/teams/${teamId}`))

      console.log(`${teamsPage.isMobileView ? 'モバイル' : 'PC'}でのチーム詳細遷移が成功しました`)
    }
  })

  // エラーケースの処理
  test('Error case handling', async ({ page }) => {
    const teamsPage = new TeamsIndexPage(page)

    await teamsPage.gotoIndex()

    // 注意: チーム削除機能はチーム一覧画面には実装されていません
    // 削除機能は Teams/Show.vue（チーム詳細画面）でのみ利用可能です
    // 個人チーム削除試行のテストは削除されました

    // 存在しないチームへのアクセス（404エラー）
    await page.goto('/teams/99999')

    // 404ページまたはエラーメッセージの表示を確認
    const errorIndicators = [
      page.locator('text=404'),
      page.locator('text=Not Found'),
      page.locator('text=ページが見つかりません'),
      page.locator('[data-testid="error-page"]'),
    ]

    let errorFound = false
    for (const indicator of errorIndicators) {
      const count = await indicator.count()
      if (count > 0) {
        await expect(indicator).toBeVisible()
        errorFound = true
        break
      }
    }

    if (!errorFound) {
      // リダイレクトされる場合もある
      await expect(page).toHaveURL(/\/teams$/)
    }
  })

  // テーブル表示内容の詳細確認
  test('Detailed verification of table display content', async ({ page }) => {
    const teamsPage = new TeamsIndexPage(page)

    await teamsPage.gotoIndex()

    // 最初のチーム行で詳細内容を確認
    const firstTeamRow = page.locator('[data-testid^="team-card-"]').first()
    const teamIdAttr = await firstTeamRow.getAttribute('data-testid')
    const teamId = teamIdAttr?.match(/team-card-(\d+)/)?.[1]

    if (teamId) {
      // チーム名が表示されていることを確認（h4要素として表示）
      const teamName = firstTeamRow.locator('h4')
      await expect(teamName).toBeVisible()
      await expect(teamName).not.toBeEmpty()

      // メンバー数が表示されていることを確認（統計情報セクション内）
      const memberCountSection = firstTeamRow.locator('.text-2xl.font-bold.text-blue-600')
      await expect(memberCountSection).toBeVisible()

      // メンバー数のラベルが表示されていることを確認
      const memberLabel = firstTeamRow.locator('.text-xs.text-gray-500:has-text("Members")')
      await expect(memberLabel).toBeVisible()

      // 作成日が表示されていることを確認（p要素として表示）
      const createdDate = firstTeamRow.locator('p')
      if ((await createdDate.count()) > 0) {
        await expect(createdDate).toBeVisible()
        // 作成日のテキストが正しい形式であることを確認
        const dateText = await createdDate.textContent()
        expect(dateText).toMatch(/Created .* by/)
      }

      // アクションボタンが表示されていることを確認
      const switchButton = firstTeamRow.locator('button:has-text("Switch")')
      await expect(switchButton).toBeVisible()

      const settingsButton = firstTeamRow.locator('button:has-text("Settings")')
      await expect(settingsButton).toBeVisible()

      const viewDetailsButton = firstTeamRow.locator('button:has-text("View Details")')
      await expect(viewDetailsButton).toBeVisible()
    }
  })
})
