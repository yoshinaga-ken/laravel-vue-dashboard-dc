# UserBasicInfo.vue コンポーネント仕様書

## 概要

ユーザーの基本情報を表示するUIコンポーネントです。プロフィール写真、名前、メールアドレス、登録日等の基本的なユーザー情報を視覚的に整理して表示します。

## 機能

### 表示項目

- **プロフィール写真**: アバター表示（画像がない場合は名前の頭文字を表示）
- **ユーザー名**: フルネーム表示
- **メールアドレス**: ユーザーのメールアドレス
- **ユーザーID**: 一意識別子
- **登録日**: アカウント作成日（日本語フォーマット）
- **最終更新日**: プロフィール最終更新日（日本語フォーマット）
- **現在のチームID**: 所属中のチーム識別子（存在する場合のみ）

### 状態管理

- **ローディング状態**: データ取得中のスピナー表示
- **エラー状態**: データ読み込み失敗時のメッセージ表示
- **正常状態**: 取得したユーザー情報の完全表示

## Props

```typescript
interface Props {
  user: User                // ユーザーデータ（必須）
  loading?: boolean         // ローディング状態（オプション）
}
```

## 技術仕様

### 使用コンポーネント

- **ElCard**: メインコンテナ
- **ElAvatar**: プロフィール写真表示
- **ElDivider**: セクション区切り

### スタイリング

- **Tailwind CSS**: レスポンシブデザイン・ダークモード対応
- **グリッドレイアウト**: モバイル1列・デスクトップ2列
- **カード型デザイン**: hover効果付きのシャドウ

### 計算プロパティ

- **formattedCreatedAt**: 登録日の日本語フォーマット
- **formattedUpdatedAt**: 更新日の日本語フォーマット  
- **avatarFallback**: プロフィール写真がない場合の代替文字

## レスポンシブ対応

- **モバイル**: 単列レイアウト
- **デスクトップ**: 詳細情報を2列グリッドで表示
- **アバターサイズ**: 80px固定

## アクセシビリティ

- **alt属性**: プロフィール写真にユーザー名を設定
- **セマンティック HTML**: dt/dd要素によるデータ構造化
- **ダークモード**: 自動的にテーマに対応

## Storybook

- **開発環境URL**: `http://localhost:6006/?path=/docs/users-userbasicinfo--docs`
- **ストーリーバリエーション**: Default, Loading, WithProfilePhoto, NoProfilePhoto
- **Interaction tests**: プロフィール情報表示の自動テスト実装済み

## 使用例

```vue
<template>
  <UserBasicInfo
    :user="userProfile"
    :loading="isLoading"
  />
</template>

<script setup>
import UserBasicInfo from '@/Components/Users/UserBasicInfo.vue'
import { useUserProfile } from '@/Composables/useUserProfile'

const { user: userProfile, loading: isLoading } = useUserProfile(userId)
</script>
```

## 関連コンポーネント

- **UserActionButtons.vue**: ユーザーアクションボタン
- **UserFollowInfo.vue**: フォロー情報表示
- **Pages/Users/Show.vue**: メインページで使用

## 今後の拡張

- **編集モード**: インライン編集機能
- **ソーシャルリンク**: SNSアカウント情報表示
- **ステータス表示**: オンライン/オフライン状態
- **バッジ系機能**: 認証済みアカウント等のバッジ表示
