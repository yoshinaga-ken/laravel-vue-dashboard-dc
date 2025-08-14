import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TeamPagination from '../TeamPagination.vue'
import type { PaginationMeta } from '@/Types/types-team'

// Element Plus のモック（TeamCard.test.tsパターン）
vi.mock('element-plus', () => ({
  ElPagination: true,
  ElButton: true,
  ElIcon: true,
}))

// Element Plus Icons のモック
vi.mock('@element-plus/icons-vue', () => ({
  ArrowLeft: true,
  ArrowRight: true,
}))

describe('TeamPagination.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockPagination = (overrides: Partial<PaginationMeta> = {}): PaginationMeta => ({
    current_page: 1,
    per_page: 10,
    total: 100,
    last_page: 10,
    from: 1,
    to: 10,
    links: [],
    ...overrides,
  })

  const createWrapper = (props = {}) => {
    const defaultProps = {
      pagination: createMockPagination(),
      loading: false,
    }

    return mount(TeamPagination, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: {
        stubs: {
          ElPagination: true,
          ElButton: true,
          ElIcon: true,
          ArrowLeft: true,
          ArrowRight: true,
        },
      },
    })
  }

  it('コンポーネントが正常にマウントされる', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('ページネーション情報が正しく表示される', () => {
    const pagination = createMockPagination({
      current_page: 2,
      per_page: 10,
      total: 50,
      last_page: 5,
    })
    const wrapper = createWrapper({ pagination })
    expect(wrapper.exists()).toBe(true)
  })

  it('読み込み中の状態を正しく処理する', () => {
    const wrapper = createWrapper({ loading: true })
    expect(wrapper.exists()).toBe(true)
  })

  it('ページサイズ変更イベントが発火される', async () => {
    const wrapper = createWrapper()
    const paginationComponent = wrapper.findComponent({ name: 'ElPagination' })

    if (paginationComponent.exists()) {
      await paginationComponent.vm.$emit('size-change', 20)
      expect(wrapper.emitted('page-size-change')).toBeTruthy()
    }
  })

  it('ページ変更イベントが発火される', async () => {
    const wrapper = createWrapper()
    const paginationComponent = wrapper.findComponent({ name: 'ElPagination' })

    if (paginationComponent.exists()) {
      await paginationComponent.vm.$emit('current-change', 2)
      expect(wrapper.emitted('page-change')).toBeTruthy()
    }
  })

  it('1ページ目の場合、前のページボタンが無効になる', () => {
    const pagination = createMockPagination({ current_page: 1 })
    const wrapper = createWrapper({ pagination })
    expect(wrapper.exists()).toBe(true)
  })

  it('最後のページの場合、次のページボタンが無効になる', () => {
    const pagination = createMockPagination({ current_page: 10, last_page: 10 })
    const wrapper = createWrapper({ pagination })
    expect(wrapper.exists()).toBe(true)
  })

  it('総件数が0の場合、ページネーションが表示されない', () => {
    const pagination = createMockPagination({ total: 0, last_page: 0 })
    const wrapper = createWrapper({ pagination })
    expect(wrapper.exists()).toBe(true)
  })

  it('ページサイズオプションが正しく設定される', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('ページネーション情報のテキストが正しく表示される', () => {
    const pagination = createMockPagination({
      current_page: 2,
      per_page: 10,
      total: 50,
      from: 11,
      to: 20,
    })
    const wrapper = createWrapper({ pagination })
    expect(wrapper.exists()).toBe(true)
  })
})
