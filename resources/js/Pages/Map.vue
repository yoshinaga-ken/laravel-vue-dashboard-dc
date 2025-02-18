<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import JapanGoogleMap from "@/Components/JapanGoogleMap.vue";
import {ref} from "vue";

const index = ref(1);
const prefecturesTbl = ref([
    {
        "東京都": {
            "千代田区": 70,
            "中央区": 80,
            "西東京市": 32,
            "瑞穂町": 4, // 西多摩郡
        }
    },
    {
        "東京都": {
            "町田市": 80,
            "八王子市": 32,
        }
    }
]);

</script>

<template>
    <AppLayout title="Map">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                Map
            </h2>
        </template>

        <input v-model.number="index" type="number" min="0" max="1" step="1"/>
        <div class="text-white">
            <JapanGoogleMap :prefectures="prefecturesTbl[index]"></JapanGoogleMap>
        </div>


    </AppLayout>
</template>
