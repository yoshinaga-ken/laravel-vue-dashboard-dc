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

#### Domestic Infection Status (Japan)
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=covid19-data-2021-02-28) (Example: 2021-02-28)
- **File**: `covid19-data-*.csv` (multiple versions by date)
- **Format**:
  ```
  Date,Gender,Age,Status,Prefecture,Municipality,Occupation,Occupation Category,Count
  ```
- **Description**: COVID-19 infection data including date, gender, age, status (discharged, etc.), location, and occupation
- **Use Case**: Filter by prefecture × age group × period to instantly grasp infection trends and differences in outbreak waves. Suitable for comparative analysis limited to specific regions or attributes, and for understanding phases of infection spread and containment.
- **Data Source**: Ministry of Health, Labour and Welfare Open Data

#### COVID-19 Infection Data (Global)
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=covid19-world)
- **File**: `covid19-world.csv`
- **Format**:
  ```
  Date,Sex,Age,Status,Country,Region,Hemisphere,nouse,Count
  ```
- **Description**: Global COVID-19 infection and death data including date, country/region, hemisphere, and status (infected/death)
- **Use Case**: Filter by country × region × status × period to instantly compare geographic patterns of spread and impact by country. Suitable for international comparison and pandemic analysis.
- **Data Source**: Open data

### 2. Weather Data

#### Japan Temperature Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-temperature)
- **File**: `ja-weather-temperature.csv`
- **Format**:
  ```
  🌡️Average Temperature Total(℃),☔Precipitation Total(mm),💨Average Wind Speed(m/s),🧭Most Common Wind Direction(16 points),🏢Prefecture,🏙️Municipality,❄️Snowfall Total(cm),⚪Unused,🌡️Average Temperature(℃),💧Average Humidity(%),☁️Average Cloud Cover,♨️Average Vapor Pressure(hPa),🔄Average Local Pressure(hPa),☀️Sunshine Hours,🌨️Snow Days,⚡Thunder Days,🌫️Fog Days
  ```
