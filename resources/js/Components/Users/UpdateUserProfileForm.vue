<script lang="ts" setup>
  import { ref, computed, watch } from 'vue'
  import { ElForm, ElFormItem, ElInput, ElButton, ElAvatar, ElMessage, ElMessageBox } from 'element-plus'
  import { useUpdateUser, type UpdateUserInput } from '@/Composables/useUpdateUser'
  import { useUserProfile } from '@/Composables/useUserProfile'
  import type { User } from '@/Types/types-graphql'

  const props = defineProps<{
    userId: string | number
  }>()

  const emit = defineEmits<{
    updated: [user: User]
  }>()

  // ユーザープロフィール取得
  const { user, loading: loadingUser, refetch } = useUserProfile(props.userId)

  // 更新用Composable
  const { updateUser, isUpdating, error: updateError } = useUpdateUser()

  // フォームデータ
  const formData = ref<UpdateUserInput>({
    name: '',
    email: '',
  })

  // フォームバリデーションルール
  const rules = {
    name: [
      { required: true, message: '名前を入力してください', trigger: 'blur' },
      { max: 255, message: '名前は255文字以内で入力してください', trigger: 'blur' },
    ],
    email: [
      { required: true, message: 'メールアドレスを入力してください', trigger: 'blur' },
      { type: 'email', message: '有効なメールアドレスを入力してください', trigger: 'blur' },
      { max: 255, message: 'メールアドレスは255文字以内で入力してください', trigger: 'blur' },
    ],
  }

  const formRef = ref<InstanceType<typeof ElForm>>()

  // ユーザーデータが読み込まれたらフォームに反映
  watch(
    user,
    newUser => {
      if (newUser) {
        formData.value = {
          name: newUser.name || '',
          email: newUser.email || '',
        }
      }
    },
    { immediate: true }
  )

  // フォーム送信
  const handleSubmit = async () => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()

      const updatedUser = await updateUser(props.userId, formData.value)

      if (updatedUser) {
        ElMessage.success('プロフィール情報を更新しました')
        emit('updated', updatedUser)
        // ユーザーデータを再取得
        await refetch()
      }
    } catch (err) {
      console.error('Update user profile failed:', err)
      if (err instanceof Error) {
        ElMessage.error(err.message || 'プロフィール情報の更新に失敗しました')
      } else {
        ElMessage.error('プロフィール情報の更新に失敗しました')
      }
    }
  }

  // フォームリセット
  const handleReset = () => {
    if (user.value) {
      formData.value = {
        name: user.value.name || '',
        email: user.value.email || '',
      }
    }
    formRef.value?.clearValidate()
  }

  const isLoading = computed(() => loadingUser.value || isUpdating.value)
</script>

<template>
  <div v-if="loadingUser" class="flex items-center justify-center p-8">
    <span>読み込み中...</span>
  </div>

  <div v-else-if="!user" class="p-8 text-center text-gray-500">
    ユーザー情報を取得できませんでした
  </div>

  <ElForm
    v-else
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="120px"
    label-position="top"
    class="max-w-2xl"
  >
    <!-- プロフィール写真表示 -->
    <ElFormItem label="プロフィール写真">
      <div class="flex items-center gap-4">
        <ElAvatar :size="80" :src="user.profile_photo_url" :alt="user.name">
          {{ user.name?.charAt(0) }}
        </ElAvatar>
        <div class="text-sm text-gray-500">
          <p>プロフィール写真の変更は、プロフィール設定ページから行えます。</p>
        </div>
      </div>
    </ElFormItem>

    <!-- 名前 -->
    <ElFormItem label="名前" prop="name">
      <ElInput v-model="formData.name" placeholder="名前を入力" :disabled="isLoading" />
    </ElFormItem>

    <!-- メールアドレス -->
    <ElFormItem label="メールアドレス" prop="email">
      <ElInput
        v-model="formData.email"
        type="email"
        placeholder="メールアドレスを入力"
        :disabled="isLoading"
      />
    </ElFormItem>

    <!-- エラーメッセージ表示 -->
    <div v-if="updateError" class="mb-4 text-sm text-red-500">
      {{ updateError.message || 'エラーが発生しました' }}
    </div>

    <!-- ボタン -->
    <ElFormItem>
      <div class="flex gap-2">
        <ElButton type="primary" :loading="isUpdating" @click="handleSubmit"> 保存 </ElButton>
        <ElButton :disabled="isUpdating" @click="handleReset"> リセット </ElButton>
      </div>
    </ElFormItem>
  </ElForm>
</template>

<style scoped>
  .max-w-2xl {
    max-width: 42rem;
  }
</style>

