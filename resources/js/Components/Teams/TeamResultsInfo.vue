<template>
  <div class="border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
    <div class="flex items-center justify-between">
      <!-- 結果表示情報 -->
      <div class="text-sm text-gray-700 dark:text-gray-300">
        <span v-if="pagination.total === 0" class="text-gray-500"> チームが見つかりません </span>
        <span v-else-if="hasActiveFilters" class="space-x-1">
          <span class="font-medium">{{ pagination.total }}件中</span>
          <span v-if="stats.filtered !== stats.total" class="text-blue-600 dark:text-blue-400">
            （フィルター結果: {{ stats.filtered }}件）
          </span>
          <span v-if="pagination.from && pagination.to">
            {{ pagination.from }}-{{ pagination.to }}件表示
          </span>
          <span v-else> {{ stats.showing }}件表示 </span>
        </span>
        <span v-else>
          <span class="font-medium">{{ pagination.total }}件中</span>
          <span v-if="pagination.from && pagination.to">
            {{ pagination.from }}-{{ pagination.to }}件表示
          </span>
          <span v-else> {{ stats.showing }}件表示 </span>
        </span>
      </div>

      <!-- ページ件数選択 -->
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">表示件数:</span>
        <ElSelect
          :model-value="pagination.per_page"
          placeholder="件数"
          size="small"
          style="width: 80px"
          @change="handlePerPageChange"
        >
          <ElOption
            v-for="option in perPageOptions"
            :key="option"
            :label="`${option}件`"
            :value="option"
          />
        </ElSelect>
      </div>
    </div>

    <!-- アクティブフィルター表示 -->
    <div v-if="activeFilters.length > 0" class="mt-3 flex flex-wrap gap-2">
      <span class="text-xs text-gray-500 dark:text-gray-400">アクティブなフィルター:</span>
      <ElTag
        v-for="filter in activeFilters"
        :key="filter.key"
        :closable="true"
        size="small"
        type="info"
        @close="handleFilterRemove(filter.key)"
      >
        {{ filter.label }}: {{ filter.value }}
      </ElTag>
      <ElButton
        v-if="activeFilters.length > 1"
        size="small"
        type="primary"
        text
        @click="handleClearAllFilters"
      >
        すべてクリア
      </ElButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElSelect, ElOption, ElTag, ElButton } from 'element-plus'
import type { PaginationMeta, TeamFilters, TeamStatsWithPagination } from '@/Types/types-team'

// Props定義
const props = defineProps<{
  pagination: PaginationMeta
  filters: TeamFilters
  stats: TeamStatsWithPagination
}>()

// Emits定義
const emit = defineEmits<{
  perPageChanged: [perPage: number]
  filterRemoved: [filterKey: string]
  allFiltersCleared: []
}>()

// 件数選択オプション
const perPageOptions = [6, 12, 24, 48]

// アクティブフィルターの判定
const hasActiveFilters = computed(() => {
  return !!(
    props.filters.search ||
    props.filters.type !== 'all' ||
    props.filters.member_count ||
    props.filters.sort_by !== 'created_desc'
  )
})

// アクティブフィルターのリスト
const activeFilters = computed(() => {
  const filters: Array<{ key: string; label: string; value: string }> = []

  if (props.filters.search) {
    filters.push({
      key: 'search',
      label: '検索',
      value: props.filters.search,
    })
  }

  if (props.filters.type !== 'all') {
    const typeLabels = {
      personal: '個人チーム',
      shared: '共有チーム',
      current: '現在のチーム',
    }
    filters.push({
      key: 'type',
      label: 'タイプ',
      value: typeLabels[props.filters.type as keyof typeof typeLabels] || props.filters.type,
    })
  }

  if (props.filters.member_count) {
    const memberCountLabels = {
      '1': '1人',
      '2-5': '2-5人',
      '6-10': '6-10人',
      '11+': '11人以上',
    }
    filters.push({
      key: 'member_count',
      label: 'メンバー数',
      value:
        memberCountLabels[props.filters.member_count as keyof typeof memberCountLabels] ||
        props.filters.member_count,
    })
  }

  if (props.filters.sort_by !== 'created_desc') {
    const sortLabels = {
      name_asc: '名前（昇順）',
      name_desc: '名前（降順）',
      created_asc: '作成日（古い順）',
      created_desc: '作成日（新しい順）',
      members_asc: 'メンバー数（少ない順）',
      members_desc: 'メンバー数（多い順）',
    }
    filters.push({
      key: 'sort_by',
      label: '並び順',
      value: sortLabels[props.filters.sort_by as keyof typeof sortLabels] || props.filters.sort_by,
    })
  }

  return filters
})

// 件数変更時の処理
const handlePerPageChange = (perPage: number) => {
  emit('perPageChanged', perPage)
}

// フィルター削除の処理
const handleFilterRemove = (filterKey: string) => {
  emit('filterRemoved', filterKey)
}

// 全フィルタークリアの処理
const handleClearAllFilters = () => {
  emit('allFiltersCleared')
}
</script>

<style scoped>
/* Element Plusのスタイル調整 */
:deep(.el-select) {
  --el-select-width: 80px;
}

:deep(.el-select .el-input__inner) {
  font-size: 12px;
}
</style>
