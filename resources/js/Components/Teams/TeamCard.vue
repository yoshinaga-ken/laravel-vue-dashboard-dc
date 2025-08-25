<script lang="ts" setup>
import { computed, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import {
  ElAvatar,
  ElTag,
  ElButton,
  ElIcon,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
} from 'element-plus'
import { Check, User, More, Switch, Setting, ArrowRight, Close } from '@element-plus/icons-vue'
import type { Team } from '@/Types/types-team'

// Props
const props = defineProps<{
  team: Team
  currentTeamId: number
}>()

// Emits
const emit = defineEmits<{
  showMembers: [team: Team]
  showDetails: [team: Team]
  teamSwitched: [team: Team]
}>()

// Reactive state
const isSwitching = ref(false)

// Computed
const canLeaveTeam = computed(() => {
  return !props.team.personal_team && props.team.id !== props.currentTeamId
})

const isOwner = computed(() => {
  // Userの現在のIDとチームのowner IDを比較して判定
  // 将来的にはJetstreamのポリシーで判定する
  return true // 仮の実装（実際は適切なロジックが必要）
})

// Methods
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}

const handleSwitchTeam = async () => {
  isSwitching.value = true
  try {
    await router.put(
      route('current-team.update'),
      {
        team_id: props.team.id,
      },
      {
        onSuccess: () => {
          emit('teamSwitched', props.team)
        },
      }
    )
  } finally {
    isSwitching.value = false
  }
}

const handleTeamSettings = () => {
  router.visit(route('teams.show', props.team.id))
}

const handleAction = (command: string) => {
  switch (command) {
    case 'switch':
      handleSwitchTeam()
      break
    case 'settings':
      handleTeamSettings()
      break
    case 'leave':
      // 今後実装
      console.log('Leave team:', props.team.id)
      break
  }
}
</script>

<template>
  <div
    class="overflow-hidden rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-lg dark:border-gray-700"
    :data-testid="`team-card-${team.id}`"
    :class="{
      'current-team': team.id === currentTeamId,
      'personal-team': team.personal_team,
      owner: isOwner,
      member: !isOwner,
    }"
  >
    <!-- カードヘッダー -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:from-gray-800 dark:to-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- チームアバター -->
          <div class="relative">
            <ElAvatar
              :size="64"
              :src="team.profile_photo_url || undefined"
              :alt="team.name"
              class="shadow-lg ring-4 ring-white dark:ring-gray-600"
            >
              <span class="text-xl font-bold text-gray-600 dark:text-gray-300">
                {{ team.name.charAt(0).toUpperCase() }}
              </span>
            </ElAvatar>
            <!-- オンライン表示 (将来の機能) -->
            <div
              v-if="team.is_active"
              class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500 dark:border-gray-600"
            />
          </div>

          <!-- チーム基本情報 -->
          <div>
            <h4 class="flex items-center text-xl font-semibold text-gray-900 dark:text-white">
              {{ team.name }}
              <ElTag
                v-if="team.id === currentTeamId"
                type="success"
                size="small"
                class="ml-2"
                effect="light"
                :data-testid="`current-team-indicator-${team.id}`"
              >
                <ElIcon><Check /></ElIcon>
                Current
              </ElTag>
              <ElTag
                v-if="team.personal_team"
                type="info"
                size="small"
                class="ml-2"
                effect="light"
                :data-testid="`personal-team-icon-${team.id}`"
              >
                <ElIcon><User /></ElIcon>
                Personal
              </ElTag>
            </h4>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Created {{ formatDate(team.created_at) }} by {{ team.owner?.name || 'Unknown' }}
            </p>
          </div>
        </div>

        <!-- クイックアクション -->
        <ElDropdown trigger="click" @command="handleAction">
          <ElButton type="text" circle>
            <ElIcon><More /></ElIcon>
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem v-if="team.id !== currentTeamId" command="switch" :icon="Switch">
                Switch to Team
              </ElDropdownItem>
              <ElDropdownItem command="settings" :icon="Setting"> Team Settings </ElDropdownItem>
              <ElDropdownItem
                v-if="canLeaveTeam"
                command="leave"
                :icon="Close"
                class="text-red-600"
                divided
              >
                Leave Team
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </div>
    </div>

    <!-- カードボディ -->
    <div class="p-6">
      <!-- 統計情報 -->
      <div class="mb-6 grid grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ team.members_count }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ team.members_count === 1 ? 'Member' : 'Members' }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {{ team.pending_invitations_count }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Pending</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ team.projects_count || 0 }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Projects</div>
        </div>
      </div>

      <!-- メンバー一覧プレビュー -->
      <div v-if="team.recent_members?.length" class="mb-6">
        <div class="mb-3 flex items-center justify-between">
          <h5 class="text-sm font-medium text-gray-900 dark:text-white">Recent Members</h5>
          <ElButton type="text" size="small" @click="$emit('showMembers', team)">
            View All
          </ElButton>
        </div>
        <div class="flex items-center space-x-2">
          <ElAvatar
            v-for="member in (team.recent_members || []).slice(0, 5)"
            :key="member.id"
            :size="32"
            :src="member.profile_photo_url || undefined"
            :title="member.name"
            class="ring-2 ring-white dark:ring-gray-600"
          >
            {{ member.name.charAt(0) }}
          </ElAvatar>
          <span v-if="team.members_count > 5" class="ml-2 text-sm text-gray-500 dark:text-gray-400">
            +{{ team.members_count - 5 }} more
          </span>
        </div>
      </div>

      <!-- 招待中のメンバー -->
      <div v-if="team.pending_invitations_count > 0" class="mb-6">
        <div class="mb-3 flex items-center justify-between">
          <h5 class="text-sm font-medium text-gray-900 dark:text-white">Pending Invitations</h5>
          <ElTag type="warning" size="small" effect="light">
            {{ team.pending_invitations_count }}
          </ElTag>
        </div>
        <div class="space-y-2">
          <div
            v-for="invitation in team.recent_invitations || []"
            :key="invitation.id"
            class="flex items-center justify-between rounded bg-yellow-50 p-2 dark:bg-yellow-900/20"
          >
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ invitation.email }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(invitation.created_at) }}
            </span>
          </div>
        </div>
      </div>

      <!-- アクションボタン -->
      <div
        class="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700"
      >
        <div class="flex space-x-2">
          <ElButton
            v-if="team.id !== currentTeamId"
            type="primary"
            size="small"
            :data-testid="`switch-team-${team.id}`"
            @click="handleSwitchTeam"
            :loading="isSwitching"
          >
            <ElIcon><Switch /></ElIcon>
            Switch
          </ElButton>
          <ElButton
            type="default"
            size="small"
            :data-testid="`view-team-${team.id}`"
            @click="handleTeamSettings"
          >
            <ElIcon><Setting /></ElIcon>
            Settings
          </ElButton>
        </div>

        <ElButton type="text" size="small" @click="$emit('showDetails', team)">
          View Details
          <ElIcon><ArrowRight /></ElIcon>
        </ElButton>
      </div>
    </div>
  </div>
</template>
