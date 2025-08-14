import { expect, Page } from '@playwright/test'
import { BasePage, step } from '../base-page'

/**
 * チーム一覧ページのPage Object Model
 * チーム切り替え、削除、フィルタリング等の機能をテスト
 */
export class TeamsIndexPage extends BasePage {
  /**
   * チーム一覧ページへの移動
   */
  @step()
  async gotoIndex(): Promise<void> {
    await this.goto('/teams')
  }

  /**
   * チーム切り替え（カード形式対応）
   */
  @step()
  async switchToTeam(teamId: number): Promise<void> {
    // チーム切り替えダイアログの処理
    this.page.once('dialog', dialog => {
      console.log(`Team switch dialog: ${dialog.message()}`)
      dialog.accept()
    })

    await this.page.locator(`[data-testid="switch-team-${teamId}"]`).click()
    await this.waitForLoadState('networkidle')

    // チーム切り替え後のページリロードを待機
    await this.page.waitForFunction(() => document.readyState === 'complete')
  }

  /**
   * チーム詳細画面への遷移（カード形式対応）
   */
  @step()
  async viewTeamDetails(teamId: number): Promise<void> {
    // Settingsボタンをクリックしてチーム詳細へ遷移
    const settingsButton = this.page.locator(`[data-testid="view-team-${teamId}"]`)
    await settingsButton.click()
    await this.waitForLoadState('networkidle')
  }

  /**
   * チーム作成ページへの遷移
   */
  @step()
  async clickCreateTeam(): Promise<void> {
    await this.page.getByRole('link', { name: /Create.*Team|チーム作成/ }).click()
    await this.waitForLoadState('networkidle')
  }

  /**
   * フィルタリング操作
   */
  @step()
  async filterTeams(filterType: 'personal' | 'shared' | 'current' | 'all'): Promise<void> {
    // TeamFiltersComponentのチームタイプフィルターを使用
    const teamTypeFilter = this.page.locator('[data-testid="team-type-filter"]')
    await teamTypeFilter.click()

    // フィルターオプションを選択（Element PlusのElOptionはテキストで選択）
    const optionLabels = {
      all: 'All Teams',
      personal: 'Personal Teams',
      shared: 'Shared Teams',
      current: 'Current Team',
    }
    const label = optionLabels[filterType]
    await this.page.locator(`.el-select-dropdown__item:has-text("${label}")`).click()

    // フィルター適用を待機
    await this.waitForLoadState('networkidle')
  }

  /**
   * ソート操作
   */
  @step()
  async sortTeamsByName(direction: 'asc' | 'desc'): Promise<void> {
    // TeamFiltersComponentのソートセレクトを使用
    const sortSelect = this.page.locator('[data-testid="sort-by-filter"]')
    await sortSelect.click()

    // ソートオプションを選択（Element PlusのElOptionはテキストで選択）
    const sortLabel = direction === 'asc' ? 'Name (A-Z)' : 'Name (Z-A)'
    await this.page.locator(`.el-select-dropdown__item:has-text("${sortLabel}")`).click()

    // ソート適用を待機
    await this.waitForLoadState('networkidle')
  }

  /**
   * テーブル検証メソッド：チームカードの表示確認
   * 実装がカード形式のため、team-rowをteam-cardに変更
   */
  async expectTeamRowToBeVisible(teamId: number, visible = true): Promise<void> {
    const teamCard = this.page.locator(`[data-testid="team-card-${teamId}"]`)
    await expect(teamCard).toBeVisible({ visible })
  }

  /**
   * テーブル検証メソッド：現在チームの確認
   */
  async expectTeamToBeCurrent(teamId: number): Promise<void> {
    // チーム切り替え後のページリロードを待つ
    await this.page.waitForLoadState('networkidle')

    // より柔軟な検証：current-teamクラスまたはcurrent indicatorで判定
    const currentTeamCard = this.page.locator(`[data-testid="team-card-${teamId}"]`)
    await expect(currentTeamCard).toBeVisible()

    // current-teamクラスまたは現在チームインジケーターのいずれかが存在することを確認
    const currentIndicator = this.page.locator(`[data-testid="current-team-indicator-${teamId}"]`)

    // どちらかが表示されていることを確認
    const hasCurrentClass = await currentTeamCard.evaluate(el =>
      el.classList.contains('current-team')
    )
    const hasIndicator = (await currentIndicator.count()) > 0

    if (!hasCurrentClass && !hasIndicator) {
      // 少し待ってから再試行
      await this.page.waitForTimeout(1000)
      await expect(currentIndicator).toBeVisible()
    }
  }

