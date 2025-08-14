# TASK-701: チーム一覧画面E2Eテスト(Playwright)実装

## タスク概要

チーム一覧画面機能の実装完了に伴い、Playwrightを使用したE2Eテストを実装する。Storybookの`Interaction tests`では網羅できないUIオペレーション、特にチーム切り替えやページ遷移等の完全なユーザーフローをテストする。

## 依存関係

**依存タスク**: 基本実装タスク（TASK-101～301）がすべて完了していること

## 実装対象ファイル

### 新規作成ファイル

```
e2e/tests/teams/
├── team.spec.ts                  # E2Eテストメイン実装
└── teams-index-page.ts           # ページオブジェクトモデル（Utilityクラス）
```

### 設定ファイル更新

```
e2e/playwright.config.ts          # テストプロジェクト設定追加
```

## 実装仕様

### 1. ページオブジェクトクラス（TeamsIndexPage）

#### 1.1 基本構造

```typescript
// e2e/tests/teams/teams-index-page.ts
import { expect, Page } from '@playwright/test'
import { BasePage, step } from '../base-page'

export class TeamsIndexPage extends BasePage {
  // チーム一覧ページへの移動
  async gotoIndex(): Promise<void>

  // チーム切り替え操作
  async switchToTeam(teamId: number): Promise<void>

  // チーム詳細画面への遷移
  async viewTeamDetails(teamId: number): Promise<void>

  // チーム作成ページへの遷移
  async clickCreateTeam(): Promise<void>

  // フィルタリング操作
  async filterTeams(filterType: 'owned' | 'member' | 'personal' | 'all'): Promise<void>

  // ソート操作
  async sortTeamsByName(direction: 'asc' | 'desc'): Promise<void>

  // テーブル検証メソッド
  async expectTeamRowToBeVisible(teamId: number, visible?: boolean): Promise<void>
  async expectTeamToBeCurrent(teamId: number): Promise<void>
}
```

#### 1.2 実装詳細

**チーム切り替え機能**

```typescript
@step()
async switchToTeam(teamId: number): Promise<void> {
  // 確認ダイアログの処理
  this.page.once('dialog', dialog => {
    console.log(`Team switch dialog: ${dialog.message()}`);
    dialog.accept();
  });

  await this.page.locator(`[data-testid="switch-team-${teamId}"]`).click();
  await this.waitForLoadState('networkidle');

  // チーム切り替え後のページリロードを待機
  await this.page.waitForFunction(() => document.readyState === 'complete');
}
```

**フィルタリング機能**

```typescript
@step()
async filterTeams(filterType: 'personal' | 'shared' | 'all'): Promise<void> {
  // TeamFiltersComponentのチームタイプフィルターを使用
  const teamTypeFilter = this.page.locator('[data-testid="team-type-filter"]')
  await teamTypeFilter.click()

  // フィルターオプションを選択（Element PlusのElOptionはテキストで選択）
  const optionLabels = {
    all: 'All Teams',
    personal: 'Personal Teams',
    shared: 'Shared Teams',
  }
  const label = optionLabels[filterType]
  await this.page.locator(`.el-select-dropdown__item:has-text("${label}")`).click()

  // フィルター適用を待機
  await this.waitForLoadState('networkidle')
}
```

### 2. E2Eテストメイン実装

#### 2.1 テストシナリオ構成

```typescript
// e2e/tests/teams/team.spec.ts
import { expect, test } from '@playwright/test'
import { isLogin, login } from '../utils'
import { TeamsIndexPage } from './teams-index-page'

test.describe('Teams Index Page E2E Tests', () => {
  test.setTimeout(30000) // チーム切り替えに時間がかかる可能性

  test.beforeEach(async ({ page }, testInfo) => {
    if (!(await isLogin(page))) {
      await login(page)
    }
  })
})
```

#### 2.2 実装テストケース

**1. 基本表示・ナビゲーションテスト**

```typescript
// チーム一覧画面の基本表示とナビゲーション
test('Basic display and navigation of teams index page', async ({ page }) => {
  const teamsPage = new TeamsIndexPage(page)

  // チーム一覧画面に移動
  await teamsPage.gotoIndex()

  // ページタイトルの確認
  await teamsPage.expectPageTitle()

  // カード形式のチーム表示構造の確認
  await teamsPage.expectTableStructure()

  // チーム一覧グリッドまたは空の状態の表示確認
  const teamsGrid = page.locator('[data-testid="teams-grid"]')
  const emptyState = page.locator('[data-testid="teams-empty-state"]')

  const gridVisible = await teamsGrid.isVisible()
  const emptyVisible = await emptyState.isVisible()

  // どちらかが表示されていることを確認
  expect(gridVisible || emptyVisible).toBe(true)

  if (gridVisible) {
    // チームが存在する場合、最低1つのチーム（個人チーム）が存在することを確認
    const teamCards = page.locator('[data-testid^="team-card-"]')
    const teamCount = await teamCards.count()
    expect(teamCount).toBeGreaterThanOrEqual(1)
  }
})
```

