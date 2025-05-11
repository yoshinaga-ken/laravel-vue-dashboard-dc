# DC.js Multidimensional Chart Data Catalog

[JAPANESE](README.ja.md)

This directory contains data files for multidimensional charts using DC.js. Each dataset is structured to allow filtering and analysis across multiple dimensions.

## Data Characteristics

Each dataset has the following common characteristics:

1. **Multiple Dimensions**: All data has multiple columns, allowing analysis across various axes
2. **Count Column**: Many datasets include a "Count" column used as a numerical metric
3. **Date/Time Axis**: Many datasets include date or month columns that can be analyzed as time series
4. **Geographic Information**: Many datasets include prefecture and municipality information
5. **Category Information**: Includes genre, occupation, status, and other categorical data
6. **Numerical Metrics**: Includes numerical data such as age, price, rating, and quantity

## Data Types and Formats

### 1. COVID-19 Infection Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=covid19-data-2022-02-18)
- **File**: `covid19-data-*.csv`
- **Format**:
  ```
  Date,Gender,Age,Status,Prefecture,Municipality,Occupation,Occupation Category,Count
  ```
- **Description**: COVID-19 infection data including date, gender, age, status (discharged, etc.), location, and occupation
- **Data Source**: Ministry of Health, Labour and Welfare Open Data

### 2. Weather Data

#### Japan Temperature Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-temperature)
- **File**: `ja-weather-temperature.csv`
- **Format**:
  ```
  🌡️Average Temperature Total(℃),☔Precipitation Total(mm),💨Average Wind Speed(m/s),🧭Most Common Wind Direction(16 points),🏢Prefecture,🏙️Municipality,❄️Snowfall Total(cm),⚪Unused,🌡️Average Temperature(℃),💧Average Humidity(%),☁️Average Cloud Cover(10-part ratio),♨️Average Vapor Pressure(hPa),🔄Average Local Pressure(hPa),☀️Sunshine Hours(hours),🌨️Snow Days(days),⚡Thunder Days(days),🌫️Fog Days(days)
  ```
