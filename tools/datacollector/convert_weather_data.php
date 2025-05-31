<?php
/**
 * 気象庁の過去の気象データCSVを処理して、DcChartコンポーネント用の形式に変換するスクリプト
 *
 * 使用方法:
 * php convert_weather_data.php [入力ファイル] -o [出力ファイル] -p [都道府県] -c [市区町村] -H [ヘッダー書き込み]
 *
 * オプション:
 * -h, --help         ヘルプメッセージを表示
 * -o, --output       出力ファイル（省略時は標準出力）
 * -p, --prefecture   都道府県名（デフォルト: 福岡県）
 * -c, --city         市区町村名（デフォルト: 福岡市）
 * -H, --header       ヘッダーを書き込むかどうか（true/false, デフォルト: true）
 */

// ヘルプメッセージ表示関数
function showHelp() {
    echo "使用方法: php convert_weather_data.php [入力ファイル] [オプション]\n\n";
    echo "オプション:\n";
    echo "  -h, --help         ヘルプメッセージを表示\n";
    echo "  -o, --output       出力ファイル（省略時は標準出力）\n";
    echo "  -p, --prefecture   都道府県名（デフォルト: 福岡県）\n";
    echo "  -c, --city         市区町村名（デフォルト: 福岡市）\n";
    echo "  -H, --header       ヘッダーを書き込むかどうか（true/false, デフォルト: true）\n";
    echo "\n例:\n";
    echo "  php convert_weather_data.php s47807.csv -o output.csv -p \"福岡県\" -c \"福岡市\" -H true\n";
    echo "  php convert_weather_data.php s47807.csv -p \"福岡県\" -c \"福岡市\" > output.csv\n";
    exit(0);
}

// デフォルト値
$inputFile = __DIR__ . '/s47807.csv';
$outputFile = null;
$prefecture = '福岡県';
$city = '福岡市';
$writeHeader = true;

// 引数の解析
$args = $argv;
array_shift($args); // スクリプト名を除去

// 入力ファイルが最初の引数として指定されている場合に処理
if (!empty($args) && !preg_match('/^-/', $args[0])) {
    $inputFile = array_shift($args);
}

// オプション引数の解析
$i = 0;
while ($i < count($args)) {
    switch ($args[$i]) {
        case '-h':
        case '--help':
            showHelp();
            break;
        case '-o':
        case '--output':
            if (isset($args[$i + 1]) && !preg_match('/^-/', $args[$i + 1])) {
                $outputFile = $args[$i + 1];
                $i++;
            }
            break;
        case '-p':
        case '--prefecture':
            if (isset($args[$i + 1]) && !preg_match('/^-/', $args[$i + 1])) {
                $prefecture = $args[$i + 1];
                $i++;
            }
            break;
        case '-c':
        case '--city':
            if (isset($args[$i + 1]) && !preg_match('/^-/', $args[$i + 1])) {
                $city = $args[$i + 1];
                $i++;
            }
            break;
        case '-H':
        case '--header':
            if (isset($args[$i + 1]) && !preg_match('/^-/', $args[$i + 1])) {
                $writeHeader = strtolower($args[$i + 1]) !== 'false';
                $i++;
            }
            break;
    }
    $i++;
}

// 入力ファイルの絶対パスを確保
if (!file_exists($inputFile) && file_exists(__DIR__ . '/' . $inputFile)) {
    $inputFile = __DIR__ . '/' . $inputFile;
}

// CSVヘッダーの定義
$outputHeader = [
    '☔降水量の合計(mm)',    // 中身は日付(YYYY-MM) 表示は降水量(dateChartのcaption)
    '🌡️平均気温(℃)',        // 平均気温
    '💨平均風速(m/s)',       // 平均風速
    '🧭最多風向(16方位)',    // 最多風向（矢印系絵文字に変更）
    '🏢都道府県',           // 都道府県
    '🏙️市区町村',           // 市区町村
    '⚪未使用1',            // 未使用（空文字）
    '⚪未使用2',            // 未使用
    '☔降水量の合計(mm):Base', // 降水量の合計(mm)
    '❄️降雪量合計(cm)',      // 降雪量合計
    '💧平均湿度(％)',        // 平均湿度
    '☁️平均雲量(10分比)',    // 平均雲量
    '♨️平均蒸気圧(hPa)',     // 平均蒸気圧
    '🔄平均現地気圧(hPa)',   // 平均現地気圧
    '☀️日照時間(時間)',      // 日照時間
    '🌨️雪日数(日)',         // 雪日数
    '⚡雷日数(日)',         // 雷日数
    '🌫️霧日数(日)'          // 霧日数
];

// ファイルを開く
$file = fopen($inputFile, 'r');
if (!$file) {
    die('ファイルを開けませんでした: ' . $inputFile);
}

// 出力先を準備
if ($outputFile === null) {
    // 標準出力を使用
    $output = fopen('php://stdout', 'w');
} else {
    // ファイルに出力
    $output = fopen($outputFile, 'w');
    if (!$output) {
        die('出力ファイルを作成できませんでした: ' . $outputFile);
    }
}

