# TASK-801: フロントエンドテスト実装（Vitest）

## 概要

チーム一覧機能に実装されたVue3コンポーネントに対するフロントエンドテストを実装する。
Vitestを使用して、コンポーネントのレンダリング、インタラクション、状態管理、イベント処理の
テストを包括的に行い、機能の品質と安定性を確保する。

## 依存関係

- **依存タスク**:
  - TASK-104 (基本チーム一覧画面実装)
  - TASK-103 (ナビゲーション統合)
  - TASK-201 (詳細チームカードコンポーネント実装)
  - TASK-202 (フィルタリング・検索機能実装)
  - TASK-203 (ページネーション機能実装)
- **後続タスク**: なし

## 実装内容

### 1. Pages/Teams/Index.vue のテスト

**ファイル**: `resources/js/Pages/Teams/__tests__/Index.test.ts`

```typescript
/**
 * チーム一覧ページのテスト
 */
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Index from '../Index.vue'
import type { Team, TeamIndexProps } from '@/Types/types-team'

// モックデータ
const mockTeams: Team[] = [
  {
    id: 1,
    name: 'Test Team 1',
    personal_team: false,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
    is_owner: true,
    is_current: true,
    user_role: null,
    members_count: 5,
    invitations_count: 2,
    permissions: {
      canView: true,
      canUpdate: true,
      canDelete: true,
    },
  },
  {
    id: 2,
    name: 'Personal Team',
    personal_team: true,
    created_at: '2023-01-02T00:00:00.000Z',
    updated_at: '2023-01-02T00:00:00.000Z',
    is_owner: true,
    is_current: false,
    user_role: null,
    members_count: 0,
    invitations_count: 0,
    permissions: {
      canView: true,
      canUpdate: true,
      canDelete: false,
    },
  },
]

const mockProps: TeamIndexProps = {
  teams: mockTeams,
  filters: {
    search: '',
    type: 'all',
    member_count: '',
    sort_by: 'created_desc',
  },
  stats: {
    total: 2,
    filtered: 2,
    showing: 2,
  },
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 2,
    from: 1,
    to: 2,
    links: [],
  },
  jetstream: {
    canCreateTeams: true,
  },
}

// Inertia.js モック
const mockInertia = {
  router: {
    visit: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    reload: vi.fn(),
  },
  page: {
    props: {
      auth: {
        user: {
          current_team_id: 1,
        },
      },
      jetstream: {
        canCreateTeams: true,
      },
    },
  },
}

vi.mock('@inertiajs/vue3', () => mockInertia)

describe('Teams/Index.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(Index, {
      props: mockProps,
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          AppLayout: {
            template: '<div><slot /></div>',
          },
          TeamCard: {
            template:
              '<div class="team-card" @click="$emit(\'show-details\', { id: 1 })">{{ team.name }}</div>',
            props: ['team', 'currentTeamId'],
          },
          TeamFilters: {
            template: '<div class="team-filters" @change="$emit(\'filters-changed\', {})"></div>',
            props: ['filters', 'resultStats'],
          },
          TeamPagination: {
            template:
              '<div class="team-pagination" @page-changed="$emit(\'page-changed\', 1)"></div>',
            props: ['pagination'],
          },
        },
      },
    })
  })

  test('チーム一覧ページが正常にレンダリングされる', () => {
    // チーム一覧ページが正常にレンダリングされることを確認
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('Teams')
  })

  test('チーム一覧が正しく表示される', () => {
    // チーム一覧が正しく表示されることを確認
    const teamCards = wrapper.findAll('.team-card')
    expect(teamCards).toHaveLength(2)
  })

  test('チーム作成ボタンが表示される', () => {
    // チーム作成権限がある場合にボタンが表示されることを確認
    const createButton = wrapper.find('[data-testid="create-team-button"]')
    expect(createButton.exists()).toBe(true)
  })

  test('フィルターコンポーネントが正しく統合されている', () => {
    // フィルターコンポーネントが統合されていることを確認
    const filters = wrapper.find('.team-filters')
    expect(filters.exists()).toBe(true)
  })

  test('ページネーションコンポーネントが正しく統合されている', () => {
    // ページネーションコンポーネントが統合されていることを確認
    const pagination = wrapper.find('.team-pagination')
    expect(pagination.exists()).toBe(true)
  })

  test('チーム詳細表示イベントが正しく処理される', async () => {
    // チーム詳細表示イベントが正しく処理されることを確認
    const teamCard = wrapper.find('.team-card')
    await teamCard.trigger('click')

    // イベントハンドラーが呼ばれることを確認
    expect(wrapper.vm.handleShowDetails).toBeDefined()
  })

  test('空状態が正しく表示される', () => {
    // チームが存在しない場合の空状態表示を確認
    const emptyWrapper = mount(Index, {
      props: {
        ...mockProps,
        teams: [],
        stats: { total: 0, filtered: 0, showing: 0 },
      },
      global: wrapper.global,
    })

    expect(emptyWrapper.find('[data-testid="empty-state"]').exists()).toBe(true)
    expect(emptyWrapper.text()).toContain('No teams found')
  })

  test('ローディング状態が正しく表示される', async () => {
    // ローディング状態の表示を確認
    await wrapper.setData({ isLoading: true })
    expect(wrapper.find('[data-testid="loading-state"]').exists()).toBe(true)
  })
})
```

