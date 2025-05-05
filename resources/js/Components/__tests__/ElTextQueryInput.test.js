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
      title: 'CreateAt',
      tags: 'DatePicker',
      operators: ['>', '<'],
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

  it('キー、オペレーター、値の順で入力プロセスが進む', async () => {
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

  it('値入力中、入力内容が空の時Backspaceキーで、オペレーター、キーの順で入力プロセスが戻る', async () => {
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
})
