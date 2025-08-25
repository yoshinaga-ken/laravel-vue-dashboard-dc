# TASK-901: フロントエンドテストの実装

## タスク概要

実装したユーザープロフィール画面の各Vueコンポーネントに対するVitestを使った単体テスト・統合テストを実装する。

## 依存関係

- 依存タスク: TASK-101, TASK-201, TASK-202, TASK-203, TASK-204, TASK-205, TASK-301
- このタスクに依存するタスク: なし

## 実装内容

### 1. Composablesのテスト

#### ファイル: `resources/js/Composables/__tests__/useUserProfile.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUserProfile } from '@/Composables/useUserProfile'
import { useQuery } from '@vue/apollo-composable'

// Vue Apollo のモック
vi.mock('@vue/apollo-composable')

describe('useUserProfile', () => {
  const mockUseQuery = vi.mocked(useQuery)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with correct default values', () => {
    // useQueryのモックレスポンス設定
    mockUseQuery.mockReturnValue({
      result: ref(null),
      loading: ref(false),
      error: ref(null),
      refetch: vi.fn(),
    })

    const userId = '1'
    const { user, loading, error } = useUserProfile(userId)

    // 初期値の確認
    expect(user.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('should update user data when query result changes', async () => {
    // ユーザーデータのモック
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      articles: { paginatorInfo: { total: 5 } },
      followers: { paginatorInfo: { total: 10 } },
      following: { paginatorInfo: { total: 15 } },
    }

    const result = ref({ user: mockUser })
    mockUseQuery.mockReturnValue({
      result,
      loading: ref(false),
      error: ref(null),
      refetch: vi.fn(),
    })

    const { user, articlesCount, followersCount, followingCount } = useUserProfile('1')

    // 計算されたプロパティの確認
    expect(user.value).toEqual(mockUser)
    expect(articlesCount.value).toBe(5)
    expect(followersCount.value).toBe(10)
    expect(followingCount.value).toBe(15)
  })

  it('should handle GraphQL query with correct parameters', () => {
    // GraphQLクエリの呼び出し確認
    mockUseQuery.mockReturnValue({
      result: ref(null),
      loading: ref(false),
      error: ref(null),
      refetch: vi.fn(),
    })

    useUserProfile('123')

    // useQueryが正しいパラメータで呼ばれたかを確認
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.any(Object), // GraphQLクエリオブジェクト
      {
        id: '123',
        fetchPolicy: 'network-only',
      }
    )
  })
})
```

#### ファイル: `resources/js/Composables/__tests__/useUserFollow.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUserFollow } from '@/Composables/useUserFollow'
import axios from 'axios'

// Axios と route のモック
vi.mock('axios')

describe('useUserFollow', () => {
  const mockAxios = vi.mocked(axios)
  const mockRoute = vi.mocked(route)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with correct default values', () => {
    // 初期状態の確認
    const { isFollowing, isLoading } = useUserFollow()

    expect(isFollowing.value).toBe(false)
    expect(isLoading.value).toBe(false)
  })

  it('should follow user successfully', async () => {
    // フォロー成功のモック設定
    mockRoute.mockReturnValue('/api/users/1/follow')
    mockAxios.put.mockResolvedValue({ data: { id: 1, name: 'Test User' } })

    const { followUser, isFollowing, isLoading } = useUserFollow()

    // フォロー実行
    const result = await followUser(1)

    // 結果の確認
    expect(mockAxios.put).toHaveBeenCalledWith('/api/users/1/follow')
    expect(isFollowing.value).toBe(true)
    expect(isLoading.value).toBe(false)
    expect(result).toEqual({ id: 1, name: 'Test User' })
  })

  it('should handle follow error', async () => {
    // フォローエラーのモック設定
    mockRoute.mockReturnValue('/api/users/1/follow')
    mockAxios.put.mockRejectedValue(new Error('Network Error'))

    const { followUser, isFollowing } = useUserFollow()

    // エラー発生の確認
    await expect(followUser(1)).rejects.toThrow('Network Error')
    expect(isFollowing.value).toBe(false)
  })

  it('should unfollow user successfully', async () => {
    // アンフォロー成功のモック設定
    mockRoute.mockReturnValue('/api/users/1/unfollow')
    mockAxios.delete.mockResolvedValue({ data: { id: 1, name: 'Test User' } })

    const { unfollowUser, isFollowing } = useUserFollow()

    // 初期状態をフォロー中に設定
    const { isFollowing: following } = useUserFollow()
    following.value = true

    // アンフォロー実行
    await unfollowUser(1)

    // 結果の確認
    expect(mockAxios.delete).toHaveBeenCalledWith('/api/users/1/unfollow')
    expect(isFollowing.value).toBe(false)
  })
})
```

### 2. コンポーネントのテスト

#### ファイル: `resources/js/Components/__tests__/UserBasicInfo.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserBasicInfo from '@/Components/UserBasicInfo.vue'
import { ElCard, ElAvatar, ElDivider } from 'element-plus'

