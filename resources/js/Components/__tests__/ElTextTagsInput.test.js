import {mount} from '@vue/test-utils'
import {describe, it, expect, vi, beforeEach} from 'vitest'
import ElTextTagsInput from '@/Components/ElTextTagsInput.vue'
import {ElTag, ElInput, ElButton, ElAutocomplete} from 'element-plus'

vi.mock('@vue/apollo-composable', () => ({
  useQuery: () => ({
    result: {
      value: {
        searchTags: [
          {name: 'vue'},
          {name: 'react'},
          {name: 'angular'}
        ]
      }
    }
  })
}))

describe('ElTextTagsInput', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ElTextTagsInput, {
      props: {
        modelValue: ['vue'],
        'onUpdate:modelValue': (e) => wrapper.setProps({modelValue: e})
      },
      global: {
        components: {
          ElTag,
          ElInput,
          ElButton,
          ElAutocomplete
        }
      }
    })
  })

  it('初期状態で既存のタグが表示される', () => {
    const tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(1)
    expect(tags[0].text()).toBe('vue')
  })

  it('新規タグ追加ボタンがクリックされると入力フィールドが表示され、タグ入力後エンターキーでタグが追加される', async () => {
    const addButton = wrapper.findComponent(ElButton)
    await addButton.trigger('click')

    // 入力フィールドの表示確認
    expect(wrapper.findComponent(ElAutocomplete).exists()).toBe(true)
    expect(wrapper.findComponent(ElButton).exists()).toBe(false)

    // タグ入力とエンターキー押下
    const autocomplete = wrapper.findComponent(ElAutocomplete)
    await autocomplete.setValue('test-tag')
    await autocomplete.find('input').trigger('keyup.enter')

    // タグが追加されたことを確認
    const tags = wrapper.findAllComponents(ElTag)
    expect(tags).toHaveLength(2) // 既存の'vue'と新規追加の'test-tag'
    expect(tags[1].text()).toBe('test-tag')

    // 入力フィールドが非表示になることを確認
    expect(wrapper.findComponent(ElAutocomplete).exists()).toBe(false)
    expect(wrapper.findComponent(ElButton).exists()).toBe(true)
  })

  it('タグが削除できる', async () => {
    const closeButton = wrapper.findComponent(ElTag).find('.el-tag__close')
    await closeButton.trigger('click')

    expect(wrapper.findAllComponents(ElTag)).toHaveLength(0)
  })

  it('disabled状態の時、タグの削除や追加ができない', () => {
    const disabledWrapper = mount(ElTextTagsInput, {
      props: {
        modelValue: ['vue'],
        disabled: true
      },
      global: {
        components: {
          ElTag,
          ElInput,
          ElButton,
          ElAutocomplete
        }
      }
    })

    expect(disabledWrapper.findComponent(ElButton).exists()).toBe(false)
    expect(disabledWrapper.findComponent(ElTag).props('closable')).toBe(false)
  })

  it('オートコンプリートの検索が正しく動作する', async () => {
    const addButton = wrapper.findComponent(ElButton)
    await addButton.trigger('click')

    const autocomplete = wrapper.findComponent(ElAutocomplete)
    await autocomplete.setValue('re')

    const suggestions = await wrapper.vm.querySearch('re', (results) => {
      expect(results).toHaveLength(1)
      expect(results[0].value).toBe('react')
    })
  })
})
