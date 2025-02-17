<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import DcChart from "@/Components/DcChart.vue";

</script>

<template>
  <AppLayout title="Dashboard">
    <template v-if="false" #header>
      <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
        DashboardDc
      </h2>
    </template>

    <div class="text-white">
      <DcChart/>
    </div>
  </AppLayout>
</template>
