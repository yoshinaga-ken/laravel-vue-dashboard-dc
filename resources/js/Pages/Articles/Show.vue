<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import UpdateArticleForm from '@/Pages/Articles/Partials/UpdateArticleForm.vue';

defineProps({
  article: Object,
  permissions: Object,
});
</script>

<template>
  <AppLayout title="Article Settings">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
        Article
      </h2>
    </template>

    <div>
      <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <UpdateArticleForm :article="article" :permissions="permissions"/>
      </div>
    </div>
  </AppLayout>
</template>
