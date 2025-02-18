//***************************************************************************
//共通機能
//***************************************************************************

//===========================================================================
// ■
//===========================================================================
const g_isTouch = ('ontouchstart' in window);
const G_PATH_JS_LIB = '';
const G_LANG = 'ja';
const G_DEBUG = 0;
const G = {
	//AJAX通信API関連定数
	 STATUS_OK:     			0	//(0)成功
	,STATUS_NG:     			1	//(0b00000001)失敗 一般
	,STATUS_NG_VALIDATION:      2	//(0b00000010)失敗 入力エラー

	//汎用定数
	,M_NEW:                     1	//(0b00000001)
	,M_INSERT:                  2	//(0b00000010)
	,M_UPDATE:                  4	//(0b00000100)
	,M_UPSERT:                  8	//(0b00001000)
	,M_DELETE:                 16	//(0b00010000)

	,INT_MAX: 			2147483647	//整数(4byte)最大 0x7FFFFFFF ==PHP_INT_MAX== TSQL int max
	,INT_MIN: 		   -2147483648	//整数(4byte)最小 0x80000000 ==PHP_INT_MIN== TSQL int min

	//
	//メッセージ
	//
	//メッセージ 共通
	,MSG_CONFIRM_REORDER_OK:	'並べ替えを保存しますか？'
	,MSG_CONFIRM_ROWEL_OK:		'{{target}}を削除しますか？'

	,MSG_AJAX_FAIL:				'通信処理に失敗しました。'
	,MSG_AJAX_FAIL_STATUS:		'通信処理に失敗しました。<br>{{textStatus}}'
	,MSG_AJAX_FAIL_TIMEOUT:		'通信処理がタイムアウト時間%d(ms)を超えました。'
	,MSG_AJAX_FAIL_TIMEOUT_RETRY:'通信処理がタイムアウト時間%1%(ms)超えました。リトライを%2%回目。'

	//ローディングイコン
	,LOADDING_ICON: '/img/ico/loading/spin1-white.svg'

	,LOADDING_FADE_OUT: 300

};

