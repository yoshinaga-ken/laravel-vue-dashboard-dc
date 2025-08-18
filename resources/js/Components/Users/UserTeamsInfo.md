# UserTeamsInfo.vue コンポーネント仕様書

## 概要

ユーザーのチーム情報を表示するUIコンポーネントです。所有チーム・参加チーム・現在のチーム情報を整理して表示し、チーム詳細ページへのナビゲーション機能を提供します。

## 機能

### 表示項目

- **所有チーム一覧**: ユーザーが作成・管理しているチームのリスト
- **参加チーム一覧**: ユーザーが参加しているチームのリスト
- **現在のチーム**: アクティブなチームの強調表示
- **パーソナルチーム判定**: 個人チームの特別表示

### インタラクション機能

- **チーム詳細遷移**: チーム名クリックで詳細ページへ遷移
- **現在チーム表示**: 現在アクティブなチームの視覚的強調

## Props

```typescript
interface Props {
  ownedTeams: Team[]        // 所有チームリスト（必須）
  joinedTeams: Team[]       // 参加チームリスト（必須）
  currentTeamId?: number    // 現在のチームID（オプション）
  loading?: boolean         // ローディング状態（オプション）
}
```

## Events

```typescript
interface Emits {
  'team-click': [teamId: string]    // チームクリック時
}
```

## 技術仕様

### 使用コンポーネント

- **ElCard**: メインコンテナ
- **ElTag**: チーム表示用タグ
- **ElDivider**: セクション区切り
- **ElEmpty**: チーム情報がない場合の空状態表示

### 特殊表示ロジック

- **現在チーム判定**: `currentTeamId`による現在チームの強調表示
- **パーソナルチーム**: `personal_team`フラグによる個人チーム表示
- **所有者権限**: 所有チームと参加チームの視覚的区別

## Storybook

- **開発環境URL**: `http://localhost:6006/?path=/docs/users-userteamsinfo--docs`
- **ストーリーバリエーション**: Default, Loading, NoTeams, ManyTeams
- **Interaction tests**: チームクリックの自動テスト実装済み

## 関連コンポーネント

- **UserBasicInfo.vue**: ユーザー基本情報表示
- **Pages/Users/Show.vue**: メインページで使用

## 今後の拡張

- **チーム作成機能**: 新規チーム作成ボタン
- **チーム切り替え**: 現在チームの変更機能
- **チーム招待**: メンバー招待機能
- **チーム統計**: メンバー数・活動状況等の表示