describe('UserBasicInfo', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    profile_photo_url: 'https://example.com/avatar.jpg',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-12-31T23:59:59Z',
    current_team_id: '1',
  }

  it('should render user information correctly', () => {
    // ユーザー情報が正しく表示されるかテスト
    const wrapper = mount(UserBasicInfo, {
      props: { user: mockUser },
      global: {
        components: { ElCard, ElAvatar, ElDivider },
      },
    })

    // ユーザー名とメールアドレスの表示確認
    expect(wrapper.text()).toContain('Test User')
    expect(wrapper.text()).toContain('test@example.com')
    expect(wrapper.text()).toContain('基本情報')
  })

  it('should show loading state', () => {
    // ローディング状態の表示テスト
    const wrapper = mount(UserBasicInfo, {
      props: { user: mockUser, loading: true },
      global: {
        components: { ElCard, ElAvatar, ElDivider },
      },
    })

    // ローディングスピナーの確認
    const spinner = wrapper.find('.animate-spin')
    expect(spinner.exists()).toBe(true)
  })

  it('should format dates correctly', () => {
    // 日付フォーマットのテスト
    const wrapper = mount(UserBasicInfo, {
      props: { user: mockUser },
      global: {
        components: { ElCard, ElAvatar, ElDivider },
      },
    })

    // 日本語形式の日付表示確認
    expect(wrapper.text()).toContain('2023/1/1')
    expect(wrapper.text()).toContain('2023/12/31')
  })

  it('should show error state when user is null', () => {
    // ユーザーデータがnullの場合のエラー表示テスト
    const wrapper = mount(UserBasicInfo, {
      props: { user: null },
      global: {
        components: { ElCard, ElAvatar, ElDivider },
      },
    })

    expect(wrapper.text()).toContain('ユーザー情報を読み込めませんでした')
  })
})
```

#### ファイル: `resources/js/Components/__tests__/UserFollowInfo.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserFollowInfo from '@/Components/UserFollowInfo.vue'
import { ElCard, ElButton, ElAvatar, ElCollapse, ElCollapseItem } from 'element-plus'

describe('UserFollowInfo', () => {
  const mockFollowersList = [
    { id: '1', name: 'Follower 1', profile_photo_url: 'url1' },
    { id: '2', name: 'Follower 2', profile_photo_url: 'url2' },
  ]

  const mockFollowingList = [{ id: '3', name: 'Following 1', profile_photo_url: 'url3' }]

  it('should display follow statistics correctly', () => {
    // フォロー統計の表示テスト
    const wrapper = mount(UserFollowInfo, {
      props: {
        followersCount: 2,
        followingCount: 1,
        followersList: mockFollowersList,
        followingList: mockFollowingList,
      },
      global: {
        components: { ElCard, ElButton, ElAvatar, ElCollapse, ElCollapseItem },
      },
    })

    // 統計数値の確認
    expect(wrapper.text()).toContain('2') // フォロワー数
    expect(wrapper.text()).toContain('1') // フォロー中数
    expect(wrapper.text()).toContain('フォロワー')
    expect(wrapper.text()).toContain('フォロー中')
  })

  it('should expand followers list when button is clicked', async () => {
    // フォロワー一覧の展開テスト
    const wrapper = mount(UserFollowInfo, {
      props: {
        followersCount: 2,
        followingCount: 1,
        followersList: mockFollowersList,
        followingList: mockFollowingList,
      },
      global: {
        components: { ElCard, ElButton, ElAvatar, ElCollapse, ElCollapseItem },
      },
    })

    // フォロワー展開ボタンをクリック
    const followersButton = wrapper.find('[data-test="followers-toggle"]')
    await followersButton.trigger('click')

    // フォロワー一覧の表示確認
    expect(wrapper.text()).toContain('Follower 1')
    expect(wrapper.text()).toContain('Follower 2')
  })

  it('should show empty state when no followers', () => {
    // フォロワーがいない場合のテスト
    const wrapper = mount(UserFollowInfo, {
      props: {
        followersCount: 0,
        followingCount: 0,
        followersList: [],
        followingList: [],
      },
      global: {
        components: { ElCard, ElButton, ElAvatar, ElCollapse, ElCollapseItem },
      },
    })

    expect(wrapper.text()).toContain('フォロワーはいません')
  })
})
```

### 3. 統合テストの実装

#### ファイル: `resources/js/Pages/__tests__/Users.Show.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UsersShow from '@/Pages/Users/Show.vue'
import { useUserProfile } from '@/Composables/useUserProfile'