const g={
	on_header_ready: function(lang){
//		if(typeof(moment)!=="undefined"){
//			//moment.js 日本語リソース 設定
//			moment.locale('ja',{months:'1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),monthsShort:'1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),weekdays:'日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),weekdaysShort:'日_月_火_水_木_金_土'.split('_'),weekdaysMin:'日_月_火_水_木_金_土'.split('_'),longDateFormat:{LT:'Ah時m分',LTS:'Ah時m分s秒',L:'YYYY/MM/DD',LL:'YYYY年M月D日',LLL:'YYYY年M月D日Ah時m分',LLLL:'YYYY年M月D日Ah時m分dddd'},meridiemParse:/午前|午後/i,isPM:function(input){returninput==='午後';},meridiem:function(hour,minute,isLower){if(hour<12){return'午前';}else{return'午後';}},calendar:{sameDay:'[今日]LT',nextDay:'[明日]LT',nextWeek:'[来週]ddddLT',lastDay:'[昨日]LT',lastWeek:'[前週]ddddLT',sameElse:'L'},ordinalParse:/\d{1,2}日/,ordinal:function(number,period){switch(period){case'd':case'D':case'DDD':returnnumber+'日';default:returnnumber;}},relativeTime:{future:'%s後',past:'%s前',s:'数秒',m:'1分',mm:'%d分',h:'1時間',hh:'%d時間',d:'1日',dd:'%d日',M:'1ヶ月',MM:'%dヶ月',y:'1年',yy:'%d年'}});
//		}
//	    //データテーブル デフォルトの設定を変更
//	    $.extend( $.fn.dataTable.defaults, g.dt_defaults_add );

//		//JSのエラー時
//		window.onerror = function (msg, file, line, column, err) {
////alert( file + ':' + line +'\\n' + msg + '\\nerr.stack:\\n'+err.stack);
//
//			//エラーを送信
//			err['msg']=msg;
//			err['file']=file;
//			err['line']=line;
//			err['line']=column;
//			$.post('ch_js_err.php',err);
//		};

	}
	,on_document_ready: function(lang){
		$('<div id="loading" style="position:fixed;display:none;top:35%;left:50%;z-index:10000"><img src="'+G.LOADDING_ICON+'" width="'+(g.is_sp?'240':'60')+'"></div>').appendTo('body');

	    $.ajaxSetup({
	        // data: {
	        //      csrf_token: $.cookie('csrf_cookie')
	        // }
			beforeSend: function( xhr,settings ) {
				$('#loading').show();
				if(settings.data!==undefined && $.cookie!==undefined){
					if( settings.processData==false){ //Ajaxがdataを整形しない指定
						if(settings.data.set !== undefined){
							settings.data.set("csrf_token",$.cookie('csrf_cookie'));//add_ajax_param_for_csrf
						}else if(settings.data.append !== undefined){
							settings.data.append("csrf_token",$.cookie('csrf_cookie'));//add_ajax_param_for_csrf
						}
					}else{
						var data = params_r(settings.data);
						data['csrf_token'] = $.cookie('csrf_cookie');//add_ajax_param_for_csrf
						settings.data=$.param(data);
					}
				}
				return true;
			}
			,complete : function( xhr, textStatus){
				$('#loading').fadeOut(300);
			}
	    });
	}

	,"pfilter": {
		html_buttons: '\
<label style="float:left" for="all">ALL</label><input type="radio" class="flt_btn" name="flt_btn_all" id="all">\
<fieldset style="float:left">\
<label r="a" for="aa">あ</label><input type="radio" class="flt_btn" name="flt_btn_a" id="aa">\
<label r="i" for="ai">い</label><input type="radio" class="flt_btn" name="flt_btn_a" id="ai">\
<label r="u" for="au">う</label><input type="radio" class="flt_btn" name="flt_btn_a" id="au">\
<label r="e" for="ae">え</label><input type="radio" class="flt_btn" name="flt_btn_a" id="ae">\
<label r="o" for="ao">お</label><input type="radio" class="flt_btn" name="flt_btn_a" id="ao">\
<label r="k" for="ak">か</label><input type="radio" class="flt_btn" name="flt_btn_a" id="ak">\
<label r="s" for="as">さ</label><input type="radio" class="flt_btn" name="flt_btn_a" id="as">\
<label r="t" for="at">た</label><input type="radio" class="flt_btn" name="flt_btn_a" id="at">\
<label r="n" for="an">な</label><input type="radio" class="flt_btn" name="flt_btn_a" id="an">\
<label r="h" for="ah">は</label><input type="radio" class="flt_btn" name="flt_btn_a" id="ah">\
<label r="m" for="am">ま</label><input type="radio" class="flt_btn" name="flt_btn_a" id="am">\
<label r="y" for="ay">や</label><input type="radio" class="flt_btn" name="flt_btn_a" id="ay">\
<label r="r" for="ar">ら</label><input type="radio" class="flt_btn" name="flt_btn_a" id="ar">\
<label r="w" for="aw">わ</label><input type="radio" class="flt_btn" name="flt_btn_a" id="aw">\
</fieldset>\
'

		,html_buttons_lv: '\
<fieldset style="float:left">\
<label for="lab">AB</label><input type="radio" class="flt_btn" name="flt_btn_l" id="lab">\
<label for="lc">C</label><input type="radio" class="flt_btn" name="flt_btn_l" id="lc">\
<label for="ld">D</label><input type="radio" class="flt_btn" name="flt_btn_l" id="ld">\
<label for="lef">EF</label><input type="radio" class="flt_btn" name="flt_btn_l" id="lef">\
</fieldset>\
'
		,html_buttons_cnt: '\
<fieldset style="float:left">\
<label ct="10" for="c10" title="参加回数10回以上">10</label><input type="radio" class="flt_btn" name="flt_btn_c" id="c10">\
<label ct="50" for="c50" title="参加回数50回以上">50</label><input type="radio" class="flt_btn" name="flt_btn_c" id="c50">\
</fieldset>\
'

		,on_btn_click : function(evt,id){
			var dlg= $(this)
			var btn = $(evt.currentTarget);
			//var dlg = btn.closest('div').siblings('#selectwin_body');
			//var dlg = btn.closest('div').parent('div');

			//sel_win_player_filter
		   	var t=btn.prev('label').text();
			switch(t){
			case 'ALL':
		        dlg.find('[name=flt_btn_a]:checked').prop('checked',false);dlg.find('[name=flt_btn_a]').checkboxradio( "refresh" );
		        dlg.find('[name=flt_btn_l]:checked').prop('checked',false);dlg.find('[name=flt_btn_l]').checkboxradio( "refresh" );

		        //do
		        dlg.find('ul li').show();
			    break;
			default:
			    {
		    	//アルファベット LV count filter
		        dlg.find('[name=flt_btn_all]:checked').prop('checked',false);dlg.find('[name=flt_btn_all]').checkboxradio( "refresh" );
			    dlg.find('ul li').hide();

		        //do
		        var flt_btn_a = dlg.find('[name=flt_btn_a]:checked').prev('label').attr('r');
		        var flt_btn_l = dlg.find('[name=flt_btn_l]:checked').prev('label').text()
		        var flt_btn_ct = dlg.find('[name=flt_btn_c]:checked').prev('label').attr('ct');

			    var sel='ul li';
			    if(flt_btn_a){
					sel+='[r^='+flt_btn_a+']';
				}

			    switch(flt_btn_l){
		        case '':break;
		        case 'AB': sel = sel + '[l^=A],' + sel + '[l^=B]';break;
		        case 'EF': sel = sel + '[l^=E],' + sel + '[l^=F]';break;
		        default:   sel += '[l^='+flt_btn_l+']';break;
		        }
			    if(flt_btn_ct){
					sel+='[ct='+flt_btn_ct+']';
				}

			    dlg.find(sel).show();break;
			    }
			    break;
		    }
		}
	}
	,tid:0
	//Player補助説明追加イベント
	,on_events_for_player_status : {
    	'mouseenter':function(e){
    	    var s =$(this);
            var d =$('div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix:visible');
            var li_info = d.find('#li_info');
            if(li_info.length==0){
                d.prepend( $('<span id="li_info"></span>') );
                li_info = d.find('#li_info');
            }
            var word=s.text();
            var pname= word.split('(')[0];
            var o = $('span.pop_plr[p="'+pname+'"]');
            var pid=null;
            if(o.length>0){
                //id=p_$(id)
                pid = o.attr('id').substr(2);//ID取得
            }
            if(word.indexOf('閉じる')==-1 && word.indexOf('クリア')==-1 )
            {
                //var url0='ajax.php?method=player&table&q='+word;
                var url0;
                var ymd_param = (g_params.y ? ('&y='+g_params.y) : '' ) + (g_params.m ? ('&m='+g_params.m) : '' ) + (g_params.d ? ('&d='+g_params.d) : '' );
                if(pid){
                    url0='ajax.php?lang='+g.lang+'&method=player&is_id=1&q='+pid+ymd_param;
                }else{
                    url0='ajax.php?lang='+g.lang+'&method=player&q='+word+ymd_param;
                }
   			    li_info.html('<img src="icon/ajax-loader-small.gif">now loading...');
                //li_info.hide({effect: "slide",direction: "left",duration:300,easing:'easeOutQuart'});//INFO:fltwin
   			    var h='<img src="im/tennis_player.gif">「'+word+'」<BR>';
// 			    var tid=s.data('tid');
   			    if(g.tid!==undefined){
    				window.clearTimeout(g.tid);
//l('clearTimeout:'+g.tid);
    			}
                g.tid=window.setTimeout( function(a,b){
        			$.ajax({
        			   url: url0,
        			   timeout: 5000
        			})
        			.done(function(data, textStatus, jqXHR){
                        li_info.html(h+data);
                        //li_info.show({effect: "slide",direction: "down",duration:300,easing:'easeOutQuart'});

						//スキルグラフ for フィルタウインドウ
                        var skdata = li_info.find('#skdata');
						var skill_data=skdata.data('skill');
						if(skill_data!=undefined){
							var totalVals = skdata.data('skill').split(',');
							var spk_opt_fltwn = {
							    title:'バドスキル',
								animate: true,
							    seriesColors: g.skillcol_fltwin,
							    axesDefaults: {
							        min: 0,
							        max: 100
							    },
							    seriesDefaults:{
							        pointLabels: { show: true },
							        renderer:$.jqplot.BarRenderer,
							        rendererOptions: {
							            varyBarColor: true,
							            barPadding: 1,
							            //barMargin: 10
							            //barDirection: 'vertical', // vertical or horizontal.
							            barWidth: 12,
							            animation : {
							                speed: 500,
							                easing: 'easeOutQuart'
							            }
							        }
							    },
							    axes:{
							        xaxis:{
							            renderer: $.jqplot.CategoryAxisRenderer,
							            tickRenderer: $.jqplot.CanvasAxisTickRenderer,//canvasAxisTickRenderer
							            tickOptions: {
							                //formatString: "%b %e",
							                angle: -50,
							                textColor: '#000000',
							                fontSize : '8pt',
							                fontWeight : 'normal'
							            }
							        }
							        ,yaxis:{
										ticks: [ 0, 25, 50, 75, 100 ]
							            ,tickOptions: {
							                formatString: "%d", //%d： 整数%f： 小数%g： データ値%s:文字列
										}
									}
							    }
							};
							var css_spk = g.is_sp ? {'float':'left','padding':'4px','width':'32em','height':'18em','font-size':'1.5em'} : {'float':'left','padding':'4px','width':'34em','height':'18em'};
							$('#skill_graph').css(css_spk).jqplot([ _.zip(g.skills_fltwin, totalVals ) ],spk_opt_fltwn ); //m_spk_opt m_spk_opt_fltwn
						}
        			}).fail(function(data, textStatus, errorThrown){
                        li_info.html(errorThrown);
        			}).always(function(data, textStatus, returnedObject){

        			});
        		},500);
//l('setTimeout:'+g.tid);
//        		s.data('tid',tid);
    		}
        }
        ,'mouseleave':function(){
//                        var d =$('div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix:visible');
//                        var li_info = d.find('#li_info');
//                        li_info.html('');
        }
    }
	,skills_css_filtwin : {'float':'left','padding':'4px','width':'44em','height':'10em'}
	,skills_fltwin : ['ドライブ','スマッシュ','プッシュ','ドロップ','カット','サーブ','ヘアピン','ロブ','クリアー','レシーブ','Sレシーブ','フットワーク','フォーメーション','勝負強さ','安定性','美しいプレイ度','☆']
	,skillcol_fltwin : ["#ffd700","#ff0000","#8b0000","#ff69b4","#ffb6c1","#ffff00","#bdb76b","#87ceeb","#00ffff","#3030FF","#0000cd","#006400","#00ff00","#E0E0FF","#E0E0FF","#E0E0FF","#E0E0FF"]

	,dialog_options: {
		show: {
			effect: "fade"
			,duration:150
    		,easing:'swing'
		}
//		,show: { //for PC
//			effect: "fade"
//			,duration:300
//    		,easing:'easeOutQuart'
//		}
		,show_slow: {//for Ajax
			effect: "fade"
			,duration:300
    		,easing:'swing'
		}
		,hide: {
			effect: "fade"
			,duration:50
    		,easing:'easeOutQuart'
		}
		,draggable:true
		,resizable:true
	}
	//データテーブル ディフォルト オプション
	,dt_defaults_add: {
        language: {
            "url": G_PATH_JS_LIB+"/DataTables/i18n/dt_"+G_LANG+".json"
//            ,"loadingRecords": "通信中…"
	        ,select: {
				info: false
	            ,cells: "" //%d セル 選択
				,rows: "" //%d 行 選択
	        }
        }
    }
	//データテーブル 初期化 オプション
	,dt_options: {
        // 表示件数切り換えSELECTBOXのLIST
        lengthMenu: [[ 10, 20, 50, 100, 200, -1 ],['10件', '20件', '50件', '100件', '200件', '全件' ]]

		//Ajax通信 data パラメタ
		,on_ajax_data : function ( data, api ){
//l('■API DataTable\n'+(api==undefined?'(unknown url)':api.ajax.url())+'?\n'+JSON.stringify(data,null, "  ") );
			return data;
		}
		//Ajax通信 開始時
		,on_preXhr_dt : function (e, settings, data){
			$('#loading').show();
			return false;
		}
		//Ajax通信 完了時
		,on_xhr_dt : function (e, settings, json, xhr){
			var api = $.fn.dataTable.Api( settings );
			$("#loading").fadeOut(G.LOADDING_FADE_OUT);

			var is_return=false;
			if(xhr.status!=200){
				var msg=xhr.responseJSON ? xhr.responseJSON.msg : G.MSG_AJAX_FAIL;
				alert(msg);
				//ch_alert(msg,{'title':'通信エラー', dialog_class:'alert'});
				$('.dataTables_empty').text(msg);
				is_return=true;
				g['data_bakup']=api.data(); //データを保存
				return is_return;
			}
			//HTTTステータス成功時
			//VALIDATION エラー
			if(json && json.status===G.STATUS_NG_VALIDATION && json.msg ){
				//ch_inline_msg(json.msg ? json.msg : G.MSG_AJAX_FAIL);
				is_return=true;
				g['data_bakup']=api.data(); //store data
				return is_return;
			}
			//データがない場合
			if(json===null || json.data===undefined || json.data==null || json.data.length===0){
				if(json && json.msg){
					settings.oLanguage.sEmptyTable=json.msg; //データテーブルのデータなしのメッセージ変更
				}
			}

			return is_return;
		}
		//
		,on_dataSrc : function ( json,options ){
			var options = options || {};
if(json.sql!==undefined)l('★sql DataTable-ajax\n'+json.sql);
			if(json.status!==G.STATUS_OK){
				//ch_inline_msg(json.msg ? json.msg : G.MSG_AJAX_FAIL);
				return (g.data_bakup===undefined ? [] : g.data_bakup );//あれば保存していたデータを使用する
			}

			//for client reorder
			if( options && options.disp_order_column!==undefined ){
				if(json.data && json.data.length>0){
					var idx=options.disp_order_column;
					//do_seq = json.data[0][idx]==0 || json.data[json.data.length-1][idx]==G.INT_MAX;
					var do_seq=1;//並んだSEQを入れる
					if(do_seq){
						var disp_order_column_top = options.disp_order_column_top===undefined ? 0 : options.disp_order_column_top;
						for(var i=0;i<json.data.length;i++){
							json.data[i][idx]=disp_order_column_top+i+1;
						}
					}
				}
			}
			if(json.data===undefined)json.data=[];
			return json.data;
		}
		//行削除の時
		,on_row_delete: function(_this, url, dt_table, col_idx_del, col_idx_title){
    		var sel_indexs = [];
	    	var is_row_multi_sel;
	    	var rows = dt_table.rows( { selected: true } ); //選択機能あり(複数含む)の場合
	    	if( rows[0].length>0){
	    		sel_indexs = rows[0];
	    		is_row_multi_sel=1;
	    	}else{
				var row = dt_table.row( $(_this).parents('tr') ); //選択機能ない場合
				sel_indexs = [ row.index() ];
				is_row_multi_sel=0;
			}

			//削除一覧取得
	    	var titles='';
			if(col_idx_title!==undefined){
		    	var data = dt_table.data();
		    	var del_ids=[];
		    	for( var i=0;i<sel_indexs.length;i++ ){
					var d=data[sel_indexs[i]];
					del_ids[i] = d[col_idx_del];
					titles += '「'+d[col_idx_title] +'」\n';
				}
			}
			var msg = G.MSG_CONFIRM_ROWEL_OK.replace('{{target}}',titles);
			var deferredAjax;
	        if( confirm(msg) ){
				//削除リクエスト
				deferredAjax = ch_ajax({'url':url,'data':{'ids':del_ids}})
					.always(function(data, textStatus, returnedObject){
						//ch_inline_msg(data.msg);
						if(is_row_multi_sel){
							rows.remove().draw( false );
						}else{
							row.remove().draw( false );
						}
					});
			}
			return deferredAjax;
		}

		//カラム描画方法(日付時間)
		,colum_render_yyyymmddhhmmss: function ( data, type, row ) {
			if(type==='display'){
				var m=moment(data);//yyyymmdd
				var s=m.format('YYYY/MM/DD HH:mm:ss');
				return g.get_html_day(m,s);
            }else{
				return data;
			}
        }
		//カラム描画方法(日付曜日)
		,colum_render_yyyymmdd: function ( data, type, row ) {
			if(type==='display'){
				var m=moment(data);//yyyymmdd
				var s=m.format('YYYY/MM/DD(dd)');
				return g.get_html_day(m,s);
            }else{
				return data;
			}
        }
		//カラム描画方法(日付曜日)履歴用
		,colum_render_yyyymmdd_hist: function ( data, type, row ) {
			switch(type){
			case 'display':
				var yyyy = data.substr(0,4);
				var mm = data.substr(4,2);
				var dd = data.substr(6,2);
				var m=moment(data);//yyyymmdd
				var s=m.format('YYYY/MM/DD(dd)');
				var html = g.get_html_day(m,s);
				var mi = parseInt(mm);
				var circle=row[5];//DT_IDX_CIRCLE_ID
				html = '<img class="spbico" src="'+g.get_month_icon(mi)+'">'+html;
				html = '<a href="member.php?circle='+circle+'&y='+yyyy+'&m='+mm+'#'+dd+'">'+html+'</a>';
				ret  = html;
				break;
			case 'filter':
				var m=moment(data);//yyyymmdd
				var s=m.format('YYYY/MM/DD(dd)');
				ret = s;
				break;
			default:
				ret = data;break;
			}
			return ret;
        }
	}
	,get_html_day: function (m,s){
		var weekday=m.weekday();
		var ymd=m.format('YYYYMMDD');
		if(weekday==0){ //日
			return '<span class="col_sun">'+s+'</span>';
		}else if(weekday===6){//土
			return '<span class="col_sat">'+s+'</span>';
		}else if( $.datepicker.regional[G_LANG].holidays[ymd] ){//祝日
			return '<span class="col_hol">'+s+'</span>';
        }else{
			return s;
		}
    }
	,get_month_icon: function( m ){
		return 'icon/month/'+m+'.gif';
	}

    ,datepicker_options: {
        dateFormat : 'yy-mm-dd',
        buttonImage: "im/calender2.gif",
        buttonImageOnly: true,
        buttonText: '',
        showOn: "both",
        showButtonPanel: true,
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: false,
        beforeShowDay: function ( date ){
            var jq_days_enable = $(this).datepicker('option','jq_days_enable');//選択可能日付(拡張オプション)
            var ret = [];
            var y = date.getFullYear();
            var m = g.printf02d( date.getMonth()+1 );
            var d = g.printf02d( date.getDate() );
            var ymd = y+m+d;

            var order_num=null;
            if(jq_days_enable){
                order_num = jq_days_enable[ymd];
                ret[0] = order_num===undefined ? false : true; //日付があれば選択可能
            }else{
                ret[0] = true;
            }

            //休日であれば休日のスタイルにする
            if( jQuery.datepicker.regional['ja'] && jQuery.datepicker.regional[ "ja" ].holidays[ y+m+d ]!==undefined ){
                ret[1] += ' holiday';
            }
            if( order_num!==null ){ ret[2] = order_num+''; } //ツールチップ
            return ret;
        },
        beforeShow : function(input) {
           setTimeout(function() {
                //クリアボタン追加
               var buttonPane = $(input).datepicker('widget').find('.ui-datepicker-buttonpane');
               $('<button>', { text: 'クリア',
                                click: function() {
                                    $.datepicker._clearDate(input);
                                }
                              }).appendTo( buttonPane ).addClass('ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all');
           }, 1 );
        },
        onChangeMonthYear: function(year, month, instance) {
            //クリアボタン追加
            setTimeout(function() {
                var buttonPane = $(instance).datepicker('widget').find('.ui-datepicker-buttonpane');
               $('<button>', {text: 'クリア',
                               click: function() {
                                   $.datepicker._clearDate(instance.input);
                               }
                           }).appendTo( buttonPane ).addClass('ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all');
           }, 1 );
       }
    }

	//TinyMCE 初期化 オプション
	,tiny_options: {
//		selector: ''
		language_url: G_PATH_JS_LIB+'/tinymce/js/tinymce/langs/'+G_LANG+'.js'
		,theme: 'modern'
		,content_css: 'jslib/ch_tiny_body.css'
		,body_class: 'ch_tiny_body'
//		content_css: 'css/content.css',
//		,width: 600
//		,height: 300
		,nowrap : true
		,plugins: [
			'advlist autolink link image imagetools lists charmap print preview hr anchor pagebreak spellchecker',
			'searchreplace wordcount visualblocks visualchars code fullscreen',
			'insertdatetime media nonbreaking save table contextmenu directionality',
			'emoticons template paste textcolor colorpicker textpattern codesample toc help'
	      //有償Plugin: advcode media etc..
	      //Stock Plugin:
		]
		,menubar: true
	    ,toolbar1: 'code | undo redo | styleselect fontselect  fontsizeselect bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify outdent indent'
	    ,toolbar2: 'bullist numlist | hr emoticons link image ch_filer media '+ //ch_filer 画像挿入(OriginalPlugin)
	              ' | table | fullscreen print preview | searchreplace | help'

		,relative_urls: false
		,fontsize_formats: '8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 36pt' //for fontsizeselect
//		"ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "Meiryo UI", メイリオ, Verdana, "ＭＳ Ｐゴシック", sans-serif
//		,font_formats: '"Hiragino Kaku Gothic Pro,Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;AkrutiKndPadmini=Akpdmi-n' //for fontselect fontsizeselect
	    ,image_advtab: true

		//code plugin option
		,code_dialog_width:  parseInt($(window).width()*0.8)
		,code_dialog_height: parseInt($(window).height()*0.8)
		,

		//---------------------------------------------------------------------------
		//イメージアップロードに関する処理
		//---------------------------------------------------------------------------
		// enable title field in the Image dialog
		image_title: true,

		// enable automatic uploads of images represented by blob or data URIs
		automatic_uploads: true,
		// URL of our upload handler (for more details check: https://www.tinymce.com/docs/configure/file-image-upload/#images_upload_url)

		images_upload_url: '/api/images_upload',

		// here we add custom filepicker only to Image dialog
		file_picker_types: 'image',

		// and here's our custom image picker
		file_picker_callback: function(cb, value, meta) {
	      var editor = this;
	      var editor_dom=document.querySelector('#'+editor.id);//ch_add
			var input = document.createElement('input');
			input.setAttribute('type', 'file');
			input.setAttribute('accept', 'image/*');

			// Note: In modern browsers input[type="file"] is functional without
			// even adding it to the DOM, but that might not be the case in some older
			// or quirky browsers like IE, so you might want to add it to the DOM
			// just in case, and visually hide it. And do not forget do remove it
			// once you do not need it anymore.

			input.onchange = function() {
				var file = this.files[0];

				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function () {
				// Note: Now we need to register the blob in TinyMCEs image blob
				// registry. In the next release this part hopefully won't be
				// necessary, as we are looking to handle it internally.
				var id = 'blobid' + (new Date()).getTime();
				var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
				var blobInfo = blobCache.create(id, file, reader.result);
		        blobInfo['ch_options'] = { //ch_add
		        	'ch_tiny_dir' : editor_dom.getAttribute('ch_tiny_dir')
		        	,'file' :file
		        };
				blobCache.add(blobInfo);

				// call the callback and populate the Title field with the file name
				cb(blobInfo.blobUri(), { title: file.name });
				};
			};

			input.click();
		}

		,images_upload_handler: function (blobInfo, success, failure) {
		    var xhr, formData;

		    xhr = new XMLHttpRequest();
		    xhr.withCredentials = false;
		    xhr.open('POST', '/api/images_upload'); //images_upload_url

		    xhr.onload = function() {
		      var json;

		      if (xhr.status != 200) {
		        failure('HTTP Error: ' + xhr.status);
		        return;
		      }

		      json = JSON.parse(xhr.responseText);

		      if (!json || typeof json.location != 'string') {
		      	if( json.msg){
					failure(json.msg);
		      	}else{
		      		failure('Invalid JSON: ' + xhr.responseText);
		      	}
		        return;
		      }

		      success(json.location);
		    };

		    formData = new FormData();
		    formData.append('file', blobInfo.blob(), blobInfo.filename());
		    //追加のPOSTパラメタ ch_add
		    formData.append('name', blobInfo.ch_options.file.name );
		    formData.append('size', blobInfo.ch_options.file.size );
		    if(blobInfo.ch_options.ch_tiny_dir){
		    	formData.append('dir', blobInfo.ch_options.ch_tiny_dir );
		    }
		    if($.cookie!==undefined){
		    	formData.append('csrf_token', $.cookie('csrf_cookie')); //add_ajax_param_for_csrf
		    }

		    xhr.send(formData);
		}

	  	,init_instance_callback: function (editor) {
			var edt=$(editor.getContainer());

			// //メニューとツールバーとステータスバー非表示
			// edt.find('.mce-menubar').hide();
		 //    edt.find('.mce-toolbar-grp').hide();
		 //    edt.find('.mce-statusbar').hide();

		 //    //エラー時のスタイルを適応
			// if( editor.settings.fs_is_error_item===1 ){
			// 	$(editor.getBody()).addClass("error_item");
			// }

		 //    editor.on('focus', function () {
		 //      //メニューとツールバー表示
		 //      edt.find('.mce-menubar').show();
		 //      edt.find('.mce-toolbar-grp').show();
		 //      edt.find('.mce-statusbar').show();
		 //      $(editor.getContentAreaContainer()).addClass('mce_active'); //css({ 'border' : '2px solid #B0F0FF !important'});
		 //    });
		 //    editor.on('blur', function () {
		 //    　　//メニューとツールバー非表示
		 //      edt.find('.mce-menubar').hide();
		 //      edt.find('.mce-toolbar-grp').hide();
		 //      edt.find('.mce-statusbar').hide();
		 //      $(editor.getContentAreaContainer()).removeClass('mce_active'); //css({ 'border' : 'none'});
		 //    });
		}

		,setup: function (editor,a) {
			var _editor=editor;
		    editor.addButton('ch_filer', {
				text: '挿入',
				tooltip: "画像またはファイルを一覧より選択して挿入します",
				icon: 'mce-ico mce-i-browse',
				onclick: function (evt) {
					var btn = $(this);
					var dlg_filer = _editor.settings.dlg_filer;
					//フィルタダイアログ 表示・非表示
					dlg_filer.toggle();
				}
		    });
		}
	}
	//画像挿入ボタン - フィルタダイアログオプション
	,fs_filer_options : {
		editor_id:0
		,sel_target:''
		,sel_target_img:''
//			,ch_filer_is_embed:0
		,is_tag:0
		,ajax: {
			get_files : {
				url:'/api/files'
				,data:{dir:'upload/img/'}
			}
			,upload_file : {
				url: '/api/imgdir_upload_file'
				,data: {dir:'upload/img/'}
			}
			,remove_file: {
				url:'/api/imgdir_remove_file'
				,data:{dir:'upload/img/'}
			}
		}
	}
	//AJAX通信 成功時
	,on_ch_ajax_done: function(data, textStatus, errorThrown,jqXHR,_this){
		/*
		var msg='';
		switch(data.status){
		case G.STATUS_NG:
		case G.STATUS_NG_VALIDATION:
			ch_inline_msg(data.msg ? data.msg : G.MSG_AJAX_FAIL);
			break;
		}
		*/
if(data && data.sql!==undefined)l('★sql\n'+data.sql);
	}
	//AJAX通信 失敗時
	,on_ch_ajax_fail: function(data, textStatus, errorThrown,jqXHR){
		var msg='';
		switch(textStatus){
		case "timeout":
			if(jqXHR.is_retry){
	 			jqXHR.ch_retry_count++;
	            if (jqXHR.ch_retry_count <= jqXHR.ch_retry_limit) {
					msg = G.MSG_AJAX_FAIL_TIMEOUT.replace('%d',jqXHR.timeout);
console.log(msg+'リトライします。リトライ数:'+(jqXHR.ch_retry_count-1));
					//ch_confirm( msg+'<BR>リトライしますか?',{'title':'通信エラー','dialog_class':'alert'}).done(function(){ch_ajax(jqXHR);});
					ch_ajax(jqXHR);//サイレントリトライ
	                return;
	            }else{
					msg = G.MSG_AJAX_FAIL_TIMEOUT_RETRY.replace('%1%',jqXHR.timeout).replace('%2%',jqXHR.ch_retry_count)
					//ch_alert(msg,{'title':'通信エラー','dialog_class':'alert'});
					ch_confirm( msg,{'title':'通信エラー','dialog_class':'alert','is_btn_ng_hide':1});
				}
			}else{
				//ch_alert(msg,{'title':'通信エラー','dialog_class':'alert'});
				ch_confirm( msg,{'title':'通信エラー','dialog_class':'alert','is_btn_ng_hide':1});
			}
			break;
		default:
			if(jqXHR.is_fail_alert){
				msg = G.MSG_AJAX_FAIL_STATUS.replace('{{textStatus}}',textStatus);
				ch_alert(msg,{'title':'通信エラー','dialog_class':'alert'});
			}
			break;
		case 'error':
			//ch_alert(data.responseJSON ? data.responseJSON.err : G.MSG_AJAX_FAIL);
			break;
		}
	}
	//AJAX通信 常に
	,on_ch_ajax_always: function(data, textStatus, returnedObject,jqXHR){

	}
	,printf02d : function (i){
		return ('0'+String( i )).substr(-2);
	}
};

