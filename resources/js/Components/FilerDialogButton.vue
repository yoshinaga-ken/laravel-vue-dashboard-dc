<script setup>
import {onMounted} from "vue";
import {
  // loadScriptJQueryUI,
  // loadScriptJQueryUIDatepickerJa,
  // loadScriptDataTables,
  loadScriptFiler
} from '@/Utils/utils.js';

const emit = defineEmits(['close']);

defineProps({
  isShowImg: {
    type: Boolean,
    default: false,
  },
  isTooltip: {
    type: Boolean,
    default: true,
  },
});

onMounted(async () => {
  // TODO: 以下loadされてなければloadする方式にする?
  // await loadScriptJQueryUI();
  // await loadScriptJQueryUIDatepickerJa();
  // await loadScriptDataTables();
  await loadScriptFiler();
});
</script>

<template>
  <img v-if="isShowImg" src="/upload/csv/game-1983-fc.jpg" id="data_img_img" width="42" class="tt_img"
       onerror="this.setAttribute('style','display:none');">
  <input type="hidden" id="data_img" name="data_img">

  <span type="button"
        :tt_title="isTooltip ? 'チャートデータを選択します。<br />フォーマットは以下のようなカラムを含むCSVになります。<br />例：コロナウイルス感染状況のチャートの場合<br /><img src=\'/img/hlp/csv_format.gif\'>' : ''"
        title="チャートデータを選択します"
        class="fs_filer ui-button ui-corner-all ui-widget"
        fs_filer_select_dir="[[&quot;upload/csv/&quot;,&quot;分析(29)&quot;]]" fs_filer_is_tag="0"
        fs_filer_target="#data_img" fs_filer_target_img="#data_img_img" fs_filer_is_btn_del="1"
        fs_filer_upload_extensions="CSV,JSON"><i class="fa fa-folder-open-o"></i></span>
</template>
