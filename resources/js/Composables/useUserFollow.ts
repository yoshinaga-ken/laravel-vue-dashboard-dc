import { ref } from 'vue'
import axios from '@/Utils/axios.js'

export function useUserFollow() {
  const isFollowing = ref(false)
  const isLoading = ref(false)

  const followUser = async (userId: number) => {
    try {
      isLoading.value = true
      const response = await axios.put(route('api.users.follow', { id: userId }))
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
      const response = await axios.delete(route('api.users.unfollow', { id: userId }))
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
