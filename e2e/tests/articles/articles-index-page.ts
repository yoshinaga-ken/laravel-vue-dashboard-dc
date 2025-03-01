import { test, expect, Page } from '@playwright/test';

export class ArticlesIndexPage {
  constructor(private readonly page: Page) {
  }

  async gotoIndex() {
    await this.page.goto('/articles');
  }

  // @step('index-search.png')
  async searchArticle(title: string) {
    await this.page.getByRole('textbox', { name: 'Search Title' }).fill(title);
    await this.page.getByRole('button', { name: '🔍' }).click();
    await this.page.waitForLoadState('networkidle');
    // await this.page.screenshot({ path: 'index-search.png' });
  }

  async clickDeleteArticle(articleId: string, doDialogOk = true) {
    // 削除ボタンのダイアログの処理
    this.page.once('dialog', dialog => {
      const msg = doDialogOk ? 'OK' : 'CANCEL';
      console.log(`Dialog message: ${dialog.message()} id: ${articleId} ${msg}`);
      doDialogOk ? dialog.accept() : dialog.dismiss()
    });
    // 削除ボタンClick
    await this.page.locator(`#delete-${articleId}`).click();
    await this.page.waitForLoadState('networkidle');
  }

  // @step()
  async createArticle({ title = 'title test🤖' + Date.now(), body = 'body test🤖' }) {
    await this.clickCreateArticle();

    await this.page.locator('input#title').fill(title);
    await this.page.locator('input#body').fill(body);

    await this.page.getByRole('button', { name: 'Create' }).click();

    await this.page.waitForURL(/articles\/\d+\/edit/);
    const articleId = this.page.url().match(/articles\/(\d+)\/edit/)?.[1];

    return { id: articleId, title, body };
  }

  async editArticle({ id, title = 'title test🤖' + Date.now(), body = 'body test🤖' }) {
    await this.page.goto(`/articles/${id}/edit`);

    await this.page.locator('input#title').fill(title);
    await this.page.locator('input#body').fill(body);

    await this.page.getByRole('button', { name: 'Save' }).click();

    await this.page.waitForURL(`/articles/${id}/edit`);

    return { id, title, body };
  }

  async clickCreateArticle() {
    await this.page.getByRole('link', { name: 'Create Article' }).click();
  }

  async expectArticleRowToBeVisible(articleId: string, visible = true) {
    await expect(this.page.locator(`#row-${articleId}`)).toBeVisible({ visible });
  }
}

function step(screenshotPath?: string) {
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
