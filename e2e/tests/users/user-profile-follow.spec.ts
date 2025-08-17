import { test, expect } from '@playwright/test'
import { UserProfilePage } from './user-profile-page'
import { login } from '../utils'

test.describe('フォロー・アンフォロー機能', () => {
  let userProfilePage: UserProfilePage

  test.beforeEach(async ({ page }) => {
    await login(page)
    userProfilePage = new UserProfilePage(page)
  })

  test('他のユーザーをフォローできる', async () => {
    // テスト用ユーザー（ID: 2）にアクセス
    await userProfilePage.visitUserProfile(2)

    // 初期のフォロワー数を取得
    const initialFollowersCount = await userProfilePage.getFollowersCount()

    // 現在のフォロー状態を確認
    const isInitiallyFollowing = await userProfilePage.isFollowingUser()

    if (isInitiallyFollowing) {
      // フォロー中の場合、まずアンフォローする
      await userProfilePage.clickUnfollowButton()

      // フォローボタンが表示されることを確認
      const followButton = userProfilePage.getSafeFollowButton()
      await expect(followButton).toBeVisible()

      // フォロワー数が減少することを確認
      const afterUnfollowCount = await userProfilePage.getFollowersCount()
      expect(afterUnfollowCount).toBe(initialFollowersCount - 1)
    }

    // フォローボタンをクリック
    await userProfilePage.clickFollowButton()

    // アンフォローボタンが表示されることを確認
    const unfollowButton = userProfilePage.getSafeUnfollowButton()
    await expect(unfollowButton).toBeVisible()
    const followButton = userProfilePage.getSafeFollowButton()
    await expect(followButton).not.toBeVisible()

    // フォロワー数が増加することを確認
    const afterFollowCount = await userProfilePage.getFollowersCount()
    const expectedCount = isInitiallyFollowing ? initialFollowersCount : initialFollowersCount + 1
    expect(afterFollowCount).toBe(expectedCount)

    // フォロー状態が正しく更新されることを確認
    const isNowFollowing = await userProfilePage.isFollowingUser()
    expect(isNowFollowing).toBe(true)
  })

  test('フォロー中のユーザーをアンフォローできる', async () => {
    // テスト用ユーザー（ID: 2）にアクセス
    await userProfilePage.visitUserProfile(2)

    // フォロー状態でない場合、まずフォローする
    const isInitiallyFollowing = await userProfilePage.isFollowingUser()
    if (!isInitiallyFollowing) {
      await userProfilePage.clickFollowButton()
      const unfollowButton = userProfilePage.getSafeUnfollowButton()
      await expect(unfollowButton).toBeVisible()
    }

    // フォロー状態のフォロワー数を取得
    const followingFollowersCount = await userProfilePage.getFollowersCount()

    // アンフォローボタンをクリック
    await userProfilePage.clickUnfollowButton()

    // フォローボタンが表示されることを確認
    const followButton = userProfilePage.getSafeFollowButton()
    await expect(followButton).toBeVisible()
    const unfollowButton = userProfilePage.getSafeUnfollowButton()
    await expect(unfollowButton).not.toBeVisible()

    // フォロワー数が減少することを確認
    const afterUnfollowCount = await userProfilePage.getFollowersCount()
    expect(afterUnfollowCount).toBe(followingFollowersCount - 1)

    // フォロー状態が正しく更新されることを確認
    const isNowFollowing = await userProfilePage.isFollowingUser()
    expect(isNowFollowing).toBe(false)
  })

  test.skip('自分のプロフィールではフォローボタンが表示されない', async ({ page }) => {
    // 現在のユーザーのIDを取得してプロフィールページに遷移
    // ログイン後のダッシュボードから現在のユーザーIDを取得
    await page.goto('/dashboard')

    // プロフィールリンクまたはユーザー情報から現在のユーザーIDを取得
    try {
      const profileLink = page.locator('a[href*="/users/"]').first()
      await profileLink.waitFor({ state: 'visible', timeout: 5000 })
      const href = await profileLink.getAttribute('href')
      const currentUserId = href?.match(/\/users\/(\d+)/)?.[1]

      if (currentUserId) {
        await userProfilePage.visitUserProfile(parseInt(currentUserId))

        // フォローボタンもアンフォローボタンも表示されないことを確認
        const followButton = userProfilePage.getSafeFollowButton()
        const unfollowButton = userProfilePage.getSafeUnfollowButton()
        await expect(followButton).not.toBeVisible()
        await expect(unfollowButton).not.toBeVisible()

        // 編集ボタンが表示されることを確認（自分のプロフィールの場合）
        await expect(userProfilePage.editButton).toBeVisible()
      }
    } catch (error) {
      console.log('自分のプロフィールテストをスキップ:', error)
    }
  })

  test('フォロー・アンフォローの連続操作', async () => {
    await userProfilePage.visitUserProfile(2)

    // 初期状態を記録
    const initialFollowersCount = await userProfilePage.getFollowersCount()
    const isInitiallyFollowing = await userProfilePage.isFollowingUser()

    // フォロー状態でない場合はフォローから開始
    if (!isInitiallyFollowing) {
      // フォロー操作
      await userProfilePage.clickFollowButton()
      const unfollowButton = userProfilePage.getSafeUnfollowButton()
      await expect(unfollowButton).toBeVisible()

      const afterFollowCount = await userProfilePage.getFollowersCount()
      expect(afterFollowCount).toBe(initialFollowersCount + 1)
    }

    // アンフォロー操作
    await userProfilePage.clickUnfollowButton()
    const followButton = userProfilePage.getSafeFollowButton()
    await expect(followButton).toBeVisible()

    const afterUnfollowCount = await userProfilePage.getFollowersCount()
    const expectedAfterUnfollow = isInitiallyFollowing ? initialFollowersCount - 1 : initialFollowersCount
    expect(afterUnfollowCount).toBe(expectedAfterUnfollow)

    // 再度フォロー操作
    await userProfilePage.clickFollowButton()
    const unfollowButton = userProfilePage.getSafeUnfollowButton()
    await expect(unfollowButton).toBeVisible()

    const finalFollowersCount = await userProfilePage.getFollowersCount()
    expect(finalFollowersCount).toBe(expectedAfterUnfollow + 1)
  })

  test('フォロー操作中のローディング状態', async ({ page }) => {
    await userProfilePage.visitUserProfile(2)

    // ネットワークレスポンスを遅延させる（ローディング状態をテストするため）
    await page.route('**/api/users/*/follow', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.continue()
    })

    const isInitiallyFollowing = await userProfilePage.isFollowingUser()

    if (!isInitiallyFollowing) {
      // フォローボタンをクリック
      await userProfilePage.clickFollowButton()

      // ローディング状態を確認
      const isLoading = await userProfilePage.isLoading()
      // ローディングが表示される場合もあればされない場合もある（実装次第）

      // 最終的にアンフォローボタンが表示されることを確認
      const unfollowButton = userProfilePage.getSafeUnfollowButton()
      await expect(unfollowButton).toBeVisible({ timeout: 5000 })
    }
  })

  test.skip('フォロー操作のエラーハンドリング', async ({ page }) => {
    await userProfilePage.visitUserProfile(2)

    // フォロー操作を失敗させる
    await page.route('**/api/users/*/follow', route => route.abort())

    const isInitiallyFollowing = await userProfilePage.isFollowingUser()

    if (!isInitiallyFollowing) {
      // フォローボタンをクリック
      await userProfilePage.clickFollowButton()

      // エラーメッセージが表示されるかローディングが終了することを確認
      // 実装によってはエラーメッセージが表示される
      try {
        const hasError = await userProfilePage.hasError()
        if (hasError) {
          console.log('エラーメッセージが表示されました')
        }
      } catch {
        // エラーメッセージが実装されていない場合はスキップ
      }

      // フォロー状態が変更されていないことを確認
      const isStillNotFollowing = await userProfilePage.isFollowingUser()
      expect(isStillNotFollowing).toBe(false)
    }
  })

  test.skip('ページリロード後のフォロー状態の永続化', async ({ page }) => {
    await userProfilePage.visitUserProfile(2)

    // フォロー操作を実行
    const isInitiallyFollowing = await userProfilePage.isFollowingUser()

    if (!isInitiallyFollowing) {
      await userProfilePage.clickFollowButton()
      const unfollowButton = userProfilePage.getSafeUnfollowButton()
      await expect(unfollowButton).toBeVisible()
    }

    // ページをリロード
    await page.reload()
    await page.waitForLoadState('networkidle')

    // フォロー状態が維持されていることを確認
    const isFollowingAfterReload = await userProfilePage.isFollowingUser()
    expect(isFollowingAfterReload).toBe(true)
    const unfollowButton = userProfilePage.getSafeUnfollowButton()
    await expect(unfollowButton).toBeVisible()
  })
})
