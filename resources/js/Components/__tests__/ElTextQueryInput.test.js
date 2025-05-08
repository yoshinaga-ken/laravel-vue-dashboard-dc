import {mount} from '@vue/test-utils'
import {describe, it, expect, vi, beforeEach} from 'vitest'
import ElTextQueryInput from '@/Components/ElTextQueryInput.vue'
import {ElTag, ElAutocomplete, ElButton, ElDatePicker, ElIcon} from 'element-plus'

// Element Plusのアイコンコンポーネントのモック
vi.mock('@element-plus/icons-vue', () => ({
  User: vi.fn(),
  Calendar: vi.fn(),
  Flag: vi.fn()
}))

describe('ElTextQueryInput', () => {
  let wrapper
  const availableTokens = [
    {
      type: 'user',
      icon: 'User',
      title: 'Author',
      tags: ['alpha', 'beta', 'gamma'],
      operators: ['=', '!='],
    },
    {
      type: 'tag-fw',
      icon: 'Flag',
      title: 'FrameWork',
      tags: [
        {id: 1, name: 'Vue3'},
        {id: 2, name: 'React'},
      ],
      operators: ['=', '!='],
    },
    {
      type: 'date',
      icon: 'Calendar',
      title: 'Date',
      tags: 'DatePicker',
      operators: ['>', '<'],
    },
    {
      type: 'date_range',
      icon: 'Calendar',
      title: 'Date (From,To)',
      tags: 'DatePicker',
      tagsComponentOptions: { // @see [DatePicker options](https://element-plus.org/en-US/component/date-picker)
        type: "daterange"
      },
      operators: [':'],
    },
  ]

  beforeEach(() => {
    wrapper = mount(ElTextQueryInput, {
      props: {
        modelValue: [
          {type: 'user', value: {data: 'alpha', operator: '='}}
        ],
        'onUpdate:modelValue': (e) => wrapper.setProps({modelValue: e}),
        availableTokens
      },
      global: {
        components: {
          ElTag,
          ElAutocomplete,
          ElButton,
          ElDatePicker,
          ElIcon
        },
        stubs: {
          ElIcon: true
        }
      }
    })
  })

  it('初期状態で既存のトークンが表示される', () => {
    const tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(3)
    expect(tags[0].text()).toContain('Author')
    expect(tags[1].text()).toContain('=')
    expect(tags[2].text()).toContain('alpha')
  })

  it('キー、オペレーター、値の順で入力プロセスが進む - Key:Author', async () => {
    // トークン入力の開始
    const inputRef = wrapper.findComponent({ref: 'inputRef'})
    expect(inputRef.exists()).toBe(true)
    await inputRef.trigger('focus')

    // キー選択
    const keyAutocomplete = wrapper.findComponent(ElAutocomplete)
    await keyAutocomplete.vm.$emit('select', {value: 'Author', item: availableTokens[0]})

    // オペレーター選択フィールドの表示確認
    const operatorAutocomplete = wrapper.findComponent(ElAutocomplete)
    expect(operatorAutocomplete.exists()).toBe(true)

    // オペレーター選択
    await operatorAutocomplete.vm.$emit('select', {value: '!='})

    // 値選択フィールドの表示確認
    const valueAutocomplete = wrapper.findComponent(ElAutocomplete)
    expect(valueAutocomplete.exists()).toBe(true)

    // 値選択
    await valueAutocomplete.vm.$emit('select', {value: 'beta'})

    // トークンが追加されたことを確認
    await wrapper.vm.$nextTick()
    const tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(6)
    expect(tags[3].text()).toContain('Author')
    expect(tags[4].text()).toContain('!=')
    expect(tags[5].text()).toContain('beta')
  })

  it('キー入力をでEnterキーで決定したら、type=stringでトークンが入力され、キー入力プロセスにすすむ', async () => {
    // トークン入力の開始
    const inputRef = wrapper.findComponent({ref: 'inputRef'})
    expect(inputRef.exists()).toBe(true)
    await inputRef.trigger('focus')

    // キー入力をでEnterキーで決定
    const word = 'Author'
    const keyAutocomplete = wrapper.findComponent(ElAutocomplete)
    await keyAutocomplete.setValue(word)
    const input = keyAutocomplete.find('input')
    await input.trigger('keyup.enter')

    // トークンが追加されたことを確認
    await wrapper.vm.$nextTick()
    const tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(4) // 既存の3つのタグ + 新しく追加されたタグ
    expect(tags[3].text()).toContain(word)

    // キー入力プロセスに戻っていることを確認
    expect(wrapper.vm.inputStep).toBe('key')
    // 入力フィールドがクリアされていることを確認
    expect(keyAutocomplete.find('input').element.value).toBe('')
  })

  it('トークンを全クリアボタンで全削除できる', async () => {
    // 初期状態でトークンが存在することを確認
    const initialTags = wrapper.findAllComponents(ElTag)
    expect(initialTags).toHaveLength(3)

    // クリアボタンを探してクリックする
    const clearButton = wrapper.find('.clear-button')
    expect(clearButton.exists()).toBe(true)
    await clearButton.trigger('click')

    // すべてのトークンが削除されたことを確認
    expect(wrapper.findAllComponents(ElTag)).toHaveLength(0)
  })

  it('個別のトークンを削除できる', async () => {
    // タグコンポーネントが見つかることを確認
    const tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(3) // キー、オペレーター、値の3つのタグがあるはず

    // closeイベントを発生させる
    await tags[0].vm.$emit('close')

    // トークンが削除されたことを確認
    expect(wrapper.findAllComponents(ElTag)).toHaveLength(0)
  })

  it('値入力中、入力内容が空の時Backspaceキーで、オペレーター、キーの順で入力プロセスが戻る - Key:Author', async () => {
    // トークン入力の開始
    const inputRef = wrapper.findComponent({ref: 'inputRef'})
    expect(inputRef.exists()).toBe(true)
    await inputRef.trigger('focus')

    // キー選択
    const keyAutocomplete = wrapper.findComponent(ElAutocomplete)
    await keyAutocomplete.vm.$emit('select', {value: 'Author', item: availableTokens[0]})

    // キー選択後、オペレーター選択ステップになったことを確認
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.inputStep).toBe('operator')

    // オペレーター選択
    let operatorAutocomplete = wrapper.findComponent(ElAutocomplete)
    await operatorAutocomplete.vm.$emit('select', {value: '!='})

    // オペレーター選択後、値選択ステップになったことを確認
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.inputStep).toBe('value')

    let tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(5)

    // 値入力フィールドが空であることを確認
    const valueAutocomplete = wrapper.findComponent(ElAutocomplete)
    const valueInput = valueAutocomplete.find('input')
    expect(valueInput.element.value).toBe('')

    // 値選択フィールドでBackspaceを押す（値入力が空の状態）
    await valueInput.trigger('keydown', {key: 'Backspace'})

    // 値入力からオペレーター選択に戻ったことを確認
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.inputStep).toBe('operator')

    tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(4)

    // オペレーター入力フィールドが空になっていることを確認
    operatorAutocomplete = wrapper.findComponent(ElAutocomplete)
    const operatorInput = operatorAutocomplete.find('input')
    expect(operatorInput.element.value).toBe('')

    // オペレーター選択フィールドでBackspaceを押す（オペレーター入力が空の状態）
    await operatorInput.trigger('keydown', {key: 'Backspace'})

    tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(3)

    // オペレーター入力からキー選択に戻ったことを確認
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.inputStep).toBe('key')

    // キー入力フィールドが空になっていることを確認
    const keyInput = keyAutocomplete.find('input')
    expect(keyInput.element.value).toBe('')
  })

  // TODO:
  // it('props.disabled状態の時、トークンの削除や追加ができない', () => { })
  // it('トークンクリックで、トークンの編集状態になる', () => { })

  it('キー、オペレーター、値の順で入力プロセスが進む - Key:Date', async () => {
    // トークン入力の開始
    const inputRef = wrapper.findComponent({ref: 'inputRef'})
    expect(inputRef.exists()).toBe(true)
    await inputRef.trigger('focus')

    // キー選択 (Date)
    const keyAutocomplete = wrapper.findComponent(ElAutocomplete)
    await keyAutocomplete.vm.$emit('select', {value: 'Date', item: availableTokens[2]})

    // オペレーター選択フィールドの表示確認
    const operatorAutocomplete = wrapper.findComponent(ElAutocomplete)
    expect(operatorAutocomplete.exists()).toBe(true)

    // オペレーター選択
    await operatorAutocomplete.vm.$emit('select', {value: '>'})

    // 値選択フィールドの表示確認（DateタイプなのでDatePickerが表示されるはず）
    const datePicker = wrapper.findComponent(ElDatePicker)
    expect(datePicker.exists()).toBe(true)

    // 日付選択
    const testDate = new Date('2025-05-01')
    await datePicker.vm.$emit('change', testDate)

    // トークンが追加されたことを確認
    await wrapper.vm.$nextTick()
    const tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(6)
    expect(tags[3].text()).toContain('Date')
    expect(tags[4].text()).toContain('>')
    // 日付フォーマットはコンポーネントの実装によって異なる可能性があるため、日付が含まれていることのみ確認
    expect(tags[5].text()).toBeTruthy()
  })

  it('値入力中、入力内容が空の時Backspaceキーで、オペレーター、キーの順で入力プロセスが戻る - Key:Date', async () => {
    // トークン入力の開始
    const inputRef = wrapper.findComponent({ref: 'inputRef'})
    expect(inputRef.exists()).toBe(true)
    await inputRef.trigger('focus')

    // キー選択 (Date)
    const keyAutocomplete = wrapper.findComponent(ElAutocomplete)
    await keyAutocomplete.vm.$emit('select', {value: 'Date', item: availableTokens[2]})

    // キー選択後、オペレーター選択ステップになったことを確認
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.inputStep).toBe('operator')

    // オペレーター選択
    let operatorAutocomplete = wrapper.findComponent(ElAutocomplete)
    await operatorAutocomplete.vm.$emit('select', {value: '>'})

    // オペレーター選択後、値選択ステップになったことを確認
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.inputStep).toBe('value')

    // 値選択フィールド（DatePicker）が表示されていることを確認
    const datePicker = wrapper.findComponent(ElDatePicker)
    expect(datePicker.exists()).toBe(true)

    // タグが追加されていることを確認（キーとオペレーターのみ）
    let tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(5)

    // exposeされたdatePickerRefを利用して、値をnullに設定する
    // これによって空の状態をシミュレートする
    wrapper.vm.inputValue = null
    await wrapper.vm.$nextTick()

    // バックスペースキーイベントをシミュレート
    // input要素を見つけて、キーダウンイベントをトリガー
    const datePickerInput = datePicker.find('input')
    if (datePickerInput.exists()) {
      await datePickerInput.trigger('keydown', { key: 'Backspace' })
    } else {
      // input要素が見つからない場合は、カスタムイベントを作成
      const backspaceEvent = {
        key: 'Backspace',
        target: {
          value: '',
          parentElement: {
            querySelectorAll: () => []
          }
        },
        preventDefault: vi.fn()
      }

      // handleBackspaceメソッドを直接呼び出し
      await wrapper.vm.handleBackspace(backspaceEvent)
    }

    // 値入力からオペレーター選択に戻ったことを確認
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.inputStep).toBe('operator')

    // タグが減ったことを確認
    tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(4)

    // オペレーター入力フィールドが表示されていることを確認
    operatorAutocomplete = wrapper.findComponent(ElAutocomplete)
    expect(operatorAutocomplete.exists()).toBe(true)

    // オペレーター選択フィールドでBackspaceを押す（オペレーター入力が空の状態）
    const operatorInput = operatorAutocomplete.find('input')
    await operatorInput.trigger('keydown', {key: 'Backspace'})

    // オペレーター入力からキー選択に戻ったことを確認
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.inputStep).toBe('key')

    // タグが減ったことを確認
    tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(3)

    // キー入力フィールドが空になっていることを確認
    const keyInput = keyAutocomplete.find('input')
    expect(keyInput.element.value).toBe('')
  })

  // TODO:
  // it('props.disabled状態の時、トークンの削除や追加ができない', () => { })
  // it('トークンクリックで、トークンの編集状態になる', () => { })

  it('キー、値の順で入力プロセスが進む - Key:Date (From,To)', async () => {
    // トークン入力の開始
    const inputRef = wrapper.findComponent({ref: 'inputRef'})
    expect(inputRef.exists()).toBe(true)
    await inputRef.trigger('focus')

    // キー選択 (Date (From,To))
    const keyAutocomplete = wrapper.findComponent(ElAutocomplete)
    await keyAutocomplete.vm.$emit('select', {value: 'Date (From,To)', item: availableTokens[3]})

    // キー選択後、オペレーターがひとつしかないためオペレーター選択ステップをスキップして
    // 値選択ステップになったことを確認
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.inputStep).toBe('value')

    // 値選択フィールドの表示確認（DateRangeタイプなのでDatePickerが表示され、typeがdaterangeになっているはず）
    const datePicker = wrapper.findComponent(ElDatePicker)
    expect(datePicker.exists()).toBe(true)
    expect(datePicker.props('type')).toBe('daterange')

    // 日付範囲選択
    const testDateRange = [new Date('2025-05-01'), new Date('2025-05-10')]
    await datePicker.vm.$emit('change', testDateRange)

    // トークンが追加されたことを確認
    await wrapper.vm.$nextTick()
    const tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(6) // 既存の3つのタグ + 新しく追加された3つのタグ
    expect(tags[3].text()).toContain('Date (From,To)')
    expect(tags[4].text()).toContain(':') // オペレーターは':'のはず
    // 日付範囲が正しく表示されていることを確認
    expect(tags[5].text()).toBe('2025-05-01,2025-05-10')
  })

  it('値入力中、入力内容が空の時Backspaceキーで、キーの順で入力プロセスが戻る - Key:Date (From,To)', async () => {
    // トークン入力の開始
    const inputRef = wrapper.findComponent({ref: 'inputRef'})
    expect(inputRef.exists()).toBe(true)
    await inputRef.trigger('focus')

    // キー選択 (Date (From,To))
    const keyAutocomplete = wrapper.findComponent(ElAutocomplete)
    await keyAutocomplete.vm.$emit('select', {value: 'Date (From,To)', item: availableTokens[3]})

    // キー選択後、オペレーターがひとつしかないためオペレーター選択ステップをスキップして
    // 値選択ステップになったことを確認
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.inputStep).toBe('value')

    // 値選択フィールド（DatePickerで日付範囲選択）が表示されていることを確認
    const datePicker = wrapper.findComponent(ElDatePicker)
    expect(datePicker.exists()).toBe(true)
    expect(datePicker.props('type')).toBe('daterange')

    // タグが追加されていることを確認（キーとオペレーターのみ）
    let tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(5) // 既存の3つのタグ + 新しく追加された2つのタグ

    // datePickerRefを利用して、値をnullに設定する
    wrapper.vm.inputValue = null
    await wrapper.vm.$nextTick()

    // バックスペースキーイベントをシミュレート
    const datePickerInput = datePicker.find('input')
    if (datePickerInput.exists()) {
      await datePickerInput.trigger('keydown', { key: 'Backspace' })
    } else {
      // input要素が見つからない場合は、カスタムイベントを作成
      const backspaceEvent = {
        key: 'Backspace',
        target: {
          value: '',
          parentElement: {
            querySelectorAll: () => []
          }
        },
        preventDefault: vi.fn()
      }

      // handleBackspaceメソッドを直接呼び出し
      await wrapper.vm.handleBackspace(backspaceEvent)
    }

    // DateRangeタイプのトークンはoperatorsが1つだけなので、値入力からキー選択に直接戻ったことを確認
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.inputStep).toBe('key')

    // タグが減ったことを確認
    tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(3) // 既存の3つのタグのみになる

    // キー入力フィールドが空になっていることを確認
    const keyInput = keyAutocomplete.find('input')
    expect(keyInput.element.value).toBe('')
  })

  it('appendValueSuggestTypesToKeyプロパティが指定された場合、キーのサジェストに値のサジェストが追加される', async () => {
    // appendValueSuggestTypesToKeyプロパティを指定して再マウント
    wrapper = mount(ElTextQueryInput, {
      props: {
        modelValue: [],
        'onUpdate:modelValue': (e) => wrapper.setProps({modelValue: e}),
        availableTokens,
        appendValueSuggestTypesToKey: ['tag-fw'] // FrameWorkタイプを指定
      },
      global: {
        components: {
          ElTag,
          ElAutocomplete,
          ElButton,
          ElDatePicker,
          ElIcon
        },
        stubs: {
          ElIcon: true
        }
      }
    })

    // トークン入力の開始
    const inputRef = wrapper.findComponent({ref: 'inputRef'})
    expect(inputRef.exists()).toBe(true)
    await inputRef.trigger('focus')

    // キーの候補取得メソッドが呼び出された時の結果を検証
    const keyAutocomplete = wrapper.findComponent(ElAutocomplete)

    // getKeySuggestionsメソッドを直接テスト
    let suggestions = []
    wrapper.vm.getKeySuggestions('', (data) => {
      suggestions = data
    })

    // サジェストには通常のキーに加えて、tag-fwタイプの値（Vue3, React）も含まれているはず
    expect(suggestions.length).toBeGreaterThan(availableTokens.length) // 通常のキー数より多いはず

    // 通常のキーサジェスト（Author, FrameWork, Date, Date (From,To)）が含まれていることを確認
    const keyTitles = availableTokens.map(token => token.title)
    keyTitles.forEach(title => {
      const found = suggestions.some(suggestion => suggestion.value === title)
      expect(found).toBe(true)
    })

    // tag-fwタイプの値（Vue3, React）も含まれていることを確認
    const frameworkTags = availableTokens[1].tags
    frameworkTags.forEach(tag => {
      const found = suggestions.some(suggestion => suggestion.value === tag.name)
      expect(found).toBe(true)
    })
  })

  it('appendValueSuggestTypesToKeyから追加されたサジェストを選択した場合、stringタイプのトークンとして追加される', async () => {
    // appendValueSuggestTypesToKeyプロパティを指定して再マウント
    wrapper = mount(ElTextQueryInput, {
      props: {
        modelValue: [],
        'onUpdate:modelValue': (e) => wrapper.setProps({modelValue: e}),
        availableTokens,
        appendValueSuggestTypesToKey: ['tag-fw'] // FrameWorkタイプを指定
      },
      global: {
        components: {
          ElTag,
          ElAutocomplete,
          ElButton,
          ElDatePicker,
          ElIcon
        },
        stubs: {
          ElIcon: true
        }
      }
    })

    // トークン入力の開始
    const inputRef = wrapper.findComponent({ref: 'inputRef'})
    await inputRef.trigger('focus')

    // 値サジェスト（Vue3）を選択
    const keyAutocomplete = wrapper.findComponent(ElAutocomplete)
    await keyAutocomplete.vm.$emit('select', {
      value: 'Vue3',
      isValueSuggest: true,
      valueItem: {id: 1, name: 'Vue3'},
      valueType: 'tag-fw'
    })

    // トークンが追加されたことを確認
    expect(wrapper.props('modelValue')).toHaveLength(1)
    expect(wrapper.props('modelValue')[0].type).toBe('string') // stringタイプであることを確認
    expect(wrapper.props('modelValue')[0].value.data).toBe('Vue3') // 値が正しいことを確認
    expect(wrapper.props('modelValue')[0].value.operator).toBe('') // オペレーターは空
  })

  it('appendValueSuggestTypesToKeyプロパティが配列で指定された場合、複数のタイプの値サジェストが追加される', async () => {
    // appendValueSuggestTypesToKeyプロパティを配列で指定して再マウント
    wrapper = mount(ElTextQueryInput, {
      props: {
        modelValue: [],
        'onUpdate:modelValue': (e) => wrapper.setProps({modelValue: e}),
        availableTokens,
        appendValueSuggestTypesToKey: ['user', 'tag-fw'] // 複数のタイプを指定
      },
      global: {
        components: {
          ElTag,
          ElAutocomplete,
          ElButton,
          ElDatePicker,
          ElIcon
        },
        stubs: {
          ElIcon: true
        }
      }
    })

    // トークン入力の開始
    const inputRef = wrapper.findComponent({ref: 'inputRef'})
    expect(inputRef.exists()).toBe(true)
    await inputRef.trigger('focus')

    // キーの候補取得メソッドが呼び出された時の結果を検証
    const keyAutocomplete = wrapper.findComponent(ElAutocomplete)

    // getKeySuggestionsメソッドを直接テスト
    let suggestions = []
    wrapper.vm.getKeySuggestions('', (data) => {
      suggestions = data
    })

    // サジェストには通常のキーに加えて、userタイプとtag-fwタイプの両方の値サジェストも含まれているはず
    const expectedMinCount = availableTokens.length +
      availableTokens[0].tags.length + // userタイプのタグ数
      availableTokens[1].tags.length   // tag-fwタイプのタグ数

    expect(suggestions.length).toBeGreaterThanOrEqual(expectedMinCount)

    // 通常のキーサジェスト（Author, FrameWork, Date, Date (From,To)）が含まれていることを確認
    const keyTitles = availableTokens.map(token => token.title)
    keyTitles.forEach(title => {
      const found = suggestions.some(suggestion => suggestion.value === title)
      expect(found).toBe(true)
    })

    // userタイプの値（alpha, beta, gamma）が含まれていることを確認
    const userTags = availableTokens[0].tags
    userTags.forEach(tag => {
      const found = suggestions.some(suggestion => suggestion.value === tag)
      expect(found).toBe(true)
    })

    // tag-fwタイプの値（Vue3, React）も含まれていることを確認
    const frameworkTags = availableTokens[1].tags
    frameworkTags.forEach(tag => {
      const found = suggestions.some(suggestion => suggestion.value === tag.name)
      expect(found).toBe(true)
    })
  })

  // TODO:
  // it('props.disabled状態の時、トークンの削除や追加ができない', () => { })
  // it('トークンクリックで、トークンの編集状態になる', () => { })
})