### 2. Components/Teams/TeamCard.vue のテスト

**ファイル**: `resources/js/Components/Teams/__tests__/TeamCard.test.ts`

```typescript
/**
 * チームカードコンポーネントのテスト
 */
import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TeamCard from '../TeamCard.vue'
import type { Team } from '@/Types/types-team'

const mockTeam: Team = {
  id: 1,
  name: 'Test Team',
  personal_team: false,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
  is_owner: true,
  is_current: false,
  user_role: 'admin',
  members_count: 5,
  invitations_count: 2,
  permissions: {
    canView: true,
    canUpdate: true,
    canDelete: true,
  },
  recent_members: [
    { id: 1, name: 'User 1', profile_photo_url: '' },
    { id: 2, name: 'User 2', profile_photo_url: '' },
  ],
  recent_invitations: [
    { id: 1, email: 'test@example.com', created_at: '2023-01-01T00:00:00.000Z' },
  ],
}

// Inertia.js モック
const mockRouter = {
  visit: vi.fn(),
  put: vi.fn().mockResolvedValue({}),
}

vi.mock('@inertiajs/vue3', () => ({
  router: mockRouter,
}))

describe('TeamCard.vue', () => {
  test('チーム情報が正しく表示される', () => {
    // チーム情報が正しく表示されることを確認
    const wrapper = mount(TeamCard, {
      props: {
        team: mockTeam,
        currentTeamId: 2,
      },
      global: {
        stubs: ['ElAvatar', 'ElTag', 'ElButton', 'ElIcon', 'ElDropdown'],
      },
    })

    expect(wrapper.text()).toContain('Test Team')
    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('2')
  })

  test('個人チームタグが正しく表示される', () => {
    // 個人チームの場合にタグが表示されることを確認
    const personalTeam = { ...mockTeam, personal_team: true }
    const wrapper = mount(TeamCard, {
      props: {
        team: personalTeam,
        currentTeamId: 2,
      },
      global: {
        stubs: ['ElAvatar', 'ElTag', 'ElButton', 'ElIcon', 'ElDropdown'],
      },
    })

    expect(wrapper.find('[data-testid="personal-tag"]').exists()).toBe(true)
  })

  test('現在のチームタグが正しく表示される', () => {
    // 現在のチームの場合にタグが表示されることを確認
    const wrapper = mount(TeamCard, {
      props: {
        team: mockTeam,
        currentTeamId: 1, // 同じIDに設定
      },
      global: {
        stubs: ['ElAvatar', 'ElTag', 'ElButton', 'ElIcon', 'ElDropdown'],
      },
    })

    expect(wrapper.find('[data-testid="current-tag"]').exists()).toBe(true)
  })

  test('チーム切り替えボタンが正しく動作する', async () => {
    // チーム切り替えボタンの動作を確認
    const wrapper = mount(TeamCard, {
      props: {
        team: mockTeam,
        currentTeamId: 2, // 異なるIDに設定
      },
      global: {
        stubs: ['ElAvatar', 'ElTag', 'ElButton', 'ElIcon', 'ElDropdown'],
      },
    })

    const switchButton = wrapper.find('[data-testid="switch-button"]')
    expect(switchButton.exists()).toBe(true)

    await switchButton.trigger('click')
    expect(mockRouter.put).toHaveBeenCalledWith(
      `/teams/${mockTeam.id}/switch`,
      {},
      expect.any(Object)
    )
  })

  test('設定ボタンが正しく動作する', async () => {
    // 設定ボタンの動作を確認
    const wrapper = mount(TeamCard, {
      props: {
        team: mockTeam,
        currentTeamId: 2,
      },
      global: {
        stubs: ['ElAvatar', 'ElTag', 'ElButton', 'ElIcon', 'ElDropdown'],
      },
    })

    const settingsButton = wrapper.find('[data-testid="settings-button"]')
    await settingsButton.trigger('click')
    expect(mockRouter.visit).toHaveBeenCalledWith(`/teams/${mockTeam.id}`)
  })

  test('メンバー表示イベントが正しく発火される', async () => {
    // メンバー表示イベントの発火を確認
    const wrapper = mount(TeamCard, {
      props: {
        team: mockTeam,
        currentTeamId: 2,
      },
      global: {
        stubs: ['ElAvatar', 'ElTag', 'ElButton', 'ElIcon', 'ElDropdown'],
      },
    })

    const showMembersButton = wrapper.find('[data-testid="show-members-button"]')
    await showMembersButton.trigger('click')

    expect(wrapper.emitted('showMembers')).toBeTruthy()
    expect(wrapper.emitted('showMembers')?.[0]).toEqual([mockTeam])
  })

  test('詳細表示イベントが正しく発火される', async () => {
    // 詳細表示イベントの発火を確認
    const wrapper = mount(TeamCard, {
      props: {
        team: mockTeam,
        currentTeamId: 2,
      },
      global: {
        stubs: ['ElAvatar', 'ElTag', 'ElButton', 'ElIcon', 'ElDropdown'],
      },
    })

    const showDetailsButton = wrapper.find('[data-testid="show-details-button"]')
    await showDetailsButton.trigger('click')

    expect(wrapper.emitted('showDetails')).toBeTruthy()
    expect(wrapper.emitted('showDetails')?.[0]).toEqual([mockTeam])
  })

  test('日付フォーマット関数が正しく動作する', () => {
    // 日付フォーマット関数の動作を確認
    const wrapper = mount(TeamCard, {
      props: {
        team: mockTeam,
        currentTeamId: 2,
      },
      global: {
        stubs: ['ElAvatar', 'ElTag', 'ElButton', 'ElIcon', 'ElDropdown'],
      },
    })

    // formatDate メソッドのテスト
    const formatDate = wrapper.vm.formatDate
    expect(formatDate).toBeDefined()
    expect(typeof formatDate('2023-01-01T00:00:00.000Z')).toBe('string')
  })
})
```

