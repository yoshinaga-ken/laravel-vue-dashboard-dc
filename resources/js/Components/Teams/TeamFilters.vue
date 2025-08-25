<script lang="ts" setup>
  import { ref, computed, watch } from 'vue'
  import { useDebounceFn } from '@vueuse/core'
  import { ElInput, ElSelect, ElOption, ElTag, ElButton, ElIcon } from 'element-plus'
  import { Search } from '@element-plus/icons-vue'
  import type { TeamFilters as ITeamFilters } from '@/Types/types-team'

  // Types for backward compatibility
  interface TeamFilters {
    search: string
    type: string
    roleFilter: string
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
    filtersChanged: [filters: ITeamFilters] // 正しい型を返す
  }>()

  // Local state
  const localFilters = ref<TeamFilters>({
    ...props.filters,
    roleFilter: props.filters.roleFilter || 'all',
  })

  // 型変換ヘルパー
  const convertToStandardFilters = (filters: TeamFilters): ITeamFilters => {
    return {
      search: filters.search || null,
      type: filters.type as any,
      member_count: filters.memberCount || null,
      role_filter: filters.roleFilter as any,
      sort_by: filters.sortBy as any,
    }
  }

  // Computed
  const hasActiveFilters = computed(() => {
    return !!(
      localFilters.value.search ||
      (localFilters.value.type && localFilters.value.type !== 'all') ||
      (localFilters.value.roleFilter && localFilters.value.roleFilter !== 'all') ||
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
    emit('filtersChanged', convertToStandardFilters(localFilters.value))
  }

  const clearFilter = (filterKey: keyof TeamFilters) => {
    switch (filterKey) {
      case 'search':
        localFilters.value.search = ''
        break
      case 'type':
        localFilters.value.type = 'all'
        break
      case 'roleFilter':
        localFilters.value.roleFilter = 'all'
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
      roleFilter: 'all',
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

  const getRoleLabel = (role: string): string => {
    const labels: Record<string, string> = {
      owner: 'Owner',
      member: 'Member',
    }
    return labels[role] || role
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

<template>
  <div
    class="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      <!-- 検索入力 -->
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Search Teams
        </label>
        <ElInput
          v-model="localFilters.search"
          placeholder="Search by team name..."
          clearable
          data-testid="team-search-input"
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
          data-testid="team-type-filter"
          @change="handleFilterChange"
        >
          <ElOption value="all" label="All Teams" />
          <ElOption value="personal" label="Personal Teams" />
          <ElOption value="shared" label="Shared Teams" />
          <ElOption value="current" label="Current Team" />
        </ElSelect>
      </div>

      <!-- チーム役割フィルター -->
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          My Role
        </label>
        <ElSelect
          v-model="localFilters.roleFilter"
          placeholder="All Roles"
          clearable
          data-testid="team-role-filter"
          @change="handleFilterChange"
        >
          <ElOption value="all" label="All Roles" />
          <ElOption value="owner" label="Owner" />
          <ElOption value="member" label="Member" />
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
        <ElSelect
          v-model="localFilters.sortBy"
          data-testid="sort-by-filter"
          @change="handleFilterChange"
        >
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
        v-if="localFilters.roleFilter && localFilters.roleFilter !== 'all'"
        type="primary"
        closable
        @close="clearFilter('roleFilter')"
      >
        Role: {{ getRoleLabel(localFilters.roleFilter) }}
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
