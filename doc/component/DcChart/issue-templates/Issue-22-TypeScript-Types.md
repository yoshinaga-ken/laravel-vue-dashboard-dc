# Issue #22: TypeScript型定義の作成

## 概要
DcChart関連の型定義を作成し、型安全性を確保する

## 背景
現在のDcChart.vueは、型安全性が不十分で以下の問題があります：
- `mm.config`、`mm.opt`等の構造が型定義されていない
- DC.jsとの型統合が不完全
- IDEの補完が効かない
- ランタイムエラーのリスクが高い

## 目標
完全な型定義により、開発効率と品質を向上させる

## 作業内容

### 1. チャート設定型の定義 (`src/Types/chart.types.ts`)

```typescript
// チャート基本設定型
export interface ChartConfig {
  urlParamDataReplace: boolean;
  mouseLongClickDuration: number;
  panelDraggable: boolean;
  panelDragSnapThreshold: number;
  panelResizable: boolean;
  defaultMargins: ChartMargins;
  cName: NameChartConfig;
  cCity: CityChartConfig;
  cDate: DateChartConfig;
  // ... 他のチャート設定
}

export interface ChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// 個別チャート設定型
export interface NameChartConfig {
  itemHeight: number;
}

export interface CityChartConfig {
  itemHeight: number;
  preMatch: 0 | 1; // 0:部分一致 1:前方一致
}

export interface DateChartConfig {
  width: number;
  colors: string[];
}

// チャートオプション型
export interface ChartOptions {
  chartDate: DateChartOptions;
  chartAge: AgeChartOptions;
  chartSex: SexChartOptions;
  // ... 他のチャートオプション
}

export interface DateChartOptions {
  elasticY: boolean;
  width?: number;
  margins?: ChartMargins;
}

export interface AgeChartOptions {
  unit: any[] | null;
  scale?: number;
  isLegend?: boolean;
}

export interface SexChartOptions {
  unit: any[] | null;
  scale?: number;
  isLegend?: boolean;
}
```

### 2. データ構造型の定義 (`src/Types/data.types.ts`)

```typescript
// データレコード型
export interface DataRecord {
  [D_YMD]: string;     // 日付 YYYY-MM-DD
  [D_SEX]: number;     // 性別ID 0:不明 1:男 2:女
  [D_AGE]: number;     // 年齢
  [D_CND]: string;     // 状態
  [D_PL1]: string;     // 都道府県
  [D_PL2]: string;     // 市区町村
  [D_JOB]: string;     // 職業
  [D_JOBCAT]: number;  // ジョブカテゴリID
  [D_CNT]: number;     // カウント
  [D_EX0]: any;        // 拡張データ開始
}

// Crossfilterディメンション型
export interface ChartDimension {
  filter: (value?: any) => ChartDimension;
  filterAll: () => ChartDimension;
  filterExact: (value: any) => ChartDimension;
  filterRange: (range: [any, any]) => ChartDimension;
  top: (k: number) => any[];
  bottom: (k: number) => any[];
  dispose: () => void;
}

// Crossfilterグループ型
export interface ChartGroup {
  all: () => { key: any; value: any }[];
  top: (k: number) => { key: any; value: any }[];
  size: () => number;
  reduceAdd: (f: (p: any, v: any) => any) => ChartGroup;
  reduceRemove: (f: (p: any, v: any) => any) => ChartGroup;
  reduceInitial: (f: () => any) => ChartGroup;
  dispose: () => void;
}

// パネル状態型
export interface PanelState {
  isHidden: boolean;
  isShow: boolean;
  title: string;
  style: string;
  info?: string;
  elasticX?: boolean;
}

export interface PanelConfig {
  common: {
    unitPrefix: string;
    unit: string;
    dataReference: string;
    datepicker: {
      position: Record<string, any>;
    };
    toolbar: {
      isShow: boolean;
    };
  };
  gmap: PanelState & {
    is3D: boolean;
    styleBak: string | null;
    chartGMap: GoogleMapConfig;
  };
  // ... 他のパネル
}

export interface GoogleMapConfig {
  center?: [number, number];
  colorThreshold?: any;
  panToMarkerType: number;
  markerInfo: string;
  prefecture: string;
  layer: Record<string, Record<string, number>>;
  focus: Record<string, Record<string, number>>;
}
```

### 3. DC.js拡張型の定義 (`src/Types/dc.types.ts`)

```typescript
import * as dc from 'dc';

// DC.jsチャート型の拡張
export interface DcChartExtended extends dc.BaseMixin<any> {
  isDcSunburstChart?: boolean;
  chartGroup: (group?: string) => string | this;
}

// フィルター型
export interface ChartFilter {
  filterAll(): this;
  filter(value?: any): any[] | this;
  filters(): any[];
  hasFilter(filter?: any): boolean;
}

// イベント型
export interface ChartEvent {
  chart: DcChartExtended;
  filter?: any;
  filters?: any[];
}

// チャートインスタンス管理型
export interface ChartInstances {
  chartDate?: dc.CompositeChart;
  chartDate2?: dc.LineChart;
  chartYear?: dc.BarChart;
  chartSeason?: dc.BarChart;
  chartWeek?: dc.BarChart;
  chartSex?: dc.RowChart;
  chartAge?: dc.RowChart;
  chartCond?: dc.RowChart;
  chartJob?: dc.RowChart;
  chartName?: dc.RowChart;
  chartCity?: dc.RowChart;
  chartEx?: DcChartExtended[];
}
```

### 4. 既存コードへの型適用

`DcChart.vue`内で型を使用：

```typescript
import type { 
  ChartConfig, 
  ChartOptions, 
  PanelConfig,
  ChartInstances 
} from '@/Types';

// 型付きオブジェクトの定義
const mm: {
  config: ChartConfig;
  opt: ChartOptions;
  // ... 他のプロパティ
} = {
  config: {
    // 型安全な設定
  },
  opt: {
    // 型安全なオプション
  }
};

const pnl: PanelConfig = reactive({
  // 型安全なパネル設定
});
```

## 成果物

### ファイル一覧
- [ ] `src/Types/chart.types.ts` - チャート設定・オプション型
- [ ] `src/Types/data.types.ts` - データ構造・パネル状態型  
- [ ] `src/Types/dc.types.ts` - DC.js拡張型
- [ ] `src/Types/index.ts` - 型のエクスポート統合

### テストファイル
- [ ] `src/Types/__tests__/chart.types.test.ts` - 型のバリデーションテスト

## 検証基準

### 必須条件
- [ ] TypeScriptコンパイルエラーが0件
- [ ] IDEで完全な型補完が機能
- [ ] 既存機能に影響なし
- [ ] 型テストがすべて通過

### 品質指標
- [ ] 型カバレッジ 100%
- [ ] 型の循環参照なし
- [ ] ドキュメント生成可能

## 依存関係
- **前提**: なし（最初のIssue）
- **後続**: Issue #23 (設定管理サービス分離)

## 見積もり工数
**5-8時間** (約1日)

## 注意事項
- 既存の実行時動作を変更しない
- 段階的に型を適用し、一度に全てを変更しない
- DC.jsとの型整合性を重視する
- 将来の拡張を考慮した柔軟な型設計

## レビュー観点
1. 型定義の完全性と正確性
2. 既存コードとの互換性
3. パフォーマンスへの影響
4. 保守性・拡張性の向上度

---

**このIssueの完了により、後続のリファクタリング作業が型安全に実行可能になります。**