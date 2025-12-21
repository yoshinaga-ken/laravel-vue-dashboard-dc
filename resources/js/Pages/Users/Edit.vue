<script lang="ts" setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import type { User } from '@/Types/types-graphql'
import { useUserProfile } from '@/Composables/useUserProfile'
import UpdateUserProfileForm from '@/Components/Users/UpdateUserProfileForm.vue'
import UserArticlesListForm from '@/Components/Users/UserArticlesListForm.vue'

const props = defineProps<{
  userId: number
}>()

const { user, error } = useUserProfile(props.userId)

const handleUserUpdated = (updatedUser: User) => {
  // ユーザー情報が更新されたときの処理
  console.log('User updated:', updatedUser)
}
</script>

<template>
  <AppLayout :title="`${user?.name || 'User'} Profile Edit`">
    <template #header>
      <h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
        ユーザープロフィール編集
      </h2>
    </template>

    <div class="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
      <div
        v-if="error"
        class="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400"
      >
        <p>エラーが発生しました: {{ error.message || '不明なエラー' }}</p>
      </div>

      <div v-else>
        <!-- プロフィール情報編集 -->
        <div class="mb-6 overflow-hidden bg-white p-6 shadow-xl sm:rounded-lg dark:bg-gray-800">
          <UpdateUserProfileForm :user-id="userId" @updated="handleUserUpdated" />
        </div>

        <div class="overflow-hidden bg-white p-6 shadow-xl sm:rounded-lg dark:bg-gray-800">
          <UserArticlesListForm :user-id="userId" />
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div>🙋‍♂️ user 情報</div>
          <pre class="text-sm">{{ JSON.stringify(user, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