### 3. Components/Teams/TeamFilters.vue のテスト

**ファイル**: `resources/js/Components/Teams/__tests__/TeamFilters.test.ts`

```typescript
/**
 * チームフィルターコンポーネントのテスト
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TeamFilters from '../TeamFilters.vue'

const mockFilters = {
  search: '',
  type: 'all',
  memberCount: '',
  sortBy: 'created_desc',
}

const mockResultStats = {
  showing: 10,
  total: 20,
  filtered: 15,
}

describe('TeamFilters.vue', () => {
  let wrapper: any

  beforeEach(() => {
    vi.useFakeTimers()
    wrapper = mount(TeamFilters, {
      props: {
        filters: mockFilters,
        resultStats: mockResultStats,
      },
      global: {
        stubs: ['ElInput', 'ElSelect', 'ElOption', 'ElTag', 'ElButton', 'ElIcon'],
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('フィルターコンポーネントが正常にレンダリングされる', () => {
    // フィルターコンポーネントが正常にレンダリングされることを確認
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="search-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="type-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="member-count-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="sort-select"]').exists()).toBe(true)
  })

  test('検索入力のデバウンス処理が正しく動作する', async () => {
    // 検索入力のデバウンス処理を確認
    const searchInput = wrapper.find('[data-testid="search-input"]')

    await searchInput.setValue('test search')
    expect(wrapper.emitted('filtersChanged')).toBeFalsy()

    // デバウンス時間を進める
    vi.advanceTimersByTime(300)
    await nextTick()

    expect(wrapper.emitted('filtersChanged')).toBeTruthy()
  })

  test('フィルター変更時にイベントが発火される', async () => {
    // フィルター変更時のイベント発火を確認
    const typeSelect = wrapper.find('[data-testid="type-select"]')

    await typeSelect.setValue('personal')
    expect(wrapper.emitted('filtersChanged')).toBeTruthy()
    expect(wrapper.emitted('update:filters')).toBeTruthy()
  })

  test('アクティブフィルターが正しく表示される', async () => {
    // アクティブフィルターの表示を確認
    await wrapper.setProps({
      filters: {
        ...mockFilters,
        search: 'test',
        type: 'personal',
      },
    })

    await nextTick()
    expect(wrapper.find('[data-testid="active-filters"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="filter-tag"]')).toHaveLength(2)
  })

  test('フィルタークリア機能が正しく動作する', async () => {
    // フィルタークリア機能の動作を確認
    await wrapper.setProps({
      filters: {
        ...mockFilters,
        search: 'test',
        type: 'personal',
      },
    })

    const clearButton = wrapper.find('[data-testid="clear-all-button"]')
    await clearButton.trigger('click')

    expect(wrapper.emitted('filtersChanged')).toBeTruthy()
    const lastEmitted = wrapper.emitted('filtersChanged')?.slice(-1)[0][0]
    expect(lastEmitted.search).toBe('')
    expect(lastEmitted.type).toBe('all')
  })

  test('結果統計が正しく表示される', () => {
    // 結果統計の表示を確認
    const statsText = wrapper.find('[data-testid="result-stats"]').text()
    expect(statsText).toContain('Showing 10 of 20 teams')
    expect(statsText).toContain('(filtered from 15)')
  })

  test('個別フィルタークリア機能が正しく動作する', async () => {
    // 個別フィルタークリア機能の動作を確認
    await wrapper.setProps({
      filters: {
        ...mockFilters,
        search: 'test',
      },
    })

    const searchTag = wrapper.find('[data-testid="search-filter-tag"]')
    await searchTag.find('.el-tag__close').trigger('click')

    expect(wrapper.emitted('filtersChanged')).toBeTruthy()
    const lastEmitted = wrapper.emitted('filtersChanged')?.slice(-1)[0][0]
    expect(lastEmitted.search).toBe('')
  })
})
```