- **Description**: Average temperature data for major cities in Japan. Includes temperature, precipitation, wind speed, wind direction, prefecture, municipality, and other meteorological information (humidity, cloud cover, pressure, sunshine hours, snow days, etc.)
- **Data Source**: [Past Weather Data Download@Japan Meteorological Agency](https://www.data.jma.go.jp/risk/obsdl/)

#### Japan Precipitation Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-precipitation)
- **File**: `ja-weather-precipitation.csv`
- **Format**:
  ```
  ☔Precipitation Total(mm),🌡️Average Temperature(℃),💨Average Wind Speed(m/s),🧭Most Common Wind Direction(16 points),🏢Prefecture,🏙️Municipality,❄️Snowfall Total(cm),⚪Unused,☔Precipitation Total(mm):Base,💧Average Humidity(%),☁️Average Cloud Cover(10-part ratio),♨️Average Vapor Pressure(hPa),🔄Average Local Pressure(hPa),☀️Sunshine Hours(hours),🌨️Snow Days(days),⚡Thunder Days(days),🌫️Fog Days(days)
  ```
- **Description**: Precipitation data for major cities in Japan. Includes precipitation, temperature, wind speed, wind direction, prefecture, municipality, and other meteorological information (humidity, cloud cover, pressure, sunshine hours, snow days, etc.)
- **Data Source**: [Past Weather Data Download@Japan Meteorological Agency](https://www.data.jma.go.jp/risk/obsdl/)

### 3. Video Game Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-fc)
- **File**: `game-fc.csv`, `game-gb.csv`, `game-ps1.csv`, etc.
- **Format**:
  ```
  Release Date,Cross Review(Rating),Capacity(bit),Genre,Manufacturer,Title,Price,Job Category,Sales TOP50,Hardware,Cartridge Color,Label,Best "Versus" Game,Best "High Score" Game,Most Difficult to Clear
  ```
- **Description**: Game title information for various platforms (FC, GB, PS1, etc.) including release date, rating, genre, manufacturer, price, and sales
- **Data Source**:
  - [Various Game Consoles Cartridge/Software Title List](http://pasofami.game.coocan.jp/game/game.htm)
  - [Famicom & Disk System Software Sales Ranking](https://www.gavas.jp/user_data/famicom_game_ranking.php)
  - [Famicom National Vote](https://www.nintendo.com/jp/famicom/vote/index.html)

### 4. Ramen Shop Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=food-ramen)
- **File**: `food-ramen.csv`
- **Format**:
  ```
  Founding Year,Noodle Type(Sample),Price Range(Sample),Genre(Sample),Prefecture,🍜Ramen Shop Name,🚉Nearest Station/Address,Job Category,Count
  ```
- **Description**: Ramen shop information including founding year, noodle type, price range, genre, location, shop name, and nearest station
- **Data Source**: [Famous Ramen Shop Timeline by Era @Ramen Jiyuku](http://ramenjiyuku.web.fc2.com/)

### 5. Heart Disease Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=kaggle-heart-disease)
- **File**: `kaggle-heart-disease.csv`
- **Format**:
  ```
  Date,Gender,Age,Chest Pain Type,Number of Major Vessels,Thalassemia Type,ST Segment Slope,Unused,Count,🔖Resting Blood Pressure,🔖Serum Cholesterol,Fasting Blood Sugar > 120 mg/dl,Resting ECG Results,🔖Maximum Heart Rate,Exercise Induced Angina,ST Depression Induced by Exercise,⚠Heart Attack Risk
  ```
- **Description**: Medical data related to heart disease including gender, age, various test results, symptoms, and risk assessment
- **Data Source**: [Heart Disease Prediction Dataset@kaggle](https://www.kaggle.com/datasets/mfarhaannazirkhan/heart-dataset/data)

### 6. Municipal Company Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-municipality-company)
- **File**: `resas-municipality-company.csv`
- **Format**:
  ```
  Year,Region,Company,Industry Major Classification(Horizontal),Prefecture,Industry Major Classification,Industry Middle Classification,Unused,Count
  ```
- **Description**: Local government company data including year, region, company type, industry classification, and prefecture
- **Data Source**:
  - [Industry Structure Map > All Industries > Number of Companies @RESAS(Regional Economy Society Analyzing System)API](https://opendata.resas-portal.go.jp/docs/api/v1/municipality/company/perYear.html)
  - [Industry Structure Map > All Industries > Number of Companies @RESAS](https://resas.go.jp/municipality-company/#/graph/13/13101/2014/-/-/0/5.333900736553437/41.42090017812787/142.29371418128918/-)

### 7. High School Baseball Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=sports-hsb)
- **File**: `sports-hsb.csv`
- **Format**:
  ```
  Year,Rank,Final Score,Coach(Sample),Prefecture,Representative School,Famous Players(Sample),Unused,Count
  ```
- **Description**: High school baseball tournament results including year, rank, final score, coach, prefecture, representative school, and famous players
- **Data Source**:
  - [Summer Koshien Historical Champions and Runners-up List @baseballking](https://baseballking.jp/ns/161307)
  - [National High School Baseball Championship Historical Winners @wikipedia](https://ja.wikipedia.org/wiki/全国高等学校野球選手権大会歴代優勝校)

### 8. Article Likes Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-article-like)
- **File**: `test-article-like.csv`
- **Format**:
  ```
  Date(Author),Gender(Author),Age(Author),🔖Article Type,Prefecture(Author),🔖Article Theme/Genre,Occupation(Author),Unused,Number of Likes,🔖Article Audience,🔖Article SEO
  ```
- **Description**: Article like count data including creation date, author information, article type, theme, like count, and audience
- **Data Source**: Sample data *Note: Gender, age, occupation, and prefecture information is for the article's author

### 9. Noto Earthquake Safety Confirmation Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-quake-noto-safety)
- **File**: `ja-quake-noto-safety.csv`
- **Format**:
  ```
  Number of Missing Persons(By Announcement Date),Gender,Age,Safety Confirmation Status,City,Municipality,Name,Occupation Category,Count
  ```
- **Description**: Safety confirmation data for the Noto Peninsula Earthquake including missing person count, gender, age, confirmation status, location information, and names
- **Data Source**:
  - [Information on the 2024 Noto Peninsula Earthquake (Countermeasures Headquarters/Disaster Situation) @Ishikawa Prefecture](https://www.pref.ishikawa.lg.jp/saigai/202401jishin-taisakuhonbu.html#higai)
  - Wikipedia

### 10. Business Trends and DI Index Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=store-di)
- **File**: `store-di.csv`
- **Format**:
  ```
  Year/Month,Business Trend/Economic Sentiment,Current Status/Outlook,Change,DI,Unused1,Unused4,Job Category,Count
  ```
- **Description**: Business trend survey DI (Diffusion Index) indicator data including month/year, business trend, current status/outlook, change, and DI value
- **Data Source**: [Supermarket Business Trend/Economic Sentiment Survey Results @Japan Supermarket Association](http://www.j-sosm.jp/dl/index.html)

### 11. Agriculture-Related Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-agriculture)
- **File**: `resas-agriculture.csv`
- **Format**:
  ```
  Year,Item Major Classification,Item Classification,Item Name(Horizontal),Prefecture,Item Name,Agricultural Organization(Sample),Unused5,Count
  ```
- **Description**: Agricultural statistics data including year, item classification, prefecture, and agricultural organization
- **Data Source**:
  - [Agricultural Output by Item @RESAS(Regional Economy Society Analyzing System)API](https://opendata.resas-portal.go.jp/docs/api/v1/agriculture/all/forStackedBar.html)
  - [Industry Structure Map > Agriculture > Agricultural Structure @RESAS](https://resas.go.jp/agriculture-all/#/rate/5.333900736553437/41.42090017812787/142.29371418128918/13/13101/0/2016/1/-/-)

### 12. Wood Ear Mushroom Cultivation Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-agr-kikurage)
- **File**: `test-agr-kikurage.csv`
- **Format**:
  ```
  Date,Variety,Spawn Source,Cultivation Method,Cultivation Prefecture,Product Name,Other Elements※,Sales Format,Sales
  ```
- **Description**: Wood ear mushroom cultivation and sales data including variety, cultivation method, region, sales format, and revenue
- **Data Source**:
  - ※"Other Elements" is a string representing multiple attributes (average temperature, average humidity, protein content, dietary fiber content) with grades A through D

### 13. Foreign Tourist Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-tourism-foreigners)
- **File**: `resas-tourism-foreigners.csv`
- **Format**:
  ```
  Year,Visit Purpose,Visitor Region,Visitor Nationality(Horizontal),Visited Prefecture,Visitor Nationality,Tourist Attraction(Sample),Unused,Count
  ```
- **Description**: Data on foreign tourists visiting Japan including visit year, purpose, visitor nationality/region, visited prefecture, and tourist attractions
- **Data Source**:
  - [Number of Visitors by Nationality to Specified Region @RESAS(Regional Economy Society Analyzing System)API](https://opendata.resas-portal.go.jp/docs/api/v1/tourism/foreigners/forFrom.html)
  - [Tourism Map > Foreigners > Foreign Visitor Analysis @RESAS](https://resas.go.jp/tourism-foreigners/#/to-transition/5.333900736553437/41.42090017812787/142.29371418128918/13/13101/100/0/0.0/2020/5/-/-/1/-/-)

### 14. Municipal Tax Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-municipality-taxes)
- **File**: `resas-municipality-taxes.csv`
- **Format**:
  ```
  Year,Unused1,Tax Category,Unused2,Prefecture,Municipality,Industry(Sample),Unused,Count
  ```
- **Description**: Local government tax revenue data including year, tax category, prefecture, municipality, and industry
- **Data Source**:
  - [Local Finance Map > Per Capita Local Tax @RESAS(Regional Economy Society Analyzing System)API](https://opendata.resas-portal.go.jp/docs/api/v1/municipality/taxes/perYear.html)
  - [Local Finance Map > Per Capita Local Tax @RESAS](https://resas.go.jp/municipality-taxes/#/graph/13/13101/2016/1/7.39231742277876/35.998703685/139.883857/-)

### 15. Tokyo Gubernatorial Election Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-tokyo-gubernatorial-election)
- **File**: `ja-tokyo-gubernatorial-election.csv`
- **Format**:
  ```
  Date,Gender(Candidate),Age(Candidate),Party(Candidate),Candidate,Municipality,Occupation(Candidate),Occupation Category,Count
  ```
- **Description**: Tokyo gubernatorial election voting data including election date, candidate information (gender, age, party, occupation), and vote counts by municipality
- **Data Source**:
  - [NHK Election WEB Tokyo Gubernatorial Election 2024 Election Results (July 7 Voting)@NHK](https://www.nhk.or.jp/senkyo/database/local/shutoken/20336/skh54664.html)
  - [Tokyo Gubernatorial Election (held on July 7, 2024) Voting and Counting Results@Tokyo](https://www.senkyo.metro.tokyo.lg.jp/election/tochiji-all/tochiji-sokuhou2024/csv/)
  - Wikipedia

### 16. Store Count Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=store-cnt)
- **File**: `store-cnt.csv`
- **Format**:
  ```
  Year/Month,Unused2,Unused3,Store Type,Prefecture,Unused1,Unused4,Job Category,Count
  ```
- **Description**: Store count statistics including year/month, store type, and store count by prefecture
- **Data Source**: [Supermarket Store Count@Japan Supermarket Association](http://www.j-sosm.jp/dl/index.html)

### 17. Test Data
- **Beverage Evaluation Data**: `test-drink.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-drink)
  - **Format**:
    ```
    Date,Gender,Age,Rating,Prefecture,Product Name,Occupation,Unused,Count
    ```
  - **Description**: Beverage product evaluation data including date, evaluator information (gender, age, occupation), product name, and rating
  - **Data Source**: Sample data

- **Lunch Purchase Data**: `test-lunch.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-lunch)
  - **Format**:
    ```
    Number of Buyers,Gender,Age,Product Name,Prefecture,Store,Occupation,Unused,Count
    ```
  - **Description**: Lunch product purchase data including buyer information (gender, age, occupation), product name, store, and prefecture
  - **Data Source**: Sample data

## Usage

1. Use CSV files as base data and define display settings in corresponding `.options.json` files
2. Load data using the `DcChart.vue` component to display multidimensional charts
3. Use the `FileSelectMenu.vue` component to select data files