- **Description**: Average temperature data for major cities in Japan. Includes temperature, precipitation, wind speed, wind direction, prefecture, municipality, and other meteorological information
- **Use Case**: Filter by region × period × weather conditions to instantly obtain climate risk assessments for event scheduling or agricultural planning. Also useful for travel planning and construction weather risk consideration.
- **Data Source**: [Past Weather Data Download@Japan Meteorological Agency](https://www.data.jma.go.jp/risk/obsdl/)

#### Japan Precipitation Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-precipitation)
- **File**: `ja-weather-precipitation.csv`
- **Format**:
  ```
  ☔Precipitation Total(mm),🌡️Average Temperature(℃),💨Average Wind Speed(m/s),🧭Most Common Wind Direction(16 points),🏢Prefecture,🏙️Municipality,❄️Snowfall Total(cm),⚪Unused,☔Precipitation Total(mm):Base,💧Average Humidity(%),☁️Average Cloud Cover,♨️Average Vapor Pressure(hPa),🔄Average Local Pressure(hPa),☀️Sunshine Hours,🌨️Snow Days,⚡Thunder Days,🌫️Fog Days
  ```
- **Description**: Precipitation data for major cities in Japan. Includes precipitation, temperature, wind speed, wind direction, prefecture, municipality, and other meteorological information
- **Use Case**: Visualize region × season × precipitation patterns to understand flood risk trends, agricultural water planning, and infrastructure priority areas. Suitable for disaster prevention personnel comparing past rainfall patterns.
- **Data Source**: [Past Weather Data Download@Japan Meteorological Agency](https://www.data.jma.go.jp/risk/obsdl/)

#### Japan Temperature and Precipitation Data (3 Major Cities, 153 Years)
- [📊Temperature Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-temperature-3) | [📊Precipitation Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-precipitation-3)
- **File**: `ja-weather-temperature-3.csv`, `ja-weather-precipitation-3.csv`
- **Format**:
  ```
  🌡️Average Temperature(℃),☔Precipitation(mm),💨Average Wind Speed,🧭Most Common Wind Direction,🏢Prefecture,🏙️Municipality,Various meteorological indicators
  ```
- **Description**: Long-term weather data from 1872 for Fukuoka, Tokyo, and Sapporo (approximately 153 years). Suitable for long-term climate change trend analysis
- **Use Case**: Filter by city × period (year/month) to instantly grasp long-term climate change trends and inter-city climate differences. Useful for climate research and historical meteorological analysis.
- **Data Source**: [Past Weather Data Download@Japan Meteorological Agency](https://www.data.jma.go.jp/risk/obsdl/)

### 3. Video Game Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-fc)
- **File**: `game-fc.csv`, `game-gb.csv`, `game-ps1.csv`, etc.
- **Format**:
  ```
  Release Date,Cross Review(Rating),Capacity(bit),Genre,Manufacturer,Title,Price,Job Category,Sales TOP50,Hardware,Cartridge Color,Label,Best "Versus" Game,Best "High Score" Game,Most Difficult to Clear
  ```
- **Description**: Game title information for various platforms (FC, GB, PS1, etc.) including release date, rating, genre, manufacturer, price, and sales
- **Use Case**: Filter by hardware × genre × release year to instantly grasp popular title trends and manufacturer strengths. Useful for collectors narrowing down desired titles and industry analysts for market analysis.
- **Data Source**:
  - [Various Game Consoles Cartridge/Software Title List](http://pasofami.game.coocan.jp/game/game.htm)
  - [Famicom & Disk System Software Sales Ranking](https://www.gavas.jp/user_data/famicom_game_ranking.php)
  - [Famicom National Vote](https://www.nintendo.com/jp/famicom/vote/index.html)

#### Game Title Data (Dragon Quest Monsters)
- [📊Dragon Quest 3 Monsters](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-title-dq3-monster) | [📊Dragon Quest 4 Monsters](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-title-dq4-monster)
- **File**: `game-title-dq3-monster.csv`, `game-title-dq4-monster.csv`
- **Format**:
  ```
  Play Time,Type,LV,Appearance Location,Monster Name,Species,HP,MP,Attack,Defense,Speed,Experience,GOLD,Magic,Drop Item,Resistance,etc.
  ```
- **Description**: Monster lists for Dragon Quest 3 and 4. Includes appearance location, level, stats, drop items, and resistances
- **Use Case**: Filter by appearance location × species × level to select leveling spots and optimize equipment collection. Suitable for players searching strategy information.
- **Data Source**: In-game data, etc.

### 4. Ramen Shop Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=food-ramen)
- **File**: `food-ramen.csv`
- **Format**:
  ```
  Founding Year,Noodle Type(Sample),Price Range(Sample),Genre(Sample),Prefecture,🍜Ramen Shop Name,🚉Nearest Station/Address,Job Category,Count
  ```
- **Description**: Ramen shop information including founding year, noodle type, price range, genre, location, shop name, and nearest station
- **Use Case**: Filter by prefecture × noodle type × price range to select candidate shops for business trips or travel, and for franchise expansion region selection. Suitable for food enthusiasts discovering shops matching their preferences.
- **Data Source**: [Famous Ramen Shop Timeline by Era @Ramen Jiyuku](http://ramenjiyuku.web.fc2.com/)

### 5. Heart Disease Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=kaggle-heart-disease)
- **File**: `kaggle-heart-disease.csv`
- **Format**:
  ```
  Date,Gender,Age,Chest Pain Type,Number of Major Vessels,Thalassemia Type,ST Segment Slope,Unused,Count,🔖Resting Blood Pressure,🔖Serum Cholesterol,Fasting Blood Sugar > 120 mg/dl,Resting ECG Results,🔖Maximum Heart Rate,Exercise Induced Angina,ST Depression,⚠Heart Attack Risk
  ```
- **Description**: Medical data related to heart disease including gender, age, various test results, symptoms, and risk assessment
- **Use Case**: Filter by age × gender × test values × risk to identify high-risk group characteristics and design prevention awareness targets. Suitable for healthcare professionals analyzing risk factor trends and creating training materials.
- **Data Source**: [Heart Disease Prediction Dataset@Kaggle](https://www.kaggle.com/datasets/mfarhaannazirkhan/heart-dataset/data)

### 6. Municipal Company Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-municipality-company)
- **File**: `resas-municipality-company.csv`
- **Format**:
  ```
  Year,Region,Company,Industry Major Classification(Horizontal),Prefecture,Industry Major Classification,Industry Middle Classification,Unused,Count
  ```
- **Description**: Local government company data including year, region, company type, industry classification, and prefecture
- **Use Case**: Filter by year × industry × region for municipal staff to grasp industry structure changes and for companies to compare industry distribution in expansion candidate regions. Useful for regional economic policy and attraction strategy planning.
- **Data Source**:
  - [Industry Structure Map > All Industries > Number of Companies @RESAS API](https://opendata.resas-portal.go.jp/docs/api/v1/municipality/company/perYear.html)
  - [Industry Structure Map > All Industries > Number of Companies @RESAS](https://resas.go.jp/municipality-company/#/graph/13/13101/2014/-/-/0/5.333900736553437/41.42090017812787/142.29371418128918/-)

### 7. High School Baseball Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=sports-hsb)
- **File**: `sports-hsb.csv`
- **Format**:
  ```
  Year,Rank,Final Score,Coach(Sample),Prefecture,Representative School,Famous Players(Sample),Unused,Count
  ```
- **Description**: High school baseball tournament results including year, rank, final score, coach, prefecture, representative school, and famous players
- **Use Case**: Filter by year × prefecture × rank to instantly grasp regional high school baseball history and strong school transitions. Suitable for sports writers discovering coverage themes and fans checking local school historical performance.
- **Data Source**:
  - [Summer Koshien Historical Champions and Runners-up List @baseballking](https://baseballking.jp/ns/161307)
  - [National High School Baseball Championship Historical Winners @Wikipedia](https://ja.wikipedia.org/wiki/全国高等学校野球選手権大会歴代優勝校)

#### Sports Club Participation Trends
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=checkin-sakana)
- **File**: `checkin-sakana.csv`, `checkin-sakana.light.csv`
- **Format**:
  ```
  Year/Month,Gender,Badminton Class,Condition,Player,Hometown,Gymnasium,Count
  ```
- **Description**: Participation records for badminton club "Sakana". Includes year/month, participants, gymnasium, and hometown
- **Use Case**: Filter by year/month × gymnasium × hometown to instantly grasp participation trends and venue-specific usage. Useful for club managers for practice scheduling and venue selection.
- **Data Source**: Club operation data

#### Sports Club Website Access Trends
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=sakana-hp-access)
- **File**: `sakana-hp-access.csv`
- **Format**:
  ```
  Date,Gender,Age,Days Before Practice,Club,Prefecture,Device,Count,COVID-19 Wave,Practice Participants
  ```
- **Description**: Sports club website access data including date, club, prefecture, COVID wave, and practice participation numbers
- **Use Case**: Filter by date × club × prefecture to instantly grasp the relationship between website access and practice participation and COVID impact. Useful for managers considering content improvement and promotion strategies.
- **Data Source**: Access logs and participation records

### 8. Article Likes Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-article-like)
- **File**: `test-article-like.csv`
- **Format**:
  ```
  Date(Author),Gender(Author),Age(Author),🔖Article Type,Prefecture(Author),🔖Article Theme/Genre,Occupation(Author),Unused,Number of Likes,🔖Article Audience,🔖Article SEO
  ```
- **Description**: Article like count data including creation date, author information, article type, theme, like count, and audience
- **Use Case**: Filter by article type × theme × author attributes × period to instantly determine which content resonates with which audience. Useful for editors in planning and marketers for target-specific content strategy.
- **Data Source**: Sample data *Note: Gender, age, occupation, and prefecture are for the article author

### 9. Noto Earthquake Safety Confirmation Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-quake-noto-safety.csv)
- **File**: `ja-quake-noto-safety.csv`
- **Format**:
  ```
  Number of Missing Persons(By Announcement Date),Gender,Age,Safety Confirmation Status,City,Municipality,Name,Occupation Category,Count
  ```
- **Description**: Safety confirmation data for the Noto Peninsula Earthquake including missing person count, gender, age, confirmation status, location, and names
- **Use Case**: Grasp time series × region × situation in multiple dimensions for support prioritization and response status organization based on damage. Suitable for overall disaster response overview.
- **Data Source**:
  - [Information on the 2024 Noto Peninsula Earthquake @Ishikawa Prefecture](https://www.pref.ishikawa.lg.jp/saigai/202401jishin-taisakuhonbu.html#higai)
  - Wikipedia

### 10. Business Trends and DI Index Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=store-di)
- **File**: `store-di.csv`
- **Format**:
  ```
  Year/Month,Business Trend/Economic Sentiment,Current Status/Outlook,Change,DI,Unused1,Unused4,Job Category,Count
  ```
- **Description**: Business trend survey DI (Diffusion Index) indicator data including month/year, business trend, current status/outlook, change, and DI value
- **Use Case**: Filter by period × business trend item × current/outlook to instantly grasp retail industry sentiment trends. Useful for managers judging industry trends and analysts for investment reference.
- **Data Source**: [Supermarket Business Trend/Economic Sentiment Survey @Japan Supermarket Association](http://www.j-sosm.jp/dl/index.html)

### 11. Agriculture-Related Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-agriculture)
- **File**: `resas-agriculture.csv`
- **Format**:
  ```
  Year,Item Major Classification,Item Classification,Item Name(Horizontal),Prefecture,Item Name,Agricultural Organization(Sample),Unused5,Count
  ```
- **Description**: Agricultural statistics data including year, item classification, prefecture, and agricultural organization
- **Use Case**: Filter by year × item × prefecture to instantly grasp output value trends by producing region and item strengths. Useful for agricultural policy makers and JA/wholesalers for producing region comparison and sales channel development.
- **Data Source**:
  - [Agricultural Output by Item @RESAS API](https://opendata.resas-portal.go.jp/docs/api/v1/agriculture/all/forStackedBar.html)
  - [Industry Structure Map > Agriculture > Agricultural Structure @RESAS](https://resas.go.jp/agriculture-all/#/rate/5.333900736553437/41.42090017812787/142.29371418128918/13/13101/0/2016/1/-/-)

### 12. Wood Ear Mushroom Cultivation Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-agr-kikurage)
- **File**: `test-agr-kikurage.csv`
- **Format**:
  ```
  Date,Variety,Spawn Source,Cultivation Method,Cultivation Prefecture,Product Name,Other Elements※,Sales Format,Sales
  ```
- **Description**: Wood ear mushroom cultivation and sales data including variety, cultivation method, region, sales format, and revenue
- **Use Case**: Filter by variety × cultivation method × region × sales format to instantly grasp best-selling combinations and efficient cultivation patterns. Useful for farmers considering business improvement and wholesalers/retailers for supplier selection.
- **Data Source**: Sample data
  - ※"Other Elements" is a string representing multiple attributes (average temperature, average humidity, protein content, dietary fiber content) with grades A through D

### 13. Foreign Tourist Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-tourism-foreigners)
- **File**: `resas-tourism-foreigners.csv`
- **Format**:
  ```
  Year,Visit Purpose,Visitor Region,Visitor Nationality(Horizontal),Visited Prefecture,Visitor Nationality,Tourist Attraction(Sample),Unused,Count
  ```
- **Description**: Data on foreign tourists visiting Japan including visit year, purpose, visitor nationality/region, visited prefecture, and tourist attractions
- **Use Case**: Filter by year × nationality × visit purpose × visited prefecture to instantly grasp target country visit trends and attraction policy effectiveness. Suitable for municipal tourism officers considering inbound strategy.
- **Data Source**:
  - [Number of Visitors by Nationality to Specified Region @RESAS API](https://opendata.resas-portal.go.jp/docs/api/v1/tourism/foreigners/forFrom.html)
  - [Tourism Map > Foreigners > Foreign Visitor Analysis @RESAS](https://resas.go.jp/tourism-foreigners/#/to-transition/5.333900736553437/41.42090017812787/142.29371418128918/13/13101/100/0/0.0/2020/5/-/-/1/-/-)

#### Annual Product Sales Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-product-sales)
- **File**: `resas-product-sales.csv`
- **Format**:
  ```
  Year,Industry Major Classification,Era,Industry Middle Classification,Prefecture,Municipality,Company(Sample),Count
  ```
- **Description**: Regional annual product sales data (1994–2021). Includes industry classification and sales by prefecture and municipality
- **Use Case**: Filter by year × industry × region to instantly grasp regional economic industry structure and retail/wholesale trends. Useful for commercial policy planning and store opening consideration.
- **Data Source**: [RESAS API](https://opendata.resas-portal.go.jp/)

### 14. Municipal Tax Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-municipality-taxes)
- **File**: `resas-municipality-taxes.csv`
- **Format**:
  ```
  Year,Unused1,Tax Category,Unused2,Prefecture,Municipality,Industry(Sample),Unused,Count
  ```
- **Description**: Local government tax revenue data including year, tax category, prefecture, municipality, and industry
- **Use Case**: Filter by year × tax category × region to instantly grasp municipal fiscal health and tax structure changes. Useful for administrative staff for budget planning and companies comparing investment region fiscal conditions.
- **Data Source**:
  - [Local Finance Map > Per Capita Local Tax @RESAS API](https://opendata.resas-portal.go.jp/docs/api/v1/municipality/taxes/perYear.html)
  - [Local Finance Map > Per Capita Local Tax @RESAS](https://resas.go.jp/municipality-taxes/#/graph/13/13101/2016/1/7.39231742277876/35.998703685/139.883857/-)

### 15. Tokyo Gubernatorial Election Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-election-tokyo-gubernatorial-2024.csv) (July 2024)
- **File**: `ja-election-tokyo-gubernatorial-2024.csv`
- **Format**:
  ```
  Date,Gender(Candidate),Age(Candidate),Party(Candidate),Candidate,Municipality,Occupation(Candidate),Occupation Category,Count
  ```
- **Description**: Tokyo gubernatorial election voting data including election date, candidate information (gender, age, party, occupation), and vote counts by municipality
- **Use Case**: Filter by candidate × municipality × party to instantly grasp regional vote trends and support base distribution. Useful for political analysts and media for election coverage.
- **Data Source**:
  - [NHK Election WEB Tokyo Gubernatorial Election 2024 @NHK](https://www.nhk.or.jp/senkyo/database/local/shutoken/20336/skh54664.html)
  - [Tokyo Gubernatorial Election Voting Results @Tokyo](https://www.senkyo.metro.tokyo.lg.jp/election/tochiji-all/tochiji-sokuhou2024/csv/)
  - Wikipedia

#### House of Councillors Election Winners
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-election-sangiin-2025)
- **File**: `ja-election-sangiin-2025.csv`
- **Format**:
  ```
  Date,Gender,Age,Party,Prefecture,Candidate Name,Occupation,Election System,Incumbent/Former/Newcomer,Terms Elected,Recommendation,etc.
  ```
- **Description**: House of Councillors election winner data (2025/2022/2019). Includes candidate information, party, prefecture, electoral district/proportional
- **Use Case**: Filter by election year × party × prefecture to instantly grasp party seat acquisition trends and regional power balance. Useful for political analysts and media election analysis.
- **Data Source**: NHK Election WEB, etc.

#### House of Representatives Election Winners
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-election-shugiin-2024)
- **File**: `ja-election-shugiin-2024.csv`
- **Format**:
  ```
  Date,Gender,Age,Party,Prefecture,Candidate Name,Occupation,Election System,Single-Member District,Former/Former/New,Terms Elected,etc.
  ```
- **Description**: House of Representatives election winner data (2024/2021). Includes candidate information, party, single-member district, proportional
- **Use Case**: Filter by election year × party × election system to instantly grasp vote patterns in single-member vs. proportional and party power transitions. Useful for election coverage and political research.
- **Data Source**: NHK Election WEB, etc.

### 16. Store Count Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=store-cnt)
- **File**: `store-cnt.csv`
- **Format**:
  ```
  Year/Month,Unused2,Unused3,Store Type,Prefecture,Unused1,Unused4,Job Category,Count
  ```
- **Description**: Store count statistics including year/month, store type, and store count by prefecture
- **Use Case**: Filter by period × store type × prefecture to instantly grasp retail industry expansion trends and regional store density. Useful for companies planning store openings and analysts for industry analysis.
- **Data Source**: [Supermarket Store Count @Japan Supermarket Association](http://www.j-sosm.jp/dl/index.html)

### 17. SSDSE (Standard Dataset for Education)

Education-oriented standard dataset by the National Statistics Center. Enables multidimensional analysis of various statistics by prefecture and municipality.

#### Prefecture-level Gender/Age Population Trends (2005–2022, 18 Years)
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-b-population)
- **File**: `ssdse-b-population.csv`
- **Format**:
  ```
  Year,Sex,Age,Prefecture,Municipality,Count
  ```
- **Description**: Time series of gender and age-group population by prefecture. Includes birth, under 15, 15–64, 65+ population trends
- **Use Case**: Filter by year × prefecture × gender × age to instantly grasp regional differences in aging and population structure changes. Useful for municipal population vision and welfare plan planning.
- **Data Source**: [SSDSE @National Statistics Center](https://www.nstac.go.jp/use/literacy/ssdse/)

#### Prefecture-level Population and Facilities Trends (2005–2022, 18 Years)
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-b-building)
- **File**: `ssdse-b-building.csv`
- **Format**:
  ```
  Year,Births,Building Starts,Prefecture,Total Population,Hospitals,Clinics,Schools,Nurseries,etc.
  ```
- **Description**: Time series of population and medical/educational facilities by prefecture. Includes hospitals, schools, nurseries, marriages, divorces
- **Use Case**: Filter by year × prefecture × facility type to instantly grasp population-facility balance and depopulated areas. Useful for municipal facility planning and regional diagnosis.
- **Data Source**: [SSDSE @National Statistics Center](https://www.nstac.go.jp/use/literacy/ssdse/)

#### Prefecture-level Average Temperature Trends (2005–2022, 18 Years)
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-b-weather-temperature)
- **File**: `ssdse-b-weather-temperature.csv`
- **Format**:
  ```
  Year,Precipitation,Precipitation Days,Prefecture,Average Temperature,Max Temperature,Min Temperature
  ```
- **Description**: Time series of meteorological data by prefecture. Includes annual average temperature, max/min temperature, precipitation, precipitation days
- **Use Case**: Filter by year × prefecture to instantly compare regional climate trends and annual temperature/precipitation variation. Useful for agricultural policy and disaster prevention planning.
- **Data Source**: [SSDSE @National Statistics Center](https://www.nstac.go.jp/use/literacy/ssdse/)

#### Municipality-level Gender/Age Population (2020)
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-a-population)
- **File**: `ssdse-a-population.csv`
- **Format**:
  ```
  Year,Sex,Age,Prefecture,Municipality,Population
  ```
- **Description**: Gender and age-group population by municipality (2020 Census). Includes finer regional population composition
- **Use Case**: Filter by municipality × gender × age to instantly grasp block-level population composition and aging reality. Useful for municipal welfare planning and trade area analysis.
- **Data Source**: [SSDSE @National Statistics Center](https://www.nstac.go.jp/use/literacy/ssdse/)

#### Municipality-level Population and Facilities (2022)
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-a-building)
- **File**: `ssdse-a-building.csv`
- **Format**:
  ```
  Year,Births,Total Population,Prefecture,Municipality,Hospitals,Clinics,Schools,Retail Stores,Restaurants,Physicians,etc.
  ```
- **Description**: Cross-section of population and medical/commercial facilities by municipality. Includes hospitals, schools, retail stores, physicians
- **Use Case**: Filter by municipality × facility type to instantly compare regional medical/commercial access and facilities per capita. Useful for store opening consideration and regional diagnosis.
- **Data Source**: [SSDSE @National Statistics Center](https://www.nstac.go.jp/use/literacy/ssdse/)

#### Municipality-level Private Establishments (2021)
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-a-office)
- **File**: `ssdse-a-office.csv`
- **Format**:
  ```
  Year,Industry Type(Agriculture,Construction,Manufacturing,Retail,etc.),Prefecture,Municipality,Establishment Count,etc.
  ```
- **Description**: Industry-specific private establishment count by municipality. Includes agriculture, construction, manufacturing, retail, medical/welfare
- **Use Case**: Filter by municipality × industry type to instantly grasp regional industry structure and establishment density. Useful for company location consideration and regional economic analysis.
- **Data Source**: [SSDSE @National Statistics Center](https://www.nstac.go.jp/use/literacy/ssdse/)

#### Prefecture-level Age Population Trends (1960–2025, 65 Years) *Separate App
- [📊Chart](https://sakanaclub.xsrv.jp/prefecture-population-dc/?data=population.csv)
- **File**: `population.csv`
- **Description**: Long-term time series of age-group population by prefecture (approximately 65 years). Displayed in [prefecture-population-dc](https://sakanaclub.xsrv.jp/prefecture-population-dc/) app
- **Use Case**: Filter by prefecture × age × period to grasp long-term population structure changes from postwar to present. Suitable for population statistics education and research.
- **Data Source**: Census, etc.

### 18. Test Data

#### Basic Test Data

- **Beverage Evaluation Data**: `test-drink.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-drink)
  - **Format**:
    ```
    Date,Gender,Age,Rating,Prefecture,Product Name,Occupation,Unused,Count
    ```
  - **Description**: Beverage product evaluation data including date, evaluator information (gender, age, occupation), product name, and rating
  - **Use Case**: Filter by product × rating × gender/age to instantly grasp target segment preferences and popular product trends. Useful for product development and marketers for sales strategy.
  - **Data Source**: Sample data

- **Lunch Purchase Data**: `test-lunch.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-lunch)
  - **Format**:
    ```
    Number of Buyers,Gender,Age,Product Name,Prefecture,Store,Occupation,Unused,Count
    ```
  - **Description**: Lunch product purchase data including buyer information (gender, age, occupation), product name, store, and prefecture
  - **Use Case**: Filter by product × store × buyer attributes to instantly grasp store-specific popular menus and target segment preferences. Useful for restaurant menu revision and store opening consideration.
  - **Data Source**: Sample data

#### Education Field Test Data

- **University Entrance Data**: `test-university-entrance.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-university-entrance)
  - **Format**:
    ```csv
    Date,Gender,Age,Department,Prefecture,Municipality,Application Type,Unused,Applicants,Deviation Value,Accepted,Exam Count,Public/Private,Tuition
    ```
  - **Description**: University entrance examination data including basic student information, department, applicants, deviation value, accepted, exam count, and tuition
  - **Use Case**: Filter by department × application type × region to instantly grasp applicant trends and admission difficulty. Useful for career guidance and universities for admission strategy.
  - **Data Source**: Sample data

- **Academic Achievement Test Data**: `test-academic-achievement.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-academic-achievement)
  - **Format**:
    ```csv
    Date,Gender,Age,Subject,Prefecture,Municipality,School Type,Unused,Average Score,School Size,Regional Category,Proficiency Level,Test Takers,National Rank,Deviation Value,Study Hours
    ```
  - **Description**: Academic test results data including average scores by subject, school size, regional category, proficiency level, test takers, deviation value, and study hours
  - **Use Case**: Filter by subject × region × school type to identify challenging subjects/regions and consider proficiency-specific guidance. Suitable for education boards and schools judging improvement priorities.
  - **Data Source**: Sample data

#### Transportation and Mobility Field Test Data

- **Traffic Accident Data**: `test-traffic-accident.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-traffic-accident)
  - **Format**:
    ```csv
    Date/Time,Gender,Age,Accident Type,Prefecture,Municipality,Occupation,Unused,Count,Weather,Road Type,Vehicle Type,Time Period,Injuries
    ```
  - **Description**: Traffic accident data including accident type, weather, road type, vehicle type, time period, and injuries
  - **Use Case**: Filter by accident type × region × time × weather to instantly identify danger spots and high-risk conditions. Useful for police and municipalities for traffic safety measures and driver awareness.
  - **Data Source**: Sample data

- **Public Transportation Usage Data**: `test-public-transport.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-public-transport)
  - **Format**:
    ```csv
    Year/Month,Route Name,Station Name,Prefecture,Passengers,Time Period,Day Category,Season,Transportation Mode
    ```
  - **Description**: Public transportation usage data allowing analysis by route, time period, day category, and seasonal variation
  - **Use Case**: Filter by route × station × time × day to instantly grasp congestion peaks and quiet sections. Useful for railway companies for schedule improvement and municipalities for transportation policy.
  - **Data Source**: Sample data

#### Housing and Real Estate Field Test Data

- **Real Estate Transaction Data**: `test-real-estate.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-real-estate)
  - **Format**:
    ```csv
    Year/Month,Prefecture,Municipality,Property Type,Age,Area,Price,Station Distance,Layout,Transactions
    ```
  - **Description**: Real estate transaction data allowing analysis by property type, age, area, price, station distance, and layout
  - **Use Case**: Filter by region × property type × price range × age to instantly grasp market price trends and well-conditioned property distribution. Useful for buyers finding areas matching budget/conditions and agents for supply-demand analysis.
  - **Data Source**: Sample data

- **Housing Construction Statistics**: `test-housing-construction.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-housing-construction)
  - **Format**:
    ```csv
    Year/Month,Prefecture,Structure Type,Building Type,Use Category,Floor Area,Construction Cost,Housing Starts,Household Composition
    ```
  - **Description**: Housing construction data for trend analysis of structure type, building type, use category, floor area, construction cost, and housing starts
  - **Use Case**: Filter by region × structure × use × period to instantly grasp housing market demand and building-type trends. Useful for house builders and construction industry for market analysis and business planning.
  - **Data Source**: Sample data

#### Consumer Behavior Field Test Data

- **Household Survey Data**: `test-household-survey.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-household-survey)
  - **Format**:
    ```csv
    Year/Month,Prefecture,Household Size,Age Group,Occupation,Expenditure Item,Expenditure Amount,Income,Savings,Consumption Propensity
    ```
  - **Description**: Household consumption behavior data allowing analysis by expenditure item, age group, and occupation
  - **Use Case**: Filter by expenditure item × age group × occupation × region to instantly grasp target segment consumption trends. Useful for company sales strategy and administrative consumer policy.
  - **Data Source**: Sample data

- **E-commerce Data**: `test-ecommerce.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-ecommerce)
  - **Format**:
    ```csv
    Date,Gender,Age,Product Category,Prefecture,Municipality,Occupation,Unused,Purchase Amount,Device Type,Payment Method,Purchase Count,Delivery Method,Satisfaction,Member Rank,Usage Time
    ```
  - **Description**: E-commerce purchase data allowing detailed analysis by product category, device type, payment method, and usage time
  - **Use Case**: Filter by product category × device × user attributes × time to instantly grasp purchase patterns and campaign effectiveness. Useful for EC managers for product display and marketing improvement.
  - **Data Source**: Sample data

#### Environment and Energy Field Test Data

- **Environmental Survey Data**: `test-environment-survey.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-environment-survey)
  - **Format**:
    ```csv
    Date/Time,Prefecture,Monitoring Station,Pollutant,Concentration,Weather Conditions,Season,Regional Characteristics,Measurement Count
    ```
  - **Description**: Environmental pollution measurement data allowing analysis by pollutant, weather, season, and regional characteristics
  - **Use Case**: Filter by pollutant × region × season × weather to instantly identify high-concentration conditions and areas. Useful for environmental staff and residents for improvement measure consideration.
  - **Data Source**: Sample data

#### Labor and Employment Field Test Data

- **Employment and Labor Data**: `test-employment-labor.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-employment-labor)
  - **Format**:
    ```csv
    Year/Month,Prefecture,Job Type,Industry,Age Group,Gender,Job Openings,Average Salary,Employment Type,Experience Years
    ```
  - **Description**: Job market data allowing analysis of job trends and salary levels by job type, industry, and age group
  - **Use Case**: Filter by job type × industry × region × age group to instantly grasp job trends and salary levels. Useful for job seekers understanding the market and HR for recruitment/salary strategy.
  - **Data Source**: Sample data

#### International and Global Data Field Test Data

- **Global Climate and Environmental Data**: `test-global-climate-environmental.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-global-climate-environmental)
  - **Format**:
    ```csv
    Date,Average Temperature Change(℃),Forest Coverage(%),CO2 Emissions(tons/person),Country Name,Continent,Unused,Renewable Energy Ratio,Count,Renewable Energy Ratio(%),Water Resources,Air Pollution Index(PM2.5),Environmental Policy Score,Energy Consumption,Sea Level Rise Impact(mm/year)
    ```
  - **Description**: Global environmental and climate change data allowing multifaceted analysis of CO2 emissions, renewable energy ratio, forest coverage, air pollution index, etc.
  - **Use Case**: Filter by country × continent × environmental indicator to instantly grasp international comparison and SDGs progress. Useful for environmental policy staff and NGOs judging international cooperation priority regions.
  - **Data Source**: Sample data

- **Global Education and Human Development Data**: `test-global-education-human-development.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-global-education-human-development)
  - **Format**:
    ```csv
    Year,Gender,Age,Country/Region,Continent,Economic Level,Political System,Unused,Literacy Rate,University Enrollment Rate,R&D Expenditure Rate,Patent Applications,Education Budget Rate,Average Education Years,Digital Literacy Rate,Innovation Index
    ```
  - **Description**: Global education and human development indicator data allowing international comparative analysis of literacy, university enrollment, R&D, patent applications, innovation index
  - **Use Case**: Filter by country × economic level × education indicator to instantly grasp international education gaps and investment effectiveness. Useful for ODA staff and education researchers for support country selection and policy recommendations.
  - **Data Source**: Sample data

- **Global Health and Medical Systems Data**: `test-global-health-medical-systems.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-global-health-medical-systems)
  - **Format**:
    ```csv
    Year,Gender,Age,Country/Region,Continent,Income Group,Healthcare System Type,Unused,Life Expectancy,Infant Mortality Rate,Healthcare Expenditure Rate,Physician Rate,Hospital Bed Rate,Vaccination Rate,Infectious Disease Rate,Healthcare Access Index
    ```
  - **Description**: Global health and medical system data allowing international comparative analysis of life expectancy, healthcare expenditure, physicians, hospital beds, vaccination rates
  - **Use Case**: Filter by country × income group × medical indicator to instantly grasp healthcare access gaps and system effectiveness. Useful for international health organizations and development aid staff judging priority support regions.
  - **Data Source**: Sample data

#### Other Field Test Data

- **Crime Statistics Data**: `test-crime-statistics.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-crime-statistics)
  - **Description**: Crime occurrence statistics allowing analysis by crime type, time period, and region
  - **Use Case**: Filter by crime type × region × time to instantly grasp danger spots and occurrence patterns. Useful for police and municipalities for crime prevention measures and resident safety awareness.
  - **Data Source**: Sample data

- **Internet Usage Data**: `test-internet-usage.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-internet-usage)
  - **Description**: Internet usage data allowing analysis by age group, purpose, and device type
  - **Use Case**: Filter by age group × purpose × device to instantly grasp generation-specific usage and service improvement hints. Useful for digital marketers and service planners for user understanding.
  - **Data Source**: Sample data

- **Investment Trust Data**: `test-investment-trust.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-investment-trust)
  - **Description**: Investment trust management data allowing analysis by fund type, investment region, and risk category
  - **Use Case**: Filter by fund type × investment region × risk to instantly grasp performance trends and diversification candidates. Useful for individual investors for portfolio design and financial planners for proposals.
  - **Data Source**: Sample data

- **Medical Survey Data**: `test-medical-survey.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-medical-survey)
  - **Description**: Medical survey data allowing analysis by department, age group, and region
  - **Use Case**: Filter by department × region × age group to instantly grasp medical need distribution and underserved areas. Useful for hospital department placement and municipal healthcare planning.
  - **Data Source**: Sample data

- **Movie Box Office Data**: `test-movie-box-office.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-movie-box-office)
  - **Description**: Movie box office performance data allowing analysis by genre, screening period, and audience numbers
  - **Use Case**: Filter by genre × screening period × box office to instantly grasp hit trends and distribution patterns. Useful for film distributors for release strategy and theaters for programming.
  - **Data Source**: Sample data

- **Museum Visitor Data**: `test-museum-visitor.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-museum-visitor)
  - **Description**: Museum and gallery visitor data allowing analysis by facility type, exhibition content, and age group
  - **Use Case**: Filter by facility type × exhibition content × age group to instantly grasp visitor segments and popular exhibition trends. Useful for curators for planning and municipalities for cultural facility improvement.
  - **Data Source**: Sample data

- **Patent Application Data**: `test-patent-application.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-patent-application)
  - **Description**: Patent application data allowing analysis by technology field, applicant type, and region
  - **Use Case**: Filter by technology field × applicant type × region to instantly grasp technology trends and competitor filing trends. Useful for corporate R&D and IP departments for technology strategy.
  - **Data Source**: Sample data

- **Retail Survey Data**: `test-retail-survey.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-retail-survey)
  - **Description**: Retail industry survey data allowing analysis by business format, location, and sales trends
  - **Use Case**: Filter by format × location × period to instantly grasp sales trends and success factors. Useful for retailers for store opening consideration and trading companies for supplier selection.
  - **Data Source**: Sample data

- **International Trade Data**: `test-international-trade.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-international-trade)
  - **Description**: International trade statistics allowing analysis by product, partner country, and import/export trends
  - **Use Case**: Filter by product × partner country × import/export to instantly grasp trade structure changes and supply/demand by country. Useful for trading companies for product selection and economic analysts for market analysis.
  - **Data Source**: Sample data

- **Foreign Visitor Consumption Data**: `test-foreign-visitor-consumption.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-foreign-visitor-consumption)
  - **Description**: Foreign visitor consumption behavior data allowing analysis by nationality, expenditure category, and region
  - **Use Case**: Filter by nationality × expenditure × region to instantly grasp target country preferences and best-sellers. Useful for tourist area souvenir shops and duty-free stores for product lineup and promotion strategy.
  - **Data Source**: Sample data

*Each test dataset is created as a sample for multidimensional chart analysis using DC.js and can be utilized for learning and verification of actual data analysis methods and visualization techniques.

## Usage

1. Use CSV files as base data and define display settings in corresponding `.options.json` files
2. Load data using the `DcChart.vue` component to display multidimensional charts
3. Use the `FileSelectMenu.vue` component to select data files
