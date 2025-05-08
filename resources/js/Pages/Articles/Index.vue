<script lang="ts" setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import Pagination from "@/Components/Pagination.vue";
import { Link, router, useForm } from "@inertiajs/vue3";
import DangerButton from "@/Components/DangerButton.vue";
import ArticleLikeButton from "@/Components/ArticleLikeButton.vue";
import { ElAutocomplete, ElButton, ElIcon, ElTag } from "element-plus";
import { Calendar, Delete, EditPen, User as UserIcon } from '@element-plus/icons-vue'
import { useTranslation } from "@/Composables/useTranslation.js";
import UserFollowButton from "@/Components/UserFollowButton.vue";
import { route } from "../../../../vendor/tightenco/ziggy";
import axios from "@/Utils/axios.js";
import type { Article, Permission, User } from '@/Types/types';
import ElTextTagsInput from "@/Components/ElTextTagsInput.vue";
import ElTextQueryInput from "@/Components/ElTextQueryInput.vue";
import { ref, watch } from "vue";
import { FilterUserInput, UserPaginator, FilterArticleInput, ArticlePaginator } from "@/Types/types-graphql";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

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

interface SearchForm {
  title: string;
  tags: string[];
}

// URLからパラメータを取得する関数
const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);

  // URLからタイトルを取得
  const title = urlParams.get('title') || '';

  // URLからタグを取得
  const tags: string[] = [];
  urlParams.forEach((value, key) => {
    if (key.startsWith('tags[')) {
      tags.push(value);
    }
  });

  return { title, tags };
};

// URLからトークンを生成する関数
const generateTokensFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tokens = [];

  // タイトルの処理
  const title = urlParams.get('title');
  if (title) {
    tokens.push({ "type": "string", "value": { "data": title, "operator": "=" } });
  }

  // ユーザーの処理
  const users: string[] = [];
  urlParams.forEach((value, key) => {
    if (key.startsWith('users[')) {
      users.push(value);
    }
  });
  users.forEach(user => {
    tokens.push({ "type": "user", "value": { "data": user, "operator": "=" } });
  });

  // タグの処理
  const tags: string[] = [];
  urlParams.forEach((value, key) => {
    if (key.startsWith('tags[')) {
      tags.push(value);
    }
  });
  tags.forEach(tag => {
    tokens.push({ "type": "tag", "value": { "data": tag, "operator": "=" } });
  });

  // 日付の処理
  const dateValue = urlParams.get('date_value');
  const dateOperator = urlParams.get('date_operator') || '=';
  if (dateValue) {
    tokens.push({ "type": "date", "value": { "data": dateValue, "operator": dateOperator } });
  }

  // 日付範囲の処理
  const dateRangeValue = urlParams.get('date_range_value');
  if (dateRangeValue) {
    tokens.push({ "type": "date_range", "value": { "data": dateRangeValue, "operator": ":" } });
  }

  // いいね数の処理
  const likesCount = urlParams.get('likes_count');
  const likesOperator = urlParams.get('likes_operator') || '=';
  if (likesCount) {
    tokens.push({ "type": "number", "value": { "data": parseInt(likesCount), "operator": likesOperator } });
  }

  return tokens;
};

// URLパラメータから初期値を取得
const urlParams = getUrlParams();
const defaultSearchForm: SearchForm = {
  title: urlParams.title,
  tags: urlParams.tags,
};

const props = defineProps<{
  articles: ArticleProps,
  search: SearchForm,
  permissions: Permission,
}>();

const form = useForm({
  title: props.search?.title ?? defaultSearchForm.title,
  tags: props.search?.tags ?? defaultSearchForm.tags,
});

