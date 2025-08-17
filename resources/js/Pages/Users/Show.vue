<script lang="ts" setup>
import { computed } from 'vue'
import { router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import UserBasicInfo from '@/Components/Users/UserBasicInfo.vue'
import UserFollowInfo from '@/Components/Users/UserFollowInfo.vue'
import UserArticlesList from '@/Components/Users/UserArticlesList.vue'
import UserTeamsInfo from '@/Components/Users/UserTeamsInfo.vue'
import UserActionButtons from '@/Components/Users/UserActionButtons.vue'
import { useUserProfile } from '@/Composables/useUserProfile'
import { ElRow, ElCol, ElAlert } from 'element-plus'
import type { User } from '@/Types/types-graphql'

const props = defineProps<{
  userId: number
}>()

const {
  user,
  loading,
  error,
  isOwnProfile,
  followersCount,
  followingCount,
  articlesCount,
  latestArticles,
  followersList,
  followingList,
  ownedTeamsList,
  joinedTeamsList,
  refetch,
} = useUserProfile(props.userId)

// ページタイトルの動的生成
const pageTitle = computed(() => {
  if (loading.value) return 'ユーザープロフィール'
  if (user.value) return `${user.value.name} - プロフィール`
  return 'ユーザーが見つかりません'
})

// エラーメッセージの生成
const errorMessage = computed(() => {
  if (!error.value) return ''

  if (error.value.networkError) {
    return 'ネットワークエラーが発生しました。しばらく待ってから再度お試しください。'
  }

  if (error.value.graphQLErrors?.length > 0) {
    const firstError = error.value.graphQLErrors[0]
    if (firstError.extensions?.category === 'authorization') {
      return 'このユーザーの情報を表示する権限がありません。'
    }
    return firstError.message || '予期しないエラーが発生しました。'
  }

  return '予期しないエラーが発生しました。'
})

// イベントハンドラー
const handleArticleClick = (articleId: string) => {
  // 記事詳細ページへの遷移

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const articleUrl = (window as any).route('articles.show', { article: articleId })

  router.visit(articleUrl)
}

const handleTagClick = (tagName: string) => {
  // タグ検索ページへの遷移

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const articlesUrl = (window as any).route('articles.index', { tags: [tagName] })

  router.visit(articlesUrl)
}

const handleViewAllArticles = () => {
  // ユーザー記事一覧ページへの遷移

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const articlesUrl = (window as any).route('articles.index', { user_id: props.userId })

  router.visit(articlesUrl)
}

const handleTeamClick = (teamId: string) => {
  // チーム詳細ページへの遷移

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const teamUrl = (window as any).route('teams.show', { team: teamId })

  router.visit(teamUrl)
}

const handleFollowSuccess = (_targetUser: User) => {
  // データ再取得
  refetch()
}

const handleUnfollowSuccess = (_targetUser: User) => {
  // データ再取得
  refetch()
}

const handleRetry = () => {
  refetch()
}
</script>

<template>
  <AppLayout :title="pageTitle">
    <template #header>
      <h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
        {{ pageTitle }}
      </h2>
    </template>

    <div class="py-12">
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <!-- エラー表示 -->
        <div v-if="error && !loading" class="mb-6">
          <ElAlert :title="errorMessage" type="error" show-icon :closable="false">
            <template #default>
              <p class="mt-2 text-sm">問題が解決しない場合は、管理者にお問い合わせください。</p>
              <div class="mt-4">
                <button
                  @click="handleRetry"
                  class="rounded bg-red-100 px-3 py-1 text-sm text-red-800 transition-colors hover:bg-red-200"
                >
                  再試行
                </button>
              </div>
            </template>
          </ElAlert>
        </div>

        <!-- メインコンテンツ -->
        <div v-if="!error || loading" class="space-y-6">
          <!-- 上部セクション: 基本情報 + アクションボタン -->
          <ElRow :gutter="24">
            <ElCol :xs="24" :lg="16">
              <UserBasicInfo v-if="user" :user="user" :loading="loading" />
            </ElCol>
            <ElCol :xs="24" :lg="8">
              <div class="flex h-full flex-col justify-center">
                <UserActionButtons
                  v-if="user"
                  :target-user="user"
                  :is-own-profile="isOwnProfile"
                  :loading="loading"
                  @follow-success="handleFollowSuccess"
                  @unfollow-success="handleUnfollowSuccess"
                />
              </div>
            </ElCol>
          </ElRow>

          <!-- 中部セクション: フォロー情報 -->
          <ElRow :gutter="24">
            <ElCol :xs="24">
              <UserFollowInfo
                :followers-count="followersCount"
                :following-count="followingCount"
                :followers-list="followersList"
                :following-list="followingList"
                :loading="loading"
              />
            </ElCol>
          </ElRow>

          <!-- 下部セクション: 記事 + チーム -->
          <ElRow :gutter="24">
            <ElCol :xs="24" :lg="14">
              <UserArticlesList
                :articles-count="articlesCount"
                :articles="latestArticles"
                :loading="loading"
                @article-click="handleArticleClick"
                @tag-click="handleTagClick"
                @view-all-click="handleViewAllArticles"
              />
            </ElCol>
            <ElCol :xs="24" :lg="10">
              <UserTeamsInfo
                :owned-teams="ownedTeamsList"
                :joined-teams="joinedTeamsList"
                :current-team-id="user?.current_team_id"
                :loading="loading"
                @team-click="handleTeamClick"
              />
            </ElCol>
          </ElRow>
        </div>

        <!-- ローディング表示（データがない場合） -->
        <div v-if="loading && !user" class="flex justify-center py-12">
          <div class="text-center">
            <div
              class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"
            ></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">ユーザー情報を読み込んでいます...</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
/* レスポンシブ調整 */
@media (max-width: 1023px) {
  .py-12 {
    @apply py-6;
  }
}

/* カードの高さ統一 */
.h-full {
  @apply min-h-full;
}

/* エラー表示のスタイル調整 */
:deep(.el-alert) {
  @apply rounded-lg;
}

:deep(.el-alert__content) {
  @apply w-full;
}

/* グリッドレイアウトの調整 */
.el-col {
  @apply mb-6 lg:mb-0;
}

.el-col:last-child {
  @apply mb-0;
}

/* モバイル表示の最適化 */
@media (max-width: 640px) {
  .mx-auto {
    @apply px-4;
  }

  .space-y-6 > * + * {
    @apply mt-4;
  }
}
</style>
