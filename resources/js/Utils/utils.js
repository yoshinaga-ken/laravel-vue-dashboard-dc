/**
 * Updates the HTML element's class based on the user's preferred color scheme.
 *
 * This function adds the 'dark' class to the HTML element if the user's
 * system is set to a dark color scheme, and removes it otherwise.
 * It also listens for changes in the color scheme preference and updates
 * the class in real-time when the preference changes.
 */
export function updateDarkModeClass() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const htmlElement = document.documentElement;

    if (prefersDarkScheme.matches) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    // カラーモードが変更されたときにリアルタイムでクラスを更新
    prefersDarkScheme.addEventListener('change', (e) => {
        if (e.matches) {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
    });
}