// URLから初期トークンを生成
const searchQueryTokens = ref(generateTokensFromUrl());
const availableTokens = [
  {
    type: 'user',
    icon: 'User',
    title: 'User',
    tags: ['alpha', 'beta', 'gamma', 'john', 'jane', 'mike'],
    operators: ['='], // MEMO: 1つの場合operatorの入力がないタイプ
  },
  {
    type: 'user_ope',
    icon: 'User',
    title: 'User',
    tags: ['alpha', 'beta', 'gamma', 'john', 'jane', 'mike'],
    operators: ['=', '!=', '%like%', 'like%', '%like'],
  },
  {
    type: 'tag',
    // icon: 'CollectionTag',
    title: '🔖Tag (Category) ',
    tags: ['🏀Spots', '📰News', '💻Technology', '🎥Entertainment', '👨‍🔬Science'],
    operators: ['=', '!=', '%like%', 'like%', '%like'],
  },
  {
    type: 'tag-fw',
    // icon: 'CollectionTag',
    title: '🔖Tag (Framework) ',
    tags: ['Laravel','Vue.js','React'],
    operators: ['='], // MEMO: 1つの場合operatorの入力がないタイプ
  },
  {
    type: 'date',
    icon: 'Calendar',
    title: 'Date',
    tags: 'DatePicker',
    tagsComponentOptions: { // @see [DatePicker options](https://element-plus.org/en-US/component/date-picker)
      placeholder: 'Enter date',
    },
    operators: ['>=', '<=', '='],
  },
  {
    type: 'date_range',
    icon: 'Calendar',
    title: 'Date (From,To)',
    tags: 'DatePicker',
    tagsComponentOptions: { // @see [DatePicker options](https://element-plus.org/en-US/component/date-picker)
      type: "daterange"
    },
    operators: [':'],
  },
  {
    type: 'likes',
    // icon: 'StarFilled',
    title: '♥️Likes',
    tags: 'Input',
    tagsComponentOptions: { // @see [Input options](https://element-plus.org/en-US/component/input.html#input)
      min: 0,
      type: 'number',
    },
    operators: ['>=', '<=', '='],
  },
  {
    type: 'object',
    icon: 'Setting',
    title: 'Object',
    tagOptions: { // [ElTagのオプション](https://element-plus.org/en-US/component/tag)
      effect: 'light', // dark|light*|plain
      type: 'success', // primary*|success|info|warning|danger (青|緑|灰|黄|赤)
      // color: 'yellow', // background color
      // size: 'large', // large|default|small
    },
    tags: [
      { id: 1, name: 'ObjectA(id:1)', icon: 'Location' },
      { id: 2, name: 'ObjectB(id:2)', icon: 'Coordinate' },
      { id: 3, name: 'ObjectC(id:3)', icon: 'Guide' },
    ],
    operators: ['=', '!=', '%like%', 'like%', '%like'],
  },
  {
    type: 'status',
    icon: 'CircleCheck',
    title: 'Status',
    tags: [
      { id: 'active', name: '有効', icon: 'Select' },
      { id: 'pending', name: '保留中', icon: 'Loading' },
      { id: 'inactive', name: '無効', icon: 'Close' },
    ],
    operators: ['=', '!='],
  },
];

const usersQuery = useQuery<{ users: UserPaginator }>(gql`
  query FilterUsers($input: FilterUserInput) {
    users(input: $input, first: 512) {
      data {
        name
      }
    }
  }
`, {
  variables: {
    input: {
      name: ''
    } satisfies FilterUserInput
  }
})

watch([() => usersQuery.loading.value, () => usersQuery.result.value], ([isLoading, data]) => {
  if (!isLoading && !usersQuery.error.value && data?.users?.data) {
    const users = data.users.data.map(user => user.name)
    availableTokens[0].tags = users
    availableTokens[1].tags = users
  }
})

const textTagsInputRef = ref(null);

watch([() => textTagsInputRef.value?.availableTags], ([tags]) => {
  if (tags && Array.isArray(tags)) {
    availableTokens[2].tags = tags;
  }
}, { immediate: true })

// searchQueryTokensの変更を監視し、変更があれば検索を実行
watch(
  searchQueryTokens,
  () => {
    // フォーム処理中でなければ検索を実行
    if (!formProcessing()) {
      onClickArticleSearchQuery();
    }
  },
  { deep: true }
);

const formProcessing = () => {
  return form.processing;
}

// フォームの値変更を監視し、変更があれば自動的に検索を実行
watch(
  [() => form.title, () => form.tags],
  ([newTitle]) => {
    if (!formProcessing()) {
      if (newTitle !== undefined) {
        if (newTitle.length >= 5) {
          onClickSearch();
        }
      } else {
        onClickSearch();
      }
    }
  },
  { deep: true }
);

const articlesQuery = useQuery<{ articles: ArticlePaginator }>(gql`
  query FilterArticles($input: FilterArticleInput) {
    articles(input: $input, first: 50) {
      data {
        title
      }
    }
  }
`, {
  variables: {
    input: {
      title: ''
    } satisfies FilterArticleInput
  }
})

const formSearchSuggestions = (queryString: string, cb) => {
  if (articlesQuery.result.value?.articles?.data) {
    const articleTitles = articlesQuery.result.value.articles.data
      .map(article => ({ value: article.title }))
    cb(articleTitles.filter(item => item.value.toLowerCase().includes(queryString.toLowerCase())))
  } else {
    cb([])
  }
}

// 検索実行
const options = {
  preserveState: true,
  preserveScroll: true,
  only: ['articles', 'flash'],
};

