<script lang="ts" setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import type { User } from '@/Types/types-graphql'
import { ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import ArticleTagsFrom from '@/Components/ArticleTagsForm.vue'

const props = defineProps<{
  userId: number
}>()

const user = ref<User | null>(null)

const { result, loading, error } = useQuery(
  gql`
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        name
        email
        current_team_id
        profile_photo_path
        profile_photo_url
        articles(first: 4, page: 1) {
          paginatorInfo {
            count
            total
          }
          data {
            id
            title
            tags {
              name
            }
          }
        }
        followers(first: 16, page: 1) {
          data {
            name
          }
        }
        following(first: 16, page: 1) {
          data {
            name
          }
        }
        ownedTeams {
          name
        }
        teams {
          name
        }
      }
    }
  `,
  {
    id: props.userId,
    fetchPolicy: 'network-only',
  }
)

watch(result, newResult => {
  console.log('watch(result)')
  if (newResult?.user) {
    user.value = newResult.user
  }
})
</script>

<template>
  <AppLayout :title="`${user?.name || 'User'} Profile`">
    <template #header>
      <h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
        User Profile
      </h2>
    </template>
    <div>
      <div class="mx-auto max-w-7xl py-5 sm:px-6 lg:px-8">
        <div class="col-span-6">
          <div class="mt-2 flex items-center">
            <img
              class="size-12 rounded-full object-cover"
              :src="user.profile_photo_url"
              :alt="user.name"
            />

            <div class="ms-4 leading-tight">
              <div class="text-gray-900 dark:text-white">{{ user.name }}</div>
              <div class="text-sm text-gray-700 dark:text-gray-300">{{ user.email }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Article[0] Tags Edit -->
      <div class="mx-auto max-w-7xl py-5 sm:px-6 lg:px-8">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">エラーが発生しました</div>
        <div
          v-else-if="user"
          class="overflow-hidden bg-white p-6 shadow-xl sm:rounded-lg dark:bg-gray-800"
        >
          <div class="grid grid-cols-1 gap-4">
            <div>📝Edit - user.articles[0].tags</div>
            <ArticleTagsFrom :article_id="user.articles.data[0].id"></ArticleTagsFrom>
          </div>
        </div>
      </div>

      <!-- User -->
      <div class="mx-auto max-w-7xl py-5 sm:px-6 lg:px-8">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">エラーが発生しました</div>
        <div
          v-else-if="user"
          class="overflow-hidden bg-white p-6 shadow-xl sm:rounded-lg dark:bg-gray-800"
        >
          <div class="grid grid-cols-1 gap-4">
            <div>🙋‍♂️ user</div>
            <pre class="text-sm">{{ JSON.stringify(user, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
