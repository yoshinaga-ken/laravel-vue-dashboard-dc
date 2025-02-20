<script setup>
import {ref} from 'vue';
import {useForm} from '@inertiajs/vue3';
import ActionSection from '@/Components/ActionSection.vue';
import ConfirmationModal from '@/Components/ConfirmationModal.vue';
import DangerButton from '@/Components/DangerButton.vue';
import SecondaryButton from '@/Components/SecondaryButton.vue';

const props = defineProps({
  article: Object,
});

const confirmingArticleDeletion = ref(false);
const form = useForm({});

const confirmArticleDeletion = () => {
  confirmingArticleDeletion.value = true;
};

const onClickArticleDelete = () => {
  // MEMO: リクエスト側で route('articles.index'); へ移動します
  form.delete(route('articles.destroy', props.article), {
    errorBag: 'deleteArticle',
  });
  confirmingArticleDeletion.value = false;
};
</script>

<template>
  <ActionSection>
    <template #title>
      Delete Article
    </template>

    <template #description>
      delete this Article.
    </template>

    <template #content>
      <div class="max-w-xl text-sm text-gray-600 dark:text-gray-400">
        Deleting an Article will permanently delete all data and information relating to that Article.
        Before deleting an Article, be sure to download any data and information relating to the Article you want to
        keep.
      </div>

      <div class="mt-5">
        <DangerButton @click="confirmArticleDeletion">
          Delete Article
        </DangerButton>
      </div>

      <!-- Delete Article Confirmation Modal -->
      <ConfirmationModal :show="confirmingArticleDeletion" @close="confirmingArticleDeletion = false">
        <template #title>
          Delete Article
        </template>

        <template #content>
          Are you sure you want to delete this article?
          Once a article is deleted, all of its resources and data will be permanently deleted.
        </template>

        <template #footer>
          <SecondaryButton @click="confirmingArticleDeletion = false">
            Cancel
          </SecondaryButton>

          <DangerButton
            class="ms-3"
            :class="{ 'opacity-25': form.processing }"
            :disabled="form.processing"
            @click="onClickArticleDelete"
          >
            Delete Article
          </DangerButton>
        </template>
      </ConfirmationModal>
    </template>
  </ActionSection>
</template>
