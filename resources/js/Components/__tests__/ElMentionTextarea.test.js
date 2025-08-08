import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ElMentionTextarea from '@/Components/ElMentionTextarea.vue'
import { ElMention } from 'element-plus'

// GraphQL関連のモック
vi.mock('@vue/apollo-composable', () => ({
  useQuery: vi.fn(),
}))

vi.mock('graphql-tag', () => ({
  default: vi.fn(),
}))

describe('ElMentionTextarea', () => {
  let wrapper
  let mockUseQuery
  let mockRefetchTags
  let mockRefetchUsers

  // モックデータ
  const mockTagsData = {
    tags: {
      data: [{ name: 'vue' }, { name: 'react' }, { name: 'javascript' }, { name: 'typescript' }],
      paginatorInfo: {
        count: 4,
        total: 4,
      },
    },
  }

  const mockUsersData = {
    users: {
      data: [
        { name: 'alice', email: 'alice@example.com' },
        { name: 'bob', email: 'bob@example.com' },
        { name: 'charlie', email: 'charlie@example.com' },
      ],
      paginatorInfo: {
        count: 3,
        total: 3,
      },
    },
  }

  beforeEach(async () => {
    // GraphQL useQueryのモック設定
    mockRefetchTags = vi.fn().mockResolvedValue({ data: mockTagsData })
    mockRefetchUsers = vi.fn().mockResolvedValue({ data: mockUsersData })

    mockUseQuery = vi
      .fn()
      .mockReturnValueOnce({
        // タグクエリの戻り値
        result: { value: mockTagsData },
        refetch: mockRefetchTags,
      })
      .mockReturnValueOnce({
        // ユーザークエリの戻り値
        result: { value: mockUsersData },
        refetch: mockRefetchUsers,
      })

    const { useQuery } = await import('@vue/apollo-composable')
    useQuery.mockImplementation(mockUseQuery)

    wrapper = mount(ElMentionTextarea, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e }),
        placeholder: 'テスト用プレースホルダー',
        disabled: false,
        rows: 6,
      },
      global: {
        components: {
          ElMention,
        },
        stubs: {
          ElMention: {
            template:
              '<div class="mock-el-mention"><textarea v-bind="$attrs" @input="$emit(\'update:modelValue\', $event.target.value)" /></div>',
            emits: ['update:modelValue', 'search'],
            props: [
              'modelValue',
              'options',
              'loading',
              'placeholder',
              'disabled',
              'rows',
              'prefix',
            ],
          },
        },
      },
    })

    // コンポーネントの初期化を待つ
    await wrapper.vm.$nextTick()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('初期状態で正しくレンダリングされる', () => {
    expect(wrapper.exists()).toBe(true)
    const elMention = wrapper.findComponent('.mock-el-mention')
    expect(elMention.exists()).toBe(true)
  })

  it('propsが正しくElMentionコンポーネントに渡される', () => {
    const elMention = wrapper.findComponent('.mock-el-mention')
    const props = elMention.props()

    expect(props.placeholder).toBe('テスト用プレースホルダー')
    expect(props.disabled).toBe(false)
    expect(props.rows).toBe(6)
    expect(props.prefix).toEqual(['@', '#', '＠', '＃'])
  })

  it('v-modelが正しく動作する', async () => {
    const testValue = '@alice こんにちは #vue を使っています'

    await wrapper.setProps({ modelValue: testValue })

    const elMention = wrapper.findComponent('.mock-el-mention')
    expect(elMention.props('modelValue')).toBe(testValue)
  })

  it('GraphQLクエリが初期化時に実行される', () => {
    // useQueryが2回呼ばれることを確認（タグとユーザー）
    expect(mockUseQuery).toHaveBeenCalledTimes(2)

    // タグクエリの確認
    const tagQueryCall = mockUseQuery.mock.calls[0]
    expect(tagQueryCall[1].variables.input.name).toBe('')

    // ユーザークエリの確認
    const userQueryCall = mockUseQuery.mock.calls[1]
    expect(userQueryCall[1].variables.input.name).toBe('')
  })

  it('タグデータが正しく computed プロパティで変換される', () => {
    const availableTags = wrapper.vm.availableTags
    expect(availableTags).toEqual(['vue', 'react', 'javascript', 'typescript'])
  })

  it('ユーザーデータが正しく computed プロパティで変換される', () => {
    const availableUsers = wrapper.vm.availableUsers
    expect(availableUsers).toEqual(['alice', 'bob', 'charlie'])
  })

  it('キャッシュ戦略が正しく判定される（データ件数 ≤ 512）', () => {
    // 初期状態ではキャッシュ戦略が有効
    expect(wrapper.vm.useTagCache).toBe(true)
    expect(wrapper.vm.useUserCache).toBe(true)
  })

  it('動的検索戦略が正しく判定される（データ件数 > 512）', async () => {
    // 大量データのモック
    const largeTagsData = {
      tags: {
        data: Array.from({ length: 100 }, (_, i) => ({ name: `tag${i}` })),
        paginatorInfo: {
          count: 100,
          total: 1000, // 512を超過
        },
      },
    }

    const largeUsersData = {
      users: {
        data: Array.from({ length: 100 }, (_, i) => ({
          name: `user${i}`,
          email: `user${i}@example.com`,
        })),
        paginatorInfo: {
          count: 100,
          total: 1000, // 512を超過
        },
      },
    }

    // モックを完全にリセット
    vi.clearAllMocks()

    // 新しいモック関数を作成
    const mockRefetchTagsLarge = vi.fn().mockResolvedValue({ data: largeTagsData })
    const mockRefetchUsersLarge = vi.fn().mockResolvedValue({ data: largeUsersData })

    const mockUseQueryLarge = vi
      .fn()
      .mockReturnValueOnce({
        result: { value: largeTagsData },
        refetch: mockRefetchTagsLarge,
      })
      .mockReturnValueOnce({
        result: { value: largeUsersData },
        refetch: mockRefetchUsersLarge,
      })

    const { useQuery } = await import('@vue/apollo-composable')
    useQuery.mockImplementation(mockUseQueryLarge)

    const wrapperLarge = mount(ElMentionTextarea, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': e => wrapperLarge.setProps({ modelValue: e }),
      },
      global: {
        components: { ElMention },
        stubs: {
          ElMention: {
            template: '<div class="mock-el-mention" />',
            props: [
              'modelValue',
              'options',
              'loading',
              'placeholder',
              'disabled',
              'rows',
              'prefix',
            ],
          },
        },
      },
    })

    await wrapperLarge.vm.$nextTick()

    // computedプロパティを評価してキャッシュ戦略を確定させる
    const availableTags = wrapperLarge.vm.availableTags
    const availableUsers = wrapperLarge.vm.availableUsers

    // 大量データの場合、キャッシュ戦略が無効になることを確認
    expect(wrapperLarge.vm.useTagCache).toBe(false)
    expect(wrapperLarge.vm.useUserCache).toBe(false)
  })

  it('@プレフィックスでユーザー検索が実行される（キャッシュ戦略）', async () => {
    const pattern = 'ali'
    const prefix = '@'

    await wrapper.vm.handleSearch(pattern, prefix)

    // タイマーの実行を待つ
    await new Promise(resolve => setTimeout(resolve, 350))

    // キャッシュ戦略なのでrefetchは呼ばれない
    expect(mockRefetchUsers).not.toHaveBeenCalled()

    // オプションがフィルタリングされていることを確認
    expect(wrapper.vm.options).toEqual([{ label: '@alice', value: 'alice' }])
  })

  it('#プレフィックスでタグ検索が実行される（キャッシュ戦略）', async () => {
    const pattern = 'vue'
    const prefix = '#'

    await wrapper.vm.handleSearch(pattern, prefix)

    // タイマーの実行を待つ
    await new Promise(resolve => setTimeout(resolve, 350))

    // キャッシュ戦略なのでrefetchは呼ばれない
    expect(mockRefetchTags).not.toHaveBeenCalled()

    // オプションがフィルタリングされていることを確認
    expect(wrapper.vm.options).toEqual([{ label: '#vue', value: 'vue' }])
  })

  it('動的検索戦略でユーザー検索が実行される', async () => {
    // 動的検索戦略に切り替え
    wrapper.vm.useUserCache = false

    const pattern = 'ali'
    const prefix = '@'

    await wrapper.vm.handleSearch(pattern, prefix)

    // タイマーの実行を待つ
    await new Promise(resolve => setTimeout(resolve, 350))

    // 動的検索なのでrefetchが呼ばれることを確認
    expect(mockRefetchUsers).toHaveBeenCalledWith({
      input: { name: pattern },
    })
  })

  it('動的検索戦略でタグ検索が実行される', async () => {
    // 動的検索戦略に切り替え
    wrapper.vm.useTagCache = false

    const pattern = 'vue'
    const prefix = '#'

    await wrapper.vm.handleSearch(pattern, prefix)

    // タイマーの実行を待つ
    await new Promise(resolve => setTimeout(resolve, 350))

    // 動的検索なのでrefetchが呼ばれることを確認
    expect(mockRefetchTags).toHaveBeenCalledWith({
      input: { name: pattern },
    })
  })

  it('デバウンス機能が正しく動作する', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // 短時間で複数回検索を実行
    wrapper.vm.handleSearch('a', '@')
    wrapper.vm.handleSearch('al', '@')
    wrapper.vm.handleSearch('ali', '@')

    // 最初のタイマーが完了する前に確認
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(mockRefetchUsers).not.toHaveBeenCalled()

    // 最終的なタイマーが完了するまで待つ
    await new Promise(resolve => setTimeout(resolve, 350))

    // 最後の検索のみが実行されることを確認（動的検索の場合）
    wrapper.vm.useUserCache = false
    await wrapper.vm.handleSearch('alice', '@')
    await new Promise(resolve => setTimeout(resolve, 350))

    consoleSpy.mockRestore()
  })

  it('無効なプレフィックスでは検索が実行されない', async () => {
    await wrapper.vm.handleSearch('test', '$') // 無効なプレフィックス

    await new Promise(resolve => setTimeout(resolve, 350))

    expect(wrapper.vm.options).toEqual([])
    expect(mockRefetchUsers).not.toHaveBeenCalled()
    expect(mockRefetchTags).not.toHaveBeenCalled()
  })

  it('空のパターンでも検索が実行される', async () => {
    await wrapper.vm.handleSearch('', '@')

    await new Promise(resolve => setTimeout(resolve, 350))

    // 空の検索でも全候補が表示される
    expect(wrapper.vm.options).toEqual([
      { label: '@alice', value: 'alice' },
      { label: '@bob', value: 'bob' },
      { label: '@charlie', value: 'charlie' },
    ])
  })

  it('大文字小文字を区別しない検索が動作する', async () => {
    await wrapper.vm.handleSearch('VUE', '#') // 大文字で検索

    await new Promise(resolve => setTimeout(resolve, 350))

    expect(wrapper.vm.options).toEqual([{ label: '#vue', value: 'vue' }])
  })

  it('全角プレフィックス（＠）でユーザー検索が実行される', async () => {
    const pattern = 'ali'
    const prefix = '＠' // 全角アットマーク

    await wrapper.vm.handleSearch(pattern, prefix)

    // タイマーの実行を待つ
    await new Promise(resolve => setTimeout(resolve, 350))

    // 全角記号でも半角記号として正規化されることを確認
    expect(wrapper.vm.options).toEqual([{ label: '@alice', value: 'alice' }])
  })

  it('全角プレフィックス（＃）でタグ検索が実行される', async () => {
    const pattern = 'vue'
    const prefix = '＃' // 全角ハッシュ

    await wrapper.vm.handleSearch(pattern, prefix)

    // タイマーの実行を待つ
    await new Promise(resolve => setTimeout(resolve, 350))

    // 全角記号でも半角記号として正規化されることを確認
    expect(wrapper.vm.options).toEqual([{ label: '#vue', value: 'vue' }])
  })

  it('検索エラーが適切にハンドリングされる', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // refetchでエラーを発生させる
    mockRefetchUsers.mockRejectedValueOnce(new Error('Network error'))
    wrapper.vm.useUserCache = false

    await wrapper.vm.handleSearch('test', '@')
    await new Promise(resolve => setTimeout(resolve, 350))

    // エラーログが出力されることを確認
    expect(consoleSpy).toHaveBeenCalledWith('Search error:', expect.any(Error))

    // エラー時は空の結果が返される
    expect(wrapper.vm.options).toEqual([])

    consoleSpy.mockRestore()
  })

  it('コンポーネントが破棄される時にタイマーがクリアされる', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    // 検索を開始してタイマーをセット
    wrapper.vm.handleSearch('test', '@')

    // コンポーネントを破棄
    wrapper.unmount()

    // clearTimeoutが呼ばれることを確認
    expect(clearTimeoutSpy).toHaveBeenCalled()

    clearTimeoutSpy.mockRestore()
  })

  it('defineExposeで公開されたメソッドが動作する', () => {
    // focus メソッドの確認（実装に依存するため、存在確認のみ）
    expect(typeof wrapper.vm.focus).toBe('function')

    // clear メソッドの確認
    expect(typeof wrapper.vm.clear).toBe('function')

    // clearメソッドの動作確認
    wrapper.setProps({ modelValue: 'test content' })
    wrapper.vm.clear()
    expect(wrapper.props('modelValue')).toBe('')
  })

  it('プロパティの初期値が正しく設定される', async () => {
    // モックを完全にリセット
    vi.clearAllMocks()

    // 新しいモック関数を作成（初期値テスト用）
    const mockRefetchTagsDefault = vi.fn().mockResolvedValue({ data: mockTagsData })
    const mockRefetchUsersDefault = vi.fn().mockResolvedValue({ data: mockUsersData })

    const mockUseQueryDefault = vi
      .fn()
      .mockReturnValueOnce({
        result: { value: mockTagsData },
        refetch: mockRefetchTagsDefault,
      })
      .mockReturnValueOnce({
        result: { value: mockUsersData },
        refetch: mockRefetchUsersDefault,
      })

    const { useQuery } = await import('@vue/apollo-composable')
    useQuery.mockImplementation(mockUseQueryDefault)

    const defaultWrapper = mount(ElMentionTextarea, {
      global: {
        components: { ElMention },
        stubs: {
          ElMention: {
            template: '<div class="mock-el-mention" />',
            props: [
              'modelValue',
              'options',
              'loading',
              'placeholder',
              'disabled',
              'rows',
              'prefix',
            ],
          },
        },
      },
    })

    await defaultWrapper.vm.$nextTick()

    // デフォルトプロパティの値をテスト（コンポーネントのpropsから直接確認）
    const componentProps = defaultWrapper.vm.$props
    expect(componentProps.placeholder).toBe('input @ to mention people, # to mention tag')
    expect(componentProps.disabled).toBe(false)
    expect(componentProps.rows).toBe(4)
  })

  it('無効状態でコンポーネントが正しく動作する', async () => {
    await wrapper.setProps({ disabled: true })

    const elMention = wrapper.findComponent('.mock-el-mention')
    expect(elMention.props('disabled')).toBe(true)
  })

  it('modelValueの全角プレフィックスが半角に正規化される', async () => {
    // 全角プレフィックス付きのテキストを設定
    await wrapper.setProps({ modelValue: '＠alice ＃vue test' })

    // Vue.jsのwatchが実行されるまで待つ
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    // 全角記号が半角に正規化されることを確認
    expect(wrapper.props('modelValue')).toBe('@alice #vue test')
  })

  it('modelValue正規化時の無限ループを防ぐ', async () => {
    // 正規化が不要なテキストを設定
    await wrapper.setProps({ modelValue: '@alice #vue test' })

    // Vue.jsのwatchが実行されるまで待つ
    await wrapper.vm.$nextTick()

    // 値が変更されないことを確認
    expect(wrapper.props('modelValue')).toBe('@alice #vue test')
  })

  // TODO: 以下のテストケースは今後の機能拡張時に実装
  // it('ユーザーアバター表示機能のテスト', () => { })
  // it('カスタムプレフィックスのサポートテスト', () => { })
  // it('Markdown記法の入力補助機能テスト', () => { })
  // it('メンション部分のインタラクティブ表示テスト', () => { })
  // it('アクセシビリティ機能のテスト', () => { })
})
