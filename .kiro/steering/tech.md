# Technology Stack

## Architecture

**SPA (Single Page Application)** アーキテクチャを採用。Laravel をバックエンド API サーバーとして、Inertia.js を介して Vue 3 フロントエンドと統合。サーバーサイドレンダリングの利点を保ちながら、SPA 体験を提供。

## Core Technologies

- **Backend Language**: PHP 8.2+
- **Backend Framework**: Laravel 12
- **Frontend Framework**: Vue 3 (Composition API)
- **Type System**: TypeScript (strict mode)
- **Build Tool**: Vite 7
- **Runtime**: Node.js (Vite 開発サーバー)

## Key Libraries

### Backend
- **Inertia.js**: Laravel と Vue の統合、サーバーサイドルーティング
- **Laravel Jetstream**: 認証・認可・チーム管理
- **Laravel Sanctum**: API 認証
- **Lighthouse**: GraphQL 実装
- **Ziggy**: ルートヘルパーの JavaScript 化

### Frontend
- **Vue Apollo Composable**: GraphQL クライアント統合
- **Dc.js**: 多次元データ可視化チャート
- **D3.js**: データ可視化基盤
- **Crossfilter**: 多次元データフィルタリング
- **Element Plus**: 主要 UI コンポーネントライブラリ
- **Vuetify**: 補助的な UI コンポーネント
- **Tailwind CSS**: ユーティリティファースト CSS フレームワーク
- **VueUse**: 再利用可能な Composables コレクション

### Data Visualization
- **Dc.js**: インタラクティブなダッシュボードチャート
- **D3.js**: 低レベルデータ可視化
- **Crossfilter**: 高速多次元フィルタリング

## Development Standards

### Type Safety
- **TypeScript strict mode**: 有効化
- **型定義ファイル**: `resources/js/Types/types-*.d.ts` に共通型を定義
- **Props/Emits**: すべて TypeScript で型定義
- **GraphQL 型生成**: GraphQL Code Generator による型自動生成

### Code Quality
- **ESLint**: Vue 3 + TypeScript ルール
- **Prettier**: コードフォーマット（セミコロンなし、シングルクォート）
- **PHP CS Fixer**: PHP コードスタイル統一
- **PHPStan**: 静的解析（レベル 8 対応）

### Testing
- **Backend**: Pest PHP（Laravel 統合）
- **Frontend Unit**: Vitest
- **Frontend E2E**: Playwright
- **Component Testing**: Storybook 10

## Development Environment

### Required Tools
- PHP 8.2+
- Composer
- Node.js (pnpm 推奨)
- MariaDB (開発環境)

### Common Commands
```bash
# 開発サーバー起動（全サービス）
composer run dev

# バックエンドのみ
php artisan serve

# フロントエンドのみ
pnpm run dev

# テスト実行
composer test          # バックエンド
pnpm test              # フロントエンド
pnpm test:e2e          # E2E テスト

# コード品質チェック
composer cs-check      # PHP
pnpm lint              # JavaScript/TypeScript
pnpm type-check        # TypeScript 型チェック
```

## Key Technical Decisions

1. **Inertia.js 採用**: サーバーサイドルーティングと SPA 体験の両立
2. **TypeScript 必須**: 型安全性による開発効率向上とバグ削減
3. **Composition API**: Vue 3 の Composition API を必須使用（Options API 禁止）
4. **Element Plus 優先**: UI コンポーネントは Element Plus を優先、不足時のみ Vuetify
5. **GraphQL + RESTful**: 用途に応じて API 形式を選択可能
6. **Dc.js 統合**: 多次元データ可視化のための Dc.js を中核技術として採用
7. **Composables 分離**: ビジネスロジックは Composables に分離、コンポーネントは UI に集中
8. **レスポンシブ設計**: モバイルファースト、SP 版（1カラム）と PC 版（3カラム）の2デザインタイプ

---
_Document standards and patterns, not every dependency_
