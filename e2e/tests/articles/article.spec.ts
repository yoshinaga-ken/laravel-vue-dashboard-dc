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
    const articlesPage = new ArticlesIndexPage(page);

    // 記事一覧に移動
    await articlesPage.gotoIndex();

    // 記事作成
    const { id: articleId, title: titleValue } = await articlesPage.createArticle({
      title: 'Basic Article Test 🤖' + Date.now(),
      body: 'This is a test article created with ArticlesIndexPage'
    });

    // 検索
    await articlesPage.gotoIndex();
    await articlesPage.searchArticle(titleValue);
    await articlesPage.expectArticleRowToBeVisible(articleId);

    // 記事編集
    const { title: editTitle } = await articlesPage.editArticle({ id: articleId });
    await articlesPage.gotoIndex();
    await articlesPage.searchArticle(editTitle);
    await articlesPage.expectArticleRowToBeVisible(articleId);

    // 記事削除
    await articlesPage.clickDeleteArticle(articleId);
    await articlesPage.expectArticleRowToBeVisible(articleId, false);
  });

  test('article CRUD operation', async ({ page }) => {
    const articlesPage = new ArticlesIndexPage(page);

    // 記事一覧に移動
    await articlesPage.gotoIndex();

    // 記事作成
    const { id: articleId, title: titleValue } = await articlesPage.createArticle({
      title: 'CRUD Article Test 🤖' + Date.now(),
      body: 'This is a test article created using BasePage'
    });

    // 記事一覧に戻る
    await articlesPage.clickNavLink('Articles');

    // 作成した記事を検索
    await articlesPage.searchArticle(titleValue);
    await articlesPage.expectArticleRowToBeVisible(articleId);

    // 記事編集
    const { title: updatedTitle } = await articlesPage.editArticle({
      id: articleId,
      title: `${titleValue} (edited)`
    });

    // 記事一覧に戻る
    await articlesPage.clickNavLink('Articles');

    // 検索して表示されることを確認
    await articlesPage.searchArticle(updatedTitle);
    await articlesPage.expectArticleRowToBeVisible(articleId);

    // 記事削除
    await articlesPage.clickDeleteArticle(articleId);
    await articlesPage.expectArticleRowToBeVisible(articleId, false);
  });
});
