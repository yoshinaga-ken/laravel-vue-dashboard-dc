import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils';
import YoutubeVidInput from '@/Components/YoutubeVidInput.vue';
import {ref} from "vue";

describe('YoutubeVidInput.vue', () => {

  it('create', async () => {
    const videoId = ref('1234567890A');
    const wrapper = mount(YoutubeVidInput, {
      props: {
        modelValue: videoId.value,
      }
    })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('renders input element', () => {
    const wrapper = mount(YoutubeVidInput);
    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
  });

  it('updates videoId on input', async () => {
    const wrapper = mount(YoutubeVidInput);
    const input = wrapper.find('input');
    await input.setValue('https://www.youtube.com/watch?v=O1SXRC8-xoc');
    expect(wrapper.vm.videoId).toBe('O1SXRC8-xoc');
  });

  it('expands input width on focus', async () => {
    const wrapper = mount(YoutubeVidInput);
    const input = wrapper.find('input');
    await input.trigger('focus');
    expect(input.element.style.width).toBe('32em');
  });

  it('shrinks input width on blur', async () => {
    const wrapper = mount(YoutubeVidInput);
    const input = wrapper.find('input');
    await input.trigger('focus');
    await input.trigger('blur');
    expect(input.element.style.width).toBe('4em');
  });

  // modelValueがinputにより変更されたらIDのみにする - URLタイプ
  it('extracts video ID from URL', async () => {
    const wrapper = mount(YoutubeVidInput);
    const input = wrapper.find('input');
    await input.setValue('https://www.youtube.com/watch?v=O1SXRC8-xoc');
    expect(wrapper.vm.videoId).toBe('O1SXRC8-xoc');
  });

  // modelValueがinputにより変更されたらIDのみにする - videoIDタイプ
  it('keeps video ID if directly inputted - not url', async () => {
    const wrapper = mount(YoutubeVidInput);
    const input = wrapper.find('input');
    await input.setValue('O1SXRC8-xoc');
    expect(wrapper.vm.videoId).toBe('O1SXRC8-xoc');
  });

  // modelValueが変更されたらvideoIdのみにする - URLタイプ
  it('updates videoId when modelValue changes - url', async () => {
    const videoId = ref('1234567890A');
    const wrapper = mount(YoutubeVidInput, {
      props: {
        modelValue: videoId.value,
      }
    });
    expect(wrapper.vm.videoId).toBe('1234567890A');
    await wrapper.setProps({modelValue: 'https://www.youtube.com/watch?v=O1SXRC8-xoc'});
    expect(wrapper.vm.videoId).toBe('O1SXRC8-xoc');
  });

  // modelValueが変更されたらvideoIdのみにする - videoIDタイプ
  it('updates videoId when modelValue changes - not url', async () => {
    const videoId = ref('1234567890A');
    const wrapper = mount(YoutubeVidInput, {
      props: {
        modelValue: videoId.value,
      }
    });
    expect(wrapper.vm.videoId).toBe('1234567890A');
    await wrapper.setProps({modelValue: 'O1SXRC8-xoc'});
    expect(wrapper.vm.videoId).toBe('O1SXRC8-xoc');
  });
});