//===========================================================================
// ■
//===========================================================================

//===========================================================================
//セレクトウインドウを表示する(<SELECT>ボックスより作成した)
// @param sel_selectbox : 作成元データ(<SELECT>ボックスセレクタ)
// @param options       : 動作オプション
//			options_default.target : 更新先ターゲット
// @return
// ・<option title=''>はPOPUPウインドウでは補助説明としてhoverで表示されます
//===========================================================================
function selectwin_open(sel_selectbox,options)
{
	var dlg = $('#selectwin');

	// show/hide toggle
	if( dlg.is(':visible') ){
		dlg.dialog( "close" );return;
	}
	//オプション
    var options_default ={
		modal: true,
        buttons: {
            '閉じる': function() {
              $( this ).dialog( "close" );
            }
        },
		width:'98vw',
		//height: g.is_sp ? parseInt(screen.height*0.7) : parseInt(screen.height*0.4),
		show: {
			effect: "fade",
			duration:200
		},
		hide: {
			effect: "fade",
			duration:200
		},
		position: {
	        my: "left top",
	        at: "left bottom+8",
			of: sel_selectbox
		},
		open: function(event, ui){
			//初期選択に選択色付け
			if(options_default.target==undefined)return;
			var is_select = $(options_default.target).prop('tagName').toLowerCase()=='select' ;

			$("#selectwinlist li",this).each(function(i,v){//初期色へ
				var o=$(this);
				o.css("background-color", o.attr('bc')!=undefined ? o.attr('bc') : '' );
			});
			var wd = ( $(options_default.target).val() || $(options_default.target).text() )
			if(is_select){
				var o = $("#selectwinlist li:contains('"+wd+"')",this);
				if( o!=undefined ){
					o.css("background-color","#F39814" );
				}
			}else{
				wd = wd.replace('　',' ').split(" ");
				for(i=0;i<wd.length;i++){
					if( wd[i]!="" ){
						var o = $("#selectwinlist li:contains('"+wd[i]+"')",this);
						if( o!=undefined ){
							for(j=0;j<o.length;j++){
								var oo = $(o[j]);
								if( oo.attr('value').length == wd[i].length ){
									oo.css("background-color","#F39814" );
								}
							}
						}
					}
				}
			}
            //$('.ui-widget-overlay').css('opacity',0.25);//背景薄く
            if(g.pcol!==undefined){
				//sex&lv色を付ける
				for(i=0;i<g.pcol.length;i++){
					$( "#selectwinlist li:contains('"+g.pcol[i][0]+"'):contains('"+g.pcol[i][1]+"')",this ).css('background-color',"'#"+g.pcol[i][2]+"'");
				}
			}
		}
	};
	$.extend(true,options_default,options);//下階層含め上書き


	//初期化時,1回のみ
	if(dlg.length==0){
		var sel = $(sel_selectbox);
		//DOM コピー変換 SELECT to OL
		//var select_ol = dom_conv_selectbox_to_ol(sel_selectbox,'dom_ol');

/*
		//先頭文字取得
        var name_prefix=[],k=0;
        sel.find('option').each(function(i,v){
        	var t=$(v).text().substr(0,1)
        	name_prefix[k++]=t;
        });
		name_prefix = _.uniq(name_prefix);
*/

		//セレクトボックスHTMLを、通常のリスト表示HTMLに変換。<select><option><option>...</select> を <ol><li>...<li>...</ol>に変換
        var html=sel.html().replace(/<\/optgroup>/g,'').replace(/<optgroup[^>]+>/g,'').replace( /option/g,'li');
		html = '<div id="selectwin" style="display:none">' +
					'<div id="selectwin_head"><img src="filter.gif" style="float:left" class="spbico">'+g.pfilter.html_buttons+g.pfilter.html_buttons_lv+g.pfilter.html_buttons_cnt+'</div>' + '<div style="height:3.5em;"></div>'+
					'<div id="selectwin_body"><ul id="selectwinlist" style="list-style:none >' + html+ '</ul></div>' +
					'<div id="selectwin_foot" style="clear:both"></div>' +
				'</div>';


		sel.after( html );
		dlg = $('#selectwin');

		//セレクトウインドウ スタイル
		var html_style=
			'<style class="kkkk">'+
			'#selectwinlist .ui-selecting { background: #FECA40; }'+
			'#selectwinlist .ui-selected { background: #F39814; }'+
			'#selectwinlist { list-style-type: none; }'+
			'#selectwinlist li { font-size:'+(g.is_sp?'40px':'14px')+';min-width:10em;font-wight:normal;float:left; padding:4px;'+(options_default.li_style!=undefined ? options_default.li_style : '' )+';border:1px #B0B0B0 solid; }'+
//			'#selectwinlist li { font-size:9pt;font-wight:normal;float:left; padding:3px;white-space: nowrap;border:1px #B0B0B0 solid; }'+ //改行なし:white-space: nowrap
			'#selectwinlist li:hover { background-color:#F39814 !important; }'+
			'</style>';

		$('head').append(html_style);
//
//		//特定キーワードに色を付ける
		if(options_default.sel_colors!=undefined){
			for(i=0;i<options_default.sel_colors.length;i++){
				$( "#selectwinlist li:contains('"+options_default.sel_colors[i][0]+"')" )
					.css('background-color',options_default.sel_colors[i][1]+"'")
					.attr('bc', options_default.sel_colors[i][1] );
			}
		}
		if(options_default.selectwin_on_create!=undefined){
			options_default.selectwin_on_create(dlg.opoptions_default);
		}
		setTimeout(function(){
			dlg.find('.flt_btn')
				.checkboxradio({icon: false})
				.change(_.bind(g.pfilter.on_btn_click,dlg));
		},10);

        //Player補助説明
		dlg.find('#selectwinlist li').on(g.on_events_for_player_status);
	}

	//初期化&OPEN
	dlg.dialog(options_default);

	//選択
	if(options_default.fs_multi_select){
		//複数選択 (ﾄﾞﾗｯｸﾞ)
		var selP = [],selNum=0,ui_selected_text='';//複数選択考慮
		$( "#selectwinlist",dlg ).selectable({
			start: function( event, ui ) {
				selP = []; selNum=0;
			},
			selected:function( event, ui ) {
				if(options_default.target==undefined)return;
	            //var val=$(ui.selected).attr('value');
	            var val = (ui.selected.val || ui.selected.textContent);
				selP[selNum++]=val;
	            ui_selected_text = $(ui.selected).text();
		        $(options_default.target).trigger( 'change_before', ui_selected_text, val );
			},
			stop: function( event, ui ) {
				if(options_default.target==undefined)return;

				var target = $(options_default.target);
				var selPStr = selP[0];
				if( target.prop('tagName').toLowerCase()=='select' ){
					$('option:contains("'+selPStr+'")',target).attr('selected',true);
				}else{
					for(i=1;i<selP.length;i++){
						selPStr += " " + selP[i];
					}
			        target.val( selPStr=='' ? '' : (target.val() + ' ' + selPStr) ); //追加
			    }
				target.trigger( 'change' );
				if(options_default.fs_selwin_close){
					dlg.dialog( "close" );
				}
			}
		});
	}else{
		//単一選択
		$( "#selectwinlist li",dlg ).click(function(){
			var target = $(options_default.target);
			var o=$(this);
			var selPStr = o.text();
			//$('option:contains("'+selPStr+'")',target).attr('selected',true);//なぜかこれSPでNG
			//target.val( sel_val );//なぜかこれSPでNG
			var sel_opt = $('option:contains("'+selPStr+'")',target);
			var idx = target.find('option').index(sel_opt);
			target.get(0).selectedIndex=idx;
			target.trigger( 'change' );
			if(options_default.fs_selwin_close){
				dlg.dialog( "close" );
			}
		});
	}

}


