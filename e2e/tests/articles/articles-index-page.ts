import { expect, Page, test } from '@playwright/test';
import { BasePage, step } from '../base-page';

export class ArticlesIndexPage extends BasePage {
  async gotoIndex() {
    await this.goto('/articles');
  }

  @step('index-search.png')
  async searchArticle(title: string) {
    await this.page.getByRole('textbox', { name: 'Search Title' }).fill(title);
    // await this.page.getByRole('button', { name: 'Form Search' }).click();
    await this.page.getByRole('table', { name: 'Articles List' }).waitFor();
  }

  @step()
  async clickDeleteArticle(articleId: string, doDialogOk = true) {
    // 削除ボタンのダイアログの処理
    this.page.once('dialog', dialog => {
      const msg = doDialogOk ? 'OK' : 'CANCEL';
      console.log(`Dialog message: ${dialog.message()} id: ${articleId} ${msg}`);
      doDialogOk ? dialog.accept() : dialog.dismiss()
    });
    // 削除ボタンClick
    await this.page.locator(`#delete-${articleId}`).click();
    await this.waitForLoadState('networkidle');
  }

  // @step()
  @step()
  async createArticle({ title = 'title test🤖' + Date.now(), body = 'body test🤖' } = {}) {
    await this.clickCreateArticle();

    await this.page.locator('input#title').fill(title);
    await this.page.locator('input#body').fill(body);

    await this.page.getByRole('button', { name: 'Create' }).click();

    await this.waitForUrl(/articles\/\d+\/edit/);
    const articleId = this.page.url().match(/articles\/(\d+)\/edit/)?.[1];

    return { id: articleId, title, body };
  }

  @step()
  async editArticle({ id, title = 'title test🤖' + Date.now(), body = 'body test🤖' }) {
    await this.goto(`/articles/${id}/edit`);

    await this.page.locator('input#title').fill(title);
    await this.page.locator('input#body').fill(body);

    await this.page.getByRole('button', { name: 'Save' }).click();

    await this.waitForUrl(`/articles/${id}/edit`);

    return { id, title, body };
  }

  @step()
  async clickCreateArticle() {
    await this.page.getByRole('link', { name: 'Create Article' }).click();
  }

  async expectArticleRowToBeVisible(articleId: string, visible = true) {
    await expect(this.page.locator(`#row-${articleId}`)).toBeVisible({ visible });
  }
}

// step関数は base-page.ts に移動しました
