<script lang="ts" setup>
/**
 * 記事編集フォーム(API版)
 */
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { Link } from '@inertiajs/vue3'
import ActionMessage from '@/Components/ActionMessage.vue'
import ActionSection from '@/Components/ActionSection.vue'
import ConfirmationModal from '@/Components/ConfirmationModal.vue'
import DangerButton from '@/Components/DangerButton.vue'
import InputError from '@/Components/InputError.vue'
import InputLabel from '@/Components/InputLabel.vue'
import PrimaryButton from '@/Components/PrimaryButton.vue'
import SecondaryButton from '@/Components/SecondaryButton.vue'
import TextInput from '@/Components/TextInput.vue'
import { useTranslation } from '@/Composables/useTranslation.js'
import { route } from '../../../vendor/tightenco/ziggy'
import axios from '@/Utils/axios.js'
import type { Article, Permission } from '@/types'

const { t } = useTranslation()

interface SearchParams {
  search: string
  user_id: number
  sort: string
  order: string
  from: number
  to: number
}

interface Props {
  search: Partial<SearchParams>
  permissions: Partial<Permission>
  isUpdateDialog: boolean
}

const articles = ref<Article[]>([])
const props = withDefaults(defineProps<Props>(), {
  search: () => ({}),
  permissions: () => ({
    canCreateArticle: true,
    canUpdateArticle: true,
    canDeleteArticle: true,
  }),
  isUpdateDialog: false,
})

const titleInput = ref(null)

interface Form {
  title: string
  body: string
  // tags: Object
  errors: Record<string, string>
  recentlySuccessful: boolean
  processing: boolean
}

const form = reactive<Form>({
  title: '',
  body: '',
  // tags: []
  errors: {},
  recentlySuccessful: false,
  processing: false,
})

const formatErrors = (errors: Record<string, string[]>): Record<string, string> => {
  const result = {}
  Object.keys(errors).forEach(key => {
    result[key] = errors[key].join(', ')
  })
  return result
}

watch(
  () => form.recentlySuccessful,
  newValue => {
    if (newValue) {
      setTimeout(() => (form.recentlySuccessful = false), 2000)
    }
  }
)

const isShowCreateDialog = ref(false)
const isShowUpdateDialog = ref(false)
const isShowDeleteDialog = ref(false)

const targetArticle = ref<Article | null>(null)

onMounted(() => {
  updateArticles()
})

const updateArticles = () => {
  const user_id = props.search?.user_id ?? 1

  // 🚀記事 - 一覧取得
  return axios.get(route('api.articles.index', { user_id: user_id })).then(response => {
    articles.value = response.data
  })
}

const onClickOpenCreateDialog = () => {
  targetArticle.value = null
  form.errors = {}

  isShowCreateDialog.value = true
  form.recentlySuccessful = false

  nextTick(() => {
    titleInput.value?.focus()
  })
}

const onClickCreateArticle = () => {
  const data = {
    title: form.title,
    body: form.body,
  }

  form.processing = true

  // 🚀記事 - 新規作成
  axios
    .post(route('api.articles.store'), data)
    .then(() => {
      form.errors = {}
      form.recentlySuccessful = true

      updateArticles()
    })
    .catch(error => {
      form.errors = error.response.data.errors
    })
    .finally(() => {
      form.processing = false
    })
}

const onClickUpdateArticle = (article: Article) => {
  targetArticle.value = article
  form.recentlySuccessful = false

  if (props.isUpdateDialog) {
    onClickOpenUpdateDialog()
  } else {
    updateArticle(article)
  }
}
const onClickOpenUpdateDialog = () => {
  isShowUpdateDialog.value = true
}

const updateArticle = (article: Article) => {
  const data = {
    title: article.title,
    body: article.body,
  }

  form.processing = true

  // 🚀記事 - 更新
  axios
    .put(route('api.articles.update', article.id), data)
    .then(() => {
      form.errors = {}
      form.recentlySuccessful = true

      updateArticles()
    })
    .catch(error => {
      form.errors = formatErrors(error.response.data.errors)
    })
    .finally(() => {
      form.processing = false
      isShowUpdateDialog.value = false
    })
}

const onClickOpenDeleteDialog = (article: Article) => {
  targetArticle.value = article
  form.errors = {}
  isShowDeleteDialog.value = true
}

const onClickDeleteArticle = (article: Article) => {
  form.processing = true

  // 🚀記事削除
  axios
    .delete(route('api.articles.destroy', article.id))
    .then(() => {
      targetArticle.value = null

      updateArticles()
    })
    .finally(() => {
      form.processing = false
      isShowDeleteDialog.value = false
    })
}
</script>

