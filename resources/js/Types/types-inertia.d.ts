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
 * 元の Ziggy の型定義を簡略化したもの
 */

// ルートパラメーターの型定義
type RawParameterValue = string | number
type DefaultRoutable = { id: RawParameterValue } & Record<string, unknown>
type ParameterValue = RawParameterValue | DefaultRoutable
type RouteParams = Record<string, unknown> | unknown[]

// Router インターフェース（簡略版）
interface SimpleRouter {
  current(): string | undefined
  current(name: string, params?: ParameterValue | RouteParams): boolean
  readonly params: Record<string, string>
  readonly routeParams: Record<string, string>
  readonly queryParams: Record<string, unknown>
  has(name: string): boolean
}

declare global {
  interface Window {
    route: {
      (): SimpleRouter
      (name: string, params?: ParameterValue | RouteParams, absolute?: boolean): string
    }
  }

  const route: {
    (): SimpleRouter
    (name: string, params?: ParameterValue | RouteParams, absolute?: boolean): string
  }
}