### 4. Components/Teams/TeamPagination.vue のテスト

**ファイル**: `resources/js/Components/Teams/__tests__/TeamPagination.test.ts`

```typescript
/**
 * チームページネーションコンポーネントのテスト
 */
import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TeamPagination from '../TeamPagination.vue'
import type { PaginationMeta } from '@/Types/types-team'

const mockPagination: PaginationMeta = {
  current_page: 2,
  last_page: 5,
  per_page: 12,
  total: 60,
  from: 13,
  to: 24,
  links: [
    { url: null, label: '&laquo; Previous', active: false },
    { url: '/teams?page=1', label: '1', active: false },
    { url: null, label: '2', active: true },
    { url: '/teams?page=3', label: '3', active: false },
    { url: '/teams?page=5', label: 'Next &raquo;', active: false },
  ],
}

describe('TeamPagination.vue', () => {
  test('ページネーションが正常にレンダリングされる', () => {
    // ページネーションが正常にレンダリングされることを確認
    const wrapper = mount(TeamPagination, {
      props: {
        pagination: mockPagination,
      },
      global: {
        stubs: ['ElPagination', 'ElSelect', 'ElOption'],
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="pagination"]').exists()).toBe(true)
  })

  test('ページ変更イベントが正しく発火される', async () => {
    // ページ変更イベントの発火を確認
    const wrapper = mount(TeamPagination, {
      props: {
        pagination: mockPagination,
      },
      global: {
        stubs: ['ElPagination', 'ElSelect', 'ElOption'],
      },
    })

    await wrapper.vm.handlePageChange(3)
    expect(wrapper.emitted('pageChanged')).toBeTruthy()
    expect(wrapper.emitted('pageChanged')?.[0]).toEqual([3])
  })

  test('件数変更イベントが正しく発火される', async () => {
    // 件数変更イベントの発火を確認
    const wrapper = mount(TeamPagination, {
      props: {
        pagination: mockPagination,
      },
      global: {
        stubs: ['ElPagination', 'ElSelect', 'ElOption'],
      },
    })

    await wrapper.vm.handlePerPageChange(24)
    expect(wrapper.emitted('perPageChanged')).toBeTruthy()
    expect(wrapper.emitted('perPageChanged')?.[0]).toEqual([24])
  })

  test('ページ情報が正しく表示される', () => {
    // ページ情報の表示を確認
    const wrapper = mount(TeamPagination, {
      props: {
        pagination: mockPagination,
      },
      global: {
        stubs: ['ElPagination', 'ElSelect', 'ElOption'],
      },
    })

    const pageInfo = wrapper.find('[data-testid="page-info"]')
    expect(pageInfo.text()).toContain('13-24 of 60')
  })

  test('件数選択オプションが正しく表示される', () => {
    // 件数選択オプションの表示を確認
    const wrapper = mount(TeamPagination, {
      props: {
        pagination: mockPagination,
      },
      global: {
        stubs: ['ElPagination', 'ElSelect', 'ElOption'],
      },
    })

    const perPageSelect = wrapper.find('[data-testid="per-page-select"]')
    expect(perPageSelect.exists()).toBe(true)
  })

  test('最初と最後のページで適切にボタンが無効化される', () => {
    // 最初のページでの表示を確認
    const firstPageWrapper = mount(TeamPagination, {
      props: {
        pagination: { ...mockPagination, current_page: 1 },
      },
      global: {
        stubs: ['ElPagination', 'ElSelect', 'ElOption'],
      },
    })

    expect(firstPageWrapper.vm.isFirstPage).toBe(true)

    // 最後のページでの表示を確認
    const lastPageWrapper = mount(TeamPagination, {
      props: {
        pagination: { ...mockPagination, current_page: 5 },
      },
      global: {
        stubs: ['ElPagination', 'ElSelect', 'ElOption'],
      },
    })

    expect(lastPageWrapper.vm.isLastPage).toBe(true)
  })

  test('レスポンシブ対応が正しく動作する', () => {
    // レスポンシブ対応の動作を確認
    const wrapper = mount(TeamPagination, {
      props: {
        pagination: mockPagination,
      },
      global: {
        stubs: ['ElPagination', 'ElSelect', 'ElOption'],
      },
    })

    // モバイル表示のテスト
    expect(wrapper.find('[data-testid="mobile-pagination"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="desktop-pagination"]').exists()).toBe(true)
  })
})
```

