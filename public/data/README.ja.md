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

#### 日本国内 感染状況
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=covid19-data-2021-02-28)（代表例: 2021-02-28）
- **ファイル**: `covid19-data-*.csv`（日付指定で複数バージョンあり）
- **フォーマット**:
  ```
  日付,性別,年齢,状態,都道府県,市区町村,職業,職業カテゴリ,人数
  ```
- **説明**: 新型コロナウイルス感染症の感染者データ。日付、性別、年齢、状態（退院など）、地域情報、職業が含まれる
- **用途**: 都道府県 × 年代 × 時期を同時に絞り込み、感染傾向や流行の波の違いを即座に把握できます。特定地域や属性に限定した比較分析や、感染拡大・収束局面の把握に適しています。
- **データ出典**: 厚生労働省オープンデータ

#### コロナ感染者データ（全世界）
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=covid19-world)
- **ファイル**: `covid19-world.csv`
- **フォーマット**:
  ```
  Date,Sex,Age,Status,Country,Region,Hemisphere,nouse,Count
  ```
- **説明**: 新型コロナウイルス感染症の全世界での感染者・死者データ。日付、国・地域、北半球/南半球、状態（感染/死亡）などが含まれる
- **用途**: 国 × 地域 × 状態 × 時期で絞り込み、感染拡大の地理的パターンや各国の被害状況を即座に比較できます。国際比較やパンデミック分析に適しています。
- **データ出典**: オープンデータ

### 2. 気象データ

#### 日本の気温データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-temperature)
- **ファイル**: `ja-weather-temperature.csv`
- **フォーマット**:
  ```
  🌡️平均気温の合計(℃),☔降水量の合計(mm),💨平均風速(m/s),🧭最多風向(16方位),🏢都道府県,🏙️市区町村,❄️降雪量合計(cm),⚪未使用,🌡️平均気温(℃),💧平均湿度(％),☁️平均雲量(10分比),♨️平均蒸気圧(hPa),🔄平均現地気圧(hPa),☀️日照時間(時間),🌨️雪日数(日),⚡雷日数(日),🌫️霧日数(日)
  ```
