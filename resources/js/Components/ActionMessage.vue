<script setup>
defineProps({
  on: Boolean,
  fadeIn: {
    type: Boolean,
    default: false,
  },
  fadeOut: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div>
    <transition
      :enter-active-class="fadeIn ? 'transition ease-out duration-1000' : ''"
      :enter-from-class="fadeIn ? 'opacity-0' : ''"
      :enter-to-class="fadeIn ? 'opacity-100' : ''"
      :leave-active-class="fadeOut ? 'transition ease-out duration-1000' : ''"
      :leave-from-class="fadeOut ? 'opacity-100' : ''"
      :leave-to-class="fadeOut ? 'opacity-0' : ''"
    >
      <div v-show="on" class="text-sm text-gray-600 dark:text-gray-400">
        <slot/>
      </div>
    </transition>
  </div>
</template>
