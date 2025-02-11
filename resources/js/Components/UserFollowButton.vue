<script setup>
import {computed} from "vue";

const props = defineProps({
  user: Object,
  disabled: Boolean,
  isFollowersUserList: Boolean,
  isFollowingUserList: Boolean,
});
const emit = defineEmits(['click'])

const followersUserNames = computed(() => props.user?.followers?.map((user) => user.name) || []);
const followingUserNames = computed(() => props.user?.following?.map((user) => user.name) || []);

const title = computed(() => {
  const msg = props.user.is_followed_by ? 'Unfollow' : 'Follow';
  const followersUserNamesCount = followersUserNames.value.length;
  const followingUserNamesCount = followingUserNames.value.length;
  return msg + ' User\n\n' +
    `followers(${followersUserNamesCount}):` + followersUserNames.value.join(', ') + '\n' +
    `following(${followingUserNamesCount}):` + followingUserNames.value.join(', ');
});

</script>

<template>
  <button @click="emit('click', user)"
          :title="title"
          class="rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          :class="[ user.is_followed_by ? 'bg-red-200' : 'bg-gray-200', disabled ? 'opacity-50' : 'opacity-100' ]"
          :disabled="disabled">
    <v-icon icon="mdi-account-plus"
            class="text-pink-500 mr-1"
            :class="{'animate__heartBeat':user.is_followed_by}"/>
  </button>

  <div class="grid grid-cols-2">
    <div v-if="isFollowersUserList">
      <div>
        <span class="font-bold">{{ followersUserNames.length }}</span> followers
      </div>
      <ul v-for="(name, index) in followersUserNames" :key="index">
        <li>{{ name }}</li>
      </ul>
    </div>
    <div v-if="isFollowingUserList">
      <div>
        <span class="font-bold">{{ followingUserNames.length }}</span> following
      </div>
      <ul v-for="(name, index) in followingUserNames" :key="index">
        <li>{{ name }}</li>
      </ul>
    </div>
  </div>
</template>
