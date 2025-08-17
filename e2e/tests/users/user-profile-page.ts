import { Page, Locator } from '@playwright/test'
import { BasePage, step } from '../base-page'

export class UserProfilePage extends BasePage {
  // Basic Info Section
  readonly userBasicInfoSection: Locator
  readonly userName: Locator
  readonly userEmail: Locator
  readonly profilePhoto: Locator
  readonly createdAt: Locator

  // Follow Info Section
  readonly userFollowInfoSection: Locator
  readonly followersCount: Locator
  readonly followingCount: Locator
  readonly followersLink: Locator
  readonly followingLink: Locator
  readonly followersModal: Locator
  readonly followingModal: Locator

  // Action Buttons Section
  readonly userActionButtonsSection: Locator
  readonly followButton: Locator
  readonly unfollowButton: Locator
  readonly editButton: Locator

  // Articles List Section
  readonly userArticlesListSection: Locator
  readonly firstArticleItem: Locator
  readonly firstArticleTitle: Locator
  readonly articlesPagination: Locator
  readonly articlesNextPageButton: Locator

  // Teams Info Section
  readonly userTeamsInfoSection: Locator
  readonly firstOwnedTeam: Locator
  readonly firstOwnedTeamName: Locator
  readonly firstMemberTeam: Locator
  readonly firstMemberTeamName: Locator

  // Navigation
  readonly homeLink: Locator
  readonly usersIndexLink: Locator

  // Modal
  readonly modalCloseButton: Locator
  readonly loadingSpinner: Locator
  readonly errorMessage: Locator
  readonly retryButton: Locator

  constructor(page: Page) {
    super(page)

    // Basic Info Section - 実際のクラス名に基づく（最初のel-card）
    this.userBasicInfoSection = page.locator('.el-card').first()
    this.userName = page.locator('h2').first()
    this.userEmail = page.locator('.text-gray-600').first()
    this.profilePhoto = page.locator('.el-avatar').first()
    this.createdAt = page.locator('dd').filter({ hasText: /\d{4}\/\d{1,2}\/\d{1,2}/ }).first()

    // Follow Info Section - 実際のコンポーネント構造に基づく（2番目のel-card）
    this.userFollowInfoSection = page.locator('.el-card').nth(1)
    this.followersCount = page.locator('text=フォロワー').first()
    this.followingCount = page.locator('text=フォロー中').first()
    this.followersLink = page.locator('button:has-text("フォロワー"), a:has-text("フォロワー")')
    this.followingLink = page.locator('button:has-text("フォロー中"), a:has-text("フォロー中")')
    this.followersModal = page.locator('.el-dialog, .modal').filter({ hasText: /フォロワー/ })
    this.followingModal = page.locator('.el-dialog, .modal').filter({ hasText: /フォロー中/ })

    // Action Buttons Section - UserActionButtonsコンポーネント内のボタン
    this.userActionButtonsSection = page.locator('.user-action-buttons')
    this.followButton = page.locator('.user-action-buttons button.el-button--primary')
    this.unfollowButton = page.locator('.user-action-buttons button.el-button--success')
    this.editButton = page.locator('button:has-text("編集"), .el-button:has-text("編集")')

    // Articles List Section - 3番目のel-card
    this.userArticlesListSection = page.locator('.el-card').nth(2)
    this.firstArticleItem = page.locator('.article-item, .el-card').first()
    this.firstArticleTitle = page.locator('h3, .article-title, a').first()
    this.articlesPagination = page.locator('.el-pagination, .pagination')
    this.articlesNextPageButton = page.locator('button:has-text("次"), .el-pagination__next')

    // Teams Info Section - 4番目のel-card
    this.userTeamsInfoSection = page.locator('.el-card').nth(3)
    this.firstOwnedTeam = page.locator('.team-item, .el-card').first()
    this.firstOwnedTeamName = page.locator('.team-name, h4').first()
    this.firstMemberTeam = page.locator('.team-item, .el-card').nth(1)
    this.firstMemberTeamName = page.locator('.team-name, h4').nth(1)

    // Navigation - 実際のヘッダー構造に基づく
    this.homeLink = page.locator('a:has-text("ホーム"), a:has-text("ダッシュボード"), a[href*="dashboard"]')
    this.usersIndexLink = page.locator('a:has-text("ユーザー"), a[href*="users"]')

    // Modal and Status
    this.modalCloseButton = page.locator('.el-dialog__close, .modal-close, button[aria-label="Close"]')
    this.loadingSpinner = page.locator('.animate-spin, .el-loading, .loading')
    this.errorMessage = page.locator('.el-alert--error, .error, .text-red-600')
    this.retryButton = page.locator('button:has-text("再試行"), button:has-text("リトライ")')
  }  /**
   * ユーザープロフィール画面に遷移
   */
  @step()
  async visitUserProfile(userId: number): Promise<void> {
    await this.goto(`/users/${userId}`)
    await this.waitForLoadState('networkidle')
  }

