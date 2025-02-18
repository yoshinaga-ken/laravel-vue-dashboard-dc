<template>
    <label for="lng">軽度</label>
    <input v-model.number="lng" id="lng" type="number" min="-180" max="180" step="0.1"/>
    <GoogleMap
        ref="mapRef"
        :api-key="VITE_GMAP_API_KEY"
        style="width: 100%; height: 800px"
        class="map"
        :center="center"
        :zoom="10"
    >
        <Marker :options="{ position: center }"/>
    </GoogleMap>
</template>

<script setup>
/*
TODO: covid19.php 側の機能を移植する事
@see https://vue3-google-map.com/advanced-usage/
@see https://zenn.dev/secondselection/articles/vue3_googlemapapi
 */

const PREF_CODE = {
    "北海道": "01",
    "青森県": "02",
    "岩手県": "03",
    "宮城県": "04",
    "秋田県": "05",
    "山形県": "06",
    "福島県": "07",
    "茨城県": "08",
    "栃木県": "09",
    "群馬県": "10",
    "埼玉県": "11",
    "千葉県": "12",
    "東京都": "13",
    "神奈川県": "14",
    "新潟県": "15",
    "富山県": "16",
    "石川県": "17",
    "福井県": "18",
    "山梨県": "19",
    "長野県": "20",
    "岐阜県": "21",
    "静岡県": "22",
    "愛知県": "23",
    "三重県": "24",
    "滋賀県": "25",
    "京都府": "26",
    "大阪府": "27",
    "兵庫県": "28",
    "奈良県": "29",
    "和歌山県": "30",
    "鳥取県": "31",
    "島根県": "32",
    "岡山県": "33",
    "広島県": "34",
    "山口県": "35",
    "徳島県": "36",
    "香川県": "37",
    "愛媛県": "38",
    "高知県": "39",
    "福岡県": "40",
    "佐賀県": "41",
    "長崎県": "42",
    "熊本県": "43",
    "大分県": "44",
    "宮崎県": "45",
    "鹿児島県": "46",
    "沖縄県": "47"
};
/*
東京都 _2: cityName: wardName:千代田区 CITY_CODE:13101
東京都 _2: cityName: wardName:中央区 CITY_CODE:13102
東京都 _2: cityName: wardName:港区 CITY_CODE:13103
東京都 _2: cityName: wardName:新宿区 CITY_CODE:13104
東京都 _2: cityName: wardName:文京区 CITY_CODE:13105
東京都 _2: cityName: wardName:台東区 CITY_CODE:13106
東京都 _2: cityName: wardName:墨田区 CITY_CODE:13107
東京都 _2: cityName: wardName:江東区 CITY_CODE:13108
東京都 _2: cityName: wardName:品川区 CITY_CODE:13109
東京都 _2: cityName: wardName:目黒区 CITY_CODE:13110
東京都 _2: cityName: wardName:大田区 CITY_CODE:13111
東京都 _2: cityName: wardName:世田谷区 CITY_CODE:13112
東京都 _2: cityName: wardName:渋谷区 CITY_CODE:13113
東京都 _2: cityName: wardName:中野区 CITY_CODE:13114
東京都 _2: cityName: wardName:杉並区 CITY_CODE:13115
東京都 _2: cityName: wardName:豊島区 CITY_CODE:13116
東京都 _2: cityName: wardName:北区 CITY_CODE:13117
東京都 _2: cityName: wardName:荒川区 CITY_CODE:13118
東京都 _2: cityName: wardName:板橋区 CITY_CODE:13119
東京都 _2: cityName: wardName:練馬区 CITY_CODE:13120
東京都 _2: cityName: wardName:足立区 CITY_CODE:13121
東京都 _2: cityName: wardName:葛飾区 CITY_CODE:13122
東京都 _2: cityName: wardName:江戸川区 CITY_CODE:13123
東京都 _2: cityName: wardName:八王子市 CITY_CODE:13201
東京都 _2: cityName: wardName:立川市 CITY_CODE:13202
東京都 _2: cityName: wardName:武蔵野市 CITY_CODE:13203
東京都 _2: cityName: wardName:三鷹市 CITY_CODE:13204
東京都 _2: cityName: wardName:青梅市 CITY_CODE:13205
東京都 _2: cityName: wardName:府中市 CITY_CODE:13206
東京都 _2: cityName: wardName:昭島市 CITY_CODE:13207
東京都 _2: cityName: wardName:調布市 CITY_CODE:13208
東京都 _2: cityName: wardName:町田市 CITY_CODE:13209
東京都 _2: cityName: wardName:小金井市 CITY_CODE:13210
東京都 _2: cityName: wardName:小平市 CITY_CODE:13211
東京都 _2: cityName: wardName:日野市 CITY_CODE:13212
東京都 _2: cityName: wardName:東村山市 CITY_CODE:13213
東京都 _2: cityName: wardName:国分寺市 CITY_CODE:13214
東京都 _2: cityName: wardName:国立市 CITY_CODE:13215
東京都 _2: cityName: wardName:福生市 CITY_CODE:13218
東京都 _2: cityName: wardName:狛江市 CITY_CODE:13219
東京都 _2: cityName: wardName:東大和市 CITY_CODE:13220
東京都 _2: cityName: wardName:清瀬市 CITY_CODE:13221
東京都 _2: cityName: wardName:東久留米市 CITY_CODE:13222
東京都 _2: cityName: wardName:武蔵村山市 CITY_CODE:13223
東京都 _2: cityName: wardName:多摩市 CITY_CODE:13224
東京都 _2: cityName: wardName:稲城市 CITY_CODE:13225
東京都 _2: cityName: wardName:羽村市 CITY_CODE:13227
東京都 _2: cityName: wardName:あきる野市 CITY_CODE:13228
東京都 _2: cityName: wardName:西東京市 CITY_CODE:13229
東京都 _2: cityName:西多摩郡 wardName:瑞穂町 CITY_CODE:13303
東京都 _2: cityName:西多摩郡 wardName:日の出町 CITY_CODE:13305
東京都 _2: cityName:西多摩郡 wardName:檜原村 CITY_CODE:13307
東京都 _2: cityName:西多摩郡 wardName:奥多摩町 CITY_CODE:13308
東京都 _2: cityName:大島支庁 wardName:利島村 CITY_CODE:13362
東京都 _2: cityName:大島支庁 wardName:神津島村 CITY_CODE:13364
東京都 _2: cityName:三宅支庁 wardName:三宅村 CITY_CODE:13381
東京都 _2: cityName:三宅支庁 wardName:御蔵島村 CITY_CODE:13382
東京都 _2: cityName:八丈支庁 wardName:八丈町 CITY_CODE:13401
東京都 _2: cityName:八丈支庁 wardName:青ヶ島村 CITY_CODE:13402
東京都 _2: cityName:大島支庁 wardName:大島町 CITY_CODE:13361
東京都 _2: cityName:大島支庁 wardName:新島村 CITY_CODE:13363
東京都 _2: cityName:小笠原支庁 wardName:小笠原村 CITY_CODE:13421
 */
