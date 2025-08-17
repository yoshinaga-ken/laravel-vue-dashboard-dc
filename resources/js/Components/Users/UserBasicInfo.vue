<script lang="ts" setup>
import { computed } from 'vue'
import { ElAvatar, ElCard, ElDivider } from 'element-plus'
import type { User } from '@/Types/types-graphql'

const props = defineProps<{
  user: User
  loading?: boolean
}>()

const formattedCreatedAt = computed(() => {
  if (!props.user?.created_at) return ''
  return new Date(props.user.created_at).toLocaleDateString('ja-JP')
})

const formattedUpdatedAt = computed(() => {
  if (!props.user?.updated_at) return ''
  return new Date(props.user.updated_at).toLocaleDateString('ja-JP')
})

const avatarFallback = computed(() => {
  if (!props.user?.name) return ''
  return props.user.name.charAt(0).toUpperCase()
})
</script>

<template>
  <ElCard class="user-basic-info" shadow="hover">
    <template #header>
      <div class="flex items-center">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">基本情報</h3>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="user" class="space-y-6">
      <!-- プロフィール写真とメイン情報 -->
      <div class="flex items-center space-x-4">
        <ElAvatar
          :size="80"
          :src="user.profile_photo_url || undefined"
          :alt="user.name"
          class="ring-2 ring-gray-200 dark:ring-gray-700"
        >
          <span class="text-2xl font-bold text-gray-600 dark:text-gray-300">
            {{ avatarFallback }}
          </span>
        </ElAvatar>

        <div class="min-w-0 flex-1">
          <h2 class="truncate text-2xl font-bold text-gray-900 dark:text-white">
            {{ user.name }}
          </h2>
          <p class="truncate text-sm text-gray-600 dark:text-gray-400">
            {{ user.email }}
          </p>
        </div>
      </div>

      <ElDivider class="my-4" />

      <!-- 詳細情報 -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="space-y-3">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">ユーザーID</dt>
            <dd class="text-sm text-gray-900 dark:text-white">
              {{ user.id }}
            </dd>
          </div>

          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">登録日</dt>
            <dd class="text-sm text-gray-900 dark:text-white">
              {{ formattedCreatedAt }}
            </dd>
          </div>
        </div>

        <div class="space-y-3">
          <div v-if="user.current_team_id">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">現在のチームID</dt>
            <dd class="text-sm text-gray-900 dark:text-white">
              {{ user.current_team_id }}
            </dd>
          </div>

          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">最終更新日</dt>
            <dd class="text-sm text-gray-900 dark:text-white">
              {{ formattedUpdatedAt }}
            </dd>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="py-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">ユーザー情報を読み込めませんでした</p>
    </div>
  </ElCard>
</template>

<style scoped>
.user-basic-info {
  @apply w-full;
}

.user-basic-info :deep(.el-card__header) {
  @apply border-b border-gray-200 dark:border-gray-700;
}

.user-basic-info :deep(.el-card__body) {
  @apply p-6;
}

.user-basic-info :deep(.el-divider) {
  @apply border-gray-200 dark:border-gray-700;
}
</style>
