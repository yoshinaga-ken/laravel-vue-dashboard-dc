# Product Overview

Laravel + Vue3 + Dc.js を使用した多次元データ可視化ダッシュボードアプリケーション。Dimensional Chart (dc.js) によるインタラクティブなデータ分析機能を提供し、記事管理、ユーザー管理、チーム管理などの基本機能を統合した SPA アプリケーションです。

## Core Capabilities

1. **多次元データ可視化ダッシュボード**
   - Dc.js + Crossfilter + D3.js によるインタラクティブなチャート
   - ワンクリックでのフィルタリング・比較機能
   - 時間再生機能による時系列データの可視化
   - Google Maps、Street View、YouTube との統合表示

2. **コンテンツ管理**
   - 記事の CRUD 操作
   - タグ付け機能
   - いいね/よくないね機能
   - RESTful API と GraphQL API の両対応

3. **ユーザー・チーム管理**
   - Laravel Jetstream による認証・認可
   - ユーザーフォロー/アンフォロー機能
   - チーム作成・管理・招待機能
   - 二要素認証対応

4. **データ分析基盤**
   - 記事のいいね数分析
   - ユーザー行動分析
   - ダッシュボード用データ生成機能

## Target Use Cases

- **データ分析者**: CSV データをアップロードして即座に多次元分析を実行
- **コンテンツ管理者**: 記事の作成・編集・分析
- **チーム管理者**: チーム単位でのコンテンツ管理とユーザー管理
- **開発者**: GraphQL API による柔軟なデータ取得

## Value Proposition

- **即座の可視化**: CSV データをアップロードするだけで、複数のチャートが自動生成され、インタラクティブにフィルタリング可能
- **多次元分析**: ワンクリックで複数の次元を同時に分析・比較できる
- **モダンな技術スタック**: Laravel 12 + Vue 3 + TypeScript による型安全な開発体験
- **柔軟な API**: RESTful API と GraphQL API の両方を提供し、用途に応じて選択可能

---
_Focus on patterns and purpose, not exhaustive feature lists_
