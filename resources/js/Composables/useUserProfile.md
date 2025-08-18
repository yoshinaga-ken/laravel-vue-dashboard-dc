# useUserProfile.ts Composable仕様書

## 概要

ユーザープロフィール情報を管理するVue 3 Composableです。GraphQLクエリによるデータ取得、フォロー情報の計算、プロフィール所有者判定等の機能を提供します。

## 機能

### データ取得・管理

- **GraphQLクエリ実行**: `GET_USER_PROFILE`クエリによるユーザー情報取得
- **リアクティブデータ**: ユーザー情報の自動更新監視
- **キャッシュ戦略**: `cache-and-network`による効率的なデータ取得

### 計算プロパティ

- **isOwnProfile**: ログインユーザーとの比較による所有者判定
- **followersCount**: フォロワー数の取得
- **followingCount**: フォロー中数の取得
- **articlesCount**: 記事数の取得
- **各種リスト**: 記事・フォロワー・チーム等のリスト提供

## 使用方法

```typescript
import { useUserProfile } from '@/Composables/useUserProfile'

const {
  user,                    // ユーザーデータ
  loading,                 // ローディング状態
  error,                   // エラー状態
  isOwnProfile,            // 自分のプロフィールか
  followersCount,          // フォロワー数
  followingCount,          // フォロー中数
  articlesCount,           // 記事数
  latestArticles,          // 最新記事リスト
  followersList,           // フォロワーリスト
  followingList,           // フォロー中リスト
  ownedTeamsList,          // 所有チームリスト
  joinedTeamsList,         // 参加チームリスト
  refetch,                 // データ再取得
} = useUserProfile(userId)
```

## 技術仕様

### 使用ライブラリ

- **Vue Apollo**: GraphQL通信
- **Inertia.js**: 認証情報取得
- **TypeScript**: 型安全性確保

### GraphQLクエリ

- **クエリ名**: `GET_USER_PROFILE`
- **パラメータ**: `id: ID!`
- **取得データ**: ユーザー基本情報、記事、フォロー情報、チーム情報

## 関連ファイル

- **GraphQLクエリ**: `/resources/js/Graphql/queries/GetUserProfile.ts`
- **型定義**: `/resources/js/Types/types-graphql.d.ts`
