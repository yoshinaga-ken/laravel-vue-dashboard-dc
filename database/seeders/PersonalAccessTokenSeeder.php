<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Laravel\Jetstream\Jetstream;
use Illuminate\Support\Facades\File;
use Illuminate\Console\Command;

class PersonalAccessTokenSeeder extends Seeder
{
    /**
     * 環境ファイルを更新するかどうか（デフォルト: true）
     *
     * @var bool
     */
    protected $shouldUpdateEnv = true;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // テストユーザーを取得
        $testUser = User::where('name', env('TEST_USER_NAME', 'test'))->first();

        if (!$testUser) {
            $this->command->error('テストユーザーが見つかりません。先にUserSeederを実行してください。');
            return;
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
        if ($this->shouldUpdateEnv) {
            $this->updateEnvFile('API_TOKEN', $tokenValue);
        } else {
            $this->command->info('ENV更新をスキップしました（shouldUpdateEnv=falseが設定されています）');
        }

        // コンソールに出力
        $this->command->info('=== Personal Access Token Created ===');
        $this->command->info('Environment: ' . app()->environment());
        $this->command->info('User: ' . $testUser->name . ' (' . $testUser->email . ')');
        $this->command->info('Token Name: Test API Token');
        $this->command->info('Token Value: ' . $tokenValue);
        $this->command->info('Permissions: ' . implode(', ', ['read', 'create', 'update', 'delete']));
        $this->command->info('Update ENV: ' . ($this->shouldUpdateEnv ? 'YES' : 'NO'));
        $this->command->info('=====================================');
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
            $this->command->error("環境ファイル（{$envFileName}）が見つかりません。");
            return;
        }

        $envContent = File::get($envPath);

        // キーが既に存在するかチェック
        $pattern = "/^{$key}=.*$/m";
        if (preg_match($pattern, $envContent)) {
            // 既存のキーを更新
            $envContent = preg_replace($pattern, "{$key}={$value}", $envContent);
            $this->command->info("更新: {$envFileName} の {$key} を更新しました");
        } else {
            // 新しいキーを追加
            $envContent .= "\n{$key}={$value}";
            $this->command->info("追加: {$envFileName} に {$key} を追加しました");
        }

        File::put($envPath, $envContent);
    }
}