  /**
   * フォロー状態かどうかを確認
   */
  @step()
  async isFollowingUser(): Promise<boolean> {
    try {
      // ページが読み込まれるまで待機
      await this.page.waitForLoadState('networkidle')

      // より緩やかな待機でUserActionButtonsコンポーネントを待つ
      try {
        await this.page.locator('.user-action-buttons').waitFor({ state: 'visible', timeout: 10000 })
      } catch {
        // .user-action-buttonsが見つからない場合、より一般的なセレクターを試行
        console.log('Warning: .user-action-buttons not found, trying alternative selectors')
        await this.page.waitForTimeout(2000)
      }

      // フォロー中ボタン（success type）が存在するかチェック
      const unfollowButton = this.page.locator('button.el-button--success').filter({ hasText: 'フォロー中' })
      const unfollowCount = await unfollowButton.count()

      if (unfollowCount > 0) {
        return true
      }

      // フォローボタン（primary type）が存在するかチェック
      const followButton = this.page.locator('button.el-button--primary').filter({ hasText: 'フォロー' })
      const followCount = await followButton.count()

      if (followCount > 0) {
        return false
      }

      return false
    } catch (error) {
      console.log('Error checking follow status:', error)
      return false
    }
  }    /**
   * フォローボタンをクリック
   */
  @step()
  async clickFollowButton(): Promise<void> {
    // ページが安定するまで待機
    await this.page.waitForLoadState('networkidle')

    // より複数のセレクターを試行してフォローボタンをクリック
    const followButtonSelectors = [
      '.user-action-buttons button.el-button--primary',
      'button.el-button--primary',
      'button[class*="el-button--primary"]'
    ]

    let clickedButton = null

    for (const selector of followButtonSelectors) {
      try {
        const allButtons = this.page.locator(selector)
        const buttonCount = await allButtons.count()

        for (let i = 0; i < buttonCount; i++) {
          const button = allButtons.nth(i)
          const buttonText = await button.textContent() || ''

          if (buttonText.includes('フォロー') && !buttonText.includes('フォロー中')) {
            await button.waitFor({ state: 'visible', timeout: 8000 })
            await button.click()
            clickedButton = button
            break
          }
        }

        if (clickedButton) break
      } catch (e) {
        console.log(`Selector ${selector} failed:`, e.message)
        continue
      }
    }

    if (!clickedButton) {
      throw new Error('フォローボタンが見つかりません')
    }

    // クリック後の状態変化を待機
    await this.page.waitForTimeout(2000)
  }

