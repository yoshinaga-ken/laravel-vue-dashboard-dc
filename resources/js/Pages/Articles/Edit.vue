<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import SectionBorder from '@/Components/SectionBorder.vue';
import UpdateArticleForm from '@/Pages/Articles/Partials/UpdateArticleForm.vue';
import DeleteArticleForm from "@/Pages/Articles/Partials/DeleteArticleForm.vue";

defineProps({
  article: Object,
  availableRoles: Array,
  permissions: Object,
});
</script>

<template>
  <AppLayout title="Article Settings">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
        Article Settings
      </h2>
    </template>

    <div>
      <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <UpdateArticleForm :article="article" :permissions="permissions"/>
        <template v-if="permissions.canDeleteArticle && ! article.personal_team">
          <SectionBorder/>

          <DeleteArticleForm class="mt-10 sm:mt-0" :article="article"/>
        </template>
      </div>
    </div>
  </AppLayout>
</template>