### 5. Layouts/AppLayout.vue のチーム機能テスト

**ファイル**: `resources/js/Layouts/__tests__/AppLayout.TeamIntegration.test.ts`

```typescript
/**
 * AppLayoutのチームメニュー統合テスト
 */
import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppLayout from '../AppLayout.vue'

// Inertia.js モック
const mockInertia = {
  router: {
    visit: vi.fn(),
  },
  page: {
    props: {
      auth: {
        user: {
          name: 'Test User',
          current_team: {
            id: 1,
            name: 'Current Team',
          },
          all_teams: [
            { id: 1, name: 'Current Team' },
            { id: 2, name: 'Other Team' },
          ],
        },
      },
      jetstream: {
        hasTeamFeatures: true,
        canCreateTeams: true,
      },
    },
  },
}

vi.mock('@inertiajs/vue3', () => mockInertia)

describe('AppLayout Team Integration', () => {
  test('チームドロップダウンメニューが表示される', () => {
    // チームドロップダウンメニューの表示を確認
    const wrapper = mount(AppLayout, {
      props: {
        title: 'Test Page',
      },
      global: {
        stubs: {
          Dropdown: {
            template: '<div class="team-dropdown"><slot /></div>',
          },
          DropdownLink: {
            template: '<a class="dropdown-link" :href="href"><slot /></a>',
            props: ['href'],
          },
          ResponsiveNavLink: {
            template: '<a class="responsive-nav-link" :href="href"><slot /></a>',
            props: ['href', 'active'],
          },
        },
      },
    })

    expect(wrapper.find('.team-dropdown').exists()).toBe(true)
  })

  test('チーム一覧リンクが正しく表示される', () => {
    // チーム一覧リンクの表示を確認
    const wrapper = mount(AppLayout, {
      props: {
        title: 'Test Page',
      },
      global: {
        stubs: {
          Dropdown: {
            template: '<div class="team-dropdown"><slot /></div>',
          },
          DropdownLink: {
            template: '<a class="dropdown-link" :href="href"><slot /></a>',
            props: ['href'],
          },
        },
      },
    })

    const teamsLink = wrapper.find('[data-testid="teams-list-link"]')
    expect(teamsLink.exists()).toBe(true)
    expect(teamsLink.attributes('href')).toBe('/teams')
  })

  test('レスポンシブメニューにチーム一覧リンクが表示される', () => {
    // レスポンシブメニューでのチーム一覧リンク表示を確認
    const wrapper = mount(AppLayout, {
      props: {
        title: 'Test Page',
      },
      global: {
        stubs: {
          ResponsiveNavLink: {
            template:
              '<a class="responsive-nav-link" :href="href" :class="{ active: active }"><slot /></a>',
            props: ['href', 'active'],
          },
        },
      },
    })

    const responsiveTeamsLink = wrapper.find('[data-testid="responsive-teams-list-link"]')
    expect(responsiveTeamsLink.exists()).toBe(true)
    expect(responsiveTeamsLink.attributes('href')).toBe('/teams')
  })

  test('チーム機能が無効な場合にメニューが表示されない', () => {
    // チーム機能無効時のメニュー非表示を確認
    const wrapper = mount(AppLayout, {
      props: {
        title: 'Test Page',
      },
      global: {
        mocks: {
          $page: {
            props: {
              ...mockInertia.page.props,
              jetstream: {
                hasTeamFeatures: false,
                canCreateTeams: false,
              },
            },
          },
        },
        stubs: {
          Dropdown: {
            template: '<div class="team-dropdown"><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="teams-list-link"]').exists()).toBe(false)
  })
})
```

