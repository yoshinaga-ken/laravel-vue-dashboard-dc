<script lang="ts" setup>
import { ref } from 'vue'
import { ElCard, ElButton, ElAvatar, ElCollapse, ElCollapseItem, ElIcon } from 'element-plus'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import type { User } from '@/Types/types-graphql'

defineProps<{
  followersCount: number
  followingCount: number
  followersList: User[]
  followingList: User[]
  loading?: boolean
}>()

const followersExpanded = ref<string[]>([])
const followingExpanded = ref<string[]>([])

const toggleFollowers = () => {
  followersExpanded.value = followersExpanded.value.includes('followers') ? [] : ['followers']
}

const toggleFollowing = () => {
  followingExpanded.value = followingExpanded.value.includes('following') ? [] : ['following']
}

const getDisplayName = (user: User) => {
  return user.name || 'Unknown User'
}
</script>

<template>
  <ElCard class="user-follow-info" shadow="hover">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">フォロー情報</h3>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="space-y-6">
      <!-- フォロー統計 -->
      <div class="grid grid-cols-2 gap-4">
        <div class="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ followersCount }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">フォロワー</div>
        </div>

        <div class="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ followingCount }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">フォロー中</div>
        </div>
      </div>

      <!-- フォロワー詳細 -->
      <div class="space-y-3">
        <ElButton
          @click="toggleFollowers"
          text
          class="w-full justify-between p-0"
          :disabled="followersCount === 0"
        >
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            フォロワー一覧 ({{ followersCount }})
          </span>
          <ElIcon v-if="followersCount > 0">
            <ArrowDown v-if="!followersExpanded.includes('followers')" />
            <ArrowUp v-else />
          </ElIcon>
        </ElButton>

        <ElCollapse v-model="followersExpanded" class="followers-collapse">
          <ElCollapseItem name="followers">
            <div v-if="followersList.length > 0" class="max-h-60 space-y-2 overflow-y-auto">
              <div
                v-for="follower in followersList"
                :key="follower.id"
                class="flex items-center space-x-3 rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ElAvatar
                  :size="32"
                  :src="follower.profile_photo_url || undefined"
                  :alt="getDisplayName(follower)"
                >
                  <span class="text-xs font-bold text-gray-600 dark:text-gray-300">
                    {{ getDisplayName(follower).charAt(0).toUpperCase() }}
                  </span>
                </ElAvatar>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {{ getDisplayName(follower) }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="py-4 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">フォロワーはいません</p>
            </div>
          </ElCollapseItem>
        </ElCollapse>
      </div>

      <!-- フォロー中詳細 -->
      <div class="space-y-3">
        <ElButton
          @click="toggleFollowing"
          text
          class="w-full justify-between p-0"
          :disabled="followingCount === 0"
        >
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            フォロー中一覧 ({{ followingCount }})
          </span>
          <ElIcon v-if="followingCount > 0">
            <ArrowDown v-if="!followingExpanded.includes('following')" />
            <ArrowUp v-else />
          </ElIcon>
        </ElButton>

        <ElCollapse v-model="followingExpanded" class="following-collapse">
          <ElCollapseItem name="following">
            <div v-if="followingList.length > 0" class="max-h-60 space-y-2 overflow-y-auto">
              <div
                v-for="following in followingList"
                :key="following.id"
                class="flex items-center space-x-3 rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ElAvatar
                  :size="32"
                  :src="following.profile_photo_url || undefined"
                  :alt="getDisplayName(following)"
                >
                  <span class="text-xs font-bold text-gray-600 dark:text-gray-300">
                    {{ getDisplayName(following).charAt(0).toUpperCase() }}
                  </span>
                </ElAvatar>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {{ getDisplayName(following) }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="py-4 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">フォロー中のユーザーはいません</p>
            </div>
          </ElCollapseItem>
        </ElCollapse>
      </div>
    </div>
  </ElCard>
</template>

<style scoped>
.user-follow-info {
  @apply w-full;
}

.user-follow-info :deep(.el-card__header) {
  @apply border-b border-gray-200 dark:border-gray-700;
}

.user-follow-info :deep(.el-card__body) {
  @apply p-6;
}

.followers-collapse :deep(.el-collapse-item__header),
.following-collapse :deep(.el-collapse-item__header) {
  @apply hidden;
}

.followers-collapse :deep(.el-collapse-item__content),
.following-collapse :deep(.el-collapse-item__content) {
  @apply border-0 p-0;
}

.followers-collapse :deep(.el-collapse-item__wrap),
.following-collapse :deep(.el-collapse-item__wrap) {
  @apply border-0;
}
</style>
