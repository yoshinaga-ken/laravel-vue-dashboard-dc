# TASK-202: フィルタリング・検索機能実装

## 概要

チーム一覧画面にフィルタリング・検索機能を実装する。
チーム名検索、メンバー数フィルター、チームタイプフィルター、並び替え機能を含む。
リアルタイム検索とURL状態同期を実装する。

## 依存関係

- **依存タスク**: TASK-201 (詳細チームカードコンポーネント実装)
- **後続タスク**: TASK-203 (ページネーション機能)

## 実装内容

### 1. 検索・フィルターコンポーネント

**ファイル**: `resources/js/Components/Teams/TeamFilters.vue`

```vue
<template>
  <div
    class="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <!-- 検索入力 -->
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Search Teams
        </label>
        <ElInput
          v-model="localFilters.search"
          placeholder="Search by team name..."
          clearable
          @input="debouncedSearch"
        >
          <template #prefix>
            <ElIcon><Search /></ElIcon>
          </template>
        </ElInput>
      </div>

      <!-- チームタイプフィルター -->
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Team Type
        </label>
        <ElSelect
          v-model="localFilters.type"
          placeholder="All Types"
          clearable
          @change="handleFilterChange"
        >
          <ElOption value="all" label="All Teams" />
          <ElOption value="personal" label="Personal Teams" />
          <ElOption value="shared" label="Shared Teams" />
          <ElOption value="current" label="Current Team" />
        </ElSelect>
      </div>

      <!-- メンバー数フィルター -->
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Members Count
        </label>
        <ElSelect
          v-model="localFilters.memberCount"
          placeholder="Any Size"
          clearable
          @change="handleFilterChange"
        >
          <ElOption value="1" label="1 member" />
          <ElOption value="2-5" label="2-5 members" />
          <ElOption value="6-10" label="6-10 members" />
          <ElOption value="11+" label="11+ members" />
        </ElSelect>
      </div>

      <!-- 並び替え -->
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Sort By
        </label>
        <ElSelect v-model="localFilters.sortBy" @change="handleFilterChange">
          <ElOption value="name_asc" label="Name (A-Z)" />
          <ElOption value="name_desc" label="Name (Z-A)" />
          <ElOption value="created_desc" label="Newest First" />
          <ElOption value="created_asc" label="Oldest First" />
          <ElOption value="members_desc" label="Most Members" />
          <ElOption value="members_asc" label="Least Members" />
        </ElSelect>
      </div>
    </div>

    <!-- アクティブフィルター表示 -->
    <div v-if="hasActiveFilters" class="mt-4 flex items-center space-x-2">
      <span class="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>

      <ElTag v-if="localFilters.search" type="info" closable @close="clearFilter('search')">
        Search: "{{ localFilters.search }}"
      </ElTag>

      <ElTag
        v-if="localFilters.type && localFilters.type !== 'all'"
        type="success"
        closable
        @close="clearFilter('type')"
      >
        Type: {{ getTypeLabel(localFilters.type) }}
      </ElTag>

      <ElTag
        v-if="localFilters.memberCount"
        type="warning"
        closable
        @close="clearFilter('memberCount')"
      >
        Members: {{ localFilters.memberCount }}
      </ElTag>

      <ElButton
        type="text"
        size="small"
        @click="clearAllFilters"
        class="text-red-600 hover:text-red-800"
      >
        Clear All
      </ElButton>
    </div>

    <!-- 検索結果統計 -->
    <div v-if="resultStats" class="mt-4 text-sm text-gray-600 dark:text-gray-400">
      Showing {{ resultStats.showing }} of {{ resultStats.total }} teams
      <span v-if="resultStats.filtered !== resultStats.total">
        (filtered from {{ resultStats.filtered }})
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { ElInput, ElSelect, ElOption, ElTag, ElButton, ElIcon } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

// Types
interface TeamFilters {
  search: string
  type: string
  memberCount: string
  sortBy: string
}

interface ResultStats {
  showing: number
  total: number
  filtered: number
}

// Props
const props = defineProps<{
  filters: TeamFilters
  resultStats?: ResultStats
}>()

// Emits
const emit = defineEmits<{
  'update:filters': [filters: TeamFilters]
  filtersChanged: [filters: TeamFilters]
}>()

// Local state
const localFilters = ref<TeamFilters>({ ...props.filters })

// Computed
const hasActiveFilters = computed(() => {
  return !!(
    localFilters.value.search ||
    (localFilters.value.type && localFilters.value.type !== 'all') ||
    localFilters.value.memberCount ||
    (localFilters.value.sortBy && localFilters.value.sortBy !== 'created_desc')
  )
})

// Methods
const debouncedSearch = useDebounceFn(() => {
  handleFilterChange()
}, 300)

const handleFilterChange = () => {
  emit('update:filters', { ...localFilters.value })
  emit('filtersChanged', { ...localFilters.value })
}

const clearFilter = (filterKey: keyof TeamFilters) => {
  switch (filterKey) {
    case 'search':
      localFilters.value.search = ''
      break
    case 'type':
      localFilters.value.type = 'all'
      break
    case 'memberCount':
      localFilters.value.memberCount = ''
      break
    case 'sortBy':
      localFilters.value.sortBy = 'created_desc'
      break
  }
  handleFilterChange()
}

const clearAllFilters = () => {
  localFilters.value = {
    search: '',
    type: 'all',
    memberCount: '',
    sortBy: 'created_desc',
  }
  handleFilterChange()
}

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    personal: 'Personal',
    shared: 'Shared',
    current: 'Current',
  }
  return labels[type] || type
}

// Watchers
watch(
  () => props.filters,
  newFilters => {
    localFilters.value = { ...newFilters }
  },
  { deep: true }
)
</script>
```

