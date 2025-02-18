/**
 * ファイラーダイアログ
 *   @param {Object} options 詳細は _options を参照
 *     ajax : ファイル (一覧取得/アップロード/削除)リクエスト
 *     select_dirs: 参照ディレクトリ
 *
 *   @dependencies": {
 *    "jquery": "",
 *    "lodash.js": "",
 *    "moment.js": "",
 *    "DataTable": "",
 *    "jquery-ui": "^1.12.0",
 *    "jQuery.filer": "^1.0.0",
 *
 *    "lazyload": "^2.0.0",
 *    "jquery-dialogextend": "",
 *    "mark.js": ""
 *   }
 *
 */

function FsFilerDlg(options) {
    options = options || {};
    //ディフォルトオプション
    var _options = {
        is_sp: ('ontouchstart' in window)
        , 'title': 'ファイルマネージャー'
        //ファイル (一覧取得/アップロード/削除)リクエスト
        , ajax: {
            get_files: { url: '', data: { dir: '' } }//一覧取得
            , upload_file: { url: '', data: { dir: '' } }//アップロード
            , remove_file: { url: '', data: { dir: '' } }//削除
        }
        , def_upload: null
        , position: {//右中央揃え
            my: "right center"
            , at: "right center"
            , of: $(window)
            , collision: "flipfit flipfit"
        }
        //		,'position': {//入力エリアの右+200
        //	        my: "left top"
        //	        ,at: "left+200 top"
        //			,of: options.sel_target
        //			,collision: "flipfit none"
        //		}
        , is_grid_list: 1      //リストビュー(view_list)があるか?
        , sel_view: 'view_grid' //選択ビュー view_grid/view_list

        , is_select_dir: 1 //ディレクトリ選択可能か？※注意：1にして複数のディレクトリをまたぐファイルを設定できるようにした場合、API側の参照数のチェック定義を変更する事。
        , select_dirs: [
            ['upload/img/', 'ピクチャ(23)'],
            ['upload/player/', 'プレイヤー(1844)']
        ]
        , select_dirs_no: 0

        //TODO:ロード時にフォルダ名のsufixにファイル数付加するようにする

        , view_grid_pagen: 1000 //グリッドビューの1ページの表示件数

        , fs_filer_is_ddrop_open: 1
        , fs_filer_is_viewa_open: 1

        , is_ref_cnt: 0
        , is_btn_ins: 1
        , is_btn_cpy: 0
        , is_btn_del: 1
        , is_btn_scl: 1

        , is_pager_bottom: 0 //下にもページャーがあるか?

        , fs_filer_upload_max_file_num: null
        , fs_filer_upload_max_filesize: 16 //MB
        , fs_filer_upload_extensions: ['jpg', 'jpeg', 'png', 'gif', 'pdf']

        , fs_filer_inline_target: null
    };

    if (options.select_dirs) _options.select_dirs.unshift(options.select_dirs);

    $.extend(true, _options, options);//merge_recursive

    //UISettings  Load
    let settings = JSON.parse(localStorage.getItem('fsFilerDlg' + location.pathname)) || {};
    if (settings) {
        if (settings.sel_view) _options.sel_view = settings.sel_view;
        if (settings.select_dirs_no) _options.select_dirs_no = settings.select_dirs_no;
    }

    _options.ajax.get_files.data.dir = _options.select_dirs[_options.select_dirs_no][0]; // select 0版を 状態にする
    _options.ajax.upload_file.data.dir = _options.select_dirs[_options.select_dirs_no][0]
    _options.ajax.remove_file.data.dir = _options.select_dirs[_options.select_dirs_no][0]

    if (options.fs_filer_upload_extensions) {
        _options.fs_filer_upload_extensions = options.fs_filer_upload_extensions;
    }
    //file_accept='image/jpeg, image/jpg, image/gif, image/png, application/pdf';
    file_accept = '.' + _options.fs_filer_upload_extensions.join(',.');

    if (_options.select_dirs.length == 0) {
        _options.is_select_dir = 0;
    }

    var _dlg_h = parseInt(window.innerHeight * 0.9);
    if (_options.fs_filer_inline_target != null) {
        _dlg_h = $(_options.fs_filer_inline_target).height();
    }

    var _dlg_template =
'<div title="">'+
'<span tabIndex="0"></span>'+
    '<div id="flt_toolbar" style="text-align:left;padding:4px">'+
        '<span id="flt_toolbar_dir" style="display:none;">'+
            '<i class="icon-jfi-folder" style="font-size:2em;"></i>'+
            '<select id="select_dir" style="max-width:20em;font-size:1.2em;"></select>'+
        '</span>'+
        '　<label title="ファイルアップロード領域の表示・非表示" for="show_ddrop"><i class="ui-icon ui-icon-cloud-upload" style="font-size:1.3em"></i></label>'+
        '<input type="checkbox" name="show_ddrop" id="show_ddrop" value="show_ddrop" '+(_options.fs_filer_is_ddrop_open ? 'checked' : '')+' >'+
        //'<label title="画像表示領域の表示・非表示" for="show_viewa"><i class="icon-jfi-file-image" style="display:inline-block;font-size:1.3em;"></i></label>'+
        //'<input type="checkbox" name="show_viewa" id="show_viewa" value="show_viewa" '+(_options.fs_filer_is_viewa_open ? 'checked' : '')+' >'+ //
        '<i id="view_reload" style="display:none" title="ファイル一覧を再取得します" class="icon-jfi-reload ui-button ui-widget ui-corner-all"></i>'+ //更新ボタン
        '　'+
        '<B>表示:</B>'+
            '<label title="リスト表示"    for="view_list"><i class="icon-jfi-view-list"></i></label><input type="radio" name="radio_filer_show" id="view_list" value="view_list" '+(_options.sel_view==='view_list'?'checked':'')+'>'+
            '<label title="サムネイル表示" for="view_grid"><i class="icon-jfi-view-grid"></i></label><input type="radio" name="radio_filer_show" id="view_grid" value="view_grid" '+(_options.sel_view==='view_grid'?'checked':'')+'>'+
            '　'+
            '<span id="sliderSclMinus"></span>&nbsp;<span id="sliderSclPlus"></span>'+
        '<span id="fl_tool" '+(_options.sel_view==='view_grid'?'':'style="display:none;text-align:left;"')+'>'+
            '　<label title="詳細表示" for="show_detail"><span class="ui-icon ui-icon-vcard" style="display:inline-block;"></span>詳細</label>　'+
            '<input type="checkbox" name="show_detail" id="show_detail" value="show_detail">'+
            '<B>並べ替え:</B>'+
            '<button class="sort_show" id="sort_date" value="sort_date" title="更新日時 ▼降順/▲昇順" checked>'+
            '<span class="sicon sort_date_i ui-icon"></span>更新日時</button>'+
            '<button class="sort_show" id="sort_name" value="sort_name" title="名前 ▼降順/▲昇順" checked>'+
            '<span class="sicon sort_name_i ui-icon ui-icon-triangle-1-n"></span>名前</button>'+
            '<button class="sort_show" id="sort_size" value="sort_size" title="サイズ ▼降順/▲昇順" checked>'+
            '<span class="sicon sort_size_i ui-icon"></span>サイズ</button>'+
            '<span id="fl_tool_2">&nbsp;&nbsp;'+
                '<span id="page_btns" style="display:none">'+
                    '<button class="page_prevt" title="最初のページ"><span class="ui-icon ui-icon-arrowthickstop-1-w"></span></button>'+
                    '<button class="page_prev" title="前のページ"><span class="ui-icon ui-icon-arrowthick-1-w"></span></button>'+
                    '<button class="page_next" title="次のページ"><span class="ui-icon ui-icon-arrowthick-1-e"></span></button>'+
                    '<button class="page_nextt" title="最後のページ"><span class="ui-icon ui-icon-arrowthickstop-1-e"></span></button>'+
                '</span>'+
                '<span id="fl_tool_2_s">&nbsp;&nbsp;'+
                    '<span class="ui-icon ui-icon-search" style="display:inline-block;"></span>'+
                    '<input type="search" style="margin-top:8px;" placeholder="フィルタ" title="キーワードの入力で表示がフィルタされます。\n　@<日付> …更新日時で検索。例:「@2017/10」\n　.<拡張子> …拡張子で検索。例：「.png」\nショートカットキー:\nCtrl+Shift+F　…フォーカス" name="search_name" id="search_name" class="btn_clear">'+
                    '<i id="btn_clear" title="入力をクリアします" class="icon-jfi-times ui-button ui-widget ui-corner-all"></i>'+
                '</span>'+
                '<span class="status_bar" style="float:right;margin-top:15px;"></span>'+
            '</span>'+
        '</span>'+
    '</div>'+
    '<div id="div_body" class="scrollbar-thin" style="overflow:auto;height:'+(_dlg_h-170)+'px;">'+
        '<input type="file" name="files[]" id="filer_input" multiple="multiple" accept="'+file_accept+'">'+
        //DataTable
        '<div id="dt_list_div" style="display:none">'+
            '<table id="dt_list" class="display compact" cellspacing="0" width="100%">'+
                '<thead>'+
                    '<tr>'+
                        '<th>ファイル名</th>'+
                        '<th>更新日時</th>'+
                        '<th>サイズ</th>'+
                        '<th>横</th>'+
                        '<th>縦</th>'+
                        '<th>操作</th>'+
                    '</tr>'+
                '</thead>'+
                '<tbody>'+
             '</tbody>'+
            '</table>'+
        '</div>'+
    '</div>'+
'</div>'
;

    var d = $(_dlg_template).uniqueId();
    var tmpl_id = d.attr('id');
    selector = '#' + tmpl_id;
    d.find('[name=radio_filer_show]').attr('name', 'radio_filer_show' + tmpl_id); //ラジオボックは名前はUNIQにする
    d.find('.sort_show').attr('class', 'sort_show' + tmpl_id); //名前はUNIQにする

    //<LABEL for="<uniq>"><INPUT ID="<uniq>">をQNIQにする
    function dlg_set_uniqid(d, id_name, uid) {
        d.find('[for=' + id_name + ']').attr('for', id_name + uid);
        d.find('#' + id_name).attr('id', id_name + uid);
    }
    function php_bytesToSize(bytes) {
        if (bytes === 0) return '0';
        const k = 1024;
        const sizes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }

    dlg_set_uniqid(d, 'view_grid', tmpl_id);
    dlg_set_uniqid(d, 'view_list', tmpl_id);

    dlg_set_uniqid(d, 'show_detail', tmpl_id);
    dlg_set_uniqid(d, 'show_ddrop', tmpl_id);
    dlg_set_uniqid(d, 'show_viewa', tmpl_id);
    dlg_set_uniqid(d, 'sort_date', tmpl_id);
    dlg_set_uniqid(d, 'sort_name', tmpl_id);
    dlg_set_uniqid(d, 'sort_size', tmpl_id);

    $('body').after(d);

    //---------------------------------------------------------------------------
    //member
    var _this = this;
    var _selector = selector;
    var _selector_check_detail = '[name=show_detail]';
    var _selector_check_ddrop = '[name=show_ddrop]';
    var _selector_check_viewa = '[name=show_viewa]';
    var _selector_radio = '[name=radio_filer_show' + tmpl_id + ']';
    var _selector_sort = '.sort_show' + tmpl_id;
    var _dlg;
    d.find('#search_name').attr('id', 'search_name' + tmpl_id);
    var _selector_search_name = '#search_name' + tmpl_id;
    var _datepicker_opt = {
        showOn: "button",
        buttonText:'<i class="ui-icon ui-icon-calendar-day"></i>',
        showButtonPanel: true,
        defaultDate: new Date('' + new Date().getFullYear()),
        changeMonth: false,
        changeYear: true,
        numberOfMonths: [3, 4],
        stepMonths: 12,
        dateFormat: 'yy/mm/dd', //dateFormat: 'yy年mm月dd日(D)',
        constrainInput: false,
        //onClose: function( selectedDate ) {    },
        beforeShowDay: function(date) {
            var ret = [];
            var y = date.getFullYear();
            var m = g.printf02d(date.getMonth() + 1);
            var d = g.printf02d(date.getDate());
            ret[0] = true;
            ret[1] = ret[2] = '';
            if (jQuery.datepicker.regional["ja"].holidays && jQuery.datepicker.regional["ja"].holidays[y + m + d] != undefined) {
                ret[1] += ' holiday';
            }
            //練習日

            if (typeof m_days !== "undefined") {
                var days = m_days[y + m + d] || [0, 0, 0];
                //var num_str = (days[2]==undefined ? '' : (' | 参加' + days[2]+'人' ));
                ret[1] += ' css_' + days[0]; //circleCSS
                var place = days[1] === undefined ? '' : days[1];
                var join = days[2] === undefined ? '' : (' 参加：' + days[2] + '人');
                ret[2] = place + join;
            }
            //ファイル日付
            var days_file = _dlg_files_date ? _dlg_files_date[y + m + d] : NULL;
            if (days_file) {
                ret[1] += ' fbd2red';
                ret[2] += ' ファイル数：' + days_file;
            }
            return ret;
        },

        onChangeMonthYear: function(year, month, inst) {
            let is_params = typeof g_params !== "undefined";
            var cal_id = 'y=' + year + '&m=' + g.printf02d(month) + (is_params ? ('&circle=' + g_params.circle):'');
            jQuery.get('checkin_get_n.php?' + cal_id, function(data) {
                var days = data.split('\n');
                var y, m, d;
                for (i = 0; i < days.length - 1; i++) {
                    var a = days[i].split(',');
                    var y = a[0];
                    var m = a[1];
                    var d = a[2];
                    var num = a[3];
                    var yymmdd = y + g.printf02d(m) + g.printf02d(d);
                    if(is_params) m_days[yymmdd] = [g_params.circle, '(場所)', num];
                }
                $('#' + inst.id).datepicker("refresh");
            });
            //$(this).val('@'+year+'/'+month).trigger('change');

            //      setTimeout(function() {
            //          var calendar = inst.dpDiv;    // Datepicker
            //          if(calendar.find('td.cancel50,td.cancel100').length && calendar.find('span.cancel50').length===0  ){//
            //     var s=moment().add(10,"days").format("M月D日");
            //     calendar.find('div.ui-datepicker-buttonpane')
            //         .append( $('<div style="font-size:'+(g.is_sp?'20pt':'9pt')+';font-weight:bold;">'+s+'の予約キャンセル料</div>') )
            //         .append( $('<span style="" class="cancel50">半額日</span>') )
            //         .append( $('<span style="" class="cancel100">全額日</span>') );
            // }
            //      }, 100);
        },
        onSelect: function(dateText, inst) {
            $(this).val('@' + dateText).trigger('change');
        }
        , beforeShow: function(input, inst) {
            //var calendar = inst.dpDiv;    // Datepicker
            var o = $(this);
            var d = new Date(o.datepicker('option', 'defaultDate'));
            o.datepicker("option", "onChangeMonthYear")(d.getFullYear(), d.getMonth() + 1, inst);
            inst.dpDiv.css({ marginTop: '16px' });

            //表示位置
            var calendar = inst.dpDiv;    // Datepicker
            setTimeout(function() {
                //画面中央
                var c = $(calendar)
                c.css("left", parseInt(($(window).width() - c.width()) / 2) + "px");
                /*
                    calendar.position({
                        my: 'right  top',
                        at: 'right  bottom',
                        of: input
                    });
                    */
            }, 10);

        }
    };
    //var _selector_search_name = '#search_name';
    var _dt = null;
    var _dt_options_ex = {
        // 表示件数切り換えSELECTBOXのLIST
        lengthMenu: [[10, 20, 50, 100, 200, -1], ['10件', '20件', '50件', '100件', '200件', '全件']]

        //Ajax通信 data パラメタ
        , on_ajax_data: function(data, api) {
            return data;
        }
        //Ajax通信 開始時
        , on_preXhr_dt: function(e, settings, data) {
            $('#loading').show();
            return false;
        }
        //Ajax通信 完了時
        , on_xhr_dt: function(e, settings, json, xhr) {
            var api = $.fn.dataTable.Api(settings);
            $("#loading").fadeOut(G.LOADDING_FADE_OUT);

            var is_return = false;
            if (xhr.status != 200) {
                var msg = xhr.responseJSON ? xhr.responseJSON.msg : G.MSG_AJAX_FAIL;
                alert(msg);
                $('.dataTables_empty').text(msg);
                is_return = true;
                g['data_bakup'] = api.data(); //データを保存
                return is_return;
            }
            //HTTTステータス成功時
            //VALIDATION エラー
            if (json && json.status === G.STATUS_NG_VALIDATION && json.msg) {
                //ch_inline_msg(json.msg ? json.msg : G.MSG_AJAX_FAIL);
                is_return = true;
                g['data_bakup'] = api.data(); //store data
                return is_return;
            }
            //データがない場合
            if (json === null || json.data === undefined || json.data == null || json.data.length === 0) {
                if (json && json.msg) {
                    settings.oLanguage.sEmptyTable = json.msg; //データテーブルのデータなしのメッセージ変更
                }
            }

            return is_return;
        }
        //
        , on_dataSrc: function(json, options) {
            var options = options || {};
            if (json.status !== G.STATUS_OK) {
                //ch_inline_msg(json.msg ? json.msg : G.MSG_AJAX_FAIL);
                return (g.data_bakup === undefined ? [] : g.data_bakup);//あれば保存していたデータを使用する
            }

            //for client reorder
            if (options && options.disp_order_column !== undefined) {
                if (json.data && json.data.length > 0) {
                    var idx = options.disp_order_column;
                    //do_seq = json.data[0][idx]==0 || json.data[json.data.length-1][idx]==G.INT_MAX;
                    var do_seq = 1;//並んだSEQを入れる
                    if (do_seq) {
                        var disp_order_column_top = options.disp_order_column_top === undefined ? 0 : options.disp_order_column_top;
                        for (var i = 0; i < json.data.length; i++) {
                            json.data[i][idx] = disp_order_column_top + i + 1;
                        }
                    }
                }
            }
            if (json.data === undefined) json.data = [];
            return json.data;
        }
        //行削除の時
        , on_row_delete: function(_this, url, dt_table, col_idx_del, col_idx_title) {
            var sel_indexs = [];
            var is_row_multi_sel;
            var rows = dt_table.rows({ selected: true }); //選択機能あり(複数含む)の場合
            if (rows[0].length > 0) {
                sel_indexs = rows[0];
                is_row_multi_sel = 1;
            } else {
                var row = dt_table.row($(_this).parents('tr')); //選択機能ない場合
                sel_indexs = [row.index()];
                is_row_multi_sel = 0;
            }

            //削除一覧取得
            var titles = '';
            if (col_idx_title !== undefined) {
                var data = dt_table.data();
                var del_ids = [];
                for (var i = 0; i < sel_indexs.length; i++) {
                    var d = data[sel_indexs[i]];
                    del_ids[i] = d[col_idx_del];
                    titles += '「' + d[col_idx_title] + '」\n';
                }
            }
            var msg = G.MSG_CONFIRM_ROWEL_OK.replace('{{target}}', titles);
            var deferredAjax;
            if (confirm(msg)) {
                //削除リクエスト
                deferredAjax = fs_ajax({ 'url': url, 'data': { 'ids': del_ids } })
                    .always(function(data, textStatus, returnedObject) {
                        //ch_inline_msg(data.msg);
                        if (is_row_multi_sel) {
                            rows.remove().draw(false);
                        } else {
                            row.remove().draw(false);
                        }
                    });
            }
            return deferredAjax;
        }

        //カラム描画方法(日付時間)
        , colum_render_yyyymmddhhmmss: function(data, type, row) {
            if (type === 'display') {
                var m = moment(data);//yyyymmdd
                var s = m.format('YYYY/MM/DD HH:mm:ss');
                return _dt_options_ex.get_html_day(m, s);
            } else {
                return data;
            }
        }
        //カラム描画方法(日付曜日)
        , colum_render_yyyymmdd: function(data, type, row) {
            if (type === 'display') {
                var m = moment(data);//yyyymmdd
                var s = m.format('YYYY/MM/DD(dd)');
                return _dt_options_ex.get_html_day(m, s);
            } else {
                return data;
            }
        }
        //カラム描画方法(日付曜日)履歴用
        , colum_render_yyyymmdd_hist: function(data, type, row) {
            switch (type) {
                case 'display':
                    var yyyy = data.substr(0, 4);
                    var mm = data.substr(4, 2);
                    var dd = data.substr(6, 2);
                    var m = moment(data);//yyyymmdd
                    var s = m.format('YYYY/MM/DD(dd)');
                    var html = _dt_options_ex.get_html_day(m, s);
                    var mi = parseInt(mm);
                    var circle = row[5];//DT_IDX_CIRCLE_ID
                    html = '<img class="spbico" src="' + _dt_options_ex.get_month_icon(mi) + '">' + html;
                    html = '<a href="member.php?circle=' + circle + '&y=' + yyyy + '&m=' + mm + '#' + dd + '">' + html + '</a>';
                    ret = html;
                    break;
                case 'filter':
                    var m = moment(data);//yyyymmdd
                    var s = m.format('YYYY/MM/DD(dd)');
                    ret = s;
                    break;
                default:
                    ret = data; break;
            }
            return ret;
        }
        , get_html_day: function(m, s) {
            var weekday = m.weekday();
            var ymd = m.format('YYYYMMDD');
            if (weekday == 0) { //日
                return '<span class="col_sun">' + s + '</span>';
            } else if (weekday === 6) {//土
                return '<span class="col_sat">' + s + '</span>';
            } else if ($.datepicker.regional[G_LANG].holidays[ymd]) {//祝日
                return '<span class="col_hol">' + s + '</span>';
            } else {
                return s;
            }
        }
        , get_month_icon: function(m) {
            return 'icon/month/' + m + '.gif';
        }
        , opt: {
            img_w: 50
        }
    };
    var _dt_options = {
        ajax: {
            "type": "POST"
            , "url": _options.ajax.get_files.url
            , "data": function(d) {
                var data = $.extend(d, _options.ajax.get_files.data);
                if ($.cookie !== undefined) {
                    data['csrf_token'] = $.cookie('csrf_cookie');
                }
                data['format'] = 1; //for DataTable
                return _dt_options_ex.on_ajax_data(data, _dt);
            }
            , "dataSrc": function(json) {//Ajaxで受け取ったデータを加工する
                _on_ajax_get_files(json);
                return json.dir_files;
                /*
                var data = {
                    'status':json.status
                    ,'data':json.dir_files
                }
                return _dt_options_ex.on_dataSrc(data);
                */
            }
        }
        , select: true
        , columns: [
            {
                "data": "name", className: "left"
                , "render": function(data, type, row) {
                    if (type === 'display') {
                        return '<a target="_blank" href="' + row.file + '"><img style="width:' + _dt_options_ex.opt.img_w + 'px" class="fs_popup lazy2" data-src="' + row.file + '"/></a>' +
                            '<span class="fi" u="' + row.file + '">' + data + '</span>';
                    } else {
                        return data;
                    }
                }
            },
            { "data": "datetime", className: "left" }, //"render": _dt_options_ex.colum_render_yyyymmddhhmmss},
            { "data": "size", className: "right", "render": function(d, t) { return (t === 'display') ? php_bytesToSize(d) + 'B' : d; } },
            { "data": "w", className: "left", visible: true },
            { "data": "h", className: "left", visible: true },
            //            { "data": "ext",        className: "left", visible:true },
            //            { "data": "file",        className: "left", visible:false },
            //            { "data": "url",        className: "left", visible:false},
            {
                "data": null, orderable: false, "defaultContent":
                    (_options.is_btn_ins ? '<button class="btn_filer_insert ui-button ui-widget ui-corner-all"><i class="icon-jfi-plus"></i>選択</button>&nbsp;' : '') +
                    (_options.is_btn_del ? '<button class="btn_filer_remove ui-button ui-widget ui-corner-all"><i class="icon-jfi-trash"></i></button>&nbsp;' : '')
            }
        ]
        , order: [[1, 'desc']] //初期ソート
        //        ,"order":[] //初期ソートなし
        //

        , mark: {//https://markjs.io/
            //           "synonyms": {
            //                'word1'        :'単語1'
            //           }
        }


        //ページ切り替えする場合
        //,paging:  true,"pageLength": 10
        //,lengthChange: false

        //スクロールする場合(ページ切り替えなし)
        , scroller: true
        , scrollY: (parseInt(window.innerHeight * 0.9) - 370) + 'px' //dlg.height: parseInt(window.innerHeight*0.9),
        , scrollX: false
        , scrollCollapse: false    //少ないデータの時テーブルの高さを自動縮小調整する。default: false


        //        ,"dom": 'ifrt'        //DataTableの   { filter } { length }{ info }{ paging }{ table } 等のレイアウト設定
        //        ,dom: '<"dt_table_toolbar"B>rifptp' //CSV Export等あり
        , dom: 'ri<"dt_table_toolbar"B><"#img_slider">fptp'

        , buttons: [ // ['copy', 'csv', 'excel', 'pdf', 'print'] //File Export
            {
                text: '<i title="画像縮小" class="ui-icon ui-icon-zoomout"></i>'
                , action: function(e, dt, node, config) {
                    if (_dt_options_ex.opt.img_w > 200) {
                        _dt_options_ex.opt.img_w -= 100;
                    } else if (_dt_options_ex.opt.img_w > 50) {
                        _dt_options_ex.opt.img_w -= 30;
                    }
                    _dt.column(0).cells().invalidate().draw();
                }
            },
            {
                text: '<i title="画像拡大" class="ui-icon ui-icon-zoomin"></i>'
                , action: function(e, dt, node, config) {
                    _dt_options_ex.opt.img_w += 100;
                    _dt.column(0).cells().invalidate().draw();
                }
            }
        ]
        , stateSave: true

        //,searching: false
        , initComplete: function() {//(settings, json)
            var api = this.api();
            var dt = $(api.table().container());

            //画像サイズスライダー
            dt.find('#img_slider')
                .css({ 'width': '200px', 'left': '21em', 'top': '0.5em' })
                .slider({
                    'min': 0, 'max': 1000, 'step': 0.1, value: (185 - 20)
                    , slide: function slide_img_size_change(event, ui) {
                        _dt_options_ex.opt.img_w = parseInt(20 + ui.value);
                        _dt.column(0).cells().invalidate().draw();
                    }
                    //,change: slide_img_size_change
                });

            //検索フィルタINPUT
            var s = dt.find('[type=search]')
            //検索フィルタINPUT クローンに置き換える
            var s2 = s.clone();
            s2
                .attr({
                    'id': 'dt_search',
                    'type': 'search',
                    'placeholder': 'フィルタ',
                    'title': 'キーワードの入力で表示がフィルタされます。\nショートカットキー：\nCtrl+Shift+F　…フォーカス\nAlt+Up　…画像拡大\nAlt+Down　…画像縮小'
                })
                .on('keyup change', function(e) {
                    if (e.altKey) {
                        switch (e.keyCode) {
                            case $.ui.keyCode.UP: dt.find('.ui-icon-zoomin').trigger('click'); return; break;
                            case $.ui.keyCode.DOWN: dt.find('.ui-icon-zoomout').trigger('click'); return; break;
                        }
                    }

                    var w = $(this).val().trim();
                    if (w == '') {
                        //フィルタリセット
                        _dt.columns(1).search('');
                        _dt.search('').draw();
                        return;
                    }
                    //検索コマンド cmd:[?.#@]...
                    var cmd = 0, sw = w;
                    switch (w[0]) {
                        case '@': case '＠':
                            cmd = 1;//datetime @2019/06/21
                            sw = w.substring(1);
                            sw = sw.replace(/[０-９]/g, function(s) {
                                return String.fromCharCode(s.charCodeAt(0) - 65248);
                            });
                            break;
                        case '#':
                            cmd = 3;//cnt
                            sw = w.length > 1 ? w.substring(1) : 0; break;
                    }

                    switch (cmd) {
                        case 1: //datetime
                            _dt.columns(1).search(sw).draw();
                            break;
                        //case 2:break;//extension
                        //case 3:break;//cnt
                        default://all
                            _dt.search(w).draw();
                            break;
                    }

                });
            s.after(s2);
            //日付入力カレンダ
            s2 = dt.find('#dt_search').datepicker(_datepicker_opt);
            //クリアボタン
            s2.after($('<i id="dt_btn_clear" title="入力をクリアします" class="icon-jfi-times ui-button ui-widget ui-corner-all"></i>'));
            dt.find('#dt_btn_clear').on('click', function() {
                s2.val('').trigger('change');
            });
            s.remove();

            //ShortcutKey:
            $(document).keyup(function(e) {
                if (e.ctrlKey && e.shiftKey) {
                    switch (e.keyCode) {
                        case 76: //ﾌｨﾙﾀﾘｾｯﾄ:Ctrl+Shift+L
                            dt.find('#dt_search').val('').trigger('change'); break;
                        case 70: //Ctrl+Shift+F
                            dt.find('#dt_search').focus().select(); break;
                    }
                }
            });

            _dt_options.dt_search_forcus(dt);
        }
        , drawCallback: function() {
            if ($.fn.lazyload) {
                var api = this.api();
                var dt = $(api.table().container());
                var imgs = dt.find('.lazy2');//(img|embed).lazy
                imgs.lazyload();
            }
        }
    }

    var _dlg_files = {}, _dlg_files_date = {};
    var _filer_input_obj = null;
    var _msg = {
        'MSG_FILE_DELETE': 'ファイルを削除しますか？' //G.MSG_FILE_DELETE
    };
    var _m = {
        sort: 'sort_name'
        , sort_dir: 1
        , is_sort_change: 1
        , is_show_viewa: 1

        , page: {
            UNIT: _options.view_grid_pagen

            , is_page: -1
            , is_page_change: 0

            , page_num: 5
            , cnt: 0

            , from: 0 //0-(n-1) 表示は 1-5
            , to: (5 - 1)

            , init: function() {
                //this.is_page=-1;
                //this.is_page_change=0;
                this.cnt = 0;
                this.page_num = this.UNIT;
                this.from = 0;
                this.to = this.UNIT - 1;
            }
            , update: function(dlg) {
                var smsg = '';
                if (this.cnt <= this.UNIT) {
                    smsg = _dlg_files.length + ' 件';
                    dlg.find('#page_btns').hide();
                    this.is_page = 0;
                } else {
                    //フィルタありのページング表記
                    //「222 件中 1 ～ 20 を表示 （全 287 件より抽出）」

                    //ページングのみ表記
                    //「287 件中 1 ～ 20 を表示」
                    smsg = _dlg_files.length + ' 件中 ' + (this.from + 1) + ' ～ ' + (this.to + 1) + ' を表示';
                    dlg.find('#page_btns').show();
                    this.is_page = 1;
                }

                this.is_page_change = 0;
                dlg.find('.status_bar').text(smsg);
            }
        }
    };
    _m.page.init();

    _options.ajax.get_files.data['fs_file_type'] = _options.fs_filer_type;
    _options.ajax.get_files.data['sort'] = _m.sort;
    _options.ajax.get_files.data['sort_dir'] = 1;//_m.sort_dir;

    //---------------------------------------------------------------------------
    //function
    function init(selector) {
        //画像挿入 ダイアログ 作成
        var _dlg_opt_ex = {
            on_resize(dlg, h) {
                _dlg_h = parseInt(h);
                var ch = dlg.find(_selector_radio + ':checked');
                var is_view_grid = ch.val() == 'view_grid';
                dlg.find('#div_body').css('height', _dlg_h - (is_view_grid ? 270 : 170));
            }
        };
        var dlg_opt;
        if (_options.fs_filer_inline_target != null) {
            var t = $('#dlg_pos');
            dlg_opt = {
                modal: false,
                autoOpen: true,
                //resizable:false,
                //draggable:false,
                resizable: true,
                draggable: true,
                width: t.width(),
                height: t.height(),
                position: {
                    my: "left top"
                    , at: "left top"
                    , of: _options.fs_filer_inline_target
                    , collision: "flipfit none"
                },
                closeOnEscape: false
                , resize: function(event, ui) {
                    var dlg = $(this);
                    _dlg_opt_ex.on_resize(dlg, ui.size.height);
                }
            };
        } else {
            dlg_opt = {
                modal: true,
                width: _options.is_sp ? "100%" : "80%",
                height: _dlg_h,
                autoOpen: false,
                position: _options.position,
                show: {
                    effect: "fade"
                    , duration: 300
                    , easing: 'easeOutQuart'
                },
                buttons: {
                    '閉じる': function() {
                        $(this).dialog("close");
                    }
                }
                , resize: function(event, ui) {
                    var dlg = $(this);
                    _dlg_opt_ex.on_resize(dlg, ui.size.height);
                }
                //,resizeStop: function(event, ui) {}
            }
        }

        _dlg = $(selector).dialog($.extend({
            title: _options.title,
            'open': function() {
                var dlg = $(this);

                let settings = JSON.parse(localStorage.getItem('fsFilerDlg' + location.pathname)) || {};

                //$(this).parent().find('.ui-dialog-titlebar ').after($(this).parent().find('#flt_toolbar'));//TOOLBAR上に移動。※dlg.find()のeventが効かなくなる

                if (!_options.is_sp) dlg.find(_selector_search_name).val(settings.search).focus();

                //ツールバー [サムネイル][詳細]
                var ch = dlg.find(_selector_radio + ':checked');
                //var ch = dlg.find( _selector_sort+':eq(0)' );
                ch.trigger('click');//選択をクリック

                //ドラッグ&ドロップ領域Toggle
                dlg.find(_selector_check_ddrop).trigger('change');
            },
            'close': function() {
                let dlg = $(this);

                //UISettings  Save
                let settings = {
                    search: dlg.find(_selector_search_name).val().trim(),
                    sel_view: dlg.find(_selector_radio + ':checked').val(),
                    select_dirs_no: dlg.find('#select_dir option').index(dlg.find('#select_dir option:checked'))
                };
                localStorage.setItem('fsFilerDlg' + location.pathname, JSON.stringify(settings));
            },
            'create': function() {
                var dlg = $(this);

                //タイトルバーなし
                if (_options.fs_filer_inline_target != null) dlg.siblings('.ui-dialog-titlebar').hide();

                //ディレクトリ選択
                if (_options.is_select_dir) {
                    dlg.find('#flt_toolbar_dir').show();
                    var select_dir = dlg.find("#select_dir");
                    select_dir.change(function() {
                        var sel_dir = $(this).val();
                        _options.ajax.get_files.data.dir = sel_dir;
                        _options.ajax.upload_file.data.dir = sel_dir;
                        _options.ajax.remove_file.data.dir = sel_dir;
                        dlg.find(_selector_search_name).val('');
                        _m.page.init();
                        dlg.find("#view_reload").trigger('click');

                        dlg.find(_selector_search_name).focus();
                    });
                    for (var i = 0; i < _options.select_dirs.length; i++) {
                        var is_a = Array.isArray(_options.select_dirs[i]);
                        var val = is_a ? _options.select_dirs[i][0] : _options.select_dirs[i];
                        var txt = is_a ? _options.select_dirs[i][1] : val;
                        var sel = _options.ajax.get_files.data.dir == val ? 'selected' : '';
                        select_dir.append($('<option value="' + val + '" ' + sel + '>' + txt + '</option>'));
                    }
                }

                //リロードボタン
                dlg.find("#view_reload").click(function() {
                    if (_m.is_show_viewa == 0) return;

                    //ツールバー [サムネイル][詳細]
                    var ch = dlg.find(_selector_radio + ':checked');
                    //var ch = dlg.find( _selector_sort+':eq(0)' );
                    _m.is_sort_change = 0;//ソート切り替えしない
                    ch.trigger('click');//選択をクリック
                });

                //dlg.find( _selector_radio ).eq(0).prop('checked',true); //初期選択

                //詳細ボタン
                dlg.find(_selector_check_detail)
                    .checkboxradio({ icon: false })
                    .checkboxradio('refresh')
                    .change(function() {
                        var is_detail = $(this).is(':checked');
                        dlg.find('.jFiler-item-thumb-overlay').css('opacity', (is_detail ? .9 : ''));
                    });

                //スケール [-][+]ボタン and スケールスライダー
                if (_options.is_btn_scl) {
                    var m_img_h = 200;
                    dlg.find('#sliderSclMinus')
                        .button({ icons: { primary: "ui-icon-minus" } })
                        //.css({width:'{$m_btnSize}',height:'{$m_btnSize}'})
                        .on('click', function(e) {
                            if (m_img_h > 80) {
                                m_img_h -= 50;
                                $('.jFiler-item-thumb')
                                    .css({ 'width': m_img_h + 'px', 'height': m_img_h + 'px' })
                                    .find('img').css({ 'width': m_img_h });
                            }
                        })
                        //.hide();
                        ;
                    dlg.find('#sliderSclPlus')
                        .button({ icons: { primary: "ui-icon-plus" } })
                        //.css({width:'{$m_btnSize}',height:'{$m_btnSize}'})
                        .on('click', function(e) {
                            m_img_h += 50;
                            $('.jFiler-item-thumb')
                                .css({ 'width': m_img_h + 'px', 'height': m_img_h + 'px' })
                                .find('img').css({ 'width': m_img_h });
                        })
                        //.hide();
                        ;
                    /*
                                        dlg.find( "#slider" ).slider({
                                            value: m_img_h,
                                    //        range: true,
                                            range: 'min',
                                            min: 200,
                                            max: 700,
                                            //values: [ 75, 300 ],
                                            slide: function( event, ui ) {
                                                m_img_h = ui.value;
                                                //$('.jFiler-item-container,.jFiler-item-thumb').css({'width':m_img_h+'px','height':m_img_h+'px'}); //trigger('resize');
                                                //$('.jFiler-item-container,.jFiler-item-thumb').css({'height':m_img_h+'px'}); //trigger('resize');
                                                //$('.jFiler-item-container img.lazy').css({'height':m_img_h+'px'}); //trigger('resize');
                                                dlg.find('img.lazy').attr({'width':m_img_h}); //trigger('resize');
                                                //viewobj_checked_scl(m_img_h);
                                            }
                                        });
                    */

                }
                //ドラッグ&ドロップ領域Toggle
                dlg.find(_selector_check_ddrop)
                    .checkboxradio({ icon: false })
                    .checkboxradio('refresh')
                    .change(function() {
                        var is = $(this).is(':checked');
                        if (is) dlg.find('.jFiler-input-dragDrop').slideDown(100);
                        else dlg.find('.jFiler-input-dragDrop').slideUp(100);
                    });

                //画像一覧ビューの表示・非表示
                dlg.find(_selector_check_viewa)
                    .checkboxradio({ icon: false })
                    .checkboxradio('refresh')
                    .change(function() {
                        var is = $(this).is(':checked');
                        _m.is_show_viewa = is;
                        if (is) {
                            dlg.find("#view_reload").trigger('click');
                        } else {
                            dlg.find('#fl_tool').hide(); //slideUp(300);
                            dlg.find('.jFiler-items').hide();
                            dlg.find('#dt_list_div').hide();
                        }
                    });

                //ツールバー [サムネイル][詳細]
                dlg.find(_selector_radio).checkboxradio({ icon: false });
                //ツールバー ソート:[名前]...
                dlg.find(_selector_sort).button();
                //ツールバー クリック
                dlg.find(_selector_radio + ',' + _selector_sort)
                    .click(function() {
                        var val = $(this).val();
                        switch (val) {
                            case 'sort_date': case 'sort_name': case 'sort_size':
                                if (_m.is_sort_change) {
                                    if (_m.sort == val) {
                                        _m.sort_dir = 1 - _m.sort_dir;
                                    } else {
                                        _m.sort_dir = 1;
                                    }

                                    //ソートアイコン変化
                                    var sel = '.' + val + '_i';
                                    dlg.find('.sicon').removeClass('ui-icon-triangle-1-n').removeClass('ui-icon-triangle-1-s');
                                    var is_n = _m.sort_dir ? 1 : 0;
                                    if (val == 'sort_date') is_n = !is_n;
                                    if (is_n) {
                                        dlg.find(sel).removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-n');//▲
                                    } else {
                                        dlg.find(sel).removeClass('ui-icon-triangle-1-n').addClass('ui-icon-triangle-1-s');//▼
                                    }

                                    _m.sort = val;
                                    _options.ajax.get_files.data['sort_dir'] = _m.sort_dir;
                                }

                            case 'view_grid'://サムネイル
                                if (_m.is_sort_change) {
                                    switch (val) {
                                        case 'sort_date': _options.ajax.get_files.data['sort'] = 'date'; break;
                                        case 'sort_name': _options.ajax.get_files.data['sort'] = 'name'; break;
                                        case 'sort_size': _options.ajax.get_files.data['sort'] = 'size'; break;
                                    }
                                }
                                _m.is_sort_change = 1;
                                _m.page.cnt = 0;

                                //_filer_input_obj.listEl.find('.jFiler-item-container').remove();

                                //画像ファイル一覧 取得リクエスト
                                ch_ajax(_options.ajax.get_files)
                                    .done(function(data, textStatus, jqXHR) {
                                        if (data.status === G.STATUS_OK) {

                                            dlg.find('#div_body').animate({ scrollTop: 0 }, 100);

                                            _on_ajax_get_files(data);

                                            _m.page.is_page = 1;//on for lazyload cnt check >> imgs.length == ((_m.page.is_page||_m.page.is_page==-1) ? _m.page.page_num

                                            _filer_input_obj.reset();
                                            //_filer_input_obj.retry(_dlg_files);
                                            for (var i = 0; i < _dlg_files.length; i++) {
                                                var fl = _dlg_files[_dlg_files.length - 1 - i];
                                                if (fl.name === null) {
                                                    fl.name = '(null)';//サーバー側ファイル名文字コードNG
                                                }
                                                _filer_input_obj.append(fl);
                                            }

                                            _m.page.update(dlg);

                                            var sn = dlg.find(_selector_search_name);
                                            sn
                                                .autocomplete({
                                                    source: _dlg_files.map(item => item.name)
                                                    , select: function(event, ui) {
                                                        var _this = this;
                                                        setTimeout(function() { $(_this).trigger('change'); }, 10);
                                                    }
                                                });

                                            if ($.fn.mark) {
                                                sn.on('keyup change', function(event) {
                                                    event.preventDefault();
                                                    let o = $(this);
                                                    //keyword color by mark.js
                                                    w = o.val().trim();
                                                    $("#div_body").unmark({
                                                        done: function() {
                                                            if (w != '') {
                                                                $("#div_body").mark(w, {
                                                                    "separateWordSearch": true
                                                                    //synonyms:"one": "1"}
                                                                });
                                                            }
                                                        }
                                                    });
                                                });
                                            }
                                            if (sn.val().trim() != '') sn.trigger('change');

                                            //詳細表示更新
                                            dlg.find(_selector_check_detail).trigger('change');
                                            //画像ITEMの高さ調整
                                            var items = _filer_input_obj.listEl.find('.jFiler-item-container');
                                            if (items.matchHeight) {
                                                items.matchHeight();
                                            }
                                        } else {
                                            if (data.msg) {
                                                //alert(data.msg);
                                                if (data.msg == 'ディレクトリが存在しません') {
                                                    var smsg = 'データはありません';
                                                    dlg.find('.status_bar').text(smsg);
                                                    _dlg_files = {};
                                                    _dlg_files_date = {};
                                                    _filer_input_obj.reset();
                                                }
                                            }
                                        }
                                    });
                                dlg.find('#fl_tool').show(); //.slideDown(300);
                                dlg.find('.fl_tool_2').show();
                                dlg.find('.jFiler-items').show();
                                //var api=dlg.find( '#dt_list' ).dataTable().api();
                                dlg.find('#dt_list_div').hide();
                                dlg.find('#sliderSclMinus,#sliderSclPlus').show();

                                //サムネイルとリストのフィルタの値を同期してfocus()
                                let dt_search2 = $(_selector_search_name);
                                let dt_search = dlg.find('#dt_search');
                                if (dt_search.length) {
                                    let s = dt_search.val().trim();
                                    if (s === '') {
                                        dt_search2.focus();
                                    } else {
                                        dt_search2.val(s).trigger('change').focus().select();
                                    }
                                }
                                dlg.find('#div_body').css('height', _dlg_h - 270);
                                break;
                            case 'view_list': //詳細
                                dlg.find('#fl_tool').hide();//.slideUp(300);
                                dlg.find('.fl_tool_2').hide();
                                dlg.find('.jFiler-items').hide();
                                dlg.find('#sliderSclMinus,#sliderSclPlus').hide();
                                dlg.find(_selector_check_ddrop).prop('checked', false).trigger('change');

                                //サムネイルとリストのフィルタの値を同期してfocus()
                                const dt_search_forcus = (o) => {
                                    let dt_search = o.find('#dt_search');
                                    let s = $(_selector_search_name).val().trim();
                                    if (s === '') {
                                        dt_search.focus();
                                    } else {
                                        dt_search.val(s).trigger('change').focus().select();
                                    }
                                }

                                //ウインドウサイズ調整
                                let h0 = dlg.find('#flt_toolbar').height();
                                let h1 = _dlg_h - h0 - 150;
                                dlg.find('#div_body').css('height', h1);
                                let d = dlg.find('.jFiler-input-dragDrop');
                                //let h11= d.is(':visible') ? d.height() : 0;
                                let h11 = 0;
                                if (_dt == null) {
                                    _dt_options.scrollY = h1 - h11 - 140;
                                    _dt_options['dt_search_forcus'] = dt_search_forcus;
                                    _dt = dlg.find("#dt_list").DataTable(_dt_options);
                                    _dt.on('click', '.btn_filer_insert', function(ev) {
                                        //var api = $.fn.dataTable.Api( ev.delegateTarget );
                                        var api = _dt;
                                        var row = api.row($(this).parents('tr'));
                                        var data = row.data();
                                        _this.on_filer_insert(data.url ? data.url : data.file, data, _dlg, _options);
                                        //_this.on_filer_insert(data.file);
                                    })
                                        .on('click', '.btn_filer_remove', function(ev) {
                                            //var api = $.fn.dataTable.Api( ev.delegateTarget );
                                            let api = _dt;
                                            let o = $(this);
                                            let data = api.rows('.selected').data();
                                            let files = data.length ? data.map(item => item.name) : [api.row(o.closest('tr')).data().name];
                                            if (confirm('以下の' + _msg.MSG_FILE_DELETE + '\n\n' + files.join('\n'))) {
                                                var defferd = _on_filer_remove(files);
                                                defferd.always(function(d) {
                                                    if (d.status === G.STATUS_OK) {
                                                        api.ajax.reload();
                                                        _on_filer_remove_ok(files.length, dlg);
                                                    } else {
                                                        alert(d.msg);
                                                    }
                                                });
                                            }
                                        });
                                } else {
                                    //var api=dlg.find( '#dt_list' ).dataTable().api();
                                    //api.ajax.reload();
                                    _dt.ajax.reload();
                                }
                                dlg.find('#dt_list_div').show();
                                dt_search_forcus(dlg);
                                dlg.find('#dt_search').focus();
                                break;
                        }
                    });

                dlg.find('#page_btns button').button();

                if (_options.is_pager_bottom) {
                    var fl_tool_2 = dlg.find('#fl_tool_2').clone();
                    fl_tool_2.addClass('fl_tool_2');
                    fl_tool_2.find('#page_btns').show();
                    fl_tool_2.css({ 'text-align': 'right' });
                    fl_tool_2.find('#fl_tool_2_s').remove();
                    dlg.find('#div_body').after(fl_tool_2);
                }

                dlg.find('.page_prev').on('click', function(event) {
                    _m.page.page_num = _m.page.UNIT
                    if (_m.page.from == 0) return;

                    _m.page.from -= _m.page.UNIT;
                    if (_m.page.from < 0) _m.page.from = 0;
                    _m.page.to = _m.page.from + _m.page.UNIT - 1;
                    if (_m.page.to > _dlg_files.length - 1) _m.page.to = _dlg_files.length - 1;

                    _m.page.is_page_change = 1;
                    dlg.find("#view_reload").trigger('click');
                });
                dlg.find('.page_next').on('click', function(event) {
                    _m.page.page_num = _m.page.UNIT;
                    if (_m.page.to == _dlg_files.length - 1) return;

                    _m.page.to += _m.page.UNIT;
                    if (_m.page.to > _dlg_files.length - 1) {
                        _m.page.to = _dlg_files.length - 1;
                        var n = _dlg_files.length % _m.page.UNIT;
                        _m.page.from = _m.page.to - n + 1;
                        _m.page.page_num = n;
                    } else {
                        _m.page.from += _m.page.UNIT;
                    }

                    _m.page.is_page_change = 1;
                    dlg.find("#view_reload").trigger('click');
                });
                dlg.find('.page_prevt').on('click', function(event) {
                    _m.page.page_num = _m.page.UNIT
                    if (_m.page.from == 0) return;

                    _m.page.from = 0;
                    _m.page.to = _m.page.from + _m.page.UNIT - 1;
                    if (_m.page.to > _dlg_files.length - 1) _m.page.to = _dlg_files.length - 1;

                    _m.page.is_page_change = 1;
                    dlg.find("#view_reload").trigger('click');
                });
                dlg.find('.page_nextt').on('click', function(event) {
                    _m.page.page_num = _m.page.UNIT;
                    if (_m.page.to == _dlg_files.length - 1) return;

                    for (var i = 0; i < 999999; i++) {
                        _m.page.to += _m.page.UNIT;
                        if (_m.page.to > _dlg_files.length - 1) {
                            _m.page.to = _dlg_files.length - 1;
                            var n = _dlg_files.length % _m.page.UNIT;
                            _m.page.from = _m.page.to - n + 1;
                            _m.page.page_num = n;
                            break;
                        }
                    }

                    _m.page.is_page_change = 1;
                    dlg.find("#view_reload").trigger('click');
                });

                //検索
                dlg.find(_selector_search_name)
                    .on('change keyup', function(e) {
                        var w = $(this).val().trim();

                        if (e.altKey) {
                            switch (e.keyCode) {
                                case $.ui.keyCode.UP: dlg.find('#sliderSclPlus').trigger('click'); break;
                                case $.ui.keyCode.DOWN: dlg.find('#sliderSclMinus').trigger('click'); break;
                            }
                        }

                        var items = dlg.find('.jFiler-item');
                        if (w === '') {
                            items.show();
                            var smsg = '';
                            if (_m.page.is_page) {
                                smsg = _dlg_files.length + ' 件中 ' + (_m.page.from + 1) + ' ～ ' + (_m.page.to + 1) + ' を表示';
                            } else {
                                smsg = _dlg_files.length + ' 件';
                            }
                            dlg.find('.status_bar').text(smsg);
                            return;
                        }
                        if (_options.is_btn_ins && e.keyCode == $.ui.keyCode.ENTER) {
                            var v = dlg.find('.jFiler-item:visible');
                            if (v.length == 1) {
                                v.find('.jFiler-item-plus-action').trigger('click');
                            }
                        }

                        //検索コマンド cmd:[?.#@]...
                        var cmd = 0, sw = w;
                        switch (w[0]) {
                            case '@':
                                cmd = 1;//datetime
                                sw = w.substring(1); break;
                            case '#':
                                cmd = 3;//cnt
                                sw = w.length > 1 ? w.substring(1) : 0; break;
                        }
                        switch (cmd) {
                            case 1: find_selector = '.fi_dt'; break;	//datetime
                            //case 2:　find_selector='.fi_ext';break;//extension
                            case 3: find_selector = '.jFiler-item-container[cnt=' + sw + ']'; break;//cnt
                            default: find_selector = '.fi_name'; break;//name
                        }
                        //検索対象で表示をフィルタ
                        var n = 0;
                        for (var i = 0; i < items.length; i++) {
                            var it = items.eq(i)

                            switch (cmd) {
                                case 3:
                                    if (it.find(find_selector).length > 0) {
                                        it.show(); n++;
                                    } else {
                                        it.hide();
                                    }
                                    break;
                                default:
                                    //if(it.find('.fi_name:contains("'+w+'")'))
                                    if (it.find(find_selector).text().indexOf(sw) !== -1)//部分一致
                                    {
                                        it.show(); n++;
                                    } else {
                                        it.hide();
                                    }
                                    break;
                            }
                        }

                        //画像ITEMの高さ調整
                        // var item_container = items.find('.jFiler-item-container');
                        // if( item_container.matchHeight){
                        //     item_container.matchHeight();
                        // }
                        var smsg = '';
                        if (_m.page.is_page) {
                            smsg = _dlg_files.length + ' 件中 ' + (_m.page.from + 1) + ' ～ ' + (_m.page.to + 1) + ' (' + n + '件フィルタ表示)';
                        } else {
                            smsg = items.length + '件中' + n + '件表示';
                        }
                        dlg.find('.status_bar').text(smsg);
                    })
                    .datepicker(_datepicker_opt);


                //クリアボタン
                dlg.find('#btn_clear').on('click', function() {
                    dlg.find(_selector_search_name).val('').trigger('change');
                });

                //ファイルアップロードファイラー(withサムネイル) 機能
                var filerKit_o = dlg.find("#filer_input").filer({
                    limit: _options.fs_filer_upload_max_file_num,
                    maxSize: _options.fs_filer_upload_max_filesize, //MB
                    extensions: _options.fs_filer_upload_extensions,
                    //ドロップ領域
                    changeInput: '<div class="jFiler-input-dragDrop" style="width:100%">'+
                                    '<div class="jFiler-input-inner"><span><i class="ui-icon ui-icon-cloud-upload" style="font-size:3em"></i></span>ここへアップロードしたいファイルをドラッグ<BR>'+
                                    '(ファイルの種類:'+_options.fs_filer_upload_extensions.join(',')+')<BR>'+
                                    // '、最大サイズ:'+_options.fs_filer_upload_max_filesize+'MB)<BR>'+
                                    '<BR><a class="jFiler-input-choose-btn blue">ファイルより選択</a>'+
                                    '</div>'+
                                '</div>',
                    showThumbs: true,
                    theme: "dragdropbox",
                    templates: {
                        box: '<ul class="jFiler-items-list jFiler-items-grid"></ul>',
                        //アップロードした時のitem テンプレート
                        item: '<li class="jFiler-item">'+
                                    '<div class="jFiler-item-container">'+
                                        '<div class="jFiler-item-inner">'+
                                            //'<a target="_blank" href="{{fi-url}}">'+
                                            '<div class="jFiler-item-thumb">'+
                                                '<div class="jFiler-item-status"></div>'+
                                                '<div class="jFiler-item-thumb-overlay">'+
                                                    '<div class="jFiler-item-info">'+
                                                        '<div style="display:table-cell;vertical-align: middle;">'+
                                                            '<span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>'+
                                                            '<span class="jFiler-item-others">{{fi-wh}}</span>'+
                                                            '<BR><span class="jFiler-item-others">{{fi-size2}}</span>'+
                                                            '<BR><span class="jFiler-item-others fi_dt">{{fi-datetime}}</span>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                                '{{fi-image}}'+
                                            '</div>'+
                                            //'</a>'+
                                            '<span class="fi_name">{{fi-name}}</span>'+
                                            '<div class="jFiler-item-assets jFiler-row">'+
                                                '<ul class="list-inline pull-left">'+
                                                    '<li>{{fi-progressBar}}</li>'+
                                                '</ul>'+
                                                '<ul class="list-inline pull-right">'+
                                                    (_options.is_btn_ins ? '<li><a class="icon-jfi-plus jFiler-item-plus-action ui-button ui-widget ui-corner-all" img_url="{{fi-url}}">選択</a></li>' : '') +
                                                    (_options.is_btn_del ? '<li><a class="icon-jfi-trash jFiler-item-trash-action ui-button ui-widget ui-corner-all" title="削除します"></a></li>' : '') +
                                                '</ul>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</li>',
                        //files[]で追加する時のitem　テンプレート size2 等予約語
                        itemAppend: '<li class="jFiler-item">'+
                                        '<div class="jFiler-item-container">'+
                                            '<div class="jFiler-item-inner">'+
                                                //'<a target="_blank" href="{{fi-url}}">'+
                                                '<div class="jFiler-item-thumb fs_popup_none">'+
                                                    '<div class="jFiler-item-status"></div>'+
                                                    '<div class="jFiler-item-thumb-overlay">'+
                                                        '<div class="jFiler-item-info">'+
                                                            '<div style="display:table-cell;vertical-align: middle;">'+
                                                                '<span class="jFiler-item-others">{{fi-icon}}</span><span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>'+
                                                                '<span class="jFiler-item-others">{{fi-wh}}</span>'+
                                                                '<BR><span class="jFiler-item-others">{{fi-size2}}</span>'+
                                                                '<BR><span class="jFiler-item-others fi_dt">{{fi-datetime}}</span>'+
                                                                '<BR><span class="jFiler-item-others fi_ext">{{fi-extension}}</span>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    //'<img src="{{fi-url}}" {{fi-attr}}>'+
                                                    //'<embed width="100%" src="{{fi-url}}" {{fi-attr}}>'+
                                                    '<{{fi-tag}} class="lazy" '+($.fn.lazyload?'{{fi-tag_src}}':'src')+'="{{fi-url}}">'+
                                                '</div>'+
                                                //'</a>'+
                                                '<span class="fi_name">{{fi-name}}</span>'+
                                                '<div class="jFiler-item-assets jFiler-row">'+
                                                    '<ul class="list-inline pull-right">'+
                                                        (_options.is_btn_ins ? '<li><a class="icon-jfi-plus jFiler-item-plus-action ui-button ui-widget ui-corner-all" idx="{{fi-id}}" img_url="{{fi-url}}">選択</a></li>' : '') +
                                                        (_options.is_btn_del ? '<li><a class="icon-jfi-trash jFiler-item-trash-action ui-button ui-widget ui-corner-all" title="削除します"></a></li>' : '') +
                                                    '</ul>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</li>',
                        progressBar: '<div class="bar"></div>',
                        itemAppendToEnd: false,
                        canvasImage: true,
                        removeConfirmation: true,
                        _selectors: {
                            list: '.jFiler-items-list',
                            item: '.jFiler-item',
                            progressBar: '.bar',
                            remove: '.jFiler-item-trash-action'
                        }
                    },
                    dragDrop: {
                        dragEnter: null,
                        dragLeave: null,
                        drop: null,
                        dragContainer: null,
                    },
                    uploadFile: {
                        url: _options.ajax.upload_file.url,
                        data: _options.ajax.upload_file.data,
                        type: 'POST',
                        enctype: 'multipart/form-data',
                        synchron: true,
                        beforeSend: function(b, i, g, h, e, d, a, formData) {
                            if ($.cookie !== undefined) {
                                formData.data.append('csrf_token', $.cookie('csrf_cookie'));//add_ajax_param_for_csrf
                            }
                            this.data = _options.ajax.upload_file.data;
                            _options.def_upload = $.Deferred();
                            _options.def_upload.promise();
                        },
                        success: function(data, itemEl, listEl, boxEl, newInputEl, inputEl, id) {
                            if (data) {
                                //var o = JSON.parse(data);
                                var o = data;
                                if (o.status === G.STATUS_OK) {
                                    var parent = itemEl.find(".jFiler-jProgressBar").parent();

                                    var new_file_name = o.file;
                                    var filerKit = inputEl.prop("jFiler");
                                    if (filerKit.files_list[id] === undefined) filerKit.files_list[id] = {};
                                    filerKit.files_list[id].name = new_file_name;
                                    $(itemEl).find('[img_url]').attr('img_url', o.url);
                                    itemEl.find(".jFiler-jProgressBar").fadeOut("slow", function() {
                                        $("<div class=\"jFiler-item-others text-success\"><i class=\"icon-jfi-check-circle\"></i>成功</div>").hide().appendTo(parent).fadeIn("slow");
                                    });
                                    _on_filer_upload_ok(1, dlg);
                                } else {
                                    var parent = boxEl.find('.jFiler-input-dragDrop').parent();
                                    itemEl.find(".jFiler-jProgressBar").fadeOut("slow", function() {
                                        //$("<div class=\"jFiler-item-others text-error\"><i class=\"icon-jfi-minus-circle\"></i>エラー:"+o.msg+"</div>").hide().appendTo(parent).fadeIn("slow");
                                        if (o.msg) { alert(o.msg); }//暫定
                                    });
                                }
                                _options.def_upload.resolve(o); //(data, itemEl, listEl, boxEl, newInputEl, inputEl, id);
                            }
                        },
                        error: function(el) {
                            var parent = el.find(".jFiler-jProgressBar").parent();
                            el.find(".jFiler-jProgressBar").fadeOut("slow", function() {
                                $("<div class=\"jFiler-item-others text-error\"><i class=\"icon-jfi-minus-circle\"></i>エラー</div>").hide().appendTo(parent).fadeIn("slow");
                            });
                            _options.def_upload.reject(el);
                        },
                        statusCode: null,
                        onProgress: null,
                        onComplete: function(itemEl) {//(itemEl, file, id, listEl, boxEl, newInputEl, inputEl)
                            //var items=itemEl.find('.jFiler-item-container');
                            //dlg.find('.status_bar').text(items.length+'件');
                            _options.def_upload.done(function(a, b, c) {
                                dlg.find("#view_reload").trigger('click');
                            });
                        }
                    },
                    files: _dlg_files, //初期表示一覧のファイル
                    addMore: true,		 //上記を追加するか?
                    allowDuplicates: true,
                    clipBoardPaste: true,
                    excludeName: null,
                    //beforeRender: null,
                    //afterRender: null,
                    beforeShow: function(f, ev /*l, p, o, s*/) {
                        var is_show = 1;
                        if (ev === undefined) {
                            var cnt = _dlg_files.length - _m.page.cnt - 1;
                            var is_show = _m.page.from <= cnt && cnt <= _m.page.to ? 1 : 0;
                            _m.page.cnt++;
                        }
                        return is_show;
                    },
                    afterShow: function() {
                        if ($.fn.lazyload) {
                            var imgs = dlg.find('.lazy');//(img|embed).lazy
                            if (imgs.length === 1) {
                                $('#loading').show();
                            }
                            var is_not_page = _m.page.cnt < _m.page.UNIT && _m.page.is_page_change == 0;
                            var is_all_load;
                            if (is_not_page) {
                                is_all_load = imgs.length == _dlg_files.length;
                            } else {
                                is_all_load = imgs.length == ((_m.page.is_page || _m.page.is_page == -1) ? _m.page.page_num : _dlg_files.length);
                            }
                            if (is_all_load) {
                                imgs.lazyload();
                                $('#loading').fadeOut(300);

                                if (0) {
                                    $('.jFiler-item-container')
                                        .each(function(i) {
                                            var o = $(this);
                                            var mw = parseInt(o.css('width'));
                                            var mh = parseInt(o.css('height'));
                                            var id = '__r' + i;
                                            o.attr('id', id);
                                            o.resizable({
                                                alsoResize: '#' + id + ' .jFiler-item-thumb'
                                                , minWidth: mw, minHeight: mh
                                            });
                                        })
                                        .draggable({
                                            //      snap:'div.obj',
                                            //        accept: ".drop",
                                            //        revert: "invalid",
                                            //        containment: "parent",
                                            //        helper: "clone",
                                            cursor: "move",
                                            //cursorAt: { top: 0, left: 100 }
                                            scroll: true
                                        })
                                        ;
                                }
                            }
                        }
                        return true;
                    },
                    beforeSelect: null,
                    onSelectBefore: function(itemEl, file, id, listEl, boxEl, newInputEl, inputEl) {
                        this.uploadFile.data = _options.ajax.upload_file.data;
                    },
                    //					onSelect: function(itemEl, file, id, listEl, boxEl, newInputEl, inputEl){
                    //						// _options.def_upload.done(function(a,b,c){
                    //						// 	dlg.find( "#view_reload" ).trigger('click');
                    //						// });
                    //					},
                    onRemove: function(itemEl, file, id, listEl, boxEl, newInputEl, inputEl) {
                        var filerKit = inputEl.prop("jFiler");
                        var file_name = filerKit.files_list[id].file.name;
                        var defferd = _on_filer_remove(file_name);

                        if (1) {
                            dlg.find("#view_reload").trigger('click');
                        } else {
                            //画像ITEMの高さ調整
                            setTimeout(function() {
                                var items = listEl.find('.jFiler-item-container');
                                var smsg = '';
                                if (_m.page.is_page) {
                                    var n = listEl.find('.jFiler-item-container:visible').length;
                                    smsg = _dlg_files.length + ' 件中 ' + (_m.page.from + 1) + ' ～ ' + (_m.page.to + 1) + ' (' + n + '件フィルタ表示)';
                                } else {
                                    smsg = items.length + '件中' + n + '件表示';
                                }
                                dlg.find('.status_bar').text(smsg);
                                if (items.matchHeight) {
                                    items.matchHeight();
                                }
                            }, 500);
                        }
                        defferd.always(function(data) {
                            if (data.status === G.STATUS_OK) {
                                _on_filer_remove_ok(1, dlg);
                            } else {
                                alert(data.msg);
                            }
                        });
                    },
                    onEmpty: null,
                    options: null,
                    dialogs: {
                        alert: function(text) {
                            return alert(text);
                        },
                        confirm: function(text, callback) {
                            confirm(text) ? callback() : null;
                        }
                    },
                    captions: {
                        button: "Choose Files",
                        feedback: "Choose files To Upload",
                        feedback2: "files were chosen",
                        drop: "Drop file here to Upload",
                        removeConfirmation: _msg.MSG_FILE_DELETE, //Are you sure you want to remove this file?",
                        errors: {
                            filesLimit: "同時にアップロードできるファイル数の上限は {{fi-limit}} です。",
                            filesType: "アップロードしようとしたファイルは、許可されていない種類です。",
                            filesSize: "「{{fi-name}}」のファイルサイズが大きすぎます。{{fi-maxSize}} MB以下のサイズのファイルを指定して下さい。",
                            filesSizeAll: "全ファイルの合計サイズが大きすぎます。 {{fi-maxSize}} MB以下になるように指定して下さい。"
                        }
                    }
                });
                //ファイルアップロードファイラー PTR
                _filer_input_obj = filerKit_o.prop("jFiler");

                //ファイルアップロードファイラー 位置を　ドラッグ領域の後ろへ
                //dlg.find('.jFiler-input-dragDrop').after(dlg.find('#fl_tool'));

                //挿入ボタン
                $(_selector).on('click', '.jFiler-item-plus-action', function(e) {
                    var o = $(this);
                    var img_url = o.attr('img_url');
                    var idx = o.attr('idx');
                    if (idx == "") idx = 0;
                    var d = _dlg_files[_dlg_files.length - 1 - idx];
                    _this.on_filer_insert(d.url ? d.url : d.file, d, _dlg, _options);
                    //_this.on_filer_insert(d.file);
                });



                //クリックで選択
                dlg.on('click', '.jFiler-item-container', function(event) {
                    //event.preventDefault();
                    if ($(event.target).is('.jFiler-item-container,.jFiler-item-inner')) {
                        var o = $(this);
                        var sel = o.data('s') == 0 ? o.data('s') : 1;
                        o.css('border', sel ? '4px solid #0000FF' : '');
                        o.data('s', 1 - sel);
                    }
                });

                //ShortcutKey
                $(document).keydown(function(event) {
                    if (event.ctrlKey && event.shiftKey) {
                        switch (event.keyCode) {
                            case 76:///ﾌｨﾙﾀﾘｾｯﾄ:Ctrl+Shift+L
                                $(_selector_search_name).val('').trigger('change');
                                break;
                            case 70://フィールドをフォーカス(Ctrl+Shift+F)
                                $(_selector_search_name).focus().select();
                                break;
                        }
                    }
                });
            }
        }, dlg_opt));

        if ($.fn.dialogExtend && _options.fs_filer_inline_target == null) {
            _dlg.dialogExtend({
                'closable': true
                , 'maximizable': true
                , 'minimizable': false
                , 'minimizeLocation': 'left'
                , 'collapsable': false
                , 'dblclick': 'maximize'
                , 'titlebar': false
                , 'maximize': function(evt, a, b, c) {
                    var dlg = $(this);
                    var h = dlg.dialog('option', 'height');
                    _dlg_opt_ex.on_resize(dlg, h);
                }
                , 'restore': function(evt, a, b, c) {
                    var dlg = $(this);
                    var h = dlg.dialog('option', 'height');
                    _dlg_opt_ex.on_resize(dlg, h);
                }
            });
        }

        return _dlg;
    }
    function _on_ajax_get_files(data) {
        if (data.dir_files === undefined) {
            data.dir_files = [];
            _dlg_files = [];
            _dlg_files_date = {};
            return;
        }
        _dlg_files = data.dir_files;
        _dlg_files_date = {};
        for (var i = 0; i < _dlg_files.length; i++) {
            var ymd;
            if (data.format == 1) {
                ymd = _dlg_files[i].datetime.substr(0, 10).replace(/\//g, '');
            } else {
                ymd = _dlg_files[i].datetime.substr(0, 8);
            }
            if (_dlg_files_date[ymd] === undefined) {
                _dlg_files_date[ymd] = 1;
            } else {
                _dlg_files_date[ymd]++;
            }
        }
    }

    function _on_filer_remove(file) {
        return ch_ajax({
            'url': _options.ajax.remove_file.url
            , 'data': $.extend({ 'file': Array.isArray(file) ? file : [file] }, _options.ajax.remove_file.data)
        });
    }
    function _on_filer_remove_ok(num, dlg) {
        num = num || 1;
        if (_options.is_select_dir) {
            var o = dlg.find('#select_dir option:checked');
            //'top (460)'->'top (459)'
            var tok = o.text().replace(')', '(').split('(');
            var t = tok[0] + '(' + (parseInt(tok[1]) - num) + ')';
            o.text(t);
        }
    }
    function _on_filer_upload_ok(num, dlg) {
        num = num || 1;
        if (_options.is_select_dir) {
            var o = dlg.find('#select_dir option:checked');
            //'top (460)'->'top (461)'
            var tok = o.text().replace(')', '(').split('(');
            var t = tok[0] + '(' + (parseInt(tok[1]) + num) + ')';
            o.text(t);
        }
    }
    function toggle() {
        if (_dlg.is(':visible')) {
            if (_dlg.dialog('option', 'modal')) {
                _dlg.dialog('close');
            }
        } else {
            _dlg.dialog('open');
        }
    }
    function set_filer_dir(dir) {
        if (dir !== undefined) {
            _options.ajax.get_files.data.dir = dir;
            _options.ajax.upload_file.data.dir = dir;
            _options.ajax.remove_file.data.dir = dir;
        }
    }

    $.extend(this, {
        //public Methods
        "toggle": toggle,
        "set_filer_dir": set_filer_dir,
//        "on_filer_remove": _on_filer_remove,

        // Events
        "on_filer_insert": function(img_url, img_data, dlg, options) { }
    });

    init(_selector);
}