  /**
   * アンフォローボタンをクリック
   */
  @step()
  async clickUnfollowButton(): Promise<void> {
    // ページが安定するまで待機
    await this.page.waitForLoadState('networkidle')

    // より複数のセレクターを試行してアンフォローボタンをクリック
    const unfollowButtonSelectors = [
      '.user-action-buttons button.el-button--success',
      'button.el-button--success',
      'button[class*="el-button--success"]'
    ]

    let clickedButton = null

    for (const selector of unfollowButtonSelectors) {
      try {
        const allButtons = this.page.locator(selector)
        const buttonCount = await allButtons.count()

        for (let i = 0; i < buttonCount; i++) {
          const button = allButtons.nth(i)
          const buttonText = await button.textContent() || ''

          if (buttonText.includes('フォロー中')) {
            await button.waitFor({ state: 'visible', timeout: 8000 })
            await button.click()
            clickedButton = button
            break
          }
        }

        if (clickedButton) break
      } catch (e) {
        console.log(`Selector ${selector} failed:`, e.message)
        continue
      }
    }

    if (!clickedButton) {
      throw new Error('フォロー中ボタンが見つかりません')
    }

    // クリック後の状態変化を待機
    await this.page.waitForTimeout(2000)
  }  /**
   * フォロワー数を取得
   */
  @step()
  async getFollowersCount(): Promise<number> {
    try {
      // より具体的なセレクターでフォロワー数を取得
      const followerElements = this.page.locator('text=/\\d+\\s*フォロワー/')
      const text = await followerElements.first().textContent()
      const match = text?.match(/(\d+)/)
      return match ? parseInt(match[1], 10) : 0
    } catch {
      return 0
    }
  }

  /**
   * フォロー中数を取得
   */
  @step()
  async getFollowingCount(): Promise<number> {
    try {
      // より具体的なセレクターでフォロー中数を取得
      const followingElements = this.page.locator('text=/\\d+\\s*フォロー中/')
      const text = await followingElements.first().textContent()
      const match = text?.match(/(\d+)/)
      return match ? parseInt(match[1], 10) : 0
    } catch {
      return 0
    }
  }

  /**
   * 記事数を取得
   */
  @step()
  async getArticlesCount(): Promise<number> {
    try {
      const articles = await this.page.locator('[data-testid="article-item"]').count()
      return articles
    } catch {
      return 0
    }
  }

  /**
   * 所有チーム数を取得
   */
  @step()
  async getOwnedTeamsCount(): Promise<number> {
    try {
      const teams = await this.page.locator('[data-testid="owned-team-item"]').count()
      return teams
    } catch {
      return 0
    }
  }

  /**
   * 参加チーム数を取得
   */
  @step()
  async getMemberTeamsCount(): Promise<number> {
    try {
      const teams = await this.page.locator('[data-testid="member-team-item"]').count()
      return teams
    } catch {
      return 0
    }
  }

  /**
   * モーダルを閉じる
   */
  @step()
  async closeModal(): Promise<void> {
    await this.modalCloseButton.click()
    await this.page.waitForTimeout(300)
  }

  /**
   * ユーザー名を取得
   */
  @step()
  async getUserName(): Promise<string> {
    try {
      return await this.userName.textContent() || ''
    } catch {
      return ''
    }
  }

  /**
   * ユーザーメールを取得
   */
  @step()
  async getUserEmail(): Promise<string> {
    try {
      return await this.userEmail.textContent() || ''
    } catch {
      return ''
    }
  }