### 2. バックエンドAPI修正

**ファイル**: `app/Http/Controllers/TeamsController.php` (修正)

```php
public function index(Request $request): Response
{
    $user = Auth::user();

    // フィルター・検索パラメータ取得
    $search = $request->get('search');
    $type = $request->get('type', 'all');
    $memberCount = $request->get('member_count');
    $sortBy = $request->get('sort_by', 'created_desc');

    // ベースクエリ
    $query = $user->allTeams()
        ->with(['owner', 'teamInvitations'])
        ->withCount(['users as members_count', 'teamInvitations as pending_invitations_count']);

    // 検索フィルター
    if (!is_null($search) && trim($search) !== '') {
        $query->where('name', 'like', '%' . trim($search) . '%');
    }

    // チームタイプフィルター
    switch ($type) {
        case 'personal':
            $query->where('personal_team', true);
            break;
        case 'shared':
            $query->where('personal_team', false);
            break;
        case 'current':
            $query->where('id', $user->currentTeam->id);
            break;
    }

    // メンバー数フィルター
    if (!is_null($memberCount)) {
        switch ($memberCount) {
            case '1':
                $query->having('members_count', '=', 1);
                break;
            case '2-5':
                $query->having('members_count', '>=', 2)
                      ->having('members_count', '<=', 5);
                break;
            case '6-10':
                $query->having('members_count', '>=', 6)
                      ->having('members_count', '<=', 10);
                break;
            case '11+':
                $query->having('members_count', '>=', 11);
                break;
        }
    }

    // 並び替え
    switch ($sortBy) {
        case 'name_asc':
            $query->orderBy('name', 'asc');
            break;
        case 'name_desc':
            $query->orderBy('name', 'desc');
            break;
        case 'created_asc':
            $query->orderBy('created_at', 'asc');
            break;
        case 'created_desc':
            $query->orderBy('created_at', 'desc');
            break;
        case 'members_asc':
            $query->orderBy('members_count', 'asc');
            break;
        case 'members_desc':
            $query->orderBy('members_count', 'desc');
            break;
        default:
            $query->orderBy('created_at', 'desc');
    }

    $teams = $query->get();

    // 統計情報
    $totalTeams = $user->allTeams()->count();
    $filteredCount = $teams->count();

    return Inertia::render('Teams/Index', [
        'teams' => $teams,
        'filters' => [
            'search' => $search,
            'type' => $type,
            'member_count' => $memberCount,
            'sort_by' => $sortBy,
        ],
        'stats' => [
            'total' => $totalTeams,
            'filtered' => $filteredCount,
            'showing' => $filteredCount,
        ]
    ]);
}
```

### 3. Index.vue の更新

**ファイル**: `resources/js/Pages/Teams/Index.vue` (部分更新)

