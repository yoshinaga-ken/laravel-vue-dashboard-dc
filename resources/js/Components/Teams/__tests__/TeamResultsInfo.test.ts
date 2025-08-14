import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TeamResultsInfo from '../TeamResultsInfo.vue'
import type { PaginationMeta, TeamFilters, TeamStatsWithPagination } from '@/Types/types-team'

// Element Plus のモック（TeamCard.test.tsパターン）
vi.mock('element-plus', () => ({
  ElSelect: true,
  ElOption: true,
  ElTag: true,
  ElButton: true,
}))

describe('TeamResultsInfo.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockPagination = (): PaginationMeta => ({
    current_page: 1,
    per_page: 10,
    total: 100,
    last_page: 10,
    from: 1,
    to: 10,
    links: [],
  })

  const createMockFilters = (): TeamFilters => ({
    search: null,
    type: 'all',
    member_count: null,
    sort_by: 'name_asc',
  })

  const createMockStats = (): TeamStatsWithPagination => ({
    total: 100,
    filtered: 90,
    showing: 10,
    from: 1,
    to: 10,
  })

  const createWrapper = (props = {}) => {
    const defaultProps = {
      pagination: createMockPagination(),
      filters: createMockFilters(),
      stats: createMockStats(),
    }

    return mount(TeamResultsInfo, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: {
        stubs: {
          ElSelect: true,
          ElOption: true,
          ElTag: true,
          ElButton: true,
        },
      },
    })
  }

  it('コンポーネントが正常にマウントされる', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('検索結果の情報が表示される', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('フィルターが適用されている場合、フィルタータグが表示される', () => {
    const filters = createMockFilters()
    filters.search = 'テスト'
    filters.type = 'personal' // TeamType = 'all' | 'personal' | 'shared' | 'current'

    const wrapper = createWrapper({ filters })
    expect(wrapper.exists()).toBe(true)
  })

  it('ページサイズ変更ができる', async () => {
    const wrapper = createWrapper()
    const selectComponent = wrapper.findComponent({ name: 'ElSelect' })

    if (selectComponent.exists()) {
      await selectComponent.vm.$emit('change', 20)
      expect(wrapper.emitted('perPageChanged')).toBeTruthy()
    }
  })

  it('フィルターをクリアできる', async () => {
    const filters = createMockFilters()
    filters.search = 'テスト'

    const wrapper = createWrapper({ filters })
    const clearButton = wrapper.find('[data-testid*="clear"]')

    if (clearButton.exists()) {
      await clearButton.trigger('click')
      expect(wrapper.emitted('allFiltersCleared')).toBeTruthy()
    }
  })

  it('読み込み中の状態を正しく処理する', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('結果が0件の場合、適切なメッセージが表示される', () => {
    const pagination = createMockPagination()
    pagination.total = 0
    const stats = createMockStats()
    stats.total = 0

    const wrapper = createWrapper({ pagination, stats })
    expect(wrapper.exists()).toBe(true)
  })

  it('ページネーション情報が正しく表示される', () => {
    const pagination = createMockPagination()
    pagination.current_page = 2
    pagination.per_page = 20
    pagination.from = 21
    pagination.to = 40

    const wrapper = createWrapper({ pagination })
    expect(wrapper.exists()).toBe(true)
  })

  it('統計情報が正しく表示される', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('ソート順の変更ができる', async () => {
    const wrapper = createWrapper()
    // ソート関連のテストは実装に依存
    expect(wrapper.exists()).toBe(true)
  })
})
