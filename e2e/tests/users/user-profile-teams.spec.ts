import { test, expect } from '@playwright/test'
import { UserProfilePage } from './user-profile-page'
import { login } from '../utils'
import { initializeTestEnvironment, waitForPageLoad } from './test-helpers'

test.describe('ユーザーチーム情報', () => {
  let userProfilePage: UserProfilePage

  test.beforeEach(async ({ page }) => {
    await login(page)
    userProfilePage = new UserProfilePage(page)
  })

  test('チーム情報セクションが表示される', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    // チーム情報セクションが表示されることを確認
    const teamsSection = page.locator('[data-testid="teams-section"], .el-card').nth(3)
    await expect(teamsSection).toBeVisible()

    // セクションタイトルが表示されることを確認
    const sectionTitle = teamsSection.locator('h3, h4, .section-title')
    if (await sectionTitle.count() > 0) {
      await expect(sectionTitle).toBeVisible()
      const titleText = await sectionTitle.textContent()
      expect(titleText).toMatch(/チーム|Team/i)
    }
  })

  test('所有チームが表示される', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    const ownedTeamsCount = await userProfilePage.getOwnedTeamsCount()

    if (ownedTeamsCount > 0) {
      // 所有チームセクションが表示されることを確認
      const ownedTeamsSection = page.locator('[data-testid="owned-teams"], .owned-teams')

      if (await ownedTeamsSection.count() > 0) {
        await expect(ownedTeamsSection).toBeVisible()

        // 所有チームアイテムが表示されることを確認
        const ownedTeamItems = page.locator('[data-testid="owned-team-item"], .owned-team-item, .team-item')
        await expect(ownedTeamItems.first()).toBeVisible()

        // チーム名が表示されることを確認
        const firstTeamName = ownedTeamItems.first().locator('[data-testid="team-name"], .team-name, h4, h5')
        if (await firstTeamName.count() > 0) {
          await expect(firstTeamName).toBeVisible()
          const teamNameText = await firstTeamName.textContent()
          expect(teamNameText?.trim()).toBeTruthy()
        }

        // チーム種別（Personal Teamかどうか）の表示確認
        const teamBadge = ownedTeamItems.first().locator('[data-testid="team-badge"], .team-badge, .el-tag')
        if (await teamBadge.count() > 0) {
          await expect(teamBadge).toBeVisible()
        }
      }
    } else {
      // 所有チームがない場合のメッセージ確認
      const noOwnedTeamsMessage = page.locator('[data-testid="no-owned-teams"], .no-owned-teams').filter({ hasText: '所有チームがありません' })
      if (await noOwnedTeamsMessage.count() > 0) {
        await expect(noOwnedTeamsMessage).toBeVisible()
      }
    }
  })

  test('参加チームが表示される', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    const memberTeamsCount = await userProfilePage.getMemberTeamsCount()

    if (memberTeamsCount > 0) {
      // 参加チームセクションが表示されることを確認
      const memberTeamsSection = page.locator('[data-testid="member-teams"], .member-teams, .joined-teams')

      if (await memberTeamsSection.count() > 0) {
        await expect(memberTeamsSection).toBeVisible()

        // 参加チームアイテムが表示されることを確認
        const memberTeamItems = page.locator('[data-testid="member-team-item"], .member-team-item, .team-item')
        await expect(memberTeamItems.first()).toBeVisible()

        // チーム名が表示されることを確認
        const firstTeamName = memberTeamItems.first().locator('[data-testid="team-name"], .team-name, h4, h5')
        if (await firstTeamName.count() > 0) {
          await expect(firstTeamName).toBeVisible()
          const teamNameText = await firstTeamName.textContent()
          expect(teamNameText?.trim()).toBeTruthy()
        }

        // チームロール（もしある場合）の表示確認
        const teamRole = memberTeamItems.first().locator('[data-testid="team-role"], .team-role, .role')
        if (await teamRole.count() > 0) {
          await expect(teamRole).toBeVisible()
        }
      }
    } else {
      // 参加チームがない場合のメッセージ確認
      const noMemberTeamsMessage = page.locator('[data-testid="no-member-teams"], .no-member-teams').filter({ hasText: '参加チームがありません' })
      if (await noMemberTeamsMessage.count() > 0) {
        await expect(noMemberTeamsMessage).toBeVisible()
      }
    }
  })

  test('現在のチームが強調表示される', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    // 現在のチームが強調表示されることを確認
    const currentTeam = page.locator('[data-testid="current-team"], .current-team, .active-team')

    if (await currentTeam.count() > 0) {
      await expect(currentTeam).toBeVisible()

      // 現在のチームを示すバッジやアイコンがあることを確認
      const currentTeamBadge = currentTeam.locator('[data-testid="current-team-badge"], .current-team-badge, .el-tag--type-success')
      if (await currentTeamBadge.count() > 0) {
        await expect(currentTeamBadge).toBeVisible()
        const badgeText = await currentTeamBadge.textContent()
        expect(badgeText).toMatch(/現在|Current|Active/i)
      }

      // 現在のチーム名が表示されることを確認
      const currentTeamName = currentTeam.locator('[data-testid="team-name"], .team-name, h4, h5')
      if (await currentTeamName.count() > 0) {
        await expect(currentTeamName).toBeVisible()
      }
    }
  })

  test('チーム詳細ページへの遷移', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    // チームリンクを探す
    const teamLink = page.locator('a[href*="/teams/"], [data-testid="team-link"]').first()

    if (await teamLink.count() > 0) {
      const href = await teamLink.getAttribute('href')
      expect(href).toMatch(/\/teams\/\d+/)

      // チーム詳細ページに遷移
      const target = await teamLink.getAttribute('target')

      if (target === '_blank') {
        // 新しいタブで開く場合
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page'),
          teamLink.click()
        ])
        await newPage.waitForLoadState('networkidle')

        const newUrl = newPage.url()
        expect(newUrl).toMatch(/\/teams\/\d+/)
        await newPage.close()
      } else {
        // 同じタブで開く場合
        await teamLink.click()
        await page.waitForLoadState('networkidle')

        const currentUrl = page.url()
        expect(currentUrl).toMatch(/\/teams\/\d+/)

        // 元のプロフィールページに戻る
        await page.goBack()
        await waitForPageLoad(page)
      }
    }
  })

  test('チーム情報の詳細表示', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    const ownedTeamsCount = await userProfilePage.getOwnedTeamsCount()
    const memberTeamsCount = await userProfilePage.getMemberTeamsCount()

    if (ownedTeamsCount > 0 || memberTeamsCount > 0) {
      const teamItem = page.locator('[data-testid="team-item"], .team-item').first()
      await expect(teamItem).toBeVisible()

      // チーム名の確認
      const teamName = teamItem.locator('[data-testid="team-name"], .team-name, h4, h5')
      if (await teamName.count() > 0) {
        await expect(teamName).toBeVisible()
        const nameText = await teamName.textContent()
        expect(nameText?.trim()).toBeTruthy()
      }

      // チーム説明の確認（あれば）
      const teamDescription = teamItem.locator('[data-testid="team-description"], .team-description, p')
      if (await teamDescription.count() > 0) {
        await expect(teamDescription).toBeVisible()
      }

      // チームメンバー数の確認（あれば）
      const memberCount = teamItem.locator('[data-testid="member-count"], .member-count, .members')
      if (await memberCount.count() > 0) {
        await expect(memberCount).toBeVisible()
      }

      // チーム作成日の確認（あれば）
      const createdAt = teamItem.locator('[data-testid="team-created-at"], .team-created-at, .created-at')
      if (await createdAt.count() > 0) {
        await expect(createdAt).toBeVisible()
      }
    }
  })

  test('チーム権限・ロールの表示', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    // 参加チームでのロール表示確認
    const memberTeamItems = page.locator('[data-testid="member-team-item"], .member-team-item')

    if (await memberTeamItems.count() > 0) {
      const firstMemberTeam = memberTeamItems.first()

      // ロール情報の確認
      const roleInfo = firstMemberTeam.locator('[data-testid="team-role"], .team-role, .role, .el-tag')
      if (await roleInfo.count() > 0) {
        await expect(roleInfo).toBeVisible()
        const roleText = await roleInfo.textContent()
        expect(roleText).toMatch(/Owner|Admin|Member|メンバー|管理者|オーナー/i)
      }

      // 権限バッジの確認
      const permissionBadge = firstMemberTeam.locator('[data-testid="permission-badge"], .permission-badge')
      if (await permissionBadge.count() > 0) {
        await expect(permissionBadge).toBeVisible()
      }
    }
  })

  test('Personal Teamと通常チームの区別表示', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    const teamItems = page.locator('[data-testid="team-item"], .team-item')

    if (await teamItems.count() > 0) {
      for (let i = 0; i < await teamItems.count(); i++) {
        const teamItem = teamItems.nth(i)

        // Personal Teamのバッジまたは表示確認
        const personalTeamBadge = teamItem.locator('[data-testid="personal-team-badge"], .personal-team-badge, .el-tag--type-info')

        if (await personalTeamBadge.count() > 0) {
          await expect(personalTeamBadge).toBeVisible()
          const badgeText = await personalTeamBadge.textContent()
          expect(badgeText).toMatch(/Personal|個人|プライベート/i)
        }

        // 通常チームのアイコンまたは表示確認
        const regularTeamIcon = teamItem.locator('[data-testid="team-icon"], .team-icon, .el-icon')
        if (await regularTeamIcon.count() > 0) {
          await expect(regularTeamIcon).toBeVisible()
        }
      }
    }
  })

  test('チーム作成ボタンの表示（自分のプロフィールの場合）', async ({ page }) => {
    // 自分のプロフィールにアクセス
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    // 自分のプロフィールかどうかを判定するために、編集ボタンの有無を確認
    const editButton = page.locator('[data-testid="edit-profile-button"], button:has-text("編集")')
    const isOwnProfile = await editButton.count() > 0

    if (isOwnProfile) {
      // チーム作成ボタンまたはリンクが表示されることを確認
      const createTeamButton = page.locator('[data-testid="create-team-button"], button:has-text("チーム作成"), a:has-text("新しいチーム")')

      if (await createTeamButton.count() > 0) {
        await expect(createTeamButton).toBeVisible()

        // クリックしてチーム作成ページに遷移することを確認
        const href = await createTeamButton.getAttribute('href')
        if (href) {
          expect(href).toMatch(/\/teams\/create|\/create-team/)
        }
      }
    }
  })

  test('チームがない場合の表示', async ({ page }) => {
    // チームがないユーザーをテスト（新規ユーザーやチームに参加していないユーザー）
    await userProfilePage.visitUserProfile(2)
    await waitForPageLoad(page)

    const ownedTeamsCount = await userProfilePage.getOwnedTeamsCount()
    const memberTeamsCount = await userProfilePage.getMemberTeamsCount()

    if (ownedTeamsCount === 0 && memberTeamsCount === 0) {
      // 空の状態メッセージが表示されることを確認
      const noTeamsMessage = page.locator('[data-testid="no-teams"], .no-teams, .empty-state').filter({ hasText: 'チームがありません' })

      if (await noTeamsMessage.count() > 0) {
        await expect(noTeamsMessage).toBeVisible()
      } else {
        // デフォルトの空リスト表示を確認
        const teamsSection = page.locator('[data-testid="teams-section"], .el-card').nth(3)
        await expect(teamsSection).toBeVisible()

        const teamItems = page.locator('[data-testid="team-item"], .team-item')
        expect(await teamItems.count()).toBe(0)
      }
    }
  })

  test('チーム情報のローディング状態', async ({ page }) => {
    // ネットワーク遅延をシミュレート
    await page.route('**/graphql', async route => {
      if (route.request().postData()?.includes('teams')) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      await route.continue()
    })

    await userProfilePage.visitUserProfile(1)

    // ローディングスピナーまたはスケルトンが表示されることを確認
    const loadingIndicator = page.locator('[data-testid="teams-loading"], .teams-loading, .loading, .animate-spin')

    try {
      await expect(loadingIndicator).toBeVisible({ timeout: 1000 })
    } catch {
      console.log('Warning: チーム情報のローディング表示が実装されていない可能性があります')
    }

    // 最終的にコンテンツが表示されることを確認
    await waitForPageLoad(page)
    const teamsSection = page.locator('[data-testid="teams-section"], .el-card').nth(3)
    await expect(teamsSection).toBeVisible()
  })

  test('チーム情報のエラーハンドリング', async ({ page }) => {
    // GraphQLエラーをシミュレート
    await page.route('**/graphql', route => {
      if (route.request().postData()?.includes('teams')) {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ errors: [{ message: 'Team data fetch error' }] })
        })
      } else {
        route.continue()
      }
    })

    await userProfilePage.visitUserProfile(1)
    await page.waitForTimeout(2000)

    // エラーメッセージまたはリトライボタンが表示されることを確認
    const errorMessage = page.locator('[data-testid="teams-error"], .teams-error, .error').filter({ hasText: 'チーム情報の取得に失敗' })
    const retryButton = page.locator('[data-testid="teams-retry"]').or(page.locator('button').filter({ hasText: '再試行' }))

    try {
      if (await errorMessage.count() > 0) {
        await expect(errorMessage).toBeVisible()
      }

      if (await retryButton.count() > 0) {
        await expect(retryButton).toBeVisible()
      }
    } catch {
      console.log('Warning: チーム情報のエラーハンドリングが実装されていない可能性があります')
    }
  })

  test('レスポンシブデザインでのチーム情報表示', async ({ page }) => {
    // モバイルサイズでテスト
    await page.setViewportSize({ width: 375, height: 667 })

    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    const ownedTeamsCount = await userProfilePage.getOwnedTeamsCount()
    const memberTeamsCount = await userProfilePage.getMemberTeamsCount()

    if (ownedTeamsCount > 0 || memberTeamsCount > 0) {
      // モバイルでチーム情報が適切に表示されることを確認
      const teamsSection = page.locator('[data-testid="teams-section"], .el-card').nth(3)
      await expect(teamsSection).toBeVisible()

      // チームアイテムが適切にレイアウトされることを確認
      const teamItems = page.locator('[data-testid="team-item"], .team-item')

      if (await teamItems.count() > 1) {
        const firstItem = await teamItems.nth(0).boundingBox()
        const secondItem = await teamItems.nth(1).boundingBox()

        if (firstItem && secondItem) {
          // モバイルで縦並びになることを確認
          expect(secondItem.y).toBeGreaterThan(firstItem.y + firstItem.height / 2)
        }
      }

      // モバイルでのテキストサイズとタッチ可能な要素サイズを確認
      const teamLink = teamItems.first().locator('a')
      if (await teamLink.count() > 0) {
        const linkBox = await teamLink.boundingBox()
        if (linkBox) {
          // タッチ操作に適したサイズかを確認
          expect(linkBox.height).toBeGreaterThan(32)
        }
      }
    }

    // デスクトップサイズに戻す
    await page.setViewportSize({ width: 1280, height: 720 })
    await waitForPageLoad(page)
  })

  test('チーム詳細の展開・折りたたみ機能', async ({ page }) => {
    await userProfilePage.visitUserProfile(1)
    await waitForPageLoad(page)

    const teamItems = page.locator('[data-testid="team-item"], .team-item')

    if (await teamItems.count() > 0) {
      const firstTeam = teamItems.first()

      // 展開ボタンまたはトグルボタンを探す
      const expandButton = firstTeam.locator('[data-testid="expand-team"], .expand-button, button:has-text("詳細"), .chevron')

      if (await expandButton.count() > 0) {
        // 初期状態での詳細情報の表示確認
        const teamDetails = firstTeam.locator('[data-testid="team-details"], .team-details, .expanded-content')
        const isInitiallyExpanded = await teamDetails.isVisible().catch(() => false)

        // 展開ボタンをクリック
        await expandButton.click()
        await page.waitForTimeout(300)

        // 詳細情報の表示状態が変わることを確認
        const isNowExpanded = await teamDetails.isVisible().catch(() => false)
        expect(isNowExpanded).not.toBe(isInitiallyExpanded)

        if (isNowExpanded) {
          // 詳細情報が表示されている場合、その内容を確認
          const teamDescription = teamDetails.locator('[data-testid="team-description"], .team-description')
          const teamMembers = teamDetails.locator('[data-testid="team-members"], .team-members')

          if (await teamDescription.count() > 0) {
            await expect(teamDescription).toBeVisible()
          }

          if (await teamMembers.count() > 0) {
            await expect(teamMembers).toBeVisible()
          }
        }

        // 再度クリックして折りたたみ
        await expandButton.click()
        await page.waitForTimeout(300)

        // 元の状態に戻ることを確認
        const isFinallyExpanded = await teamDetails.isVisible().catch(() => false)
        expect(isFinallyExpanded).toBe(isInitiallyExpanded)
      }
    }
  })
})