//===========================================================================
// ■テーブル操作関連機能 table_*()
//===========================================================================

//table_*()系メソッドのディフォルトオプション
var g_table_options={
	//Options
	 'header_selector' : 'tr:lt(1)'						//ヘッダ行要素セレクタ(ソート用のカラム含む)
	,'caption_selector': 'tr:lt(1)'						//ソート用のカラム行要素セレクタ
	,'row_selector'    : 'tr:gt(0)'						//データ行要素セレクタ


	//Events オーバーライド可能
	,'on_get_column_value' : table_on_get_column_value //<TABLE> ソート用の、COLUMNの要素(型・値)を決定する
//	,'on_row_sort' : //<TABLE> ソート用時
};
function table_get_options(sel_table){
	var tbl=$(sel_table);
	var options = tbl.data('fs_options');
	if( options==undefined ){
		tbl.data('fs_options',g_table_options);
		options = tbl.data('fs_options');
	}
	return options;
}
//table_*()系メソッドのオプション追加設定
function table_set_options(sel_table,options_add){
	var tbl=$(sel_table);
	var options = table_get_options(sel_table);
	$.extend(true,options,options_add);
	tbl.data('fs_options',options);
	return tbl.data('fs_options');
}
function table_get_row_num(sel_table){
	var tbl=$(sel_table);
	var options=table_get_options(sel_table);
	return tbl.find(options.row_selector).length;
}
function table_get_row(sel_table,i){
	var tbl=$(sel_table);
	var options=table_get_options(sel_table);
	return tbl.find(options.row_selector+':eq('+i+')');
}
function table_get_row_by_row_no(sel_table,row_no){
	var tbl=$(sel_table);
	var options=table_get_options(sel_table);
	tbl.find(options.row_selector+'[no='+row_no+']');
}
function table_get_cell(sel_table,i,j){
	var tbl=$(sel_table);
	var options=table_get_options(sel_table);
	return tbl.find(options.row_selector+':eq('+i+') td:eq('+j+')')
}
//<TABLE> に各種イベントを追加する
function table_set_event(sel_table)
{
	var tbl=$(sel_table);
	var options = table_get_options(sel_table);

	//
	//カラムクリックイベント(昇順←→降順ソート)追加
	//
	tbl.find(options.caption_selector).find('td,th').each(function(i,v){
		$(v).click(function(){
			var asc = $(v).data('asc'); if(asc==undefined) asc=1;//昇順から
			table_row_sort(sel_table,i,asc);
			asc=1-asc;
			$(v).data('asc',asc);
		});
	});

	//TODO:マルチソート対応
	//TODO:フィルタセレクトボックス追加
}

//<TABLE> データ行 ROW,COLUMNを指定してソートROWSAPN
//@param i       開始row_index
//@param rowspan -1 で解除
function table_row_span(sel_table,i,j,rowspan){
	var tbl=$(sel_table);
	var options=table_get_options(sel_table);
	if(rowspan>0){
		//var c=Math.round( Math.random()*128 )+127;//TEMP_CODE
		c=192;
		for(ri=0; ri<rowspan ; ri++){
			if(ri==0){
				tbl.find(options.row_selector+':eq('+i+') td:eq('+j+')')
			 		.css('background-color','rgb(255,255,'+c+')')//TEMP_CODE:色による変化確認用
					.attr('rowspan',rowspan)
					;
			}else{
				tbl.find(options.row_selector+':eq('+(i+ri)+') td:eq('+j+')')
			 		.css('background-color','rgb(255,255,'+c+')') //TEMP_CODE
					.hide()
					;
			}
		}
	}else{
		var rowspan2=tbl.find(options.row_selector+':eq('+i+') td:eq('+j+')').attr('rowspan');
		for(ri=0; ri<rowspan2 ; ri++){
			if(ri==0){
				tbl.find(options.row_selector+':eq('+i+') td:eq('+j+')')
					.css('background-color','') //TEMP_CODE
					.removeAttr('rowspan')
					.find(':checkbox').show()
					;
			}else{
				tbl.find(options.row_selector+':eq('+(i+ri)+') td:eq('+j+')')
					.css('background-color','') //TEMP_CODE
					.show()
					.find(':checkbox').show()
					;
			}
		}
	}
}
//<TABLE> ソート用の、COLUMNの要素(型・値)を決定する
//reuturn out : COLUMNの要素(型・値)
function table_on_get_column_value(sel_table,row,column_index,type)
{
	var out = {};
	var a_td = $('td', row).eq(column_index);

	//カラムの型を取得
	if(type==undefined){
		var options = table_get_options(sel_table);
		//キャプションカラムのclass または第1行のクラスか文字列より自動判別
		var tbl=$(sel_table);
		var is_col_int = tbl.find( options.caption_selector ).find('td,th').eq(column_index).hasClass('int');

		var a_td_i = a_td.find(':input');
		if(a_td_i.length>0){
			//int 指定か 文字列より数値判別
			out.type = ( a_td_i.is(':checkbox') ) ? 2 : ( ( is_col_int || a_td_i.hasClass('int') || a_td_i.text().match(/^[0-9]+$/)!=null) ? 3 : 1 );
		}else{
			//int 指定か 文字列より数値判別
			out.type = ( is_col_int || a_td.hasClass('int') || a_td.text().match(/^[0-9]+$/)!=null)  ? 4 : 0;
		}
	}else{
		out.type=type;
	}

	switch(out.type){
	case 4://text int  :0b001
		out.val = parseInt(a_td.text());
		break;
	case 3://input int :0b011
		out.val = parseInt(a_td.find(':input').val());
		break;
	case 2://check     :0b101
		out.val = a_td.find(':input').is(':checked') ? 1 : 0;
		break;
	case 1://input txt :0b010
		out.val = a_td.find(':input').val();
		break;
	default:
		out.val = a_td.text();
		break;
	}
	return out;
}
//<TABLE> COLUMNを指定してソート
//@param column_index
function table_row_sort(sel_table,column_index,is_asc){
	is_asc==undefined ? true : false;

	var tbl=$(sel_table);
	var options = table_get_options(sel_table);

	//
	//ソート
	//

	//カラムのタイプ(型・値)を取得
	var type; // { 型:(string|int)} {値:(val()|text())}
	var tb = tbl.find(options.row_selector).sort(function(a, b) {
			//<TABLE> ソート用の、COLUMNの要素(型・値)を取得
			var at = options.on_get_column_value(sel_table,a,column_index,type);
			type = at.type;//typeは一回だけ取得でよい
			var bt = options.on_get_column_value(sel_table,b,column_index,type);

			if(is_asc){
				return (at.val > bt.val) ? 1 : -1;
				//return (at.val - bt.val);
			}else{
				return (at.val < bt.val) ? 1 : -1;
				//return (bt.val - at.val);
			}
		});

	//ソート用のカラム行要素のソート状態設定
	var cols=tbl.find( options.caption_selector ).find('td,th');
	cols.find('span.sort').hide();
	var col=cols.eq(column_index);
	var s = col.find('span.sort');
	if(s.length==0){
		$('<span>').css('float','right').attr('class','sort').text( is_asc ? '  ▲' : '  ▼' ).show().appendTo( col );
	}else{
		s.text( is_asc ? '  ▲' : '  ▼' ).show();
	}
	//ソートイベント
	if(options.on_row_sort!=undefined) options.on_row_sort(sel_table,column_index,is_asc,type);

	//
	//ソート後<TABLE>HTML作成
	//※HTMLで再作成だとイベントまで消えるので、DOMレベルで入れ変えたものを置き換える
	//
	var th = tbl.find(options.header_selector);
	tbl.find('tbody').replaceWith( $('<tbody>').prepend(th).append(tb) );
}
//<TABLE> COLUMNを指定してマルチソート
//@param order_by_columns_index: 例:[1,3,4]
function table_row_multi_sort(sel_table,order_by_columns_index,is_asc){
	is_asc==undefined ? true : false;

	var tbl=$(sel_table);
	var options = table_get_options(sel_table);
	//
	//マルチソート順に行に重みを付ける
	//

	//重み0へ
	tbl.find(options.row_selector).each(function(ii, v) {
		$(v).data('w',0);
	});

	var n = order_by_columns_index.length;
	$.each( order_by_columns_index, function(i,column_index){
		var type; // { 型:(string|int)} {値:(val()|text())}
		tbl.find(options.row_selector).each(function(ii, row) {
			//<TABLE> ソート用の、COLUMNの要素(型・値)を取得
			at = options.on_get_column_value(sel_table,row,column_index,type);
			type = at.type;//typeは一回だけ取得でよい

			//行に全カラムの重みをソート優先順位順に加算
			var pow=1; for(k=0;k<(n-i-1);k++){ pow *=10000; }//1000の場合データ行は4桁以内
			$(row).data('w', $(row).data('w') + at.val*pow );
		});
	});

	//重みでソート
	var tb = tbl.find(options.row_selector).sort(function(a, b) {
			if(is_asc){
				return ($(a).data('w') - $(b).data('w'));
			}else{
				return ($(b).data('w') - $(a).data('w'));
			}
		});

	//
	//ソート後<TABLE>HTML作成
	//※HTMLで再作成だとイベントまで消えるので、DOMレベルで入れ変えたものを置き換える
	//
	var th = tbl.find(options.header_selector);
	tbl.find('tbody').replaceWith( $('<tbody>').prepend(th).append(tb) );

}