```vue
<template>
  <AppLayout title="Teams">
    <!-- ... existing header ... -->

    <div class="py-12">
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="overflow-hidden bg-white shadow-xl sm:rounded-lg dark:bg-gray-800">
          <!-- ... existing header section ... -->

          <!-- フィルター・検索セクション (新規追加) -->
          <div class="px-6 sm:px-8">
            <TeamFilters
              v-model:filters="currentFilters"
              :result-stats="stats"
              @filters-changed="handleFiltersChanged"
            />
          </div>

          <!-- チーム一覧セクション -->
          <div class="p-6 sm:px-8">
            <!-- ... existing loading/error states ... -->

            <!-- チーム一覧 -->
            <div v-else-if="teams.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <TeamCard
                v-for="team in teams"
                :key="team.id"
                :team="team"
                :current-team-id="$page.props.auth.user.current_team_id"
                @show-members="handleShowMembers"
                @show-details="handleShowDetails"
                @team-switched="handleTeamSwitched"
              />
            </div>

            <!-- フィルター結果なし -->
            <div v-else-if="hasActiveFilters" class="py-12 text-center">
              <ElIcon class="mb-4 text-6xl text-gray-400">
                <Search />
              </ElIcon>
              <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">No teams found</h3>
              <p class="mb-4 text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria or filters.
              </p>
              <ElButton @click="clearAllFilters"> Clear Filters </ElButton>
            </div>

            <!-- ... existing empty state ... -->
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import TeamCard from '@/Components/Teams/TeamCard.vue'
import TeamFilters from '@/Components/Teams/TeamFilters.vue'
import { ElIcon, ElButton } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import type { Team } from '@/Types/types-team'

// Props
const props = defineProps<{
  teams: Team[]
  filters: {
    search: string
    type: string
    member_count: string
    sort_by: string
  }
  stats: {
    total: number
    filtered: number
    showing: number
  }
}>()

// Reactive state
const isLoading = ref(false)
const error = ref<string | null>(null)
const currentFilters = ref({
  search: props.filters.search || '',
  type: props.filters.type || 'all',
  memberCount: props.filters.member_count || '',
  sortBy: props.filters.sort_by || 'created_desc',
})

// Computed
const hasActiveFilters = computed(() => {
  return !!(
    currentFilters.value.search ||
    (currentFilters.value.type && currentFilters.value.type !== 'all') ||
    currentFilters.value.memberCount ||
    (currentFilters.value.sortBy && currentFilters.value.sortBy !== 'created_desc')
  )
})

// Methods
const handleFiltersChanged = (filters: any) => {
  isLoading.value = true

  // URL パラメータ更新
  const params: Record<string, string> = {}

  if (filters.search) params.search = filters.search
  if (filters.type !== 'all') params.type = filters.type
  if (filters.memberCount) params.member_count = filters.memberCount
  if (filters.sortBy !== 'created_desc') params.sort_by = filters.sortBy

  router.get('/teams', params, {
    preserveState: true,
    preserveScroll: true,
    onFinish: () => {
      isLoading.value = false
    },
  })
}

const clearAllFilters = () => {
  currentFilters.value = {
    search: '',
    type: 'all',
    memberCount: '',
    sortBy: 'created_desc',
  }
  handleFiltersChanged(currentFilters.value)
}

// ... existing methods ...
</script>
```

## 成果物

### 新規作成ファイル

1. `resources/js/Components/Teams/TeamFilters.vue` - フィルター・検索コンポーネント

### 修正ファイル

1. `app/Http/Controllers/TeamsController.php` - フィルタリングロジック追加
2. `resources/js/Pages/Teams/Index.vue` - フィルターコンポーネント統合

## 完了条件

### 機能確認

1. **検索機能**
   - チーム名でリアルタイム検索
   - 300ms のデバウンス処理
   - 検索結果のハイライト表示

2. **フィルタリング機能**
   - チームタイプでのフィルタリング
   - メンバー数でのフィルタリング
   - 複数フィルターの組み合わせ

3. **並び替え機能**
   - 名前順（昇順・降順）
   - 作成日順（昇順・降順）
   - メンバー数順（昇順・降順）

4. **UI/UX**
   - アクティブフィルターの表示
   - フィルタークリア機能
   - 検索結果統計表示

### 視覚的確認

1. **レスポンシブデザイン**
   - デスクトップ: 4カラムフィルター
   - タブレット: 2カラムフィルター
   - モバイル: 1カラムフィルター

2. **状態表示**
   - アクティブフィルターのタグ表示
   - 検索結果数の表示
   - フィルター結果なしの状態

## 技術的考慮事項

### 1. パフォーマンス

- デバウンス処理による API 呼び出し最適化
- URL 状態同期による直リンク対応
- preserveState による状態保持

### 2. VueUse 活用

- `useDebounceFn` による効率的なデバウンス
- `useUrlSearchParams` による URL 状態管理（将来対応）

### 3. バックエンド最適化

- インデックス活用によるクエリ最適化
- `having` 句による集計フィルタリング
- 効率的な並び替え処理

## 注意事項

### 1. データベース

- `members_count` カラムにインデックス追加を検討
- `name` カラムの FULLTEXT インデックス検討

### 2. URL 状態管理

- ブラウザ戻る・進むボタン対応
- 直リンク共有対応
- ブックマーク対応

### 3. ユーザビリティ

- 直感的なフィルター配置
- 明確な検索結果表示
- 適切なエラーメッセージ

## 実装時の注意点

### 1. デバウンス処理

- VueUse の `useDebounceFn` を正しく使用
- 適切なデバウンス時間（300ms）設定
- キャンセル処理の実装

### 2. URL同期

- Inertia.js の `preserveState` 活用
- 適切なパラメータのエンコード
- ブラウザ履歴の管理

### 3. フィルター状態

- 初期値の適切な設定
- 親子コンポーネント間の状態同期
- クリア処理の一貫性

## コードレビューポイント

1. **デバウンス実装**: 効率的な検索処理
2. **URL状態管理**: ブラウザ操作対応
3. **コンポーネント分離**: 適切な責任分担
4. **型安全性**: TypeScript活用によるバグ防止