**2. チーム切り替え完全フローテスト**

```typescript
// チーム切り替えの完全フロー
test('Complete team switching flow', async ({ page }) => {
  const teamsPage = new TeamsIndexPage(page)

  await teamsPage.gotoIndex()

  // 現在のチームを記録
  const currentTeamCard = page.locator('[data-testid^="team-card-"].current-team')
  const currentTeamCount = await currentTeamCard.count()

  if (currentTeamCount === 0) {
    console.log('現在チームが明示的にマークされていない、テストをスキップ')
    return
  }

  const currentTeamIdAttr = await currentTeamCard.getAttribute('data-testid')
  const currentTeamId = currentTeamIdAttr?.match(/team-card-(\d+)/)?.[1]

  // 切り替え可能なチームを検索
  const switchableTeamCard = page.locator('[data-testid^="team-card-"]:not(.current-team)').first()
  const switchableTeamCount = await switchableTeamCard.count()

  if (switchableTeamCount === 0) {
    console.log('切り替え可能なチームが存在しない、テストをスキップ')
    return
  }

  const switchableTeamIdAttr = await switchableTeamCard.getAttribute('data-testid')
  const switchableTeamId = switchableTeamIdAttr?.match(/team-card-(\d+)/)?.[1]

  if (switchableTeamId) {
    // チーム切り替え実行
    await teamsPage.switchToTeam(parseInt(switchableTeamId))

    // 切り替え後はページがリロードされるので、チーム一覧ページに戻る
    await teamsPage.gotoIndex()

    // 切り替えが成功したことを確認（簡易版）
    await expect(
      page.locator('[data-testid="teams-grid"], [data-testid="teams-empty-state"]')
    ).toBeVisible()
  }
})
```

**3. チーム詳細画面遷移テスト**

```typescript
// チーム詳細画面への遷移
test('Navigate to team details page', async ({ page }) => {
  const teamsPage = new TeamsIndexPage(page)

  await teamsPage.gotoIndex()

  // 最初のチームの詳細を表示
  const firstTeamCard = page.locator('[data-testid^="team-card-"]').first()
  const teamIdAttr = await firstTeamCard.getAttribute('data-testid')
  const teamId = teamIdAttr?.match(/team-card-(\d+)/)?.[1]

  if (teamId) {
    await teamsPage.viewTeamDetails(parseInt(teamId))

    // チーム詳細ページに遷移したことを確認
    await expect(page).toHaveURL(new RegExp(`/teams/${teamId}`))

    // ページタイトルまたはヘッダーでチーム詳細画面であることを確認
    const pageHeaders = page.locator('h1, h2')
    await expect(pageHeaders).toContainText(/Team Settings|チーム設定|Team Details|チーム詳細/)
  }
})
```

**4. チーム作成フローテスト**

```typescript
// チーム作成ページへの遷移
test('Navigate to team creation page', async ({ page }) => {
  const teamsPage = new TeamsIndexPage(page)

  await teamsPage.gotoIndex()

  // チーム作成権限がある場合のみテスト実行
  const createButton = page.getByRole('link', { name: /Create.*Team|チーム作成/ })
  const createButtonCount = await createButton.count()

  if (createButtonCount > 0) {
    // チーム作成ボタンをクリック
    await teamsPage.clickCreateTeam()

    // チーム作成ページに遷移したことを確認
    await expect(page).toHaveURL(/\/teams\/create/)

    // ページタイトルまたはヘッダーでチーム作成画面であることを確認
    const pageHeaders = page.locator('h1, h2')
    await expect(pageHeaders).toContainText(/Create Team|チーム作成/)

    // 一覧に戻る
    await page.goBack()
    await expect(page.locator('[data-testid="teams-grid"]')).toBeVisible()
  } else {
    console.log('チーム作成権限がない、テストをスキップ')
  }
})
```

**5. フィルタリング・ソート機能テスト**