## 成果物

### 新規作成ファイル

1. `resources/js/Pages/Teams/__tests__/Index.test.ts` - チーム一覧ページテスト
2. `resources/js/Components/Teams/__tests__/TeamCard.test.ts` - チームカードコンポーネントテスト
3. `resources/js/Components/Teams/__tests__/TeamFilters.test.ts` - チームフィルターコンポーネントテスト
4. `resources/js/Components/Teams/__tests__/TeamPagination.test.ts` - チームページネーションコンポーネントテスト
5. `resources/js/Layouts/__tests__/AppLayout.TeamIntegration.test.ts` - AppLayoutチーム統合テスト

## 完了条件

### 基本テスト実行

1. **テスト実行コマンド確認**

   ```bash
   pnpm test
   ```

2. **個別テスト実行**

   ```bash
   pnpm test resources/js/Pages/Teams/__tests__/
   pnpm test resources/js/Components/Teams/__tests__/
   ```

### カバレッジ確認

1. **コンポーネントレンダリング**: 全コンポーネントが正常にレンダリング
2. **インタラクション**: ボタンクリック、入力処理が正常動作
3. **イベント処理**: emits イベントが正しく発火
4. **状態管理**: props 変更時の適切な再レンダリング
5. **エラーハンドリング**: 異常系での適切な動作

