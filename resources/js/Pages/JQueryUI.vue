<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import {ref} from "vue";
// import VueApexChart from "@/Components/VueApexChart.vue";
import JQueryLibTest from "@/Components/JQueryLibTest.vue";

// TODO: これ型をTypeScriptで定義できないか？
const article = ref({
  id: 1,
  title: 'title',
  is_liked_by: true,
  likes: [],
  tags: [],
});

</script>

<template>
  <AppLayout title="Dashboard">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
        JQueryUI
      </h2>
    </template>

    <div class="text-white">
      <JQueryLibTest/>
      >
      <!--            <VueApexChart/>-->
    </div>


  </AppLayout>
</template>
