<script lang="ts" setup>
import { computed } from 'vue'
import { ElPagination, ElButton, ElIcon } from 'element-plus'
import { ArrowLeft, ArrowRight, Loading } from '@element-plus/icons-vue'
import type { PaginationMeta } from '@/Types/types-team'

// Props定義
const props = defineProps<{
  pagination: PaginationMeta
  loading?: boolean
}>()

// Emits定義
const emit = defineEmits<{
  pageChanged: [page: number]
  perPageChanged: [perPage: number]
}>()

// 件数選択オプション
const perPageSizes = [6, 12, 24, 48]

// ページネーション表示判定
const shouldShowPagination = computed(() => {
  return props.pagination.total > props.pagination.per_page || props.pagination.last_page > 1
})

// ページ変更時の処理
const handleCurrentChange = (page: number) => {
  if (page >= 1 && page <= props.pagination.last_page && !props.loading) {
    emit('pageChanged', page)
  }
}

// 件数変更時の処理
const handleSizeChange = (size: number) => {
  if (perPageSizes.includes(size) && !props.loading) {
    emit('perPageChanged', size)
  }
}
</script>

<template>
  <div
    v-if="shouldShowPagination"
    class="border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800"
  >
    <!-- デスクトップ表示 -->
    <div class="hidden items-center justify-between sm:flex">
      <!-- 左側: 結果情報 -->
      <div class="text-sm text-gray-700 dark:text-gray-300">
        <span v-if="pagination.from && pagination.to">
          {{ pagination.from }}-{{ pagination.to }}件を表示 （全{{ pagination.total }}件中）
        </span>
        <span v-else-if="pagination.total > 0">
          {{ pagination.total }}件中{{ pagination.total }}件を表示
        </span>
      </div>

      <!-- 右側: ページネーション -->
      <ElPagination
        :current-page="pagination.current_page"
        :page-size="pagination.per_page"
        :total="pagination.total"
        :page-sizes="perPageSizes"
        :disabled="loading"
        layout="sizes, prev, pager, next, jumper"
        background
        data-testid="teams-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- モバイル表示 -->
    <div class="flex items-center justify-between sm:hidden">
      <!-- 左側: 結果情報 -->
      <div class="text-sm text-gray-700 dark:text-gray-300">
        <span v-if="pagination.from && pagination.to">
          {{ pagination.from }}-{{ pagination.to }} / {{ pagination.total }}
        </span>
        <span v-else> {{ pagination.total }}件 </span>
      </div>

      <!-- 右側: シンプルなページネーション -->
      <div class="flex items-center space-x-2">
        <ElButton
          :disabled="pagination.current_page <= 1 || loading"
          size="small"
          @click="handleCurrentChange(pagination.current_page - 1)"
        >
          <ElIcon><ArrowLeft /></ElIcon>
        </ElButton>

        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ pagination.current_page }} / {{ pagination.last_page }}
        </span>

        <ElButton
          :disabled="pagination.current_page >= pagination.last_page || loading"
          size="small"
          @click="handleCurrentChange(pagination.current_page + 1)"
        >
          <ElIcon><ArrowRight /></ElIcon>
        </ElButton>
      </div>
    </div>

    <!-- ローディング状態 -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75"
    >
      <ElIcon class="animate-spin text-xl text-gray-400">
        <Loading />
      </ElIcon>
    </div>
  </div>
</template>

<style scoped>
/* Element Plus Pagination カスタマイズ */
:deep(.el-pagination) {
  --el-pagination-font-size: 14px;
  --el-pagination-button-disabled-color: var(--el-text-color-placeholder);
  --el-pagination-button-disabled-bg-color: var(--el-fill-color-blank);
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: var(--el-color-primary);
  color: var(--el-color-white);
}

/* ローディング状態のスタイル */
.relative {
  position: relative;
}

/* ダークモード対応 */
.dark :deep(.el-pagination) {
  --el-pagination-button-color: var(--el-text-color-regular);
  --el-pagination-button-bg-color: var(--el-fill-color-blank);
}
</style>
