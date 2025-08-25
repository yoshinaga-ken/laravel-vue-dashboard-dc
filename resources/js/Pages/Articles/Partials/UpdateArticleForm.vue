<script lang="ts" setup>
import { useForm } from '@inertiajs/vue3'
import ActionMessage from '@/Components/ActionMessage.vue'
import FormSection from '@/Components/FormSection.vue'
import InputError from '@/Components/InputError.vue'
import InputLabel from '@/Components/InputLabel.vue'
import PrimaryButton from '@/Components/PrimaryButton.vue'
import TextInput from '@/Components/TextInput.vue'
import ElTextTagsInput from '@/Components/ElTextTagsInput.vue'
import ElMentionTextarea from '@/Components/ElMentionTextarea.vue'
import { useTranslation } from '@/Composables/useTranslation.js'
import ArticleLikeButton from '@/Components/ArticleLikeButton.vue'
import type { Article, Permission } from '@/Types/types'

const { t } = useTranslation()

const props = defineProps<{
  article: Article
  permissions: Permission
}>()

const form = useForm({
  title: props.article.title,
  body: props.article.body,
  tags: props.article.tags.map(tag => tag.name),
})

const updateArticle = () => {
  form.put(route('articles.update', { id: props.article.id }), {
    errorBag: 'updateArticle',
    preserveScroll: true,
  })
}

const onClickToggleLike = (article: Article) => {
  onClickToggleLikeForm(article)
}
const onClickToggleLikeForm = (article: Article) => {
  article.is_liked_by
    ? form.delete(route('articles.dislike', article.id), {
        errorBag: 'dislikeArticle',
        preserveScroll: true,
        only: ['article'],
      })
    : form.put(route('articles.like', article.id), {
        errorBag: 'likeArticle',
        preserveScroll: true,
        only: ['article'],
      })
}
</script>

<template>
  <FormSection @submitted="updateArticle">
    <template #title> Article </template>

    <template #description>
      <span v-if="permissions.canUpdateArticle"> edit this Article. </span>
    </template>

    <template #form>
      <!-- Article Owner Information -->
      <div class="col-span-6">
        <InputLabel :value="`${t('models.team.owner')}`" />

        <div class="mt-2 flex items-center">
          <img
            class="h-12 w-12 rounded-full object-cover"
            :src="article.user.profile_photo_url"
            :alt="article.user.name"
          />

          <div class="ms-4 leading-tight">
            <div class="text-gray-900 dark:text-white">{{ article.user.name }}</div>
            <div class="text-sm text-gray-700 dark:text-gray-300">
              {{ article.user.email || 'メールアドレス非公開' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Article Title -->
      <div class="col-span-6 sm:col-span-4">
        <InputLabel for="name" :value="`${t('models.article.title')}`" />

        <TextInput
          id="title"
          v-model="form.title"
          type="text"
          class="mt-1 block w-full"
          :disabled="!permissions.canUpdateArticle"
        />

        <InputError :message="form.errors.title" class="mt-2" />
      </div>

      <!-- Article Likes -->
      <div class="col-span-6 sm:col-span-4">
        <InputLabel for="name" :value="`${t('models.article.likes')}`" />

        <ArticleLikeButton
          :article="article"
          :is-user-list="true"
          @click="onClickToggleLike(article)"
        />
      </div>

      <!-- Article Tags -->
      <div class="col-span-6 sm:col-span-4">
        <InputLabel for="tags" :value="`🔖${t('models.article.tags')}`" />
        <ElTextTagsInput
          id="tags"
          v-model="form.tags"
          type="text"
          class="mt-1 block w-full"
          :disabled="!permissions.canUpdateArticle"
        />

        <InputError :message="form.errors.tags" class="mt-2" />
        <div v-for="(tag, index) in form.tags" :key="index">
          <InputError
            :message="
              form.errors[`tags.${index}`] === undefined
                ? ''
                : '「' + tag + '」 : ' + form.errors[`tags.${index}`]
            "
            class="mt-2"
          />
        </div>
      </div>

      <!-- Article Body -->
      <div class="col-span-6 sm:col-span-4">
        <InputLabel for="body" :value="`${t('models.article.body')}`" />

        <ElMentionTextarea
          id="body"
          v-model="form.body"
          class="mt-1 block w-full"
          :rows="6"
          :disabled="!permissions.canUpdateArticle"
          placeholder="記事本文を入力してください。@でユーザー、#でタグを補完できます。"
        />

        <InputError :message="form.errors.body" class="mt-2" />
      </div>
    </template>

    <template v-if="permissions.canUpdateArticle" #actions>
      <ActionMessage :on="form.recentlySuccessful" class="me-3"> Saved. </ActionMessage>

      <PrimaryButton :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
        Save
      </PrimaryButton>
    </template>
  </FormSection>
</template>
