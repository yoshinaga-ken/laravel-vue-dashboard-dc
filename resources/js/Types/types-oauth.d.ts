/**
 * OAuth プロバイダー型定義
 */

/**
 * サポートされている OAuth プロバイダー
 */
export type OAuthProvider = 'google' | 'github'

/**
 * OAuth アカウント情報
 */
export interface OAuthAccount {
  id: number
  user_id: number
  provider: OAuthProvider
  provider_id: string
  expires_at: string | null
  created_at: string
  updated_at: string
}

/**
 * OAuthButtons コンポーネントの Props
 */
export interface OAuthButtonsProps {
  /**
   * 表示する OAuth プロバイダーのリスト
   * @default ['google', 'github']
   */
  providers?: OAuthProvider[]
}
