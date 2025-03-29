<script setup>
import {useForm} from '@inertiajs/vue3';
import FormSection from '@/Components/FormSection.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import ElTextTagsInput from "@/Components/ElTextTagsInput.vue";
import {useTranslation} from "@/Composables/useTranslation.js";

const {t} = useTranslation();

const form = useForm({
  title: '',
  body: '',
  tags: [],
});

const createArticle = () => {
  form.post(route('articles.store'), {
    errorBag: 'createArticle',
    preserveScroll: true,
  });
};
</script>

<template>
  <FormSection @submitted="createArticle">
    <template #title>
      Article Details
    </template>

    <template #description>
      Create a new Article
    </template>

    <template #form>
      <div class="col-span-6">
        <InputLabel value="Article Owner"/>

        <div class="flex items-center mt-2">
          <img class="object-cover w-12 h-12 rounded-full" :src="$page.props.auth.user.profile_photo_url"
               :alt="$page.props.auth.user.name">

          <div class="ms-4 leading-tight">
            <div class="text-gray-900 dark:text-white">{{ $page.props.auth.user.name }}</div>
            <div class="text-sm text-gray-700 dark:text-gray-300">
              {{ $page.props.auth.user.email }}
            </div>
          </div>
        </div>
      </div>

      <!-- Article Title -->
      <div class="col-span-6 sm:col-span-4">
        <InputLabel for="title" :value="`Article ${t('models.article.title')}`"/>
        <TextInput
          id="title"
          v-model="form.title"
          type="text"
          class="block w-full mt-1"
          autofocus
        />
        <InputError :message="form.errors.title" class="mt-2"/>
      </div>

      <!-- Article Tags -->
      <div class="col-span-6 sm:col-span-4">
        <InputLabel for="tags" :value="`${t('models.article.tags')}`"/>
        <ElTextTagsInput
          id="tags"
          v-model="form.tags"
          type="text"
          class="mt-1 block w-full"
        />

        <InputError :message="form.errors.tags" class="mt-2"/>
        <div v-for="(tag, index) in form.tags" :key="index">
          <InputError
            :message="form.errors[`tags.${index}`]===undefined ? '' : ('「' + tag + '」 : ' + form.errors[`tags.${index}`])"
            class="mt-2"/>
        </div>
      </div>

      <!-- Article Body -->
      <div class="col-span-6 sm:col-span-4">
        <InputLabel for="body" :value="`${t('models.article.body')}`"/>
        <TextInput
          id="body"
          v-model="form.body"
          type="text"
          class="block w-full mt-1"
        />
        <InputError :message="form.errors.body" class="mt-2"/>
      </div>
    </template>

    <template #actions>
      <PrimaryButton :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
        Create
      </PrimaryButton>
    </template>
  </FormSection>
</template>