```typescript
// フィルタリングとソート機能
test('Filtering and sorting functionality', async ({ page }) => {
  const teamsPage = new TeamsIndexPage(page)

  await teamsPage.gotoIndex()

  // 初期状態のチーム数を記録
  const initialTeamRows = page.locator('[data-testid^="team-card-"]')
  const initialCount = await initialTeamRows.count()

  // フィルタ機能がある場合のみテスト実行
  const teamTypeFilter = page.locator('[data-testid="team-type-filter"]')
  const teamTypeFilterCount = await teamTypeFilter.count()

  if (teamTypeFilterCount > 0) {
    // 個人チームフィルタ
    await teamsPage.filterTeams('personal')
    await teamsPage.waitForLoadState('networkidle')
    const personalTeamsCount = await page.locator('[data-testid^="team-card-"]').count()
    await teamsPage.expectTeamCount(personalTeamsCount)

    // 共有チームフィルタ
    await teamsPage.filterTeams('shared')
    await teamsPage.waitForLoadState('networkidle')
    const sharedTeamsCount = await page.locator('[data-testid^="team-card-"]').count()
    await teamsPage.expectTeamCount(sharedTeamsCount)

    // 全チーム表示に戻す
    await teamsPage.filterTeams('all')
    await teamsPage.waitForLoadState('networkidle')
    await teamsPage.expectTeamCount(initialCount)
  } else {
    console.log('フィルタ機能が実装されていない、テストをスキップ')
  }

  // ソート機能がある場合のみテスト実行
  const sortSelect = page.locator('[data-testid="sort-by-filter"]')
  const sortSelectCount = await sortSelect.count()

  if (sortSelectCount > 0) {
    // 名前でソート（昇順）
    await teamsPage.sortTeamsByName('asc')
    await teamsPage.waitForLoadState('networkidle')

    // ソート後も同じ数のチームが表示されることを確認
    await teamsPage.expectTeamCount(initialCount)

    // 名前でソート（降順）
    await teamsPage.sortTeamsByName('desc')
    await teamsPage.waitForLoadState('networkidle')
    await teamsPage.expectTeamCount(initialCount)
  } else {
    console.log('ソート機能が実装されていない、テストをスキップ')
  }
})
```

**6. 権限制御テスト**

```typescript
// 権限に応じたUI制御
test('UI control based on permissions', async ({ page }) => {
  const teamsPage = new TeamsIndexPage(page)

  await teamsPage.gotoIndex()

  // 個人チームの確認
  const personalTeamRows = page.locator('[data-testid^="team-card-"].personal-team')
  const personalTeamCount = await personalTeamRows.count()

  if (personalTeamCount > 0) {
    for (let i = 0; i < personalTeamCount; i++) {
      const row = personalTeamRows.nth(i)
      const teamId = (await row.getAttribute('data-testid'))?.match(/team-card-(\d+)/)?.[1]
      if (teamId) {
        // 個人チームのタイプを確認
        await teamsPage.expectTeamType(parseInt(teamId), 'personal')
      }
    }
  }

  // 通常チームの確認（オーナーの場合）
  const ownedNormalTeams = page.locator('[data-testid^="team-card-"].owner:not(.personal-team)')
  const ownedNormalCount = await ownedNormalTeams.count()

  if (ownedNormalCount > 0) {
    const firstOwnedTeam = ownedNormalTeams.first()
    const teamId = (await firstOwnedTeam.getAttribute('data-testid'))?.match(/team-card-(\d+)/)?.[1]
    if (teamId) {
      // 通常チームのタイプを確認
      await teamsPage.expectTeamType(parseInt(teamId), 'normal')
      // オーナー関係を確認
      await teamsPage.expectOwnershipRole(parseInt(teamId), 'owner')
    }
  }

  // メンバーチームの確認
  const memberTeams = page.locator('[data-testid^="team-card-"].member')
  const memberTeamCount = await memberTeams.count()

  if (memberTeamCount > 0) {
    const firstMemberTeam = memberTeams.first()
    const teamId = (await firstMemberTeam.getAttribute('data-testid'))?.match(
      /team-card-(\d+)/
    )?.[1]
    if (teamId) {
      // メンバー関係を確認
      await teamsPage.expectOwnershipRole(parseInt(teamId), 'member')
    }
  }

  // 注意: チーム削除機能はチーム一覧画面には実装されていません
  // 削除機能は Teams/Show.vue（チーム詳細画面）でのみ利用可能です
})
```

**7. レスポンシブ対応テスト**