const onClickArticleSearchQuery = () => {
  console.log(JSON.stringify(searchQueryTokens.value, null, 2))
  const tokensList = searchQueryTokens.value;

  // フォームをリセットせずに新しい検索データオブジェクトを作成する
  const searchData = {};

  // タイトルの処理
  const title = tokensList.filter(token => token.type === 'string').map(token => token.value.data);
  if (title.length > 0) {
    searchData.title = title.join(' ');
  }

  // ユーザーの処理
  const users = tokensList.filter(token => token.type === 'user').map(token => token.value.data);
  if (users.length > 0) {
    searchData.users = users;
  }

  // タグの処理
  const tags = tokensList.filter(token => token.type === 'tag' || token.type === 'tag-fw').map(token => token.value.data);
  if (tags.length > 0) {
    searchData.tags = tags;
  }

  // 日付条件の処理
  const dateToken = tokensList.find(token => token.type === 'date');
  if (dateToken && dateToken.value && dateToken.value.data) {
    searchData.date_value = dateToken.value.data;
    searchData.date_operator = dateToken.value.operator;
  }

  // 日付範囲の処理
  const dateRangeToken = tokensList.find(token => token.type === 'date_range');
  if (dateRangeToken && dateRangeToken.value && dateRangeToken.value.data) {
    searchData.date_range_value = dateRangeToken.value.data;
  }

  // いいね数の処理
  const likesToken = tokensList.find(token => token.type === 'likes');
  if (likesToken && likesToken.value && likesToken.value.data) {
    searchData.likes_count = likesToken.value.data;
    searchData.likes_operator = likesToken.value.operator;
  }

  // データがあれば検索、なければトップページに遷移
  if (Object.keys(searchData).length > 0) {
    router.get(route('articles.index'), searchData, options);
  } else {
    router.visit(route('articles.index'), options);
  }
}

const onClickSearch = () => {
  form.get(route('articles.index'), options);
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
      <ElTextQueryInput :available-tokens="availableTokens"
                        :append-value-suggest-types-to-key="['user','tag-fw']"
                        v-model="searchQueryTokens" @keydown-enter="onClickArticleSearchQuery">
        <template #append>
          <ElButton aria-label="Query Search" @click="onClickArticleSearchQuery" size="large">🔍</ElButton>
        </template>
      </ElTextQueryInput>
    </div>
    <div class="flex items-center m-2 gap-2">
      <div class="flex">
        <ElAutocomplete v-model="form.title"
                         :fetch-suggestions="formSearchSuggestions"
                         placeholder="Search Title"
                         clearable
                         size="large"
                         >
        </ElAutocomplete>

        <ElTextTagsInput
          id="tags"
          v-model="form.tags"
          :inputVisible="true"
          type="text"
          ref="textTagsInputRef"
        />
        <ElButton aria-label="Form Search" size="large" @click="onClickSearch">🔍</ElButton>
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
      <table aria-label="Articles List" class="w-full　table-auto">
        <thead>
        <tr class="text-left font-bold">
          <th>Id</th>
          <th>Title</th>
          <th><ElIcon size="large"><UserIcon/></ElIcon>User</th>
          <th><ElIcon size="large"><Calendar/></ElIcon>Date</th>
          <th>♥️Likes</th>
          <th>🔖Tags</th>
          <th><ElIcon size="large"><EditPen/></ElIcon>Edit</th>
          <th><ElIcon size="large"><Delete/></ElIcon>Delete</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(article, i) in articles.data" :key="article.id" :id="`row-${article.id}`"
            class="hover:bg-gray-100 focus-within:bg-gray-100 dark:hover:bg-gray-800 dark:focus-within:bg-gray-800">
          <td>
            <Link :id="`id-${article.id}`" class="flex items-center px-6 py-4 underline"
                  :href="route('articles.show', article.id)"
                  tabindex="-1">
              📄{{ article.id }}
            </Link>
          </td>
          <td>
            {{ article.title.substring(0, 20) + (article.title.length > 20 ? '...' : '') }}
          </td>
          <td>
            <Link :id="`user-id-${article.user.id}`" class="flex items-center px-6 py-4 underline"
                  :href="route('users.show', article.user.id)"
                  tabindex="-1">
              <img class="size-8 rounded-full object-cover mr-2" :src="article.user.profile_photo_url"
                   :alt="article.user.name">
              ️{{ article.user.name }}
            </Link>
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
              <Link
                class="ml-1"
                :href="route('articles.index', { tags: [tag.name] })"
                tabindex="-1">
                <ElTag size="large" round>#{{ tag.name }}</ElTag>
              </Link>
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
              <ElIcon size="large">
                <Delete/>
              </ElIcon>
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
