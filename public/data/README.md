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
  Date,Prefecture,Municipality,Gender,Age,Status,Occupation,Occupation Category,Count
  ```
- **Description**: COVID-19 infection data including date, gender, age, status (discharged, etc.), location, and occupation
- **Use Case**: Filter by prefecture × age group × period to instantly grasp infection trends and differences in outbreak waves. Suitable for comparative analysis limited to specific regions or attributes, and for understanding phases of infection spread and containment.
- **How to use analysis results**:
  - Use regional and age-specific infection wave patterns to plan priority measures when similar conditions occur again.
  - When infections concentrate in certain occupation categories, use the results to decide on prevention measures and resource allocation.
- **Data Source**: Ministry of Health, Labour and Welfare Open Data

#### COVID-19 Infection Data (Global)
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=covid19-world)
- **File**: `covid19-world.csv`
- **Format**:
  ```
  Date,Country,Region,Sex,Age,Status,Hemisphere,nouse,Count
  ```
- **Description**: Global COVID-19 infection and death data including date, country/region, hemisphere, and status (infected/death)
- **Use Case**: Filter by country × region × status × period to instantly compare geographic patterns of spread and impact by country. Suitable for international comparison and pandemic analysis.
- **How to use analysis results**:
  - Identify common factors in countries that recovered quickly to inform effective countermeasure analysis.
  - Use as reference for preemptive response when signs of resurgence appear in other countries.
- **Data Source**: Open data

### 2. Weather Data

#### Japan Temperature Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-temperature)
- **File**: `ja-weather-temperature.csv`
- **Format**:
  ```
  🌡️Average Temperature Total(℃),🏢Prefecture,🏙️Municipality,☔Precipitation Total(mm),💨Average Wind Speed(m/s),🧭Most Common Wind Direction(16 points),❄️Snowfall Total(cm),⚪Unused,🌡️Average Temperature(℃),💧Average Humidity(%),☁️Average Cloud Cover,♨️Average Vapor Pressure(hPa),🔄Average Local Pressure(hPa),☀️Sunshine Hours,🌨️Snow Days,⚡Thunder Days,🌫️Fog Days
  ```
- **Description**: Average temperature data for major cities in Japan. Includes temperature, precipitation, wind speed, wind direction, prefecture, municipality, and other meteorological information
- **Use Case**: Filter by region × period × weather conditions to instantly obtain climate risk assessments for event scheduling or agricultural planning. Also useful for travel planning and construction weather risk consideration.
- **How to use analysis results**:
  - Use regional and seasonal temperature/precipitation patterns to justify event dates and venue selection when holding similar events in the same season.
  - Identify high-risk conditions (e.g., extreme heat, heavy snow) to decide on preventive measures, insurance, and resource allocation.
- **Data Source**: [Past Weather Data Download@Japan Meteorological Agency](https://www.data.jma.go.jp/risk/obsdl/)

#### Japan Precipitation Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-precipitation)
- **File**: `ja-weather-precipitation.csv`
- **Format**:
  ```
  ☔Precipitation Total(mm),🏢Prefecture,🏙️Municipality,🌡️Average Temperature(℃),💨Average Wind Speed(m/s),🧭Most Common Wind Direction(16 points),❄️Snowfall Total(cm),⚪Unused,☔Precipitation Total(mm):Base,💧Average Humidity(%),☁️Average Cloud Cover,♨️Average Vapor Pressure(hPa),🔄Average Local Pressure(hPa),☀️Sunshine Hours,🌨️Snow Days,⚡Thunder Days,🌫️Fog Days
  ```
- **Description**: Precipitation data for major cities in Japan. Includes precipitation, temperature, wind speed, wind direction, prefecture, municipality, and other meteorological information
- **Use Case**: Visualize region × season × precipitation patterns to understand flood risk trends, agricultural water planning, and infrastructure priority areas. Suitable for disaster prevention personnel comparing past rainfall patterns.
- **How to use analysis results**:
  - Identify conditions prone to flooding from regional and seasonal precipitation to select priority disaster-prevention areas and update hazard maps.
  - Cross-reference past rainfall patterns with agricultural and construction schedules for water planning and schedule risk assessment.
- **Data Source**: [Past Weather Data Download@Japan Meteorological Agency](https://www.data.jma.go.jp/risk/obsdl/)

#### Japan Temperature and Precipitation Data (3 Major Cities, 153 Years)
- [📊Temperature Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-temperature-3) | [📊Precipitation Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-precipitation-3)
- **File**: `ja-weather-temperature-3.csv`, `ja-weather-precipitation-3.csv`
- **Format**:
  ```
  🌡️Average Temperature(℃),🏢Prefecture,🏙️Municipality,☔Precipitation(mm),💨Average Wind Speed,🧭Most Common Wind Direction,Various meteorological indicators
  ```
- **Description**: Long-term weather data from 1872 for Fukuoka, Tokyo, and Sapporo (approximately 153 years). Suitable for long-term climate change trend analysis
- **Use Case**: Filter by city × period (year/month) to instantly grasp long-term climate change trends and inter-city climate differences. Useful for climate research and historical meteorological analysis.
- **How to use analysis results**:
  - Use city- and period-specific temperature and precipitation trends to assess regional climate change and prioritize adaptation measures.
  - Reference impacts of past similar weather conditions to support long-term planning for agriculture, disaster prevention, and infrastructure.
- **Data Source**: [Past Weather Data Download@Japan Meteorological Agency](https://www.data.jma.go.jp/risk/obsdl/)

### 3. Video Game Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-fc)
- **File**: `game-fc.csv`, `game-gb.csv`, `game-ps1.csv`, `game-ps3.csv`, `game-ps4.csv`, `game-ps5.csv`, `game-switch.csv`, `game-ds.csv`, `game-3ds.csv`, `game-xbox.csv`, `game-xbox360.csv`, `game-dreamcast.csv`, `game-xboxone.csv`, etc.
- **Format**:
  ```
  Release Date,Manufacturer,Title,Cross Review(Rating),Capacity(bit),Genre,Price,Price range,Sales TOP50,Hardware,Cartridge Color,Label,Best "Versus" Game,Best "High Score" Game,Most Difficult to Clear
  ```
- **Description**: Game title information for various platforms (FC, GB, PS1, etc.) including release date, rating, genre, manufacturer, price, and sales
- **Use Case**: Filter by hardware × genre × release year to instantly grasp popular title trends and manufacturer strengths. Useful for collectors narrowing down desired titles and industry analysts for market analysis.
- **How to use analysis results**:
  - Use conditions where hit titles concentrate as evidence for next title planning and platform selection.
  - Compare genre popularity over time to distinguish short-lived booms from long-term trends.
  - Identify rare, highly rated titles for collection and purchasing decisions.
- **Data Source**:
  - [Various Game Consoles Cartridge/Software Title List](http://pasofami.game.coocan.jp/game/game.htm)
  - [Famicom & Disk System Software Sales Ranking](https://www.gavas.jp/user_data/famicom_game_ranking.php)
  - [Famicom National Vote](https://www.nintendo.com/jp/famicom/vote/index.html)

#### 🎮PlayStation 3 Software List
- **File**: `game-ps3.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-ps3&layout=tube)
  - **Format**: Same as `game-ps1.csv`(Release Date,Manufacturer,Title,Cross Review,Price Range,Genre,Series,ID,Sales (10k units),…)
  - **Description**: 981 PS3 release titles. Sales matched from TOP50 ranking (45 titles). Cross-review scores and genres matched from soft-db hall of fame (30–40 points,515 titles,including fuzzy title matching).
  - **Use Case**: Analyze PS3 software by manufacturer × series × release year × sales × cross review score.
  - **How to use analysis results**:
    - Identify manufacturer and series trends among top-selling titles.
    - Track title count by release year to understand the platform lifecycle.
    - Compare genre and manufacturer distribution among highly rated cross-review titles.
  - **Data Source**: [PlayStation 3 game titles@Wikipedia (JA)](https://ja.wikipedia.org/wiki/PlayStation_3%E3%81%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%B8%80%E8%A6%A7),[PS3 sales ranking@PicoPico Encyclopedia](https://www.gavas.jp/user_data/playstation3_game_ranking.php),[PS3 cross-review hall of fame@soft-db](https://ps3.soft-db.net/dendo/dendo_40.html)

#### 🎮Xbox Software List
- **File**:`game-xbox.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-xbox&layout=tube)
  - **Format**:
    ```
    Release Date,Manufacturer,Title,Cross Review (Score),Package Bundle,Genre,Developer,Unused,Sales Count,Platform
    ```
  - **Description**: 222 Xbox release titles (2002–2006, Japan releases). Uses the Japan release date column from the Wikipedia list.
  - **Use Case**: Analyze 6th-generation Xbox software by manufacturer × release date.
  - **Data Source**: [Xbox game titles@Wikipedia (JA)](https://ja.wikipedia.org/wiki/Xbox%E3%81%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%B8%80%E8%A6%A7)

#### 🎮Dreamcast Software List
- **File**: `game-dreamcast.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-dreamcast&layout=tube)
  - **Format**:
    ```
    Release Date,Manufacturer,Title,Cross Review (Score),Package Bundle,Genre,Developer,Unused,Sales Count,Platform
    ```
  - **Description**: 497 Dreamcast release titles (1998–2007, Japan releases). Uses the Japan release date column from the Wikipedia list.
  - **Use Case**: Analyze Dreamcast software by manufacturer × release date.
  - **Data Source**: [Dreamcast game titles@Wikipedia (JA)](https://ja.wikipedia.org/wiki/%E3%83%89%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%AD%E3%83%A3%E3%82%B9%E3%83%88%E3%81%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%B8%80%E8%A6%A7)

#### 🎮Xbox 360 Software List
- **File**: `game-xbox360.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-xbox360&layout=tube)
  - **Format**:
    ```
    Release Date,Manufacturer,Title,Cross Review (Score),Package Bundle,Genre,Developer,Unused,Sales Count,Platform
    ```
  - **Description**: 724 Xbox 360 release titles (2005–2021, Japan releases). Package bundle flag from media column (◎/blank=YES, ○=download-only).
  - **Use Case**: Analyze Xbox 360 software by manufacturer × release date × package bundle availability.
  - **Data Source**: [Xbox 360 game titles@Wikipedia (JA)](https://ja.wikipedia.org/wiki/Xbox_360%E3%81%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%B8%80%E8%A6%A7)

#### 🎮Xbox One Software List
- **File**: `game-xboxone.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-xboxone&layout=tube)
  - **Format**:
    ```
    Release Date,Manufacturer,Title,Cross Review (Score),Package Bundle,Genre,Developer,Unused,Sales Count,Platform
    ```
  - **Description**: 2,777 Xbox One titles (2014–2025, Japan). Combines Wikipedia package titles (173, YES), download-only, and ACA NEOGEO. Release dates from h3 year headings + `M/D` cells.
  - **Use Case**: Analyze Xbox One software by manufacturer × release date × package bundle availability.
  - **How to use analysis results**:
    - Compare manufacturer distribution between packaged and download-only titles.
    - Track title counts by release year to understand the shift toward digital releases in the late 8th generation.
    - Explore launch-period (Sep 2014) vs. later-title trends over time.
  - **Data Source**: [Xbox One game titles@Wikipedia (JA)](https://ja.wikipedia.org/wiki/Xbox_One%E3%81%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%B8%80%E8%A6%A7)

#### 🎮PlayStation 4 Software List
- **File**: `game-ps4.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-ps4&layout=tube)
  - **Format**:
    ```
    Release Date,Manufacturer,Title,Cross Review (Score),Package Bundle,Genre,Developer,Unused,Sales Count,Platform
    ```
  - **Description**: 2,497 PS4 release titles (2014–2026). Cross-review scores and genres matched from soft-db hall of fame (30–40 points, 821 titles, including fuzzy title matching).
  - **Use Case**: Analyze PS4 software by manufacturer × genre × release date × package bundle availability.
  - **How to use analysis results**:
    - Compare manufacturer and genre distribution between packaged and download-only titles.
    - Track title counts by release year from launch (2014) through the late PS4 era.
    - Explore highly rated titles by cross-review score band and manufacturer.
  - **Data Source**:
    - [PlayStation 4 game titles@Wikipedia (JA)](https://ja.wikipedia.org/wiki/PlayStation_4%E3%81%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%B8%80%E8%A6%A7)
    - [PS4/PS5 cross-review hall of fame@soft-db](https://ps4.soft-db.net/dendo.html)

#### 🎮PlayStation 5 Software List
- **File**: `game-ps5.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-ps5&layout=tube)
  - **Format**:
    ```
    Release Date,Manufacturer,Title,Cross Review (Score),Package Bundle,Genre,Developer,Unused,Sales Count,Platform
    ```
  - **Description**: 2,152 PS5 release titles (2020–2027). Cross-review scores and genres matched from soft-db hall of fame (30–40 points, 509 titles). PS4-compatible titles share the same score and genre in both `game-ps4.csv` and `game-ps5.csv`.
  - **Use Case**: Analyze PS5 software by manufacturer × genre × release date × package bundle availability.
  - **How to use analysis results**:
    - Track title counts by release year to understand PS5 software growth.
    - Compare manufacturer distribution between packaged and download-only titles.
    - Explore launch-period (Nov 2020) vs. later-title trends over time.
  - **Data Source**:
    - [PlayStation 5 game titles@Wikipedia (JA)](https://ja.wikipedia.org/wiki/PlayStation_5%E3%81%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%B8%80%E8%A6%A7)
    - [PS4/PS5 cross-review hall of fame@soft-db](https://ps4.soft-db.net/dendo.html)
    - [PS5 2020-2021@Wikipedia (JA)](https://ja.wikipedia.org/wiki/PlayStation_5%E3%81%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%B8%80%E8%A6%A7_(2020%E5%B9%B4-2021%E5%B9%B4))
    - [PS5 2022@Wikipedia (JA)](https://ja.wikipedia.org/wiki/PlayStation_5%E3%81%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%B8%80%E8%A6%A7_(2022%E5%B9%B4))
    - [PS5 2023@Wikipedia (JA)](https://ja.wikipedia.org/wiki/PlayStation_5%E3%81%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%B8%80%E8%A6%A7_(2023%E5%B9%B4))

#### 🎮Nintendo Switch Software List
- **File**: `game-switch.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-switch&layout=tube)
  - **Format**:
    ```
    Release Date,Manufacturer,Title,Cross Review (Score),Package Bundle,Genre,Developer,Unused,Sales Count,Platform
    ```
  - **Description**: 9,850 Nintendo Switch release titles (2017–2026).
  - **Use Case**: Analyze Switch software by manufacturer × genre × release date × package bundle availability.
  - **How to use analysis results**:
    - Track title counts by release year to understand Switch software growth.
    - Compare manufacturer distribution between packaged and download-only titles.
    - Explore launch-period (Mar 2017) vs. later-title trends over time.
  - **Data Source**:
    - [Nintendo Switch game titles@Wikipedia (JA)](https://ja.wikipedia.org/wiki/Nintendo_Switch%E3%81%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%B8%80%E8%A6%A7)

#### 🎮Nintendo DS Software List
- **File**: `game-ds.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-ds&layout=tube)
  - **Format**:
    ```
    Release Date,Manufacturer,Title,Cross Review (Score),Package Bundle,Genre,Developer,Unused,Sales Count,Platform
    ```
  - **Description**: 1,839 Nintendo DS release titles (2004–2012).
  - **Use Case**: Analyze DS software by manufacturer × genre × release date. Retro gamers can explore classics by era.
  - **How to use analysis results**:
    - Track title counts by release year to understand the DS peak period (2007–2008).
    - Compare genre distribution by manufacturer between Nintendo and third parties.
    - Explore launch-period (Dec 2004) vs. later-title trends over time.
  - **Data Source**:
    - [Nintendo DS game titles@Wikipedia (JA)](https://ja.wikipedia.org/wiki/%E3%83%8B%E3%83%B3%E3%83%86%E3%83%B3%E3%83%89DS%E3%81%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%B8%80%E8%A6%A7)

#### 🎮Nintendo 3DS Software List
- **File**: `game-3ds.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-3ds&layout=tube)
  - **Format**:
    ```
    Release Date,Manufacturer,Title,Cross Review (Score),Package Bundle,Genre,Developer,Unused,Sales Count,Platform
    ```
  - **Description**: 1,369 Nintendo 3DS release titles (2011–2019).
  - **Use Case**: Analyze 3DS software by manufacturer × genre × release date × package bundle availability.
  - **How to use analysis results**:
    - Track title counts by release year to identify the 3DS software peak.
    - Compare manufacturer distribution between packaged and download-only titles.
    - Explore launch-period (Feb 2011) vs. later-title trends over time.
  - **Data Source**:
    - [Nintendo 3DS game titles@Wikipedia (JA)](https://ja.wikipedia.org/wiki/%E3%83%8B%E3%83%B3%E3%83%86%E3%83%B3%E3%83%89%E3%83%BC3DS%E3%81%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E4%B8%80%E8%A6%A7)

#### Game Title Data (Dragon Quest Monsters)
- [📊Dragon Quest 3 Monsters](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-title-dq3-monster) | [📊Dragon Quest 4 Monsters](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-title-dq4-monster)
- **File**: `game-title-dq3-monster.csv`, `game-title-dq4-monster.csv`
- **Format**:
  ```
  Play Time,Type,LV,Appearance Location,Monster Name,Species,HP,MP,Attack,Defense,Speed,Experience,GOLD,Magic,Drop Item,Resistance,etc.
  ```
- **Description**: Monster lists for Dragon Quest 3 and 4. Includes appearance location, level, stats, drop items, and resistances
- **Use Case**: Filter by appearance location × species × level to select leveling spots and optimize equipment collection. Suitable for players searching strategy information.
- **How to use analysis results**:
  - Identify combinations with high experience or GOLD efficiency to choose priority leveling and farming spots.
  - Use appearance conditions for monsters with desired drops to plan equipment collection routes and time estimates.
- **Data Source**: In-game data, etc.

### 4. Ramen Shop Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=food-ramen)
- **File**: `food-ramen.csv`
- **Format**:
  ```
  Founding Year,Prefecture,🍜Ramen Shop Name,Noodle Type(Sample),Price Range(Sample),Genre(Sample),🚉Nearest Station/Address,Job Category,Count
  ```
- **Description**: Ramen shop information including founding year, noodle type, price range, genre, location, shop name, and nearest station
- **Use Case**: Filter by prefecture × noodle type × price range to select candidate shops for business trips or travel, and for franchise expansion region selection. Suitable for food enthusiasts discovering shops matching their preferences.
- **How to use analysis results**:
  - Identify region × noodle type × price combinations where shops concentrate to select expansion locations and assess competitive gaps.
  - Use trends by founding year or genre to identify common success factors for new openings and menu strategy.
- **Data Source**: [Famous Ramen Shop Timeline by Era @Ramen Jiyuku](http://ramenjiyuku.web.fc2.com/)

### 4-2. 🏯Japanese Castle List Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-castle)
- **File**: `ja-castle.csv`
- **Format**:
  ```
  Construction Year,Prefecture,Municipality,Castle Name,Type,Elevation,Province,Unused,,🔖Tags,Latitude/Longitude
  ```
- **Description**: Castle and castle ruin information across all 47 prefectures in Japan. Includes castle name, type (hill castle, flatland-mountain castle, etc.), elevation, location, historical province (ryōkyoku), structural remains (earthworks, moats, stone walls, etc.), and Google Maps coordinates. Approximately 11,200 records.
- **Use Case**: Filter by prefecture × type × elevation × historical province to explore castles for travel planning, historical research, or regional comparison. Suitable for castle enthusiasts discovering ruins and famous castles on a map.
- **How to use analysis results**:
  - Identify concentrations of specific castle types or remains by region to plan sightseeing routes and prioritize visits.
  - Use the map view to find castles near a destination and filter by tags (stone walls, moats, etc.) to match interests.
- **DcChart visualization highlights**:
  - **Google Maps markers**: Each castle is plotted on Google Maps from latitude/longitude in the CSV. Filtered results are shown as markers, so you can see where castles are distributed across Japan at a glance.
  - **Chart–map linkage**: Clicking a castle name or region in the chart pans the map to that castle's marker, making it easy to jump from list analysis to on-site location.
  - **3D map mode**: Enable the **🌏3D** checkbox on the map panel (or open with `&is_gmap_3d=1`) to view terrain in three dimensions. This helps you understand *why* a castle was built there—ridges, valleys, rivers, and elevation in context—especially useful for comparing hill castles (`山城`) and flatland-mountain castles (`平山城`) against actual topography.
  - [📊Chart (3D map)](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-castle&is_gmap_3d=1)
- **Data Source**: [Shiro Kōrōki (Castle Wanderings) @hb.pei.jp](https://www.hb.pei.jp/shiro/)

### 4-2-1. 🌸Cherry Blossom Spots in Japan
- **File**: `ja-cherry-blossom.csv`
  - [📊Chart](http://127.0.0.1:8000/dashboard-dc-pub?data=ja-cherry-blossom)
  - **Format**:
    ```
    Establishment Year,Prefecture,Name,Star Rating,Scale Index,Category,Type,Unused,Main Index,Latitude/Longitude
    ```
  - **Description**: Cherry blossom viewing spots from Japan's Top 100 Sakura Sites (selected in 1990). Supports map-linked analysis by prefecture, spot name, and coordinates.
  - **Use Case**: Plan hanami (cherry blossom viewing) trips
  - **Data Source**:
    - [Japan's Top 100 Sakura Sites @Wikipedia](https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%95%E3%81%8F%E3%82%89%E5%90%8D%E6%89%80100%E9%81%B8)

### 4-3. ♨️Hot Spring Usage by Prefecture (Japan)
- **File**: `ja-onsen.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-onsen)
  - **Format**:
    ```
    Survey Year,Region,Prefecture,High-Temp Source Ratio Band,Onsen Area Count,Source Count Band,High-Temp Source Count,Unused,Flow Rate (L/min),Source Count,Lodging Facilities,Annual Lodgers,Capacity
    ```
  - **Description**: Onsen statistics for all 47 prefectures based on the Ministry of the Environment FY2014 (Heisei 25) hot spring usage survey (as of March 2014). Analyze by onsen area count, source count (by temperature), flow rate (L/min), lodging facilities, and annual lodgers.
  - **Use Case**: Filter by prefecture × region × source count band × high-temperature source ratio to compare regions rich in hot spring resources and lodging scale. Useful for travel planning and onsen tours.
  - **How to use analysis results**:
    - Identify prefectures with high flow rates and source counts to prioritize onsen tour areas.
    - Find prefectures where lodging use is concentrated by relating high-temperature source ratio bands to annual lodgers.
    - Compare onsen area distribution by region to understand regional hot spring culture.
  - **Data Source**:
    - [Hot Spring Usage by Prefecture@Ministry of the Environment Statistics](https://www.env.go.jp/doc/toukei/contents/index.html)
    - [Hot Spring Usage Data@Ministry of the Environment](https://www.env.go.jp/nature/onsen/data/)
    - [Prefecture Rankings (reposted MOE data)](https://uub.jp/pdr/ss/hotspring_6a.html)

### 4-4. 🚃Station Passenger Volume by Line (Japan)
- **File**: `ja-rail-passenger.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-rail-passenger)
  - **Format**:
    ```
    Survey Year,Rank,Operator Type,Passenger Volume Band,Line Name,Station Name,Operator,Unused,Passengers,Prefecture
    ```
  - **Description**: Top 100 station-by-line daily passenger volumes for FY2023. Same station names may appear multiple times per operator and line. Passenger counts are per day.
  - **Use Case**: Filter by line × operator × operator type × prefecture to compare congestion at major terminals and JR vs. private railway usage. Reference data for rail fans and commuters.
  - **How to use analysis results**:
    - Map top lines by operator and regional distribution of passenger volume.
    - Compare line-by-line breakdown at the same station name (Shinjuku, Ikebukuro, Shibuya, etc.) to see which line is busiest.
    - Analyze usage scale differences by operator type (JR / private / municipal subway).
  - **Data Source**:
    - [Passenger Traffic@Wikipedia (JA)](https://ja.wikipedia.org/wiki/%E9%80%9A%E9%81%8E%E4%BA%BA%E5%93%A1) (FY2023 station-by-line ranking table)
    - [National Land Numerical Information: Station Passengers FY2023](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-S12-2023.html)
    - [Station Passenger Ranking 100@Open Portal](https://opendata-web.site/station/rank/)
  - **Note**: Each railway operator calculates passenger counts independently; there is no unified standard. For combined totals at the same station name, see the separate table in the Wikipedia article.

### 5. Heart Disease Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=kaggle-heart-disease)
- **File**: `kaggle-heart-disease.csv`
- **Format**:
  ```
  Date,Number of Major Vessels,Thalassemia Type,Gender,Age,Chest Pain Type,ST Segment Slope,Unused,Count,🔖Resting Blood Pressure,🔖Serum Cholesterol,Fasting Blood Sugar > 120 mg/dl,Resting ECG Results,🔖Maximum Heart Rate,Exercise Induced Angina,ST Depression,⚠Heart Attack Risk
  ```
- **Description**: Medical data related to heart disease including gender, age, various test results, symptoms, and risk assessment
- **Use Case**: Filter by age × gender × test values × risk to identify high-risk group characteristics and design prevention awareness targets. Suitable for healthcare professionals analyzing risk factor trends and creating training materials.
- **How to use analysis results**:
  - Identify combinations that classify as high risk to select key screening items, follow-up targets, and prevention campaign design.
  - Use trends in specific test values and symptoms to explain in training why certain groups have higher risk.
- **Data Source**: [Heart Disease Prediction Dataset@Kaggle](https://www.kaggle.com/datasets/mfarhaannazirkhan/heart-dataset/data)

### 6. Municipal Company Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-municipality-company)
- **File**: `resas-municipality-company.csv`
- **Format**:
  ```
  Year,Prefecture,Industry Major Classification,Region,Company,Industry Major Classification(Horizontal),Industry Middle Classification,Unused,Count
  ```
- **Description**: Local government company data including year, region, company type, industry classification, and prefecture
- **Use Case**: Filter by year × industry × region for municipal staff to grasp industry structure changes and for companies to compare industry distribution in expansion candidate regions. Useful for regional economic policy and attraction strategy planning.
- **How to use analysis results**:
  - Use industry × region trends in company count to select industries to attract and prioritize subsidies or special zones.
  - Compare industry distribution in expansion candidates to select niches with fewer competitors or regions where supply chains can form.
- **Data Source**:
  - [Industry Structure Map > All Industries > Number of Companies @RESAS API](https://opendata.resas-portal.go.jp/docs/api/v1/municipality/company/perYear.html)
  - [Industry Structure Map > All Industries > Number of Companies @RESAS](https://resas.go.jp/municipality-company/#/graph/13/13101/2014/-/-/0/5.333900736553437/41.42090017812787/142.29371418128918/-)

### 7. High School Baseball Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=sports-hsb)
- **File**: `sports-hsb.csv`
- **Format**:
  ```
  Year,Prefecture,Representative School,Rank,Final Score,Coach(Sample),Famous Players(Sample),Unused,Count
  ```
- **Description**: High school baseball tournament results including year, rank, final score, coach, prefecture, representative school, and famous players
- **Use Case**: Filter by year × prefecture × rank to instantly grasp regional high school baseball history and strong school transitions. Suitable for sports writers discovering coverage themes and fans checking local school historical performance.
- **How to use analysis results**:
  - Use prefecture- and period-specific champion/runner-up patterns to choose coverage themes and test hypotheses about what makes strong teams.
  - Visualize repeated appearances by school or coach to inform analysis of sustained success and regional development policy.
- **Data Source**:
  - [Summer Koshien Historical Champions and Runners-up List @baseballking](https://baseballking.jp/ns/161307)
  - [National High School Baseball Championship Historical Winners @Wikipedia](https://ja.wikipedia.org/wiki/全国高等学校野球選手権大会歴代優勝校)

### 8. Sports Club Participation Trends
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=checkin-sakana)
- **File**: `checkin-sakana.csv`, `checkin-sakana.light.csv`
- **Format**:
  ```
  Year/Month,Player,Hometown,Gender,Badminton Class,Condition,Gymnasium,Count
  ```
- **Description**: Participation records for badminton club "Sakana". Includes year/month, participants, gymnasium, and hometown
- **Use Case**: Filter by year/month × gymnasium × hometown to instantly grasp participation trends and venue-specific usage. Useful for club managers for practice scheduling and venue selection.
- **How to use analysis results**:
  - Use venue- and period-specific participation trends to identify popular or quiet venues and decide on schedule changes or venue retention.
  - Use participation patterns by hometown or condition to improve event planning and recruitment.
- **Data Source**: Club operation data

### 9. Sports Club Website Access Trends
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=sakana-hp-access)
- **File**: `sakana-hp-access.csv`
- **Format**:
  ```
  Date,Club,Prefecture,Gender,Age,Days Before Practice,Device,Count,COVID-19 Wave,Practice Participants
  ```
- **Description**: Sports club website access data including date, club, prefecture, COVID wave, and practice participation numbers
- **Use Case**: Filter by date × club × prefecture to instantly grasp the relationship between website access and practice participation and COVID impact. Useful for managers considering content improvement and promotion strategies.
- **How to use analysis results**:
  - Identify conditions that boost access (e.g., days before practice, COVID wave) to decide update timing and notification intensity.
  - Use correlation between access and participation to set content improvement priorities and decide whether to continue or revise promotion.
- **Data Source**: Access logs and participation records

### 10. Article Likes Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-article-like)
- **File**: `test-article-like.csv`
- **Format**:
  ```
  Date(Author),Prefecture(Author),🔖Article Theme/Genre,Gender(Author),Age(Author),🔖Article Type,Occupation(Author),Unused,Number of Likes,🔖Article Audience,🔖Article SEO
  ```
- **Description**: Article like count data including creation date, author information, article type, theme, like count, and audience
- **Use Case**: Filter by article type × theme × author attributes × period to instantly determine which content resonates with which audience. Useful for editors in planning and marketers for target-specific content strategy.
- **How to use analysis results**:
  - Use combinations of article type × theme × audience where likes concentrate to justify next themes and assignment.
  - Use differences by period or author attributes to decide which content to continue and which to change, and set priority of initiatives.
- **Data Source**: Sample data *Note: Gender, age, occupation, and prefecture are for the article author

### 11. Noto Earthquake Safety Confirmation Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-quake-noto-safety.csv)
- **File**: `ja-quake-noto-safety.csv`
- **Format**:
  ```
  Number of Missing Persons(By Announcement Date),City,Municipality,Gender,Age,Safety Confirmation Status,Name,Occupation Category,Count
  ```
- **Description**: Safety confirmation data for the Noto Peninsula Earthquake including missing person count, gender, age, confirmation status, location, and names
- **Use Case**: Grasp time series × region × situation in multiple dimensions for support prioritization and response status organization based on damage. Suitable for overall disaster response overview.
- **How to use analysis results**:
  - Identify regions and conditions requiring priority support to inform support planning.
  - Use changes in support status over time to find improvements in resource allocation.
- **Data Source**:
  - [Information on the 2024 Noto Peninsula Earthquake @Ishikawa Prefecture](https://www.pref.ishikawa.lg.jp/saigai/202401jishin-taisakuhonbu.html#higai)
  - Wikipedia

### 12. Business Trends and DI Index Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=store-di)
- **File**: `store-di.csv`
- **Format**:
  ```
  Year/Month,DI,Unused1,Business Trend/Economic Sentiment,Current Status/Outlook,Change,Unused4,Job Category,Count
  ```
- **Description**: Business trend survey DI (Diffusion Index) indicator data including month/year, business trend, current status/outlook, change, and DI value
- **Use Case**: Filter by period × business trend item × current/outlook to instantly grasp retail industry sentiment trends. Useful for managers judging industry trends and analysts for investment reference.
- **How to use analysis results**:
  - Use item- and period-specific DI trends to form hypotheses on what is driving industry deterioration or improvement and to decide on investment, hiring, and inventory.
  - Reference subsequent movements in past periods with similar DI levels to consider expansion or contraction in the next phase.
- **Data Source**: [Supermarket Business Trend/Economic Sentiment Survey @Japan Supermarket Association](http://www.j-sosm.jp/dl/index.html)

### 13. Agriculture-Related Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-agriculture)
- **File**: `resas-agriculture.csv`
- **Format**:
  ```
  Year,Prefecture,Item Name,Item Major Classification,Item Classification,Item Name(Horizontal),Agricultural Organization(Sample),Unused5,Count
  ```
- **Description**: Agricultural statistics data including year, item classification, prefecture, and agricultural organization
- **Use Case**: Filter by year × item × prefecture to instantly grasp output value trends by producing region and item strengths. Useful for agricultural policy makers and JA/wholesalers for producing region comparison and sales channel development.
- **How to use analysis results**:
  - Use item × region trends in output value to select priority items for subsidies and producing regions to develop.
  - Identify producing regions with strong items to guide wholesalers’ and retailers’ supplier selection and farmers’ cropping and diversification.
- **Data Source**:
  - [Agricultural Output by Item @RESAS API](https://opendata.resas-portal.go.jp/docs/api/v1/agriculture/all/forStackedBar.html)
  - [Industry Structure Map > Agriculture > Agricultural Structure @RESAS](https://resas.go.jp/agriculture-all/#/rate/5.333900736553437/41.42090017812787/142.29371418128918/13/13101/0/2016/1/-/-)

### 14. Wood Ear Mushroom Cultivation Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-agr-kikurage)
- **File**: `test-agr-kikurage.csv`
- **Format**:
  ```
  Date,Cultivation Prefecture,Product Name,Variety,Spawn Source,Cultivation Method,Other Elements※,Sales Format,Sales
  ```
- **Description**: Wood ear mushroom cultivation and sales data including variety, cultivation method, region, sales format, and revenue
- **Use Case**: Filter by variety × cultivation method × region × sales format to instantly grasp best-selling combinations and efficient cultivation patterns. Useful for farmers considering business improvement and wholesalers/retailers for supplier selection.
- **How to use analysis results**:
  - Identify high-revenue combinations of variety × cultivation method × sales format to set next-season variety and cultivation strategy and sales priorities.
  - Use regional best-seller patterns for supplier selection (wholesalers/retailers) and for farmers to consider differentiation by region.
- **Data Source**: Sample data
  - ※"Other Elements" is a string representing multiple attributes (average temperature, average humidity, protein content, dietary fiber content) with grades A through D

### 15. Foreign Tourist Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-tourism-foreigners)
- **File**: `resas-tourism-foreigners.csv`
- **Format**:
  ```
  Year,Visited Prefecture,Visitor Nationality,Visit Purpose,Visitor Region,Visitor Nationality(Horizontal),Tourist Attraction(Sample),Unused,Count
  ```
- **Description**: Data on foreign tourists visiting Japan including visit year, purpose, visitor nationality/region, visited prefecture, and tourist attractions
- **Use Case**: Filter by year × nationality × visit purpose × visited prefecture to instantly grasp target country visit trends and attraction policy effectiveness. Suitable for municipal tourism officers considering inbound strategy.
- **How to use analysis results**:
  - Use nationality × purpose × region combinations where visits concentrate to select target countries and purposes and to revise promotion content.
  - Reference recovery patterns under similar conditions to set preparation priorities for the next inbound recovery phase.
- **Data Source**:
  - [Number of Visitors by Nationality to Specified Region @RESAS API](https://opendata.resas-portal.go.jp/docs/api/v1/tourism/foreigners/forFrom.html)
  - [Tourism Map > Foreigners > Foreign Visitor Analysis @RESAS](https://resas.go.jp/tourism-foreigners/#/to-transition/5.333900736553437/41.42090017812787/142.29371418128918/13/13101/100/0/0.0/2020/5/-/-/1/-/-)

### 16. Annual Product Sales Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-product-sales)
- **File**: `resas-product-sales.csv`
- **Format**:
  ```
  Year,Prefecture,Municipality,Industry Major Classification,Era,Industry Middle Classification,Company(Sample),Count
  ```
- **Description**: Regional annual product sales data (1994–2021). Includes industry classification and sales by prefecture and municipality
- **Use Case**: Filter by year × industry × region to instantly grasp regional economic industry structure and retail/wholesale trends. Useful for commercial policy planning and store opening consideration.
- **How to use analysis results**:
  - Use industry × region sales trends to select priority industries and regions for commercial policy and to narrow store opening candidates.
  - Reference past trends under similar conditions to time investment or contraction and to support medium- to long-term planning.
- **Data Source**: [RESAS API](https://opendata.resas-portal.go.jp/)

### 17. Municipal Tax Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-municipality-taxes)
- **File**: `resas-municipality-taxes.csv`
- **Format**:
  ```
  Year,Prefecture,Municipality,Unused1,Tax Category,Unused2,Industry(Sample),Unused,Count
  ```
- **Description**: Local government tax revenue data including year, tax category, prefecture, municipality, and industry
- **Use Case**: Filter by year × tax category × region to instantly grasp municipal fiscal health and tax structure changes. Useful for administrative staff for budget planning and companies comparing investment region fiscal conditions.
- **How to use analysis results**:
  - Use tax category × region trends in revenue to inform revenue projections and to decide whether to emphasize investment or savings in the budget.
  - Compare tax revenue trends of candidate regions to select fiscally stable areas and assess risk.
- **Data Source**:
  - [Local Finance Map > Per Capita Local Tax @RESAS API](https://opendata.resas-portal.go.jp/docs/api/v1/municipality/taxes/perYear.html)
  - [Local Finance Map > Per Capita Local Tax @RESAS](https://resas.go.jp/municipality-taxes/#/graph/13/13101/2016/1/7.39231742277876/35.998703685/139.883857/-)

### 18. Election Data

#### House of Representatives Election - List of Candidates
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-election-shugiin-candidates)
- **File**: `ja-election-shugiin-candidates.csv`
- **Format**:
  ```
  Date,Prefecture,Candidate Name,Gender,Age,Party,Occupation,Occupation Category(Unused),Seats,Elected/Defeated,Votes,Vote Share(%),Occupation Category,Election System,Single-Member District,Incumbent/Former/Newcomer,Terms Elected,Recommendation,🔖Q.Consumption tax reduction,🔖Q.U.S. diplomacy,🔖Q.Nuclear power dependency,etc.
  ```
- **Description**: House of Representatives election candidate list (2026/2024/2021). Covers all candidates including both elected and defeated. Includes candidate information, party, single-member district, proportional, elected/defeated, seats, votes, vote share (%), occupation category, and policy survey responses (e.g. consumption tax reduction, U.S. diplomacy, nuclear power dependency).
- **Use Case**: Filter by election year × party × election system × elected/defeated to instantly grasp candidate attributes, vote patterns, and policy stance distribution. Useful for election coverage, political research, and candidate analysis.
- **How to use analysis results**:
  - Compare attributes (occupation, age, incumbency, etc.) between elected and defeated candidates to inform campaign strategy and candidate selection.
  - Use policy survey responses and vote share correlation to support voter segment and issue analysis.
- **Data Source**: NHK Election WEB, Wikipedia House of Representatives general election, etc.

#### House of Representatives Election - List of Elected
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-election-shugiin-2024)
- **File**: `ja-election-shugiin-2024.csv`
- **Format**:
  ```
  Date,Prefecture,Candidate Name,Gender,Age,Party,Occupation,Seats,Votes,Vote Share(%),Election System,Single-Member District,Former/Former/New,Terms Elected,etc.
  ```
- **Description**: House of Representatives election winner data (2024/2021). Includes candidate information, party, single-member district, proportional, plus seats, votes, and vote share (%)
- **Use Case**: Filter by election year × party × election system to instantly grasp vote patterns in single-member vs. proportional and party power transitions. Useful for election coverage and political research.
- **How to use analysis results**:
  - Use regional support gaps to refine campaign strategy and messaging.
  - Use as input for identifying priority areas and voter segments in future elections.
- **Data Source**: NHK Election WEB, etc.

#### House of Councillors Election - List of Elected
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-election-sangiin-2025)
- **File**: `ja-election-sangiin-2025.csv`
- **Format**:
  ```
  Date,Prefecture,Candidate Name,Gender,Age,Party,Occupation,Election System,Incumbent/Former/Newcomer,Terms Elected,Recommendation,etc.
  ```
- **Description**: House of Councillors election winner data (2025/2022/2019). Includes candidate information, party, prefecture, electoral district/proportional
- **Use Case**: Filter by election year × party × prefecture to instantly grasp party seat acquisition trends and regional power balance. Useful for political analysts and media election analysis.
- **How to use analysis results**:
  - Use regional support gaps to refine campaign strategy and messaging.
  - Use as input for identifying priority areas and voter segments in future elections.
- **Data Source**: NHK Election WEB, etc.

#### Tokyo Gubernatorial Election Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-election-tokyo-gubernatorial-2024.csv) (July 2024)
- **File**: `ja-election-tokyo-gubernatorial-2024.csv`
- **Format**:
  ```
  Date,Candidate,Municipality,Gender(Candidate),Age(Candidate),Party(Candidate),Occupation(Candidate),Occupation Category,Count
  ```
- **Description**: Tokyo gubernatorial election voting data including election date, candidate information (gender, age, party, occupation), and vote counts by municipality
- **Use Case**: Filter by candidate × municipality × party to instantly grasp regional vote trends and support base distribution. Useful for political analysts and media for election coverage.
- **How to use analysis results**:
  - Use regional support gaps to refine campaign strategy and messaging.
  - Use as input for identifying priority areas and voter segments in future elections.
- **Data Source**:
  - [NHK Election WEB Tokyo Gubernatorial Election 2024 @NHK](https://www.nhk.or.jp/senkyo/database/local/shutoken/20336/skh54664.html)
  - [Tokyo Gubernatorial Election Voting Results @Tokyo](https://www.senkyo.metro.tokyo.lg.jp/election/tochiji-all/tochiji-sokuhou2024/csv/)
  - Wikipedia

### 16. Store Count Data
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=store-cnt)
- **File**: `store-cnt.csv`
- **Format**:
  ```
  Year/Month,Prefecture,Unused1,Unused2,Unused3,Store Type,Unused4,Job Category,Count
  ```
- **Description**: Store count statistics including year/month, store type, and store count by prefecture
- **Use Case**: Filter by period × store type × prefecture to instantly grasp retail industry expansion trends and regional store density. Useful for companies planning store openings and analysts for industry analysis.
- **How to use analysis results**:
  - Use store type × region trends in store count to select expansion locations, assess competitor density, and inform M&A or exit decisions.
  - Reference past store count under similar conditions to time expansion or contraction and set regional priorities.
- **Data Source**: [Supermarket Store Count @Japan Supermarket Association](http://www.j-sosm.jp/dl/index.html)

### 17. SSDSE (Standard Dataset for Education)

Education-oriented standard dataset by the National Statistics Center. Enables multidimensional analysis of various statistics by prefecture and municipality.

#### Prefecture-level Gender/Age Population Trends (2005–2022, 18 Years)
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-b-population)
- **File**: `ssdse-b-population.csv`
- **Format**:
  ```
  Year,Prefecture,Municipality,Sex,Age,Unused1,Unused2,Unused3,Count
  ```
- **Description**: Time series of gender and age-group population by prefecture. Includes birth, under 15, 15–64, 65+ population trends
- **Use Case**: Filter by year × prefecture × gender × age to instantly grasp regional differences in aging and population structure changes. Useful for municipal population vision and welfare plan planning.
- **How to use analysis results**:
  - Use regional and age-group population changes to prioritize facility planning (welfare, childcare, education) and to design trade areas and store targeting.
  - Reference past population under similar conditions to validate projection assumptions and evaluate policy impact.
- **Data Source**: [SSDSE @National Statistics Center](https://www.nstac.go.jp/use/literacy/ssdse/)

#### Prefecture-level Population and Facilities Trends (2005–2022, 18 Years)
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-b-building)
- **File**: `ssdse-b-building.csv`
- **Format**:
  ```
  Year,Prefecture,Municipality,Births,Building Starts,Unused1,Unused2,Unused3,Total Population,Hospitals,Clinics,Dental Clinics,Nurseries,Kindergartens,Elementary Schools,Junior High Schools,High Schools,etc.
  ```
- **Description**: Time series of population and medical/educational facilities by prefecture. Includes hospitals, schools, nurseries, marriages, divorces
- **Use Case**: Filter by year × prefecture × facility type to instantly grasp population-facility balance and depopulated areas. Useful for municipal facility planning and regional diagnosis.
- **How to use analysis results**:
  - Identify regions and facility types with low facilities per capita to set planning priorities and subsidy allocation.
  - Compare population and facility trends to assess concentration and depopulation and to support consolidation or new facility decisions.
- **Data Source**: [SSDSE @National Statistics Center](https://www.nstac.go.jp/use/literacy/ssdse/)

#### Prefecture-level Average Temperature Trends (2005–2022, 18 Years)
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-b-weather-temperature)
- **File**: `ssdse-b-weather-temperature.csv`
- **Format**:
  ```
  Year,Prefecture,Municipality,Precipitation,Precipitation Days,Unused1,Unused2,Unused3,Average Temperature,Max Temperature,Min Temperature
  ```
- **Description**: Time series of meteorological data by prefecture. Includes annual average temperature, max/min temperature, precipitation, precipitation days
- **Use Case**: Filter by year × prefecture to instantly compare regional climate trends and annual temperature/precipitation variation. Useful for agricultural policy and disaster prevention planning.
- **How to use analysis results**:
  - Use regional variation in temperature and precipitation to assess agricultural and disaster risk and to prioritize insurance and stockpiling.
  - Identify conditions similar to past extreme weather to prioritize response when similar situations recur.
- **Data Source**: [SSDSE @National Statistics Center](https://www.nstac.go.jp/use/literacy/ssdse/)

#### Municipality-level Gender/Age Population (2020)
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-a-population)
- **File**: `ssdse-a-population.csv`
- **Format**:
  ```
  Year,Prefecture,Municipality,Sex,Age,Unused1,Unused2,Unused3,Population
  ```
- **Description**: Gender and age-group population by municipality (2020 Census). Includes finer regional population composition
- **Use Case**: Filter by municipality × gender × age to instantly grasp block-level population composition and aging reality. Useful for municipal welfare planning and trade area analysis.
- **How to use analysis results**:
  - Use municipality- and age-group population composition to prioritize welfare and childcare and to design trade areas and store targeting.
  - Identify municipalities with high aging rates to prioritize medical and care facilities and senior-oriented business location.
- **Data Source**: [SSDSE @National Statistics Center](https://www.nstac.go.jp/use/literacy/ssdse/)

#### Municipality-level Population and Facilities (2022)
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-a-building)
- **File**: `ssdse-a-building.csv`
- **Format**:
  ```
  Year,Prefecture,Municipality,Births,Total Population,Unused1,Population Density,Total Population,Hospitals,Clinics,Dental Clinics,Nurseries,Kindergartens,Elementary Schools,Junior High Schools,High Schools,etc.
  ```
- **Description**: Cross-section of population and medical/commercial facilities by municipality. Includes hospitals, schools, retail stores, physicians
- **Use Case**: Filter by municipality × facility type to instantly compare regional medical/commercial access and facilities per capita. Useful for store opening consideration and regional diagnosis.
- **How to use analysis results**:
  - Identify municipalities and facility types with low facilities per capita to select store locations and administrative planning priorities.
  - Identify areas with weak medical or commercial access to consider gap strategies and public service reinforcement.
- **Data Source**: [SSDSE @National Statistics Center](https://www.nstac.go.jp/use/literacy/ssdse/)

#### Municipality-level Private Establishments (2021)
- [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ssdse-a-office)
- **File**: `ssdse-a-office.csv`
- **Format**:
  ```
  Year,Prefecture,Municipality,Agriculture/Forestry,Total Population,Unused1,Services,Unused3,Total Population,Fisheries,Mining,Construction,Manufacturing,Electricity/Gas,etc.
  ```
- **Description**: Industry-specific private establishment count by municipality. Includes agriculture, construction, manufacturing, retail, medical/welfare
- **Use Case**: Filter by municipality × industry type to instantly grasp regional industry structure and establishment density. Useful for company location consideration and regional economic analysis.
- **How to use analysis results**:
  - Identify municipality × industry combinations where establishments concentrate or are absent to select location candidates and assess competitor/supplier distribution.
  - Use regional industry structure bias to set priority industries for municipal promotion and to inform company expansion or exit decisions.
- **Data Source**: [SSDSE @National Statistics Center](https://www.nstac.go.jp/use/literacy/ssdse/)

#### Prefecture-level Age Population Trends (1960–2025,65 Years) *Separate App
- [📊Chart](https://sakanaclub.xsrv.jp/prefecture-population-dc/?data=population.csv)
- **File**:,construction,manufacturing,retail`population.csv`
- **Description**: Long-term time series of age-group population by prefecture (approximately 65 years). Displayed in [prefecture-population-dc](https://sakanaclub.xsrv.jp/prefecture-population-dc/) app
- **Use Case**: Filter by prefecture × age × period to grasp long-term population structure changes from postwar to present. Suitable for population statistics education and research.
- **How to use analysis results**:
  - Use prefecture- and age-group long-term trends to assess regional demographic change and to validate assumptions and prioritize adaptation in projections.
  - Reference past periods with similar population structure to anticipate future changes in labor force and social security demand.
- **Data Source**: Census, etc.

### 18. 🎬Movie Data

#### 🎬Studio Ghibli Theatrical Films
- **File**: `ja-movie-ghibli-films.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-movie-ghibli-films)
  - **Format**:
    ```
    Release Date,Director,Title,Gender,Runtime,Rating,Screenwriter,Unused,Box Office,Production,Distributor,Audience (10k)
    ```
  - **Description**: 24 feature films from Studio Ghibli. Analyze by release year, director, box office revenue (100M yen), audience (10k), and runtime. Row chart thumbnails use [ghibli.jp/images](https://www.ghibli.jp/images/) via `@pathColExt`.
  - **Use Case**: Filter by director × release year × box office to compare hit trends and signature works by director.
  - **How to use analysis results**:
    - Track box office trends across Hayao Miyazaki's directorial works.
    - Compare runtime vs. box office performance.
    - Identify hits by balancing audience and revenue.
  - **Data Source**: [Studio Ghibli@Wikipedia (JA)](https://ja.wikipedia.org/wiki/%E3%82%B9%E3%82%BF%E3%82%B8%E3%82%AA%E3%82%B8%E3%83%96%E3%83%AA), [Works@Ghibli.jp](https://www.ghibli.jp/works/)

#### 🎬Top 200 Japanese Box Office Films (All-Time)
- **File**: `ja-movie-top200.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-movie-top200)
  - **Format**:
    ```
    Release Date,Country,Title,Rank,Unused1,Type,Distributor,Unused2,Box Office Revenue,Distributor Revenue
    ```
  - **Description**: Top 200 films from Wikipedia's combined all-time Japanese box office ranking. Analyze by box office revenue (100M yen), rank, country of production, type (anime/live-action), distributor, and release year.
  - **Use Case**: Filter by country × type × release year × distributor to grasp hit trends in the Japanese market.
  - **How to use analysis results**:
    - Compare domestic vs. foreign and anime vs. live-action ratios among top-grossing titles.
    - Track box office distribution by release year to identify market expansion periods.
    - Analyze hit share by distributor.
  - **Data Source**: [List of highest-grossing films in Japan@Wikipedia (JA)](https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E6%AD%B4%E4%BB%A3%E8%88%88%E8%A1%8C%E6%88%90%E7%B8%BE%E4%B8%8A%E4%BD%8D%E3%81%AE%E6%98%A0%E7%94%BB%E4%B8%80%E8%A6%A7)

### 18-2. 🎵Music Data

#### 🎵Japanese Hit Song Rankings
- **File**: `ja-song-hit.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-song-hit)
  - **Format**:
    ```
    Year,Rank,Unused1,Type,Artist,Song,Decade,Unused3,Sales (10k units),Drama Theme Song,Summer Song,Love Song,Wedding Song,Graduation Song,Cheer Song
    ```
  - **Description**: Japanese hit song rankings from Nendai-Ryuukou (1950–2025, 1,346 songs). Ranks 1–10 per year for 1950–2000; ranks 1–50 per year from 2010 onward. Analyze by year, rank, artist, song, decade (10-year buckets), sales (10k units), drama theme song, and specialty lists (summer/love/wedding/graduation/cheer). Specialty columns show `YES` when matched (blank otherwise). Commas in song titles are replaced with periods for CSV safety.
  - **Use Case**: Filter by year × artist × rank × sales × drama/specialty tags to track hit music trends and tie-in song patterns.
  - **How to use analysis results**:
    - Compare top-selling songs by decade to see shifts in hit trends (idol, R&B, etc.).
    - Analyze hit share by artist.
    - Use the year filter to follow each year's #1 song over time.
    - Cross-check drama theme songs and specialty lists (summer, graduation, etc.) against hit chart entries.
  - **Data Source**:
    - [Japanese Hit Song Rankings@Nendai-Ryuukou](https://nendai-ryuukou.com/song.html)
    - [Drama Theme Song CD Sales Ranking@Nendai-Ryuukou](https://nendai-ryuukou.com/article/023.html)
    - [Summer Song Ranking@Nendai-Ryuukou](https://nendai-ryuukou.com/article/075.html)
    - [Love Song Ranking@Nendai-Ryuukou](https://nendai-ryuukou.com/article/080.html)
    - [Wedding Song@Nendai-Ryuukou](https://nendai-ryuukou.com/article/148.html)
    - [Graduation Song Ranking@Nendai-Ryuukou](https://nendai-ryuukou.com/article/084.html)
    - [Cheer Song Ranking@Nendai-Ryuukou](https://nendai-ryuukou.com/article/151.html)

### 19. Test Data

#### Basic Test Data

- **Beverage Evaluation Data**: `test-drink.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-drink)
  - **Format**:
    ```
    Date,Prefecture,Product Name,Gender,Age,Rating,Occupation,Unused,Sales Volume,Maker/Category,Maker,❄️Cool/🔥Hot,Category
    ```
  - **Description**: Beverage product evaluation and sales data. Includes date, evaluator information (gender, age, occupation), product name, rating (⭐1–⭐5, 5-level), sales volume, plus maker, category (mineral water, tea, carbonated, energy drink, etc.), and cool/hot type
  - **Use Case**: Filter by maker × category × cool/hot × rating × region to instantly grasp target segment preferences and popular product and sales volume trends. Useful for product development and marketers when considering sales strategy and product lineup.
  - **How to use analysis results**:
    - Use rating and sales volume gaps by maker, category, and cool/hot to consider product improvement and new product or line expansion.
    - Use region × attribute combinations with high ratings or sales to decide area-specific assortment and promotion focus.
    - Use products and categories with stable high ratings and sales as standard candidates and shelf priority.
  - **Data Source**: Sample data

- **Lunch Purchase Data**: `test-lunch.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-lunch)
  - **Format**:
    ```
    Number of Buyers,Prefecture,Store,Gender,Age,Product Name,Occupation,Unused,Count
    ```
  - **Description**: Lunch product purchase data including buyer information (gender, age, occupation), product name, store, and prefecture
  - **Use Case**: Filter by product × store × buyer attributes to instantly grasp store-specific popular menus and target segment preferences. Useful for restaurant menu revision and store opening consideration.
  - **How to use analysis results**:
    - Use popular product × store combinations by attribute to decide menu improvements and target-specific lineup.
    - Use stable high-sales store × product combinations as standard menu and location selection criteria for new stores.
  - **Data Source**: Sample data

#### Education Field Test Data

- **University Entrance Data**: `test-university-entrance.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-university-entrance)
  - **Format**:
    ```csv
    Date,Prefecture,Municipality,Gender,Age,Department,Application Type,Unused,Applicants,Deviation Value,Accepted,Exam Count,Public/Private,Tuition```
- **Description**: University entrance examination data including basic student information, department, applicants, deviation value, accepted, exam count, and tuition
  - **Use Case**: Filter by department × application type × region to instantly grasp applicant trends and admission difficulty. Useful for career guidance and universities for admission strategy.
  - **How to use analysis results**:
    - Use department × application type trends in applicants and accepted students to inform guidance and university recruitment and exam design.
    - Use regional differences in difficulty and popularity to select priority outreach regions and to support student choice of schools.
  - **Data Source**: Sample data

- **Academic Achievement Test Data**: `test-academic-achievement.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-academic-achievement)
  - **Format**:
    
```csv
    Date,Prefecture,Municipality,Gender,Age,Subject,School Type,Unused,Average Score,School Size,Regional Category,Proficiency Level,Test Takers,National Rank,Deviation Value,Study Hours```
- **Description**: Academic test results data including average scores by subject, school size, regional category, proficiency level, test takers, deviation value, and study hours
  - **Use Case**: Filter by subject × region × school type to identify challenging subjects/regions and consider proficiency-specific guidance. Suitable for education boards and schools judging improvement priorities.
  - **How to use analysis results**:
    - Identify subject × region × proficiency combinations where challenges concentrate to set priority subjects and regions and resource allocation.
    - Use the relationship between average score and study hours to replicate effective instruction patterns and to decide whether to continue or revise initiatives.
  - **Data Source**: Sample data

#### Transportation and Mobility Field Test Data

- **Traffic Accident Data**: `test-traffic-accident.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-traffic-accident)
  - **Format**:
    
```csv
    Date/Time,Prefecture,Municipality,Gender,Age,Accident Type,Occupation,Unused,Count,Weather,Road Type,Vehicle Type,Time Period,Injuries```
- **Description**: Traffic accident data including accident type, weather, road type, vehicle type, time period, and injuries
  - **Use Case**: Filter by accident type × region × time × weather to instantly identify danger spots and high-risk conditions. Useful for police and municipalities for traffic safety measures and driver awareness.
  - **How to use analysis results**:
    - Identify accident type × region × time × weather combinations where incidents concentrate to prioritize patrols and enforcement and awareness campaigns.
    - Reference risk when similar conditions recur to decide on advance warnings and temporary measures.
  - **Data Source**: Sample data

- **Public Transportation Usage Data**: `test-public-transport.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-public-transport)
  - **Format**:
    
```csv
    Year/Month,Route Name,Station Name,Prefecture,Passengers,Time Period,Day Category,Season,Transportation Mode
    ```
- **Description**: Public transportation usage data allowing analysis by route, time period, day category, and seasonal variation
  - **Use Case**: Filter by route × station × time × day to instantly grasp congestion peaks and quiet sections. Useful for railway companies for schedule improvement and municipalities for transportation policy.
  - **How to use analysis results**:
- Identify routes, stations, and times where congestion concentrates to prioritize schedule and capacity and pricing.
    - Use quiet sections and seasonal variation to consider service reduction or alternative transport in low-demand areas.
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
  - **How to use analysis results**:
    - Use region × property type × price combinations with high transaction activity to select purchase candidates and sales strategy focus.
    - Use price and supply-demand trends to time sale or purchase and to set development or acquisition priorities.
  - **Data Source**: Sample data

- **Housing Construction Statistics**: `test-housing-construction.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-housing-construction)
  - **Format**:
    
```csv
    Year/Month,Prefecture,Structure Type,Building Type,Use Category,Floor Area,Construction Cost,Housing Starts,Household Composition
    ```
- **Description**: Housing construction data for trend analysis of structure type, building type, use category, floor area, construction cost, and housing starts
  - **Use Case**: Filter by region × structure × use × period to instantly grasp housing market demand and building-type trends. Useful for house builders and construction industry for market analysis and business planning.
  - **How to use analysis results**:
    - Identify region × structure × use combinations where housing starts are growing to set product lineup and sales focus.
    - Reference past starts under similar conditions to time capacity and investment allocation.
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
  - **How to use analysis results**:
    - Use age group × occupation × expenditure combinations where spending concentrates to design product and messaging targets and policy focus.
    - Use regional consumption propensity differences to set store and advertising focus and policy priorities.
  - **Data Source**: Sample data

- **E-commerce Data**: `test-ecommerce.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-ecommerce)
  - **Format**:
    
```csv
    Date,Prefecture,Municipality,Gender,Age,Product Category,Occupation,Unused,Purchase Amount,Device Type,Payment Method,Purchase Count,Delivery Method,Satisfaction,Member Rank,Usage Time```
- **Description**: E-commerce purchase data allowing detailed analysis by product category, device type, payment method, and usage time
  - **Use Case**: Filter by product category × device × user attributes × time to instantly grasp purchase patterns and campaign effectiveness. Useful for EC managers for product display and marketing improvement.
  - **How to use analysis results**:
- Use category × device × time combinations where purchases concentrate to optimize display, campaigns, and send timing.
    - Use attribute-based purchase patterns to decide which initiatives to continue or change and to set budget priorities.
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
  - **How to use analysis results**:
- Identify pollutant × region × condition combinations with high concentrations to prioritize regulation, monitoring, and awareness timing.
    - Reference risk when similar weather or season conditions recur to decide on advance measures and public communication.
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
  - **How to use analysis results**:
    - Use job type × industry × region combinations where openings concentrate to set recruitment focus and salary levels.
    - Use age-group supply-demand balance to anticipate hiring difficulty and to prioritize training and retention.
  - **Data Source**: Sample data

#### International and Global Data Field Test Data

- **Global Climate and Environmental Data**: `test-global-climate-environmental.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-global-climate-environmental)
  - **Format**:
    
```csv
Date,Country Name,Continent,Average Temperature Change(℃),Forest Coverage(%),CO2 Emissions(tons/person),Unused,Renewable Energy Ratio,Count,Renewable Energy Ratio(%),Water Resources,Air Pollution Index(PM2.5),Environmental Policy Score,Energy Consumption,Sea Level Rise Impact(mm/year)
    ```
- **Description**: Global environmental and climate change data allowing multifaceted analysis of CO2 emissions, renewable energy ratio, forest coverage, air pollution index, etc.
  - **Use Case**: Filter by country × continent × environmental indicator to instantly grasp international comparison and SDGs progress. Useful for environmental policy staff and NGOs judging international cooperation priority regions.
  - **How to use analysis results**:
    - Identify countries or regions with notable improvement or deterioration by indicator to select aid priorities and technology transfer focus.
    - Compare policies across countries with similar levels to identify success patterns and inform policy recommendations.
  - **Data Source**: Sample data

- **Global Education and Human Development Data**: `test-global-education-human-development.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-global-education-human-development)
  - **Format**:
    
```csv
    Year,Gender,Age,Country/Region,Continent,Economic Level,Political System,Unused,Literacy Rate,University Enrollment Rate,R&D Expenditure Rate,Patent Applications,Education Budget Rate,Average Education Years,Digital Literacy Rate,Innovation Index
    ```
- **Description**: Global education and human development indicator data allowing international comparative analysis of literacy, university enrollment, R&D, patent applications, innovation index
  - **Use Case**: Filter by country × economic level × education indicator to instantly grasp international education gaps and investment effectiveness. Useful for ODA staff and education researchers for support country selection and policy recommendations.
  - **How to use analysis results**:
    - Identify countries or regions with large gaps by economic level × education indicator to select ODA and scholarship priorities.
    - Use conditions in improving countries to inform policy recommendations for similar countries.
  - **Data Source**: Sample data

- **Global Health and Medical Systems Data**: `test-global-health-medical-systems.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-global-health-medical-systems)
  - **Format**:
    
```csv
    Year,Gender,Age,Country/Region,Continent,Income Group,Healthcare System Type,Unused,Life Expectancy,Infant Mortality Rate,Healthcare Expenditure Rate,Physician Rate,Hospital Bed Rate,Vaccination Rate,Infectious Disease Rate,Healthcare Access Index
    ```
  - **Description**: Global health and medical system data allowing international comparative analysis of life expectancy, healthcare expenditure, physicians, hospital beds, vaccination rates
  - **Use Case**: Filter by country × income group × medical indicator to instantly grasp healthcare access gaps and system effectiveness. Useful for international health organizations and development aid staff judging priority support regions.
  - **How to use analysis results**:
    - Identify countries with large gaps by income group × medical indicator to select funding and capacity-building priorities.
    - Reference policies in improving countries to inform recommendations and technical cooperation for others.
  - **Data Source**: Sample data

#### Other Field Test Data

- **Crime Statistics Data**: `test-crime-statistics.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-crime-statistics)
  - **Description**: Crime occurrence statistics allowing analysis by crime type, time period, and region
  - **Use Case**: Filter by crime type × region × time to instantly grasp danger spots and occurrence patterns. Useful for police and municipalities for crime prevention measures and resident safety awareness.
  - **How to use analysis results**:
    - Identify crime type × region × time combinations where incidents concentrate to prioritize patrols and surveillance placement.
    - Reference past periods when incidents increased under similar conditions to decide on awareness and temporary measures.
  - **Data Source**: Sample data

- **Internet Usage Data**: `test-internet-usage.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-internet-usage)
  - **Description**: Internet usage data allowing analysis by age group, purpose, and device type
  - **Use Case**: Filter by age group × purpose × device to instantly grasp generation-specific usage and service improvement hints. Useful for digital marketers and service planners for user understanding.
  - **How to use analysis results**:
    - Use age group × purpose × device combinations where usage concentrates to prioritize UI and feature improvements and targeting.
    - Use generation-specific usage gaps to revise outreach and to decide whether to continue or change service direction.
  - **Data Source**: Sample data

- **Investment Trust Data**: `test-investment-trust.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-investment-trust)
  - **Description**: Investment trust management data allowing analysis by fund type, investment region, and risk category
  - **Use Case**: Filter by fund type × investment region × risk to instantly grasp performance trends and diversification candidates. Useful for individual investors for portfolio design and financial planners for proposals.
  - **How to use analysis results**:
    - Use type × region × risk combinations with stable performance as portfolio candidates and recommended products.
    - Identify low-correlation combinations to support diversification and rebalancing decisions.
  - **Data Source**: Sample data

- **Medical Survey Data**: `test-medical-survey.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-medical-survey)
  - **Description**: Medical survey data allowing analysis by department, age group, and region
  - **Use Case**: Filter by department × region × age group to instantly grasp medical need distribution and underserved areas. Useful for hospital department placement and municipal healthcare planning.
  - **How to use analysis results**:
    - Identify department × region × age combinations where need concentrates to prioritize hospital capacity and regional healthcare.
    - Use low-utilization regions or departments to set access improvement and outreach priorities.
  - **Data Source**: Sample data

- **Movie Box Office Data**: `test-movie-box-office.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-movie-box-office)
  - **Description**: Movie box office performance data allowing analysis by genre, screening period, and audience numbers
  - **Use Case**: Filter by genre × screening period × box office to instantly grasp hit trends and distribution patterns. Useful for film distributors for release strategy and theaters for programming.
  - **How to use analysis results**:
    - Use genre × screening period combinations that drive attendance to set release schedule and theater programming.
    - Reference past hit patterns under similar conditions to plan marketing spend and screen counts for future releases.
  - **Data Source**: Sample data

- **Museum Visitor Data**: `test-museum-visitor.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-museum-visitor)
  - **Description**: Museum and gallery visitor data allowing analysis by facility type, exhibition content, and age group
  - **Use Case**: Filter by facility type × exhibition content × age group to instantly grasp visitor segments and popular exhibition trends. Useful for curators for planning and municipalities for cultural facility improvement.
  - **How to use analysis results**:
    - Use facility type × exhibition content × age combinations where visits concentrate to design next themes and targeting.
    - Use conditions behind popular exhibitions to replicate similar programs elsewhere and to set budget priorities.
  - **Data Source**: Sample data

- **Patent Application Data**: `test-patent-application.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-patent-application)
  - **Description**: Patent application data allowing analysis by technology field, applicant type, and region
  - **Use Case**: Filter by technology field × applicant type × region to instantly grasp technology trends and competitor filing trends. Useful for corporate R&D and IP departments for technology strategy.
  - **How to use analysis results**:
    - Use technology field × applicant type combinations where filings concentrate to set R&D focus and filing strategy.
    - Use competitor filing trends to prioritize licensing and infringement review and to inform entry or exit decisions.
  - **Data Source**: Sample data

- **Retail Survey Data**: `test-retail-survey.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-retail-survey)
  - **Description**: Retail industry survey data allowing analysis by business format, location, and sales trends
  - **Use Case**: Filter by format × location × period to instantly grasp sales trends and success factors. Useful for retailers for store opening consideration and trading companies for supplier selection.
  - **How to use analysis results**:
    - Identify format × location combinations where sales are growing to select store locations and format.
    - Reference past trends under similar conditions to time expansion or contraction and to set investment priorities.
  - **Data Source**: Sample data

- **International Trade Data**: `test-international-trade.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-international-trade)
  - **Description**: International trade statistics allowing analysis by product, partner country, and import/export trends
  - **Use Case**: Filter by product × partner country × import/export to instantly grasp trade structure changes and supply/demand by country. Useful for trading companies for product selection and economic analysts for market analysis.
  - **How to use analysis results**:
    - Use product × partner country combinations where trade concentrates to select products and routes and to assess diversification.
    - Use trade structure change trends to time market entry or exit and to inform strategy.
  - **Data Source**: Sample data

- **Foreign Visitor Consumption Data**: `test-foreign-visitor-consumption.csv`
  - [📊Chart](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-foreign-visitor-consumption)
  - **Description**: Foreign visitor consumption behavior data allowing analysis by nationality, expenditure category, and region
  - **Use Case**: Filter by nationality × expenditure × region to instantly grasp target country preferences and best-sellers. Useful for tourist area souvenir shops and duty-free stores for product lineup and promotion strategy.
  - **How to use analysis results**:
    - Use nationality × expenditure × region combinations where consumption concentrates to set product lineup, display, and promotion focus.
    - Use target-country best-sellers to plan inventory and assortment for the next inbound recovery phase.
  - **Data Source**: Sample data

*Each test dataset is created as a sample for multidimensional chart analysis using DC.js and can be utilized for learning and verification of actual data analysis methods and visualization techniques.

## Usage

1. Use CSV files as base data and define display settings in corresponding `.options.json` files
2. Load data using the `DcChart.vue` component to display multidimensional charts
3. Use the `FileSelectMenu.vue` component to select data files
