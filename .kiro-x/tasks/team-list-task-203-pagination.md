# TASK-203: ページネーション機能実装

## タスク概要

チーム一覧画面にページネーション機能を実装し、大量のチームデータを効率的に表示できるようにします。

## 依存関係

- **TASK-101**: バックエンドAPI実装 (完了)
- **TASK-102**: TypeScript型定義 (完了)
- **TASK-104**: 基本UI実装 (完了)
- **TASK-201**: 詳細チームカード (完了)
- **TASK-202**: フィルタリング・検索機能 (完了)

## 実装要件

### 1. バックエンド実装（Laravel）

#### 1.1 TeamController.php の修正

- `index`メソッドでページネーション機能を追加
- Laravel標準の`paginate()`メソッドを使用
- フィルタリング・検索条件を維持したままページネーション
- ページネーション情報をフロントエンドに返却

**実装内容：**

```php
// TeamController::index() メソッドの修正
$teams = $query->paginate(
    $request->get('per_page', 12), // デフォルト12件/ページ
    ['*'],
    'page',
    $request->get('page', 1)
);

return Inertia::render('Teams/Index', [
    'teams' => $teams->items(),
    'pagination' => [
        'current_page' => $teams->currentPage(),
        'last_page' => $teams->lastPage(),
        'per_page' => $teams->perPage(),
        'total' => $teams->total(),
        'from' => $teams->firstItem(),
        'to' => $teams->lastItem(),
        'links' => $teams->linkCollection(),
    ],
    // ... その他のデータ
]);
```

#### 1.2 バリデーション追加

- `per_page` パラメータ: 6,12,24,48 の値のみ許可
- `page` パラメータ: 正の整数のみ許可

### 2. TypeScript型定義追加

#### 2.1 PaginationMeta型の追加

```typescript
// resources/js/Types/types-team.d.ts に追加
export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
  links: PaginationLink[]
}

export interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

export interface TeamsIndexProps {
  teams: Team[]
  pagination: PaginationMeta
  filters: TeamFilters
  stats: TeamStats
  jetstream: JetstreamProps
}
```

### 3. フロントエンド実装（Vue3）

#### 3.1 ページネーションコンポーネント作成

**ファイル:** `resources/js/Components/Teams/TeamPagination.vue`

**機能要件：**

- Element Plus `ElPagination` コンポーネントを使用
- ページ番号表示・移動機能
- 件数選択機能（6, 12, 24, 48件/ページ）
- 前/次ページナビゲーション
- 最初/最後ページへのジャンプ
- アクセシビリティ対応（ARIA属性）
- レスポンシブ対応

#### 3.1.1 結果表示コンポーネント追加

**ファイル:** `resources/js/Components/Teams/TeamResultsInfo.vue`

**機能要件：**

- 検索フォーム下部に配置する結果表示コンポーネント
- 「XX 件中 YY-ZZ 件表示」形式での表示
- フィルタリング状態の表示
- ページネーション情報の統合表示

**Props:**

```typescript
interface Props {
  pagination: PaginationMeta
  loading?: boolean
}

interface Emits {
  pageChanged: [page: number]
  perPageChanged: [perPage: number]
}
```

#### 3.2 Index.vue の修正

**実装内容：**

- `TeamPagination` コンポーネントの統合
- ページネーション状態の管理
- URL パラメータとの同期
- フィルタリング時のページリセット
- ローディング状態の管理
- **結果表示コンポーネントを検索フォーム下部に移動**（「XX 件中 YY-ZZ 件表示」形式）

**追加機能：**

```typescript
// ページネーション関連の状態管理
const currentPage = ref(props.pagination.current_page)
const currentPerPage = ref(props.pagination.per_page)

// ページ変更時の処理
const handlePageChange = (page: number) => {
  router.visit(route('teams.index'), {
    data: {
      ...currentFilters.value,
      page,
      per_page: currentPerPage.value,
    },
    preserveState: true,
    preserveScroll: true,
  })
}

// 件数変更時の処理（ページを1にリセット）
const handlePerPageChange = (perPage: number) => {
  router.visit(route('teams.index'), {
    data: {
      ...currentFilters.value,
      page: 1,
      per_page: perPage,
    },
    preserveState: true,
  })
}
```

#### 3.3 UI配置・デザイン

- ページネーションをチーム一覧の下部に配置
- **結果表示情報を検索フォームの下部に移動**（現在画面下部にある「XX チーム表示中」を上部に配置）
- デスクトップ: フル機能表示
- モバイル: シンプル表示（前/次ボタンとページ情報のみ）
- ダークモード対応

### 4. UXの改善

#### 4.1 パフォーマンス最適化

- `preserveScroll: true` でスクロール位置維持
- `preserveState: true` でコンポーネント状態維持
- ローディングインジケーター表示

#### 4.2 URL同期

- ページ番号・件数をURLパラメータに反映
- ブラウザの戻る/進むボタン対応
- 直リンクでのページアクセス対応

#### 4.3 フィルタリングとの連携

- フィルター変更時は自動的にページ1にリセット
- 検索・フィルター条件を維持したままページネーション
- アクティブフィルター表示にページ情報も含める

### 5. エラーハンドリング

#### 5.1 存在しないページへのアクセス

- 範囲外ページアクセス時は最後のページにリダイレクト
- 適切なエラーメッセージ表示

#### 5.2 データ読み込みエラー

- 通信エラー時のフォールバック表示
- リトライ機能の提供

## 実装順序

1. **Backend**: TeamController.php の修正とバリデーション追加
2. **Types**: TypeScript型定義の追加
3. **Components**: TeamPagination.vue + TeamResultsInfo.vue コンポーネント作成
4. **Integration**: Index.vue への統合とテスト（結果表示を検索フォーム下部に配置）
5. **Testing**: 基本機能テストの実装

## テスト要件

### 5.1 バックエンドテスト（Pest PHP）

**ファイル:** `tests/Feature/TeamControllerPaginationTest.php`

**テスト項目：**

- ページネーション基本機能
- フィルタリング + ページネーション
- 無効なパラメータのバリデーション
- 範囲外ページアクセス

### 5.2 フロントエンドテスト（Vitest）

**ファイル:** `resources/js/Components/Teams/__tests__/TeamPagination.test.ts`

**テスト項目：**

- コンポーネントレンダリング
- ページ変更イベント
- 件数変更イベント
- プロップス処理

## 成功基準

1. ✅ 12件/ページでのデフォルト表示
2. ✅ ページ番号クリックでの正常なページ移動
3. ✅ 件数変更（6, 12, 24, 48）の正常動作
4. ✅ フィルタリング + ページネーションの連携
5. ✅ URLパラメータとの同期
6. ✅ レスポンシブ対応
7. ✅ アクセシビリティ対応
8. ✅ ローディング状態の適切な表示

## 参考情報

### Laravel ページネーション

- [Laravel公式ドキュメント](https://laravel.com/docs/11.x/pagination)
- Inertia.js との連携方法

### Element Plus Pagination

- [ElPagination公式ドキュメント](https://element-plus.org/en-US/component/pagination.html)
- カスタマイズオプション

### Inertia.js

- ページネーションでの `preserveState` / `preserveScroll` 使用法
- URL同期のベストプラクティス