//<TABLE> データ行 row selectorを指定してフィルタ
//@param フィルタオプション (OFFにする時 {'row_filter_selector':null} )
function table_row_filter(sel_table,options_arg){
	var tbl=$(sel_table);
	var options = table_get_options(sel_table);

	//table_*()系メソッドのオプション設定
	if(options_arg.row_filter_callback!=undefined){
		tbl.find(options.row_selector).hide();
		tbl.find(options.row_selector).each(function(i,v){
			if(options_arg.row_filter_callback(this,tbl)){
				$(this).show();
			}
		});
	}
	else if(options_arg.row_filter_selector==null){
		tbl.find(options.row_selector).show();
	}
	else if(options_arg.row_filter_selector!=undefined){
		tbl.find(options.row_selector).hide();
		tbl.find(options_arg.row_filter_selector).show();
	}
}
//---------------------------------------------------------------------------
/*
//<TABLE> の状態を保存
//@format: (html | js_obj | json | db)
//@range:  範囲 all,input,param,class
function table_serialize(sel_table,format,range){
	return null;
}

//<TABLE> の状態の差分
function table_serialize_diff(sel_table,i_dst,i_src){
	return null;
}
*/

//===========================================================================
//2階層の円チャート作成
//http://www.highcharts.com/demo/pie-donut
//@param map_ua_disp フォーマットは以下
/*
  var map_ua_disp ={
      //階層1    //階層2
  	'chrome'  :{ '画面A':1, '画面B':8, '画面K':5 },
  	'firefox':{ '画面A':3, '画面C':14, '画面F':5, '画面X':1 }
  	//...
  };
  create_chart_pie_donut('#test', map_ua_disp, 'hello');
*/
//===========================================================================
function create_chart_pie_donut(selector,map_ua_disp,map_ua_color,a_title,options)
{
			//===========================================================================
			// convert map_ua_disp -> data
/*
//format
var map_ua_disp ={
	'crome'  :{ '画面A':1, '画面B':8, '画面B':5 },
	'firefox':{ '画面A':3, '画面C':14, '画面F':5, '画面X':1 },
	...
};
var map_ua_color ={
  	'crome':'#7cb5ec',
  	'firefox':'#FF8480',
};

↓
var data = [{
        y: 56.33,
        color: colors[0],
        drilldown: {
            name: 'MSIE versions',
            categories: ['MSIE 6.0', 'MSIE 7.0', 'MSIE 8.0', 'MSIE 9.0', 'MSIE 10.0', 'MSIE 11.0'],
            data: [1.06, 0.5, 17.2, 8.11, 5.33, 24.13],
            color: colors[0]
        }
    }, {
    …
	}]

*/
		function convert( map_ua_disp,map_ua_color,     //IN
				browser_categories,data )  //OUT
		{
			var total=0;
			$.map( map_ua_disp, function(e,i){
				var t=0;
				$.map(e,function(ee,ii){t+=ee;});// t=array_sum(e);
				total+=t;
			});

			//{key:value}配列 []配列にする
			var map_ua_disp2=[],idx=0;
			$.map( map_ua_disp, function(e,i){
				var t=0;
				//if(map_ua_disp2[idx]==undefined) map_ua_disp2[idx]={};
				map_ua_disp2[idx]={};
				$.map(e,function(ee,ii){
					t+=ee;
					map_ua_disp2[idx][ii]=Math.round( ((100000)*ee)/total )/1000; //少数3ケタ 53.248%
				});
				map_ua_disp2[idx]['total']=Math.round( ((100000)*t)/total ) / 1000;
				map_ua_disp2[idx]['name']=i;
				idx++
			});

			//keyをソート
			map_ua_disp2.sort( function(a,b){
				return b['total']-a['total'];
			});

			var browser_categories_color=[];
			for(i=0;i<map_ua_disp2.length;i++){
				browser_categories[i]= map_ua_disp2[i]['name'];
				var name = map_ua_disp2[i]['name'];
				browser_categories_color[i]=map_ua_color[name];

				delete map_ua_disp2[i]['name'];
				var total2 = map_ua_disp2[i]['total'];
				delete map_ua_disp2[i]['total'];

				// map_ua_disp2[i] key_value object を value をキーにソート
				var tmp_array=[],idx=0;
				$.map( map_ua_disp2[i], function(ee,ii){
					tmp_array[idx]=[ii,ee];
					idx++;
				});
				tmp_array.sort( function(a,b){
					return b[1]-a[1];
				});

				var categories_value = [];
				var data_value       = [];
				for(j=0;j<tmp_array.length;j++){
					categories_value[j] = tmp_array[j][0];
					data_value[j]       = tmp_array[j][1];
				}
				map_ua_disp2[i]=tmp_array;

				data[i]={
					y: total2,
		            //color: colors[0],
		            drilldown: {
		                //name: 'MSIE versions',
		                categories: categories_value, //['MSIE 6.0', 'MSIE 7.0', 'MSIE 8.0', 'MSIE 9.0', 'MSIE 10.0', 'MSIE 11.0'],
		                data: data_value,             //[1.06, 0.5, 17.2, 8.11, 5.33, 24.13],
		                //color: colors[0]
		            }
		        };
			}

		    for(i=0;i<data.length;i++){
				data[i]['color']=browser_categories_color[i];
				data[i]['drilldown']['name']=browser_categories[i];
				data[i]['drilldown']['color']=browser_categories_color[i];
			}
			return total;
		}

		var browser_categories=[],data=[];
		total = convert( map_ua_disp,map_ua_color,browser_categories,data );
		//===========================================================================

        var browserData = [],
        versionsData = [],
        i,
        j,
        dataLen = data.length,
        drillDataLen,
        brightness;


    // Build the data arrays
    for (i = 0; i < dataLen; i += 1) {

        // add browser data
        browserData.push({
            name: browser_categories[i],
            y: data[i].y,
            color: data[i].color
        });

        // add version data
        var drillDataLen = data[i].drilldown.data.length;

        for (j = 0; j < drillDataLen; j += 1) {
            brightness = 0.2 - (j / drillDataLen) / 5;
            versionsData.push({
                name: data[i].drilldown.categories[j],
                y:    data[i].drilldown.data[j],
                color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }

    // Create the chart
	var default_options = {
        chart: {
            type: 'pie'
//            type: 'bar'
//            type: 'column'

//            type: 'area'
/*
           ,options3d: {
                enabled: true
                ,alpha: 45
                ,beta: 0
            }
*/
        },
        title: {
            text: a_title,
        },
        subtitle: {
            text: '全' + total + ''
        },
        yAxis: {
            title: {
                text: 'Total percent'
            }
        },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '50%']
            }
        },
        tooltip: {
            valueSuffix: '%'
        },
        series: [{
            name: '',
            data: browserData,
            size: '60%',
            dataLabels: {
                formatter: function () {
                    return this.y > 5 ? this.point.name : null;
                },
                color: 'white',
                distance: -30
            }
        }, {
            name: '画面',
            data: versionsData,
            size: '80%',
            innerSize: '60%',
            dataLabels: {
                formatter: function () {
                    // display only if larger than 1
                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + parseInt(this.y) + '%' : null;
                }
            }
        }]
    };

	options = $.extend(true,default_options, options);
	return $( selector ).highcharts(options);
}


