<script lang="ts" setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import SectionBorder from '@/Components/SectionBorder.vue'
import UpdateArticleForm from '@/Pages/Articles/Partials/UpdateArticleForm.vue'
import DeleteArticleForm from '@/Pages/Articles/Partials/DeleteArticleForm.vue'
import type { Article, Permission } from '@/Types/types'

defineProps<{
  article: Article
  permissions: Permission
}>()
</script>

<template>
  <AppLayout title="Article Settings">
    <template #header>
      <h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
        Article Settings
      </h2>
    </template>

    <div>
      <div class="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
        <UpdateArticleForm :article="article" :permissions="permissions" />
        <template v-if="permissions.canDeleteArticle">
          <SectionBorder />

          <DeleteArticleForm class="mt-10 sm:mt-0" :article="article" />
        </template>
      </div>
    </div>
  </AppLayout>
</template>
