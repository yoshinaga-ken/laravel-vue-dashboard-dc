#
# 気象庁の過去の気象データ・ダウンロードページから、DcChartコンポーネント用の気象用CSVデータを作成する
# in:
#  [CSVファイルをダウンロード]ボタンリクエスト:https://www.data.jma.go.jp/risk/obsdl/
# out:
#  ../../public/data/ja-weather-temperature-*.csv
#

usage:
	@echo "Develop Command Utility"
	@echo "USAGE:"
	@echo "  make <target_file>"
	@echo "  -n: ビルドを実行せず、どのようなコマンドが実行されるかの表示だけを行います。(ドライラン)"
	@echo "  -B: ターゲットが最新であっても必ず再ビルドします"
	@echo "  VAR=foo: 変数を定義して実行"
	@echo "EXAMPLE:"
	@echo "TARGETS:"
	@grep -E "^([a-zA-Z0-9_%.-]+):.*" Makefile | awk -F: '{printf("  %-32s : %s%s\n", $$1, $$2, ($$3 ? " # "$$3 : ""))}'


JA_WEATHER_CSV = \
		ja-weather-temperature.csv \
		ja-weather-precipitation.csv \

JA_WEATHER_CSV_3 = \
		ja-weather-temperature-3.csv \
		ja-weather-precipitation-3.csv \

# 気象庁:ホーム > 各種データ・資料 > 過去の気象データ・ダウンロード
# [CSVファイルをダウンロード]ボタンリクエスト仕様
# https://www.data.jma.go.jp/risk/obsdl/show/table
# POST
# @param stationNumList:　地点
#   e.g. s47807:福岡県,s47772:大阪,s47636:名古屋, etc..
# @param aggrgPeriod: 集計期間
#  9:時別値 1~24時間
#  1:日別値
#  812:[2~28]日別値
#  2:半旬別値
#  4:旬別値。5月上旬、5月下旬
#  5:月別値
#  6:3か月別値※　2025/2~2025/4,2025/3~2025/5,2025/4~2025/6...
# @param ymdList: 期間。[YYYYFrom,YYYYTo,MMFrom,MMTo,DDFrom,DDTo]
#   e.g. ["1986","2025","1","5","2","3"]: 1986-01-02~2025-05-03
#   1890- 1875気温と降水量は記録されているが、1896年から日照時間,1931年から気圧湿度等全体的に記録

# 期間の定義
# 1: 1872-05-01 ~ 1936-04-01
# 2: 1936-05-01 ~ 1986-04-01
# 3: 1986-05-01 ~ 2025-05-01
PERIOD ?= 3

ifeq ($(PERIOD),1)
  # 1872-05 ~ 1936-04
  ymdFrom=1872
  mmFrom=05
  ddFrom=01
  ymdTo=1936
  mmTo=04
  ddTo=01
else ifeq ($(PERIOD),2)
  # 1936-05 ~ 1986-04
  ymdFrom=1936
  mmFrom=05
  ddFrom=01
  ymdTo=1986
  mmTo=04
  ddTo=01
else ifeq ($(PERIOD),3)
  # 1986-05 ~ 2025-05
  ymdFrom=1986
  mmFrom=05
  ddFrom=01
  ymdTo=2025
  mmTo=05
  ddTo=01
endif

# 期間をURLエンコード
ymdList=$(shell printf '["%s","%s","%s","%s","%s","%s"]' $(ymdFrom) $(ymdTo) $(mmFrom) $(mmTo) $(ddFrom) $(ddTo) | \
         perl -pe 's/([^A-Za-z0-9])/sprintf("%%%02X", ord($$1))/seg')

PHPSESSID=tcrkjq1vbm2uhngets7td6imh1

