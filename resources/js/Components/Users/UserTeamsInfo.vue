<script lang="ts" setup>
import { computed } from 'vue'
import { ElCard, ElTag, ElEmpty, ElIcon, ElDivider } from 'element-plus'
import { User, Star, UserFilled } from '@element-plus/icons-vue'
import type { Team } from '@/Types/types-graphql'

const props = defineProps<{
  ownedTeams: Team[]
  joinedTeams: Team[]
  currentTeamId?: string | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'team-click': [teamId: string]
}>()

const currentTeam = computed(() => {
  if (!props.currentTeamId) return null

  // 所有チームから検索
  const ownedTeam = props.ownedTeams.find(team => team.id === props.currentTeamId)
  if (ownedTeam) return ownedTeam

  // 参加チームから検索
  const joinedTeam = props.joinedTeams.find(team => team.id === props.currentTeamId)
  return joinedTeam || null
})

const hasTeams = computed(() => {
  return props.ownedTeams.length > 0 || props.joinedTeams.length > 0
})

const handleTeamClick = (teamId: string) => {
  emit('team-click', teamId)
}

const getTeamTypeLabel = (team: Team) => {
  return team.personal_team ? 'パーソナルチーム' : 'チーム'
}

const getTeamTypeTag = (team: Team) => {
  return team.personal_team ? 'info' : 'primary'
}
</script>

<template>
  <ElCard class="user-teams-info" shadow="hover">
    <template #header>
      <div class="flex items-center space-x-2">
        <ElIcon class="text-green-600 dark:text-green-400">
          <UserFilled />
        </ElIcon>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">チーム情報</h3>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="!hasTeams" class="py-8">
      <ElEmpty description="チームに参加していません" :image-size="120" />
    </div>

    <div v-else class="space-y-6">
      <!-- 現在のチーム -->
      <div v-if="currentTeam" class="space-y-3">
        <div class="flex items-center space-x-2">
          <ElIcon class="text-amber-600 dark:text-amber-400">
            <Star />
          </ElIcon>
          <h4 class="text-md font-medium text-gray-900 dark:text-white">現在のチーム</h4>
        </div>

        <div
          class="cursor-pointer rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 transition-shadow hover:shadow-md dark:border-amber-700 dark:from-amber-900/20 dark:to-yellow-900/20"
          @click="handleTeamClick(currentTeam.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h5 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ currentTeam.name }}
              </h5>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ getTeamTypeLabel(currentTeam) }}
              </p>
            </div>
            <ElTag :type="getTeamTypeTag(currentTeam)" effect="light" size="small">
              現在のチーム
            </ElTag>
          </div>
        </div>
      </div>

      <ElDivider v-if="currentTeam" class="my-6" />

      <!-- 所有チーム -->
      <div v-if="ownedTeams.length > 0" class="space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">所有チーム</h4>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ ownedTeams.length }}チーム
          </span>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div
            v-for="team in ownedTeams"
            :key="team.id"
            class="group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:hover:border-blue-600"
            @click="handleTeamClick(team.id)"
          >
            <div class="flex items-center justify-between">
              <div class="min-w-0 flex-1">
                <h5
                  class="truncate text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                >
                  {{ team.name }}
                </h5>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {{ getTeamTypeLabel(team) }}
                </p>
              </div>
              <ElIcon class="ml-2 text-amber-500 dark:text-amber-400">
                <Star />
              </ElIcon>
            </div>
            <ElTag :type="getTeamTypeTag(team)" effect="plain" size="small" class="mt-2">
              オーナー
            </ElTag>
          </div>
        </div>
      </div>

      <!-- 参加チーム -->
      <div v-if="joinedTeams.length > 0" class="space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">参加チーム</h4>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ joinedTeams.length }}チーム
          </span>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div
            v-for="team in joinedTeams"
            :key="team.id"
            class="group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-green-300 hover:shadow-md dark:border-gray-700 dark:hover:border-green-600"
            @click="handleTeamClick(team.id)"
          >
            <div class="flex items-center justify-between">
              <div class="min-w-0 flex-1">
                <h5
                  class="truncate text-sm font-semibold text-gray-900 transition-colors group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400"
                >
                  {{ team.name }}
                </h5>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {{ getTeamTypeLabel(team) }}
                </p>
              </div>
              <ElIcon class="ml-2 text-green-500 dark:text-green-400">
                <User />
              </ElIcon>
            </div>
            <ElTag type="success" effect="plain" size="small" class="mt-2"> メンバー </ElTag>
          </div>
        </div>
      </div>

      <!-- チーム統計 -->
      <div class="border-t border-gray-200 pt-4 dark:border-gray-700">
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-lg bg-amber-50 p-3 text-center dark:bg-amber-900/20">
            <div class="text-xl font-bold text-amber-600 dark:text-amber-400">
              {{ ownedTeams.length }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">所有チーム</div>
          </div>
          <div class="rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20">
            <div class="text-xl font-bold text-green-600 dark:text-green-400">
              {{ joinedTeams.length }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">参加チーム</div>
          </div>
        </div>
      </div>
    </div>
  </ElCard>
</template>

<style scoped>
.user-teams-info {
  @apply w-full;
}

.user-teams-info :deep(.el-card__header) {
  @apply border-b border-gray-200 dark:border-gray-700;
}

.user-teams-info :deep(.el-card__body) {
  @apply p-6;
}

.user-teams-info :deep(.el-divider) {
  @apply border-gray-200 dark:border-gray-700;
}

.user-teams-info :deep(.el-empty__description) {
  @apply text-gray-500 dark:text-gray-400;
}

/* チームカードのホバーエフェクト */
.user-teams-info .group:hover {
  @apply scale-105 transform;
}

/* タグのスタイル調整 */
.user-teams-info :deep(.el-tag) {
  @apply text-xs;
}
</style>