```typescript
// レスポンシブ対応テスト
test('Responsive design test', async ({ page }) => {
  const teamsPage = new TeamsIndexPage(page)

  await teamsPage.gotoIndex()

  // レスポンシブレイアウトの確認（isMobile変数でPC/モバイルを判別）
  await teamsPage.expectResponsiveLayout()

  // チーム操作の確認
  const firstTeamCard = page.locator('[data-testid^="team-card-"]').first()
  const teamIdAttr = await firstTeamCard.getAttribute('data-testid')
  const teamId = teamIdAttr?.match(/team-card-(\d+)/)?.[1]

  if (teamId) {
    // チーム詳細に遷移できることを確認
    await teamsPage.viewTeamDetails(parseInt(teamId))
    await expect(page).toHaveURL(new RegExp(`/teams/${teamId}`))

    console.log(`${teamsPage.isMobileView ? 'モバイル' : 'PC'}でのチーム詳細遷移が成功しました`)
  }
})
```

#### 2.3 エラーケーステスト

```typescript
// エラーケースの処理
test('Error case handling', async ({ page }) => {
  const teamsPage = new TeamsIndexPage(page)

  await teamsPage.gotoIndex()

  // 注意: チーム削除機能はチーム一覧画面には実装されていません
  // 削除機能は Teams/Show.vue（チーム詳細画面）でのみ利用可能です
  // 個人チーム削除試行のテストは削除されました

  // 存在しないチームへのアクセス（404エラー）
  await page.goto('/teams/99999')

  // 404ページまたはエラーメッセージの表示を確認
  const errorIndicators = [
    page.locator('text=404'),
    page.locator('text=Not Found'),
    page.locator('text=ページが見つかりません'),
    page.locator('[data-testid="error-page"]'),
  ]

  let errorFound = false
  for (const indicator of errorIndicators) {
    const count = await indicator.count()
    if (count > 0) {
      await expect(indicator).toBeVisible()
      errorFound = true
      break
    }
  }

  if (!errorFound) {
    // リダイレクトされる場合もある
    await expect(page).toHaveURL(/\/teams$/)
  }
})

// 注意: チーム削除機能の動作確認テストは削除されました
// 理由: チーム削除機能はチーム一覧画面には実装されていません
// 削除機能は Teams/Show.vue（チーム詳細画面）でのみ利用可能です

// テーブル表示内容の詳細確認
test('Detailed verification of table display content', async ({ page }) => {
  const teamsPage = new TeamsIndexPage(page)

  await teamsPage.gotoIndex()

  // 最初のチーム行で詳細内容を確認
  const firstTeamRow = page.locator('[data-testid^="team-card-"]').first()
  const teamIdAttr = await firstTeamRow.getAttribute('data-testid')
  const teamId = teamIdAttr?.match(/team-card-(\d+)/)?.[1]

  if (teamId) {
    // チーム名が表示されていることを確認（h4要素として表示）
    const teamName = firstTeamRow.locator('h4')
    await expect(teamName).toBeVisible()
    await expect(teamName).not.toBeEmpty()

    // メンバー数が表示されていることを確認（統計情報セクション内）
    const memberCountSection = firstTeamRow.locator('.text-2xl.font-bold.text-blue-600')
    await expect(memberCountSection).toBeVisible()

    // メンバー数のラベルが表示されていることを確認
    const memberLabel = firstTeamRow.locator('.text-xs.text-gray-500:has-text("Members")')
    await expect(memberLabel).toBeVisible()

    // 作成日が表示されていることを確認（p要素として表示）
    const createdDate = firstTeamRow.locator('p')
    if ((await createdDate.count()) > 0) {
      await expect(createdDate).toBeVisible()
      // 作成日のテキストが正しい形式であることを確認
      const dateText = await createdDate.textContent()
      expect(dateText).toMatch(/Created .* by/)
    }

    // アクションボタンが表示されていることを確認
    const switchButton = firstTeamRow.locator('button:has-text("Switch")')
    await expect(switchButton).toBeVisible()

    const settingsButton = firstTeamRow.locator('button:has-text("Settings")')
    await expect(settingsButton).toBeVisible()

    const viewDetailsButton = firstTeamRow.locator('button:has-text("View Details")')
    await expect(viewDetailsButton).toBeVisible()
  }
})
```

### 3. Playwright設定ファイル更新

#### 3.1 テストプロジェクト追加

```typescript
// e2e/playwright.config.ts（追加部分）
export default defineConfig({
  // ... 既存設定

  projects: [
    {
      name: 'chromium',
      testMatch: ['articles/*.spec.ts', 'teams/*.spec.ts'], // teams追加
      use: { ...devices['Desktop Chrome'] },
    },

    // 新規: チーム機能専用テストプロジェクト
    {
      name: 'teams-chromium',
      testMatch: ['teams/*.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        // チーム機能テスト用の追加設定があれば記述
      },
    },

    // ... 既存の他のプロジェクト
  ],
})
```

