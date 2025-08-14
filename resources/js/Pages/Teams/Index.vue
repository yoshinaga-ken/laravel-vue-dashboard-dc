<template>
  <AppLayout title="チーム一覧">
    <template #header>
      <h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
        👥 チーム一覧
      </h2>
    </template>

    <div class="py-12">
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div
          class="overflow-hidden bg-white shadow-xl sm:rounded-lg dark:bg-gray-800"
          data-testid="teams-page-container"
        >
          <!-- フィルター・検索セクション -->
          <div class="px-6 pt-6 sm:px-8" data-testid="teams-filters-section">
            <TeamFiltersComponent
              v-model:filters="currentFilters"
              :result-stats="stats"
              @filters-changed="handleFiltersChanged"
            />
          </div>

          <!-- 結果表示情報 -->
          <TeamResultsInfo
            :pagination="pagination"
            :filters="convertFiltersForResultsInfo(currentFilters)"
            :stats="stats"
            @per-page-changed="handlePerPageChange"
            @filter-removed="handleFilterRemove"
            @all-filters-cleared="clearAllFilters"
          />

          <!-- チーム一覧 -->
          <div
            class="divide-y divide-gray-200 dark:divide-gray-700"
            data-testid="teams-content-area"
          >
            <!-- ローディング状態 -->
            <div v-if="isLoading" class="p-6 text-center" data-testid="teams-loading">
              <ElIcon class="animate-spin text-2xl text-gray-400">
                <Loading />
              </ElIcon>
              <p class="mt-2 text-sm text-gray-500">チームを読み込み中...</p>
            </div>

            <!-- チームが存在しない場合 -->
            <div v-else-if="!teams.length" class="p-6 text-center" data-testid="teams-empty-state">
              <ElIcon class="text-4xl text-gray-400">
                <UserFilled />
              </ElIcon>
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                チームがありません
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                {{
                  currentFilters.search
                    ? '検索条件に一致するチームが見つかりません。'
                    : '最初のチームを作成してみましょう。'
                }}
              </p>
              <div
                v-if="!currentFilters.search && page.props.jetstream.canCreateTeams"
                class="mt-6"
              >
                <ElButton
                  type="primary"
                  data-testid="create-team-button"
                  @click="router.visit(route('teams.create'))"
                >
                  <ElIcon class="mr-2"><Plus /></ElIcon>
                  新しいチームを作成
                </ElButton>
              </div>
            </div>

            <!-- チーム一覧表示 -->
            <div
              v-else-if="teams.length > 0"
              class="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3"
              data-testid="teams-grid"
            >
              <TeamCard
                v-for="team in teams"
                :key="team.id"
                :team="team"
                :current-team-id="page.props.auth.user.current_team_id"
                :data-testid="`team-card-${team.id}`"
                @show-members="handleShowMembers"
                @show-details="handleShowDetails"
                @team-switched="handleTeamSwitched"
              />
            </div>

            <!-- フィルター結果なし -->
            <div
              v-else-if="hasActiveFilters"
              class="py-12 text-center"
              data-testid="teams-no-results"
            >
              <ElIcon class="mb-4 text-6xl text-gray-400">
                <Search />
              </ElIcon>
              <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">No teams found</h3>
              <p class="mb-4 text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria or filters.
              </p>
              <ElButton data-testid="clear-filters-button" @click="clearAllFilters">
                Clear Filters
              </ElButton>
            </div>
          </div>

          <!-- ページネーション -->
          <TeamPagination
            :pagination="pagination"
            :loading="isLoading"
            @page-changed="handlePageChange"
            @per-page-changed="handlePerPageChange"
          />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { router, usePage } from '@inertiajs/vue3'
import { route } from '../../../../vendor/tightenco/ziggy'
import AppLayout from '@/Layouts/AppLayout.vue'
import TeamCard from '@/Components/Teams/TeamCard.vue'
import TeamFiltersComponent from '@/Components/Teams/TeamFilters.vue'
import TeamResultsInfo from '@/Components/Teams/TeamResultsInfo.vue'
import TeamPagination from '@/Components/Teams/TeamPagination.vue'
import { ElInput, ElIcon, ElButton, ElAvatar, ElTag } from 'element-plus'
import {
  Search,
  Loading,
  Plus,
  Check,
  User,
  Clock,
  UserFilled,
  Star,
} from '@element-plus/icons-vue'

// 型定義のインポート
import type { Team, PaginationMeta, TeamFilters, TeamStatsWithPagination } from '@/Types/types-team'

// Props定義
const props = defineProps<{
  teams: Team[]
  pagination: PaginationMeta
  filters: TeamFilters
  stats: TeamStatsWithPagination
}>()

// リアクティブデータ
const isLoading = ref(false)

// TeamFiltersコンポーネント用の型変換
const currentFilters = ref({
  search: props.filters.search || '',
  type: props.filters.type || 'all',
  memberCount: props.filters.member_count || '',
  sortBy: props.filters.sort_by || 'created_desc',
})

// アクティブフィルターがあるかどうか
const hasActiveFilters = computed(() => {
  return !!(
    currentFilters.value.search ||
    (currentFilters.value.type && currentFilters.value.type !== 'all') ||
    currentFilters.value.memberCount ||
    (currentFilters.value.sortBy && currentFilters.value.sortBy !== 'created_desc')
  )
})