//===========================================================================
// ■ JQuery 拡張
//===========================================================================
$.fn.extend({
    ch_disable: function(is_disable){
        if(is_disable){
            this.prop({'disabled':true});
            this.css({'background-color':'#EEEEEE'});
            this.attr({'readonly':'readonly'});
        }else{
            this.prop({'disabled':false});
            this.css({'background-color':''});
            this.removeAttr('readonly');
        }
        return this;
    }
    ,insert_str: function(v) {
        var o = this.get(0);
        o.focus();
        //if (jQuery.browser.msie)
        if (navigator.userAgent.match(/MSIE/))
        {
            var r = document.selection.createRange();
            r.text = v;
            r.select();
        } else {
            var s = o.value;
            var p = o.selectionStart;
            var np = p + v.length;
            o.value = s.substr(0, p) + v + s.substr(p);
            if(o.type!=='hidden')o.setSelectionRange(np, np);
        }
        return this;
    }

	//イベントを取得 events()
	,events: function(){
     return  $._data( $(this).get(0)).events
    },
	//拡張 attr()
    attr_ex: function(a,b){
    	switch(a){
		case 'readonly': this.css( 'background-color', (b ? '#EEEEEE' : '' ) );break;//色を変える
		}
    	this.attr(a,b);
    },
	bs_btn_clear:function () {
    	let o=(this);
    	if(o.parent().find('.bs_btn_clear_btn').length) return;
		let btn = $('<div class="input-group-addon btn btn-default"><i class="fa fa-times"></i></div>');
		btn.addClass("bs_btn_clear_btn");
		btn.on('click',function (){
			let input = $(this).prevAll('input.bs_btn_clear:eq(0)');
			input.val( input.attr('bs_btn_clear_val') || '' ).trigger('change').trigger('keyup');
			//if(!g_isTouch)input.focus();
			input.focus();
		});
		o.after(btn);//右につける
		//btn.height($(v).height()+16); //for jqui11
		return this;
	},
    btn_clear:function () {
    	let o=(this);
    	if(o.parent().find('.btn_clear_btn').length) return;
		let btn = $('<span>').button({icons: {primary: "ui-icon ui-icon-closethick"}});
		btn.addClass("btn_clear_btn");
		btn.on('click',function (){
			let input = $(this).prevAll('input.btn_clear:eq(0)');
			input.val( input.attr('btn_clear_val') || '' ).trigger('change').trigger('keyup');
			if(!g_isTouch)input.focus();
			input.focus();
		});
		o.after(btn);//右につける
		//btn.height($(v).height()+16); //for jqui11
		return this;
    },

	//画像TAG挿入ファイラー起動ボタン
	//@param [fs_filer_dir] 	    アップロード先DIR 例 fs_filer_dir='foo/bar/'
	//@param [fs_filer_select_dir]  アップロード先DIR追加 例:'[["upload/csv/","フォルダA(8)"]]'
	//@param [fs_filer_is_tag]  	0:値をセット(Default) 1:HTMLMを挿入
	//@param [fs_filer_target]  	挿入時val設定ターゲット
	//@param [fs_filer_target_img]  挿入時src設定IMGターゲット
	//@param [fs_filer_btn_del]
	fs_filer: function(options){
		if(this.length==0)return;
		var o = this;
		var id = o.attr('id');

		//merge default options
		var set_options = $.extend(true,{},g.fs_filer_options,options); //clone
		set_options.editor_id = id;

		//merge dom options
		var dir = o.attr('fs_filer_dir');
		if(dir!==undefined){
			set_options.ajax.get_files.data.dir = dir;
			set_options.ajax.upload_file.data.dir = dir;
			set_options.ajax.remove_file.data.dir = dir;
		}
		var dir_sel = o.attr('fs_filer_select_dir');
		if(dir_sel!==undefined){
			var select_dirs=JSON.parse(dir_sel);
			if(select_dirs) set_options['select_dirs']=select_dirs;
		}

		//アップロード可能ファイ拡張子
		fs_filer_upload_extensions=o.attr('fs_filer_upload_extensions');
		if(fs_filer_upload_extensions){
			set_options.fs_filer_upload_extensions=fs_filer_upload_extensions.split(',');
		}

		//Object.assign(set_options,v.attributes);
		set_options.fs_filer_inline_target= o.attr('fs_filer_inline_target');
		set_options.sel_target 		= o.attr('fs_filer_target') ? o.attr('fs_filer_target') : '';
		set_options.sel_target_img 	= o.attr('fs_filer_target_img');
//		set_options.fs_filer_is_embed     = o.attr('fs_filer_is_embed') ? parseInt(o.attr('fs_filer_is_embed')) : false;
		set_options.fs_filer_type       = o.attr('fs_filer_type');
		set_options.is_tag     		= o.attr('fs_filer_is_tag') ? parseInt(o.attr('fs_filer_is_tag')) : true;
		set_options.is_append_set	= o.attr('fs_filer_is_append_set') ? parseInt(o.attr('fs_filer_is_append_set')) : false; //ターゲット要素に append_set

		set_options.is_select_dir     	= o.attr('fs_filer_is_select_dir') ? parseInt(o.attr('fs_filer_is_select_dir')) : 1;
		set_options.is_btn_ins			= o.attr('fs_filer_is_btn_ins') ? parseInt(o.attr('fs_filer_is_btn_ins')) : 1;
		set_options.is_btn_del			= o.attr('fs_filer_is_btn_del') ? parseInt(o.attr('fs_filer_is_btn_del')) : 1;
		set_options.fs_filer_is_ddrop_open= o.attr('fs_filer_is_ddrop_open') ? parseInt(o.attr('fs_filer_is_ddrop_open')) : 0;

		var dlg_filer = new FsFilerDlg(set_options);//画像挿入ボタン - フィルタダイアログ
		//var dlg_filer = new FsFilerDlgL(set_options);//画像挿入ボタン - フィルタダイアログLight

		//イベント設定
		dlg_filer.on_filer_insert = function(img_url,img_data,dlg,options){
			var set_val,is_embed=0;
			var ext = img_data['ext'].toLowerCase();
			switch(ext){
			case 'gif': case 'jpg': case 'jpeg': case 'png':
				if(set_options.is_tag==true){
					set_val = '<img title="" src="'+img_url+'" width="100%">\n';
				}else{
					set_val = img_url;
				}
				break;
//			case 'pdf':
//				set_val = '<embed  target="_blank" src="'+img_url+'">'+img_data['name']+'</embed>\n';break;
			default:
				is_embed=1;
				if(set_options.is_tag==true){
					set_val = '<a target="_blank" href="'+img_url+'">'+img_data['name']+'</a>\n';
				}else{
					set_val = img_url;
				}
				break;
			}
			//<INPUT> or <DIV>
			var ot=$(options.sel_target);
			if(ot){
				if(set_options.is_tag==true){
					ot.html( set_val );
				}else{
					if(set_options.is_append_set){
						ot.insert_str(set_val).trigger('change');
					}else{
						ot.val( set_val ).trigger('change');
					}
				}
			}
			//<IMG SRC>
			var oi=$(options.sel_target_img);
			if(oi){
				if(is_embed){
					let id=oi.attr('id');
					let w=oi.attr('width');
					let h=oi.attr('height');
					new_embed = '<embed id="'+id+'" src="'+set_val+'" width="'+w+'" height="'+h+'" />';
					oi.before( $(new_embed) );
					if(oi.get(0).tagName=="EMBED"){
						oi.remove();
					}else{
						oi.hide();//IMG->EMB
					}

				}else{
					if(oi.get(0).tagName=="EMBED"){
						var p=oi.parent();
						p.find('EMBED').remove();
						p.find('IMG').show().attr('src',set_val);
					}else{
						oi.show().attr('src',set_val);
					}
				}
			}

			dlg.dialog('close');
		}
		o.on('click', function(event) {
			event.preventDefault();
			dlg_filer.toggle();
		});
	},

	//HTML編集機能追加 (tinyMCE)
	//@param [ch_tiny_dir] イメージアップロード先ID
	//@param [ch_content_css] 適応追加CSS
	//@param [ch_tiny_filer_detail] 画像挿入ファイラーに [詳細]タブがある
	ch_tiny: function(){
		if(this.length==0)return;
		var o =	 this;
		var id = o.attr('id');
		var options = {};

		//画像挿入ボタン - フィルタダイアログオプション
		var fs_filer_options = $.extend(true,{},g.fs_filer_options); //clone
		fs_filer_options.editor_id = id;

		//イメージアップロード先ID 指定がある場合
		var ch_tiny_dir = o.attr('ch_tiny_dir');
		if(ch_tiny_dir!==undefined){
			fs_filer_options.ajax.get_files.data.dir = ch_tiny_dir;
			fs_filer_options.ajax.upload_file.data.dir = ch_tiny_dir;
			fs_filer_options.ajax.remove_file.data.dir = ch_tiny_dir;
		}

		//画像挿入ファイラーに [詳細]タブがある
		var ch_tiny_filer_detail = o.attr('ch_tiny_filer_detail');
		if(ch_tiny_filer_detail!==undefined){
			fs_filer_options.is_grid_list=ch_tiny_filer_detail;
		}

		var dlg_filer = new FsFilerDlg(fs_filer_options);//画像挿入ボタン - フィルタダイアログ

		//イベント設定
		dlg_filer.on_filer_insert = function(img_url,img_data,dlg,options){
	        //if( confirm('画像を挿入しますか？\\n'+img_url) )
	        {
	        var fs_filer_options = this.fs_filer_options ? this.fs_filer_options : {is_tag:true};
			var img_tag;
			switch(img_data['ext']){
			case 'gif': case 'jpg': case 'jpeg': case 'png':
				if(fs_filer_options.is_tag==true){
					img_tag = '<img title="" src="'+img_url+'">\n';
				}else{
					img_tag = img_url;
				}
				break;
//			case 'pdf':
//				img_tag = '<embed  target="_blank" src="'+img_url+'">'+img_data['name']+'</embed>\n';break;
			default:
				if(fs_filer_options.is_tag==true){
					img_tag = '<a target="_blank" href="'+img_url+'">'+img_data['name']+'</a>\n';
				}else{
					img_tag = img_url;
				}
				break;
			}

				if(fs_filer_options.sel_target){
					var oo=$(fs_filer_options.sel_target);
					//oo.text( oo.text()+img_tag );
					oo.val( oo.val()+img_tag ).trigger('change');
				}else{
					var editor = _.find(tinymce.editors,function(e){ if(e.id==options.editor_id)return e; });
					var a=editor.selection.setContent(img_tag);
			        //選択状態へ
			        var sel_img = editor.dom.select('img[src="'+img_url+'"]')[0];
		          	editor.selection.select(sel_img);
	          	}
				dlg_filer.toggle(); //dialog('close');
			}
		}

		$.extend(true,options,g.tiny_options);

	　　//適応追加CSS
      var ch_content_css = o.attr('ch_content_css');
      if(ch_content_css!==undefined){
      	var css = ch_content_css.split(';')
      	if(css.length>0){
      		options.content_css=[];
	      	css.forEach(function(css){
				options.content_css.push(css);
			});
	    }
	  }

		options['dlg_filer'] = dlg_filer;
		options.selector = '#'+id;

		tinymce.init(options);

		var editor = null;
		for (var i = 0; i < tinymce.editors.length; i++) {
			if(tinymce.editors[i].id==id){
				editor = tinymce.editors[i];
				break;
			}
		}
		//document readyまでのUIの見栄がよくないので初期表示を非表示にしている事事への対応
		// if(editor){
		// 	editor.show();
		// }
		// if( o.is(':visible') ){
		// 	o.hide();
		// }else{
		// 	o.show();
		// }
		o.show();
	}
});

$.extend({
	//POST してリダイレクト
    post_redirect: function(location, args)
    {
        var form = '';
        if($.cookie!==undefined){
	        args['csrf_token'] = $.cookie('csrf_cookie');//add_ajax_param_for_csrf
	    }
        $.each( args, function( key, value ) {
            form += '<input type="hidden" name="'+key+'" value="'+value+'">';
        });
        $('<form action="'+location+'" method="POST">'+form+'</form>').appendTo('body').submit();
    }
});

//===========================================================================
// ■ Common Event
//===========================================================================