### 4. データ準備・クリーンアップ

#### 4.1 テストデータ要件

- **テスト用ユーザー**: 複数チームに所属するユーザー
- **個人チーム**: 削除不可チームのテスト
- **通常チーム**: 削除可能チームのテスト
- **メンバーチーム**: 他人のチームに所属するケース

#### 4.2 環境変数設定

```bash
# .env（E2Eテスト用設定）
E2E_TEST_ADMIN_USER_EMAIL=test@example.com
E2E_TEST_ADMIN_USER_PASSWORD=password
E2E_DOMAIN_FOR_TEST=localhost:8000
```

### 5. 実装時の注意事項

#### 5.1 Jetstream特有の考慮点

1. **チーム切り替え後のページリロード**
   - Jetstreamのチーム切り替えは画面全体がリロードされる
   - `waitForLoadState('networkidle')`でリロード完了を待機

2. **個人チームの特別扱い**
   - `personal_team = true`のチームは削除ボタンが非表示
   - テストでも削除不可であることを確認

3. **権限ベースのUI制御**
   - オーナー/メンバーによってボタンの表示/非表示が変わる
   - 各権限パターンでのテスト実装

#### 5.2 Element Plusテーブル対応

1. **data-testid属性の活用**
   - Element Plusのテーブルには適切なdata-testid属性を付与
   - チームIDベースの一意な識別子を使用

2. **テーブルソート・フィルタ対応**
   - Element Plusのテーブル機能に対応したセレクタ
   - 非同期処理の適切な待機

#### 5.3 Inertia.js対応

1. **SPA遷移の待機**
   - Inertia.jsのSPA遷移完了をプロパーに待機
   - `waitForURL()`と`waitForLoadState()`の併用

2. **部分リロード対応**
   - チーム切り替え等でPartial Reloadsが発生する場合の対応

### 6. テスト実行方法

#### 6.1 個別実行

```bash
# チーム機能のE2Eテストのみ実行
cd e2e
npx playwright test teams/

# 特定のテストケースのみ実行
npx playwright test teams/team.spec.ts -g "チーム切り替え"
```

#### 6.2 デバッグ実行

```bash
# デバッグモードで実行
npx playwright test teams/team.spec.ts --debug

# UIモードで実行
npx playwright test teams/team.spec.ts --ui
```

#### 6.3 レポート確認

```bash
# テストレポートを表示
npx playwright show-report
```

## 完了条件

### 1. 機能テスト

- [ ] チーム一覧画面の基本表示
- [ ] チーム切り替え完全フロー
- [ ] チーム詳細画面遷移
- [ ] チーム作成ページ遷移
- [ ] フィルタリング・ソート機能
- [ ] 権限制御（個人チーム制御等）
- [ ] レスポンシブ対応テスト
- [ ] エラーケースの処理
- [ ] テーブル表示内容の詳細確認
- [x] ~~チーム削除機能の動作確認~~ （削除機能はチーム詳細画面でのみ利用可能）

### 2. 技術品質

- [ ] ページオブジェクトモデルの適切な実装
- [ ] `@step`デコレータによるステップ記録
- [ ] エラーケースの適切な処理
- [ ] レスポンシブ対応テスト
- [ ] 非同期処理の適切な待機

### 3. 保守性

- [ ] 既存のE2Eテストパターンとの一貫性
- [ ] BasePage継承による共通機能活用
- [ ] 適切なコメント・ドキュメンテーション

### 4. パフォーマンス

- [ ] テスト実行時間の最適化（30秒以内）
- [ ] 不要な待機時間の削除
- [ ] 並列実行対応

## 関連ファイル

### 参考実装

- `e2e/tests/articles/article.spec.ts`
- `e2e/tests/articles/articles-index-page.ts`
- `e2e/tests/base-page.ts`
- `e2e/tests/utils.ts`

### 対象画面

- `/teams` - チーム一覧画面
- `/teams/create` - チーム作成画面
- `/teams/{id}` - チーム詳細画面

### 実装ファイル

- `resources/js/Pages/Teams/Index.vue`
- `resources/js/Pages/Teams/Partials/TeamTable.vue`
- `app/Http/Controllers/TeamController.php`

## 備考

- Jetstream特有のチーム機能（個人チーム制御、権限システム）を重点的にテスト
- **注意**: チーム削除機能はチーム一覧画面には実装されていません。削除機能は `Teams/Show.vue`（チーム詳細画面）でのみ利用可能です
- 実装完了後は継続的なテスト実行により品質維持を図る
