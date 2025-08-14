/**
 * Vue3 Composables用の型定義
 * チーム一覧機能で使用するComposables
 */

import type { Ref, ComputedRef } from 'vue'
import type { Team, TeamFilters, TeamStats } from './types-team'

/**
 * チームデータ管理Composableの型定義
 */
export interface UseTeamsReturn {
  // State
  teams: Ref<Team[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>

  // Computed
  filteredTeams: ComputedRef<Team[]>
  hasTeams: ComputedRef<boolean>

  // Actions
  loadTeams: () => Promise<void>
  refreshTeams: () => Promise<void>
  switchTeam: (teamId: number) => Promise<void>

  // Filters
  applyFilters: (filters: TeamFilters) => void
  clearFilters: () => void
}

/**
 * チームフィルター管理Composableの型定義
 */
export interface UseTeamFiltersReturn {
  // State
  filters: Ref<TeamFilters>

  // Computed
  hasActiveFilters: ComputedRef<boolean>
  filterCount: ComputedRef<number>

  // Actions
  setFilter: <K extends keyof TeamFilters>(key: K, value: TeamFilters[K]) => void
  clearFilter: (key: keyof TeamFilters) => void
  clearAllFilters: () => void
  resetFilters: () => void

  // URL同期
  syncWithUrl: () => void
  updateUrl: () => void
}

/**
 * チーム統計Composableの型定義
 */
export interface UseTeamStatsReturn {
  // State
  stats: Ref<TeamStats>

  // Computed
  totalTeams: ComputedRef<number>
  filteredTeams: ComputedRef<number>
  showingTeams: ComputedRef<number>

  // Actions
  updateStats: (newStats: Partial<TeamStats>) => void
  calculateStats: (teams: Team[], filters: TeamFilters) => TeamStats
}

/**
 * チーム権限管理Composableの型定義
 */
export interface UseTeamPermissionsReturn {
  // Computed
  canCreateTeams: ComputedRef<boolean>
  canManageTeams: ComputedRef<boolean>
  canSwitchTeams: ComputedRef<boolean>

  // Team-specific permissions
  canViewTeam: (team: Team) => boolean
  canUpdateTeam: (team: Team) => boolean
  canDeleteTeam: (team: Team) => boolean
  canLeaveTeam: (team: Team) => boolean
}

/**
 * API通信Composableの型定義
 */
export interface UseTeamApiReturn {
  // State
  isLoading: Ref<boolean>
  error: Ref<string | null>

  // Team operations
  getTeams: (filters?: TeamFilters) => Promise<Team[]>
  switchTeam: (teamId: number) => Promise<void>
  createTeam: (name: string) => Promise<Team>
  updateTeam: (teamId: number, data: Partial<Team>) => Promise<Team>
  deleteTeam: (teamId: number) => Promise<void>

  // Member operations
  inviteMember: (teamId: number, email: string, role?: string) => Promise<void>
  removeMember: (teamId: number, userId: number) => Promise<void>
  updateMemberRole: (teamId: number, userId: number, role: string) => Promise<void>
}

/**
 * フォーム管理Composableの型定義
 */
export interface UseFormReturn<T> {
  // State
  form: Ref<T>
  isSubmitting: Ref<boolean>
  errors: Ref<Record<string, string>>

  // Computed
  hasErrors: ComputedRef<boolean>
  isValid: ComputedRef<boolean>

  // Actions
  setField: <K extends keyof T>(key: K, value: T[K]) => void
  setError: (key: string, message: string) => void
  clearError: (key: string) => void
  clearErrors: () => void
  reset: () => void
  submit: () => Promise<void>
}

/**
 * 検索Composableの型定義
 */
export interface UseSearchReturn {
  // State
  searchTerm: Ref<string>
  searchResults: Ref<Team[]>
  isSearching: Ref<boolean>

  // Computed
  hasSearchTerm: ComputedRef<boolean>
  hasResults: ComputedRef<boolean>

  // Actions
  search: (term: string) => Promise<void>
  clearSearch: () => void

  // Debounced search
  debouncedSearch: (term: string) => void
}

/**
 * ローカルストレージComposableの型定義
 */
export interface UseLocalStorageReturn<T> {
  // State
  value: Ref<T>

  // Actions
  setValue: (newValue: T) => void
  clearValue: () => void

  // Computed
  hasValue: ComputedRef<boolean>
}

/**
 * 通知Composableの型定義
 */
export interface UseNotificationsReturn {
  // Actions
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void

  // Element Plus integration
  notify: (options: {
    title?: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration?: number
  }) => void
}
