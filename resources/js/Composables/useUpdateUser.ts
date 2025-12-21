import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { UPDATE_USER } from '@/Graphql/mutations/UpdateUser'
import type { User } from '@/Types/types-graphql'

export interface UpdateUserInput {
  name?: string
  email?: string
}

export function useUpdateUser() {
  const isUpdating = ref(false)
  const error = ref<Error | null>(null)

  const { mutate, onDone, onError } = useMutation<
    { updateUser: User },
    { id: string; input: UpdateUserInput }
  >(UPDATE_USER)

  onDone(result => {
    isUpdating.value = false
    if (result.data?.updateUser) {
      // 成功時の処理は呼び出し側で行う
    }
  })

  onError(err => {
    isUpdating.value = false
    error.value = err
    console.error('Update user failed:', err)
  })

  const updateUser = async (
    userId: string | number,
    input: UpdateUserInput
  ): Promise<User | null> => {
    try {
      isUpdating.value = true
      error.value = null

      const result = await mutate({
        id: String(userId),
        input,
      })

      return result?.data?.updateUser || null
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  return {
    updateUser,
    isUpdating,
    error,
  }
}