%.csv: # make s47807.csv [PERIOD=(1|2|3(default))] で福岡のCSVデータを取得する
		curl 'https://www.data.jma.go.jp/risk/obsdl/show/table' \
			-H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
			-H 'accept-language: ja,en-US;q=0.9,en;q=0.8' \
			-H 'cache-control: max-age=0' \
			-H 'content-type: application/x-www-form-urlencoded' \
			-H 'origin: https://www.data.jma.go.jp' \
			-H 'priority: u=0, i' \
			-H 'referer: https://www.data.jma.go.jp/risk/obsdl/index.php' \
			-H 'sec-ch-ua: "Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"' \
			-H 'sec-ch-ua-mobile: ?0' \
			-H 'sec-ch-ua-platform: "Windows"' \
			-H 'sec-fetch-dest: document' \
			-H 'sec-fetch-mode: navigate' \
			-H 'sec-fetch-site: same-origin' \
			-H 'sec-fetch-user: ?1' \
			-H 'upgrade-insecure-requests: 1' \
			-H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36' \
			--data-raw 'stationNumList=%5B%22$*%22%5D&aggrgPeriod=5&elementNumList=%5B%5B%22201%22%2C%22%22%5D%2C%5B%22101%22%2C%22%22%5D%2C%5B%22401%22%2C%22%22%5D%2C%5B%22301%22%2C%22%22%5D%2C%5B%22305%22%2C%22%22%5D%2C%5B%22604%22%2C%22%22%5D%2C%5B%22605%22%2C%22%22%5D%2C%5B%22602%22%2C%22%22%5D%2C%5B%22607%22%2C%22%22%5D%2C%5B%22620%22%2C%22%22%5D%2C%5B%22621%22%2C%22%22%5D%2C%5B%22622%22%2C%22%22%5D%2C%5B%22503%22%2C%22%22%5D%2C%5B%22601%22%2C%22%22%5D%5D&interAnnualFlag=1&ymdList=$(ymdList)&optionNumList=%5B%5D&downloadFlag=true&rmkFlag=1&disconnectFlag=1&youbiFlag=0&fukenFlag=1&kijiFlag=0&huukouFlag=0&csvFlag=0&jikantaiFlag=0&jikantaiList=%5B%5D&ymdLiteral=1&PHPSESSID=$(PHPSESSID)' \
			| iconv -f SHIFT_JIS -t UTF-8 \
			> $*.$(ymdFrom)-$(mmFrom)-$(ddFrom).$(ymdTo)-$(mmTo)-$(ddTo).csv

PREF_CSV = \
		s47807.1986-05-01.2025-05-01.csv \
		s47772.1986-05-01.2025-05-01.csv \
		s47636.1986-05-01.2025-05-01.csv \
		s47662.1986-05-01.2025-05-01.csv \
		s47604.1986-05-01.2025-05-01.csv \
		s47590.1986-05-01.2025-05-01.csv \
		s47412.1986-05-01.2025-05-01.csv \
		s47893.1986-05-01.2025-05-01.csv \
		s47765.1986-05-01.2025-05-01.csv \
		s47605.1986-05-01.2025-05-01.csv \
		s47418.1986-05-01.2025-05-01.csv \
		s47936.1986-05-01.2025-05-01.csv \