// ヘッダーを書き込む（コマンドライン引数でオプション化）
if ($writeHeader) {
    fputcsv($output, $outputHeader);
}

// 最初の4行（ヘッダー）を読み込む
$row1 = fgetcsv($file); // 都道府県
$row2 = fgetcsv($file); // 市区町村
$row3 = fgetcsv($file); // 指標
$row4 = fgetcsv($file); // 均質番号

// 各指標のインデックスを特定（新しいフォーマットに対応）
$temp_idx = 1;   // 平均気温のインデックス
$rain_idx = 3;   // 降水量のインデックス
$sun_idx = 5;    // 日照時間のインデックス
$wind_idx = 7;   // 平均風速のインデックス
$dir_idx = 9;    // 最多風向のインデックス
$vapor_idx = 11; // 平均蒸気圧のインデックス
$humid_idx = 13; // 平均湿度のインデックス
$press_idx = 15; // 平均海面気圧のインデックス
$cloud_idx = 17; // 平均雲量のインデックス
$snow_days_idx = 19; // 雪日数のインデックス
$thunder_days_idx = 21; // 雷日数のインデックス
$fog_days_idx = 23; // 霧日数のインデックス
$snow_idx = 25; // 降雪量合計のインデックス
$local_press_idx = 27; // 平均現地気圧のインデックス

// 各行を処理
while (($data = fgetcsv($file)) !== FALSE) {
    // 日付を処理（例：1986年5月 -> 1986-05）
    if (empty($data[0])) continue;

    $dateParts = explode('年', trim($data[0]));
    if (count($dateParts) !== 2) {
        continue; // 無効なフォーマットはスキップ
    }

    $year = $dateParts[0];
    $month = str_replace(['月 ', '月'], '', $dateParts[1]);

    // 月が1桁の場合は0埋め
    if (strlen($month) === 1) {
        $month = '0' . $month;
    }

    $dateFormatted = $year . '-' . $month;

    // 値から均質番号を削除する関数
    $cleanValue = function($value) {
        if ($value === '' || $value === '--' || $value === '///' || $value === null) return '0';

        // 均質番号を削除（カンマがある場合は最初の部分を取得）
        if (strpos($value, ',') !== false) {
            $parts = explode(',', $value);
            $value = trim($parts[0]);
        }

        // 括弧を削除
        $value = str_replace(['(', ')', ']', '['], '', $value);

        return $value;
    };

    // 風向に方向の絵文字を付加する関数
    $addDirectionEmoji = function($direction) {
        if (empty($direction) || $direction === '0') return $direction;

        $emojis = [
            '北北東' => '↗️',
            '東北東' => '➡️',
            '東南東' => '↘️',
            '南南東' => '⬇️',
            '南南西' => '↙️',
            '西南西' => '⬅️',
            '西北西' => '↖️',
            '北北西' => '↖️',
            '北東' => '↗️',
            '南東' => '↘️',
            '南西' => '↙️',
            '北西' => '↖️',
            '北' => '⬆️',
            '東' => '➡️',
            '南' => '⬇️',
            '西' => '⬅️',
        ];

        // 方向名を抽出（含まれている場合）
        foreach ($emojis as $key => $emoji) {
            if (strpos($direction, $key) !== false) {
                return $emoji . $direction;
            }
        }

        return $direction; // マッチする方向が見つからない場合はそのまま返す
    };

    // 都道府県データを処理
    $weatherData = [
        $dateFormatted,                // 降水量（実際は日付(YYYY-MM)を設定）
        $cleanValue($data[$temp_idx]), // 平均気温(℃)
        $cleanValue($data[$wind_idx]), // 平均風速(m/s)
        $addDirectionEmoji($cleanValue($data[$dir_idx])),  // 最多風向(16方位)に絵文字を追加
        $prefecture,                   // 都道府県
        $city,                         // 市区町村
        '',                          //未使用
        '0',                         // 未使用
        $cleanValue($data[$rain_idx]), // 降水量の合計(mm)
        $cleanValue($data[$snow_idx]), // 降雪量合計(cm)
        $cleanValue($data[$humid_idx]), // 平均湿度(％)
        $cleanValue($data[$cloud_idx]), // 平均雲量(10分比)
        $cleanValue($data[$vapor_idx]), // 平均蒸気圧(hPa)
        $cleanValue($data[$local_press_idx]), // 平均現地気圧(hPa)
        $cleanValue($data[$sun_idx]),  // 日照時間(時間)
        $cleanValue($data[$snow_days_idx]), // 雪日数(日)
        $cleanValue($data[$thunder_days_idx]), // 雷日数(日)
        $cleanValue($data[$fog_days_idx]), // 霧日数(日)
    ];

    // データを出力
    fputcsv($output, $weatherData);
}

// ファイルを閉じる
fclose($file);
fclose($output);

if ($outputFile !== null) {
    echo "変換が完了しました。出力ファイル: " . $outputFile . PHP_EOL;
} else {
    // 標準出力の場合はメッセージを出力しない
}
?>
