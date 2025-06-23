# DC.js 多次元チャートデータ一覧

[ENGLISH](README.md)

このディレクトリには、DC.jsを使用した多次元チャート用のデータファイルが格納されています。各データセットは、複数のディメンション（次元）でフィルタリングや分析ができる形式で構造化されています。

## データの特徴

各データセットには、以下の共通の特徴があります：

1. **複数のディメンション**: 全てのデータが複数のカラムを持ち、様々な軸で分析可能
2. **カウント列の存在**: 多くのデータが「カウント」カラムを持ち、数値指標として利用
3. **日付/時間軸**: 時系列データとして分析できる日付または年月の列を持つケースが多い
4. **地理情報**: 都道府県や市区町村などの地理的情報を含むケースが多い
5. **カテゴリー情報**: ジャンル、職業、ステータスなどカテゴリーデータを含む
6. **数値指標**: 年齢、価格、評価、数量などの数値データを含む

## データ種類とフォーマット

### 1. コロナ感染者データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=covid19-data-2022-02-18)
- **ファイル**: `covid19-data-*.csv`
- **フォーマット**:
  ```
  日付,性別,年齢,状態,都道府県,市区町村,職業,職業カテゴリ,人数
  ```
- **説明**: 新型コロナウイルス感染症の感染者データ。日付、性別、年齢、状態（退院など）、地域情報、職業が含まれる
- **データ出典**: 厚生労働省オープンデータ

### 2. 気象データ

#### 日本の気温データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-temperature)
- **ファイル**: `ja-weather-temperature.csv`
- **フォーマット**:
  ```
  🌡️平均気温の合計(℃),☔降水量の合計(mm),💨平均風速(m/s),🧭最多風向(16方位),🏢都道府県,🏙️市区町村,❄️降雪量合計(cm),⚪未使用,🌡️平均気温(℃),💧平均湿度(％),☁️平均雲量(10分比),♨️平均蒸気圧(hPa),🔄平均現地気圧(hPa),☀️日照時間(時間),🌨️雪日数(日),⚡雷日数(日),🌫️霧日数(日)
  ```
