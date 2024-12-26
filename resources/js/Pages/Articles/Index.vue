<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import Pagination from "@/Components/Pagination.vue";
import {useForm} from "@inertiajs/vue3";
import DangerButton from "@/Components/DangerButton.vue";

defineProps({articles: Array})

const form = useForm({})

const onClickArticleDelete = (article) => {
    if (confirm('記事を削除しますか?')) {
        form.delete(route('articles.destroy', article.id), {
            preserveScroll: true, // 削除後のスクロールリセットを防ぐ
            errorBag: 'deleteArticle',
            onSuccess: () => {
                alert('削除しました');
            }
        });
    }
};
</script>

<template>
    <AppLayout title="Article">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                Articles
            </h2>
        </template>

        <Pagination :links="articles.links"/>

        <div class="mx-3 px-6 rounded-md shadow overflow-x-auto">
            <table class="w-full whitespace-nowrap">
                <thead>
                <tr class="text-left font-bold">
                    <th>Id</th>
                    <th>Title</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Tags</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(article, i) in articles.data" :key="article.id"
                    class="hover:bg-gray-100 focus-within:bg-gray-100 dark:hover:bg-gray-800 dark:focus-within:bg-gray-800">
                    <td>
                        {{ article.id }}
                    </td>
                    <td>
                        {{ article.title }}
                    </td>
                    <td>
                        {{ article.user.name }}
                    </td>
                    <td>
                        {{ article.created_at }}
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
                        <DangerButton
                            class="ms-3"
                            :class="{ 'opacity-25': form.processing }"
                            :disabled="form.processing"
                            @click="onClickArticleDelete(article)"
                        >
                            DEL
                        </DangerButton>
                    </td>
                </tr>
                <tr v-if="articles.length === 0">
                    <td colspan="3">No articles found.</td>
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
