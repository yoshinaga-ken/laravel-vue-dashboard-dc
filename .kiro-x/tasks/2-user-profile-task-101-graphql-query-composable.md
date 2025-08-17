# TASK-101: GraphQLクエリとComposableの実装

## タスク概要

ユーザープロフィール画面で使用するGraphQLクエリと、それを使いやすくするComposableを実装する。

## 依存関係

- 依存タスク: なし
- このタスクに依存するタスク: TASK-201, TASK-202, TASK-203, TASK-204, TASK-205, TASK-301

## 実装内容

### 1. GraphQLクエリの定義

#### ファイル: `resources/js/graphql/queries/GetUserProfile.ts`

```typescript
import { gql } from 'graphql-tag'

export const GET_USER_PROFILE = gql`
  query GetUserProfile($id: ID!) {
    user(id: $id) {
      id
      name
      email
      current_team_id
      profile_photo_path
      profile_photo_url
      created_at
      updated_at
      articles(first: 10, page: 1) {
        paginatorInfo {
          count
          total
          currentPage
          lastPage
        }
        data {
          id
          title
          body
          tags {
            id
            name
          }
        }
      }
      followers(first: 12, page: 1) {
        paginatorInfo {
          count
          total
        }
        data {
          id
          name
          profile_photo_url
        }
      }
      following(first: 12, page: 1) {
        paginatorInfo {
          count
          total
        }
        data {
          id
          name
          profile_photo_url
        }
      }
      ownedTeams {
        id
        name
        personal_team
      }
      teams {
        id
        name
        personal_team
      }
    }
  }
`
```

### 2. ユーザープロフィール用Composableの実装

#### ファイル: `resources/js/Composables/useUserProfile.ts`

```typescript
import { ref, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import type { User } from '@/Types/types-graphql'
import { GET_USER_PROFILE } from '@/Graphql/queries/GetUserProfile'

export function useUserProfile(userId: string | number) {
  const user = ref<User | null>(null)

  const { result, loading, error, refetch } = useQuery(GET_USER_PROFILE, {
    id: String(userId),
    fetchPolicy: 'network-only',
  })

  // ユーザーデータの更新監視
  watch(result, newResult => {
    if (newResult?.user) {
      user.value = newResult.user
    }
  })

  // 計算されたプロパティ
  const isOwnProfile = computed(() => {
    // TODO: ログインユーザーIDとの比較ロジックを実装
    return false
  })

  const followersCount = computed(() => {
    return user.value?.followers?.paginatorInfo?.total || 0
  })

  const followingCount = computed(() => {
    return user.value?.following?.paginatorInfo?.total || 0
  })

  const articlesCount = computed(() => {
    return user.value?.articles?.paginatorInfo?.total || 0
  })

  const latestArticles = computed(() => {
    return user.value?.articles?.data || []
  })

  const followersList = computed(() => {
    return user.value?.followers?.data || []
  })

  const followingList = computed(() => {
    return user.value?.following?.data || []
  })

  const ownedTeamsList = computed(() => {
    return user.value?.ownedTeams || []
  })

  const joinedTeamsList = computed(() => {
    return user.value?.teams || []
  })

  return {
    // データ
    user,

    // 状態
    loading,
    error,

    // 計算されたプロパティ
    isOwnProfile,
    followersCount,
    followingCount,
    articlesCount,
    latestArticles,
    followersList,
    followingList,
    ownedTeamsList,
    joinedTeamsList,

    // メソッド
    refetch,
  }
}
```

### 3. フォローアクション用Composableの実装

#### ファイル: `resources/js/Composables/useUserFollow.ts`

```typescript
import { ref } from 'vue'
import axios from 'axios'
import { route } from '../../../../../vendor/tightenco/ziggy'

export function useUserFollow() {
  const isFollowing = ref(false)
  const isLoading = ref(false)

  const followUser = async (userId: number) => {
    try {
      isLoading.value = true
      const response = await axios.put(route('api.users.follow', { user: userId }))
      isFollowing.value = true
      return response.data
    } catch (error) {
      console.error('Follow user failed:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const unfollowUser = async (userId: number) => {
    try {
      isLoading.value = true
      const response = await axios.delete(route('api.users.unfollow', { user: userId }))
      isFollowing.value = false
      return response.data
    } catch (error) {
      console.error('Unfollow user failed:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const toggleFollow = async (userId: number) => {
    if (isFollowing.value) {
      await unfollowUser(userId)
    } else {
      await followUser(userId)
    }
  }

  return {
    isFollowing,
    isLoading,
    followUser,
    unfollowUser,
    toggleFollow,
  }
}
```

## 技術仕様

### TypeScript型定義

- 既存の `resources/js/Types/types-graphql.d.ts` の型定義を使用
- 必要に応じて型定義を追加

### エラーハンドリング

- GraphQLエラーとネットワークエラーの適切な処理
- ユーザーに分かりやすいエラーメッセージの提供

### パフォーマンス考慮

- `fetchPolicy: 'network-only'` でキャッシュ戦略を制御
- 不要な再レンダリングを避けるための最適化

## テスト要件

- GraphQLクエリの正常系・異常系テスト
- Composableの各メソッドの単体テスト
- フォロー/アンフォロー機能のテスト

## 完了条件

- [ ] GraphQLクエリファイルが作成されている
- [ ] useUserProfile Composableが実装されている
- [ ] useUserFollow Composableが実装されている
- [ ] TypeScriptエラーがない
- [ ] ESLintエラーがない
- [ ] 基本的な動作確認が完了している
