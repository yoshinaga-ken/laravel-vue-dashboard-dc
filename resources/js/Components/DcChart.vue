<template>
    <div id="app">
        <div id="blue" style="width: 300px;height: 100px;background: blue;">
            draggable
        </div>
        <p>Date: <input type="text" id="datepicker"></p>
        <div id="sparkline"></div>
        <input type="text" id="keyboard-input" value="クリックでキーボードを表示します"/>
    </div>
</template>

<script setup>
import '/public/jquery-ui/themes/dark-hive/jquery-ui.min.css';
import '/public/jquery-ui-iconfont/jquery-ui-1.12.icon-font.min.css';

import moment from 'moment';
import 'moment/dist/locale/ja';

moment.locale('ja');

import _ from 'lodash';

import {
    php_location_get_query,
    php_http_build_query,
    php_parse_str,
    php_number_format,
    php_trim,
    php_printf02d,
    php_sprintf,

    url_append_param,
    url_remove_param
} from '@/Utils/phpjs.js';

import {toRomaji} from 'wanakana';

import {
    loadScriptJQueryUI,
    loadScriptJQueryUIDatepickerJa,
    loadScriptDataTables,
    loadScriptSparkline,
    loadScriptVectormap,
} from '@/Utils/util.js';


import {onMounted} from "vue";
import * as d3 from 'd3';
import * as dc from 'dc';
import 'dc/dist/style/dc.min.css';

import * as crossfilterModule from 'crossfilter2';

const crossfilter = crossfilterModule.default || crossfilterModule;

import jQuery from 'jquery';

window.$ = window.jQuery = jQuery;

import '@/Utils/font-awesome/css/all.css';
import '@/Utils/font-awesome/css/v4-shims.min.css';

import 'virtual-keyboard/dist/css/keyboard.min.css';
import 'virtual-keyboard/dist/js/jquery.keyboard.min.js';

onMounted(async () => {
    await loadScriptJQueryUI();
    await loadScriptJQueryUIDatepickerJa();
    await loadScriptDataTables();
    await loadScriptSparkline();
    await loadScriptVectormap();

    $('#blue').draggable();

    $("#datepicker").datepicker();

    $('#keyboard-input').keyboard({
        layout: 'qwerty'
    });

    $('#sparkline').sparkline([5, 6, 7, 9, 9, 5, 3, 2, 2, 4, 6, 7], {
        type: 'line',
        width: '100px',
        height: '30px'
    });
});

</script>

<style>
</style>
