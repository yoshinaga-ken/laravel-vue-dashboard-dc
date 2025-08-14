/**
 * Inertia.js ページコンポーネント用のグローバル型定義
 * Laravel + Jetstream + Inertia.js 標準のページプロパティ
 */

import type { User } from './types'
import type { TeamsIndexProps } from './types-team'

/**
 * Inertia.js 共通ページプロパティ
 */
export interface InertiaPageProps {
  auth: {
    user: User
  }
  jetstream: {
    hasTeamFeatures: boolean
    canCreateTeams: boolean
    canManageTeams: boolean
    canUpdateTeamDetails: boolean
    canDeleteTeams: boolean
    hasApiFeatures: boolean
    hasTermsAndPrivacyPolicyFeature: boolean
    hasAccountDeletionFeatures: boolean
  }
  flash?: {
    message?: string
    error?: string
    success?: string
  }
  errors?: Record<string, string>
}

/**
 * チーム一覧ページのプロパティ
 */
export interface TeamsIndexPageProps extends InertiaPageProps {
  teams: TeamsIndexProps['teams']
  filters: TeamsIndexProps['filters']
  stats: TeamsIndexProps['stats']
}

/**
 * ダッシュボードページのプロパティ
 */
export interface DashboardPageProps extends InertiaPageProps {
  // ダッシュボード固有のプロパティをここに追加
}

/**
 * 記事関連ページのプロパティ
 */
export interface ArticlePageProps extends InertiaPageProps {
  // 記事関連のプロパティをここに追加
}

/**
 * Vue3 + Inertia.js でページコンポーネントが受け取るpropsの基底型
 */
export interface BasePageProps {
  // Inertia.js によって自動的に注入されるプロパティ
  $page: {
    component: string
    props: InertiaPageProps
    url: string
    version: string | null
  }
}

/**
 * Ziggy ルートヘルパーの型定義
 */
declare global {
  interface Window {
    route: (name: string, params?: Record<string, unknown>) => string
  }

  const route: (name: string, params?: Record<string, unknown>) => string
}