const CITY_CODE = {
    "東京都": {
        "千代田区": "13101",
        "中央区": "13102",
        "港区": "13103",
        "新宿区": "13104",
        "文京区": "13105",
        "台東区": "13106",
        "墨田区": "13107",
        "江東区": "13108",
        "品川区": "13109",
        "目黒区": "13110",
        "大田区": "13111",
        "世田谷区": "13112",
        "渋谷区": "13113",
        "中野区": "13114",
        "杉並区": "13115",
        "豊島区": "13116",
        "北区": "13117",
        "荒川区": "13118",
        "板橋区": "13119",
        "練馬区": "13120",
        "足立区": "13121",
        "葛飾区": "13122",
        "江戸川区": "13123",
        "八王子市": "13201",
        "立川市": "13202",
        "武蔵野市": "13203",
        "三鷹市": "13204",
        "青梅市": "13205",
        "府中市": "13206",
        "昭島市": "13207",
        "調布市": "13208",
        "町田市": "13209",
        "小金井市": "13210",
        "小平市": "13211",
        "日野市": "13212",
        "東村山市": "13213",
        "国分寺市": "13214",
        "国立市": "13215",
        "福生市": "13218",
        "狛江市": "13219",
        "東大和市": "13220",
        "清瀬市": "13221",
        "東久留米市": "13222",
        "武蔵村山市": "13223",
        "多摩市": "13224",
        "稲城市": "13225",
        "羽村市": "13227",
        "あきる野市": "13228",
        "西東京市": "13229",
        "瑞穂町": "13303", // 西多摩郡
        "日の出町": "13305", // 西多摩郡
        "檜原村": "13307", // 西多摩郡
        "奥多摩町": "13308", // 西多摩郡
        "利島村": "13362", // 大島支庁
        "神津島村": "13364", // 大島支庁
        "三宅村": "13381", // 三宅支庁
        "御蔵島村": "13382", // 三宅支庁
        "八丈町": "13401", // 八丈支庁
        "青ヶ島村": "13402", // 八丈支庁
        "大島町": "13361", // 大島支庁
        "新島村": "13363", // 大島支庁
        "小笠原村": "13421" // 小笠原支庁
    },
    "千葉県": {
        "千葉市中央区": "1201",
        "千葉市千葉区": "1202",
    },
    "福岡県": {
        "福岡市博多区": "4001",
        "福岡市博中央区": "4002",
    }
}
const LatLng = {
    '東京都': {lat: 35.681236, lng: 139.767125},
    '石川県': {lat: 35.681236, lng: 139.767125},
}
// TODO: TypeScriptで型定義
const props = defineProps({
    prefectures: {
        type: Object,
        default: {
            "東京都": {
                "千代田区": 70,
                "中央区": 80,
                "西東京市": 32,
                "立川市": 12,
                "瑞穂町": 4, // 西多摩郡
            }
        },
    }
});
// const prefectures = {
//     "東京都": {
//         "千代田区": 70,
//         "中央区": 80,
//         "西東京市": 32,
//         "立川市": 12,
//         "瑞穂町": 4, // 西多摩郡
//
//     },
//     "千葉県": {
//         "千葉市中央区": 33,
//         "千葉市千葉区": 33,
//     },
//     "福岡県": {
//         "福岡市博多区": 33,
//         "福岡市博中央区": 33,
//         "春日市": 33,
//     }
//
// }

