# useUserFollow.ts Composable仕様書

## 概要

ユーザーフォロー機能を管理するVue 3 Composableです。フォロー・アンフォロー操作、フォロー状態管理、API呼び出しエラーハンドリング等の機能を提供します。

## 機能

### フォロー操作

- **followUser()**: 指定ユーザーのフォロー実行
- **unfollowUser()**: 指定ユーザーのアンフォロー実行
- **toggleFollow()**: フォロー状態に応じた切り替え実行

### 状態管理

- **isFollowing**: 現在のフォロー状態
- **isLoading**: API呼び出し中の状態
- **エラーハンドリング**: API失敗時の適切なエラー処理

## 使用方法

```typescript
import { useUserFollow } from '@/Composables/useUserFollow'

const {
  isFollowing,       // フォロー状態
  isLoading,         // ローディング状態
  followUser,        // フォロー実行
  unfollowUser,      // アンフォロー実行
  toggleFollow,      // フォロー切り替え
} = useUserFollow()

// フォロー実行
await followUser(userId)

// フォロー状態切り替え
await toggleFollow(userId)
```

## 技術仕様

### API通信

- **フォロー**: `PUT /api/users/{user}/follow`
- **アンフォロー**: `DELETE /api/users/{user}/unfollow`
- **HTTPクライアント**: Axios使用
- **ルーティング**: Ziggy route helper使用

### エラーハンドリング

- **ネットワークエラー**: 接続失敗時の処理
- **認証エラー**: 権限不足時の処理
- **一般エラー**: その他API呼び出し失敗の処理

## 関連コンポーネント

- **UserActionButtons.vue**: メインで使用するコンポーネント
