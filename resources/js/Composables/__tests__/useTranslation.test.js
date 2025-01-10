import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {usePage} from '@inertiajs/vue3';
import {useTranslation} from '../useTranslation';

// usePage のモックを作成
vi.mock('@inertiajs/vue3', () => ({
    usePage: vi.fn()
}));

describe('useTranslation', () => {
    const pageProps = {
        translations: {
            Article: '記事',
            "Article created": "記事ID: :id が作成されました。",
            'article.title': '記事タイトル1',
        }
    };

    beforeEach(() => {
        // モックの実装を設定
        usePage.mockImplementation(() => ({
            props: pageProps
        }));
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('translates with dot notation', () => {
        const {t} = useTranslation();
        expect(t('article.title')).toBe('記事タイトル1');
    });

    it('translates with flat key', () => {
        const {t} = useTranslation();
        expect(t('Article')).toBe('記事');
    });

    it('translates with replacements', () => {
        const {t} = useTranslation();
        expect(t('Article created', {id: '1'})).toBe('記事ID: 1 が作成されました。');
    });

    it('ignores invalid replacements', () => {
        const {t} = useTranslation();
        expect(t('Article created', {invalid: 'replacement'})).toBe('記事ID: :id が作成されました。');
    });

    it('returns key if translation is missing', () => {
        const {t} = useTranslation();
        expect(t('missing.key')).toBe('missing.key');
    });
});
