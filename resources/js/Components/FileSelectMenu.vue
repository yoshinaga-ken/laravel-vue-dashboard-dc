<script setup>
defineProps({
  dataPath: {
    type: String,
    default: '/data/'
  },
  data: {
    type: Object,
    default: () => ({}),
  },
});

const handleItemClick = (item) => {
  const url = new URL(window.location.href);
  url.search = `data=${item}`;
  window.location.href = url.toString();
};
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        color=""
        v-bind="props"
        size="small"
      >
        <v-icon icon="mdi-folder-open"/>
      </v-btn>
    </template>

    <v-list style="max-height: 800px; overflow-y: auto;">
      <v-list-item
        v-for="(value, key) in data"
        :key="key"
        @click="handleItemClick(value)"
        class="d-flex align-center"
      >
        <v-img
          :src="dataPath + key"
          max-width="150"
          max-height="150"
          class="mr-2"
        />
        <v-list-item-title class="mb-2">{{ value }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

