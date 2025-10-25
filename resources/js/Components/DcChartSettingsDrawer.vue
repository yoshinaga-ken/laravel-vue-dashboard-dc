<script lang="ts" setup>
import { ElDrawer, ElButton, ElRadioGroup, ElRadioButton } from 'element-plus'

// Props定義
defineProps<{
  isSp: boolean
  version: string
  versionDate: string
}>()

// 双方向バインディング定義
const settingsDrawerVisible = defineModel<boolean>('settingsDrawerVisible', {
  default: false,
})

const isDark = defineModel<boolean>('isDark', {
  default: false,
})

// テーマ変更ハンドラー
const onThemeChange = (value: boolean) => {
  isDark.value = value
}
</script>

<template>
  <ElDrawer
    v-model="settingsDrawerVisible"
    :with-header="false"
    direction="btt"
    title="⚙️設定"
    :resizable="true"
    :size="isSp ? '30%' : '20%'"
    style="z-index: 10"
    :class="{ dark: isDark }"
  >
    <div class="settings-content text-theme-col">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-medium text-theme-col">⚙️設定</h3>
        <ElButton @click="settingsDrawerVisible = false" round class="close-button">
          <span class="ui-icon ui-icon-close btn_close" />
        </ElButton>
      </div>

      <div class="settings-item mb-4 flex items-center gap-4">
        <label class="text-sm font-medium text-theme-col">テーマ：</label>
        <ElRadioGroup v-model="isDark" @change="onThemeChange">
          <ElRadioButton :value="false">☀️ライト</ElRadioButton>
          <ElRadioButton :value="true">🌛ダーク</ElRadioButton>
        </ElRadioGroup>
      </div>

      <div class="settings-item mb-4 flex items-center gap-4">
        <label class="text-sm font-medium text-theme-col">Version：</label>
        <span
          >{{ version }}<span class="ml-3">({{ versionDate }})</span></span
        >
      </div>
    </div>
  </ElDrawer>
</template>

<style scoped>
.settings-content {
  padding: 1rem;
}

.settings-item {
  padding: 0.5rem 0;
}

.close-button {
  padding: 0.5rem;
}
</style>