$(document).ready( function(){

    //クリアボタン(BS)
    //@param [bs_btn_clear_val]
	$('.bs_btn_clear').bs_btn_clear();

    //クリアボタン(JQUI)
    //@param [btn_clear_val]
	$('.btn_clear').btn_clear();

	//[スピナー機能追加] クラス
	$('.jq_spin').each(function(i,v){
		var o = $(v);
		var options = o.data('jq_spin_options');
		var def_options = {//ディフォルトオプション
			'spin':function( event, ui ){
				var s=$(this);
				//input要素のこれらのイベントを設定している場合がある為call
				if( s.events().change!=undefined){
					s.val(ui.value).trigger('change');
				}
			}
		};
		$.extend(true,def_options,options);

		//エレメントの属性に datepicker のオプションがあったらそこより取得する
		var min = o.attr('jq_min') || o.attr('min'); //ある方から取得
		if(min!=undefined) jQuery.extend(def_options,{'min':min});
		var max = o.attr('jq_max') || o.attr('max');
		if(max!=undefined) jQuery.extend(def_options,{'max':max});

		//jQueryUI spinner にする
		o.spinner(def_options);

		var maxlength = o.attr('maxlength');
		if( maxlength!=undefined) o.css('width',maxlength+'em'); //maxlengthあったら、横幅調整
	});


    //日時カレンダ
    //@param [jq_date_min_date] 選択可能な最小日付 (例) 日付文字列:2017-05-18や 当日:0 2日後:2 昨日:-1 一ヶ月後:+1m 7日後:+7d
    //@param [jq_date_max_date] 選択可能な最大日付
    //@param [jq_date_from] 日付範囲選択 from
    //@param [jq_date_to] 日付範囲選択 to
    //@param [jq_date_numberOfMonths] 1度に表示する月の数
    $('.jq_date').each(function(i,v){
        var o = $(v);
        var options = {};

        //選択可能な最小日付
        var jq_date_min_date = o.attr('jq_date_min_date');
        if( jq_date_min_date ){
          $.extend(true, options,{"minDate":jq_date_min_date});
        }
        //選択可能な最大日付
        var jq_date_max_date = o.attr('jq_date_max_date');
        if( jq_date_max_date ){
          $.extend(true, options,{"maxDate":jq_date_max_date});
        }

        //日付範囲選択 from
        if( o.is('.jq_date_from') ){
            //隣に 日付範囲選択 toの指定があったら
            var jq_date_to = $(this).nextAll('.jq_date_to:eq(0)');
            if( jq_date_to.length ){
                var max_date=jq_date_to.val().trim();
                if( max_date!=''){
                    $.extend(true, options,{"maxDate":max_date});//選択可能な最大日付
                }
            }

            $.extend(true, options,{
                'onClose': function( selectedDate ) {
                    $(this).nextAll('.jq_date_to:eq(0)').datepicker( "option", "minDate", selectedDate ); //to下限限設定
                }
                ,numberOfMonths: 1
                ,changeMonth: false
                ,changeYear: false
            });
        }
        //日付範囲選択 to
        if( o.is('.jq_date_to') ){
            //隣に 日付範囲選択 toの指定があったら
            var jq_date_from = $(this).prevAll('.jq_date_from:eq(0)');
            if( jq_date_from.length ){
                var min_date=jq_date_from.val().trim();
                if( min_date!=''){
                    $.extend(true, options,{"minDate":min_date});//選択可能な最小日付
                }
            }

            $.extend(true, options,{
                'onClose': function( selectedDate ) {
                    $(this).prevAll('.jq_date_from:eq(0)').datepicker( "option", "maxDate", selectedDate );//from上限設定
                }
                ,numberOfMonths: 1
                ,changeMonth: false
                ,changeYear: false
            });
        }

        var jq_date_numberOfMonths = o.attr('jq_date_numberOfMonths');
        if(jq_date_numberOfMonths){
          var n;
          if(jq_date_numberOfMonths.indexOf(',') != -1){ //2,3 -> [2,3]
            n=jq_date_numberOfMonths.split(',');
          }else{
            n=parseInt(jq_date_numberOfMonths);
          }
          $.extend(true, options,{ 'numberOfMonths': n} );
        }

        options = $.extend(true,{},g.datepicker_options,options);

        //jQueryUI datepicker にする
        o.datepicker(options);

        o.attr('maxlength','10');//入力制限 10文字 (YYYY/MM/DD)
        var n = options.dateFormat===undefined ? 10 : options.dateFormat.length;//日付文字数
        //o.css('width',n+'em'); //横幅調整
    });

    //日時時間カレンダ
    //@param [jq_date_min_date] 選択可能な最小日付 (例) 日付文字列:2017-05-18や 当日:0 2日後:2 昨日:-1 一ヶ月後:+1m 7日後:+7d
    //@param [jq_date_max_date] 選択可能な最大日付
    //@param [jq_date_from] 日付範囲選択 from
    //@param [jq_date_to] 日付範囲選択 to
    $('.jq_datetime').each(function(i,v){
        var o = $(v);
          //datetimepicker option
        var options = {

            timeFormat: 'HH:mm',
            timeInput: true,
//            controlType: 'select', oneLine: true,
            addSliderAccess: true,
            sliderAccessArgs: { touchonly: false },

            buttonImage: "im/calender2.gif",
//            defaultDate:'2014/01/01',
            changeMonth: false,
            changeYear: true,
            showButtonPanel : true

   //          ,jq_init_hhmm: '18:00' //初期時間(USER_OPTION)
   //          ,'onSelect': function( selectedDateTime,inst ) {
   //              //選択時初期時間　設定があったら設定
   //              var dp = $('#'+inst.id);
   //              var jq_init_hhmm = dp.datetimepicker("option","jq_init_hhmm");
   //              if(jq_init_hhmm){
   //                  if( selectedDateTime.length>=10 ){
   //                      selectedDateTime = selectedDateTime.substr(0,10)+' ' + jq_init_hhmm;
   //                      dp.datetimepicker("setDate",selectedDateTime);
   //                  }
   //              }
			// }
        };

        //選択可能な最小日付
        var jq_date_min_date = o.attr('jq_date_min_date');
        if( jq_date_min_date ){
            $.extend(true, options,{"minDate":jq_date_min_date});
        }
        //選択可能な最大日付
        var jq_date_max_date = o.attr('jq_date_max_date');
        if( jq_date_max_date ){
            $.extend(true, options,{"maxDate":jq_date_max_date});
        }

        options = $.extend(true,{},g.datepicker_options,options);

        //日付範囲選択 from
        if( o.is('.jq_date_from') ){
            //隣に 日付範囲選択 toの指定があったら
            var jq_date_to = $(this).nextAll('.jq_date_to:eq(0)');
            if( jq_date_to.length ){
                var max_date=jq_date_to.val().trim();
                if( max_date!=''){
                    $.extend(true, options,{"maxDate":max_date});//選択可能な最大日付
                }
            }

            $.extend(true, options,{
                'onClose': function( selectedDate,inst ) {
                    if(selectedDate!=''){
                        var dp_from = $(inst.input);
                        var dp_to   = $(this).nextAll('.jq_date_to:eq(0)');
                        var from    = dp_from.datetimepicker('getDate');
                        var to      = dp_to.datetimepicker('getDate');
                        //FROMの選択時間がTOより大きくなった場合 TOを補正
                        if( from > to){
                            dp_to.datepicker('setDate',from );
                        }
                    }
                }
                ,'onSelect': function( selectedDateTime,inst ) {
                    $(this).nextAll('.jq_date_to:eq(0)').datetimepicker( "option", "minDate", selectedDateTime ); //to下限限設定
                }
                ,numberOfMonths: 2
                ,changeMonth: false
                ,changeYear: false
            });
        }
        //日付範囲選択 to
        if( o.is('.jq_date_to') ){
            //隣に 日付範囲選択 toの指定があったら
            var jq_date_from = $(this).prevAll('.jq_date_from:eq(0)');
            if( jq_date_from.length ){
                var min_date=jq_date_from.val().trim();
                if( min_date!=''){
                    $.extend(true, options,{"minDate":min_date});//選択可能な最小日付
                }
            }

            $.extend(true, options,{
                'onClose': function( selectedDate,inst ) {
                    if(selectedDate!=''){
                        var dp_from = $(this).prevAll('.jq_date_from:eq(0)');
                        var dp_to   = $(inst.input);
                        var from    = dp_from.datetimepicker('getDate');
                        var to      = dp_to.datetimepicker('getDate');
                        //TOの選択時間がFROMより小さくなった場合 FROMを補正
                        if( to < from){
                            dp_from.datepicker('setDate',to );
                        }
                    }
                }
                ,'onSelect': function( selectedDateTime,inst ) {
                    //選択時初期時間　設定があったら設定
                    var dp = $('#'+inst.id);
                    var jq_init_hhmm = dp.datetimepicker("option","jq_init_hhmm");
                    if(jq_init_hhmm){
                        if( selectedDateTime.length>=10 ){
                            selectedDateTime = selectedDateTime.substr(0,10)+' ' + jq_init_hhmm;
                            dp.datetimepicker("setDate",selectedDateTime);
                        }
                    }
                    $(this).prevAll('.jq_date_from:eq(0)').datepicker( "option", "maxDate", selectedDateTime );//from上限設定
                }
                ,numberOfMonths: 2
                ,changeMonth: false
                ,changeYear: false
            });
        }
        var dateFormat = o.attr('dateFormat'); //yy年mm月dd日(D)
        if(dateFormat!==undefined) $.extend(true,options,{'dateFormat':dateFormat});
        var defaultDate = o.attr('defaultDate'); //yy年mm月dd日(D)
        if(defaultDate!==undefined) $.extend(true,options,{'defaultDate':defaultDate});

        o.datetimepicker(options);
        //1234566789123456
        //2017/10/12 22:33
        //var n=16;
        o.css({
          'width':14+'em' //横幅調整
        });
        o.attr({
          'size':16
          ,'maxlength':16
        });
    });

	//[時間選択機能追加] クラス
	$('.jq_time').each(function(i,v){
		var o = $(v);
		var options = {
			showOn: "button",
			buttonImage: "im/icon_clock.gif",
//			defaultDate:'2014/01/01',
			changeMonth: true,
			changeYear: true,
			numberOfMonths: 1,
			showOtherMonths:  true,
//			dateFormat': 'Y-m-d',
//			onClose: function( selectedDate ) {},
//			beforeShowDay: function ( date ){
//				var ret = [];
//				var y = date.getFullYear();
//				var m = g.printf02d( date.getMonth()+1 );
//				var d = g.printf02d( date.getDate() );
//				ret[0]=true;//選択可能
//				if( jQuery.datepicker.regional[ "ja" ].holidays[ y+m+d ]!=undefined ){
//					ret[1] += ' holiday'; //日付があれば休日のスタイルにする
//				}
//				return ret;
//			}
		};

		//input.jq_date エレメントの属性に datepicker のオプションがあったらそこより取得する
		var dateFormat = o.attr('dateFormat'); //yy年mm月dd日(D)
		if(dateFormat!=undefined) jQuery.extend(true,options,{'dateFormat':dateFormat});
		var defaultDate = o.attr('defaultDate'); //yy年mm月dd日(D)
		if(defaultDate!=undefined) jQuery.extend(true,options,{'defaultDate':defaultDate});

		jQuery.extend(options,{
			'timeFormat': 'HH:mm' //hh:mm tt
			,hourGrid: 4
			,minuteGrid: 10
			,'hourMin': 8
			,'hourMax': 16
		});

		//jQueryUI datepicker にする
		o.timepicker(options);

//		var n = options.dateFormat==undefined ? 10 : options.dateFormat.length;//日付文字数
//		o.css('width',n+'em'); //横幅調整
	});

	//--- fs_* ----------------------------------------------------------------------

	//[<TABLE>操作(sort/filter/span etc)機能追加] クラス
	// ・Mergeしたいoptionがあるばあい、call前に data('fs_options_add')に設定
	$('.fs_table').each(function(i,v){
		var o = $(v);
		var options_add = o.data('fs_options_add');
		var sel_table = '#'+o.attr('id');
		table_set_options( sel_table, options_add );
		table_set_event(sel_table); //<TABLE> に各種イベントを追加する,カラムクリックソード等
	});

	//<SELECT>のオプション一覧をポップアップウインドウより選択する機能追加　クラス
	// ・<option title=''>はPOPUPウインドウでは補助説明としてhoverで表示されます
	//@param fs_selwin_w
	//@param fs_selwin_h
	//@param fs_multi_select
	//@param fs_selwin_close
	$('.fs_selwin').each(function(i,v){
		var o = $(v);
		var sel = o.attr('id');
		if(sel==undefined){
			sel = 'fs_selwin'+i;
			o.attr('id',sel);
		}
		sel = '#'+sel;

		var options = o.data('fs_selwin_options');
		var def_options = {//ディフォルトオプション
			modal:false
			,title:'選択して下さい'
			,target:sel
			//position: { my: "left top", at: "left bottom", of: $(o) },
			//width:parseInt( $(window).width()-$(this).width()-80)
			//width: parseInt(o.width()*$('option',o).length)+100
		}
		if(o.attr('fs_table_w')!==undefined) def_options['width']=o.attr('fs_table_w');
		if(o.attr('fs_table_h')!==undefined) def_options['height']=o.attr('fs_table_h');
		if(o.attr('fs_multi_select')!==undefined) def_options['fs_multi_select']=true;
		if(o.attr('fs_selwin_close')!==undefined) def_options['fs_selwin_close']=true;
		$.extend(true,def_options,options);
		var btn_selwin = $('<button>')
				.button({icons: {primary: " ui-icon-persons spuic1"}})
//				.height(o.height())
				.addClass('spuic2 s_selwin_btn')
//				.attr({'id':'fs_filter_select_win','title':'一覧より選択'})
				.click(function(){
					selectwin_open(sel,def_options);
					return false;//form POST cancel
				})
				.insertAfter(o);
	});

	//
	//入力テキストでターゲットの表示フィルタする
	//
	// @param　attr('fs_filter_target') :             対象エレメント
	// @param　attr('fs_filter_target_search_cond') : 検索条件 'and' 'or'(ﾃﾞｨﾌｫ)
	$('.fs_filter').each(function(i,v){
		var obj = $(v);
		var target           = obj.attr('fs_filter_target');
		var fs_filter_fade   = obj.attr('fs_filter_fade')==undefined ? false : true;
		var fs_filter_eof    = obj.attr('fs_filter_eof')==undefined ? '' : obj.attr('fs_filter_eof');
		var target_parent    = obj.attr('fs_filter_parent')==undefined ? 'tr' : obj.attr('fs_filter_parent');
		var search_cond_root = obj.attr('fs_filter_target_search_cond')==undefined ? 'none' : obj.attr('fs_filter_target_search_cond').toLocaleLowerCase();//検索条件: and or


		//対象エレメント単語一覧取得
		//var m_keywords = [];$(selector,target).each(function (i,v){m_keywords.push( $(this).text() );});
		obj
			.bind( 'keyup change', function(){ //キーアップ入力がされと時
				var w = $(this).val();
				var search_cond = search_cond_root=='none' ? ( w.indexOf('&')!=-1 ? 2  : 1 ) : (search_cond_root=='and' ? 2 : 1 );//検索条件入力により決定:ｽﾍﾟｰｽ区切りでOR &区切りでAND

				//FIXME: AND OR 混合

				switch(search_cond){
				case 0://1word match
					$(target).each(function (i,v){
						var _this = $(v);
						if( _this.text().indexOf(w)!=-1 ){
							if(fs_filter_fade){
								_this.closest(target_parent).fadeIn().data('s',1);
							}else{
								_this.closest(target_parent).show().data('s',1);
							}
						}else{
							if(fs_filter_fade){
								_this.closest(target_parent).fadeOut().data('s',0);
							}else{
								_this.closest(target_parent).hide().data('s',0);
							}
						}
					});
					break;
				case 1://OR only
					{
					var words = words_split(w,1);
					$(target).each(function (i,v){
						var _this = $(v);
						var text = _this.text();
						if( fs_filter_eof!='' ){
							text = text.substring( 0, text.indexOf(fs_filter_eof) );
						}
						var is_show= ( words.length==1 && words[0]=='' ) ? true : false;//空文字は全表示
						if(is_show==false){
							for(i=0;i<words.length;i++){//表示文字列があるか判定
								if(text.indexOf(words[i])!=-1){
									is_show=true;break;
								}
							}
						}

						if( is_show ){
							if(fs_filter_fade){
								_this.closest(target_parent).fadeIn().data('s',1);
							}else{
								_this.closest(target_parent).show().data('s',1);
							}

						}else{
							if(fs_filter_fade){
								_this.closest(target_parent).fadeOut().data('s',0);
							}else{
								_this.closest(target_parent).hide().data('s',0);
							}
						}
					});
					}
					break;

				case 2://AND only
					{
					var words = words_split(w,0);
					$(target).each(function (i,v){
						var _this = $(v);
			            var nMach = 0;
			        	for(i=0;i<words.length;i++){
		                    var match=false;
		                    //完全マッチ
							if(_this.text().indexOf(words[i])!=-1){
								match==true;
		                        nMach++;
		                    }
		                    //複数属性でヒットする場合があるので1つマッチで次の文字列へ
		                    //<例>20ｷｰﾜｰﾄﾞで, 属性1:更新日:2014/11/14  属性2:作成日2014/10/01 の20が2つヒットするような場合
		                    //if(match==true){
		                    //  nMach++;break;
		                    //}
			            }
			            var is_show  =(nMach==words.length) ? true : false;
						if( is_show ){
							if(fs_filter_fade){
								_this.closest(target_parent).fadeIn().data('s',1);
							}else{
								_this.closest(target_parent).show().data('s',1);
							}
						}else{
							if(fs_filter_fade){
								_this.closest(target_parent).fadeOut().data('s',0);
							}else{
								_this.closest(target_parent).hide().data('s',0);
							}
						}
					});
					}
					break;
				}
			})
//			.autocomplete({
//	      		source: m_keywords
//		    });
//			.after( m_keywords ); //入力候補LISTBOX後ろに追加
	});

	$('.fs_filer').fs_filer();

	$('.ch_tiny').ch_tiny();

});

