<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Laravel\Jetstream\Jetstream;

class CreatePersonalAccessToken extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'token:create {--update-env=1 : 環境ファイルにAPI_TOKENを書き込むかどうか(1: 有効, 0: 無効)} {--user= : ユーザー名（デフォルト: TEST_USER_NAME環境変数）}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'テストユーザー用のPersonal Access Tokenを生成し、オプションで環境ファイルに保存';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // オプションの値を取得
        $updateEnv = $this->option('update-env');
        $shouldUpdateEnv = $updateEnv === '1' || $updateEnv === 'true';
        $userName = $this->option('user') ?? env('TEST_USER_NAME', 'test');

        // テストユーザーを取得
        $testUser = User::where('name', $userName)->first();

        if (!$testUser) {
            $this->error("ユーザー「{$userName}」が見つかりません。先にUserSeederを実行してください。");
            return Command::FAILURE;
        }

        // 既存のトークンを削除（重複を避けるため）
        $testUser->tokens()->where('name', 'Test API Token')->delete();

        // APIトークンを作成
        $token = $testUser->createToken(
            'Test API Token',
            Jetstream::validPermissions(['read', 'create', 'update', 'delete'])
        );

        // トークンの値を抽出
        $tokenValue = explode('|', $token->plainTextToken, 2)[1];

        // オプションが有効な場合のみ.envファイルにAPI_TOKENを設定
        if ($shouldUpdateEnv) {
            $this->updateEnvFile('API_TOKEN', $tokenValue);
        } else {
            $this->info('ENV更新をスキップしました（--update-env=0が指定されています）');
        }

        // コンソールに出力
        $this->info('=== Personal Access Token Created ===');
        $this->info('Environment: ' . app()->environment());
        $this->info('User: ' . $testUser->name . ' (' . $testUser->email . ')');
        $this->info('Token Name: Test API Token');
        $this->info('Token Value: ' . $tokenValue);
        $this->info('Permissions: ' . implode(', ', ['read', 'create', 'update', 'delete']));
        $this->info('Update ENV: ' . ($shouldUpdateEnv ? 'YES' : 'NO'));
        $this->info('=====================================');

        return Command::SUCCESS;
    }

    /**
     * .envファイルの値を更新
     *
     * @param string $key
     * @param string $value
     */
    private function updateEnvFile(string $key, string $value): void
    {
        // 現在の環境を取得
        $environment = app()->environment();

        // 環境に応じた.envファイルのパスを決定
        $envFileName = $environment === 'production' ? '.env' : ".env.{$environment}";
        $envPath = base_path($envFileName);

        // .env.{environment}ファイルが存在しない場合は.envファイルを使用
        if (!File::exists($envPath)) {
            $envPath = base_path('.env');
            $envFileName = '.env';
        }

        if (!File::exists($envPath)) {
            $this->error("環境ファイル（{$envFileName}）が見つかりません。");
            return;
        }

        $envContent = File::get($envPath);

        // キーが既に存在するかチェック
        $pattern = "/^{$key}=.*$/m";
        if (preg_match($pattern, $envContent)) {
            // 既存のキーを更新
            $envContent = preg_replace($pattern, "{$key}={$value}", $envContent);
            $this->info("更新: {$envFileName} の {$key} を更新しました");
        } else {
            // 新しいキーを追加
            $envContent .= "\n{$key}={$value}";
            $this->info("追加: {$envFileName} に {$key} を追加しました");
        }

        File::put($envPath, $envContent);
    }
}