const {VITE_GMAP_API_KEY} = import.meta.env;

import {GoogleMap, Marker} from 'vue3-google-map'
import {computed, ref, watch} from "vue";
// type gmap = {
//   mapRef: Ref<HTMLElement | undefined>;
//   ready: Ref<boolean>;
//   map: Ref<google.maps.Map | undefined>;
//   api: Ref<typeof google.maps | undefined>;
//   mapTilesLoaded: Ref<boolean>;
// };

// const mapRef: Ref<gmap | null> = ref(null);
const mapRef = ref(null)
// const center = { lat: 40.689247, lng: -74.044502 }
// const center = {lat: 36.2048, lng: 138.2529} // Center of Japan
const center = LatLng['東京都'];
const _lng = ref(center.lng)
const lng = computed({
    get: () => _lng.value,
    set: v => {
        if (!Number.isFinite(v)) {
            _lng.value = 0
        } else if (v > 180) {
            _lng.value = 180
        } else if (v < -180) {
            _lng.value = -180
        } else {
            _lng.value = v
        }
    },
})

// watch(props.prefectures, () => {
//     console.log('@@@prefectures');
//     loadPrefectureBoundaries()
// })
// const pre = computed(()=>{
//     console.log('pre');
//     return props.prefectures;
// })

watch(() => mapRef.value?.ready, (ready) => {
    if (!ready) {
        return;
    }
    console.log('@@@ready');
    testMarker();
    // loadPrefectureBoundaries()
})
watch([() => mapRef.value?.ready, lng], ([ready, lng]) => {
    if (!ready)
        return
    console.log('@@@lng', lng);
    mapRef.value.map.panTo({lat: center.lat, lng})
})

