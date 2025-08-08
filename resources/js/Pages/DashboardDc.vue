<script setup>
import AppLayout from '@/Layouts/AppLayout.vue'
import DcChart from '@/Components/DcChart.vue'
</script>

<template>
  <AppLayout title="Dashboard">
    <template v-if="false" #header>
      <h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
        DashboardDc
      </h2>
    </template>

    <div class="text-white">
      <DcChart />
    </div>
  </AppLayout>
</template>