//イメージファイルPOPUP
if($.fn.tooltip && $.fn.tooltip.length!=0){
$(document)
    .tooltip({
        items: ".fs_popup,.fs_img_popup",
        show: {effect: "show", delay:0},
        content: function(){
            var element = $(this);
            if(element.is( "img" )) {
                return '<img src="'+element.attr( "src" )+'">';
            }else{
                var im=element.find('img');
                if(im) {
                    return '<img src="'+im.attr( "src" )+'">';
                }
            }
        }
        ,position:{my: "left top",at: "right+8 top",collision: "flipfit"}
        //,position:{my: "left top",of: event,collision: "fit"}
    });
}

//===========================================================================
// ■ Common Func
//===========================================================================

//QueryStringをObjectに変換($.param() の逆)
//"id=2&arr[]=a&arr[]=b&obj[n]=3&obj[data][]=10&obj[data][]=20&obj[data][]=30"
//↑$.params()
//↓params_r()
//obj={id:2,arr:['a','b'],obj:{n:3,data:[10,20,30]}};
function params_r(query_string){
	var data={};
	php_parse_str(query_string,data);
	return data;
}

/**
 * $.ajax ラッピング
 *  ch_ajax( settings )
 *  ch_ajax( url [, settings ] )
 *  ch_ajax( url [, data ] )
 */
function ch_ajax( url, options_add ){
	if ( typeof url === "object" ) {
		options_add = url;
	}else{
		if (options_add.data == undefined) {
			options_add = { 'data': options_add };
		}
		options_add['url'] = url;
	}

	var options = {
		"type": "POST"
		,"dataType": "json"
		,"data" : {
//			 "ajax_get_tm":0	//TODO:初回取得タイムスタンプ (キャッシュ使用判定等に利用)
//			,"draw":1 			//TODO:クライアント同一画面からの呼び出し回数(画面再読み込みなしで)
		}
//		,beforeSend: function(jqXHR, settings) {
//        	jqXHR.fc_ajax_options = settings
//	    }
		,"timeout": 8000
		//User拡張オプション
		,"is_retry": 1			 //リトライする
   		,"ch_retry_count" : 0
    	,"ch_retry_limit" : 1	 //通信タイムアウト時、リトライする回数
		,"is_fail_alert": true   //fail時にアラートを出す
		,"is_loadding": true 	 //ローディング表示をするか?
	};
	if($.cookie!==undefined){
		options.data['csrf_token'] = $.cookie('csrf_cookie'); //add_ajax_param_for_csrf
	}

	$.extend(true,options,options_add);

	if( options.is_loadding ){
		$('#loading').show();
	}

	var jqXHR  = $.ajax(options)

	jqXHR
		.done(function(data, textStatus, jqXHR){//成功時:200
			return g.on_ch_ajax_done(data, textStatus, jqXHR,this);
		})
		.fail(function(data, textStatus, errorThrown){
			return g.on_ch_ajax_fail(data, textStatus, errorThrown,this);
		})
		.always(function(data, textStatus, returnedObject){
			if( this.is_loadding ){
				$("#loading").fadeOut(G.LOADDING_FADE_OUT);
			}
			g.on_ch_ajax_always(data, textStatus, returnedObject,this);
		});
	return jqXHR;
}

/**
 * 確認ダイアログ ([OK][キャンセル])
 *  @param {string} msg メッセージ(HTML)
 *  @param {array|object} [options] jQuery.dialogのオプション と Userオプション
 *   Userオプション  :
 *   	dialog_class　ダイアログのスタイル。
 *  @param {function} [onOk]
 *  @param {function} [onCancel]
 *  @returns {jQuery}
 */
function ch_confirm(msg,options,onOk,onCancel)
{
	var dlg = $('#dlg_confirm');
	if( dlg.is(':visible') ){dlg.dialog( "close" );return;}
	options = options || {};
	options.dialog_class = options.dialog_class!==undefined ? options.dialog_class : ''; //ダイアログのスタイル ディフォルト設定

	var deferred = $.Deferred();

	if(dlg.length==0){
		var html =
		'<div id="dlg_confirm" class="confirm" class="display:none">' +
			'<div id="confirm_msg" class="center"></div>'+
		'<div>';
		$('body').after(html);
		dlg = $('#dlg_confirm');
	}

	var options_def = {
		autoOpen: true
		,title: '確認'
		,modal: true
		,draggable: g.dialog_options.draggable
		,resizable: g.dialog_options.resizable
		,position: {
			my: "center center",
			at: "center center",
			of: $(window)
		}
		,show: g.dialog_options.show
		,hide: g.dialog_options.hide
//		,width: parseInt($(window).width()*0.8)
        ,buttons: {
            'はい': function() {
				var ret=true;
		        dlg.data('ch_result',true);
              $( this ).dialog( "close" );
            }
            ,'いいえ': function() {
				var ret=false;
		        dlg.data('ch_result',false);
              $( this ).dialog( "close" );
            }
        }
		,'create': function( event, ui ){
			var dlg = $(this);

			// dlg.find('#confirm_ok').button().click(function(event){
			// 	var ret=true;
		 //        dlg.data('ch_result',true);
		 //        dlg.dialog( "close" );
			// });
			// dlg.find('#confirm_ng').button().click(function(event){
			// 	var ret=false;
		 //        dlg.data('ch_result',false);
		 //        dlg.dialog( "close");
			// });

			if(options.is_close_overlay===true){
				$(document).on('click','.ui-widget-overlay.ui-front',function(){
			        dlg.dialog( "close" );
				});
			}
		}
		,'close': function( event, ui ){
			var dlg = $(this)
			var ch_result = dlg.data('ch_result');
			if(ch_result){
				if(typeof onOk === "function") ret=onOk(event,ch_result,msg,options,onOk,onCancel);
				deferred.resolve(ch_result,msg,options,onOk,onCancel);
			}else{
				if(typeof onCancel === "function") ret=onCancel(event,ch_result,msg,options,onOk,onCancel);
				deferred.reject(ch_result,msg,options,onOk,onCancel);
			}
		}
		,'open': function( event, ui, a ){
			var dlg = $(this)
			msg = msg.replace(/(\\n|\\r)/g, "<br />");
			dlg.find('#confirm_msg').html(msg);
		}
	};
	options_def['classes'] = { "ui-dialog": options.dialog_class };
	$.extend(true,options_def,options);
	dlg.dialog(options_def);
	return deferred.promise();
}


/**
 * 警告ダイアログ ([OK])
 *  @param {string} msg メッセージ(HTML)
 *  @param {array|object} [options] jQuery.dialogのオプション と Userオプション
 *   Userオプション  :
 *   	dialog_class　ダイアログのスタイル。
 *  @param {function} [onOk]
 *  @returns {jQuery}
 */
function ch_alert(msg,options,onOk)
{
	if(typeof msg !== "string" ) return;
	options = options || {};
	options.dialog_class = options.dialog_class!==undefined ? options.dialog_class : 'alert'; //ディフォルト設定

	var dlg = $('#dlg_alert');
	if( dlg.is(':visible') ){dlg.dialog( "close" );return;}

	var deferred = $.Deferred();

	if(dlg.length==0){
		var html =
		'<div id="dlg_alert" class="alert" class="display:none">'+
			'<div id="alert_msg" class="center"></div>'+
		'<div>';

		$('body').after(html);
		dlg = $('#dlg_alert');
	}


	var options_def = {
		autoOpen: true
		,title: ''
		,modal: true
		,draggable: g.dialog_options.draggable
		,resizable: g.dialog_options.resizable
		,classes: {
			"ui-dialog": "alert"
		}
		,position: {
			my: "center center",
			at: "center center",
			of: $(window)
		}
		,show: g.dialog_options.show
		,hide: g.dialog_options.hide
//		,width: parseInt($(window).width()*0.8)
        ,buttons: {
            '閉じる': function() {
				var ret=true;
				//if(onOk!=undefined) ret=onOk(e,ret);
		        dlg.data('ch_result',true);
				$( this ).dialog( "close" );
            }
        }
		,'create': function( event, ui ){
			var dlg = $(this);

			// dlg.find('#alert_ok').button().click(function(event){
			// 	var ret=true;
			// 	//if(onOk!=undefined) ret=onOk(e,ret);
		 //        dlg.data('ch_result',true);
		 //        dlg.dialog( "close" );
			// });

			if(options.is_close_overlay===true){
				$(document).on('click','.ui-widget-overlay.ui-front',function(){
			        dlg.dialog( "close" );
				});
			}
		}
		,'close': function( event, ui ){
			var dlg = $(this)
			var ch_result = dlg.data('ch_result');
			if(typeof onOk === "function") ret=onOk(event,ch_result,msg,options,onOk);
			deferred.resolve(ch_result,msg,options,onOk)
		}
		,'open': function( event, ui, a ){
			var dlg = $(this)
			msg = msg.replace(/(\\n|\\r)/g, "<br />");
			dlg.find('#alert_msg').html(msg);
		}
	};
	options_def['classes'] = { "ui-dialog": options.dialog_class };
	$.extend(true,options_def,options);//オプションマージ
	dlg.dialog(options_def);
	return deferred.promise();
}

/**
 * [ch_selectbox_create description]
 * @param  {[type]} sel       [description]
 * @param  {[type]} data      [description]
 * @param  {[type]} idx_value [description]
 * @param  {[type]} idx_text  [description]
 * @return {[type]}           [description]
 */
function ch_selectbox_create(sel,data,idx_value,idx_text)
{
	var o=$(sel);
	o.find('option').remove();
	html_options='';
	for(i=0;i<data.length;i++){
		html_options += '<option value="'+data[i][idx_value]+'">'+data[i][idx_text]+'</option>';
		//sel.append($("<option>").attr('value',this.val).text(this.text));
	}
	o.append(html_options);
	return o;
}

//===========================================================================
// ■
//===========================================================================
g.on_header_ready();

$(document).ready(function(){
	g.on_document_ready();
});