  /**
   * テーブル検証メソッド：チームタイプの確認
   */
  async expectTeamType(teamId: number, type: 'personal' | 'normal'): Promise<void> {
    const teamCard = this.page.locator(`[data-testid="team-card-${teamId}"]`)

    if (type === 'personal') {
      await expect(teamCard).toHaveClass(/personal-team/)
      // 個人チームのアイコンが表示されることを確認
      const personalIcon = this.page.locator(`[data-testid="personal-team-icon-${teamId}"]`)
      await expect(personalIcon).toBeVisible()
    } else {
      await expect(teamCard).not.toHaveClass(/personal-team/)
    }
  }

  /**
   * テーブル検証メソッド：所有者関係の確認
   */
  async expectOwnershipRole(teamId: number, role: 'owner' | 'member'): Promise<void> {
    const teamCard = this.page.locator(`[data-testid="team-card-${teamId}"]`)

    if (role === 'owner') {
      await expect(teamCard).toHaveClass(/owner/)
    } else {
      await expect(teamCard).toHaveClass(/member/)
    }
  }

  /**
   * チーム数の確認（カード形式）
   */
  async expectTeamCount(expectedCount: number): Promise<void> {
    const teamCards = this.page.locator('[data-testid^="team-card-"]')
    await expect(teamCards).toHaveCount(expectedCount)
  }

  /**
   * テーブルが空の場合の表示確認
   */
  async expectEmptyState(): Promise<void> {
    const emptyMessage = this.page.locator('[data-testid="teams-empty-state"]')
    await expect(emptyMessage).toBeVisible()
  }

  /**
   * ページタイトルの確認
   */
  async expectPageTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(/Teams|チーム一覧/)
  }

  /**
   * チーム一覧コンテナの基本構造確認（カード形式対応）
   */
  async expectTableStructure(): Promise<void> {
    // チームページコンテナの存在確認
    const pageContainer = this.page.locator('[data-testid="teams-page-container"]')
    await expect(pageContainer).toBeVisible()

    // コンテンツエリアの存在確認
    const contentArea = this.page.locator('[data-testid="teams-content-area"]')
    await expect(contentArea).toBeVisible()

    // チームグリッドまたは空の状態が表示されることを確認
    const teamsGrid = this.page.locator('[data-testid="teams-grid"]')
    const emptyState = this.page.locator('[data-testid="teams-empty-state"]')

    const gridVisible = await teamsGrid.isVisible()
    const emptyVisible = await emptyState.isVisible()

    expect(gridVisible || emptyVisible).toBe(true)
  }

  /**
   * レスポンシブ表示の確認
   */
  async expectResponsiveLayout(): Promise<void> {
    // チームカードが表示されることを確認
    const teamsGrid = this.page.locator('[data-testid="teams-grid"]')
    const emptyState = this.page.locator('[data-testid="teams-empty-state"]')

    const gridVisible = await teamsGrid.isVisible()
    const emptyVisible = await emptyState.isVisible()

    // どちらかが表示されていることを確認
    expect(gridVisible || emptyVisible).toBe(true)

    if (gridVisible) {
      // グリッドレイアウトの確認
      if (this.isMobile) {
        // モバイルでは1カラム表示
        await this.expectMobileLayout()
      } else {
        // PCでは3カラム表示
        await this.expectDesktopLayout()
      }
    }

    console.log(`${this.isMobile ? 'モバイル' : 'PC'}レイアウト確認完了`)
  }

  /**
   * モバイルレイアウトの確認（1カラム表示）
   */
  private async expectMobileLayout(): Promise<void> {
    // モバイルではチームカードが縦に並ぶ（1カラム）
    const teamCards = this.page.locator('[data-testid^="team-card-"]')
    const cardCount = await teamCards.count()

    if (cardCount > 1) {
      // 複数のカードがある場合、縦に並んでいることを確認
      const firstCard = teamCards.first()
      const secondCard = teamCards.nth(1)

      // 2番目のカードが1番目のカードの下に配置されていることを確認
      const firstCardBox = await firstCard.boundingBox()
      const secondCardBox = await secondCard.boundingBox()

      if (firstCardBox && secondCardBox) {
        expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y)
      }
    }
  }

  /**
   * デスクトップレイアウトの確認（3カラム表示）
   */
  private async expectDesktopLayout(): Promise<void> {
    // PCではチームカードが横に並ぶ（3カラム）
    const teamCards = this.page.locator('[data-testid^="team-card-"]')
    const cardCount = await teamCards.count()

    if (cardCount > 1) {
      // 複数のカードがある場合、横に並んでいることを確認
      const firstCard = teamCards.first()
      const secondCard = teamCards.nth(1)

      // 2番目のカードが1番目のカードの右に配置されていることを確認
      const firstCardBox = await firstCard.boundingBox()
      const secondCardBox = await secondCard.boundingBox()

      if (firstCardBox && secondCardBox) {
        expect(secondCardBox.x).toBeGreaterThan(firstCardBox.x)
      }
    }
  }
}
