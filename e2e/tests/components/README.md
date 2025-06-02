# ElTextQueryInput Component E2E Tests

このディレクトリには、StorybookベースのElTextQueryInputコンポーネントのE2Eテストが含まれています。

## 前提条件

1. Node.js と pnpm がインストールされていること
2. 依存関係がインストールされていること (`pnpm install`)
3. StorybookとPlaywrightの設定が完了していること

## テストの実行

### 1. Storybookの起動

まず、Storybookを起動します：

```bash
pnpm run storybook
```

Storybookは `http://localhost:6006` で起動します。

### 2. E2Eテストの実行

#### UIモードでテスト実行（推奨）

```bash
# プロジェクトルートから
pnpm run test:e2e:storybook:ui

# または e2e ディレクトリから直接
cd e2e
npx playwright test --project=storybook-chromium --ui
```

#### ヘッドレスモードでテスト実行

```bash
# プロジェクトルートから
pnpm run test:e2e:storybook

# または e2e ディレクトリから直接
cd e2e
npx playwright test --project=storybook-chromium
```

#### デバッグモード

```bash
# プロジェクトルートから
pnpm run test:e2e:storybook:debug

# または e2e ディレクトリから直接
cd e2e
npx playwright test --project=storybook-chromium --debug
```

## テストファイル構成

```text
e2e/tests/components/
├── ElTextQueryInput.spec.ts     # ElTextQueryInputコンポーネントのE2Eテスト
├── el-text-query-input-page.ts     # Page Object Model
└── README.md                       # このファイル
```

## テストの内容

### テストするStorybook Stories

1. **Default** - 基本的な入力機能
2. **WithTokens** - 既存トークンの表示と操作
3. **WithStringTokens** - 文字列トークンの機能
4. **FullExample** - 全機能の統合テスト
5. **Disabled** - 無効状態の動作
6. **CustomPlaceholder** - カスタムプレースホルダー

### テストケース

#### 基本機能

- 初期状態での入力フィールド表示
- 入力フィールドへのフォーカス
- キー入力時のサジェスト表示
- サジェストからの選択

#### トークン操作

- 既存トークンの表示確認
- トークンの削除
- 新しいトークンの追加
- 文字列トークンの追加

#### 特殊入力

- 日付ピッカーの表示と操作
- 無効状態での動作制限

#### キーボード操作

- Backspaceキーでの入力プロセス戻り
- Enterキーでの確定
- タブナビゲーション

#### アクセシビリティ

- キーボードナビゲーション
- スクリーンリーダー対応

## トラブルシューティング

### Storybookが起動しない場合

```bash
# 依存関係を再インストール
pnpm install

# キャッシュをクリア
pnpm run build-storybook
```

### テストが失敗する場合

1. Storybookが `http://localhost:6006` で正常に起動していることを確認
2. ブラウザでStorybookの該当ストーリーが正常に表示されることを確認
3. ネットワークの問題がないことを確認

### テストタイムアウトが発生する場合

`playwright.config.ts` の `timeout` 設定を調整してください。

## 参考資料

- [Storybook Integrations Test with PlayWrite](https://storybook.js.org/docs/writing-tests/integrations/stories-in-end-to-end-tests#with-playwright)
- [Playwright Documentation](https://playwright.dev/)
- [Element Plus Documentation](https://element-plus.org/)
