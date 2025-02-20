<template>
  <div id="app">
    <div id="loading">
      <i class="fa fa-spinner fa-spin"></i>
    </div>
    <div :class="{dark:isDark}">


      <div class="container_dc text-theme-col bg-theme-col">
        <h4 class="hdr"></h4>

        <div class="usage" style="font-size: 10pt">
          ※キーワード入力やグラフのバーをクリックする事で任意の項目での<i class="fa fa-filter"></i>フィルタリングが行えます
        </div>

        <h4 class="hdr_flt emj"></h4>

        <!-- DC_PANEL ToolbarMain -->
        <div id="toolbar_main">

          <i class="fa fa-filter fa-icon"></i>
          <input type="search" id="input-search" autocomplete="off"
                 class="btn_clear_none dark:bg-slate-900 dark:hover:bg-slate-700" value="">
          <button class="btn_clear_all ui-button ui-corner-all ui-widget"
                  title="全てのチャートのフィルタをクリアします" href="#">
            <span class="ui-icon ui-icon-closethick"></span><span v-if="!isSp">クリア</span>
          </button>
          <button v-if="!isSp" id="btn_search_keyboard" title="キーパッドを表示します"
                  class="ui-button ui-corner-all ui-widget ui-button-min">
            <span style="font-size:1.6em;">⌨</span>
          </button>

          <input type="text" id="btn_date" value="" style="display: none;">

          <button v-if="!isSp" id="btn_download_csv"
                  title="フィルタリングされたグラフのデータをCSV形式でダウンロードします。"
                  class="btn_export_file">
            <i v-if="!isSp" class="ui-icon ui-icon-arrowstop-1-s"></i>
            <img width="20" src="/img/csv.png">
          </button>

          <button v-if="!isSp" id="btn_edit_csv" title="チャートのデータをGoogleスプレッドシートで編集します。"
                  class="dark:text-white emj ui-button ui-corner-all ui-widget" disabled="true">
            ✏
          </button>

          <span v-if="!isSp||1">&nbsp;</span>

          <button v-if="!isSp||1" class="dark:text-white emj ui-button ui-corner-all ui-widget mb-0"
                  title="レイアウトを「グーグルマップベース」にします" @click="onClickStyleLoad('gmap')">
            <img src="/img/google-map-48.png" width="20">
          </button>
          <button v-if="!isSp" class="dark:text-white emj ui-button ui-corner-all ui-widget mb-0"
                  title="レイアウトを「ストリートビューベース」にします" @click="onClickStyleLoad('sview')">
            <img src="/img/icons8-street-view-60.png" width="22">
          </button>
          <button v-if="!isSp||1" class="dark:text-white emj ui-button ui-corner-all ui-widget mb-0"
                  title="レイアウトを「YouTubeベース」にします" @click="onClickStyleLoad('tube')">
            <img src="/img/yutube.gif">
          </button>
          <button v-if="!isSp||1" class="dark:text-white emj ui-button ui-corner-all ui-widget mb-0"
                  title="レイアウトを「チャートベース」にします" @click="onClickStyleLoad('default');">
            📊️
          </button>

          <button v-if="!isSp" class="dark:text-white emj ui-button ui-corner-all ui-widget mb-0"
                  title="レイアウトを自動整形します" @click="onClickStyleReset()">
            ✖️
          </button>

          <span v-if="!isSp">&nbsp;</span>

          <label class="dark:text-white emj ui-button ui-corner-all ui-widget mb-0"
                 :title="isDark ? '☀ライトモードへ' : '🌛ダークモードへ' " for="darkmode">
            {{ isDark ? '☀' : '🌛' }}
            <input type="checkbox" v-model="isDark" id="darkmode" class="hidden"/>
          </label>
        </div>

        <!-- DC_PANEL ToolbarShow -->
        <div id="toolbar_win_toggle" class="ui-button ui-corner-all ui-widget">
          <label title="ウインドウの表示・非表示を切り替えます">
            <input type="checkbox" v-model="pnl.common.toolbar.is_show"/>表示：
          </label>
          <span v-show="pnl.common.toolbar.is_show">

            <template v-if="!pnl.gmap.isHidden">
              <label for="ch_pnl_gmap" title="GoogleMapウインドウを表示します">
                  <input id="ch_pnl_gmap" type="checkbox" v-model="pnl.gmap.is_show">
                  <img src="/img/google-map-48.png" width="20" style="margin-top:-6px;">
              </label>
              <span v-if="!isSp && pnl.gmap.is_show" class="ui-icon sp_icon"
                    :class="pnl.gmap.styleBak === null ? 'ui-icon-extlink' : 'ui-icon-newwin'"
                    @click="onClickPanelMaximize('chart_gmap')"></span>
              &nbsp;
            </template>

            <template v-if="!pnl.sview.isHidden">
              <label title="ストリートビューウインドウを表示します" for="ch_pnl_sview">
                  <input id="ch_pnl_sview" type="checkbox" v-model="pnl.sview.is_show">
                  <img src="/img/icons8-street-view-60.png" width="22" style="margin-top:-10px;">
              </label>
              <span v-if="!isSp && pnl.sview.is_show" class="ui-icon sp_icon"
                    :class="pnl.sview.styleBak === null ? 'ui-icon-extlink' : 'ui-icon-newwin'"
                    @click="onClickPanelMaximize('chart_sview')"></span>
              &nbsp;
            </template>

            <template v-if="!pnl.tube.isHidden">
              <label v-if="gg.dt !== DT_COVID" for="ch_pnl_tube" title="YOUTUBE動画再生ウインドウを表示します">
                  <input id="ch_pnl_tube" type="checkbox" v-model="pnl.tube.is_show">
                  <img src="/img/yutube.gif" width="18" style="margin-left:3px;margin-top:-8px;">
              </label>
              <span v-if="!isSp && pnl.tube.is_show" class="ui-icon sp_icon"
                    :class="pnl.tube.styleBak === null ? 'ui-icon-extlink' : 'ui-icon-newwin'"
                    @click="onClickPanelMaximize('chart_tube')"></span>
            </template>

            <span v-if="gg.dt !== DT_COVID">&nbsp;&nbsp;</span>

            <label v-if="!pnl.map.isHidden" for="ch_pnl_map" title="日本都道府県地図ウインドウを表示します"><input
              id="ch_pnl_map" type="checkbox" v-model="pnl.map.is_show"><i class="fa fa-map"></i>&nbsp;</label>
            <label v-if="!pnl.name.isHidden" for="ch_pnl_name"><input id="ch_pnl_name" type="checkbox"
                                                                      v-model="pnl.name.is_show"><span
              v-html="pnl.name.title"></span>&nbsp;</label>
            <label v-if="!pnl.city.isHidden" for="ch_pnl_city"><input id="ch_pnl_city" type="checkbox"
                                                                      v-model="pnl.city.is_show"><span
              v-html="pnl.city.title"></span>&nbsp;</label>
            <label v-if="!pnl.date.isHidden" for="ch_pnl_date"><input id="ch_pnl_date" type="checkbox"
                                                                      v-model="pnl.date.is_show"><span
              v-html="pnl.date.title"></span>&nbsp;</label>
            <label v-if="!pnl.year.isHidden" for="ch_pnl_year"> <input id="ch_pnl_year" type="checkbox"
                                                                       v-model="pnl.year.is_show"><span
              v-html="pnl.year.title"></span>&nbsp;</label>
            <label v-if="!pnl.season.isHidden" for="ch_pnl_season"> <input id="ch_pnl_season" type="checkbox"
                                                                           v-model="pnl.season.is_show"><span
              v-html="pnl.season.title"></span>&nbsp;</label>
            <label v-if="!pnl.week.isHidden" for="ch_pnl_week"><input id="ch_pnl_week" type="checkbox"
                                                                      v-model="pnl.week.is_show">曜日&nbsp;</label>
            <label v-if="!pnl.sex.isHidden" for="ch_pnl_sex"> <input id="ch_pnl_sex" type="checkbox"
                                                                     v-model="pnl.sex.is_show"><span
              v-html="pnl.sex.title"></span>&nbsp;</label>
            <label v-if="!pnl.age.isHidden" for="ch_pnl_age"> <input id="ch_pnl_age" type="checkbox"
                                                                     v-model="pnl.age.is_show"><span
              v-html="pnl.age.title"></span>&nbsp;</label>
            <label v-if="!pnl.cond.isHidden" for="ch_pnl_cond"><input id="ch_pnl_cond" type="checkbox"
                                                                      v-model="pnl.cond.is_show"><span
              v-html="pnl.cond.title"></span>&nbsp;</label>
            <label v-if="!pnl.job.isHidden" for="ch_pnl_job"> <input id="ch_pnl_job" type="checkbox"
                                                                     v-model="pnl.job.is_show"><span
              v-html="pnl.job.title"></span>&nbsp;</label>

            <template v-for="(item, i) in pnl.ex">
                <template v-if="!item.isHidden">
                    <label> <input type="checkbox" v-model="item.is_show"><span
                      v-html="item.title"></span>&nbsp;</label>
                </template>
            </template>

            <label v-if="!pnl.detail.isHidden" for="ch_pnl_detail"><input id="ch_pnl_detail" type="checkbox"
                                                                          v-model="pnl.detail.is_show">詳細&nbsp;</label>
            <label for="ch_pnl_ana" v-show="gg.dt===DT_COVID && pnl.ana.is_chk_show">
                <input id="ch_pnl_ana" type="checkbox" v-model="pnl.ana.is_show">
                <i class="fa fa-eye"></i>分析
            </label>
          </span>
        </div>

        <div id="panels">
          <!-- DC_PANEL GoogleMap -->
          <div id="chart_gmap" class="bg-theme-col2 dc_panel drag" :style="pnl.gmap.style"
               v-show="pnl.gmap.is_show">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2" v-html="pnl.gmap.title"></span>
              &nbsp;&nbsp;<label title="ズームアウトすると 3D で地球を見ることができます"><input
              disabled="true"
              type="checkbox"
              v-model="pnl.gmap.is3">地球表示</label>
              <span class="ui-icon ui-icon-circle-close sp_icon btn_close"
                    @click="pnl.gmap.is_show=0"></span>
              <span v-if="!isSp" class="ui-icon sp_icon btn_winsize"
                    :class="pnl.gmap.styleBak === null ? 'ui-icon-extlink' : 'ui-icon-newwin'"
                    @click="onClickPanelMaximize('chart_gmap')"></span>
            </div>
            <GoogleMap
              v-if="pnl.gmap.is_show || pnl.sview.is_show"
              :layer-prefectures="pnl.gmap.chartGMap.layer"
              :focus-prefectures="pnl.gmap.chartGMap.focus"
              :center="pnl.gmap.chartGMap.center"
              :color-threshold="pnl.gmap.chartGMap.colorThreshold"
              :pan-to-marker-type="pnl.gmap.chartGMap.panToMarkerType"
              :marker-info="pnl.gmap.chartGMap.markerInfo"
              street-view-container-id="street-view"
            ></GoogleMap>
            <div class="crosshair"></div>
          </div>

          <!-- DC_PANEL StreetView -->
          <div id="chart_sview" class="bg-theme-col2 dc_panel drag" :style="pnl.sview.style"
               v-show="pnl.sview.is_show">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2" v-html="pnl.sview.title"></span>
              <span class="ui-icon ui-icon-circle-close sp_icon btn_close"
                    @click="pnl.sview.is_show=0"></span>
              <span v-if="!isSp" class="ui-icon sp_icon btn_winsize"
                    :class="pnl.sview.styleBak === null ? 'ui-icon-extlink' : 'ui-icon-newwin'"
                    @click="onClickPanelMaximize('chart_sview')"></span>
            </div>
            <div id="street-view"></div>
          </div>

          <!-- DC_PANEL VectorMap -->
          <div id="chart_map" class="bg-theme-col2 dc_panel drag" :style="pnl.map.style"
               v-show="pnl.map.is_show">
            <div class="chart-title-wrap">
              <ul class="chart-title text-theme-col2" v-show="pnl.map.tabs.is_show">
                <!--          <li><a href="#tabs_w" title="世界の感染状況"><i class="fa fa-globe"></i>世界</a></li>-->
                <li><a href="#tabs_c" title="感染者数 @日本">感染</a></li>
                <li><a href="#tabs_p"
                       title="入院治療等を要する患者数(累計)。(感染者数-無症状者数-退院者数-死亡者数) @日本">患者</a>
                </li>
                <li><a href="#tabs_pc" title="人口一人あたりのPCR検査率(100*PCR検査数/総人口)% @日本">PCR</a>
                </li>
                <li><a href="#tabs_d" title="死亡者数 - 日本">死亡</a></li>
                <li><a href="#tabs_b" title="対策病床数 - 日本">病床</a></li>
                <span class="ui-icon ui-icon-circle-close sp_icon btn_close" @click="pnl.map.is_show=0"
                      style="top: 8px;"></span>
              </ul>
              <div id="tabs_w"></div>
              <div id="tabs_c"></div>
              <div id="tabs_p"></div>
              <div id="tabs_pc"></div>
              <div id="tabs_d"></div>
              <div id="tabs_b"></div>
              <span v-show="!pnl.map.tabs.is_show" class="chart-title text-theme-col2" v-html="pnl.map.title"></span>
              <span v-show="!pnl.map.tabs.is_show" class="chart-sub-title text-theme-col2"
                    v-html="pnl.map.subTitle"></span>
              <span v-show="!pnl.map.tabs.is_show" class="ui-icon ui-icon-circle-close sp_icon btn_close"
                    @click="pnl.map.is_show=0"></span>
            </div>

            <div id="japan-map"></div>
          </div>

          <!-- DC_PANEL YouTube -->
          <div v-if="gg.dt !== DT_COVID" id="chart_tube" class="bg-theme-col2 dc_panel drag"
               :style="pnl.tube.style" v-show="pnl.tube.is_show">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2" v-html="pnl.tube.title"></span>
              &nbsp;
              <YoutubeVidInput v-model="pnl.tube.vid"/>

              <button v-for="(id, i) in pnl.tube.vids" :key="i"
                      class="detail-tube-play tt_img ui-button ui-button-min ui-corner-all ui-widget"
                      :vid="id"
                      :src="`https://img.youtube.com/vi/${id}/hqdefault.jpg`"
                      :title="`「${pnl.tube.searchQuery.replaceAll('+', ' ')}」の動画${i+1}を再生`"
                      style="margin-left: 2px;">
                <span class="ui-icon ui-icon-play" style="font-size: 0.8em"></span>{{ i }}
              </button>
              <a target="_blank" class="detail-tube-wopen"
                 :href="`https://www.youtube.com/results?search_query=${pnl.tube.searchQuery}`"
                 :title="`YouTubeで「${pnl.tube.searchQuery.replaceAll('+', ' ')}」の動画一覧を見る`">{{
                  isSp ? '' : '一覧'
                }}
                <span class="ui-icon ui-icon-extlink" style="font-size: 0.9em"></span>
              </a>

              &nbsp;<label title="フィルタされたタイミングで動画を自動で切り替えます"><input
              type="checkbox" v-model="pnl.tube.vidAutoChange">自動</label>
              <span class="ui-icon ui-icon-circle-close sp_icon btn_close"
                    @click="pnl.tube.is_show=0"></span>
              <span v-if="!isSp" class="ui-icon sp_icon btn_winsize"
                    :class="pnl.tube.styleBak === null ? 'ui-icon-extlink' : 'ui-icon-newwin'"
                    @click="onClickPanelMaximize('chart_tube')"></span>
            </div>
            <iframe id="tube_iframe" width="100%" :height="isSp?'90%':'95%'"
                    :src="'https://www.youtube.com/embed/' + pnl.tube.vid"
                    title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

          </div>

          <!-- DC_PANEL Name -->
          <div id="panel_name" class="bg-theme-col2 dc_panel drag" :style="pnl.name.style" v-show="pnl.name.is_show">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2" v-html="pnl.name.title"></span>

              <div class="inline-block">
                <a class="btn_reset" id="btn_reset_name" href="javascript:void(0);"
                   title="チャートのフィルタをクリアーします。&#x0A;バーは長押しで単一選択となります。"
                   style="display: none;">
                  <span class="ui-icon ui-icon-closethick"></span>
                </a>
                <input type="text" class="filter_txt tt_filter" readonly style="display: none;">
              </div>

              <!-- TODO: FilterComponent -->
              <div class="inline-block">
                <button title="フィルタ入力欄の表示・非表示を切り替えます"
                        class="chart-filter-toggle name ui-button ui-corner-all ui-widget ui-button-min"
                        data-toggle_target="#name_search">
                  <img src="/img/filter.gif">
                </button>
                <input type="search" id="name_search"
                       class="chart-filter" data-filter_svg_div="#div_name"
                       data-filter_cnt="#name_filter_cnt"
                       placeholder="キーワード(正規表現可)"
                       title="入力したキーワードで表示をフィルタリングできます。&#x0A;正規表現可能。&#x0A;正規表現例:<WORD>|<WORD2>">
                <span id="name_filter_cnt" class="chart-filter-cnt"></span>
              </div>

              <span class="ui-icon ui-icon-circle-close sp_icon btn_close"
                    @click="pnl.name.is_show=0"></span>
            </div>
            <div id="div_name" class="scrollbar-thin">
              <div id="chart_name"></div>
            </div>
            <div class="clearfix"></div>
          </div>

          <!-- DC_PANEL City -->
          <div id="panel_city" class="bg-theme-col2 dc_panel drag" :style="pnl.city.style" v-show="pnl.city.is_show">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2" v-html="pnl.city.title"></span>

              <template v-if="pnl.city.orderUI">
                <!-- TODO: BtnComponent -->
                <label class="ui-button ui-button-min ui-corner-all ui-widget"
                       :class="pnl.city.orderCnt ? 'btn_on' : 'btn_off'"
                       :title="(pnl.city.orderCnt ? '時間昇順で並び替え' : '値降順で並び替え')">
                  <img src="/img/chart-sort-asc.svg" class="dark:invert -scale-y-100" style="width:1.2em;">
                  <input type="checkbox" v-model="pnl.city.orderCnt" class="hidden"/>
                </label>
              </template>

              <div class="inline-block">
                <a class="btn_reset" id="btn_reset_city" href="javascript:void(0);"
                   title="チャートのフィルタをクリアーします。&#x0A;バーは長押しで単一選択となります。"
                   style="display: none;">
                  <span class="ui-icon ui-icon-closethick"></span>
                </a>
                <input type="text" class="filter_txt tt_filter" readonly style="display: none;">
              </div>

              <!-- TODO: FilterComponent -->
              <div class="inline-block">
                <button title="フィルタ入力欄の表示・非表示を切り替えます"
                        class="chart-filter-toggle city ui-button ui-corner-all ui-widget ui-button-min"
                        data-toggle_target="#city_search">
                  <img src="/img/filter.gif">
                </button>
                <input type="search" id="city_search"
                       class="chart-filter" data-filter_svg_div="#div_city"
                       data-filter_cnt="#city_filter_cnt"
                       placeholder="キーワード(正規表現可)"
                       title="入力したキーワードで表示をフィルタリングできます。&#x0A;正規表現可能。&#x0A;正規表現例:<WORD>|<WORD2>">
                <span id="city_filter_cnt" class="chart-filter-cnt"></span>
              </div>

              <span class="ui-icon ui-icon-circle-close sp_icon btn_close inline-block"
                    @click="pnl.city.is_show=0"></span>

            </div>
            <div id="div_city" class="scrollbar-thin">
              <div id="chart_city"></div>
            </div>
            <div class="clearfix"></div>
          </div>

          <!-- DC_PANEL Date -->
          <div id="panel_date" class="bg-theme-col2 dc_panel drag" :style="pnl.date.style" v-show="pnl.date.is_show">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2"
                    v-html="(pnl.date.title.indexOf('感染者数')===-1 ? '' : '<i class=\'fa fa-procedures\'>') + pnl.date.title">
              </span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button class="btn_play ui-button ui-button-min ui-corner-all ui-widget"
                      @click="onClickChartDatePlay"
                      title="選択時間をシフトさせ、すべてのチャートの変化を再生します。">
                {{ pnl.date.play.label }}
              </button>
              <span class="btn_brush ui-button ui-button-min ui-corner-all ui-widget"
                    :class="pnl.date.isBrushOn?'btn_on':'btn_off'"
                    @click="onClickChartDateBrushBtn"
                    title="日付のフィルタの範囲ドラッグ選択モードをON・OFFします。&#x0A;選択した範囲はドラッグする事で時間軸での変化の分析が可能です。">
                <span class="ui-icon ui-icon-arrow-2-e-w sp_icon"></span>選択
              </span>
              <a class="btn_reset" id="btn_reset_date" href="javascript:void(0);" style="display: none;">
                <span class="ui-icon ui-icon-closethick"></span>
              </a>
              <input type="text" class="filter_txt" readonly style="display: none;">&nbsp;
              <span class="filter_txt_diff"></span>&nbsp;

              <!-- TODO: StackTypeComponent -->
              <label title="チャートのスタックタイプを切り替えます">📊
                <input type="radio" id="stack_type_pl1" v-model="pnl.date.stack_type" :value="1">
                <label v-html="pnl.name.title" for="stack_type_pl1"></label>&nbsp;
                <input type="radio" id="stack_type_age" v-model="pnl.date.stack_type" :value="2">
                <label v-html="pnl.age.title" for="stack_type_age"></label>&nbsp;
                <input type="radio" id="stack_type_con" v-model="pnl.date.stack_type" :value="0">
                <label v-html="pnl.cond.title" for="stack_type_con"></label>
              </label>
              &nbsp;&nbsp;
              <label v-if="pnl.date.chart2.type!==0" title="ライン形式のチャートも表示します">
                <input type="checkbox" v-model="pnl.date.chart2.is_show">📈表示</label>

              <span class="ui-icon ui-icon-circle-close sp_icon btn_close" @click="pnl.date.is_show=0"></span>

              <div class="div_total">{{ pnl.common.unit }} 累計&nbsp;
                <span class="div_total_cnt" v-text="pnl.date.cnt"></span>
              </div>
              <div class="clearfix"></div>
              <div class="div_cnt">
                <div class="div_cnt_day"><span v-text="pnl.date.cnt_day"></span></div>
                <div class="div_cnt_one">前日比 <span v-text="pnl.date.cnt_one"></span>　　</div>
              </div>
            </div>
            <div id="div_date">
              <div id="chart_date"></div>
            </div>

            <div v-show="pnl.date.chart2.is_show">
              <span class="chart-title text-theme-col2" v-html="pnl.date.chart2.title"></span>
              <span class="chart-title2 text-theme-col2 " v-html="pnl.date.chart2.title2"></span>
              <div v-if="pnl.date.chart2.type === 0" class="div_total">累計&nbsp;<span
                class="div_total_cnt" v-text="pnl.date.chart2.cnt"></span>&nbsp;名&nbsp;&nbsp;
              </div>
              <div id="div_date2" style="overflow-x: auto;width: 100%;">
                <div id="chart_date2"></div>
              </div>
            </div>
            <div class="clearfix"></div>
          </div>

          <!-- DC_PANEL Year -->
          <div id="panel_year" class="bg-theme-col2 dc_panel drag" :style="pnl.year.style" v-show="pnl.year.is_show">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2" v-html="pnl.year.title"></span>
              <a class="reset btn_reset" id="btn_reset_year" href="javascript:void(0);" style="display: none;">
                <span class="ui-icon ui-icon-closethick"></span>
              </a>
              <input type="text" class="filter_txt tt_filter" readonly style="display: none;">

              <!-- TODO: StackTypeComponent -->
              <label title="チャートのスタックタイプを切り替えます">📊
                <input type="radio" id="stack_type_pl1" v-model="pnl.date.stack_type" :value="1">
                <label v-html="pnl.name.title" for="stack_type_pl1"></label>&nbsp;
                <input type="radio" id="stack_type_age" v-model="pnl.date.stack_type" :value="2">
                <label v-html="pnl.age.title" for="stack_type_age"></label>&nbsp;
                <input type="radio" id="stack_type_con" v-model="pnl.date.stack_type" :value="0">
                <label v-html="pnl.cond.title" for="stack_type_con"></label>
              </label>

              <span class="ui-icon ui-icon-circle-close sp_icon btn_close" @click="pnl.year.is_show=0"></span>
            </div>
            <div>
              <div id="chart_year"></div>
            </div>
            <div class="clearfix"></div>
          </div>

          <!-- DC_PANEL Season -->
          <div id="panel_season" class="bg-theme-col2 dc_panel drag" :style="pnl.season.style"
               v-show="pnl.season.is_show">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2"
                    v-html="(pnl.season.title.indexOf('性別')===-1 ? '' : '<i class=\'fa fa-venus-mars\'>') + pnl.season.title">
              </span>
              <a class="reset btn_reset" id="btn_reset_season" href="javascript:void(0);" style="display: none;">
                <span class="ui-icon ui-icon-closethick"></span>
              </a>
              <input type="text" class="filter_txt tt_filter" readonly style="display: none;">
              <span class="ui-icon ui-icon-circle-close sp_icon btn_close" @click="pnl.season.is_show=0"></span>
            </div>
            <div>
              <div id="chart_season"></div>
            </div>
            <div class="clearfix"></div>
          </div>

          <!-- DC_PANEL Week-->
          <div id="panel_week" class="bg-theme-col2 dc_panel drag" :style="pnl.week.style"
               v-show="pnl.week.is_show">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2" v-html="pnl.week.title"></span>
              <a class="reset btn_reset" id="btn_reset_week" href="javascript:void(0);" style="display: none;">
                <span class="ui-icon ui-icon-closethick"></span>
              </a>
              <input type="text" class="filter_txt tt_filter" readonly style="display: none;">
              <span class="ui-icon ui-icon-circle-close sp_icon btn_close" @click="pnl.week.is_show=0"></span>
            </div>
            <div>
              <div id="chart_week"></div>
            </div>
            <div class="clearfix"></div>
          </div>

          <!-- DC_PANEL Sex-->
          <div id="panel_sex" class="bg-theme-col2 dc_panel drag" :style="pnl.sex.style" v-show="pnl.sex.is_show">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2"
                    v-html="(pnl.sex.title.indexOf('性別')===-1 ? '' : '<i class=\'fa fa-venus-mars\'>') + pnl.sex.title"></span>
              <a class="reset btn_reset" id="btn_reset_sex" href="javascript:void(0);" style="display: none;">
                <span class="ui-icon ui-icon-closethick"></span>
              </a>
              <input type="text" class="filter_txt tt_filter" readonly style="display: none;">

              <template v-if="pnl.sex.chartType === 'bar'">
                <!-- TODO: BtnComponent -->
                <label class="ui-button ui-button-min ui-corner-all ui-widget"
                       :class="pnl.sex.elasticX ? 'btn_on' : 'btn_off'" title="ソートありなしを切り替えます">
                  <img src="/img/chart-sort-asc.svg" class="dark:invert -rotate-90 -scale-y-100" style="width:1.2em;">
                  <input type="checkbox" v-model="pnl.sex.elasticX" class="hidden"/>
                </label>

                <!-- TODO: StackTypeComponent -->
                <label title="チャートのスタックタイプを切り替えます">📊
                  <input type="radio" id="stack_type_pl1" v-model="pnl.date.stack_type" :value="1">
                  <label v-html="pnl.name.title" for="stack_type_pl1"></label>&nbsp;
                  <input type="radio" id="stack_type_age" v-model="pnl.date.stack_type" :value="2">
                  <label v-html="pnl.age.title" for="stack_type_age"></label>&nbsp;
                  <input type="radio" id="stack_type_con" v-model="pnl.date.stack_type" :value="0">
                  <label v-html="pnl.cond.title" for="stack_type_con"></label>
                </label>
              </template>

              <span class="ui-icon ui-icon-circle-close sp_icon btn_close" @click="pnl.sex.is_show=0"></span>
            </div>
            <div>
              <div id="chart_sex"></div>
            </div>
            <div class="clearfix"></div>
          </div>

          <!-- DC_PANEL Age-->
          <div id="panel_age" class="bg-theme-col2 dc_panel drag" :style="pnl.age.style" v-show="pnl.age.is_show">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2" v-html="pnl.age.title"></span>&nbsp;

              <!-- TODO: BtnComponent -->
              <label class="ui-button ui-button-min ui-corner-all ui-widget"
                     :class="pnl.age.elasticX ? 'btn_on' : 'btn_off'"
                     title="ソートありなしを切り替えます">
                <img src="/img/chart-sort-asc.svg" class="dark:invert -rotate-90 -scale-y-100" style="width:1.2em;">
                <input type="checkbox" v-model="pnl.age.elasticX" class="hidden"/>
              </label>

              <a class="reset btn_reset" id="btn_reset_age" href="javascript:void(0);" style="display: none;">
                <span class="ui-icon ui-icon-closethick"></span>
              </a>
              <input type="text" class="filter_txt tt_filter" readonly style="display: none;">
              <span class="ui-icon ui-icon-circle-close sp_icon btn_close" @click="pnl.age.is_show=0"></span>
            </div>
            <div>
              <div id="chart_age"></div>
            </div>
            <div class="clearfix"></div>
          </div>

          <!-- DC_PANEL Cond -->
          <div id="panel_cond" class="bg-theme-col2 dc_panel drag" :style="pnl.cond.style" v-show="pnl.cond.is_show">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2"
                    v-html="(pnl.cond.title.indexOf('状態')===-1 ? '' : '<i class=\'fa fa-medkit\'>') + pnl.cond.title"></span>

              <!-- TODO: BtnComponent -->
              <label class="ui-button ui-button-min ui-corner-all ui-widget"
                     :class="pnl.cond.elasticX ? 'btn_on' : 'btn_off'"
                     title="ソートありなしを切り替えます">
                <img src="/img/chart-sort-asc.svg" class="dark:invert -rotate-90 -scale-y-100" style="width:1.2em;">
                <input type="checkbox" v-model="pnl.cond.elasticX" class="hidden"/>
              </label>

              <a class="btn_reset" id="btn_reset_cond" href="javascript:void(0);" style="display: none;">
                <span class="ui-icon ui-icon-closethick"></span>
              </a>
              <input type="text" class="filter_txt tt_filter" readonly style="display: none;">&nbsp;
              <span v-html="pnl.cond.info"></span>
              <span class="ui-icon ui-icon-circle-close sp_icon btn_close" @click="pnl.cond.is_show=0"></span>
            </div>
            <div>
              <div id="chart_cond"></div>
            </div>
          </div>

          <!-- DC_PANEL Job -->
          <div id="panel_job" class="scrollbar-thin bg-theme-col2 dc_panel drag" :style="pnl.job.style"
               v-show="pnl.job.is_show">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2"
                    v-html="(pnl.job.title.indexOf('職業')===-1 ? '' : '<i class=\'fa fa-id-card-o\'>') + pnl.job.title">
              </span>
              <span id="chart_job_title_sub"></span>

              <!-- TODO: BtnComponent -->
              <label class="ui-button ui-button-min ui-corner-all ui-widget"
                     :class="pnl.job.elasticX ? 'btn_on' : 'btn_off'"
                     title="ソートありなしを切り替えます">
                <img src="/img/chart-sort-asc.svg" class="dark:invert -rotate-90 -scale-y-100" style="width:1.2em;">
                <input type="checkbox" v-model="pnl.job.elasticX" class="hidden"/>
              </label>

              <a class="btn_reset" id="btn_reset_job" href="javascript:void(0);" style="display: none;">
                <span class="ui-icon ui-icon-closethick"></span>
              </a>
              <input type="text" class="filter_txt tt_filter" readonly style="display: none;">&nbsp;
              <span v-html="pnl.job.info"></span>
              <span class="ui-icon ui-icon-circle-close sp_icon btn_close" @click="pnl.job.is_show=0"></span>
            </div>
            <div>
              <div id="chart_job"></div>
            </div>
          </div>


          <!-- DC_PANEL Ex[] -->
          <div v-for="(item, i) in pnl.ex" :id="`panel_ex_${i}`" class="bg-theme-col2 dc_panel drag panel_ex"
               :style="item.style"
               v-show="item.is_show">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2" v-html="item.title"></span>
              <a class="reset btn_reset" :id="`btn_reset_ex_${i}`" href="javascript:void(0);" style="display: none;">
                <span class="ui-icon ui-icon-closethick"></span>
              </a>
              <input type="text" class="filter_txt tt_filter" readonly style="display: none;">

              <!-- TODO: BtnComponent -->
              <label class="ui-button ui-button-min ui-corner-all ui-widget"
                     :class="item.elasticX ? 'btn_on' : 'btn_off'"
                     title="ソートありなしを切り替えます">
                <img src="/img/chart-sort-asc.svg" class="dark:invert -rotate-90 -scale-y-100" style="width:1.2em;">
                <input type="checkbox" v-model="item.elasticX" class="hidden"/>
              </label>

              <!-- TODO: StackTypeComponent -->
              <label title="チャートのスタックタイプを切り替えます">📊
                <input type="radio" id="stack_type_pl1" v-model="pnl.date.stack_type" :value="1">
                <label v-html="pnl.name.title" for="stack_type_pl1"></label>&nbsp;
                <input type="radio" id="stack_type_age" v-model="pnl.date.stack_type" :value="2">
                <label v-html="pnl.age.title" for="stack_type_age"></label>&nbsp;
                <input type="radio" id="stack_type_con" v-model="pnl.date.stack_type" :value="0">
                <label v-html="pnl.cond.title" for="stack_type_con"></label>
              </label>

              <span class="ui-icon ui-icon-circle-close sp_icon btn_close" @click="item.is_show=0"></span>
            </div>
            <div>
              <div :id="`chart_ex_${i}`"></div>
            </div>
            <div class="clearfix"></div>
          </div>

          <!-- DC_PANEL Detail -->
          <div id="panel_detail" class="bg-theme-col2 dc_panel drag" :style="pnl.detail.style"
               v-show="pnl.detail.is_show && pnl.detail.details.length>0">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2" v-html="pnl.detail.title"></span>
              <span class="ui-icon ui-icon-circle-close sp_icon btn_close"
                    @click="pnl.detail.is_show=0"></span>
            </div>
            <div>
              <div v-for="(html, id) in pnl.detail.details" class="detail text-theme-col emj" :key="id"
                   v-html="html"></div>
            </div>
          </div>

          <!-- DC_PANEL Analyze -->
          <div id="panel_ana" class="bg-theme-col2 dc_panel drag" v-show="pnl.ana.is_show" style="display: none;">
            <div class="chart-title-wrap">
              <span class="chart-title text-theme-col2" v-html="pnl.ana.title"></span>
              <span class="ui-icon ui-icon-circle-close sp_icon btn_close" @click="pnl.ana.is_show=0"></span>
            </div>
            <div class="clearfix"></div>


            <div id="ana_diff_ls">
              <table id="tbl_ana" border="1" bordercolor="#b0b0b0" style="float:left;">
                <caption class="bg-theme-col">第N波</caption>
                <thead>
                <th><span class="ui-icon ui-icon-window"></span>左ウインドウ</th>
                <th></th>
                <th><span class="ui-icon ui-icon-window"></span>右ウィンドウ</th>
                </thead>
                <tbody>
                <tr>
                  <td>全国 第1波(前半)<br/><a class="wopen"
                                              href="covid19.html?date=3-16+4-19&light=1">3/15(日)～4/19(日)</a>
                  </td>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較
                    </div>
                  </td>
                  <td>全国 第2波(前半)<br/><a class="wopen"
                                              href="covid19.html?date=6-22+7-26&light=1">6/22(月)～7/26(日)</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="diff wopen"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
                    </div>
                  </td>
                  <td></td>
                  <td>
                    <div class="diff wopen"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>千葉県 第1波<br/><a class="wopen"
                                          href="covid19.html?name=千葉県&date=3-21+32&light=1">3/21(土)～4/22(水)</a>
                  </td>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較
                    </div>
                  </td>
                  <td>千葉県 第2波<br/><a class="wopen"
                                          href="covid19.html?name=千葉県&date=6-21+32&light=1">6/21(日)～7/23(木)</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="diff wopen"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
                    </div>
                  </td>
                  <td></td>
                  <td>
                    <div class="diff wopen"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>福岡県 第1波<br/><a class="wopen"
                                          href="covid19.html?name=福岡県&date=3-26+17&light=1">3/26(木)～4/12(日)</a>
                  </td>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較
                    </div>
                  </td>
                  <td>福岡県 第3波<br/><a class="wopen"
                                          href="covid19.html?name=福岡県&date=7-09+17&light=1">7/9(木)～7/26(日)</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="diff wopen"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
                    </div>
                  </td>
                  <td></td>
                  <td>
                    <div class="diff wopen"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>福岡市 第1波<br/><a class="wopen"
                                          href="covid19.html?q=福岡市&date=3-26+17&light=1">3/26(木)～4/12(日)</a>
                  </td>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較
                    </div>
                  </td>
                  <td>福岡市 第2波<br/><a class="wopen"
                                          href="covid19.html?q=福岡市&date=7-09+17&light=1">7/9(木)～7/26(日)</a>
                  </td>
                </tr>
                </tbody>
              </table>
              <table id="tbl_ana" border="1" bordercolor="#b0b0b0">
                <caption class="bg-theme-col">地域</caption>
                <thead>
                <th><span class="ui-icon ui-icon-window"></span>左ウインドウ</th>
                <th></th>
                <th><span class="ui-icon ui-icon-window"></span>右ウィンドウ</th>
                </thead>
                <tbody>
                <tr>
                  <td><a class="wopen" href="covid19.html?q=福岡市&light=1">福岡市</a></td>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較
                    </div>
                  </td>
                  <td><a class="wopen" href="covid19.html?q=北九州市&light=1">北九州市</a></td>
                </tr>
                <tr>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
                    </div>
                  </td>
                  <td></td>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><a class="wopen" href="covid19.html?q=札幌市&light=1">札幌市</a></td>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較
                    </div>
                  </td>
                  <td><a class="wopen" href="covid19.html?q=旭川市&light=1">旭川市</a></td>
                </tr>
                <tr>
                  <td>東京都隣接県A<br/><a class="wopen"
                                           href="covid19.html?name=埼玉県&light=1">埼玉県</a></td>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較
                    </div>
                  </td>
                  <td>東京都隣接県B<br/><a class="wopen" href="covid19.html?name=神奈川県&light=1">神奈川県</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
                    </div>
                  </td>
                  <td></td>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>大阪府隣接県A<br/><a class="wopen"
                                           href="covid19.html?name=兵庫県&light=1">兵庫県</a></td>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較
                    </div>
                  </td>
                  <td>大阪府隣接県B<br/><a class="wopen"
                                           href="covid19.html?name=京都府&light=1">京都府</a></td>
                </tr>
                </tbody>
              </table>
              <table id="tbl_ana" border="1" bordercolor="#b0b0b0">
                <caption class="bg-theme-col">職業、その他</caption>
                <thead>
                <th><span class="ui-icon ui-icon-window"></span>左ウインドウ</th>
                <th></th>
                <th><span class="ui-icon ui-icon-window"></span>右ウィンドウ</th>
                </thead>
                <tbody>
                <tr>
                  <td><a class="wopen" href="covid19.html?q=学生&light=1">学生</a></td>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較
                    </div>
                  </td>
                  <td><a class="wopen" href="covid19.html?q=医療従事者&light=1">医療従事者</a></td>
                </tr>
                <tr>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
                    </div>
                  </td>
                  <td></td>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><a class="wopen" href="covid19.html?q=社会人&light=1">社会人</a></td>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較
                    </div>
                  </td>
                  <td><a class="wopen" href="covid19.html?q=介護職員&light=1">介護職員</a></td>
                </tr>
                <tr>
                  <td><a class="wopen" href="covid19.html?name=福岡県&q=学生&light=1">福岡県 学生</a>
                  </td>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較
                    </div>
                  </td>
                  <td><a class="wopen" href="covid19.html?name=福岡県&q=医療従事者&light=1">福岡県
                    医療従事者</a></td>
                </tr>
                <tr>
                  <td>
                    <div class="diff wopen"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
                    </div>
                  </td>
                  <td></td>
                  <td>
                    <div class="diff wopen"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><a class="wopen" href="covid19.html?name=北海道&q=学生&light=1">北海道 学生</a>
                  </td>
                  <td>
                    <div class="wopen diff"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較
                    </div>
                  </td>
                  <td><a class="wopen" href="covid19.html?name=北海道&q=医療従事者&light=1">北海道
                    医療従事者</a></td>
                </tr>
                </tbody>
              </table>
              <div class="clearfix"></div>
            </div>
            <ul>
              <li><span class="wopen ui-icon ui-icon ui-icon-arrow-2-e-w sp_icon"></span>&nbsp;<span
                class="wopen ui-icon ui-icon ui-icon-arrow-2-n-s sp_icon"></span>
                の比較ボタンをクリックすると比較用にウインドウが左右２つ開きます。<b><a
                  tt_title="WEBブラウザの設定によってウインドウの複数オープンがブロックされている場合があります。<br /><img src='/img/hlp/popupblock_chrome.gif'><br /><br />以下の操作で設定の変更が可能です。<br />1.アドレスバーの右上にあるをクリック<br />2.「http://***のポップアップを常に許可する」にチェックを入れる">※開かない時</a></b>
              </li>
              <li>このサイトのURLのパラメタについては<b><a
                tt_title="■URLの例<br />福岡県 の状況の場合<br />https://sakanaclub.xsrv.jp/dc/covid19/name=福岡県<br /><br />福岡県 4/4(月)～5/2(土) 職業:看護師 の状況の場合<br />https://sakanaclub.xsrv.jp/dc/covid19/name=福岡県&date=4-4+5-2&q=看護師<br /><br />■パラメタの説明<br />＊name: 都道府県<br />例 name=福岡県<br />   name=福岡県+佐賀県  ...複数形式<br /><br />＊date: 日付<br />例 date=4-11     ...単一日形式  4月11日<br />　 date=4-4+5-8  ...範囲日形式  4月4日~5月8日<br />　 date=4-4+14   ...範囲日形式2 4月4日 + 14days<br /><br />＊q: 検索キーワード (市区町村・職業・状態等のキーワード)<br />例 q=北九州市 ...市区町村<br />　 q=看護師　 ...職業等<br />">こちらを参照</a></b>
              </li>
            </ul>
          </div>
          <div class="clearfix"></div>
        </div>

        <div class="clearfix"></div>

        <div v-if="pnl.common.dataReference !== ''" class="data-reference">
          <label>データ参照先</label>
          <div v-html="pnl.common.dataReference"></div>
        </div>

      </div><!-- container -->

      <div class="container_tbl_pref text-theme-col bg-theme-col">

        <h4 class="hdr_pref">各都道府県の感染症情報取得先</h4>
        ※データは各都道府県が公開する感染症情報や厚生労働省の発表資料より取得しています。詳細は都道府県名のリンク先を参照下さい<br>
        <div>
          <table id="tbl_pref" border="1" bordercolor="#b0b0b0" cellpadding="3" cellspacing="3" frame="below"
                 rules="rows">
            <thead>
            <tr bgcolor="#C0C0D0"
                title="カラムクリックで▲昇順▼降順にソートされます。&#x0A;Shiftキーを押しながら順番にクリックしていくとマルチカラムソートになります。">
              <th>都道府県</th>
              <th>人口<br/>感染率</th>
              <th>感染者</th>
              <th>新規</th>
              <th>死亡</th><!-- chk_tbl_detail -->
              <th>退院</th><!-- chk_tbl_detail -->
              <th title="入院治療等を要する患者数。(感染者数-無症状者数-退院者数-死亡者数)">患者</th>
              <!-- chk_tbl_detail -->
              <th>前日比</th><!-- chk_tbl_detail -->
              <th><i class="fa fa-area-chart"></i>感染推移&nbsp;&nbsp;&nbsp;<label for="chk_tbl_spkflt"
                                                                                   id="chk_tbl_spkflt_l"></label><input
                type="checkbox" id="chk_tbl_spkflt"></th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>世界</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>日本</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr class="tr_h">
              <td id="JAPAN_REGIONS_H">北海道・東北</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn0">
              <td bgcolor="">北海道</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn1">
              <td>青森県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn2">
              <td>岩手県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn3">
              <td>宮城県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn4">
              <td>秋田県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn5">
              <td>山形県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn6">
              <td>福島県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr class="tr_h">
              <td>関東</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn7">
              <td>茨城県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn8">
              <td>栃木県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn9">
              <td>群馬県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn10">
              <td bgcolor="">埼玉県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn11">
              <td bgcolor="">千葉県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn12">
              <td bgcolor="">東京都</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn13">
              <td bgcolor="">神奈川県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr class="tr_h">
              <td>中部</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn14">
              <td>新潟県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn15">
              <td>富山県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn16">
              <td>石川県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn17">
              <td>福井県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn18">
              <td>山梨県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn19">
              <td>長野県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn20">
              <td>岐阜県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn21">
              <td>静岡県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn22">
              <td>愛知県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr class="tr_h">
              <td>近畿</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn23">
              <td>三重県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn24">
              <td>滋賀県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn25">
              <td bgcolor="">京都府</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn26">
              <td bgcolor="">大阪府</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn27">
              <td bgcolor="">兵庫県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn28">
              <td>奈良県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn29">
              <td>和歌山県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr class="tr_h">
              <td>中国</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn30">
              <td>鳥取県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn31">
              <td>島根県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn32">
              <td>岡山県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn33">
              <td>広島県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn34">
              <td>山口県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr class="tr_h">
              <td>四国</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn35">
              <td>徳島県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn36">
              <td>香川県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn37">
              <td>愛媛県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn38">
              <td>高知県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr class="tr_h">
              <td id="JAPAN_REGIONS_K">九州・沖縄</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn39">
              <td>福岡県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn40">
              <td>佐賀県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn41">
              <td>長崎県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn42">
              <td>熊本県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn43">
              <td>大分県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn44">
              <td>宮崎県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn45">
              <td>鹿児島県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr id="spn46">
              <td>沖縄県</td>
              <td align="right"></td>
              <td align="right"></td>
              <td class="uicm"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div><!-- container -->

    </div>
  </div>
</template>

<script setup>
import YoutubeVidInput from "@/Components/YoutubeVidInput.vue";
import GoogleMap from "@/Components/GoogleMap.vue";

const G_IS_LOCAL = import.meta.env.DEV;
const G_IS_TUBE_SEARCH = import.meta.env.PROD; // YoutubeAPIを呼ぶか? ※開発中に無駄にApiを呼ぶのを避ける時は0にする

// import {colorbrewer} from "colorbrewer.js"
var colorbrewer = {
  YlGn: {
    3: ["#f7fcb9", "#addd8e", "#31a354"],
    4: ["#ffffcc", "#c2e699", "#78c679", "#238443"],
    5: ["#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837"],
    6: ["#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#31a354", "#006837"],
    7: ["#ffffcc", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32"],
    8: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#005a32"],
    9: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"]
  },
  YlGnBu: {
    3: ["#edf8b1", "#7fcdbb", "#2c7fb8"],
    4: ["#ffffcc", "#a1dab4", "#41b6c4", "#225ea8"],
    5: ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"],
    6: ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494"],
    7: ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"],
    8: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"],
    9: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"]
  },
  GnBu: {
    3: ["#e0f3db", "#a8ddb5", "#43a2ca"],
    4: ["#f0f9e8", "#bae4bc", "#7bccc4", "#2b8cbe"],
    5: ["#f0f9e8", "#bae4bc", "#7bccc4", "#43a2ca", "#0868ac"],
    6: ["#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#43a2ca", "#0868ac"],
    7: ["#f0f9e8", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e"],
    8: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#08589e"],
    9: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"]
  },
  BuGn: {
    3: ["#e5f5f9", "#99d8c9", "#2ca25f"],
    4: ["#edf8fb", "#b2e2e2", "#66c2a4", "#238b45"],
    5: ["#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"],
    6: ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#2ca25f", "#006d2c"],
    7: ["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"],
    8: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"],
    9: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"]
  },
  PuBuGn: {
    3: ["#ece2f0", "#a6bddb", "#1c9099"],
    4: ["#f6eff7", "#bdc9e1", "#67a9cf", "#02818a"],
    5: ["#f6eff7", "#bdc9e1", "#67a9cf", "#1c9099", "#016c59"],
    6: ["#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#1c9099", "#016c59"],
    7: ["#f6eff7", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450"],
    8: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016450"],
    9: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"]
  },
  PuBu: {
    3: ["#ece7f2", "#a6bddb", "#2b8cbe"],
    4: ["#f1eef6", "#bdc9e1", "#74a9cf", "#0570b0"],
    5: ["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"],
    6: ["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#2b8cbe", "#045a8d"],
    7: ["#f1eef6", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b"],
    8: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#034e7b"],
    9: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"]
  },
  BuPu: {
    3: ["#e0ecf4", "#9ebcda", "#8856a7"],
    4: ["#edf8fb", "#b3cde3", "#8c96c6", "#88419d"],
    5: ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c"],
    6: ["#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8856a7", "#810f7c"],
    7: ["#edf8fb", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b"],
    8: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#6e016b"],
    9: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"]
  },
  RdPu: {
    3: ["#fde0dd", "#fa9fb5", "#c51b8a"],
    4: ["#feebe2", "#fbb4b9", "#f768a1", "#ae017e"],
    5: ["#feebe2", "#fbb4b9", "#f768a1", "#c51b8a", "#7a0177"],
    6: ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#c51b8a", "#7a0177"],
    7: ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"],
    8: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"],
    9: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"]
  },
  PuRd: {
    3: ["#e7e1ef", "#c994c7", "#dd1c77"],
    4: ["#f1eef6", "#d7b5d8", "#df65b0", "#ce1256"],
    5: ["#f1eef6", "#d7b5d8", "#df65b0", "#dd1c77", "#980043"],
    6: ["#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#dd1c77", "#980043"],
    7: ["#f1eef6", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f"],
    8: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f"],
    9: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"]
  },
  OrRd: {
    3: ["#fee8c8", "#fdbb84", "#e34a33"],
    4: ["#fef0d9", "#fdcc8a", "#fc8d59", "#d7301f"],
    5: ["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"],
    6: ["#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#e34a33", "#b30000"],
    7: ["#fef0d9", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000"],
    8: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#990000"],
    9: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]
  },
  YlOrRd: {
    3: ["#ffeda0", "#feb24c", "#f03b20"],
    4: ["#ffffb2", "#fecc5c", "#fd8d3c", "#e31a1c"],
    5: ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"],
    6: ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"],
    7: ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"],
    8: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"],
    9: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"]
  },
  YlOrBr: {
    3: ["#fff7bc", "#fec44f", "#d95f0e"],
    4: ["#ffffd4", "#fed98e", "#fe9929", "#cc4c02"],
    5: ["#ffffd4", "#fed98e", "#fe9929", "#d95f0e", "#993404"],
    6: ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#d95f0e", "#993404"],
    7: ["#ffffd4", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04"],
    8: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#8c2d04"],
    9: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]
  },
  Purples: {
    3: ["#efedf5", "#bcbddc", "#756bb1"],
    4: ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#6a51a3"],
    5: ["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"],
    6: ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"],
    7: ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"],
    8: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"],
    9: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"]
  },
  Blues: {
    3: ["#deebf7", "#9ecae1", "#3182bd"],
    4: ["#eff3ff", "#bdd7e7", "#6baed6", "#2171b5"],
    5: ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"],
    6: ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c"],
    7: ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
    8: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
    9: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]
  },
  Greens: {
    3: ["#e5f5e0", "#a1d99b", "#31a354"],
    4: ["#edf8e9", "#bae4b3", "#74c476", "#238b45"],
    5: ["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"],
    6: ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c"],
    7: ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
    8: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
    9: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"]
  },
  Oranges: {
    3: ["#fee6ce", "#fdae6b", "#e6550d"],
    4: ["#feedde", "#fdbe85", "#fd8d3c", "#d94701"],
    5: ["#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603"],
    6: ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#e6550d", "#a63603"],
    7: ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
    8: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
    9: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"]
  },
  Reds: {
    3: ["#fee0d2", "#fc9272", "#de2d26"],
    4: ["#fee5d9", "#fcae91", "#fb6a4a", "#cb181d"],
    5: ["#fee5d9", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"],
    6: ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15"],
    7: ["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d"],
    8: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d"],
    9: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"]
  },
  Greys: {
    3: ["#f0f0f0", "#bdbdbd", "#636363"],
    4: ["#f7f7f7", "#cccccc", "#969696", "#525252"],
    5: ["#f7f7f7", "#cccccc", "#969696", "#636363", "#252525"],
    6: ["#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#636363", "#252525"],
    7: ["#f7f7f7", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525"],
    8: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525"],
    9: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"]
  },
  PuOr: {
    3: ["#f1a340", "#f7f7f7", "#998ec3"],
    4: ["#e66101", "#fdb863", "#b2abd2", "#5e3c99"],
    5: ["#e66101", "#fdb863", "#f7f7f7", "#b2abd2", "#5e3c99"],
    6: ["#b35806", "#f1a340", "#fee0b6", "#d8daeb", "#998ec3", "#542788"],
    7: ["#b35806", "#f1a340", "#fee0b6", "#f7f7f7", "#d8daeb", "#998ec3", "#542788"],
    8: ["#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788"],
    9: ["#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788"],
    10: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"],
    11: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"]
  },
  BrBG: {
    3: ["#d8b365", "#f5f5f5", "#5ab4ac"],
    4: ["#a6611a", "#dfc27d", "#80cdc1", "#018571"],
    5: ["#a6611a", "#dfc27d", "#f5f5f5", "#80cdc1", "#018571"],
    6: ["#8c510a", "#d8b365", "#f6e8c3", "#c7eae5", "#5ab4ac", "#01665e"],
    7: ["#8c510a", "#d8b365", "#f6e8c3", "#f5f5f5", "#c7eae5", "#5ab4ac", "#01665e"],
    8: ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e"],
    9: ["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e"],
    10: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"],
    11: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"]
  },
  PRGn: {
    3: ["#af8dc3", "#f7f7f7", "#7fbf7b"],
    4: ["#7b3294", "#c2a5cf", "#a6dba0", "#008837"],
    5: ["#7b3294", "#c2a5cf", "#f7f7f7", "#a6dba0", "#008837"],
    6: ["#762a83", "#af8dc3", "#e7d4e8", "#d9f0d3", "#7fbf7b", "#1b7837"],
    7: ["#762a83", "#af8dc3", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#7fbf7b", "#1b7837"],
    8: ["#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837"],
    9: ["#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837"],
    10: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"],
    11: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"]
  },
  PiYG: {
    3: ["#e9a3c9", "#f7f7f7", "#a1d76a"],
    4: ["#d01c8b", "#f1b6da", "#b8e186", "#4dac26"],
    5: ["#d01c8b", "#f1b6da", "#f7f7f7", "#b8e186", "#4dac26"],
    6: ["#c51b7d", "#e9a3c9", "#fde0ef", "#e6f5d0", "#a1d76a", "#4d9221"],
    7: ["#c51b7d", "#e9a3c9", "#fde0ef", "#f7f7f7", "#e6f5d0", "#a1d76a", "#4d9221"],
    8: ["#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221"],
    9: ["#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221"],
    10: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"],
    11: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"]
  },
  RdBu: {
    3: ["#ef8a62", "#f7f7f7", "#67a9cf"],
    4: ["#ca0020", "#f4a582", "#92c5de", "#0571b0"],
    5: ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"],
    6: ["#b2182b", "#ef8a62", "#fddbc7", "#d1e5f0", "#67a9cf", "#2166ac"],
    7: ["#b2182b", "#ef8a62", "#fddbc7", "#f7f7f7", "#d1e5f0", "#67a9cf", "#2166ac"],
    8: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
    9: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
    10: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"],
    11: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"]
  },
  RdGy: {
    3: ["#ef8a62", "#ffffff", "#999999"],
    4: ["#ca0020", "#f4a582", "#bababa", "#404040"],
    5: ["#ca0020", "#f4a582", "#ffffff", "#bababa", "#404040"],
    6: ["#b2182b", "#ef8a62", "#fddbc7", "#e0e0e0", "#999999", "#4d4d4d"],
    7: ["#b2182b", "#ef8a62", "#fddbc7", "#ffffff", "#e0e0e0", "#999999", "#4d4d4d"],
    8: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d"],
    9: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d"],
    10: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"],
    11: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"]
  },
  RdYlBu: {
    3: ["#fc8d59", "#ffffbf", "#91bfdb"],
    4: ["#d7191c", "#fdae61", "#abd9e9", "#2c7bb6"],
    5: ["#d7191c", "#fdae61", "#ffffbf", "#abd9e9", "#2c7bb6"],
    6: ["#d73027", "#fc8d59", "#fee090", "#e0f3f8", "#91bfdb", "#4575b4"],
    7: ["#d73027", "#fc8d59", "#fee090", "#ffffbf", "#e0f3f8", "#91bfdb", "#4575b4"],
    8: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
    9: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
    10: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
    11: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"]
  },
  Spectral: {
    3: ["#fc8d59", "#ffffbf", "#99d594"],
    4: ["#d7191c", "#fdae61", "#abdda4", "#2b83ba"],
    5: ["#d7191c", "#fdae61", "#ffffbf", "#abdda4", "#2b83ba"],
    6: ["#d53e4f", "#fc8d59", "#fee08b", "#e6f598", "#99d594", "#3288bd"],
    7: ["#d53e4f", "#fc8d59", "#fee08b", "#ffffbf", "#e6f598", "#99d594", "#3288bd"],
    8: ["#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd"],
    9: ["#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd"],
    10: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"],
    11: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"]
  },
  RdYlGn: {
    3: ["#fc8d59", "#ffffbf", "#91cf60"],
    4: ["#d7191c", "#fdae61", "#a6d96a", "#1a9641"],
    5: ["#d7191c", "#fdae61", "#ffffbf", "#a6d96a", "#1a9641"],
    6: ["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#91cf60", "#1a9850"],
    7: ["#d73027", "#fc8d59", "#fee08b", "#ffffbf", "#d9ef8b", "#91cf60", "#1a9850"],
    8: ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"],
    9: ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"],
    10: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"],
    11: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"]
  },
  Accent: {
    3: ["#7fc97f", "#beaed4", "#fdc086"],
    4: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99"],
    5: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0"],
    6: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f"],
    7: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17"],
    8: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"]
  },
  Dark2: {
    3: ["#1b9e77", "#d95f02", "#7570b3"],
    4: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a"],
    5: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e"],
    6: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02"],
    7: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d"],
    8: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"]
  },
  Paired: {
    3: ["#a6cee3", "#1f78b4", "#b2df8a"],
    4: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c"],
    5: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99"],
    6: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c"],
    7: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f"],
    8: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00"],
    9: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6"],
    10: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"],
    11: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99"],
    12: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"]
  },
  Pastel1: {
    3: ["#fbb4ae", "#b3cde3", "#ccebc5"],
    4: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4"],
    5: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6"],
    6: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc"],
    7: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd"],
    8: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec"],
    9: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"]
  },
  Pastel2: {
    3: ["#b3e2cd", "#fdcdac", "#cbd5e8"],
    4: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4"],
    5: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9"],
    6: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae"],
    7: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc"],
    8: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"]
  },
  Set1: {
    3: ["#e41a1c", "#377eb8", "#4daf4a"],
    4: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3"],
    5: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"],
    6: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33"],
    7: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628"],
    8: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf"],
    9: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"]
  },
  Set2: {
    3: ["#66c2a5", "#fc8d62", "#8da0cb"],
    4: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3"],
    5: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854"],
    6: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f"],
    7: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494"],
    8: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"]
  },
  Set3: {
    3: ["#8dd3c7", "#ffffb3", "#bebada"],
    4: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072"],
    5: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3"],
    6: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462"],
    7: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69"],
    8: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5"],
    9: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9"],
    10: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd"],
    11: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5"],
    12: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"]
  }
};
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
} from '@/Utils/utils.js';

// データタイプ
const DT_DEF = 0;   //0:汎用的なDCデータ
const DT_COVID = 1; //1:新型コロナウイルス感染状況のデータ
// データのカラムのタイプ
const D_YMD = 0;    // 日付。 例:2020-01-30
const D_SEX = 1;    // 性別ID。INT。0:不明 1:男 2:女 。data_opt.chartSex_unitで定義可
const D_AGE = 2;    // 年齢。  INT。-1:不明 0:幼児 1:10歳未満 / 10~N:10~N代。data_opt.chartAge_unitで定義可
const D_CND = 3;    // 状態。 例:無症,退院,感染。状態ワード(無症状,退院,入院,肺炎,...)から4つのレベル(無症・退院,感染,肺炎・入院,酸投...)に集約される
const D_PL1 = 4;    // 都道府県。 例:福岡県
const D_PL2 = 5;    // 市区町村。 例:福岡市
const D_JOB = 6;    // 職業。 例:会社員
const D_JOBCAT = 7; // ジョブカテゴリID。 INT。例:'教職員'=>['教職員','大学職員','小学校教諭','専門学校職員...]。定義が0or種類が1つしかない場合使用しない
const D_CNT = 8;    // カウント。INT。(未必須:ない場合:1)
const D_EX0 = 9;    // chartEx用データ始点
// データ3のカラムのタイプ
const D3_YMD = 0;
const D3_PL1 = 1;
const D3_CNT = 2;
const D3_TYP = 3;

// chartDate2のモード
const MD_PCR = 0;
const MD_DEA = 1;
const MD_PAT = 2;

// 表示しない空データ定義(key)
const DN_KEY1 = ''; // 共通
const DN_KEY2 = '-';
//const DN_SEX = ''; // chartSex pieChartは表示する,barChartは表示しない
const DN_AGE = -1; // chartAge
const DN_AGE2 = '';
const DN_CND = ''; // chartCond
const DN_CND2 = '不明';
const DN_PL1 = ''; // chartName
const DN_PL2 = ''; // chartCity
const DN_JOB = ''; // chartJob
const DN_JOBCAT = 0;
const DN_EX = '-'; // chartEx[]
// 表示しない空データ定義(label)
const DN_LABEL_DEF = '不明';

const DI_AGE_INFA = 1; // 1 :幼児 (0歳,1歳未満,男児,女児,幼児,未就学児)
const DI_AGE_LT10 = 0; // 0 :10歳未満(小学生、園児)
//const DI_AGE_10  =2; // 10 :10代 ※以後1ずらす
//const DI_AGE_20  =3; // 20 :20代
//const DI_AGE_100 =11;// 100 :100歳
const DI_AGE_NONE = 12;// -1:不明

const CND_LV_A = '無症,退院';
const CND_LV_B = '感染';
const CND_LV_C = '肺炎,入院';
const CND_LV_D = '酸投,重症';
const CND_LV_E = '死亡';

const COL_CND = ["#2ca02c", "#1f77b4", "#ff7f0e", "#d62728", '#9467bd'];
const COL_CND_A = COL_CND[0];
const COL_CND_B = COL_CND[1];
const COL_CND_C = COL_CND[2];
const COL_CND_D = COL_CND[3];
const COL_CND_E = COL_CND[4];
const COL_NAME = colorbrewer.Set2[5];
// 0        1         2     3       4      5     6       7     8     9      10     11   12
// '幼児','10歳未満','10代','20代','30代','40代','50代','60代','70代','80代','90代','100代',DN_LABEL_DEF
// green                  |  blue                     | yellow-orange
const COL_AGE = d3.schemeGreens[4].slice(1).concat(d3.schemeBlues[4].slice(1)).concat(d3.schemeYlOrRd[7].slice(1)).concat(['#B0B0B0']);
const COL_DATE = COL_CND.concat(COL_NAME).concat(COL_AGE);

const STACK_CND = 0;
const STACK_PL1 = 1;
const STACK_AGE = 2;

const COL_DATE2 = ['#20b2aa', COL_CND_E, COL_CND_B];// chartDate2 の [感染,PCR,死亡] の色
const CHART_DATE2_STACK1_N = 3;
const CHART_DATE2_STACK2_N = 5 + 1;
const CHART_DATE2_TYPE_COVID = 0;
const CHART_DATE2_TYPE_LINES = 1;
const CHART_DATE2_TYPE_STACKS = 2;
const CHART_DATE2_TYPE_SERIES = 3;
const CHART_DATE2_TYPE_HIDE = -1;

const COL_SEX = ["#B0B0B0", "#8dd3c7", "pink"];
let SEX_LABEL = ["不明", "♂男性", "♀女性"];

// 季節
// '🌸春': 3,4,5, '🎆夏': 6,7,8, '🍁秋': 9,10,11, '☃冬':12,1,2
const MONTH_2_SEASON = ['', '☃冬', '☃冬', '🌸春', '🌸春', '🌸春', '🎆夏', '🎆夏', '🎆夏', '🍁秋', '🍁秋', '🍁秋', '☃冬'];
const SEASON_COL = ['#FAD8D9', '#87CFDB', '#EF781E', '#8C93C9'];
const SEASON_IDX = {'🌸春': 0, '🎆夏': 1, '🍁秋': 2, '☃冬': 3};
const SEASON_IDX2_MONTH = {'🌸春': 3, '🎆夏': 6, '🍁秋': 9, '☃冬': 12};

const WEEK_LABEL = moment.weekdaysMin();
const COL_WEEK = ['orange', '#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837', 'blue'];
let IMG_NO = '/img/noimage.png';
const IMG_THUMBNAIL_W = 30;

const TAGICON_DS = '💾';
const TAGICON_CD = '💿';
colorbrewer.Set2[8][7] = colorbrewer.Set1[8][6];//Set3[12][8]:gray-> light gold


const PREFECTURES = ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"];
const PREFECTURES_EN = {
  "北海道": "hokkaido",
  "青森県": "aomori",
  "岩手県": "iwate",
  "宮城県": "miyagi",
  "秋田県": "akita",
  "山形県": "yamagata",
  "福島県": "fukushima",
  "茨城県": "ibaraki",
  "栃木県": "tochigi",
  "群馬県": "gunma",
  "埼玉県": "saitama",
  "千葉県": "chiba",
  "東京都": "tokyo",
  "神奈川県": "kanagawa",
  "新潟県": "niigata",
  "富山県": "toyama",
  "石川県": "ishikawa",
  "福井県": "fukui",
  "山梨県": "yamanashi",
  "長野県": "nagano",
  "岐阜県": "gifu",
  "静岡県": "shizuoka",
  "愛知県": "aichi",
  "三重県": "mie",
  "滋賀県": "shiga",
  "京都府": "kyoto",
  "大阪府": "osaka",
  "兵庫県": "hyogo",
  "奈良県": "nara",
  "和歌山県": "wakayama",
  "鳥取県": "tottori",
  "島根県": "shimane",
  "岡山県": "okayama",
  "広島県": "hiroshima",
  "山口県": "yamaguchi",
  "徳島県": "tokushima",
  "香川県": "kagawa",
  "愛媛県": "ehime",
  "高知県": "kochi",
  "福岡県": "fukuoka",
  "佐賀県": "saga",
  "長崎県": "nagasaki",
  "熊本県": "kumamoto",
  "大分県": "oita",
  "宮崎県": "miyazaki",
  "鹿児島県": "kagoshima",
  "沖縄県": "okinawa"
};

const HIRAGANA = {
  "PREF": {
    "北海道": "ほっかいどう",
    "青森県": "あおもり",
    "岩手県": "いわて",
    "宮城県": "みやぎ",
    "秋田県": "あきた",
    "山形県": "やまがた",
    "福島県": "ふくしま",
    "茨城県": "いばらき",
    "栃木県": "とちぎ",
    "群馬県": "ぐんま",
    "埼玉県": "さいたま",
    "千葉県": "ちば",
    "東京都": "とうきょうと",
    "神奈川県": "かながわ",
    "新潟県": "にいがた",
    "富山県": "とやま",
    "石川県": "いしかわ",
    "福井県": "ふくい",
    "山梨県": "やまなし",
    "長野県": "ながの",
    "岐阜県": "ぎふ",
    "静岡県": "しずおか",
    "愛知県": "あいち",
    "三重県": "みえ",
    "滋賀県": "しが",
    "京都府": "きょうとふ",
    "大阪府": "おおさかふ",
    "兵庫県": "ひょうご",
    "奈良県": "なら",
    "和歌山県": "わかやま",
    "鳥取県": "とっとり",
    "島根県": "しまね",
    "岡山県": "おかやま",
    "広島県": "ひろしま",
    "山口県": "やまぐち",
    "徳島県": "とくしま",
    "香川県": "かがわ",
    "愛媛県": "えひめ",
    "高知県": "こうち",
    "福岡県": "ふくおか",
    "佐賀県": "さが",
    "長崎県": "ながさき",
    "熊本県": "くまもと",
    "大分県": "おおいた",
    "宮崎県": "みやざき",
    "鹿児島県": "かごしま",
    "沖縄県": "おきなわ"
  },
  "JOB": {
    "無職": "むしょく",
    "教職員": "きょうしょくいん",
    "学生": "がくせい",
    "保育園児": "ほいくえんじ",
    "入所者": "にゅうしょしゃ",
    "医師": "いし",
    "看護師": "かんごし",
    "看護職員": "かんごしょくいん",
    "医療従事者": "いりょうじゅうじしゃ",
    "介護職員": "かいごしょくいん",
    "福祉事業従事者": "ふくしじぎょうじゅうじしゃ",
    "保育園職員": "ほいくえんしょくいん",
    "歯医者勤務": "はいしゃきんむ",
    "公務員": "こうむいん",
    "団体職員": "だんたいしょくいん",
    "自衛・消防官": "じえいしょうぼうかん",
    "経営者・役員": "けいえいしゃやくいん",
    "会社員": "かいしゃいん",
    "事務職員": "じむしょくいん",
    "運転手": "うんてんしゅ",
    "運送業": "うんそうぎょう",
    "接客業": "せっきゃくぎょう",
    "飲食業": "いんしょくぎょう",
    "飲食店従業員": "いんしょくてんじゅうぎょういん",
    "自営業": "じえいぎょう",
    "パート・アルバイト": "パートアルバイト",
    "サービス業": "さーびすぎょう",
    "製造業": "せいぞうぎょう",
    "土木建築業": "どぼくけんちくぎょう",
    "スポーツ選手": "スポーツせんしゅ"
  },
  "COND": {
    "退院": "たいいん",
    "無症状": "むしょうじょう",
    "重症": "じゅうしょう",
    "死亡": "しぼう",
    "軽症": "けいしょう",
    "中等度": "ちゅうとうど",
    "肺炎入院": "はいえんにゅういん",
    "入院予定": "にゅういんよてい",
    "入院": "にゅういん",
    "肺炎": "はいえん",
    "自宅待機": "じたくたいき",
    "酸投": "さんとう",
    "肺炎入院予定": "はいえんにゅういんよてい",
    "再発入院": "さいはつにゅういん"
  }
};

const WORLD_CODE = {
//'Name' : 'Code',
  'Afghanistan': 'AF',
  'Åland Islands': 'AX',
  'Albania': 'AL',
  'Algeria': 'DZ',
  'American Samoa': 'AS',
// 'Andorra' : 'AD',
  'Angola': 'AO',
// 'Anguilla' : 'AI',
  'Antarctica': 'AQ',
// 'Antigua & Barbuda' : 'AG',
  'Argentina': 'AR',
  'Armenia': 'AM',
// 'Aruba' : 'AW',
  'Australia': 'AU',
  'Austria': 'AT',
  'Azerbaijan': 'AZ',
  'Bahamas': 'BS',
  'Bahrain': 'BH',
  'Bangladesh': 'BD',
// 'Barbados' : 'BB',
  'Belarus': 'BY',
  'Belgium': 'BE',
  'Belize': 'BZ',
  'Benin': 'BJ',
// 'Bermuda' : 'BM',
  'Bhutan': 'BT',
  'Bolivia': 'BO', // 'Bolivia Plurinational State of'
  'Bonaire Sint Eustatius & Saba': 'BQ',
  'Bosnia & Herzegovina': 'BA',
  'Botswana': 'BW',
  'Bouvet Island': 'BV',
  'Brazil': 'BR',
  'British Indian Ocean Territory': 'IO',
  'Brunei': 'BN', // 'Brunei Darussalam'
  'Bulgaria': 'BG',
  'Burkina Faso': 'BF',
  'Burundi': 'BI',
  'Cambodia': 'KH',
  'Cameroon': 'CM',
  'Canada': 'CA',
// 'Cape Verde' : 'CV',
// 'Cayman Islands' : 'KY',
  'Central African Republic': 'CF',
  'Chad': 'TD',
  'Chile': 'CL',
  'China': 'CN',
  'Christmas Island': 'CX',
  'Cocos (Keeling) Islands': 'CC',
  'Colombia': 'CO',
// 'Comoros' : 'KM',
  'Congo': 'CG',
  'Congo Dem. Rep.': 'CD', // 'Congo the Democratic Republic of the'
  'Cook Islands': 'CK',
  'Costa Rica': 'CR',
  'Côte dIvoire': 'CI',
  'Croatia': 'HR',
  'Cuba': 'CU',
  'Curaçao': 'CW',
  'Cyprus': 'CY',
  'Czech Republic': 'CZ',
  'Denmark': 'DK',
  'Djibouti': 'DJ',
// 'Dominica' : 'DM',
  'Dominican Republic': 'DO',
  'Ecuador': 'EC',
  'Egypt': 'EG',
  'El Salvador': 'SV',
  'Equatorial Guinea': 'GQ',
  'Eritrea': 'ER',
  'Estonia': 'EE',
  'Ethiopia': 'ET',
  'Falkland Islands (Malvinas)': 'FK',
  'Faroe Islands': 'FO',
  'Fiji': 'FJ',
  'Finland': 'FI',
  'France': 'FR',
  'French Guiana': 'GF',
  'French Polynesia': 'PF',
  'French Southern Territories': 'TF',
  'Gabon': 'GA',
  'Gambia': 'GM',
  'Georgia': 'GE',
  'Germany': 'DE',
  'Ghana': 'GH',
// 'Gibraltar' : 'GI',
  'Greece': 'GR',
  'Greenland': 'GL',
// 'Grenada' : 'GD',
  'Guadeloupe': 'GP',
  'Guam': 'GU',
  'Guatemala': 'GT',
// 'Guernsey' : 'GG',
  'Guinea': 'GN',
  'Guinea-Bissau': 'GW',
  'Guyana': 'GY',
  'Haiti': 'HT',
  'Heard Island & McDonald Islands': 'HM',
// 'Holy See (Vatican City State)' : 'VA',
  'Honduras': 'HN',
// 'Hong Kong' : 'HK',
  'Hungary': 'HU',
  'Iceland': 'IS',
  'India': 'IN',
  'Indonesia': 'ID',
  'Iran': 'IR', // 'Iran, Islamic Republic of'
  'Iraq': 'IQ',
  'Ireland': 'IE',
// 'Isle of Man' : 'IM',
  'Israel': 'IL',
  'Italy': 'IT',
  'Jamaica': 'JM',
  'Japan': 'JP',
// 'Jersey' : 'JE',
  'Jordan': 'JO',
  'Kazakhstan': 'KZ',
  'Kenya': 'KE',
  'Kiribati': 'KI',
  'North Korea': 'KP', // 'Korea Democratic Peoples Republic of'
  'Korea': 'KR', // 'Korea Republic of'
  'Kuwait': 'KW',
  'Kyrgyzstan': 'KG',
  'Laos': 'LA', // 'Lao Peoples Democratic Republic
  'Latvia': 'LV',
  'Lebanon': 'LB',
  'Lesotho': 'LS',
  'Liberia': 'LR',
  'Libya': 'LY',
// 'Liechtenstein' : 'LI',
  'Lithuania': 'LT',
// 'Luxembourg' : 'LU',
// 'Macao' : 'MO',
  'Macedonia': 'MK', // 'Macedonia the Former Yugoslav Republic of'
  'Madagascar': 'MG',
  'Malawi': 'MW',
  'Malaysia': 'MY',
// 'Maldives' : 'MV',
  'Mali': 'ML',
// 'Malta' : 'MT',
  'Marshall Islands': 'MH',
  'Martinique': 'MQ',
  'Mauritania': 'MR',
// 'Mauritius' : 'MU',
  'Mayotte': 'YT',
  'Mexico': 'MX',
  'Micronesia Federated States of': 'FM',
  'Moldova': 'MD', // 'Moldova Republic of'
// 'Monaco' : 'MC',
  'Mongolia': 'MN',
  'Montenegro': 'ME',
// 'Montserrat' : 'MS',
  'Morocco': 'MA',
  'Mozambique': 'MZ',
  'Myanmar': 'MM',
  'Namibia': 'NA',
  'Nauru': 'NR',
  'Nepal': 'NP',
  'Netherlands': 'NL',
  'New Caledonia': 'NC',
  'New Zealand': 'NZ',
  'Nicaragua': 'NI',
  'Niger': 'NE',
  'Nigeria': 'NG',
  'Niue': 'NU',
  'Norfolk Island': 'NF',
  'Northern Mariana Islands': 'MP',
  'Norway': 'NO',
  'Oman': 'OM',
  'Pakistan': 'PK',
  'Palau': 'PW',
  'Palestine State of': 'PS',
  'Panama': 'PA',
  'Papua New Guinea': 'PG',
  'Paraguay': 'PY',
  'Peru': 'PE',
  'Philippines': 'PH',
  'Pitcairn': 'PN',
  'Poland': 'PL',
  'Portugal': 'PT',
  'Puerto Rico': 'PR',
  'Qatar': 'QA',
  'Réunion': 'RE',
  'Romania': 'RO',
  'Russian Federation': 'RU',
  'Rwanda': 'RW',
  'Saint Barthélemy': 'BL',
  'Saint Helena Ascension & Tristan da Cunha': 'SH',
// 'Saint Kitts & Nevis' : 'KN',
// 'Saint Lucia' : 'LC',
  'Saint Martin (French part)': 'MF',
  'Saint Pierre & Miquelon': 'PM',
// 'Saint Vincent & the Grenadines' : 'VC',
  'Samoa': 'WS',
// 'San Marino' : 'SM',
// 'Sao Tome & Principe' : 'ST',
  'Saudi Arabia': 'SA',
  'Senegal': 'SN',
  'Serbia': 'RS',
// 'Seychelles' : 'SC',
  'Sierra Leone': 'SL',
  'Singapore': 'SG',
  'Sint Maarten (Dutch part)': 'SX',
  'Slovakia': 'SK',
  'Slovenia': 'SI',
  'Solomon Islands': 'SB',
  'Somalia': 'SO',
  'South Africa': 'ZA',
  'South Georgia & the South Sandwich Islands': 'GS',
  'South Sudan': 'SS',
  'Spain': 'ES',
  'Sri Lanka': 'LK',
  'Sudan': 'SD',
  'Suriname': 'SR',
  'Svalbard & Jan Mayen': 'SJ',
  'Eswatini': 'SZ',
  'Sweden': 'SE',
  'Switzerland': 'CH',
  'Syrian Arab Republic': 'SY', // 'Syrian Arab Republic'
  'Taiwan Province of China': 'TW',
  'Tajikistan': 'TJ',
  'Tanzania': 'TZ', // 'Tanzania United Republic of'
  'Thailand': 'TH',
  'Timor-Leste': 'TL',
  'Togo': 'TG',
  'Tokelau': 'TK',
  'Tonga': 'TO',
// 'Trinidad & Tobago' : 'TT',
  'Tunisia': 'TN',
  'Turkey': 'TR',
  'Turkmenistan': 'TM',
  'Turks & Caicos Islands': 'TC',
  'Tuvalu': 'TV',
  'Uganda': 'UG',
  'Ukraine': 'UA',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB',
  'United States': 'US',
  'United States Minor Outlying Islands': 'UM',
  'Uruguay': 'UY',
  'Uzbekistan': 'UZ',
  'Vanuatu': 'VU',
  'Venezuela': 'VE',　// 'Venezuela Bolivarian Republic of'
  'Vietnam': 'VN',
// 'Virgin Islands British' : 'VG',
  'Virgin Islands U.S.': 'VI',
  'Wallis & Futuna': 'WF',
  'Western Sahara': 'EH',
  'Yemen': 'YE',
  'Zambia': 'ZM',
  'Zimbabwe': 'ZW',
};

import {onMounted, ref, watch, reactive, computed} from "vue";
import * as d3 from 'd3';

import * as dc from 'dc';
import 'dc/dist/style/dc.min.css';

import * as crossfilterModule from 'crossfilter2';

const crossfilter = crossfilterModule.default || crossfilterModule;

const BASE = import.meta.env.DEV ? '/' : import.meta.env.VITE_DOCUMENT_ROOT;

import jQuery from 'jquery';

window.$ = window.jQuery = jQuery;

// import 'jquery-ui-dist/jquery-ui'; //NG:Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'ui')

// import 'jvectormap-next';

import '@/Utils/font-awesome/css/all.css';
import '@/Utils/font-awesome/css/v4-shims.min.css';
// import '/img/csv.png';

import 'virtual-keyboard/dist/css/keyboard.min.css';
import 'virtual-keyboard/dist/js/jquery.keyboard.min.js';

// Global
const gg = reactive({
  dt: DT_COVID, // データタイプ
  isPrefTable: true
});
const isSp = window.innerWidth <= 768;
const dataImgSrc = ref('');
const pnl = reactive({
  common: {
    unit: '', // '売上本数(万本)' : 'タイトル';
    dataReference: '',
    datepicker: {
      position: {}
    },
    toolbar: {
      is_show: true,
    }
  },
  gmap: {
    isHidden: false,
    is_show: 0,
    is3D: false,
    title: '<img src="/img/google-map-48.png" width="20">Googleマップ',
    style: '',
    styleBak: null, // !=nullの時は最大化中
    chartGMap: {
      center: undefined,
      colorThreshold: undefined,
      panToMarkerType: 0,
      markerInfo: '',
      prefecture: '東京都',
      layer: {
        // "東京都": {
        // 	"千代田区": 70,
        // 	"中央区": 80,
        // }
      },
      focus: {
        // "東京都": {
        // 	"千代田区": 70,
        // 	"中央区": 80,
        // }
      },
    },
  },
  sview: {
    isHidden: false,
    is_show: 0,
    title: '<img src="/img/icons8-street-view-60.png" width="22" style="margin-top:-6px;">ストリートビュー',
    style: '',
    styleBak: null, // !=nullの時は最大化中
  },
  tube: {
    isHidden: false,
    is_show: 0,
    title: '<img src="/img/yutube.gif" width="18">YouTube',
    style: '',
    styleBak: null, // !=nullの時は最大化中
    vid: 'jM02C3uSBXY?start=60',
    vids: [],
    searchQuery: '',
    vidAutoChange: true,
  },
  map: {
    isHidden: false,
    is_show: true,
    title: '<i class="fa fa-map"></i>日本地図',
    subTitle: '',
    style: isSp ? 'width:100%;height:100%;' : 'width:460px;height:450px;',
    colors: [["1000人以上", "#8c0a00", 999], ["500人以上", "#ea5432", 499], ["100人以上", "#ff781d", 99], ["50人以上", "#ff9d57", 49], ["10人以上", "#ffceab", 9], ["1人以上", "#f5deb3", 0], ["0人", "#dadada", 0], ["選択中", "#ffffff", 0]],
    tabs: {
      is_show: false,
    }
  },
  name: {
    isHidden: false,
    is_show: true,
    title: '都道府県',
    style: '',
  },
  city: {
    isHidden: false,
    is_show: true,
    title: '市区町村',
    style: '',
    orderUI: false,
    orderCnt: false,　// 1:Sumタイプ 0:Countタイプ
  },
  date: {
    isHidden: false,
    is_show: true,
    title: '感染者数',
    style: '',
    stack_type: -1, // for trigger watch
    cnt_day: '',
    cnt_one: '',
    cnt: '',
    isBrushOn: false,
    play: {
      label: '▶',
      timer: null,
      from: null,
    },
    chart2: {
      is_show: false,
      type: 0, //0:患者・PCR・死亡 1:日付LineChart 2:日付seriesChart
      title: '<i class="fa fa-vials"></i>PCR検査人数</span>',
      title2: '',
      cnt: ''
    }
  },
  sex: {
    isHidden: false,
    is_show: true,
    title: '性別',
    style: '',
    chartType: 'pie',
    elasticX: false,
  },
  year: {
    isHidden: false,
    is_show: false,
    title: '年度',
    style: '',
  },
  season: {
    isHidden: false,
    is_show: false,
    title: '季節',
    style: '',
  },
  week: {
    isHidden: false,
    is_show: false,
    title: '曜日',
    style: '',
  },
  age: {
    isHidden: false,
    is_show: true,
    title: '年齢',
    style: '',
    elasticX: false,
  },
  cond: {
    isHidden: false,
    is_show: true,
    title: '状態',
    style: '',
    info: '',
    elasticX: false,
  },
  job: {
    isHidden: false,
    is_show: true,
    title: '職業',
    style: '',
    info: '',
    elasticX: false,
  },
  ex: [
    {
      isHidden: true,
      is_show: false,
      title: 'Ex0',
      style: '',
      info: '',
      elasticX: false,
    },
    {
      isHidden: true,
      is_show: false,
      title: 'Ex1',
      style: '',
      info: '',
      elasticX: false,
    },
    {
      isHidden: true,
      is_show: false,
      title: 'Ex2',
      style: '',
      info: '',
      elasticX: false,
    },
    {
      isHidden: true,
      is_show: false,
      title: 'Ex3',
      style: '',
      info: '',
      elasticX: false,
    },
    {
      isHidden: true,
      is_show: false,
      title: 'Ex4',
      style: '',
      info: '',
      elasticX: false,
    },
    {
      isHidden: true,
      is_show: false,
      title: 'Ex5',
      style: '',
      info: '',
      elasticX: false,
    },
    {
      isHidden: true,
      is_show: false,
      title: 'Ex6',
      style: '',
      info: '',
      elasticX: false,
    },
    {
      isHidden: true,
      is_show: false,
      title: 'Ex7',
      style: '',
      info: '',
      elasticX: false,
    },
  ],
  detail: {
    isHidden: false,
    is_show: true,
    title: '詳細',
    style: '',
    maxDetails: 24,
    details: [],
  },
  ana: {
    isHidden: false,
    is_show: false,
    is_chk_show: 1,
    title: '<i class="fa fa-eye"></i>分析',
  }
});
const pnlShows = ref(null);

const isDarkLs = localStorage.theme === 'dark'
  || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
const isDark = ref(!isDarkLs);
IMG_NO = isDarkLs ? '/img/noimage-dark.png' : '/img/noimage.png';

const settingsName = () => {
  return `dcjs/data=${mm.url_data.data}`;
};

const getPanelSettings = () => {
  const o = {}; // pnlのlocalStorage 保存対象はここで指定
  const panelSettingCreate = (k, v) => {
    const ret = {is_show: v.is_show};
    if (v.style) ret.style = v.style;
    if (v.vidAutoChange !== undefined) ret.vidAutoChange = v.vidAutoChange;
    if (v.styleBak !== null) ret.styleBak = v.styleBak;
    if (v?.chart2?.is_show !== undefined) ret['chart2'] = {is_show: v.chart2.is_show};
    // common
    if (v?.toolbar?.is_show !== undefined) ret['toolbar'] = {is_show: v.toolbar.is_show};
    if (v?.datepicker?.position) {
      ret['datepicker'] = {position: v.datepicker.position};
    }
    return ret;
  }

  _.forEach(pnl, (v, k) => {
    o[k] = panelSettingCreate(k, v);
  });

  o.ex = [];
  _.forEach(pnl.ex, (v, k) => {
    o.ex[k] = panelSettingCreate(k, v);
  });

  return o;
};

const onChangeSettings = () => {
  settingsSave();
};
const onChangeChartDateChart2IsShow = (newVal) => {
  settingsSave();
  if (!newVal || mm.composite2 !== null) return;

  switch (true) {
    default:
    case mm.opt.chartDate2.chartType === 'lines':
      pnl.date.chart2.type = CHART_DATE2_TYPE_LINES;
      initChartDate2Stacks(mm.config.cDate.width, false);
      break;
    case gg.dt === DT_COVID:
      pnl.date.chart2.type = CHART_DATE2_TYPE_COVID;
      initChartDate2Covid(mm.config.cDate.width);
      break;
    case mm.opt.chartDate2.chartType === 'stacks':
      pnl.date.chart2.type = CHART_DATE2_TYPE_STACKS;
      initChartDate2Stacks(mm.config.cDate.width, true);
      break;
    case mm.opt.chartDate2.chartType === 'series':
      pnl.date.chart2.type = CHART_DATE2_TYPE_SERIES;
      initChartDate2TypeSeries(mm.config.cDate.width);
      break;
  }
  mm.dateStackShow(STACK_CND);
  dc.renderAll("chartGroup");
};

const onChangeChartDateIsBrushOn = (newVal) => {
  if (newVal) {
    // 選択がある場合その日を選択
    let f = mm.composite.filters();
    if (f.length && f[0].filterType !== 'RangedFilter') {
      const from = moment(f[0]);
      const range = dc.filters.RangedFilter(from.toDate(), from.add(1, 'days').toDate());
      mm.composite.replaceFilter(range);
      mm.chartDate.replaceFilter(range);
    }
    mm.composite.brushOn(true);
    mm.chartDate.brushOn(true);
  } else {
    mm.composite.brushOn(false).filterAll();
    mm.chartDate.brushOn(false).filterAll();
  }
  mm.renderAllChart();
};

const settingsSave = () => {
  const settings = getPanelSettings();
  localStorage.setItem(settingsName(), JSON.stringify(settings));
  mm.onChangeURL('clear_layout');
};

const settingsLoad = (settingsJson = null) => {
  if (settingsJson === null) settingsJson = localStorage.getItem(settingsName());
  if (settingsJson === null) return null;
  const settings = JSON.parse(settingsJson);

  if (isSp) {
    // スタイルはロード除外
    _.forEach(settings, (v) => {
      if (v.style) {
        delete v.style;
      }
    });
  }

  // 性別チャートは(pie|bar)の複数タイプがあるので横幅調整
  if (pnl.sex.chartType === 'bar' && settings?.sex?.style) {
    const chartSexW = (mm.chartSex.group().all().length + 1) * mm.config.cSex.barWidth;
    const percent = mm.util.pxToPer(0, 0, parseInt(chartSexW, 10), 0, '#panels');
    settings.sex.style = settings.sex.style.replace(/width:\d+(\.\d+)?%;/, `width:${percent.width}`);
  }

  if (settings) {
    _.merge(pnl, settings);
  }
  return settings;
};

//パネルの表示状態のLoadStore
const pnlShowsLoadStore = (isLoad) => {
  if (isLoad) {
    _.forEach(pnlShows.value, (v, k) => {
      pnl[k].is_show = v.is_show;
    });
    pnlShows.value = null;
  } else {
    if (pnlShows.value === null) {
      pnlShows.value = getPanelSettings();
    }
  }
};

const getXYWHStyle = (selector, isH = 1, isAbs = 0) => {
  const o = $(selector);
  const clumpX = v => _.clamp(parseInt(v, 10), 0, window.innerWidth - 80)
  const clumpY = v => _.clamp(parseInt(v, 10), 0, window.innerHeight - 80)
  let x, y, w, h;
  x = clumpX(o.css('left'));
  y = clumpY(o.css('top'));
  w = o.css('width');
  if (isH) {
    h = o.css('height');
  }
  if (isAbs) {
    // const pos = mm.util.relToAbsPos(selector);
    const pos = {left: x, top: y};
    const p = mm.util.pxToPer(pos.left, pos.top, parseInt(w, 10), parseInt(h, 10), '#panels');
    return `position:absolute;left:${p.left};top:${p.top};width:${p.width};` + (isH ? `height:${p.height}` : '');
    // return `position:absolute;left:${parseInt(pos.left)}px;top:${parseInt(pos.top)}px;width:${w};` + (isH ? `height:${h}` : '');
  } else {
    return `left:${x}px;top:${y}px;width:${w};` + (isH ? `height:${h}` : '');
  }
}

const setPanelXYWH = (id = null, absType = 0) => {
  let isSet = true;
  // IDと対応するスタイル設定を定義
  const panelConfig = [
    {id: 'chart_gmap', panel: pnl.gmap, selector: '#chart_gmap'},
    {id: 'chart_sview', panel: pnl.sview, selector: '#chart_sview'},
    {id: 'chart_tube', panel: pnl.tube, selector: '#chart_tube'},
    {id: 'chart_map', panel: pnl.map, selector: '#chart_map'},
    {id: 'panel_name', panel: pnl.name, selector: '#panel_name'},
    {id: 'panel_city', panel: pnl.city, selector: '#panel_city'},
    {id: 'panel_date', panel: pnl.date, selector: '#panel_date', param: false},
    {id: 'panel_year', panel: pnl.year, selector: '#panel_year', param: false},
    {id: 'panel_season', panel: pnl.season, selector: '#panel_season', param: false},
    {id: 'panel_week', panel: pnl.week, selector: '#panel_week', param: false},
    {id: 'panel_sex', panel: pnl.sex, selector: '#panel_sex', param: false},
    {id: 'panel_age', panel: pnl.age, selector: '#panel_age', param: false},
    {id: 'panel_cond', panel: pnl.cond, selector: '#panel_cond', param: false},
    {id: 'panel_job', panel: pnl.job, selector: '#panel_job'},
    {id: 'panel_detail', panel: pnl.detail, selector: '#panel_detail'},
  ];
  for (let k = 0; k < pnl.ex.length; k++) {
    if (pnl.ex[k].isHidden) continue;
    panelConfig.push({id: `panel_ex_${k}`, panel: pnl.ex[k], selector: `#panel_ex_${k}`, param: false});
  }

  if (absType === 2) {
    // #panelsのrelative配置された子要素を同じレイアウトでabsoluteで配置
    const getElementInfo = (element, parent) => {
      const parentRect = parent.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      // コンピュートされたスタイルを取得
      // const computedStyle = window.getComputedStyle(element);

      return {
        left: elementRect.left - parentRect.left,
        top: elementRect.top - parentRect.top,
        width: elementRect.width,
        height: elementRect.height,
        // その他のスタイル情報も必要に応じてコピー
        // padding: computedStyle.padding,
        // margin: computedStyle.margin,
        // backgroundColor: computedStyle.backgroundColor,
        // color: computedStyle.color
      };
    }
    const sourceParent = document.getElementById('panels');
    let maxBottomInfo = {top: 0, height: 0};
    panelConfig.forEach(({id, panel}) => {
      const sourceChild = document.getElementById(id);
      if (sourceChild !== null) {
        const info = getElementInfo(sourceChild, sourceParent);
        panel.style = `position:absolute;left:${info.left}px;top:${info.top}px;width:${info.width}px;height:${info.height}px;`;
        if (info.top + info.height > maxBottomInfo.top + maxBottomInfo.height) {
          maxBottomInfo = info;
        }
      }
    });
    return maxBottomInfo;
  }

  const isAbs = absType === 1;

  // すべての処理を実行する場合
  if (id === null) {
    panelConfig.forEach(({panel, selector, param = true}) => {
      panel.style = getXYWHStyle(selector, param, isAbs || panel.style.indexOf('absolute') !== -1);
    });
    return isSet;
  }

  // 個別のIDが指定されている場合
  const config = panelConfig.find(config => config.id === id);
  if (config) {
    config.panel.style = getXYWHStyle(config.selector, config.param ?? true, isAbs || config.panel.style.indexOf('absolute') !== -1);
  } else {
    isSet = false;
  }

  return isSet;
}

onMounted(async () => {
  await loadScriptJQueryUI();
  await loadScriptJQueryUIDatepickerJa();
  if (gg.dt === DT_COVID) {
    await loadScriptDataTables();
    $.extend($.fn.dataTable.defaults, {
      language: {
        search: '<i class="fa fa-filter fa-icon"></i>'
      }
    });
  }
  await loadScriptSparkline();
  await loadScriptVectormap();
  // 日本地図データを追加
  // import '/public/jquery-jvectormap/data/jquery-jvectormap-jp-merc.js';
  jQuery.fn.vectorMap('addMap', 'jp_merc', {
    "insets": [{
      "width": 900,
      "top": 0,
      "height": 767.0559741381053,
      "bbox": [{"y": -5706718.25348744, "x": 13692354.81537631}, {"y": -2759570.978494044, "x": 17150293.527703576}],
      "left": 0
    }], "paths": {
      "Shimane": {
        "path": "M299.87,353.76l1.77,1.35l0.69,1.16l-0.1,1.63l-0.56,-0.24l-0.85,0.58l0.16,1.07l-1.77,-0.24l-1.69,-1.49l0.53,-2.58l1.83,-1.24ZM253.82,412.95l2.9,-0.47l2.07,-1.05l0.52,-1.56l0.72,-0.29l2.81,-2.49l0.96,-1.27l0.82,-0.14l0.28,-1.2l4.86,-4.33l2.34,-1.02l0.4,-1.14l1.78,-1.51l0.57,-1.43l3.35,-2.35l0.26,-0.51l2.97,-1.29l0.87,-1.47l0.32,-2.09l-0.31,-0.85l-1.02,-0.74l3.19,-0.37l0.35,-0.26l-0.1,-0.67l2.35,-1.01l3.67,-0.37l0.43,-0.35l0.07,-0.59l1.51,-0.11l0.69,-1.08l0.9,-0.13l0.3,-0.48l1.33,1.06l1.85,-0.36l0.71,0.38l0.93,-0.39l0.36,-0.04l-2.36,1.12l-0.35,0.8l1.51,2.25l2.04,1.24l-0.62,0.79l-0.12,3.75l-0.63,0.68l-3.18,1.84l0.13,1.86l-1.18,2.88l-2.28,0.2l-1.33,-0.62l-1.24,0.4l-2.1,-0.3l-0.89,0.2l-0.55,0.35l-2.64,3.65l-1.9,1.11l-1.17,1.33l-0.09,0.7l0.99,0.8l-0.01,0.36l-4.45,1.68l-2.44,-0.36l-1.04,0.73l-1.14,-0.26l-1.81,0.65l-0.71,-0.47l-0.73,0.12l-3.02,2.75l0.13,1.48l-0.75,1.41l-0.4,1.68l-1.98,2.89l0.21,1.32l-1.67,1.61l-0.06,1.11l0.33,0.67l-1.04,0.65l-0.41,1.03l-0.94,-0.45l-1.83,0.58l-1.53,-0.07l-0.71,-1.68l0.62,-1.38l-0.16,-0.63l-2.48,-0.81l-0.37,-2.17l1.01,-2.28l-0.63,-1.99l-0.03,-1.2ZM294.35,363.66l0.07,-1.04l0.58,-0.68l-0.11,1.01l-0.54,0.71ZM291.02,362.81l0.09,0.39l0.19,0.4l-0.56,-0.44l0.28,-0.34ZM291.91,362.07l0.98,-0.9l0.39,0.12l-0.5,0.92l0.02,0.83l-0.9,-0.97ZM293.0,365.2l-0.45,0.02l-0.11,-0.21l0.35,0.03l0.21,0.16Z",
        "name": "\u5cf6\u6839\u770c"
      },
      "Wakayama": {
        "path": "M352.1,439.69l0.24,-0.26l-0.17,-0.75l0.68,-0.61l-0.01,-0.61l-0.58,-0.35l2.02,-0.92l0.46,-0.86l-0.35,-1.12l-1.39,-0.71l0.77,-0.99l0.05,-0.75l1.24,0.07l0.51,-0.81l-0.74,-1.56l-0.54,-0.19l-0.39,-1.32l-1.25,-1.15l2.58,0.17l7.75,-2.11l1.55,0.12l2.68,-1.31l0.89,-0.08l0.41,2.77l1.3,2.22l-1.13,0.08l-0.72,0.45l-2.93,4.68l0.15,0.85l0.71,0.76l1.15,2.39l-0.42,2.17l0.14,0.69l0.31,0.6l0.76,0.36l1.64,-0.83l1.52,0.36l1.47,-0.32l0.66,0.17l0.72,0.97l0.14,1.22l0.41,0.69l2.57,2.93l1.01,0.5l-0.2,0.74l-1.32,1.53l0.48,0.92l-1.86,1.78l-2.12,0.82l-0.76,0.99l-3.92,-0.67l-5.51,-1.93l-1.45,-1.27l0.1,-0.91l-0.54,-0.9l-1.2,-0.78l0.21,-0.37l1.53,-0.22l0.26,-0.63l-0.31,-0.43l-2.29,-1.79l-2.3,-0.76l-0.23,-0.53l-1.5,-1.26l-0.73,-1.44l-0.99,-0.6l-1.19,0.11ZM352.32,426.66l-0.35,-0.1l0.1,-0.19l0.13,0.2l0.12,0.09ZM373.75,454.83l-0.01,-0.01l0.02,0.0l-0.02,0.01Z",
        "name": "\u548c\u6b4c\u5c71\u770c"
      },
      "Yamanashi": {
        "path": "M450.05,369.79l1.65,-0.4l1.44,0.17l1.05,1.26l0.85,0.22l1.04,-0.32l1.31,-1.13l3.14,1.7l2.65,0.38l0.52,0.5l1.39,3.06l1.33,1.36l2.23,1.35l-0.08,2.23l-0.66,2.33l-4.51,2.67l-1.03,1.98l-5.53,0.99l-2.81,-1.4l-1.03,-0.87l-0.91,0.03l-0.57,0.92l-0.64,3.64l0.09,3.37l-0.88,1.08l-0.6,0.12l-1.46,-1.05l-1.27,-3.68l-0.6,-0.34l-2.38,0.02l-0.21,-1.97l0.33,-1.46l0.09,-4.02l-0.8,-3.36l-0.94,-1.35l-0.35,-1.63l0.95,-1.61l-0.63,-1.47l0.99,-2.14l0.89,0.25l0.82,-0.32l2.25,-3.59l1.61,0.59l0.4,1.42l0.86,0.46Z",
        "name": "\u5c71\u68a8\u770c"
      },
      "Kanagawa": {
        "path": "M479.7,380.4l0.68,-0.63l0.73,-0.14l4.57,2.64l2.0,0.75l-1.56,1.11l-1.3,-0.12l-0.93,0.64l0.15,0.6l1.03,0.52l-0.09,0.49l-0.79,-0.14l-0.54,0.78l0.58,0.89l-0.18,2.87l0.27,0.4l0.64,-0.05l0.71,0.86l1.03,0.23l-0.35,0.34l0.03,0.79l-1.08,0.04l-0.77,0.73l-0.15,0.84l0.52,0.96l-1.1,0.01l-0.26,-1.79l0.52,-0.68l-2.29,-3.34l-0.55,-0.3l-1.42,0.2l-0.62,-0.42l-1.51,-0.2l-5.42,1.2l-1.53,0.82l-1.3,1.32l0.14,2.81l-0.81,0.0l-0.58,0.88l-1.76,-0.65l-0.93,-1.35l-0.4,-1.51l0.92,-2.13l-0.4,-3.26l-0.96,-0.61l-1.42,0.18l1.2,-1.63l4.15,-2.42l0.79,-2.65l0.04,-2.08l1.87,0.95l1.84,1.5l3.78,0.88l2.14,2.47l0.61,-0.39l0.02,-1.78l0.5,-0.52l-0.48,-0.95Z",
        "name": "\u795e\u5948\u5ddd\u770c"
      },
      "Kagawa": {
        "path": "M309.68,435.12l0.75,-0.94l0.43,-2.38l-0.21,-2.18l-0.9,-1.31l0.79,-0.04l0.76,0.46l0.84,-0.29l2.42,-2.04l2.67,-1.41l0.8,-1.29l0.9,-0.3l1.93,0.9l1.09,-0.19l0.96,0.24l0.76,-0.66l0.68,0.07l0.35,-0.93l0.26,1.72l0.4,0.59l0.81,0.08l0.87,-0.92l0.91,0.46l-0.04,1.42l1.83,0.88l0.72,0.68l1.45,0.05l1.08,1.24l-0.49,1.16l-0.37,0.13l-1.05,-0.33l-5.5,0.23l-1.22,0.57l-0.8,1.07l-3.48,1.28l-0.7,0.03l-1.51,-0.94l-2.26,0.25l-1.18,0.99l-1.39,0.49l-2.15,1.71l-1.23,-0.6ZM325.89,419.45l0.14,-0.99l0.65,0.14l2.01,-1.01l2.12,-0.41l0.29,1.02l-0.54,2.09l-0.09,-0.61l-0.61,-0.32l-0.83,0.26l-0.81,1.18l-0.33,-1.22l-0.78,-0.34l-1.23,0.23ZM322.54,419.33l0.43,-0.27l0.23,0.19l-0.24,0.33l-0.42,-0.25ZM312.06,423.3l0.04,-0.2l0.19,-0.23l0.02,0.2l-0.25,0.23Z",
        "name": "\u9999\u5ddd\u770c"
      },
      "Shizuoka": {
        "path": "M442.28,414.71l-4.14,-1.87l-2.4,-0.45l-2.37,-0.03l-2.79,0.95l-3.12,-1.08l-2.6,-0.23l-3.27,0.18l-0.15,-1.46l0.68,-2.8l2.29,-0.96l1.18,-1.09l0.72,-1.52l1.11,-1.35l0.42,-1.93l2.41,-2.7l0.81,-2.08l0.25,-1.89l0.87,-0.39l2.9,-2.36l1.59,-0.62l0.98,-1.02l1.6,-0.6l0.94,-0.87l0.47,-1.09l-0.49,-1.44l0.89,-1.63l-0.11,-2.76l1.08,-0.91l0.39,-1.25l0.77,3.2l-0.1,3.84l-0.32,1.45l0.29,2.4l1.04,0.62l1.34,-0.27l0.8,0.23l1.12,3.51l1.63,1.31l1.44,-0.1l1.25,-1.42l-0.03,-3.61l0.86,-4.03l1.09,0.85l3.1,1.5l8.11,-1.22l0.37,2.91l-0.86,1.48l0.11,1.77l1.42,2.4l1.89,0.75l-0.37,2.07l0.8,0.48l-0.45,1.69l0.41,0.8l0.93,0.47l0.41,1.8l-0.16,0.89l-1.2,0.64l-1.39,2.79l-1.5,1.52l-0.38,2.81l-1.25,-0.33l-2.85,2.12l-1.35,-1.43l-0.01,-0.89l-0.76,-0.66l-0.06,-1.05l0.83,-1.11l-0.7,-2.0l0.37,-1.13l-0.18,-1.25l0.93,-1.17l-0.74,-2.29l0.58,-1.31l2.84,0.2l0.68,-0.49l0.02,-0.56l-2.05,-2.48l-1.16,-0.86l-3.17,-0.62l-1.85,0.82l-1.58,0.12l-0.95,0.65l-0.86,1.67l-0.94,0.88l-0.09,1.13l0.42,0.61l-3.92,2.03l-0.51,0.56l-0.8,1.85l0.28,1.12l-1.23,1.91l-2.32,2.07l-0.64,2.45l0.44,1.18Z",
        "name": "\u9759\u5ca1\u770c"
      },
      "Ehime": {
        "path": "M265.31,457.43l0.32,-0.29l0.99,-0.33l0.47,0.12l-0.82,1.01l-0.13,-0.7l-0.84,0.19ZM267.73,456.48l0.1,-0.62l2.2,-0.61l-0.19,0.07l-2.12,1.16ZM271.21,454.64l0.21,-0.18l3.49,-1.77l2.51,-3.08l2.86,-1.2l2.3,-2.01l0.71,-1.73l-0.2,-1.97l0.58,-2.82l0.96,-0.16l0.33,-0.36l0.51,-1.65l-0.06,-1.19l2.5,-1.93l1.52,-0.4l0.55,-1.07l0.05,-1.07l2.21,2.5l1.62,3.65l1.45,0.72l0.77,0.03l2.78,-0.85l0.37,-0.7l1.89,-0.47l1.02,0.27l1.54,-0.1l2.79,0.71l1.36,-0.62l1.14,-1.39l1.48,0.63l0.22,2.3l-0.48,2.12l-2.43,0.11l-2.55,1.15l-5.78,0.51l-1.39,1.09l-1.34,0.11l-2.23,4.06l-1.21,1.45l-0.67,2.02l-0.05,1.31l-1.08,1.58l-1.27,0.75l-3.71,-0.02l-0.68,0.44l-0.18,0.57l0.35,1.62l1.89,2.42l-2.72,2.05l-0.79,2.16l-0.95,0.68l-0.98,1.4l-1.33,-0.99l-0.81,0.18l-0.15,0.89l1.65,4.64l0.06,1.5l-0.72,1.21l-2.07,-0.96l-1.53,0.5l-0.06,1.03l-0.57,-0.94l0.39,-0.33l-0.12,-1.0l0.43,-1.03l-0.95,-1.69l0.38,-0.44l-0.42,-1.5l0.69,-0.89l-0.25,-0.49l-1.16,-0.16l-0.15,-0.3l0.51,-0.58l0.77,0.47l0.56,-0.42l0.26,-1.08l1.02,-0.53l0.07,-0.5l-0.4,-0.62l0.24,-0.55l-1.62,-0.52l1.16,-1.01l-0.35,-0.55l-3.05,0.34l-0.58,-0.27l0.68,-0.29l0.2,-0.47l-0.1,-1.37l-0.67,0.23l0.7,-2.61l-1.32,-0.81l-2.57,0.24ZM293.82,428.56l0.63,-0.29l0.41,0.54l-0.74,-0.0l-0.3,-0.25ZM292.56,431.79l0.05,-0.59l0.51,-0.49l-0.26,-0.69l0.38,-0.19l0.75,0.6l-1.42,1.37ZM290.92,428.84l0.06,-0.11l0.27,-0.08l-0.34,0.19ZM291.52,428.52l0.31,-0.8l-0.35,-0.62l0.86,-0.81l0.46,1.91l-0.28,0.3l-1.0,0.01ZM280.47,437.43l-0.35,-0.09l0.72,-0.69l-0.15,0.58l-0.21,0.2Z",
        "name": "\u611b\u5a9b\u770c"
      },
      "Mie": {
        "path": "M380.44,413.9l0.67,-0.87l-0.28,-1.24l-1.57,-2.58l1.9,-0.8l0.7,-0.75l0.37,-0.53l-0.19,-1.18l3.66,0.28l2.14,-0.6l1.54,-0.98l1.42,-2.34l1.06,-5.92l-1.17,-2.3l3.06,-0.84l1.54,1.88l2.55,1.28l1.73,3.28l-2.21,1.71l-0.52,1.38l0.2,0.5l-0.26,1.51l-3.05,4.46l-0.45,3.01l0.77,1.28l-0.11,1.27l1.0,0.83l1.83,0.17l1.25,1.27l3.92,2.35l1.19,0.1l0.78,1.59l1.03,0.25l0.1,0.34l-0.15,0.74l-0.84,0.11l-0.4,0.48l-0.02,0.43l0.52,0.58l-0.29,0.46l0.43,1.78l-0.21,0.45l-0.7,0.27l0.42,-0.99l-0.55,-0.97l-0.78,-0.17l-0.79,0.54l-0.93,-0.3l-1.29,0.45l0.44,-0.76l-0.25,-0.6l-0.69,-0.1l-1.73,0.74l0.27,0.79l-1.46,0.92l-0.51,-0.44l-0.62,0.01l-0.34,0.39l-0.75,-0.28l-0.44,0.26l-0.47,1.15l-0.87,-0.15l-1.55,1.15l-0.94,0.04l-1.47,0.78l-1.22,1.31l-0.06,1.0l0.59,0.68l-0.13,0.29l-0.39,0.19l-0.54,-0.77l-0.69,-0.06l-1.11,1.46l0.41,0.66l0.47,0.05l0.84,1.34l-0.08,1.29l-0.48,-0.66l-0.65,-0.09l-0.9,1.03l0.57,0.65l-0.53,0.74l-1.04,0.22l-0.7,0.82l-1.13,0.14l-1.07,1.63l-2.02,5.18l-0.82,-0.39l-2.44,-2.79l-0.39,-1.3l0.77,-0.5l0.45,-1.06l0.63,-0.17l1.27,-1.07l1.64,-2.93l1.89,-0.11l0.57,-0.3l0.1,-0.58l-0.4,-0.93l0.67,-2.64l-0.06,-2.2l0.33,-1.83l-0.5,-1.44l0.15,-0.82l-0.97,-2.2l-0.06,-0.8l0.52,-0.69l2.45,-0.72l1.07,-1.46l-0.15,-1.06l-1.06,-0.52l-0.57,-0.89l-1.31,-0.18l-1.36,-0.8l0.04,-1.74l-0.28,-0.53ZM402.07,427.01l-0.26,-0.07l-0.01,-0.01l0.17,0.04l0.1,0.04Z",
        "name": "\u4e09\u91cd\u770c"
      },
      "Kumamoto": {
        "path": "M215.3,499.79l0.18,-0.82l2.01,-2.19l0.4,-1.05l0.51,-0.45l0.16,-1.34l0.45,0.44l0.61,-0.05l0.27,-0.38l0.02,-1.53l1.48,-1.63l0.27,-0.85l-0.09,-1.05l-0.36,-0.47l0.86,-0.03l0.36,-0.59l-0.92,-1.16l2.11,-1.92l0.84,-1.52l-0.38,-0.55l-0.78,0.01l-4.75,0.9l2.95,-1.82l1.36,-0.2l0.39,-0.65l-0.93,-1.04l0.53,-1.49l-0.61,-1.26l-4.43,-3.8l-0.26,-1.49l1.75,-0.52l0.45,-1.83l1.51,-1.36l2.1,-0.45l1.28,-1.16l0.97,0.15l1.71,1.18l4.74,2.35l1.49,0.0l0.81,-1.94l-1.06,-2.5l1.99,-0.64l1.73,1.21l2.17,3.41l1.01,2.56l0.26,2.51l0.56,1.08l1.2,1.02l-0.92,0.26l-0.96,0.74l-0.9,1.97l-2.83,3.57l-0.51,1.86l-1.39,0.41l-1.3,2.78l-0.13,1.14l0.4,1.36l1.22,1.49l0.92,2.15l-1.08,2.26l0.89,2.74l-1.95,-0.35l-1.6,1.58l-1.5,-0.12l-2.4,1.06l-2.74,-0.01l-3.52,-2.45l-4.98,1.69l-0.64,-0.12l-1.02,-1.12ZM218.98,484.9l-0.01,-0.06l0.11,0.02l-0.06,0.07l-0.04,-0.04ZM215.31,487.68l0.72,0.59l1.6,-0.54l-0.69,0.55l-1.18,3.19l-0.27,0.23l-0.15,-1.06l-0.48,-0.25l-0.9,0.49l-2.09,0.38l-0.58,-1.25l0.8,-0.28l1.23,-1.15l1.98,-0.91ZM216.71,485.01l0.67,-0.53l-0.04,1.55l-0.42,0.14l0.09,-0.68l-0.29,-0.48ZM214.75,493.94l0.02,-0.07l0.07,-0.07l-0.09,0.14ZM211.25,496.09l0.13,-0.41l0.58,-0.17l-0.44,0.47l-0.27,0.11ZM204.24,496.53l1.1,-0.87l1.0,-0.11l0.53,-0.47l-0.29,-0.67l-1.82,-0.15l-0.37,-1.13l0.56,-1.26l-0.03,-0.95l1.03,-1.99l-0.18,-1.05l3.4,-0.91l0.65,0.65l0.25,1.28l0.15,4.66l-1.3,0.93l-0.69,1.49l-2.65,2.13l-0.62,0.27l0.38,-1.61l-0.18,-0.43l-0.95,0.19ZM208.36,498.46l1.43,0.37l0.13,0.45l-0.63,1.77l-0.45,-0.29l0.12,-0.44l-0.59,-1.86Z",
        "name": "\u718a\u672c\u770c"
      },
      "Chiba": {
        "path": "M488.19,363.02l0.58,0.05l3.54,4.78l1.14,0.94l4.66,2.18l1.94,0.45l3.84,-0.28l0.8,-0.18l0.79,-0.87l0.57,-0.18l1.92,-0.26l2.52,0.13l3.94,1.94l2.38,2.66l1.61,0.88l-2.66,0.97l-0.51,-0.44l-1.74,0.42l-1.93,1.34l-3.27,3.07l-1.86,2.87l-1.08,3.9l0.77,2.95l-0.81,3.98l-0.98,0.07l-0.62,1.56l-0.93,-0.4l-0.31,0.36l-0.92,0.13l-0.33,0.57l-3.05,-0.22l-0.83,0.89l-0.22,0.83l-1.18,0.5l-1.97,1.46l-1.34,3.54l-1.41,0.49l-1.34,-0.17l-0.17,-0.91l-1.2,-0.67l1.29,-0.6l0.9,0.07l0.5,-0.83l-0.22,-0.76l-0.74,-0.44l0.36,-0.89l-0.38,-2.67l-0.48,-0.88l0.08,-1.14l1.1,-0.84l0.17,-1.07l-0.76,-2.08l-0.95,-0.34l0.96,-1.72l1.42,0.18l0.53,-0.79l-0.19,-1.44l2.88,-1.6l1.83,-2.36l0.73,-0.2l0.36,-0.98l-0.5,-0.51l-0.27,-1.2l-2.04,-2.0l-0.95,-0.42l-0.96,-0.14l-1.08,0.4l-0.18,0.58l0.34,0.55l-0.59,0.37l-0.53,-0.28l0.52,-2.05l-0.63,-2.95l0.21,-3.33l-3.07,-6.97ZM518.68,375.29l0.94,0.08l-0.19,0.64l-0.55,-0.66l-0.2,-0.06Z",
        "name": "\u5343\u8449\u770c"
      },
      "Aichi": {
        "path": "M400.94,389.03l1.15,0.24l4.15,-1.47l1.51,0.96l1.68,2.47l3.0,1.59l1.14,0.0l2.42,-0.92l2.82,1.65l1.06,0.2l3.06,-1.64l-0.07,0.63l0.49,1.25l0.73,0.68l1.49,-0.11l1.3,-0.57l3.62,0.49l-0.19,1.6l-0.7,1.83l-2.46,2.76l-0.44,1.98l-1.09,1.29l-0.44,1.13l-1.18,1.19l-1.73,0.52l-0.81,0.69l-0.71,2.22l0.05,2.55l-3.44,0.81l-5.71,2.03l-1.37,-0.11l-1.47,0.44l0.91,-1.98l0.79,1.04l0.63,-0.0l4.18,-2.66l0.57,-0.73l-0.09,0.75l0.51,0.53l0.49,-0.27l0.2,-0.87l0.77,-0.27l-0.11,-0.66l-0.48,-0.21l0.14,-1.21l-1.35,-1.42l-2.19,-0.24l-0.92,0.53l-0.11,0.69l-1.59,-0.37l-1.0,0.34l-1.75,-0.09l-1.56,-1.64l0.67,-2.13l-0.42,-1.26l-0.43,0.18l-1.41,2.8l-0.47,2.58l1.62,2.43l-2.68,-1.39l-0.25,-0.66l0.61,-2.46l-0.31,-0.93l-0.81,-0.69l-0.07,-2.45l1.58,-3.04l0.23,-1.77l-0.66,-0.58l-0.51,0.23l-0.21,0.56l-0.49,-0.28l-0.53,0.44l0.15,0.91l-0.66,-0.31l-0.39,0.38l-0.03,0.57l-0.73,-0.11l-2.09,-3.72l0.17,-3.23l2.2,-3.75Z",
        "name": "\u611b\u77e5\u770c"
      },
      "Nagasaki": {
        "path": "M192.48,461.8l0.66,-0.37l0.11,-0.4l-0.55,-1.26l0.22,-1.46l0.85,0.59l0.69,-0.11l0.49,-0.5l0.22,0.46l0.7,0.33l1.42,-0.34l1.52,0.47l-1.3,1.56l-0.14,1.06l1.7,2.97l3.25,1.76l0.11,0.57l-0.58,0.87l0.35,0.79l4.01,3.41l4.0,1.01l-2.64,1.65l0.0,0.71l1.58,1.2l1.27,-0.09l1.48,-1.04l1.58,-0.03l0.74,0.54l0.89,2.03l0.09,1.42l-0.59,0.99l0.08,1.06l-0.34,0.44l-0.89,0.46l-1.24,0.13l-0.4,0.82l-0.74,0.61l-1.0,0.29l-0.28,-0.68l-0.96,-0.66l-0.02,-0.77l2.28,-1.89l0.01,-0.96l-0.66,-0.55l0.03,-0.77l-0.34,-0.33l-2.88,-0.15l-2.96,1.64l-0.3,0.04l-0.23,-0.55l-0.56,-0.01l-1.91,3.57l-1.59,0.9l-0.24,0.74l-0.69,0.61l0.92,-1.92l-0.02,-0.92l0.77,-0.17l0.51,-0.95l-0.39,-0.57l-0.58,0.05l-1.57,-2.89l-0.72,-0.38l-0.57,0.26l-0.89,-0.9l-0.79,-2.21l-0.89,-0.82l-0.13,-1.32l0.59,-0.9l-0.04,-0.96l0.64,-1.78l0.69,0.32l0.65,1.2l-0.32,1.02l0.19,0.65l0.57,0.2l0.71,-0.8l0.98,0.83l-0.18,0.83l-0.39,-0.12l-0.4,0.43l0.09,1.23l0.48,0.75l-0.17,0.84l1.94,1.26l1.06,-1.12l2.67,1.05l0.71,-0.11l0.2,-0.64l-2.0,-2.76l0.48,-2.18l-0.22,-1.01l-1.81,-1.58l-0.42,-0.1l-1.17,0.52l-0.9,-0.97l-0.47,0.01l-0.63,0.6l-0.28,-0.12l-0.2,-0.66l0.34,-0.28l-0.1,-0.59l0.37,-0.81l-0.37,-0.35l-0.7,0.18l0.03,-0.41l-0.64,-0.56l-0.52,0.64l-0.79,-0.74l-0.39,-0.99l-0.77,0.04l-0.72,-0.54l-0.96,-0.12l0.2,-1.44ZM195.88,466.55l-0.01,0.04l-0.03,-0.0l0.04,-0.04ZM195.72,444.85l0.32,-0.5l-0.79,-0.82l-0.04,-0.49l0.57,-0.49l0.13,-1.15l1.65,0.51l-0.12,0.85l0.56,0.89l-0.17,0.45l0.67,0.61l-1.48,0.27l-0.74,1.07l-0.49,-0.51l-0.07,-0.68ZM197.66,455.77l0.04,-0.07l0.02,0.03l-0.06,0.04ZM193.23,469.6l0.11,-0.2l0.19,-0.2l-0.0,0.17l-0.3,0.23ZM191.24,453.97l0.19,-0.13l0.32,0.28l-0.28,-0.03l-0.24,-0.12ZM187.83,464.18l-0.73,-0.72l1.08,-0.87l-0.25,-0.99l0.88,-0.88l0.14,-1.5l1.23,-0.29l0.41,-0.53l0.55,0.1l0.47,-0.38l-0.87,1.34l0.04,0.6l-0.76,0.86l-0.35,1.33l-1.84,1.93ZM191.51,457.41l-0.2,-0.16l0.0,-0.0l0.17,-0.04l0.03,0.21ZM184.02,422.72l-0.09,-1.62l0.57,-0.15l0.61,-1.02l-0.81,-0.32l1.26,-2.24l-0.6,-1.1l-0.37,-0.12l0.79,-2.33l1.57,0.01l1.17,-1.06l0.2,-0.56l0.62,-0.25l0.46,0.55l-0.32,0.42l0.37,0.86l-0.09,0.25l-0.66,0.01l-0.19,0.63l0.6,0.66l-0.34,1.26l-0.49,1.29l-1.93,2.2l0.05,1.08l-0.62,0.74l-0.07,0.52l0.72,0.37l0.56,1.24l-0.91,1.03l-0.75,0.07l-0.15,-0.19l0.38,0.13l0.53,-0.36l0.06,-1.0l-0.59,-0.55l-0.65,0.32l-0.02,-1.12l-0.89,0.34ZM181.08,431.81l0.76,-5.9l0.57,0.39l1.29,-0.5l0.24,-0.38l0.25,0.96l0.56,0.22l-0.07,1.4l-0.74,0.55l0.0,1.47l-0.54,1.36l-1.2,1.07l-1.13,-0.64ZM175.69,472.53l0.57,-0.38l0.71,0.24l0.56,-0.41l-0.11,-1.55l0.72,0.17l0.02,0.76l0.55,0.53l1.75,-0.62l0.13,0.25l-2.31,2.05l-0.33,1.09l0.22,0.8l-0.87,0.2l0.17,-1.78l-0.57,-0.96l-1.2,-0.38ZM178.44,461.62l0.98,-0.59l0.23,0.42l-0.49,0.55l-0.72,-0.38ZM177.17,463.93l0.02,-0.01l0.21,0.12l-0.1,0.04l-0.12,-0.14ZM175.14,475.02l0.53,0.1l0.31,-0.47l-0.41,-0.82l0.22,0.08l0.37,1.41l-1.02,-0.3ZM173.7,476.37l0.37,-0.3l-0.19,0.6l-0.18,-0.3ZM164.81,483.41l0.46,0.52l0.78,-1.47l-0.3,-2.08l0.17,-1.43l0.24,-0.11l0.48,1.11l0.61,0.16l2.27,-1.11l0.34,-0.51l0.25,0.92l0.84,0.46l-0.13,1.54l1.41,1.48l-1.47,0.17l-0.91,-0.5l-0.83,0.34l-0.28,0.64l0.61,0.98l-0.27,0.7l-0.99,-0.99l-2.52,0.3l-0.98,-0.55l0.22,-0.56ZM171.36,477.29l0.47,0.93l0.61,-0.21l0.1,-0.48l0.11,0.35l-0.59,0.81l-0.67,-0.38l-0.03,-1.02Z",
        "name": "\u9577\u5d0e\u770c"
      },
      "Nara": {
        "path": "M370.32,410.18l0.97,0.86l2.47,1.0l0.66,-0.02l1.68,-0.87l2.71,0.99l1.08,-0.59l0.4,1.51l-0.93,0.63l0.57,0.88l-0.18,1.43l0.26,0.62l1.77,1.11l1.12,0.09l0.48,0.82l0.97,0.52l-0.18,0.68l-0.63,0.61l-2.28,0.61l-0.98,1.26l-0.04,0.74l1.09,2.63l-0.18,0.63l0.51,1.47l-0.33,1.77l0.07,2.13l-0.67,2.63l0.35,1.11l-1.41,-0.04l-0.82,0.33l-1.73,3.02l-1.88,1.21l-0.51,1.13l-0.39,0.22l-0.87,-1.05l-0.97,-0.25l-1.21,0.34l-1.93,-0.37l-1.72,0.71l-0.23,-0.69l0.42,-2.19l-0.21,-0.93l-1.81,-2.92l2.7,-4.28l1.49,-0.3l0.59,-0.63l-0.03,-0.64l-1.3,-2.0l-0.39,-2.68l0.62,-0.9l0.08,-2.72l-0.29,-1.1l-1.2,-1.88l2.23,-6.65Z",
        "name": "\u5948\u826f\u770c"
      },
      "Shiga": {
        "path": "M376.78,383.67l0.71,0.58l0.72,0.07l1.11,-0.84l1.99,-0.49l0.34,-1.41l1.27,-0.17l0.37,-1.04l-0.62,-2.65l0.79,-0.28l2.36,0.95l1.52,3.57l0.71,0.52l0.74,-0.08l0.97,2.63l0.29,2.03l-0.92,4.4l0.01,1.36l1.94,3.52l-1.02,5.73l-1.22,2.0l-1.32,0.83l-1.97,0.55l-3.88,-0.21l-0.47,0.49l0.25,1.14l-0.19,0.28l-0.48,0.55l-1.67,0.7l-0.51,-1.1l-1.3,-0.92l-0.51,-0.79l-1.87,-0.52l-0.16,-1.91l-1.09,-2.29l0.64,-4.17l-0.51,-3.22l0.23,-1.88l-2.22,-2.6l1.67,-1.28l1.89,-0.02l0.77,-1.25l0.65,-2.82Z",
        "name": "\u6ecb\u8cc0\u770c"
      },
      "Miyagi": {
        "path": "M510.72,260.94l2.69,-0.72l3.24,-2.25l1.47,0.17l5.08,2.64l3.84,0.38l-0.62,0.92l0.69,1.42l0.52,0.58l2.57,1.23l2.64,-2.16l2.66,0.97l1.2,-0.98l0.32,-0.76l0.01,-1.8l0.88,-1.44l0.04,-1.99l0.29,-0.54l0.94,-0.09l2.57,0.74l0.4,2.21l-1.9,0.55l-0.03,2.29l-1.88,1.9l1.37,2.16l-0.66,-0.01l-2.46,2.02l0.54,0.95l1.47,0.27l-0.49,0.87l-1.25,1.0l-0.03,0.6l1.01,1.1l0.45,0.25l0.58,-0.19l0.14,1.13l-0.52,-0.69l-0.38,0.29l-0.55,1.69l0.13,0.46l-0.64,0.28l-0.23,0.53l0.29,1.34l0.76,0.4l0.02,0.8l0.54,0.33l0.41,1.89l-0.23,0.6l-1.26,-0.77l0.16,-0.63l-1.05,-0.9l0.24,-0.74l-0.44,-0.74l-1.33,-0.09l-1.55,-1.04l-1.08,0.02l-3.01,0.83l-0.86,0.8l-0.23,1.41l-0.42,-1.43l-1.61,-0.21l-0.53,0.39l-1.05,2.14l0.97,0.4l-1.79,1.82l-0.91,1.48l-1.82,5.87l-0.19,3.21l0.33,2.38l-1.31,0.1l-0.77,0.5l-0.25,2.95l-1.71,0.25l-0.37,0.57l-1.75,-0.91l-0.4,-2.18l-0.91,-0.95l-2.35,-0.81l-2.16,0.32l-1.13,-1.46l-1.61,-0.74l-2.49,0.3l-1.14,-0.52l0.31,-2.53l2.7,-1.13l2.16,-2.79l0.71,-4.84l1.39,-2.77l1.06,-1.34l0.79,-2.3l-0.1,-1.2l-0.68,-1.04l-0.12,-2.19l-0.56,-2.17l1.24,-0.24l0.57,-0.71l0.61,-3.83l-1.22,-2.57l-0.96,-1.28ZM539.94,281.76l0.19,0.09l-0.08,0.23l-0.15,-0.27l0.04,-0.05Z",
        "name": "\u5bae\u57ce\u770c"
      },
      "Gunma": {
        "path": "M453.52,359.71l0.56,-0.13l0.44,-0.74l-0.48,-3.07l1.23,-1.47l-0.18,-2.74l-0.37,-0.84l-1.05,-0.69l-1.03,-0.05l-2.93,0.72l-1.5,-1.16l-0.28,-0.97l0.19,-1.16l1.34,-4.1l1.73,-0.86l0.35,-1.51l2.65,-0.59l3.44,-1.52l2.26,-0.42l0.51,-0.5l0.39,-1.2l1.88,-0.79l0.63,-0.64l0.25,-1.35l1.34,-0.8l0.01,-2.34l1.89,-0.65l1.59,-1.74l1.28,1.4l0.53,1.31l1.23,0.47l0.24,0.66l3.75,0.92l-0.48,1.33l0.93,1.53l-1.04,1.59l-0.08,1.85l-0.68,2.88l0.32,0.64l0.88,0.63l2.45,0.58l0.42,0.59l-1.42,2.52l-0.56,1.99l-1.09,1.75l0.08,1.63l2.94,3.4l2.0,-0.13l2.78,0.71l0.88,0.88l0.67,1.59l-2.52,-0.98l-1.42,-0.07l-1.15,0.47l-2.65,-1.5l-2.23,-0.23l-4.74,-1.5l-0.9,-0.04l-0.97,0.94l-1.18,1.92l-0.44,2.02l-8.05,3.9l-1.3,1.9l-2.11,-1.85l-0.01,-2.91l-1.27,-1.49Z",
        "name": "\u7fa4\u99ac\u770c"
      },
      "Kyoto": {
        "path": "M346.15,378.28l1.64,0.25l0.95,-0.64l0.2,-0.66l1.78,-0.52l1.65,-1.19l0.15,-0.51l3.69,-0.98l0.39,0.29l1.17,1.57l0.34,1.11l-0.6,-0.09l-0.72,0.57l-0.48,1.19l-1.55,2.04l0.09,1.22l0.86,0.22l0.49,-0.92l0.18,0.86l1.82,1.03l0.74,-0.14l-0.59,1.67l0.18,0.63l0.63,0.16l0.92,-1.32l0.84,0.32l0.45,-0.07l0.34,-0.5l0.0,-0.89l-0.49,-0.39l-1.11,-0.02l-0.21,-0.55l0.64,-0.44l1.28,-0.16l0.65,-0.65l0.72,0.54l-1.13,1.2l0.33,1.48l-0.15,1.08l2.13,2.91l5.12,1.67l1.57,-0.22l2.17,2.38l-0.25,1.69l0.51,3.18l-0.64,4.26l1.14,2.49l0.16,1.91l0.71,0.7l1.4,0.17l0.46,0.75l1.26,0.87l1.18,3.36l-0.42,0.1l-1.95,-0.92l-0.77,-0.03l-2.17,0.89l-2.19,-0.91l-1.09,-0.98l0.18,-0.84l-0.22,-1.02l-1.8,-3.11l-0.56,-0.56l-0.88,-0.25l-0.55,-1.02l-0.62,-0.15l-0.38,0.25l-0.4,1.14l-1.3,-0.86l-1.27,-1.66l-2.37,-0.52l-0.49,-0.49l1.64,-1.43l0.1,-0.67l-0.73,-1.27l-1.16,-0.84l-1.23,-0.02l-0.78,-0.79l-1.98,-0.55l-1.12,-2.3l-0.55,-0.5l-0.86,-0.06l-1.23,0.49l-2.43,-1.5l-1.51,-0.55l-0.3,-0.56l0.22,-1.94l2.12,0.65l0.56,-0.28l0.64,-0.95l0.22,-0.97l-0.2,-3.11l-1.0,-0.92l-2.02,0.77l-0.95,-0.45l-1.14,-1.87l-0.06,-2.35ZM356.52,380.88l0.07,-0.11l0.01,0.04l-0.09,0.08Z",
        "name": "\u4eac\u90fd\u5e9c"
      },
      "Tokyo": {
        "path": "M558.77,670.07l0.27,-0.25l-0.04,0.24l-0.23,0.0ZM559.09,669.54l-0.07,-0.17l-0.13,-0.23l0.24,0.14l-0.04,0.25ZM556.65,682.0l0.06,0.01l-0.03,0.07l-0.03,-0.08ZM556.98,682.76l0.27,0.12l0.12,0.51l-0.39,-0.63ZM532.38,744.16l0.18,-0.58l0.49,-0.14l-0.18,0.11l-0.48,0.61ZM476.54,374.51l1.76,0.14l2.14,-0.89l0.74,0.93l1.97,-0.27l1.1,-0.64l2.19,0.0l1.16,-0.65l2.71,0.53l0.57,2.56l-0.45,1.78l-0.64,0.33l-0.79,-0.4l-0.52,0.78l-0.36,-1.15l-0.72,0.12l-0.2,0.99l1.11,3.09l-0.29,0.52l-7.22,-3.49l-1.27,0.77l-0.62,-0.23l-0.52,0.36l0.04,0.51l0.89,0.92l-0.41,0.47l0.05,1.33l-1.49,-1.96l-0.73,-0.45l-3.27,-0.58l-1.8,-1.47l-4.78,-2.54l-1.51,-1.7l-0.95,-2.42l-0.48,-0.53l1.89,-1.13l1.41,0.88l6.09,1.57l3.2,1.89ZM489.8,469.06l-1.04,-0.38l-1.24,-2.0l0.08,-0.42l2.72,1.29l0.25,0.38l-0.77,1.13ZM483.38,440.86l-0.54,-0.09l0.16,-0.56l0.31,0.16l0.08,0.49ZM480.92,434.48l-0.44,0.03l-0.34,-0.54l0.16,-0.82l0.63,-0.51l0.59,-0.02l0.31,0.47l-0.3,0.84l-0.6,0.56ZM478.44,412.01l-2.1,-0.78l-0.06,-2.57l1.26,0.44l0.75,0.67l0.16,2.24ZM473.46,424.17l0.2,-1.46l0.26,-0.31l-0.13,0.79l-0.34,0.98ZM469.78,428.85l0.0,-0.33l0.1,-0.35l0.3,0.43l-0.41,0.25Z",
        "name": "\u6771\u4eac\u90fd"
      },
      "Hyogo": {
        "path": "M328.72,401.1l1.36,-1.35l2.31,-3.49l0.13,-2.91l0.84,0.33l0.91,-0.33l0.98,-0.78l0.6,-1.2l-0.13,-1.92l-1.79,-4.15l-0.82,-3.78l-0.53,-1.23l-0.76,-0.66l2.5,-0.91l1.96,-1.18l1.53,0.42l6.32,-0.12l1.22,0.52l0.09,2.51l1.4,2.25l1.37,0.62l1.89,-0.76l0.44,0.31l0.04,3.52l-0.6,0.8l-1.83,-0.73l-0.78,0.34l-0.41,2.46l0.28,0.86l4.45,2.5l2.16,-0.4l1.42,2.65l0.68,0.46l1.45,0.19l0.93,0.85l1.11,-0.03l1.17,0.91l0.2,0.83l-1.54,1.07l-0.19,0.63l0.73,1.04l0.19,1.65l0.93,1.04l1.07,0.59l-0.18,3.76l0.4,2.39l-1.48,1.14l-1.22,-0.92l-1.57,0.11l-0.38,0.4l0.01,0.53l-0.67,-0.76l-1.01,0.36l-0.22,0.57l-0.7,-0.03l-0.37,0.89l-3.52,0.85l-0.96,-0.59l-1.41,-0.02l-0.73,-0.84l-5.52,-3.47l-1.52,-0.39l-4.57,0.15l-0.67,0.41l-0.37,-0.08l-0.02,-0.47l-0.52,-0.4l-0.57,0.31l-1.41,1.83l-1.22,-0.47l-0.83,0.53l-0.27,0.68l-0.47,-0.03l0.04,-2.0l-1.54,-2.22l0.22,-5.68ZM341.53,428.3l0.44,-1.21l-1.22,0.09l-0.59,-1.03l0.54,-0.99l0.59,0.05l0.62,-0.4l2.22,-4.03l1.45,-0.99l1.01,-1.9l1.61,-0.82l1.46,-1.8l0.46,0.48l-0.74,0.95l-0.51,1.5l-2.41,3.23l-0.1,2.53l1.59,2.53l-3.28,1.39l-0.99,0.9l-1.51,0.29l-0.62,-0.78Z",
        "name": "\u5175\u5eab\u770c"
      },
      "Okinawa": {
        "path": "M242.65,706.32l0.08,0.03l-0.0,0.05l-0.03,-0.02l-0.05,-0.06ZM240.77,709.76l-0.51,-0.22l0.6,-0.84l0.28,0.2l-0.36,0.85ZM204.31,629.37l-1.3,-0.05l2.08,-1.52l-0.51,1.17l-0.28,0.4ZM181.18,631.18l2.73,-0.11l0.57,-0.95l-0.34,-0.61l-1.25,-0.17l0.64,-0.53l0.94,-0.27l1.1,-0.96l1.85,-0.18l0.46,-0.6l1.03,-0.07l0.67,-0.61l0.9,0.53l0.58,-0.19l0.46,-1.14l1.68,-1.13l0.0,0.72l1.03,0.39l0.78,-0.69l0.62,-1.29l0.59,1.41l-2.69,0.96l-0.37,0.63l-0.93,0.54l-0.74,1.29l-1.54,1.32l-1.28,-0.18l-0.29,0.97l-0.65,0.42l-0.1,0.66l1.01,0.76l-1.21,0.7l-0.41,0.7l-1.26,0.11l-0.04,0.47l-1.39,-0.94l-0.09,-1.09l-0.44,-0.61l-0.98,0.37l-1.65,-0.63ZM181.76,633.36l0.19,0.46l0.73,0.2l0.09,0.82l1.33,0.82l-0.31,0.35l-0.41,-0.4l-0.94,0.07l-0.12,-1.09l-0.85,-1.35l0.29,0.13ZM184.61,635.68l0.43,-0.07l0.4,0.52l-0.22,0.07l-0.61,-0.53ZM173.04,643.01l1.04,-0.45l0.95,3.03l1.14,1.1l-1.08,1.91l-0.9,0.66l-0.51,-1.06l-0.7,-0.49l0.21,-1.03l-0.55,-1.67l0.4,-2.0ZM162.49,658.71l2.18,0.07l0.66,-0.32l-0.43,0.75l-1.94,0.87l-0.58,-0.4l0.1,-0.98ZM158.83,670.55l0.55,-0.3l0.14,0.6l-0.17,-0.01l-0.51,-0.28ZM141.04,698.67l-0.51,0.89l-0.42,0.4l-0.73,0.01l-0.88,1.14l-1.4,0.09l0.09,-0.91l-0.57,-2.45l1.07,-0.69l0.63,-1.31l0.57,-0.13l0.76,-1.66l-0.56,-3.47l2.18,-0.36l0.9,-1.42l2.94,-1.33l0.88,-1.35l0.03,-0.79l-0.36,-0.6l-1.84,-0.61l-0.19,-1.91l2.54,0.06l-0.13,1.1l0.63,0.77l1.94,-0.33l1.56,-0.95l0.1,-1.03l1.21,-0.94l1.01,-1.54l1.14,-0.74l0.82,-2.05l1.54,1.65l0.1,1.36l-2.01,3.41l-0.51,0.52l-2.51,0.53l-0.88,1.38l0.35,0.64l-1.19,0.33l-1.3,-0.09l-2.01,2.26l-0.89,0.34l-0.27,0.57l-2.26,0.07l-0.86,0.82l0.08,0.66l0.65,0.43l0.35,1.65l0.76,0.87l-1.37,-0.48l-0.68,0.31l-1.6,2.82l-0.31,1.3l0.24,0.63l1.17,0.14ZM144.8,674.28l0.02,-0.36l0.17,-0.0l-0.01,0.45l-0.18,-0.08ZM140.1,680.98l0.74,0.06l0.0,0.08l-0.28,0.05l-0.46,-0.19ZM111.43,693.97l-0.49,-0.82l-1.51,-0.68l1.11,-0.37l0.79,0.27l0.5,0.68l-0.41,0.92ZM68.13,741.1l0.64,1.43l1.1,1.14l1.49,0.23l1.0,0.59l-1.5,0.27l-3.22,-0.14l0.49,-3.52ZM64.25,742.19l0.61,-0.75l0.53,0.23l0.23,0.53l-0.95,0.2l-0.41,-0.21ZM51.19,747.85l-0.37,-0.07l0.16,-0.33l0.34,0.08l-0.14,0.32ZM33.86,754.57l0.45,-0.68l0.93,0.76l1.59,-0.06l1.49,-1.85l-0.88,3.78l-0.7,0.68l-1.67,-0.13l-0.22,-0.25l0.4,-0.51l-0.08,-0.57l-0.47,-0.8l-0.84,-0.38ZM31.08,761.0l0.07,0.02l-0.0,0.01l-0.05,0.03l-0.02,-0.06ZM21.77,758.58l0.65,-0.2l0.64,0.26l0.61,-0.32l0.73,-2.83l0.76,0.65l1.83,0.14l1.51,0.57l-0.5,1.47l-1.1,1.38l-5.14,-0.86l0.01,-0.26ZM0.41,753.91l0.18,-0.23l1.29,-0.03l-0.2,0.22l-1.28,0.03Z",
        "name": "\u6c96\u7e04\u770c"
      },
      "Iwate": {
        "path": "M541.69,256.42l-2.38,-0.69l-1.53,0.22l-0.52,0.58l-0.12,2.39l-0.88,1.43l-0.15,2.24l-0.73,0.71l-2.64,-0.97l-2.74,2.18l-1.94,-1.12l-0.81,-1.16l0.69,-1.1l-0.46,-0.66l-3.99,-0.45l-5.07,-2.64l-1.32,-0.17l1.03,-3.37l-0.2,-0.6l-1.01,-0.94l-0.2,-0.76l0.36,-1.1l0.92,-0.87l0.01,-0.55l-0.63,-0.8l-0.38,-1.65l-1.79,-1.96l-1.13,-3.5l2.3,-5.67l1.49,-1.95l0.7,-1.79l-0.65,-2.93l1.03,-2.38l-1.19,-1.47l-0.06,-0.65l0.4,-0.64l1.72,-0.18l0.42,-0.7l-0.73,-3.03l-0.21,-4.0l0.52,-1.49l-0.01,-2.8l0.73,-1.18l0.96,-0.8l1.64,0.99l1.05,0.01l2.19,-1.9l6.07,-3.44l1.43,0.58l2.96,-1.04l2.88,0.31l0.63,-0.54l0.57,-1.38l2.33,-1.45l1.59,2.31l0.98,2.55l1.74,3.16l-0.72,0.76l-0.07,0.97l1.56,1.06l0.22,0.48l-1.06,1.6l0.18,1.26l2.3,2.41l0.78,0.4l0.3,1.35l-0.51,1.31l0.83,1.51l1.05,4.77l-0.48,0.78l-0.37,3.09l-0.51,1.61l0.17,0.5l0.67,0.15l1.14,-1.2l0.05,1.55l1.13,1.22l-1.47,1.97l-1.82,1.07l-0.03,0.53l0.52,0.66l1.09,0.08l0.81,-0.57l-0.03,0.83l-1.35,0.18l-1.37,1.09l0.06,0.68l0.34,0.16l-1.41,1.23l0.14,0.66l0.56,0.21l1.15,-0.34l-1.46,0.73l-0.02,0.72l-0.67,0.36l-0.0,1.04l0.39,0.38l1.03,0.02l-0.35,0.59l-1.19,0.12l-0.47,0.45l0.27,0.85l0.82,0.27l-1.74,0.49l-0.26,0.68l1.82,1.54l-1.64,-0.41l-0.94,0.59l0.09,0.64l0.98,0.52l-0.59,0.0l-0.42,0.4l0.34,0.71l-2.05,0.04l-0.43,-0.31l-0.63,0.33l0.36,1.4l-0.69,0.66l0.47,0.81l-0.78,-0.64l0.39,-0.5l-0.32,-0.61l-1.55,0.08l-0.46,0.81Z",
        "name": "\u5ca9\u624b\u770c"
      },
      "Kochi": {
        "path": "M280.88,466.11l1.1,0.93l0.82,-0.06l1.14,-1.53l0.99,-0.71l0.77,-2.14l2.66,-1.82l0.16,-1.25l-1.82,-2.22l-0.26,-1.46l3.78,-0.07l1.32,-0.52l1.52,-1.87l0.89,-3.69l1.18,-1.4l1.84,-3.62l1.34,-0.21l1.28,-1.05l5.76,-0.51l2.65,-1.17l2.39,-0.08l2.69,0.99l2.07,0.14l2.68,1.33l0.84,-0.14l0.84,-0.83l1.48,0.06l0.79,1.87l0.4,2.67l2.54,0.48l0.26,0.75l-0.2,1.06l1.05,2.06l2.71,0.71l-1.18,2.11l-0.87,2.92l-0.7,4.07l-0.68,-1.22l-0.95,-0.18l-0.08,-0.69l-1.9,-2.32l-0.4,-1.04l-1.78,-0.89l-0.67,-0.7l-0.46,-1.14l-4.88,-1.12l-0.94,-0.65l-3.85,0.76l-4.19,2.16l-0.82,1.85l-2.15,0.49l-0.74,0.65l-0.8,-0.23l-0.58,0.38l-1.22,1.46l-0.12,1.4l0.52,1.18l-0.47,1.17l-0.96,0.94l-0.12,0.79l-0.69,0.13l-0.73,0.9l-1.99,3.11l-0.03,0.61l-1.11,-0.44l-1.0,0.54l-0.67,1.49l-0.23,1.39l0.42,1.66l-0.15,0.92l-1.2,0.26l-0.19,1.83l1.85,2.21l0.25,0.81l-0.32,0.13l-0.46,-0.28l-0.62,-1.21l-1.32,-0.73l-1.18,0.41l-0.82,-0.08l-1.22,0.94l-1.25,-0.34l-1.67,-1.34l-1.36,0.37l-0.77,0.61l0.06,-0.78l2.49,-3.84l-0.39,-0.51l-1.16,0.01l0.52,-1.03l-0.04,-1.75l-1.67,-4.8ZM278.74,480.2l0.11,0.26l-0.08,0.16l-0.02,-0.11l-0.01,-0.31Z",
        "name": "\u9ad8\u77e5\u770c"
      },
      "Yamagata": {
        "path": "M482.04,272.4l1.29,-3.38l0.75,-1.14l2.6,-2.42l1.7,-2.7l3.02,-10.85l2.15,0.57l1.62,-0.39l2.24,1.87l2.07,0.58l1.01,0.81l3.88,0.63l2.07,1.34l0.79,1.76l0.96,0.97l1.52,0.44l2.38,4.36l-0.52,3.4l-0.3,0.4l-1.1,0.03l-0.51,0.8l0.58,2.4l0.12,2.23l0.72,1.16l0.06,0.71l-0.72,2.09l-1.03,1.3l-1.45,2.91l-0.67,4.75l-1.97,2.56l-2.35,0.77l-0.58,0.68l-0.51,6.44l0.24,2.69l-0.28,0.87l-0.8,0.72l-0.6,0.24l-1.31,-0.11l-1.41,0.69l-1.55,-1.19l-1.93,-0.16l-1.52,-1.89l-4.14,0.2l-1.81,-0.52l-2.54,-2.01l-0.32,-0.87l0.75,-3.29l0.01,-1.44l0.6,-1.22l0.58,-4.56l2.34,-0.11l1.05,-0.42l1.48,-1.34l0.54,-1.53l-0.29,-1.16l-0.58,-0.75l-1.35,-0.97l-1.51,-0.14l-1.03,-0.94l-0.3,-0.81l0.01,-3.21l-4.15,-1.83Z",
        "name": "\u5c71\u5f62\u770c"
      },
      "Ishikawa": {
        "path": "M398.5,323.9l0.29,-1.67l1.48,-3.12l-0.3,-1.5l0.67,-1.0l2.57,-1.44l0.92,-0.25l0.72,0.32l1.08,-0.09l3.86,-1.92l1.33,-1.3l5.04,-1.54l1.2,0.59l-0.17,0.68l0.34,1.12l-1.73,0.06l-1.19,0.73l-0.47,2.09l0.33,0.83l0.47,0.27l-0.22,0.87l-0.63,0.67l-1.8,-0.28l-1.65,0.63l-1.26,1.79l-0.09,0.73l-0.82,0.35l-0.46,0.65l-1.4,-0.78l0.23,-0.42l-0.64,-0.55l-0.96,0.72l-1.1,1.77l-0.36,1.06l0.37,0.95l-0.72,0.38l-0.04,1.58l0.71,0.31l1.41,-0.39l0.93,1.03l0.79,0.17l0.9,-0.53l0.57,-1.35l0.11,4.3l-3.82,0.83l-0.74,0.53l-1.05,1.51l-1.39,4.85l-0.97,1.16l0.22,2.11l-0.52,1.65l0.42,2.78l-0.75,4.5l0.45,1.59l-0.25,2.02l0.6,1.82l0.89,1.19l-1.52,2.47l-0.52,2.02l-0.58,0.92l-1.63,0.36l-3.49,-2.73l-2.1,-0.25l-1.25,0.23l-2.61,-0.87l-0.9,-2.54l-1.54,-1.36l1.79,-1.95l1.39,-0.68l2.45,-2.43l6.11,-8.34l1.49,-2.55l2.07,-5.13l0.15,-1.64l-0.41,-0.59l0.47,-1.79l-1.37,-2.96l0.01,-3.08l-0.85,-0.56l-0.57,0.39ZM405.65,324.65l1.2,-0.47l1.08,0.44l0.59,-0.44l-0.04,0.47l-2.31,0.71l-0.53,-0.71Z",
        "name": "\u77f3\u5ddd\u770c"
      },
      "Fukuoka": {
        "path": "M206.32,454.67l0.23,-0.56l1.75,-0.5l1.65,-1.04l0.18,-0.44l-0.38,-0.55l-1.19,0.21l-0.72,-0.67l1.67,-0.9l0.08,-0.69l1.33,-0.48l0.3,0.77l0.9,0.42l0.03,0.58l0.77,0.54l0.53,-0.07l0.64,-0.68l2.31,-0.44l0.54,-1.72l-0.49,-0.95l2.15,-2.13l0.06,-1.6l-0.51,-0.55l0.61,-0.47l0.37,-0.9l1.2,-0.51l0.49,-0.63l2.52,-0.12l1.58,-1.84l1.22,0.15l0.62,-0.36l1.47,0.07l0.48,0.71l0.78,-0.15l0.6,0.99l0.7,0.27l1.03,-0.42l0.78,-1.45l1.22,-0.74l-0.63,1.7l0.14,0.66l-0.44,0.51l0.12,0.42l-0.75,0.85l-0.06,0.61l0.42,0.52l0.85,0.14l0.16,1.97l2.12,3.96l0.74,0.47l2.26,0.28l-0.36,0.8l0.19,1.52l-0.79,1.21l-4.74,-0.07l-1.38,0.71l-1.63,1.94l-1.46,3.13l0.17,1.62l-0.47,2.19l0.84,3.02l-0.46,1.6l-3.03,-1.81l-1.22,-0.03l-1.43,1.23l-2.2,0.52l-1.68,1.57l-0.25,1.59l-1.34,0.29l-0.2,-3.12l-1.44,-1.05l-0.21,-0.86l-0.46,-0.24l-0.03,-0.82l0.92,-1.83l2.0,-0.91l0.99,-1.81l1.4,-0.84l0.2,-1.6l-0.39,-1.55l-0.77,-0.44l-0.77,0.13l-1.9,1.13l-1.3,-1.12l-3.22,-1.69l-5.99,0.33ZM211.07,448.57l0.01,-0.05l0.02,0.02l-0.03,0.03Z",
        "name": "\u798f\u5ca1\u770c"
      },
      "Miyazaki": {
        "path": "M238.59,523.24l0.9,-1.6l0.17,-1.81l-0.24,-0.66l-0.95,-0.96l-1.69,-0.28l-1.72,-0.77l-0.92,-2.57l-1.1,-1.32l-2.24,-1.05l-0.39,-3.2l-2.13,-1.76l-2.82,-4.25l0.19,-0.43l3.06,-0.03l2.06,-1.02l1.26,0.22l1.87,-1.69l1.65,0.44l0.7,-0.31l0.13,-1.22l-0.81,-1.99l1.03,-1.77l0.03,-0.76l-0.99,-2.34l-1.2,-1.44l-0.23,-1.96l1.09,-2.42l1.53,-0.58l0.5,-1.86l2.82,-3.57l0.89,-1.95l1.97,-0.83l1.78,0.67l2.34,-0.55l0.76,0.58l0.2,1.52l1.26,0.48l1.54,-0.58l3.07,-0.22l1.25,-1.91l1.43,0.24l0.44,0.34l0.48,2.05l0.7,0.41l-0.1,0.54l-0.49,-0.25l-0.53,0.24l-1.46,1.8l-0.13,0.99l-0.55,0.95l-1.19,0.31l-0.7,1.67l0.05,0.68l0.39,0.55l0.97,0.43l-0.63,0.38l-0.99,-0.27l-0.47,0.34l0.01,1.0l0.69,0.84l-1.44,0.86l-0.42,2.02l-0.76,1.12l-4.22,14.63l0.24,2.11l0.4,0.68l0.63,0.33l-0.47,0.85l-0.72,3.78l0.11,0.94l-1.15,1.1l-0.67,1.38l-0.18,0.85l0.24,1.12l-0.49,0.57l-0.36,1.86l-0.59,1.03l-0.21,-0.23l-1.56,0.23l-0.28,-0.18l-0.12,-1.02l-0.89,-1.12l-1.61,-0.44Z",
        "name": "\u5bae\u5d0e\u770c"
      },
      "Aomori": {
        "path": "M493.34,201.43l-0.01,-3.95l-0.87,-1.8l-1.39,-0.08l-0.16,-0.38l0.99,-1.11l0.89,-0.37l0.31,-0.74l0.65,-0.41l1.1,-2.39l1.16,-0.82l1.49,0.84l0.64,0.02l2.21,-1.52l0.69,0.22l1.28,-0.75l1.23,-3.17l0.66,-4.84l0.76,0.66l0.77,0.05l0.3,-0.47l-0.24,-1.07l0.53,0.11l0.44,-0.51l-0.33,-0.66l-2.11,-0.43l-0.1,-1.19l-0.63,-1.09l-0.78,-0.49l0.84,-0.01l0.57,-0.66l0.58,-3.76l3.14,2.73l0.86,-0.05l1.69,-1.56l1.1,0.2l0.96,0.85l0.22,0.69l-0.31,2.99l1.21,7.62l1.09,1.93l1.65,0.73l1.62,-0.29l1.52,-1.7l0.62,-1.31l-0.33,-1.72l0.61,-1.69l0.59,0.54l0.74,0.11l0.82,1.05l0.04,1.03l2.52,0.9l0.61,1.05l1.47,0.59l0.88,-0.34l1.13,-1.27l1.25,-3.03l0.62,-4.69l0.89,-1.82l-0.24,-1.39l-1.93,-3.17l-0.73,-0.54l-0.84,-0.13l-1.05,1.38l0.06,0.58l-2.2,1.68l-1.18,-0.42l-1.19,-0.01l-0.9,0.83l-2.45,0.43l-1.39,1.3l-0.79,-0.45l0.44,-3.87l1.59,-6.25l1.86,-2.46l0.11,-1.92l2.01,1.72l2.16,0.42l1.09,0.59l2.57,2.99l2.4,1.34l2.46,-0.27l1.05,-0.53l1.54,-1.41l0.01,0.74l-0.99,2.59l-0.96,5.86l0.2,1.34l-0.33,3.76l0.11,3.71l0.96,8.04l0.42,2.18l1.61,4.2l1.3,1.31l0.69,0.06l0.58,-0.35l2.65,2.92l-2.42,1.55l-0.86,1.68l-2.71,-0.34l-2.82,1.03l-1.72,-0.54l-6.27,3.55l-2.27,1.88l-1.76,-1.01l1.05,-4.98l-0.17,-1.37l-0.51,-0.72l0.14,-1.12l-0.63,-0.77l-1.91,-0.86l-1.64,0.18l-1.08,1.24l-1.92,1.29l-1.88,0.52l-1.61,-0.51l-1.64,0.54l-3.65,-2.66l-1.6,0.33l-1.6,0.96l-5.05,-0.06l-1.89,-0.58l-1.9,1.2l-1.05,0.06ZM502.75,175.08l-0.04,-0.01l0.01,-0.0l0.03,0.01Z",
        "name": "\u9752\u68ee\u770c"
      },
      "Gifu": {
        "path": "M401.77,355.46l0.73,-0.32l0.85,-1.63l2.17,0.48l0.18,1.63l0.94,0.3l2.02,-1.68l0.64,-1.41l2.45,-2.42l0.55,-0.29l1.29,0.23l1.95,-0.78l0.02,0.63l0.43,0.4l1.88,-0.53l5.96,2.13l1.12,0.97l0.35,1.36l-0.43,1.31l-1.27,1.82l0.01,1.38l-0.71,2.01l0.21,0.97l1.01,1.42l-0.11,0.67l-3.2,4.91l-2.04,0.34l-1.64,2.08l-0.5,1.12l0.4,0.84l1.09,0.28l2.07,1.45l1.88,3.42l-0.01,1.59l0.55,1.87l1.66,1.6l0.23,0.77l-0.11,1.2l0.42,1.5l-0.85,0.12l-0.3,0.47l0.24,2.05l-0.66,1.39l-2.25,1.3l-1.46,0.55l-0.97,-0.73l-2.75,-1.18l-2.47,0.99l-0.67,-0.02l-1.5,-1.04l-1.14,-0.36l-1.69,-2.48l-2.12,-1.18l-4.33,1.51l-1.08,-0.33l-0.4,0.27l-2.42,4.13l-0.18,2.92l-1.95,-0.99l-1.78,-2.02l-0.59,-0.08l-3.08,0.95l-0.43,-0.67l0.91,-5.58l-0.31,-2.28l-1.14,-2.97l-1.4,-0.34l-1.45,-3.45l0.84,-1.58l0.44,-1.77l0.69,-0.57l3.15,0.5l0.95,0.48l0.88,-0.83l2.92,-0.6l2.15,0.17l2.04,-0.34l0.66,-0.46l1.0,-1.61l-0.01,-0.85l-0.75,-1.43l-1.85,-1.06l-0.37,-0.72l0.67,-4.6l0.68,-1.14l0.25,-1.43l1.82,-3.17l-0.2,-0.8l-0.73,-0.79Z",
        "name": "\u5c90\u961c\u770c"
      },
      "Tochigi": {
        "path": "M500.93,329.54l0.53,8.52l0.42,1.42l-1.25,1.38l0.38,5.89l-1.79,3.95l-2.25,0.25l-2.06,0.95l-1.84,0.13l-1.81,1.95l-1.59,0.37l-1.64,2.31l-2.14,1.0l-1.08,0.08l-0.42,-0.73l-1.65,-1.34l-2.55,-0.52l-1.69,0.21l-0.35,-0.27l-2.4,-3.32l1.16,-2.13l0.57,-2.02l1.36,-2.25l0.08,-1.09l-0.86,-0.83l-2.04,-0.34l-1.15,-0.96l0.69,-2.53l0.05,-1.74l1.06,-1.68l-0.11,-0.71l-0.81,-1.06l0.57,-1.25l2.43,-1.92l1.81,-0.66l4.88,-2.83l1.94,-0.84l1.43,-0.25l1.96,-1.73l1.41,-0.42l5.08,1.34l2.37,1.8l0.41,1.19l0.89,0.68Z",
        "name": "\u6803\u6728\u770c"
      },
      "Nagano": {
        "path": "M424.42,387.87l0.77,-0.04l0.35,-0.42l-0.39,-1.89l0.09,-1.3l-0.36,-1.06l-1.58,-1.45l-0.5,-1.71l-0.02,-1.72l-2.26,-3.92l-3.12,-1.8l1.81,-2.54l2.13,-0.41l3.39,-5.21l0.11,-1.21l-1.18,-2.01l0.71,-2.0l-0.05,-1.24l1.23,-1.74l0.56,-2.08l-0.51,-1.37l-1.07,-0.97l1.43,-1.42l1.64,-3.49l-0.04,-1.03l1.29,-1.55l0.44,-2.95l-0.04,-3.58l1.92,-1.1l1.31,-2.14l0.14,-1.51l0.35,-0.39l3.1,0.77l0.38,0.56l0.03,1.69l1.52,1.06l1.24,-0.95l2.19,-0.22l1.45,-0.71l1.46,0.3l0.43,-0.43l0.44,-1.76l1.11,-0.71l1.14,-1.78l3.16,-1.24l1.35,0.13l0.37,0.22l0.73,3.24l2.46,2.62l-0.02,2.48l0.28,0.97l-4.3,1.22l-0.73,0.48l-0.21,1.36l-1.24,0.43l-0.59,0.58l-0.81,1.87l-0.81,3.83l0.46,1.42l1.61,1.34l1.94,-0.06l1.95,-0.57l1.0,0.48l0.44,2.55l-1.27,1.72l0.47,3.13l-0.88,0.49l-0.11,0.82l1.25,1.44l0.11,3.13l2.41,2.14l0.39,2.29l-1.29,1.12l-0.83,0.15l-1.1,-1.35l-2.02,-0.28l-1.71,0.36l-0.65,-1.68l-2.22,-0.77l-0.98,0.84l-1.68,2.95l-1.56,-0.09l-1.43,2.81l0.62,1.44l-0.95,1.77l0.76,2.52l-0.45,1.5l-0.86,0.51l-0.36,0.67l0.06,3.13l-0.86,1.47l0.42,1.68l-0.94,1.03l-1.3,0.43l-1.28,1.19l-1.61,0.63l-2.98,2.42l-0.79,0.32l-1.45,-0.06l-2.62,-0.46l-1.45,0.6l-1.11,0.06l-0.61,-1.28l1.12,-3.09l-0.35,-1.61Z",
        "name": "\u9577\u91ce\u770c"
      },
      "Toyama": {
        "path": "M406.4,355.11l-0.09,-1.44l-1.52,-0.78l-1.42,-0.2l-0.63,0.22l-0.91,1.73l-0.45,-0.07l-0.18,-0.75l0.25,-1.97l-0.43,-2.25l0.73,-3.77l-0.42,-2.74l0.51,-1.6l-0.28,-1.88l0.94,-1.12l1.41,-4.89l0.93,-1.3l3.21,-0.88l-0.1,0.89l-1.02,1.47l0.63,1.83l2.12,1.62l2.45,1.17l2.49,-0.15l1.59,0.28l1.15,-0.21l1.76,-1.62l1.04,-2.79l-0.13,-0.8l0.77,-1.02l1.43,-0.77l2.96,-0.62l1.96,1.57l1.31,5.26l-0.12,5.46l-0.22,0.99l-1.29,1.54l-0.12,1.45l-1.67,3.25l-1.19,1.14l-6.25,-2.17l-1.3,0.62l-0.05,-0.79l-0.53,-0.28l-2.35,0.83l-1.19,-0.26l-0.93,0.47l-2.54,2.49l-0.6,1.37l-1.7,1.46Z",
        "name": "\u5bcc\u5c71\u770c"
      },
      "Oita": {
        "path": "M239.64,450.15l1.31,0.19l0.96,0.8l2.51,0.26l1.73,-0.42l1.64,-1.68l0.61,-1.18l0.53,-0.26l1.83,-0.2l0.94,0.47l1.13,0.04l1.86,3.43l-0.23,1.67l0.21,0.85l-0.84,2.24l-0.84,-0.43l-0.86,0.2l-0.34,1.52l-0.83,0.29l-0.27,0.54l-0.7,0.05l-0.87,-0.68l-1.11,0.39l-0.23,0.95l0.35,2.33l1.47,0.98l1.87,0.07l1.25,-0.6l1.14,0.53l0.66,-0.42l2.97,0.8l1.65,-0.64l-0.53,1.62l-1.1,0.95l-0.66,1.51l0.16,0.55l0.96,0.5l1.11,-0.49l-0.69,1.05l0.19,0.51l2.01,0.53l-0.96,1.51l0.07,1.37l1.5,1.19l1.74,0.44l-1.05,1.06l0.38,0.87l-0.15,0.29l-1.02,0.99l0.29,0.6l0.85,-0.0l-0.28,0.24l-1.42,0.65l-1.16,-0.15l-0.43,0.26l-0.3,1.49l-0.35,-0.03l-0.78,-2.45l-2.22,-0.62l-0.76,0.43l-0.86,1.58l-2.84,0.16l-1.76,0.58l-0.41,-0.31l0.0,-1.21l-0.84,-0.9l-0.68,-0.16l-1.31,0.46l-1.64,0.0l-2.54,-1.99l-0.4,-0.82l-0.33,-2.79l-1.0,-2.4l-2.26,-3.53l-2.01,-1.41l-1.21,0.09l-1.85,0.97l0.15,1.48l0.85,1.39l-0.46,1.22l-0.69,-0.05l-3.02,-1.56l0.52,-1.97l-0.84,-3.03l0.47,-2.11l-0.17,-1.55l1.35,-2.8l1.45,-1.74l1.1,-0.56l4.08,0.21l0.86,-0.23l1.1,-1.58l-0.13,-1.75l0.47,-0.64ZM260.7,468.91l0.33,-0.24l0.17,0.23l-0.11,-0.0l-0.39,0.01Z",
        "name": "\u5927\u5206\u770c"
      },
      "Hiroshima": {
        "path": "M269.15,428.94l-1.64,-0.76l-0.82,-0.91l-1.57,-3.79l-0.84,-4.61l1.93,-2.77l0.41,-1.71l0.8,-1.56l-0.23,-1.05l0.21,-0.48l2.62,-2.15l1.01,0.46l1.87,-0.67l1.26,0.23l0.95,-0.7l2.42,0.35l4.74,-1.78l0.45,-0.48l0.01,-0.69l-1.07,-0.97l1.0,-1.13l1.99,-1.2l2.93,-3.8l2.76,0.17l1.04,-0.4l1.38,0.62l1.73,-0.29l4.57,0.66l1.04,1.69l0.17,4.22l0.39,1.22l1.13,1.81l0.07,2.87l0.8,2.13l0.0,1.47l1.62,3.41l-0.1,0.84l-0.76,0.49l-0.15,1.41l-2.01,2.61l-0.31,0.27l0.17,-0.86l-1.17,-0.75l-0.18,-1.09l-0.79,-0.42l-0.52,0.26l-0.48,1.67l-1.02,0.82l-0.14,-0.43l-1.06,-0.74l-1.6,-0.25l-0.59,0.67l0.15,0.87l-0.53,0.45l-4.12,0.58l-1.54,0.79l-0.27,-0.46l-0.53,-0.15l-2.04,1.39l-0.31,0.47l0.39,0.8l-1.84,0.31l-1.36,0.9l-0.54,0.03l-0.22,-0.5l-0.71,-0.13l-1.11,0.85l0.25,-0.73l-1.57,-2.34l0.12,-1.06l0.65,-0.63l-0.23,-0.5l-0.95,-0.67l-1.68,0.39l-0.95,-0.58l-0.9,0.03l-2.26,1.44l-2.66,3.14l0.33,1.38ZM296.66,424.1l0.51,0.81l0.03,0.89l-1.06,-0.28l-1.92,1.29l-0.07,-1.45l0.47,-0.53l0.42,0.73l0.58,-0.14l0.62,-1.21l0.41,-0.11ZM289.17,427.35l-0.43,1.01l-1.1,0.02l-0.01,-0.41l1.54,-0.61ZM286.37,430.42l0.25,-0.38l0.62,-0.1l-0.35,0.32l-0.53,0.16ZM285.26,430.1l0.26,0.05l-0.05,0.13l-0.2,-0.18ZM283.16,429.5l0.79,0.16l0.37,0.32l-0.58,-0.18l-0.58,-0.29ZM281.93,429.75l-0.02,-0.01l0.06,-0.06l-0.04,0.06l-0.0,0.01ZM278.16,430.38l-0.23,0.51l0.35,1.55l0.83,0.19l-0.21,0.6l-0.79,-0.31l-1.54,0.03l1.23,-1.14l-0.25,-1.06l0.62,-0.36ZM270.85,427.39l0.77,-1.14l0.62,-0.36l0.06,0.25l-1.45,1.25Z",
        "name": "\u5e83\u5cf6\u770c"
      },
      "Niigata": {
        "path": "M426.08,330.5l7.76,-2.92l4.48,-2.61l1.29,-1.42l1.86,0.3l2.42,-0.83l2.44,-1.8l3.23,-3.28l3.33,-2.09l0.85,-1.01l2.31,-4.34l1.65,-1.44l0.93,-1.32l1.83,-6.03l0.48,-1.26l0.82,-1.04l6.02,-4.55l1.83,-0.18l2.48,-1.18l2.63,-1.97l3.53,-4.07l1.44,-9.76l2.06,-4.54l3.79,1.59l-0.14,2.81l0.43,1.16l1.32,1.2l1.64,0.2l1.08,0.81l0.58,1.3l-0.4,1.08l-1.25,1.11l-0.71,0.3l-2.37,0.04l-0.8,0.97l-0.45,4.31l-0.58,1.17l-0.03,1.5l-0.76,3.46l0.44,1.26l0.72,0.82l1.79,1.22l-5.26,7.0l0.51,4.09l-3.74,0.1l-0.8,0.63l-0.4,0.95l-1.32,-0.09l-3.05,0.56l-0.63,0.31l-0.65,0.93l-0.03,0.94l0.56,1.51l-0.4,2.05l-1.11,2.78l0.73,1.46l0.87,0.08l0.71,1.58l0.15,3.56l-0.5,2.89l-0.87,-0.26l-0.47,-1.22l-1.41,-1.54l-1.11,-0.15l-0.91,1.46l-2.68,1.3l-0.04,2.41l-1.28,0.69l-0.38,1.51l-2.27,1.12l-0.82,1.65l-2.05,0.31l-0.82,0.44l-0.25,-3.41l-2.48,-2.66l-0.85,-3.44l-1.19,-0.55l-1.24,-0.03l-1.73,0.47l-1.81,0.93l-1.29,1.91l-1.14,0.76l-0.54,1.9l-1.3,-0.35l-1.47,0.72l-2.25,0.23l-1.04,0.9l-0.76,-0.6l0.04,-1.5l-0.67,-1.01l-2.78,-0.96l-1.1,0.07l-0.7,0.59l-0.23,1.74l-1.21,1.98l-1.39,0.77l-1.04,-4.64l-2.03,-1.83ZM448.89,290.44l0.59,0.85l0.71,-0.63l2.69,-0.23l0.0,1.0l-1.76,3.22l-0.37,1.4l-3.59,2.68l-2.96,1.08l-0.87,-0.06l-0.12,-0.46l1.38,-0.31l0.62,-0.5l0.15,-2.13l1.53,-2.12l-0.82,-1.57l-0.46,-0.14l-1.58,0.57l-0.27,-0.65l0.25,-2.13l1.93,-3.47l3.44,-3.29l1.15,-2.05l0.74,-0.21l-0.35,2.53l-1.83,5.12l-0.19,1.5Z",
        "name": "\u65b0\u6f5f\u770c"
      },
      "Fukui": {
        "path": "M363.15,382.5l0.84,0.37l0.33,0.83l1.49,0.25l1.32,-0.53l0.69,-0.83l-0.37,0.81l0.1,0.71l0.9,0.23l2.17,-0.36l0.76,-0.49l0.35,-1.44l-0.58,-0.35l-0.45,0.23l-0.35,-0.55l0.61,-0.19l0.23,0.48l1.81,1.01l0.96,-0.27l0.02,-0.74l-0.51,-0.56l1.11,-0.31l0.21,-0.49l-0.57,-1.14l0.67,0.28l0.72,-0.17l0.9,0.46l0.85,-0.64l0.91,-0.14l0.23,-0.79l-0.45,-0.58l0.22,-1.25l-0.51,-0.99l1.34,-0.95l0.47,1.6l-0.53,0.67l0.12,0.45l0.91,0.87l0.95,-0.4l0.69,-1.99l0.17,-2.34l-0.95,-1.9l-2.07,-2.01l0.02,-1.67l-1.05,-1.43l0.11,-0.6l1.08,-0.96l1.25,-3.07l2.22,-3.21l0.43,-0.89l-0.27,-0.83l0.88,0.03l1.65,-1.0l1.43,1.2l0.53,2.06l0.71,0.82l2.88,0.96l1.36,-0.23l1.86,0.22l3.1,2.66l2.18,-0.22l-0.72,4.3l0.37,0.95l1.72,0.91l0.91,1.49l-0.89,1.77l-2.12,0.45l-2.18,-0.17l-3.01,0.62l-0.82,0.7l-0.54,-0.35l-3.07,-0.58l-0.98,0.25l-0.74,0.76l-0.47,1.83l-0.75,1.41l-2.52,-0.93l-1.43,0.66l-0.12,0.67l0.61,2.64l-1.38,0.35l-0.28,1.37l-1.85,0.44l-0.96,0.78l-1.03,-0.7l-0.63,0.07l-0.94,3.29l-0.54,0.91l-1.68,-0.1l-2.15,1.65l-1.38,0.22l-4.19,-1.17l-2.3,-2.49l0.06,-1.27l-0.39,-1.04l0.35,-0.42Z",
        "name": "\u798f\u4e95\u770c"
      },
      "Ibaraki": {
        "path": "M485.12,358.59l1.02,-0.16l2.32,-1.09l1.72,-2.36l1.52,-0.32l1.76,-1.93l1.69,-0.06l2.74,-1.08l1.31,0.11l0.97,-0.98l1.64,-3.87l-0.41,-5.74l1.26,-1.37l-0.41,-1.79l-0.34,-5.22l1.26,0.76l2.94,2.83l1.45,0.86l1.15,-0.13l2.59,-2.57l0.18,-0.56l-0.26,-1.38l1.02,0.94l4.89,1.69l-1.41,2.39l-1.4,5.46l-2.04,4.05l-0.41,2.75l0.42,2.49l-0.19,0.77l-1.57,2.18l0.42,4.41l1.98,5.39l5.51,9.36l-1.08,-0.62l-2.43,-2.7l-4.24,-2.08l-2.71,-0.16l-2.06,0.27l-0.99,0.38l-0.56,0.71l-4.29,0.41l-1.67,-0.39l-4.5,-2.1l-2.9,-3.16l-1.74,-2.59l-1.8,-0.24l-0.98,-0.55l-0.67,-0.89l-0.7,-2.12Z",
        "name": "\u8328\u57ce\u770c"
      },
      "Kagoshima": {
        "path": "M210.73,528.63l0.4,-0.69l-0.37,-0.82l-1.77,-1.63l1.16,0.19l0.92,1.01l0.61,-0.1l1.82,-2.07l1.13,-3.05l0.18,-1.18l-0.25,-0.86l0.35,-0.78l-0.41,-1.34l-1.93,-2.7l-2.17,-1.37l-0.3,-0.81l0.23,-1.03l1.03,0.42l0.5,-0.13l-0.04,-0.51l-0.93,-1.06l0.45,-0.87l0.15,-1.65l-0.45,-1.46l-0.89,-0.97l0.88,-1.51l-0.0,-0.83l-0.56,-0.74l0.48,-0.57l0.83,-0.31l0.7,0.9l1.01,-0.05l1.13,-0.88l0.28,-0.66l0.96,1.03l1.16,0.27l4.52,-1.64l0.69,0.1l2.64,2.06l-0.21,0.86l2.44,3.86l2.59,2.31l0.03,2.0l0.5,1.4l2.22,1.03l1.0,1.17l0.4,1.58l0.98,1.43l1.88,0.74l1.37,0.17l0.69,0.7l-0.03,1.84l-0.89,1.52l-1.12,0.24l-1.6,0.89l-0.94,1.4l-0.45,1.39l0.46,0.73l2.2,0.83l-0.88,1.14l0.21,0.55l0.67,0.2l-1.06,0.94l-1.49,0.18l-1.05,2.39l-1.01,1.04l-4.23,1.44l-0.83,0.75l-1.25,0.39l-1.23,1.29l0.12,-1.59l2.3,-1.83l0.64,-2.21l-0.24,-0.69l0.97,-2.33l0.17,-2.47l-1.44,-3.27l-1.29,-0.87l-0.23,-0.65l0.34,-1.35l-0.31,-0.85l-1.91,-0.53l-1.01,-0.62l0.95,-0.87l1.82,0.2l0.22,1.54l1.31,0.34l1.61,-1.92l0.38,-1.6l-0.17,-1.24l-0.94,-1.02l-1.33,-0.05l-1.42,-0.55l-1.46,0.36l-1.11,1.23l-0.35,1.55l-1.05,1.4l-1.45,4.42l0.08,1.46l1.57,4.1l0.96,0.59l0.53,0.79l1.03,0.27l-0.57,2.25l-1.22,0.72l-1.34,-0.03l-0.98,-2.03l-1.58,-0.92l-4.49,-0.15l-1.92,0.27l-0.66,-1.96ZM229.78,557.77l0.52,-0.25l1.74,-2.58l0.62,-1.95l-0.24,-2.57l1.63,-2.39l0.22,-1.5l0.83,-1.23l0.6,1.31l-0.35,0.5l0.2,2.3l-0.66,1.13l0.06,1.83l-0.57,0.82l-0.03,0.8l-0.93,0.33l-1.02,2.35l0.18,2.81l-0.35,0.55l-1.33,0.28l-0.72,0.58l-0.07,-2.17l-0.33,-0.93ZM216.04,560.0l1.28,-0.2l1.23,-1.78l0.68,-0.2l2.76,1.68l1.04,0.3l0.82,0.74l-0.12,0.92l-0.6,1.53l-1.84,1.68l-2.44,0.31l-1.18,-0.37l-1.38,-3.17l-0.25,-1.44ZM213.29,546.31l0.13,-0.07l0.13,0.04l-0.18,0.0l-0.08,0.02ZM210.5,557.3l0.06,-0.04l0.96,0.48l0.22,0.22l-0.73,0.45l-0.52,-1.12ZM202.48,545.11l0.27,-0.35l0.34,0.26l-0.25,0.2l-0.36,-0.1ZM202.37,573.6l0.08,0.14l0.11,0.22l-0.31,-0.24l0.12,-0.12ZM200.72,510.04l0.89,0.77l0.69,0.23l-0.99,0.33l-0.61,-0.81l0.02,-0.52ZM200.47,577.21l0.78,0.2l0.38,1.11l-0.65,-0.07l-0.55,-0.67l0.03,-0.57ZM196.32,517.37l-0.47,0.38l-0.68,-0.58l0.53,-0.36l1.07,-1.99l1.12,-0.52l0.57,-0.91l0.03,0.41l-0.62,0.55l-1.55,3.02ZM196.95,585.33l-0.17,-0.5l0.34,-0.08l0.03,0.06l-0.19,0.52Z",
        "name": "\u9e7f\u5150\u5cf6\u770c"
      },
      "Saitama": {
        "path": "M468.99,356.08l5.33,1.52l2.15,0.21l2.59,1.52l1.51,-0.44l1.27,0.06l2.96,1.27l1.08,1.9l1.27,0.76l0.87,1.39l1.51,4.05l0.8,1.21l0.21,1.23l-0.25,2.08l-2.84,-0.5l-1.23,0.67l-2.17,-0.01l-1.14,0.65l-1.61,0.22l-0.36,-0.75l-0.64,-0.15l-2.76,0.92l-0.67,-0.09l-3.24,-1.91l-6.16,-1.59l-1.41,-0.88l-0.85,0.07l-2.01,1.41l-1.35,-0.07l-1.95,-0.61l-2.2,-1.34l-0.39,-2.18l1.1,-1.74l8.4,-4.2l0.57,-2.21l1.6,-2.46Z",
        "name": "\u57fc\u7389\u770c"
      },
      "Saga": {
        "path": "M199.06,460.25l0.78,1.18l0.4,0.19l0.56,-0.45l-0.28,-1.18l0.12,-0.96l0.62,-0.9l-0.14,-1.28l-2.09,-1.68l0.28,-0.54l0.84,1.34l0.38,0.19l0.69,-0.25l0.01,-0.9l-0.68,-0.92l-0.16,-0.84l0.43,-0.61l1.26,-0.21l1.03,0.82l-0.51,0.95l0.18,0.47l1.42,1.08l0.93,0.14l0.8,-0.41l6.21,-0.36l2.96,1.59l1.38,1.17l0.83,-0.04l2.07,-1.16l0.47,1.25l-0.12,1.17l-1.24,0.62l-0.95,1.78l-0.77,0.13l-1.37,0.93l-0.99,1.94l-0.08,1.03l-1.05,-0.16l-1.37,-1.27l-0.56,0.11l-0.6,0.93l-1.77,1.45l-0.42,-0.2l-0.56,0.44l1.0,2.44l1.72,2.66l-0.36,0.5l-3.76,-0.93l-3.77,-3.21l-0.15,-0.21l0.55,-0.84l-0.23,-1.11l-0.46,-0.55l-1.67,-0.55l-1.21,-0.79l-1.53,-2.7l0.93,-1.3Z",
        "name": "\u4f50\u8cc0\u770c"
      },
      "Tokushima": {
        "path": "M322.78,447.11l-0.33,-2.66l-1.01,-1.96l-1.63,-0.27l-1.82,1.07l-2.58,-1.3l-2.09,-0.14l-2.33,-0.85l0.48,-2.26l-0.22,-2.27l2.53,-1.96l1.41,-0.5l0.64,-0.68l1.89,-0.25l1.38,0.89l1.16,0.01l3.69,-1.35l0.99,-1.21l0.8,-0.36l5.3,-0.21l1.2,0.33l0.95,-0.49l0.58,-1.38l0.71,-0.06l0.65,-0.5l1.76,0.09l0.63,-0.25l0.42,0.51l0.47,-0.08l-0.54,0.71l0.76,0.55l-0.84,2.02l-0.3,2.93l0.46,1.25l0.45,0.22l0.58,-0.21l1.63,2.14l0.01,0.68l-1.58,1.81l0.15,0.55l1.07,0.27l0.32,0.52l-1.23,0.81l-0.87,0.11l-0.48,0.59l-0.59,0.05l-0.54,1.02l-0.75,0.33l-0.18,0.44l-4.63,2.78l0.08,0.72l-0.74,1.13l-1.16,0.32l-0.36,1.35l-2.71,-0.61l-0.85,-1.7l0.21,-0.89l-0.23,-0.99l-1.0,-0.68l-1.78,-0.12Z",
        "name": "\u5fb3\u5cf6\u770c"
      },
      "Osaka": {
        "path": "M363.99,403.97l1.07,0.58l0.74,0.01l0.45,-0.28l0.02,-1.0l0.49,0.91l1.29,0.63l1.74,3.01l-0.07,1.57l-2.46,7.41l1.51,3.19l-0.11,2.48l-1.8,0.45l-2.52,1.27l-1.58,-0.11l-7.71,2.1l-2.28,-0.16l-0.18,-0.28l0.3,-0.35l2.9,-0.82l1.56,-1.31l3.37,-3.8l0.15,-1.2l0.98,-0.95l0.23,-2.52l-0.35,-1.72l0.23,-0.97l1.06,-1.42l-0.43,-2.44l0.19,-3.8l-2.13,-1.95l-0.05,-0.84l1.71,0.29l1.66,2.03Z",
        "name": "\u5927\u962a\u5e9c"
      },
      "Okayama": {
        "path": "M305.02,419.12l-0.01,-1.23l-1.55,-3.11l-0.02,-1.54l-0.77,-1.98l-0.1,-3.02l-1.51,-2.95l-0.17,-4.25l-1.06,-1.79l3.04,-1.66l0.47,-1.73l1.45,-0.09l1.78,-0.83l0.2,-1.3l1.07,-0.99l0.95,-2.51l0.49,-0.14l4.13,1.15l2.03,1.78l0.76,-0.29l0.62,-1.01l1.27,-0.68l0.75,-0.9l1.29,-0.17l0.51,1.27l2.24,0.36l0.82,0.57l1.37,3.15l0.79,0.45l2.1,-0.85l1.81,-0.05l1.91,-1.14l0.05,2.22l-2.29,3.46l-1.52,1.67l-0.19,5.9l0.21,0.74l1.37,1.65l-0.05,1.53l-2.54,-0.59l-0.35,0.55l0.23,0.57l0.79,0.43l-0.56,0.78l-1.88,0.96l-0.02,0.63l0.5,0.27l-0.65,0.47l-1.63,0.49l-0.98,-0.79l-1.64,-0.16l-1.95,0.87l-0.45,0.7l0.13,0.59l0.58,0.48l0.44,-0.03l1.2,-1.18l0.77,-0.2l0.39,0.26l-1.08,1.43l-0.68,0.09l-1.21,2.49l-3.14,-0.34l-0.52,0.72l-0.74,-1.53l-1.06,-0.66l-0.12,-0.5l-0.92,-0.24l-3.35,1.55l-0.62,0.7l-1.48,0.71l0.5,-0.9l-0.17,-0.54l-0.91,-0.35l-1.07,0.59Z",
        "name": "\u5ca1\u5c71\u770c"
      },
      "Akita": {
        "path": "M486.23,218.69l2.4,1.27l1.02,0.02l1.38,-0.95l1.08,-1.26l2.19,-4.16l0.48,-1.76l-0.12,-0.89l0.64,-1.69l0.38,-4.51l-2.19,-2.56l1.19,-0.09l1.67,-1.16l1.76,0.58l5.18,0.06l1.86,-1.03l1.22,-0.26l0.61,0.76l2.77,1.83l0.82,0.12l1.15,-0.59l1.62,0.5l2.28,-0.62l2.05,-1.39l0.87,-1.1l0.7,-0.22l2.3,1.04l-0.07,1.38l0.55,0.67l0.08,1.4l-1.03,4.62l-1.16,1.0l-0.88,1.41l-0.03,3.03l-0.52,1.48l0.21,4.17l0.72,2.86l-1.71,0.24l-0.8,1.22l0.15,1.17l1.07,1.13l-1.01,2.19l0.66,2.96l-0.59,1.5l-1.52,2.0l-2.38,5.87l1.21,4.04l1.81,1.99l0.35,1.59l0.58,0.69l-0.87,0.79l-0.45,1.38l0.29,1.24l1.11,1.25l-1.06,3.33l-3.24,2.25l-2.47,0.57l-1.86,-0.68l-0.76,-0.74l-0.86,-1.86l-2.35,-1.54l-3.89,-0.64l-0.93,-0.78l-2.08,-0.58l-2.39,-1.94l-1.89,0.34l-1.82,-0.51l0.84,-5.08l0.36,-0.76l0.92,-0.48l1.01,-1.24l1.55,-6.66l0.32,-8.47l-0.99,-3.88l-1.82,-2.16l-1.66,-0.81l-1.5,0.33l-0.9,1.09l-2.02,0.1l-1.31,-2.26l0.14,-1.23l-0.36,-0.22l-0.07,-0.75Z",
        "name": "\u79cb\u7530\u770c"
      },
      "Fukushima": {
        "path": "M470.97,322.03l-0.45,-0.91l1.08,-2.44l0.43,-2.24l-0.58,-1.78l0.15,-0.72l0.63,-0.47l4.54,-0.52l1.09,-1.53l3.91,-0.14l0.35,-0.83l-0.58,-3.7l5.24,-6.92l1.74,0.51l1.66,-0.22l1.17,0.26l1.05,-0.29l1.36,1.8l0.79,0.34l1.34,-0.07l1.7,1.23l1.76,-0.73l1.53,0.06l1.53,-1.13l0.36,-0.65l0.03,-6.19l1.07,0.45l2.37,-0.32l1.33,0.59l1.35,1.58l2.3,-0.28l2.06,0.71l0.6,0.63l0.27,1.99l1.56,1.29l1.44,0.25l0.46,-0.58l1.65,-0.32l0.42,-0.87l0.04,-2.3l0.39,-0.24l1.26,-0.07l1.61,3.04l0.81,2.58l-0.41,1.64l0.59,1.25l0.39,9.83l-0.98,5.5l0.0,3.34l-0.57,1.59l-0.76,4.32l-0.87,0.86l-2.71,1.19l-0.98,1.0l-0.07,1.01l-4.85,-1.67l-0.86,-0.92l-0.67,-0.2l-0.59,0.63l0.18,1.77l-2.37,2.35l-0.51,0.03l-1.15,-0.71l-2.93,-2.82l-1.78,-1.04l-0.23,-2.6l-0.97,-0.83l-0.75,-1.51l-2.41,-1.78l-5.32,-1.39l-1.82,0.51l-2.04,1.76l-1.18,0.15l-2.07,0.89l-4.9,2.84l-1.85,0.69l-2.39,1.89l-3.14,-0.63l-0.59,-0.44l0.34,-0.64l0.4,-2.82l-0.16,-3.72l-0.97,-2.09l-0.88,-0.09Z",
        "name": "\u798f\u5cf6\u770c"
      },
      "Yamaguchi": {
        "path": "M269.16,440.58l-0.65,-1.59l0.78,-0.75l1.75,0.65l0.75,1.11l-0.75,-0.05l-0.36,0.69l-1.52,-0.06ZM272.41,440.18l0.33,-0.06l0.38,-0.22l0.57,-0.44l0.04,0.0l-0.38,0.52l-0.11,1.2l-0.61,0.0l-0.22,-1.01ZM274.81,439.1l0.11,-0.38l0.53,0.0l-0.32,0.44l-0.32,-0.07ZM269.05,443.57l0.45,0.16l0.12,0.13l-0.57,-0.29ZM230.87,438.26l0.58,-1.03l0.1,-2.82l-0.29,-0.73l-0.81,-0.25l-0.35,-1.1l1.38,-1.37l0.39,-1.14l-0.42,-1.7l-1.04,-1.71l0.58,-2.14l1.09,0.02l2.71,-1.1l0.14,-0.68l-0.34,-0.3l1.23,-0.47l1.42,0.47l0.27,1.02l1.15,0.47l0.75,-0.84l-0.05,0.32l0.58,0.42l0.68,-0.42l2.55,-0.39l0.5,-0.79l2.12,-0.29l0.32,-0.4l-0.02,-0.89l1.36,-1.56l-0.09,-0.69l2.19,-1.55l0.51,-0.71l0.19,-1.05l0.66,0.08l0.47,-0.45l0.14,-1.2l1.47,0.27l0.71,2.53l-1.0,2.19l0.32,2.38l0.63,0.81l2.04,0.48l-0.6,1.5l0.72,2.03l1.4,0.61l2.79,-0.68l0.73,0.5l0.59,-0.08l0.61,-1.31l1.08,-0.7l-0.2,-1.89l1.19,-1.09l0.39,2.92l1.65,3.96l1.08,1.17l2.19,0.96l-0.05,1.18l-1.1,1.35l-0.08,1.53l0.4,2.51l-0.76,0.92l-1.2,0.49l-0.28,0.49l-0.04,0.99l0.78,2.28l-0.7,0.52l-0.01,-1.19l-0.47,-0.6l-1.29,-0.84l-2.42,-0.75l-0.85,-1.15l-2.61,-1.66l-0.84,0.08l-0.8,1.05l-0.3,-0.03l1.2,-1.24l0.07,-0.56l-2.61,-1.35l-1.89,0.36l-1.43,0.65l-1.0,-0.35l-0.46,0.17l-0.24,0.37l0.15,1.2l-0.43,-0.61l-1.13,-0.11l-0.75,-0.68l-0.63,-0.14l-0.4,0.19l-0.09,0.73l-0.59,0.82l-0.64,-0.57l-0.25,-1.15l-0.86,-0.18l-1.66,2.71l-1.63,1.12l-0.86,-0.26l-0.4,-0.58l-1.11,0.58l-0.27,-0.39l0.15,-0.78l-1.31,-1.01l-0.56,-0.99l-2.17,-0.8l-0.49,0.19l-0.61,1.12l-2.3,2.35l-0.27,0.86l-0.33,-0.38ZM265.31,442.71l-0.28,0.25l0.12,-0.28l0.16,0.03ZM233.49,421.93l-0.69,-0.15l-0.24,-0.1l0.52,-0.44l0.41,0.69ZM239.56,422.23l-0.41,-0.56l0.74,-0.15l-0.12,0.19l-0.21,0.52Z",
        "name": "\u5c71\u53e3\u770c"
      },
      "Hokkaido": {
        "path": "M497.35,149.37l0.98,-0.17l0.41,-0.86l-0.15,-1.66l0.6,-0.58l0.18,-1.5l-0.33,-1.3l0.06,-1.53l-0.93,-1.08l-1.45,-2.65l-1.03,-1.08l-2.93,-1.35l-1.3,-2.19l-2.41,-1.56l-0.78,-2.66l1.99,-4.35l0.37,-3.63l-0.47,-2.93l0.28,-1.35l0.87,-1.28l1.0,-0.47l3.62,-0.41l1.73,-1.93l1.23,-0.6l1.45,-2.42l1.53,1.93l1.14,0.19l0.78,-0.73l0.25,-1.8l0.7,-0.63l1.15,-2.35l4.22,-4.18l0.14,-1.03l-1.18,-2.71l-1.43,-2.08l-2.85,-2.94l-0.22,-1.41l0.78,-2.59l2.08,-0.21l0.68,-0.58l0.46,-1.11l3.78,2.76l1.99,2.11l2.1,1.01l1.13,1.17l3.55,-0.33l2.53,-0.95l-0.26,1.23l0.7,0.86l4.42,1.38l1.87,-0.59l2.32,-1.78l1.98,-2.17l1.57,-2.79l0.5,-1.86l-0.01,-1.84l-2.31,-4.66l0.89,-2.31l-1.53,-5.22l1.29,-2.91l1.03,-0.83l3.06,-1.11l1.69,-1.43l1.7,-2.66l0.54,-1.9l0.33,-3.38l-0.42,-8.49l0.28,-1.35l2.38,-4.58l1.3,-7.07l-0.24,-6.92l-0.88,-5.0l-0.94,-2.9l-3.91,-8.54l-0.31,-1.63l0.24,-1.68l0.95,-1.34l0.96,-2.48l-0.35,-2.63l0.47,-1.36l0.35,1.59l0.36,0.26l3.92,-0.85l1.69,-1.17l0.19,-1.62l1.42,-1.2l1.0,1.9l0.91,0.6l1.15,2.22l4.76,4.22l9.18,11.5l2.65,5.51l1.06,0.78l1.4,2.45l5.61,6.48l0.95,0.55l1.15,1.87l1.85,1.38l2.21,2.37l2.49,2.02l1.05,0.45l1.62,1.67l1.52,0.52l0.53,1.4l1.14,1.25l4.27,2.63l4.62,1.83l-0.93,0.34l-0.13,0.51l0.97,1.23l0.38,1.47l1.47,0.67l4.83,0.28l2.0,-1.48l3.32,0.19l0.93,0.47l-0.93,0.86l-0.68,2.08l0.21,0.48l1.51,0.51l1.07,-0.77l1.09,-3.02l0.42,-0.16l0.22,0.17l-0.16,1.09l0.69,1.8l0.69,0.51l0.8,1.69l1.62,1.19l1.59,0.59l4.09,0.72l4.93,0.41l1.49,-0.3l1.46,-0.94l6.29,-7.23l4.42,-3.37l1.47,-2.73l1.71,-1.79l0.34,-0.95l0.79,1.74l-0.03,1.6l-0.59,1.39l-1.74,2.36l-0.85,3.38l-3.38,4.73l-1.12,2.94l0.11,1.56l-1.13,2.85l0.13,0.98l1.23,2.74l2.93,3.81l2.1,7.37l1.22,2.41l-0.51,-0.39l-1.24,-0.08l-0.41,1.19l0.4,0.63l1.13,0.38l-0.14,0.5l0.63,0.72l1.87,0.72l2.45,0.24l1.26,0.87l0.64,-0.19l0.14,-0.49l-0.63,-1.29l2.27,-2.29l1.54,-0.75l0.42,-0.77l1.98,-0.15l0.71,-0.51l1.43,0.5l-0.6,0.06l-0.87,0.97l-1.44,0.4l-0.72,0.63l-1.67,0.11l-1.68,2.14l-0.63,1.94l-0.93,1.45l-1.64,-0.65l-1.41,0.35l-2.89,0.06l-2.17,1.3l-2.84,0.6l-0.69,1.23l0.1,0.71l0.6,0.47l-0.9,0.27l-0.79,0.97l-2.29,-0.28l0.6,1.68l-0.18,0.41l-3.02,0.35l-1.38,-0.89l-0.31,-1.5l-1.47,-0.26l-1.4,1.28l-0.56,1.14l0.06,1.3l0.89,0.91l-0.51,0.18l-4.15,-0.97l-2.24,0.2l-0.79,0.41l-0.72,-0.12l-2.05,-0.73l-0.98,-1.71l-1.28,-0.15l-4.13,1.07l-4.09,1.97l-4.57,3.3l-2.84,3.48l-4.36,3.77l-1.89,2.33l-3.71,5.87l-2.89,5.36l-0.74,3.65l0.37,3.15l-0.19,1.62l-0.79,3.12l-1.11,1.57l-0.47,1.88l-1.23,-1.07l-0.56,-1.13l-1.43,-1.5l-4.56,-3.06l-5.91,-2.1l-6.09,-3.59l-2.53,-0.83l-5.11,-3.68l-3.24,-3.62l-3.21,-0.55l-2.24,-1.47l-1.67,-1.95l-3.25,-1.65l-2.64,-0.69l-2.71,0.04l-2.66,0.61l-3.53,1.45l-4.85,3.81l-1.38,0.93l-1.31,0.43l-2.29,1.66l-2.24,3.03l-0.86,0.5l-0.66,-0.37l1.02,-0.0l0.33,-0.72l-0.15,-0.39l-1.9,-1.19l-0.51,-1.93l-4.86,-5.63l-1.66,-0.73l-2.59,0.29l-2.11,-0.34l-2.11,0.68l-1.27,1.09l-2.74,4.25l-1.12,3.39l-0.2,1.89l0.39,1.97l0.98,1.09l3.82,2.32l2.12,2.37l0.67,0.34l4.9,-0.99l1.45,1.02l1.84,3.04l2.09,1.78l1.95,2.58l1.23,0.86l2.64,0.79l2.43,2.45l-1.99,0.49l-2.27,2.15l-0.87,0.37l-5.13,-2.23l-1.55,-0.01l-1.73,0.89l0.84,-1.15l-0.22,-1.23l-1.39,-0.82l-1.09,0.19l-0.65,0.61l-1.02,2.93l-2.22,1.39l-2.23,0.9l-0.6,1.6l0.28,3.07l-0.26,1.07l-0.75,0.56l-3.72,1.24l-1.05,1.07l-0.82,1.94l-1.87,-0.73l-1.02,0.27l-1.5,-0.96l-1.52,-4.41l0.01,-1.44l1.02,-3.61l1.46,-2.39l0.36,-1.53ZM649.4,79.82l-0.03,-0.29l0.23,0.22l-0.2,0.08ZM527.88,12.84l0.79,-0.94l0.77,-0.28l1.65,0.86l1.78,2.47l-0.65,1.17l-1.32,0.84l-1.8,-1.04l-1.26,-1.48l0.32,-0.61l-0.27,-0.98ZM523.88,3.72l1.16,-0.38l0.26,0.63l-0.56,4.82l-0.81,-1.85l-0.05,-3.22ZM478.73,138.86l-0.82,-3.52l0.33,-1.29l0.61,-0.72l1.31,-0.29l1.23,-0.74l-1.1,2.16l-0.34,2.84l-1.24,1.55ZM475.75,160.3l0.16,0.03l0.23,0.0l-0.34,0.17l-0.05,-0.21Z",
        "name": "\u5317\u6d77\u9053"
      },
      "Tottori": {
        "path": "M298.05,382.71l0.6,-0.21l0.48,1.23l1.92,1.11l2.29,0.44l0.79,-0.28l0.63,-1.11l3.74,-1.41l4.41,1.08l5.23,-0.42l2.68,-0.76l0.92,0.58l5.96,-0.99l1.37,-0.7l0.4,-0.72l1.8,-0.34l0.63,0.49l0.48,1.1l0.79,3.72l1.79,4.15l0.11,1.63l-0.41,0.76l-1.11,0.8l-1.61,-0.33l-2.43,1.46l-1.72,0.03l-1.98,0.81l-0.95,-2.59l-0.58,-0.74l-1.19,-0.8l-2.04,-0.29l0.01,-0.72l-0.7,-0.61l-1.16,-0.05l-0.85,0.34l-0.79,0.92l-1.29,0.71l-0.75,1.09l-1.78,-1.7l-4.94,-1.18l-0.84,0.73l-0.82,2.28l-0.95,0.76l-0.28,1.45l-1.36,0.54l-1.61,0.15l-0.54,0.69l-0.09,1.17l-0.4,0.29l-2.1,0.85l-0.61,0.62l-3.31,-0.44l1.17,-2.84l-0.21,-1.61l3.69,-2.24l0.33,-4.34l0.61,-0.73l-0.28,-0.8l-2.01,-1.21l-1.15,-1.82Z",
        "name": "\u9ce5\u53d6\u770c"
      }
    }, "height": 767.0559741381053, "projection": {"type": "merc", "centralMeridian": 0.0}, "width": 900.0
  });
  // import '/public/jquery-jvectormap/data/jquery-jvectormap-world-mill.js';
  jQuery.fn.vectorMap('addMap', 'world_mill', {
    "insets": [{
      "width": 900,
      "top": 0,
      "height": 440.7063107441331,
      "bbox": [{"y": -12671671.123330014, "x": -20004297.151525836}, {"y": 6930392.025135122, "x": 20026572.394749384}],
      "left": 0
    }], "paths": {
      "BD": {
        "path": "M651.84,230.21l-0.6,-2.0l-1.36,-1.71l-2.31,-0.11l-0.41,0.48l0.2,0.94l-0.53,0.99l-0.72,-0.36l-0.68,0.35l-1.2,-0.36l-0.37,-2.0l-0.81,-1.86l0.39,-1.46l-0.22,-0.47l-1.14,-0.53l0.29,-0.5l1.48,-0.94l0.03,-0.65l-1.55,-1.22l0.55,-1.14l1.61,0.94l1.04,0.15l0.18,1.54l0.34,0.35l5.64,0.63l-0.84,1.64l-1.22,0.34l-0.77,1.51l0.07,0.47l1.37,1.37l0.67,-0.19l0.42,-1.39l1.21,3.84l-0.03,1.21l-0.33,-0.15l-0.4,0.28Z",
        "name": "Bangladesh"
      },
      "BE": {
        "path": "M429.29,144.05l1.91,0.24l2.1,-0.63l2.63,1.99l-0.21,1.66l-0.69,0.4l-0.18,1.2l-1.66,-1.13l-1.39,0.15l-2.73,-2.7l-1.17,-0.18l-0.16,-0.52l1.54,-0.5Z",
        "name": "Belgium"
      },
      "BF": {
        "path": "M421.42,247.64l-0.11,0.95l0.34,1.16l1.4,1.71l0.07,1.1l0.32,0.37l2.55,0.51l-0.04,1.28l-0.38,0.53l-1.07,0.21l-0.72,1.18l-0.63,0.21l-3.22,-0.25l-0.94,0.39l-5.4,-0.05l-0.39,0.38l0.16,2.73l-1.23,-0.43l-1.17,0.1l-0.89,0.57l-2.27,-1.72l-0.13,-1.11l0.61,-0.96l0.02,-0.93l1.87,-1.98l0.44,-1.81l0.43,-0.39l1.28,0.26l1.05,-0.52l0.47,-0.73l1.84,-1.09l0.55,-0.83l2.2,-1.0l1.15,-0.3l0.72,0.45l1.13,-0.01Z",
        "name": "Burkina Faso"
      },
      "BG": {
        "path": "M491.65,168.18l-0.86,0.88l-0.91,2.17l0.48,1.34l-1.6,-0.24l-2.55,0.95l-0.28,1.51l-1.8,0.22l-2.0,-1.0l-1.92,0.79l-1.42,-0.07l-0.15,-1.63l-1.05,-0.97l0.0,-0.8l1.2,-1.57l0.01,-0.56l-1.14,-1.23l-0.05,-0.94l0.88,0.97l0.88,-0.2l1.91,0.47l3.68,0.16l1.42,-0.81l2.72,-0.66l2.55,1.24Z",
        "name": "Bulgaria"
      },
      "BA": {
        "path": "M463.49,163.65l2.1,0.5l1.72,-0.03l1.52,0.68l-0.36,0.78l0.08,0.45l1.04,1.02l-0.25,0.98l-1.81,1.15l-0.38,1.38l-1.67,-0.87l-0.89,-1.2l-2.11,-1.83l-1.63,-2.22l0.23,-0.57l0.48,0.38l0.55,-0.06l0.43,-0.51l0.94,-0.06Z",
        "name": "Bosnia and Herz."
      },
      "BN": {
        "path": "M707.48,273.58l0.68,-0.65l1.41,-0.91l-0.15,1.63l-0.81,-0.05l-0.61,0.58l-0.53,-0.6Z",
        "name": "Brunei"
      },
      "BO": {
        "path": "M263.83,340.69l-3.09,-0.23l-0.38,0.23l-0.7,1.52l-1.31,-1.53l-3.28,-0.64l-2.37,2.4l-1.31,0.26l-0.88,-3.26l-1.3,-2.86l0.74,-2.37l-0.13,-0.43l-1.2,-1.01l-0.37,-1.89l-1.08,-1.55l1.45,-2.56l-0.96,-2.33l0.47,-1.06l-0.34,-0.73l0.91,-1.32l0.16,-3.84l0.5,-1.18l-1.81,-3.41l2.46,0.07l0.8,-0.85l3.4,-1.91l2.66,-0.35l-0.19,1.38l0.3,1.07l-0.05,1.97l2.72,2.27l2.88,0.49l0.89,0.86l1.79,0.58l0.98,0.7l1.71,0.05l1.17,0.61l0.6,2.7l-0.7,0.54l0.96,2.99l0.37,0.28l4.3,0.1l-0.25,1.2l0.27,1.02l1.43,0.9l0.5,1.35l-0.41,1.86l-0.65,1.08l0.12,1.35l-2.69,-1.65l-2.4,-0.03l-4.36,0.76l-1.49,2.5l-0.11,1.52l-0.75,2.37Z",
        "name": "Bolivia"
      },
      "JP": {
        "path": "M781.12,166.87l1.81,0.68l1.62,-0.97l0.39,2.42l-3.35,0.75l-2.23,2.88l-3.63,-1.9l-0.56,0.2l-1.26,3.05l-2.16,0.03l-0.29,-2.51l1.08,-2.03l2.45,-0.16l0.37,-0.33l1.25,-5.94l2.47,2.71l2.03,1.12ZM773.56,187.34l-0.91,2.22l0.37,1.52l-1.14,1.75l-3.02,1.26l-4.58,0.27l-3.34,3.01l-1.25,-0.8l-0.09,-1.9l-0.46,-0.38l-4.35,0.62l-3.0,1.32l-2.85,0.05l-0.37,0.27l0.13,0.44l2.32,1.89l-1.54,4.34l-1.26,0.9l-0.79,-0.7l0.56,-2.27l-0.21,-0.45l-1.47,-0.75l-0.74,-1.4l2.12,-0.84l1.26,-1.7l2.45,-1.42l1.83,-1.91l4.78,-0.81l2.6,0.57l0.44,-0.21l2.39,-4.66l1.29,1.06l0.5,0.01l5.1,-4.02l1.69,-3.73l-0.38,-3.4l0.9,-1.61l2.14,-0.44l1.23,3.72l-0.07,2.18l-2.23,2.84l-0.04,3.16ZM757.78,196.26l0.19,0.56l-1.01,1.21l-1.16,-0.68l-1.28,0.65l-0.69,1.45l-1.02,-0.5l0.01,-0.93l1.14,-1.38l1.57,0.14l0.85,-0.98l1.4,0.46Z",
        "name": "Japan"
      },
      "BI": {
        "path": "M495.45,295.49l-1.08,-2.99l1.14,-0.11l0.64,-1.19l0.76,0.09l0.65,1.83l-2.1,2.36Z",
        "name": "Burundi"
      },
      "BJ": {
        "path": "M429.57,255.75l-0.05,0.8l0.5,1.34l-0.42,0.86l0.17,0.79l-1.81,2.12l-0.57,1.76l-0.08,5.42l-1.41,0.2l-0.48,-1.36l0.11,-5.71l-0.52,-0.7l-0.2,-1.35l-1.48,-1.48l0.21,-0.9l0.89,-0.43l0.42,-0.92l1.27,-0.36l1.22,-1.34l0.61,-0.0l1.62,1.24Z",
        "name": "Benin"
      },
      "BT": {
        "path": "M650.32,213.86l0.84,0.71l-0.12,1.1l-3.76,-0.11l-1.57,0.4l-1.93,-0.87l1.48,-1.96l1.13,-0.57l1.63,0.57l1.33,0.08l0.99,0.65Z",
        "name": "Bhutan"
      },
      "JM": {
        "path": "M228.38,239.28l-0.8,0.4l-2.26,-1.06l0.84,-0.23l2.14,0.3l1.17,0.56l-1.08,0.03Z",
        "name": "Jamaica"
      },
      "BW": {
        "path": "M483.92,330.07l2.27,4.01l2.83,2.86l0.96,0.31l0.78,2.43l2.13,0.61l1.02,0.76l-3.0,1.64l-2.32,2.02l-1.54,2.69l-1.52,0.45l-0.64,1.94l-1.34,0.52l-1.85,-0.12l-1.21,-0.74l-1.35,-0.3l-1.22,0.62l-0.75,1.37l-2.31,1.9l-1.4,0.21l-0.35,-0.59l0.16,-1.75l-1.48,-2.54l-0.62,-0.43l-0.0,-7.1l2.08,-0.08l0.39,-0.4l0.07,-8.9l5.19,-0.93l0.8,0.89l0.51,0.07l1.5,-0.95l2.21,-0.49Z",
        "name": "Botswana"
      },
      "BR": {
        "path": "M259.98,275.05l3.24,0.7l0.65,-0.53l4.55,-1.32l1.08,-1.06l-0.02,-0.63l0.55,-0.05l0.28,0.28l-0.26,0.87l0.22,0.48l0.73,0.32l0.4,0.81l-0.62,0.86l-0.4,2.13l0.82,2.56l1.69,1.43l1.43,0.2l3.17,-1.68l3.18,0.3l0.65,-0.75l-0.27,-0.92l1.9,-0.09l2.39,0.99l1.06,-0.61l0.84,0.78l1.2,-0.18l1.18,-1.06l0.84,-1.94l1.36,-2.11l0.37,-0.05l1.89,5.45l1.33,0.59l0.05,1.28l-1.77,1.94l0.02,0.56l1.02,0.87l4.07,0.36l0.08,2.16l0.66,0.29l1.74,-1.5l6.97,2.32l1.02,1.22l-0.35,1.18l0.49,0.5l2.81,-0.74l4.77,1.3l3.75,-0.08l3.57,2.0l3.29,2.86l1.93,0.72l2.12,0.12l0.71,0.62l1.21,4.51l-0.95,3.98l-4.72,5.06l-1.64,2.92l-1.72,2.05l-0.8,0.3l-0.72,2.03l0.18,4.75l-0.94,5.53l-0.81,1.13l-0.43,3.36l-2.55,3.5l-0.4,2.51l-1.86,1.04l-0.67,1.53l-2.54,0.01l-3.94,1.01l-1.83,1.2l-2.87,0.82l-3.03,2.19l-2.2,2.83l-0.36,2.0l0.4,1.58l-0.44,2.6l-0.51,1.2l-1.77,1.54l-2.75,4.78l-3.83,3.42l-1.24,2.74l-1.18,1.15l-0.36,-0.83l0.95,-1.14l0.01,-0.5l-1.52,-1.97l-4.56,-3.32l-1.03,-0.0l-2.38,-2.02l-0.81,-0.0l5.34,-5.45l3.77,-2.58l0.22,-2.46l-1.35,-1.81l-0.91,0.07l0.58,-2.33l0.01,-1.54l-1.11,-0.83l-1.75,0.3l-0.44,-3.11l-0.52,-0.95l-1.88,-0.88l-1.24,0.47l-2.17,-0.41l0.15,-3.21l-0.62,-1.34l0.66,-0.73l-0.22,-1.34l0.66,-1.13l0.44,-2.04l-0.61,-1.83l-1.4,-0.86l-0.2,-0.75l0.34,-1.39l-0.38,-0.5l-4.52,-0.1l-0.72,-2.22l0.59,-0.42l-0.03,-1.1l-0.5,-0.87l-0.32,-1.7l-1.45,-0.76l-1.63,-0.02l-1.05,-0.72l-1.6,-0.48l-1.13,-0.99l-2.69,-0.4l-2.47,-2.06l0.13,-4.35l-0.45,-0.45l-3.46,0.5l-3.44,1.94l-0.6,0.74l-2.9,-0.17l-1.47,0.42l-0.72,-0.18l0.15,-3.52l-0.63,-0.34l-1.94,1.41l-1.87,-0.06l-0.83,-1.18l-1.37,-0.26l0.21,-1.01l-1.35,-1.49l-0.88,-1.91l0.56,-0.6l-0.0,-0.81l1.29,-0.62l0.22,-0.43l-0.22,-1.19l0.61,-0.91l0.15,-0.99l2.65,-1.58l1.99,-0.47l0.42,-0.36l2.06,0.11l0.42,-0.33l1.19,-8.0l-0.41,-1.56l-1.1,-1.0l0.01,-1.33l1.91,-0.42l0.08,-0.96l-0.33,-0.43l-1.14,-0.2l-0.02,-0.83l4.47,0.05l0.82,-0.67l0.82,1.81l0.8,0.07l1.15,1.1l2.26,-0.05l0.71,-0.83l2.78,-0.96l0.48,-1.13l1.6,-0.64l0.24,-0.47l-0.48,-0.82l-1.83,-0.19l-0.36,-3.22Z",
        "name": "Brazil"
      },
      "BS": {
        "path": "M226.4,223.87l-0.48,-1.15l-0.84,-0.75l0.36,-1.11l0.95,1.95l0.01,1.06ZM225.56,216.43l-1.87,0.29l-0.04,-0.22l0.74,-0.14l1.17,0.06Z",
        "name": "Bahamas"
      },
      "BY": {
        "path": "M493.84,128.32l0.29,0.7l0.49,0.23l1.19,-0.38l2.09,0.72l0.19,1.26l-0.45,1.24l1.57,2.26l0.89,0.59l0.17,0.81l1.58,0.56l0.4,0.5l-0.53,0.41l-1.87,-0.11l-0.73,0.38l-0.13,0.52l1.04,2.74l-1.91,0.26l-0.89,0.99l-0.11,1.18l-2.73,-0.04l-0.53,-0.62l-0.52,-0.08l-0.75,0.46l-0.91,-0.42l-1.92,-0.07l-2.75,-0.79l-2.6,-0.28l-2.0,0.07l-1.5,0.92l-0.67,0.07l-0.08,-1.22l-0.59,-1.19l1.36,-0.88l0.01,-1.35l-0.7,-1.41l-0.07,-1.0l2.16,-0.02l2.72,-1.3l0.75,-2.04l1.91,-1.04l0.2,-0.41l-0.19,-1.25l3.8,-1.78l2.3,0.77Z",
        "name": "Belarus"
      },
      "BZ": {
        "path": "M198.03,244.38l0.1,-4.49l0.69,-0.06l0.74,-1.3l0.34,0.28l-0.4,1.3l0.17,0.58l-0.34,2.25l-1.3,1.42Z",
        "name": "Belize"
      },
      "RU": {
        "path": "M491.55,115.25l2.55,-1.85l-0.01,-0.65l-2.2,-1.5l7.32,-6.76l1.03,-2.11l-0.13,-0.49l-3.46,-2.52l0.86,-2.7l-2.11,-2.81l1.56,-3.67l-2.77,-4.52l2.15,-2.99l-0.08,-0.55l-3.65,-2.73l0.3,-2.54l1.81,-0.37l4.26,-1.77l2.42,-1.45l4.06,2.61l6.79,1.04l9.34,4.85l1.78,1.88l0.14,2.46l-2.55,2.02l-3.9,1.06l-11.07,-3.14l-2.06,0.53l-0.13,0.7l3.94,2.94l0.31,5.86l0.26,0.36l5.14,2.24l0.58,-0.29l0.32,-1.94l-1.35,-1.78l1.13,-1.09l6.13,2.42l2.11,-0.98l0.18,-0.56l-1.51,-2.67l5.41,-3.76l2.07,0.22l2.26,1.41l0.57,-0.16l1.46,-2.87l-0.05,-0.44l-1.92,-2.32l1.12,-2.32l-1.32,-2.27l5.87,1.16l1.04,1.75l-2.59,0.43l-0.33,0.4l0.02,2.36l2.46,1.83l3.87,-0.91l0.86,-2.8l13.69,-5.65l0.99,0.11l-1.92,2.06l0.23,0.67l3.11,0.45l2.0,-1.48l4.56,-0.12l3.64,-1.73l2.65,2.44l0.56,-0.01l2.85,-2.88l-0.01,-0.57l-2.35,-2.29l0.9,-1.01l7.14,1.3l3.41,1.36l9.05,4.97l0.51,-0.11l1.67,-2.27l-0.05,-0.53l-2.43,-2.21l-0.06,-0.78l-0.34,-0.36l-2.52,-0.36l0.64,-1.93l-1.32,-3.46l-0.06,-1.21l4.48,-4.06l1.69,-4.29l1.6,-0.81l6.23,1.18l0.44,2.21l-2.29,3.64l0.06,0.5l1.47,1.39l0.76,3.0l-0.56,6.03l2.69,2.82l-0.96,2.57l-4.86,5.95l0.23,0.64l2.86,0.61l0.42,-0.17l0.93,-1.4l2.64,-1.03l0.87,-2.24l2.09,-1.96l0.07,-0.5l-1.36,-2.28l1.09,-2.69l-0.32,-0.55l-2.47,-0.33l-0.5,-2.06l1.94,-4.38l-0.06,-0.42l-2.96,-3.4l4.12,-2.88l0.16,-0.4l-0.51,-2.93l0.54,-0.05l1.13,2.25l-0.96,4.35l0.27,0.47l2.68,0.84l0.5,-0.51l-1.02,-2.99l3.79,-1.66l5.01,-0.24l4.53,2.61l0.48,-0.06l0.07,-0.48l-2.18,-3.82l-0.23,-4.67l3.98,-0.9l5.97,0.21l5.49,-0.64l0.27,-0.65l-1.83,-2.31l2.56,-2.9l2.87,-0.17l4.8,-2.47l6.54,-0.67l1.03,-1.42l6.25,-0.45l2.32,1.11l5.53,-2.7l4.5,0.08l0.39,-0.28l0.66,-2.15l2.26,-2.12l5.69,-2.11l3.21,1.29l-2.46,0.94l-0.25,0.42l0.34,0.35l5.41,0.77l0.61,2.33l0.58,0.25l2.2,-1.22l7.13,0.07l5.51,2.47l1.79,1.72l-0.53,2.24l-9.16,4.15l-1.97,1.52l0.16,0.71l6.77,1.91l2.16,-0.78l1.13,2.74l0.67,0.11l1.01,-1.15l3.81,-0.73l7.7,0.77l0.54,1.99l0.36,0.29l10.47,0.71l0.43,-0.38l0.13,-3.23l4.87,0.78l3.95,-0.02l3.83,2.4l1.03,2.71l-1.35,1.79l0.02,0.5l3.15,3.64l4.07,1.96l0.53,-0.18l2.23,-4.47l3.95,1.93l4.16,-1.21l4.73,1.39l2.05,-1.26l3.94,0.62l0.43,-0.55l-1.68,-4.02l2.89,-1.8l22.31,3.03l2.16,2.75l6.55,3.51l10.29,-0.81l4.82,0.73l1.85,1.66l-0.29,3.08l0.25,0.41l3.08,1.26l3.56,-0.88l4.35,-0.11l4.8,0.87l4.57,-0.47l4.23,3.79l0.43,0.07l3.1,-1.4l0.16,-0.6l-1.88,-2.62l0.85,-1.52l7.71,1.21l5.22,-0.26l7.09,2.09l9.59,5.22l6.35,4.11l-0.2,2.38l1.88,1.41l0.6,-0.42l-0.48,-2.53l6.15,0.57l4.4,3.51l-1.97,1.43l-4.0,0.41l-0.36,0.39l-0.06,3.79l-0.74,0.62l-2.07,-0.11l-1.91,-1.39l-3.14,-1.11l-0.78,-1.85l-2.72,-0.68l-2.63,0.49l-1.04,-1.1l0.46,-1.31l-0.5,-0.51l-3.0,0.98l-0.22,0.58l0.99,1.7l-1.21,1.48l-3.04,1.68l-3.12,-0.28l-0.4,0.23l0.09,0.46l2.2,2.09l1.46,3.2l1.15,1.1l0.24,1.33l-0.42,0.67l-4.63,-0.77l-6.96,2.9l-2.19,0.44l-7.6,5.06l-0.84,1.45l-3.61,-2.37l-6.24,2.82l-0.94,-1.15l-0.53,-0.08l-2.28,1.52l-3.2,-0.49l-0.44,0.27l-0.78,2.37l-3.05,3.78l0.09,1.47l0.29,0.36l2.54,0.72l-0.29,4.53l-1.97,0.11l-0.35,0.26l-1.07,2.94l0.8,1.45l-3.91,1.58l-1.05,3.95l-3.48,0.77l-0.3,0.3l-0.72,3.29l-3.09,2.65l-0.7,-1.74l-2.44,-12.44l1.16,-4.71l2.04,-2.06l0.22,-1.64l3.8,-0.86l4.46,-4.61l4.28,-3.81l4.48,-3.01l2.17,-5.63l-0.42,-0.54l-3.04,0.33l-1.77,3.31l-5.86,3.86l-1.86,-4.25l-0.45,-0.23l-6.46,1.3l-6.47,6.44l-0.01,0.55l1.58,1.74l-8.24,1.17l0.15,-2.2l-0.34,-0.42l-3.89,-0.56l-3.25,1.81l-7.62,-0.62l-8.45,1.19l-17.71,15.41l0.22,0.7l3.74,0.41l1.36,2.17l2.43,0.76l1.88,-1.68l2.4,0.2l3.4,3.54l0.08,2.6l-1.95,3.42l-0.21,3.9l-1.1,5.06l-3.71,4.54l-0.87,2.21l-8.29,8.89l-3.19,1.7l-1.32,0.03l-1.45,-1.36l-0.49,-0.04l-2.27,1.5l0.41,-3.65l-0.59,-2.47l1.75,-0.89l2.91,0.53l0.42,-0.2l1.68,-3.03l0.87,-3.46l0.97,-1.18l1.32,-2.88l-0.45,-0.56l-4.14,0.95l-2.19,1.25l-3.41,-0.0l-1.06,-2.93l-2.97,-2.3l-4.28,-1.06l-1.75,-5.07l-2.66,-5.01l-2.29,-1.29l-3.75,-1.01l-3.44,0.08l-3.18,0.62l-2.24,1.77l0.05,0.66l1.18,0.69l0.02,1.43l-1.33,1.05l-2.26,3.51l-0.04,1.43l-3.16,1.84l-2.82,-1.16l-3.01,0.23l-1.35,-1.07l-1.5,-0.35l-3.9,2.31l-3.22,0.52l-2.27,0.79l-3.05,-0.51l-2.21,0.03l-1.48,-1.6l-2.6,-1.63l-2.63,-0.43l-5.46,1.01l-3.23,-1.25l-0.72,-2.57l-5.2,-1.24l-2.75,-1.36l-0.5,0.12l-2.59,3.45l0.84,2.1l-2.06,1.93l-3.41,-0.77l-2.42,-0.12l-1.83,-1.54l-2.53,-0.05l-2.42,-0.98l-3.86,1.57l-4.72,2.78l-3.3,0.75l-1.55,-1.92l-3.0,0.41l-1.11,-1.33l-1.62,-0.59l-1.31,-1.94l-1.38,-0.6l-3.7,0.79l-3.31,-1.83l-0.51,0.11l-0.99,1.29l-5.29,-8.05l-2.96,-2.48l0.65,-0.77l0.01,-0.51l-0.5,-0.11l-6.2,3.21l-1.84,0.15l0.15,-1.39l-0.26,-0.42l-3.22,-1.17l-2.46,0.7l-0.69,-3.16l-0.32,-0.31l-4.5,-0.75l-2.47,1.47l-6.19,1.27l-1.29,0.86l-9.51,1.3l-1.15,1.17l-0.03,0.53l1.47,1.9l-1.89,0.69l-0.22,0.56l0.31,0.6l-2.11,1.44l0.03,0.68l3.75,2.12l-0.39,0.98l-3.23,-0.13l-0.86,0.86l-3.09,-1.59l-3.97,0.07l-2.66,1.35l-8.32,-3.56l-4.07,0.06l-5.39,3.68l-0.39,2.0l-2.03,-1.5l-0.59,0.13l-2.0,3.59l0.57,0.93l-1.28,2.16l0.06,0.48l2.13,2.17l1.95,0.04l1.37,1.82l-0.23,1.46l0.25,0.43l0.83,0.33l-0.8,1.31l-2.49,0.62l-2.49,3.2l0.0,0.49l2.17,2.78l-0.15,2.18l2.5,3.24l-1.58,1.59l-0.7,-0.13l-1.63,-1.72l-2.29,-0.84l-0.94,-1.31l-2.34,-0.63l-1.48,0.4l-0.43,-0.47l-3.51,-1.48l-5.76,-1.01l-0.45,0.19l-2.89,-2.34l-2.9,-1.2l-1.53,-1.29l1.29,-0.43l2.08,-2.61l-0.05,-0.55l-0.89,-0.79l3.05,-1.06l0.27,-0.42l-0.07,-0.69l-0.49,-0.35l-1.73,0.39l0.04,-0.68l1.04,-0.72l2.66,-0.48l0.4,-1.32l-0.5,-1.6l0.92,-1.54l0.03,-1.17l-0.29,-0.37l-3.69,-1.06l-1.41,0.02l-1.42,-1.41l-2.19,0.38l-2.77,-1.01l-0.03,-0.59l-0.89,-1.43l-2.0,-0.32l-0.11,-0.54l0.49,-0.53l0.01,-0.53l-1.6,-1.9l-3.58,0.02l-0.88,0.73l-0.46,-0.07l-1.0,-2.79l2.22,-0.02l0.97,-0.74l0.07,-0.57l-0.9,-1.04l-1.35,-0.48l-0.11,-0.7l-0.95,-0.58l-1.38,-1.99l0.46,-0.98l-0.51,-1.96l-2.45,-0.84l-1.21,0.3l-0.46,-0.76l-2.46,-0.83l-0.72,-1.87l-0.21,-1.69l-0.99,-0.85l0.85,-1.17l-0.7,-3.21l1.66,-1.97l-0.16,-0.79ZM749.2,170.72l-0.6,0.4l-0.13,0.16l-0.01,-0.51l0.74,-0.05ZM871.88,65.81l2.17,-0.13l3.19,1.16l-2.39,1.09l-5.63,0.48l-0.26,-0.84l2.92,-1.76ZM797.39,48.49l-2.0,1.36l-3.8,-0.42l-4.25,-1.8l0.35,-0.97l9.69,1.83ZM783.67,46.12l-1.63,3.09l-8.98,-0.13l-4.09,1.14l-4.54,-2.97l1.16,-3.01l3.05,-0.89l6.5,0.22l8.54,2.56ZM778.2,134.98l-0.56,-0.9l0.27,-0.12l0.29,1.01ZM778.34,135.48l0.94,3.53l-0.05,3.38l1.05,3.39l2.18,5.0l-2.89,-0.83l-0.49,0.26l-1.54,4.65l2.42,3.5l-0.04,1.13l-1.24,-1.24l-0.61,0.06l-1.09,1.61l-0.28,-1.61l0.27,-3.1l-0.28,-3.4l0.58,-2.47l0.11,-4.39l-1.46,-3.36l0.21,-4.32l2.15,-1.46l0.07,-0.34ZM771.95,56.61l1.76,-1.42l2.89,-0.42l3.28,1.71l0.14,0.6l-3.27,0.03l-4.81,-0.5ZM683.76,31.09l-13.01,1.93l4.03,-6.35l1.82,-0.56l1.73,0.34l5.99,2.98l-0.56,1.66ZM670.85,27.93l-5.08,0.64l-6.86,-1.57l-3.99,-2.05l-2.1,-4.16l-2.6,-0.87l5.72,-3.5l5.2,-1.28l4.69,2.85l5.59,5.4l-0.56,4.53ZM564.15,68.94l-0.64,0.17l-7.85,-0.57l-0.86,-2.04l-4.28,-1.17l-0.28,-1.94l2.27,-0.89l0.25,-0.39l-0.08,-2.38l4.81,-3.97l-0.15,-0.7l-1.47,-0.38l5.3,-3.81l0.15,-0.44l-0.58,-1.94l5.28,-2.51l8.21,-3.27l8.28,-0.96l4.35,-1.94l4.6,-0.64l1.36,1.61l-1.34,1.28l-16.43,4.94l-7.97,4.88l-7.74,9.63l0.66,4.14l4.16,3.27ZM548.81,18.48l-5.5,1.18l-0.58,1.02l-2.59,0.84l-2.13,-1.07l1.12,-1.42l-0.3,-0.65l-2.33,-0.07l1.68,-0.36l3.47,-0.06l0.42,1.29l0.66,0.16l1.38,-1.34l2.15,-0.88l2.94,1.01l-0.39,0.36ZM477.37,133.15l-4.08,0.05l-2.56,-0.32l0.33,-0.87l3.17,-1.03l3.24,0.96l-0.09,1.23Z",
        "name": "Russia"
      },
      "RW": {
        "path": "M497.0,288.25l0.71,1.01l-0.11,1.09l-1.63,0.03l-1.04,1.39l-0.83,-0.11l0.51,-1.2l0.08,-1.34l0.42,-0.41l0.7,0.14l1.19,-0.61Z",
        "name": "Rwanda"
      },
      "RS": {
        "path": "M469.4,163.99l0.42,-0.5l-0.01,-0.52l-1.15,-1.63l1.43,-0.62l1.33,0.12l1.17,1.06l0.46,1.13l1.34,0.64l0.35,1.35l1.46,0.9l0.76,-0.29l0.2,0.69l-0.48,0.78l0.22,1.12l1.05,1.22l-0.77,0.8l-0.37,1.52l-1.21,0.08l0.24,-0.64l-0.39,-0.54l-2.08,-1.64l-0.9,0.05l-0.48,0.94l-2.12,-1.37l0.53,-1.6l-1.11,-1.37l0.51,-1.1l-0.41,-0.57Z",
        "name": "Serbia"
      },
      "TL": {"path": "M734.55,307.93l-0.1,-0.97l4.5,-0.86l-2.82,1.28l-1.59,0.55Z", "name": "Timor-Leste"},
      "TM": {
        "path": "M553.03,173.76l-0.04,0.34l-0.09,-0.22l0.13,-0.12ZM555.87,172.66l0.45,-0.1l1.48,0.74l2.06,2.43l4.07,-0.18l0.38,-0.51l-0.32,-1.19l1.92,-0.94l1.91,-1.59l2.94,1.39l0.43,2.47l1.19,0.67l2.58,-0.13l0.62,0.4l1.32,3.12l4.54,3.44l2.67,1.45l3.06,1.14l-0.04,1.05l-1.33,-0.75l-0.59,0.19l-0.32,0.84l-2.2,0.81l-0.46,2.13l-1.21,0.74l-1.91,0.42l-0.73,1.33l-1.56,0.31l-2.22,-0.94l-0.2,-2.17l-0.38,-0.36l-1.73,-0.09l-2.76,-2.46l-2.14,-0.4l-2.84,-1.48l-1.78,-0.27l-1.24,0.53l-1.57,-0.08l-2.0,1.69l-1.7,0.43l-0.36,-1.58l0.36,-2.98l-0.22,-0.4l-1.65,-0.84l0.54,-1.69l-0.34,-0.52l-1.22,-0.13l0.36,-1.64l2.22,0.59l2.2,-0.95l0.12,-0.65l-1.77,-1.74l-0.66,-1.57Z",
        "name": "Turkmenistan"
      },
      "TJ": {
        "path": "M597.75,178.82l-2.54,-0.44l-0.47,0.34l-0.24,1.7l0.43,0.45l2.64,-0.22l3.18,0.95l4.39,-0.41l0.56,2.37l0.52,0.29l0.67,-0.24l1.11,0.49l0.21,2.13l-3.76,-0.21l-1.8,1.32l-1.76,0.74l-0.61,-0.58l0.21,-2.23l-0.64,-0.49l-0.07,-0.93l-1.36,-0.66l-0.45,0.07l-1.08,1.01l-0.55,1.48l-1.31,-0.05l-0.95,1.16l-0.9,-0.35l-1.86,0.74l1.26,-2.83l-0.54,-2.17l-1.67,-0.82l0.33,-0.66l2.18,-0.04l1.19,-1.63l0.76,-1.79l2.43,-0.5l-0.26,1.0l0.73,1.05Z",
        "name": "Tajikistan"
      },
      "RO": {
        "path": "M487.53,154.23l0.6,0.24l2.87,3.98l-0.17,2.69l0.45,1.42l1.32,0.81l1.35,-0.42l0.76,0.36l0.02,0.31l-0.83,0.45l-0.59,-0.22l-0.54,0.3l-0.62,3.3l-1.0,-0.22l-2.07,-1.13l-2.95,0.71l-1.25,0.76l-3.51,-0.15l-1.89,-0.47l-0.87,0.16l-0.82,-1.3l0.29,-0.26l-0.06,-0.64l-1.09,-0.34l-0.56,0.5l-1.05,-0.64l-0.39,-1.39l-1.36,-0.65l-0.35,-1.0l-0.83,-0.75l1.54,-0.54l2.66,-4.21l2.4,-1.24l2.96,0.34l1.48,0.73l0.79,-0.45l1.78,-0.3l0.75,-0.74l0.79,0.0Z",
        "name": "Romania"
      },
      "GW": {
        "path": "M386.23,253.6l-0.29,0.84l0.15,0.6l-2.21,0.59l-0.86,0.96l-1.04,-0.83l-1.09,-0.23l-0.54,-1.06l-0.66,-0.49l2.41,-0.48l4.13,0.1Z",
        "name": "Guinea-Bissau"
      },
      "GT": {
        "path": "M195.08,249.77l-2.48,-0.37l-1.03,-0.45l-1.14,-0.89l0.3,-0.99l-0.24,-0.68l0.96,-1.66l2.98,-0.01l0.4,-0.37l-0.19,-1.28l-1.67,-1.4l0.51,-0.4l0.0,-1.05l3.85,0.02l-0.21,4.53l0.4,0.43l1.46,0.38l-1.48,0.98l-0.35,0.7l0.12,0.57l-2.2,1.96Z",
        "name": "Guatemala"
      },
      "GR": {
        "path": "M487.07,174.59l-0.59,1.43l-0.37,0.21l-2.84,-0.35l-3.03,0.77l-0.18,0.68l1.28,1.23l-0.61,0.23l-1.14,0.0l-1.2,-1.39l-0.63,0.03l-0.53,1.01l0.56,1.76l1.03,1.19l-0.56,0.38l-0.05,0.62l2.52,2.12l0.02,0.87l-1.78,-0.59l-0.48,0.56l0.5,1.0l-1.07,0.2l-0.3,0.53l0.75,2.01l-0.98,0.02l-1.84,-1.12l-1.37,-4.2l-2.21,-2.95l-0.11,-0.56l1.04,-1.28l0.2,-0.95l0.85,-0.66l0.03,-0.46l1.32,-0.21l1.01,-0.64l1.22,0.05l0.65,-0.56l2.26,-0.0l1.82,-0.75l1.85,1.0l2.28,-0.28l0.35,-0.39l0.01,-0.77l0.34,0.22ZM480.49,192.16l0.58,0.4l-0.68,-0.12l0.11,-0.28ZM482.52,192.82l2.51,0.06l0.24,0.32l-1.99,0.13l-0.77,-0.51Z",
        "name": "Greece"
      },
      "GQ": {"path": "M448.79,279.62l0.02,2.22l-4.09,0.0l0.69,-2.27l3.38,0.05Z", "name": "Eq. Guinea"},
      "GY": {
        "path": "M277.42,270.07l-0.32,1.83l-1.32,0.57l-0.23,0.46l-0.28,2.0l1.11,1.82l0.83,0.19l0.32,1.25l1.13,1.62l-1.21,-0.19l-1.08,0.71l-1.77,0.5l-0.44,0.46l-0.86,-0.09l-1.32,-1.01l-0.77,-2.27l0.36,-1.9l0.68,-1.23l-0.57,-1.17l-0.74,-0.43l0.12,-1.16l-0.9,-0.69l-1.1,0.09l-1.31,-1.48l0.53,-0.72l-0.04,-0.84l1.99,-0.86l0.05,-0.59l-0.71,-0.78l0.14,-0.57l1.66,-1.24l1.36,0.77l1.41,1.49l0.06,1.15l0.37,0.38l0.8,0.05l2.06,1.86Z",
        "name": "Guyana"
      },
      "GE": {
        "path": "M521.71,168.93l5.29,0.89l4.07,2.01l1.41,-0.44l2.07,0.56l0.68,1.1l1.07,0.55l-0.12,0.59l0.98,1.29l-1.01,-0.13l-1.81,-0.83l-0.94,0.47l-3.23,0.43l-2.29,-1.39l-2.33,0.05l0.21,-0.97l-0.76,-2.26l-1.45,-1.12l-1.43,-0.39l-0.41,-0.42Z",
        "name": "Georgia"
      },
      "GB": {
        "path": "M412.61,118.72l-2.19,3.22l-0.0,0.45l5.13,-0.3l-0.53,2.37l-2.2,3.12l0.29,0.63l2.37,0.21l2.33,4.3l1.76,0.69l2.2,5.12l2.94,0.77l-0.23,1.62l-1.15,0.88l-0.1,0.52l0.82,1.42l-1.86,1.43l-3.3,-0.02l-4.12,0.87l-1.04,-0.58l-0.47,0.06l-1.51,1.41l-2.12,-0.34l-1.86,1.18l-0.6,-0.29l3.19,-3.0l2.16,-0.69l0.28,-0.41l-0.34,-0.36l-3.73,-0.53l-0.4,-0.76l2.2,-0.87l0.17,-0.61l-1.26,-1.67l0.36,-1.7l3.38,0.28l0.43,-0.33l0.37,-1.99l-1.79,-2.49l-3.11,-0.72l-0.38,-0.59l0.79,-1.35l-0.04,-0.46l-0.82,-0.97l-0.61,0.01l-0.68,0.84l-0.1,-2.34l-1.23,-1.88l0.85,-3.47l1.77,-2.68l1.85,0.26l2.17,-0.22ZM406.26,132.86l-1.01,1.77l-1.57,-0.59l-1.16,0.01l0.37,-1.54l-0.39,-1.39l1.45,-0.1l2.3,1.84Z",
        "name": "United Kingdom"
      },
      "GA": {
        "path": "M453.24,279.52l-0.08,0.98l0.7,1.29l2.36,0.24l-0.98,2.63l1.18,1.79l0.25,1.78l-0.29,1.52l-0.6,0.93l-1.84,-0.09l-1.23,-1.11l-0.66,0.23l-0.15,0.84l-1.42,0.26l-1.02,0.7l-0.11,0.52l0.77,1.35l-1.34,0.97l-3.94,-4.3l-1.44,-2.45l0.06,-0.6l0.54,-0.81l1.05,-3.46l4.17,-0.07l0.4,-0.4l-0.02,-2.66l2.39,0.21l1.25,-0.27Z",
        "name": "Gabon"
      },
      "GN": {
        "path": "M391.8,254.11l0.47,0.8l1.11,-0.32l0.98,0.7l1.07,0.2l2.26,-1.22l0.64,0.44l1.13,1.56l-0.48,1.4l0.8,0.3l-0.08,0.48l0.46,0.68l-0.35,1.36l1.05,2.61l-1.0,0.69l0.03,1.41l-0.72,-0.06l-1.08,1.0l-0.24,-0.27l0.07,-1.11l-1.05,-1.54l-1.79,0.21l-0.35,-2.01l-1.6,-2.18l-2.0,-0.0l-1.31,0.54l-1.95,2.18l-1.86,-2.19l-1.2,-0.78l-0.3,-1.11l-0.8,-0.85l0.65,-0.72l0.81,-0.03l1.64,-0.8l0.23,-1.87l2.67,0.64l0.89,-0.3l1.21,0.15Z",
        "name": "Guinea"
      },
      "GM": {
        "path": "M379.31,251.39l0.1,-0.35l2.43,-0.07l0.74,-0.61l0.51,-0.03l0.77,0.49l-1.03,-0.3l-1.87,0.9l-1.65,-0.04ZM384.03,250.91l0.91,0.05l0.75,-0.24l-0.59,0.31l-1.08,-0.13Z",
        "name": "Gambia"
      },
      "GL": {
        "path": "M353.02,1.2l14.69,4.67l-3.68,1.89l-22.97,0.86l-0.36,0.27l0.12,0.43l1.55,1.18l8.79,-0.66l7.48,2.07l4.86,-1.77l1.66,1.73l-2.53,3.19l-0.01,0.48l0.46,0.15l6.35,-2.2l12.06,-2.31l7.24,1.13l1.09,1.99l-9.79,4.01l-1.44,1.32l-7.87,0.98l-0.35,0.41l0.38,0.38l5.07,0.24l-2.53,3.58l-2.07,3.81l0.08,6.05l2.57,3.11l-3.22,0.2l-4.12,1.66l-0.05,0.72l4.45,2.65l0.51,3.75l-2.3,0.4l-0.25,0.64l2.79,3.69l-4.82,0.31l-0.36,0.29l0.16,0.44l2.62,1.8l-0.59,1.22l-3.3,0.7l-3.45,0.01l-0.29,0.68l3.03,3.12l0.02,1.34l-4.4,-1.73l-1.72,1.35l0.15,0.66l3.31,1.15l3.13,2.71l0.81,3.16l-3.85,0.75l-4.89,-4.26l-0.47,-0.03l-0.17,0.44l0.79,2.86l-2.71,2.21l-0.13,0.44l0.37,0.27l8.73,0.34l-12.32,6.64l-7.24,1.48l-2.94,0.08l-2.69,1.75l-3.43,4.41l-5.24,2.84l-1.73,0.18l-7.12,2.1l-2.15,2.52l-0.13,2.99l-1.19,2.45l-4.01,3.09l-0.14,0.44l0.97,2.9l-2.28,6.48l-3.1,0.2l-3.83,-3.07l-4.86,-0.02l-2.25,-1.93l-1.7,-3.79l-4.3,-4.84l-1.21,-2.49l-0.44,-3.8l-3.32,-3.63l0.84,-2.86l-1.56,-1.7l2.28,-4.6l3.83,-1.74l1.03,-1.96l0.52,-3.47l-0.59,-0.41l-4.17,2.21l-2.07,0.58l-2.72,-1.28l-0.15,-2.71l0.85,-2.09l2.01,-0.06l5.06,1.2l0.46,-0.23l-0.14,-0.49l-6.54,-4.47l-2.67,0.55l-1.58,-0.86l2.56,-4.01l-0.03,-0.48l-1.5,-1.74l-4.98,-8.5l-3.13,-1.96l0.03,-1.88l-0.24,-0.37l-6.85,-3.02l-5.36,-0.38l-12.7,0.58l-2.78,-1.57l-3.66,-2.77l5.73,-1.45l5.0,-0.28l0.38,-0.38l-0.35,-0.41l-10.67,-1.38l-5.3,-2.06l0.25,-1.54l18.41,-5.26l1.22,-2.27l-0.25,-0.55l-6.14,-1.86l1.68,-1.77l8.55,-4.03l3.59,-0.63l0.3,-0.54l-0.88,-2.27l5.47,-1.47l7.65,-0.95l7.55,-0.05l3.04,1.85l6.48,-3.27l5.81,2.22l3.56,0.5l5.16,1.94l0.5,-0.21l-0.17,-0.52l-5.71,-3.13l0.28,-2.13l8.12,-3.6l8.7,0.28l3.35,-2.34l8.71,-0.6l19.93,0.8Z",
        "name": "Greenland"
      },
      "GH": {
        "path": "M420.53,257.51l-0.01,0.72l0.96,1.2l0.24,3.73l0.59,0.95l-0.51,2.1l0.19,1.41l1.02,2.21l-6.97,2.84l-1.8,-0.57l0.04,-0.89l-1.02,-2.04l0.61,-2.65l1.07,-2.32l-0.96,-6.47l5.01,0.07l0.94,-0.39l0.61,0.11Z",
        "name": "Ghana"
      },
      "OM": {
        "path": "M568.09,230.93l-0.91,1.67l-1.22,0.04l-0.6,0.76l-0.41,1.51l0.27,1.58l-1.16,0.05l-1.56,0.97l-0.76,1.74l-1.62,0.05l-0.98,0.65l-0.17,1.15l-0.89,0.52l-1.49,-0.18l-2.4,0.94l-2.47,-5.4l7.35,-2.71l1.67,-5.23l-1.12,-2.09l0.05,-0.83l0.67,-1.0l0.07,-1.05l0.9,-0.42l-0.05,-2.07l0.7,-0.01l1.0,1.62l1.51,1.08l3.3,0.84l1.73,2.29l0.81,0.37l-1.23,2.35l-0.99,0.79Z",
        "name": "Oman"
      },
      "TN": {
        "path": "M448.1,188.24l-1.0,1.27l-0.02,1.32l0.84,0.88l-0.28,2.09l-1.53,1.32l-0.12,0.42l0.48,1.54l1.42,0.32l0.53,1.11l0.9,0.52l-0.11,1.67l-3.54,2.64l-0.1,2.38l-0.58,0.3l-0.96,-4.45l-1.54,-1.25l-0.16,-0.78l-1.92,-1.56l-0.18,-1.76l1.51,-1.62l0.59,-2.34l-0.38,-2.78l0.42,-1.21l2.45,-1.05l1.29,0.26l-0.06,1.11l0.58,0.38l1.47,-0.73Z",
        "name": "Tunisia"
      },
      "JO": {
        "path": "M518.64,201.38l-5.14,1.56l-0.19,0.65l2.16,2.39l-0.89,1.14l-1.71,0.34l-1.71,1.8l-2.34,-0.37l1.21,-4.32l0.56,-4.07l2.8,0.94l4.46,-2.71l0.79,2.66Z",
        "name": "Jordan"
      },
      "HR": {
        "path": "M455.59,162.84l1.09,0.07l-0.82,0.94l-0.27,-1.01ZM456.96,162.92l0.62,-0.41l1.73,0.45l0.42,-0.4l-0.01,-0.59l0.86,-0.52l0.2,-1.05l1.63,-0.68l2.57,1.68l2.07,0.6l0.87,-0.31l1.05,1.57l-0.52,0.63l-1.05,-0.56l-1.68,0.04l-2.1,-0.5l-1.29,0.06l-0.57,0.49l-0.59,-0.47l-0.62,0.16l-0.46,1.7l1.79,2.42l2.79,2.75l-1.18,-0.87l-2.21,-0.87l-1.67,-1.78l0.13,-0.63l-1.05,-1.19l-0.32,-1.27l-1.42,-0.43Z",
        "name": "Croatia"
      },
      "HT": {
        "path": "M237.05,238.38l-1.16,0.43l-0.91,-0.55l0.05,-0.2l2.02,0.31ZM237.53,238.43l1.06,0.12l-0.05,0.01l-1.01,-0.12ZM239.25,238.45l0.79,-0.51l0.06,-0.62l-1.02,-1.0l0.02,-0.82l-0.3,-0.4l-0.93,-0.32l3.16,0.45l0.02,1.84l-0.48,0.34l-0.08,0.58l0.54,0.72l-1.78,-0.26Z",
        "name": "Haiti"
      },
      "HU": {
        "path": "M462.08,157.89l0.65,-1.59l-0.09,-0.44l0.64,-0.0l0.39,-0.34l0.1,-0.69l1.75,0.87l2.32,-0.37l0.43,-0.66l3.49,-0.78l0.69,-0.78l0.57,-0.14l2.57,0.93l0.67,-0.23l1.03,0.65l0.08,0.37l-1.42,0.71l-2.59,4.14l-1.8,0.53l-1.68,-0.1l-2.74,1.23l-1.85,-0.54l-2.54,-1.66l-0.66,-1.1Z",
        "name": "Hungary"
      },
      "HN": {
        "path": "M199.6,249.52l-1.7,-1.21l0.06,-0.94l3.04,-2.14l2.37,0.28l1.27,-0.09l1.1,-0.52l1.3,0.28l1.14,-0.25l1.38,0.37l2.23,1.37l-2.36,0.93l-1.23,-0.39l-0.88,1.3l-1.28,0.99l-0.98,-0.22l-0.42,0.52l-0.96,0.05l-0.36,0.41l0.04,0.88l-0.52,0.6l-0.3,0.04l-0.3,-0.55l-0.66,-0.31l0.11,-0.67l-0.48,-0.65l-0.87,-0.26l-0.73,0.2Z",
        "name": "Honduras"
      },
      "PR": {"path": "M256.17,238.73l-0.26,0.27l-2.83,0.05l-0.07,-0.55l1.95,-0.1l1.22,0.33Z", "name": "Puerto Rico"},
      "PS": {
        "path": "M509.21,203.07l0.1,-0.06l-0.02,0.03l-0.09,0.03ZM509.36,202.91l-0.02,-0.63l-0.33,-0.16l0.31,-1.09l0.24,0.1l-0.2,1.78Z",
        "name": "Palestine"
      },
      "PT": {
        "path": "M401.84,187.38l-0.64,0.47l-1.13,-0.35l-0.91,0.17l0.28,-1.78l-0.24,-1.78l-1.25,-0.56l-0.45,-0.84l0.17,-1.66l1.01,-1.18l0.69,-2.92l-0.04,-1.39l-0.59,-1.9l1.3,-0.85l0.84,1.35l3.1,-0.3l0.46,0.99l-1.05,0.94l-0.03,2.16l-0.41,0.57l-0.08,1.1l-0.79,0.18l-0.26,0.59l0.91,1.6l-0.63,1.75l0.76,1.09l-1.1,1.52l0.07,1.05Z",
        "name": "Portugal"
      },
      "PY": {
        "path": "M274.9,336.12l0.74,1.52l-0.16,3.45l0.32,0.41l2.64,0.5l1.11,-0.47l1.4,0.59l0.36,0.6l0.53,3.42l1.27,0.4l0.98,-0.38l0.51,0.27l-0.0,1.18l-1.21,5.32l-2.09,1.9l-1.8,0.4l-4.71,-0.98l2.2,-3.63l-0.32,-1.5l-2.78,-1.28l-3.03,-1.94l-2.07,-0.44l-4.34,-4.06l0.91,-2.9l0.08,-1.42l1.07,-2.04l4.13,-0.72l2.18,0.03l2.05,1.17l0.03,0.59Z",
        "name": "Paraguay"
      },
      "PA": {
        "path": "M213.8,263.68l0.26,-1.52l-0.36,-0.26l-0.01,-0.49l0.44,-0.1l0.93,1.4l1.26,0.03l0.77,0.49l1.38,-0.23l2.51,-1.11l0.86,-0.72l3.45,0.85l1.4,1.18l0.41,1.74l-0.21,0.34l-0.53,-0.12l-0.47,0.29l-0.16,0.6l-0.68,-1.28l0.45,-0.49l-0.19,-0.66l-0.47,-0.13l-0.54,-0.84l-1.5,-0.75l-1.1,0.16l-0.75,0.99l-1.62,0.84l-0.18,0.96l0.85,0.97l-0.58,0.45l-0.69,0.08l-0.34,-1.18l-1.27,0.03l-0.71,-1.05l-2.59,-0.46Z",
        "name": "Panama"
      },
      "PG": {
        "path": "M808.58,298.86l2.54,2.56l-0.13,0.26l-0.33,0.12l-0.87,-0.78l-1.22,-2.16ZM801.41,293.04l0.5,0.29l0.26,0.27l-0.49,-0.35l-0.27,-0.21ZM803.17,294.58l0.59,0.5l0.08,1.06l-0.29,-0.91l-0.38,-0.65ZM796.68,298.41l0.52,0.75l1.43,-0.19l2.27,-1.81l-0.01,-1.43l1.12,0.16l-0.04,1.1l-0.7,1.28l-1.12,0.18l-0.62,0.79l-2.46,1.11l-1.17,-0.0l-3.08,-1.25l3.41,0.0l0.45,-0.68ZM789.15,303.55l2.31,1.8l1.59,2.61l1.34,0.13l-0.06,0.66l0.31,0.43l1.06,0.24l0.06,0.65l2.25,1.05l-1.22,0.13l-0.72,-0.63l-4.56,-0.65l-3.22,-2.87l-1.49,-2.34l-3.27,-1.1l-2.38,0.72l-1.59,0.86l-0.2,0.42l0.27,1.55l-1.55,0.68l-1.36,-0.4l-2.21,-0.09l-0.08,-15.41l8.39,2.93l2.95,2.4l0.6,1.64l4.02,1.49l0.31,0.68l-1.76,0.21l-0.33,0.52l0.55,1.68Z",
        "name": "Papua New Guinea"
      },
      "PE": {
        "path": "M244.96,295.21l-1.26,-0.07l-0.57,0.42l-1.93,0.45l-2.98,1.75l-0.36,1.36l-0.58,0.8l0.12,1.37l-1.24,0.59l-0.22,1.22l-0.62,0.84l1.04,2.27l1.28,1.44l-0.41,0.84l0.32,0.57l1.48,0.13l1.16,1.37l2.21,0.07l1.63,-1.08l-0.13,3.02l0.3,0.4l1.14,0.29l1.31,-0.34l1.9,3.59l-0.48,0.85l-0.17,3.85l-0.94,1.59l0.35,0.75l-0.47,1.07l0.98,1.97l-2.1,3.82l-0.98,0.5l-2.17,-1.28l-0.39,-1.16l-4.95,-2.58l-4.46,-2.79l-1.84,-1.51l-0.91,-1.84l0.3,-0.96l-2.11,-3.33l-4.82,-9.68l-1.04,-1.2l-0.87,-1.94l-3.4,-2.48l0.58,-1.18l-1.13,-2.23l0.66,-1.49l1.45,-1.15l-0.6,0.98l0.07,0.92l0.47,0.36l1.74,0.03l0.97,1.17l0.54,0.07l1.42,-1.03l0.6,-1.84l1.42,-2.02l3.04,-1.04l2.73,-2.62l0.86,-1.74l-0.1,-1.87l1.44,1.02l0.9,1.25l1.06,0.59l1.7,2.73l1.86,0.31l1.45,-0.61l0.96,0.39l1.36,-0.19l1.45,0.89l-1.4,2.21l0.31,0.61l0.59,0.05l0.47,0.5Z",
        "name": "Peru"
      },
      "PK": {
        "path": "M615.09,192.34l-1.83,1.81l-2.6,0.39l-3.73,-0.68l-1.58,1.33l-0.09,0.42l1.77,4.39l1.7,1.23l-1.69,1.27l-0.12,2.14l-2.33,2.64l-1.6,2.8l-2.46,2.67l-3.03,-0.07l-2.76,2.83l0.05,0.6l1.5,1.11l0.26,1.9l1.44,1.5l0.37,1.68l-5.01,-0.01l-1.78,1.7l-1.42,-0.52l-0.76,-1.87l-2.27,-2.15l-11.61,0.86l0.71,-2.34l3.43,-1.32l0.25,-0.44l-0.21,-1.24l-1.2,-0.65l-0.28,-2.46l-2.29,-1.14l-1.28,-1.94l2.82,0.94l2.62,-0.38l1.42,0.33l0.76,-0.56l1.71,0.19l3.25,-1.14l0.27,-0.36l0.08,-2.19l1.18,-1.32l1.68,0.0l0.58,-0.82l1.6,-0.3l1.19,0.16l0.98,-0.78l0.02,-1.88l0.93,-1.47l1.48,-0.66l0.19,-0.55l-0.66,-1.25l2.04,-0.11l0.69,-1.01l-0.02,-1.16l1.11,-1.06l-0.17,-1.78l-0.49,-1.03l1.15,-0.98l5.42,-0.91l2.6,-0.82l1.6,1.16l0.97,2.34l3.45,0.97Z",
        "name": "Pakistan"
      },
      "PH": {
        "path": "M737.01,263.84l0.39,2.97l-0.44,1.18l-0.55,-1.53l-0.67,-0.14l-1.17,1.28l0.65,2.09l-0.42,0.69l-2.48,-1.23l-0.57,-1.49l0.65,-1.03l-0.1,-0.54l-1.59,-1.19l-0.56,0.08l-0.65,0.87l-1.23,0.0l-1.58,0.97l0.83,-1.8l2.56,-1.42l0.65,0.84l0.45,0.13l1.9,-0.69l0.56,-1.11l1.5,-0.06l0.38,-0.43l-0.09,-1.19l1.21,0.71l0.36,2.02ZM733.59,256.58l0.05,0.75l0.08,0.26l-0.8,-0.42l-0.18,-0.71l0.85,0.12ZM734.08,256.1l-0.12,-1.12l-1.0,-1.27l1.36,0.03l0.53,0.73l0.51,2.04l-1.27,-0.4ZM733.76,257.68l0.38,0.98l-0.32,0.15l-0.07,-1.13ZM724.65,238.43l1.46,0.7l0.72,-0.31l-0.32,1.17l0.79,1.71l-0.57,1.84l-1.53,1.04l-0.39,2.25l0.56,2.04l1.63,0.57l1.16,-0.27l2.71,1.23l-0.19,1.08l0.76,0.84l-0.08,0.36l-1.4,-0.9l-0.88,-1.27l-0.66,0.0l-0.38,0.55l-1.6,-1.31l-2.15,0.36l-0.87,-0.39l0.07,-0.61l0.66,-0.55l-0.01,-0.62l-0.75,-0.59l-0.72,0.44l-0.74,-0.87l-0.39,-2.49l0.32,0.27l0.66,-0.28l0.26,-3.97l0.7,-2.02l1.14,0.0ZM731.03,258.87l-0.88,0.85l-1.19,1.94l-1.05,-1.19l0.93,-1.1l0.32,-1.47l0.52,-0.06l-0.27,1.15l0.22,0.45l0.49,-0.12l1.0,-1.32l-0.08,0.85ZM726.83,255.78l0.83,0.38l1.17,-0.0l-0.02,0.48l-2.0,1.4l0.03,-2.26ZM724.81,252.09l-0.38,1.27l-1.42,-1.95l1.2,0.05l0.6,0.63ZM716.55,261.82l1.1,-0.95l0.03,-0.03l-0.28,0.36l-0.85,0.61ZM719.22,259.06l0.04,-0.06l0.8,-1.53l0.16,0.75l-1.0,0.84Z",
        "name": "Philippines"
      },
      "PL": {
        "path": "M468.44,149.42l-1.11,-1.54l-1.86,-0.33l-0.48,-1.05l-1.72,-0.37l-0.65,0.69l-0.72,-0.36l0.11,-0.61l-0.33,-0.46l-1.75,-0.27l-1.04,-0.93l-0.94,-1.94l0.16,-1.22l-0.62,-1.8l-0.78,-1.07l0.57,-1.04l-0.48,-1.43l1.41,-0.83l6.91,-2.71l2.14,0.5l0.52,0.91l5.51,0.44l4.55,-0.05l1.07,0.31l0.48,0.84l0.15,1.58l0.65,1.2l-0.01,0.99l-1.27,0.58l-0.19,0.54l0.73,1.48l0.08,1.55l1.2,2.76l-0.17,0.58l-1.23,0.44l-2.27,2.72l0.18,0.95l-1.97,-1.03l-1.98,0.4l-1.36,-0.28l-1.24,0.58l-1.07,-0.97l-1.16,0.24Z",
        "name": "Poland"
      },
      "ZM": {
        "path": "M481.47,313.3l0.39,0.31l2.52,0.14l0.99,1.17l2.01,0.35l1.4,-0.64l0.69,1.17l1.78,0.33l1.84,2.35l2.23,0.18l0.4,-0.43l-0.21,-2.74l-0.62,-0.3l-0.48,0.32l-1.98,-1.17l0.72,-5.29l-0.51,-1.18l0.57,-1.3l3.68,-0.62l0.26,0.63l1.21,0.63l0.9,-0.22l2.16,0.67l1.33,0.71l1.07,1.02l0.56,1.87l-0.88,2.7l0.43,2.09l-0.73,0.87l-0.76,2.37l0.59,0.68l-6.6,1.83l-0.29,0.44l0.19,1.45l-1.68,0.35l-1.43,1.02l-0.38,0.87l-0.87,0.26l-3.48,3.69l-4.16,-0.53l-1.52,-1.0l-1.77,-0.13l-1.83,0.52l-3.04,-3.4l0.11,-7.59l4.82,0.03l0.39,-0.49l-0.18,-0.76l0.33,-0.83l-0.4,-1.36l0.24,-1.05Z",
        "name": "Zambia"
      },
      "EH": {
        "path": "M384.42,230.28l0.25,-0.79l1.06,-1.29l0.8,-3.51l3.38,-2.78l0.7,-1.81l0.06,4.84l-1.98,0.2l-0.94,1.59l0.39,3.56l-3.7,-0.01ZM392.01,218.1l0.7,-1.8l1.77,-0.24l2.09,0.34l0.95,-0.62l1.28,-0.07l-0.0,2.51l-6.79,-0.12Z",
        "name": "W. Sahara"
      },
      "EE": {
        "path": "M485.71,115.04l2.64,0.6l2.56,0.11l-1.6,1.91l0.61,3.54l-0.81,0.87l-1.78,-0.01l-3.22,-1.76l-1.8,0.45l0.21,-1.53l-0.58,-0.41l-0.69,0.34l-1.26,-1.03l-0.17,-1.63l2.83,-0.92l3.05,-0.52Z",
        "name": "Estonia"
      },
      "EG": {
        "path": "M492.06,205.03l1.46,0.42l2.95,-1.64l2.04,-0.21l1.53,0.3l0.59,1.19l0.69,0.04l0.41,-0.64l1.81,0.58l1.95,0.16l1.04,-0.51l1.42,4.08l-2.03,4.54l-1.66,-1.77l-1.76,-3.85l-0.64,-0.12l-0.36,0.67l1.04,2.88l3.44,6.95l1.78,3.04l2.03,2.65l-0.36,0.53l0.23,2.01l2.7,2.19l-28.41,0.0l0.0,-18.96l-0.73,-2.2l0.59,-1.56l-0.32,-1.26l0.68,-0.99l3.06,-0.04l4.82,1.52Z",
        "name": "Egypt"
      },
      "ZA": {
        "path": "M467.14,373.21l-0.13,-1.96l-0.68,-1.56l0.7,-0.68l-0.13,-2.33l-4.56,-8.19l0.77,-0.86l0.6,0.45l0.69,1.31l2.83,0.72l1.5,-0.26l2.24,-1.39l0.19,-9.55l1.35,2.3l-0.21,1.5l0.61,1.2l0.4,0.19l1.79,-0.27l2.6,-2.07l0.69,-1.32l0.96,-0.48l2.19,1.04l2.04,0.13l1.77,-0.65l0.85,-2.12l1.38,-0.33l1.59,-2.76l2.15,-1.89l3.41,-1.87l2.0,0.45l1.02,-0.28l0.99,0.2l1.75,5.29l-0.38,3.25l-0.81,-0.23l-1.0,0.46l-0.87,1.68l-0.05,1.16l1.97,1.84l1.47,-0.29l0.69,-1.18l1.09,0.01l-0.76,3.69l-0.58,1.09l-2.2,1.79l-3.17,4.76l-2.8,2.83l-3.57,2.88l-2.53,1.05l-1.22,0.14l-0.51,0.7l-1.18,-0.32l-1.39,0.5l-2.59,-0.52l-1.61,0.33l-1.18,-0.11l-2.55,1.1l-2.1,0.44l-1.6,1.07l-0.85,0.05l-0.93,-0.89l-0.93,-0.15l-0.97,-1.13l-0.25,0.05ZM491.45,364.19l0.62,-0.93l1.48,-0.59l1.18,-2.19l-0.07,-0.49l-1.99,-1.69l-1.66,0.56l-1.43,1.14l-1.34,1.73l0.02,0.51l1.88,2.11l1.31,-0.16Z",
        "name": "South Africa"
      },
      "EC": {
        "path": "M231.86,285.53l0.29,1.59l-0.69,1.45l-2.61,2.51l-3.13,1.11l-1.53,2.18l-0.49,1.68l-1.0,0.73l-1.02,-1.11l-1.78,-0.16l0.67,-1.15l-0.24,-0.86l1.25,-2.13l-0.54,-1.09l-0.67,-0.08l-0.72,0.87l-0.87,-0.64l0.35,-0.69l-0.36,-1.96l0.81,-0.51l0.45,-1.51l0.92,-1.57l-0.07,-0.97l2.65,-1.33l2.75,1.35l0.77,1.05l2.12,0.35l0.76,-0.32l1.96,1.21Z",
        "name": "Ecuador"
      },
      "IT": {
        "path": "M451.59,158.63l3.48,0.94l-0.21,1.17l0.3,0.83l-1.49,-0.24l-2.04,1.1l-0.21,0.39l0.13,1.45l-0.25,1.12l0.82,1.57l2.39,1.63l1.31,2.54l2.79,2.43l2.05,0.08l0.21,0.23l-0.39,0.33l0.09,0.67l4.05,1.97l2.17,1.76l-0.16,0.36l-1.17,-1.08l-2.18,-0.49l-0.44,0.2l-1.05,1.91l0.14,0.54l1.57,0.95l-0.19,0.98l-1.06,0.33l-1.25,2.34l-0.37,0.08l0.0,-0.33l1.0,-2.45l-1.73,-3.17l-1.12,-0.51l-0.88,-1.33l-1.51,-0.51l-1.27,-1.25l-1.75,-0.18l-4.12,-3.21l-1.62,-1.65l-1.03,-3.19l-3.53,-1.36l-1.3,0.51l-1.69,1.41l0.16,-0.72l-0.28,-0.47l-1.14,-0.33l-0.53,-1.96l0.72,-0.78l0.04,-0.48l-0.65,-1.17l0.8,0.39l1.4,-0.23l1.11,-0.84l0.52,0.35l1.19,-0.1l0.75,-1.2l1.53,0.33l1.36,-0.56l0.35,-1.14l1.08,0.32l0.68,-0.64l1.98,-0.44l0.42,0.82ZM459.19,184.75l-0.65,1.65l0.32,1.05l-0.31,0.89l-1.5,-0.85l-4.5,-1.67l0.19,-0.82l2.67,0.23l3.78,-0.48ZM443.93,176.05l1.18,1.66l-0.3,3.32l-1.06,-0.01l-0.77,0.73l-0.53,-0.44l-0.1,-3.37l-0.39,-1.22l1.04,0.01l0.92,-0.68Z",
        "name": "Italy"
      },
      "VN": {
        "path": "M690.56,230.25l-2.7,1.82l-2.09,2.46l-0.63,1.95l4.31,6.45l2.32,1.65l1.43,1.94l1.11,4.59l-0.32,4.24l-1.93,1.54l-2.84,1.61l-2.11,2.15l-2.73,2.06l-0.59,-1.05l0.63,-1.53l-0.13,-0.47l-1.34,-1.04l1.51,-0.71l2.55,-0.18l0.3,-0.63l-0.82,-1.14l4.0,-2.07l0.31,-3.05l-0.57,-1.77l0.42,-2.66l-0.73,-1.97l-1.86,-1.76l-3.63,-5.29l-2.72,-1.46l0.36,-0.47l1.5,-0.64l0.21,-0.52l-0.97,-2.27l-0.37,-0.24l-2.83,-0.02l-2.24,-3.9l0.83,-0.4l4.39,-0.29l2.06,-1.31l1.15,0.89l1.88,0.4l-0.17,1.51l1.35,1.16l1.67,0.45Z",
        "name": "Vietnam"
      },
      "SB": {
        "path": "M826.69,311.6l-0.61,0.09l-0.2,-0.33l0.37,0.15l0.44,0.09ZM824.18,307.38l-0.26,-0.3l-0.31,-0.91l0.03,0.0l0.54,1.21ZM823.04,309.33l-1.66,-0.22l-0.2,-0.52l1.16,0.28l0.69,0.46ZM819.28,304.68l1.14,0.65l0.02,0.03l-0.81,-0.44l-0.35,-0.23Z",
        "name": "Solomon Is."
      },
      "ET": {
        "path": "M516.04,247.79l1.1,0.84l1.63,-0.45l0.68,0.47l1.63,0.03l2.01,0.94l1.73,1.66l1.64,2.07l-1.52,2.04l0.16,1.72l0.39,0.38l2.05,0.0l-0.36,1.03l2.86,3.58l8.32,3.08l1.31,0.02l-6.32,6.75l-3.1,0.11l-2.36,1.77l-1.47,0.04l-0.86,0.79l-1.38,-0.0l-1.32,-0.81l-2.29,1.05l-0.76,0.98l-3.29,-0.41l-3.07,-2.07l-1.8,-0.07l-0.62,-0.6l0.0,-1.24l-0.28,-0.38l-1.15,-0.37l-1.4,-2.59l-1.19,-0.68l-0.47,-1.0l-1.27,-1.23l-1.16,-0.22l0.43,-0.72l1.45,-0.28l0.41,-0.95l-0.03,-2.21l0.68,-2.44l1.05,-0.63l1.43,-3.06l1.57,-1.37l1.02,-2.51l0.35,-1.88l2.52,0.46l0.44,-0.24l0.58,-1.43Z",
        "name": "Ethiopia"
      },
      "SO": {
        "path": "M525.13,288.48l-1.13,-1.57l-0.03,-8.86l2.66,-3.38l1.67,-0.13l2.13,-1.69l3.41,-0.23l7.08,-7.55l2.91,-3.69l0.08,-4.82l2.98,-0.67l1.24,-0.86l0.45,-0.0l-0.2,3.0l-1.21,3.62l-2.73,5.97l-2.13,3.65l-5.03,6.16l-8.56,6.4l-2.78,3.08l-0.8,1.56Z",
        "name": "Somalia"
      },
      "ZW": {
        "path": "M498.91,341.09l-1.11,-0.22l-0.92,0.28l-2.09,-0.44l-1.5,-1.11l-1.89,-0.43l-0.62,-1.4l-0.01,-0.84l-0.3,-0.38l-0.97,-0.25l-2.71,-2.74l-1.92,-3.32l3.83,0.45l3.73,-3.82l1.08,-0.44l0.26,-0.77l1.25,-0.9l1.41,-0.26l0.5,0.89l1.99,-0.05l1.72,1.17l1.11,0.17l1.05,0.66l0.01,2.99l-0.59,3.76l0.38,0.86l-0.23,1.23l-0.39,0.35l-0.63,1.81l-2.43,2.75Z",
        "name": "Zimbabwe"
      },
      "ES": {
        "path": "M416.0,169.21l1.07,1.17l4.61,1.38l1.06,-0.57l2.6,1.26l2.71,-0.3l0.09,1.12l-2.14,1.8l-3.11,0.61l-0.31,0.31l-0.2,0.89l-1.54,1.69l-0.97,2.4l0.84,1.74l-1.32,1.27l-0.48,1.68l-1.88,0.65l-1.66,2.07l-5.36,-0.01l-1.79,1.08l-0.89,0.98l-0.88,-0.17l-0.79,-0.82l-0.68,-1.59l-2.37,-0.63l-0.11,-0.5l1.21,-1.82l-0.77,-1.13l0.61,-1.68l-0.76,-1.62l0.87,-0.49l0.09,-1.25l0.42,-0.6l0.03,-2.11l0.99,-0.69l0.13,-0.5l-1.03,-1.73l-1.46,-0.11l-0.61,0.38l-1.06,0.0l-0.52,-1.23l-0.53,-0.21l-1.32,0.67l-0.01,-1.49l-0.75,-0.96l3.03,-1.88l2.99,0.53l3.32,-0.02l2.63,0.51l6.01,-0.06Z",
        "name": "Spain"
      },
      "ER": {
        "path": "M520.38,246.23l3.42,2.43l3.5,3.77l0.84,0.54l-0.95,-0.01l-3.51,-3.89l-2.33,-1.15l-1.73,-0.07l-0.91,-0.51l-1.26,0.51l-1.34,-1.02l-0.61,0.17l-0.66,1.61l-2.35,-0.43l-0.17,-0.67l1.29,-5.29l0.61,-0.61l1.95,-0.53l0.87,-1.01l1.17,2.41l0.68,2.33l1.49,1.43Z",
        "name": "Eritrea"
      },
      "ME": {
        "path": "M468.91,172.53l-1.22,-1.02l0.47,-1.81l0.89,-0.72l2.26,1.51l-0.5,0.57l-0.75,-0.27l-1.14,1.73Z",
        "name": "Montenegro"
      },
      "MD": {
        "path": "M488.41,153.73l1.4,-0.27l1.72,0.93l1.07,0.15l0.85,0.65l-0.14,0.84l0.96,0.85l1.12,2.47l-1.15,-0.07l-0.66,-0.41l-0.52,0.25l-0.09,0.86l-1.08,1.89l-0.27,-0.86l0.25,-1.34l-0.16,-1.6l-3.29,-4.34Z",
        "name": "Moldova"
      },
      "MG": {
        "path": "M545.91,319.14l0.4,3.03l0.62,1.21l-0.21,1.02l-0.57,-0.8l-0.69,-0.01l-0.47,0.76l0.41,2.12l-0.18,0.87l-0.73,0.78l-0.15,2.14l-4.71,15.2l-1.06,2.88l-3.92,1.64l-3.12,-1.49l-0.6,-1.21l-0.19,-2.4l-0.86,-2.05l-0.21,-1.77l0.38,-1.62l1.21,-0.75l0.01,-0.76l1.19,-2.04l0.23,-1.66l-1.06,-2.99l-0.19,-2.21l0.81,-1.33l0.32,-1.46l4.63,-1.22l3.44,-3.0l0.85,-1.4l-0.08,-0.7l0.78,-0.04l1.38,-1.77l0.13,-1.64l0.45,-0.61l1.16,1.69l0.59,1.6Z",
        "name": "Madagascar"
      },
      "MA": {
        "path": "M378.78,230.02l0.06,-0.59l0.92,-0.73l0.82,-1.37l-0.09,-1.04l0.79,-1.7l1.31,-1.58l0.96,-0.59l0.66,-1.55l0.09,-1.47l0.81,-1.48l1.72,-1.07l1.55,-2.69l1.16,-0.96l2.44,-0.39l1.94,-1.82l1.31,-0.78l2.09,-2.28l-0.51,-3.65l1.24,-3.7l1.5,-1.75l4.46,-2.57l2.37,-4.47l1.44,0.01l1.68,1.21l2.32,-0.19l3.47,0.65l0.8,1.54l0.16,1.71l0.86,2.96l0.56,0.59l-0.26,0.61l-3.05,0.44l-1.26,1.05l-1.33,0.22l-0.33,0.37l-0.09,1.78l-2.68,1.0l-1.07,1.42l-4.47,1.13l-4.04,2.01l-0.54,4.64l-1.15,0.06l-0.92,0.61l-1.96,-0.35l-2.42,0.54l-0.74,1.9l-0.86,0.4l-1.14,3.26l-3.53,3.01l-0.8,3.55l-0.96,1.1l-0.29,0.82l-4.95,0.18Z",
        "name": "Morocco"
      },
      "UZ": {
        "path": "M598.64,172.75l-1.63,1.52l0.06,0.64l1.85,1.12l1.97,-0.64l2.21,1.17l-2.52,1.68l-2.59,-0.22l-0.18,-0.41l0.46,-1.23l-0.45,-0.53l-3.35,0.69l-2.1,3.51l-1.87,-0.12l-1.03,1.51l0.22,0.55l1.64,0.62l0.46,1.83l-1.19,2.49l-2.66,-0.53l0.05,-1.36l-0.26,-0.39l-3.3,-1.23l-2.56,-1.4l-4.4,-3.34l-1.34,-3.14l-1.08,-0.6l-2.58,0.13l-0.69,-0.44l-0.47,-2.52l-3.37,-1.6l-0.43,0.05l-2.07,1.72l-2.1,1.01l-0.21,0.47l0.28,1.01l-1.91,0.03l-0.09,-10.5l5.99,-1.7l6.19,3.54l2.71,2.84l7.05,-0.67l2.71,2.01l-0.17,2.81l0.39,0.42l0.9,0.02l0.44,2.14l0.38,0.32l2.94,0.09l0.95,1.42l1.28,-0.24l1.05,-2.04l4.43,-2.5Z",
        "name": "Uzbekistan"
      },
      "MM": {
        "path": "M673.9,230.21l-1.97,1.57l-0.57,0.96l-1.4,0.6l-1.36,1.05l-1.99,0.36l-1.08,2.66l-0.91,0.4l-0.19,0.55l1.21,2.27l2.52,3.43l-0.79,1.91l-0.74,0.41l-0.17,0.52l0.65,1.37l1.61,1.95l0.25,2.58l0.9,2.13l-1.92,3.57l0.68,-2.25l-0.81,-1.74l0.19,-2.65l-1.05,-1.53l-1.24,-6.17l-1.12,-2.26l-0.6,-0.13l-4.34,3.02l-2.39,-0.65l0.77,-2.84l-0.52,-2.61l-1.91,-2.96l0.25,-0.75l-0.29,-0.51l-1.33,-0.3l-1.61,-1.93l-0.1,-1.3l0.82,-0.24l0.04,-1.64l1.02,-0.52l0.21,-0.45l-0.23,-0.95l0.54,-0.96l0.08,-2.22l1.46,0.45l0.47,-0.2l1.12,-2.19l0.16,-1.35l1.33,-2.16l-0.0,-1.52l2.89,-1.66l1.63,0.44l0.5,-0.44l-0.17,-1.4l0.64,-0.36l0.08,-1.04l0.77,-0.11l0.71,1.35l1.06,0.69l-0.03,3.86l-2.38,2.37l-0.3,3.15l0.46,0.43l2.28,-0.38l0.51,2.08l1.47,0.67l-0.6,1.8l0.19,0.48l2.97,1.48l1.64,-0.55l0.02,0.32Z",
        "name": "Myanmar"
      },
      "ML": {
        "path": "M392.61,254.08l-0.19,-2.37l-0.99,-0.87l-0.44,-1.3l-0.09,-1.28l0.81,-0.58l0.35,-1.24l2.37,0.65l1.31,-0.47l0.86,0.15l0.66,-0.56l9.83,-0.04l0.38,-0.28l0.56,-1.8l-0.44,-0.65l-2.35,-21.95l3.27,-0.04l16.7,11.38l0.74,1.31l2.5,1.09l0.02,1.38l0.44,0.39l2.34,-0.21l0.01,5.38l-1.28,1.61l-0.26,1.49l-5.31,0.57l-1.07,0.92l-2.9,0.1l-0.86,-0.48l-1.38,0.36l-2.4,1.08l-0.6,0.87l-1.85,1.09l-0.43,0.7l-0.79,0.39l-1.44,-0.21l-0.81,0.84l-0.34,1.64l-1.91,2.02l-0.06,1.03l-0.67,1.22l0.13,1.16l-0.97,0.39l-0.23,-0.64l-0.52,-0.24l-1.35,0.4l-0.34,0.55l-2.69,-0.28l-0.37,-0.35l-0.02,-0.9l-0.65,-0.35l0.45,-0.64l-0.03,-0.53l-2.12,-2.44l-0.76,-0.01l-2.0,1.16l-0.78,-0.15l-0.8,-0.67l-1.21,0.23Z",
        "name": "Mali"
      },
      "MN": {
        "path": "M676.61,146.48l3.81,1.68l5.67,-1.0l2.37,0.41l2.34,1.5l1.79,1.75l2.29,-0.03l3.12,0.52l2.47,-0.81l3.41,-0.59l3.53,-2.21l1.25,0.29l1.53,1.13l2.27,-0.21l-2.66,5.01l0.64,1.68l0.47,0.21l1.32,-0.38l2.38,0.48l2.02,-1.11l1.76,0.89l2.06,2.02l-0.13,0.53l-1.72,-0.29l-3.77,0.46l-1.88,0.99l-1.76,1.99l-3.71,1.17l-2.45,1.6l-3.83,-0.87l-0.41,0.17l-1.31,1.99l1.04,2.24l-1.52,0.9l-1.74,1.57l-2.79,1.02l-3.78,0.13l-4.05,1.05l-2.77,1.52l-1.16,-0.85l-2.94,0.0l-3.62,-1.79l-2.58,-0.49l-3.4,0.41l-5.12,-0.67l-2.63,0.06l-1.31,-1.6l-1.4,-3.0l-1.48,-0.33l-3.13,-1.94l-6.16,-0.93l-0.71,-1.06l0.86,-3.82l-1.93,-2.71l-3.5,-1.18l-1.95,-1.58l-0.5,-1.72l2.34,-0.52l4.75,-2.8l3.62,-1.47l2.18,0.97l2.46,0.05l1.81,1.53l2.46,0.12l3.95,0.71l2.43,-2.28l0.08,-0.48l-0.9,-1.72l2.24,-2.98l2.62,1.27l4.94,1.17l0.43,2.24Z",
        "name": "Mongolia"
      },
      "MK": {
        "path": "M472.8,173.98l0.49,-0.71l3.57,-0.71l1.0,0.77l0.13,1.45l-0.65,0.53l-1.15,-0.05l-1.12,0.67l-1.39,0.22l-0.79,-0.55l-0.29,-1.03l0.19,-0.6Z",
        "name": "Macedonia"
      },
      "MW": {
        "path": "M505.5,309.31l0.85,1.95l0.15,2.86l-0.69,1.65l0.71,1.8l0.06,1.28l0.49,0.64l0.07,1.06l0.4,0.55l0.8,-0.23l0.55,0.61l0.69,-0.21l0.34,0.6l0.19,2.94l-1.04,0.62l-0.54,1.25l-1.11,-1.08l-0.16,-1.56l0.51,-1.31l-0.32,-1.3l-0.99,-0.65l-0.82,0.12l-2.36,-1.64l0.63,-1.96l0.82,-1.18l-0.46,-2.01l0.9,-2.86l-0.94,-2.51l0.96,0.18l0.29,0.4Z",
        "name": "Malawi"
      },
      "MR": {
        "path": "M407.36,220.66l-2.58,0.03l-0.39,0.44l2.42,22.56l0.36,0.43l-0.39,1.24l-9.75,0.04l-0.56,0.53l-0.91,-0.11l-1.27,0.45l-1.61,-0.66l-0.97,0.03l-0.36,0.29l-0.38,1.35l-0.42,0.23l-2.93,-3.4l-2.96,-1.52l-1.62,-0.03l-1.27,0.54l-1.12,-0.2l-0.65,0.4l-0.08,-0.49l0.68,-1.29l0.31,-2.43l-0.57,-3.91l0.23,-1.21l-0.69,-1.5l-1.15,-1.02l0.25,-0.39l9.58,0.02l0.4,-0.45l-0.46,-3.68l0.47,-1.04l2.12,-0.21l0.36,-0.4l-0.08,-6.4l7.81,0.13l0.41,-0.4l0.01,-3.31l7.76,5.35Z",
        "name": "Mauritania"
      },
      "UG": {
        "path": "M498.55,276.32l0.7,-0.46l1.65,0.5l1.96,-0.57l1.7,0.01l1.45,-0.98l0.91,1.33l1.33,3.95l-2.57,4.03l-1.46,-0.4l-2.54,0.91l-1.37,1.61l-0.01,0.81l-2.42,-0.01l-2.26,1.01l-0.17,-1.59l0.58,-1.04l0.14,-1.94l1.37,-2.28l1.78,-1.58l-0.17,-0.65l-0.72,-0.24l0.13,-2.43Z",
        "name": "Uganda"
      },
      "MY": {
        "path": "M717.47,273.46l-1.39,0.65l-2.12,-0.41l-2.88,-0.0l-0.38,0.28l-0.84,2.75l-0.99,0.96l-1.21,3.29l-1.73,0.45l-2.45,-0.68l-1.39,0.31l-1.33,1.15l-1.59,-0.14l-1.41,0.44l-1.44,-1.19l-0.18,-0.73l1.34,0.53l1.93,-0.47l0.75,-2.22l4.02,-1.03l2.75,-3.21l0.82,0.94l0.64,-0.05l0.4,-0.65l0.96,0.06l0.42,-0.36l0.24,-2.68l1.81,-1.64l1.21,-1.86l0.63,-0.01l1.07,1.05l0.34,1.28l3.44,1.35l-0.06,0.35l-1.37,0.1l-0.35,0.54l0.32,0.88ZM673.68,269.59l0.17,1.09l0.47,0.33l1.65,-0.3l0.87,-0.94l1.61,1.52l0.98,1.56l-0.12,2.81l0.41,2.29l0.95,0.9l0.88,2.44l-1.27,0.12l-5.1,-3.67l-0.34,-1.29l-1.37,-1.59l-0.33,-1.97l-0.88,-1.4l0.25,-1.68l-0.46,-1.05l1.63,0.84Z",
        "name": "Malaysia"
      },
      "MX": {
        "path": "M133.12,200.41l0.2,0.47l9.63,3.33l6.96,-0.02l0.4,-0.4l0.0,-0.74l3.77,0.0l3.55,2.93l1.39,2.83l1.52,1.04l2.08,0.82l0.47,-0.14l1.46,-2.0l1.73,-0.04l1.59,0.98l2.05,3.35l1.47,1.56l1.26,3.14l2.18,1.02l2.26,0.58l-1.18,3.72l-0.42,5.04l1.79,4.89l1.62,1.89l0.61,1.52l1.2,1.42l2.55,0.66l1.37,1.1l7.54,-1.89l1.86,-1.3l1.14,-4.3l4.1,-1.21l3.57,-0.11l0.32,0.3l-0.06,0.94l-1.26,1.45l-0.67,1.71l0.38,0.7l-0.72,2.27l-0.49,-0.3l-1.0,0.08l-1.0,1.39l-0.47,-0.11l-0.53,0.47l-4.26,-0.02l-0.4,0.4l-0.0,1.06l-1.1,0.26l0.1,0.44l1.82,1.44l0.56,0.91l-3.19,0.21l-1.21,2.09l0.24,0.72l-0.2,0.44l-2.24,-2.18l-1.45,-0.93l-2.22,-0.69l-1.52,0.22l-3.07,1.16l-10.55,-3.85l-2.86,-1.96l-3.78,-0.92l-1.08,-1.19l-2.62,-1.43l-1.18,-1.54l-0.38,-0.81l0.66,-0.63l-0.18,-0.53l0.52,-0.76l0.01,-0.91l-2.0,-3.82l-2.21,-2.63l-2.53,-2.09l-1.19,-1.62l-2.2,-1.17l-0.3,-0.43l0.34,-1.48l-0.21,-0.45l-1.23,-0.6l-1.36,-1.2l-0.59,-1.78l-1.54,-0.47l-2.44,-2.55l-0.16,-0.9l-1.33,-2.03l-0.84,-1.99l-0.16,-1.33l-1.81,-1.1l-0.97,0.05l-1.31,-0.7l-0.57,0.22l-0.4,1.12l0.72,3.77l3.51,3.89l0.28,0.78l0.53,0.26l0.41,1.43l1.33,1.73l1.58,1.41l0.8,2.39l1.43,2.41l0.13,1.32l0.37,0.36l1.04,0.08l1.67,2.28l-0.85,0.76l-0.66,-1.51l-1.68,-1.54l-2.91,-1.87l0.06,-1.82l-0.54,-1.68l-2.91,-2.03l-0.55,0.09l-1.95,-1.1l-0.88,-0.94l0.68,-0.08l0.93,-1.01l0.08,-1.78l-1.93,-1.94l-1.46,-0.77l-3.75,-7.56l4.88,-0.42Z",
        "name": "Mexico"
      },
      "IL": {
        "path": "M507.76,203.05l0.4,-0.78l0.18,0.4l-0.33,1.03l0.52,0.44l0.68,-0.22l-0.86,3.6l-1.16,-3.32l0.59,-0.74l-0.03,-0.41ZM508.73,200.34l0.37,-1.02l0.64,0.0l0.52,-0.51l-0.49,1.53l-0.56,-0.24l-0.48,0.23Z",
        "name": "Israel"
      },
      "FR": {
        "path": "M444.48,172.62l-0.64,1.78l-0.58,-0.31l-0.49,-1.72l0.4,-0.89l1.0,-0.72l0.3,1.85ZM429.64,147.1l1.78,1.58l1.46,-0.13l2.1,1.42l1.35,0.27l1.23,0.83l3.04,0.5l-1.03,1.85l-0.3,2.12l-0.41,0.32l-0.95,-0.24l-0.5,0.43l0.06,0.61l-1.81,1.92l-0.04,1.42l0.55,0.38l0.88,-0.36l0.61,0.97l-0.03,1.0l0.57,0.91l-0.75,1.09l0.65,2.39l1.27,0.57l-0.18,0.82l-2.01,1.53l-4.77,-0.8l-3.82,1.0l-0.53,1.85l-2.49,0.34l-2.71,-1.31l-1.16,0.57l-4.31,-1.29l-0.72,-0.86l1.19,-1.78l0.39,-6.45l-2.58,-3.3l-1.9,-1.66l-3.72,-1.23l-0.19,-1.72l2.81,-0.61l4.12,0.81l0.47,-0.48l-0.6,-2.77l1.94,0.95l5.83,-2.54l0.92,-2.74l1.6,-0.49l0.24,0.78l1.36,0.33l1.05,1.19ZM289.01,278.39l-0.81,0.8l-0.78,0.12l-0.5,-0.66l-0.56,-0.1l-0.91,0.6l-0.46,-0.22l1.09,-2.96l-0.96,-1.77l-0.17,-1.49l1.07,-1.77l2.32,0.75l2.51,2.01l0.3,0.74l-2.14,3.96Z",
        "name": "France"
      },
      "XS": {
        "path": "M531.15,258.94l1.51,0.12l5.13,-0.95l5.3,-1.48l-0.01,4.4l-2.67,3.39l-1.85,0.01l-8.04,-2.94l-2.55,-3.17l1.12,-1.71l2.04,2.34Z",
        "name": "Somaliland"
      },
      "FI": {
        "path": "M492.17,76.39l-0.23,3.5l3.52,2.63l-2.08,2.88l-0.02,0.44l2.8,4.56l-1.59,3.31l2.16,3.24l-0.94,2.39l0.14,0.47l3.44,2.51l-0.77,1.62l-7.52,6.95l-4.5,0.31l-4.38,1.37l-3.8,0.74l-1.44,-1.96l-2.17,-1.11l0.5,-3.66l-1.16,-3.33l1.09,-2.08l2.21,-2.42l5.67,-4.32l1.64,-0.83l0.21,-0.42l-0.46,-2.02l-3.38,-1.89l-0.75,-1.43l-0.22,-6.74l-6.79,-4.8l0.8,-0.62l2.54,2.12l3.46,-0.12l3.0,0.96l2.51,-2.11l1.17,-3.08l3.55,-1.38l2.76,1.53l-0.95,2.79Z",
        "name": "Finland"
      },
      "FJ": {
        "path": "M869.95,326.98l-1.21,0.41l-0.08,-0.23l2.97,-1.21l-0.14,0.42l-1.54,0.61ZM867.58,329.25l0.43,0.37l-0.27,0.88l-1.24,0.28l-1.04,-0.24l-0.14,-0.66l0.63,-0.58l0.92,0.26l0.7,-0.31Z",
        "name": "Fiji"
      },
      "FK": {
        "path": "M274.36,425.85l1.44,1.08l-0.47,0.73l-3.0,0.89l-0.96,-1.0l-0.52,-0.05l-1.83,1.29l-0.73,-0.88l2.46,-1.64l1.93,0.76l1.67,-1.19Z",
        "name": "Falkland Is."
      },
      "NI": {
        "path": "M202.33,252.67l0.81,-0.18l1.03,-1.02l-0.04,-0.88l0.68,-0.0l0.63,-0.54l0.97,0.22l1.53,-1.26l0.58,-0.99l1.17,0.34l2.41,-0.94l0.13,1.32l-0.81,1.94l0.1,2.74l-0.36,0.37l-0.11,1.75l-0.47,0.81l0.18,1.14l-1.73,-0.85l-0.71,0.27l-1.47,-0.6l-0.52,0.16l-4.01,-3.81Z",
        "name": "Nicaragua"
      },
      "NL": {
        "path": "M430.31,143.39l0.6,-0.5l2.13,-4.8l3.2,-1.33l1.74,0.08l0.33,0.8l-0.59,2.92l-0.5,0.99l-1.26,0.0l-0.4,0.45l0.33,2.7l-2.2,-1.78l-2.62,0.58l-0.75,-0.11Z",
        "name": "Netherlands"
      },
      "NO": {
        "path": "M491.44,67.41l6.8,2.89l-2.29,0.86l-0.15,0.65l2.33,2.38l-4.98,1.79l0.84,-2.45l-0.18,-0.48l-3.55,-1.8l-3.89,1.52l-1.42,3.38l-2.12,1.72l-2.64,-1.0l-3.11,0.21l-2.66,-2.22l-0.5,-0.01l-1.41,1.1l-1.44,0.17l-0.35,0.35l-0.32,2.47l-4.32,-0.64l-0.44,0.29l-0.58,2.11l-2.45,0.2l-4.15,7.68l-3.88,5.76l0.78,1.62l-0.64,1.16l-2.24,-0.06l-0.38,0.24l-1.66,3.89l0.15,5.17l1.57,2.04l-0.78,4.16l-2.02,2.48l-0.85,1.63l-1.3,-1.75l-0.58,-0.07l-4.87,4.19l-3.1,0.79l-3.16,-1.7l-0.85,-3.77l-0.77,-8.55l2.14,-2.31l6.55,-3.27l5.02,-4.17l10.63,-13.84l10.98,-8.7l5.35,-1.91l4.34,0.12l3.69,-3.64l4.49,0.19l4.37,-0.89ZM484.55,20.04l4.26,1.75l-3.1,2.55l-7.1,0.65l-7.08,-0.9l-0.37,-1.31l-0.37,-0.29l-3.44,-0.1l-2.08,-2.0l6.87,-1.44l3.9,1.31l2.39,-1.64l6.13,1.4ZM481.69,33.93l-4.45,1.74l-3.54,-0.99l1.12,-0.9l0.05,-0.58l-1.06,-1.22l4.22,-0.89l1.09,1.97l2.57,0.87ZM466.44,24.04l7.43,3.77l-5.41,1.86l-1.58,4.08l-2.26,1.2l-1.12,4.11l-2.61,0.18l-4.79,-2.86l1.84,-1.54l-0.1,-0.68l-3.69,-1.53l-4.77,-4.51l-1.73,-3.89l6.11,-1.82l1.54,1.92l3.57,-0.08l1.2,-1.96l3.32,-0.18l3.05,1.92Z",
        "name": "Norway"
      },
      "NA": {
        "path": "M474.26,330.66l-0.97,0.04l-0.38,0.4l-0.07,8.9l-2.09,0.08l-0.39,0.4l-0.0,17.42l-1.98,1.23l-1.17,0.17l-2.44,-0.66l-0.48,-1.13l-0.99,-0.74l-0.54,0.05l-0.9,1.01l-1.53,-1.68l-0.93,-1.88l-1.99,-8.56l-0.06,-3.12l-0.33,-1.52l-2.3,-3.34l-1.91,-4.83l-1.96,-2.43l-0.12,-1.57l2.33,-0.79l1.43,0.07l1.81,1.13l10.23,-0.25l1.84,1.23l5.87,0.35ZM474.66,330.64l6.51,-1.6l1.9,0.39l-1.69,0.4l-1.31,0.83l-1.12,-0.94l-4.29,0.92Z",
        "name": "Namibia"
      },
      "VU": {"path": "M839.04,322.8l0.22,1.14l-0.44,0.03l-0.2,-1.45l0.42,0.27Z", "name": "Vanuatu"},
      "NC": {"path": "M838.78,341.24l-0.33,0.22l-2.9,-1.75l-3.26,-3.37l1.65,0.83l4.85,4.07Z", "name": "New Caledonia"},
      "NE": {
        "path": "M454.75,226.53l1.33,1.37l0.48,0.07l1.27,-0.7l0.53,3.52l0.94,0.83l0.17,0.92l0.81,0.69l-0.44,0.95l-0.96,5.26l-0.13,3.22l-3.04,2.31l-1.22,3.57l1.02,1.24l-0.0,1.46l0.39,0.4l1.13,0.04l-0.9,1.25l-1.47,-2.42l-0.86,-0.29l-2.09,1.37l-1.74,-0.67l-1.45,-0.17l-0.85,0.35l-1.36,-0.07l-1.64,1.09l-1.06,0.05l-2.94,-1.28l-1.44,0.59l-1.01,-0.03l-0.97,-0.94l-2.7,-0.98l-2.69,0.3l-0.87,0.64l-0.47,1.6l-0.75,1.16l-0.12,1.53l-1.57,-1.1l-1.31,0.24l0.03,-0.81l-0.32,-0.41l-2.59,-0.52l-0.15,-1.16l-1.35,-1.6l-0.29,-1.0l0.13,-0.84l1.29,-0.08l1.08,-0.92l3.31,-0.22l2.22,-0.41l0.32,-0.34l0.2,-1.47l1.39,-1.88l-0.01,-5.66l3.36,-1.12l7.24,-5.12l8.42,-4.92l3.69,1.06Z",
        "name": "Niger"
      },
      "NG": {
        "path": "M456.32,253.89l0.64,0.65l-0.28,1.04l-2.11,2.01l-2.03,5.18l-1.37,1.16l-1.15,3.18l-1.33,0.66l-1.46,-0.97l-1.21,0.16l-1.38,1.36l-0.91,0.24l-1.79,4.06l-2.33,0.81l-1.11,-0.07l-0.86,0.5l-1.71,-0.05l-1.19,-1.39l-0.89,-1.89l-1.77,-1.66l-3.95,-0.08l0.07,-5.21l0.42,-1.43l1.95,-2.3l-0.14,-0.91l0.43,-1.18l-0.53,-1.41l0.25,-2.92l0.72,-1.07l0.32,-1.34l0.46,-0.39l2.47,-0.28l2.34,0.89l1.15,1.02l1.28,0.04l1.22,-0.58l3.03,1.27l1.49,-0.14l1.36,-1.0l1.33,0.07l0.82,-0.35l3.45,0.8l1.82,-1.32l1.84,2.67l0.66,0.16Z",
        "name": "Nigeria"
      },
      "NZ": {
        "path": "M857.8,379.65l1.86,3.12l0.44,0.18l0.3,-0.38l0.03,-1.23l0.38,0.27l0.57,2.31l2.02,0.94l1.81,0.27l1.57,-1.06l0.7,0.18l-1.15,3.59l-1.98,0.11l-0.74,1.2l0.2,1.11l-2.42,3.98l-1.49,0.92l-1.04,-0.85l1.21,-2.05l-0.81,-2.01l-2.63,-1.25l0.04,-0.57l1.82,-1.19l0.43,-2.34l-0.16,-2.03l-0.95,-1.82l-0.06,-0.72l-3.11,-3.64l-0.79,-1.52l1.56,1.45l1.76,0.66l0.65,2.34ZM853.83,393.59l0.57,1.24l0.59,0.16l1.42,-0.97l0.46,0.79l0.0,1.03l-2.47,3.48l-1.26,1.2l-0.06,0.5l0.55,0.87l-1.41,0.07l-2.33,1.38l-2.03,5.02l-3.02,2.16l-2.06,-0.06l-1.71,-1.04l-2.47,-0.2l-0.27,-0.73l1.22,-2.1l3.05,-2.94l1.62,-0.59l4.02,-2.82l1.57,-1.67l1.07,-2.16l0.88,-0.7l0.48,-1.75l1.24,-0.97l0.35,0.79Z",
        "name": "New Zealand"
      },
      "NP": {
        "path": "M641.14,213.62l0.01,3.19l-1.74,0.04l-4.8,-0.86l-1.58,-1.39l-3.37,-0.34l-7.65,-3.7l0.8,-2.09l2.33,-1.7l1.77,0.75l2.49,1.76l1.38,0.41l0.99,1.35l1.9,0.52l1.99,1.17l5.49,0.9Z",
        "name": "Nepal"
      },
      "XK": {
        "path": "M472.77,172.64l-1.08,-1.29l0.96,-0.77l0.29,-0.83l1.98,1.64l-0.36,0.67l-1.79,0.58Z",
        "name": "Kosovo"
      },
      "CI": {
        "path": "M407.4,259.27l0.86,0.42l0.56,0.9l1.13,0.53l1.19,-0.61l0.97,-0.08l1.42,0.54l0.6,3.24l-1.03,2.08l-0.65,2.84l1.06,2.33l-0.06,0.53l-2.54,-0.47l-1.66,0.03l-3.06,0.46l-4.11,1.6l0.32,-3.06l-1.18,-1.31l-1.32,-0.66l0.42,-0.85l-0.2,-1.4l0.5,-0.67l0.01,-1.59l0.84,-0.32l0.26,-0.5l-1.15,-3.01l0.12,-0.5l0.51,-0.25l0.66,0.31l1.93,0.02l0.67,-0.71l0.71,-0.14l0.25,0.69l0.57,0.22l1.4,-0.61Z",
        "name": "C\u00f4te d'Ivoire"
      },
      "CH": {
        "path": "M444.62,156.35l-0.29,0.87l0.18,0.53l1.13,0.58l1.0,0.1l-0.1,0.65l-0.79,0.38l-1.72,-0.37l-0.45,0.23l-0.45,1.04l-0.75,0.06l-0.84,-0.4l-1.32,1.0l-0.96,0.12l-0.88,-0.55l-0.81,-1.3l-0.49,-0.16l-0.63,0.26l0.02,-0.65l1.71,-1.66l0.1,-0.56l0.93,0.08l0.58,-0.46l1.99,0.02l0.66,-0.61l2.19,0.79Z",
        "name": "Switzerland"
      },
      "CO": {
        "path": "M242.07,254.93l-1.7,0.59l-0.59,1.18l-1.7,1.69l-0.38,1.93l-0.67,1.43l0.31,0.57l1.03,0.13l0.25,0.9l0.57,0.64l-0.04,2.34l1.64,1.42l3.16,-0.24l1.26,0.28l1.67,2.06l0.41,0.13l4.09,-0.39l0.45,0.22l-0.92,1.95l-0.2,1.8l0.52,1.83l0.75,1.05l-1.12,1.1l0.07,0.63l0.84,0.51l0.74,1.29l-0.39,-0.45l-0.59,-0.01l-0.71,0.74l-4.71,-0.05l-0.4,0.41l0.03,1.57l0.33,0.39l1.11,0.2l-1.68,0.4l-0.29,0.38l-0.01,1.82l1.16,1.14l0.34,1.25l-1.05,7.05l-1.04,-0.87l1.26,-1.99l-0.13,-0.56l-2.18,-1.23l-1.38,0.2l-1.14,-0.38l-1.27,0.61l-1.55,-0.26l-1.38,-2.46l-1.23,-0.75l-0.85,-1.2l-1.67,-1.19l-0.86,0.13l-2.11,-1.32l-1.01,0.31l-1.8,-0.29l-0.52,-0.91l-3.09,-1.68l0.77,-0.52l-0.1,-1.12l0.41,-0.64l1.34,-0.32l2.0,-2.88l-0.11,-0.57l-0.66,-0.43l0.39,-1.38l-0.52,-2.1l0.49,-0.83l-0.4,-2.13l-0.97,-1.35l0.17,-0.66l0.86,-0.08l0.47,-0.75l-0.46,-1.63l1.41,-0.07l1.8,-1.69l0.93,-0.24l0.3,-0.38l0.45,-2.76l1.22,-1.0l1.44,-0.04l0.45,-0.5l1.91,0.12l2.93,-1.84l1.15,-1.14l0.91,0.46l-0.25,0.45Z",
        "name": "Colombia"
      },
      "CN": {
        "path": "M740.23,148.97l4.57,1.3l2.8,2.17l0.98,2.9l0.38,0.27l3.8,0.0l2.32,-1.28l3.29,-0.75l-0.96,2.09l-1.02,1.28l-0.85,3.4l-1.52,2.73l-2.76,-0.5l-2.4,1.13l-0.21,0.45l0.64,2.57l-0.32,3.2l-0.94,0.06l-0.37,0.89l-0.91,-1.01l-0.64,0.07l-0.92,1.57l-3.73,1.25l-0.26,0.48l0.26,1.06l-1.5,-0.08l-1.09,-0.86l-0.56,0.06l-1.67,2.06l-2.7,1.56l-2.03,1.88l-3.4,0.83l-1.93,1.4l-1.15,0.34l0.33,-0.7l-0.41,-0.89l1.79,-1.79l0.02,-0.54l-1.32,-1.56l-0.48,-0.1l-2.24,1.09l-2.83,2.06l-1.51,1.83l-2.28,0.13l-1.55,1.49l-0.04,0.5l1.32,1.97l2.0,0.58l0.31,1.35l1.98,0.84l3.0,-1.96l2.0,1.02l1.49,0.11l0.22,0.83l-3.37,0.86l-1.12,1.48l-2.5,1.52l-1.29,1.99l0.14,0.56l2.57,1.48l0.97,2.7l3.17,4.63l-0.03,1.66l-1.35,0.65l-0.2,0.51l0.6,1.47l1.4,0.91l-0.89,3.82l-1.43,0.38l-3.85,6.44l-2.27,3.11l-6.78,4.57l-2.73,0.29l-1.45,1.04l-0.62,-0.61l-0.55,-0.01l-1.36,1.25l-3.39,1.27l-2.61,0.4l-1.1,2.79l-0.81,0.09l-0.49,-1.42l0.5,-0.85l-0.25,-0.59l-3.36,-0.84l-1.3,0.4l-2.31,-0.62l-0.94,-0.84l0.33,-1.28l-0.3,-0.49l-2.19,-0.46l-1.13,-0.93l-0.47,-0.02l-2.06,1.36l-4.29,0.28l-2.76,1.05l-0.28,0.43l0.32,2.53l-0.59,-0.03l-0.19,-1.34l-0.55,-0.34l-1.68,0.7l-2.46,-1.23l0.62,-1.87l-0.26,-0.51l-1.37,-0.44l-0.54,-2.22l-0.45,-0.3l-2.13,0.35l0.24,-2.48l2.39,-2.4l0.03,-4.31l-1.19,-0.92l-0.78,-1.49l-0.41,-0.21l-1.41,0.19l-1.98,-0.3l0.46,-1.07l-1.17,-1.7l-0.55,-0.11l-1.63,1.05l-2.25,-0.57l-2.89,1.73l-2.25,1.98l-1.75,0.29l-1.17,-0.71l-3.31,-0.65l-1.48,0.79l-1.04,1.27l-0.12,-1.17l-0.54,-0.34l-1.44,0.54l-5.55,-0.86l-1.98,-1.16l-1.89,-0.54l-0.99,-1.35l-1.34,-0.37l-2.55,-1.79l-2.01,-0.84l-1.21,0.56l-5.57,-3.45l-0.53,-2.31l1.19,0.25l0.48,-0.37l0.08,-1.42l-0.98,-1.56l0.15,-2.44l-2.69,-3.32l-4.12,-1.23l-0.67,-2.0l-1.92,-1.48l-0.38,-0.7l-0.51,-3.01l-1.52,-0.66l-0.7,0.13l-0.48,-2.05l0.55,-0.51l-0.09,-0.82l2.03,-1.19l1.6,-0.54l2.56,0.38l0.42,-0.22l0.85,-1.7l3.0,-0.33l1.1,-1.26l4.05,-1.77l0.39,-0.91l-0.17,-1.44l1.45,-0.67l0.2,-0.52l-2.07,-4.9l4.51,-1.12l1.37,-0.73l1.89,-5.51l4.98,0.86l1.51,-1.7l0.11,-2.87l1.99,-0.38l1.83,-2.06l0.49,-0.13l0.68,2.08l2.23,1.77l3.44,1.16l1.55,2.29l-0.92,3.49l0.96,1.67l6.54,1.13l2.95,1.87l1.47,0.35l1.06,2.62l1.53,1.91l3.05,0.08l5.14,0.67l3.37,-0.41l2.36,0.43l3.65,1.8l3.06,0.04l1.45,0.88l2.87,-1.59l3.95,-1.02l3.83,-0.14l3.06,-1.14l1.77,-1.6l1.72,-1.01l0.17,-0.49l-1.1,-2.05l1.02,-1.54l4.02,0.8l2.45,-1.61l3.76,-1.19l1.96,-2.13l1.63,-0.83l3.51,-0.4l1.92,0.34l0.46,-0.3l0.17,-1.5l-2.27,-2.22l-2.11,-1.09l-2.18,1.11l-2.32,-0.47l-1.29,0.32l-0.4,-0.82l2.73,-5.16l3.02,1.06l3.53,-2.06l0.18,-1.68l2.16,-3.35l1.49,-1.35l-0.03,-1.85l-1.07,-0.85l1.54,-1.26l2.98,-0.59l3.23,-0.09l3.64,0.99l2.04,1.16l3.29,6.71l0.92,3.19ZM696.92,237.31l-1.87,1.08l-1.63,-0.64l-0.06,-1.79l1.03,-0.98l2.58,-0.69l1.16,0.05l0.3,0.54l-0.98,1.06l-0.53,1.37Z",
        "name": "China"
      },
      "CM": {
        "path": "M457.92,257.49l1.05,1.91l-1.4,0.16l-1.05,-0.23l-0.45,0.22l-0.54,1.19l0.08,0.45l1.48,1.47l1.05,0.45l1.01,2.46l-1.52,2.99l-0.68,0.68l-0.13,3.69l2.38,3.84l1.09,0.8l0.24,2.48l-3.67,-1.14l-11.27,-0.13l0.23,-1.79l-0.98,-1.66l-1.19,-0.54l-0.44,-0.97l-0.6,-0.42l1.71,-4.27l0.75,-0.13l1.38,-1.36l0.65,-0.03l1.71,0.99l1.93,-1.12l1.14,-3.18l1.38,-1.17l2.0,-5.14l2.17,-2.13l0.3,-1.64l-0.86,-0.88l0.03,-0.33l0.94,1.28l0.07,3.22Z",
        "name": "Cameroon"
      },
      "CL": {
        "path": "M246.5,429.18l-3.14,1.83l-0.57,3.16l-0.64,0.05l-2.68,-1.06l-2.82,-2.33l-3.04,-1.89l-0.69,-1.85l0.63,-2.14l-1.21,-2.11l-0.31,-5.37l1.01,-2.91l2.57,-2.38l-0.18,-0.68l-3.16,-0.77l2.05,-2.47l0.77,-4.65l2.32,0.9l0.54,-0.29l1.31,-6.31l-0.22,-0.44l-1.68,-0.8l-0.56,0.28l-0.7,3.36l-0.81,-0.22l1.56,-9.41l1.15,-2.24l-0.71,-2.82l-0.18,-2.84l1.01,-0.33l3.26,-9.14l1.07,-4.22l-0.56,-4.21l0.74,-2.34l-0.29,-3.27l1.46,-3.34l2.04,-16.59l-0.66,-7.76l1.03,-0.53l0.54,-0.9l0.79,1.14l0.32,1.78l1.25,1.16l-0.69,2.55l1.33,2.9l0.97,3.59l0.46,0.29l1.5,-0.3l0.11,0.23l-0.76,2.44l-2.57,1.23l-0.23,0.37l0.08,4.33l-0.46,0.77l0.56,1.21l-1.58,1.51l-1.68,2.62l-0.89,2.47l0.2,2.7l-1.48,2.73l1.12,5.09l0.64,0.61l-0.01,2.29l-1.38,2.68l0.01,2.4l-1.89,2.04l0.02,2.75l0.69,2.57l-1.43,1.13l-1.26,5.68l0.39,3.51l-0.97,0.89l0.58,3.5l1.02,1.14l-0.65,1.02l0.15,0.57l1.0,0.53l0.16,0.69l-1.03,0.85l0.26,1.75l-0.89,4.03l-1.31,2.66l0.24,1.75l-0.71,1.83l-1.99,1.7l0.3,3.67l0.88,1.19l1.58,0.01l0.01,2.21l1.04,1.95l5.98,0.63ZM248.69,430.79l0.0,7.33l0.4,0.4l3.52,0.05l-0.44,0.75l-1.94,0.98l-2.49,-0.37l-1.88,-1.06l-2.55,-0.49l-5.59,-3.71l-2.38,-2.63l4.1,2.48l3.32,1.23l0.45,-0.12l1.29,-1.57l0.83,-2.32l2.05,-1.24l1.31,0.29Z",
        "name": "Chile"
      },
      "XC": {"path": "M504.91,192.87l0.34,0.01l0.27,-0.07l-0.29,0.26l-0.31,-0.2Z", "name": "N. Cyprus"},
      "CA": {
        "path": "M280.06,145.6l-1.67,2.88l0.07,0.49l0.5,0.04l1.46,-0.98l1.0,0.42l-0.56,0.72l0.17,0.62l2.22,0.89l1.35,-0.71l1.95,0.78l-0.66,2.01l0.5,0.51l1.32,-0.42l0.98,3.17l-0.91,2.41l-0.8,0.08l-1.23,-0.45l0.47,-2.25l-0.89,-0.83l-0.48,0.06l-2.78,2.63l-0.34,-0.02l1.02,-0.85l-0.14,-0.69l-2.4,-0.77l-7.4,0.08l-0.17,-0.41l1.3,-0.94l0.02,-0.64l-0.73,-0.58l1.85,-1.74l2.57,-5.16l1.47,-1.79l1.99,-1.05l0.46,0.06l-1.53,2.45ZM68.32,74.16l4.13,0.95l4.02,2.14l2.61,0.4l2.47,-1.89l2.88,-1.31l3.85,0.48l3.71,-1.94l3.82,-1.04l1.56,1.68l0.49,0.08l1.87,-1.04l0.65,-1.98l1.24,0.35l4.16,3.94l0.54,0.01l2.75,-2.49l0.26,2.59l0.49,0.35l3.08,-0.73l1.04,-1.27l2.73,0.23l3.83,1.86l5.86,1.61l3.47,0.75l2.44,-0.26l2.73,1.78l-2.98,1.81l-0.19,0.41l0.31,0.32l4.53,0.92l6.87,-0.5l2.0,-0.69l2.49,2.39l0.53,0.02l2.72,-2.16l-0.02,-0.64l-2.16,-1.54l1.15,-1.06l4.83,-0.61l1.84,0.95l2.48,2.31l3.01,-0.23l4.55,1.92l3.85,-0.67l3.61,0.1l0.41,-0.44l-0.25,-2.36l1.79,-0.61l3.49,1.32l-0.01,3.77l0.31,0.39l0.45,-0.22l1.48,-3.16l1.74,0.1l0.41,-0.3l1.13,-4.37l-2.78,-3.11l-2.8,-1.74l0.19,-4.64l2.71,-3.07l2.98,0.67l2.41,1.95l3.19,4.8l-1.99,1.97l0.21,0.68l4.33,0.84l-0.01,4.15l0.25,0.37l0.44,-0.09l3.07,-3.15l2.54,2.39l-0.61,3.33l2.42,2.88l0.61,0.0l2.61,-3.08l1.88,-3.82l0.17,-4.58l6.72,0.94l3.13,2.04l0.13,1.82l-1.76,2.19l-0.01,0.49l1.66,2.16l-0.26,1.71l-4.68,2.8l-3.28,0.61l-2.47,-1.2l-0.55,0.23l-0.73,2.04l-2.38,3.43l-0.74,1.77l-2.74,2.57l-3.44,0.25l-2.21,1.78l-0.28,2.53l-2.82,0.55l-3.12,3.22l-2.72,4.31l-1.03,3.17l-0.14,4.31l0.33,0.41l3.44,0.57l2.24,5.95l0.45,0.23l3.4,-0.69l4.52,1.51l2.43,1.31l1.91,1.73l3.1,0.96l2.62,1.46l6.6,0.54l-0.35,2.74l0.81,3.53l1.81,3.78l3.83,3.3l0.45,0.04l2.1,-1.28l1.37,-3.69l-1.31,-5.38l-1.45,-1.58l3.57,-1.47l2.84,-2.46l1.52,-2.8l-0.25,-2.55l-1.7,-3.07l-2.85,-2.61l2.8,-3.95l-1.08,-3.37l-0.79,-5.67l1.36,-0.7l6.76,1.41l2.12,-0.96l5.12,3.36l1.05,1.61l4.08,0.26l-0.06,2.87l0.83,4.7l0.3,0.32l2.16,0.54l1.73,2.06l0.5,0.09l3.63,-2.03l2.52,-4.19l1.26,-1.32l7.6,11.72l-0.92,2.04l0.16,0.51l3.3,1.97l2.22,1.98l4.1,0.98l1.43,0.99l0.95,2.79l2.1,0.68l0.84,1.08l0.17,3.45l-3.37,2.26l-4.22,1.24l-3.06,2.63l-4.06,0.51l-5.35,-0.69l-6.39,0.2l-2.3,2.41l-3.26,1.51l-6.47,7.15l-0.06,0.48l0.44,0.19l2.13,-0.52l4.17,-4.24l5.12,-2.62l3.52,-0.3l1.69,1.21l-2.12,2.21l0.81,3.47l1.02,2.61l3.47,1.6l4.14,-0.45l2.15,-2.8l0.26,1.48l1.14,0.8l-2.56,1.69l-5.5,1.82l-2.54,1.27l-2.74,2.15l-1.4,-0.16l-0.07,-2.01l4.14,-2.44l0.18,-0.45l-0.39,-0.29l-6.63,0.45l-1.39,-1.49l-0.14,-4.43l-1.11,-0.91l-1.82,0.39l-0.66,-0.66l-0.6,0.03l-1.91,2.39l-0.82,2.52l-0.8,1.27l-1.67,0.56l-0.46,0.76l-8.31,0.07l-1.21,0.62l-2.35,1.97l-0.71,-0.14l-1.37,0.96l-1.12,-0.48l-4.74,1.26l-0.9,1.17l0.21,0.62l1.73,0.3l-1.81,0.31l-1.85,0.81l-2.11,-0.13l-2.95,1.78l-0.69,-0.09l1.39,-2.1l1.73,-1.21l0.1,-2.29l1.16,-1.99l0.49,0.53l2.03,0.42l1.2,-1.16l0.02,-0.47l-2.66,-3.51l-2.28,-0.61l-5.64,-0.71l-0.4,-0.57l-0.79,0.13l0.2,-0.41l-0.22,-0.55l-0.68,-0.26l0.19,-1.26l-0.78,-0.73l0.31,-0.64l-0.29,-0.57l-2.6,-0.44l-0.75,-1.63l-0.94,-0.66l-4.31,-0.65l-1.13,1.19l-1.48,0.59l-0.85,1.06l-2.83,-0.76l-2.09,0.39l-2.39,-0.97l-4.24,-0.7l-0.57,-0.4l-0.41,-1.63l-0.4,-0.3l-0.85,0.02l-0.39,0.4l-0.01,0.85l-69.13,-0.01l-6.51,-4.52l-4.5,-1.38l-1.26,-2.66l0.33,-1.93l-0.23,-0.43l-3.01,-1.35l-0.55,-2.77l-2.89,-2.38l-0.04,-1.45l1.39,-1.83l-0.28,-2.55l-4.16,-2.2l-4.07,-6.6l-4.02,-3.22l-1.3,-1.88l-0.5,-0.13l-2.51,1.21l-2.23,1.87l-3.85,-3.88l-2.44,-1.04l-2.22,-0.13l0.03,-37.49ZM260.37,148.65l3.04,0.76l2.26,1.2l-3.78,-0.95l-1.53,-1.01ZM249.4,3.81l6.68,0.49l5.32,0.79l4.26,1.57l-0.07,1.1l-5.85,2.53l-6.02,1.21l-2.39,1.39l-0.18,0.45l0.39,0.29l4.01,-0.02l-4.65,2.82l-4.2,1.74l-4.19,4.59l-5.03,0.92l-1.67,1.15l-7.47,0.59l-0.37,0.37l0.32,0.42l2.41,0.49l-0.81,0.47l-0.12,0.59l1.83,2.41l-2.02,1.59l-3.81,1.51l-1.32,2.16l-3.38,1.53l-0.22,0.48l0.35,1.19l0.4,0.29l3.88,-0.18l0.03,0.61l-6.33,2.95l-6.41,-1.4l-7.43,0.79l-3.72,-0.62l-4.4,-0.25l-0.23,-1.83l4.29,-1.11l0.28,-0.51l-1.1,-3.45l1.0,-0.25l6.58,2.28l0.47,-0.16l-0.05,-0.49l-3.41,-3.45l-3.58,-0.98l1.48,-1.55l4.34,-1.29l0.97,-2.19l-0.16,-0.48l-3.42,-2.13l-0.81,-2.26l6.2,0.22l2.24,0.58l3.91,-2.1l0.2,-0.43l-0.35,-0.32l-5.64,-0.67l-8.73,0.36l-4.26,-1.9l-2.12,-2.4l-2.78,-1.66l-0.41,-1.52l3.31,-1.03l2.93,-0.2l4.91,-0.99l3.7,-2.27l2.87,0.3l2.62,1.67l0.56,-0.14l1.82,-3.2l3.13,-0.94l4.44,-0.69l7.53,-0.26l1.48,0.67l7.19,-1.06l10.8,0.79ZM203.85,57.54l0.01,0.42l1.97,2.97l0.68,-0.02l2.24,-3.72l5.95,-1.86l4.01,4.64l-0.35,2.91l0.5,0.43l4.95,-1.36l2.32,-1.8l5.31,2.28l3.27,2.11l0.3,1.84l0.48,0.33l4.42,-0.99l2.64,2.87l5.97,1.77l2.06,1.72l2.11,3.71l-4.19,1.86l-0.01,0.73l5.9,2.83l3.94,0.94l3.78,3.95l3.46,0.25l-0.63,2.37l-4.11,4.47l-2.76,-1.56l-3.9,-3.94l-3.59,0.41l-0.33,0.34l-0.19,2.72l2.63,2.38l3.42,1.89l0.94,0.97l1.55,3.75l-0.7,2.29l-2.74,-0.92l-6.25,-3.15l-0.51,0.13l0.05,0.52l6.07,5.69l0.18,0.59l-6.09,-1.39l-5.31,-2.24l-2.63,-1.66l0.6,-0.77l-0.12,-0.6l-7.39,-4.01l-0.59,0.37l0.03,0.79l-6.73,0.6l-1.69,-1.1l1.36,-2.46l4.51,-0.07l5.15,-0.52l0.31,-0.6l-0.74,-1.3l0.78,-1.84l3.21,-4.05l-0.67,-2.35l-1.11,-1.6l-3.84,-2.1l-4.35,-1.28l0.91,-0.63l0.06,-0.61l-2.65,-2.75l-2.34,-0.36l-1.89,-1.46l-0.53,0.03l-1.24,1.23l-4.36,0.55l-9.04,-0.99l-9.26,-1.98l-1.6,-1.22l2.22,-1.77l0.13,-0.44l-0.38,-0.27l-3.22,-0.02l-0.72,-4.25l1.83,-4.04l2.42,-1.85l5.5,-1.1l-1.39,2.35ZM261.19,159.33l2.07,0.61l1.44,-0.04l-1.15,0.63l-2.94,-1.23l-0.4,-0.68l0.36,-0.37l0.61,1.07ZM230.83,84.39l-2.37,0.18l-0.49,-1.63l0.93,-2.09l1.94,-0.51l1.62,0.99l0.02,1.52l-1.66,1.54ZM229.43,58.25l0.11,0.65l-4.87,-0.21l-2.72,0.62l-3.1,-2.57l0.08,-1.26l0.86,-0.23l5.57,0.51l4.08,2.5ZM222.0,105.02l-0.72,1.49l-0.63,-0.19l-0.48,-0.84l0.81,-0.99l0.65,0.05l0.37,0.46ZM183.74,38.32l2.9,1.7l4.79,-0.01l1.84,1.46l-0.49,1.68l0.23,0.48l2.82,1.14l1.76,1.26l7.01,0.65l4.1,-1.1l5.03,-0.43l3.93,0.35l2.48,1.77l0.46,1.7l-1.3,1.1l-3.56,1.01l-3.23,-0.59l-7.17,0.76l-5.09,0.09l-3.99,-0.6l-6.42,-1.54l-0.79,-2.51l-0.3,-2.49l-2.64,-2.5l-5.32,-0.72l-2.52,-1.4l0.68,-1.57l4.78,0.31ZM207.38,91.35l0.4,1.56l0.56,0.26l1.06,-0.52l1.32,0.96l5.42,2.57l0.2,1.68l0.46,0.35l1.68,-0.28l1.15,0.85l-1.55,0.87l-3.61,-0.88l-1.32,-1.69l-0.57,-0.06l-2.45,2.1l-3.12,1.79l-0.7,-1.87l-0.42,-0.26l-2.16,0.24l1.39,-1.39l0.32,-3.14l0.76,-3.35l1.18,0.22ZM215.49,102.6l-2.67,1.95l-1.4,-0.07l-0.3,-0.58l1.53,-1.48l2.84,0.18ZM202.7,24.12l2.53,1.59l-2.87,1.4l-4.53,4.05l-4.25,0.38l-5.03,-0.68l-2.45,-2.04l0.03,-1.62l1.82,-1.37l0.14,-0.45l-0.38,-0.27l-4.45,0.04l-2.59,-1.76l-1.41,-2.29l1.57,-2.32l1.62,-1.66l2.44,-0.39l0.25,-0.65l-0.6,-0.74l4.86,-0.25l3.24,3.11l8.16,2.3l1.9,3.61ZM187.47,59.2l-2.76,3.49l-2.38,-0.15l-1.44,-3.84l0.04,-2.2l1.19,-1.88l2.3,-1.23l5.07,0.17l4.11,1.02l-3.24,3.72l-2.88,0.89ZM186.07,48.79l-1.08,1.53l-3.34,-0.34l-2.56,-1.1l1.03,-1.75l3.25,-1.23l1.95,1.58l0.75,1.3ZM185.71,35.32l-5.3,-0.2l-0.32,-0.71l4.31,0.07l1.3,0.84ZM180.68,32.48l-3.34,1.0l-1.79,-1.1l-0.98,-1.87l-0.15,-1.73l4.1,0.53l2.67,1.7l-0.51,1.47ZM180.9,76.31l-1.1,1.08l-3.13,-1.23l-2.12,0.43l-2.71,-1.57l1.72,-1.09l1.55,-1.72l3.81,1.9l1.98,2.2ZM169.74,54.87l2.96,0.97l4.17,-0.57l0.41,0.88l-2.14,2.11l0.09,0.64l3.55,1.92l-0.4,3.72l-3.79,1.65l-2.17,-0.35l-1.72,-1.74l-6.02,-3.5l0.03,-0.85l4.68,0.54l0.4,-0.21l-0.05,-0.45l-2.48,-2.81l2.46,-1.95ZM174.45,40.74l1.37,1.73l0.07,2.44l-1.05,3.45l-3.79,0.47l-2.32,-0.69l0.05,-2.64l-0.44,-0.41l-3.68,0.35l-0.12,-3.1l2.45,0.1l3.67,-1.73l3.41,0.29l0.37,-0.26ZM170.05,31.55l0.67,1.56l-3.33,-0.49l-4.22,-1.77l-4.35,-0.16l1.4,-0.94l-0.06,-0.7l-2.81,-1.23l-0.12,-1.39l4.39,0.68l6.62,1.98l1.81,2.47ZM134.5,58.13l-1.02,1.82l0.45,0.58l5.4,-1.39l3.33,2.29l0.49,-0.03l2.6,-2.23l1.94,1.32l2.0,4.5l0.7,0.06l1.3,-2.29l-1.63,-4.46l1.69,-0.54l2.31,0.71l2.65,1.81l2.49,7.92l8.48,4.27l-0.19,1.35l-3.79,0.33l-0.26,0.67l1.4,1.49l-0.58,1.1l-4.23,-0.64l-4.43,-1.19l-3.0,0.28l-4.66,1.47l-10.52,1.04l-1.43,-2.02l-3.42,-1.2l-2.21,0.43l-2.51,-2.86l4.84,-1.05l3.6,0.19l3.27,-0.78l0.31,-0.39l-0.31,-0.39l-4.84,-1.06l-8.79,0.27l-0.85,-1.07l5.26,-1.66l0.27,-0.45l-0.4,-0.34l-3.8,0.06l-3.81,-1.06l1.81,-3.01l1.66,-1.79l6.48,-2.81l1.97,0.71ZM158.7,56.61l-1.7,2.44l-3.2,-2.75l0.37,-0.3l3.11,-0.18l1.42,0.79ZM149.61,42.73l1.01,1.89l0.5,0.18l2.14,-0.82l2.23,0.19l0.36,2.04l-1.33,2.09l-8.28,0.76l-6.35,2.15l-3.41,0.1l-0.19,-0.96l4.9,-2.08l0.23,-0.46l-0.41,-0.31l-11.25,0.59l-2.89,-0.74l3.04,-4.44l2.14,-1.32l6.81,1.69l4.58,3.06l4.37,0.39l0.36,-0.63l-3.36,-4.6l1.85,-1.53l2.18,0.51l0.77,2.26ZM144.76,34.41l-4.36,1.44l-3.0,-1.4l1.46,-1.24l3.47,-0.52l2.96,0.71l-0.52,1.01ZM145.13,29.83l-1.9,0.66l-3.67,-0.0l2.27,-1.61l3.3,0.95ZM118.92,65.79l-6.03,2.02l-1.33,-1.9l-5.38,-2.28l2.59,-5.05l2.16,-3.14l-0.02,-0.48l-1.97,-2.41l7.64,-0.7l3.6,1.02l6.3,0.27l4.42,2.95l-2.53,0.98l-6.24,3.43l-3.1,3.28l-0.11,2.01ZM129.54,35.53l-0.28,3.37l-1.72,1.62l-2.33,0.28l-4.61,2.19l-3.86,0.76l-2.64,-0.87l3.72,-3.4l5.01,-3.34l3.72,0.07l3.0,-0.67ZM111.09,152.69l-0.67,0.24l-3.85,-1.37l-0.83,-1.17l-2.12,-1.07l-0.66,-1.02l-2.4,-0.55l-0.74,-1.71l6.02,1.45l2.0,2.55l2.52,1.39l0.73,1.27ZM87.8,134.64l0.89,0.29l1.86,-0.21l-0.65,3.34l1.69,2.33l-1.31,-1.33l-0.99,-1.62l-1.17,-0.98l-0.33,-1.82Z",
        "name": "Canada"
      },
      "CG": {
        "path": "M466.72,276.48l-0.1,1.03l-1.25,2.97l-0.19,3.62l-0.46,1.78l-0.23,0.63l-1.61,1.19l-1.21,1.39l-1.09,2.43l0.04,2.09l-3.25,3.24l-0.5,-0.24l-0.5,-0.83l-1.36,-0.02l-0.98,0.89l-1.68,-0.99l-1.54,1.24l-1.52,-1.96l1.57,-1.14l0.11,-0.52l-0.77,-1.35l2.1,-0.66l0.39,-0.73l1.05,0.82l2.21,0.11l1.12,-1.37l0.37,-1.81l-0.27,-2.09l-1.13,-1.5l1.0,-2.69l-0.13,-0.45l-0.92,-0.58l-1.6,0.17l-0.51,-0.94l0.1,-0.61l2.75,0.09l3.97,1.24l0.51,-0.33l0.17,-1.28l1.24,-2.21l1.28,-1.14l2.76,0.49Z",
        "name": "Congo"
      },
      "CF": {
        "path": "M461.16,278.2l-0.26,-1.19l-1.09,-0.77l-0.84,-1.17l-0.29,-1.0l-1.04,-1.15l0.08,-3.43l0.58,-0.49l1.16,-2.35l1.85,-0.17l0.61,-0.62l0.97,0.58l3.15,-0.96l2.48,-1.92l0.02,-0.96l2.81,0.02l2.36,-1.17l1.93,-2.85l1.16,-0.93l1.11,-0.3l0.27,0.86l1.34,1.47l-0.39,2.01l0.3,1.01l4.01,2.75l0.17,0.93l2.63,2.31l0.6,1.44l2.08,1.4l-3.84,-0.21l-1.94,0.88l-1.23,-0.49l-2.67,1.2l-1.29,-0.18l-0.51,0.36l-0.6,1.22l-3.35,-0.65l-1.57,-0.91l-2.42,-0.83l-1.45,0.91l-0.97,1.27l-0.26,1.56l-3.22,-0.43l-1.49,1.33l-0.94,1.62Z",
        "name": "Central African Rep."
      },
      "CD": {
        "path": "M487.01,272.38l2.34,-0.14l1.35,1.84l1.34,0.45l0.86,-0.39l1.21,0.12l1.07,-0.41l0.54,0.89l2.04,1.54l-0.14,2.72l0.7,0.54l-1.38,1.13l-1.53,2.54l-0.17,2.05l-0.59,1.08l-0.02,1.72l-0.72,0.84l-0.66,3.01l0.63,1.32l-0.44,4.26l0.64,1.47l-0.37,1.22l0.86,1.8l1.53,1.41l0.3,1.26l0.44,0.5l-4.08,0.75l-0.92,1.81l0.51,1.34l-0.74,5.43l0.17,0.38l2.45,1.46l0.54,-0.1l0.12,1.62l-1.28,-0.01l-1.85,-2.35l-1.94,-0.45l-0.48,-1.13l-0.55,-0.2l-1.41,0.74l-1.71,-0.3l-1.01,-1.18l-2.49,-0.19l-0.44,-0.77l-1.98,-0.21l-2.88,0.36l0.11,-2.41l-0.85,-1.13l-0.16,-1.36l0.32,-1.73l-0.46,-0.89l-0.04,-1.49l-0.4,-0.39l-2.53,0.02l0.1,-0.41l-0.39,-0.49l-1.28,0.01l-0.43,0.45l-1.62,0.32l-0.83,1.79l-1.09,-0.28l-2.4,0.52l-1.37,-1.91l-1.3,-3.3l-0.38,-0.27l-7.39,-0.03l-2.46,0.42l0.5,-0.45l0.37,-1.47l0.66,-0.38l0.92,0.08l0.73,-0.82l0.87,0.02l0.31,0.68l1.4,0.36l3.59,-3.63l0.01,-2.23l1.02,-2.29l2.69,-2.39l0.43,-0.99l0.49,-1.96l0.17,-3.51l1.25,-2.95l0.36,-3.14l0.86,-1.13l1.1,-0.66l3.57,1.73l3.65,0.73l0.46,-0.21l0.8,-1.46l1.24,0.19l2.61,-1.17l0.81,0.44l1.04,-0.03l0.59,-0.66l0.7,-0.16l1.81,0.25Z",
        "name": "Dem. Rep. Congo"
      },
      "CZ": {
        "path": "M458.46,144.88l1.22,1.01l1.47,0.23l0.13,0.93l1.36,0.68l0.54,-0.2l0.24,-0.55l1.15,0.25l0.53,1.09l1.68,0.18l0.6,0.84l-1.04,0.73l-0.96,1.28l-1.6,0.17l-0.55,0.56l-1.04,-0.46l-1.05,0.15l-2.12,-0.96l-1.05,0.34l-1.2,1.12l-1.56,-0.87l-2.57,-2.1l-0.53,-1.88l4.7,-2.52l0.71,0.26l0.9,-0.28Z",
        "name": "Czech Rep."
      },
      "CY": {"path": "M504.36,193.47l0.43,0.28l-1.28,0.57l-0.92,-0.28l-0.24,-0.46l2.01,-0.13Z", "name": "Cyprus"},
      "CR": {
        "path": "M211.34,258.05l0.48,0.99l1.6,1.6l-0.54,0.45l0.29,1.42l-0.25,1.19l-1.09,-0.59l-0.05,-1.25l-2.46,-1.42l-0.28,-0.77l-0.66,-0.45l-0.45,-0.0l-0.11,1.04l-1.32,-0.95l0.31,-1.3l-0.36,-0.6l0.31,-0.27l1.42,0.58l1.29,-0.14l0.56,0.56l0.74,0.17l0.55,-0.27Z",
        "name": "Costa Rica"
      },
      "CU": {
        "path": "M221.21,227.25l1.27,1.02l2.19,-0.28l4.43,3.33l2.08,0.43l-0.1,0.38l0.36,0.5l1.75,0.1l1.48,0.84l-3.11,0.51l-4.15,-0.03l0.77,-0.67l-0.04,-0.64l-1.2,-0.74l-1.49,-0.16l-0.7,-0.61l-0.56,-1.4l-0.4,-0.25l-1.34,0.1l-2.2,-0.66l-0.88,-0.58l-3.18,-0.4l-0.27,-0.16l0.58,-0.74l-0.36,-0.29l-2.72,-0.05l-1.7,1.29l-0.91,0.03l-0.61,0.69l-1.01,0.22l1.11,-1.29l1.01,-0.52l3.69,-1.01l3.98,0.21l2.21,0.84Z",
        "name": "Cuba"
      },
      "SZ": {
        "path": "M500.35,351.36l0.5,2.04l-0.38,0.89l-1.05,0.21l-1.23,-1.2l-0.02,-0.64l0.83,-1.57l1.34,0.27Z",
        "name": "Swaziland"
      },
      "SY": {
        "path": "M511.0,199.79l0.05,-1.33l0.54,-1.36l1.28,-0.99l0.13,-0.45l-0.41,-1.11l-1.14,-0.36l-0.19,-1.74l0.52,-1.0l1.29,-1.21l0.2,-1.18l0.59,0.23l2.62,-0.76l1.36,0.52l2.06,-0.01l2.95,-1.08l3.25,-0.26l-0.67,0.94l-1.28,0.66l-0.21,0.4l0.23,2.01l-0.88,3.19l-10.15,5.73l-2.15,-0.85Z",
        "name": "Syria"
      },
      "KG": {
        "path": "M621.35,172.32l-3.87,1.69l-0.96,1.18l-3.04,0.34l-1.13,1.86l-2.36,-0.35l-1.99,0.63l-2.39,1.4l0.06,0.95l-0.4,0.37l-4.52,0.43l-3.02,-0.93l-2.37,0.17l0.11,-0.79l2.32,0.42l1.13,-0.88l1.99,0.2l3.21,-2.14l-0.03,-0.69l-2.97,-1.57l-1.94,0.65l-1.22,-0.74l1.71,-1.58l-0.12,-0.67l-0.36,-0.15l0.32,-0.77l1.36,-0.35l4.02,1.02l0.49,-0.3l0.35,-1.59l1.09,-0.48l3.42,1.22l1.11,-0.31l7.64,0.39l1.16,1.0l1.23,0.39Z",
        "name": "Kyrgyzstan"
      },
      "KE": {
        "path": "M506.26,284.69l1.87,-2.56l0.93,-2.15l-1.38,-4.08l-1.06,-1.6l2.82,-2.75l0.79,0.26l0.12,1.41l0.86,0.83l1.9,0.11l3.28,2.13l3.57,0.44l1.05,-1.12l1.96,-0.9l0.82,0.68l1.16,0.09l-1.78,2.45l0.03,9.12l1.3,1.94l-1.37,0.78l-0.67,1.03l-1.08,0.46l-0.34,1.67l-0.81,1.07l-0.45,1.55l-0.68,0.56l-3.2,-2.23l-0.35,-1.58l-8.86,-4.98l0.14,-1.6l-0.57,-1.04Z",
        "name": "Kenya"
      },
      "SS": {
        "path": "M481.71,263.34l1.07,-0.72l1.2,-3.18l1.36,-0.26l1.61,1.99l0.87,0.34l1.1,-0.41l1.5,0.07l0.57,0.53l2.49,0.0l0.44,-0.63l1.07,-0.4l0.45,-0.84l0.59,-0.33l1.9,1.33l1.6,-0.2l2.83,-3.33l-0.32,-2.21l1.59,-0.52l-0.24,1.6l0.3,1.83l1.35,1.18l0.2,1.87l0.35,0.41l0.02,1.53l-0.23,0.47l-1.42,0.25l-0.85,1.44l0.3,0.6l1.4,0.16l1.11,1.08l0.59,1.13l1.03,0.53l1.28,2.36l-4.41,3.98l-1.74,0.01l-1.89,0.55l-1.47,-0.52l-1.15,0.57l-2.96,-2.62l-1.3,0.49l-1.06,-0.15l-0.79,0.39l-0.82,-0.22l-1.8,-2.7l-1.91,-1.1l-0.66,-1.5l-2.62,-2.32l-0.18,-0.94l-2.37,-1.6Z",
        "name": "S. Sudan"
      },
      "SR": {
        "path": "M283.12,270.19l2.1,0.53l-1.08,1.95l0.2,1.72l0.93,1.49l-0.59,2.03l-0.43,0.71l-1.12,-0.42l-1.32,0.22l-0.93,-0.2l-0.46,0.26l-0.25,0.73l0.33,0.7l-0.89,-0.13l-1.39,-1.97l-0.31,-1.34l-0.97,-0.31l-0.89,-1.47l0.35,-1.61l1.45,-0.82l0.33,-1.87l2.61,0.44l0.57,-0.47l1.75,-0.16Z",
        "name": "Suriname"
      },
      "KH": {
        "path": "M689.52,249.39l0.49,1.45l-0.28,2.74l-4.0,1.86l-0.16,0.6l0.68,0.95l-2.06,0.17l-2.05,0.97l-1.82,-0.32l-2.12,-3.7l-0.55,-2.85l1.4,-1.85l3.02,-0.45l2.23,0.35l2.01,0.98l0.51,-0.14l0.95,-1.48l1.74,0.74Z",
        "name": "Cambodia"
      },
      "SV": {
        "path": "M195.8,250.13l1.4,-1.19l2.24,1.45l0.98,-0.27l0.44,0.2l-0.27,1.05l-1.14,-0.03l-3.64,-1.21Z",
        "name": "El Salvador"
      },
      "SK": {
        "path": "M476.82,151.17l-1.14,1.9l-2.73,-0.92l-0.82,0.2l-0.74,0.8l-3.46,0.73l-0.47,0.69l-1.76,0.33l-1.88,-1.0l-0.18,-0.81l0.38,-0.75l1.87,-0.32l1.74,-1.89l0.83,0.16l0.79,-0.34l1.51,1.04l1.34,-0.63l1.25,0.3l1.65,-0.42l1.81,0.95Z",
        "name": "Slovakia"
      },
      "KR": {
        "path": "M737.51,185.84l0.98,-0.1l0.87,-1.17l2.69,-0.32l0.33,-0.29l1.76,2.79l0.58,1.76l0.02,3.12l-0.8,1.32l-2.21,0.55l-1.93,1.13l-1.8,0.19l-0.2,-1.1l0.43,-2.28l-0.95,-2.56l1.43,-0.37l0.23,-0.62l-1.43,-2.06Z",
        "name": "Korea"
      },
      "SI": {
        "path": "M456.18,162.07l-0.51,-1.32l0.18,-1.05l1.69,0.2l1.42,-0.71l2.09,-0.07l0.62,-0.51l0.21,0.47l-1.61,0.67l-0.44,1.34l-0.66,0.24l-0.26,0.82l-1.22,-0.49l-0.84,0.46l-0.69,-0.04Z",
        "name": "Slovenia"
      },
      "KP": {
        "path": "M736.77,185.16l-0.92,-0.42l-0.88,0.62l-1.21,-0.88l0.96,-1.15l0.59,-2.59l-0.46,-0.74l-2.09,-0.77l1.64,-1.52l2.72,-1.58l1.58,-1.91l1.11,0.78l2.17,0.11l0.41,-0.5l-0.3,-1.22l3.52,-1.18l0.94,-1.4l0.98,1.08l-2.19,2.18l0.01,2.14l-1.06,0.54l-1.41,1.4l-1.7,0.52l-1.25,1.09l-0.14,1.98l0.94,0.45l1.15,1.04l-0.13,0.26l-2.6,0.29l-1.13,1.29l-1.22,0.08Z",
        "name": "Dem. Rep. Korea"
      },
      "KW": {
        "path": "M540.81,207.91l0.37,0.86l-0.17,0.76l0.6,1.53l-0.95,0.04l-0.82,-1.28l-1.57,-0.18l1.31,-1.88l1.22,0.17Z",
        "name": "Kuwait"
      },
      "SN": {
        "path": "M390.09,248.21l0.12,1.55l0.49,1.46l0.96,0.82l0.05,1.28l-1.26,-0.19l-0.75,0.33l-1.84,-0.61l-5.84,-0.13l-2.54,0.51l-0.22,-1.03l1.77,0.04l2.01,-0.91l1.03,0.48l1.09,0.04l1.29,-0.62l0.14,-0.58l-0.51,-0.74l-1.81,0.25l-1.13,-0.63l-0.79,0.04l-0.72,0.61l-2.31,0.06l-0.92,-1.77l-0.81,-0.64l0.64,-0.35l2.46,-3.74l1.04,0.19l1.38,-0.56l1.19,-0.02l2.72,1.37l3.03,3.48Z",
        "name": "Senegal"
      },
      "SL": {
        "path": "M394.46,264.11l-1.73,1.98l-0.58,1.33l-2.07,-1.06l-1.22,-1.26l-0.65,-2.39l1.16,-0.96l0.67,-1.17l1.21,-0.52l1.66,0.0l1.03,1.64l0.52,2.41Z",
        "name": "Sierra Leone"
      },
      "KZ": {
        "path": "M552.8,172.89l0.46,-1.27l-0.48,-1.05l-2.96,-1.19l-1.06,-2.58l-1.37,-0.87l-0.03,-0.3l1.95,0.23l0.45,-0.38l0.08,-1.96l1.75,-0.41l2.1,0.45l0.48,-0.33l0.45,-3.04l-0.45,-2.09l-0.41,-0.31l-2.42,0.15l-2.36,-0.73l-2.87,1.37l-2.17,0.61l-0.85,-0.34l0.13,-1.61l-1.6,-2.12l-2.02,-0.08l-1.78,-1.82l1.29,-2.18l-0.57,-0.95l1.62,-2.91l2.21,1.63l0.63,-0.27l0.29,-2.22l4.92,-3.43l3.71,-0.08l8.4,3.6l2.92,-1.36l3.77,-0.06l3.11,1.66l0.51,-0.11l0.6,-0.81l3.31,0.13l0.39,-0.25l0.63,-1.57l-0.17,-0.5l-3.5,-1.98l1.87,-1.27l-0.13,-1.03l1.98,-0.72l0.18,-0.62l-1.59,-2.06l0.81,-0.82l9.23,-1.18l1.33,-0.88l6.18,-1.26l2.26,-1.42l4.08,0.68l0.73,3.33l0.51,0.3l2.48,-0.8l2.79,1.02l-0.17,1.56l0.43,0.44l2.55,-0.24l4.89,-2.53l0.03,0.32l3.15,2.61l5.56,8.47l0.65,0.02l1.12,-1.46l3.15,1.74l3.76,-0.78l1.15,0.49l1.14,1.8l1.84,0.76l0.99,1.29l3.35,-0.25l1.02,1.52l-1.6,1.81l-1.93,0.28l-0.34,0.38l-0.11,3.05l-1.13,1.16l-4.75,-1.0l-0.46,0.27l-1.76,5.47l-1.1,0.59l-4.91,1.23l-0.27,0.54l2.1,4.97l-1.37,0.63l-0.23,0.41l0.13,1.13l-0.88,-0.25l-1.42,-1.13l-7.89,-0.4l-0.92,0.31l-3.73,-1.22l-1.42,0.63l-0.53,1.66l-3.72,-0.94l-1.85,0.43l-0.76,1.4l-4.65,2.62l-1.13,2.08l-0.44,0.01l-0.92,-1.4l-2.87,-0.09l-0.45,-2.14l-0.38,-0.32l-0.8,-0.01l0.0,-2.96l-3.0,-2.22l-7.31,0.58l-2.35,-2.68l-6.71,-3.69l-6.45,1.83l-0.29,0.39l0.1,10.85l-0.7,0.08l-1.62,-2.17l-1.83,-0.96l-3.11,0.59l-0.64,0.51Z",
        "name": "Kazakhstan"
      },
      "SA": {
        "path": "M537.53,210.34l2.0,0.24l0.9,1.32l1.49,-0.06l0.87,2.08l1.29,0.76l0.51,0.99l1.56,1.03l-0.1,1.9l0.32,0.9l1.58,2.47l0.76,0.53l0.7,-0.04l1.68,4.23l7.53,1.33l0.51,-0.29l0.77,1.25l-1.55,4.87l-7.29,2.52l-7.3,1.03l-2.34,1.17l-1.88,2.74l-0.76,0.28l-0.82,-0.78l-0.91,0.12l-2.88,-0.51l-3.51,0.25l-0.86,-0.56l-0.57,0.15l-0.66,1.27l0.16,1.11l-0.43,0.32l-0.93,-1.4l-0.33,-1.16l-1.23,-0.88l-1.27,-2.06l-0.78,-2.22l-1.73,-1.79l-1.14,-0.48l-1.54,-2.31l-0.21,-3.41l-1.44,-2.93l-1.27,-1.16l-1.33,-0.57l-1.31,-3.37l-0.77,-0.67l-0.97,-1.97l-2.8,-4.03l-1.06,-0.17l0.37,-1.96l0.2,-0.72l2.74,0.3l1.08,-0.84l0.6,-0.94l1.74,-0.35l0.65,-1.03l0.71,-0.4l0.1,-0.62l-2.06,-2.28l4.39,-1.22l0.48,-0.37l2.77,0.69l3.66,1.9l7.03,5.5l4.87,0.3Z",
        "name": "Saudi Arabia"
      },
      "SE": {
        "path": "M480.22,89.3l-4.03,1.17l-2.43,2.86l0.26,2.57l-8.77,6.64l-1.78,5.79l1.78,2.68l2.22,1.96l-2.07,3.77l-2.72,1.13l-0.95,6.04l-1.29,3.01l-2.74,-0.31l-0.4,0.22l-1.31,2.59l-2.34,0.13l-0.75,-3.09l-2.08,-4.03l-1.83,-4.96l1.0,-1.93l2.14,-2.7l0.83,-4.45l-1.6,-2.17l-0.15,-4.94l1.48,-3.39l2.58,-0.15l0.87,-1.59l-0.78,-1.57l3.76,-5.59l4.04,-7.48l2.17,0.01l0.39,-0.29l0.57,-2.07l4.37,0.64l0.46,-0.34l0.33,-2.56l1.1,-0.13l6.94,4.87l0.06,6.32l0.66,1.36Z",
        "name": "Sweden"
      },
      "SD": {
        "path": "M505.98,259.4l-0.34,-0.77l-1.17,-0.9l-0.26,-1.61l0.29,-1.81l-0.34,-0.46l-1.16,-0.17l-0.54,0.59l-1.23,0.11l-0.28,0.65l0.53,0.65l0.17,1.22l-2.44,3.0l-0.96,0.19l-2.39,-1.4l-0.95,0.52l-0.38,0.78l-1.11,0.41l-0.29,0.5l-1.94,0.0l-0.54,-0.52l-1.81,-0.09l-0.95,0.4l-2.45,-2.35l-2.07,0.54l-0.73,1.26l-0.6,2.1l-1.25,0.58l-0.75,-0.62l0.27,-2.65l-1.48,-1.78l-0.22,-1.48l-0.92,-0.96l-0.02,-1.29l-0.57,-1.16l-0.68,-0.16l0.69,-1.29l-0.18,-1.14l0.65,-0.62l0.03,-0.55l-0.36,-0.41l1.55,-2.97l1.91,0.16l0.43,-0.4l-0.1,-10.94l2.49,-0.01l0.4,-0.4l-0.0,-4.82l29.02,0.0l0.64,2.04l-0.49,0.66l0.36,2.69l0.93,3.16l2.12,1.55l-0.89,1.04l-1.72,0.39l-0.98,0.9l-1.43,5.65l0.24,1.15l-0.38,2.06l-0.96,2.38l-1.53,1.31l-1.32,2.91l-1.22,0.86l-0.37,1.34Z",
        "name": "Sudan"
      },
      "DO": {
        "path": "M241.8,239.2l0.05,-0.65l-0.46,-0.73l0.42,-0.44l0.19,-1.0l-0.09,-1.53l1.66,0.01l1.99,0.63l0.33,0.67l1.28,0.19l0.33,0.76l1.0,0.08l0.8,0.62l-0.45,0.51l-1.13,-0.47l-1.88,-0.01l-1.27,0.59l-0.75,-0.55l-1.01,0.54l-0.79,1.4l-0.23,-0.61Z",
        "name": "Dominican Rep."
      },
      "DJ": {
        "path": "M528.43,256.18l-0.45,0.66l-0.58,-0.25l-1.51,0.13l-0.18,-1.01l1.45,-1.95l0.83,0.17l0.77,-0.44l0.2,1.0l-1.2,0.51l-0.06,0.7l0.73,0.47Z",
        "name": "Djibouti"
      },
      "DK": {
        "path": "M452.28,129.07l-1.19,2.24l-2.13,-1.6l-0.23,-0.95l2.98,-0.95l0.57,1.26ZM447.74,126.31l-0.26,0.57l-0.88,-0.07l-1.8,2.53l0.48,1.69l-1.09,0.36l-1.61,-0.39l-0.89,-1.69l-0.07,-3.43l0.96,-1.73l2.02,-0.2l1.09,-1.07l1.33,-0.67l-0.05,1.06l-0.73,1.41l0.3,1.0l1.2,0.64Z",
        "name": "Denmark"
      },
      "DE": {
        "path": "M453.14,155.55l-0.55,-0.36l-1.2,-0.1l-1.87,0.57l-2.13,-0.13l-0.56,0.63l-0.86,-0.6l-0.96,0.09l-2.57,-0.93l-0.85,0.67l-1.47,-0.02l0.24,-1.75l1.23,-2.14l-0.28,-0.59l-3.52,-0.58l-0.92,-0.66l0.12,-1.2l-0.48,-0.88l0.27,-2.17l-0.37,-3.03l1.41,-0.22l0.63,-1.26l0.66,-3.19l-0.41,-1.18l0.26,-0.39l1.66,-0.15l0.33,0.54l0.62,0.07l1.7,-1.69l-0.54,-3.02l1.37,0.33l1.31,-0.37l0.31,1.18l2.25,0.71l-0.02,0.92l0.5,0.4l2.55,-0.65l1.34,-0.87l2.57,1.24l1.06,0.98l0.48,1.44l-0.57,0.74l-0.0,0.48l0.87,1.15l0.57,1.64l-0.14,1.29l0.82,1.7l-1.5,-0.07l-0.56,0.57l-4.47,2.15l-0.22,0.54l0.68,2.26l2.58,2.16l-0.66,1.11l-0.79,0.36l-0.23,0.43l0.32,1.87Z",
        "name": "Germany"
      },
      "YE": {
        "path": "M528.27,246.72l0.26,-0.42l-0.22,-1.01l0.19,-1.5l0.92,-0.69l-0.07,-1.35l0.39,-0.75l1.01,0.47l3.34,-0.27l3.76,0.41l0.95,0.81l1.36,-0.58l1.74,-2.62l2.18,-1.09l6.86,-0.94l2.48,5.41l-1.64,0.76l-0.56,1.9l-6.23,2.16l-2.29,1.8l-1.93,0.05l-1.41,1.02l-4.24,0.74l-1.72,1.49l-3.28,0.19l-0.52,-1.18l0.02,-1.51l-1.34,-3.29Z",
        "name": "Yemen"
      },
      "DZ": {
        "path": "M441.46,188.44l-0.32,1.07l0.39,2.64l-0.54,2.16l-1.58,1.82l0.37,2.39l1.91,1.55l0.18,0.8l1.42,1.03l1.84,7.23l0.12,1.16l-0.57,5.0l0.2,1.51l-0.87,0.99l-0.02,0.51l1.41,1.86l0.14,1.2l0.89,1.48l0.5,0.16l0.98,-0.41l1.73,1.08l0.82,1.23l-8.22,4.81l-7.23,5.11l-3.43,1.13l-2.3,0.21l-0.28,-1.59l-2.56,-1.09l-0.67,-1.25l-26.12,-17.86l0.01,-3.47l3.77,-1.88l2.44,-0.41l2.12,-0.75l1.08,-1.42l2.81,-1.05l0.35,-2.08l1.33,-0.29l1.04,-0.94l3.47,-0.69l0.46,-1.08l-0.1,-0.45l-0.58,-0.52l-0.82,-2.81l-0.19,-1.83l-0.78,-1.49l2.03,-1.31l2.63,-0.48l1.7,-1.22l2.31,-0.84l8.24,-0.73l1.49,0.38l2.28,-1.1l2.46,-0.02l0.92,0.6l1.35,-0.05Z",
        "name": "Algeria"
      },
      "US": {
        "path": "M892.72,99.2l1.31,0.53l1.41,-0.37l1.89,0.98l1.89,0.42l-1.32,0.58l-2.9,-1.53l-2.08,0.22l-0.26,-0.15l0.07,-0.67ZM183.22,150.47l0.37,1.47l1.12,0.85l4.23,0.7l2.39,0.98l2.17,-0.38l1.85,0.5l-1.55,0.65l-3.49,2.61l-0.16,0.77l0.5,0.39l2.33,-0.61l1.77,1.02l5.15,-2.4l-0.31,0.65l0.25,0.56l1.36,0.38l1.71,1.16l4.7,-0.88l0.67,0.85l1.31,0.21l0.58,0.58l-1.34,0.17l-2.18,-0.32l-3.6,0.89l-2.71,3.25l0.35,0.9l0.59,-0.0l0.55,-0.6l-1.36,4.65l0.29,3.09l0.67,1.58l0.61,0.45l1.77,-0.44l1.6,-1.96l0.14,-2.21l-0.82,-1.96l0.11,-1.13l1.19,-2.37l0.44,-0.33l0.48,0.75l0.4,-0.29l0.4,-1.37l0.6,-0.47l0.24,-0.8l1.69,0.49l1.65,1.08l-0.03,2.37l-1.27,1.13l-0.0,1.13l0.87,0.36l1.66,-1.29l0.5,0.17l0.5,2.6l-2.49,3.75l0.17,0.61l1.54,0.62l1.48,0.17l1.92,-0.44l4.72,-2.15l2.16,-1.8l-0.05,-1.24l0.75,-0.22l3.92,0.36l2.12,-1.05l0.21,-0.4l-0.28,-1.48l3.27,-2.4l8.32,-0.02l0.56,-0.82l1.9,-0.77l0.93,-1.51l0.74,-2.37l1.58,-1.98l0.92,0.62l1.47,-0.47l0.8,0.66l-0.0,4.09l1.96,2.6l-2.34,1.31l-5.37,2.09l-1.83,2.72l0.02,1.79l0.83,1.59l0.54,0.23l-6.19,0.94l-2.2,0.89l-0.23,0.48l0.45,0.29l2.99,-0.46l-2.19,0.56l-1.13,0.0l-0.15,-0.32l-0.48,0.08l-0.76,0.82l0.22,0.67l0.32,0.06l-0.41,1.62l-1.27,1.58l-1.48,-1.07l-0.49,-0.04l-0.16,0.46l0.52,1.58l0.61,0.59l0.03,0.79l-0.95,1.38l-1.21,-1.22l-0.27,-2.27l-0.35,-0.35l-0.42,0.25l-0.48,1.27l0.33,1.41l-0.97,-0.27l-0.48,0.24l0.18,0.5l1.52,0.83l0.1,2.52l0.79,0.51l0.52,3.42l-1.42,1.88l-2.47,0.8l-1.71,1.66l-1.31,0.25l-1.27,1.03l-0.43,0.99l-2.69,1.78l-2.64,3.03l-0.45,2.12l0.45,2.08l0.85,2.38l1.09,1.9l0.04,1.2l1.16,3.06l-0.18,2.69l-0.55,1.43l-0.47,0.21l-0.89,-0.23l-0.49,-1.18l-0.87,-0.56l-2.75,-5.16l0.48,-1.68l-0.72,-1.78l-2.01,-2.38l-1.12,-0.53l-2.72,1.18l-1.47,-1.35l-1.57,-0.68l-2.99,0.31l-2.17,-0.3l-2.0,0.19l-1.15,0.46l-0.19,0.58l0.39,0.63l0.14,1.34l-0.84,-0.2l-0.84,0.46l-1.58,-0.07l-2.08,-1.44l-2.09,0.33l-1.91,-0.62l-3.73,0.84l-2.39,2.07l-2.54,1.22l-1.45,1.41l-0.61,1.38l0.34,3.71l-0.29,0.02l-3.5,-1.33l-1.25,-3.11l-1.44,-1.5l-2.24,-3.56l-1.76,-1.09l-2.27,-0.01l-1.71,2.07l-1.76,-0.69l-1.16,-0.74l-1.52,-2.98l-3.93,-3.16l-4.34,-0.0l-0.4,0.4l-0.0,0.74l-6.5,0.02l-9.02,-3.14l-0.34,-0.71l-5.7,0.49l-0.43,-1.29l-1.62,-1.61l-1.14,-0.38l-0.55,-0.88l-1.28,-0.13l-1.01,-0.77l-2.22,-0.27l-0.43,-0.3l-0.36,-1.58l-2.4,-2.83l-2.01,-3.85l-0.06,-0.9l-2.92,-3.26l-0.33,-2.29l-1.3,-1.66l0.52,-2.37l-0.09,-2.57l-0.78,-2.3l0.95,-2.82l0.61,-5.68l-0.47,-4.27l-1.46,-4.08l3.19,0.79l1.26,2.83l0.69,0.08l0.69,-1.14l-1.1,-4.79l68.76,-0.0l0.4,-0.4l0.14,-0.86ZM32.44,67.52l1.73,1.97l0.55,0.05l0.99,-0.79l3.65,0.24l-0.09,0.62l0.32,0.45l3.83,0.77l2.61,-0.43l5.19,1.4l4.84,0.43l1.89,0.57l3.42,-0.7l6.14,1.87l-0.03,38.06l0.38,0.4l2.39,0.11l2.31,0.98l3.9,3.99l0.55,0.04l2.4,-2.03l2.16,-1.04l1.2,1.71l3.95,3.14l4.09,6.63l4.2,2.29l0.06,1.83l-1.02,1.23l-1.16,-1.08l-2.04,-1.03l-0.67,-2.89l-3.28,-3.03l-1.65,-3.57l-6.35,-0.32l-2.82,-1.01l-5.26,-3.85l-6.77,-2.04l-3.53,0.3l-4.81,-1.69l-3.25,-1.63l-2.78,0.8l-0.28,0.46l0.44,2.21l-3.91,0.96l-2.26,1.27l-2.3,0.65l-0.27,-1.65l1.05,-3.42l2.49,-1.09l0.16,-0.6l-0.69,-0.96l-0.55,-0.1l-3.19,2.12l-1.78,2.56l-3.55,2.61l-0.04,0.61l1.56,1.52l-2.07,2.29l-5.11,2.57l-0.77,1.66l-3.76,1.77l-0.92,1.73l-2.69,1.38l-1.81,-0.22l-6.95,3.32l-3.97,0.91l4.85,-2.5l2.59,-1.86l3.26,-0.52l1.19,-1.4l3.42,-2.1l2.59,-2.27l0.42,-2.68l1.23,-2.1l-0.04,-0.46l-0.45,-0.11l-2.68,1.03l-0.63,-0.49l-0.53,0.03l-1.05,1.04l-1.36,-1.54l-0.66,0.08l-0.32,0.62l-0.58,-1.14l-0.56,-0.16l-2.41,1.42l-1.07,-0.0l-0.17,-1.75l0.3,-1.71l-1.61,-1.33l-3.41,0.59l-1.96,-1.63l-1.57,-0.84l-0.15,-2.21l-1.7,-1.43l0.82,-1.88l1.99,-2.12l0.88,-1.92l1.71,-0.24l2.04,0.51l1.87,-1.77l1.91,0.25l1.91,-1.23l0.17,-0.43l-0.47,-1.82l-1.07,-0.7l1.39,-1.17l0.12,-0.45l-0.39,-0.26l-1.65,0.07l-2.66,0.88l-0.75,0.78l-1.92,-0.8l-3.46,0.44l-3.44,-0.91l-1.06,-1.61l-2.65,-1.99l2.91,-1.43l5.5,-2.0l1.52,0.0l-0.26,1.62l0.41,0.46l5.29,-0.16l0.3,-0.65l-2.03,-2.59l-3.14,-1.68l-1.79,-2.12l-2.4,-1.83l-3.09,-1.24l1.04,-1.69l4.23,-0.14l3.36,-2.07l0.73,-2.27l2.39,-1.99l2.42,-0.52l4.65,-1.97l2.46,0.23l3.71,-2.35l3.5,0.89ZM37.6,123.41l-2.25,1.23l-0.95,-0.69l-0.29,-1.24l3.21,-1.63l1.42,0.21l0.67,0.7l-1.8,1.42ZM31.06,234.03l0.98,0.47l0.74,0.87l-1.77,1.07l-0.44,-1.53l0.49,-0.89ZM29.34,232.07l0.18,0.05l0.08,0.05l-0.16,0.03l-0.11,-0.14ZM25.16,230.17l0.05,-0.03l0.18,0.22l-0.13,-0.01l-0.1,-0.18ZM5.89,113.26l-1.08,0.41l-2.21,-1.12l1.53,-0.4l1.62,0.28l0.14,0.83Z",
        "name": "United States"
      },
      "UY": {
        "path": "M286.85,372.74l-0.92,1.5l-2.59,1.44l-1.69,-0.52l-1.42,0.26l-2.39,-1.19l-1.52,0.08l-1.27,-1.3l0.16,-1.5l0.56,-0.79l-0.02,-2.73l1.21,-4.74l1.19,-0.21l2.37,2.0l1.08,0.03l4.36,3.17l1.22,1.6l-0.96,1.5l0.61,1.4Z",
        "name": "Uruguay"
      },
      "LB": {
        "path": "M510.37,198.01l-0.88,0.51l1.82,-3.54l0.62,0.08l0.22,0.61l-1.13,0.88l-0.65,1.47Z",
        "name": "Lebanon"
      },
      "LA": {
        "path": "M689.54,248.53l-1.76,-0.74l-0.49,0.15l-0.94,1.46l-1.32,-0.64l0.62,-0.98l0.11,-2.17l-2.04,-2.42l-0.25,-2.65l-1.9,-2.1l-2.15,-0.31l-0.78,0.91l-1.12,0.06l-1.05,-0.4l-2.06,1.2l-0.04,-1.59l0.61,-2.68l-0.36,-0.49l-1.35,-0.1l-0.11,-1.23l-0.96,-0.88l1.96,-1.89l0.39,0.36l1.33,0.07l0.42,-0.45l-0.34,-2.66l0.7,-0.21l1.28,1.81l1.11,2.35l0.36,0.23l2.82,0.02l0.71,1.67l-1.39,0.65l-0.72,0.93l0.13,0.6l2.91,1.51l3.6,5.25l1.88,1.78l0.56,1.62l-0.35,1.96Z",
        "name": "Lao PDR"
      },
      "TW": {
        "path": "M724.01,226.68l-0.74,1.48l-0.9,-1.52l-0.25,-1.74l1.38,-2.44l1.73,-1.74l0.64,0.44l-1.85,5.52Z",
        "name": "Taiwan"
      },
      "TT": {"path": "M266.64,259.32l0.28,-1.16l1.13,-0.22l-0.06,1.2l-1.35,0.18Z", "name": "Trinidad and Tobago"},
      "TR": {
        "path": "M513.21,175.47l3.64,1.17l3.05,-0.44l2.1,0.26l3.11,-1.56l2.46,-0.13l2.19,1.33l0.33,0.82l-0.22,1.33l0.25,0.44l2.28,1.13l-1.17,0.57l-0.21,0.45l0.75,3.2l-0.41,1.16l1.13,1.92l-0.55,0.22l-0.9,-0.67l-2.91,-0.37l-1.24,0.46l-4.23,0.41l-2.81,1.05l-1.91,0.01l-1.52,-0.53l-2.58,0.75l-0.66,-0.45l-0.62,0.3l-0.12,1.45l-0.89,0.84l-0.47,-0.67l0.79,-1.3l-0.41,-0.2l-1.43,0.23l-2.0,-0.63l-2.02,1.65l-3.51,0.3l-2.13,-1.53l-2.7,-0.1l-0.86,1.24l-1.38,0.27l-2.29,-1.44l-2.71,-0.01l-1.37,-2.65l-1.68,-1.52l1.07,-1.99l-0.09,-0.49l-1.27,-1.12l2.37,-2.41l3.7,-0.11l1.28,-2.24l4.49,0.37l3.21,-1.97l2.81,-0.82l3.99,-0.06l4.29,2.07ZM488.79,176.72l-1.72,1.31l-0.5,-0.88l1.37,-2.57l-0.7,-0.85l1.7,-0.63l1.8,0.34l0.46,1.17l1.76,0.78l-2.87,0.32l-1.3,1.01Z",
        "name": "Turkey"
      },
      "LK": {
        "path": "M624.16,268.99l-1.82,0.48l-0.99,-1.67l-0.42,-3.46l0.95,-3.43l1.21,0.98l2.26,4.19l-0.34,2.33l-0.85,0.58Z",
        "name": "Sri Lanka"
      },
      "LV": {
        "path": "M489.16,122.85l0.96,0.66l0.22,1.65l0.68,1.76l-3.65,1.7l-2.23,-1.58l-1.29,-0.26l-0.68,-0.77l-2.42,0.34l-4.16,-0.23l-2.47,0.9l0.06,-1.98l1.13,-2.06l1.95,-1.02l2.12,2.58l2.01,-0.07l0.38,-0.33l0.44,-2.52l1.76,-0.53l3.06,1.7l2.15,0.07Z",
        "name": "Latvia"
      },
      "LT": {
        "path": "M486.93,129.3l0.17,1.12l-1.81,0.98l-0.72,2.02l-2.47,1.18l-2.1,-0.02l-0.73,-1.05l-1.06,-0.3l-0.09,-1.87l-3.56,-1.13l-0.43,-2.36l2.48,-0.94l4.12,0.22l2.25,-0.31l0.52,0.69l1.24,0.21l2.19,1.56Z",
        "name": "Lithuania"
      },
      "LU": {"path": "M436.08,149.45l-0.48,-0.07l0.3,-1.28l0.27,0.4l-0.09,0.96Z", "name": "Luxembourg"},
      "LR": {
        "path": "M399.36,265.97l0.18,1.54l-0.48,0.99l0.08,0.47l2.47,1.8l-0.33,2.8l-2.65,-1.13l-5.78,-4.61l0.58,-1.32l2.1,-2.33l0.86,-0.22l0.77,1.14l-0.14,0.85l0.59,0.87l1.0,0.14l0.76,-0.99Z",
        "name": "Liberia"
      },
      "LS": {
        "path": "M491.06,363.48l-0.49,0.15l-1.49,-1.67l1.1,-1.43l2.19,-1.44l1.51,1.27l-0.98,1.82l-1.23,0.38l-0.62,0.93Z",
        "name": "Lesotho"
      },
      "TH": {
        "path": "M670.27,255.86l-1.41,3.87l0.15,2.0l0.38,0.36l1.38,0.07l0.9,2.04l0.55,2.34l1.4,1.44l1.61,0.38l0.96,0.97l-0.5,0.64l-1.1,0.2l-0.34,-1.18l-2.04,-1.1l-0.63,0.23l-0.63,-0.62l-0.48,-1.3l-2.56,-2.63l-0.73,0.41l0.95,-3.89l2.16,-4.22ZM670.67,254.77l-0.92,-2.18l-0.26,-2.61l-2.14,-3.06l0.71,-0.49l0.89,-2.59l-3.61,-5.45l0.87,-0.51l1.05,-2.58l1.74,-0.18l2.6,-1.59l0.76,0.56l0.13,1.39l0.37,0.36l1.23,0.09l-0.51,2.28l0.05,2.42l0.6,0.34l2.43,-1.42l0.77,0.39l1.47,-0.07l0.71,-0.88l1.48,0.14l1.71,1.88l0.25,2.65l1.92,2.11l-0.1,1.89l-0.61,0.86l-2.22,-0.33l-3.5,0.64l-1.6,2.12l0.36,2.58l-1.51,-0.79l-1.84,-0.01l0.28,-1.52l-0.4,-0.47l-2.21,0.01l-0.4,0.37l-0.19,2.74l-0.34,0.93Z",
        "name": "Thailand"
      },
      "TF": {
        "path": "M596.68,420.38l-3.2,0.18l-0.05,-1.26l0.39,-1.41l1.3,0.78l2.08,0.35l-0.52,1.36Z",
        "name": "Fr. S. Antarctic Lands"
      },
      "TG": {
        "path": "M422.7,257.63l-0.09,1.23l1.53,1.52l0.08,1.09l0.5,0.65l-0.11,5.62l0.49,1.47l-1.31,0.35l-1.02,-2.13l-0.18,-1.12l0.53,-2.19l-0.63,-1.16l-0.22,-3.68l-1.01,-1.4l0.07,-0.28l1.37,0.03Z",
        "name": "Togo"
      },
      "TD": {
        "path": "M480.25,235.49l0.12,9.57l-2.1,0.05l-1.14,1.89l-0.69,1.63l0.34,0.73l-0.66,0.91l0.24,0.89l-0.86,1.95l0.45,0.5l0.6,-0.1l0.34,0.64l0.03,1.38l0.9,1.04l-1.45,0.43l-1.27,1.03l-1.83,2.76l-2.16,1.07l-2.31,-0.15l-0.86,0.25l-0.26,0.49l0.17,0.61l-2.11,1.68l-2.85,0.87l-1.09,-0.57l-0.73,0.66l-1.12,0.1l-1.1,-3.12l-1.25,-0.64l-1.22,-1.22l0.29,-0.64l3.01,0.04l0.35,-0.6l-1.3,-2.2l-0.08,-3.31l-0.97,-1.66l0.22,-1.04l-0.38,-0.48l-1.22,-0.04l0.0,-1.25l-0.98,-1.07l0.96,-3.01l3.25,-2.65l0.13,-3.33l0.95,-5.18l0.52,-1.07l-0.1,-0.48l-0.91,-0.78l-0.2,-0.96l-0.8,-0.58l-0.55,-3.65l2.1,-1.2l19.57,9.83Z",
        "name": "Chad"
      },
      "LY": {
        "path": "M483.48,203.15l-0.75,1.1l0.29,1.39l-0.6,1.83l0.73,2.14l0.0,24.12l-2.48,0.01l-0.41,0.85l-19.41,-9.76l-4.41,2.28l-1.37,-1.33l-3.82,-1.1l-1.14,-1.65l-1.98,-1.23l-1.22,0.32l-0.66,-1.11l-0.17,-1.26l-1.28,-1.69l0.87,-1.19l-0.07,-4.34l0.43,-2.27l-0.86,-3.45l1.13,-0.76l0.22,-1.16l-0.2,-1.03l3.48,-2.61l0.29,-1.94l2.45,0.8l1.18,-0.21l1.98,0.44l3.15,1.18l1.37,2.54l5.72,1.67l2.64,1.35l1.61,-0.72l1.29,-1.34l-0.44,-2.34l0.66,-1.13l1.67,-1.21l1.57,-0.35l3.14,0.53l1.08,1.28l3.99,0.78l0.36,0.54Z",
        "name": "Libya"
      },
      "AE": {
        "path": "M550.76,223.97l1.88,-0.4l3.84,0.02l4.78,-4.75l0.19,0.36l0.26,1.58l-0.81,0.01l-0.39,0.35l-0.08,2.04l-0.81,0.63l-0.01,0.96l-0.66,0.99l-0.39,1.41l-7.08,-1.25l-0.7,-1.96Z",
        "name": "United Arab Emirates"
      },
      "VE": {
        "path": "M240.68,256.69l0.53,0.75l-0.02,1.06l-1.07,1.78l0.95,2.0l0.42,0.22l1.4,-0.44l0.56,-1.83l-0.77,-1.17l-0.1,-1.47l2.82,-0.93l0.26,-0.49l-0.28,-0.96l0.3,-0.28l0.66,1.31l1.96,0.26l1.4,1.22l0.08,0.68l0.39,0.35l4.81,-0.22l1.49,1.11l1.92,0.31l1.67,-0.84l0.22,-0.6l3.44,-0.14l-0.17,0.55l0.86,1.19l2.19,0.35l1.67,1.1l0.37,1.86l0.41,0.32l1.55,0.17l-1.66,1.35l-0.22,0.92l0.65,0.97l-1.67,0.54l-0.3,0.4l0.04,0.99l-0.56,0.57l-0.01,0.55l1.85,2.27l-0.66,0.69l-4.47,1.29l-0.72,0.54l-3.69,-0.9l-0.71,0.27l-0.02,0.7l0.91,0.53l-0.08,1.54l0.35,1.58l0.35,0.31l1.66,0.17l-1.3,0.52l-0.48,1.13l-2.68,0.91l-0.6,0.77l-1.57,0.13l-1.17,-1.13l-0.8,-2.52l-1.25,-1.26l1.02,-1.23l-1.29,-2.95l0.18,-1.62l1.0,-2.21l-0.2,-0.49l-1.14,-0.46l-4.02,0.36l-1.82,-2.1l-1.57,-0.33l-2.99,0.22l-1.06,-0.97l0.25,-1.23l-0.2,-1.01l-0.59,-0.69l-0.29,-1.06l-1.08,-0.39l0.78,-2.79l1.9,-2.11Z",
        "name": "Venezuela"
      },
      "AF": {
        "path": "M600.7,188.88l-1.57,1.3l-0.1,0.48l0.8,2.31l-1.09,1.04l-0.03,1.27l-0.48,0.71l-2.16,-0.08l-0.37,0.59l0.78,1.48l-1.38,0.69l-1.06,1.69l0.06,1.7l-0.65,0.52l-0.91,-0.21l-1.91,0.36l-0.48,0.77l-1.88,0.13l-1.4,1.56l-0.18,2.32l-2.91,1.02l-1.65,-0.23l-0.71,0.55l-1.41,-0.3l-2.41,0.39l-3.52,-1.17l1.96,-2.35l-0.21,-1.78l-0.3,-0.34l-1.63,-0.4l-0.19,-1.58l-0.75,-2.03l0.95,-1.36l-0.19,-0.6l-0.73,-0.28l1.47,-4.8l2.14,0.9l2.12,-0.36l0.74,-1.34l1.77,-0.39l1.54,-0.92l0.63,-2.31l1.87,-0.5l0.49,-0.81l0.94,0.56l2.13,0.11l2.55,0.92l1.95,-0.83l0.65,0.43l0.56,-0.13l0.69,-1.12l1.57,-0.08l0.72,-1.66l0.79,-0.74l0.8,0.39l-0.17,0.56l0.71,0.58l-0.08,2.39l1.11,0.95ZM601.37,188.71l1.73,-0.71l1.43,-1.18l4.03,0.35l-2.23,0.74l-4.95,0.8Z",
        "name": "Afghanistan"
      },
      "IQ": {
        "path": "M530.82,187.47l0.79,0.66l1.26,-0.28l1.46,3.08l1.63,0.94l0.14,1.23l-1.22,1.05l-0.53,2.52l1.73,2.67l3.12,1.62l1.15,1.88l-0.38,1.85l0.39,0.48l0.41,-0.0l0.02,1.07l0.76,0.94l-2.47,-0.1l-1.71,2.44l-4.31,-0.2l-7.02,-5.48l-3.73,-1.94l-2.88,-0.73l-0.85,-2.87l5.45,-3.02l0.95,-3.43l-0.19,-1.96l1.27,-0.7l1.22,-1.7l0.87,-0.36l2.69,0.34Z",
        "name": "Iraq"
      },
      "IS": {
        "path": "M384.14,88.06l-0.37,2.61l2.54,2.51l-2.9,2.75l-9.19,3.4l-9.25,-1.66l1.7,-1.22l-0.1,-0.7l-4.05,-1.47l2.96,-0.53l0.33,-0.43l-0.11,-1.2l-0.33,-0.36l-4.67,-0.85l1.28,-2.04l3.45,-0.56l3.77,2.72l0.44,0.02l3.64,-2.16l3.3,1.08l3.98,-2.16l3.58,0.26Z",
        "name": "Iceland"
      },
      "IR": {
        "path": "M533.43,187.16l-1.27,-2.15l0.42,-0.98l-0.71,-3.04l1.03,-0.5l0.33,0.83l1.26,1.35l2.05,0.51l1.11,-0.16l2.89,-2.11l0.62,-0.14l0.39,0.46l-0.72,1.2l0.06,0.49l1.56,1.53l0.65,0.04l0.67,1.81l2.56,0.83l1.87,1.48l3.69,0.49l3.91,-0.76l0.47,-0.73l2.17,-0.6l1.66,-1.54l1.51,0.08l1.18,-0.53l1.59,0.24l2.83,1.48l1.88,0.3l2.77,2.47l1.77,0.18l0.18,1.99l-1.68,5.49l0.24,0.5l0.61,0.23l-0.82,1.48l0.8,2.18l0.19,1.71l0.3,0.34l1.63,0.4l0.15,1.32l-2.15,2.35l-0.01,0.53l2.21,3.03l2.34,1.24l0.06,2.14l1.24,0.72l0.11,0.69l-3.31,1.27l-1.08,3.03l-9.68,-1.68l-0.99,-3.05l-1.43,-0.73l-2.17,0.46l-2.47,1.26l-2.83,-0.82l-2.46,-2.02l-2.41,-0.8l-3.42,-6.06l-0.48,-0.2l-1.18,0.39l-1.44,-0.82l-0.5,0.08l-0.65,0.74l-0.97,-1.01l-0.02,-1.31l-0.71,-0.39l0.26,-1.81l-1.29,-2.11l-3.13,-1.63l-1.58,-2.43l0.5,-1.9l1.31,-1.26l-0.19,-1.66l-1.74,-1.1l-1.57,-3.3Z",
        "name": "Iran"
      },
      "AM": {
        "path": "M536.99,182.33l-0.28,0.03l-1.23,-2.13l-0.93,0.01l-0.62,-0.66l-0.69,-0.07l-0.96,-0.81l-1.56,-0.62l0.19,-1.12l-0.26,-0.79l2.72,-0.36l1.09,1.01l-0.17,0.92l1.02,0.78l-0.47,0.62l0.08,0.56l2.04,1.23l0.04,1.4Z",
        "name": "Armenia"
      },
      "AL": {
        "path": "M470.32,171.8l0.74,0.03l0.92,0.89l-0.17,1.95l0.36,1.28l1.01,0.82l-1.82,2.83l-0.19,-0.61l-1.25,-0.89l-0.18,-1.2l0.53,-2.82l-0.54,-1.47l0.6,-0.83Z",
        "name": "Albania"
      },
      "AO": {
        "path": "M461.55,300.03l1.26,3.15l1.94,2.36l2.47,-0.53l1.25,0.32l0.44,-0.18l0.93,-1.92l1.31,-0.08l0.41,-0.44l0.47,-0.0l-0.1,0.41l0.39,0.49l2.65,-0.02l0.03,1.19l0.48,1.01l-0.34,1.52l0.18,1.55l0.83,1.04l-0.13,2.85l0.54,0.39l3.96,-0.41l-0.1,1.79l0.39,1.05l-0.24,1.43l-4.7,-0.03l-0.4,0.39l-0.12,8.13l2.92,3.49l-3.83,0.88l-5.89,-0.36l-1.88,-1.24l-10.47,0.22l-1.3,-1.01l-1.85,-0.16l-2.4,0.77l-0.15,-1.06l0.33,-2.16l1.0,-3.45l1.35,-3.2l2.24,-2.8l0.33,-2.06l-0.13,-1.53l-0.8,-1.08l-1.21,-2.87l0.87,-1.62l-1.27,-4.12l-1.17,-1.53l2.47,-0.63l7.03,0.03ZM451.71,298.87l-0.47,-1.25l1.25,-1.11l0.32,0.3l-0.99,1.03l-0.12,1.03Z",
        "name": "Angola"
      },
      "AR": {
        "path": "M249.29,428.93l-2.33,-0.52l-5.83,-0.43l-0.89,-1.66l0.05,-2.37l-0.45,-0.4l-1.43,0.18l-0.67,-0.91l-0.2,-3.13l1.88,-1.47l0.79,-2.04l-0.25,-1.7l1.3,-2.68l0.91,-4.15l-0.22,-1.69l0.85,-0.45l0.2,-0.44l-0.27,-1.16l-0.98,-0.68l0.59,-0.92l-0.05,-0.5l-1.04,-1.07l-0.52,-3.1l0.97,-0.86l-0.42,-3.58l1.2,-5.43l1.38,-0.98l0.16,-0.43l-0.75,-2.79l-0.01,-2.43l1.78,-1.75l0.06,-2.57l1.43,-2.85l0.01,-2.58l-0.69,-0.74l-1.09,-4.52l1.47,-2.7l-0.18,-2.79l0.85,-2.35l1.59,-2.46l1.73,-1.64l0.05,-0.52l-0.6,-0.84l0.44,-0.85l-0.07,-4.19l2.7,-1.44l0.86,-2.75l-0.21,-0.71l1.76,-2.01l2.9,0.57l1.38,1.78l0.68,-0.08l0.87,-1.87l2.39,0.09l4.95,4.77l2.17,0.49l3.0,1.92l2.47,1.0l0.25,0.82l-2.37,3.93l0.23,0.59l5.39,1.16l2.12,-0.44l2.45,-2.16l0.5,-2.38l0.76,-0.31l0.98,1.2l-0.04,1.8l-3.67,2.51l-2.85,2.66l-3.43,3.88l-1.3,5.07l0.01,2.72l-0.54,0.73l-0.36,3.28l3.14,2.64l-0.16,2.11l1.4,1.11l-0.1,1.09l-2.29,3.52l-3.55,1.49l-4.92,0.6l-2.71,-0.29l-0.43,0.51l0.5,1.65l-0.49,2.1l0.38,1.42l-1.19,0.83l-2.36,0.38l-2.3,-1.04l-1.38,0.83l0.41,3.64l1.69,0.91l1.4,-0.71l0.36,0.76l-2.04,0.86l-2.01,1.89l-0.97,4.63l-2.34,0.1l-2.09,1.78l-0.61,2.75l2.46,2.31l2.17,0.63l-0.7,2.32l-2.83,1.73l-1.73,3.86l-2.17,1.22l-1.16,1.67l0.75,3.76l1.04,1.28ZM256.71,438.88l-2.0,0.15l-1.4,-1.22l-3.82,-0.1l-0.0,-5.83l1.6,3.05l3.26,2.07l3.08,0.78l-0.71,1.1Z",
        "name": "Argentina"
      },
      "AU": {
        "path": "M705.8,353.26l0.26,0.04l0.17,-0.47l-0.48,-1.42l0.92,1.11l0.45,0.15l0.27,-0.39l-0.1,-1.56l-1.98,-3.63l1.09,-3.31l-0.24,-1.57l0.34,-0.62l0.38,1.06l0.43,-0.19l0.99,-1.7l1.91,-0.83l1.29,-1.15l1.81,-0.91l0.96,-0.17l0.92,0.26l1.92,-0.95l1.47,-0.28l1.03,-0.8l1.43,0.04l2.78,-0.84l1.36,-1.15l0.71,-1.45l1.41,-1.26l0.3,-2.58l1.27,-1.59l0.78,1.65l0.54,0.19l1.07,-0.51l0.15,-0.6l-0.73,-1.0l0.45,-0.71l0.78,0.39l0.58,-0.3l0.28,-1.82l1.87,-2.14l1.12,-0.39l0.28,-0.58l0.62,0.17l0.53,-0.73l1.87,-0.57l1.65,1.05l1.35,1.48l3.39,0.38l0.43,-0.54l-0.46,-1.23l1.05,-1.79l1.04,-0.61l0.14,-0.55l-0.25,-0.41l0.88,-1.17l1.31,-0.77l1.3,0.27l2.1,-0.48l0.31,-0.4l-0.05,-1.3l-0.92,-0.77l1.48,0.56l1.41,1.07l2.11,0.65l0.81,-0.2l1.4,0.7l1.69,-0.66l0.8,0.19l0.64,-0.33l0.71,0.77l-1.33,1.94l-0.71,0.07l-0.35,0.51l0.24,0.86l-1.52,2.35l0.12,1.05l2.15,1.65l1.97,0.85l3.04,2.36l1.97,0.65l0.55,0.88l2.72,0.85l1.84,-1.1l2.07,-5.97l-0.42,-3.59l0.3,-1.73l0.47,-0.87l-0.31,-0.68l1.09,-3.28l0.46,-0.47l0.4,0.71l0.16,1.51l0.65,0.52l0.16,1.04l0.85,1.21l0.12,2.38l0.9,2.0l0.57,0.18l1.3,-0.78l1.69,1.7l-0.2,1.08l0.53,2.2l0.39,1.3l0.68,0.48l0.6,1.95l-0.19,1.48l0.81,1.76l6.01,3.69l-0.11,0.76l1.38,1.58l0.95,2.77l0.58,0.22l0.72,-0.41l0.8,0.9l0.61,0.01l0.46,2.41l4.81,4.71l0.66,2.02l-0.07,3.31l1.14,2.2l-0.13,2.24l-1.1,3.68l0.03,1.64l-0.47,1.89l-1.05,2.4l-1.9,1.47l-1.72,3.51l-2.38,6.09l-0.24,2.82l-1.14,0.8l-2.85,0.15l-2.31,1.19l-2.51,2.25l-3.09,-1.57l0.3,-1.15l-0.54,-0.47l-1.5,0.63l-2.01,1.94l-7.12,-2.18l-1.48,-1.63l-1.14,-3.74l-1.45,-1.26l-1.81,-0.26l0.56,-1.18l-0.61,-2.1l-0.72,-0.1l-1.14,1.82l-0.9,0.21l0.63,-0.82l0.36,-1.55l0.92,-1.31l-0.13,-2.34l-0.7,-0.22l-2.0,2.34l-1.51,0.93l-0.94,2.01l-1.35,-0.81l-0.02,-1.52l-1.57,-2.04l-1.09,-0.88l0.24,-0.33l-0.14,-0.59l-3.21,-1.69l-1.83,-0.12l-2.54,-1.35l-4.58,0.28l-6.02,1.9l-2.53,-0.13l-2.62,1.41l-2.13,0.63l-1.49,2.6l-3.49,0.31l-2.29,-0.5l-3.48,0.43l-1.6,1.47l-0.81,-0.04l-2.37,1.63l-3.26,-0.1l-3.72,-2.21l0.04,-1.05l1.19,-0.46l0.49,-0.89l0.21,-2.97l-0.28,-1.64l-1.34,-2.86l-0.38,-1.47l0.05,-1.72l-0.95,-1.7l-0.18,-0.97l-1.01,-0.99l-0.29,-1.98l-1.13,-1.75ZM784.92,393.44l2.65,1.02l3.23,-0.96l1.09,0.14l0.15,3.06l-0.85,1.13l-0.17,1.63l-0.87,-0.24l-1.57,1.91l-1.68,-0.18l-1.4,-2.36l-0.37,-2.04l-1.39,-2.51l0.04,-0.8l1.15,0.18Z",
        "name": "Australia"
      },
      "AT": {
        "path": "M462.89,152.8l0.04,2.25l-1.07,0.0l-0.33,0.63l0.36,0.51l-1.04,2.13l-2.02,0.07l-1.33,0.7l-5.29,-0.99l-0.47,-0.93l-0.44,-0.21l-2.47,0.55l-0.42,0.51l-3.18,-0.81l0.43,-0.91l1.12,0.78l0.6,-0.17l0.25,-0.58l1.93,0.12l1.86,-0.56l1.0,0.08l0.68,0.57l0.62,-0.15l0.26,-0.77l-0.3,-1.78l0.8,-0.44l0.68,-1.15l1.52,0.85l0.47,-0.06l1.34,-1.25l0.64,-0.17l1.81,0.92l1.28,-0.11l0.7,0.37Z",
        "name": "Austria"
      },
      "IN": {
        "path": "M623.34,207.03l-1.24,1.04l-0.97,2.55l0.22,0.51l8.04,3.87l3.42,0.37l1.57,1.38l4.92,0.88l2.18,-0.04l0.38,-0.3l0.29,-1.24l-0.32,-1.64l0.14,-0.87l0.82,-0.31l0.45,2.48l2.28,1.02l1.77,-0.38l4.14,0.1l0.38,-0.36l0.18,-1.66l-0.5,-0.65l1.37,-0.29l2.25,-1.99l2.7,-1.62l1.93,0.62l1.8,-0.98l0.79,1.14l-0.68,0.91l0.26,0.63l2.42,0.36l0.09,0.47l-0.83,0.75l0.13,1.07l-1.52,-0.29l-3.24,1.86l-0.13,1.78l-1.32,2.14l-0.18,1.39l-0.93,1.82l-1.64,-0.5l-0.52,0.37l-0.09,2.63l-0.56,1.11l0.19,0.81l-0.53,0.27l-1.18,-3.73l-1.08,-0.27l-0.38,0.31l-0.24,1.0l-0.66,-0.66l0.54,-1.06l1.22,-0.34l1.15,-2.25l-0.24,-0.56l-1.57,-0.47l-4.34,-0.28l-0.18,-1.56l-0.35,-0.35l-1.11,-0.12l-1.91,-1.12l-0.56,0.17l-0.88,1.82l0.11,0.49l1.36,1.07l-1.09,0.69l-0.69,1.11l0.18,0.56l1.24,0.57l-0.32,1.54l0.85,1.94l0.36,2.01l-0.22,0.59l-4.58,0.52l-0.33,0.42l0.13,1.8l-1.17,1.36l-3.65,1.81l-2.79,3.03l-4.32,3.28l-0.18,1.27l-4.65,1.79l-0.77,2.16l0.64,5.3l-1.06,2.49l-0.01,3.94l-1.24,0.28l-1.14,1.93l0.39,0.84l-1.68,0.53l-1.04,1.83l-0.65,0.47l-2.06,-2.05l-2.1,-6.02l-2.2,-3.64l-1.05,-4.75l-2.29,-3.57l-1.76,-8.2l0.01,-3.11l-0.49,-2.53l-0.55,-0.29l-3.53,1.52l-1.53,-0.27l-2.86,-2.77l0.85,-0.67l0.08,-0.55l-0.74,-1.03l-2.67,-2.06l1.24,-1.32l5.34,0.01l0.39,-0.49l-0.5,-2.29l-1.42,-1.46l-0.27,-1.93l-1.43,-1.2l2.31,-2.37l3.05,0.06l2.62,-2.85l1.6,-2.81l2.4,-2.73l0.07,-2.04l1.97,-1.48l-0.02,-0.65l-1.93,-1.31l-0.82,-1.78l-0.8,-2.21l0.9,-0.89l3.59,0.65l2.92,-0.42l2.33,-2.19l2.31,2.85l-0.24,2.13l0.99,1.59l-0.05,0.82l-1.34,-0.28l-0.47,0.48l0.7,3.06l2.62,1.99l2.99,1.65Z",
        "name": "India"
      },
      "TZ": {
        "path": "M495.56,296.42l2.8,-3.12l-0.02,-0.81l-0.64,-1.3l0.68,-0.52l0.14,-1.47l-0.76,-1.25l0.31,-0.11l2.26,0.03l-0.51,2.76l0.76,1.3l0.5,0.12l1.05,-0.53l1.19,-0.12l0.61,0.24l1.43,-0.62l0.1,-0.67l-0.71,-0.62l1.57,-1.7l8.65,4.86l0.32,1.53l3.34,2.33l-1.05,2.8l0.13,1.61l1.63,1.12l-0.6,1.76l-0.01,2.33l1.89,4.03l0.57,0.43l-1.46,1.08l-2.61,0.94l-1.43,-0.04l-1.06,0.77l-2.29,0.36l-2.87,-0.68l-0.83,0.07l-0.63,-0.75l-0.31,-2.78l-1.32,-1.35l-3.25,-0.77l-3.96,-1.58l-1.18,-2.41l-0.32,-1.75l-1.76,-1.49l0.42,-1.05l-0.44,-0.89l0.08,-0.96l-0.46,-0.58l0.06,-0.56Z",
        "name": "Tanzania"
      },
      "AZ": {
        "path": "M539.29,175.73l1.33,0.32l1.94,-1.8l2.3,3.34l1.43,0.43l-1.26,0.15l-0.35,0.32l-0.8,3.14l-0.99,0.96l0.05,1.11l-1.26,-1.13l0.7,-1.18l-0.04,-0.47l-0.74,-0.86l-1.48,0.15l-2.34,1.71l-0.03,-1.27l-2.03,-1.35l0.47,-0.62l-0.08,-0.56l-1.03,-0.79l0.29,-0.43l-0.14,-0.58l-1.13,-0.86l1.89,0.68l1.69,0.06l0.37,-0.87l-0.81,-1.37l0.42,0.06l1.63,1.72ZM533.78,180.57l0.61,0.46l0.69,-0.0l0.59,1.15l-0.68,-0.15l-1.21,-1.45Z",
        "name": "Azerbaijan"
      },
      "IE": {
        "path": "M405.08,135.42l0.35,2.06l-1.75,2.78l-4.22,1.88l-2.84,-0.4l1.73,-3.0l-1.18,-3.53l4.6,-3.74l0.32,1.15l-0.49,1.74l0.4,0.51l1.47,-0.04l1.6,0.6Z",
        "name": "Ireland"
      },
      "ID": {
        "path": "M756.47,287.89l0.69,4.01l2.79,1.78l0.51,-0.1l2.04,-2.59l2.71,-1.43l2.05,-0.0l3.9,1.73l2.46,0.45l0.08,15.12l-1.75,-1.54l-2.54,-0.51l-0.88,0.71l-2.32,0.06l0.69,-1.33l1.45,-0.64l0.23,-0.46l-0.65,-2.74l-1.24,-2.21l-5.04,-2.29l-2.09,-0.23l-3.68,-2.27l-0.55,0.13l-0.65,1.07l-0.52,0.12l-0.55,-1.89l-1.21,-0.78l1.84,-0.62l1.72,0.05l0.39,-0.52l-0.21,-0.66l-0.38,-0.28l-3.45,-0.0l-1.13,-1.48l-2.1,-0.43l-0.52,-0.6l2.69,-0.48l1.28,-0.78l3.66,0.94l0.3,0.71ZM757.91,300.34l-0.62,0.82l-0.1,-0.8l0.59,-1.12l0.13,1.1ZM747.38,292.98l0.34,0.72l-1.22,-0.57l-4.68,-0.1l0.27,-0.62l2.78,-0.09l2.52,0.67ZM741.05,285.25l-0.67,-2.88l0.64,-2.01l0.41,0.86l1.21,0.18l0.16,0.7l-0.1,1.68l-0.84,-0.16l-0.46,0.3l-0.34,1.34ZM739.05,293.5l-0.5,0.44l-1.34,-0.36l-0.17,-0.37l1.73,-0.08l0.27,0.36ZM721.45,284.51l-0.19,1.97l2.24,2.23l0.54,0.02l1.27,-1.07l2.75,-0.5l-0.9,1.21l-2.11,0.93l-0.16,0.6l2.22,3.01l-0.3,1.07l1.36,1.74l-2.26,0.85l-0.28,-0.31l0.12,-1.19l-1.64,-1.34l0.17,-2.23l-0.56,-0.39l-1.67,0.76l-0.23,0.39l0.3,6.17l-1.1,0.25l-0.69,-0.47l0.64,-2.21l-0.39,-2.42l-0.39,-0.34l-0.8,-0.01l-0.58,-1.29l0.98,-1.6l0.35,-1.96l1.32,-3.87ZM728.59,296.27l0.38,0.49l-0.02,1.28l-0.88,0.49l-0.53,-0.47l1.04,-1.79ZM729.04,286.98l0.27,-0.05l-0.02,0.13l-0.24,-0.08ZM721.68,284.05l0.16,-0.32l1.89,-1.65l1.83,0.68l3.16,0.35l2.94,-0.1l2.39,-1.66l-1.73,2.13l-1.66,0.43l-2.41,-0.48l-4.17,0.13l-2.39,0.51ZM730.55,310.47l1.11,-1.93l2.03,-0.82l0.08,0.62l-1.45,1.67l-1.77,0.46ZM728.12,305.88l-0.1,0.38l-3.46,0.66l-2.91,-0.27l-0.0,-0.25l1.54,-0.41l1.66,0.73l1.67,-0.19l1.61,-0.65ZM722.9,310.24l-0.64,0.03l-2.26,-1.2l1.11,-0.24l1.78,1.41ZM716.26,305.77l0.88,0.51l1.28,-0.17l0.2,0.35l-4.65,0.73l0.39,-0.67l1.15,-0.02l0.75,-0.73ZM711.66,293.84l-0.38,-0.16l-2.54,1.01l-1.12,-1.44l-1.69,-0.13l-1.16,-0.75l-3.04,0.77l-1.1,-1.15l-3.31,-0.11l-0.35,-3.05l-1.35,-0.95l-1.11,-1.98l-0.33,-2.06l0.27,-2.14l0.9,-1.01l0.37,1.15l2.09,1.49l1.53,-0.48l1.82,0.08l1.38,-1.19l1.0,-0.18l2.28,0.67l2.26,-0.53l1.52,-3.64l1.01,-0.99l0.78,-2.57l4.1,0.3l-1.11,1.77l0.02,0.46l1.7,2.2l-0.23,1.39l2.07,1.71l-2.33,0.42l-0.88,1.9l0.1,2.05l-2.4,1.9l-0.06,2.45l-0.7,2.79ZM692.58,302.03l0.35,0.26l4.8,0.25l0.78,-0.97l4.17,1.09l1.13,1.68l3.69,0.45l2.13,1.04l-1.8,0.6l-2.77,-0.99l-4.8,-0.12l-5.24,-1.41l-1.84,-0.25l-1.11,0.3l-4.26,-0.97l-0.7,-1.14l-1.59,-0.13l1.18,-1.65l2.74,0.13l2.87,1.13l0.26,0.68ZM685.53,299.17l-2.22,0.04l-2.06,-2.03l-3.15,-2.01l-2.93,-3.51l-3.11,-5.33l-2.2,-2.12l-1.64,-4.06l-2.32,-1.69l-1.27,-2.07l-1.96,-1.5l-2.51,-2.65l-0.11,-0.66l4.81,0.53l2.15,2.38l3.31,2.74l2.35,2.66l2.7,0.17l1.95,1.59l1.54,2.17l1.59,0.95l-0.84,1.71l0.15,0.52l1.44,0.87l0.79,0.1l0.4,1.58l0.87,1.4l1.96,0.39l1.0,1.31l-0.6,3.01l-0.09,3.5Z",
        "name": "Indonesia"
      },
      "UA": {
        "path": "M492.5,162.44l1.28,-2.49l1.82,0.19l0.66,-0.23l0.09,-0.71l-0.25,-0.75l-0.79,-0.72l-0.33,-1.21l-0.86,-0.62l-0.02,-1.19l-1.13,-0.86l-1.15,-0.19l-2.04,-1.0l-1.66,0.32l-0.66,0.47l-0.92,-0.0l-0.84,0.78l-2.48,0.7l-1.18,-0.71l-3.07,-0.36l-0.89,0.43l-0.24,-0.55l-1.11,-0.7l0.35,-0.93l1.26,-1.02l-0.54,-1.23l2.04,-2.43l1.4,-0.62l0.25,-1.19l-1.04,-2.39l0.83,-0.13l1.28,-0.84l1.8,-0.07l2.47,0.26l2.86,0.81l1.88,0.06l0.86,0.44l1.04,-0.41l0.77,0.66l2.18,-0.15l0.92,0.3l0.52,-0.34l0.15,-1.53l0.56,-0.54l2.85,-0.05l0.84,-0.72l3.04,-0.18l1.23,1.46l-0.48,0.77l0.21,1.03l0.36,0.32l1.8,0.14l0.93,2.08l3.18,1.15l1.94,-0.45l1.67,1.49l1.4,-0.03l3.35,0.96l0.02,0.54l-0.96,1.59l0.47,1.97l-0.26,0.7l-2.36,0.28l-1.29,0.89l-0.23,1.38l-1.83,0.27l-1.58,0.97l-2.41,0.21l-2.16,1.17l-0.21,0.38l0.34,2.26l1.23,0.75l2.13,-0.08l-0.14,0.31l-2.65,0.53l-3.23,1.69l-0.87,-0.39l0.42,-1.1l-0.25,-0.52l-2.21,-0.73l2.35,-1.06l0.12,-0.65l-0.93,-0.82l-3.62,-0.74l-0.13,-0.89l-0.46,-0.34l-2.61,0.59l-0.91,1.69l-1.71,2.04l-0.86,-0.4l-1.62,0.27Z",
        "name": "Ukraine"
      },
      "QA": {
        "path": "M549.33,221.64l-0.76,-0.23l-0.14,-1.64l0.84,-1.29l0.47,0.52l0.04,1.34l-0.45,1.3Z",
        "name": "Qatar"
      },
      "MZ": {
        "path": "M508.58,318.75l-0.34,-2.57l0.51,-2.05l3.55,0.63l2.5,-0.38l1.02,-0.76l1.49,0.01l2.74,-0.98l1.66,-1.2l0.5,9.24l0.41,1.23l-0.68,1.67l-0.93,1.71l-1.5,1.5l-5.16,2.28l-2.78,2.73l-1.02,0.53l-1.71,1.8l-0.98,0.57l-0.35,2.41l1.16,1.94l0.49,2.17l0.43,0.31l-0.06,2.06l-0.39,1.17l0.5,0.72l-0.25,0.73l-0.92,0.83l-5.12,2.39l-1.22,1.36l0.21,1.13l0.58,0.39l-0.11,0.72l-1.22,-0.01l-0.73,-2.97l0.42,-3.09l-1.78,-5.37l2.49,-2.81l0.69,-1.89l0.44,-0.43l0.28,-1.53l-0.39,-0.93l0.59,-3.65l-0.01,-3.26l-1.49,-1.16l-1.2,-0.22l-1.74,-1.17l-1.92,0.01l-0.29,-2.08l7.06,-1.96l1.28,1.09l0.89,-0.1l0.67,0.44l0.1,0.73l-0.51,1.29l0.19,1.81l1.75,1.83l0.65,-0.13l0.71,-1.65l1.17,-0.86l-0.26,-3.47l-1.05,-1.85l-1.04,-0.94Z",
        "name": "Mozambique"
      }
    }, "height": 440.7063107441331, "projection": {"type": "mill", "centralMeridian": 11.5}, "width": 900.0
  });
  mm.loadAllData().then(() => {
    isDark.value = isDarkLs; // trigger watch
    onDocumentReady();

    mm.parseURLParams();

    if (gg.dt === DT_DEF && pnl.city.orderUI && !mm.opt.chartCity.orderYmd) {
      pnl.city.orderCnt = true;
    }
    if (pnl.gmap.is_show || pnl.sview.is_show || pnl.map.is_show) {
      $('#panel_name,#panel_city').css('height', '500px');
    }

    if (mm.get?.layout) onClickStyleLoad(mm.get?.layout);

    if (gg.isPrefTable) {
      onDocumentReadyPrefTable();
    }
    if (G_IS_LOCAL) {
      mm.local.onLoadAllDataAfter();
    }
  });
});

watch(() => pnl.common.toolbar.is_show, onChangeSettings);
watch(() => pnl.common.datepicker.position, onChangeSettings);
watch(() => pnl.gmap.is_show, () => {
  setBgWindowZIndex('chart_gmap');
  onChangeSettings();
});
watch(() => pnl.sview.is_show, () => {
  setBgWindowZIndex('chart_sview');
  onChangeSettings();
});
watch(() => pnl.tube.is_show, () => {
  setBgWindowZIndex('chart_tube');
  onChangeSettings()
});
watch(() => pnl.tube.vidAutoChange, onChangeSettings);
watch(() => pnl.map.is_show, is_show => {
  if (is_show) {
    _.delay(() => {
      drawJapanMap();
    }, 100)
  }
  onChangeSettings();
});
watch(() => pnl.name.is_show, onChangeSettings);
watch(() => pnl.city.is_show, onChangeSettings);
watch(() => pnl.city.orderCnt, v => {
  if (mm.url_data.data.indexOf('game-') === 0) {
    pnl.common.unit = pnl.city.orderUI ? (v ? '売上本数(万本)' : 'タイトル') : ''
  }

  // Sum/Countタイプの切り替え。(例: 売り上げ本数合計/タイトル数)
  mm.group_reduce.base = v ? d => (d[D_CNT] || 1) : d => 1

  // 以下全チャート再計算
  initChartName();

  // chartCity - 並び順だけ変更
  mm.chartCity
    .ordering(v
      ? d => -d.value // カウント降順
      : mm.orderYmd // 時間昇順
    );

  // chartDate
  const compositeY = mm.composite.elasticY();
  mm.chartDate.group().reduce(mm.group_reduce.append, mm.group_reduce.remove, mm.group_reduce.init);
  mm.composite.elasticY(true);

  let chartSexW = 148;
  let chartSexH = 158;

  initChartYear(chartSexH);

  initChartSeason(chartSexW, chartSexH);

  initChartWeek(chartSexW, chartSexH);

  initChartSex(chartSexW, chartSexH);

  // chartAge
  // initChartAge(chartSexW, chartSexH);
  const chartAgeY = mm.chartAge.elasticY();
  const gpAge = initChartAgeReduce(mm.chartAge.dimension());
  mm.chartAge.group(mm.groupRemoveEmpty(gpAge))
  mm.chartAge.elasticY(true);

  // chartCond
  // initChartCond(chartSexW, chartSexH);
  const chartCondY = mm.chartCond.elasticY();
  const gpCond = initChartCondReduce(mm.chartCond.dimension());
  mm.chartCond.group(mm.groupRemoveEmpty(gpCond))
  mm.chartCond.elasticY(true);

  // chartJob
  // initChartJob(chartSexW, chartSexH);
  const chartJobY = mm.chartJob.elasticY();
  initChartJobReduce();
  mm.chartJob.group(mm.is_job_cate ? mm.gpJobCat : mm.gpJob)
  mm.chartJob.elasticY(true);

  // chartEx
  initAllChartEx(chartSexH);

  mm.dateStackShow(STACK_CND);

  dc.renderAll("chartGroup");

  mm.composite.elasticY(compositeY);
  mm.chartAge.elasticY(chartAgeY);
  mm.chartCond.elasticY(chartCondY);
  mm.chartJob.elasticY(chartJobY);
});
watch(() => pnl.date.is_show, onChangeSettings);
watch(() => pnl.date.chart2.is_show, onChangeChartDateChart2IsShow);
watch(() => pnl.date.isBrushOn, onChangeChartDateIsBrushOn);
watch(() => pnl.year.is_show, onChangeSettings);
watch(() => pnl.season.is_show, onChangeSettings);
watch(() => pnl.week.is_show, onChangeSettings);
watch(() => pnl.sex.is_show, onChangeSettings);
watch(() => pnl.age.is_show, onChangeSettings);
watch(() => pnl.age.elasticX, v => {
  mm.chartAge
    .ordering(v ? t => (gg.dt === DT_COVID ? -t.value.total : -t.value) : dc.pluck('key'))
    .elasticX(true)
    .render();
});
watch(() => pnl.cond.is_show, onChangeSettings);
watch(() => pnl.cond.elasticX, v => {
  mm.chartCond
    .ordering(v ? t => -t.value : dc.pluck('key'))
    .elasticX(true)
    .render();
});
watch(() => pnl.job.is_show, onChangeSettings);
watch(() => pnl.job.elasticX, v => {
  if (v) {
    const wc = mm.chartJob.width();
    const wd = $('#chart_job').width()
    if (wc > wd) {
      mm.config.cJob.width = mm.chartJob.width();
      mm.chartJob.width(wd);
    }
  } else {
    mm.chartJob.width(mm.config.cJob.width);
  }

  mm.chartJob
    .ordering(v ? t => -t.value : dc.pluck('key'))
    .elasticX(true)
    .render()
});
watch(() => pnl.ex, onChangeSettings, {deep: true});
watch(() => pnl.detail.is_show, onChangeSettings);
watch(() => pnl.ana.is_show, onChangeSettings);
watch(() => pnl.date.stack_type, (v) => {
  mm.dateStackShow(v);

  mm.composite.render();
  mm.chartYear.render();
  if (pnl.sex.chartType === 'bar') {
    mm.chartSex.render();
  }
  if (pnl.date.chart2.type !== CHART_DATE2_TYPE_COVID) {
    mm.composite2?.render();
  }
  for (let k = 0; k < pnl.ex.length; k++) {
    if (pnl.ex[k].isHidden) continue
    mm.chartEx[k].render();
  }
});
watch(isDark, (newVal) => {
  const head = document.querySelector('#chart_map .ui-widget-header');
  if (newVal) {
    document.getElementById('jqui-stylesheet').setAttribute('href', BASE + 'jquery-ui/themes/dark-hive/jquery-ui.min.css');
    head?.classList.remove('light');
    document.body.style.backgroundColor = '#1F2937';
    document.body.classList.add('dark');
    IMG_NO = '/img/noimage-dark.png';
    localStorage.theme = 'dark';
  } else {
    document.getElementById('jqui-stylesheet').setAttribute('href', BASE + 'jquery-ui/themes/blitzer/jquery-ui.min.css');
    head?.classList.add('light');
    document.body.style.backgroundColor = '#F0F0F0';
    document.body.classList.remove('dark');
    IMG_NO = '/img/noimage.png';
    localStorage.theme = 'light';
  }
});

const mm = {
  config: {
    urlParamDataReplace: true, mouseLongClickDuration: 300, //マウスの長押しクリックと判定する時の長押し時間
    panelDraggable: !isSp,
    panelDragSnapThreshold: 10,
    panelResizable: !isSp,
    cName: {
      itemHeight: 29,
    },
    cCity: {
      itemHeight: 29,
      preMatch: 0,  // 1:前方一致(word*) 0:部分一致(*word*)
    },
    cDate: {
      is_elasticY: 1,
      width: 200,
      colors: COL_DATE,
    },
    cDate2: {
      chartType: 'lines',
    },
    cYear: {
      barWidth: 40,
    },
    cSex: {
      barWidth: 40,
    },
    cAge: {
      barWidth: 45,
      scaledSuffix: '代'
    },
    cCond: {
      barWidth: 40,
      colors: COL_CND
    },
    cJob: {
      TD: 750,       //transitionDuration
      barWidth: 40,
      keyLabel: (key) => {
        if (typeof key !== 'string') return key;

        let ret = key;
        switch (key) {
          //case '看護師': ret = '🏥看護師';break;
          case '医師':
            ret = '🏥👨🏻‍⚕医師';
            break;
          case '自営業':
            ret = '👨‍🌾' + key;
            break;
          case '製造業':
            ret = '🧑‍🔧' + key;
            break;
          case '公務員':
            ret = '🧑‍💼' + key;
            break;
          case '会社員':
          case '経営者・役員':
            ret = '🧑🏻‍💼' + key;
            break;
          case '教職員':
            ret = '🏫🧑‍🏫' + key;
            break;
          case 'パート・アルバイト':
            ret = '💁‍' + key;
            break;
          case '無職':
            ret = '🧓' + key;
            break;
          case '入所者':
            ret = '🧓' + key;
            break;
          default:
            if (key.indexOf('医療') !== -1) {
              ret = '🏥' + key;
              break;
            }
            if (key.indexOf('看護') !== -1) {
              ret = '🏥👩‍⚕' + key;
              break;
            }
            if (key.indexOf('医者') !== -1) {
              ret = '🏥' + key;
              break;
            }
            if (key.indexOf('教師') !== -1) {
              ret = '🏫🧑‍🏫' + key;
              break;
            }
            if (key.indexOf('大学生') !== -1) {
              ret = '🏫🧑‍🎓' + key;
              break;
            }
            if (key.indexOf('中学生') !== -1) {
              ret = '🏫👦' + key;
              break;
            }
            if (key.indexOf('小学生') !== -1) {
              ret = '🏫👧' + key;
              break;
            }
            if (key.indexOf('学生') !== -1) {
              ret = '🏫🧑‍🎓' + key;
              break;
            }
            if (key.indexOf('保育') !== -1) {
              ret = '🏫🤱' + key;
              break;
            }
            if (key.indexOf('職員') !== -1) {
              ret = '👩‍💼' + key;
              break;
            }
            if (key.indexOf('福祉') !== -1) {
              ret = '👩‍💼' + key;
              break;
            }
            if (key.indexOf('公務員') !== -1) {
              ret = '🧑‍💼' + key;
              break;
            }
            if (key.indexOf('飲食') !== -1) {
              ret = '👩‍🍳‍' + key;
              break;
            }
            if (key.indexOf('接客') !== -1) {
              ret = '💁‍♀️‍' + key;
              break;
            }
            if (key.indexOf('サービス') !== -1) {
              ret = '💁‍♀️‍' + key;
              break;
            }
            if (key.indexOf('パート') !== -1) {
              ret = '👩‍🌾️‍' + key;
              break;
            }
            if (key.indexOf('アルバイト') !== -1) {
              ret = '💁‍♀️‍' + key;
              break;
            }
            if (key.indexOf('警察') !== -1) {
              ret = '👮' + key;
              break;
            }
            if (key.indexOf('自衛') !== -1) {
              ret = '🧑‍🚒' + key;
              break;
            }
            if (key.indexOf('消防') !== -1) {
              ret = '🧑‍🚒' + key;
              break;
            }
            if (key.indexOf('園児') !== -1) {
              ret = '👼‍' + key;
              break;
            }
            if (key.indexOf('運送') !== -1) {
              ret = '🚚‍' + key;
              break;
            }
            if (key.indexOf('運転手') !== -1) {
              ret = '🚚‍' + key;
              break;
            }
            if (key.indexOf('タクシー') !== -1) {
              ret = '🚕‍' + key;
              break;
            }
            if (key.indexOf('土木') !== -1) {
              ret = '🧑‍🏭‍' + key;
              break;
            }
            if (key.indexOf('建築') !== -1) {
              ret = '👩‍🏭‍' + key;
              break;
            }
            break;
        }
        return ret;
      },
    },
    cEx: {
      barWidth: 40,
    },
  },
  get: {},
  is_trigger_search: false,
  url_data: {
    "path": "\/data\/",
    "assets": "covid19-assets.json?20221030-zzz",
    "data": "covid19-data-2021-02-28?20221030-zzz",
    "filer_files": {
      "covid19-japan.jpg": "covid19-data-2021-02-28?20221030-zzz",
      "food-ramen.jpg": "food-ramen.csv?20221030-zzz",
      "ja-quake-noto-safety.jpg": "ja-quake-noto-safety.csv?20221030-zzz",
      "ja-tokyo-gubernatorial-election.jpg": "ja-tokyo-gubernatorial-election.csv?20221030-zzz",
      "resas-agriculture.jpg": "resas-agriculture.csv?20221030-zzz",
      "resas-product-sales.jpg": "resas-product-sales.csv?20221030-zzz",
      "resas-tourism-foreigners.jpg": "resas-tourism-foreigners.csv?20221030-zzz",
      "resas-municipality-company.jpg": "resas-municipality-company.csv?20221030-zzz",
      "resas-municipality-taxes.jpg": "resas-municipality-taxes.csv?20221030-zzz",
      "resas-municipality-manufacture.jpg": "resas-municipality-manufacture.csv?20221030-zzz",
      "game-1983-msx.jpg": "game-msx.csv?20221030-zzz",
      "game-1983-fc.jpg": "game-fc.csv?20221030-zzz",
      "game-1987-pce.jpg": "game-pce.csv?20221030-zzz",
      "game-1988-smd.jpg": "game-smd.csv?20221030-zzz",
      "game-1989-gb.jpg": "game-gb.csv?20221030-zzz",
      "game-1990-smc.jpg": "game-smc.csv?20221030-zzz",
      "game-1991-gen4.jpg": "game-gen4.csv?20221030-zzz",
      "game-1994-ps1.jpg": "game-ps1.csv?20221030-zzz",
      "game-1995-ss.jpg": "game-ss.csv?20221030-zzz",
      "game-1996-n64.jpg": "game-n64.csv?20221030-zzz",
      "game-2001-gba.jpg": "game-gba.csv?20221030-zzz",
      "game-2001-gc.jpg": "game-gc.csv?20221030-zzz",
      "game-gen3.jpg": "game-gen3.csv?20221030-zzz",
      "game-ac.jpg": "game-ac.csv?20221030-zzz",
      "test-drink.jpg": "test-drink.csv?20221030-zzz",
      "test-lunch.jpg": "test-lunch.csv?20221030-zzz",
      "test-agr-kikurage.jpg": "test-agr-kikurage.csv?20221030-zzz",
      "sports-hsb.jpg": "sports-hsb.csv?20221030-zzz",
      "store-cnt.jpg": "store-cnt.csv?20221030-zzz",
      "store-di.jpg": "store-di.csv?20221030-zzz",
      "kaggle-heart-disease.jpg": "kaggle-heart-disease.csv?20221030-zzz",
      "kaggle-countries-intermediate.jpg": "kaggle-countries-intermediate.csv?20221030-zzz"
    }
  },
  url_name: 'https://ja.wikipedia.org/wiki',

  chartGMap: {
    center: undefined,
    prefecture: '東京都',
    layer: {
      // "東京都": {
      // 	"千代田区": 70,
      // 	"中央区": 80,
      // }
    },
    focus: {
      // "東京都": {
      // 	"千代田区": 70,
      // 	"中央区": 80,
      // }
    },
  },
  //
  //charts
  //
  composite: null,
  chartDate: null,
  chartLine: null,

  composite2: null,
  chartDate2: null,
  chartLine2: null,

  chartName: null,
  chartCity: null,
  chartSex: null,
  chartYear: null,
  chartWeek: null,
  chartAge: null,
  chartCond: null,
  chartJob: null,
  chartEx: [],

  // data=xxx データに含まれるオプション
  opt: {
    dataType: DT_DEF, // DT_DEF|DT_COVID,
    chartGMap: {},
    chartSView: {},
    chartTube: {},
    chartMap: {},
    chartName: {},
    chartCity: {},
    chartDate: {},
    chartYear: {},
    chartSeason: {},
    chartWeek: {},
    chartSex: {},
    chartAge: {},
    chartCond: {},
    chartJob: {},
    chartJobCat: {},
    chartEx: [],
    chartDetail: {},
    assets: {}
  },
  dataOptionsChartKeys: [
    // [optionKey, pnlKey]
    ['chartGMap', 'gmap'],
    ['chartSView', 'sview'],
    ['chartTube', 'tube'],
    ['chartMap', 'map'],
    ['chartName', 'name'],
    ['chartCity', 'city'],
    ['chartDate', 'date'],
    ['chartYear', 'year'],
    ['chartSeason', 'season'],
    ['chartWeek', 'week'],
    ['chartSex', 'sex'],
    ['chartAge', 'age'],
    ['chartCond', 'cond'],
    ['chartJob', 'job'],
    ['chartJobCat', 'jobcat'],
    ['chartDetail', 'detail'],
  ],
  // データオプションを解析
  // @out : gg.dt
  // @out : mm.opt
  parseCsvOptions: function (urlQueryString) {
    if (urlQueryString) {
      php_parse_str(urlQueryString, mm.opt);
      gg.dt = parseInt(mm.opt.dataType);

      mm.opt.dataType = parseInt(mm.opt.dataType);

      if (mm.opt.searchPrefixDataIndex) {
        mm.opt.searchPrefixDataIndex = parseInt(mm.opt.searchPrefixDataIndex);
      }

      if (mm.opt.isMakeAutocompleteData) {
        mm.opt.isMakeAutocompleteData = Boolean(parseInt(mm.opt.isMakeAutocompleteData));
      }

      // chart{xxx} 共通
      mm.dataOptionsChartKeys.forEach(keys => {
        const key = keys[0];
        if (mm.opt[key] === undefined) {
          mm.opt[key] = {};
        }
        if (mm.opt[key]?.isHidden) {
          mm.opt[key].isHidden = Boolean(parseInt(mm.opt[key].isHidden));
        }
        if (mm.opt[key]?.isShow) {
          mm.opt[key].isShow = Boolean(parseInt(mm.opt[key].isShow));
        }
        if (mm.opt[key].isHidden) {
          mm.opt[key].isShow = false;
        }
      });

      // chartGMap
      if (gg.dt === DT_COVID) mm.opt.chartGMap.isShow = false;
      if (mm.opt.chartGMap.center) {
        mm.opt.chartGMap.center.lat = parseFloat(mm.opt.chartGMap.center.lat);
        mm.opt.chartGMap.center.lng = parseFloat(mm.opt.chartGMap.center.lng);
      }
      if (mm.opt.chartGMap.colorThreshold) {
        mm.opt.chartGMap.colorThreshold = parseFloat(mm.opt.chartGMap.colorThreshold);
      }

      // chartSView

      // chartTube

      // chartMap
      if (gg.dt === DT_COVID) mm.opt.chartMap.isShow = true;
      if (mm.opt.chartMap.colors) {
        mm.opt.chartMap.colors = JSON.parse(mm.opt.chartMap.colors);
      }

      // chartName
      if (mm.opt.chartName.isLabelAlphabet) {
        mm.opt.chartName.isLabelAlphabet = Boolean(parseInt(mm.opt.chartName.isLabelAlphabet));
      }

      // chartCity
      if (mm.opt.chartCity.orderYmd) {
        mm.opt.chartCity.orderYmd = Boolean(parseInt(mm.opt.chartCity.orderYmd));
        if (mm.opt.chartCity.orderUI) {
          mm.opt.chartCity.orderUI = Boolean(parseInt(mm.opt.chartCity.orderUI));
        }
      }

      // chartDate
      if (mm.opt.chartDate.elasticY) {
        mm.config.cDate.is_elasticY
          = mm.opt.chartDate.elasticY
          = Boolean(parseInt(mm.opt.chartDate.elasticY));
      }

      mm.opt.chartDate.width = isNaN(mm.opt.chartDate.width) ? undefined : parseInt(mm.opt.chartDate.width);

      // chartDate2
      if (mm.opt.chartDate2 === undefined) {
        mm.opt.chartDate2 = {chartType: mm.config.cDate2.chartType};
      }

      // chartYear
      if (mm.opt.chartYear.isLegend) {
        mm.opt.chartYear.isLegend = (parseInt(mm.opt.chartYear.isLegend) ? true : false)
      } else {
        mm.opt.chartYear.isLegend = true;
      }
      // chartSeason

      // chartWeek

      // chartSex
      if (mm.opt.chartSex.unit) {
        mm.opt.chartSex.unit = JSON.parse(mm.opt.chartSex.unit);
        // COL_SEX = mm.opt.chartSex.unit;
        if (mm.opt.chartSex.unit !== null) {
          SEX_LABEL = mm.opt.chartSex.unit;
        }
      }
      if (mm.opt.chartSex.scale) {
        const s = parseInt(mm.opt.chartSex.scale);
        if (!isNaN(s)) mm.opt.chartSex.scale = s;
      }
      if (mm.opt.chartSex.isLegend) {
        mm.opt.chartSex.isLegend = (parseInt(mm.opt.chartSex.isLegend) ? true : false)
      }

      // chartAge
      if (mm.opt.chartAge.unit) {
        mm.opt.chartAge.unit = JSON.parse(mm.opt.chartAge.unit);
        if (mm.opt.chartAge.unit !== null) {
          mm.chartStack[STACK_AGE] = mm.opt.chartAge.unit;
        }
      } else {
        mm.opt.chartAge.unit = null;
      }
      if (mm.opt.chartAge.scale) {
        const s = parseInt(mm.opt.chartAge.scale);
        if (!isNaN(s)) mm.opt.chartAge.scale = s;
      }


      // chartCond

      // chartJob
      mm.is_job_cate = !mm.opt.chartJobCat.isHidden;

      // chartEx[]
      if (mm.opt.chartEx === undefined) mm.opt.chartEx = [];
      for (let k = 0; k < pnl.ex.length; k++) {
        if (mm.opt.chartEx[k] === undefined) mm.opt.chartEx[k] = {};
        if (mm.opt.chartEx[k]?.scale) {
          const s = parseInt(mm.opt.chartEx[k].scale);
          if (!isNaN(s)) mm.opt.chartEx[k].scale = s;
        } else {
          mm.opt.chartEx[k].scale = false;
        }
        mm.opt.chartEx[k].isLegend = mm.opt.chartEx[k].isLegend ? parseInt(mm.opt.chartEx[k].isLegend) : false;
      }

      // chartDetail

    } else {
      gg.dt = DT_DEF;
    }
  },
  // データオプション(mm.opt)系をpnlに反映
  setPanelFromDataOptions: () => {
    if (mm.opt.dataReference) {
      pnl.common.dataReference = mm.opt.dataReference;
    }

    // chart{xxx} 共通
    mm.dataOptionsChartKeys.forEach(keys => {
      const key = keys[0];
      const panelKey = keys[1];
      if (pnl[panelKey] === undefined) return;
      if (mm.opt[key]?.isHidden) {
        pnl[panelKey].isHidden = mm.opt[key].isHidden;
      }
      if (mm.opt[key]?.isShow) {
        pnl[panelKey].is_show = mm.opt[key].isShow;
      }
      if (mm.opt[key].isHidden) {
        pnl[panelKey].is_show = false;
      }
    });

    // chartGMap
    if (mm.opt.chartGMap?.prefecture) {
      pnl.gmap.chartGMap.prefecture = mm.opt.chartGMap.prefecture;
    }
    pnl.gmap.chartGMap.colorThreshold = mm.opt.chartGMap?.colorThreshold ?? undefined;
    pnl.gmap.chartGMap.center = mm.opt.chartGMap?.center;

    if (mm.opt.chartMap?.colors) {
      pnl.map.colors = mm.opt.chartMap.colors;
    }

    // chartMap
    if (mm.opt.chartMap.mapType === 'world') {
      mm.map.isMapJapan = false;
      pnl.map.title = '<i class="fa fa-map"></i>世界地図';
    }

    // chartDate2
    if (mm.opt.chartDate2 === undefined) {
      mm.opt.chartDate2 = {chartType: mm.config.cDate2.chartType};
    }

    // chartYear,chartSeason,chartWeek
    if (mm.opt.chartDate.isHidden) {
      pnl.year.isHidden = true
      pnl.year.is_show = false;
      pnl.season.isHidden = true
      pnl.season.is_show = false;
      pnl.week.isHidden = true
      pnl.week.is_show = false;
    }

    // chartSex
    if (mm.opt.chartSex?.chartType) {
      pnl.sex.chartType = mm.opt.chartSex.chartType;
    }

    // chartAge
    if (mm.opt.chartAge.unit !== undefined && mm.opt.chartAge.unit !== null) {
      mm.chartStack[STACK_AGE] = mm.opt.chartAge.unit;
    }

    // chartCity
    if (mm.opt.chartCity?.orderYmd) {
      if (mm.opt.chartCity.orderUI) {
        pnl.city.orderUI = mm.opt.chartCity.orderUI;
        if (mm.url_data.data.indexOf('game-') === 0) {
          pnl.common.unit = pnl.city.orderUI ? (pnl.city.orderCnt ? '売上本数(万本)' : 'タイトル') : '';
        }
      }
    } else {
      mm.opt.chartCity.orderYmd = false;
    }
  },
  data_hdr: [],

  data: [], // ※mm.ndx().all() Pointer
  data3: [],         //(感染・PCR・死亡・病床)のデータ

  names: [],
  namesCount: {},
  citys: [],
  conds: [],
  ages: [],
  jobs: [],
  jobcates: [],

  ndx: {},

  pref_tbl_last_m1: [],
  pref_tbl_last_m2: [],
  pref_tbl_last_cnt: {},
  //pref_tbl_city_cnt:{},
  spk: {},
  SPARK_SX: isSp ? 60 : 25,
  ac_data: [],
  ac_data_tbl: [],

  dimJob: null,
  dimJobCat: null,

  dimName: null,
  gpName: null,
  gpName_all: {},

  dimName2: null,

  gpCity: null,

  domainDate: null,
  gpDate: null,
  gpDate2: null,

  chartDate2Mode: MD_PCR,
  gpJob: null,
  is_job_cate: 1,
  gpJobCat: null,

  dateCnt: {},
  datePick: null,
  dateCntMax: 0,
  dateCntTo: 'YYYYMMDD',

  dateCntMax2: 0,
  dateCntTo2: 'YYYYMMDD',

  lastFilteredChart: {},

  tab: null,
  sel_tab: 'tabs_c',

  tbl_pref: null,
  tbl_pref_isearch: null,
  //gpDateYMMax:{},

  line: d3.line().curve(d3.curveLinear),
  last_fth: '',
  map: {
    doDraw: true,
    isSelectedRegions: false,
    isMapJapan: true
  },
  d3fmt: v => d3.format(v < 1000 ? 'd' : '.2s')(v),
  util: {
    // [imagePath]オプションを解釈
    // @pathColExt:<path>:<imageNameColumIndex>:<extension>
    // 例: @pathColExt:/im/photozou/thumb:7:jpg
    parseOptionImagePath: (imagePath, d) => {
      let ret = null;
      const pathColExt = imagePath.split(':');
      if (pathColExt.length === 4) {
        ret = `${pathColExt[1]}/${d[pathColExt[2]]}.${pathColExt[3]}`;
      }
      return ret;
    },
    // [scale]オプションを解釈
    // @round:<precision>
    // 例 @round:2
    parseOptionScale: (scale) => {
      let s = typeof (scale) === 'string' ? scale.split('@round:') : [];
      if (s.length > 1) {
        return parseInt(s[1]);
      } else {
        return null;
      }
    },
    getExt: (filename) => {
      const parts = filename.split('.');
      return parts.length > 1 ? parts.pop() : ''; // 拡張子がない場合は空文字列を
    },
    // 全角を2、半角を1として文字列サイズを取得
    getStrLen: (str) => {
      return Array.from(str).reduce((acc, char) => {
        const code = char.codePointAt(0);
        if (code <= 0x7F) {
          // ASCII characters (half-width)
          return acc + 1;
        } else if (code >= 0x1F300 && code <= 0x1F64F) {
          // Emoticons and most common icon characters
          return acc + 2;
        } else {
          // Other Unicode characters (full-width)
          return acc + 2;
        }
      }, 0);
    },
    // 文字列配列中の最大文字サイズを取得
    arrStrMaxLen: (arrStr) => {
      return _.max(_.map(arrStr, d => mm.util.getStrLen(d)));
    },
    isHankaku: (str) => /^[\u0000-\u00FF]*$/.test(str),
    toZenkaku: (str) => {
      return str.replace(/[A-Za-z0-9]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) + 0xFEE0)
      );
    },
    // 名前に付加されたタグ系情報の削除
    removeLabelSuffix: function (d) {
      let name = d;
      if (d.indexOf('(') !== -1) {
        name = d.split('(')[0]; // case: <Label>(<XXX>)
        if (mm.opt.removeLabelSufixType) {// case: <Label>♂(<AGE>)
          name = name.replace(/[ ♂♀]/g, '');
        }
      } else {
        name = d;
      }
      return name.replace(TAGICON_DS, '').replace(TAGICON_CD, ''); // case: <NAME><TAGICON>
    },
    initPanelsWH: function () {
      const pos = mm.util.relToAbsPos('#panels');
      const h = parseInt(window.innerHeight - pos.top + 20);
      $('#panels').css('height', h + 'px');

      if (!isSp) {
        $('#panel_year').width(mm.chartYear.width());
        $('#panel_week').width(mm.chartWeek.width());
        $('#panel_age').width(mm.chartAge.width());
        $('#panel_cond').width(mm.chartCond.width());
        for (let k = 0; k < pnl.ex.length; k++) {
          if (pnl.ex[k].isHidden) continue
          $(`#panel_ex_${k}`).width(mm.chartEx[k].width());
        }
      }
    },
    relToAbsPos: selector => {
      const o = $(selector);
      const isNone = o.css('display') === 'none'; // display:noneの時positionが取得できない対策
      if (isNone) o.css('display', '');
      const relativeOffset = o.position();
      if (isNone) o.css('display', 'none');
      const parentOffset = o.offsetParent().offset();
      return {top: relativeOffset.top + parentOffset.top, left: relativeOffset.left + parentOffset.left}
    },
    pxToPer: (left, top, width, height, selector = null) => {
      // 画面サイズの取得
      let screenWidth, screenHeight;
      if (selector === null) {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
      } else {
        screenWidth = $(selector).width();
        screenHeight = $(selector).height();
      }

      // パーセント変換
      const leftPercent = (left / screenWidth) * 100;
      const topPercent = (top / screenHeight) * 100;
      const widthPercent = (width / screenWidth) * 100;
      const heightPercent = (height / screenHeight) * 100;

      // 結果をオブジェクトで返す
      return {
        left: `${leftPercent.toFixed(6)}%`,
        top: `${topPercent.toFixed(6)}%`,
        width: `${widthPercent.toFixed(6)}%`,
        height: `${heightPercent.toFixed(6)}%`
      };
    },
    // 住所から都道府県名を抽出
    getPref: (address) => {
      for (const prefecture of PREFECTURES) {
        if (address.startsWith(prefecture)) {
          return prefecture;
        }
      }
      return address;
    },
    replaceSearchWordE2J: (s) => {
      let ret = '';
      s = s.toLowerCase();
      switch (true) {
        case s.indexOf('@') !== -1: // @tube のような予約語
          ret = '';
          break;
        case s.indexOf('sega') !== -1:
          ret = 'セガ';
          break;
        case s.indexOf('capcom') !== -1:
          ret = 'カプコン';
          break;
        case s.indexOf('namco') !== -1:
          ret = 'ナムコ';
          break;
        case s.indexOf('konami') !== -1:
          ret = 'コナミ';
          break;
        case s.indexOf('taito') !== -1:
          ret = 'タイトー';
          break;
        case s.indexOf('irem') !== -1:
          ret = 'アイレム';
          break;
        case s.indexOf('nintendo') !== -1:
          ret = '任天堂';
          break;
        case s.indexOf('jaleco') !== -1:
          ret = 'ジャレコ';
          break;
        case s.indexOf('banpresto') !== -1:
          ret = 'バンプレスト';
          break;
        case s.indexOf('nichibutsu') !== -1:
          ret = '日本物産	';
          break;
        case s.indexOf('dataeast') !== -1:
          ret = 'データイースト	';
          break;
        case s.indexOf('msx') !== -1:
          ret = 'MSX';
          break;
        case s.indexOf('sms') !== -1:
          ret = 'マスターシステム';
          break;
        case s.indexOf('smc') !== -1 || s.indexOf('sfc') !== -1:
          ret = 'スーパーファミコン';
          break;
        case s.indexOf('fc') !== -1 || s.indexOf('nes') !== -1:
          ret = 'ファミコン';
          break;
        case s.indexOf('pce') !== -1:
          ret = 'PCエンジン';
          break;
        case s.indexOf('smd') !== -1 || s.indexOf('md') !== -1:
          ret = 'メガドライブ';
          break;
        case s.indexOf('n64') !== -1:
          ret = 'NINTENDO64';
          break;
        case s.indexOf('fds') !== -1:
          ret = 'ディスクシステム';
          break;
        case s.indexOf('gba') !== -1:
          ret = 'ゲームボーイアドバンス';
          break;
        case s.indexOf('gb') !== -1:
          ret = 'ゲームボーイ';
          break;
        case s.indexOf('ps1') !== -1:
          ret = 'プレイステーション1';
          break;
        case s.indexOf('gc') !== -1:
          ret = 'ゲームキューブ';
          break;
        case s.indexOf('ws') !== -1:
          ret = 'ワンダースワン';
          break;
        case s.indexOf('gg') !== -1:
          ret = 'ゲームギア';
          break;
        case s.indexOf('vb') !== -1:
          ret = 'バーチャルボーイ';
          break;
        case s.indexOf('gen') !== -1:
          ret = 'ゲーム機';
          break;
        default:
          ret = '';
          break;
      }
      return ret;
    },
    isMatchRegexI: (word, keyword) => {
      try {
        // 半角・全角スペース（連続も含む）は '|'に置換してOR検索も可能とする
        const keywordOR = keyword.replace(/\s+/g, '|');
        const regex = new RegExp(keywordOR, 'i');
        return regex.test(word);
      } catch (error) {
        return word.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
      }
    },
    // 1行のCSVをパースする関数
    parseCSVLine: (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }

      if (current) {
        result.push(current.trim());
      }

      return result;
    },
    loadJSON: async (filePath) => {
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        throw error;
      }
    },
    // Option付CSVファイルをパース
    parseOptionsCSV: (url, doParseOptions = false) => {
      return fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            const msg = 'エラー\nURLにデータが存在しません。\nURL: ' + response.url;
            window.alert(msg);
            window.history.back();
            // throw new Error('Fetch failed: ' + msg);
          }
        })
        .then(text => {
          const lines = text.split('\n');
          let header = [];
          let data = [];
          let urlQueryString = '';
          let dataStartIndex = 1;
          let optionsStartIndex = null;

          // ヘッダーをパース
          header = mm.util.parseCSVLine(lines[0]);

          // オプションを探してパースする
          for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i].trim();
            if (line.indexOf('@CsvOptions:') === 0) {
              optionsStartIndex = i;
              break;
            }
          }
          if (optionsStartIndex !== null) {
            function trimCommasAndQuotes(str) {
              // 前後のカンマとダブルクォートをトリム && ""を"に変換
              return str.replace(/^[,"]+|[,"]+$/g, '').replace(/""/g, '"');
            }

            for (let i = optionsStartIndex + 1; i < lines.length; i++) {
              const line = trimCommasAndQuotes(lines[i].trim());
              urlQueryString += `&${line}`;
            }
            lines.splice(optionsStartIndex); // オプション以降の行を削除
            if (doParseOptions) mm.parseCsvOptions(urlQueryString);
          }

          // データをパース
          for (let i = dataStartIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
              const row = line.indexOf('"') === -1 ? line.split(',') : mm.util.parseCSVLine(line)
              if (gg.dt === DT_COVID) {
                row[D_SEX] = parseInt(row[D_SEX]);
                row[D_AGE] = parseInt(row[D_AGE]);
                row[D_JOBCAT] = parseInt(row[D_JOBCAT]);
              } else {
                if (mm.opt.chartSex.unit !== undefined && mm.opt.chartSex.unit !== null) {
                  row[D_SEX] = parseInt(row[D_SEX]);
                }
                if (mm.opt.chartAge.unit !== undefined && mm.opt.chartAge.unit !== null) {
                  row[D_AGE] = parseInt(row[D_AGE]);
                }
              }
              if (row[D_CNT] !== undefined) row[D_CNT] = parseInt(row[D_CNT]);

              data.push(row);
            }
          }

          return {header, data, options: mm.opt};
        })
        .catch(error => {
          console.error('Error parsing CSV:', error);
          throw error;
        });
    },
    randWeights: (weights) => {
      const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
      const random = Math.floor(Math.random() * total) + 1;
      let current = 0;
      for (const key in weights) {
        current += weights[key];
        if (random <= current) {
          return key;
        }
      }
    },
    stackedTitle: (d, keyFormat = null) => {
      let is_bar = isNaN(d.value);
      let s_suf = '';
      if (gg.dt === DT_COVID) {
        switch (1) {
          default:
            let ymd = moment(d.key).format('YYYY-MM-DD');
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[0][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[0][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[1][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[1][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[2][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[2][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[3][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[3][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[4][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[4][1];
              break;
            }

            if (ymd === mm.opt.assets.chartDateLineYmdMsg[5][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[5][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[6][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[6][1];
              break;
            }

            if (ymd === mm.opt.assets.chartDateLineYmdMsg[7][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[7][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[8][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[8][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[9][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[9][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[10][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[10][1];
              break;
            }

            if (ymd === mm.opt.assets.chartDateLineYmdMsg[11][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[11][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[12][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[12][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[13][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[13][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[14][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[14][1];
              break;
            }

            if (ymd === mm.opt.assets.chartDateLineYmdMsg[15][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[15][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[16][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[16][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[17][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[17][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[18][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[18][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[19][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[19][1];
              break;
            }
            if (ymd === mm.opt.assets.chartDateLineYmdMsg[20][0]) {
              s_suf = mm.opt.assets.chartDateLineYmdMsg[20][1];
              break;
            }
            break;
        }
      }

      let keyStr = keyFormat ? keyFormat(d.key) : d.key;

      if (!is_bar) {
        //N日 移動平均
        return keyStr + '\n週間移動平均: ' + php_number_format(d.value) + '名';
      }

      let flt = mm.chartName.filters();
      let pref_mode = flt.length > 1 && flt.length <= mm.chartStack[STACK_PL1].length;
      if (pref_mode) {
        let s = '';
        for (let f of flt) {
          s += d.value.nmcnt[f] ? (f + ': ' + d.value.nmcnt[f] + '名\n') : '';
        }
        return keyStr + '\n────────\n' + s + (flt.length > 1 ? '────────\n計: ' + d.value.total + '名' : '') + '\n' + s_suf;
      } else if (pnl.date.stack_type === STACK_AGE) {
        let s = '';
        for (var i = 0; i < d.value.agcnt.length; i++) {
          if (d.value.agcnt[i] === 0) continue
          let per = _.round(100 * d.value.agcnt[i] / d.value.total, 1) + '%';
          let nm = mm.chartStack[STACK_AGE][i];
          s += php_sprintf("%' -8s", nm) + ': ' + php_sprintf("%' 3s", php_number_format(d.value.agcnt[i])) + ' (' + per + ')\n';
        }
        return keyStr + '\n──────────\n' + s + '──────────\n計: ' + php_number_format(d.value.total) + '\n' + s_suf;
      } else { // tack_type==='con'
        if (gg.dt === DT_COVID) {
          return keyStr + '\n────────\n' +
            (d.value.lv_a === 0 ? '' : CND_LV_A + ': ' + d.value.lv_a + '名\n') +
            (d.value.lv_b === 0 ? '' : CND_LV_B + ': ' + d.value.lv_b + '名\n') +
            (d.value.lv_c === 0 ? '' : CND_LV_C + ': ' + d.value.lv_c + '名\n') +
            (d.value.lv_d === 0 ? '' : CND_LV_D + ': ' + d.value.lv_d + '名\n') +
            (d.value.lv_e === 0 ? '' : CND_LV_E + ': ' + d.value.lv_e + '名\n') +
            '────────\n計: ' + php_number_format(d.value.total) + '名' + '\n' + s_suf;
        } else {
          let s = '';
          for (var i = 0; i < d.value.cdcnt.length; i++) {
            if (d.value.cdcnt[i] === 0) continue
            let per = _.round(100 * d.value.cdcnt[i] / d.value.total, 1) + '%';
            let nm = mm.chartStack[STACK_CND][i];
            s += php_sprintf("%' -8s", nm) + ': ' + php_sprintf("%' 3s", php_number_format(d.value.cdcnt[i])) + ' (' + per + ')\n';
          }
          return keyStr + '\n──────────\n' + s + '──────────\n計: ' + php_number_format(d.value.total) + '\n' + s_suf;

        }
      }
    },
    getStackName: (name) => {
      let ret = name;
      switch (pnl.date.stack_type) {
        case STACK_CND:
          ret = name;
          break;
        case STACK_PL1:
          ret = mm.chartName.filters()[+name.split(':')[1]];
          break;
        case STACK_AGE:
          ret = mm.opt.chartAge.unit ? mm.opt.chartAge.unit.findIndex(o => o === name) : name;
          break;
      }
      return ret;
    },
    // Unit単位でまるめる
    // 例: 10単位: 75=>70 83=>80 / 5単位: 72.5=>70 78.5=>75 / 2単位: 77.5=>76 78.2=78
    roundDownToScale: (value, unit) => {
      return value - (value % unit);
    },
    // 少数第Nで四捨五入
    roundDownToScaleRound: (value, precision) => {
      return _.round(value, precision)
    },
    getScaledDimension: (dataIndex, scale, labelSuffix = '') => {
      let dim;
      if (scale) {
        // 少数第Nで四捨五入書式:(@round:<precision>)の時
        const precision = mm.util.parseOptionScale(scale);
        if (precision !== null) {
          dim = mm.ndx.dimension(function (d) {
            return mm.util.roundDownToScaleRound(d[dataIndex], precision) + labelSuffix;
          });
        } else {
          dim = mm.ndx.dimension(function (d) {
            return mm.util.roundDownToScale(d[dataIndex], scale) + labelSuffix;
          });
        }
      } else {
        dim = mm.ndx.dimension(function (d) {
          return d[dataIndex] + labelSuffix;
        });
      }
      return dim;
    },
    getLabelSuffixSex: () => {
      return mm.opt.chartSex.labelSuffix ?? '';
    },
    getScaledDimensionPref: (dataIndex) => {
      return mm.ndx.dimension(function (d) {
        let ret = d[dataIndex];
        PREFECTURES.forEach(function (pre, i) {
          // preから 都と府と県の文字を取り除く
          const pre2 = pre.replace(/[都府県]/g, '');
          // 都道府県＋市区町村名(d[dataIndex]) が pre を含む場合
          if (d[dataIndex].indexOf(pre2) !== -1) {
            ret = pre;
            return false;
          }
        })
        return ret;
      });
    },
    getScaledDimensionSex: () => {
      return mm.util.getScaledDimension(D_SEX, mm.opt.chartSex.scale, mm.util.getLabelSuffixSex());
    },
    getLabelSuffixAge: () => {
      return mm.opt.chartAge.labelSuffix ?? '';
    },
    getScaledDimensionAge: () => {
      return mm.util.getScaledDimension(D_AGE, mm.opt.chartAge.scale, mm.util.getLabelSuffixAge());
    },
    getLabelSuffixCond: () => {
      return mm.opt.chartCond.labelSuffix ?? '';
    },
    getScaledDimensionCond: () => {
      return mm.util.getScaledDimension(D_CND, mm.opt.chartCond.scale, mm.util.getLabelSuffixCond());
    },
    getChartDetailsHtml: (d, detailType, titleHref = '') => {
      return `<tr><td>${pnl.name.title}</td><td>: <a target="_blank" href="${titleHref}">${d[D_PL1]}</a></td></tr>` +
        (detailType !== 'name_light' && !pnl.city.isHidden ? `<tr><td>${pnl.city.title}</td><td>: ${d[D_PL2]}</td></tr>` : '') +
        (pnl.date.isHidden ? '' : `<tr><td>${pnl.date.title}</td><td>: ${moment(d[D_YMD]).format('YYYY-MM-DD(ddd)')}</td></tr>`) +
        (pnl.sex.isHidden ? '' : `<tr><td>${pnl.sex.title}</td><td>: ${mm.getLabelSex(d[D_SEX])}</td></tr>`) +
        (pnl.age.isHidden ? '' : `<tr><td>${pnl.age.title}</td><td>: ${mm.getLabelAge(d[D_AGE])}</td></tr>`) +
        (pnl.cond.isHidden ? '' : `<tr><td>${pnl.cond.title}</td><td>: ${mm.getLabelCond(d[D_CND])}</td></tr>`) +
        (pnl.job.isHidden ? '' : `<tr><td>${pnl.job.title}</td><td>: ${d[D_JOB]}</td></tr>`);
    },
    getExChartDetailsHtml: (d) => {
      let ret = '';
      for (let k = 0; k < pnl.ex.length; k++) {
        const ex = pnl.ex[k];
        if (ex.isHidden) continue;
        const v = mm.getLabelEx(d[D_EX0 + k], k);
        ret += `<tr><td>${ex.title}</td><td>: ${v}</td></tr>`;
      }
      return ret;
    }
  },
  // group_reduce function set (CND,PL1,AGE)
  group_reduce: {
    base: d => {
      return (d[D_CNT] || 1);
    },
    baseZero: d => {
      return (d[D_CNT] || 0);
    },
    add: (p, v, dir) => {
      const c = dir * mm.group_reduce.base(v);

      // CND
      if (gg.dt === DT_COVID) {
        p = mm.group_reduce_cnd_set(p, v[D_CND], c);
      } else {
        const cond = mm.opt.chartCond.scale ?
          mm.util.roundDownToScale(v[D_CND], mm.opt.chartCond.scale) : v[D_CND];
        p = mm.group_reduce_cnd_set_custom(p, mm.chartStackIdxCnd[cond + mm.util.getLabelSuffixCond()], c);
      }

      // PL1
      let nm = v[D_PL1]
      if (p.nmcnt[nm] === undefined) p.nmcnt[nm] = 0;
      p.nmcnt[nm] += c;

      // AGE
      if (mm.opt.chartAge.unit) {
        p = mm.group_reduce_age_set_custom(p, v[D_AGE], c);
      } else if (mm.opt.chartAge.unit === null) {
        let age;
        if (mm.opt.chartAge.scale) {
          const precision = mm.util.parseOptionScale(mm.opt.chartAge.scale);
          age = precision === null
            ? mm.util.roundDownToScale(v[D_AGE], mm.opt.chartAge.scale)
            : mm.util.roundDownToScaleRound(v[D_AGE], mm.opt.chartAge.scale);
        } else {
          age = v[D_AGE];
        }
        p = mm.group_reduce_age_set_custom(p, mm.chartStackIdxAge[age + mm.util.getLabelSuffixAge()], c);
      } else {
        p = mm.group_reduce_age_set(p, v[D_AGE], c);
      }

      p.total += c;
      return p;
    },
    append: (p, v) => mm.group_reduce.add(p, v, 1),
    remove: (p, v) => mm.group_reduce.add(p, v, -1),
    init: (/*p, v*/) => {
      const o = {
        nmcnt: {},
        agcnt: new Int32Array(mm.chartStack[STACK_AGE].length),
        total: 0
      };
      if (gg.dt === DT_COVID) {
        o.lv_a = 0;
        o.lv_b = 0;
        o.lv_c = 0;
        o.lv_d = 0;
        o.lv_e = 0;
      } else {
        o.cdcnt = new Int32Array(mm.chartStack[STACK_CND].length);
      }
      return o;
    }
  },
  // group_reduce light function set (CND)
  group_reduce_light: {
    add: (p, v, dir) => {
      const c = dir * mm.group_reduce.base(v);
      const l = v[D_CND];
      p = mm.group_reduce_cnd_set(p, l, c);
      p.total += c;
      return p;
    },
    append: (p, v) => mm.group_reduce_light.add(p, v, 1),
    remove: (p, v) => mm.group_reduce_light.add(p, v, -1),
    init: (/*p, v*/) => {
      return {lv_a: 0, lv_b: 0, lv_c: 0, lv_d: 0, lv_e: 0, total: 0};
    }
  },
  // 並び順 - 時間昇順。(制約:dimensionのgroupデータが1件のデータである事)
  orderYmd: d => {
    return mm.ndx.all().find(d2 => d2[D_PL2] === d.key)[D_YMD];
  },
  dateStackPl1Names: [],

  // chartStack
  chartStack: [
    [CND_LV_A, CND_LV_B, CND_LV_C, CND_LV_D, CND_LV_E],
    ['S:0', 'S:1', 'S:2', 'S:3', 'S:4'],
    ['幼児', '10歳未満', '10代', '20代', '30代', '40代', '50代', '60代', '70代', '80代', '90代', '100代', DN_LABEL_DEF]
  ],
  chartStackIdxCnd: {},
  chartStackIdxAge: {},

  // datePickerのActive色にする日付を作成
  dateCntCreate: function () {
    mm.dateCnt = {};
    mm.dateCntMax = -1;
    mm.dateCntTo = '00000000';
    _.forEach(mm.gpDate.all(), (d) => {
      let ymd = moment(d.key).format('YYYYMMDD');
      mm.dateCnt[ymd] = d.value;
      if (d.value > mm.dateCntMax) mm.dateCntMax = d.value;
      if (d.value > 0 && ymd > mm.dateCntTo) mm.dateCntTo = ymd;
    });
  },
  getLegendItemMaxInfo: function () {
    //文字列配列の中で一番大きい文字列のからLegendItemのWを決定
    const calcLegendItemWidth = (strArray) => {
      const maxLength = mm.util.arrStrMaxLen(strArray);
      if (maxLength < 7) return 70;
      if (maxLength < 15) return 80;
      if (maxLength < 20) return 90;
      if (maxLength < 25) return 110;
      if (maxLength < 32) return 120;
      return 130;
    }
    const legendItemMaxN = _.max([
      //mm.names.length,
      mm.ages.length,
      mm.conds.length]);
    const legendItemMaxW = _.max([
      //calcLegendItemWidth(mm.names),
      calcLegendItemWidth(mm.ages),
      calcLegendItemWidth(mm.conds)]);
    return {legendItemMaxN, legendItemMaxW};
  },
  detals: [],
  getDetailInfo: async function (keyword) {
    keyword = keyword.replace(TAGICON_DS, ' ディスクシステム');
    const url = `https://ja.wikipedia.org/w/api.php?action=query&list=search&srsearch=${keyword}&format=json&origin=*`;
    let ret = '';
    const response = await fetch(url, {method: 'GET', cache: 'force-cache'});
    if (response.ok) {
      const data = await response.json();
      ret = data.query.search.length ? data.query.search[0].snippet : '';
    }
    return ret;
  },
  getLabelSeason: s => MONTH_2_SEASON[parseInt(s)],
  getLabelWeek: s => WEEK_LABEL[s],
  getLabelSex: function (s) {
    let ret;
    if (mm.opt.chartSex.unit) {
      ret = mm.opt.chartSex.unit[s] ?? DN_LABEL_DEF;
    } else if (mm.opt.chartSex.unit !== null) {
      const is = parseFloat(s);
      ret = isNaN(is) ? s : SEX_LABEL[is];
    } else {
      ret = s + (mm.opt.chartSex.labelSuffix ?? '');
    }
    return ret;
  },
  getLabelAge: function (s) {
    let ret = s;
    if (gg.dt === DT_COVID) {
      switch (s) {
        case DN_AGE:
        case DN_AGE2:
          ret = DN_LABEL_DEF;
          break;
        case DI_AGE_INFA:
          ret = mm.chartStack[STACK_AGE][0]; //幼児
          break;
        case DI_AGE_LT10:
          ret = mm.chartStack[STACK_AGE][1]; //10歳未満
          break;
        default:
          ret = s + mm.config.cAge.scaledSuffix;
          break;
      }
    } else {
      if (mm.opt.chartAge.unit) {
        ret = mm.opt.chartAge.unit[s] ?? DN_LABEL_DEF;
      } else {
        ret = s + (mm.opt.chartAge.labelSuffix ?? '');
      }
    }
    return ret;
  },
  getLabelCond: function (s) {
    return s === DN_CND ? DN_LABEL_DEF : s + (mm.opt.chartCond.labelSuffix ?? '')
  },
  getLabelEx: function (s, i) {
    let ret;
    if (mm.opt.chartEx[i].unit) {
      ret = mm.opt.chartEx[i].unit[s] ? mm.opt.chartEx[i].unit[s] : DN_LABEL_DEF;
    } else {
      ret = s + (mm.opt.chartEx[i].labelSuffix ?? '')
    }
    return ret;
  },
  getChartMapTooltip: function (name) {
    if (mm.opt.chartMap.isDetailTooltip) {
      const dataIndex = mm.opt.chartMap.refData === 'city' ? D_PL2 : D_PL1;
      const d = mm.data.find(d2 => d2[dataIndex] === name);

      return d ? mm.util.getChartDetailsHtml(d, mm.opt.detailType) + mm.util.getExChartDetailsHtml(d) : '';
    } else {
      return (name + ' : ' + php_number_format(mm.getPrefCntTbl()[name] ?? 0));
    }
  },
  getChartNameCovid19Title: function (pre_name, br) {
    let p = mm.opt.assets.pref_tbl_last_m1[pre_name];
    if (p === undefined) return '';
    let n = mm.namesCount[pre_name] ?? 0;
    // let patient=n-p.discharged-p.deaths;//現患者数=感染者数-退院者数-死亡者数
    let patient = p.carriers - p.discharged - p.deaths;//現患者数=感染者数-退院者数-死亡者数
    let ret = pre_name + br +
      '総人口　: ' + php_number_format(p.n) + '名' + br +
      '感染者数: ' + php_number_format(n) + '名 (' + (_.round(100 * n / p.n, 3)) + '%)' + br +
      '患者数　: ' + php_number_format(patient) + '名' + br +
      'PCR検査: ' + php_number_format(p.pcrtested) + '名 (' + p.pcrtested_p + '%)' + br +
      '死亡者数: ' + p.deaths + '名' + br +
      '退院者数: ' + php_number_format(p.discharged) + '名' + br +
      '対策病床数: ' + php_number_format(p.bed) + '床 (' + (_.round(100 * patient / p.bed, 2)) + '%)' + br +
      br + '※バーは長押しで単一選択となります。' + br;
    return ret;
  },

  // Keyboard
  keyboardSearch: null,

  keyboardInputName: '#name_search',
  keyboardInputCity: '#city_search',


  keyboardOptions: {
    // layout: 'qwerty'
    layout: 'custom',
    display: {
      'cmd_search': '&nbsp;<span class="ui-icon ui-icon-search"></span>検索&nbsp;',
      'cmd_clear': '&nbsp;<span class="ui-icon ui-icon-closethick"></span>クリア&nbsp;',
      'cmd_close': '&nbsp;&nbsp;&nbsp;<span class="ui-icon ui-icon-circle-close"></span>&nbsp;&nbsp;&nbsp;',
      'shift': '&nbsp;かな英数&nbsp;',
      'alt': '&nbsp;小&nbsp;',
      'accept': '&nbsp;&nbsp;閉じる&nbsp;&nbsp;'
    },
    customLayout: {
      'normal': [
        '{sp:15} {cmd_close}',
        'ア カ ガ サ ザ タ ダ ナ ハ バ マ ヤ ラ ワ {b}',
        'イ キ ギ シ ジ チ ヂ ニ ヒ ビ ミ イ リ ン {b}',
        'ウ ク グ ス ズ ツ ヅ ヌ フ ブ ム ユ ル ＆ {b}',
        'エ ケ ゲ セ ゼ テ デ ネ ヘ ベ メ エ レ | {b}',
        'オ コ ゴ ソ ゾ ト ド ノ ホ ボ モ ヨ ロ ー {b}',
        '{b} {shift} {alt} {space} {cmd_clear} {cmd_search}',
      ],
      'alt': [
        '{sp:15} {cmd_close}',
        'ァ ヵ ヵ サ ザ タ ダ ナ ハ バ マ ャ ラ ヮ {b}',
        'ィ キ ギ シ ジ チ ヂ ニ ヒ ビ ミ ィ ㇼ ン {b}',
        'ゥ ク グ ス ズ ッ ヅ ヌ フ ブ ム ュ ㇽ ＆ {b}',
        'ェ ヶ ゲ セ ゼ テ デ ネ ヘ ベ メ ェ ㇾ | {b}',
        'ォ コ ゴ ソ ゾ ト ド ノ ホ ボ モ ョ ㇿ ー {b}',
        '{b} {shift} {alt} {space} {cmd_clear} {cmd_search}',
      ],
      'shift': [
        '{sp:15} {cmd_close}',
        'あ か が さ ざ た だ な は ば ま や ら わ {b}',
        'い き ぎ し じ ち じ に ひ び み い り ん {b}',
        'う く ぐ す ず つ づ ぬ ふ ぶ む ゆ る ＆ {b}',
        'え け げ せ ぜ て で ね へ べ め え れ | {b}',
        'お こ ご そ ぞ と ど の ほ ぼ も よ ろ ー {b}',
        '{b} {shift} {alt} {space} {cmd_clear} {cmd_search}',

        '{b} 1 2 3 4 5 6 7 8 9 0 ~ | \\ {b}',
        '{b} ! " # $ % & \' ( ) _ - + = {b}',
        '{b} Q W E R T Y U I O P @ { } {b}',
        '{b} A S D F G H J K L ; : [ ] {b}',
        '{shift} Z X C V B N M , . < > ? /',
      ],
      'alt-shift': [
        '{sp:15} {cmd_close}',
        'ぁ か が さ ざ た だ な は ば ま ゃ ら ゎ {b}',
        'ぃ き ぎ し じ ち じ に ひ び み ぃ り ん {b}',
        'ぅ く ぐ す ず っ づ ぬ ふ ぶ む ゅ る ＆ {b}',
        'ぇ け げ せ ぜ て で ね へ べ め ぇ れ | {b}',
        'ぉ こ ご そ ぞ と ど の ほ ぼ も ょ ろ ー {b}',
        '{b} {shift} {alt} {space} {cmd_clear} {cmd_search}',

        '{b} 1 2 3 4 5 6 7 8 9 0 ~ | \\ {b}',
        '{b} ! " # $ % & \' ( ) _ - + = {b}',
        '{b} q w e r t y u i o p @ { } {b}',
        '{b} a s d f g h j k l ; : [ ] {b}',
        '{shift} z x c v b n m , . < > ? /',
      ]
    },
    //language: 'ja',
    //initialFocus : true,　//フォーカスでOPEN
    openOn: null,    //null:イベントクリックで開かない
    stayOpen: true,  //開いたまま
    noFocus: true,
    //appendLocally: true,
    usePreview: false, //INPUTの表示

    visible: function (a, b) {
      $('.ui-keyboard')
        .css({
          // 'position':'fixed'
          // ,'top': window.innerHeight-$('.ui-keyboard').height()
          'cursor': 'move',
          'padding': '2px',
        })
        .draggable();
    },
    beforeClose: function (e, keyboard, el) {
      const o = $(el);
      // 複数キーボード使用時、フォーカスが切り替わった時に他方がクリアされるのを防ぐ
      o.val(o.data('keyboard_Input_val')).trigger('change');
    },
  },
  chartFilterInit: function (inputSelector, autocompleteData) {
    $(inputSelector).on('change keyup input', function (e) {
      //　キーワードで SVG内のrowの表示をフィルタリング
      const o = $(this);
      const w = o.val().trim();
      const chartSvgDiv = o.data('filter_svg_div');
      const items = $(chartSvgDiv + ' g.row');
      let n = 0;

      // フィルタの設定をURLに反映
      switch ('#' + o.attr('id')) {
        case mm.keyboardInputName:
          mm.onChangeURL('name_filter', w);
          break;
        case mm.keyboardInputCity:
          mm.onChangeURL('name2_filter', w);
          break;
      }
      // チャートのSVG内の項目の表示をフィルタ
      for (var i = 0; i < items.length; i++) {
        const it = items.eq(i)
        const name = it.find('text:eq(0)').text();
        if (mm.util.isMatchRegexI(name, w)) {
          it.show();
          it.attr('transform', `translate(0,${5 + (n * (IMG_THUMBNAIL_W + 1))})`);
          n++;
        } else {
          it.hide();
        }
      }
      const filterCnt = $(o.data('filter_cnt'));
      if (w === '') {
        filterCnt.text('').hide();
      } else {
        filterCnt.text(n).show();
      }
      document.querySelector(chartSvgDiv).scrollTop = 0;
      if (w !== '') o.data('keyboard_Input_val', w);
    })
      .autocomplete({
        source: function (request, response) {
          const results = $.ui.autocomplete.filter(autocompleteData, request.term);
          response(results.slice(0, 5));  // 最大N件まで表示
        },
        select: function (event, ui) {
          $(this).val(ui.item.label).trigger('change');
          $(this).autocomplete("close");
        },
        position: {
          my: "left+20 top",
          at: "right top",
          collision: "flipfit flipfit"
        }
      });
  },
  keyboardInit: function () {
    // キーボードカスタムボタン定義
    $.extend($.keyboard.keyaction, {
      cmd_search: function (base) {
        const id = base.$el.attr('id');
        if (id === 'input-search') {
          $('#input-search').trigger('input-search-update');
        }
      },
      cmd_clear: function (base) {
        base.$preview.val('').data('keyboard_Input_val', '');
      },
      cmd_close: function (base, a, b) {
        $('.ui-keyboard-keyset').hide();
      }
    });

    $(mm.keyboardInputName).keyboard({
      ...mm.keyboardOptions,
      change: function (e, keyboard, el) {
        $(el).trigger('input');
      },
      position: {
        of: '#div_name',
        //at: 'left bottom+30',
        at2: 'right bottom',
        my: 'right bottom',
        collision: 'fit fit'
      },
    });

    $(mm.keyboardInputCity).keyboard({
      ...mm.keyboardOptions,
      change: function (e, keyboard, el) {
        $(el).trigger('input');
      },
      position: {
        of: '#div_city',
        //at: 'left bottom+30',
        at2: 'right bottom',
        my: 'right bottom',
        collision: 'fit fit'
      },
    });
  },
  getFilterTxt: function () {
    let name = $('#panel_name .filter_txt').val();
    let city = $('#panel_city .filter_txt').val();
    let date = $('#panel_date .filter_txt').val();
    let year = mm.chartYear.filters().join(',');
    let season = mm.chartSeason.filters().join(',');
    const weekFilters = mm.chartWeek.filters().map(v => mm.getLabelWeek(v));
    const sexFilters = mm.chartSex.filters();
    const ageFilters = mm.chartAge.filters();
    const condFilters = mm.chartCond.filters();
    let job = mm.chartJob.filters().join(',');
    let txt = _.fill(Array(8), '');
    const PL = 'と';

    if (name !== '') {
      let t = '', sp = name.split(',');
      for (let i of sp) {
        t += i.trim() + PL;
      }
      txt[1] = (sp.length === 1 ? '' : '【') + php_trim(t, PL) + (sp.length === 1 ? '' : '】');
    }

    if (city !== '') {
      let is = city.indexOf(',') !== -1;
      txt[2] = (is ? '【' : '') + city + (is ? '】' : '');
    }

    if (date !== '') {
      if (mm.chartDate.filters().length) {
        if (mm.chartDate.brushOn()) {
          txt.push(date);
        } else {
          let t = '', sp = date.split(',');
          for (let i of sp) {
            t += i + PL;
          }
          txt[0] = (sp.length === 1 ? '' : '【') + php_trim(t, PL) + (sp.length === 1 ? '' : '】');
        }
      }
    }
    if (year !== '') {
      const isMulti = year.indexOf(',') !== -1;
      txt[3] = isMulti ? `年:【${year}】` : `${year}年`;
    }
    if (season !== '') {
      const isMulti = season.indexOf(',') !== -1;
      txt[4] = isMulti ? `季節:【${season}】` : season;
    }
    if (weekFilters.length) {
      const isMulti = weekFilters.length > 1
      const weekStr = weekFilters.join(',')
      txt[5] = isMulti ? `曜日:【${weekStr}】` : `${weekStr}曜日`;
    }
    if (sexFilters.length) {
      const isMulti = sexFilters.length > 1
      const str = sexFilters.join(',')
      txt[6] = isMulti ? `${pnl.sex.title}:【${str}】` : `${pnl.sex.title}:${str}`;
    }
    if (ageFilters.length) {
      const isMulti = ageFilters.length > 1
      const str = ageFilters.join(',')
      txt[7] = isMulti ? `${pnl.age.title}:【${str}】` : `${pnl.age.title}:${str}`;
    }
    if (condFilters.length) {
      const isMulti = condFilters.length > 1
      const str = condFilters.join(',')
      txt[8] = isMulti ? `${pnl.cond.title}:【${str}】` : `${pnl.cond.title}:${str}`;
    }
    if (job !== '') {
      let isOne = job.indexOf(',') === -1;
      let jobs = '';
      job.split(',').forEach((v, j) => {
        jobs += (j === 0 ? '' : ',') + mm.config.cJob.keyLabel(v);
      });
      txt[9] = pnl.job.title + ':' + (isOne ? mm.config.cJob.keyLabel(job) : '【' + jobs + '】');
    }

    for (let k = 0; k < pnl.ex.length; k++) {
      const ex = pnl.ex[k];
      if (ex.isHidden) continue;
      const exFilters = mm.chartEx[k].filters().map(v => mm.getLabelEx(v, k));
      if (exFilters.length) {
        const isMulti = exFilters.length > 1
        const str = exFilters.join(',')
        txt[9 + k] = isMulti ? `${ex.title}:【${str}】` : `${ex.title}:${str}`;
      }
    }

    return txt;
  },
  filterPrefChart: function (prefs) {
    const chart = mm.opt.chartMap.refData === 'city' ? mm.chartCity : mm.chartName;
    const names = mm.opt.chartMap.refData === 'city' ? mm.citys : mm.names;
    let pre = [];
    for (const i of prefs) {
      if (_.indexOf(names, i) !== -1) pre.push(i);
    }
    if (pre.length === 0) {
      chart.filterAll();
      mm.renderAllChart();
      return;
    }

    const f = chart.filters();
    const diff = pre.length > f.length ? _.difference(pre, f) : _.difference(f, pre);
    chart.filter(diff[0]);//差分をadd

    mm.renderAllChart();
  },
  renderAllChartFilterByKW: function (kw) {
    const AC_SPLIT_WD = /\s+/;
    let fnd = [];

    // date
    if (!isNaN(kw[0])) {
      let d = moment(kw);
      if (d.isValid()) {
        let a = d.format('YYYY-MM-DD');
        if (a.indexOf('2001') !== -1) {
          let s = a.split('-');
          d = moment('2020-' + s[1] + '-' + s[2]);
        }
        mm.composite.filterAll().filter(d.toDate());
        mm.renderAllChart();
        mm.barChartRedrawGroup(mm.chartDate);
        return 1;
      }
    }

    // job
    fnd = [];
    let words, jobs;
    if (mm.isSexAgeSuffixWord(kw)) {
      const pre0S = kw.replace(/\s+/g, '');
      words = [pre0S];
      jobs = mm.jobs.map(v => v.replace(/\s+/g, ''));// mm.jobjs 内の全ての文字列のスペースを削除
    } else {
      words = kw.split(AC_SPLIT_WD);
      jobs = mm.jobs;
    }
    for (const pre1 of words) { // スペース区切りの複数ワード対応
      const list = mm.is_job_cate ? mm.opt.assets.jobcates : jobs;
      if (_.indexOf(list, pre1) !== -1) { // 完全一致
        fnd.push(kw);
      }
    }
    if (fnd.length) {
      mm.chartJob.filterAll().filter([fnd]);
      mm.renderAllChart();
      return 1;
    }

    // cond
    fnd = [];
    for (const pre1 of kw.split(AC_SPLIT_WD)) { // スペース区切りの複数ワード対応
      if (_.indexOf(mm.conds, pre1) !== -1) {　// 完全一致
        fnd.push(pre1);
      }
    }
    if (fnd.length) {
      mm.chartCond.filterAll().filter([fnd]);
      mm.renderAllChart();
      return 1;
    }

    //mm.chartNameにない物は除外 前方一致
    let pre_names = mm.names, city = '', is_pre_find = 0;
    let names = [];
    for (const pre1 of kw.split(AC_SPLIT_WD)) { // スペース区切りの複数ワード対応
      for (const nm of pre_names) {
        if (nm.indexOf(pre1) !== -1) {
          if (names.length === 0) city = pre1.replace(nm, '');
          names.push(nm);
          is_pre_find = 1;
        }
      }
    }

    // name
    if (is_pre_find) {
      const uniqNames = [...new Set(names)];
      mm.chartName.filterAll().filter(uniqNames.length === 1 ? uniqNames[0] : [uniqNames]);
      mm.chartCity.filterAll();
      mm.renderAllChart();
      mm.chartScroll('#div_name', names[0], 300);
      return 1;
    }

    const isFind = (a, b, preMatch) => {
      return preMatch
        ? a.indexOf(b) === 0  // 前方一致の方式
        : a.indexOf(b) !== -1 // 部分一致の方式
    }
    city = kw;
    if (gg.dt === DT_COVID) {
      // 前方に都道府県を含む場合は都道府県を取り除く 例:鹿児島県霧島市 -> 霧島市
      for (const nm of pre_names) {
        if (kw.indexOf(nm) === 0) {
          city = kw.replace(nm, '');
        }
      }
    }
    if (city === '') return 0;

    //市区町村
    //mm.chartCity.filterAll().filter(city);//single
    let citys = _.filter(mm.citys, (d) => isFind(d, city, mm.config.cCity.preMatch)); // multi
    if (citys.length) {
      mm.chartName.filterAll();
      mm.chartCity.filterAll().filter([citys]);
      mm.renderAllChart();
      $('#ch_pnl_city').prop('checked', true).trigger('ch_pnl_update');
      mm.chartScroll('#div_city', city, 300);
      return 1;
    }
    return 0;
  },
  parseURLParams: function () {
    let isRedraw = false;
    // chartName
    isRedraw = mm.chart.filterFromGetParam(mm.chartName, 'name', isRedraw);

    if (mm.get.name_filter) {
      $(mm.keyboardInputName).data('keyboard_Input_val', mm.get.name_filter);
      _.delay(() => {
        $('.chart-filter-toggle.name').trigger('click', {doFocus: 0, doKeyboardOpen: 0});
      }, 10);
    }

    // chartCity
    isRedraw = mm.chart.filterFromGetParam(mm.chartCity, 'name2', isRedraw);

    if (mm.get.name2_filter) {
      $(mm.keyboardInputCity).val(mm.get.name2_filter).data('keyboard_Input_val', mm.get.name2_filter);
      _.delay(() => {
        $('.chart-filter-toggle.city').trigger('click', {doFocus: 0, doKeyboardOpen: 0});
      }, 10);
    }

    // chartYear
    // 　- yearを指定。例:2020 複数は+で連結
    isRedraw = mm.chart.filterFromGetParam(mm.chartYear, 'year', isRedraw);

    // chartSeason
    // 　- seasonMonthを指定。1~12　複数は+で連結
    if (mm.get.season) {
      let seasons = mm.get.season.split(' ').map(v => mm.getLabelSeason(v)).filter(v => v !== undefined);
      seasons = [...new Set(seasons)];
      if (seasons.length > 0) {
        const flt = seasons.length === 1 ? seasons[0] : [seasons];
        mm.chartSeason.filterAll().filter(flt);
        isRedraw = true;
      }
    }

    // chartWeek
    // 　- weekIdを指定。(0:日 1:月 2:火 3:水 4:木 5:金 6:土)　
    if (mm.get.week) {
      const weeks = mm.get.week.split(' ').map(v => parseInt(v)).filter(v => v >= 0 && v <= 6);
      if (weeks.length > 0) {
        const flt = weeks.length === 1 ? weeks[0] : [weeks];
        mm.chartWeek.filterAll().filter(flt);
        isRedraw = true;
      }
    }

    // chartSex
    if (mm.get.name3) {
      const name3s = mm.get.name3.split(' ');
      const flt = name3s.length === 1 ? name3s[0] : [name3s]
      mm.chartSex.filterAll().filter(flt);
      isRedraw = true;
    }

    // chartAge
    isRedraw = mm.chart.filterFromGetParam(mm.chartAge, 'name4', isRedraw);
    // chartCond
    isRedraw = mm.chart.filterFromGetParam(mm.chartCond, 'name5', isRedraw);
    // chartJob
    isRedraw = mm.chart.filterFromGetParam(mm.chartJob, 'name6', isRedraw);
    // chartEx[0~N]
    isRedraw = mm.chart.filterFromGetParam(mm.chartEx[0], 'name7', isRedraw);
    isRedraw = mm.chart.filterFromGetParam(mm.chartEx[1], 'name8', isRedraw);
    isRedraw = mm.chart.filterFromGetParam(mm.chartEx[2], 'name9', isRedraw);
    isRedraw = mm.chart.filterFromGetParam(mm.chartEx[3], 'name10', isRedraw);
    isRedraw = mm.chart.filterFromGetParam(mm.chartEx[4], 'name11', isRedraw);
    isRedraw = mm.chart.filterFromGetParam(mm.chartEx[5], 'name12', isRedraw);
    isRedraw = mm.chart.filterFromGetParam(mm.chartEx[6], 'name13', isRedraw);
    isRedraw = mm.chart.filterFromGetParam(mm.chartEx[7], 'name14', isRedraw);

    // 検索INPUT
    if (mm.get.q) {
      $('#input-search').val(mm.get.q.trim());
      mm.is_trigger_search = 1;
    }
    // chartDate
    // date=3-4      //単一日 4月4日
    // date=3-4+3-8  //範囲日 4月4日~4月8日
    // date=3-4+3    //範囲日 4月4日 + 3day
    if (mm.get.date) {
      const date_get = (s) => {//[YYYY]-MM-DD
        let ret;
        let s2 = s.split('-');
        switch (s2.length) {
          case 3:
            ret = moment(s2[0] + '-' + php_printf02d(parseInt(s2[1])) + '-' + php_printf02d(parseInt(s2[2])));
            break;
          case 2:
            ret = moment(moment().format('YYYY') + '-' + php_printf02d(s2[0]) + '-' + php_printf02d(s2[1]));
            break;
          case 1:
            ret = s;
            break;
        }
        return ret;
      }
      let from_to = mm.get.date.split(' '), from, to;
      let range = 0;
      switch (from_to.length) {
        case 1://4-4 => 単一日 4月4日
          from = date_get(from_to[0]);
          if (from === '') break;
          if (isNaN(parseInt(from))) {
            range = dc.filters.RangedFilter(from.toDate(), from.add(1, 'days').toDate());
          }
          break;
        case 2:
          from = date_get(from_to[0]);
          to = date_get(from_to[1]);
          if (from === '' || to === '') break;
          if (isNaN(parseInt(to)) && to !== '') {//4-4+4-8 => 範囲日 4月4日~4月8日
            range = dc.filters.RangedFilter(from.toDate(), to.toDate());
          } else {//4-4+3 => 範囲日 4月4日 + 3day; 4-4+ => 範囲日 4月4日 + tommorow
            range = dc.filters.RangedFilter(from.toDate(), (to === '' ? moment().add(1, 'days') : from.add(to, 'days')).toDate());
          }
          break;
      }
      if (range) {
        mm.composite.replaceFilter(range);
        mm.chartDate.replaceFilter(range);
        pnl.date.isBrushOn = true;
      }
    }
    if (!mm.is_trigger_search && isRedraw) dc.redrawAll("chartGroup");
  },
  onChangeURL: function (type, arg) {
    let url = '', filters;
    switch (type) {
      case 'name':  // chartName
      case 'name2': // chatCity
      case 'name3': // chartSex
      case 'name4': // chartAge
      case 'year':  // chartYear
      case 'season':// chartSeason
      case 'week':  // chartWeek
      case 'name5': // chartCond
      case 'name6': // chartJob
      case 'name7': // chartEx[0]
      case 'name8': // chartEx[1]
      case 'name9': // chartEx[2]
      case 'name10': // chartEx[3]
      case 'name11': // chartEx[4]
      case 'name12': // chartEx[5]
      case 'name13': // chartEx[6]
      case 'name14': // chartEx[7]
        if (type !== 'name' && type !== 'name2') {
          mm.lastFilteredChart = arg;
        }
        filters = arg.filters(); // chart
        if (filters.length > 0) {
          let setFilters
          if (type === 'season') {
            setFilters = filters.map(v => SEASON_IDX2_MONTH[v]).join('+');
          } else {
            setFilters = filters.join('+');
          }
          url = url_append_param(location.href, {[type]: setFilters});
          window.history.replaceState({}, '', url);
        } else {
          // clear
          const url = url_remove_param(location.href, [type]);
          window.history.replaceState({}, '', url);
        }
        break;
      case 'name_filter':
      case 'name2_filter':
        url = url_append_param(location.href, {[type]: arg});
        window.history.replaceState({}, '', url);
        break;
      case 'date':
        filters = arg.filters(); // chart
        if (filters.length === 1) {
          let from, to;
          if (filters[0].length === 2) { // Range(from-to)指定; date=2021-07-01+2024-07-07
            from = moment(filters[0][0]).format('YYYY-MM-DD');
            to = moment(filters[0][1]).format('YYYY-MM-DD');
            url = url_append_param(location.href, {'date': from + '+' + to});
          } else { // 単一指定; date=2021-07-01
            from = moment(filters[0]).format('YYYY-MM-DD');
            url = url_append_param(location.href, {'date': from});
          }
          if (url !== '') window.history.replaceState({}, '', url);
        } else if (filters.length === 0) {
          // clear
          const url = url_remove_param(location.href, ['date']);
          window.history.replaceState({}, '', url);
        }
        //else{  } // 複数指定は実装しない
        break;
      case 'q':
        const q = arg; // string
        url = url_append_param(location.href, {'q': q.replaceAll('/', '-')}); // 日付の/は+へ
        window.history.replaceState({}, '', url);
        break;
      case 'layout':
        url = url_append_param(location.href, {'layout': arg});
        window.history.replaceState({}, '', url);
        break;
      case 'data':
        url = url_append_param(location.href, {'data': arg});
        window.history.replaceState({}, '', url);
        break;
      case 'clear':
        url = url_remove_param(location.href, [[arg]]);
        window.history.replaceState({}, '', url);
        break;
      case 'clear_all':
        url = url_remove_param(location.href, [
            'name',
            'name_filter',
            'name2',
            'name2_filter',
            'name3',
            'name4',
            'name5',
            'name6',
            'name7',
            'name8',
            'name9',
            'name10',
            'name11',
            'name12',
            'name13',
            'name14',
            'date',
            'year',
            'season',
            'week',
            'q'
          ]
        );
        window.history.replaceState({}, '', url);
        break;
      case 'clear_layout':
        url = url_remove_param(location.href, ['layout']);
        window.history.replaceState({}, '', url);
        break;
    }
  },
  makeAutocompleteData2Dim: function (ndx, dimension1, dimension2, value) {
    const dim = ndx.dimension(d => d[dimension1]);
    const group = dim.group().reduce(
      (p, v) => { // add
        p.push(v[dimension2]);
        return p;
      },
      (p, v) => { // remove
        const index = p.indexOf(v[dimension2]);
        if (index > -1) {
          p.splice(index, 1);
        }
        return p;
      },
      () => [] // init
    );

    const ret = [];
    group.all().forEach(item => {
      for (const itemElement of item.value) {
        // retに同じものがないようにする
        const index = ret.findIndex(v => v[0] === item.key && v[1] === itemElement);
        if (index > -1) continue;
        ret.push([
          item.key,
          itemElement,
          toRomaji(itemElement),
          value ?? item.value.length // dimension1に属する dimension2の数
        ]);
      }
    });
    return ret;
  },
  makeAutocompleteData1Dim: function (group, name) {
    return group.all().map((v) => {
      const s = v.key.toString();
      const roma = mm.util.isHankaku(s) ? s.toLowerCase() : toRomaji(s);
      return [name, s, roma, v.value];
    });
  },
  showFilterUi: function (panel_sel, chart, valueFormat) {
    let flt = chart.filters();
    let pnl = $(panel_sel);
    if (flt.length) {
      let is_range = $.isArray(flt[0]);
      if (is_range) {
        let t = valueFormat(flt[0][0]) + '～' + valueFormat(flt[0][1]);
        pnl.find('.filter_txt').show().val(t).attr('title', t);
        pnl.find('.filter_txt_diff').text((moment(flt[0][1]).diff(flt[0][0], 'days') + 1) + '日間');
      } else {
        let flt2 = [];
        for (let f of flt) {
          if (valueFormat) f = valueFormat(f);
          flt2.push(f);
        }
        let t = flt2.join(',');
        pnl.find('.filter_txt').show().val(t).attr('title', t);
        pnl.find('.filter_txt_diff').text('');
      }
      pnl.find('.btn_reset').show();
    } else {
      pnl.find('.filter_txt').val('').hide();
      pnl.find('.filter_txt_diff').text('');
      pnl.find('.btn_reset').hide();
    }
  },
  // "性　名[♂♀]"の文字列の場合
  isSexAgeSuffixWord: function (d) {
    return d.indexOf(' ') !== -1 && (d.indexOf('♂') !== -1 || d.indexOf('♀') !== -1);
  },
  tube: {
    isSearch: G_IS_TUBE_SEARCH,
    search: async function (query, maxResults = 3) {
      let ret = [];
      if (!mm.tube.isSearch) return ret;

      try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=id&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=AIzaSyCI_4NUN-TJkQBHalkRrEqR5Br67gBbarI`;
        const response = await fetch(url, {method: 'GET', cache: 'force-cache'});
        if (!response.ok) {
          throw new Error('API request failed');
        }
        const data = await response.json();
        data.items.forEach(item => {
          if (item?.id?.kind === 'youtube#video') {
            ret.push(item.id.videoId);
          }
        });

      } catch (error) {
        console.log('API youtube/v3/search error');
        // YoutubeAPIが失敗するようになったらCallしないように
        mm.tube.isSearch = false;
      }
      return ret;
    },
    setPlayEvent: function () {
      $(document)
        .on('click', '.detail-tube-play', function (e) {
          if (!pnl.tube.is_show) return;
          e.preventDefault();
          pnl.tube.vid = $(this).attr('vid');
          //tubePlayer.playVideo(); // TODO:
        })
        .on('click', '.detail-tube-wopen', function (e) {
          e.preventDefault();
          const h = parseInt(screen.height);
          const w2 = parseInt(screen.width / 2);
          window.open($(this).attr('href'), '', `left=${w2 + 20},top=0,height=${h},width=${w2 - 20}`);
        });
    },
  },
  chart: {
    renderVLine: function (chart, hz) {
      chart.g().select('g.chart-body')
        .selectAll('path.line').data(hz).enter()
        .append('path').attr('class', function (d) {
        return d.cls.concat(['line']).join(' ');
      })
        .attr('d', function (d) {
          let x = chart.x()(d.x);
          return mm.line([[x, chart.y().range()[0]], [x, chart.y().range()[1]]]);
        });
    },
    barChartRedrawGroup: function (chart) {

      let b = chart.selectAll("rect.bar");
      if (b.size() === 0) return;
      let filters = chart.filters();
      if (filters.length === 0) {
        b.classed('deselected', false).classed('selected', true);
      } else {
        b.classed('deselected', true).classed('selected', false);
        b.each(function (val) {
          for (var j = 0; j < filters.length; j++) {
            if (moment(val.x).isSame(filters[j])) {
              $(this).removeClass('deselected').addClass('selected');
            }
          }
        });
      }
    },
    // xAxisのラベルが長い場合見えるように斜め表示にする
    adjustXAxisLabel: (chart, maxLabelLen) => {
      switch (1) {
        default:
          if (maxLabelLen > 10) {
            $(chart._anchor).addClass('label-x-rot');
            chart.margins({top: 0, right: 0, bottom: 100, left: 40})
            break;
          }
          if (maxLabelLen > 6) {
            $(chart._anchor).addClass('label-x-rot');
            chart.margins({top: 0, right: 0, bottom: 70, left: 40})
            break;
          }

          chart.margins({top: 0, right: 0, bottom: 20, left: 40})
          break;
      }
    },
    getImagePath: function (chart) {
      let ret;

      if (chart.chartID() === mm.chartName.chartID()) {
        ret = mm.opt?.chartName.imagePath ?? '/img/japan';
      }
      if (chart.chartID() === mm.chartCity.chartID()) {
        ret = mm.opt?.chartCity.imagePath ?? '/img/japan/city';
      }
      return ret;
    },
    setImageLink: function (chart, dataType, ttFmt, lazyLoadDomId = null) {
      const useLazy = !isSp;
      chart.selectAll("text.row").attr('x', IMG_THUMBNAIL_W + 4);
      chart.selectAll("rect").attr('x', IMG_THUMBNAIL_W);
      chart.selectAll("g.row")
        .append('svg:image')
        .attr('onerror', "this.onerror=null;this.setAttribute('href','" + IMG_NO + "')")
        .attr('width', IMG_THUMBNAIL_W)
        .attr('class', 'pl tt_image')
        .attr('type', dataType)
        .attr('tt-fmt', ttFmt)
        .attr('ci', chart.chartID())
        .attr('name', function (d) {
          return d.key;
        })
        .attr(useLazy ? 's' : 'href', function (d) {
          let ret = null;
          const imagePath = mm.chart.getImagePath(chart);
          if (imagePath) {
            // imagePathがpathと別カラムのデータ指定の場合
            if (imagePath.indexOf('@pathColExt') === 0) {
              const dataType = parseInt(this.getAttribute('type'))
              const d2 = mm.data.find(d2 => d2[dataType] === d.key)
              ret = mm.util.parseOptionImagePath(imagePath, d2);
            }
            if (ret === null) {
              const name = mm.util.removeLabelSuffix(d.key);
              ret = imagePath + '/' + name + '.jpg';
            }
          } else {
            if (chart.chartID() === mm.chartName.chartID()) {
              ret = PREFECTURES_EN[d.key] ? '/img/japan/' + PREFECTURES_EN[d.key] + '.gif' : IMG_NO;
            } else {
              ret = '/img/japan/city/' + d.key + '.png';
            }
          }
          return ret;
        })
        .on('touchstart', function (e, d) {
          d.t = e.timeStamp;
        })
        .on(isSp ? 'touchend' : 'click', function (e, d) {
          // sp:長押しopen pc:clickでopen
          const SP_PRESS_MS = 300;
          let isOpen = true;
          if (isSp) {
            isOpen = e.timeStamp - d.t > SP_PRESS_MS;
          }
          if (isOpen) {
            const chartId = parseInt(this.getAttribute('ci'));
            const openUrl = mm.chart.getItemLink(chartId, d);
            window.open(openUrl);
          }
        });

      // 遅延Imageロード
      if (useLazy && lazyLoadDomId !== null) {
        const rootDiv = document.getElementById(lazyLoadDomId);
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const image = entry.target;
              image.setAttribute('href', image.getAttribute('s'));
              observer.unobserve(image); // 監視を解除
            }
          });
        }, {
          root: rootDiv,
          rootMargin: '100px', // 監視領域を 100px 上下に拡張
          threshold: 0.5 // 要素の50%がビューポートに入ったらトリガー
        });

        // 監視対象の要素を指定
        const lazyImages = rootDiv.querySelectorAll('.pl');
        lazyImages.forEach(image => {
          observer.observe(image);
        });
      }
    },
    // フィルタに選択した項目を選択状態のクラスにする
    setFilterTextSel: function (chart) {
      let filters = chart.filters()
      const id = chart.chartID();
      switch (true) {
        case id === mm.chartWeek.chartID():
          filters = filters.map(v => WEEK_LABEL[parseInt(v)]);
          break;
        case id === mm.chartSex.chartID() && mm.opt.chartSex.unit !== null:
          filters = filters.map(v => mm.opt.chartSex.unit[parseInt(v)]);
          break;
        case id === mm.chartAge.chartID() && mm.opt.chartAge.unit !== null:
          filters = filters.map(v => mm.getLabelAge(v));
          break;
      }
      filters = filters.map(v => String(v));
      chart.selectAll('g.tick text').each(function () {
        filters.includes(this.textContent) ?
          this.classList.add('sel') : this.classList.remove('sel')
      });
    },
    updateLegend: function (chart) {
      let item = chart.legendables();
      const _legend = chart.legend();
      let o2 = $(chart.anchor()).find('g.dc-legend-item');
      //o2=o2.filter(':not(:contains("週間"))')

      //@see src/charts/legend.js:333
      let cumulativeLegendTextWidth = 0;
      let row = 0;
      item.forEach((d, i) => {
        if (d.name === '0') return; // 0件のデータのLegendは表示しない

        o2.eq(i)
          .attr('transform', function () {
            // 非表示のlegendは表示しないレイアウトに調整
            if (_legend._horizontal) {
              const itemWidth = _legend._autoItemWidth === true ? this.getBBox().width + _legend._gap : _legend._itemWidth;
              if (!d.hidden) {
                if ((cumulativeLegendTextWidth + itemWidth) > _legend._legendWidth && cumulativeLegendTextWidth > 0) {
                  ++row;
                  cumulativeLegendTextWidth = 0;
                }
              }
              const height = row * _legend._legendItemHeight()
              const translateBy = `translate(${cumulativeLegendTextWidth},${height})`;
              if (!d.hidden) cumulativeLegendTextWidth += itemWidth;
              return translateBy;
            } else {
              return `translate(0,${i * _legend._legendItemHeight()})`;
            }
          })
          .addClass(function () {
            // フィルタされているlegendは選択状態にする
            let ret = '';
            const name = mm.util.getStackName(d.name);
            switch (pnl.date.stack_type) {
              case STACK_CND:
                ret = name && mm.chartCond.filters().includes(name) ? 'sel' : '';
                break;
              case STACK_PL1:
                ret = name && mm.chartName.filters().includes(name) ? 'sel' : '';
                break;
              case STACK_AGE:
                ret = name && mm.chartAge.filters().includes(name) ? 'sel' : '';
                break;
            }
            return ret;
          });
      });
    },
    setDetails: async function (chart, filters, dataIndex, detailType = false) {
      const imagePath = mm.chart.getImagePath(chart) ?? '';
      // 検索API用KeywordPrefix取得
      const searchPrefix = mm.opt.searchPrefix ?? '';
      const searchPrefixP = searchPrefix ? searchPrefix + '+' : '';
      let searchPrefix2 = mm.util.replaceSearchWordE2J(imagePath);
      let searchPrefix2P = searchPrefix2 ? searchPrefix2 + '+' : '';

      for (let i = 0; i < filters.length; i++) {
        if (pnl.detail.details.length >= pnl.detail.maxDetails) break;

        const TUBE_THUMBNAIL_MAX = 2; // YouTubeのサムネイル画像を表示するDetail数
        const isTube = i < TUBE_THUMBNAIL_MAX;
        let youtubePlayHtml = '', imgSrc;
        const name = filters[i];
        // すで詳細リストに同じ物があったら表示しない
        if (mm.detals.includes(name)) continue;
        mm.detals.push(name);

        // 1件目のデータを取得。制約:dimensionのgroupデータが1件のデータである事)
        const d = mm.data.find(d2 => d2[dataIndex] === name);
        if (d === undefined) continue;
        const name2 = mm.util.removeLabelSuffix(name);
        const n = chart.group().all().find(d => d.key === name)?.value ?? 0;
        const dt = await mm.getDetailInfo(`${name2}`);

        // 検索API用KeywordPrefix取得 (dataより取得)
        if (mm.opt.searchPrefixDataIndex) {
          const s = d[mm.opt.searchPrefixDataIndex];
          searchPrefix2 = mm.util.replaceSearchWordE2J(s);
          if (searchPrefix2 === '') searchPrefix2 = s;
          searchPrefix2P = searchPrefix2 ? searchPrefix2 + '+' : '';
        }


        if (isTube) {
          pnl.tube.searchQuery = `${searchPrefixP}${searchPrefix2P}${name2}`;
          pnl.tube.vids = await mm.tube.search(pnl.tube.searchQuery);
          youtubePlayHtml = '';
          for (let j = 1; j <= pnl.tube.vids.length; j++) {
            const id = pnl.tube.vids[j - 1];
            // YouTube link
            youtubePlayHtml +=
              `&nbsp;<a class="detail-tube-wopen tt_img" src="https://img.youtube.com/vi/${id}/hqdefault.jpg" ` +
              `target="_blank" href="https://www.youtube.com/watch?v=${id}" ` +
              `title="YouTubeで「${searchPrefix} ${searchPrefix2} ${name2} 」の動画${j}を開く">` +
              `<i class="fa fa-video"></i>${j}</a>`;
          }
          youtubePlayHtml += pnl.tube.vids.length ? '&nbsp;' : '';
        }

        switch (true) {
          // Youtubeのthumbnailを使用の時
          case isTube && imagePath === '@tube':
            imgSrc = `https://img.youtube.com/vi/${pnl.tube.vids[0]}/hqdefault.jpg`;
            break;
          default:
            // imagePathがpathと別カラムのデータ指定の場合
            if (imagePath.indexOf('@pathColExt') === 0) {
              imgSrc = mm.util.parseOptionImagePath(imagePath, d);
            }
            if (imgSrc === null) {
              imgSrc = imagePath + '/' + name2 + '.jpg';
            }
            break;
        }

        const titleHref = mm.chart.getItemLink(chart.chartID(), {key: name2});

        // 詳細表示(left)
        let ret = `<div>\
							<a target="_blank" title="「${name}」の詳細情報を開く" href="${titleHref}">\
								<div>${name}</div>\
								<div class="detail-img"><img src="${imgSrc}" onerror="this.src='${IMG_NO}'"></div>\
							</a>\
							<img src="/img/yutube.gif">${youtubePlayHtml}\
							<a target="_blank" class="detail-tube-wopen" \
								href="https://www.youtube.com/results?search_query=${searchPrefixP}${searchPrefix2P}${name2}" \
								title="YouTubeで「${pnl.tube.searchQuery.replaceAll('+', ' ')}」の動画一覧を開く">\
								一覧<span class="ui-icon ui-icon-extlink" style="font-size: 0.9em"></span>\
							</a>\
							<table><tbody>` +
          (detailType ? mm.util.getChartDetailsHtml(d, detailType, titleHref) + mm.util.getExChartDetailsHtml(d) : '') +
          (n === 1
              ? '<tr><td colspan="2">　</td></tr>'
              : '<tr class="text-theme-col"><td>合計</td><td>: ' + php_number_format(n) + '</td></tr>'
          ) +
          `<tr><td colspan="2"><div class="detail-info text-theme-col2 tt_text scrollbar-thin">${dt}</div></td></tr>` +
          '</tbody></table></div>';

        // 詳細表示(right) サムネイル画像
        if ((isSp ? pnl.detail.details.length < TUBE_THUMBNAIL_MAX : pnl.detail.details.length === 0) && pnl.tube.vids.length > 1) {
          ret = `<div style="display: flex">\
								<div class="detail-left">${ret}</div>\
								<div class="detail-right"><br/>`;
          for (let j = 0; j < pnl.tube.vids.length; j++) {
            const vid = pnl.tube.vids[j];
            ret +=
              `<div class="detail-img">\
										<a class="detail-tube-wopen" target="_blank" \
											href="https://www.youtube.com/watch?v=${vid}"\
											title="YouTubeで「${searchPrefix} ${searchPrefix2} ${name2} 」の動画${j + 1}を開く">\
											<img src="https://img.youtube.com/vi/${vid}/hqdefault.jpg" onerror="this.src='${IMG_NO}'">\
										</a>\
									</div>`;
          }
          ret += '</div></div>';
        }

        pnl.detail.details.push(ret);
      }
      if (gg.dt !== DT_COVID && pnl.tube.is_show) {
        if (pnl.tube.vidAutoChange) {
          // 1番目の再生ボタンを押す。btn_searchのdetail取得はリクエストがあるので遅延実行
          _.delay(() => $('#chart_tube .detail-tube-play:eq(0)').trigger('click'), 600);
        }
      }
    },
    showDetailPanel: async function (chart) {
      if (!(pnl.detail.is_show || pnl.tube.is_show)) return;

      const chartID = chart.chartID();
      const chartNameID = mm.chartName.chartID();
      const chartCityID = mm.chartCity.chartID();
      const chartJobID = mm.chartJob.chartID();
      const filters = chart.filters();
      //詳細パネル
      if (gg.dt === DT_COVID) {
        if (chartID === chartNameID) {
          mm.detals = [];
          pnl.detail.details = [];

          const p_max = mm.namesCount['東京都']; //== _.max(_.values(mm.names));
          for (var i = 0; i < filters.length; i++) {
            let name = filters[i];
            let p = mm.opt.assets.pref_tbl_last_m1[name];
            if (p === undefined) continue;

            let n = mm.namesCount[name] ?? 0;
            // let patient=n-p.discharged-p.deaths;//患者数=感染者数-退院者数-死亡者数
            let patient = p.carriers - p.discharged - p.deaths;//現患者数=感染者数-退院者数-死亡者数
            let icon = '<img src="/img/japan/' + PREFECTURES_EN[name] + '.gif">';
            let per = parseInt(100 * n / p_max);
            let bar_style = "background: linear-gradient(to right, rgb(31, 119, 180, 0.3) " + per + "%, #fffacd " + per + "%, #fffacd " + (100 - per) + "%) center center / 100% 100% no-repeat;";
            let ret = '<b>' + icon + '<a target="_blank" title="' + name + 'の wikipediaへ" href="' + mm.url_name + '/' + name + '">' + name + '</a></b><br />' +
              '<img style="width:180px;height:120px;object-fit: cover;object-position:0% 0%;" src="/img/japan/pref/' + name + '.jpg"><br />' +
              (p === undefined ? 'なし<br />' : (
                '<table><tbody>' +
                '<tr><td>総人口　:</td><td>' + php_number_format(p.n) + '名</tr>' +
                '<tr><td>感染者数:</td><td style="' + bar_style + '"> ' + php_number_format(n) + '名 <a title="人口に対する感染者率。感染者数 ÷ 総人口。">(' + (_.round(100 * n / p.n, 3)) + '%)</a></td></tr>' +
                '<tr><td>患者数　:</td><td> ' + php_number_format(patient) + '名</td></tr>' +
                '<tr><td>PCR検査:</td><td> ' + php_number_format(p.pcrtested) + '名 <a title="人口に対するPCR検査率。PCR検査数 ÷ 総人口。">(' + p.pcrtested_p + '%)</a></td></tr>' +
                '<tr><td>死亡者数:</td><td> ' + p.deaths + '名</td></tr>' +
                '<tr><td>退院者数:</td><td> ' + php_number_format(p.discharged) + '名<br />' +
                '<tr><td>対策病床数:</td><td> ' + php_number_format(p.bed) + '床 <a title="対策病床使用率。患者数/対策病床数。">(' + (_.round(100 * patient / p.bed, 2)) + '%)</a></td></tr>' +
                '</tbody></table>'
              )) +
              '<a target="_blank" href="https://hazard.yahoo.co.jp/article/covid19' + PREFECTURES_EN[name] + '">' + name + 'コロナまとめサイト</a>'
            ;
            if (pnl.detail.details.length < pnl.detail.maxDetails) pnl.detail.details.push(ret);
          }
        }
      } else {
        // chartName
        if (chartID === chartNameID) {
          pnl.gmap.chartGMap.panToMarkerType = 0;
          mm.detals = [];
          pnl.detail.details = [];
          await mm.chart.setDetails(chart, filters, D_PL1, mm.opt.detailType);
          pnl.gmap.chartGMap.panToMarkerType = mm.opt.chartName.isPanGmapMarker ? 1 : 0;
          return;
        }
        // chartCity
        if (chartID === chartCityID) {
          mm.detals = [];
          pnl.detail.details = [];
          await mm.chart.setDetails(chart, filters, D_PL2, mm.opt.detailType === 'city');
          pnl.gmap.chartGMap.panToMarkerType = mm.opt.chartCity.isPanGmapMarker ? 1 : 0;
          return;
        }
        // chartJob
        if (chartID === chartJobID) {
          if (mm.opt.chartJob.isDetail) {
            mm.detals = [];
            pnl.detail.details = [];
            await mm.chart.setDetails(chart, filters, D_JOB, false);
          }
        }
      }
    },
    getItemLink: function (chartId, d) {
      let ret;
      const link = chartId === mm.chartName.chartID() ? mm.opt?.chartName.link : mm.opt?.chartCity.link;
      if (link) {
        // テンプレートリテラル内の変数を展開。例:`/player.php?&id=${d.key}`で変数d.keyを展開
        ret = new Function('d', `return \`${link}\`;`)(d);
      } else {
        ret = mm.url_name + '/' + mm.util.removeLabelSuffix(d.key);
      }
      return ret;
    },
    createGridLegend: (chartW) => {
      const legend = dc.legend()
        .x(45).y(10)
        .legendText((d) => {
          let sel_no = d.name.split(':');
          return sel_no.length === 2 ? mm.dateStackPl1Names[sel_no[1]] : d.name;
        });

      // legendの数が多いのをgrid配置で対応
      const {legendItemMaxN, legendItemMaxW} = mm.getLegendItemMaxInfo();
      const legendItemNW = legendItemMaxN < 9 ? 1 : 3;
      legend.itemHeight(13).gap(5).horizontal(1).legendWidth(legendItemMaxW * legendItemNW).itemWidth(legendItemMaxW)

      return legend;
    },
    setStacks: (chart, group) => {
      let i;
      // スタック登録 - CHART_DATE_STACK_GRP[STACK_CND]
      if (gg.dt === DT_COVID) {
        chart
          .group(group, CND_LV_A, d => d.value.lv_a)
          .stack(group, CND_LV_B, d => d.value.lv_b)
          .stack(group, CND_LV_C, d => d.value.lv_c)
          .stack(group, CND_LV_D, d => d.value.lv_d)
          .stack(group, CND_LV_E, d => d.value.lv_e);
      } else {
        for (i = 0; i < mm.chartStack[STACK_CND].length; i++) {
          if (i === 0) {
            chart.group(group, mm.chartStack[STACK_CND][i], mm.dateStackCndAccessor(i));
          } else {
            chart.stack(group, mm.chartStack[STACK_CND][i], mm.dateStackCndAccessor(i));
          }
        }
      }
      // スタック登録 - CHART_DATE_STACK_GRP[STACK_PL1]
      for (i = 0; i < mm.chartStack[STACK_PL1].length; i++) {
        chart.stack(group, mm.chartStack[STACK_PL1][i], mm.dateStackPl1Accessor(chart, i));
      }
      // スタック登録 - CHART_DATE_STACK_GRP[STACK_AGE]
      for (i = 0; i < mm.chartStack[STACK_AGE].length; i++) {
        chart.stack(group, mm.chartStack[STACK_AGE][i], mm.dateStackAgeAccessor(i));
      }
      return chart;
    },
    stackOn: (chart, stackOn) => {
      // StackMixin の data メソッドのをオーバーバード
      // @see src/base/stack-mixin.js:24
      chart.data(function () {
        const layers = this._stack.filter(this._visibility);
        if (!layers.length) {
          return [];
        }
        layers.forEach((l, i) => this._prepareValues(l, i));
        const v4data = layers[0].values.map((v, i) => {
          const col = {x: v.x};
          layers.forEach(layer => {
            col[layer.name] = layer.values[i].y;
          });
          return col;
        });
        const keys = layers.map(layer => layer.name);
        const v4result = this.stackLayout().keys(keys)(v4data);
        v4result.forEach((series, i) => {
          series.forEach((ys, j) => {
            // 0の場合やスタックをつまない
            layers[i].values[j].y0 = stackOn ? ys[0] : 0;
            layers[i].values[j].y1 = stackOn ? ys[1] : 0;
          });
        });
        return layers;
      }.bind(chart));

      return chart;
    },
    filterByStackName: (d) => {
      const name = mm.util.getStackName(d.name);
      switch (pnl.date.stack_type) {
        case STACK_CND:
          mm.chartCond.filter(name);
          dc.redrawAll('chartGroup');
          break;
        case STACK_PL1:
          if (name !== undefined) {
            mm.chartName.filter(name);
            dc.redrawAll('chartGroup');
          }
          break;
        case STACK_AGE:
          mm.chartAge.filter(name);
          dc.redrawAll('chartGroup');
          break;
      }
    },
    filterFromGetParam: (chart, filterKey, isRedraw) => {
      if (mm.get[filterKey]) {
        const filters = mm.get[filterKey].split(' ');
        if (filters.length > 0) {
          const flt = filters.length === 1 ? filters[0] : [filters];
          chart.filterAll().filter(flt);
          return true;
        }
      }
      return isRedraw;
    },
  },
  //MAPの選択Nameのエリア枠を描画
  mapSetSelectedRegions: function () {
    const f = mm.opt.chartMap.refData === 'city'
      ? mm.chartCity.filters()
      : mm.chartName.filters();
    if (f.length && map) {
      mm.map.isSelectedRegions = 1;
      map.clearSelectedRegions();
      let sels = [];
      if (mm.map.isMapJapan) {
        for (let i = 0; i < f.length; i++) {
          const s = PREFECTURES_EN[f[i]] ?? PREFECTURES_EN[mm.util.getPref(f[i])];
          if (s) {
            sels.push(_.capitalize(s));
          }
        }
      } else {
        for (let i = 0; i < f.length; i++) {
          const s = WORLD_CODE[f[i]] ?? '';
          if (s !== '') {
            sels.push(s);
          }
        }
      }
      if (sels.length) {
        map.setSelectedRegions(sels)
        map.setFocus({regions: sels, animate: 1});
        mm.map.isSelectedRegions = 0;
        mm.map.doDraw = 0;
      }
    }
  },
  isMouseLongClick: false,
  watchMouseEvent: function () {
    let pressTimer;

    function handleMouseDown(event) {
      pressTimer = setTimeout(() => {
        mm.isMouseLongClick = true;
      }, mm.config.mouseLongClickDuration);
    }

    function handleMouseUp(event) {
      //mm.isLongPress = false;
      clearTimeout(pressTimer);
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchstart', handleMouseDown);
    document.addEventListener('touchend', handleMouseUp);
  },
  addFilterHandler: function (filters, filter) {
    let ret;
    if (mm.isMouseLongClick || (window.event && (window.event.ctrlKey || window.event.shiftKey))) {
      ret = [filter]; //single select
    } else {
      filters.push(filter);
      ret = filters; //add select
    }
    mm.isMouseLongClick = false;
    return ret;
  },
  onChartDatePretransition: function (chart) {
    let ci = chart.chartID();
//console.log('on_chartDate_pretransition() id:'+ci);

    let is_comp = mm.composite.chartID() === ci;
    let flt = mm.chartName.filters();
    let pref_mode = flt.length > 1;
    if (is_comp) {
      mm.chart.updateLegend(chart);
      let o = $('#chart_date g.dc-legend-item');
      o.filter(':contains("週間")').show().attr('transform', 'translate(300,0)');
    } else {
      let o2 = $('#chart_date2 g.dc-legend-item');
      if (pref_mode) {
        for (var i = 0; i < flt.length; i++) {
          o2.filter(':contains("' + flt[i] + '")').show();
        }
      } else {
        //chart_date2 の県名表示
        for (var i = 0; i < flt.length; i++) {
          o2.filter(':contains("' + flt[i] + '")').show();
        }
      }
    }

    if (gg.dt === DT_COVID) {
      //緊急事態宣言 縦ライン表示
      mm.chart.renderVLine(chart, [
        {cls: ['s1'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[0][0])},
        {cls: ['s2'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[1][0])},
        {cls: ['s4'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[2][0])},
        {cls: ['s4'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[3][0])},
        {cls: ['s3'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[4][0])},

        {cls: ['campaign'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[5][0])},
        {cls: ['campaign'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[6][0])},

        {cls: ['s1'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[7][0])},
        {cls: ['s2'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[8][0])},
        {cls: ['s4'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[9][0])},
        {cls: ['s3'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[10][0])},

        {cls: ['s1'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[11][0])},
        {cls: ['s2'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[12][0])},
        {cls: ['s2'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[13][0])},
        {cls: ['s4'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[14][0])},

        {cls: ['s1'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[15][0])},
        {cls: ['s2'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[16][0])},
        {cls: ['s2'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[17][0])},
        {cls: ['s2'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[18][0])},
        {cls: ['s2'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[19][0])},
        {cls: ['s3'], x: new Date(mm.opt.assets.chartDateLineYmdMsg[20][0])},
      ]);
    }

    if (!is_comp) return;

    //StackBarチャートを選択したらフィルタがかかるようにする
    chart.selectAll("rect.bar").on("click", dc.d3compat.eventHandler(function (d) {
      //chart.filter(null).filter(d.data.key).redrawGroup();//単一選択
      chart.filter(d.data.key).redrawGroup();//追加選択
      //chart.filter(multikey(d.x, d.layer));//子供項目選択
      mm.chart.barChartRedrawGroup(chart);
    }));

    if (mm.map.doDraw) drawJapanMap();
    mm.map.doDraw = 1;

    let ft = mm.getFilterTxt();

    let fth = ft.join(' ').trim();
    if (gg.dt === DT_COVID) {
      $('.hdr_flt').show().text((fth === '' ? '全国' : fth) + ' の状況');
    } else {
      $('.hdr_flt').show().text(fth === '' ? '　' : fth + ' の場合'); // ※レイアウトがずれないように空でも空文字を入れる
    }
    if (mm.sel_tab === 'tabs_c') {
      ft[1] = '';
    }

    ft[2] = '';
    ft[0] = '';
    fth = ft.join(' ').trim();
    if (fth !== '') {
      if (mm.last_fth !== fth) {
        $('#chk_tbl_spkflt')
          .checkboxradio({label: '<i class="fa fa-filter"></i>[' + fth + ' ]' + (isSp ? '<br />' : '') + 'でフィルタ'})
          //.checkboxradio('refresh')
          .prop('checked', true).trigger('click') //off
        ;
      }
      $('#chk_tbl_spkflt_l').show();
    } else {
      $('#chk_tbl_spkflt_l').hide();
    }
    mm.last_fth = fth;

    pnl.date.cnt = php_number_format(mm.ndx.groupAll().reduceSum(d => {
      return mm.group_reduce.base(d);
    }).value());

    let all = mm.gpDate.all();
    if (all.length >= 1) {
      let d, d1;
      if (1) {
        for (i = all.length - 1; i >= 0; i--) if (all[i].value !== 0) break; //最終更新日付の場合
        d = all[i];
        d1 = all[i - 1];
      } else {
        d = all[all.length - 1];//最終日
        d1 = all[all.length - 2];//最終日-1
      }
      if (d) {
        pnl.date.cnt_day = moment(d.key).format('YYYY/M/D(ddd)') + '時点';
        if (d1) {
          const h = d.value - d1.value;
          pnl.date.cnt_one = (h >= 0 ? '+' : '') + php_number_format(h);//前日比：日別
        }
      }
    } else {
      pnl.date.cnt_one = '';
      pnl.date.cnt_day = '';
    }
    //mm.gpDateYMMax=_.maxBy(all, function(o) { return o.value; });
  },
  onChartFiltered: function (chart) {
    const ci = chart.chartID();
    // mm.local.logChart(chart);

    $('.usage').hide();

    // カレンダー表示中もフィルタ可能にする
    if (chart.filters().length && $('#ui-datepicker-div').is(':visible')) {
      mm.datePick?.datepicker('show');
    }

    //職業チャートの(カテゴリ表示|詳細表示)の切り替え
    if (gg.dt === DT_COVID) {
      if (ci === mm.chartName.chartID() || ci === mm.chartCity.chartID() || ci === mm.chartDate.chartID()) {
        if (mm.is_job_cate) {
          let fn = mm.chartName.filters();
          let fc = mm.chartCity.filters();
          let fd = mm.chartDate.filters();
          if (fn.length || fc.length || fd.length) {
            let o = $('#chart_job_title_sub');
            if (o.text() === '') {
              $('#chart_job_title_sub').text('(詳細)');
              mm.chartJob.dimension(mm.dimJob).group(mm.gpJob).render();
            }
          } else {
            let o = $('#chart_job_title_sub');
            if (o.text() === '(詳細)') {
              $('#chart_job_title_sub').text('');
              mm.chartJob.dimension(mm.dimJobCat).group(mm.gpJobCat).render();
            }
          }
        }
      }
    }

    if (ci === mm.chartName.chartID()) {
      mm.chartCity.filterAll();
      mm.mapSetSelectedRegions();
    }
    $('.jvectormap-tip').hide();

    if (pnl.gmap.is_show || pnl.sview.is_show) {
      if (ci === mm.chartName.chartID()
        || ci === mm.chartCity.chartID()
        || (ci === mm.chartJob.chartID() && mm.opt.chartJob.isPanGmap)
      ) {
        const f = chart.filters();
        if (f.length) {
          pnl.gmap.chartGMap.center = pnl.gmap.chartGMap.center ? _.last(f) : _.first(f); // 初回のみfirst
        }
      }
    }

  },
  chartDateLegendUpdate2: function () {
    let flt_len = mm.chartName.filters().length;
    let pref_mode = flt_len !== 0;
    mm.composite2.legend().y(pref_mode ? -30 : 0);
  },
  renderAllChart: function () {
    if (!mm.config.cDate.is_elasticY) {
      mm.chartDate.y(d3.scaleLinear().domain([0, _.max(_.map(mm.gpDate.all(), 'value')) + 10])); //高さ範囲再計算
    }

    dc.renderAll("chartGroup");
  },
  updateGMap: function () {
    // Focus
    // filters:['xxx','yyy'] => {'xxx':1,'yyy':1}
    const cityFilters = mm.chartCity.filters();
    pnl.gmap.chartGMap.focus = {};
    pnl.gmap.chartGMap.focus[pnl.gmap.chartGMap.prefecture] = Object.fromEntries(cityFilters.map(item => [item, 1]));

    //Layer
    pnl.gmap.chartGMap.layer = mm.getCityCntTbl();
  },
  // groupのallメソッドを0件や空キーは表示しないようにオーバーライド
  groupRemoveEmpty: function (group) {
    return {
      all: function () {
        return group.all().filter(function (d) {
          return d.key !== DN_KEY1 && d.key !== DN_KEY2 && d.value !== 0;
        });
      }
    };
  },
  // groupのallメソッドを空キーは表示しないようにオーバーライド
  groupRemoveKey: function (group, emptyKey) {
    return {
      all: function () {
        return group.all().filter(function (d) {
          return d.key !== emptyKey && d.key !== DN_KEY1;
        });
      }
    };
  },
  group_reduce_age_set(p, age, c) {
    switch (age) {
      case DN_AGE:
        p.agcnt[DI_AGE_NONE] += c;
        break;
      case 1:
        p.agcnt[DI_AGE_INFA] += c;
        break;
      case 0:
        p.agcnt[DI_AGE_LT10] += c;
        break;
      default:
        p.agcnt[(age / 10) + 1] += c;
        break;
    }
    return p;
  },
  group_reduce_age_set_custom(p, age, c) {
    p.agcnt[age] += c;
    return p;
  },
  group_reduce_cnd_set(p, cnd, c) {
    switch (1) {
      default:
        if (cnd.indexOf('死亡') !== -1) {
          p.lv_e += c;
          break;
        }
        if (cnd.indexOf('酸投') !== -1 || cnd.indexOf('重症') !== -1) {
          p.lv_d += c;
          break;
        }
        if (cnd.indexOf('入院') !== -1 || cnd.indexOf('肺炎') !== -1 || cnd.indexOf('中等') !== -1) {
          p.lv_c += c;
          break;
        }
        if (cnd.indexOf('無症状') !== -1 || cnd.indexOf('退院') !== -1) {
          p.lv_a += c;
          break;
        }
        p.lv_b += c;
        break;
    }
    return p;
  },
  group_reduce_cnd_set_custom(p, cnd, c) {
    p.cdcnt[cnd] += c;
    return p;
  },
  // hideStack()したlegendは表示しない(translate()で配置対象としない)
  dateStackShow: function (no) {
    const isChart2Stack = pnl.date.chart2.type === CHART_DATE2_TYPE_LINES || pnl.date.chart2.type === CHART_DATE2_TYPE_STACKS;
    for (var i = 0; i < mm.chartStack.length; i++) {
      for (var j = 0; j < mm.chartStack[i].length; j++) {
        const stackName = mm.chartStack[i][j] === '' ? '0' : mm.chartStack[i][j];
        if (i === no) {
          mm.chartDate.showStack(stackName);
          mm.chartYear.showStack(stackName);
          if (pnl.sex.chartType === 'bar') {
            mm.chartSex.showStack(stackName);
          }
          if (isChart2Stack) {
            mm.chartDate2?.showStack(stackName);
          }
          for (let k = 0; k < pnl.ex.length; k++) {
            if (pnl.ex[k].isHidden) continue
            mm.chartEx[k].showStack(stackName);
          }
        } else {
          mm.chartDate.hideStack(stackName);
          mm.chartYear.hideStack(stackName);
          if (pnl.sex.chartType === 'bar') {
            mm.chartSex.hideStack(stackName);
          }
          if (isChart2Stack) {
            mm.chartDate2?.hideStack(stackName);
          }
          for (let k = 0; k < pnl.ex.length; k++) {
            if (pnl.ex[k].isHidden) continue
            mm.chartEx[k].hideStack(stackName);
          }
        }
      }
    }
  },
  dateStackCndAccessor: function (no) {
    return function (d) {
      return d.value.cdcnt[no];
    }
  },
  dateStackPl1Accessor: function (chart, no) {
    return function (d) {
      let flt = mm.chartName.filters();
      let pref_mode = flt.length > 1 && flt.length <= mm.chartStack[1].length
      if (pref_mode) {
        mm.dateStackPl1Names[no] = flt[no];
        return d.value.nmcnt[flt[no]] === undefined ? 0 : d.value.nmcnt[flt[no]];
      } else {
        mm.dateStackPl1Names[no] = '(選択' + (no + 1) + ')';
        return 0;
      }
    }
  },
  dateStackAgeAccessor: function (no) {
    return function (d, i) {
      return d.value.agcnt[no];
    }
  },
  chartScroll: function (sel, name = '', duration = 300) {
    name = name || '';
    let o = $(sel);
    if (name === '') {
      o.scrollTop(0);
      return;
    }
    let pl = o.find('g.row:contains("' + name + '")');
    if (pl.length) {
      let top;
      if (isSp) {
        top = pl.attr('transform').replace(')', '').split(',')[1] - 40;
      } else {
        //not work iOS Safari
        let p0 = o.find('g.row:eq(0)').position();
        let p1 = pl.position();
        top = p1.top - p0.top - 40;
      }
      if (duration === 0) o.scrollTop(top);
      else o.animate({scrollTop: top}, duration, 'swing');
    }
  },
  createFilteredBarStacksData: function () {
    let prefs = _.keys(PREFECTURES_EN);
    let dimName = mm.chartName.dimension()
    //stacks[]の日付ドメインを合わせる
    mm.chartDate.x(d3.scaleTime().domain([moment(mm.opt.assets.spk.min_ymd).toDate(), moment(mm.opt.assets.spk.max_ymd).toDate()]));


    let stacks = [];//stacks[pref][ymd]
    let grp = mm.chartDate.group();
    for (var i = 0; i < prefs.length; i++) {
      dimName.filter(prefs[i]);
      stacks[i] = [];
      _.forEach(grp.all(), (d) => {
        let ymd = moment(d.key).format('YYMD');
        stacks[i][ymd] = [d.value.lv_a, d.value.lv_b, d.value.lv_c, d.value.lv_d, d.value.lv_e];
      });
    }

    let stacks2 = [];
    let from = moment(mm.opt.assets.spk.min_ymd), to = moment(mm.opt.assets.spk.max_ymd);
    let nday = to.diff(from, 'days')
    for (var i = 0; i < prefs.length; i++) {
      stacks2[i] = [];
      from = moment(mm.opt.assets.spk.min_ymd);
      for (var j = 0; j <= nday; j++) {
        let ymd = j === 0 ? from.format('YYMD') : from.add(1, 'days').format('YYMD');
        if (stacks[i][ymd] !== undefined) {
          stacks2[i][j] = stacks[i][ymd];
        } else {
          stacks2[i][j] = [0, 0, 0, 0, 0];
        }
      }
      stacks2[i] = stacks2[i].slice(mm.SPARK_SX);
    }

    //rollback
    dimName.filterAll();
    if (mm.domainDate) mm.chartDate.x(d3.scaleTime().domain(mm.domainDate));

    return stacks2;
  },
  getPrefCntTbl: function () {
    let pref_cnt_tbl = {};
    switch (mm.sel_tab) {
      case 'tabs_c'://感染者数(crossfilterの影響受ける)
        const pref_cnt = mm.opt.chartMap.refData === 'city'
          ? mm.gpCity.all()
          : mm.gpName.all();

        for (var i = 0; i < pref_cnt.length; i++) {
          const pref = PREFECTURES_EN[pref_cnt[i].key] ? pref_cnt[i].key : mm.util.getPref(pref_cnt[i].key);
          if (pref_cnt_tbl[pref] === undefined) {
            pref_cnt_tbl[pref] = pref_cnt[i].value;
          } else {
            pref_cnt_tbl[pref] += pref_cnt[i].value;
          }
        }
        break;
      case 'tabs_p'://現患者数
        _.forEach(mm.opt.assets.pref_tbl_last_m1, (p, pre_name) => {
          let n = mm.namesCount ?? 0;//感染者数
          let patient = n - p.discharged - p.deaths;//患者数=感染者数-退院者数-死亡者数
          pref_cnt_tbl[pre_name] = patient;
        });
        break;
      case 'tabs_pc': //PCR検査
        _.forEach(mm.opt.assets.pref_tbl_last_m1, (p, pre_name) => {
          pref_cnt_tbl[pre_name] = p.pcrtested;
          //PCR検査% (PCR検査数/総人口)
          pref_cnt_tbl[pre_name] = 2500 * p.pcrtested_p;// ave:_.sum(_.map(mm.opt.assets.pref_tbl_last_m1,'pcrtested_p'))/47=0.2002127659574468% like 500 ;0.2*x=500
        });
        break;
      case 'tabs_d':
        _.forEach(mm.opt.assets.pref_tbl_last_m1, (p, pre_name) => {
          pref_cnt_tbl[pre_name] = p.deaths;
        });
        break;//死亡者数
      case 'tabs_b':
        _.forEach(mm.opt.assets.pref_tbl_last_m1, (p, pre_name) => {
          pref_cnt_tbl[pre_name] = p.bed;
        });
        break;//対策病床数
    }
    return pref_cnt_tbl;
  },
  getCityCntTbl: function () {
    const pref_cnt_tbl = {};
    const pref_cnt = mm.gpCity.all();
    for (var i = 0; i < pref_cnt.length; i++) {
      pref_cnt_tbl[pref_cnt[i].key] = pref_cnt[i].value;
    }
    const ret = {};
    ret[pnl.gmap.chartGMap.prefecture] = pref_cnt_tbl;
    return ret;
  },
  loadDcData: (name) => {
    let promise = Promise.resolve();

    mm.get.data = name
    // dataファイルのイメージ画像の設定
    mm.url_data.data = mm.get.data;
    let imgName = Object.keys(mm.url_data.filer_files).find(key => mm.url_data.filer_files[key].indexOf(mm.url_data.data) === 0);
    dataImgSrc.value = '<?=BURL?>upload/csv/' + (imgName ?? 'covid19-japan.png');
    $('#loading').css('background-image', 'url(' + dataImgSrc.value + ')').show();

    const initDcAfter = () => {
      if (mm.config.urlParamDataReplace) {
        mm.onChangeURL('data', mm.get.data);
      }
      $('#loading').fadeOut(500);
    }

    // URLのdataパラメタはすべて CSVとして処理する
    // 例:data=<name>.json or data=<name> => data=<name>.csv
    let path = mm.get.data;
    const ext = mm.util.getExt(mm.get.data).toLowerCase();
    switch (ext) {
      case '':
        path = mm.get.data + '.csv';
        break;
      case 'json':
        path = mm.get.data.replace('.json', '.csv');
        mm.get.data = mm.get.data.replace('.json', '');
        break;
      case 'csv':
        mm.get.data = mm.get.data.replace('.csv', '');
        break;
      default:
        mm.get.data = mm.get.data.replace(ext, '');
        break;
    }

    path = mm.url_data.path + path;

    const pathOptionsJson = path.replace('.csv', '.options.json');

    let doParseOptions = 1;
    // CSVファイルのオプションが外部JSONファイルである場合それを読み込む
    return mm.util.loadJSON(pathOptionsJson)
      .then((d) => {
        mm.opt = d;
        if (mm.opt.assets === undefined) {
          mm.opt.assets = {};
        }
        gg.dt = parseInt(mm.opt.dataType);
        gg.isPrefTable = gg.dt === DT_COVID;
        doParseOptions = 0;
        if (G_IS_LOCAL) {
          console.info(`INFO:オプションデータは${location.origin + pathOptionsJson}を使用`);
        }
        return mm.util.parseOptionsCSV(path, doParseOptions);
      })
      .catch((error) => {
        // const msg = `'fetching JSON エラー\n: ${error}。\nURL: ${pathOptionsJson}`;
        // console.log(msg);
        // CSVファイルのオプションがCSVファイル内にある場合それを読み込む
        doParseOptions = 1;
        return mm.util.parseOptionsCSV(path, doParseOptions);
      })
      .then((result) => {
        gg.isPrefTable = gg.dt === DT_COVID;
        mm.data_hdr = result.header;
        result.data.unshift(result.header);
        mm.setPanelFromDataOptions();
        return initDc(result.data);
      })
      .then(initDcAfter);

  },
  loadAllData: () => {
    mm.get = php_location_get_query();
    const name = mm.get.data || mm.url_data.data;
    return mm.loadDcData(name)
      .then(() => {
        mm.init();
      });
  },
  init: function () {
    const option = mm.opt.chartName.imagePath ? {imagePath: mm.opt.chartName.imagePath} : {};
    initAutoComplete(option);


    $('#input-search').autocomplete_ex({
      user_opt: {
        data: mm.opt.assets.ac_data,
        multiple: 1,
        select: function (event, ui) {
          const cond = mm.opt.isMakeAutocompleteData
            ? ui.item[0] === 'ジャンル'
            : ui.item[0] === '職業' || ui.item[0] === '状態'
          if (cond) {
            $('#input-search').val(ui.item[1]).trigger('input-search-update');
          } else {
            let o = $('#input-search');
            const AC_SPLIT_WD = /\s+/;
            const wd = o.val().trim().split(AC_SPLIT_WD);
            if (wd.length === 1) {
              const is_pref = ui.item[0] === ui.item[1];
              const val = is_pref
                ? ui.item[0]
                : (mm.opt.isMakeAutocompleteData ? '' : ui.item[0]) + ui.item[1];
              o.val(val + ' ');
            }
            o.trigger('input-search-update');
          }
        }
      }
    });
  }
};
if (G_IS_LOCAL) {
  mm.local = {
    onLoadAllDataAfter: function () {
      // DEBUG_OUTJSON
      // <データ名>.json を出力 例: /data/game-fc.json
      // mm.local.apiOutJson();

      $('#btn_edit_csv').attr('disabled', false).on('click', function () {
        // const url = mm.opt.editUrl || mm.local.urlSpreadsheet[mm.url_data.data]; //editUrlは、URLに '='があるのでNG
        const url = mm.local.urlSpreadsheet[mm.url_data.data];
        window.open(url, '_blank');
      });
    },
    apiOutJson: function () {
      const file = mm.url_data.data + '.options.json';
      const jsonString = JSON.stringify(mm.opt);
      $.post(`/api/outJson?file=${file}`, {jsonString}).then(res => {
        console.info('INFO:オプションのJSONファイルを出力しました', res);
      })
    },
    logChart: function (chart) {
      const ci = chart.chartID();
      const chartNames = {
        [mm.chartName.chartID()]: 'name',
        [mm.chartCity.chartID()]: 'city',
        [mm.chartDate.chartID()]: 'date',
        [mm.chartCity.chartID()]: 'city',
        [mm.composite.chartID()]: 'composite',
        [mm.chartDate.chartID()]: 'date',
        [mm.composite2.chartID()]: 'composite2',
        [mm.chartDate2.chartID()]: 'date2',
        [mm.chartAge.chartID()]: 'age',
        [mm.chartSex.chartID()]: 'sex',
        [mm.chartYear.chartID()]: 'year',
        [mm.chartWeek.chartID()]: 'week',
        [mm.chartSeason.chartID()]: 'season',
        [mm.chartCond.chartID()]: 'cond',
        [mm.chartJob.chartID()]: 'job'
      };
      console.log('onChartFiltered() id:' + ci + ':' + chartNames[ci]);
    },
    urlSpreadsheet: {
      "covid19-japan": "covid19-data?20221030-321001234567",
      "covid19-japan-data-2021-02-28": "covid19-data-2021-02-28?20221030-321001234567",
      "food-ramen": "https:\/\/docs.google.com\/spreadsheets\/d\/186UHvNBXlavGoJ19eBIPhbFRvqPnO6y9SWUAzMsvoL8\/edit?gid=1781238052#gid=1781238052",
      "ja-quake-noto-safety": "https:\/\/docs.google.com\/spreadsheets\/d\/1vzcw2b8F3wmdC-qaofFaCI-7F948Ke_-rBSvuNfV8ic\/edit?gid=366568963#gid=366568963",
      "ja-tokyo-gubernatorial-election.csv": "https:\/\/docs.google.com\/spreadsheets\/d\/1gqFfn4uaQJhA7X-uwSyous1O6nvZR5jriNg6JZwBTsM\/edit?gid=14801973#gid=14801973",
      "resas-agriculture": "resas-agriculture.csv?20221030-321001234567",
      "resas-product-sales": "resas-product-sales.csv?20221030-321001234567",
      "resas-tourism-foreigners": "https:\/\/docs.google.com\/spreadsheets\/d\/1aO1soXHdC58cX43DIwsN025MPhTsrKzbq51R1O2KLHw\/edit?gid=366568963#gid=366568963",
      "resas-municipality-company": "resas-municipality-company.csv?20221030-321001234567",
      "resas-municipality-taxes": "resas-municipality-taxes.csv?20221030-321001234567",
      "resas-municipality-manufacture.csv": "resas-municipality-manufacture.csv?20221030-321001234567",
      "game-msx": "https:\/\/docs.google.com\/spreadsheets\/d\/1bY57j7jjEaGNWkZMPd0jIN00-h2WCtrifVJVp82LQzM\/edit?gid=366568963#gid=366568963",
      "game-fc": "https:\/\/docs.google.com\/spreadsheets\/d\/1fO1UOe2w3LeIkx5PTV6EDk_Nnt9c7ouv\/r\/edit\/edit?gid=1233932795#gid=1233932795",
      "game-pce": "https:\/\/docs.google.com\/spreadsheets\/d\/1ArIXd3wp29bvmzHbJxomKAq5_haQDSYiquPpttZjA9s\/edit?gid=1831747219#gid=1831747219",
      "game-smd": "https:\/\/docs.google.com\/spreadsheets\/d\/19vonUZ1oQfIaY48K_nGzozskF-O7u6Wd10SfDsOSBZ0\/edit?gid=1252037126#gid=1252037126",
      "game-gb": "https:\/\/docs.google.com\/spreadsheets\/d\/1FimoIC_mOp46aICiz3XClFvZomNDjTAQhHzHdbLR3iE",
      "game-smc": "https:\/\/docs.google.com\/spreadsheets\/d\/1v7r5cQU_zPPv_tOJoPAEp9gsbYzjD7IduCogj51qBaM\/edit?gid=365793977#gid=365793977",
      "game-gen4": "https:\/\/docs.google.com\/spreadsheets\/d\/15HWefrVChKM9QuScO5X59qOT8Iv5vAt8sMMen3PizXY\/edit?gid=1347857449#gid=1347857449",
      "game-ps1": "https:\/\/docs.google.com\/spreadsheets\/d\/1-laGdi-zlVaPpyJm3EaVAWdtWX7KS2kGDtRX46-20eg\/edit?gid=35119188#gid=35119188",
      "game-ss": "https:\/\/docs.google.com\/spreadsheets\/d\/1kr79M3Ms3ZBhC94DifqvYd5RF078F8o8Y7DPEGbLq0g\/edit?gid=876331871#gid=876331871",
      "game-n64": "https:\/\/docs.google.com\/spreadsheets\/d\/17GLwimysInib7t18Bgj3OmpH9ApflEP9i_61m4IMVJI",
      "game-gba": "https:\/\/docs.google.com\/spreadsheets\/d\/1P3J3yVB_wKhT_bLwGjvdb11rXYmwapne5RZtqNKL-ws",
      "game-gen3": "https:\/\/docs.google.com\/spreadsheets\/d\/1zl_t39t46GXZ-zR0EtzqRroD18T9jZPg-mEPAz_P1NQ\/edit?gid=1062660194#gid=1062660194",
      "game-ac": "https:\/\/docs.google.com\/spreadsheets\/d\/1LDojW4sK_WeHPfnyghVSY3mUSTs55STtofQTRpJlfbQ\/edit?gid=1400908547#gid=1400908547",
      "test-drink": "test-drink.csv",
      "test-lunch": "test-lunch.csv",
      "test-agr-kikurage": "https:\/\/docs.google.com\/spreadsheets\/d\/1jN2ytZjUNUadnJbsYDqkKQgjXI6Bed1e57qIy7CXjsA\/edit?gid=1414939433#gid=1414939433",
      "sports-hsb": "https:\/\/docs.google.com\/spreadsheets\/d\/1W4lWWn1LUPuacq2erSOz2awtVFptaKVq2zhbGDMScQA\/edit?gid=362801428#gid=362801428",
      "store-cnt": "https:\/\/docs.google.com\/spreadsheets\/d\/1dg9_nG8NWGVQbt92CemQqwXzRDeT_x8Clw-OJOquNK8\/edit?gid=1551926412#gid=1551926412",
      "store-di": "https:\/\/docs.google.com\/spreadsheets\/d\/1kt3TyZR2gsVUSyIAkl-6Yy6-L7ZOzYhpgXyIUiDztfI\/edit?gid=362450162#gid=362450162",
      "kaggle-heart-disease": "https:\/\/docs.google.com\/spreadsheets\/d\/167QtjdMsXKraXdVokVFvhCfUVjgM4jAexp1RAsTrODU\/edit?gid=821196376#gid=821196376"
    },
  };
}
const createStackedBarChart = (dimension, parent, height, barWidth, onFiltered, isLegend, keyFormat = null, panel = null) => {
  let group = dimension.group().reduce(mm.group_reduce.append, mm.group_reduce.remove, mm.group_reduce.init);
  group = mm.groupRemoveKey(group, DN_EX);
  const groupAll = group.all();

  // 幅調整
  const n = groupAll.length;
  const barW = n > 16 ? parseInt(0.75 * barWidth) : barWidth;
  const chartW = (n + 1) * barW;
  if (!isSp && panel !== null) $(panel).width(chartW);

  const chart = new dc.BarChart(parent, "chartGroup");
  chart
    .width(chartW)
    .height(height)
    .useViewBoxResizing(mm.config.panelResizable)
    .margins({top: 0, right: 0, bottom: 20, left: 40})
    .gap(6)
    .transitionDuration(750)
    .dimension(dimension)
    .addFilterHandler(mm.addFilterHandler)
    .xUnits(dc.units.ordinal)
    .elasticX(true)
    .x(d3.scaleBand())
    .y(d3.scaleLinear())
    .elasticY(true)
    .yAxisPadding('25%')
    .on('renderlet', function (chart) {
      mm.chart.setFilterTextSel(chart);
    })
    .on('filtered', onFiltered)
    .on('pretransition', (chart) => {
      mm.chart.updateLegend(chart);
    })
    //.mouseZoomable(true)
    //.ordering(function(t){return -t.value.count;})//desc
    .renderHorizontalGridLines(true)
    .renderLabel(true)
    .label(function (d) {
      return mm.d3fmt(d.data.value.total);
    })
    .title(v => mm.util.stackedTitle(v, keyFormat));

  // chart.xAxis().ticks(4);
  chart.yAxis().tickFormat(d3.format(".2s")).ticks(4);

  // スタック登録
  mm.chart.setStacks(chart, group);

  if (isLegend) {
    const legend = mm.chart.createGridLegend(chartW);
    chart.legend(legend)
    chart.legendToggle = mm.chart.filterByStackName;
  }
  chart.ordinalColors(mm.config.cDate.colors);

  // xAxisのラベルが長い場合見えるように斜め表示にする
  let keys;
  if (keyFormat === null) {
    keys = groupAll.map(v => v.key);
  } else {
    keys = groupAll.map(v => keyFormat(v.key));
  }
  const isMinBar = barW < barWidth;
  mm.chart.adjustXAxisLabel(chart, mm.util.arrStrMaxLen(keys) + (isMinBar ? 2 : 0));

  return chart;
}
/**
 * CHART chartName 都道府県 rowChart Init
 */
const initChartName = () => {
  if (mm.opt.chartName.isScalePref) {
    mm.dimName = mm.util.getScaledDimensionPref(D_PL1);
  } else {
    mm.dimName = mm.ndx.dimension(function (d) {
      return d[D_PL1];
    });
  }

  mm.gpName = mm.dimName.group().reduceSum(function (d) {
    return d[D_PL1] === DN_PL1 ? 0 : mm.group_reduce.base(d)
  });
  mm.gpName.all().forEach(v => mm.gpName_all[v.key] = v.value);

  // 高さ調整
  const height = 24 + (mm.names.length * mm.config.cName.itemHeight);
  if (!isSp) {
    if (height < window.innerHeight) {
      $('#panel_name').height(height + 8);
    }
  }

  mm.chartName = new dc.RowChart("#chart_name", "chartGroup");
  mm.chartName.dataIndex = D_PL1;
  mm.chartName
    .width(isSp ? parseInt(window.innerWidth / 2) + 15 : 205)
    .titleLabelOffsetX(50)
    .height(height)
    .useViewBoxResizing(mm.config.panelResizable)
    .fixedBarHeight(24)
    .margins({top: 0, left: 4, right: 4, bottom: 10})
    .transitionDuration(750)
    .dimension(mm.dimName)
    //.group(mm.gpName)
    .group(mm.groupRemoveEmpty(mm.gpName)) //yAxis0件は表示しない
    .addFilterHandler(mm.addFilterHandler)
    .on('filtered', function (chart, v) {
      const filters = chart.filters();

      //都道府県複数選択時に、表示スタックを`都道府県`にするか？
      const go_pref_mode =
        // コロナデータお場合は、ageの場合は変化させない
        (gg.dt === DT_COVID && pnl.date.stack_type !== STACK_AGE)
        // それ以外のデータの場合、常に変化
        || gg.dt !== DT_COVID;

      if (go_pref_mode) {
        let pref_mode = filters.length > 1 && filters.length <= mm.chartStack[1].length;
        if (pref_mode) {
          pnl.date.stack_type = STACK_PL1;
        } else {
          pnl.date.stack_type = STACK_CND;
        }
        mm.dateStackShow(pnl.date.stack_type);
      }

      mm.chart.showDetailPanel(chart);

      // 都道府県一覧テーブルのフィルタにも適応
      $('#tbl_flt').val(filters.join(' ')).trigger('input');

      mm.showFilterUi('#panel_name', chart);
      mm.onChartFiltered(chart, v);

      const input = $(mm.keyboardInputName);
      if (input.is(':visible')) {
        if (input.val().trim() !== '') {
          _.delay(() => {
            input.trigger('change');
          }, 5);
        }
      }
      mm.onChangeURL('name', chart);
      mm.chartScroll('#div_city');
    })
    .on('pretransition', function (chart) {
      mm.chart.setImageLink(chart,
        mm.opt.chartName.imageTooltip ? D_PL1 : -1,
        mm.opt.chartName.imageTooltip,
        'div_name'
      );
    })
    .ordinalColors(isDark ? d3.schemePaired : colorbrewer.Set2[8])
    //.gap(10) //default:5
    .renderLabel(true) //LeftLabel & tooltip
    .label(function (d) {
      let zenkakuName = d.key;
      if (!mm.opt.chartName.isLabelAlphabet) {
        if (mm.util.isHankaku(d.key)) {
          zenkakuName = mm.util.toZenkaku(d.key);
        }
      }
      let s = zenkakuName;
      const wordNum = gg.dt === DT_COVID ? 4 : (isSp ? 6 : 8); // 何文字目から数字を表示するか？都道府県名は4文字
      for (var i = 0; i < wordNum - zenkakuName.length; i++) s += '　';
      s += ' ';
      const is_filtered = mm.gpName_all[d.key] !== d.value;
      // let p=mm.opt.assets.pref_tbl_last_m1[d.key];
      //       'PCR検査: '+php_number_format(p.pcrtested)+'名 ('+p.pcrtested_p+'%)<br />'+
      //       '死亡者数: '+p.deaths+'名<br />'+
      //       '退院者数: '+php_number_format(p.discharged)+'名<br />'+
      //       '対策病床数: '+php_number_format(p.bed)+'床 ('+(_.round(100*patient/p.bed,2)) + '%)<br />'
      return s
        + (mm.opt.chartName.isHideLabelValue ? '' : (d.value < (1000 * 1000 * 10) ? php_number_format(d.value) : mm.d3fmt(d.value)))
        + (is_filtered || mm.chartDate.data.length < 2 ? '' : (mm.pref_tbl_last_cnt[d.key] ? '▲' + mm.pref_tbl_last_cnt[d.key] : ''));
    })
    .renderTitleLabel(false) //RightLabel & tooltip
    .title(function (d) {
      const ret = gg.dt === DT_COVID ? mm.getChartNameCovid19Title(d.key, '\n') : '';
      return ret === '' ? (d.key + ' ： ' + php_number_format(d.value)) : ret;
    })
    .elasticX(true)
  ;
  mm.chartName.xAxis().ticks(0);//.tickFormat(d3.format("s"));
}

/**
 * CHART chartCity 市区町村 rowChart Init
 */
const initChartCity = () => {
  let dimCity;
  if (mm.opt.chartCity.isScalePref) {
    dimCity = mm.util.getScaledDimensionPref(D_PL2);
  } else {
    dimCity = mm.ndx.dimension(function (d) {
      return d[D_PL2];
    });
  }

  if (pnl.city.orderUI) {
    // ここだけ、Sum(cnt)　(例: 売り上げ本数合計)へ、
    mm.gpCity = dimCity.group()
      .reduceSum(d => (d[D_CNT] || 1));
  } else {
    mm.gpCity = dimCity.group()
      .reduceSum(d => d[D_PL2] === DN_PL2 ? 0 : mm.group_reduce.base(d));
  }

  // 高さ調整
  const height = 24 + (Object.keys(mm.gpCity.all()).length * mm.config.cCity.itemHeight);
  if (!isSp) {
    if (height < window.innerHeight) {
      $('#panel_city').height(height + 8);
    }
  }

  mm.chartCity = new dc.RowChart("#chart_city", "chartGroup");
  mm.chartCity.dataIndex = D_PL2;
  mm.chartCity
    .width(isSp ? parseInt(window.innerWidth / 2) - 30 : 230)
    .height(height)
    .useViewBoxResizing(mm.config.panelResizable)
    .fixedBarHeight(24)
    .margins({top: 0, left: 4, right: 4, bottom: 10})
    .transitionDuration(750)
    .dimension(dimCity)
    .group(mm.groupRemoveEmpty(mm.gpCity)) //yAxis0件は表示しない
    //.group(mm.gpCity) //yAxisすべて表示
    .addFilterHandler(mm.addFilterHandler)
    .on('pretransition', function (chart) {
      mm.chart.setImageLink(chart,
        mm.opt.chartCity.imageTooltip ? D_PL2 : -1,
        mm.opt.chartCity.imageTooltip,
        'div_city'
      );
    })
    .on('filtered', function (chart, v) {
      mm.chart.showDetailPanel(chart);
      mm.showFilterUi('#panel_city', chart);//,(f)=>moment(f).format('M/D(ddd)'));
      mm.onChartFiltered(chart, v);

      const input = $(mm.keyboardInputCity);
      if (input.is(':visible')) {
        if (input.val().trim() !== '') {
          _.delay(() => {
            input.trigger('change');
          }, 5);
        }
      }
      mm.onChangeURL('name2', chart);
    })
    .ordinalColors(isDark ? d3.schemeDark2 : colorbrewer.Pastel1[9])
    .renderLabel(true) //LeftLabel
    // .label(function(d) {
    //     let is_filtered = mm.gpCity_all[d.key]!==d.value;
    //     const n=is_filtered?8:6;
    //     let s=d.key.substr(0,n);
    //     for (var i = s.length; i < n+1; i++) s+='　';
    //     return s+d.value + (is_filtered ? '' : (mm.pref_tbl_city_cnt[d.key] ? '▲'+mm.pref_tbl_city_cnt[d.key] : '' ));
    // })
    // .label(function (d) {
    // 	return php_sprintf("%' -8s", d.key) + php_number_format(d.value);
    // })
    .label(function (d) {
      let s = d.key;
      const wordNum = (isSp ? 6 : 8); // 何文字目から数字を表示するか？都道府県名は4文字
      for (var i = 0; i < wordNum - d.key.length; i++) s += '　';
      s += ' ';
      return s
        + (mm.opt.chartCity.isHideLabelValue ? '' : (d.value < (1000 * 1000 * 10) ? php_number_format(d.value) : mm.d3fmt(d.value)));
    })
    .renderTitleLabel(false) //RightLabel & tooltip
    .titleLabelOffsetX(20)
    .title(function (d) {
      return d.key + ' : ' + php_number_format(d.value);
    })
    .elasticX(true);

  mm.chartCity.xAxis().ticks(0);
  if (mm.opt.chartCity.orderYmd) {
    mm.chartCity.ordering(mm.orderYmd);
  }
}

/**
 * CHART chartDate 感染者数(YYYY-MM-DD) barChart Init
 */
const initChartDate = (chartDateW) => {
  let no;
  const dimDate = mm.ndx.dimension(function (d) {
    return d3.timeDay(new Date(d[D_YMD]));
  });
  mm.gpDate = dimDate.group().reduceSum(function (d) {
    return mm.group_reduce.base(d);
  });

  const gpDateStk = dimDate.group().reduce(mm.group_reduce.append, mm.group_reduce.remove, mm.group_reduce.init);
  //.order(function(d) {return d.total;});

  mm.composite = new dc.CompositeChart("#chart_date", "chartGroup");
  mm.composite.dataIndex = D_YMD;

  mm.chartDate = new dc.BarChart(mm.composite);
  mm.chartDate.dataIndex = D_YMD;
  mm.chartDate
    .centerBar(false)
    .transitionDuration(750)
    .dimension(dimDate)
    .hidableStacks(false) // stackNameLegend click でタックを非表示または表示
    .yAxisPadding('12%')
    //.useRightYAxis(IS_SP) 				// .elasticX(true)
    // .xAxisPadding(2)
    // .xAxisPaddingUnit()
    .renderLabel(true)
    .label(function (d, i) {
      let ymd = moment(d.x).format('YYYYMMDD');

      return (d.data.value.total === mm.dateCntMax //最大
        || ymd === mm.dateCntTo //最新日付
        //  ||ymd===moment(mm.dateCntTo).subtract(1, 'days').format('YYYYMMDD') //最新日付-1days
      ) ? (d.data.value.total === 0 ? '' : php_number_format(d.data.value.total)) : '';
      //return mm.gpDateYMMax.value===d.data.value.total ? d.data.value.total : '';
    })
    .on('filtered', function (chart, v) {
      //mm.showFilterUi('#panel_date',chart,(f)=>moment(f).format('M/D(ddd)'));
      mm.onChartFiltered(chart, v);
    })
  ;
  mm.chartDate.yAxis().tickFormat(d3.format(".2s")).ticks(5); //tickFormat(d3.format("s"));

  //
  // スタック登録 - CHART_DATE_STACK_GRP[STACK_CND]
  //

  const colCondTbl = [], colAgeTbl = [];
  if (gg.dt === DT_COVID) {
    mm.chartDate
      .group(gpDateStk, CND_LV_A, (d) => d.value.lv_a)
      .stack(gpDateStk, CND_LV_B, (d) => d.value.lv_b)
      .stack(gpDateStk, CND_LV_C, (d) => d.value.lv_c)
      .stack(gpDateStk, CND_LV_D, (d) => d.value.lv_d)
      .stack(gpDateStk, CND_LV_E, (d) => d.value.lv_e);
  } else {
    mm.chartStack[STACK_CND] = mm.util.getScaledDimensionCond().group().all().sort((a, b) => b.value - a.value)
      .map(v => v.key);

    for (no = 0; no < mm.chartStack[STACK_CND].length; no++) {
      if (no === 0) {
        mm.chartDate.group(gpDateStk, mm.chartStack[STACK_CND][no], mm.dateStackCndAccessor(no));
      } else {
        mm.chartDate.stack(gpDateStk, mm.chartStack[STACK_CND][no], mm.dateStackCndAccessor(no));
      }
      mm.chartStackIdxCnd[mm.chartStack[STACK_CND][no]] = no;
    }

    mm.config.cCond.colors = Array(mm.chartStack[STACK_CND].length);
    for (let i = 0; i < mm.config.cCond.colors.length; i++) {
      // @see [Categorical schemes](https://d3js.org/d3-scale-chromatic/categorical)
      mm.config.cCond.colors[i] = d3.schemePaired[i % d3.schemePaired.length];
    }

    const cndAll = mm.util.getScaledDimensionCond().group().all();
    for (let i = 0; i < cndAll.length; i++) {
      colCondTbl[i] = mm.chartStack[STACK_CND].findIndex(o => o === cndAll[i].key);
    }
  }
  //
  // スタック登録 - CHART_DATE_STACK_GRP[STACK_PL1]
  //
  for (no = 0; no < mm.chartStack[STACK_PL1].length; no++) {
    mm.dateStackPl1Names[no] = '(選択' + (no + 1) + ')';
    mm.chartDate.stack(gpDateStk, mm.chartStack[STACK_PL1][no], mm.dateStackPl1Accessor(mm.chartDate, no));
  }

  //
  // スタック登録 - CHART_DATE_STACK_GRP[STACK_AGE]
  //
  if (gg.dt !== DT_COVID) {
    if (mm.opt.chartAge.unit === null) {
      mm.chartStack[STACK_AGE] = mm.util.getScaledDimensionAge().group().all()
        .sort((a, b) => b.value - a.value)
        .map(v => v.key);

      for (no = 0; no < mm.chartStack[STACK_AGE].length; no++) {
        mm.chartStackIdxAge[mm.chartStack[STACK_AGE][no]] = no;
      }

      const ageAll = mm.util.getScaledDimensionAge().group().all();
      for (let i = 0; i < ageAll.length; i++) {
        colAgeTbl[i] = mm.chartStack[STACK_AGE].findIndex(o => o === ageAll[i].key);
      }

    } else {
      for (no = 0; no < mm.chartStack[STACK_AGE].length; no++) {
        mm.chartStackIdxAge[mm.chartStack[STACK_AGE][no]] = no;
      }
      const ageAll = mm.util.getScaledDimensionAge().group().all().map(v => parseInt(v.key));
      for (let i = 0; i < ageAll.length; i++) {
        colAgeTbl[i] = mm.chartStack[STACK_AGE].findIndex(o => mm.chartStackIdxAge[o] === ageAll[i]);
      }
    }
  }

  for (no = 0; no < mm.chartStack[STACK_AGE].length; no++) {
    mm.chartDate.stack(gpDateStk, mm.chartStack[STACK_AGE][no], mm.dateStackAgeAccessor(no));
  }

  mm.config.cDate.colors = mm.config.cCond.colors.concat(COL_NAME).concat(COL_AGE);
  mm.chartDate.ordinalColors(mm.config.cDate.colors);
  mm.pref_tbl_last_cnt = _.last(mm.chartDate.group().all()).value.nmcnt;

  //
  // 別チャートが色が同じになるように対応
  //
  if (gg.dt !== DT_COVID) {
    mm.chartAge
      .colorAccessor(function (d, i) {
        return colAgeTbl[i];
      })
      .colors(function (i) {
        return COL_AGE[i];
      });

    mm.chartCond
      .colorAccessor(function (d, i) {
        return colCondTbl[i];
      })
      .colors(function (i) {
        return mm.config.cCond.colors[i];
      });
  }
  mm.chartDate.legendToggle = mm.chart.filterByStackName;

  //===========================================================================
  // CHART lineChart chartLine_init
  //===========================================================================
  if (gg.dt === DT_COVID) {
    mm.chartLine = new dc.LineChart(mm.composite);
    mm.chartLine
      .dimension(dimDate)
      .colors('red')
      .group(mm.gpDate, '週間移動平均')
      //.useRightYAxis(IS_SP)
      //.yAxisPadding('40%')
      .valueAccessor(function (d, no) {
        const N = 7;// N日 移動平均
        if (no === 0) {
          mm.work = _.values(_.mapValues(mm.gpDate.all(), d => d.value));
        }
        let i = no - N + 1;
        let v = mm.work.slice(i < 0 ? 0 : i, i + N);
        let ave = Math.round(_.sum(v) / N);
        return ave;
      })
    //.dashStyle([2,2])
    ;
    //mm.chartLine.yAxis().ticks(5);
  }

  //===========================================================================
  // CHART composite_init
  //===========================================================================
  const legend = mm.chart.createGridLegend(chartDateW);
  const valueFormat = (f) => moment(f).format('YYYY/M/D(ddd)');
  mm.composite
    .width(chartDateW)
    .height(200)
    .useViewBoxResizing(mm.config.panelResizable)
    //左
    // .margins({top: 0, right: 0, bottom: 20, left: 30})
    // .legend(dc.legend().x(40).y(0))
    //右
    .margins({
      top: 0,
      right: 0,
      bottom: 20,
      left: 35
    })
    .legend(legend)
    .x(mm.domainDate ? d3.scaleTime().domain(mm.domainDate) : d3.scaleTime())
    .elasticX(false)
    //.round(d3.timeDay.round)
    // .mouseZoomable(!IS_SP && gg.dt !== DT_COVID)
    .mouseZoomable(false)
    .xUnits(d3.timeDay)
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(gg.dt !== DT_COVID)
    .brushOn(false)
    .elasticY(mm.config.cDate.is_elasticY) //yAxisの高さを動的に変化させる
    .title(v => mm.util.stackedTitle(v, valueFormat))
    .on('renderlet', function (chart, filter) {
    })
    .on('pretransition', mm.onChartDatePretransition)
    .addFilterHandler(mm.addFilterHandler)
    .on('preRedraw', function (chart) {
      mm.chartDate.filterAll().filter([mm.composite.filters()]);
    })
    .on('filtered', function (chart, v) {
      mm.showFilterUi('#panel_date', chart, valueFormat);
      mm.onChartFiltered(chart, v);
      mm.chartScroll('#div_name');
      mm.chartScroll('#div_city');
      mm.onChangeURL('date', chart);
    })
    .compose(gg.dt === DT_COVID ? [mm.chartDate, mm.chartLine] : [mm.chartDate])
  ;
  const nTick = gg.dt === DT_COVID ? 7 : (mm.gpDate.all().length < 3 ? 2 : 14);
  mm.composite.xAxis().ticks(nTick).tickFormat(function (s) {
    // データのレンジで ミクロ/マクロ を切り替える
    const format = mm.opt.chartDate.format ?? (mm.data.length < 3000 ? 'M/Dddd' : 'YYYY/MM');
    return moment(s).format(format);
  });
  mm.composite.yAxis().tickFormat(d3.format(".2s")).ticks(5); //.tickFormat(d3.format("d"));

}

/**
 * CHART chartDate2 患者・PCR・死亡(YYYY-MM-DD) barChart Init
 */
const initChartDate2Covid = (chartDateW) => {
  let ndx3 = crossfilter(mm.opt.assets.data3);
  mm.dimName2 = ndx3.dimension(function (d) {
    return d[D3_PL1];
  });

  let dimDate2 = ndx3.dimension(function (d) {
    return d3.timeDay(new Date(d[D3_YMD]));
  });
  mm.gpDate2 = dimDate2.group().reduceSum(function (d) {
    return d[D3_CNT];
  });

  let gpDateStk2 = dimDate2.group().reduce(
    function date2_grp_add(p, v) {
      let pl = v[D3_PL1], cnt = v[D3_CNT], type = v[D3_TYP];
      p.all[type] += cnt;
      p.pre[type][pl] = (p.pre[type][pl] || 0) + cnt;
      return p;
    },
    function date2_grp_remove(p, v) {
      let pl = v[D3_PL1], cnt = v[D3_CNT], type = v[D3_TYP];
      p.all[type] -= cnt;
      p.pre[type][pl] = (p.pre[type][pl] || 0) - cnt;
      return p;
    },
    function date2_grp_init(p, v) {
      return {all: [0, 0, 0], pre: [{}, {}, {}]};
    }
  );

  mm.composite2 = new dc.CompositeChart("#chart_date2", "chartGroup");
  mm.chartDate2 = new dc.BarChart(mm.composite2);
  mm.chartLine2 = new dc.LineChart(mm.composite2);

  mm.chartDate2
    .centerBar(false)
    .transitionDuration(750)
    .dimension(dimDate2)
    .elasticY(true)
    .group(gpDateStk2, 'PCR', function (d) {
      let flt_len = mm.chartName.filters().length;
      return (flt_len === 0 && mm.chartDate2Mode === MD_PCR) ? d.value.all[MD_PCR] : 0;
    })
    .stack(gpDateStk2, '死亡', function (d) {
      let flt_len = mm.chartName.filters().length;
      return (flt_len === 0 && mm.chartDate2Mode === MD_DEA) ? d.value.all[MD_DEA] : 0;
    })
    .stack(gpDateStk2, '患者', function (d) {
      let flt_len = mm.chartName.filters().length;
      return (flt_len === 0 && mm.chartDate2Mode === MD_PAT) ? d.value.all[MD_PAT] : 0;
    })
    .hidableStacks(false) // stackNameLegend click でタックを非表示または表示
    .yAxisPadding('12%')
    .renderLabel(true)
    .label(function (d, i) {
      let ymd = moment(d.x).format('YYYYMMDD');
      let flt = mm.chartName.filters();
      let total;
      if (flt.length) {
        let f = _.filter(d.data.value.pre[mm.chartDate2Mode], (k, v) => flt.includes(v));//mm.chartNameフィルタでされた物だけ抽出
        total = _.sum(f);
      } else {
        total = d.data.value.all[mm.chartDate2Mode];
      }
      if (total === 0) return '';
      //最大                     最新日付
      return (mm.dateCntMax2Ymd.includes(ymd) || ymd === mm.dateCntTo2) ? php_number_format(total) : '';

    })
    .ordinalColors(_.concat(COL_DATE2, _.concat(colorbrewer.Set1[3], colorbrewer.Set1[6])))
    .on('filtered', function (chart, v) {
      //mm.showFilterUi('#panel_date',chart,(f)=>moment(f).format('M/D(ddd)'));
      mm.onChartFiltered(chart, v);
    })
  ;
  mm.chartDate2.yAxis().tickFormat(d3.format(".2s")).ticks(5); //tickFormat(d3.format("s"));

  function date2_sel_stack(chart, no) {
    return function (d, i) {
      let flt = mm.chartName.filters();
      let pref_mode = flt.length > 0;
      if (pref_mode) {
        let flt_name = flt[no - 1];
        chart.stack()[CHART_DATE2_STACK1_N + no - 1].name = flt_name;
        return (d.value.pre[mm.chartDate2Mode][flt_name] || 0);
      } else {
        chart.stack()[CHART_DATE2_STACK1_N + no - 1].name = '(選択' + no + ')';
        return 0;
      }
    }
  }

  for (var no = 1; no < CHART_DATE2_STACK2_N; no++) {
    mm.chartDate2.stack(gpDateStk2, '(選択' + no + ')', date2_sel_stack(mm.chartDate2, no));
  }

  //===========================================================================
  // CHART lineChart chartLine2_init
  //===========================================================================
  mm.chartLine2
    .dimension(dimDate2)
    .colors('red')
    .group(mm.gpDate2, "週間移動平均")
    //.useRightYAxis(IS_SP)
    //.yAxisPadding('40%')
    .valueAccessor(function (d, no) {
      const N = 7;// N日 移動平均
      if (no === 0) {
        let flt = mm.chartName.filters();
        mm.work = [];
        mm.dateCntTo2 = '00000000';
        mm.dateCntMax2Ymd = [];

        if (flt.length) {
          mm.chartDate2.group().all().forEach((v) => {
            let f = _.filter(v.value.pre[mm.chartDate2Mode], (k, v) => flt.includes(v));//mm.chartNameフィルタでされた物だけ抽出
            let s = _.sum(f);
            mm.work.push(s);

            let ymd = moment(v.key).format('YYYYMMDD');
            if (s > 0 && ymd > mm.dateCntTo2) mm.dateCntTo2 = ymd;

            if (s === mm.dateCntMax2) {
              mm.dateCntMax2Ymd.push(ymd);
            }
          });
        } else {
          mm.chartDate2.group().all().forEach((v) => {
            let s = v.value.all[mm.chartDate2Mode];
            mm.work.push(s);
            let ymd = moment(v.key).format('YYYYMMDD');
            if (s > 0 && ymd > mm.dateCntTo2) mm.dateCntTo2 = ymd;
          });
        }
        if (mm.chartDate2Mode === MD_PAT) {
          pnl.date.chart2.cnt = php_number_format(_.last(mm.work));
        } else {
          pnl.date.chart2.cnt = php_number_format(_.sum(mm.work));
        }
        mm.dateCntMax2 = _.max(mm.work);
      }
      let i = no - N + 1;
      let v = mm.work.slice(i < 0 ? 0 : i, i + N);
      let ave = Math.round(_.sum(v) / N);
      return ave;
    })
  //.dashStyle([2,2])
  ;
  //mm.chartLine.yAxis().ticks(5);

  //===========================================================================
  // CHART composite2_init
  //===========================================================================
  mm.composite2
    .width(chartDateW)
    .height(160)
    .useViewBoxResizing(mm.config.panelResizable)
    //左
    // .margins({top: 0, right: 0, bottom: 20, left: 30})
    // .legend(dc.legend().x(40).y(0))
    //右
    .margins({
      top: 0,
      right: 0,
      bottom: 20,
      left: 50
    }).legend(dc.legend().x(isSp ? chartDateW - 350 : 60).y(0))
    .x(mm.domainDate ? d3.scaleTime().domain(mm.domainDate) : d3.scaleTime())
    .elasticX(false)
    //.round(d3.timeDay.round)
    .mouseZoomable(false)
    .xUnits(d3.timeDay)
    .renderHorizontalGridLines(true)
    .brushOn(false)
    .elasticY(mm.config.cDate.is_elasticY) //yAxisの高さを動的に変化させる
    .title(function (d) {
      let is_bar = isNaN(d.value);
      let s_suf = '';
      switch (1) {
        default:
          let ymd = moment(d.key).format('YYYY-MM-DD');
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[0][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[0][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[1][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[1][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[2][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[2][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[3][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[3][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[4][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[4][1];
            break;
          }

          if (ymd === mm.opt.assets.chartDateLineYmdMsg[5][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[5][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[6][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[6][1];
            break;
          }

          if (ymd === mm.opt.assets.chartDateLineYmdMsg[7][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[7][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[8][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[8][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[9][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[9][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[10][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[10][1];
            break;
          }

          if (ymd === mm.opt.assets.chartDateLineYmdMsg[11][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[11][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[12][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[12][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[13][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[13][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[14][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[14][1];
            break;
          }

          if (ymd === mm.opt.assets.chartDateLineYmdMsg[15][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[15][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[16][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[16][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[17][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[17][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[18][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[18][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[19][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[19][1];
            break;
          }
          if (ymd === mm.opt.assets.chartDateLineYmdMsg[20][0]) {
            s_suf = mm.opt.assets.chartDateLineYmdMsg[20][1];
            break;
          }
          break;
      }
      let date_str = typeof (d.key) === "object" ? moment(d.key).format('YYYY/M/D(ddd)') : d.key;
      if (!is_bar) {
        return date_str + '\n週間移動平均: ' + php_number_format(d.value) + '名';
      }

      let flt = mm.chartName.filters();
      if (flt.length > 0) {
        let s = ''
        let nmcnt = d.value.pre[mm.chartDate2Mode];
        let total = 0;
        for (let f of flt) {
          s += nmcnt[f] ? (f + ': ' + php_number_format(nmcnt[f]) + '名\n') : '';
          total += nmcnt[f];
        }
        return date_str + '\n────────\n' + s + (flt.length > 1 ? '────────\n計: ' + php_number_format(total) + '名' : '') + '\n' + s_suf;
        // }else if(flt.length==0){
        //     return date_str+'\n:'+d.value.total+'名 (全国)'+'\n'+s;
      } else {
        return date_str + '\n────────\n' +
          '全国 計: ' + (d.value.all[mm.chartDate2Mode] === 0 ? '' : php_number_format(d.value.all[mm.chartDate2Mode]) + '名\n') + s_suf;
      }
    })
    .on('renderlet', function (chart, filter) {
    })
    .on('pretransition', mm.onChartDatePretransition)
    .addFilterHandler(mm.addFilterHandler)
    .on('preRedraw', function (chart) {
      //フィルタを追加選択(CTRL+)した時、chartDateのフィルタには追加されない(bug?)ので、ここでcompositeのフィルタをコピー
      mm.chartDateLegendUpdate2();
      mm.chartDate2.filterAll().filter([mm.composite2.filters()]);
    })
    .on('filtered', function (chart, v) {
      mm.showFilterUi('#panel_date', chart, (f) => moment(f).format('YYYY/M/D(ddd)'));
      mm.onChartFiltered(chart, v);
    })
    .compose([mm.chartDate2, mm.chartLine2])
  ;
  mm.composite2.xAxis().ticks(7).tickFormat(function (s) {
    // データのレンジで ミクロ/マクロ を切り替える
    const format = mm.opt.chartDate.format ?? (mm.data.length < 3000 ? 'M/Dddd' : 'YYYY/MM');
    return moment(s).format(format);
  });
  mm.composite2.yAxis().ticks(5).tickFormat(d3.format("~s"));//1.5k
}

/**
 * CHART chartDate2 日付  line Stack Chart Init
 */
const initChartDate2Stacks = (chartDateW, stackOn) => {
  const dimDate = mm.ndx.dimension(function (d) {
    return d3.timeDay(new Date(d[D_YMD]));
  });
  const gpDate = dimDate.group().reduceSum(function (d) {
    return mm.group_reduce.base(d);
  });
  const gpDateStk = dimDate.group().reduce(mm.group_reduce.append, mm.group_reduce.remove, mm.group_reduce.init);
  //.order(function(d) {return d.total;});

  mm.composite2 = new dc.CompositeChart("#chart_date2", "chartGroup");

  mm.chartDate2 = new dc.LineChart(mm.composite2);

  mm.chartDate2
    //.centerBar(false) BarChart_method
    .renderArea(true)
    // .curve(d3.curveLinear)
    .curve(d3.curveBasis)
    // .curve(d3.curveCardinal)
    // .renderDataPoints(true)
    .transitionDuration(750)
    .dimension(dimDate)
    .hidableStacks(false) // stackNameLegend click でタックを非表示または表示
    .yAxisPadding('12%')
    //.useRightYAxis(IS_SP) 					// .elasticX(true)
    // .xAxisPadding(2)
    // .xAxisPaddingUnit()
    .renderLabel(true)
    .label(function (d, i) {
      let ymd = moment(d.x).format('YYYYMMDD');
      return (d.data.value.total === mm.dateCntMax //最大
        || ymd === mm.dateCntTo //最新日付
        //  ||ymd===moment(mm.dateCntTo).subtract(1, 'days').format('YYYYMMDD') //最新日付-1days
      ) ? (d.data.value.total === 0 ? '' : php_number_format(d.data.value.total)) : '';
      //return mm.gpDateYMMax.value===d.data.value.total ? d.data.value.total : '';
    })
    // .title(function(d) {//mouseホバーしたときの表示される文字
    //     return moment(d.key).format('YYYY/MM/DD')+' : '+d.value+'名';
    // })
    //.y(d3.scaleLinear().domain([0, 50]))
    // .gap(isSp ? -2 : -2) // BarChart_method
    .on('filtered', function (chart, v) {
      //mm.showFilterUi('#panel_date',chart,(f)=>moment(f).format('M/D(ddd)'));
      mm.onChartFiltered(chart, v);
    })
  ;
  mm.chartDate2.yAxis().tickFormat(d3.format(".2s")); //ticks(5); //tickFormat(d3.format("s"));
  mm.chart.stackOn(mm.chartDate2, stackOn);

  // スタック登録 - CHART_DATE_STACK_GRP[0]
  for (var no = 0; no < mm.chartStack[STACK_CND].length; no++) {
    if (no === 0) {
      mm.chartDate2.group(gpDateStk, mm.chartStack[STACK_CND][no], mm.dateStackCndAccessor(no));
    } else {
      mm.chartDate2.stack(gpDateStk, mm.chartStack[STACK_CND][no], mm.dateStackCndAccessor(no));
    }
    //mm.CHART_DATE_STACK_GRP_1_IDX[CHART_DATE_STACK_GRP[STACK_CND][no]] = no;
  }

  // スタック登録 - CHART_DATE_STACK_GRP[STACK_PL1]
  for (var no = 0; no < mm.chartStack[STACK_PL1].length; no++) {
    // mm.dateStackPl1Names[no] = '(選択' + (no + 1) + ')';
    mm.chartDate2.stack(gpDateStk, mm.chartStack[STACK_PL1][no], mm.dateStackPl1Accessor(mm.chartDate2, no));
  }

  // スタック登録 - CHART_DATE_STACK_GRP[STACK_AGE]
  for (var no = 0; no < mm.chartStack[STACK_AGE].length; no++) {
    mm.chartDate2.stack(gpDateStk, mm.chartStack[STACK_AGE][no], mm.dateStackAgeAccessor(no));
  }

  mm.chartDate2.ordinalColors(mm.config.cDate.colors);

  mm.composite2
    .width(chartDateW)
    .height(200)
    .useViewBoxResizing(mm.config.panelResizable)
    //左
    // .margins({top: 0, right: 0, bottom: 20, left: 30})
    // .legend(dc.legend().x(40).y(0))
    //右
    .margins({
      top: 0,
      right: 0,
      bottom: 20,
      left: 35
    }).legend(dc.legend().x(isSp ? chartDateW - 200 : 45).y(10).legendText((d) => {
    let sel_no = d.name.split(':');
    return sel_no.length === 2 ? mm.dateStackPl1Names[sel_no[1]] : d.name;
  }))
    .x(mm.domainDate ? d3.scaleTime().domain(mm.domainDate) : d3.scaleTime())
    .elasticX(false)
    //.round(d3.timeDay.round)
    .mouseZoomable(false)
    .xUnits(d3.timeDay)
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .brushOn(false)
    .elasticY(mm.config.cDate.is_elasticY) //yAxisの高さを動的に変化させる
    .title(function (d) {
      let is_bar = isNaN(d.value);
      let s_suf = '';
      //let ymd2=moment(d.key).format('YYYYMMDD');
      //s='累計: '+mm.dateCnt[ymd2]+'名\n'; //TODO:
      let date_str = typeof (d.key) === "object" ? moment(d.key).format('YYYY/M/D(ddd)') : d.key;
      if (!is_bar) {
        //N日 移動平均
        return date_str + '\n週間移動平均: ' + php_number_format(d.value) + '名';
      }

      let flt = mm.chartName.filters();
      let pref_mode = flt.length > 1 && flt.length <= mm.chartStack[STACK_PL1].length;
      if (pref_mode) {
        let s = '';
        for (let f of flt) {
          s += d.value.nmcnt[f] ? (f + ': ' + d.value.nmcnt[f] + '名\n') : '';
        }
        return date_str + '\n────────\n' + s + (flt.length > 1 ? '────────\n計: ' + d.value.total + '名' : '') + '\n' + s_suf;
      } else if (pnl.date.stack_type === STACK_AGE) {
        let s = '';
        for (var i = 0; i < d.value.agcnt.length; i++) {
          if (d.value.agcnt[i] === 0) continue
          let per = _.round(100 * d.value.agcnt[i] / d.value.total, 1) + '%';
          let nm = mm.chartStack[STACK_AGE][i];
          s += php_sprintf("%' -8s", nm) + ': ' + php_sprintf("%' 3s", php_number_format(d.value.agcnt[i])) + ' (' + per + ')\n';
        }
        return date_str + '\n──────────\n' + s + '──────────\n計: ' + php_number_format(d.value.total) + '\n' + s_suf;
      } else { // tack_type==='con'
        if (gg.dt === DT_COVID) {
          return date_str + '\n────────\n' +
            (d.value.lv_a === 0 ? '' : CND_LV_A + ': ' + d.value.lv_a + '名\n') +
            (d.value.lv_b === 0 ? '' : CND_LV_B + ': ' + d.value.lv_b + '名\n') +
            (d.value.lv_c === 0 ? '' : CND_LV_C + ': ' + d.value.lv_c + '名\n') +
            (d.value.lv_d === 0 ? '' : CND_LV_D + ': ' + d.value.lv_d + '名\n') +
            (d.value.lv_e === 0 ? '' : CND_LV_E + ': ' + d.value.lv_e + '名\n') +
            '────────\n計: ' + php_number_format(d.value.total) + '名' + '\n' + s_suf;
        } else {
          let s = '';
          for (var i = 0; i < d.value.cdcnt.length; i++) {
            if (d.value.cdcnt[i] === 0) continue
            let per = _.round(100 * d.value.cdcnt[i] / d.value.total, 1) + '%';
            let nm = mm.chartStack[STACK_CND][i];
            s += php_sprintf("%' -8s", nm) + ': ' + php_sprintf("%' 3s", php_number_format(d.value.cdcnt[i])) + ' (' + per + ')\n';
          }
          return date_str + '\n──────────\n' + s + '──────────\n計: ' + php_number_format(d.value.total) + '\n' + s_suf;

        }
      }
    })
    .on('renderlet', function (chart, filter) {
    })
    .on('pretransition', mm.onChartDatePretransition)
    .addFilterHandler(mm.addFilterHandler)
    .on('preRedraw', function (chart) {
      mm.chartDate2.filterAll().filter([mm.composite.filters()]);
    })
    .on('filtered', function (chart, v) {
      mm.showFilterUi('#panel_date', chart, (f) => moment(f).format('YYYY/M/D(ddd)'));
      mm.onChartFiltered(chart, v);
      mm.chartScroll('#div_name');
      mm.chartScroll('#div_city');
      mm.onChangeURL('date', chart)
    })
    .compose([mm.chartDate2])
  ;
  const nTick = gg.dt === DT_COVID ? 7 : (gpDate.all().length < 3 ? 2 : 14);
  mm.composite2.xAxis().ticks(nTick).tickFormat(function (s) {
    // データのレンジで ミクロ/マクロ を切り替える
    const format = mm.opt.chartDate.format ?? (mm.data.length < 3000 ? 'M/Dddd' : 'YYYY/MM');
    return moment(s).format(format);
  });
  mm.composite2.yAxis().tickFormat(d3.format(".2s")).ticks(5); //.tickFormat(d3.format("d"));

  // mm.composite2.brushOn(true)
  // mm.composite.rangeChart(mm.composite2);

  // mm.composite2.rangeChart(mm.composite);
}

/**
 * CHART chartDate2 日付  line seriesChart Init
 */
const initChartDate2TypeSeries = (chartDateW) => {
  mm.composite2 = new dc.SeriesChart("#chart_date2", "chartGroup");

  const dimDate = mm.ndx.dimension(function (d) {
    return [d3.timeDay(new Date(d[D_YMD])), d[D_CND], d[D_PL1], d[D_AGE]];
  });
  const gpDate = dimDate.group().reduceSum(function (d) {
    return mm.group_reduce.baseZero(d);
  });

  mm.composite2
    .width(chartDateW)
    .height(200)
    .useViewBoxResizing(mm.config.panelResizable)
    .chart(function (c) {
      return new dc.LineChart(c)
        // .curve(d3.curveLinear)
        .curve(d3.curveBasis)
        // .curve(d3.curveCardinal)
        .renderArea(true)
        .renderLabel(true)
        .renderDataPoints(true)
        // .elasticX(false)
        // .elasticY(true)
        ;
    })
    .margins({
      top: 0,
      right: 0,
      bottom: 20,
      left: 35
    })
    .x(mm.domainDate ? d3.scaleTime().domain(mm.domainDate) : d3.scaleTime())
    .brushOn(false)
    .elasticY(true)
    .dimension(dimDate)
    .group(gpDate)
    // .mouseZoomable(true)
    .seriesAccessor(function (d) {
      // console.log(d);
      let ret = ' ';
      switch (pnl.date.stack_type) {
        default:
          ret = ' ';
          break;
        case STACK_CND:
        case STACK_PL1:
          ret = d.key[pnl.date.stack_type + 1];
          break;
        case STACK_AGE:
          //CHART_DATE_STACK_GRP[STACK_AGE]
          ret = mm.opt.chartAge.unit ? mm.opt.chartAge.unit[d.key[pnl.date.stack_type + 1]] : d.key[pnl.date.stack_type + 1];
          break;

      }
      // console.log(pnl.date.stack_type,ret);
      return ret;
    })
    .keyAccessor(function (d) {
      // return +d.key[1];
      return d.key[0];
    })
    .valueAccessor(function (d) {
      //return +d.value - 500;application/views/covid19.php:5741
      return d.value;
    })
    .title(function (d) {
      return d.value;
    })
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .legend(dc.legend().x(45).y(0)) //.itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70));
    .ordinalColors(mm.config.cDate.colors);

  const nTick = gg.dt === DT_COVID ? 7 : (gpDate.all().length < 3 ? 2 : 14);
  mm.composite2.xAxis().ticks(nTick).tickFormat(function (s) {
    // データのレンジで ミクロ/マクロ を切り替える
    const format = mm.opt.chartDate.format ?? (mm.data.length < 3000 ? 'M/Dddd' : 'YYYY/MM');
    return moment(s).format(format);
  });
  mm.composite2.yAxis().tickFormat(d3.format(".2s")).ticks(5); //.tickFormat(d3.format("d"));

  // mm.composite2.brushOn(true)
  // mm.composite.rangeChart(mm.composite2);

}

/**
 * CHART chartYear 年度 barChart
 */
const initChartYear = (height) => {
  const dimYear = mm.ndx.dimension(function (d) {
    return +(d[D_YMD].split('-')[0]); // year
  });
  const onFiltered = (chart, v) => {
    mm.showFilterUi('#panel_year', chart);
    mm.onChartFiltered(chart, v);
    mm.onChangeURL('year', chart);
    mm.chartScroll('#div_name');
    mm.chartScroll('#div_city');
  }
  mm.chartYear = createStackedBarChart(dimYear, '#chart_year', height, mm.config.cYear.barWidth, onFiltered, mm.opt.chartYear.isLegend);
}

/**
 * CHART chartSeason 季節 pieChart
 */
const initChartSeason = (chartSexW, chartSexH) => {
  const dimSeason = mm.ndx.dimension(function (d) {
    const month = +d[D_YMD].split('-')[1];
    return MONTH_2_SEASON[month];
  });
  const gpSeason = dimSeason.group().reduceSum(function (d) {
    return mm.group_reduce.base(d);
  });

  mm.chartSeason = new dc.PieChart('#chart_season', 'chartGroup');
  mm.chartSeason.dataIndex = D_YMD;
  mm.chartSeason
    .width(chartSexW)
    .height(chartSexH)
    .useViewBoxResizing(mm.config.panelResizable)
    .cx(parseInt(chartSexW / 2))
    .externalRadiusPadding(18)
    .innerRadius(15)
    .slicesCap(8) //分割数
    .minAngleForLabel(0.3)
    .dimension(dimSeason)
    .group(gpSeason)
    .addFilterHandler(mm.addFilterHandler)
    .on('filtered', function (chart, v) {
      mm.showFilterUi('#panel_season', chart);
      mm.onChartFiltered(chart, v);
      mm.onChangeURL('season', chart);
      mm.chartScroll('#div_name');
      mm.chartScroll('#div_city');
    })
    .ordering(function (t) {
      return -t.value; //昇順
    })
    .colorAccessor(function (d, i) {
      return SEASON_IDX[d.key];
    })
    .colors(d3.scaleLinear().domain([0, 1, 2, 3]).range(SEASON_COL))
    .renderLabel(true)
    .label(function (d) {
      return d.key + ' : ' + mm.d3fmt(d.value);
    })
    .title(function (d) {
      return d.key + ' : ' + php_number_format(d.value);
    });
}

/**
 * CHART chartWeek 曜日 barChart
 */
const initChartWeek = (chartSexW, chartSexH) => {
  const dimWeek = mm.ndx.dimension(function (d) {
    return new Date(d[D_YMD]).getDay(); //0~6 日~
  });
  const gpWeek = dimWeek.group().reduce(mm.group_reduce_light.append, mm.group_reduce_light.remove, mm.group_reduce_light.init).order(function (d) {
    return d.total;
  });

  let chartWeekW = 350;
  if (isSp) {
    chartWeekW = window.innerWidth - $('#chart_sex').width() - 40;
    $('#chart_week').css('width', (chartWeekW + 5) + 'px');
  }

  mm.chartWeek = new dc.BarChart("#chart_week", "chartGroup");
  mm.chartWeek.dataIndex = D_YMD;
  mm.chartWeek
    .width(chartWeekW)
    .height(chartSexH)
    .useViewBoxResizing(mm.config.panelResizable)
    .margins({top: 0, right: 0, bottom: 20, left: 40})
    .gap(6)
    .transitionDuration(750)
    .dimension(dimWeek)
    .group(gpWeek, CND_LV_A, d => d.value.lv_a)
    .stack(gpWeek, CND_LV_B, d => d.value.lv_b)
    .stack(gpWeek, CND_LV_C, d => d.value.lv_c)
    .stack(gpWeek, CND_LV_D, d => d.value.lv_d)
    .stack(gpWeek, CND_LV_E, d => d.value.lv_e)
    .addFilterHandler(mm.addFilterHandler)
    .xUnits(dc.units.ordinal)
    .elasticX(true)
    .filterPrinter(function (filters) {
      return filters.map(function (f) {
        return WEEK_LABEL[f];
      }).join(', ');
    })
    .x(d3.scaleBand())
    .y(d3.scaleLinear())
    .elasticY(true)
    .yAxisPadding('25%')
    .on('renderlet', function (chart) {
      mm.chart.setFilterTextSel(chart);
    })
    .on('filtered', function (chart, v) {
      mm.showFilterUi('#panel_week', chart, v => mm.getLabelWeek(v));
      mm.onChartFiltered(chart, v);
      mm.onChangeURL('week', chart);
      mm.chartScroll('#div_name');
      mm.chartScroll('#div_city');
    })
    //.mouseZoomable(true)
    //.ordering(function(t){return -t.value.count;})//desc
    .renderHorizontalGridLines(true)
    .renderLabel(true)
    .label(function (d) {
      return mm.d3fmt(d.data.value.total);
    })
    .title(function (d) {//mouseホバーしたときの表示される文字
      let ret = '';
      if (gg.dt === DT_COVID) {
        ret = WEEK_LABEL[d.key] + '\n────────\n' +
          (d.value.lv_a === 0 ? '' : CND_LV_A + ': ' + d.value.lv_a + '名\n') +
          (d.value.lv_b === 0 ? '' : CND_LV_B + ': ' + d.value.lv_b + '名\n') +
          (d.value.lv_c === 0 ? '' : CND_LV_C + ': ' + d.value.lv_c + '名\n') +
          (d.value.lv_d === 0 ? '' : (CND_LV_D + ': ' + d.value.lv_d + '名\n')) +
          (d.value.lv_e === 0 ? '' : (CND_LV_E + ': ' + d.value.lv_e + '名\n')) +
          '────────\n計: ' + php_number_format(d.value.total) + '名';
      } else {
        ret = WEEK_LABEL[d.key] + ' : ' + php_number_format(d.value.total);
      }
      return ret;
    })
  //.legend(dc.legend())
  ;
  mm.chartWeek.xAxis().tickFormat((d) => WEEK_LABEL[d]);
  mm.chartWeek.yAxis().tickFormat(d3.format(".2s")).ticks(4);
  if (gg.dt === DT_COVID) {
    mm.chartWeek.ordinalColors(mm.config.cCond.colors)
  } else {
    mm.chartWeek
      .ordinalColors(COL_WEEK)
      .colorAccessor(function (d, i) {
        return d.key;
      });
  }

}

/**
 * CHART chartSex 性別 pieChart|barChart|rowChart*
 */
const initChartSex = (chartSexW, chartSexH) => {
  const panelDomId = '#panel_sex';
  const chartDomId = '#chart_sex';
  const dimSex = mm.util.getScaledDimensionSex();
  const onFiltered = (chart, v) => {
    mm.showFilterUi(panelDomId, chart);
    mm.onChartFiltered(chart, v);
    mm.onChangeURL('name3', chart);
    mm.chartScroll('#div_name');
    mm.chartScroll('#div_city');
  }

  // create bar chart
  if (pnl.sex.chartType === 'bar') {
    if (mm.opt.chartSex.unit === undefined) mm.opt.chartSex.unit = null;

    mm.chartSex = createStackedBarChart(dimSex, chartDomId, chartSexH, mm.config.cSex.barWidth,
      onFiltered, mm.opt.chartSex.isLegend,
      v => mm.getLabelSex(v)
    );
    mm.chartSex.dataIndex = D_SEX;

    if (isSp) $(panelDomId).css('width', '100%');
    $(chartDomId).css('width', '100%');

    if (mm.opt.chartSex.unit !== null) {
      mm.chartSex
        .filterPrinter(function (filters) {
          return filters.map(function (f) {
            return mm.getLabelSex(f);
          }).join(', ');
        })
        .xAxis().tickFormat(mm.getLabelSex);
    }
    return;
  }

  // create pie chart
  const gpSex = dimSex.group().reduceSum(function (d) {
    return mm.group_reduce.base(d);
  });

  mm.chartSex = new dc.PieChart(chartDomId, 'chartGroup');
  mm.chartSex.dataIndex = D_SEX;
  mm.chartSex
    .width(chartSexW)
    .height(chartSexH)
    .useViewBoxResizing(mm.config.panelResizable)
    .cx(parseInt(chartSexW / 2))
    .externalRadiusPadding(18)
    .innerRadius(15)
    .slicesCap(16) //分割数
    .minAngleForLabel(0.3)
    .dimension(dimSex)
    .group(gpSex)
    .addFilterHandler(mm.addFilterHandler)
    .on('filtered', onFiltered)
    .ordering(function (t) {
      return -t.value; //昇順
    })
    .renderLabel(true);

  if (mm.opt.chartSex.unit === null) {
    mm.chartSex
      .ordinalColors(colorbrewer.Set2[8])
      .label(function (d) {
        return mm.getLabelSex(d.key) + ':' + mm.d3fmt(d.value);
      })
      .title(function (d) {
        return mm.getLabelSex(d.key) + ':' + php_number_format(d.value);
      });
  } else {
    mm.chartSex
      .colors(function (d) {
        return COL_SEX[d];
      })
      .filterPrinter(function (filters) {
        return filters.map(function (f) {
          return mm.getLabelSex(f);
        }).join(', ');
      })
      .label(function (d) {
        if (d.key === 'empty') return '';
        if (d.key === 'Others') return 'その他'; // 表示できないので d.othersに集約されている場合
        return mm.getLabelSex(d.key) + ':' + mm.d3fmt(d.value);
      })
      .title(function (d) {
        if (d.key === 'empty') return '';
        if (d.key === 'Others') { // 表示できないので d.othersに集約されている場合
          let ret = '';
          for (let i = 0; i < d.others.length; i++) {
            ret += mm.getLabelSex(d.others[i]) + ',';
          }
          return ret + ': ' + php_number_format(d.value);
        }
        return mm.getLabelSex(d.key) + ': ' + php_number_format(d.value);
      })
  }
}

const initChartAgeReduce = (dimAge) => {
  let gpAge;
  if (gg.dt === DT_COVID) {
    gpAge = dimAge.group()
      .reduce(
        mm.group_reduce_light.append,
        mm.group_reduce_light.remove,
        mm.group_reduce_light.init
      );
  } else {
    gpAge = dimAge.group().reduceSum(function (d) {
      return mm.group_reduce.base(d);
    });
  }
  return gpAge;
}

/**
 * CHART chartAge 年齢 barChart
 */
const initChartAge = (chartSexW, chartSexH) => {
  const dimAge = mm.util.getScaledDimensionAge();
  if (mm.opt.chartAge.unit === null || mm.opt.chartAge.unit === undefined) {
    mm.ages = dimAge.group().all().map(v => v.key);
  } else {
    mm.ages = dimAge.group().all().map(v => mm.opt.chartAge.unit[v.key]);
  }

  // 幅調整
  const n = mm.ages.length;
  const barW = n > 16 ? parseInt(0.75 * mm.config.cAge.barWidth) : mm.config.cAge.barWidth
  const chartW = (n + 1) * barW;
  if (!isSp) $('#panel_age').width(chartW);

  mm.chartAge
    .width(chartW)
    .height(chartSexH)
    .useViewBoxResizing(mm.config.panelResizable)
    .transitionDuration(750)
    .dimension(dimAge)
    .on('renderlet', function (chart) {
      mm.chart.setFilterTextSel(chart);
    })
    .on('filtered', function (chart, v) {
      //自身のチャートのフィルタが選択されたらDateChartの表示スタックを自分に切り替える
      if (mm.chartAge.filters().length !== 0) {
        pnl.date.stack_type = STACK_AGE;
      }
      mm.showFilterUi('#panel_age', chart);
      mm.onChartFiltered(chart, v);
      mm.onChangeURL('name4', chart);
      mm.chartScroll('#div_name');
      mm.chartScroll('#div_city');
    })
    .addFilterHandler(mm.addFilterHandler)
    .renderLabel(true)
    .label(function (d) {
      return mm.d3fmt(gg.dt === DT_COVID ? d.data.value.total : d.data.value);
    })
    //.centerBar(true)
    .brushOn(false)
    .gap(6)
    .xUnits(dc.units.ordinal)
    .x(d3.scaleBand())
    .y(d3.scaleLinear())
    .elasticY(true)
    .yAxisPadding('20%')
    .renderHorizontalGridLines(true)
    .addFilterHandler(mm.addFilterHandler)
  ;

  mm.chart.adjustXAxisLabel(mm.chartAge, mm.util.arrStrMaxLen(mm.ages));

  if (gg.dt === DT_COVID) {
    mm.chartAge
      .title(function (d) {
        return mm.getLabelAge(d.key) + '\n────────\n' +
          (d.value.lv_a === 0 ? '' : CND_LV_A + ': ' + d.value.lv_a + '名\n') +
          (d.value.lv_b === 0 ? '' : CND_LV_B + ': ' + d.value.lv_b + '名\n') +
          (d.value.lv_c === 0 ? '' : CND_LV_C + ': ' + d.value.lv_c + '名\n') +
          (d.value.lv_d === 0 ? '' : (CND_LV_D + ': ' + d.value.lv_d + '名\n')) +
          (d.value.lv_e === 0 ? '' : (CND_LV_E + ': ' + d.value.lv_e + '名\n')) +
          '────────\n計: ' + php_number_format(d.value.total) + '名';
      });
  } else {
    if (mm.opt.chartAge.unit === null) {
      mm.chartAge
        .title(function (d) {
          return d.key + ' : ' + php_number_format(d.value);
        });
    } else {
      mm.chartAge
        .title(function (d) {
          return mm.getLabelAge(d.key) + ' : ' + php_number_format(d.value);
        });
    }
  }

  const gpAge = initChartAgeReduce(dimAge);

  //
  // スタック登録
  //
  if (gg.dt === DT_COVID) {
    mm.chartAge
      .group(gpAge, CND_LV_A, (d) => d.value.lv_a)
      .stack(gpAge, CND_LV_B, (d) => d.value.lv_b)
      .stack(gpAge, CND_LV_C, (d) => d.value.lv_c)
      .stack(gpAge, CND_LV_D, (d) => d.value.lv_d)
      .stack(gpAge, CND_LV_E, (d) => d.value.lv_e)
      .legend(dc.legend().x(85).y(10)) //左
      .elasticX(pnl.age.elasticX)
      .ordinalColors(mm.config.cCond.colors);
  } else {
    mm.chartAge
      .group(mm.groupRemoveEmpty(gpAge))
      .ordering(function (t) {
        return -t.value;
      })
      .elasticX(pnl.age.elasticX);
  }
  if (mm.opt.chartAge.unit !== null) {
    mm.chartAge
      .filterPrinter(function (filters) {
        return filters.map(function (f) {
          return mm.getLabelAge(f);
        }).join(', ');
      })
      .xAxis().tickFormat(mm.getLabelAge);
  }

  mm.chartAge.yAxis().tickFormat(d3.format(".2s")).ticks(5);
}

const initChartCondReduce = (dimCond) => {
  const gpCond = gg.dt === DT_COVID
    ? dimCond.group().reduceSum(function (d) {
      return (d[D_CND] === DN_CND || d[D_CND] === DN_CND2) ? 0 : mm.group_reduce.base(d);
    })
    : dimCond.group().reduceSum(function (d) {
      return d[D_CND] === DN_CND ? 0 : mm.group_reduce.base(d);
    })
  ;
  return gpCond;
}
/**
 * CHART chartCond 状態 barChart
 */
const initChartCond = (chartSexW, chartSexH, colCondTbl) => {
  const dimCond = mm.util.getScaledDimensionCond();
  mm.conds = dimCond.group().all().map(v => v.key);
  const gpCond = initChartCondReduce(dimCond);

  const n = mm.conds.length;
  const barW = n > 16 ? parseInt(0.75 * mm.config.cCond.barWidth) : mm.config.cCond.barWidth
  const chartW = (n + 1) * barW;
  if (!isSp) $('#panel_cond').width(chartW);

  mm.chartCond
    .width(chartW)
    .height(chartSexH)
    .useViewBoxResizing(mm.config.panelResizable)
    .gap(6)
    .transitionDuration(750)
    .dimension(dimCond)
    .group(mm.groupRemoveEmpty(gpCond))
    .addFilterHandler(mm.addFilterHandler)
    .xUnits(dc.units.ordinal)
    .elasticX(pnl.cond.elasticX)
    .x(d3.scaleBand())
    .y(d3.scaleLinear())
    .elasticY(true)
    .yAxisPadding('18%')
    .on('renderlet', function (chart) {
      mm.chart.setFilterTextSel(chart);
    })
    // .on('postRender', function(chart, filter){console.log('postRender');})
    // .on('preRedraw', function(chart){console.log('postRender')})
    .on('filtered', function (chart, v) {
      mm.showFilterUi('#panel_cond', chart);
      mm.onChartFiltered(chart, v);
      mm.onChangeURL('name5', chart);
      mm.chartScroll('#div_name');
      mm.chartScroll('#div_city');
    })
    // .on('zoomed', function(chart, filter){console.log('zoomed');})
    //.mouseZoomable(true)
    .ordering(function (t) {
      return -t.value;
    })
    .renderHorizontalGridLines(true)
    .renderLabel(true)
    .label(function (d) {
      return mm.d3fmt(d.data.value);
    })
    .title(function (d) {//mouseホバーしたときの表示される文字
      return d.key + ' : ' + php_number_format(d.value);
    })
  //.legend(dc.legend())
  ;

  mm.chart.adjustXAxisLabel(mm.chartCond, mm.util.arrStrMaxLen(mm.conds));

  if (gg.dt === DT_COVID) {
    mm.chartCond
      .colorAccessor(function (d) {
        let is1 = d.key.indexOf('無症状') !== -1;
        let is2 = d.key.indexOf('退院') !== -1;
        let is3 = d.key.indexOf('入院') !== -1;
        let is4 = d.key.indexOf('肺炎') !== -1;
        let is41 = d.key.indexOf('中等') !== -1;
        let is5 = d.key.indexOf('酸投') !== -1;
        let is6 = d.key.indexOf('重症') !== -1;
        let is7 = d.key.indexOf('死亡') !== -1;
        let lv;
        switch (1) {
          default:
            if (is7) {
              lv = 4;
              break;
            }
            if (is5 || is6) {
              lv = 3;
              break;
            }
            if (is4 || is3 || is41) {
              lv = 2;
              break;
            }
            if (is2 || is1) {
              lv = 0;
              break;
            }
            lv = 1;
            break;
        }
        return lv;
      })
      .colors(function (i) {
        return mm.config.cCond.colors[i];
      });
  }
  // mm.chartCond.xAxis().tickFormat(mm.getLabelCond);
  mm.chartCond.yAxis().tickFormat(d3.format(".2s")).ticks(4);

}

const initChartJobReduce = () => {
  // 職業
  mm.gpJob = mm.dimJob.group().reduceSum(function (d) {
    return d[D_JOB] === DN_JOB ? 0 : mm.group_reduce.base(d);
  });
  mm.gpJob = mm.groupRemoveEmpty(mm.gpJob);
  // 職業カテゴリ
  if (mm.is_job_cate) {
    mm.gpJobCat = mm.dimJobCat.group().reduceSum(function (d) {
      return d[D_JOBCAT] === DN_JOBCAT ? 0 : mm.group_reduce.base(d);
    });
    mm.gpJobCat = mm.groupRemoveEmpty(mm.gpJobCat);
  }
}
/**
 * CHART chartJob 職業|職業カテゴリ barChart
 */
const initChartJob = (chartSexW, chartSexH) => {
  const j = _.uniq(_.map(mm.data, D_JOBCAT));
  mm.is_job_cate = mm.opt.chartJobCat.isHidden ? false : !(j.length === 1 && j[0] == DN_JOBCAT);

  // 職業
  mm.dimJob = mm.ndx.dimension(function (d) {
    return d[D_JOB];
  });
  // 職業カテゴリ
  if (mm.is_job_cate) {
    mm.dimJobCat = mm.ndx.dimension(function (d) {
      return gg.dt === DT_COVID ? mm.opt.assets.jobcates[d[D_JOBCAT]] : d[D_JOBCAT];
    });
  }

  initChartJobReduce();

  // 幅調整
  const n = mm.is_job_cate ? mm.gpJobCat.all().length : mm.gpJob.all().length;
  const barW = n > 16 ? parseInt(0.75 * mm.config.cJob.barWidth) : mm.config.cJob.barWidth
  const chartW = (n + 1) * barW;
  if (!isSp) $('#panel_job').width(chartW);

  mm.chartJob = new dc.BarChart('#chart_job', 'chartGroup');
  mm.chartJob.dataIndex = D_JOB;
  mm.chartJob
    .width(chartW)
    .height(chartSexH)
    // .useViewBoxResizing(mm.config.panelResizable)
    .gap(4)
    .transitionDuration(mm.config.cJob.TD)
    .dimension(mm.is_job_cate ? mm.dimJobCat : mm.dimJob)
    .group(mm.is_job_cate ? mm.gpJobCat : mm.gpJob)
    .xUnits(dc.units.ordinal)
    .elasticX(pnl.job.elasticX)
    .x(d3.scaleBand())
    .y(d3.scaleLinear())
    .elasticY(true)
    .yAxisPadding('15%')
    .controlsUseVisibility(false)
    .on('renderlet', function (chart) {
      mm.chart.setFilterTextSel(chart);
      if (gg.dt === DT_COVID) {
        // ラベルの置換
        _.delay(() => {
          chart.selectAll('g.x g.tick text').each(function (d) {
            this.textContent = mm.config.cJob.keyLabel(d);
          });
        }, 100);
      }
    })
    .on('filtered', function (chart, v) {
      mm.chart.showDetailPanel(chart);
      mm.showFilterUi('#panel_job', chart);
      mm.onChartFiltered(chart, v);
      mm.onChangeURL('name6', chart);
      mm.chartScroll('#div_name');
      mm.chartScroll('#div_city');
    })
    //.mouseZoomable(true)
    .ordering(function (t) {
      return -t.value;
    })
    .renderHorizontalGridLines(true)
    .renderLabel(true)
    .colorAccessor(function (d, i) {
      return i;
    })
    .colors(function (d) {
      return colorbrewer.Set3[9][d % 9];
    })
    .title(function (d) {//mouseホバーしたときの表示される文字
      return mm.config.cJob.keyLabel(d.key) + ' : ' + php_number_format(d.value);
    })
    .label(function (d) {
      return mm.d3fmt(d.data.value);

    })
    // .filterPrinter(function (filters) {
    //     return filters.map(function(f) { return mm.config.cJob.keyLabel(f) })
    // })
    .addFilterHandler(mm.addFilterHandler)
  ;

  mm.chart.adjustXAxisLabel(mm.chartJob, mm.util.arrStrMaxLen(mm.jobs));

  mm.chartJob.xAxis().tickFormat((d) => {
    return d === DN_JOB ? DN_LABEL_DEF : d
  });
  mm.chartJob.yAxis().tickFormat(d3.format(".2s")).ticks(3);
}

/**
 * CHART chartEx 拡張チャート barChart|pieChart
 */
const initChartEx = (chartIndex, dataIndex, title, height) => {
  if (mm.opt.chartEx[chartIndex] === undefined) {
    mm.opt.chartEx[chartIndex] = {};
  }
  const dim = mm.util.getScaledDimension(dataIndex, mm.opt.chartEx[chartIndex].scale);
  const onFiltered = (chart, v) => {
    const valueFormat = v => mm.getLabelEx(v, chartIndex);
    mm.showFilterUi(`#panel_ex_${chartIndex}`, chart, valueFormat);
    mm.onChartFiltered(chart, v);
    mm.onChangeURL(`name${7 + chartIndex}`, chart);
    mm.chartScroll('#div_name');
    mm.chartScroll('#div_city');
  }

  mm.chartEx[chartIndex] =
    createStackedBarChart(dim, `#chart_ex_${chartIndex}`, height, mm.config.cEx.barWidth,
      onFiltered,
      mm.opt.chartEx[chartIndex].isLegend,
      v => mm.getLabelEx(v, chartIndex),
      `#panel_ex_${chartIndex}`
    );
  mm.chartEx[chartIndex].dataIndex = dataIndex;

  pnl.ex[chartIndex].isHidden = false;
  pnl.ex[chartIndex].is_show = true;
  pnl.ex[chartIndex].title = title;

  mm.chartEx[chartIndex]
    .xAxis().tickFormat(v => mm.getLabelEx(v, chartIndex));
}
const initAllChartEx = (height) => {
  for (let i = D_EX0; i < mm.data_hdr.length; i++) {
    let ii = i - D_EX0;
    initChartEx(ii, i, mm.data_hdr[i], height);
  }
  // 存在しない配列要素は削除
  for (let k = 0; k < pnl.ex.length; k++) {
    if (!pnl.ex[k].isHidden) continue;
    delete mm.opt.chartEx[k];
  }
}
const initDc = (data) => {
  mm.data_hdr = data.shift();
  mm.data = data;

  if (gg.dt === DT_COVID) {
    mm.domainDate = [moment('2020-03-30').subtract(1, 'days').toDate(), moment(mm.opt.assets.spk.max_ymd).add(3, 'days').toDate()];
    $('.tab-data').show();
    $('h4.hdr').html('<i class="fa fa-thermometer-half"></i>&nbsp;新型コロナウイルス 日本国内 感染状況');
  } else {
    // 左右のバーがみえなくなるのでデータの単位に合わせてPadding
    const ymds = _.uniq(_.map(mm.data, D_YMD));
    const minYmd = moment(_.min(ymds));
    const maxYmd = moment(_.max(ymds));
    const isBigRange = maxYmd.diff(minYmd, 'years') > 2; // minYmdからmaxYmdの範囲が2年以上の場合
    const padDays = isBigRange
      ? (mm.opt?.chartDate.format?.indexOf('DD') !== -1 ? 30 : 30 * 12)
      : 2;
    mm.domainDate = [minYmd.subtract(padDays, 'days').toDate(), maxYmd.add(padDays, 'days').toDate()];

    $('.tab-data').hide();
    if (mm.opt.title) {
      document.title = mm.opt.title;
      $('h4.hdr').html(mm.opt.title);
      $('#data_img_img').attr('title', mm.opt.title);
    }
    $('.container_tbl_pref').hide();
    $('#tbl_pref').hide();
  }

  // data computed cache
  const names = _.map(mm.data, D_PL1);
  mm.names = _.uniq(names);
  mm.namesCount = _.countBy(names);
  mm.citys = _.uniq(_.map(mm.data, D_PL2));
  // mm.conds = _.uniq(_.map(mm.data, D_CND)).map(mm.getLabelCond);
  // mm.ages = _.uniq(_.map(mm.data, D_AGE)).map(mm.getLabelAge);
  mm.jobs = _.uniq(_.map(mm.data, D_JOB));
  if (gg.dt !== DT_COVID) {
    mm.opt.assets.jobcates = mm.is_job_cate ? _.uniq(_.map(mm.data, D_JOBCAT)) : [];
  }

  mm.ndx = crossfilter(mm.data);

  // Sum/Countタイプの切り替え。(例: 売り上げ本数合計/タイトル数)
  mm.group_reduce.base = !pnl.city.orderUI ? d => (d[D_CNT] || 1) : d => 1

  let chartSexW = 148;
  let chartSexH = 158;

  mm.chartAge = new dc.BarChart("#chart_age", "chartGroup");
  mm.chartAge.dataIndex = D_AGE;
  initChartAge(chartSexW, chartSexH);

  mm.chartCond = new dc.BarChart('#chart_cond', 'chartGroup');
  mm.chartCond.dataIndex = D_CND;
  initChartCond(chartSexW, chartSexH);

  initChartName();

  initChartCity();


  mm.config.cDate.width = mm.opt.chartDate.width ?? 1180;
  if (isSp) mm.config.cDate.width = window.innerWidth + 800;

  initChartDate(mm.config.cDate.width);

  pnl.date.chart2.type = gg.dt === DT_COVID ? CHART_DATE2_TYPE_COVID : CHART_DATE2_TYPE_HIDE;
  if (pnl.date.chart2.type === CHART_DATE2_TYPE_COVID) {
    initChartDate2Covid(mm.config.cDate.width);
  }

  initChartYear(chartSexH);

  initChartSeason(chartSexW, chartSexH);

  initChartWeek(chartSexW, chartSexH);

  initChartSex(chartSexW, chartSexH);

  initChartJob(chartSexW, chartSexH);

  initAllChartEx(chartSexH);

  mm.dateStackShow(STACK_CND);

  //
  //data_typeによる UI制御
  //
  if (gg.dt === DT_COVID) {
    pnl.map.tabs.is_show = 1;
    mm.chartCity.addFilterHandler(mm.addFilterHandler);
    mm.chartCond.addFilterHandler(mm.addFilterHandler)
  } else {
    mm.sel_tab = 'tabs_c';
    if (pnl.date.chart2.type !== CHART_DATE2_TYPE_COVID) pnl.date.chart2.title = '';
    pnl.map.tabs.is_show = 0;
  }

  if (settingsLoad() === null) {
    // chart{xxx} 共通
    mm.dataOptionsChartKeys.forEach(keys => {
      const key = keys[0];
      const panelKey = keys[1];
      if (mm.opt[key].isShow !== undefined) {
        if (pnl[panelKey] !== undefined) {
          pnl[panelKey].is_show = mm.opt[key].isShow;
        }
      }
    });

    // chartGMap
    if (gg.dt === DT_COVID) pnl.gmap.is_show = false;

    // chartMap
    if (mm.opt.chartMap.isShow === undefined) {
      pnl.map.is_show = gg.dt === DT_COVID;
    }
  }
  //タイトル変更
  pnl.name.title = mm.data_hdr[D_PL1];
  pnl.city.title = mm.data_hdr[D_PL2];

  pnl.date.title = gg.dt === DT_COVID ? '感染者数' : mm.data_hdr[D_YMD];
  pnl.sex.title = gg.dt === DT_COVID ? '性別' : mm.data_hdr[D_SEX];
  pnl.age.title = gg.dt === DT_COVID ? '年齢' : mm.data_hdr[D_AGE];

  const INFO_PUBLIC = '※公開自治体のみ';
  pnl.cond.title = gg.dt === DT_COVID ? '状態' : mm.data_hdr[D_CND];
  pnl.cond.info = gg.dt === DT_COVID ? INFO_PUBLIC : '';

  pnl.job.title = gg.dt === DT_COVID ? '職業' : mm.data_hdr[D_JOB];
  pnl.job.info = gg.dt === DT_COVID ? INFO_PUBLIC : '';

  if (gg.dt !== DT_COVID) {
    let gap = -1;
    const n = mm.gpDate.all().length;
    // Gapはデータ数に応じて調整
    switch (1) {
      default:
        if (n < 10) {
          gap = -55;
          break;
        }
        if (n < 30) {
          gap = -40;
          break;
        }
        if (n < 40) {
          gap = -14;
          break;
        }
        if (n < 50) {
          gap = -30;
          break;
        }
        if (n < 100) {
          gap = -8;
          break;
        }
        if (n < 500) {
          gap = -4;
          break;
        }
        if (n < 1000) {
          gap = -2;
          break;
        }
        break;
    }
    // console.log(n,gap);
    if (gap !== -1) mm.chartDate.gap(gap);
  }
  pnl.date.stack_type = STACK_CND;

  if (!isSp && mm.opt.chartDate.width && localStorage.getItem(settingsName()) === null) {
    const w = mm.opt.chartDate.width + 20;
    $('#panel_date').css('width', w + 'px');
    pnl.date.style = 'width:' + w + 'px';
  }

  // make Autocomplete data
  if (mm.opt.isMakeAutocompleteData) {
    const ac0 = mm.makeAutocompleteData1Dim(mm.chartName.group(), pnl.name.title);
    const ac1 = mm.makeAutocompleteData2Dim(mm.ndx, D_PL1, D_PL2, 0);
    const ac2 = mm.makeAutocompleteData1Dim(mm.chartCond.group(), pnl.cond.title);
    const ac3 = mm.makeAutocompleteData1Dim(mm.is_job_cate ? mm.gpJobCat : mm.gpJob, pnl.job.title);
    mm.opt.assets.ac_data = ac0.concat(ac1).concat(ac2).concat(ac3);
  }

  mm.renderAllChart();
}

const initTabs = () => {
  const TAB_NO = {'c': 1, 'p': 2, 'pc': 3, 'd': 4, 'b': 5};

  mm.tab = $('#chart_map').tabs({
    active: mm.get['tab'] ? TAB_NO[mm.get['tab']] : 0,
    activate: function (event, ui, sel_tab/*<=user_opt*/) {
      mm.sel_tab = sel_tab ? sel_tab : ui.newPanel.attr('id');
      switch (mm.sel_tab) {
        case 'tabs_c':
          pnlShowsLoadStore(1); // パネルの表示状態を[感染]モードに復元

          mm.chartName.group(mm.gpName).render();
          pnl.name.title = '都道府県';
          pnl.date.chart2.is_show = false;
          pnl.date.chart2.title2 = '';
          $('#japan-map').show();
          drawJapanMap();
          let ft = mm.getFilterTxt();
          ft[1] = ''; // city
          $('#legend_n').show();
          $('#legend_p').hide();
          break;

        default:
          // case 'tabs_p':
          // case 'tabs_pc':
          // case 'tabs_d':

          // パネルの表示状態を[PCR・死亡]モードにする
          pnlShowsLoadStore(0);
          pnl.name.is_show = 1;
          pnl.city.is_show = 0;
          pnl.sex.is_show = 0;
          pnl.year.is_show = 0;
          pnl.week.is_show = 0;
          pnl.season.is_show = 0;
          pnl.age.is_show = 0;
          pnl.cond.is_show = 0;
          pnl.job.is_show = 0;

          if (mm.sel_tab === 'tabs_b') {//病床
            pnl.date.is_show = 0;
            pnl.date.chart2.is_show = false;

            let gpName2 = mm.dimName2.group().reduce((p, v) => mm.opt.assets.pref_tbl_last_m1[v[D3_PL1]].bed, (p, v) => mm.opt.assets.pref_tbl_last_m1[v[D3_PL1]].bed, (p, v) => 0);
            mm.chartName.group(gpName2).render();
          } else {
            pnl.date.is_show = 1;
            let gpName2;
            switch (mm.sel_tab) {
              case 'tabs_p':
                mm.chartDate2Mode = MD_PAT;
                gpName2 = mm.dimName2.group().reduce((p, v) => v[D3_CNT], (p, v) => v[D3_CNT], (p, v) => 0);
                pnl.name.title = '都道府県(患者)';
                pnl.date.chart2.title = '<i class="fa fa-procedures"></i>患者数(累計)';
                pnl.date.chart2.title2 = '※入院治療等を要する患者数。(感染者数から無症状、退院、死亡者数を引いた値)';
                break;
              case 'tabs_pc':
                mm.chartDate2Mode = MD_PCR;
                gpName2 = mm.dimName2.group().reduceSum(function (d) {
                  return d[D3_TYP] === MD_PCR ? d[D3_CNT] : 0;
                })
                pnl.name.title = '都道府県(PCR)';
                pnl.date.chart2.title = '<i class="fa fa-vials"></i>PCR検査人数';
                pnl.date.chart2.title2 = '';
                break;
              case 'tabs_d':
                mm.chartDate2Mode = MD_DEA;
                gpName2 = mm.dimName2.group().reduceSum(function (d) {
                  return d[D3_TYP] === MD_DEA ? d[D3_CNT] : 0;
                })
                pnl.name.title = '都道府県(死亡)';
                pnl.date.chart2.title = '死亡者数';
                pnl.date.chart2.title2 = '';
                break;
            }
            pnl.date.chart2.is_show = true;
            $('#div_date2').scrollLeft($('#div_date').scrollLeft());

            mm.chartName.group(gpName2);

            //市区町村フィルタのみの場合,都道府県フィルタないので表示より取得し設定
            let flt = mm.chartName.filters();
            let flta = mm.chartCity.filters();
            if (flt.length === 0 && flta.length) {
              let flt_from_city = [];
              $('#chart_name g.row text').each(function (index, el) {
                let ken_cnt = this.textContent.replace(/[　\s]+/, ',').split(','); //["福島県", "0"]
                if (ken_cnt[1] != 0) flt_from_city.push(ken_cnt[0]);
              });
              mm.chartName.filter([flt_from_city]);
            }

            mm.chartName.render();
            mm.composite2.render();
          }

          $('#japan-map').show();
          drawJapanMap();
          if (mm.sel_tab === 'tabs_pc') {
            $('#legend_n').hide();
            $('#legend_p').show();
          } else {
            $('#legend_n').show();
            $('#legend_p').hide();
          }
          break;
        case 'tabs_w':
          location.href = 'covid19-world.html';
          break;
      }
      if (!isSp) $('#input-search').focus().select();
    }
  });
}

const initAutoComplete = (options = {}) => {
  /**
   * class $.ui.autocomplete_ex extends $.ui.autocomplete
   */
  $.widget("ui.autocomplete_ex", $.ui.autocomplete, {
    //デフォルトオプション
    options: {
      itemMax: 16,
      minLength: 1,
      delay: 500,
      position: {my: "left top", at: "left bottom+12", collision: "none"},

      _usr: {
        AC_SPLIT_WD: /\s+/
      },
      ...options
    },

    _create: function () {
      this._super();
      this.widget().menu("option", "items", "> :not(.ac_ex-cate)");
    },
    _init: function () {
      //var o=$(this.element);
      var _this = this;
      //一覧取得
      _this.source = _this.options.source = function (request, response) {
        let itemMax = this.option('itemMax');

        let kw;
        if (_this.options.user_opt.multiple) {
          kw = request.term.split(_this.options._usr.AC_SPLIT_WD).pop();
        } else {
          kw = request.term;
        }

        ////$.post('/api/get_pref_auto_src', request, function (d){response(d);},'json');
        //全部表示されるのでここでfilter&slice roma考慮
        if (!kw.length) return;

        response(_.filter(_this.options.user_opt.data, (d) => {
          const isAlpha = kw[0].match(/[a-z]/i) ? 1 : 0;
          const chartTitle = d[0];
          let hira = ''
          // ひらがな入力でもAutocomplete候補になるようにする
          switch (chartTitle) {
            case '職業':
              hira = HIRAGANA.JOB[d[1]] || '';
              break;
            case '状態':
              hira = HIRAGANA.COND[d[1]] || '';
              break;
            default:
              hira = HIRAGANA.PREF[d[0] === '' ? d[1] : d[0]] || '';
              break;
          }
          return isAlpha
            ? (PREFECTURES_EN[d[0]] !== undefined && PREFECTURES_EN[d[0]].indexOf(kw) !== -1) || d[2].indexOf(kw) !== -1
            : (d[0] + hira).indexOf(kw) !== -1 || d[1].indexOf(kw) !== -1;
        }).slice(0, itemMax));

      }

      _this.options.focus = function (event, ui) {
        if (_this.options.user_opt.multiple) {
          let terms = this.value.trim().split(_this.options._usr.AC_SPLIT_WD)
          terms.pop();
          terms.push(ui.item[1]);
          terms.push("");
          this.value = terms.join(" ");
        } else {
          this.value = ui.item[1];
        }
        return false;
      }

      //選択
      _this.options.select = function (event, ui) {
        event.preventDefault();
        let ret = '';
        if (_this.options.user_opt.select) ret = _this.options.user_opt.select(event, ui);
        //$('.ui-menu').hide();
        return ret;
      };

    },
    _renderMenu: function (ul, items) {
      let that = this, currentType = "";
      $.each(items, function (index, item) {
        let li;
        if (item[0] != currentType) {
          let icon = '';
          switch (item[0]) {
            case '職業':
              icon = '<i class="fa fa-id-card-o" style="padding:4px"></i>';
              break;
            case '状態':
              icon = '<i class="fa fa-medkit" style="padding:4px"></i>';
              break;
            default:
              const src = that?.options?.imagePath
                ? that.options.imagePath + '/' + item[0] + '.jpg'
                : '/img/japan/' + PREFECTURES_EN[item[0]] + '.gif';
              icon = '<img width="40" height="40" src="' + src + '" onerror="this.src=\'' + IMG_NO + '\'" />';
              break;
          }
          ul.append("<li class='ac_ex-cate'>" + icon + item[0] + "</li>");
          currentType = item[0];
        }
        li = that._renderItemData(ul, item);
        //if (item[0]) {li.attr("aria-label", item[0] + " : " + item.label);}
      });
    },
    _renderItem: function (ul, row) {
      //var o = $(this.element);
      let v = this.element.val().trim();
      if (this.options.user_opt.multiple) v = _.last(v.split(this.options._usr.AC_SPLIT_WD));
      let is_cate_none = row[0] === '';
      let html = row[1];
      let bv = '<span class="ac_ex-kwd">' + v.toUpperCase() + '</span>';
      html = html.replace(new RegExp(v, 'gi'), bv);
      if (is_cate_none) {
        let src = '/img/japan/' + PREFECTURES_EN[row[1]] + '.gif';
        const icon = '<img width="40" height="40" src="' + src + '" onerror="this.src=\'' + IMG_NO + '\'" />';
        html = icon + html;
      }
      let is_pref = row[0] === row[1];
      return $("<li class='ac_ex-item'>")
        .append($('<div' + (is_pref ? ' class="ac_ex-bld"' : '') + '>')
          .html(html + (row[3] === 0 ? '' : '(' + mm.d3fmt(row[3]) + ')')))
        .appendTo(ul);
    }
  });
}

var map;

//vectorMap for pc
const drawJapanMap = () => {
  if (pnl.gmap.is_show) mm.updateGMap();
  if (!pnl.map.is_show) return;
  $("#japan-map").empty();

  let series_scale = mm.sel_tab === 'tabs_pc'
    ? {
      "0.4%以上": "#8c0a00",
      "0.2%以上": "#ea5432",
      "0.1%以上": "#ff781d",
      "0.05%以上": "#ff9d57",
      "0.01%以上": "#ffceab",
      "0%以上": "#ffffe0",
      "0%": "#dadada",
      "選択中": "#ffffff"
    } : Object.fromEntries(pnl.map.colors)

  let cntTbl;
  if (mm.map.isMapJapan) {
    cntTbl = mm.getPrefCntTbl();
  } else {
    // getWorldCntTbl();
    const dataIndex = mm.lastFilteredChart.dataIndex ?? D_JOBCAT;
    pnl.map.subTitle = '　' + mm.data_hdr[dataIndex];

    const keyIndex = mm.opt.chartMap.refData === 'city' ? D_PL2 : D_PL1;
    let sum = 0, min = Number.MAX_SAFE_INTEGER, max = -1;
    cntTbl = mm.data.reduce((acc, row) => {
      const v = parseInt(row[dataIndex]);
      acc[row[keyIndex]] = v;
      sum += v;
      if (v < min) min = v;
      if (v > max) max = v;
      return acc;
    }, {});
    // min-max を 0~highColorValue(def:1000) にする
    const highColorValue = pnl.map.colors[0][2];
    cntTbl = _.mapValues(cntTbl, v => {
      return parseInt(highColorValue * 1.2 * v / max);
    });
  }
  let colors = {};
  const names = mm.map.isMapJapan ? PREFECTURES : Object.keys(WORLD_CODE);
  names.forEach(function (pre) {
    let col, v = cntTbl[pre] ?? 0;
    while (1) {
      col = pnl.map.colors[pnl.map.colors.length - 2][1];
      for (const c of pnl.map.colors) {
        if (v > c[2]) {
          col = c[1];
          break;
        }
      }
      break;
    }
    if (mm.map.isMapJapan) {
      colors[_.capitalize(PREFECTURES_EN[pre])] = col;
    } else {
      colors[WORLD_CODE[pre]] = col;
    }
  });

  map = $('#japan-map').vectorMap({
    map: mm.map.isMapJapan ? 'jp_merc' : 'world_mill',
    panOnDrag: !isSp,
    focusOn: mm.map.isMapJapan ? {
        x: 0.45, y: 0.48,
        scale: !isSp ? 1.7 : 1,
        animate: false
      }
      : {
        x: 0.5,
        y: 0.5,
        scale: 1,
        animate: false
      },
    backgroundColor: null,
    zoomOnScroll: false,
    zoomOnScrollSpeed: 1, //def:3
    zoomStep: 1.4,
    regionsSelectable: true,
    //markersSelectable: true,
    hoverOpacity: 0.7,
    regionStyle: {
      selected: {
        //fill: '#0000FF',
        //'fill-opacity':0,
        //'fill-rule':'evenodd',
        stroke: '#1a75ff',
        'stroke-width': 2
      }
    },
    series: {
      //case linearColor
      // regions: [{
      //   values: sample_dataJ,
      //   scale: ["#c8eeff", "#0071a4"],//blue
      //   //normalizeFunction: "polynomial" //linear|polynomial
      // }],
      //case OriginalColor
      regions: [{
        //values: sample_dataJ,
        attribute: 'fill'
      }
        //legend
        , {
          scale: series_scale,
          attribute: 'fill',
          //values: {},
          legend: {
            //horizontal: true,
            vertical: true
            //title: 'Color'
          }
        }

      ]

    },

    onRegionTipShow:
      !isSp ? (e, el, code) => { //hover
        let name = map.mapData.paths[code].name;
        let html = gg.dt === DT_COVID
          ? mm.getChartNameCovid19Title(name, '<br />')
          : mm.getChartMapTooltip(name);
        el.html(html);
      } : false,

    onRegionSelected: (e, name, isSelected) => {
      if (mm.map.isSelectedRegions) return;
      //選択を取得
      let xs = map.getSelectedRegions();
      let prefs = xs.map(x => map.mapData.paths[x].name);
      let prefsSel = map.mapData.paths[name].name;
      //名前チャートフィルタ
      mm.filterPrefChart(prefs);
      mm.map.doDraw = 0;

      const target = mm.opt.chartMap.refData === 'city' ? '#div_city' : '#div_name';
      mm.chartScroll(target, isSelected ? prefsSel : prefs[0], 300);

      if (mm.chartName.filters().length && $('#ui-datepicker-div').is(':visible')) {
        mm.datePick.datepicker('hide');
        mm.datePick.datepicker('show');
      }
    }
    //onMarkerTipShow:(e, el, code) =>{},
    //onMarkerClick: (e, code) => {}
  })
    .vectorMap('get', 'mapObject');

  map.series.regions[0].setValues(colors);
  $('.jvectormap-legend-tick-sample:last').css({'border': '3px solid #1a75ff'});
  // d3.selectAll("path").call(mapTip);
  // d3.selectAll("path").on('mouseover', mapTip.show).on('mouseout', mapTip.hide);

  mm.mapSetSelectedRegions();
}

const setBgWindowZIndex = (id) => {
  switch (id) {
    case 'chart_gmap':
      _.delay(() => {
        $("#chart_gmap").css('z-index', '100');
      }, 10);
      break;
    case 'chart_sview':
      _.delay(() => {
        $("#chart_sview").css('z-index', '100');
      }, 10);
      break;
    case 'chart_tube':
      _.delay(() => {
        $("#chart_tube").css('z-index', '100');
      }, 10);
      break;
  }
}

const onDocumentReady = () => {

  if (isSp) {
    $('#toolbar_win_toggle').insertAfter('#panels');
  }
  $('#data_img').on('change', function (event) {
    event.preventDefault();
    let src = $(this).val();
    src = _.last(src.split('/'));
    const f = mm.url_data.filer_files[src];
    if (f) {
      if (0) {
        // データのみリロード
        // mm.reLoadDcData(f);
      } else {
        //新しいデータファイルでページリロード。
        location.href = location.pathname + '?data=' + f;
      }
    } else {
      ch_alert('このデータはありません', {'title': '新型コロナウイルス感染状況', 'dialog_class': 'alert'});
    }
  });

  if (gg.dt === DT_COVID) {
    initTabs();
  }
  if (gg.dt !== DT_COVID) $('.div_cnt').hide();
  $('.hdr_flt').hide();

  //
  //　検索（フィルタ）ボタン
  //
  $('#input-search')
    .on('keyup input-search-update', function (e) {
      e.preventDefault();
      if (e.type === 'input-search-update' || e.keyCode === $.ui.keyCode.ENTER) {
        //TODO:multiple
        let t = this.value.trim();
        if (t !== '') {
          mm.renderAllChartFilterByKW(t);
          _.delay(() => $('.ui-menu').hide(), 200);
          mm.onChangeURL('q', t);
        }
      }
    });

  if (isSp) {
    $('#input-search')
      .attr({
        placeholder: 'フィルタ',
        title: '県名、職業、状態、日付。'
      })
      .on('focus', function (event) {
        event.preventDefault();
        $(this).css('width', '11em');
      })
      .on('blur', function (event) {
        event.preventDefault();
        $(this).css('width', '6em');
      });
  } else {
    $('#input-search').attr({
      // placeholder:'県名、職業、状態、日付',
      placeholder:
        `${pnl.name.isHidden ? '' : pnl.name.title + ' '}${pnl.cond.isHidden ? '' : pnl.cond.title + ' '}${pnl.job.isHidden ? '' : pnl.job.title + ' '}${pnl.date.isHidden ? '' : '日付'}`,
      title: pnl.name.title + 'や'
        + (pnl.city.isHidden ? '' : pnl.city.title + '、')
        + (pnl.job.isHidden ? '' : pnl.job.title + '、')
        + (pnl.cond.isHidden ? '' : pnl.cond.title + '、') + '日付等の入力でグラフのフィルタリングが行えます'
        + '\nスペース区切りの複数ワードの指定も可能'
        + '\nショートカットキー\n　フォーカス : Ctrl+Shift+F\n　全クリア : Ctrl+Shift+L'
    });
  }
  $('#input-search').on('focus', function (e) {
    _.delay(() => $(this).select(), 7);
  });
  if (!isSp) $('#input-search').focus(); //.select();

  //
  // クリアボタン
  //
  $('.btn_clear_all').on('click', function (e) {
    e.preventDefault();

    //DEBUG_LOG_LSET:
    // setPanelXYWH(null, 1);// absolute化
    // console.log(JSON.stringify(getPanelSettings()));

    $('#input-search').val('');
    $('.filter_txt').val('');
    // $('.btn_brush').trigger('my_update', 1);//off
    pnl.date.isBrushOn = false;

    mm.dimJob.filterAll();
    dc.filterAll('chartGroup');

    mm.map.doDraw = 1;
    mm.renderAllChart();

    document.querySelector('#div_name').scrollTop = 0;

    // name の chart-filterを閉じる
    const inputName = $(mm.keyboardInputName);
    if (inputName.is(':visible')) {
      $('.chart-filter-toggle.name').trigger('click');
    }

    // city の chart-filterを閉じる
    const inputCity = $(mm.keyboardInputCity);
    if (inputCity.is(':visible')) {
      $('.chart-filter-toggle.city').trigger('click');
    }

    document.querySelector('#div_city').scrollTop = 0;

    if ($('#ui-datepicker-div').is(':visible')) mm.datePick.datepicker('show');
    if (!isSp) $('#input-search').focus();
    chartDatePlayStop();
    pnl.date.play.from = null;

    mm.onChangeURL('clear_all');
  });

  //
  // カレンダー入力
  //
  mm.datePick = $("#btn_date").val('2020/01/01').datepicker({
    showOn: "button",
    buttonText: '<i class="ui-icon ui-icon-calendar-day ui-icon-big"></i>',
    //showAnim:'fadeIn',
    // showOptions: {effect: "show",duration:3000,easing:'easeOutQuart'},
    duration: mm.config.mouseLongClickDuration + 100,
    showOtherMonths: true,
    numberOfMonths: isSp ? [10, 1] : [3, 8],
    showCurrentAtPos: isSp ? 2 : 0,
    stepMonths: isSp ? 3 : (4 * 8),
    position: { //左
      of: $(window)
      , my: "center"
      , at: "center"
      , collision: 'fit fit'
    },
    onSelect: function (dateText, inst) {
      $('#input-search').val(dateText).trigger('input-search-update');
    },
    beforeShowDay: function (date) {
      let ret = [];
      let y = date.getFullYear();
      let m = php_printf02d(date.getMonth() + 1);
      let d = php_printf02d(date.getDate());
      let ymd = y + m + d;

      ret[0] = 1;//is_selectable

      //休日であれば休日のスタイルにする
      ret[1] = ($.datepicker.regional['ja'] && $.datepicker.regional["ja"].holidays[ymd] !== undefined) ? 'holiday' : '';
      let n = mm.dateCnt[ymd] || 0;
      switch (1) {
        default:
          if (n > 999) {
            ret[1] += ' c1000';
            break;
          }
          if (n > 499) {
            ret[1] += ' c500';
            break;
          }
          if (n > 99) {
            ret[1] += ' c100';
            break;
          }
          if (n > 49) {
            ret[1] += ' c50';
            break;
          }
          if (n > 9) {
            ret[1] += ' c10';
            break;
          }
          if (n > 0) {
            ret[1] += ' c1';
            break;
          }
          break;
      }
      if (n !== 0) {
        ret[2] = mm.dateCnt[ymd] + '件';
      } //tooltip
      return ret;
    },
    beforeShow: function (input, inst) {
      mm.dateCntCreate();
      //位置を調整
      var dpDiv = inst.dpDiv;
      setTimeout(function () {
        if (isSp) {
          dpDiv.position({my: 'left top', at: 'left bottom', collision: 'fit none', of: $('#input-search')});
          return;
        }

        dpDiv.css({'width': '', 'z-index': 99});
        // 前回の位置に表示
        const position = pnl.common.datepicker.position;
        if (position) {
          dpDiv.css({top: position.top + 'px', left: position.left + 'px'});
        }

        // ドラッグ＆リサイズ可能へ
        dpDiv
          .draggable({
            handle: ".ui-datepicker-header",
            cursor: "move",
            stop: function (event, ui) {
              // ドラッグ終了時の位置を保存
              pnl.common.datepicker.position = {
                top: ui.position.top,
                left: ui.position.left
              };
            }
          })
          .resizable();
      }, 5);
    }
  });
  $('.ui-datepicker-trigger').addClass('ui-button ui-corner-all ui-widget');
  mm.datePick.val(mm.data[0][D_YMD].slice(0, 4) + '/01/01')

  $('.btn_reset').on('click', function (event) {
    switch ($(this).attr('id')) {
      case 'btn_reset_name' :
        mm.chartName.filterAll();
        $('#panel_name .filter_txt').text('');
        if (mm.opt.chartMap.refData !== 'city') mm.map.doDraw = 1;
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'name');
        break;
      case 'btn_reset_city' :
        mm.chartCity.filterAll();
        $('#panel_city .filter_txt').text('');
        if (mm.opt.chartMap.refData === 'city') mm.map.doDraw = 1;
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'name2');
        break;
      case 'btn_reset_date' :
        if (pnl.date.isBrushOn) {
          pnl.date.isBrushOn = false;
        } else {
          mm.composite.brushOn(false).filterAll();
          mm.chartDate.brushOn(false).filterAll();
          mm.renderAllChart();
        }
        break;
      case 'btn_reset_sex'  :
        mm.chartSex.filterAll();
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'name3');
        break;
      case 'btn_reset_age'  :
        mm.chartAge.filterAll();
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'name4');
        break;
      case 'btn_reset_year' :
        mm.chartYear.filterAll();
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'year');
        break;
      case 'btn_reset_season' :
        mm.chartSeason.filterAll();
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'season');
        break;
      case 'btn_reset_week' :
        mm.chartWeek.filterAll();
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'week');
        break;
      case 'btn_reset_cond' :
        mm.chartCond.filterAll();
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'name5');
        break;
      case 'btn_reset_job'  :
        mm.chartJob.filterAll();
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'name6');
        break;
      case 'btn_reset_ex_0'  :
        mm.chartEx[0].filterAll();
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'name7');
        break;
      case 'btn_reset_ex_1'  :
        mm.chartEx[1].filterAll();
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'name8');
        break;
      case 'btn_reset_ex_2'  :
        mm.chartEx[2].filterAll();
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'name9');
        break;
      case 'btn_reset_ex_3'  :
        mm.chartEx[3].filterAll();
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'name10');
        break;
      case 'btn_reset_ex_4'  :
        mm.chartEx[4].filterAll();
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'name11');
        break;
      case 'btn_reset_ex_5'  :
        mm.chartEx[5].filterAll();
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'name12');
        break;
      case 'btn_reset_ex_6'  :
        mm.chartEx[6].filterAll();
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'name13');
        break;
      case 'btn_reset_ex_7'  :
        mm.chartEx[7].filterAll();
        dc.redrawAll('chartGroup');
        mm.onChangeURL('clear', 'name14');
        break;
    }
  });

  $('.btn_close,.btn_winsize').button();

  if (mm.config.panelDraggable) {
    const $parent = $('#panels');
    let originalSize, originalPosition;
    let newSize, newPosition;

    $('.drag').draggable({
      snap: true,
      snapTolerance: 4,
      cursor: "move",
      handle: ".chart-title-wrap",
      containment: '#panels',
      // helper: 'clone',
      start: function (event) {
        const $this = $(event.target);
        originalSize = {
          width: $this.width(),
          height: $this.height()
        };
        originalPosition = $this.position();
        newSize = null;
        newPosition = null;
      },
      drag: function (event, ui) {
        if (ui.helper.css('position') !== 'absolute') return;

        const parentWidth = $parent.width();
        const parentHeight = $parent.height();
        const mouseX = event.pageX - $parent.offset().left;
        const mouseY = event.pageY - $parent.offset().top;

        // 初期サイズにリセット
        ui.helper.css(originalSize);

        // 位置を取得
        let left, top, right, bottom;
        left = mouseX <= mm.config.panelDragSnapThreshold;
        top = mouseY <= mm.config.panelDragSnapThreshold;
        right = mouseX >= parentWidth - mm.config.panelDragSnapThreshold;
        bottom = mouseY >= parentHeight - mm.config.panelDragSnapThreshold;

        // Snapping logic
        switch (true) {
          case left && top:
            newSize = {width: parentWidth * 0.2, height: parentHeight * 0.2};
            newPosition = {left: 0, top: 0};
            break;
          case right && top:
            newSize = {width: parentWidth * 0.2, height: parentHeight * 0.2};
            newPosition = {left: parentWidth * 0.8, top: 0};
            break;
          case left && bottom:
            newSize = {width: parentWidth * 0.2, height: parentHeight * 0.2};
            newPosition = {left: 0, top: parentHeight * 0.8};
            break;
          case right && bottom:
            newSize = {width: parentWidth * 0.2, height: parentHeight * 0.2};
            newPosition = {left: parentWidth * 0.8, top: parentHeight * 0.8};
            break;
          case left:
            newSize = {width: parentWidth * 0.1, height: parentHeight};
            newPosition = {left: 0, top: 0};
            break;
          case right:
            newSize = {width: parentWidth * 0.2, height: parentHeight};
            newPosition = {left: parentWidth * 0.8, top: 0};
            break;
          case top:
            newSize = {width: parentWidth, height: parentHeight * 0.2};
            newPosition = {left: 0, top: 0};
            break;
          case bottom:
            newSize = {width: parentWidth, height: parentHeight * 0.2};
            newPosition = {left: 0, top: parentHeight * 0.8};
            break;
          default:
            newSize = null;
            newPosition = null;
        }

        if (newSize && newPosition) {
          ui.helper.css({...newSize, ...newPosition});
        }
      },
      stop: function (e, ui) {
        const $this = $(e.target);
        if (newSize && newPosition) {
          $this.css({...newSize, ...newPosition});
        } else {
          $this.css({
            left: ui.position.left,
            top: ui.position.top
          });
        }

        const id = e.target.getAttribute('id')
        if (setPanelXYWH(id)) {
          settingsSave();
          setBgWindowZIndex(id);
        }
      }
    });

    mm.util.initPanelsWH();
  }

  if (mm.config.panelResizable) {
    const panelJobScrollbarHide = () => {
      const isHide = parseInt($('#chart_job svg').css('width'), 10) < parseInt($('#panel_job').css('width'), 10);
      _.delay(() => {
        $('#panel_job').css('overflow-x', isHide ? 'hidden' : 'auto');
      }, 10);
    }
    const options = {
      handles: 'n,e,w,s,ne,se,sw,nw',
      stop: function (e) {
        const id = e.target.getAttribute('id');
        if (setPanelXYWH(id)) {
          settingsSave();
          // スクロール不要なスクロールバーの場合hideする (スクロール可能なdivのresize対応)
          if (id === 'panel_job') panelJobScrollbarHide();
          setBgWindowZIndex(id);
        }
      }
    };
    $('#chart_gmap').resizable({
      ...options,
      minWidth: 80,
      minHeight: 40,
    });
    $('#chart_sview').resizable({
      ...options,
      minWidth: 80,
      minHeight: 40,

    });
    $('#chart_tube').resizable({
      ...options,
      minWidth: 80,
      minHeight: 40,
      // aspectRatio: true,

    });
    $('#chart_map').resizable({
      ...options,
      minWidth: 80,
      minHeight: 40,
    });
    $('#panel_name').resizable({
      ...options,
      // aspectRatio: true,
      minWidth: 80,
    });
    $('#panel_city').resizable({
      ...options,
      // aspectRatio: true,
      minWidth: 80,
    });
    $('#panel_date').resizable({
      ...options,
      aspectRatio: true,
      minWidth: 100,
    });
    $('#panel_year').resizable({
      ...options,
      aspectRatio: true,
      minWidth: 100,
    });
    $('#panel_season').resizable({
      ...options,
      aspectRatio: true,
      minWidth: 100,
    });
    $('#panel_week').resizable({
      ...options,
      aspectRatio: true,
      minWidth: 100,
    });
    $('#panel_sex').resizable({
      ...options,
      aspectRatio: true,
      minWidth: 100,
    });
    $('#panel_age').resizable({
      ...options,
      aspectRatio: true,
      minWidth: 200,
    });
    $('#panel_cond').resizable({
      ...options,
      aspectRatio: true,
      minWidth: 200,
    });
    $('#panel_job').resizable({
      ...options,
      // aspectRatio: true,
      minWidth: 200,
    });
    $('.panel_ex').resizable({
      ...options,
      aspectRatio: true,
      minWidth: 100,
    });

    panelJobScrollbarHide();

    drawJapanMap();
  }

  mm.keyboardInit();

  mm.chartFilterInit(mm.keyboardInputName, mm.names);
  mm.chartFilterInit(mm.keyboardInputCity, mm.citys);

  // chart-filter Toggleボタン
  $('.chart-filter-toggle').on('click', function (e, opt = {doFocus: 1, doKeyboardOpen: 1}) {
    const input = $($(this).data('toggle_target'));
    if (input.is(':visible')) {
      if (!isSp) input.getkeyboard()?.close();
      input.val('').trigger('change').hide();
    } else {
      if (!isSp && opt.doKeyboardOpen) input.getkeyboard()?.reveal();
      input.val(input.data('keyboard_Input_val')).show().trigger('change');
      if (opt.doFocus) input.focus();
    }
  });


  mm.keyboardSearch = $('#input-search').keyboard({
    ...mm.keyboardOptions,
    change: function (e, keyboard, el) {
      $('#input-search').autocomplete_ex('search', $(keyboard.preview).val());
    },
    position: {
      of: $('#btn_search_keyboard'),
      my: 'left top-80',
      at: 'left top',
      collision: 'flipfit flipfit'
    }
  });
  // キーボード表示ボタン
  $('#btn_search_keyboard').on('click', function () {
    const kb = mm.keyboardSearch.getkeyboard();
    kb.isOpen ? kb.close() : kb.reveal();
  });

  // GoogleMap 最大化
  watch(() => pnl.gmap.styleBak, v => {
    const isMaximize = v !== null;
    if (mm.config.panelDraggable) {
      $("#chart_gmap")
        .draggable({'disabled': isMaximize})
        .find('.chart-title-wrap').css('cursor', isMaximize ? 'auto' : 'move');
    }
    // if (mm.config.panelResizable) {
    // 	$("#chart_gmap").resizable({'disabled': isMaximize})
    // }
    if (isMaximize) {
      $("#chart_sview,#chart_tube").css('z-index', '100');
      $('.dc_panel:not(#chart_gmap,#chart_sview,#chart_tube)').css('z-index', '100').addClass('opacity-80');
      _.delay(() => $('#chart_gmap').css('z-index', '0'), 20); // ※setBgWindowZIndexのdelayより長く
    } else {
      if (pnl.sview.styleBak === null) $('.dc_panel').css('z-index', '99').removeClass('opacity-80');
    }
  }, {immediate: true});

  // StreetView 最大化
  watch(() => pnl.sview.styleBak, v => {
    const isMaximize = v !== null;
    if (mm.config.panelDraggable) {
      $("#chart_sview")
        .draggable({'disabled': isMaximize})
        .find('.chart-title-wrap').css('cursor', isMaximize ? 'auto' : 'move');
    }
    // if (mm.config.panelResizable) {
    // 	$("#chart_sview").resizable({'disabled': isMaximize});
    // }
    if (isMaximize) {
      $("#chart_gmap,#chart_tube").css('z-index', '100');
      $('.dc_panel:not(#chart_gmap,#chart_sview,#chart_tube)').css('z-index', '100').addClass('opacity-80');
      _.delay(() => $('#chart_sview').css('z-index', '0'), 20); // ※setBgWindowZIndexのdelayより長く
    } else {
      if (pnl.gmap.styleBak === null) $('.dc_panel').css('z-index', '99').removeClass('opacity-80');
    }
  }, {immediate: true});

  // YouTube 最大化
  watch(() => pnl.tube.styleBak, v => {
    const isMaximize = v !== null;
    if (mm.config.panelDraggable) {
      $("#chart_tube")
        .draggable({'disabled': isMaximize})
        .find('.chart-title-wrap').css('cursor', isMaximize ? 'auto' : 'move');
    }
    // if (mm.config.panelResizable) {
    // 	$("#chart_tube").resizable({'disabled': isMaximize});
    // }
    if (isMaximize) {
      $("#chart_gmap,#chart_sview").css('z-index', '100');
      $('.dc_panel:not(#chart_gmap,#chart_tube,#chart_tube)').css('z-index', '100').addClass('opacity-80');
      _.delay(() => $('#chart_tube').css('z-index', '0'), 20); // ※setBgWindowZIndexのdelayより長く
    } else {
      if (pnl.gmap.styleBak === null) $('.dc_panel').css('z-index', '99').removeClass('opacity-80');
    }
  }, {immediate: true});

  // chartSex ソートボタン
  if (pnl.sex.chartType === 'bar') {
    watch(() => pnl.sex.elasticX, v => {
      mm.chartSex
        .ordering(v ? t => -t.value.total : dc.pluck('key'))
        .elasticX(true)
        .render();
    });
  }

  // chartEx ソートボタン
  for (let k = 0; k < pnl.ex.length; k++) {
    if (pnl.ex[k].isHidden) continue;
    watch(() => pnl.ex[k].elasticX, v => {
      mm.chartEx[k]
        .ordering(v ? t => -t.value.total : dc.pluck('key'))
        .elasticX(true)
        .render();
    });
  }

  $('#div_date').scrollLeft(1000);

  $('#btn_download_csv').button().on('click', function (event) {
    event.preventDefault();

    let dt = mm.ndx.allFiltered();//order by pref
    //let dt=_.sortBy(mm.ndx.allFiltered(),d=>d[D_YMD]);//order by date
    let csv = mm.data_hdr.join(',') + '\n';
    let ni = mm.data_hdr.findIndex(d => d === '年齢')
    let si = mm.data_hdr.findIndex(d => d === '性別')

    for (var i = 0; i < dt.length; i++) {
      //          0    1   2   3         4       5     6        7:jobcates 8:cnt(optional)
      //["2020-03-27", 2, 60, "退院", "東京都", "都内", "会社員", 0, 10]
      for (var j = 0; j < dt[i].length; j++) {
        csv += (j === 0 ? '' : ',');
        switch (1) {
          default:
            if (j === ni) {
              csv += dt[i][j] === DN_AGE ? DN_LABEL_DEF : dt[i][1];
              break;
            }
            if (j === si) {
              csv += SEX_LABEL[dt[i][j]];
              break;
            }
            csv += dt[i][j];
            break;
        }
      }
      if (dt[i].length === 8) csv += ',1';
      csv += '\n';
    }

    let flt_name = $('.hdr_flt').text().replace('の状況', '');
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const filename = (gg.dt === DT_COVID ? "covid19" : "data") + " - [" + flt_name + "].csv";
    const blob = new Blob([bom, csv], {type: "text/csv"});

    //IE10/11用
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, filename);
      //その他ブラウザ
    } else {
      const url = (window.URL || window.webkitURL).createObjectURL(blob);
      const download = document.createElement("a");
      download.href = url;
      download.download = filename;
      download.click();
      (window.URL || window.webkitURL).revokeObjectURL(url);//開放
    }
  });

  //スクロール同期
  if (isSp) {
    let wL = '#div_date';
    let wR = '#div_date2';
    $(wL).on('scroll', function (event) {//wL wR sync scroll
      let wl = $(wL);
      $(wR).scrollLeft(wl.scrollLeft());
    });
    $(wR).on('scroll', function (event) {//wL wR sync scroll
      let wr = $(wR);
      $(wL).scrollLeft(wr.scrollLeft());
    });
  }

  $('.filter_txt').on('focus', function (event) {
    event.preventDefault();
    $(this).select();
  });

  $('#btn_ana').on('click', function (event) {
    event.preventDefault();
    $('#ana_diff_ls').hide().fadeIn();
  });
  $('.wopen').button().on('click', function (event) {
    event.preventDefault();
    let o = $(this);
    let w2 = parseInt(screen.width / 2) - 20;
    const top = 50;//for parent title bar
    if (o.find('span').hasClass('ui-icon-arrow-2-e-w')) {
      let td = o.closest('td');
      let a = td.prev().find('a');
      let b = td.next().find('a');
      let wL = window.open(a.attr('href'), 1, 'top=' + top + ',left=0,height=' + (screen.height - top * 4) + ',width=' + w2);
      let wR = window.open(b.attr('href'), 2, 'top=' + top + ',left=' + (w2 + 20) + ',height=' + (screen.height - top * 4) + ',width=' + w2);
      $(wL).on('scroll', function (event) {//wL wR sync scroll
        let wl = $(wL);
        $(wR).scrollTop(wl.scrollTop()).scrollLeft(wl.scrollLeft());
      });
      $(wR).on('scroll', function (event) {//wL wR sync scroll
        let wr = $(wR);
        $(wL).scrollTop(wr.scrollTop()).scrollLeft(wr.scrollLeft());
      });
    } else if (o.find('span').hasClass('ui-icon-arrow-2-n-s')) {
      let idx = o.closest('td').index();
      let tr = o.closest('tr');
      let a = tr.prev().find('td').eq(idx).find('a');
      let b = tr.next().find('td').eq(idx).find('a');
      let wL = window.open(a.attr('href'), 1, 'top=' + top + ',left=0,height=' + (screen.height - top * 4) + ',width=' + w2);
      let wR = window.open(b.attr('href'), 2, 'top=' + top + ',left=' + (w2 + 20) + ',height=' + (screen.height - top * 4) + ',width=' + w2);
      $(wL).on('scroll', function (event) {//wL wR sync scroll
        let wl = $(wL);
        $(wR).scrollTop(wl.scrollTop()).scrollLeft(wl.scrollLeft());
      });
      $(wR).on('scroll', function (event) {//wL wR sync scroll
        let wr = $(wR);
        $(wL).scrollTop(wr.scrollTop()).scrollLeft(wr.scrollLeft());
      });
    } else {
      let idx = o.closest('td').index();
      window.open(o.attr('href'), (idx === 0 ? 1 : 2), 'left=' + (idx === 0 ? 0 : w2 + 20) + ',top=' + top + ',height=' + (screen.height - top * 4) + ',width=' + w2);
    }

  });


  //ShortCutKey
  $(document)
    .keyup(function (e) {
      switch (e.keyCode) {
        // case $.ui.keyCode.LEFT:
        // case $.ui.keyCode.RIGHT:
        //      break;
        case 76://Ctrl+Shift+L
          if (e.ctrlKey && e.shiftKey) {
            if (document.activeElement && document.activeElement.id === 'tbl_flt') {
              $(id).val('').trigger('change');
            } else {
              $('.btn_clear_all').trigger('click');
            }
          }
          break;
        case 70://Ctrl+Shift+F
          if (e.ctrlKey && e.shiftKey) {
            let id = document.activeElement && document.activeElement.id === 'tbl_flt' ? '#tbl_flt' : '#input-search'
            $(id).focus().select();
          }
          break;
      }
    });

  $('body')
    .tooltip({
      items: '[tt_title],.tt_filter,.tt_img',
      show: {effect: 'show', delay: 300},
      position: {collision: 'flipfit'},
      hide: 0,
      tooltipClass: 'emj',
      content: function () {
        let o = $(this);
        // 動画のサムネイル画像を全て表示する場合
        // if (o.is('.detail-tube-play.tt_img')) {
        // 	let imgHtml = `<div><div>「${pnl.tube.searchQuery.replaceAll('+', ' ')}」</div><div style="display: flex;flex-wrap: wrap;">`;
        // 	for (let j = 1; j <= pnl.tube.vids.length; j++) {
        // 		const id = pnl.tube.vids[j - 1];
        // 		imgHtml +=
        // 			`<div>動画${j}<br><img width="240" src="https://img.youtube.com/vi/${id}/hqdefault.jpg" style="margin: 5px;"></div>`;
        // 	}
        // 	imgHtml += '</div>';
        // 	return imgHtml;
        // }
        if (o.is('.tt_filter')) {
          return o.val();
        }
        if (o.is('.tt_img')) {
          return (o.attr('title') ? o.attr('title') + '<br>' : '') + '<img src="' + o.attr('src') + '"/>';
        }
        return o.attr('tt_title');
      }
    });

  $('#panel_detail')
    .tooltip({
      items: '.tt_text',
      show: {effect: 'show', delay: 20},
      position: {my: isSp ? 'left top+1200' : 'left+200 top', at: 'left top', collision: 'flipfit'},
      hide: 0,
      // track: true
      tooltipClass: 'tt_text-tooltip',
      content: function () {
        return this.textContent;
      }
    });

  if (isSp) {
    $('.jFiler-theme-dragdropbox')
      .tooltip({
        items: '.fs_popup_none',
        show: {effect: 'show', delay: 300},
        position: {collision: 'flipfit'},
        hide: 0,
        tooltipClass: 'emj',
        content: function () {
          const element = $(this);
          if (element.is("img")) {
            return '<img src="' + element.attr("src") + '">';
          } else {
            var im = element.find('img');
            if (im) {
              return '<img src="' + im.attr("src") + '">';
            }
          }
        }
      });
  }

  $(document)
    .tooltip({
      items: '.tt_image',
      show: {effect: 'show', delay: 20},
      position: {my: isSp ? 'left top+1200' : 'left+240 top', at: 'left top', collision: 'flipfit'},
      hide: 0,
      tooltipClass: 'emj',
      content: function () {
        const type = parseInt(this.getAttribute('type') ?? D_PL1);
        if (type === -1) return;
        const src = this.getAttribute('href');
        const name = this.getAttribute('name');
        let ret = `<b>${name}</b><br /><img width="240" src="${src}" />`;
        const ttFmt = this.getAttribute('tt-fmt');

        if (ttFmt === 'img') return ret;

        // 1件目のデータを取得。制約:dimensionのgroupデータが1件のデータである事)
        const d = mm.data.find(d2 => d2[type] === name);
        if (d !== undefined) {
          const n = this?.__data__?.value ?? d[D_CNT];
          const chartDetails = mm.util.getChartDetailsHtml(d, mm.opt.detailType);
          const exChartDetails = mm.util.getExChartDetailsHtml(d);

          ret +=
            '<table><tbody>' +
            chartDetails +
            exChartDetails +
            (n > 1 ? `<tr><td>計</td><td>: ${php_number_format(n)}</td></tr>` : '') +
            '</tbody></table>' +
            '</div>';
        }
        return '<div>' + ret + '</div>';
      }
    });

  if (gg.dt !== DT_COVID) mm.tube.setPlayEvent();

  if (mm.is_trigger_search) {
    $('#input-search').trigger('input-search-update');
    if (!pnl.tube.vidAutoChange) {
      // 1番目の再生ボタンを押す。btn_searchのdetail取得はリクエストがあるので遅延実行
      _.delay(() => $('.detail:last .detail-tube-play:eq(0)').trigger('click'), 600);
    }
  }

  mm.watchMouseEvent();
}

const chartDatePlayStop = () => {
  pnl.date.play.label = '▶';
  clearTimeout(pnl.date.play.timer);
  pnl.date.play.timer = null;
}

// 再生ボタンの処理
const onClickChartDatePlay = () => {
  pnl.date.play.from = pnl.date.play.from ?? moment(mm.domainDate[0]);
  const END = moment(mm.domainDate[1])
  const diffDays = moment(mm.domainDate[1]).diff(mm.domainDate[0], 'days');
  let range, addDays;
  switch (true) {
    case diffDays < 30:
      range = 2;
      addDays = 1;
      break;
    case diffDays <= 90:
      range = 10;
      addDays = 2;
      break;
    case diffDays < 360:
      range = 30;
      addDays = 10;
      break;
    case diffDays < (360 * 2):
      range = 120;
      addDays = 60;
      break;
    case diffDays < (360 * 15):
      range = 360 * 2;
      addDays = 20;
      break;
    case diffDays < (360 * 20):
      range = 360 * 2;
      addDays = 40;
      break;
    default:
      range = 360 * 4;
      addDays = 360;
      break;
  }
  // console.log(diffDays, range, addDays);

  const play = () => {
    const to = moment(pnl.date.play.from).add(range, 'days')
    if (to.isAfter(END)) { // to が endを超えたらタイマー終了
      chartDatePlayStop();
      pnl.date.play.from = null;
      const url = url_remove_param(location.href, ['date']);
      window.history.replaceState({}, '', url);
      mm.composite.filterAll();
      mm.chartDate.filterAll()
      return;
    }

    const url = url_append_param(location.href, {'date': pnl.date.play.from.format('YYYY-MM-DD') + '+' + to.format('YYYY-MM-DD')});
    window.history.replaceState({}, '', url);
    mm.get = php_location_get_query();
    mm.parseURLParams();
    dc.redrawAll('chartGroup');

    pnl.date.play.from = moment(pnl.date.play.from).add(addDays, 'days'); // next
  }

  if (pnl.date.play.timer) {
    chartDatePlayStop();
  } else {
    pnl.date.play.label = '⏸';
    play();
    // 再生タイマー
    pnl.date.play.timer = setInterval(function () {
      play();
    }, 70);
  }
}

const onClickChartDateBrushBtn = () => {
  pnl.date.isBrushOn = !pnl.date.isBrushOn;
}
const getPanelMaximizeStyle = () => {
  // const pos = mm.util.relToAbsPos('#panels');
  // return `position: absolute;left:${pos.left}px;top:${pos.top}px;width:calc(100% - 20px);height:calc(100% - ${pos.top + 10}px);`;
  return `position:absolute;left:0;top:0;width:100%;height:100%;`;
}

const onClickPanelMaximize = (id, isSettingsSave = true) => {
  switch (id) {
    case 'chart_gmap':
      if (pnl.gmap.styleBak === null) {
        // maximize
        pnl.gmap.styleBak = pnl.gmap.style;
        pnl.gmap.style = getPanelMaximizeStyle() + 'z-index:0';

        if (pnl.sview.styleBak !== null) {
          pnl.sview.style = pnl.sview.styleBak;
          pnl.sview.styleBak = null;
        }
        if (pnl.tube.styleBak != null) {
          pnl.tube.style = pnl.tube.styleBak;
          pnl.tube.styleBak = null;
        }
      } else {
        // restore
        pnl.gmap.style = pnl.gmap.styleBak;
        pnl.gmap.styleBak = null;
      }
      break;
    case 'chart_sview':
      if (pnl.sview.styleBak === null) {
        // maximize
        pnl.sview.styleBak = pnl.sview.style;
        pnl.sview.style = getPanelMaximizeStyle() + 'z-index:0';

        if (pnl.gmap.styleBak !== null) {
          pnl.gmap.style = pnl.gmap.styleBak;
          pnl.gmap.styleBak = null;
        }
        if (pnl.tube.styleBak != null) {
          pnl.tube.style = pnl.tube.styleBak;
          pnl.tube.styleBak = null;
        }
      } else {
        // restore
        pnl.sview.style = pnl.sview.styleBak;
        pnl.sview.styleBak = null;
      }
      break;
    case 'chart_tube':
      if (pnl.tube.styleBak === null) {
        // maximize
        pnl.tube.styleBak = pnl.tube.style;
        pnl.tube.style = getPanelMaximizeStyle() + 'z-index:0';

        if (pnl.gmap.styleBak !== null) {
          pnl.gmap.style = pnl.gmap.styleBak;
          pnl.gmap.styleBak = null;
        }
        if (pnl.sview.styleBak != null) {
          pnl.sview.style = pnl.sview.styleBak;
          pnl.sview.styleBak = null;
        }
      } else {
        // restore
        pnl.tube.style = pnl.tube.styleBak;
        pnl.tube.styleBak = null;
      }
      break;
  }
  if (isSettingsSave === true) {
    settingsSave();
  }
}

const onClickStyleLoad = (type) => {
  const sDefMdAbs = '{"common":{"datepicker":{"position":{}}},"gmap":{"is_show":false,"style":"position:absolute;left:0.046321%;top:26.596859%;width:20.056882%;height:35.078534%"},"sview":{"is_show":false,"style":"position:absolute;left:0.138962%;top:62.303665%;width:19.223108%;height:32.879581%"},"tube":{"is_show":true,"style":"position:absolute;left:67.211399%;top:52.565445%;width:31.822351%;height:46.806283%","vidAutoChange":true},"map":{"is_show":false,"style":"position:absolute;left:76.707151%;top:0.000000%;width:20.612731%;height:29.424084%"},"name":{"is_show":true,"style":"position:absolute;left:0.046321%;top:0.000000%;width:9.403111%;height:100.000000%"},"city":{"is_show":true,"style":"position:absolute;left:9.681035%;top:0.000000%;width:10.792733%;height:100.000000%"},"date":{"is_show":true,"style":"position:absolute;left:20.751693%;top:0.000000%;width:55.492251%;"},"sex":{"is_show":true,"style":"position:absolute;left:20.705372%;top:53.089005%;width:18.481977%;"},"year":{"is_show":true,"style":"position:absolute;left:20.751693%;top:30.261780%;width:27.699805%;"},"season":{"is_show":true,"style":"position:absolute;left:91.020261%;top:0.000000%;width:6.901791%;"},"week":{"is_show":0,"style":"position:absolute;left:3.520376%;top:0.000000%;width:14.220468%;"},"age":{"is_show":true,"style":"position:absolute;left:41.040179%;top:53.403141%;width:25.708013%;"},"cond":{"is_show":true,"style":"position:absolute;left:49.007346%;top:29.738220%;width:34.462633%;"},"job":{"is_show":true,"style":"position:absolute;left:20.798014%;top:76.858639%;width:33.397256%;height:19.371728%"},"ex":[{"is_show":true,"style":"position:absolute;left:84.118470%;top:22.303665%;width:4.863678%;"},{"is_show":true,"style":"position:absolute;left:54.473194%;top:76.858639%;width:8.152451%;"},{"is_show":false,"style":"position:absolute;;left:50%;top:80%;"},{"is_show":false,"style":"position:absolute;left:75%;top:80%;"},{"is_show":false},{"is_show":false},{"is_show":false},{"is_show":false}],"detail":{"is_show":true,"style":"position:absolute;left:0.000000%;top:0.418848%;width:2.408679%;height:3.036649%"},"ana":{"is_show":false}}';
  const sDefSmAbs = '{"common":{"datepicker":{"position":{}}},"gmap":{"is_show":false,"style":"position:absolute;left:0.000000%;top:0.000000%;width:44.790668%;height:50.000000%"},"sview":{"is_show":false,"style":"position:absolute;left:NaN%;top:NaN%;width:44.790668%;height:50.000000%"},"tube":{"is_show":true,"style":"position:absolute;left:65.172033%;top:72.500000%;width:34.398589%;height:23.500000%"},"map":{"is_show":false,"style":"position:absolute;left:NaN%;top:NaN%;width:42.857258%;height:44.916667%"},"name":{"is_show":true,"style":"position:absolute;left:0.000000%;top:0.000000%;width:14.178341%;height:95.583333%"},"city":{"is_show":true,"style":"position:absolute;left:14.420017%;top:0.000000%;width:17.884044%;height:95.333333%"},"date":{"is_show":true,"style":"position:absolute;left:33.029090%;top:0.000000%;width:65.333151%;"},"sex":{"is_show":true,"style":"position:absolute;left:33.431884%;top:31.416667%;width:11.036550%;"},"year":{"is_show":true,"style":"position:absolute;left:33.029090%;top:17.250000%;width:34.076354%;"},"season":{"is_show":true,"style":"position:absolute;left:67.508237%;top:17.250000%;width:8.942022%;"},"week":{"is_show":true,"style":"position:absolute;left:76.611377%;top:17.000000%;width:22.959245%;"},"age":{"is_show":true,"style":"position:absolute;left:45.435138%;top:31.500000%;width:51.074251%;"},"cond":{"is_show":true,"style":"position:absolute;left:32.867972%;top:52.333333%;width:64.930357%;"},"job":{"is_show":true,"style":"position:absolute;left:33.029090%;top:73.583333%;width:64.285887%;height:18.000000%"},"detail":{"is_show":true,"style":"position:absolute;left:0.402794%;top:60.333333%;width:15.950634%;height:35.000000%"},"ana":{"is_show":false},"ex":[{"is_show":false,"style":"position:absolute;left:0%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:25%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:50%;top:80%;"},{"is_show":false,"style":"position:absolute;left:75%;top:80%;"}]}';
  const sDefMapMdAbs = '{"common":{"datepicker":{"position":{}}},"gmap":{"is_show":true,"style":"position:absolute;left:0.000000%;top:0.000000%;width:17.184996%;height:37.172775%"},"sview":{"is_show":true,"style":"position:absolute;left:0.000000%;top:38.010471%;width:17.046034%;height:30.157068%"},"tube":{"is_show":true,"style":"position:absolute;left:17.277637%;top:38.010471%;width:16.860751%;height:30.366492%","vidAutoChange":true},"map":{"is_show":true,"style":"position:absolute;left:17.323958%;top:0.000000%;width:16.536505%;height:37.172775%"},"name":{"is_show":true,"style":"position:absolute;left:34.231029%;top:0.000000%;width:7.596602%;height:80.418848%"},"city":{"is_show":true,"style":"position:absolute;left:42.059235%;top:0.000000%;width:8.384055%;height:80.628272%"},"date":{"is_show":true,"style":"position:absolute;left:50.952818%;top:0.000000%;width:48.127252%;"},"sex":{"is_show":true,"style":"position:absolute;left:50.813855%;top:46.910995%;width:13.294053%;"},"year":{"is_show":true,"style":"position:absolute;left:50.906497%;top:27.015707%;width:22.326598%;"},"season":{"is_show":true,"style":"position:absolute;left:90.973940%;top:26.806283%;width:7.318677%;"},"week":{"is_show":true,"style":"position:absolute;left:73.881586%;top:26.596859%;width:16.675468%;"},"age":{"is_show":true,"style":"position:absolute;left:64.941682%;top:47.539267%;width:19.454712%;"},"cond":{"is_show":true,"style":"position:absolute;left:50.674893%;top:64.816754%;width:22.789806%;"},"job":{"is_show":true,"style":"position:absolute;left:34.092067%;top:81.151832%;width:39.187349%;height:19.895288%"},"ex":[{"is_show":true,"style":"position:absolute;left:74.483755%;top:65.235602%;width:6.762829%;"},{"is_show":true,"style":"position:absolute;left:83.423659%;top:65.026178%;width:13.803582%;"},{"is_show":false,"style":"position:absolute;;left:50%;top:80%;"},{"is_show":false,"style":"position:absolute;left:75%;top:80%;"},{"is_show":false},{"is_show":false},{"is_show":false},{"is_show":false}],"detail":{"is_show":true,"style":"position:absolute;left:0.000000%;top:7.120419%;width:2.408679%;height:3.036649%"},"ana":{"is_show":false}}'
  const sDefMapSmAbs = '{"common":{"datepicker":{"position":{}}},"gmap":{"is_show":true,"style":"position:absolute;left:0.000000%;top:0.000000%;width:24.433076%;height:30.455408%"},"sview":{"is_show":true,"style":"position:absolute;left:0.000000%;top:31.593928%;width:24.602750%;height:18.026565%"},"tube":{"is_show":true,"style":"position:absolute;left:0.000000%;top:50.189753%;width:24.433076%;height:16.603416%"},"map":{"is_show":true,"style":"position:absolute;left:25.026936%;top:0.000000%;width:28.929441%;height:30.834915%"},"name":{"is_show":true,"style":"position:absolute;left:54.295725%;top:0.000000%;width:14.422302%;height:31.309298%"},"city":{"is_show":true,"style":"position:absolute;left:69.142212%;top:0.000000%;width:16.543229%;height:31.119545%"},"date":{"is_show":true,"style":"position:absolute;left:25.026936%;top:31.783681%;width:73.808251%;"},"sex":{"is_show":true,"style":"position:absolute;left:25.875306%;top:49.905123%;width:10.604634%;"},"year":{"is_show":false,"style":"position:absolute;left:16.967414%;top:36.242884%;width:26.723677%;"},"season":{"is_show":false,"style":"position:absolute;left:69.142212%;top:36.053131%;width:8.738218%;"},"week":{"is_show":false,"style":"position:absolute;left:78.134942%;top:36.337761%;width:19.512526%;"},"age":{"is_show":true,"style":"position:absolute;left:37.497985%;top:49.715370%;width:15.270673%;"},"cond":{"is_show":true,"style":"position:absolute;left:25.026936%;top:67.457306%;width:45.896855%;"},"job":{"is_show":true,"style":"position:absolute;left:25.026936%;top:82.163188%;width:73.808251%;height:14.990512%"},"detail":{"is_show":true,"style":"position:absolute;left:0.000000%;top:67.077799%;width:16.797740%;height:30.740038%"},"ana":{"is_show":false},"ex":[{"is_show":false,"style":"position:absolute;left:0%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:25%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:50%;top:80%;"},{"is_show":false,"style":"position:absolute;left:75%;top:80%;"}]}';
  const sDefCovidMdAbs = '{"common":{"datepicker":{"position":{}}},"gmap":{"is_show":true,"style":"position:absolute;left:0.000000%;top:56.205674%;width:20.805840%;height:42.287234%"},"sview":{"is_show":true,"style":"position:absolute;left:20.964361%;top:56.560284%;width:17.595796%;height:42.287234%"},"tube":{"is_show":0,"style":"position:absolute;left:NaN%;top:NaN%;width:NaN%;height:NaN%"},"map":{"is_show":true,"style":"position:absolute;left:0.000000%;top:0.088652%;width:20.805840%;height:55.230496%"},"name":{"is_show":true,"style":"position:absolute;left:21.083251%;top:0.354610%;width:8.203445%;height:54.787234%"},"city":{"is_show":true,"style":"position:absolute;left:29.564108%;top:0.000000%;width:8.996049%;height:55.673759%"},"date":{"is_show":true,"style":"position:absolute;left:38.956458%;top:0.709220%;width:60.911573%;"},"sex":{"is_show":true,"style":"position:absolute;left:38.916828%;top:31.205674%;width:7.727883%;"},"year":{"is_show":false,"style":"position:absolute;left:1.981509%;top:0.354610%;width:5.270813%;"},"season":{"is_show":true,"style":"position:absolute;left:63.408274%;top:6.028369%;width:4.914141%;"},"week":{"is_show":true,"style":"position:absolute;left:68.758347%;top:4.875887%;width:13.196847%;"},"age":{"is_show":true,"style":"position:absolute;left:47.199534%;top:31.205674%;width:32.694891%;"},"cond":{"is_show":true,"style":"position:absolute;left:39.114979%;top:52.925532%;width:43.593188%;"},"job":{"is_show":true,"style":"position:absolute;left:38.956458%;top:72.074468%;width:60.356751%;height:27.216312%"},"detail":{"is_show":true,"style":"position:absolute;left:75.693627%;top:69.060284%;width:7.846774%;height:29.609929%"},"ana":{"is_show":false},"ex":[{"is_show":false,"style":"position:absolute;left:0%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:25%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:50%;top:80%;"},{"is_show":false,"style":"position:absolute;left:75%;top:80%;"}]}';
  const sDefCovidSmAbs = '{"common":{"datepicker":{"position":{}}},"gmap":{"is_show":false,"style":"position:absolute;left:0.000000%;top:0.000000%;width:20.784159%;height:42.236025%"},"sview":{"is_show":0,"style":"position:absolute;left:0.000000%;top:0.000000%;width:17.481250%;height:40.905058%"},"tube":{"is_show":0,"style":"position:absolute;left:NaN%;top:NaN%;width:NaN%;height:NaN%"},"map":{"is_show":true,"style":"position:absolute;left:0.000000%;top:0.000000%;width:43.018375%;height:42.590949%"},"name":{"is_show":true,"style":"position:absolute;left:42.776699%;top:0.000000%;width:25.778802%;height:42.147294%"},"city":{"is_show":true,"style":"position:absolute;left:68.877736%;top:0.443656%;width:25.939919%;height:41.703638%"},"date":{"is_show":true,"style":"position:absolute;left:0.000000%;top:43.034605%;width:99.328946%;"},"sex":{"is_show":true,"style":"position:absolute;left:0.161118%;top:67.968057%;width:8.055876%;"},"year":{"is_show":0,"style":"position:absolute;left:0.080559%;top:0.266193%;width:8.458669%;"},"season":{"is_show":true,"style":"position:absolute;left:44.468433%;top:43.566992%;width:10.472638%;"},"week":{"is_show":true,"style":"position:absolute;left:55.504983%;top:43.478261%;width:24.570420%;"},"age":{"is_show":true,"style":"position:absolute;left:8.619787%;top:68.234250%;width:34.076354%;"},"cond":{"is_show":true,"style":"position:absolute;left:43.582287%;top:68.411713%;width:55.102189%;"},"job":{"is_show":true,"style":"position:absolute;left:0.000000%;top:81.543922%;width:98.684476%;height:14.729370%"},"detail":{"is_show":true,"style":"position:absolute;left:74.355731%;top:68.411713%;width:15.950634%;height:29.636202%"},"ana":{"is_show":false},"ex":[{"is_show":false,"style":"position:absolute;left:0%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:25%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:50%;top:80%;"},{"is_show":false,"style":"position:absolute;left:75%;top:80%;"}]}';

  const sGMapMdAbs = '{"common":{"datepicker":{"position":{}}},"gmap":{"is_show":true,"style":"position:absolute;left:0.000000%;top:0.000000%;width:99.947292%;height:100.000000%","styleBak":""},"sview":{"is_show":true,"style":"position:absolute;left:0.475562%;top:50.374688%;width:19.537674%;height:28.642798%"},"tube":{"is_show":false,"style":"position:absolute;left:76.525861%;top:75.353872%;width:21.003991%;height:23.980017%"},"map":{"is_show":true,"style":"position:absolute;left:79.062192%;top:6.744380%;width:20.132127%;height:33.888426%"},"name":{"is_show":true,"style":"position:absolute;left:0.475562%;top:6.994172%;width:9.075309%;height:42.381349%"},"city":{"is_show":true,"style":"position:absolute;left:9.828282%;top:6.994172%;width:10.303845%;height:42.381349%"},"date":{"is_show":false,"style":"position:absolute;left:24.214035%;top:0.000000%;width:36.023826%;"},"sex":{"is_show":false,"style":"position:absolute;left:73.593228%;top:27.560366%;width:5.072662%;"},"year":{"is_show":false,"style":"position:absolute;left:60.634162%;top:0.000000%;width:18.031728%;"},"season":{"is_show":false,"style":"position:absolute;left:62.417520%;top:14.404663%;width:4.953771%;"},"week":{"is_show":false,"style":"position:absolute;left:67.529812%;top:14.487927%;width:11.175708%;"},"age":{"is_show":false,"style":"position:absolute;left:76.763642%;top:43.213988%;width:20.964361%;"},"cond":{"is_show":false,"style":"position:absolute;left:76.724012%;top:60.116570%;width:20.647319%;"},"job":{"is_show":true,"style":"position:absolute;left:0.356672%;top:79.517069%;width:25.244419%;height:19.233972%"},"detail":{"is_show":false,"style":"position:absolute;left:0.079260%;top:0.416320%;width:2.060769%;height:2.414654%"},"ana":{"is_show":false},"ex":[{"is_show":false,"style":"position:absolute;left:0%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:25%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:50%;top:80%;"},{"is_show":false,"style":"position:absolute;left:75%;top:80%;"}]}';
  const sGMapSmAbs = '{"common":{"datepicker":{"position":{}}},"gmap":{"is_show":true,"style":"position:absolute;left:0.000000%;top:0.000000%;width:99.918781%;height:100.000000%","styleBak":""},"sview":{"is_show":true,"style":"position:absolute;left:1.038853%;top:43.373494%;width:30.976711%;height:25.903614%"},"tube":{"is_show":false},"map":{"is_show":0,"style":"position:absolute;left:6.327560%;top:2.108434%;width:23.610298%;height:23.594378%"},"name":{"is_show":true,"style":"position:absolute;left:0.755530%;top:8.534137%;width:14.260620%;height:33.835341%"},"city":{"is_show":true,"style":"position:absolute;left:15.393914%;top:8.232932%;width:17.093856%;height:34.136546%"},"date":{"is_show":0,"style":"position:absolute;left:2.644353%;top:5.120482%;width:63.086716%;"},"sex":{"is_show":0,"style":"position:absolute;left:5.949795%;top:6.726908%;width:10.010766%;"},"season":{"is_show":0,"style":"position:absolute;left:2.644353%;top:6.726908%;width:11.049619%;"},"week":{"is_show":0,"style":"position:absolute;left:3.777648%;top:6.726908%;width:23.799180%;"},"age":{"is_show":0,"style":"position:absolute;left:7.271972%;top:6.626506%;width:14.260620%;"},"cond":{"is_show":0,"style":"position:absolute;left:4.533177%;top:8.232932%;width:44.765125%;"},"job":{"is_show":true,"style":"position:absolute;left:1.038853%;top:69.979920%;width:38.248683%;height:20.883534%"},"detail":{"is_show":false,"style":"position:absolute;left:4.438736%;top:6.325301%;width:5.288707%;height:2.911647%"},"ana":{"is_show":false},"ex":[{"is_show":false,"style":"position:absolute;left:0%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:25%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:50%;top:80%;"},{"is_show":false,"style":"position:absolute;left:75%;top:80%;"}]}';

  const sSViewMdAbs = '{"common":{"datepicker":{"position":{}}},"gmap":{"is_show":true,"style":"position:absolute;left:0.435932%;top:46.960866%;width:18.784701%;height:31.640300%"},"sview":{"is_show":true,"style":"position:absolute;left:0.000000%;top:0.000000%;width:99.947292%;height:100.000000%","styleBak":""},"tube":{"is_show":false,"style":"position:absolute;left:77.397724%;top:71.940050%;width:19.577305%;height:26.311407%"},"map":{"is_show":true,"style":"position:absolute;left:79.181082%;top:6.661116%;width:20.092497%;height:31.140716%"},"name":{"is_show":true,"style":"position:absolute;left:0.317041%;top:8.076603%;width:9.669762%;height:38.134888%"},"city":{"is_show":true,"style":"position:absolute;left:10.303845%;top:8.159867%;width:8.718638%;height:38.467943%"},"date":{"is_show":false,"style":"position:absolute;left:24.134774%;top:0.416320%;width:36.657908%;"},"sex":{"is_show":false,"style":"position:absolute;left:74.425462%;top:26.228143%;width:4.161168%;"},"year":{"is_show":false,"style":"position:absolute;left:61.188984%;top:0.749376%;width:17.318385%;"},"season":{"is_show":false,"style":"position:absolute;left:63.685685%;top:13.905079%;width:4.359319%;"},"week":{"is_show":false,"style":"position:absolute;left:68.282785%;top:13.905079%;width:10.343475%;"},"age":{"is_show":false,"style":"position:absolute;left:77.358094%;top:39.883430%;width:20.528429%;"},"cond":{"is_show":false,"style":"position:absolute;left:77.358094%;top:57.368859%;width:20.488799%;"},"job":{"is_show":true,"style":"position:absolute;left:0.277411%;top:79.184013%;width:25.442570%;height:19.900083%"},"detail":{"is_show":false,"style":"position:absolute;left:0.079260%;top:0.416320%;width:2.060769%;height:2.414654%"},"ana":{"is_show":false},"ex":[{"is_show":false,"style":"position:absolute;left:0%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:25%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:50%;top:80%;"},{"is_show":false,"style":"position:absolute;left:75%;top:80%;"}]}';
  const sSViewSmAbs = '{"common":{"datepicker":{"position":{}}},"gmap":{"is_show":true,"style":"position:absolute;left:0.566647%;top:42.068273%;width:35.132123%;height:26.004016%"},"sview":{"is_show":true,"style":"position:absolute;left:0.000000%;top:0.000000%;width:99.918781%;height:100.000000%","styleBak":""},"tube":{"is_show":false},"map":{"is_show":0,"style":"position:absolute;left:6.516442%;top:1.405622%;width:24.082504%;height:25.200803%"},"name":{"is_show":true,"style":"position:absolute;left:0.472206%;top:9.538153%;width:16.243885%;height:31.927711%"},"city":{"is_show":true,"style":"position:absolute;left:16.999414%;top:10.040161%;width:18.227150%;height:31.927711%"},"date":{"is_show":0,"style":"position:absolute;left:3.399883%;top:4.618474%;width:56.759156%;"},"sex":{"is_show":0,"style":"position:absolute;left:4.249854%;top:7.128514%;width:8.688590%;"},"season":{"is_show":0,"style":"position:absolute;left:3.399883%;top:6.124498%;width:9.255237%;"},"week":{"is_show":0,"style":"position:absolute;left:4.438736%;top:6.024096%;width:16.621650%;"},"age":{"is_show":0,"style":"position:absolute;left:6.044236%;top:6.024096%;width:17.377179%;"},"cond":{"is_show":0,"style":"position:absolute;left:3.966530%;top:8.232932%;width:52.792626%;"},"job":{"is_show":true,"style":"position:absolute;left:0.566647%;top:68.674699%;width:40.515271%;height:21.987952%"},"detail":{"is_show":false,"style":"position:absolute;left:5.005383%;top:8.433735%;width:5.288707%;height:2.911647%"},"ana":{"is_show":false},"ex":[{"is_show":false,"style":"position:absolute;left:0%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:25%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:50%;top:80%;"},{"is_show":false,"style":"position:absolute;left:75%;top:80%;"}]}';

  const sTubeMdAbs = '{"common":{"datepicker":{"position":{}}},"gmap":{"is_show":false,"style":"position:absolute;left:0.000000%;top:63.316993%;width:16.089837%;height:34.885621%"},"sview":{"is_show":false,"style":"position:absolute;left:16.274777%;top:63.643791%;width:16.681647%;height:34.150327%"},"tube":{"is_show":true,"style":"position:absolute;left:34.805831%;top:0.000000%;width:64.322359%;height:100.408497%","vidAutoChange":true,"styleBak":"position:absolute;left:17.284825%;top:38.069063%;width:16.868323%;height:30.455250%"},"map":{"is_show":false,"style":"position:absolute;left:0.000000%;top:0.081699%;width:16.829599%;height:36.928105%"},"name":{"is_show":true,"style":"position:absolute;left:0.000000%;top:25.816993%;width:11.725237%;height:73.529412%"},"city":{"is_show":true,"style":"position:absolute;left:12.021142%;top:25.735294%;width:22.562760%;height:73.611111%"},"date":{"is_show":false,"style":"position:absolute;left:50.118917%;top:0.000000%;width:49.342166%;"},"sex":{"is_show":false,"style":"position:absolute;left:86.182344%;top:22.630719%;width:13.389703%;"},"year":{"is_show":true,"style":"position:absolute;left:0.000000%;top:0.000000%;width:34.583902%;"},"season":{"is_show":false,"style":"position:absolute;left:82.483531%;top:0.653595%;width:4.808457%;"},"week":{"is_show":false,"style":"position:absolute;left:69.870579%;top:0.408497%;width:12.206083%;"},"age":{"is_show":false,"style":"position:absolute;left:35.027760%;top:80.473856%;width:23.376498%;"},"cond":{"is_show":false,"style":"position:absolute;left:68.982863%;top:79.575163%;width:29.775445%;"},"job":{"is_show":false,"style":"position:absolute;left:34.768843%;top:78.022876%;width:34.029080%;height:21.977124%"},"detail":{"is_show":true,"style":"position:absolute;left:0.000000%;top:4.983660%;width:1.923383%;height:2.287582%"},"ana":{"is_show":false},"ex":[{"is_show":false,"style":"position:absolute;left:0%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:25%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:50%;top:80%;"},{"is_show":false,"style":"position:absolute;left:75%;top:80%;"}]}';
  const sTubeSmAbs = '{"common":{"datepicker":{"position":{}}},"gmap":{"is_show":false,"style":"position:absolute;left:0.000000%;top:0.000000%;width:15.488355%;height:37.673426%"},"sview":{"is_show":false,"style":"position:absolute;left:0.000000%;top:37.886873%;width:15.205032%;height:27.641409%"},"tube":{"is_show":true,"style":"z-index:0;position:absolute;left:33.148858%;top:27.961580%;width:65.919952%;height:68.943436%","vidAutoChange":true,"styleBak":"position:absolute;left:17.284825%;top:38.069063%;width:16.868323%;height:30.455250%"},"map":{"is_show":false,"style":"position:absolute;left:15.771679%;top:0.000000%;width:17.566062%;height:38.633938%"},"name":{"is_show":true,"style":"position:absolute;left:0.094441%;top:0.000000%;width:15.960561%;height:97.545358%"},"city":{"is_show":true,"style":"position:absolute;left:16.055003%;top:0.000000%;width:16.810532%;height:97.118463%"},"date":{"is_show":false,"style":"position:absolute;left:50.148273%;top:0.000000%;width:49.298302%;"},"sex":{"is_show":true,"style":"position:absolute;left:67.808775%;top:13.127001%;width:8.688590%;"},"year":{"is_show":true,"style":"position:absolute;left:33.054417%;top:0.000000%;width:33.998829%;"},"season":{"is_show":false,"style":"position:absolute;left:91.041309%;top:13.340448%;width:9.349678%;"},"week":{"is_show":true,"style":"position:absolute;left:77.536218%;top:13.127001%;width:20.210415%;"},"age":{"is_show":true,"style":"position:absolute;left:67.714334%;top:0.106724%;width:26.821298%;"},"cond":{"is_show":true,"style":"position:absolute;left:33.054417%;top:14.514408%;width:33.904388%;"},"job":{"is_show":false,"style":"position:absolute;left:34.187711%;top:78.121665%;width:65.069981%;height:20.277481%"},"detail":{"is_show":true,"style":"position:absolute;left:0.000000%;top:53.681964%;width:18.699356%;height:43.649947%"},"ana":{"is_show":false},"ex":[{"is_show":false,"style":"position:absolute;left:0%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:25%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:50%;top:80%;"},{"is_show":false,"style":"position:absolute;left:75%;top:80%;"}]}';
  const sTubeMapMdAbs = '{"common":{"datepicker":{"position":{}}},"gmap":{"is_show":true,"style":"position:absolute;left:0.046321%;top:69.278997%;width:14.915279%;height:30.825496%"},"sview":{"is_show":true,"style":"position:absolute;left:15.239525%;top:69.070010%;width:17.926128%;height:31.138976%"},"tube":{"is_show":true,"style":"z-index:0;position:absolute;left:33.489897%;top:0.000000%;width:66.238663%;height:100.313480%","vidAutoChange":true,"styleBak":"position:absolute;left:17.284825%;top:38.069063%;width:16.868323%;height:30.455250%"},"map":{"is_show":false,"style":"position:absolute;left:0.185283%;top:42.006270%;width:14.683676%;height:26.541275%"},"name":{"is_show":true,"style":"position:absolute;left:0.046321%;top:0.000000%;width:15.007921%;height:68.861024%"},"city":{"is_show":true,"style":"position:absolute;left:15.239525%;top:0.000000%;width:17.833486%;height:68.234065%"},"date":{"is_show":false,"style":"position:absolute;left:50.072724%;top:0.000000%;width:49.285271%;"},"sex":{"is_show":false,"style":"position:absolute;left:86.156583%;top:22.570533%;width:13.340374%;"},"year":{"is_show":false,"style":"position:absolute;left:50.072724%;top:22.570533%;width:17.277637%;"},"season":{"is_show":false,"style":"position:absolute;left:80.644414%;top:22.570533%;width:5.141603%;"},"week":{"is_show":false,"style":"position:absolute;left:67.767248%;top:22.570533%;width:12.506601%;"},"age":{"is_show":false,"style":"position:absolute;left:50.072724%;top:38.453501%;width:8.615658%;"},"cond":{"is_show":false,"style":"position:absolute;left:62.671966%;top:57.053292%;width:36.547067%;"},"job":{"is_show":false,"style":"position:absolute;left:34.184709%;top:78.160920%;width:65.034324%;height:20.167189%"},"detail":{"is_show":true,"style":"position:absolute;left:0.138962%;top:34.587252%;width:9.171507%;height:33.855799%"},"ana":{"is_show":false},"ex":[{"is_show":false,"style":"position:absolute;left:0%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:25%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:50%;top:80%;"},{"is_show":false,"style":"position:absolute;left:75%;top:80%;"}]}';
  const sTubeMapSmAbs = '{"common":{"datepicker":{"position":{}}},"gmap":{"is_show":true,"style":"position:absolute;left:33.148858%;top:54.331551%;width:32.015564%;height:29.411765%"},"sview":{"is_show":true,"style":"position:absolute;left:65.164422%;top:54.331551%;width:33.809947%;height:29.197861%"},"tube":{"is_show":true,"style":"z-index:0;position:absolute;left:32.959976%;top:0.000000%;width:66.864364%;height:53.903743%","vidAutoChange":true,"styleBak":"position:absolute;left:32.959976%;top:0.000000%;width:66.486599%;height:53.796791%"},"map":{"is_show":false,"style":"position:absolute;left:51.659332%;top:54.331551%;width:23.326974%;height:29.625668%"},"name":{"is_show":true,"style":"position:absolute;left:0.000000%;top:0.000000%;width:14.921708%;height:53.475936%"},"city":{"is_show":true,"style":"position:absolute;left:15.110591%;top:0.000000%;width:17.471620%;height:53.582888%"},"date":{"is_show":true,"style":"position:absolute;left:0.188882%;top:84.812834%;width:41.931889%;"},"sex":{"is_show":true,"style":"position:absolute;left:0.000000%;top:67.058824%;width:10.766296%;"},"year":{"is_show":true,"style":"position:absolute;left:0.000000%;top:54.010695%;width:24.082504%;"},"season":{"is_show":true,"style":"position:absolute;left:24.082504%;top:53.903743%;width:9.349678%;"},"week":{"is_show":false,"style":"position:absolute;left:0.283324%;top:67.058824%;width:23.988063%;"},"age":{"is_show":true,"style":"position:absolute;left:11.616267%;top:65.668449%;width:17.849385%;"},"cond":{"is_show":false,"style":"position:absolute;left:0.188882%;top:73.262032%;width:33.621064%;"},"job":{"is_show":true,"style":"position:absolute;left:42.404095%;top:84.385027%;width:55.248097%;height:21.604278%"},"detail":{"is_show":true,"style":"position:absolute;left:0.000000%;top:60.636364%;width:18.699356%;height:34.652406%"},"ana":{"is_show":false},"ex":[{"is_show":false,"style":"position:absolute;left:0%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:25%;top:80%;"},{"is_show":false,"style":"position:absolute;;left:50%;top:80%;"},{"is_show":false,"style":"position:absolute;left:75%;top:80%;"}]}';

  const isSm = window.innerWidth < 1400;

  if (type === 'random') {
    type = mm.util.randWeights({
      'gmap': 2,
      'tube': 2,
      'default': 2,
      '': 1,
    });
  }

  switch (type) {
    case 'default':
      if (gg.dt === DT_COVID || mm.get.data.indexOf('checkin') === 0) {
        settingsLoad(isSm ? sDefCovidSmAbs : sDefCovidMdAbs);
      } else if (pnl.gmap.is_show || pnl.sview.is_show || pnl.map.is_show) {
        settingsLoad(isSm ? sDefMapSmAbs : sDefMapMdAbs);
      } else {
        settingsLoad(isSm ? sDefSmAbs : sDefMdAbs);
      }
      pnl.gmap.styleBak = null;　// normalモードへ,
      pnl.sview.styleBak = null; // normalモードへ
      pnl.tube.styleBak = null; // normalモードへ
      settingsSave();
      break;
    case 'gmap':
      settingsLoad(isSm ? sGMapSmAbs : sGMapMdAbs);
      pnl.sview.styleBak = null; // normalモードへ
      pnl.tube.styleBak = null; // normalモードへ
      settingsSave();
      break;
    case 'sview':
      settingsLoad(isSm ? sSViewSmAbs : sSViewMdAbs);
      pnl.gmap.styleBak = null;　// normalモードへ,
      pnl.tube.styleBak = null;　// normalモードへ,
      settingsSave();
      break;
    case 'tube':
      if (isSp) {
        settingsLoad(isSm ? sTubeSmAbs : sTubeMdAbs);
      } else {
        if (pnl.gmap.is_show || pnl.sview.is_show || pnl.map.is_show) {
          settingsLoad(isSm ? sTubeMapSmAbs : sTubeMapMdAbs);
        } else {
          settingsLoad(isSm ? sTubeSmAbs : sTubeMdAbs);
        }
      }
      pnl.gmap.styleBak = null;　// normalモードへ,
      pnl.sview.styleBak = null;　// normalモードへ,
      settingsSave();
      break;
  }
  //_.delay(() => mm.onChangeURL('layout', type), 10);
}
const onClickStyleReset = () => {
  const isSm = window.innerWidth < 1400;
  const isMap = pnl.gmap.is_show || pnl.sview.is_show || pnl.map.is_show;
  setPanelXYWH(null, 2);// absolute化
  _.forEach(pnl, (v, k) => {
    if (v.style) {
      if (k === 'name' || k === 'city') {
        if (isSm || isMap) {
          v.style = 'height:50%';
        } else {
          v.style = '';
        }
      } else {
        v.style = v.is_show ? '' : 'display:none';
      }
    }
    if (v?.styleBak !== null) v.styleBak = null;
  });
  _.forEach(pnl.ex, (v, k) => {
    if (v.style) v.style = '';
    if (v?.styleBak !== null) v.styleBak = null;
  });
  if (1) { // absoluteで保存の場合
    _.delay(() => {
      mm.util.initPanelsWH();
      const maxBottomInfo = setPanelXYWH(null, 2);// absolute化
      // panelsの高さを一番下のChildが収まるように修正
      const h = parseInt(maxBottomInfo.top) + parseInt(maxBottomInfo.height) + 20;
      $('#panels').css('height', h + 'px');
      settingsSave();
    }, 10);
  } else {
    settingsSave();
  }
  $('.dc_panel').removeClass('opacity-80');
}

const getJapanRegionData = (reg_str, type) => {
  reg_str = reg_str.replace('<br>', '');
  let n = null;
  switch (reg_str) {
    case '世界':
      n = '';
      break;
    case '日本':
      n = _.sumBy(_.values(mm.opt.assets.pref_tbl_last_m1), type);
      break;
    default:
      let p = mm.opt.assets.prefTable.japanRegions[reg_str];
      if (p) {
        n = 0;
        _.map(mm.opt.assets.pref_tbl_last_m1, (v, k) => {
          if (p.includes(k)) n += v[type];
        });
      }
      break;
  }
  return n;
}

const initPrefTableData = () => {
  let max = 0;
  for (var i = 0; i < mm.opt.assets.spk.bar_stacks.length; i++) {
    let last = _.last(mm.opt.assets.spk.line[0][i]);
    if (max < last) max = last;
  }
  const p_max = mm.opt.assets.pref_tbl_last_m1['東京都'].n + 100000;//_.max() ...

  let tbl = $('#tbl_pref');
  for (var i = 0; i < mm.opt.assets.spk.bar_stacks.length; i++) {
    let v = _.last(mm.opt.assets.spk.line[0][i]);//0:carriers
    let v_prev = mm.opt.assets.spk.line[0][i][mm.opt.assets.spk.line[0][i].length - 2];//0:carriers
    let new_patient = _.sum(_.last(mm.opt.assets.spk.bar_stacks[i]));
    let per = parseInt(100 * v / max)
    if (per === 0 && v !== 0) per = 1;

    let a = tbl.find('#spn' + i + ' td:eq(0)');
    let pref_name = a.text();
    let spn = tbl.find('#spn' + i);

    let pop = mm.opt.assets.pref_tbl_last_m1[pref_name].n;
    let p_per = parseInt(100 * pop / p_max);
    let c_per = _.round(100 * v / pop, 3);          //(感染者/人口)%
    let c_per2 = parseInt((c_per * 10) * p_per);   //10万人あたり%
    const tcolor = (isDark.value ? '#F0F0F0' : '#202020');
    spn.find('td:eq(1)')//人口/感染率
      .text(pop)
      .attr('title', '感染率(感染者数/人口): ' + c_per + '%')
      .css({'color': tcolor, 'vertical-align': 'top'})
      .css({'background': 'linear-gradient(to right, ' + COL_CND_C + ' , ' + COL_CND_C + ' ' + c_per2 + '%,#008080 ' + c_per2 + '%, #008080 ' + p_per + '%,#FFFFFF ' + p_per + '%, #FFFFFF) center center / 100% 30% no-repeat'})
    ;

    spn.find('td:eq(2)')//感染者
      .text(v)
      .css({'color': tcolor, 'vertical-align': 'top'})
      .css({'background': 'linear-gradient(to right, #1f77b4 ' + per + '%, #FFFFFF ' + per + '% ' + (100 - per) + '%) center center / 100% 30% no-repeat'});

    let ymd = moment(mm.opt.assets.spk.max_ymd).subtract(1, 'days').format('YYYY/MM/DD(ddd)');
    spn.find('td:eq(3)').text(new_patient);//新規
    tbl.find('thead th:eq(3)').attr('title', '感染者数 前日比(' + ymd + '時点)');

    let p = mm.opt.assets.pref_tbl_last_m1[pref_name];
    let deaths = p ? p.deaths : 0;
    let discharged = p ? p.discharged : 0;
    let patient = v - discharged - deaths;//累計 患者数 = 感染者数-退院者数-死亡者数

    let p_prev = mm.opt.assets.pref_tbl_last_m2[pref_name];
    let deaths_prev = p_prev ? p_prev.deaths : 0;
    let discharged_prev = p_prev ? p_prev.discharged : 0;
    let patient_prev = v_prev - discharged_prev - deaths_prev;//累計 患者数 = 感染者数-退院者数-死亡者数

    spn.find('td:eq(4)').text(deaths);
    spn.find('td:eq(5)').text(discharged);
    spn.find('td:eq(6)').text(patient);
    spn.find('td:eq(7)').text(patient - patient_prev);
    tbl.find('thead th:eq(7)').attr('title', '患者数 前日比(' + ymd + '時点)');
  }
}

const drawPrefSparkline = (mode, bar_stacks) => {
  let tbl = $('#tbl_pref');
  //tbl.find('canvas').remove();

  let barWidth = isSp ? 2 : 5;
  let barHeight = isSp ? 50 : 80;
  let td_idx = $('#tbl_pref tr:eq(3) td').length - 1;//DataTableカラム非表示考慮

  for (var i = 0; i < bar_stacks.length; i++) {
    let spn = tbl.find('#spn' + i);

    let v = _.last(mm.opt.assets.spk.line[0][i]);//0:carriers
    let a = tbl.find('#spn' + i + ' td:eq(0)');
    let pref_name = a.text();
    let o = spn.find('td:eq(' + td_idx + ')');

    //Stacked_Bar
    o.sparkline(bar_stacks[i], {
      type: 'bar', barColor: '#1f77b4'
      , barWidth: barWidth
      , height: barHeight
      , stackedBarColor: COL_CND
      //,chartRangeMax:100 // Stacked bar charts ignoring `chartRangeMax` option . https://github.com/gwatts/jquery.sparkline/issues/185
      , useropt: [pref_name, i]
      , tooltipFormatter(sparkline, options, f) {
        let pref_name = options.userOptions.useropt[0];
        let ii = options.userOptions.useropt[1];
        let ymd = moment(mm.opt.assets.spk.max_ymd).subtract(bar_stacks[0].length - (f[0].offset + 1), 'days').format('M/D(ddd)');
        return ymd + ' - ' + pref_name + '<br />─【新規】─────<br />' +
          (f[4].value == 0 ? '' : '<span class="square" style="background:' + f[4].color + '"></span>' + CND_LV_A + ': ' + f[4].value + '名<br />') +
          (f[3].value == 0 ? '' : '<span class="square" style="background:' + f[3].color + '"></span>' + CND_LV_B + ': ' + f[3].value + '名<br />') +
          (f[2].value == 0 ? '' : '<span class="square" style="background:' + f[2].color + '"></span>' + CND_LV_C + ': ' + f[2].value + '名<br />') +
          (f[1].value == 0 ? '' : '<span class="square" style="background:' + f[1].color + '"></span>' + CND_LV_D + ': ' + f[1].value + '名<br />') +
          (f[0].value == 0 ? '' : '<span class="square" style="background:' + f[0].color + '"></span>' + CND_LV_E + ': ' + f[0].value + '名<br />') +
          '計: ' + (f[4].value + f[3].value + f[2].value + f[1].value + f[0].value) + '名<br />'
          ;
      }
    });

    if (mode !== 1) {
      //Line:10万人中の新規感染者数
      o.sparkline(mm.opt.assets.spk.out_of_100k[i], {
        composite: true
        , lineColor: '#ffa07a', fillColor: false
        , maxSpotColor: ''
        // ,minSpotColor:'#FF0000'
        , spotRadius: isSp ? 1.5 : 2
        //,valueSpots:{':0.49': 'green', '0.5:': 'red'}
        , valueSpots: {'0.5:': 'red'}
        , chartRangeMax: 1
        , lineWidth: 1.5
        // ,normalRangeMin: 0
        // ,normalRangeMax: 0.5
        // ,normalRangeColor: 'rgba(0,0,0,0.1)'
        , tooltipFormatter(sparkline, options, f) {
          let style = f.y >= 0.5 ? 'font-weight:bold;color:#FF0000;' : '';
          return '<span class="ui-icon ui-icon-chart-line" style="background:#FFF;color:' + f.color + '"></span>10万人中 <span style="' + style + '">' + f.y + '</span>名<br />─【累計】─────<br />';
        }
      });
    }

    //0:Red_Line:感染累計
    o.sparkline(mm.opt.assets.spk.line[0][i], {
      composite: true
      , chartRangeMax: v + 5
      , lineColor: 'red'
      , fillColor: 'rgba(255,0,0,0.1)'
      , useropt: [i]
      , tooltipFormatter(sparkline, options, f) {
        let pref_no = options.userOptions.useropt[0];
        let carr = mm.opt.assets.spk.line[0][pref_no][f.x];// 感染累計
        let _1 = mm.opt.assets.spk.line[1][pref_no][f.x];   // 感染累計-死亡
        //let _2 =mm.opt.assets.spk.line[2][pref_no][f.x];  // 感染累計-(死亡＋退院)=患者数
        let death = carr - _1;
        //let population=mm.opt.assets.pref_tbl_last_m1[pref_name].n;
        //let per=_.round(100*death/population,3)+'%'; //死亡/人口
        return '感染者: ' + php_number_format(f.y) + '名<br />' +
          '<span class="ui-icon ui-icon-chart-line" style="background:#FFF;color:' + f.color + '"></span>死亡: ' + php_number_format(death) + '名<br />';

      }
    });

    //1:Green_Line:感染累計-死亡
    o.sparkline(mm.opt.assets.spk.line[1][i], {
      composite: true
      , chartRangeMax: v + 5
      , lineColor: COL_CND_A
      , fillColor: 'rgba(0,255,32,0.2)'
      , useropt: [i]
      , tooltipFormatter(sparkline, options, f) {
        let pref_no = options.userOptions.useropt[0];
        //let carr =mm.opt.assets.spk.line[0][pref_no][f.x];// 感染累計
        let _1 = mm.opt.assets.spk.line[1][pref_no][f.x];   // 感染累計-死亡
        let _2 = mm.opt.assets.spk.line[2][pref_no][f.x];  // 感染累計-(死亡＋退院)=患者数
        return '<span class="ui-icon ui-icon-chart-line" style="background:#FFF;color:' + f.color + '"></span>退院: ' + php_number_format(_1 - _2) + '名<br />';
      }
    });

    //2:Blue_Line:感染累計-(死亡＋退院)=患者数
    o.sparkline(mm.opt.assets.spk.line[2][i], {
      composite: true
      , chartRangeMax: v + 5
      , lineColor: 'blue', fillColor: 'rgba(0,0,255,0.18)'
      , useropt: [i]
      , tooltipFormatter(sparkline, options, f) {
        return '<span class="ui-icon ui-icon-chart-line" style="background:#FFF;color:' + f.color + '"></span>患者: ' + php_number_format(f.y) + '名';
      }
    });

    //Vertical_Line
    o.sparkline(mm.opt.assets.spk.vline[i].slice(mm.SPARK_SX), {
      composite: true
      ,
      type: 'bar',
      barColor: 'rgba(255,0,0,1)'
      ,
      barWidth: 1
      ,
      barSpacing: barWidth
      ,
      height: barHeight
      ,
      chartRangeMax: 1000
      ,
      colorMap: {
        1000: 'rgba(255,0,0,0.9)',
        999: 'rgba(0,0,255,0.9)',
        998: 'rgba(255,140,0,0.9)',
        997: 'rgba(255,140,0,0.9)'
      } //1000:start 999:end
      ,
      tooltipFormatter(sparkline, options, f) {
        return '<br />' + (f[0].value === 1000 ? '※緊急事態宣言 発令' : (f[0].value === 999 ? '※緊急事態宣言 解除' :
            (f[0].value === 998 ? mm.opt.assets.chartDateLineYmdMsg[5][1] : (f[0].value === 997 ? mm.opt.assets.chartDateLineYmdMsg[6][1] : ''))
        ));
      }
    });
  }
}

const initPrefTable = () => {
  initPrefTableData();

  for (var i = 0; i < mm.opt.assets.spk.bar_stacks.length; i++) {
    mm.opt.assets.spk.bar_stacks[i] = mm.opt.assets.spk.bar_stacks[i].slice(mm.SPARK_SX);
    mm.opt.assets.spk.out_of_100k[i] = mm.opt.assets.spk.out_of_100k[i].slice(mm.SPARK_SX);
    mm.opt.assets.spk.line[0][i] = mm.opt.assets.spk.line[0][i].slice(mm.SPARK_SX)
    mm.opt.assets.spk.line[1][i] = mm.opt.assets.spk.line[1][i].slice(mm.SPARK_SX);
    mm.opt.assets.spk.line[2][i] = mm.opt.assets.spk.line[2][i].slice(mm.SPARK_SX);
  }

  $('.container_tbl_pref').show();
  $('#tbl_pref').show();

  drawPrefSparkline('first', mm.opt.assets.spk.bar_stacks);

  mm.tbl_pref = $('#tbl_pref').DataTable({
    stateSave: false,
    order: [],
    searching: true,
    // search : {
    //   //search:'Fred'
    //   //"regex": true
    // },
    paging: false,
    scrollX: true, //IS_SP,
    fixedColumns: {
      leftColumns: 4, //IS_SP?1:4,
    },
    autoWidth: false,
    info: false,
    //order: [[ 0, 'asc' ], [ 1, 'desc' ],[ 2, 'desc' ]],
    //columDef:[
    //  { "targets": [ 1,2 ], "orderSequence": [ "desc","asc"]}
    // ]

    dom:
      '<"fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix ui-corner-tl ui-corner-tr"lfrB>' +
      't' +
      '<"fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix ui-corner-bl ui-corner-br"ip>',
    buttons: [
      //, 'csv'
      {
        text: '<label for="chk_tbl_detail"><input type="checkbox" id="chk_tbl_detail">詳細</label>',
        action: function (e, dt, node, config) {
          const isChecked = !$('#chk_tbl_detail').is(':checked');
          $("#chk_tbl_detail").prop('checked', isChecked);
          if (mm.tbl_pref) {
            mm.tbl_pref.column(1).visible(isChecked);
            mm.tbl_pref.column(4).visible(isChecked);
            mm.tbl_pref.column(5).visible(isChecked);
            mm.tbl_pref.column(6).visible(isChecked);
            mm.tbl_pref.column(7).visible(isChecked);
          }

        }
      },
      {
        text: '<i class="ui-icon ui-icon-arrowstop-1-s"></i><img title="テーブルのデータをCSV形式でダウンロードします。" width="20" src="/img/csv.png">'
        , extend: 'csvHtml5' //OPTION: https://datatables.net/reference/button/csvHtml5
        , filename: 'covid19'
        //,className: "btn btn-green"
        , charset: "utf-8"
        , bom: true
        //,init: function(api, node, config) {}
        , exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6, 7]
          , format: {
            header: function (data, ci, n) {
              if (n.textContent === '人口感染率') n.textContent = '人口';
              return n.textContent;
            }
            , body: function (data, ri, ci) {
              return mm.tbl_pref.data()[ri][ci];
            }
          }
        }
      }
    ],

    columns: [
      //都道府県
      {
        render: function (data, type, row, meta) { //, row
          let ret = data;
          if (type === 'display') {
            if (mm.opt.assets.prefTable.link[meta.row] && mm.opt.assets.prefTable.link[meta.row].length) {
              let href = mm.opt.assets.prefTable.link[meta.row][0];
              let title = mm.opt.assets.prefTable.link[meta.row][1];
              let icon = PREFECTURES_EN[data] ? '<img src="/img/japan/' + PREFECTURES_EN[data] + '.gif">' : '';
              if (data === '日本') icon = '<img src="/img/world/Japan.png">';
              if (data === '世界') icon = '<i class="fa fa-globe" style="font-size:1.8em;"></i>';
              ret = '<a target="_blank" href="' + href + '" title="' + title + '">' + icon + data + '</a>';
            } else {
              ret = data;
            }
          }
          return ret;
        },
        orderable: false
      },
      //人口/感染率
      {
        visible: 0,
        orderSequence: ["desc", "asc"],
        render: function (data, type, row, meta) {
          let ret = data;
          if (type === 'display') {
            let p = mm.opt.assets.pref_tbl_last_m1[row[0]];
            if (p) {
              let c_per = _.round(100 * p.carriers / p.n, 3);   //(感染者/人口)%
              ret = php_number_format(data) + '<br />' + c_per + '%';
            } else {
              let carriers = getJapanRegionData(row[0], 'carriers');
              if (carriers === '') {
                ret = '';
              } else {
                let n = getJapanRegionData(row[0], 'n');
                let c_per = _.round(100 * carriers / n, 3);   //(感染者/人口)%
                ret = php_number_format(n) + '<br />' + c_per + '%';
              }
            }
          } else {
            ret = data;
          }
          return ret;
        }
      },
      //感染者
      {
        orderSequence: ["desc", "asc"],
        render: function (data, type, row, meta) {
          let ret = data;
          if (type === 'display') {
            let n = getJapanRegionData(row[0], 'carriers');
            if (n === null) {
              ret = php_number_format(data);
            } else {
              ret = n === '' ? '' : php_number_format(n);
            }
          } else {
            ret = data;
          }
          return ret;
        }
      },
      //新規(▲)
      {
        render: function (data, type) { //, row
          return type === 'display' ? ((data === '0' || data === '') ? '' : '▲' + data) : data;
        }
        , orderSequence: ["desc", "asc"]
      },
      {visible: 0, orderSequence: ["desc", "asc"]},//死亡
      {visible: 0, orderSequence: ["desc", "asc"]},//退院
      {visible: 0, orderSequence: ["desc", "asc"]},//患者
      //前日比
      {
        visible: 0,
        render: function (data, type) { //, row
          return type === 'display' ? ((data === '0' || data === '') ? '' : (data > 0 ? '<span style="color:orange">▲' + Math.abs(data) + '</span>' : '<span style="color:green">▼' + Math.abs(data) + '</span>')) : (type === 'sort' && data === '' ? 10000 : data);
        }
        , orderSequence: ["asc", "desc"]
      },
      {orderable: false}
    ]
    , initComplete: function () {//(settings, json)
      let that = this.api();
      let dt = $(that.table().container());
      //let d=that.data();
      //
      let input = dt.find('[type=search]')
      mm.tbl_pref_isearch = input.clone();
      mm.tbl_pref_isearch
        .autocomplete_ex({
          user_opt: {
            data: mm.opt.assets.ac_data_tbl,
            multiple: 1,
            select: function (event, ui) {
              mm.tbl_pref_isearch.val(mm.tbl_pref_isearch.val() + ' ');
              mm.tbl_pref_isearch.trigger('keyup').focus();
            }
          }
        })
        //.attr('type','input')
        .attr({
          'id': 'tbl_flt',
          'class': 'text-theme-col dark:bg-slate-900 dark:hover:bg-slate-700',
          'placeholder': '都道府県'
        })
        //.before($('<i class="fa fa-filter" style="padding:4px"></i>'))
        .on('keyup input clear', function () {
          let wd = mm.tbl_pref_isearch.val().replace(/　/g, ' ').trim().split(' ')
          if (wd.length == 1) {
            mm.tbl_pref.columns(0).search(wd[0]).draw();
          } else if (wd.length > 1) {
            const reg_str = '(' + wd.join('|') + ')';
            mm.tbl_pref.columns(0).search(reg_str, true).draw();
          }
        })
      ;
      input.before(mm.tbl_pref_isearch).remove();
      //mm.tbl_pref_isearch.addClass('btn_clear').btn_clear();

      let flt_txt = [];
      that.rows(':visible').every((rowIdx/*, tableLoop, rowLoop*/) => {
        flt_txt.push(that.row(rowIdx).data()[0]);
      });
      if (flt_txt.length && flt_txt.length !== mm.opt.assets.prefTable.link.length) $('#tbl_flt').val(flt_txt.join(' '));

      that.on('draw.dt', function () {
        $('.dataTables_scrollBody').scrollLeft(3000);
      });

      if (isSp) {
        $('#JAPAN_REGIONS_H').html('北海道<BR>・東北');
        $('#JAPAN_REGIONS_K').html('九州<BR>・沖縄');
      }
    }
    , mark: {
      // https://github.com/julmot/datatables.mark.js/blob/master/README.md
      // "synonyms": {}
    }
  });

  if (!isSp) {
    $('#tbl_pref').sortable({
      axis: 'y'
      , placeholder: "ui-state-highlight"
      , items: 'tbody > tr'
      , cursor: 'move'
      , handle: '.uicm'
      , revert: 50
    });
  }

}

const onDocumentReadyPrefTable = () => {
  initPrefTable();

  const isChecked = !!(mm.tbl_pref && mm.tbl_pref.state()?.columns[4].visible);
  $("#chk_tbl_detail").prop('checked', isChecked);

  $("#chk_tbl_spkflt").checkboxradio().on('click', function () {
    let b = $(this).prop('checked');
    if (b) {
      drawPrefSparkline(1, mm.createFilteredBarStacksData());
    } else {
      drawPrefSparkline(2, mm.opt.assets.spk.bar_stacks);
    }
  });
}
</script>

<style>
body, .content-wrapper {
  font-family: "メイリオ", "ヒラギノ角ゴシックW3", "ＭＳ Ｐゴシック", "Osaka", sans-serif;
}

body {
  font-size: 14px;

  td, th {
    padding: 0;
  }
}

.tab-data {
  display: none;
  list-style: none;
  margin: 4px 0 10px;
  padding-left: 10px;
  line-height: 30px;
  overflow: hidden;
  position: relative;
}

.tab-data li {
  border: 1px solid #AAA;
  background: #D1D1D1;
  display: inline-block;
  position: relative;
  z-index: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 6px;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 #FFF;
  margin: 0 -5px;
  padding: 4px 18px;
}

.tab-data a, .tab-data a b {
  text-decoration: none;
}

.tab-data li:hover {
  background: #fff;
  background: linear-gradient(to bottom, #f5f5f5, #fff);
  text-decoration: underline;
}

.tab-data li.selected {
  background: #fffacd;
  color: #333;
  z-index: 2;
  border-bottom-color: #fffacd;
}

.tab-data:before {
  position: absolute;
  content: " ";
  width: 100%;
  bottom: 0;
  left: 0;
  border-bottom: 1px solid #AAA;
  z-index: 1;
}

.tab-data li:before,
.tab-data li:after {
  border: 1px solid #AAA;
  position: absolute;
  bottom: -1px;
  width: 5px;
  height: 5px;
  content: " ";
}

.tab-data li:before {
  left: -6px;
  border-bottom-right-radius: 6px;
  border-width: 0 1px 1px 0;
  box-shadow: 2px 2px 0 #D1D1D1;
}

.tab-data li:after {
  right: -6px;
  border-bottom-left-radius: 6px;
  border-width: 0 0 1px 1px;
  box-shadow: -2px 2px 0 #D1D1D1;
}

.tab-data li.selected:before {
  box-shadow: 2px 2px 0 #FFF;
}

.tab-data li.selected:after {
  box-shadow: -2px 2px 0 #FFF;
}

#loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  background-image: none;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  /*opacity: 1.0;*/
}

#loading i {
  position: absolute;
  top: 35%;
  left: 50%;
  font-size: 40px;
  height: 40px;
  width: 40px;
  color: #222;
}

#input-search:not(:placeholder-shown) {
  color: #1f2937;
  background: yellow;
}

.btn_close {
  float: right;
}

.btn_winsize {
  float: right;
}

i.fa {
  padding: 3px;
}

.ic_btn {
  font-size: 2em !important;
}

.wopen.diff {
  /*background: #FF8;*/
}

/*jquery-sparkline*/
.jqstooltip {
  font-size: 1em !important;
}

/*jquery-jvectormap*/
.jvectormap-container svg {
  background: #EEEEFF;
}

.jvectormap-zoomout, .jvectormap-zoomin {
  width: 2em;
  height: 2em;
  line-height: 2em;
}

.jvectormap-zoomout {
  top: 3.5em;
}

.jvectormap-legend {
  background: rgba(128, 128, 128, 0.2) !important;
  color: #444;
}

.jvectormap-legend-cnt-v {
  bottom: 0 !important;
  left: auto !important;
  right: 0 !important;
  top: auto !important;
}

/* 細いスクロールバーの幅 */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 12px;
}

/* 細いスクロールバーの幅 */
.scrollbar-thin-h::-webkit-scrollbar {
  width: 6px;
}

/* 細いスクロールバーの背景 */
.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* 細いスクロールバーのつまみ */
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #a8a8a8;
  border-radius: 6px;
}

/* 細いスクロールバーホバー時の幅 */
/*.scrollbar-thin:hover::-webkit-scrollbar {*/
/*	background: #888;*/
/*  width: 12px;*/
/*}*/

.scrollbar-thin:hover::-webkit-scrollbar-thumb {
  background: #888;
}

/* クロスヘアのスタイル */
.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 30px;
  width: 30px;
  margin-top: -15px; /* クロスヘアを中央に配置 */
  margin-left: -15px; /* クロスヘアを中央に配置 */
  z-index: 1000; /* クロスヘアが上に表示されるように */
  pointer-events: none; /* クロスヘアがマップの操作に影響を与えないように */
}

.crosshair::before, .crosshair::after {
  content: '';
  position: absolute;
  background-color: blue;
}

/* 垂直線 */
.crosshair::before {
  top: 0;
  left: 50%;
  width: 2px;
  height: 100%;
  transform: translateX(-50%);
}

/* 水平線 */
.crosshair::after {
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  transform: translateY(-50%);
}

.c1000 a {
  background: #8c0a00 !important;
}

.c500 a {
  background: #ea5432 !important;
}

.c100 a {
  background: #ff781d !important;
}

.c50 a {
  background: #ff9d57 !important;
}

.c10 a {
  background: #ffceab !important;
}

.c1 a {
  background: #f5deb3 !important;
}

.c0 a {
  background: #dadada !important;
}

.container_dc,
.container_tbl_pref {
  padding: 5px 10px 5px 10px;
}

#toolbar_main {
  display: inline-block;
}

#toolbar_win_toggle {
  padding: 8px 8px 0px 8px;
}

.ui-tabs .ui-tabs-panel {
  padding: 0px;
}

#chart_map .ui-widget-header.light {
  border: 0px solid #FFFFFF;
  background: #F0F0F0;
}

#chart_map .ui-widget-content {
  border: none;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

h4.hdr {
  color: #EEE;
  margin: 0 0 5px 0;
  background-color: #337ab7;
  /*background-color: #B0B0B0;*/
  padding: 5px 0 5px 15px;
  border-radius: 4px;

}

.hdr_flt {
  font-weight: bold;
}

#data_img_img {
  margin-right: 4px;
}

.hdr_pref {
  font-weight: bold;
}

.filter, .filter_txt {
  border: 1px solid #AAA;
  padding: 2px;
  padding-top: 1px;
  background-color: yellow;
  display: inline-block;
  white-space: nowrap;
  cursor: text;
}

.chart-title-wrap {
  cursor: move;
}

.chart-title {
  font-weight: bold;
}

.chart-sub-title {
  font-size: 0.8em;
}

.dc_panel {
  z-index: 99;
}

#chart_gmap {
  z-index: 100;
}

#chart_sview {
  z-index: 100;
}

#chart_tube {
  z-index: 100;
}

/* .dc-chart */

.dc-chart svg {
  -webkit-user-select: none; /* Safari向け */
  -ms-user-select: none; /* IE 10+向け */
  user-select: none; /* 標準構文 */
}

.dc-chart#chart_world g.row text {
  font-family: "Osaka－等幅", "ＭＳ ゴシック", sans-serif;
}

.dc-chart rect.selected + text {
  font-weight: bold;
  fill: darkorange;
  text-shadow: 1px 2px 2px #808080;
}

.dc-chart .pie-label {
  fill: #202020;
}

.dc-chart g.dc-legend g.sel text {
  fill: darkorange;
  text-shadow: 1px 2px 2px #808080;
}

.dc-chart g.dc-legend-item.fadeout {
  display: none;
}

.dc-chart#chart_date2 g.dc-legend-item {
  display: none;
}

.dc-chart g.x text {
  font-size: 12px;
}

.dc-chart g.axis.x text.sel {
  font-weight: bold;
  fill: darkorange;
  text-shadow: 1px 2px 2px #808080;
}

.ui-draggable-dragging {
  background-color: #ffffe0;
  border: 1px solid #CCC;
  box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.4);
}

#chart_date .filter,
#panel_date .filter_txt {
  width: fit-content;
}

.div_cnt_day {
  float: left;
  font-size: 1em;
  margin-left: 1em;
  margin-bottom: 0.8em;
}

.div_cnt_one {
  float: right;
  font-size: 1em;
}

.div_total {
  float: right;
  font-size: 0.8em;
}

.div_total_cnt {
  font-weight: bold;
  font-size: 1.8em !important;
}

#chart_age .filter {
  width: 8em;
}

#chart_cond .filter,
#panel_cond .filter_txt,
#chart_job .filter,
#panel_job .filter_txt {
  max-width: 16em;
}

.label-x-rot .axis.x .tick text {
  text-anchor: end;
  transform: rotate(-55deg) translate(-10px, -12px);
}

#chart_date_range g.y {
  display: none;
}

image.pl {
  border: 1px solid blue;
  cursor: pointer;
}

.btn_off {
  padding: 0 1px 1px 1px;
}

.btn_on {
  color: white !important;
  background: #0075FF !important;;
  box-shadow: 0 -1px #a2a2a2;
  padding: 0 1px 0 1px;
}

.btn_play {
  padding: 1px 10px;
}

/* jQueryUI ----------------------------------*/

table.ui-datepicker-calendar tbody td.ui-datepicker-week-end a.ui-state-default {
  color: #4040FF;
}

table.ui-datepicker-calendar tbody td:first-child a.ui-state-default {
  color: #FF4040;
  font-weight: bold;
}

table.ui-datepicker-calendar tbody td.holiday a.ui-state-default {
  color: red;
}

.ui-widget {
  font-size: 1em;
}

.ui-button {
  padding: .4em .5em !important;
}

.ui-button-min {
  padding: 0 7px 0 7px !important;
  margin-left: 1px !important;
}

.chart-filter {
  display: none;
  width: calc(100% - 4.5em);
}

.chart-filter-cnt {
  font-size: 0.8em;
  margin-left: 2px;
}

.ui-datepicker-header {
  cursor: move;
}

.ui-datepicker-header .ui-datepicker-prev,
.ui-datepicker-header .ui-datepicker-next {
  cursor: default;
}

.ui-datepicker table {
  /*width: 100%;*/
  font-size: .7em;
  /*border-collapse: collapse;*/
  margin: 0 0 0
}

.ui-tooltip {
  font-family: "メイリオ", "ヒラギノ角ゴシックW3", "ＭＳ Ｐゴシック", "Osaka", sans-serif;
  /*font-size: medium;*/
  color: #D0D0D0;
  background: #202020;
  padding: 10px;
  position: absolute;
  border-radius: 0px;
  box-shadow: none;
  border: none;
  max-width: none;
}

.ui-icon-big, .fa-icon {
  font-size: 1.5em !important;
}

.ui-resizable-handle.ui-icon-gripsmall-diagonal-se {
  position: absolute;
}

a[tt_title] {
  cursor: pointer;
}


path.s1 {
  stroke: #ff0000;
  /*stroke-dasharray: 3,3;*/
}

path.s2 {
  stroke: #ff0000;
  stroke-dasharray: 3, 3;
}

path.s3 {
  stroke: #0000ff;
  /*stroke-dasharray: 3,3;*/
}

path.s4 {
  stroke: #0000ff;
  stroke-dasharray: 3, 3;
}

path.campaign {
  stroke: #ff8c00;
  /*stroke-dasharray: 3,3;*/
}

.dc-chart path.line {
  stroke-width: 1px;
  /*stroke-opacity: 0.5;*/
}

.detail {
  float: left;
  font-size: 12px;
  background: #fffacd;
  padding: 4px;
  margin-left: 1px;
  border: 1px solid #999;
  border-radius: 6px;
  text-align: left;
  z-index: 65535 !important;
}

.detail .detail-info {
  font-size: 11px;
  height: 4.5em;
  background: beige;
  overflow: hidden;
}

.detail .detail-info:hover {
  overflow: auto;
}

.detail .detail-img img {
  width: 100%;
  height: auto;
  overflow: hidden;
  margin-bottom: 2px;
}

.tt_text-tooltip {
  width: 32em;
}

#tbl_ana {
  float: left;
  margin-right: 10px;
}

#tbl_ana caption {
  font-weight: bold;
  text-align: center;
  padding: 2px;
}

#tbl_ana th {
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #202020;
}

#tbl_ana td {
  text-align: center;
  padding: 2px 0px;
  border-bottom: 1px solid #202020;
}

.container_tbl_pref {
  display: none;
}

#tbl_pref td {
  height: 2em;
}

#tbl_pref {
  width: 100%;
  display: none;
}

#tbl_pref_wrapper input {
  font-weight: normal;
}

#tbl_pref_wrapper .tr_h td {
  background-color: #E0E0E0;
  font-weight: bold;
  white-space: nowrap;
}

#tbl_pref_wrapper .tr_h td:nth-child(2),
#tbl_pref_wrapper .tr_h td:nth-child(3) {
  font-weight: normal;
}

table.dataTable thead th div.DataTables_sort_wrapper label * {
  position: relative;
  top: initial;
  margin-top: initial;
  right: initial;
}

.dt-search {
  float: right;
}

.uicm { /* ui_sortable_col_move */
  cursor: move;
}

.square {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: 1px;
  margin-bottom: -1px;
  border: 1px solid #F0F0F0;
}

/**
 * $.ui.autocomplete_ex extends $.ui.autocomplete
 */
.ui-autocomplete.ui-widget-content {
  /*padding: 10px 20px 15px;*/
  border: 1px solid #DEDEDE;
  border-radius: 3px;
  box-shadow: 0 10px 10px 2px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.ui-keyboard-keyset {
  z-index: 1010; /*　> .ui-autocomplete z-index  */
}

.ac_ex-cate {
  font-weight: bold;
  /*padding: .2em .4em;*/
  /*margin: .8em 0 .2em;*/
  /*line-height: 1.5;*/
}

.ac_ex-item {
  vertical-align: middle;
  /*line-height: 40px;*/
  /*padding: 5px 10px;*/
}

.ac_ex-item img {
  margin-right: 10px;
}

.ac_ex-item .ac_ex-kwd {
  color: #0000FF;
  font-weight: bold;
}

.ac_ex-item .ac_ex-bld {
  font-weight: bold;
}

/* リスト hover 時のカラー */
.ui-menu-item-wrapper.ui-state-active {
  border: 1px solid #4B8519;
  background: rgba(0, 0, 255, 0.5);
  font-weight: normal;
  color: #ffffff;
}

.data-reference {

}

/* tailwindcss 対応 */
#app {
  img {
    display: inline-block;
  }

  input {
    padding: 2px 4px;
    border: 1px solid rgb(118, 118, 118);
  }

  a:not(.ui-button,.ui-tabs-anchor) {
    text-decoration: none;
    color: blue;
  }

  a:visited:not(.ui-button,.ui-tabs-anchor) {
    color: purple;
  }
}

/* ダークモード対応 */
.dark {
  #app a {
    text-decoration: none;
    color: cyan;
  }

  a:visited:not(.ui-button) {
    color: mediumpurple;
  }

  input[type="text"],
  .dt-search input[type="search"],
  .ui-dialog input[type="search"],
  select {
    color: var(--text-theme-col);
    background: var(--bg-theme-col2);
  }

  .tab-data li:not(.selected) {
    background: var(--bg-theme-col2);
  }

  .tab-data li.selected {
    background: #0972a5;
  }

  .tab-data li.selected a {
    color: var(--text-theme-col);
  }

  .ac_ex-item .ac_ex-kwd {
    color: cyan;
  }

  .filter, .filter_txt {
    color: #1f2937;
  }

  .detail {
    background: var(--bg-theme-col2);
  }

  .detail-left {
    word-break: break-all;
  }

  .detail .detail-info {
    background: var(--bg-theme-col);
  }

  .jvectormap-container svg {
    background: var(--bg-theme-col2);
  }

  .dc-chart g.row text,
  .jvectormap-legend-tick-text {
    /*color: #F0F0F0;*/
    /*fill: #F0F0F0;*/
    /*mix-blend-mode: difference;*/

    color: #F0F0F0;
    fill: #F0F0F0;
  }

  .dc-chart g.dc-legend g.sel text {
    fill: yellow;
  }

  .dc-chart g.pie-label-group text {
    /*color: #F0F0F0;*/
    /*fill: #E0E0E0;*/
    /*mix-blend-mode: difference;*/

    color: #F0F0F0;
    fill: #F0F0F0;
  }

  .dc-chart rect.selected + text {
    fill: yellow;
  }

  .dc-chart g.axis.x text.sel {
    fill: yellow;
  }

  .dc-chart text,
  .dc-chart .axis text {
    fill: #F0F0F0;
    color: #F0F0F0;
  }

  .dc-chart rect.deselected {
    fill: rgba(128, 128, 128, 0.5);
  }

  /* 細いスクロールバーの背景 */

  .scrollbar-thin::-webkit-scrollbar-track {
    background: #374151; /* bg-gray-500 */
  }

  /* 細いスクロールバーのつまみ */

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #6b7280; /* bg-gray-700 */
  }

  .jFiler-items.jFiler-row {
    background: var(--bg-theme-col2);
  }

  .ui-draggable-dragging {
    background-color: #1f78b4;
    border: 1px solid #CCC;
    box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.8);
  }

  .jFiler-items-grid .jFiler-item .jFiler-item-container {
    color: var(--text-theme-col2);
    background: var(--bg-theme-col);
  }

  #tbl_pref_wrapper .tr_h td {
    background-color: #404040;
  }

  table.dataTable tbody tr,
  table.dataTable thead tr > .dtfc-fixed-start,
  table.dataTable thead tr > .dtfc-fixed-end,
  table.dataTable tfoot tr > .dtfc-fixed-start,
  table.dataTable tfoot tr > .dtfc-fixed-end,
  table.dataTable tbody tr > .dtfc-fixed-start,
  table.dataTable tbody tr > .dtfc-fixed-end,
  table.dataTable thead > tr > *.ui-state-default {
    color: var(--text-theme-col2);
    background: var(--bg-theme-col);
  }

  .dataTables_scroll tr.odd td {
    background: var(--bg-theme-col) !important;;
  }

  .dataTables_scroll tr.even td {
    background: var(--bg-theme-col2) !important;;
  }

  /*.c1000 a,*/
  /*.c500 a,*/
  /*.c100 a,*/

  .c50 a,
  .c10 a,
  .c1 a,
  .c0 a {
    color: black !important;
  }
}

/*===========================================================================*/
@media screen and (min-width: 768px) {
  /* md: 768px以上 */
  .dc-chart text, .dc-chart .axis text {
    font-family: apple color emoji, segoe ui emoji, noto color emoji, android emoji, emojisymbols, emojione mozilla, twemoji mozilla, segoe ui symbol,
    "メイリオ", "ヒラギノ角ゴシックW3", "ＭＳ Ｐゴシック", "Osaka", sans-serif;
  }

  #loading i {
    position: absolute;
    top: 35%;
    left: 50%;
    font-size: 50px;
    height: 50px;
    width: 50px;
    color: #222;
  }

  .main-header .logo .logo-lg {
    font-size: 14px;
  }

  #input-search {
    width: 18em;
  }

  .dc-chart g.row text {
    fill: #000000;
    font-size: 15px;
  }

  #chart_gmap {
    float: left;
    width: 480px;
    height: 500px;
    overflow: hidden;
  }

  #chart_sview {
    width: 480px;
    height: 500px;
    overflow: hidden;
  }

  #street-view {
    width: 100%;
    height: calc(100% - 1.1em);
  }

  #chart_map {
    float: left;
    width: 470px;
    cursor: move;
  }

  #japan-map,
  #japan-map svg {
    width: 100%;
    height: calc(100% - 1.1em);
  }

  #panel_name {
    width: 205px;
    height: 100%;
    overflow-y: hidden;
  }

  #panel_name #div_name {
    /*width:200px;*/
    height: 100%;
    /*overflow-x:hidden;*/
    overflow-y: auto;
  }

  #panel_city {
    width: 235px;
    height: 100%;
    overflow-y: hidden;
  }

  #panel_city #div_city {
    /*width:230px;*/
    height: 100%;
    /*overflow-x:hidden;*/
    overflow-y: auto;
  }

  #panel_date {
    width: 1200px;
    max-width: 100%;
    overflow: hidden;
  }

  #panel_date #div_date {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }

  #chart_sex {
    width: 158px;
  }

  #chart_season {
    width: 158px;
  }

  #chart_year {

  }

  #chart_week {
    width: 355px;
  }

  #chart_age {

  }

  #panel_cond {

  }

  #panel_job {
    width: auto;
    max-width: 100%;
  }

  #panel_detail {

  }

  #panel_ana {
    /*background-color: #ffffe0;*/
  }

  .ui-tabs-anchor {
    padding: 0.5em 0.8em !important;
  }

  #panels {
    position: relative;
    /*position: absolute;*/
    /*width: 100%;*/
    /*height: 100%;*/
  }

  .dc_panel {
    float: left;

    padding: 4px;
    margin: 2px;
    overflow: hidden;
  }

  .dc_panel#panel_job {
    overflow-x: auto;
  }

  #panel_detail {
    position: relative;
    width: auto !important;
    height: auto !important;
  }

  .filter, .filter_txt {
    max-width: 8em;
  }

  .detail-left {
    width: 190px;
  }

  .detail-right {
    margin-left: 3px;
  }

  .detail .detail-img {
    width: 180px;
  }

  .detail .detail-info {
    width: 180px;
  }

  .emj {
    font-family: apple color emoji, segoe ui emoji, noto color emoji, android emoji, emojisymbols, emojione mozilla, twemoji mozilla, segoe ui symbol !important;
  }
}

/* for_wide_screen */

/*===========================================================================*/
@media screen and (max-width: 768px) {
  　 /* sm: 768px未満 */
  .sp_icon {
    font-size: 1em !important;
  }

  .sp_center {
    text-align: center;
  }

  .content {
    padding-left: 2px;
    padding-right: 2px;
  }

  #input-search {
    width: 5em;
  }

  .dc-chart g.row text {
    fill: #000000;
    font-size: 13px;
  }

  #chart_gmap {
    float: left;
    width: 100%;
    height: 360px;
    overflow: hidden;
  }

  #chart_sview {
    float: left;
    width: 100%;
    height: 360px;
    overflow: hidden;
  }

  #chart_tube {
    float: left;
    width: 100%;
    height: 360px;
    overflow: hidden;
  }

  #street-view {
    width: 100%;
    height: calc(100% - 1.1em);
  }

  #chart_map {
    float: left;
    width: 100%;
    cursor: move;
  }

  #japan-map {
    width: 100%;
    height: 360px;
    overflow: hidden;
  }

  #panel_name {
    width: 44%;
    height: 18.5em;
    overflow-y: hidden;
  }

  #panel_name #div_name {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  #panel_city {
    width: 52%;
    height: 18.5em;
    overflow-y: hidden;
  }

  #panel_city #div_city {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  #panel_date {
    width: 100%;
  }

  #panel_date #div_date {
    width: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }

  #panel_sex {
    width: 138px;
  }

  #panel_season {
    width: 138px;
  }

  #panel_year {
    width: 100%;
  }

  #panel_week {
    width: 100%;
  }

  #panel_age {
    width: 100%;
  }

  #panel_cond {
    width: 100%;
  }

  #panel_job {
    width: 100%;
  }

  .panel_ex {
    width: 100%;
  }

  #panel_detail {
    width: 100%;
  }

  .filter, .filter_txt {
    max-width: 4em;
  }

  #panel_ana {
    background-color: #ffffe0;
    width: 100%;
  }

  .ui-tabs-anchor {
    padding: 0.5em 0.5em !important;
  }

  .dc_panel {
    padding: 4px;
    float: left;
    margin: 2px 2px 12px 4px;
    overflow-x: auto;
    overflow-y: auto;
  }

  .dc-chart {
    overflow-x: auto;
  }

  .detail-left {
    max-width: 48%;
  }

  .detail .detail-info {
    width: 100%;
  }

  .emj {
  }

  .jFiler-items-grid .jFiler-item .jFiler-item-container {
    width: 170px;
  }
}

/* for_small_screen */
</style>
