<script setup>
import {useForm} from '@inertiajs/vue3';
import ActionMessage from '@/Components/ActionMessage.vue';
import FormSection from '@/Components/FormSection.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import {useTranslation} from "@/Composables/useTranslation.js";

const {t} = useTranslation();

const props = defineProps({
  article: Object,
  permissions: Object,
});

const form = useForm({
  title: props.article.title,
  body: props.article.body,
});

const updateArticle = () => {
  form.put(route('articles.update', props.article), {
    errorBag: 'updateArticle',
    preserveScroll: true,
  });
};
</script>

<template>
  <FormSection @submitted="updateArticle">
    <template #title>
      Article
    </template>

    <template #description>
      <span v-if="permissions.canUpdateArticle">
       edit this Article.
      </span>
    </template>

    <template #form>
      <!-- Article Owner Information -->
      <div class="col-span-6">
        <InputLabel value="Owner"/>

        <div class="flex items-center mt-2">
          <div class="ms-4 leading-tight">
            <div class="text-gray-900 dark:text-white">{{ article.user.name }}</div>
          </div>
        </div>
      </div>

      <!-- Article Title -->
      <div class="col-span-6 sm:col-span-4">
        <InputLabel for="name" :value="`Article ${t('models.article.title')}`"/>

        <TextInput
          id="title"
          v-model="form.title"
          type="text"
          class="mt-1 block w-full"
          :disabled="! permissions.canUpdateArticle"
        />

        <InputError :message="form.errors.title" class="mt-2"/>
      </div>

      <!-- Article Body -->
      <div class="col-span-6 sm:col-span-4">
        <InputLabel for="body" :value="`Article ${t('models.article.body')}`"/>

        <TextInput
          id="body"
          v-model="form.body"
          type="text"
          class="mt-1 block w-full"
          :disabled="! permissions.canUpdateArticle"
        />

        <InputError :message="form.errors.body" class="mt-2"/>
      </div>

    </template>

    <template v-if="permissions.canUpdateArticle" #actions>
      <ActionMessage :on="form.recentlySuccessful" class="me-3">
        Saved.
      </ActionMessage>

      <PrimaryButton :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
        Save
      </PrimaryButton>
    </template>
  </FormSection>
</template>
