import { test, expect, Page } from '@playwright/test';

/**
 * 全てのページクラスの基底クラス
 * レスポンシブ対応のメソッドなどの共通処理を提供
 */
export class BasePage {
  protected readonly isMobile: boolean;

  constructor(protected readonly page: Page) {
    // Tailwind CSSのsmブレークポイント(640px)を基準に判定
    this.isMobile = (page.viewportSize()?.width ?? 0) < 640;
  }

  /**
   * ナビゲーションリンクをクリックする（PC/Mobile対応）
   */
  async clickNavLink(name: string) {
    if (this.isMobile) {
      // モバイル用ナビゲーション - まずハンバーガーメニューを開く
      await this.page.getByRole('button', { name: 'Responsive Navigation Menu' }).click();
      await this.page.getByRole('link', { name }).click();
    } else {
      // PC用ナビゲーション - 直接リンクをクリック
      await this.page.getByRole('link', { name }).click();
    }
  }

  /**
   * 指定URLに移動
   */
  async goto(url: string) {
    await this.page.goto(url);
  }

  /**
   * URLが特定のパターンになるまで待機
   */
  async waitForUrl(urlOrRegExp: string | RegExp) {
    await this.page.waitForURL(urlOrRegExp);
  }

  /**
   * ページが読み込まれるまで待機
   */
  async waitForLoadState(state: 'networkidle' | 'load' | 'domcontentloaded' = 'networkidle') {
    await this.page.waitForLoadState(state);
  }
}

/**
 * ステップデコレータ
 * クラスメソッドがPlaywright testのステップとして記録されるようにする
 */
export function step(screenshotPath?: string) {
  return function (target: Function, context: ClassMethodDecoratorContext) {
    return function replacementMethod(...args: any) {
      const name = '🔖' + this.constructor.name + '.' + (context.name as string) + (screenshotPath ? '📷' : '');
      return test.step(name, async () => {
        const result = await target.call(this, ...args);
        if (screenshotPath) {
          await this.page.screenshot({ path: screenshotPath });
        }
        return result;
      }, { box: true });
    };
  };
}