- **説明**: 日本の主要都市の平均気温データ。平均気温、降水量、風速、風向、都道府県、市区町村、その他の気象情報（湿度、雲量、気圧、日照時間、雪日数など）が含まれる
- **データ出典**: [過去の気象データ・ダウンロード@気象庁](https://www.data.jma.go.jp/risk/obsdl/)

#### 日本の降水量データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-precipitation)
- **ファイル**: `ja-weather-precipitation.csv`
- **フォーマット**:
  ```
  ☔降水量の合計(mm),🌡️平均気温(℃),💨平均風速(m/s),🧭最多風向(16方位),🏢都道府県,🏙️市区町村,❄️降雪量合計(cm),⚪未使用,☔降水量の合計(mm):Base,💧平均湿度(％),☁️平均雲量(10分比),♨️平均蒸気圧(hPa),🔄平均現地気圧(hPa),☀️日照時間(時間),🌨️雪日数(日),⚡雷日数(日),🌫️霧日数(日)
  ```
- **説明**: 日本の主要都市の降水量データ。降水量、平均気温、風速、風向、都道府県、市区町村、その他の気象情報（湿度、雲量、気圧、日照時間、雪日数など）が含まれる
- **データ出典**: [過去の気象データ・ダウンロード@気象庁](https://www.data.jma.go.jp/risk/obsdl/)

### 3. ゲームデータ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-fc)
- **ファイル**: `game-fc.csv`, `game-gb.csv`, `game-ps1.csv` など
- **フォーマット**:
  ```
  発売日,クロスレビュー(評価),容量(bit),ジャンル,メーカー,タイトル,価格,ジョブカテゴリ,売り上げ本数TOP50,ハード,カセットカラー,ラベル,「対戦」といえば？,「ハイスコア」といえば？,「クリアできなかった」といえば？
  ```
- **説明**: 様々なゲームプラットフォーム（FC、GB、PS1など）のゲームタイトル情報。発売日、評価、ジャンル、メーカー、価格、売上などが含まれる
- **データ出典**:
  - [各種ゲーム機 カセット・ソフトタイトルリスト](http://pasofami.game.coocan.jp/game/game.htm)
  - [ファミコン＆ディスクシステム歴代ソフト売上ランキング](https://www.gavas.jp/user_data/famicom_game_ranking.php)
  - [ファミコン国民投票](https://www.nintendo.com/jp/famicom/vote/index.html)

### 4. ラーメン店データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=food-ramen)
- **ファイル**: `food-ramen.csv`
- **フォーマット**:
  ```
  創業年,麺の種類(サンプル),価格帯(サンプル),ジャンル(サンプル),都道府県,🍜ラーメン店名,🚉最寄り駅・住所,ジョブカテゴリ,カウント
  ```
- **説明**: ラーメン店の情報。創業年、麺の種類、価格帯、ジャンル、地域情報、店名、最寄り駅が含まれる
- **データ出典**: [有名ラーメン店の創業年表｜年代別@らーめん自由区](http://ramenjiyuku.web.fc2.com/)

### 5. 心臓病データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=kaggle-heart-disease)
- **ファイル**: `kaggle-heart-disease.csv`
- **フォーマット**:
  ```
  日付,性別,年齢,胸痛のタイプ,主要血管の数,サラセミアのタイプ,ピーク運動STセグメントの傾斜,未使用,カウント,🔖安静時血圧,🔖血清コレステロール値,空腹時血糖値120 mg/dl以上,安静時心電図の結果,🔖最大心拍数,運動誘発性狭心症,安静時と比較した運動によるST低下,⚠心臓発作のリスク
  ```
- **説明**: 心臓病に関連する医療データ。性別、年齢、各種検査結果、症状、リスク評価などが含まれる
- **データ出典**: [Heart Disease Prediction Dataset@kaggle](https://www.kaggle.com/datasets/mfarhaannazirkhan/heart-dataset/data)

### 6. 自治体企業データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-municipality-company)
- **ファイル**: `resas-municipality-company.csv`
- **フォーマット**:
  ```
  年,地域,企業,産業大分類(横),都道府県,産業大分類,業種中分類,未使用,カウント
  ```
- **説明**: 地方自治体の企業データ。年、地域、企業種類、産業分類、都道府県などが含まれる
- **データ出典**:
  - [産業構造マップ > 全産業 > 企業数 @RESAS(地域経済分析システム)API](https://opendata.resas-portal.go.jp/docs/api/v1/municipality/company/perYear.html)
  - [産業構造マップ > 全産業 > 企業数 @RESAS](https://resas.go.jp/municipality-company/#/graph/13/13101/2014/-/-/0/5.333900736553437/41.42090017812787/142.29371418128918/-)

### 7. 高校野球データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=sports-hsb)
- **ファイル**: `sports-hsb.csv`
- **フォーマット**:
  ```
  年,順位,決勝スコア,監督(ｻﾝﾌﾟﾙ),都道府県,代表校,有名選手(ｻﾝﾌﾟﾙ),未使用,カウント
  ```
- **説明**: 高校野球の大会結果データ。年、順位、決勝スコア、監督、都道府県、代表校、有名選手などが含まれる
- **データ出典**:
  - [【夏の甲子園】歴代優勝・準優勝校一覧＠baseballking](https://baseballking.jp/ns/161307)
  - [全国高等学校野球選手権大会歴代優勝校＠wikipedia](https://ja.wikipedia.org/wiki/全国高等学校野球選手権大会歴代優勝校)

### 8. 記事いいねデータ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-article-like)
- **ファイル**: `test-article-like.csv`
- **フォーマット**:
  ```
  日付(記事作成者),性別(記事作成者),年齢(記事作成者),🔖記事の種類,都道府県(記事作成者),🔖記事のテーマ・ジャンル,職業(記事作成者),未使用,いいねの数,🔖記事の読者層,🔖記事のSEO
  ```
- **説明**: 記事のいいね数データ。記事作成日、作成者情報、記事の種類、テーマ、いいね数、読者層などが含まれる
- **データ出典**: サンプルデータ ※性別・年齢・職業・都道府県は、「記事作成者」の情報

### 9. 能登地震安否確認データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-quake-noto-safety)
- **ファイル**: `ja-quake-noto-safety.csv`
- **フォーマット**:
  ```
  安否不明者数(公表日別),性別,年齢,安否確認状態,市,市区町村,氏名,職業カテゴリ,カウント
  ```
- **説明**: 能登半島地震の安否確認データ。安否不明者数、性別、年齢、確認状態、地域情報、氏名などが含まれる
- **データ出典**:
  - [令和6年（2024年）能登半島地震に関する情報（対策本部・被災状況）@石川県](https://www.pref.ishikawa.lg.jp/saigai/202401jishin-taisakuhonbu.html#higai)
  - Wikipedia

### 10. 経営動向・DI指標データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=store-di)
- **ファイル**: `store-di.csv`
- **フォーマット**:
  ```
  年月,経営動向・景況感,現状・見通,変化,DI,未使用1,未使用4,ジョブカテゴリ,カウント
  ```
- **説明**: 経営動向調査のDI（Diffusion Index）指標データ。年月、経営動向、現状・見通し、変化、DI値などが含まれる
- **データ出典**: [スーパーマーケット 経営動向・景況感 調査結果@一般社団法人全国スーパーマーケット協会](http://www.j-sosm.jp/dl/index.html)

### 11. 農業関連データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-agriculture)
- **ファイル**: `resas-agriculture.csv`
- **フォーマット**:
  ```
  年,品目大分類,品目分類,品目名(横),都道府県,品目名,農業団体(サンプル),未使用5,カウント
  ```
- **説明**: 農業統計データ。年、品目分類、都道府県、農業団体などの情報が含まれる
- **データ出典**:
  - [品目別農業産出額 @RESAS(地域経済分析システム)API](https://opendata.resas-portal.go.jp/docs/api/v1/agriculture/all/forStackedBar.html)
  - [産業構造マップ > 農業 > 農業の構造 @RESAS](https://resas.go.jp/agriculture-all/#/rate/5.333900736553437/41.42090017812787/142.29371418128918/13/13101/0/2016/1/-/-)

### 12. きくらげ栽培データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-agr-kikurage)
- **ファイル**: `test-agr-kikurage.csv`
- **フォーマット**:
  ```
  日付,品種,種菌出所,栽培方法,栽培都道府県,品名,その他要素※,販売形態,売り上げ
  ```
- **説明**: きくらげの栽培・販売データ。品種、栽培方法、地域、販売形態、売上などの情報が含まれる
- **データ出典**: サンプルデータ
  - ※「その他要素」は、複数の要素(平均温度、平均湿度、タンパク質含有量、食物繊維含有量)の各項目をA～Dで表した文字列

### 13. 訪日外国人観光データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-tourism-foreigners)
- **ファイル**: `resas-tourism-foreigners.csv`
- **フォーマット**:
  ```
  年,訪問目的,訪問者地域,訪問者国籍(横),訪問都道府県,訪問者国籍,観光地(サンプル),未使用,カウント
  ```
- **説明**: 訪日外国人の観光データ。訪問年、目的、訪問者の国籍・地域、訪問先都道府県、観光地などの情報が含まれる
- **データ出典**:
  - [指定地域への国籍別訪問者数 @RESAS(地域経済分析システム)API](https://opendata.resas-portal.go.jp/docs/api/v1/tourism/foreigners/forFrom.html)
  - [観光マップ > 外国人 > 外国人訪問分析 @RESAS](https://resas.go.jp/tourism-foreigners/#/to-transition/5.333900736553437/41.42090017812787/142.29371418128918/13/13101/100/0/0.0/2020/5/-/-/1/-/-)

### 14. 自治体税金データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-municipality-taxes)
- **ファイル**: `resas-municipality-taxes.csv`
- **フォーマット**:
  ```
  年,未使用1,税区分,未使用2,都道府県,市区町村,業種(サンプル),未使用,カウント
  ```
- **説明**: 自治体の税収データ。年、税区分、都道府県、市区町村、業種などの情報が含まれる
- **データ出典**:
  - [地方財政マップ > 一人当たり地方税 @RESAS(地域経済分析システム)API](https://opendata.resas-portal.go.jp/docs/api/v1/municipality/taxes/perYear.html)
  - [地方財政マップ > 一人当たり地方税 @RESAS](https://resas.go.jp/municipality-taxes/#/graph/13/13101/2016/1/7.39231742277876/35.998703685/139.883857/-)

### 15. 東京都知事選挙データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-tokyo-gubernatorial-election)
- **ファイル**: `ja-tokyo-gubernatorial-election.csv`
- **フォーマット**:
  ```
  日付,性別(候補者),年齢(候補者),政党(候補者),立候補者,市区町村,職業(候補者),職業カテゴリ,カウント
  ```
- **説明**: 東京都知事選挙の投票データ。選挙日、候補者情報（性別、年齢、政党、職業）、市区町村別の投票数などが含まれる
- **データ出典**:
  - [NHK選挙WEB 東京都知事選挙2024 選挙結果(7月7日投票)@NHK](https://www.nhk.or.jp/senkyo/database/local/shutoken/20336/skh54664.html)
  - [東京都知事選挙東京都知事選挙（令和6年7月7日執行） 投開票結果@東京都](https://www.senkyo.metro.tokyo.lg.jp/election/tochiji-all/tochiji-sokuhou2024/csv/)
  - Wikipedia

### 16. 店舗数データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=store-cnt)
- **ファイル**: `store-cnt.csv`
- **フォーマット**:
  ```
  年月,未使用2,未使用3,店舗タイプ,都道府県,未使用1,未使用4,ジョブカテゴリ,カウント
  ```
- **説明**: 店舗数の統計データ。年月、店舗タイプ、都道府県ごとの店舗数が含まれる
- **データ出典**: [スーパーマーケット店舗数@一般社団法人全国スーパーマーケット協会](http://www.j-sosm.jp/dl/index.html)

### 17. テスト用データ

#### 基本テストデータ

- **飲料評価データ**: `test-drink.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-drink)
  - **フォーマット**:
    ```
    日付,性別,年齢,評価,都道府県,商品名,職業,未使用,カウント
    ```
  - **説明**: 飲料商品の評価データ。日付、評価者情報（性別、年齢、職業）、商品名、評価などが含まれる
  - **データ出典**: サンプルデータ

- **ランチ購入データ**: `test-lunch.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-lunch)
  - **フォーマット**:
    ```
    購入者数,性別,年齢,商品名,都道府県,店舗,職業,未使用,カウント
    ```
  - **説明**: ランチ商品の購入データ。購入者情報（性別、年齢、職業）、商品名、店舗、都道府県などが含まれる
  - **データ出典**: サンプルデータ

#### 教育分野のテストデータ

- **大学受験データ**: `test-university-entrance.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-university-entrance)
  - **フォーマット**:

    ```csv
    日付,性別,年齢,学部系統,都道府県,市区町村,志望区分,未使用,志願者数,偏差値,合格者数,受験回数,私立公立,学費
    ```

  - **説明**: 大学受験に関するデータ。受験生の基本情報、学部系統、志願者数、偏差値、合格者数、受験回数、学費などが含まれる
  - **データ出典**: サンプルデータ

- **学力テスト結果データ**: `test-academic-achievement.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-academic-achievement)
  - **フォーマット**:

    ```csv
    日付,性別,年齢,教科,都道府県,市区町村,学校種別,未使用,平均点,学校規模,地域区分,習熟度レベル,受験者数,全国順位,偏差値,学習時間
    ```

  - **説明**: 学力テストの結果データ。教科別平均点、学校規模、地域区分、習熟度レベル、受験者数、偏差値、学習時間などが含まれる
  - **データ出典**: サンプルデータ

#### 交通・移動分野のテストデータ

- **交通事故データ**: `test-traffic-accident.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-traffic-accident)
  - **フォーマット**:

    ```csv
    日時,性別,年齢,事故類型,都道府県,市区町村,職業,未使用,カウント,天候,道路種別,車両種別,時間帯,負傷者数
    ```

  - **説明**: 交通事故に関するデータ。事故類型、天候、道路種別、車両種別、時間帯、負傷者数などの詳細情報が含まれる
  - **データ出典**: サンプルデータ

- **公共交通利用データ**: `test-public-transport.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-public-transport)
  - **フォーマット**:

    ```csv
    年月,路線名,駅名,都道府県,利用者数,時間帯,曜日区分,季節,交通手段
    ```

  - **説明**: 公共交通機関の利用状況データ。路線別、時間帯別、曜日区分、季節変動の分析が可能
  - **データ出典**: サンプルデータ

#### 住宅・不動産分野のテストデータ

- **不動産取引データ**: `test-real-estate.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-real-estate)
  - **フォーマット**:

    ```csv
    年月,都道府県,市区町村,物件種別,築年数,面積,価格,最寄り駅距離,間取り,取引件数
    ```

  - **説明**: 不動産取引に関するデータ。物件種別、築年数、面積、価格、駅距離、間取り別の取引動向が分析可能
  - **データ出典**: サンプルデータ

- **住宅着工統計**: `test-housing-construction.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-housing-construction)
  - **フォーマット**:

    ```csv
    年月,都道府県,構造区分,建て方,利用関係,床面積,工事費予定額,着工戸数,世帯構成
    ```

  - **説明**: 住宅着工に関するデータ。構造区分、建て方、利用関係、床面積、工事費、着工戸数の動向分析
  - **データ出典**: サンプルデータ

#### 消費行動分野のテストデータ

- **家計調査データ**: `test-household-survey.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-household-survey)
  - **フォーマット**:

    ```csv
    年月,都道府県,世帯人員,年齢階級,職業,支出項目,支出金額,収入,貯蓄額,消費性向
    ```

  - **説明**: 家計の消費行動データ。支出項目別、年齢階級別、職業別の消費動向分析が可能
  - **データ出典**: サンプルデータ

- **電子商取引データ**: `test-ecommerce.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-ecommerce)
  - **フォーマット**:

    ```csv
    日付,性別,年齢,商品カテゴリ,都道府県,市区町村,職業,未使用,購入金額,デバイス種別,決済方法,購入回数,配送方法,満足度,会員ランク,利用時間帯
    ```

  - **説明**: EC（電子商取引）の購入データ。商品カテゴリ別、デバイス種別、決済方法、利用時間帯などの詳細分析が可能
  - **データ出典**: サンプルデータ

#### 環境・エネルギー分野のテストデータ

- **環境調査データ**: `test-environment-survey.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-environment-survey)
  - **フォーマット**:

    ```csv
    日時,都道府県,測定局名,汚染物質,濃度,気象条件,季節,地域特性,測定値数
    ```

  - **説明**: 環境汚染の測定データ。汚染物質別、気象条件別、季節変動、地域特性の分析が可能
  - **データ出典**: サンプルデータ

#### 労働・雇用分野のテストデータ

- **雇用・労働データ**: `test-employment-labor.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-employment-labor)
  - **フォーマット**:

    ```csv
    年月,都道府県,職種,業界,年齢層,性別,求人数,平均給与,雇用形態,経験年数
    ```

  - **説明**: 求人・転職市場のデータ。職種別、業界別、年齢層別の求人動向と給与水準の分析が可能
  - **データ出典**: サンプルデータ

#### 国際・世界データ分野のテストデータ

- **世界環境・気候変動データ**: `test-global-climate-environmental.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-global-climate-environmental)
  - **フォーマット**:

    ```csv
    日付,平均気温変化(℃),森林被覆率(%),CO2排出量(トン/人),国名,大陸,未使用,再生可能エネルギー比率,カウント,再生可能エネルギー比率(%),水資源量(1人当たり立方メートル),大気汚染指数(PM2.5濃度),環境政策スコア(100点満点),エネルギー消費量(1人当たりTOE),海面上昇影響度(mm/年)
    ```

  - **説明**: 世界各国の環境・気候変動データ。CO2排出量、再生可能エネルギー比率、森林被覆率、大気汚染指数など多角的な環境指標の分析が可能
  - **データ出典**: サンプルデータ

- **世界教育・人材開発データ**: `test-global-education-human-development.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-global-education-human-development)
  - **フォーマット**:

    ```csv
    年度,性別,年齢,国・地域名,大陸,経済レベル,政治体制,未使用,識字率,大学進学率,研究開発費率,特許出願数,教育予算率,平均教育年数,デジタルリテラシー率,イノベーション指数
    ```

  - **説明**: 世界各国の教育・人材開発指標データ。識字率、大学進学率、研究開発費、特許出願数、イノベーション指数の国際比較分析が可能
  - **データ出典**: サンプルデータ

- **世界保健・医療システムデータ**: `test-global-health-medical-systems.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-global-health-medical-systems)
  - **フォーマット**:

    ```csv
    年度,性別,年齢,国・地域名,大陸,所得グループ,医療制度型,未使用,平均寿命,乳児死亡率,医療費率,医師数率,病床数率,ワクチン接種率,感染症発生率,医療アクセス指数
    ```

  - **説明**: 世界各国の保健・医療システムデータ。平均寿命、医療費、医師数、病床数、ワクチン接種率など医療システムの国際比較分析が可能
  - **データ出典**: サンプルデータ

#### その他の分野のテストデータ

- **犯罪統計データ**: `test-crime-statistics.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-crime-statistics)
  - **説明**: 犯罪発生状況の統計データ。犯罪種別、発生時間帯、地域別の治安状況分析が可能

- **インターネット利用状況**: `test-internet-usage.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-internet-usage)
  - **説明**: インターネット利用状況データ。年齢層別、利用目的別、デバイス別の利用動向分析

- **投資信託データ**: `test-investment-trust.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-investment-trust)
  - **説明**: 投資信託の運用データ。ファンド種別、投資地域別、リスク区分別の投資動向分析

- **医療調査データ**: `test-medical-survey.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-medical-survey)
  - **説明**: 医療に関する調査データ。診療科別、年齢層別、地域別の医療利用状況分析

- **映画興行データ**: `test-movie-box-office.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-movie-box-office)
  - **説明**: 映画の興行成績データ。ジャンル別、上映期間別、観客動員数の分析

- **博物館来館データ**: `test-museum-visitor.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-museum-visitor)
  - **説明**: 博物館・美術館の来館者データ。施設種別、展示内容別、年齢層別の来館動向分析

- **特許出願データ**: `test-patent-application.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-patent-application)
  - **説明**: 特許出願に関するデータ。技術分野別、出願人種別、地域別の特許動向分析

- **小売調査データ**: `test-retail-survey.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-retail-survey)
  - **説明**: 小売業の調査データ。業態別、立地条件別、売上動向の分析

- **国際貿易データ**: `test-international-trade.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-international-trade)
  - **説明**: 国際貿易統計データ。品目別、相手国別、輸出入動向の分析

- **訪日外国人消費データ**: `test-foreign-visitor-consumption.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-foreign-visitor-consumption)
  - **説明**: 訪日外国人の消費行動データ。国籍別、消費項目別、地域別の消費動向分析

※各テストデータは、DC.jsを使用した多次元チャート分析のサンプルとして作成されており、実際のデータ分析手法や可視化技術の学習・検証に活用できます。

## 使用方法

1. CSVファイルを基本データとし、対応する`.options.json`ファイルに表示設定を定義
2. `DcChart.vue`コンポーネントでデータを読み込み、多次元チャートを表示
3. `FileSelectMenu.vue`コンポーネントを使用してデータファイルを選択可能
