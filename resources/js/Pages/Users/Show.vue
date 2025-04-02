<script lang="ts" setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import type { User, Permission } from '@/types';
import { ref, watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

const props = defineProps<{
  userId: number
}>();

const user = ref<User | null>(null);

const { result, loading, error } = useQuery(gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      current_team_id
      profile_photo_path
      ownedTeams{
        name
      }
      teams{
        name
      }
      articles(first: 16 page: 1) {
        paginatorInfo {
          count
          total
        }
        data{
          id
          title
        }
      }
      followers(first: 16 page: 1) {
        data{
          name
        }
      }
      following(first: 16 page: 1) {
        data{
          name
        }
      }
    }
  }
`,
  {
    id: props.userId,
    fetchPolicy: 'network-only'
  });

watch(result, (newResult) => {
  if (newResult?.user) {
    user.value = newResult.user
  }
});


</script>

<template>
  <AppLayout :title="`${user?.name || 'User'} Profile`">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
        User Profile
      </h2>
    </template>

    <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">エラーが発生しました</div>
      <div v-else-if="user" class="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
        <div class="grid grid-cols-1 gap-4">
          <pre class="text-sm">{{ JSON.stringify(user, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