- **説明**: 日本の主要都市の平均気温データ。平均気温、降水量、風速、風向、都道府県、市区町村、その他の気象情報（湿度、雲量、気圧、日照時間、雪日数など）が含まれる
- **用途**: 地域 × 時期 × 気象条件を組み合わせて絞り込み、イベント日程の気候リスクや農作業スケジュールの判断材料を即座に得られます。旅行計画や建設工事の天候リスク検討にも活用できます。
- **データ出典**: [過去の気象データ・ダウンロード@気象庁](https://www.data.jma.go.jp/risk/obsdl/)

#### 日本の降水量データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-precipitation)
- **ファイル**: `ja-weather-precipitation.csv`
- **フォーマット**:
  ```
  ☔降水量の合計(mm),🌡️平均気温(℃),💨平均風速(m/s),🧭最多風向(16方位),🏢都道府県,🏙️市区町村,❄️降雪量合計(cm),⚪未使用,☔降水量の合計(mm):Base,💧平均湿度(％),☁️平均雲量(10分比),♨️平均蒸気圧(hPa),🔄平均現地気圧(hPa),☀️日照時間(時間),🌨️雪日数(日),⚡雷日数(日),🌫️霧日数(日)
  ```
- **説明**: 日本の主要都市の降水量データ。降水量、平均気温、風速、風向、都道府県、市区町村、その他の気象情報（湿度、雲量、気圧、日照時間、雪日数など）が含まれる
- **用途**: 地域 × 季節 × 降水パターンを同時に可視化し、水害リスクの傾向把握や農業用水計画、インフラ整備の優先地域判断に活用できます。防災担当者が過去の降雨傾向を比較する際にも適しています。
- **データ出典**: [過去の気象データ・ダウンロード@気象庁](https://www.data.jma.go.jp/risk/obsdl/)

#### 日本の気温・降水量データ（主要3都市・153年間）
- [📊気温チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-temperature-3) | [📊降水量チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-precipitation-3)
- **ファイル**: `ja-weather-temperature-3.csv`, `ja-weather-precipitation-3.csv`
- **フォーマット**:
  ```
  🌡️平均気温(℃),☔降水量(mm),💨平均風速,🧭最多風向,🏢都道府県,🏙️市区町村,各種気象指標
  ```
- **説明**: 福岡・東京・札幌の主要3都市における1872年〜の長期気象データ（約153年間）。気候変動の長期的傾向分析に適する
- **用途**: 都市 × 時期（年月）で絞り込み、長期的な気候変動トレンドや都市間の気候差を即座に把握できます。気候研究や歴史的気象分析に活用できます。
- **データ出典**: [過去の気象データ・ダウンロード@気象庁](https://www.data.jma.go.jp/risk/obsdl/)

### 3. ゲームデータ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-fc)
- **ファイル**: `game-fc.csv`, `game-gb.csv`, `game-ps1.csv` など
- **フォーマット**:
  ```
  発売日,クロスレビュー(評価),容量(bit),ジャンル,メーカー,タイトル,価格,ジョブカテゴリ,売り上げ本数TOP50,ハード,カセットカラー,ラベル,「対戦」といえば？,「ハイスコア」といえば？,「クリアできなかった」といえば？
  ```
- **説明**: 様々なゲームプラットフォーム（FC、GB、PS1など）のゲームタイトル情報。発売日、評価、ジャンル、メーカー、価格、売上などが含まれる
- **用途**: ハード × ジャンル × 発売年の組合せで絞り込み、人気作品の傾向やメーカー別の強みを即座に把握できます。ゲームコレクターが欲しい作品を絞り込んだり、業界関係者が市場分析に活用できます。
- **データ出典**:
  - [各種ゲーム機 カセット・ソフトタイトルリスト](http://pasofami.game.coocan.jp/game/game.htm)
  - [ファミコン＆ディスクシステム歴代ソフト売上ランキング](https://www.gavas.jp/user_data/famicom_game_ranking.php)
  - [ファミコン国民投票](https://www.nintendo.com/jp/famicom/vote/index.html)

#### ゲームタイトルデータ（ドラゴンクエストモンスター）
- [📊ドラゴンクエスト3 モンスター](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-title-dq3-monster) | [📊ドラゴンクエスト4 モンスター](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-title-dq4-monster)
- **ファイル**: `game-title-dq3-monster.csv`, `game-title-dq4-monster.csv`
- **フォーマット**:
  ```
  プレイ時間,タイプ,LV,出現地方,モンスター名,系統,HP,MP,攻撃力,守備力,素早さ,経験値,GOLD,魔法,ドロップアイテム,耐性 等
  ```
- **説明**: ドラゴンクエスト3・4のモンスター一覧。出現場所、レベル、ステータス、ドロップアイテム、耐性などが含まれる
- **用途**: 出現地方 × 系統 × レベルで絞り込み、レベル上げスポット選定や装備収集の効率化に活用できます。プレイヤーが攻略情報を検索するのに適しています。
- **データ出典**: ゲーム内データ等

### 4. ラーメン店データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=food-ramen)
- **ファイル**: `food-ramen.csv`
- **フォーマット**:
  ```
  創業年,麺の種類(サンプル),価格帯(サンプル),ジャンル(サンプル),都道府県,🍜ラーメン店名,🚉最寄り駅・住所,ジョブカテゴリ,カウント
  ```
- **説明**: ラーメン店の情報。創業年、麺の種類、価格帯、ジャンル、地域情報、店名、最寄り駅が含まれる
- **用途**: 都道府県 × 麺の種類 × 価格帯で絞り込み、出張先や旅行先での候補店選びや、フランチャイズ展開の地域選定に活用できます。美食家が自分の好みに合う店を効率的に発見するのにも適しています。
- **データ出典**: [有名ラーメン店の創業年表｜年代別@らーめん自由区](http://ramenjiyuku.web.fc2.com/)

### 5. 心臓病データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=kaggle-heart-disease)
- **ファイル**: `kaggle-heart-disease.csv`
- **フォーマット**:
  ```
  日付,性別,年齢,胸痛のタイプ,主要血管の数,サラセミアのタイプ,ピーク運動STセグメントの傾斜,未使用,カウント,🔖安静時血圧,🔖血清コレステロール値,空腹時血糖値120 mg/dl以上,安静時心電図の結果,🔖最大心拍数,運動誘発性狭心症,安静時と比較した運動によるST低下,⚠心臓発作のリスク
  ```
- **説明**: 心臓病に関連する医療データ。性別、年齢、各種検査結果、症状、リスク評価などが含まれる
- **用途**: 年齢 × 性別 × 検査値 × リスクを多次元で絞り込み、高リスク群の特徴把握や予防啓発のターゲット設計に活用できます。医療関係者がリスク因子の傾向分析や研修教材づくりに利用するのに適しています。
- **データ出典**: [Heart Disease Prediction Dataset@kaggle](https://www.kaggle.com/datasets/mfarhaannazirkhan/heart-dataset/data)

### 6. 自治体企業データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-municipality-company)
- **ファイル**: `resas-municipality-company.csv`
- **フォーマット**:
  ```
  年,地域,企業,産業大分類(横),都道府県,産業大分類,業種中分類,未使用,カウント
  ```
- **説明**: 地方自治体の企業データ。年、地域、企業種類、産業分類、都道府県などが含まれる
- **用途**: 年次 × 産業 × 地域を同時に絞り込み、自治体職員が産業構造の変化を把握したり、企業が進出候補地域の業界分布を比較できます。地域経済政策や誘致戦略の立案にも役立ちます。
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
- **用途**: 年 × 都道府県 × 順位で絞り込み、地域の高校野球史や強豪校の変遷を即座に把握できます。スポーツライターの取材テーマ発掘や、ファンが地元校の歴代成績を確認するのにも適しています。
- **データ出典**:
  - [【夏の甲子園】歴代優勝・準優勝校一覧＠baseballking](https://baseballking.jp/ns/161307)
  - [全国高等学校野球選手権大会歴代優勝校＠wikipedia](https://ja.wikipedia.org/wiki/全国高等学校野球選手権大会歴代優勝校)

#### スポーツサークル参加動向
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=checkin-sakana)
- **ファイル**: `checkin-sakana.csv`, `checkin-sakana.light.csv`
- **フォーマット**:
  ```
  年月,性別,バドクラス,調子,プレイヤー,出身地,体育館,カウント
  ```
- **説明**: バドミントンサークル「さかな」の参加記録。年月、参加者、体育館、出身地などが含まれる
- **用途**: 年月 × 体育館 × 出身地で絞り込み、参加動向や会場別の利用傾向を即座に把握できます。サークル運営者が練習日程や会場選定の参考に活用できます。
- **データ出典**: サークル運営データ

#### スポーツサークルHPアクセス動向
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=sakana-hp-access)
- **ファイル**: `sakana-hp-access.csv`
- **フォーマット**:
  ```
  日付,性別,年齢,練習日N日前,サークル,都道府県,端末,カウント,新型コロナウィルス,練習参加人数
  ```
- **説明**: スポーツサークルHPのアクセスデータ。日付、サークル、都道府県、コロナの波、練習参加人数などが含まれる
- **用途**: 日付 × サークル × 都道府県で絞り込み、HPアクセスと練習参加の関係やコロナ影響を即座に把握できます。運営者がコンテンツ改善や集客施策の検討に活用できます。
- **データ出典**: アクセスログ・参加記録

### 8. 記事いいねデータ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-article-like)
- **ファイル**: `test-article-like.csv`
- **フォーマット**:
  ```
  日付(記事作成者),性別(記事作成者),年齢(記事作成者),🔖記事の種類,都道府県(記事作成者),🔖記事のテーマ・ジャンル,職業(記事作成者),未使用,いいねの数,🔖記事の読者層,🔖記事のSEO
  ```
- **説明**: 記事のいいね数データ。記事作成日、作成者情報、記事の種類、テーマ、いいね数、読者層などが含まれる
- **用途**: 記事の種類 × テーマ × 作成者属性 × 時期で絞り込み、どの層に刺さるコンテンツかを即座に判断できます。編集者が企画立案や、マーケターがターゲット別のコンテンツ戦略検討に活用できます。
- **データ出典**: サンプルデータ ※性別・年齢・職業・都道府県は、「記事作成者」の情報

### 9. 能登地震安否確認データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-quake-noto-safety.csv)
- **ファイル**: `ja-quake-noto-safety.csv`
- **フォーマット**:
  ```
  安否不明者数(公表日別),性別,年齢,安否確認状態,市,市区町村,氏名,職業カテゴリ,カウント
  ```
- **説明**: 能登半島地震の安否確認データ。安否不明者数、性別、年齢、確認状態、地域情報、氏名などが含まれる
- **用途**: 時系列 × 地域 × 状況を多次元で把握し、被害状況に応じた支援優先度や対応状況の整理に活用できます。災害対応の全体像把握に適しています。
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
- **用途**: 時期 × 経営動向項目 × 現状・見通しで絞り込み、小売業界の景況感の推移を即座に把握できます。経営者が業界トレンドを判断したり、アナリストが投資判断の参考情報を得るのに活用できます。
- **データ出典**: [スーパーマーケット 経営動向・景況感 調査結果@一般社団法人全国スーパーマーケット協会](http://www.j-sosm.jp/dl/index.html)

### 11. 農業関連データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-agriculture)
- **ファイル**: `resas-agriculture.csv`
- **フォーマット**:
  ```
  年,品目大分類,品目分類,品目名(横),都道府県,品目名,農業団体(サンプル),未使用5,カウント
  ```
- **説明**: 農業統計データ。年、品目分類、都道府県、農業団体などの情報が含まれる
- **用途**: 年 × 品目 × 都道府県で絞り込み、産地別の品目別産出額の推移や強みの品目を即座に把握できます。農業政策の立案者やJA・卸が産地比較や販路開拓の判断材料を得るのに活用できます。
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
- **用途**: 品種 × 栽培方法 × 地域 × 販売形態で絞り込み、売れ筋の組み合わせや効率的な栽培パターンを即座に把握できます。農家が経営改善の検討や、卸・販売側が仕入れ先選定に活用できます。
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
- **用途**: 年 × 国籍 × 訪問目的 × 訪問都道府県で絞り込み、ターゲット国別の訪日傾向や誘致施策の効果を即座に把握できます。自治体の観光担当者がインバウンド戦略を検討するのに適しています。
- **データ出典**:
  - [指定地域への国籍別訪問者数 @RESAS(地域経済分析システム)API](https://opendata.resas-portal.go.jp/docs/api/v1/tourism/foreigners/forFrom.html)
  - [観光マップ > 外国人 > 外国人訪問分析 @RESAS](https://resas.go.jp/tourism-foreigners/#/to-transition/5.333900736553437/41.42090017812787/142.29371418128918/13/13101/100/0/0.0/2020/5/-/-/1/-/-)

#### 年間商品販売額データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-product-sales)
- **ファイル**: `resas-product-sales.csv`
- **フォーマット**:
  ```
  年,産業大分類,年代,産業中分類,都道府県,市区町村,企業(サンプル),カウント
  ```
- **説明**: 地域別の年間商品販売額データ（1994〜2021年）。産業分類、都道府県、市区町村別の販売額が含まれる
- **用途**: 年 × 産業 × 地域で絞り込み、地域経済の産業構造や小売・卸売の動向を即座に把握できます。商業施策の立案や出店計画の検討に活用できます。
- **データ出典**: [RESAS(地域経済分析システム)API](https://opendata.resas-portal.go.jp/)

### 14. 自治体税金データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-municipality-taxes)
- **ファイル**: `resas-municipality-taxes.csv`
- **フォーマット**:
  ```
  年,未使用1,税区分,未使用2,都道府県,市区町村,業種(サンプル),未使用,カウント
  ```
- **説明**: 自治体の税収データ。年、税区分、都道府県、市区町村、業種などの情報が含まれる
- **用途**: 年 × 税区分 × 地域で絞り込み、自治体の財政健全度や税収構造の変化を即座に把握できます。行政担当者が予算編成の参考にしたり、企業が投資先地域の財政状況を比較するのに活用できます。
- **データ出典**:
  - [地方財政マップ > 一人当たり地方税 @RESAS(地域経済分析システム)API](https://opendata.resas-portal.go.jp/docs/api/v1/municipality/taxes/perYear.html)
  - [地方財政マップ > 一人当たり地方税 @RESAS](https://resas.go.jp/municipality-taxes/#/graph/13/13101/2016/1/7.39231742277876/35.998703685/139.883857/-)

### 15. 東京都知事選挙データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-election-tokyo-gubernatorial-2024.csv)（2024年7月執行）
- **ファイル**: `ja-election-tokyo-gubernatorial-2024.csv`
- **フォーマット**:
  ```
  日付,性別(候補者),年齢(候補者),政党(候補者),立候補者,市区町村,職業(候補者),職業カテゴリ,カウント
  ```
- **説明**: 東京都知事選挙の投票データ。選挙日、候補者情報（性別、年齢、政党、職業）、市区町村別の投票数などが含まれる
- **用途**: 候補者 × 市区町村 × 政党で絞り込み、地域別の得票傾向や支持基盤の分布を即座に把握できます。政治アナリストの選挙分析や、メディアの開票速報解説に活用できます。
- **データ出典**:
  - [NHK選挙WEB 東京都知事選挙2024 選挙結果(7月7日投票)@NHK](https://www.nhk.or.jp/senkyo/database/local/shutoken/20336/skh54664.html)
  - [東京都知事選挙東京都知事選挙（令和6年7月7日執行） 投開票結果@東京都](https://www.senkyo.metro.tokyo.lg.jp/election/tochiji-all/tochiji-sokuhou2024/csv/)
  - Wikipedia

#### 参議院選挙 当選当確一覧
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-election-sangiin-2025)
- **ファイル**: `ja-election-sangiin-2025.csv`
- **フォーマット**:
  ```
  日付,性別,年齢,政党,都道府県,立候補者名,職業,選挙制度,現職・元職・新人,当選回数,推薦 等
  ```
- **説明**: 参議院選挙（2025/2022/2019年）の当選者データ。立候補者情報、政党、都道府県、選挙区/比例などが含まれる
- **用途**: 選挙年 × 政党 × 都道府県で絞り込み、政党別の議席獲得傾向や地域別の勢力図を即座に把握できます。政治アナリストやメディアの選挙分析に活用できます。
- **データ出典**: NHK選挙WEB等

#### 衆議院選挙 当選当確一覧
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-election-shugiin-2024)
- **ファイル**: `ja-election-shugiin-2024.csv`
- **フォーマット**:
  ```
  日付,性別,年齢,政党,都道府県,立候補者名,職業,選挙制度,小選挙区,前・元・新,当選回数 等
  ```
- **説明**: 衆議院選挙（2024/2021年）の当選者データ。立候補者情報、政党、小選挙区、比例などが含まれる
- **用途**: 選挙年 × 政党 × 選挙制度で絞り込み、小選挙区と比例の得票パターンや政党勢力の変遷を即座に把握できます。選挙報道や政治研究に活用できます。
- **データ出典**: NHK選挙WEB等

### 16. 店舗数データ
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=store-cnt)
- **ファイル**: `store-cnt.csv`
- **フォーマット**:
  ```
  年月,未使用2,未使用3,店舗タイプ,都道府県,未使用1,未使用4,ジョブカテゴリ,カウント
  ```
- **説明**: 店舗数の統計データ。年月、店舗タイプ、都道府県ごとの店舗数が含まれる
- **用途**: 時期 × 店舗タイプ × 都道府県で絞り込み、小売業界の出店動向や地域別の店舗密度を即座に把握できます。出店計画を立てる企業や、業界分析を行うアナリストの判断材料として活用できます。
- **データ出典**: [スーパーマーケット店舗数@一般社団法人全国スーパーマーケット協会](http://www.j-sosm.jp/dl/index.html)

### 17. SSDSE（教育用標準データセット）

独立行政法人統計センターによる教育用標準データセット。都道府県・市区町村別の各種統計を多次元で分析可能。

#### 都道府県別の性別・年齢人口推移（2005〜2022年・18年間）
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-b-population)
- **ファイル**: `ssdse-b-population.csv`
- **フォーマット**:
  ```
  年度,性別,年齢,都道府県,市区町村,カウント
  ```
- **説明**: 都道府県別の性別・年齢階級別人口の時系列データ。出生、15歳未満、15〜64歳、65歳以上の人口推移が含まれる
- **用途**: 年度 × 都道府県 × 性別 × 年齢で絞り込み、少子高齢化の地域差や人口構成の変化を即座に把握できます。自治体の人口ビジョンや福祉計画の立案に活用できます。
- **データ出典**: [SSDSE（教育用標準データセット）@独立行政法人統計センター](https://www.nstac.go.jp/use/literacy/ssdse/)

#### 都道府県別の人口と各種施設推移（2005〜2022年・18年間）
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-b-building)
- **ファイル**: `ssdse-b-building.csv`
- **フォーマット**:
  ```
  年度,出生数,着工建築物数,都道府県,総人口,病院数,診療所数,学校数,保育所数 等
  ```
- **説明**: 都道府県別の人口と医療・教育施設数の時系列データ。病院、学校、保育所、婚姻・離婚件数などが含まれる
- **用途**: 年度 × 都道府県 × 施設種別で絞り込み、人口と施設のバランスや過疎地域の把握を即座に行えます。自治体の施設整備計画や地域診断に活用できます。
- **データ出典**: [SSDSE（教育用標準データセット）@独立行政法人統計センター](https://www.nstac.go.jp/use/literacy/ssdse/)

#### 都道府県別の平均気温推移（2005〜2022年・18年間）
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-b-weather-temperature)
- **ファイル**: `ssdse-b-weather-temperature.csv`
- **フォーマット**:
  ```
  年度,降水量,降水日数,都道府県,平均気温,最高気温,最低気温
  ```
- **説明**: 都道府県別の気象データの時系列。年平均気温、最高・最低気温、降水量、降水日数が含まれる
- **用途**: 年度 × 都道府県で絞り込み、地域別の気候傾向や気温・降水の年次変動を即座に比較できます。農業施策や防災計画の検討に活用できます。
- **データ出典**: [SSDSE（教育用標準データセット）@独立行政法人統計センター](https://www.nstac.go.jp/use/literacy/ssdse/)

#### 市区町村別の性別・年齢人口（2020年）
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-a-population)
- **ファイル**: `ssdse-a-population.csv`
- **フォーマット**:
  ```
  年度,性別,年齢,都道府県,市区町村,人口
  ```
- **説明**: 市区町村別の性別・年齢階級別人口（2020年国勢調査ベース）。より細かい地域単位での人口構成が含まれる
- **用途**: 市区町村 × 性別 × 年齢で絞り込み、街区レベルの人口構成や高齢化の実態を即座に把握できます。市区町村の地域福祉計画や商圏分析に活用できます。
- **データ出典**: [SSDSE（教育用標準データセット）@独立行政法人統計センター](https://www.nstac.go.jp/use/literacy/ssdse/)

#### 市区町村別の人口と各種施設（2022年）
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-a-building)
- **ファイル**: `ssdse-a-building.csv`
- **フォーマット**:
  ```
  年度,出生数,総人口,都道府県,市区町村,病院数,診療所数,学校数,小売店数,飲食店数,医師数 等
  ```
- **説明**: 市区町村別の人口と医療・商業施設数の断面データ。病院、学校、小売店、医師数などが含まれる
- **用途**: 市区町村 × 施設種別で絞り込み、地域の医療・商業アクセスや人口当たりの施設数を即座に比較できます。出店検討や地域診断に活用できます。
- **データ出典**: [SSDSE（教育用標準データセット）@独立行政法人統計センター](https://www.nstac.go.jp/use/literacy/ssdse/)

#### 市区町村別の民営事業所（2021年）
- [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-a-office)
- **ファイル**: `ssdse-a-office.csv`
- **フォーマット**:
  ```
  年度,産業種別(農業・建設・製造・小売等),都道府県,市区町村,事業所数 等
  ```
- **説明**: 市区町村別の産業種別民営事業所数。農業、建設、製造、小売、医療福祉など業種別の事業所分布が含まれる
- **用途**: 市区町村 × 産業種別で絞り込み、地域の産業構造や事業所密度を即座に把握できます。企業の立地検討や地域経済分析に活用できます。
- **データ出典**: [SSDSE（教育用標準データセット）@独立行政法人統計センター](https://www.nstac.go.jp/use/literacy/ssdse/)

#### 都道府県別の年齢人口推移（1960〜2025年・65年間）※別アプリ
- [📊チャート](https://sakanaclub.xsrv.jp/prefecture-population-dc/?data=population.csv)
- **ファイル**: `population.csv`
- **説明**: 都道府県別の年齢階級別人口の長期時系列（約65年間）。[prefecture-population-dc](https://sakanaclub.xsrv.jp/prefecture-population-dc/) アプリで表示
- **用途**: 都道府県 × 年齢 × 時期で絞り込み、戦後から現在までの人口構造の長期的変化を把握できます。人口統計の教育・研究に適しています。
- **データ出典**: 国勢調査等

### 18. テスト用データ

#### 基本テストデータ

- **飲料評価データ**: `test-drink.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-drink)
  - **フォーマット**:
    ```
    日付,性別,年齢,評価,都道府県,商品名,職業,未使用,カウント
    ```
  - **説明**: 飲料商品の評価データ。日付、評価者情報（性別、年齢、職業）、商品名、評価などが含まれる
  - **用途**: 商品 × 評価 × 性別・年齢で絞り込み、ターゲット層別の嗜好や人気商品の傾向を即座に把握できます。商品開発担当やマーケターが販売戦略を検討する際の判断材料として活用できます。
  - **データ出典**: サンプルデータ

- **ランチ購入データ**: `test-lunch.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-lunch)
  - **フォーマット**:
    ```
    購入者数,性別,年齢,商品名,都道府県,店舗,職業,未使用,カウント
    ```
  - **説明**: ランチ商品の購入データ。購入者情報（性別、年齢、職業）、商品名、店舗、都道府県などが含まれる
  - **用途**: 商品 × 店舗 × 購入者属性で絞り込み、店舗別の人気メニューやターゲット層の嗜好を即座に把握できます。飲食店のメニュー改訂や出店計画の検討に活用できます。
  - **データ出典**: サンプルデータ

#### 教育分野のテストデータ

- **大学受験データ**: `test-university-entrance.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-university-entrance)
  - **フォーマット**:

    ```csv
    日付,性別,年齢,学部系統,都道府県,市区町村,志望区分,未使用,志願者数,偏差値,合格者数,受験回数,私立公立,学費
    ```

  - **説明**: 大学受験に関するデータ。受験生の基本情報、学部系統、志願者数、偏差値、合格者数、受験回数、学費などが含まれる
  - **用途**: 学部系統 × 志望区分 × 地域で絞り込み、志願者動向や合格難易度の傾向を即座に把握できます。進路指導担当者が生徒への助言材料を得たり、大学が入試戦略を検討するのに活用できます。
  - **データ出典**: サンプルデータ

- **学力テスト結果データ**: `test-academic-achievement.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-academic-achievement)
  - **フォーマット**:

    ```csv
    日付,性別,年齢,教科,都道府県,市区町村,学校種別,未使用,平均点,学校規模,地域区分,習熟度レベル,受験者数,全国順位,偏差値,学習時間
    ```

  - **説明**: 学力テストの結果データ。教科別平均点、学校規模、地域区分、習熟度レベル、受験者数、偏差値、学習時間などが含まれる
  - **用途**: 教科 × 地域 × 学校種別で絞り込み、課題のある教科・地域の特定や習熟度別の指導方針検討に活用できます。教育委員会や学校が改善重点を判断する際の材料として適しています。
  - **データ出典**: サンプルデータ

#### 交通・移動分野のテストデータ

- **交通事故データ**: `test-traffic-accident.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-traffic-accident)
  - **フォーマット**:

    ```csv
    日時,性別,年齢,事故類型,都道府県,市区町村,職業,未使用,カウント,天候,道路種別,車両種別,時間帯,負傷者数
    ```

  - **説明**: 交通事故に関するデータ。事故類型、天候、道路種別、車両種別、時間帯、負傷者数などの詳細情報が含まれる
  - **用途**: 事故類型 × 地域 × 時間帯 × 天候で絞り込み、危険箇所や高リスク条件の特定を即座に行えます。警察や自治体の交通安全施策立案、ドライバーの注意喚起に活用できます。
  - **データ出典**: サンプルデータ

- **公共交通利用データ**: `test-public-transport.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-public-transport)
  - **フォーマット**:

    ```csv
    年月,路線名,駅名,都道府県,利用者数,時間帯,曜日区分,季節,交通手段
    ```

  - **説明**: 公共交通機関の利用状況データ。路線別、時間帯別、曜日区分、季節変動の分析が可能
  - **用途**: 路線 × 駅 × 時間帯 × 曜日で絞り込み、混雑ピークや閑散区間を即座に把握できます。鉄道会社のダイヤ改善や自治体の交通政策検討に活用できます。
  - **データ出典**: サンプルデータ

#### 住宅・不動産分野のテストデータ

- **不動産取引データ**: `test-real-estate.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-real-estate)
  - **フォーマット**:

    ```csv
    年月,都道府県,市区町村,物件種別,築年数,面積,価格,最寄り駅距離,間取り,取引件数
    ```

  - **説明**: 不動産取引に関するデータ。物件種別、築年数、面積、価格、駅距離、間取り別の取引動向が分析可能
  - **用途**: 地域 × 物件種別 × 価格帯 × 築年数で絞り込み、市場価格の傾向や好条件物件の分布を即座に把握できます。購入検討者が予算・条件に合うエリアを絞り込んだり、不動産業者が需給分析に活用できます。
  - **データ出典**: サンプルデータ

- **住宅着工統計**: `test-housing-construction.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-housing-construction)
  - **フォーマット**:

    ```csv
    年月,都道府県,構造区分,建て方,利用関係,床面積,工事費予定額,着工戸数,世帯構成
    ```

  - **説明**: 住宅着工に関するデータ。構造区分、建て方、利用関係、床面積、工事費、着工戸数の動向分析
  - **用途**: 地域 × 構造 × 利用関係 × 時期で絞り込み、住宅市場の需要動向や建て方別のトレンドを即座に把握できます。ハウスメーカーや建築業界の関係者が市場分析や事業計画に活用できます。
  - **データ出典**: サンプルデータ

#### 消費行動分野のテストデータ

- **家計調査データ**: `test-household-survey.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-household-survey)
  - **フォーマット**:

    ```csv
    年月,都道府県,世帯人員,年齢階級,職業,支出項目,支出金額,収入,貯蓄額,消費性向
    ```

  - **説明**: 家計の消費行動データ。支出項目別、年齢階級別、職業別の消費動向分析が可能
  - **用途**: 支出項目 × 年齢階級 × 職業 × 地域で絞り込み、ターゲット層別の消費傾向を即座に把握できます。企業の販売戦略立案や、行政の消費者政策検討に活用できます。
  - **データ出典**: サンプルデータ

- **電子商取引データ**: `test-ecommerce.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-ecommerce)
  - **フォーマット**:

    ```csv
    日付,性別,年齢,商品カテゴリ,都道府県,市区町村,職業,未使用,購入金額,デバイス種別,決済方法,購入回数,配送方法,満足度,会員ランク,利用時間帯
    ```

  - **説明**: EC（電子商取引）の購入データ。商品カテゴリ別、デバイス種別、決済方法、利用時間帯などの詳細分析が可能
  - **用途**: 商品カテゴリ × デバイス × 利用者属性 × 時間帯で絞り込み、購買パターンやキャンペーン効果を即座に把握できます。EC担当者が商品陳列やマーケティング施策の改善に活用できます。
  - **データ出典**: サンプルデータ

#### 環境・エネルギー分野のテストデータ

- **環境調査データ**: `test-environment-survey.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-environment-survey)
  - **フォーマット**:

    ```csv
    日時,都道府県,測定局名,汚染物質,濃度,気象条件,季節,地域特性,測定値数
    ```

  - **説明**: 環境汚染の測定データ。汚染物質別、気象条件別、季節変動、地域特性の分析が可能
  - **用途**: 汚染物質 × 地域 × 季節 × 気象条件で絞り込み、高濃度が観測される条件や地域を即座に特定できます。環境行政担当者や地域住民が改善施策の検討材料を得るのに活用できます。
  - **データ出典**: サンプルデータ

#### 労働・雇用分野のテストデータ

- **雇用・労働データ**: `test-employment-labor.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-employment-labor)
  - **フォーマット**:

    ```csv
    年月,都道府県,職種,業界,年齢層,性別,求人数,平均給与,雇用形態,経験年数
    ```

  - **説明**: 求人・転職市場のデータ。職種別、業界別、年齢層別の求人動向と給与水準の分析が可能
  - **用途**: 職種 × 業界 × 地域 × 年齢層で絞り込み、求人トレンドや給与相場を即座に把握できます。転職検討者が市場を理解したり、人事が採用・給与戦略を検討するのに活用できます。
  - **データ出典**: サンプルデータ

#### 国際・世界データ分野のテストデータ

- **世界環境・気候変動データ**: `test-global-climate-environmental.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-global-climate-environmental)
  - **フォーマット**:

    ```csv
    日付,平均気温変化(℃),森林被覆率(%),CO2排出量(トン/人),国名,大陸,未使用,再生可能エネルギー比率,カウント,再生可能エネルギー比率(%),水資源量(1人当たり立方メートル),大気汚染指数(PM2.5濃度),環境政策スコア(100点満点),エネルギー消費量(1人当たりTOE),海面上昇影響度(mm/年)
    ```

  - **説明**: 世界各国の環境・気候変動データ。CO2排出量、再生可能エネルギー比率、森林被覆率、大気汚染指数など多角的な環境指標の分析が可能
  - **用途**: 国 × 大陸 × 環境指標で絞り込み、国際比較やSDGs関連の進捗を即座に把握できます。環境政策担当者やNGOが国際協力の優先地域を判断するのに活用できます。
  - **データ出典**: サンプルデータ

- **世界教育・人材開発データ**: `test-global-education-human-development.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-global-education-human-development)
  - **フォーマット**:

    ```csv
    年度,性別,年齢,国・地域名,大陸,経済レベル,政治体制,未使用,識字率,大学進学率,研究開発費率,特許出願数,教育予算率,平均教育年数,デジタルリテラシー率,イノベーション指数
    ```

  - **説明**: 世界各国の教育・人材開発指標データ。識字率、大学進学率、研究開発費、特許出願数、イノベーション指数の国際比較分析が可能
  - **用途**: 国 × 経済レベル × 教育指標で絞り込み、国際的な教育格差や投資効果を即座に把握できます。ODA担当者や教育研究者が支援対象国の選定や政策提言に活用できます。
  - **データ出典**: サンプルデータ

- **世界保健・医療システムデータ**: `test-global-health-medical-systems.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-global-health-medical-systems)
  - **フォーマット**:

    ```csv
    年度,性別,年齢,国・地域名,大陸,所得グループ,医療制度型,未使用,平均寿命,乳児死亡率,医療費率,医師数率,病床数率,ワクチン接種率,感染症発生率,医療アクセス指数
    ```

  - **説明**: 世界各国の保健・医療システムデータ。平均寿命、医療費、医師数、病床数、ワクチン接種率など医療システムの国際比較分析が可能
  - **用途**: 国 × 所得グループ × 医療指標で絞り込み、医療アクセスの格差や制度効果を即座に把握できます。国際保健機関や開発援助関係者が優先支援地域を判断するのに活用できます。
  - **データ出典**: サンプルデータ

#### その他の分野のテストデータ

- **犯罪統計データ**: `test-crime-statistics.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-crime-statistics)
  - **説明**: 犯罪発生状況の統計データ。犯罪種別、発生時間帯、地域別の治安状況分析が可能
  - **用途**: 犯罪種別 × 地域 × 時間帯で絞り込み、危険箇所や発生パターンを即座に把握できます。警察や自治体の防犯対策立案、住民の安全意識向上に活用できます。

- **インターネット利用状況**: `test-internet-usage.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-internet-usage)
  - **説明**: インターネット利用状況データ。年齢層別、利用目的別、デバイス別の利用動向分析
  - **用途**: 年齢層 × 利用目的 × デバイスで絞り込み、世代別の利用傾向やサービス改善のヒントを即座に把握できます。デジタルマーケターやサービス企画者がユーザー理解を深めるのに活用できます。

- **投資信託データ**: `test-investment-trust.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-investment-trust)
  - **説明**: 投資信託の運用データ。ファンド種別、投資地域別、リスク区分別の投資動向分析
  - **用途**: ファンド種別 × 投資地域 × リスク区分で絞り込み、運用成績の傾向や分散投資の候補を即座に把握できます。個人投資家がポートフォリオ設計に、ファイナンシャルプランナーが提案づくりに活用できます。

- **医療調査データ**: `test-medical-survey.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-medical-survey)
  - **説明**: 医療に関する調査データ。診療科別、年齢層別、地域別の医療利用状況分析
  - **用途**: 診療科 × 地域 × 年齢層で絞り込み、医療ニーズの偏りや不足地域を即座に把握できます。病院の診療科配置や自治体の保健医療計画立案に活用できます。

- **映画興行データ**: `test-movie-box-office.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-movie-box-office)
  - **説明**: 映画の興行成績データ。ジャンル別、上映期間別、観客動員数の分析
  - **用途**: ジャンル × 上映期間 × 興行成績で絞り込み、ヒット傾向や興行パターンを即座に把握できます。映画配給会社の上映戦略や映画館のプログラミング検討に活用できます。

- **博物館来館データ**: `test-museum-visitor.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-museum-visitor)
  - **説明**: 博物館・美術館の来館者データ。施設種別、展示内容別、年齢層別の来館動向分析
  - **用途**: 施設種別 × 展示内容 × 年齢層で絞り込み、来館者層や人気展示の傾向を即座に把握できます。学芸員が企画立案や、自治体が文化施設の運営改善に活用できます。

- **特許出願データ**: `test-patent-application.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-patent-application)
  - **説明**: 特許出願に関するデータ。技術分野別、出願人種別、地域別の特許動向分析
  - **用途**: 技術分野 × 出願人種別 × 地域で絞り込み、技術トレンドや競合の出願動向を即座に把握できます。企業のR&D担当や知的財産部が技術戦略立案に活用できます。

- **小売調査データ**: `test-retail-survey.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-retail-survey)
  - **説明**: 小売業の調査データ。業態別、立地条件別、売上動向の分析
  - **用途**: 業態 × 立地 × 時期で絞り込み、売上トレンドや成功要因を即座に把握できます。小売業者が出店候補地の検討や、商社が卸先選定に活用できます。

- **国際貿易データ**: `test-international-trade.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-international-trade)
  - **説明**: 国際貿易統計データ。品目別、相手国別、輸出入動向の分析
  - **用途**: 品目 × 相手国 × 輸出入で絞り込み、貿易構造の変化や相手国別の需給を即座に把握できます。貿易会社の商材選定や、経済アナリストの市場分析に活用できます。

- **訪日外国人消費データ**: `test-foreign-visitor-consumption.csv`
  - [📊チャート](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-foreign-visitor-consumption)
  - **説明**: 訪日外国人の消費行動データ。国籍別、消費項目別、地域別の消費動向分析
  - **用途**: 国籍 × 消費項目 × 地域で絞り込み、ターゲット国別の嗜好や売れ筋を即座に把握できます。観光地の土産店や免税店が品揃えやプロモーション戦略を検討するのに活用できます。

※各テストデータは、DC.jsを使用した多次元チャート分析のサンプルとして作成されており、実際のデータ分析手法や可視化技術の学習・検証に活用できます。

## 使用方法

1. CSVファイルを基本データとし、対応する`.options.json`ファイルに表示設定を定義
2. `DcChart.vue`コンポーネントでデータを読み込み、多次元チャートを表示
3. `FileSelectMenu.vue`コンポーネントを使用してデータファイルを選択可能
