# UserActionButtons.vue コンポーネント仕様書

## 概要

ユーザープロフィール画面のアクションボタンを提供するUIコンポーネントです。フォロー/アンフォロー機能、プロフィール編集リンク等のユーザーアクションを適切な権限制御の下で表示・実行します。

## 機能

### 表示ボタン

#### 他ユーザーの場合

- **フォローボタン**: 未フォローユーザーに対する「フォローする」ボタン
- **フォロー中ボタン**: フォロー済みユーザーに対する「フォロー中」ボタン（アンフォロー可能）

#### 自分のプロフィールの場合

- **プロフィール編集ボタン**: プロフィール編集ページへのリンク

### フォロー機能

- **フォロー実行**: REST API経由でのフォロー関係作成
- **アンフォロー実行**: REST API経由でのフォロー関係削除
- **リアルタイム状態更新**: アクション実行後の即座な状態反映
- **エラーハンドリング**: API呼び出し失敗時の適切なエラー表示

### 状態管理

- **フォロー状態判定**: GraphQLクエリによる現在のフォロー状態確認
- **ローディング状態**: API呼び出し中の無効化・スピナー表示
- **権限制御**: 自分自身のプロフィールでのフォローボタン非表示

## Props

```typescript
interface Props {
  targetUser: User          // 対象ユーザー（必須）
  isOwnProfile: boolean     // 自分のプロフィールかどうか（必須）
  loading?: boolean         // ローディング状態（オプション）
}
```

## Events

```typescript
interface Emits {
  'follow-success': [user: User]      // フォロー成功時
  'unfollow-success': [user: User]    // アンフォロー成功時
}
```

## 技術仕様

### 使用コンポーネント

- **ElButton**: アクションボタン（primary/default種類）
- **ElIcon**: ボタン内アイコン（Plus/Check/Edit/UserFilled）
- **ElMessage**: 成功・エラーメッセージ表示
- **Link (Inertia.js)**: プロフィール編集ページリンク

### API通信

#### GraphQLクエリ

- **GET_CURRENT_USER_FOLLOWING**: ログインユーザーのフォローリスト取得
- **フェッチポリシー**: `cache-and-network`

#### REST APIエンドポイント

- **フォロー**: `PUT /api/users/{user}/follow`
- **アンフォロー**: `DELETE /api/users/{user}/unfollow`

### リアクティブ状態

- **isFollowing**: フォロー状態のリアクティブ参照
- **form**: Inertia.js フォーム状態
- **updateFollowState()**: フォロー状態の更新ロジック

## スタイリング

- **ボタンサイズ**: Large サイズ
- **ボタンタイプ**:
  - フォロー: Primary（青色）
  - フォロー中: Default（グレー系）
  - プロフィール編集: Primary（青色）
- **アイコン**: 各アクションに対応した視覚的アイコン
- **無効状態**: ローディング中の適切な無効化表示

## エラーハンドリング

- **ネットワークエラー**: 接続失敗時のメッセージ表示
- **認証エラー**: 権限不足時のメッセージ表示
- **一般エラー**: その他API呼び出し失敗時のフォールバック

## Storybook

- **開発環境URL**: `http://localhost:6006/?path=/docs/users-useractionbuttons--docs`
- **ストーリーバリエーション**:
  - Default: 他ユーザー・未フォロー状態
  - Following: 他ユーザー・フォロー中状態
  - OwnProfile: 自分のプロフィール（編集ボタン）
  - Loading: ローディング状態
- **Interaction tests**: フォロー/アンフォローの自動テスト実装済み

## 使用例

```vue
<template>
  <UserActionButtons
    :target-user="user"
    :is-own-profile="isOwnProfile"
    :loading="loading"
    @follow-success="handleFollowSuccess"
    @unfollow-success="handleUnfollowSuccess"
  />
</template>

<script setup>
import UserActionButtons from '@/Components/Users/UserActionButtons.vue'
import { useUserProfile } from '@/Composables/useUserProfile'

const { user, isOwnProfile, loading } = useUserProfile(userId)

const handleFollowSuccess = (user) => {
  // フォロー成功後の処理（例：データ再取得）
}

const handleUnfollowSuccess = (user) => {
  // アンフォロー成功後の処理（例：データ再取得）
}
</script>
```

## セキュリティ考慮

- **CSRF保護**: Laravelの標準CSRF保護適用
- **認証確認**: Sanctum認証によるAPI保護
- **自己フォロー防止**: 自分自身のフォローボタン非表示
- **重複防止**: API呼び出し中のボタン無効化

## パフォーマンス最適化

- **条件付きクエリ**: 自分のプロフィールでのGraphQLクエリスキップ
- **キャッシュ活用**: GraphQLキャッシュによる重複リクエスト防止
- **楽観的UI更新**: API応答前の即座な状態変更

## 関連コンポーネント

- **UserBasicInfo.vue**: ユーザー基本情報表示
- **UserFollowInfo.vue**: フォロー統計情報（更新対象）
- **Pages/Users/Show.vue**: メインページで使用

## 今後の拡張

- **ブロック機能**: ユーザーブロック・ブロック解除
- **通報機能**: 不適切ユーザーの通報
- **メッセージ機能**: ダイレクトメッセージ送信
- **共有機能**: プロフィールURLの共有
- **お気に入り機能**: ユーザーのお気に入り登録
