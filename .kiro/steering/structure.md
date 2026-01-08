# Project Structure

## Organization Philosophy

**Laravel 標準構造 + Vue 3 コンポーネント指向**。バックエンドは Laravel の MVC パターンに従い、フロントエンドは機能別にコンポーネントを組織化。Inertia.js による統合により、サーバーサイドルーティングと SPA 体験を両立。

## Directory Patterns

### Backend Structure (`app/`)
**Location**: `/app/`  
**Purpose**: Laravel 標準の MVC 構造に従う  
**Pattern**: 
- `Http/Controllers/`: コントローラー（RESTful API と Inertia.js レスポンス）
- `Models/`: Eloquent モデル（リレーション定義）
- `Actions/`: ビジネスロジック（Jetstream/Fortify アクション）
- `Services/`: サービス層（再利用可能なビジネスロジック）
- `Policies/`: 認可ポリシー
- `GraphQL/`: GraphQL スキーマ・リゾルバー（Lighthouse）

**Example**:
```php
// app/Http/Controllers/ArticleController.php
class ArticleController extends Controller
{
    public function index(IndexArticleRequest $request): Response
    {
        // Inertia.js レスポンス
        return Inertia::render('Articles/Index', [...]);
    }
}
```

### Frontend Pages (`resources/js/Pages/`)
**Location**: `/resources/js/Pages/`  
**Purpose**: Inertia.js ページコンポーネント（ルートに対応）  
**Pattern**: 
- ディレクトリ構造が URL 構造に対応
- `Partials/` サブディレクトリで部分コンポーネントを分離
- ページコンポーネントは主にレイアウトとデータ受け渡しに集中

**Example**:
```
Pages/
  Articles/
    Index.vue          # /articles
    Show.vue           # /articles/{id}
    Partials/
      CreateArticleForm.vue
```

### Reusable Components (`resources/js/Components/`)
**Location**: `/resources/js/Components/`  
**Purpose**: 再利用可能な Vue コンポーネント  
**Pattern**:
- 機能別にサブディレクトリで組織化（`Teams/`, `Users/`）
- 各コンポーネントは `<spec>` ブロックで仕様を記述
- Element Plus コンポーネントを優先使用

**Example**:
```vue
<script lang="ts" setup>
import { ElButton, ElIcon } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
</script>
```

### Composables (`resources/js/Composables/`)
**Location**: `/resources/js/Composables/`  
**Purpose**: 再利用可能な Composition API ロジック  
**Pattern**:
- GraphQL クエリ/ミューテーションは Composables に分離
- ビジネスロジック（フォーム管理、バリデーション等）も Composables 化
- VueUse に既存機能があれば自前実装せず利用

**Example**:
```typescript
// useUserProfile.ts
export const useUserProfile = (userId: string) => {
  const { result, loading, error } = useQuery<GetUserProfileQuery>(...)
  return { user: computed(() => result.value?.user), loading, error }
}
```

### Type Definitions (`resources/js/Types/`)
**Location**: `/resources/js/Types/`  
**Purpose**: TypeScript 型定義の一元管理  
**Pattern**:
- 機能領域ごとに `types-*.d.ts` ファイルで分割
- GraphQL 型は `types-graphql.d.ts`（自動生成）
- バックエンド API レスポンス型は手動定義

**Example**:
```typescript
// types-article.d.ts
export interface Article {
  id: number
  title: string
  // ...
}
```

### GraphQL (`resources/js/Graphql/`)
**Location**: `/resources/js/Graphql/`  
**Purpose**: GraphQL クエリ・ミューテーション定義  
**Pattern**:
- `queries/`: クエリ定義
- `mutations/`: ミューテーション定義
- GraphQL Code Generator で TypeScript 型を自動生成

## Naming Conventions

- **Vue Components**: PascalCase (`ElTextTagsInput.vue`)
- **TypeScript Files**: camelCase (`useUserProfile.ts`)
- **Type Definitions**: kebab-case (`types-article.d.ts`)
- **PHP Classes**: PascalCase (`ArticleController.php`)
- **PHP Methods**: camelCase (`getUserProfile()`)
- **Routes**: kebab-case (`api.articles.index`)

## Import Organization

```typescript
// 1. Vue 関連
import { ref, computed, onMounted } from 'vue'

// 2. 外部ライブラリ
import { ElButton, ElIcon } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 3. プロジェクト内（絶対パス）
import { useUserProfile } from '@/Composables/useUserProfile'
import type { Article } from '@/Types/types-article'

// 4. 相対パス（同じディレクトリ内）
import LocalComponent from './LocalComponent.vue'
```

**Path Aliases**:
- `@/`: `resources/js/` にマッピング（`tsconfig.json` で定義）

## Code Organization Principles

1. **コンポーネント分割**: 1コンポーネント1責務、再利用可能な単位で分割
2. **Composables 分離**: ビジネスロジックは Composables に分離、コンポーネントは UI に集中
3. **型安全性**: すべての Props/Emits/API レスポンスに型定義
4. **仕様駆動**: 各コンポーネントに `<spec>` ブロックで仕様を記述
5. **レスポンシブ設計**: モバイルファースト、`useBreakpointsConfig` でデバイス判定
6. **API エンドポイント**: Laravel の `route()` ヘルパーを使用（ハードコード禁止）

---
_Document patterns, not file trees. New files following patterns shouldn't require updates_
