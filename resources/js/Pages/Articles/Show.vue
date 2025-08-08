<script lang="ts" setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import UpdateArticleForm from '@/Pages/Articles/Partials/UpdateArticleForm.vue'
import type { Article, Permission } from '@/Types/types'

defineProps<{
  article: Article
  permissions: Permission
}>()
</script>

<template>
  <AppLayout title="Article Settings">
    <template #header>
      <h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Article</h2>
    </template>

    <div>
      <div class="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
        <UpdateArticleForm :article="article" :permissions="permissions" />
      </div>
    </div>
  </AppLayout>
</template>
