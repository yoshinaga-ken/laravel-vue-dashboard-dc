import { ref, computed, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { usePage } from '@inertiajs/vue3'
import type { User } from '@/Types/types-graphql'
import { GET_USER_PROFILE } from '@/Graphql/queries/GetUserProfile'

export function useUserProfile(userId: string | number) {
  const user = ref<User | null>(null)
  const page = usePage()

  const { result, loading, error, refetch } = useQuery(
    GET_USER_PROFILE,
    () => ({
      id: String(userId),
    }),
    {
      fetchPolicy: 'cache-and-network', // キャッシュがあっても必ずネットワークリクエストを実行
    }
  )

  // ユーザーデータの更新監視
  watch(result, newResult => {
    if (newResult?.user) {
      user.value = newResult.user
    }
  })

  // 計算されたプロパティ
  const isOwnProfile = computed((): boolean => {
    try {
      const currentUserId = (page.props as { auth?: { user?: { id?: number } } })?.auth?.user?.id
      const result = Boolean(currentUserId && String(currentUserId) === String(userId))
      return result
    } catch {
      return false
    }
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
