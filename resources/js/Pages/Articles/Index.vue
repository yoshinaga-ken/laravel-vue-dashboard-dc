<script lang="ts" setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import Pagination from "@/Components/Pagination.vue";
import { Link, router, useForm } from "@inertiajs/vue3";
import DangerButton from "@/Components/DangerButton.vue";
import ArticleLikeButton from "@/Components/ArticleLikeButton.vue";
import { ElAutocomplete, ElButton } from "element-plus";
import { useTranslation } from "@/Composables/useTranslation.js";
import UserFollowButton from "@/Components/UserFollowButton.vue";
import { route } from "../../../../vendor/tightenco/ziggy";
import axios from "@/Utils/axios.js";
import type { Article, Permission, User } from '@/types';

const { t } = useTranslation();

interface Links {
  active: boolean,
  label: string,
  url: string
}

interface IndexArticle extends Article {
  permissions: Permission,
}

interface ArticleProps {
  data: IndexArticle[],
  current_page: number,
  from: number,
  to: number,
  total: number,
  first_page_url: string,
  last_page: number,
  last_page_url: string,
  links: Links[],
  next_page_url: string,
  per_page: number,
  prev_page_url: string,
}

const props = defineProps<{
  articles: ArticleProps,
  search: string
  permissions: Permission,
}>();

const form = useForm({ search: props.search });

const formProcessing = () => {
  return form.processing;
}

const formSearchSuggestions = (queryString: string, cb) => {
  const lists = [
    { value: 'abc' },
    { value: 'abcd' },
    { value: 'efg' },
  ]
  cb(lists.filter(item => item.value.includes(queryString)))
}

const onSelectArticleSearch = (item: { value: string }) => {
  form.search = item.value
  onClickArticleSearch();
}

const onClickArticleSearch = () => {
  form.get(route('articles.index'), {
    preserveState: true,
    preserveScroll: true,
    only: ['articles', 'flash'],
  })
}

const onClickToggleLike = (article: IndexArticle) => {
  article.is_liked_by
    ? form.delete(route('articles.dislike', article.id), {
      errorBag: 'dislikeArticle',
      preserveScroll: true,
      only: ['articles', 'flash'],
    })
    : form.put(route('articles.like', article.id), {
      errorBag: 'likeArticle',
      preserveScroll: true,
      only: ['articles', 'flash'],
    });
}

const onClickToggleFollow = (user: User) => {
  form.processing = true;

  axios[user.is_followed_by ? 'delete' : 'put'](
    route(user.is_followed_by ? 'api.users.unfollow' : 'api.users.follow', { id: user.id })
  ).then(() => {
    router.reload({ only: ['articles', 'flash'] });
  }).catch(error => {
    console.log(error);
  }).finally(() => {
    form.processing = false;
  });
}

const onClickArticleDelete = (article: IndexArticle) => {
  if (confirm('記事を削除しますか?')) {
    form.delete(route('articles.destroy', article.id), {
      preserveScroll: true, // 削除後のスクロールリセットを防ぐ
      errorBag: 'deleteArticle',
      only: ['articles', 'flash'],
    });
  }
}
</script>

<template>
  <AppLayout title="Article">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
        Articles
      </h2>
    </template>

    <div class="flex items-center m-2 gap-2">
      <div class="flex">
        <el-autocomplete v-model="form.search"
                         :fetch-suggestions="formSearchSuggestions"
                         placeholder="Search Title"
                         clearable
                         @select="onSelectArticleSearch"
                         @keydown.enter="onClickArticleSearch">
        </el-autocomplete>
        <el-button @click="onClickArticleSearch">🔍</el-button>
      </div>

      <Link
        v-if="permissions.canCreateArticle"
        class="inline-flex items-center justify-center px-4 py-2 bg-gray-500 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
        :href="route('articles.create')">
        <v-icon icon="mdi-file-document-plus"/>
        Create Article
      </Link>
    </div>

    <div class="flex items-center m-2 gap-2">
      {{ articles.total }} {{ t('Record') }}
      <Pagination :links="articles.links"/>
    </div>

    <div class="text-gray-800 dark:text-gray-200 mx-3 px-6 rounded-md shadow overflow-x-auto">
      <table class="w-full whitespace-nowrap">
        <thead>
        <tr class="text-left font-bold">
          <th>Id</th>
          <th>Title</th>
          <th>User</th>
          <th>Date</th>
          <th>Likes</th>
          <th>Tags</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(article, i) in articles.data" :key="article.id" :id="`row-${article.id}`"
            class="hover:bg-gray-100 focus-within:bg-gray-100 dark:hover:bg-gray-800 dark:focus-within:bg-gray-800">
          <td>
            <Link :id="`id-${article.id}`" class="flex items-center px-6 py-4 underline" :href="route('articles.show', article.id)"
                  tabindex="-1">
              📄{{ article.id }}
            </Link>
          </td>
          <td>
            {{ article.title.substring(0, 20) + (article.title.length > 20 ? '...' : '') }}
          </td>
          <td>
            {{ article.user.name }}
            <UserFollowButton v-if="article.user.id !== $page.props.auth.user.id"
                              :user="article.user"
                              @click="onClickToggleFollow(props.articles.data[i].user)"
                              :disabled="formProcessing()"/>
          </td>
          <td>
            {{ article.created_at }}
          </td>
          <td>
            <ArticleLikeButton
              :id="`like-${article.id}`"
              :article="article"
              @click="onClickToggleLike(article)"
              :disabled="formProcessing()"/>
          </td>
          <td>
            <template v-for="(tag, index) in article.tags" :key="index">
                            <span
                              class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                #{{ tag.name }}
                            </span>
            </template>
          </td>
          <td>
            <Link
              :id="`edit-${article.id}`"
              v-if="article.permissions.canUpdateArticle"
              class="flex items-center px-6 py-4 underline"
              :href="route('articles.edit', article.id)"
              tabindex="-1"
            >
              📝
            </Link>
          </td>
          <td>
            <DangerButton
              :id="`delete-${article.id}`"
              v-if="article.permissions.canDeleteArticle"
              class="ms-3"
              :class="{ 'opacity-25': formProcessing() }"
              :disabled="formProcessing()"
              @click="onClickArticleDelete(article)"
            >
              DEL
            </DangerButton>
          </td>
        </tr>
        <tr v-if="articles.data.length === 0">
          <td colspan="9">No articles found.</td>
        </tr>
        </tbody>
      </table>
    </div>

  </AppLayout>
</template>

<style scoped>
div {
  @apply text-gray-800 dark:text-gray-200;
}

table thead {
  @apply bg-gray-50 dark:bg-gray-600;
}

table thead th {
  @apply pb-4 pt-6 px-6;
}

table td {
  @apply px-6 py-4;
  @apply border-t;
}
</style>