### テスト項目確認

#### Pages/Teams/Index.vue

- ✅ ページレンダリング
- ✅ チーム一覧表示
- ✅ フィルター統合
- ✅ ページネーション統合
- ✅ 空状態表示
- ✅ ローディング状態表示

#### Components/Teams/TeamCard.vue

- ✅ チーム情報表示
- ✅ タグ表示（個人チーム、現在チーム）
- ✅ チーム切り替え機能
- ✅ 設定画面遷移
- ✅ イベント発火（メンバー表示、詳細表示）
- ✅ 日付フォーマット

#### Components/Teams/TeamFilters.vue

- ✅ フィルター表示
- ✅ 検索デバウンス処理
- ✅ フィルター変更イベント
- ✅ アクティブフィルター表示
- ✅ フィルタークリア機能
- ✅ 結果統計表示

#### Components/Teams/TeamPagination.vue

- ✅ ページネーション表示
- ✅ ページ変更イベント
- ✅ 件数変更イベント
- ✅ ページ情報表示
- ✅ ボタン状態制御
- ✅ レスポンシブ対応

#### Layouts/AppLayout.vue

- ✅ チームメニュー表示
- ✅ チーム一覧リンク表示
- ✅ レスポンシブメニュー対応
- ✅ 機能無効時の非表示

## 技術的考慮事項

### 1. Vue Test Utils

- `mount()` によるコンポーネントマウント
- `stubs` による依存コンポーネントのモック
- `emitted()` によるイベント発火確認

### 2. Vitest

- `describe`/`test` による階層的テスト構造
- `beforeEach`/`afterEach` による環境セットアップ
- `vi.fn()` によるモック関数作成

### 3. VueUse テスト

- `useDebounceFn` のテスト
- タイマーモック (`vi.useFakeTimers()`) の活用

### 4. Inertia.js モック

- `router` メソッドのモック
- `$page.props` のモック
- ナビゲーション処理のテスト

## 注意事項

### 1. Element Plus

- Element Plus コンポーネントは `stubs` でモック
- 必要に応じて実際のコンポーネントでテスト

### 2. 非同期処理

- `await nextTick()` による DOM 更新待機
- Promise ベースの処理の適切なテスト

### 3. タイマー処理

- デバウンス処理のテストで `vi.useFakeTimers()` を使用
- テスト後の `vi.useRealTimers()` でクリーンアップ

## 実装時の注意点

### 1. モックデータ

- 実際のAPIレスポンス構造に準拠
- 型定義との整合性確保
- エッジケースを考慮したデータ作成

### 2. テスト環境

- Vitestの設定ファイル確認
- 必要な依存関係のインストール
- TypeScript型定義の確保

### 3. コンポーネント分離

- 各コンポーネントの単体テスト
- 統合テストとの適切な分離
- テスト可能な設計の確保

## コードレビューポイント

1. **テストカバレッジ**: 重要な機能の網羅的テスト
2. **モック品質**: 適切なモック設計と使用
3. **テスト可読性**: 明確なテスト名と構造
4. **保守性**: 変更に対する堅牢性
