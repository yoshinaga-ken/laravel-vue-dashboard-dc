import {mount} from '@vue/test-utils'
import {describe, it, expect, vi, beforeEach} from 'vitest'
import VfTextTagsInput from '@/Components/VfTextTagsInput.vue'

// GraphQL のモック
vi.mock('@vue/apollo-composable', () => ({
  useQuery: () => ({
    result: {
      value: {
        tags: {
          data: [
            {name: 'vue'},
            {name: 'react'},
            {name: 'angular'}
          ]
        }
      }
    }
  })
}))

describe('VfTextTagsInput', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(VfTextTagsInput, {
      props: {
        modelValue: ['vue'],
        'onUpdate:modelValue': (e) => wrapper.setProps({modelValue: e})
      },
      global: {
        stubs: {
          'v-autocomplete': {
            template: `
              <div>
                <input
                  :value="search"
                  @input="$emit('update:search', $event.target.value)"
                  @keyup.enter="$emit('keyup:enter')"
                />
              </div>
            `,
            props: ['modelValue', 'search', 'items', 'chips', 'multiple', 'closable-chips', 'clearable', 'placeholder', 'disabled', 'variant']
          }
        }
      }
    })
  })

  it('初期状態で既存のタグが表示される', () => {
    expect(wrapper.vm.selectedTags).toEqual(['vue'])
  })

  it('新しいタグを入力してエンターキーを押すとタグが追加される', async () => {
    const input = wrapper.find('input')
    await input.setValue('test-tag')
    await input.trigger('keyup.enter')

    expect(wrapper.vm.selectedTags).toContain('test-tag')
  })

  it('既に存在するタグは重複して追加されない', async () => {
    const input = wrapper.find('input')
    await input.setValue('vue')
    await input.trigger('keyup.enter')

    expect(wrapper.vm.selectedTags.filter(tag => tag === 'vue')).toHaveLength(1)
  })

  it('GraphQLクエリの結果が利用可能なタグとして表示される', () => {
    expect(wrapper.vm.availableTags).toEqual(['vue', 'react', 'angular'])
  })

  it('入力が確定されると入力フィールドがクリアされる', async () => {
    const input = wrapper.find('input')
    await input.setValue('test-tag')
    await input.trigger('keyup.enter')

    expect(wrapper.vm.inputValue).toBe('')
  })
})
