<script setup>
import {computed} from "vue";

const props = defineProps({
  article: Object,
  disabled: Boolean,
  isUserList: Boolean
});
const emit = defineEmits(['click'])

const likeUserNames = computed(() => {
  return props.article?.likes?.map((like) => like.name);
});

</script>

<template>
  <button @click="emit('click', article)"
          :title="likeUserNames"
          class="rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          :class="[ article.is_liked_by ? 'bg-red-200' : 'bg-gray-200', disabled ? 'opacity-50' : 'opacity-100' ]"
          :disabled="disabled">
    <div class="text-pink-500 fas fa-heart mr-1 inline-block"
    >❤
    </div>
    {{ article.likes?.length }}
  </button>

  <template v-if="isUserList">
    <div v-for="(name, index) in likeUserNames" :key="index">
      {{ name }}
    </div>
  </template>
</template>
