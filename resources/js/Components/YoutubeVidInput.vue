<template>
    <input title="YouTubeの動画URL。URLをペーストすれば再生する動画を切り替えることができます"
           type="text" v-model="videoId" @focus="onFocus" @blur="onBlur" style="width: 3em;">
</template>

<script setup>
import {ref, watch} from "vue";

const props = defineProps({
    modelValue: String,
});
const emit = defineEmits(['update:modelValue'])
/**
 * YouTube URLまたはビデオIDから動画IDを抽出する
 * @param input
 * @returns {*|string}
 */
const extractVideoId = (input) => {
    try {
        // URL形式の場合、URLオブジェクトを作成し、動画IDを取得
        const urlObj = new URL(input);
        const videoIdFromUrl = urlObj.searchParams.get('v');
        return videoIdFromUrl;
    } catch (e) {
        // URLオブジェクトが作成できない場合（ビデオIDが直接渡された場合）、そのまま返す
        return input;
    }
};
const onFocus = (event) => {
    // URLへ
    event.target.value = `https://www.youtube.com/watch?v=${event.target.value}`;
    event.target.select();
    event.target.style.width = '32em';
};
const onBlur = (event) => {
    // VIDEO IDへ
    event.target.value = extractVideoId(event.target.value);
    event.target.style.width = '4em';
}

// MEMO: defineModelを使用したいがVue 3.4以降のComposition APIの機能。Options APIでは使用できない
// const videoId = defineModel();
const videoId = ref(props.modelValue);

// videoIdの変更を監視し、URLの場合はIDを抽出して更新
watch(videoId, (newValue) => {
    try {
        const extractedId = extractVideoId(newValue);
        if (extractedId) {
            // 動画IDを補正してinputの内容も動画IDに変更
            videoId.value = extractedId;
            emit('update:modelValue', extractedId);
        } else {
            emit('update:modelValue', newValue);
        }
    } catch (error) {
        // URLとして無効な場合はそのまま文字列を保持
        emit('update:modelValue', newValue);
    }
});


// modelValueの変更を監視し、URLの場合はIDを抽出して更新
watch(() => props.modelValue, (newValue) => {
    const extractedId = extractVideoId(newValue);
    if (extractedId) {
        videoId.value = extractedId;
    }
});


</script>