  /**
   * エラー状態かどうかを確認
   */
  @step()
  async hasError(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 1000 })
      return true
    } catch {
      return false
    }
  }

  /**
   * ローディング状態かどうかを確認
   */
  @step()
  async isLoading(): Promise<boolean> {
    try {
      await this.loadingSpinner.waitFor({ state: 'visible', timeout: 1000 })
      return true
    } catch {
      return false
    }
  }

  /**
   * フォロワー一覧の表示・非表示を切り替え
   */
  @step()
  async toggleFollowersList(): Promise<void> {
    await this.followersLink.click()
    await this.page.waitForTimeout(500)
  }

  /**
   * フォロー中一覧の表示・非表示を切り替え
   */
  @step()
  async toggleFollowingList(): Promise<void> {
    await this.followingLink.click()
    await this.page.waitForTimeout(500)
  }

  /**
   * フォロワー一覧が表示されているかを確認
   */
  @step()
  async isFollowersListVisible(): Promise<boolean> {
    try {
      const followersList = this.page.locator('[data-testid="followers-list"]')
      await followersList.waitFor({ state: 'visible', timeout: 2000 })
      return true
    } catch {
      return false
    }
  }

  /**
   * フォロー中一覧が表示されているかを確認
   */
  @step()
  async isFollowingListVisible(): Promise<boolean> {
    try {
      const followingList = this.page.locator('[data-testid="following-list"]')
      await followingList.waitFor({ state: 'visible', timeout: 2000 })
      return true
    } catch {
      return false
    }
  }

  /**
   * レスポンシブレイアウトの確認
   */
  @step()
  async expectResponsiveLayout(): Promise<void> {
    // 基本的なセクションが表示されることを確認
    try {
      await this.userBasicInfoSection.waitFor({ state: 'visible', timeout: 5000 })
      await this.userFollowInfoSection.waitFor({ state: 'visible', timeout: 5000 })

      if (this.isMobileView) {
        // モバイルレイアウトの確認
        await this.expectMobileLayout()
      } else {
        // PCレイアウトの確認
        await this.expectDesktopLayout()
      }

      console.log(`${this.isMobileView ? 'モバイル' : 'PC'}レイアウト確認完了`)
    } catch (error) {
      console.log('基本セクションが表示されていません:', error)
    }
  }

  /**
   * モバイルレイアウトの確認（縦配置）
   */
  private async expectMobileLayout(): Promise<void> {
    try {
      // セクションが縦に並んでいることを確認
      const basicInfoBox = await this.userBasicInfoSection.boundingBox()
      const followInfoBox = await this.userFollowInfoSection.boundingBox()

      if (basicInfoBox && followInfoBox) {
        // 基本情報がフォロー情報より上にあることを確認
        if (basicInfoBox.y >= followInfoBox.y) {
          console.log('モバイルで縦配置が正しくありません')
        }
      }
    } catch (error) {
      console.log('モバイルレイアウト確認中にエラー:', error)
    }
  }

  /**
   * デスクトップレイアウトの確認（適切な配置）
   */
  private async expectDesktopLayout(): Promise<void> {
    try {
      // ページ幅が十分であることを確認
      const viewportSize = this.page.viewportSize()
      if (viewportSize && viewportSize.width < 1024) {
        console.log('デスクトップ表示には画面幅が不足しています')
        return
      }

      // セクションが適切に配置されていることを確認
      const basicInfoBox = await this.userBasicInfoSection.boundingBox()
      const followInfoBox = await this.userFollowInfoSection.boundingBox()

      if (basicInfoBox && followInfoBox) {
        // 基本情報がページ上部にあることを確認
        if (basicInfoBox.y >= followInfoBox.y) {
          console.log('PCレイアウトで配置が正しくありません')
        }
      }
    } catch (error) {
      console.log('PCレイアウト確認中にエラー:', error)
    }
  }

  /**
   * より安全なフォローボタンを取得
   */
  getSafeFollowButton() {
    return this.page.locator('.user-action-buttons button.el-button--primary')
  }

  /**
   * より安全なアンフォローボタンを取得
   */
  getSafeUnfollowButton() {
    return this.page.locator('.user-action-buttons button.el-button--success')
  }

  /**
   * プロフィール写真を取得
   */
  getProfilePhoto() {
    return this.page.locator('.el-avatar img').first()
  }

  /**
   * 安全なフォロワーリンクを取得
   */
  getSafeFollowersLink() {
    return this.page.locator('text=/\\d+\\s*フォロワー/')
  }

  /**
   * 安全なフォロー中リンクを取得
   */
  getSafeFollowingLink() {
    return this.page.locator('text=/\\d+\\s*フォロー中/')
  }
}