# 主要都市の[☔降水量]のデータ (期間:PERIOD3:1872-05-01 ~ 1936-04-01)
ja-weather-precipitation.csv: # $(PREF_CSV)
		php convert_weather_data.php s47807.1986-05-01.2025-05-01.csv -p "福岡県" -c "福岡市" -H true > $@
		php convert_weather_data.php s47772.1986-05-01.2025-05-01.csv -p "大阪府" -c "大阪市" -H false >> $@
		php convert_weather_data.php s47636.1986-05-01.2025-05-01.csv -p "愛知県" -c "名古屋市" -H false >> $@
		php convert_weather_data.php s47662.1986-05-01.2025-05-01.csv -p "東京都" -c "東京" -H false >> $@
		php convert_weather_data.php s47604.1986-05-01.2025-05-01.csv -p "新潟県" -c "新潟市" -H false >> $@
		php convert_weather_data.php s47590.1986-05-01.2025-05-01.csv -p "宮城県" -c "仙台市" -H false >> $@
		php convert_weather_data.php s47412.1986-05-01.2025-05-01.csv -p "北海道" -c "札幌市" -H false >> $@
		php convert_weather_data.php s47893.1986-05-01.2025-05-01.csv -p "高知県" -c "高知市" -H false >> $@
		php convert_weather_data.php s47765.1986-05-01.2025-05-01.csv -p "広島県" -c "広島市" -H false >> $@
		php convert_weather_data.php s47605.1986-05-01.2025-05-01.csv -p "石川県" -c "金沢市" -H false >> $@
		php convert_weather_data.php s47418.1986-05-01.2025-05-01.csv -p "北海道(東)" -c "釧路市" -H false >> $@
		php convert_weather_data.php s47936.1986-05-01.2025-05-01.csv -p "沖縄県" -c "那覇市" -H false >> $@


s47807-data.csv:
		php convert_weather_data.php s47807.csv -p "福岡県" -c "福岡市" -H true > $@

# $ csvcut -n ja-weather-precipitation.csv
#  1: ☔降水量の合計(mm)
#  2: 🌡️平均気温(℃) ⬅️swap
#  3: 💨平均風速(m/s)
#  4: 🧭最多風向(16方位)
#  5: 🏢都道府県
#  6: 🏙️市区町村
#  7: ❄️降雪量合計(cm)
#  8: ⚪未使用
#  9: ☔降水量の合計(mm):Base ⬅️swap << Sum Base Column
# 10: 💧平均湿度(％)
# 11: ☁️平均雲量(10分比)
# 12: ♨️平均蒸気圧(hPa)
# 13: 🔄平均現地気圧(hPa)
# 14: ☀️日照時間(時間)
# 15: 🌨️雪日数(日)
# 16: ⚡雷日数(日)
# 17: 🌫️霧日数(日)
# の 2列目 9 列目をSwapして、気温基準のデータを作る. 🌡️平均気温の合計(℃)

# 主要都市の[🌡️平均気温]のデータ (期間:PERIOD3:1872-05-01 ~ 1936-04-01)
ja-weather-temperature.csv: ja-weather-precipitation.csv
		csvcut -c 1,9,3,4,5,6,7,8,2,10,11,12,13,14,15,16,17 $< > $@
		mlr --csv rename '☔降水量の合計(mm)','🌡️平均気温の合計(℃)' $@ > tmp.csv
		mlr --csv rename '☔降水量の合計(mm):Base','☔降水量の合計(mm)' tmp.csv > $@


# 3主要都市の[☔降水量]のデータ(期間:PERIOD1~3:1872-05-01 ~ 2025-05-01)
ja-weather-precipitation-3.csv:
		php convert_weather_data.php s47807.1872-05-01.1936-04-01.csv -p "福岡県" -c "福岡市" -H true > $@
		php convert_weather_data.php s47807.1936-05-01.1986-04-01.csv -p "福岡県" -c "福岡市" -H false >> $@
		php convert_weather_data.php s47807.1986-05-01.2025-05-01.csv -p "福岡県" -c "福岡市" -H false >> $@
		php convert_weather_data.php s47662.1872-05-01.1936-04-01.csv -p "東京都" -c "東京" -H false >> $@
		php convert_weather_data.php s47662.1936-05-01.1986-04-01.csv -p "東京都" -c "東京" -H false >> $@
		php convert_weather_data.php s47662.1986-05-01.2025-05-01.csv -p "東京都" -c "東京" -H false >> $@
		php convert_weather_data.php s47412.1872-05-01.1936-04-01.csv -p "北海道" -c "札幌市" -H false >> $@
		php convert_weather_data.php s47412.1936-05-01.1986-04-01.csv -p "北海道" -c "札幌市" -H false >> $@
		php convert_weather_data.php s47412.1986-05-01.2025-05-01.csv -p "北海道" -c "札幌市" -H false >> $@

