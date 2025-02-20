<template>
  <input title="YouTubeの動画URL。URLをペーストすれば再生する動画を切り替えることができます"
         type="text" v-model="videoId" @focus="onFocus" @blur="onBlur" style="width: 3em;">
</template>

<script setup>
import {watch} from "vue";

/**
 * YouTube URLから動画IDを抽出する
 * @returns {*|string}
 * @param url
 */
const extractVideoId = (url) => {
  try {
    // URL形式の場合、URLオブジェクトを作成し、動画IDを取得
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v');
  } catch (e) {
    // URLオブジェクトが作成できない場合（ビデオIDが直接渡された場合）、そのまま返す
    return url;
  }
};
const onFocus = (event) => {
  // URLへ
  event.target.value = `https://www.youtube.com/watch?v=${event.target.value}`;
  event.target.select();
  event.target.style.width = '32em';
};
const onBlur = (event) => {
  event.target.style.width = '4em';
}

const videoId = defineModel();

// videoIdの変更を監視し、URLの場合はIDを抽出して更新
watch(videoId, (newValue) => {
  const extractedId = extractVideoId(newValue);
  if (extractedId) {
    videoId.value = extractedId;
  }
});

</script>
