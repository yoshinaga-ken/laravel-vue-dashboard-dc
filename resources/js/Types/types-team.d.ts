/**
 * チーム関連のTypeScript型定義
 * Laravel Jetstream + チーム一覧機能用
 */

import type { User } from './types'

/**
 * チームの基本型定義
 */
export interface Team {
  id: number
  name: string
  personal_team: boolean
  created_at: string
  updated_at: string

  // リレーション
  owner: User
  users?: User[]
  teamInvitations?: TeamInvitation[]

  // 集計カラム (withCount)
  members_count: number
  pending_invitations_count: number

  // 追加フィールド（将来対応）
  profile_photo_url?: string
  description?: string
  is_active?: boolean
  projects_count?: number

  // 最新メンバー・招待（詳細表示用）
  recent_members?: User[]
  recent_invitations?: TeamInvitation[]
}

/**
 * チーム招待の型定義
 */
export interface TeamInvitation {
  id: number
  team_id: number
  email: string
  role?: string
  created_at: string
  updated_at: string

  // リレーション
  team?: Team
}

/**
 * チーム一覧画面のProps型定義
 */
export interface TeamsIndexProps {
  teams: Team[]
  pagination: PaginationMeta
  filters: TeamFilters
  stats: TeamStatsWithPagination
  jetstream: JetstreamTeamFeatures
}

/**
 * チームフィルター・検索条件の型定義
 */
export interface TeamFilters {
  search: string | null
  type: TeamType
  member_count: string | null
  sort_by: TeamSortBy
}

/**
 * チームタイプの列挙型
 */
export type TeamType = 'all' | 'personal' | 'shared' | 'current'

/**
 * チーム並び替えオプションの列挙型
 */
export type TeamSortBy =
  | 'name_asc'
  | 'name_desc'
  | 'created_asc'
  | 'created_desc'
  | 'members_asc'
  | 'members_desc'

/**
 * チーム統計情報の型定義
 */
export interface TeamStats {
  total: number
  filtered: number
  showing: number
}

/**
 * Jetstream チーム機能の型定義
 */
export interface JetstreamTeamFeatures {
  canCreateTeams: boolean
}

/**
 * チームカードコンポーネントのProps型定義
 */
export interface TeamCardProps {
  team: Team
  currentTeamId: number
}

/**
 * チームフィルターコンポーネントのProps型定義
 */
export interface TeamFiltersProps {
  filters: TeamFilters
  resultStats?: ResultStats
}

/**
 * 検索結果統計の型定義
 */
export interface ResultStats {
  showing: number
  total: number
  filtered: number
}

/**
 * チームアクション関連のイベント型定義
 */
export interface TeamActionEvents {
  showMembers: [team: Team]
  showDetails: [team: Team]
  teamSwitched: [team: Team]
  filtersChanged: [filters: TeamFilters]
}

/**
 * チーム切り替えAPIのレスポンス型定義
 */
export interface TeamSwitchResponse {
  success: boolean
  message?: string
  current_team_id?: number
}

/**
 * チームメンバーの役割定義
 */
export type TeamRole = 'owner' | 'admin' | 'editor' | 'member'

/**
 * チーム権限の型定義
 */
export interface TeamPermissions {
  canView: boolean
  canUpdate: boolean
  canDelete: boolean
  canManageMembers: boolean
  canInviteMembers: boolean
}

/**
 * チーム詳細情報の型定義（将来対応）
 */
export interface TeamDetails extends Team {
  description: string
  settings: TeamSettings
  permissions: TeamPermissions
  user_role: TeamRole
  is_owner: boolean
  is_current: boolean
}

/**
 * チーム設定の型定義（将来対応）
 */
export interface TeamSettings {
  visibility: 'public' | 'private' | 'internal'
  allow_invitations: boolean
  require_approval: boolean
  max_members?: number
}

/**
 * ページネーション情報の型定義（TASK-203用）
 */
export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
  links: PaginationLink[]
}

/**
 * ページネーションリンクの型定義
 */
export interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

/**
 * チーム一覧画面のProps型定義（ページネーション対応）
 */
export interface TeamsIndexProps {
  teams: Team[]
  pagination: PaginationMeta
  filters: TeamFilters
  stats: TeamStatsWithPagination
  jetstream: JetstreamTeamFeatures
}

/**
 * チーム統計情報の型定義（ページネーション対応）
 */
export interface TeamStatsWithPagination {
  total: number
  filtered: number
  showing: number
  from: number | null
  to: number | null
}

/**
 * ページネーション型定義（TASK-203用）
 */
export interface TeamPagination {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number
  to: number
  data: Team[]
  links: PaginationLink[]
}

/**
 * API エラーレスポンスの型定義
 */
export interface TeamApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}