# 3主要都市の[🌡️平均気温]のデータ(期間:PERIOD1~3:1872-05-01 ~ 2025-05-01)
ja-weather-temperature-3.csv: ja-weather-precipitation-3.csv
		csvcut -c 1,9,3,4,5,6,7,8,2,10,11,12,13,14,15,16,17 $< > $@
		mlr --csv rename '☔降水量の合計(mm)','🌡️平均気温の合計(℃)' $@ > tmp.csv
		mlr --csv rename '☔降水量の合計(mm):Base','☔降水量の合計(mm)' tmp.csv > $@

# 地域データを定義
define REGION_s47807
PREF=福岡県
CITY=福岡市
endef

define REGION_s47662
PREF=東京都
CITY=東京
endef

define REGION_s47412
PREF=北海道
CITY=札幌市
endef

define REGION_s47772
PREF=大阪府
CITY=大阪市
endef

ja-weather-precipitation-%.csv: # make ja-weather-precipitation-s47807.csv 福岡のCSVデータを生成する
	$(eval $(REGION_$*))
	php convert_weather_data.php $*.1872-05-01.1936-04-01.csv -p "$(PREF)" -c "$(CITY)" -H true > $@
	php convert_weather_data.php $*.1936-05-01.1986-04-01.csv -p "$(PREF)" -c "$(CITY)" -H false >> $@
	php convert_weather_data.php $*.1986-05-01.2025-05-01.csv -p "$(PREF)" -c "$(CITY)" -H false >> $@

ja-weather-temperature-%.csv: ja-weather-precipitation-%.csv
		csvcut -c 1,9,3,4,5,6,7,8,2,10,11,12,13,14,15,16,17 $< > $@
		mlr --csv rename '☔降水量の合計(mm)','🌡️平均気温の合計(℃)' $@ > tmp.csv
		mlr --csv rename '☔降水量の合計(mm):Base','☔降水量の合計(mm)' tmp.csv > $@

regions: # 地域一覧を表示
	@echo "s47807:福岡県:福岡市"
	@echo "s47772:大阪府:大阪市"
	@echo "s47636:愛知県:名古屋市"
	@echo "s47662:東京都:東京"
	@echo "s47604:新潟県:新潟市"
	@echo "s47590:宮城県:仙台市"
	@echo "s47412:北海道:札幌市"
	@echo "s47893:高知県:高知市"
	@echo "s47765:広島県:広島市"
	@echo "s47605:石川県:金沢市"
	@echo "s47418:北海道(東):釧路市"
	@echo "s47936:沖縄県:那覇市"


cp-data:
		cp $(JA_WEATHER_CSV) ../../public/data

# 📊チャート表示
# http://127.0.0.1:8000/dashboard-dc?data=ja-weather-precipitation
# http://127.0.0.1:8000/dashboard-dc?data=ja-weather-temperature

cp-data-3:
		cp $(JA_WEATHER_CSV_3) ../../public/data

# 📊チャート表示
# http://127.0.0.1:8000/dashboard-dc?data=ja-weather-precipitation-3
# http://127.0.0.1:8000/dashboard-dc?data=ja-weather-temperature-3

cp-data-region:
		cp \
		ja-weather-precipitation-s47807.csv \
		ja-weather-precipitation-s47662.csv \
		ja-weather-precipitation-s47412.csv \
		ja-weather-precipitation-s47772.csv \
		ja-weather-temperature-s47807.csv \
		ja-weather-temperature-s47662.csv \
		ja-weather-temperature-s47412.csv \
		ja-weather-temperature-s47772.csv \
		../../public/data

# 📊チャート表示
# http://127.0.0.1:8000/dashboard-dc?data=ja-weather-precipitation-s47807
# http://127.0.0.1:8000/dashboard-dc?data=ja-weather-precipitation-s47662
