# UserFollowInfo.vue コンポーネント仕様書

## 概要

ユーザーのフォロー情報を表示するUIコンポーネントです。フォロワー数・フォロー中数の統計表示と、各リストの展開可能な詳細表示機能を提供します。

## 機能

### 表示項目

- **フォロワー数**: 統計カード形式でカウント表示
- **フォロー中数**: 統計カード形式でカウント表示
- **フォロワー一覧**: 展開可能なコラプス形式でユーザーリスト表示
- **フォロー中一覧**: 展開可能なコラプス形式でユーザーリスト表示

### インタラクション機能

- **リスト展開/折りたたみ**: フォロワー・フォロー中リストの表示切り替え
- **アバター表示**: 各ユーザーのプロフィール写真または代替文字
- **ユーザー名表示**: リンク可能なユーザー名表示

### 状態管理

- **ローディング状態**: データ取得中のスピナー表示
- **展開状態**: フォロワー・フォロー中リストの開閉状態管理
- **空状態**: フォロワー・フォロー中がいない場合の適切なメッセージ表示

## Props

```typescript
interface Props {
  followersCount: number    // フォロワー数（必須）
  followingCount: number    // フォロー中数（必須）
  followersList: User[]     // フォロワーリスト（必須）
  followingList: User[]     // フォロー中リスト（必須）
  loading?: boolean         // ローディング状態（オプション）
}
```

## 技術仕様

### 使用コンポーネント

- **ElCard**: メインコンテナ
- **ElCollapse/ElCollapseItem**: 展開可能なリスト表示
- **ElAvatar**: ユーザープロフィール写真
- **ElButton**: 展開/折りたたみボタン
- **ElIcon**: 矢印アイコン（ArrowDown/ArrowUp）

### リアクティブ状態

- **followersExpanded**: フォロワーリストの展開状態
- **followingExpanded**: フォロー中リストの展開状態

### 計算プロパティ・メソッド

- **getDisplayName()**: ユーザー名の安全な取得（フォールバック付き）
- **toggleFollowers()**: フォロワーリスト表示切り替え
- **toggleFollowing()**: フォロー中リスト表示切り替え

## レスポンシブ対応

- **統計表示**: 2列グリッドレイアウト
- **ユーザーリスト**: 可変グリッド（1-4列、画面サイズに応じて調整）
- **アバターサイズ**: 40px固定

## スタイリング

- **統計カード**: 背景色付きのカード（ダークモード対応）
- **数値表示**: 大きなフォントサイズでの強調表示
- **リストアイテム**: hover効果付きのインタラクティブな表示
- **アニメーション**: 展開/折りたたみ時のスムーズなトランジション

## アクセシビリティ

- **キーボードナビゲーション**: Tab/Enterキーでの操作対応
- **スクリーンリーダー**: 適切なaria-label設定
- **色のコントラスト**: WCAG AA基準適合

## Storybook

- **開発環境URL**: `http://localhost:6006/?path=/docs/users-userfollowinfo--docs`
- **ストーリーバリエーション**:
  - Default: 標準的なフォロー情報表示
  - Loading: ローディング状態
  - NoFollows: フォロワー・フォロー中が0の状態
  - ManyFollows: 多数のフォロー情報がある状態
- **Interaction tests**: リスト展開/折りたたみの自動テスト実装済み

## 使用例

```vue
<template>
  <UserFollowInfo
    :followers-count="followersCount"
    :following-count="followingCount"
    :followers-list="followersList"
    :following-list="followingList"
    :loading="isLoading"
  />
</template>

<script setup>
import UserFollowInfo from '@/Components/Users/UserFollowInfo.vue'
import { useUserProfile } from '@/Composables/useUserProfile'

const {
  followersCount,
  followingCount,
  followersList,
  followingList,
  loading: isLoading
} = useUserProfile(userId)
</script>
```

## イベント

現在は表示専用コンポーネントですが、将来的に以下のイベント発行を検討：

- **@user-click**: ユーザーリスト項目クリック時
- **@view-all-followers**: 全フォロワー表示リクエスト
- **@view-all-following**: 全フォロー中表示リクエスト

## 関連コンポーネント

- **UserBasicInfo.vue**: ユーザー基本情報表示
- **UserActionButtons.vue**: フォロー/アンフォローボタン
- **Pages/Users/Show.vue**: メインページで使用

## 今後の拡張

- **ページネーション**: 大量フォロワー対応
- **検索機能**: フォロワー・フォロー中の検索
- **ソート機能**: 名前順・フォロー日時順等の並び替え
- **フィルタ機能**: オンライン/オフライン等の状態フィルタ
- **相互フォロー表示**: 相互フォロー関係の視覚的表示
