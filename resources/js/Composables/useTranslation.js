import {usePage} from '@inertiajs/vue3'


/**
 * Translate the given key using translations stored in the page props.
 *
 * This composable function provides a convenient way to translate strings
 * using the keys defined in your language files. You can use the dot notation
 * to access nested keys.
 *
 * @param {string} key
 * @param {object} replacements
 * @return {string}
 */
export function useTranslation() {
    const page = usePage()

    const t = (key, replacements = {}) => {
        // まずドット記法による階層的なキーの解決を試みる
        const keys = key.split('.')
        let value = page.props.translations

        keys.forEach((k) => {
            if (value && typeof value === 'object') {
                value = value[k]
            }
        })

        // 階層的なキーで値が見つからない場合、フラットなキーとして直接翻訳を探す
        if (!value || value === key) {
            value = page.props.translations[key] || key
        }

        // パラメータの置換
        Object.keys(replacements).forEach(key => {
            value = value.replace(`:${key}`, replacements[key])
        })

        return value
    }

    return {
        t
    }
}