// Composableのモック
vi.mock('@/Composables/useUserProfile')

describe('Users/Show', () => {
  const mockUseUserProfile = vi.mocked(useUserProfile)

  it('should integrate all components correctly', () => {
    // 統合テスト：全コンポーネントの協調動作確認
    const mockUser = {
      id: '1',
      name: 'Integration Test User',
      email: 'integration@example.com',
    }

    mockUseUserProfile.mockReturnValue({
      user: ref(mockUser),
      loading: ref(false),
      error: ref(null),
      followersCount: ref(5),
      followingCount: ref(3),
      articlesCount: ref(10),
      // ... その他のプロパティ
    })

    const wrapper = mount(UsersShow, {
      props: { userId: 1 },
      global: {
        stubs: {
          AppLayout: true,
          UserBasicInfo: true,
          UserFollowInfo: true,
          UserArticlesList: true,
          UserTeamsInfo: true,
          UserActionButtons: true,
        },
      },
    })

    // 各コンポーネントが存在することを確認
    expect(wrapper.findComponent({ name: 'UserBasicInfo' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'UserFollowInfo' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'UserArticlesList' }).exists()).toBe(true)
  })

  it('should handle error state correctly', () => {
    // エラー状態の統合テスト
    mockUseUserProfile.mockReturnValue({
      user: ref(null),
      loading: ref(false),
      error: ref(new Error('Network Error')),
      // ... その他のプロパティ
    })

    const wrapper = mount(UsersShow, {
      props: { userId: 1 },
      global: {
        stubs: { AppLayout: true },
      },
    })

    // エラー表示の確認
    expect(wrapper.text()).toContain('ネットワークエラーが発生しました')
  })
})
```

## テスト設定・ユーティリティ

### ファイル: `resources/js/__tests__/setup.ts`

```typescript
import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Element Plus のグローバル設定
config.global.stubs = {
  ElIcon: true,
  ElButton: true,
  ElCard: true,
  ElAvatar: true,
  // その他の Element Plus コンポーネント
}

// Apollo Client のモック
vi.mock('@vue/apollo-composable', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}))

// Vue Router のモック
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useRoute: () => ({
    params: { userId: '1' },
  }),
}))
```

## テスト実行設定

### package.json スクリプト追加

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

## カバレッジ要件

### 最小カバレッジ目標

- **Statements**: 80%以上
- **Branches**: 75%以上
- **Functions**: 80%以上
- **Lines**: 80%以上

### 重点テスト項目

- GraphQLクエリとComposableの動作
- ユーザーインタラクション（クリック・フォロー等）
- エラーハンドリング
- ローディング状態
- 計算されたプロパティの正確性

## テスト実行方法

```bash
# 全テスト実行
pnpm test

# ウォッチモードでテスト実行
pnpm test:watch

# カバレッジ付きテスト実行
pnpm test:coverage

# UI付きテスト実行
pnpm test:ui
```

## 完了条件

- [ ] useUserProfile Composableのテストが実装されている
- [ ] useUserFollow Composableのテストが実装されている
- [ ] UserBasicInfo コンポーネントのテストが実装されている
- [ ] UserFollowInfo コンポーネントのテストが実装されている
- [ ] UserArticlesList コンポーネントのテストが実装されている
- [ ] UserTeamsInfo コンポーネントのテストが実装されている
- [ ] UserActionButtons コンポーネントのテストが実装されている
- [ ] Users/Show ページの統合テストが実装されている
- [ ] テスト設定ファイルが適切に設定されている
- [ ] 全テストがパスしている
- [ ] カバレッジ目標を達成している
- [ ] CI/CDでテストが自動実行される
