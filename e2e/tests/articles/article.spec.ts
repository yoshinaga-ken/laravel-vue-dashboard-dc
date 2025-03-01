import { expect, test } from '@playwright/test';
import { isLogin, login } from "../utils";
import { ArticlesIndexPage } from "./articles-index-page";

test.describe('article', () => {
  test.setTimeout(20000);

  test.beforeEach(async ({ page }, testInfo) => {
    if (!await isLogin(page)) {
      await login(page);
    }
  });

  test('article create', async ({ page }) => {
    const p = new ArticlesIndexPage(page);

    // articles.create
    await p.gotoIndex();
    const { id: articleId, title } = await p.createArticle({});

    // search
    await p.gotoIndex();
    await p.searchArticle(title);
    await p.expectArticleRowToBeVisible(articleId);

    // articles.edit
    const { title: editTitle } = await p.editArticle({ id: articleId });
    await p.gotoIndex();
    await p.searchArticle(editTitle);
    await p.expectArticleRowToBeVisible(articleId);

    // articles.delete
    await p.clickDeleteArticle(articleId);
    await p.expectArticleRowToBeVisible(articleId, false);
  });

  test('article CRUD operation', async ({ page }) => {
    // articles.index
    await page.goto('/articles');

    // articles.create
    await page.getByRole('link', { name: 'Create Article' }).click();
    let title = page.locator('input#title');
    let titleValue = 'title test🤖';
    const bodyValue = 'body test🤖';
    await title.fill(titleValue);
    await page.getByRole('textbox', { name: '本文' }).fill(bodyValue);
    await page.getByRole('button', { name: 'Create' }).click();

    await page.waitForURL(/articles\/\d+\/edit/);
    const articleId = page.url().match(/articles\/(\d+)\/edit/)?.[1];

    // articles.edit
    title = page.locator('input#title');
    titleValue += ' edit ' + Date.now();
    await title.fill(titleValue);
    // await page.screenshot({ path: 'edit.png' });
    await page.getByRole('button', { name: 'Save' }).click();

    // articles.index
    await page.getByRole('link', { name: 'Articles' }).click();
    await page.waitForURL('/articles');

    // search created article
    await page.getByRole('textbox', { name: 'Search Title' }).fill(titleValue);
    await page.getByRole('button', { name: '🔍' }).click();
    await page.waitForSelector(`#row-${articleId}`);
    // await page.screenshot({ path: 'index-search.png' });

    // article.show
    await page.locator(`#id-${articleId}`).click();
    await page.waitForURL(/articles\/\d+/);
    title = page.locator('input#title');
    await expect(title).toHaveValue(titleValue);
    // await page.screenshot({ path: 'show.png' });

    // articles.index
    await page.getByRole('link', { name: 'Articles' }).click();
    await page.waitForURL('/articles');

    // articles.delete
    // 削除ボタンのダイアログの処理
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()} id: ${articleId} OK`);
      dialog.accept(); // OKクリック
    });
    // 削除ボタンClick
    await page.locator(`#delete-${articleId}`).click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`#row-${articleId}`)).toBeHidden();
  });
});
