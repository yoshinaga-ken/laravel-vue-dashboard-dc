<script lang="ts" setup>
  import { ref, computed, watch } from 'vue'
  import { ElButton, ElIcon, ElMessage } from 'element-plus'
  import { Plus, Check, Edit, UserFilled } from '@element-plus/icons-vue'
  import { useForm, Link } from '@inertiajs/vue3'
  import { useRoute } from '@/Composables/useRoute'
  import { useQuery } from '@vue/apollo-composable'
  import { GET_CURRENT_USER_FOLLOWING } from '@/Graphql/queries/GetCurrentUserFollowing'
  import axios from '@/Utils/axios.js'
  import type { User } from '@/Types/types-graphql'

  const props = defineProps<{
    targetUser: User
    isOwnProfile: boolean
    loading?: boolean
  }>()

  const emit = defineEmits<{
    'follow-success': [user: User]
    'unfollow-success': [user: User]
  }>()

  const { route } = useRoute()
  const form = useForm({})
  const isFollowing = ref(false)

  // ログインユーザーのフォローリストを取得
  const {
    result: currentUserResult,
    loading: followingLoading,
    refetch: refetchFollowing,
  } = useQuery(
    GET_CURRENT_USER_FOLLOWING,
    {},
    {
      skip: props.isOwnProfile, // 自分のプロフィールの場合は取得不要
      fetchPolicy: 'cache-and-network',
    }
  )

  // フォロー状態を初期化・更新する関数
  const updateFollowState = () => {
    if (props.isOwnProfile || !currentUserResult.value?.loginUser?.following?.data) {
      isFollowing.value = false
      return
    }

    const followingList = currentUserResult.value.loginUser.following.data
    isFollowing.value = followingList.some((user: User) => user.id === props.targetUser.id)
  }

  // GraphQLクエリ結果の変更を監視
  watch(
    () => currentUserResult.value,
    () => {
      updateFollowState()
    },
    { immediate: true }
  )

  // targetUserの変更を監視
  watch(
    () => props.targetUser.id,
    () => {
      updateFollowState()
    }
  )

  const handleFollowToggle = async () => {
    try {
      form.processing = true

      // Articles/Index.vueと同じ実装方式を使用
      await axios[isFollowing.value ? 'delete' : 'put'](
        route(isFollowing.value ? 'api.users.unfollow' : 'api.users.follow', {
          id: props.targetUser.id,
        })
      )

      // フォロー状態を更新
      isFollowing.value = !isFollowing.value

      // GraphQLキャッシュを更新
      if (!props.isOwnProfile) {
        await refetchFollowing()
      }

      // 成功メッセージ表示
      const message = isFollowing.value ? 'フォローしました' : 'フォローを解除しました'
      ElMessage.success(message)

      // 親コンポーネントに結果を通知
      if (isFollowing.value) {
        emit('follow-success', props.targetUser)
      } else {
        emit('unfollow-success', props.targetUser)
      }
    } catch (error) {
      console.error('Follow toggle failed:', error)
      ElMessage.error('操作に失敗しました')
    } finally {
      form.processing = false
    }
  }

  const followButtonText = computed(() => {
    return isFollowing.value ? 'フォロー中' : 'フォローする'
  })

  const followButtonType = computed(() => {
    return isFollowing.value ? 'success' : 'primary'
  })

  const followButtonIcon = computed(() => {
    return isFollowing.value ? Check : Plus
  })

  const followButtonTitle = computed(() => {
    return isFollowing.value ? 'フォローを解除する' : 'フォローする'
  })
</script>

<template>
  <div class="user-action-buttons">
    <div v-if="loading" class="flex justify-center">
      <div class="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="flex flex-col gap-3 sm:flex-row">
      <!-- 自分のプロフィールの場合 -->
      <template v-if="isOwnProfile">
        <Link
          :href="route('users.edit', targetUser.id)"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors duration-150 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <ElIcon class="mr-2">
            <Edit />
          </ElIcon>
          プロフィールを編集
        </Link>
      </template>

      <!-- 他のユーザーのプロフィールの場合 -->
      <template v-else>
        <!-- フォロー/アンフォローボタン -->
        <ElButton
          :type="followButtonType"
          :loading="form.processing"
          :title="followButtonTitle"
          size="large"
          class="min-w-36 flex-1 sm:flex-none"
          @click="handleFollowToggle"
        >
          <ElIcon v-if="!form.processing" class="mr-2">
            <component :is="followButtonIcon" />
          </ElIcon>
          {{ followButtonText }}
        </ElButton>

        <!-- メッセージボタン（将来的な拡張） -->
        <ElButton type="info" plain size="large" class="flex-1 sm:flex-none" disabled>
          <ElIcon class="mr-2">
            <UserFilled />
          </ElIcon>
          メッセージ
        </ElButton>
      </template>
    </div>

    <!-- 補助情報 -->
    <div v-if="!isOwnProfile && !loading" class="mt-3 text-center">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        <template v-if="isFollowing"> このユーザーをフォローしています </template>
        <template v-else> フォローして最新情報を受け取る </template>
      </p>
    </div>
  </div>
</template>

<style scoped>
  .user-action-buttons {
    width: 100%;
  }

  .user-action-buttons :deep(.el-button) {
    font-weight: 500;
  }

  .user-action-buttons :deep(.el-button--large) {
    padding: 0.75rem 1.5rem;
  }

  /* フォローボタンのホバーエフェクト */
  .user-action-buttons :deep(.el-button--success:hover) {
    border-color: #ef4444;
    background-color: #ef4444;
  }

  .user-action-buttons :deep(.el-button--success:hover .el-icon) {
    transform: rotate(45deg);
  }

  /* ボタンの幅調整 */
  @media (min-width: 640px) {
    .user-action-buttons .el-button {
      min-width: max-content;
    }
  }

  /* ローディング状態のスタイル */
  .user-action-buttons :deep(.el-button.is-loading) {
    opacity: 0.75;
  }
</style>