// 計算プロパティ
const teams = computed(() => props.teams || [])
const stats = computed(() => props.stats)
const pagination = computed(() => props.pagination)

// Inertia ページプロパティへのアクセス（型安全）
const page = usePage<{
  auth: {
    user: {
      id: number
      current_team_id: number
    }
  }
  jetstream: {
    canCreateTeams: boolean
  }
}>()

// 現在のチームかどうかを判定
const isCurrentTeam = (team: Team): boolean => {
  return team.id === page.props.auth.user.current_team_id
}

// 日付フォーマット
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP')
}

// TeamResultsInfo用のフィルター変換
const convertFiltersForResultsInfo = (filters: any): TeamFilters => {
  return {
    search: filters.search || null,
    type: filters.type || 'all',
    member_count: filters.memberCount || null,
    sort_by: filters.sortBy || 'created_desc',
  }
}

// フィルター変更処理
const handleFiltersChanged = (filters: TeamFilters) => {
  isLoading.value = true

  // URL パラメータ更新
  const params: Record<string, string> = {}

  if (filters.search) params.search = filters.search
  if (filters.type !== 'all') params.type = filters.type
  if (filters.member_count) params.member_count = filters.member_count
  if (filters.sort_by !== 'created_desc') params.sort_by = filters.sort_by

  router.get(route('teams.index'), params, {
    preserveState: true,
    preserveScroll: true,
    onSuccess: () => {
      isLoading.value = false
    },
    onError: () => {
      isLoading.value = false
    },
  })
}

// ページ変更処理
const handlePageChange = (page: number) => {
  isLoading.value = true

  const params: Record<string, string | number> = {}

  if (currentFilters.value.search) params.search = currentFilters.value.search
  if (currentFilters.value.type !== 'all') params.type = currentFilters.value.type
  if (currentFilters.value.memberCount) params.member_count = currentFilters.value.memberCount
  if (currentFilters.value.sortBy !== 'created_desc') params.sort_by = currentFilters.value.sortBy

  params.page = page
  params.per_page = pagination.value.per_page

  router.visit(route('teams.index'), {
    data: params,
    preserveState: true,
    preserveScroll: true,
    onSuccess: () => {
      isLoading.value = false
    },
    onError: () => {
      isLoading.value = false
    },
  })
}

// 件数変更処理
const handlePerPageChange = (perPage: number) => {
  isLoading.value = true

  const params: Record<string, string | number> = {}

  if (currentFilters.value.search) params.search = currentFilters.value.search
  if (currentFilters.value.type !== 'all') params.type = currentFilters.value.type
  if (currentFilters.value.memberCount) params.member_count = currentFilters.value.memberCount
  if (currentFilters.value.sortBy !== 'created_desc') params.sort_by = currentFilters.value.sortBy

  params.page = 1 // ページを1にリセット
  params.per_page = perPage

  router.visit(route('teams.index'), {
    data: params,
    preserveState: true,
    onSuccess: () => {
      isLoading.value = false
    },
    onError: () => {
      isLoading.value = false
    },
  })
}

// フィルター削除処理
const handleFilterRemove = (filterKey: string) => {
  const newFilters = { ...currentFilters.value }

  switch (filterKey) {
    case 'search':
      newFilters.search = ''
      break
    case 'type':
      newFilters.type = 'all'
      break
    case 'member_count':
      newFilters.memberCount = ''
      break
    case 'sort_by':
      newFilters.sortBy = 'created_desc'
      break
  }

  currentFilters.value = newFilters

  // 標準形式に変換してAPI呼び出し
  const standardFilters: TeamFilters = {
    search: newFilters.search || null,
    type: newFilters.type as any,
    member_count: newFilters.memberCount || null,
    sort_by: newFilters.sortBy as any,
  }
  handleFiltersChanged(standardFilters)
}

// 全フィルタークリア
const clearAllFilters = () => {
  currentFilters.value = {
    search: '',
    type: 'all',
    memberCount: '',
    sortBy: 'created_desc',
  }

  const standardFilters: TeamFilters = {
    search: null,
    type: 'all',
    member_count: null,
    sort_by: 'created_desc',
  }
  handleFiltersChanged(standardFilters)
}

// チーム切り替え
const switchToTeam = (team: Team): void => {
  router.put(
    route('current-team.update'),
    {
      team_id: team.id,
    },
    {
      preserveState: false,
    }
  )
}

// 新しいイベントハンドラー
const handleShowMembers = (team: Team) => {
  // 将来の実装: メンバー詳細モーダル表示
  console.log('Show members for team:', team.id)
}

const handleShowDetails = (team: Team) => {
  // 将来の実装: チーム詳細モーダル表示
  console.log('Show details for team:', team.id)
}

const handleTeamSwitched = (team: Team) => {
  // チーム切り替え後の処理
  router.reload()
}

// マウント時の処理
onMounted(() => {
  // 必要に応じて初期化処理を追加
})
</script>

<style scoped>
/* 必要に応じてスタイルを追加 */
</style>