<template>
  <div>
    <div v-if="articles.length > 0">
      <!-- Articles -->
      <ActionSection class="mt-10 sm:mt-0">
        <template #title> Articles </template>

        <template #description> All of the article that are part of this user. </template>

        <!-- Articles List -->
        <template #content>
          {{ articles.length }} {{ t('Record') }}

          <PrimaryButton
            v-if="props.permissions.canCreateArticle"
            class="ms-6 cursor-pointer text-sm text-red-500"
            @click="onClickOpenCreateDialog()"
          >
            <v-icon icon="mdi-file-document-plus" />
            Create
          </PrimaryButton>

          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center text-white">No</div>
              <div class="flex items-center text-white">title</div>
              <div class="flex items-center text-white">body</div>
              <div class="flex items-center text-white"></div>
            </div>

            <div
              v-for="(article, i) in articles"
              :key="article.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center text-white">
                {{ i + 1 }}
              </div>

              <Link
                class="flex items-center px-6 py-4 underline"
                :href="route('articles.show', article.id)"
                tabindex="-1"
              >
                📄{{ article.id }}
              </Link>

              <div class="text-center">
                <TextInput
                  v-model="article.title"
                  type="text"
                  class="mt-1 block w-full"
                  :disabled="!props.permissions.canUpdateArticle"
                />
                <InputError
                  v-if="article.id === targetArticle?.id"
                  :message="form.errors.title"
                  class="mt-2"
                />
              </div>

              <div class="text-center">
                <TextInput
                  v-model="article.body"
                  type="text"
                  class="mt-1 block w-full"
                  :disabled="!props.permissions.canUpdateArticle"
                />
                <InputError
                  v-if="article.id === targetArticle?.id"
                  :message="form.errors.body"
                  class="mt-2"
                />
              </div>

              <div class="flex items-center">
                <div class="text-center">
                  <PrimaryButton
                    v-if="props.permissions.canUpdateArticle"
                    class="ms-6 cursor-pointer text-sm text-red-500"
                    @click="onClickUpdateArticle(article)"
                  >
                    SAVE
                  </PrimaryButton>
                  <ActionMessage
                    v-if="article.id === targetArticle?.id"
                    :on="form.recentlySuccessful"
                    :fade-in="true"
                    class="me-3"
                  >
                    Saved.
                  </ActionMessage>
                </div>

                <DangerButton
                  v-if="props.permissions.canDeleteArticle"
                  class="ms-6 cursor-pointer text-sm text-red-500"
                  @click="onClickOpenDeleteDialog(article)"
                >
                  DEL
                </DangerButton>
              </div>
            </div>
          </div>
        </template>
      </ActionSection>
    </div>

    <!-- Create Article Confirmation Modal -->
    <ConfirmationModal :show="isShowCreateDialog" @close="isShowCreateDialog = false">
      <template #title> Create Article </template>

      <template #content>
        Create a new Article
        <div class="mt-2">
          <div class="col-span-6 sm:col-span-4">
            <InputLabel for="title" value="Title" />
            <TextInput
              id="title"
              ref="titleInput"
              v-model="form.title"
              type="text"
              class="mt-1 block w-full"
              autofocus
            />
            <InputError :message="form.errors.title" class="mt-2" />
          </div>

          <div class="col-span-6 sm:col-span-4">
            <InputLabel for="body" value="Body" />
            <TextInput id="body" v-model="form.body" type="text" class="mt-1 block w-full" />
            <InputError :message="form.errors.body" class="mt-2" />
          </div>
        </div>
      </template>

      <template #footer>
        <ActionMessage :on="form.recentlySuccessful" :fade-in="true" class="me-3">
          Created.
        </ActionMessage>

        <SecondaryButton @click="isShowCreateDialog = false"> Cancel </SecondaryButton>

        <PrimaryButton
          class="ms-3"
          :class="{ 'opacity-25': form.processing }"
          :disabled="form.processing"
          @click="onClickCreateArticle"
        >
          Create
        </PrimaryButton>
      </template>
    </ConfirmationModal>

    <!-- Update Article Confirmation Modal -->
    <ConfirmationModal :show="isShowUpdateDialog" @close="isShowUpdateDialog = false">
      <template #title> Update Article </template>

      <template #content>
        Do you really want to update this article?
        <div class="mt-2">
          <div class="col-span-6 sm:col-span-4">
            <InputLabel for="title" value="Title" />
            <TextInput v-model="targetArticle.title" type="text" class="mt-1 block w-full" />
            <InputError :message="form.errors.title" class="mt-2" />
          </div>

          <div class="col-span-6 sm:col-span-4">
            <InputLabel for="body" value="Body" />
            <TextInput v-model="targetArticle.body" type="text" class="mt-1 block w-full" />
            <InputError :message="form.errors.body" class="mt-2" />
          </div>
        </div>
      </template>

      <template #footer>
        <ActionMessage :on="form.recentlySuccessful" :fade-in="true" class="me-3">
          Saved.
        </ActionMessage>

        <SecondaryButton @click="isShowUpdateDialog = false"> Cancel </SecondaryButton>

        <PrimaryButton
          class="ms-3"
          :class="{ 'opacity-25': form.processing }"
          :disabled="form.processing"
          @click="updateArticle(targetArticle)"
          autofocus
        >
          SAVE
        </PrimaryButton>
      </template>
    </ConfirmationModal>

    <!-- Delete Article Confirmation Modal -->
    <ConfirmationModal :show="isShowDeleteDialog" @close="isShowDeleteDialog = false">
      <template #title> Delete Article Member </template>

      <template #content>
        Are you sure you would like to remove this person from the Article?
      </template>

      <template #footer>
        <SecondaryButton @click="isShowDeleteDialog = false"> Cancel </SecondaryButton>

        <DangerButton
          class="ms-3"
          :class="{ 'opacity-25': form.processing }"
          :disabled="form.processing"
          @click="onClickDeleteArticle(targetArticle)"
        >
          Delete
        </DangerButton>
      </template>
    </ConfirmationModal>
  </div>
</template>
