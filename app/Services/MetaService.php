<?php

namespace App\Services;

use Illuminate\Support\Str;

class MetaService
{
    private array $filterFiles;
    private array $metaConfig;


    public function __construct() {
        // MEMO:ここは resources/js/Components/DcChart.vue:2661 "filer_files": と同期
        $this->filterFiles = [
//		'covid19-japan.jpg' => 'covid19-data.json',
            'covid19-japan.jpg' => 'covid19-data-2021-02-28.json',
            'food-ramen.jpg' => 'food-ramen.csv',
            'ja-quake-noto-safety.jpg' => 'ja-quake-noto-safety.csv',
            'ja-tokyo-gubernatorial-election.jpg' => 'ja-tokyo-gubernatorial-election.csv',
            'resas-agriculture.jpg' => 'resas-agriculture.csv',
            'resas-product-sales.jpg' => 'resas-product-sales.csv',
            'resas-tourism-foreigners.jpg' => 'resas-tourism-foreigners.csv',
            'resas-municipality-company.jpg' => 'resas-municipality-company.csv',
            'resas-municipality-taxes.jpg' => 'resas-municipality-taxes.csv',
            'resas-municipality-manufacture.jpg' => 'resas-municipality-manufacture.csv',
            'game-1983-msx.jpg' => 'game-msx.csv',
            'game-1983-fc.jpg' => 'game-fc.csv',
            'game-1987-pce.jpg' => 'game-pce.csv',
            'game-1988-smd.jpg' => 'game-smd.csv',
            'game-1989-gb.jpg' => 'game-gb.csv',
            'game-1990-smc.jpg' => 'game-smc.csv',
            'game-1991-gen4.jpg' => 'game-gen4.csv',
//            'game-1991-gen4.jpg' => ($g_is_pc ? 'game-gen4.csv' : 'game-gen4-no_fc.csv'),
            'game-1994-ps1.jpg' => 'game-ps1.csv',
            'game-1995-ss.jpg' => 'game-ss.csv',
            'game-1996-n64.jpg' => 'game-n64.csv',
            'game-2001-gba.jpg' => 'game-gba.csv',
            'game-gen3.jpg' => 'game-gen3.csv',
            'game-ac.jpg' => 'game-ac.csv',
            'test-drink.jpg' => 'test-drink.json',
            'test-lunch.jpg' => 'test-lunch.json',
            'test-agr-kikurage.jpg' => 'test-agr-kikurage.csv',
            'sports-hsb.jpg' => 'sports-hsb.csv',
            'store-cnt.jpg' => 'store-cnt.csv',
            'store-di.jpg' => 'store-di.csv',
        ];
        $this->metaConfig = [
            'covid19' => [
                'title' => '新型コロナウイルス感染状況 多次元チャート',
                'favicon' => '/img/bar-chart.gif',
                //'favicon' => '/img/cross.gif',
                'keywords' => '新型コロナウイルス,コロナ,感染,感染者数,可視化,グラフ,チャート',
                'description' => '新型コロナウイルスの感染状況をリアルタイムで可視化。感染者数の推移や地域別の状況を多次元チャートで表示します。',
                'og:image' => 'covid19-japan.jpg'
            ],
        ];
    }

    public function getImageFile($name) {
        foreach ($this->filterFiles as $k => $v) {
            if (str_starts_with($v, $name))
                return "/upload/csv/$k";
        }
    }

    public function getMetaData(?string $data = null): array {
        if (Str::startsWith($data, 'covid19')) {
            return $this->metaConfig['covid19'];
        } else if (Str::startsWith($data, 'game-')) {
            $title = 'ゲーム';
            $titles = [
                'game-msx' => 'MSX',
                'game-fc' => 'ファミコン',
                'game-fds' => 'ディスクシステム',
                'game-smc' => 'スーパーファミコン',
                'game-n64' => 'NINTENDO64',
                'game-smd' => 'メガドライブ',
                'game-pce' => 'PCエンジン',
                'game-gb' => 'ゲームボーイ',
                'game-gba' => 'ゲームボーイアドバンス',
                'game-ps1' => 'プレイステーション1',
                'game-ss' => 'セガサターン',
                'game-gc' => 'ゲームキューブ',
                'game-gen3' => '第3～5世代家庭用ゲーム機',
                'game-ac' => '「アーケードゲーム」(ビデオゲーム)',
                'game-gen4' => '第4世代家庭用ゲーム機(PCエンジン・メガドライブ・スーパーファミコン)',
            ];

            foreach ($titles as $k => $v) {
                if (Str::startsWith($data, $k)) {
                    $title = $v;
                    break;
                }
            }

            return [
                'title' => "「{$title}」ソフト一覧",
                'favicon' => '/img/bar-chart.gif',
                'keywords' => "{$title},ゲームタイトル一覧,可視化,グラフ,チャート,多次元,CSVダウンロード,Japan,Visualization,graph,chart,dc.js,csvdownload",
                'description' => "{$title}の一覧を多次元チャートで可視化。発売年やジャンル、メーカーなど様々な視点から分析できます。",
                'og:image' => $this->getImageFile($data),
            ];
        } else {
            $titles = [
                'food-ramen' => '全国有名ラーメン店一覧',
                'ja-quake' => '能登半島地震安否不明者一覧',
                'ja-tokyo-gubernatorial' => '東京都知事選挙　候補者別得票数 2024/7/7(日)',
                'sports-hsb' => '全国高等学校野球選手権大会　歴代優勝・準優勝校一覧',
                'resas-tourism-foreigners' => '日本の「指定地域への国籍別訪問者数」',
                'resas-agriculture' => '日本の「品目別農業産出額」',
                'usaha-municipality-company' => '日本の「企業数(市区町村・産業分類・業種別)」',
                'usaha-municipality-manufacture' => '日本の「製造品出荷額(製造業)」',
                'usaha-municipality-taxes' => '日本の「一人当たり地方税」',
                'usaha-product-sales' => '日本の「年間商品販売額」',
            ];
            $title = 'CSVデータ';
            foreach ($titles as $key => $value) {
                if (Str::startsWith($data, $key)) {
                    $title = $value;
                    break;
                }
            }

            return [
                'title' => $title,
                'favicon' => '/img/bar-chart.gif',
                'keywords' => "{$title},可視化,グラフ,チャート,多次元,CSVダウンロード,Japan,Visualization,graph,chart,dc.js,csvdownload",
                'description' => "{$title}を多次元チャートで可視化。チャートの任意の項目のクリックやキーワード検索によって全チャートをフィルタリングして表示する事ができます。",
                'og:image' => $this->getImageFile($data),
            ];
        }
    }
}