const testMarker = () => {
    //@see https://qiita.com/kyohets/items/81db3eac01c9d4146445
    const address = '東京都八王子市';
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
              // 緯度経度を取得し、マーカーを設定
            // @see https://developers.google.com/maps/documentation/javascript/advanced-markers/migration?hl=ja
                const marker = new google.maps.Marker({
              // const marker = new google.maps.marker.AdvancedMarkerElement({ //NG
                map: mapRef.value.map,
                position: results[0].geometry.location,
                // content: new google.maps.marker.PinElement({
                //   background: '#FF0000', // 背景色を指定
                //   glyphColor: '#FFFFFF', // テキストの色を指定
                //   scale: 1.2, // スケールを指定
                //   glyph: 'A', // アイコンの文字やグリフ
                // }),
                title: address,
              });

              // // マーカーをクリックしたときに観光地名を表示
              // const infoWindow = new google.maps.InfoWindow({
              //   content: `<div><strong>${address}</strong></div>`,
              // });
              // marker.addListener('click', () => {
              //   infoWindow.open(map.value, marker);
              // });

        } else {
            console.log('Geocode was not successful for the following reason: ' + status);
        }
    });
}
const loadPrefectureBoundaries = () => {
    /*
            'https://raw.githubusercontent.com/niiyz/JapanCityGeoJson/master/geojson/prefecture/prefecture.json',
            @see https://github.com/niiyz/JapanCityGeoJson
            'https://raw.githubusercontent.com/niiyz/JapanCityGeoJson/master/geojson/prefectures/12.json',　// 千葉
             'https://raw.githubusercontent.com/niiyz/JapanCityGeoJson/master/geojson/12/12101.json',　// 千葉市中央区
             'https://raw.githubusercontent.com/niiyz/JapanCityGeoJson/master/geojson/12/12102.json',　// 千葉市 花見川区

            'https://raw.githubusercontent.com/niiyz/JapanCityGeoJson/master/geojson/prefectures/13.json', // 東京
    */
    if (0) { //千葉
        const _12 = [
            12101,
            12102,
            12103,
            12104,
            12105,
            12106,
            12202,
            12203,
            12204,
            12205,
            12206,
            12207,
            12208,
            12210,
            12211,
            12212,
            12213,
            12215,
            12216,
            12217,
            12218,
            12219,
            12220,
            12221,
            12222,
            12223,
            12224,
            12225,
            12226,
            12227,
            12228,
            12229,
            12230,
            12231,
            12232,
            12233,
            12234,
            12235,
            12236,
            12237,
            12238,
            12239,
            12322,
            12329,
            12342,
            12347,
            12349,
            12403,
            12409,
            12410,
            12421,
            12422,
            12423,
            12424,
            12426,
            12427,
            12441,
            12443,
            12463,

        ];
        if (1) {
            for (const url of _12) {
                mapRef.value.map.data.loadGeoJson(
                    'https://raw.githubusercontent.com/niiyz/JapanCityGeoJson/master/geojson/12/' + url + '.json',
                );
            }
        } else {
            mapRef.value.map.data.loadGeoJson(
                'https://raw.githubusercontent.com/niiyz/JapanCityGeoJson/master/geojson/prefectures/12.json', // 千葉
            );
        }
    }

    if (0) {
        const _13 = [
            13101,
            13102,
            13103,
            13104,
            13105,
            13106,
            13107,
            13108,
            13109,
            13110,
            13111,
            13112,
            13113,
            13114,
            13115,
            13116,
            13117,
            13118,
            13119,
            13120,
            13121,
            13122,
            13123,
            13201,
            13202,
            13203,
            13204,
            13205,
            13206,
            13207,
            13208,
            13209,
            13210,
            13211,
            13212,
            13213,
            13214,
            13215,
            13218,
            13219,
            13220,
            13221,
            13222,
            13223,
            13224,
            13225,
            13227,
            13228,
            13229,
            13303,
            13305,
            13307,
            13308,
            13361,
            13362,
            13363,
            13364,
            13381,
            13382,
            13401,
            13402,
            13421,
        ]
        if (1) {
            for (const url of _13) {
                mapRef.value.map.data.loadGeoJson(
                    'https://raw.githubusercontent.com/niiyz/JapanCityGeoJson/master/geojson/13/' + url + '.json',
                );
            }
        } else {
            mapRef.value.map.data.loadGeoJson(
                'https://raw.githubusercontent.com/niiyz/JapanCityGeoJson/master/geojson/prefectures/13.json', // 東京
            );
        }
    }

    let vals = {};
    for (const p in props.prefectures) {
        const prefCode = PREF_CODE[p]
        if (!prefCode) {
            continue
        }
        for (const city in props.prefectures[p]) {
            const cityCode = CITY_CODE[p][city];
            const val = props.prefectures[p][city];
            console.log(p, city, cityCode, val);
            if (!cityCode) {
                continue
            }
            vals[cityCode] = val;
            mapRef.value.map.data.loadGeoJson(
                //こっちのほうが早い
                'https://raw.githubusercontent.com/niiyz/JapanCityGeoJson/master/geojson/'
                // 'geojson/'
                + prefCode + '/'
                + cityCode + '.json'
            );
        }
    }
    mapRef.value.map.data.setStyle((feature) => {
        // const feature = features[0];
        const city = feature.getProperty('N03_001');
        const _2 = feature.getProperty('N03_002');
        const cityName = feature.getProperty('N03_003');
        const wardName = feature.getProperty('N03_004');
        const cityCode = feature.getProperty('N03_007');
        console.log('city:' + city + ' _2:' + _2 + ' cityName:' + cityName + ' wardName:' + wardName + ' cityCode:' + cityCode);
        // console.log(city, _2, cityName, wardName, _7);
        const val = vals[cityCode];
        const alfa = val/100;
        return {
            fillColor: city === '東京都' ? 'rgba(255, 0, 0, '+alfa+')' : 'rgba(0, 255, 0, '+alfa+')',
            strokeColor: '#ff0000',
            strokeWeight: 1
        }
    })

}
</script>

<style scoped>
.map::after {
    position: absolute;
    content: '';
    width: 1px;
    height: 100%;
    top: 0;
    left: 50%;
    background: red;
}
</style>
